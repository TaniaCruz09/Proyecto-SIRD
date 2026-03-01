"use client";

import { getNivelesAcademicos } from "@/actions/catalogos/academicLevelMethods";
import { getPaises } from "@/actions/catalogos/paisMethods";
import { getMunicipios } from "@/actions/catalogos/municipioMethods";
import { getProfesiones } from "@/actions/catalogos/profesionMethods";
import { getSexos } from "@/actions/catalogos/sexoMethods";
import {
  getDocentes,
} from "@/actions/docentesMethods/docentesMethods";
import {
  Docente,
  Municipio,
  NivelAcademico,
  Pais,
  Profesion,
  Sexo,
} from "@/interfaces";
import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "lucide-react";
import { feching } from "@/utils/cliente-http";
import { useToast } from "@/hooks/use-toast";

interface DocenteFormProps {
  defaultValues?: Docente | null;
  onSuccess: () => void;
}

export default function DocenteForm({
  defaultValues,
  onSuccess,
}: DocenteFormProps) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement | null>(null)
  const cedulaRef = useRef<HTMLInputElement | null>(null)
  const telefonoRef = useRef<HTMLInputElement | null>(null)
  const telefonoEmergenciaRef = useRef<HTMLInputElement | null>(null)

  const [formValues, setFormValues] = useState({
    nombres: "",
    apellido_paterno: "",
    apellido_materno: "",
    cedulaIdentidad: "",
    sexo: "",
    nivelAcademico: "",
    telefono: "",
    correo: "",
    fechaNacimiento: "",
    pais: "",
    municipio: "",
    fechaContratado: "",
    direccionDomiciliar: "",
    profesiones: "",
    telefonoContactoEmergencia: "",
    nombreContactoEmergencia: ""
  });

  const [sexos, setSexos] = useState<Sexo[]>([]);
  const [nivelesAcademicos, setNivelesAcademicos] = useState<NivelAcademico[]>([]);
  const [profesiones, setProfesiones] = useState<Profesion[]>([]);
  const [paises, setPaises] = useState<Pais[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const isEdit = Boolean(defaultValues?.id)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          sexosData,
          paisesData,
          profesionesData,
          municipiosData,
          nivelesData,
        ] = await Promise.all([
          getSexos(),
          getPaises(),
          getProfesiones(),
          getMunicipios(),
          getNivelesAcademicos(),
        ]);

        setSexos(sexosData);
        setPaises(paisesData);
        setProfesiones(profesionesData);
        setMunicipios(municipiosData);
        setNivelesAcademicos(nivelesData);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };
    fetchData();
  }, []);


  //Inicializar valores si estamos editando
  useEffect(() => {
    if (defaultValues) {
      setFormValues({
        nombres: defaultValues.nombres ?? "",
        apellido_paterno: defaultValues.apellido_paterno ?? "",
        apellido_materno: defaultValues.apellido_materno ?? "",
        cedulaIdentidad: defaultValues.cedula_identidad ?? "",
        sexo: defaultValues.sexo?.id?.toString() || "",
        nivelAcademico: defaultValues.nivel_academico?.[0]?.id?.toString() || "",
        telefono: defaultValues.telefono ?? "",
        correo: defaultValues.correo ?? "",
        fechaNacimiento: defaultValues.fecha_nacimiento
          ? new Date(defaultValues.fecha_nacimiento).toISOString().split("T")[0]
          : "",
        pais: defaultValues.pais?.id?.toString() || "",
        municipio: defaultValues.municipio?.id?.toString() || "",
        fechaContratado: defaultValues.fechaContratado ? new Date(defaultValues.fechaContratado).toISOString().split("T")[0]
          : "",
        direccionDomiciliar: defaultValues.direccion_domiciliar ?? "",
        profesiones: defaultValues.profession?.[0]?.id?.toString() || "",
        telefonoContactoEmergencia: defaultValues.telefono_contacto_emergencia ?? "",
        nombreContactoEmergencia: defaultValues.nombre_contacto_emergencia ?? "",
      });

      if (defaultValues.foto_docente) {
        const path = defaultValues.foto_docente
        setPreview(`${process.env.NEXT_PUBLIC_API_UPLOADS}${path}`);
      }
    }
  }, [defaultValues]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    // teléfonos: solo dígitos y máximo 8
    if (name === "telefono" || name === "telefono") {
      newValue = value.replace(/\D/g, "").slice(0, 8);
    }

    // telefonoContactoEmergencia: solo dígitos y máximo 8
    if (name === "telefonoContactoEmergencia" || name === "telefonoContactoEmergencia") {
      newValue = value.replace(/\D/g, "").slice(0, 8);
    }

    // Limitar largo de cédulas
    if (name === "cedula_identidad" || name === "cedula_identidad") {
      newValue = value.slice(0, 16);
    }

    // Limpiar mensajes de validacion nativa al escribir
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) {
      e.target.setCustomValidity("");
    }

    setFormValues(prev => ({ ...prev, [name]: newValue }));

  }

  const setInputValidity = (input: HTMLInputElement | null, message: string) => {
    if (!input) return;
    input.setCustomValidity(message);
    if (message) {
      input.focus();
      input.reportValidity();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const validateCedulaLength = (input: HTMLInputElement | null, value: string) => {
    const len = value.trim().length;
    if (len < 14 || len > 16) {
      setInputValidity(input, "La cedula debe tener entre 14 y 16 caracteres");
      return false;
    }
    setInputValidity(input, "");
    return true;
  };

  const validateTelefono = (input: HTMLInputElement | null, value: string) => {
    if (value.trim().length !== 8) {
      setInputValidity(input, "El telefono debe tener 8 digitos");
      return false;
    }
    setInputValidity(input, "");
    return true;
  };

  const checkCedulaUnique = async (value: string, input?: HTMLInputElement | null) => {
    if (!value) {
      setInputValidity(input ?? null, "Completa este campo");
      return false;
    }
    try {
      const docentes = await getDocentes();
      const found = docentes.find((d: any) => d.cedula_identidad === value);
      if (found && found.id !== defaultValues?.id) {
        setInputValidity(input ?? null, "La cedula ya pertenece a otro registro");
        return false;
      }
      setInputValidity(input ?? null, "");
      return true;
    } catch (error) {
      console.error("Error verificando cedula:", error);
      return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (formRef.current && !formRef.current.reportValidity()) {
        return;
      }
      const cedulaOk = validateCedulaLength(cedulaRef.current, formValues.cedulaIdentidad)
      const telefonoOk = validateTelefono(telefonoRef.current, formValues.telefono)
      const cedulaUnique = await checkCedulaUnique(formValues.cedulaIdentidad, cedulaRef.current)
      const telEmergenciaOk = validateTelefono(telefonoEmergenciaRef.current, formValues.telefonoContactoEmergencia)
      if (!cedulaOk || !telefonoOk || !cedulaUnique) {
        return;
      }
      if (!telEmergenciaOk) {
        return;
      }
      // --- Obtener objetos completos ---
      const selectedSexo = sexos.find((s) => s.id === parseInt(formValues.sexo));
      const selectedPais = paises.find((p) => p.id === parseInt(formValues.pais));
      const selectedMunicipio = municipios.find((m) => m.id === parseInt(formValues.municipio));
      const selectedNivelAcademico = nivelesAcademicos.find(
        (n) => n.id === parseInt(formValues.nivelAcademico)
      );

      const selectedProfesion = profesiones.find(
        (p) => p.id === parseInt(formValues.profesiones)
      );
      if (
        !selectedSexo ||
        !selectedPais ||
        !selectedMunicipio ||
        !selectedNivelAcademico ||
        !selectedProfesion
      ) {
        console.error("Faltan campos obligatorios");
        alert("Por favor complete todos los campos requeridos");
        return;
      }


      // --- Crear FormData ---
      const formData = new FormData();
      formData.append("nombres", formValues.nombres);
      formData.append("apellido_paterno", formValues.apellido_paterno);
      formData.append("apellido_materno", formValues.apellido_materno);
      formData.append("cedula_identidad", formValues.cedulaIdentidad);
      formData.append("telefono", formValues.telefono);
      formData.append("correo", formValues.correo);
      if (formValues.fechaNacimiento) formData.append("fecha_nacimiento", formValues.fechaNacimiento);
      if (formValues.fechaContratado) formData.append("fechaContratado", formValues.fechaContratado);
      formData.append("direccion_domiciliar", formValues.direccionDomiciliar);
      formData.append("nombre_contacto_emergencia", formValues.nombreContactoEmergencia);
      formData.append(
        "telefono_contacto_emergencia",
        formValues.telefonoContactoEmergencia
      );

      // --- Arrays convertidos a JSON ---
      formData.append("nivel_academico", JSON.stringify([selectedNivelAcademico]));
      formData.append("profession", JSON.stringify([selectedProfesion]));

      // Objetos simples
      formData.append("sexo", JSON.stringify(selectedSexo));
      formData.append("pais", JSON.stringify(selectedPais));
      formData.append("municipio", JSON.stringify(selectedMunicipio));

      // Foto (si hay) 
      if (file) formData.append("foto_docente", file);

      let response;

      // --- Crear o actualizar docente ---
      if (isEdit && defaultValues?.id) {
        response = await feching(
          `/docentes/${defaultValues.id}`,
          "no-cache",
          "PUT",
          formData
        );
      } else {
        response = await feching(`/docentes`, "no-cache", "POST", formData);
      }

      const savedDocente = response.data;

      // Actualizar preview si se guardó foto
      if (savedDocente.foto_docente) {
        setPreview(
          `${process.env.NEXT_PUBLIC_API_UPLOADS}${savedDocente.foto_docente}`
        );
      }

      console.log("Docente guardado:", savedDocente);

      if (isEdit && defaultValues?.id) {
        toast({
          title: "Registro actualizado",
          description: "El docente se actualizo correctamente.",
          variant: "success",
        });
      }

      onSuccess();
    } catch (error) {
      console.error("Error al guardar docente:", error);
      alert("Ocurrió un error al guardar el docente.");
    }
  };


  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 overflow-y-auto px-4">
      <h2 className="text-2xl font-semibold text-center text-indigo-700 border-b pb-2">
        {isEdit ? "✏️ Editar Docente" : "👤 Agregar Docente"}
      </h2>

      {/* 🪪 Datos personales */}
      <section>
        <h3 className="text-lg font-semibold text-indigo-600 mb-3 border-l-4 border-indigo-400 pl-2">
          🪪 Datos personales
        </h3>
        <div className="flex justify-center pt-4">
          <div className="flex flex-col items-center">
            <Avatar className="w-22 h-22 border-4 border-green-200 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {preview ? (
                <AvatarImage
                  src={preview}
                  alt="Foto del Docente"
                />
              ) : (
                <AvatarFallback className="text-md font-bold bg-green-100 text-green-700">
                  {formValues.nombres && formValues.apellido_paterno
                    ? `${formValues.nombres[0] ?? ""}${formValues.apellido_paterno ?? ""}`
                    : <User className="w-10 h-10" />
                  }
                </AvatarFallback>
              )}
            </Avatar>
          </div>

          {/* Input oculto */}
          <input
            type="file"
            accept="image/*"
            name="foto_docente"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Nombres</label>
            <input
              type="text"
              name="nombres"
              placeholder="Ej: Juan Carlos"
              value={formValues.nombres}
              onChange={handleInputChange}
              className="input-style"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Primer Apellido</label>
            <input
              type="text"
              name="apellido_paterno"
              placeholder="Apellido1"
              value={formValues.apellido_paterno}
              onChange={handleInputChange}
              className="input-style"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Segundo Apellido</label>
            <input
              type="text"
              name="apellido_materno"
              placeholder="Apellido2"
              value={formValues.apellido_materno}
              onChange={handleInputChange}
              className="input-style"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Cédula de identidad</label>
            <input
              type="text"
              name="cedulaIdentidad"
              placeholder="Cédula de Identidad"
              value={formValues.cedulaIdentidad}
              onChange={handleInputChange}
              onBlur={async (e) => {
                const value = e.currentTarget.value;
                validateCedulaLength(e.currentTarget, value);
                await checkCedulaUnique(value, e.currentTarget);
              }}
              ref={cedulaRef}
              className="input-style"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Sexo</label>
            <select
              name="sexo"
              value={formValues.sexo}
              onChange={handleInputChange}
              className="input-style"
              required
            >
              <option value="">Seleccionar sexo</option>
              {sexos.map((r) => (
                <option key={r.id} value={r.id}>{r.gender}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Nivel académico</label>
            <select
              name="nivelAcademico"
              value={formValues.nivelAcademico}
              onChange={handleInputChange}
              className="input-style"
              required
            >
              <option value="">Seleccionar nivel</option>
              {nivelesAcademicos.map((r) => (
                <option key={r.id} value={r.id}>{r.academicLevel}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Profesión</label>
            <select
              name="profesiones"
              value={formValues.profesiones}
              onChange={handleInputChange}
              className="input-style"
              required
            >
              <option value="">Seleccionar profesión</option>
              {profesiones.map((r) => (
                <option key={r.id} value={r.id}>{r.profession}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Fecha de nacimiento</label>
            <input
              name="fechaNacimiento"
              type="date"
              value={formValues.fechaNacimiento}
              onChange={handleInputChange}
              className="input-style"
              required
            />
          </div>
        </div>
      </section>

      {/* 📍 Dirección y contacto */}
      <section>
        <h3 className="text-lg font-semibold text-indigo-600 mb-3 border-l-4 border-indigo-400 pl-2">
          📍 Dirección y contacto
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">País de origen</label>
            <select
              name="pais"
              value={formValues.pais}
              onChange={handleInputChange}
              className="input-style"
              required
            >
              <option value="">Seleccionar país</option>
              {paises.map((r) => (
                <option key={r.id} value={r.id}>{r.pais}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Municipio</label>
            <select
              name="municipio"
              value={formValues.municipio}
              onChange={handleInputChange}
              className="input-style"
              required
            >
              <option value="">Seleccionar municipio</option>
              {municipios.map((r) => (
                <option key={r.id} value={r.id}>{r.municipio}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Dirección domiciliar</label>
            <input
              name="direccionDomiciliar"
              type="text"
              placeholder="Dirección domiciliar"
              value={formValues.direccionDomiciliar}
              onChange={handleInputChange}
              className="input-style"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Teléfono</label>
            <input
              name="telefono"
              type="text"
              placeholder="Teléfono"
              value={formValues.telefono}
              onChange={handleInputChange}
              onBlur={(e) => validateTelefono(e.currentTarget, e.currentTarget.value)}
              ref={telefonoRef}
              className="input-style"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Correo</label>
            <input
              type="text"
              name="correo"
              placeholder="Correo"
              value={formValues.correo}
              onChange={handleInputChange}
              className="input-style"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Fecha de contratación</label>
            <input
              type="date"
              name="fechaContratado"
              value={formValues.fechaContratado}
              onChange={handleInputChange}
              className="input-style"
              required
            />
          </div>
        </div>
      </section>

      {/* ☎️ Emergencia */}
      <section>
        <h3 className="text-lg font-semibold text-indigo-600 mb-3 border-l-4 border-indigo-400 pl-2">
          ☎️ Contacto de emergencia
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Nombre del contacto</label>
            <input
              type="text"
              name="nombreContactoEmergencia"
              placeholder="Nombre del contacto"
              value={formValues.nombreContactoEmergencia}
              onChange={handleInputChange}
              className="input-style"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Número de contacto</label>
            <input
              type="text"
              name="telefonoContactoEmergencia"
              placeholder="Teléfono del contacto"
              value={formValues.telefonoContactoEmergencia}
              onChange={handleInputChange}
              onBlur={(e) => validateTelefono(e.currentTarget, e.currentTarget.value)}
              ref={telefonoEmergenciaRef}
              className="input-style"
              required
            />
          </div>
        </div>
      </section>


      <div className="flex justify-center">
        <button
          type="submit"
          className="px-20 py-3 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 shadow-md transition"
        >
          {isEdit ? "Actualizar" : "Guardar"}
        </button>
      </div>
    </form>

  )
}