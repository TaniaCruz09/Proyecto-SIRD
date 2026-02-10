"use client";

import { getNivelesAcademicos } from "@/actions/catalogos/academicLevelMethods";
import { getPaises } from "@/actions/catalogos/paisMethods";
import { getMunicipios } from "@/actions/catalogos/municipioMethods";
import { getProfesiones } from "@/actions/catalogos/profesionMethods";
import { getSexos } from "@/actions/catalogos/sexoMethods";
import {
  saveDocente,
  updateDocente,
  uploadDocenteImage,
} from "@/actions/docentesMethods/docentesMethods";
import {
  Docente,
  DocentePayload,
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

interface DocenteFormProps {
  defaultValues?: Docente | null;
  onSuccess: () => void;
}
export default function DocenteForm({
  defaultValues,
  onSuccess,
}: DocenteFormProps) {
  const [formValues, setFormValues] = useState({ name: "", lastName: "" })
  const [nombres, setNombres] = useState<string>("");
  const [apellidos, setApellidos] = useState(""); // 🔹 Un solo campo
  const [cedulaIdentidad, setCedulaIdentidad] = useState<string>("");
  const [sexo, setSexo] = useState<string>("");
  const [nivelAcademico, setNivelAcademico] = useState<string>("");

  const [telefono, setTelefono] = useState<string>("");
  const [fechaNacimiento, setFechaNacimiento] = useState<string>("");
  const [pais, setPais] = useState<string>("");
  const [municipio, setMunicipio] = useState<string>("");
  const [fechaContratado, setFechaContratado] = useState<string>("");
  const [direccionDomiciliar, setDireccionDomiciliar] = useState<string>("");
  const [profession, setProfession] = useState("");

  const [telefonoContactoEmergencia, setTelefonoContactoEmergencia] =
    useState<string>("");
  const [nombreContactoEmergencia, setNombreContactoEmergencia] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null) // aca
  const isEdit = Boolean(defaultValues?.id)  // aca

  const [sexos, setSexos] = useState<Sexo[]>([]);
  const [nivelesAcademicos, setNivelesAcademicos] = useState<NivelAcademico[]>([]);
  const [profesiones, setProfesiones] = useState<Profesion[]>([]);
  const [paises, setPaises] = useState<Pais[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);

  // const isEdit = Boolean(defaultValues?.id);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };


  // 🔹 Prellenado en modo edición
  useEffect(() => {
    if (defaultValues) {
      setNombres(defaultValues.nombres || "");
      setApellidos(
        `${defaultValues.apellido_paterno || ""} ${defaultValues.apellido_materno || ""}`.trim()
      );
      setCedulaIdentidad(defaultValues.cedula_identidad || "");
      setSexo(defaultValues.sexo?.id?.toString() || "");
      setNivelAcademico(defaultValues.nivel_academico?.[0]?.id?.toString() || "");
      setProfession(defaultValues.profession?.[0]?.id?.toString() || "");
      setTelefono(defaultValues.telefono || "");
      setPais(defaultValues.pais?.id?.toString() || "");
      setMunicipio(defaultValues.municipio?.id?.toString() || "");
      setDireccionDomiciliar(defaultValues.direccion_domiciliar || "");
      setNombreContactoEmergencia(defaultValues.nombre_contacto_emergencia || "");
      setTelefonoContactoEmergencia(defaultValues.telefono_contacto_emergencia || "");
      setFechaNacimiento(
        defaultValues.fecha_nacimiento
          ? new Date(defaultValues.fecha_nacimiento).toISOString().split("T")[0]
          : ""
      );
      setFechaContratado(
        defaultValues.fechaContratado
          ? new Date(defaultValues.fechaContratado).toISOString().split("T")[0]
          : ""
      );

      if (defaultValues.foto_docente) {
        setPreview(`${process.env.NEXT_PUBLIC_API_UPLOADS}${defaultValues.foto_docente}`);
      }
    }
  }, [defaultValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // --- Obtener objetos completos ---
      const selectedSexo = sexos.find((s) => s.id === parseInt(sexo));
      const selectedPais = paises.find((p) => p.id === parseInt(pais));
      const selectedMunicipio = municipios.find((m) => m.id === parseInt(municipio));
      const selectedNivelAcademico = nivelesAcademicos.find((n) => n.id === parseInt(nivelAcademico));
      const selectedProfesion = profesiones.find((p) => p.id === parseInt(profession));
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

      // --- Dividir apellidos ---
      const [apellido_paterno = "", apellido_materno = ""] = apellidos
        .trim()
        .split(" ", 2);

      // --- Crear FormData ---
      const formData = new FormData();
      formData.append("nombres", nombres);
      formData.append("apellido_paterno", apellido_paterno);
      formData.append("apellido_materno", apellido_materno);
      formData.append("cedula_identidad", cedulaIdentidad);
      formData.append("telefono", telefono);
      if (fechaNacimiento) formData.append("fecha_nacimiento", fechaNacimiento);
      if (fechaContratado) formData.append("fechaContratado", fechaContratado);
      formData.append("direccion_domiciliar", direccionDomiciliar);
      formData.append("nombre_contacto_emergencia", nombreContactoEmergencia);
      formData.append(
        "telefono_contacto_emergencia",
        telefonoContactoEmergencia
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
          `${process.env.NEXT_PUBLIC_API_UPLOADS}/${savedDocente.foto_docente}`
        );
      }

      console.log("Docente guardado:", savedDocente);

      onSuccess();
    } catch (error) {
      console.error("Error al guardar docente:", error);
      alert("Ocurrió un error al guardar el docente.");
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto px-4">
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
                  {formValues.name && formValues.lastName
                    ? `${formValues.name[0] ?? ""}${formValues.lastName[0] ?? ""}`
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
              placeholder="Nombres"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              className="input-style"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Apellidos</label>
            <input
              type="text"
              placeholder="Apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              className="input-style"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Cédula de identidad</label>
            <input
              type="text"
              placeholder="Cédula de Identidad"
              value={cedulaIdentidad}
              onChange={(e) => setCedulaIdentidad(e.target.value)}
              className="input-style"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Sexo</label>
            <select
              value={sexo}
              onChange={(e) => setSexo(e.target.value)}
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
              value={nivelAcademico}
              onChange={(e) => setNivelAcademico(e.target.value)}
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
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
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
              type="date"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
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
              value={pais}
              onChange={(e) => setPais(e.target.value)}
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
              value={municipio}
              onChange={(e) => setMunicipio(e.target.value)}
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
              type="text"
              placeholder="Dirección domiciliar"
              value={direccionDomiciliar}
              onChange={(e) => setDireccionDomiciliar(e.target.value)}
              className="input-style"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Teléfono</label>
            <input
              type="text"
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="input-style"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Fecha de contratación</label>
            <input
              type="date"
              value={fechaContratado}
              onChange={(e) => setFechaContratado(e.target.value)}
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
              placeholder="Nombre del contacto"
              value={nombreContactoEmergencia}
              onChange={(e) => setNombreContactoEmergencia(e.target.value)}
              className="input-style"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Número de contacto</label>
            <input
              type="text"
              placeholder="Teléfono del contacto"
              value={telefonoContactoEmergencia}
              onChange={(e) => setTelefonoContactoEmergencia(e.target.value)}
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