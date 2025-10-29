"use client";

import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "lucide-react";

import { saveDocente, updateDocente } from "@/actions/docentesMethods/docentesMethods";
import { 
  Docente, NivelAcademico, Pais, Profesion, Municipio, Sexo 
} from "@/interfaces";
import { getSexos } from "@/actions/catalogos/sexoMethods";
import { getPaises } from "@/actions/catalogos/paisMethods";
import { getProfesiones } from "@/actions/catalogos/profesionMethods";
import { getMunicipios } from "@/actions/catalogos/municipioMethods";
import { getNivelesAcademicos } from "@/actions/catalogos/academicLevelMethods";

interface DocenteFormProps {
  defaultValues?: Docente | null;
  onSuccess: () => void;
}

export default function DocenteForm({ defaultValues, onSuccess }: DocenteFormProps) {
  const [formValues, setFormValues] = useState({
    nombres: "",
    apellido_paterno: "",
    apellido_materno: "",
    cedula_identidad: "",
    sexo: "",
    nivel_academico: "",
    profession: "",
    cargo_nominal: "",
    cargo_real: "",
    telefono: "",
    pais: "",
    municipio: "",
    direccion_domiciliar: "",
    nombre_contacto_emergencia: "",
    telefono_contacto_emergencia: "",
    unidad_administrativa: "",
    fecha_nacimiento: "",
    fechaContratado: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [sexos, setSexos] = useState<Sexo[]>([]);
  const [nivelesAcademicos, setNivelesAcademicos] = useState<NivelAcademico[]>([]);
  const [profesiones, setProfesiones] = useState<Profesion[]>([]);
  const [paises, setPaises] = useState<Pais[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isEdit = Boolean(defaultValues?.id);

  // Cargar datos de selects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sexosData, paisesData, profesionesData, municipiosData, nivelesData] = await Promise.all([
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
        console.error("Error al cargar datos del formulario:", error);
      }
    };
    fetchData();
  }, []);

  // Rellenar formulario si es edición
  useEffect(() => {
    if (!defaultValues) return;

    setFormValues({
      nombres: defaultValues.nombres || "",
      apellido_paterno: defaultValues.apellido_paterno || "",
      apellido_materno: defaultValues.apellido_materno || "",
      cedula_identidad: defaultValues.cedula_identidad || "",
      sexo: defaultValues.sexo?.id?.toString() || "",
      nivel_academico: defaultValues.nivel_academico?.[0]?.id?.toString() || "",
      profession: defaultValues.profession?.[0]?.id?.toString() || "",
      cargo_nominal: defaultValues.cargo_nominal || "",
      cargo_real: defaultValues.cargo_real || "",
      telefono: defaultValues.telefono || "",
      pais: defaultValues.pais?.id?.toString() || "",
      municipio: defaultValues.municipio?.id?.toString() || "",
      direccion_domiciliar: defaultValues.direccion_domiciliar || "",
      nombre_contacto_emergencia: defaultValues.nombre_contacto_emergencia || "",
      telefono_contacto_emergencia: defaultValues.telefono_contacto_emergencia || "",
      unidad_administrativa: defaultValues.unidad_administrativa || "",
      fecha_nacimiento: defaultValues.fecha_nacimiento ? new Date(defaultValues.fecha_nacimiento).toISOString().split("T")[0] : "",
      fechaContratado: defaultValues.fechaContratado ? new Date(defaultValues.fechaContratado).toISOString().split("T")[0] : "",
    });

    if (defaultValues.foto_docente) {
      setPreview(`${process.env.NEXT_PUBLIC_API_UPLOADS}${defaultValues.foto_docente}`);
    }
  }, [defaultValues]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const data = new FormData();

    // Campos simples
    data.append("nombres", formValues.nombres || "");
    data.append("apellido_paterno", formValues.apellido_paterno || "");
    data.append("apellido_materno", formValues.apellido_materno || "");
    data.append("cedula_identidad", formValues.cedula_identidad || "");
    data.append("cargo_nominal", formValues.cargo_nominal || "");
    data.append("cargo_real", formValues.cargo_real || "");
    data.append("unidad_administrativa", formValues.unidad_administrativa || "");
    data.append("telefono", formValues.telefono || "");
    data.append("telefono_contacto_emergencia", formValues.telefono_contacto_emergencia || "");
    data.append("nombre_contacto_emergencia", formValues.nombre_contacto_emergencia || "");
    data.append("direccion_domiciliar", formValues.direccion_domiciliar || "");
    data.append("fecha_nacimiento", formValues.fecha_nacimiento || "");
    data.append("fechaContratado", formValues.fechaContratado || "");

    // Objetos (solo IDs)
    if (formValues.sexo) data.append("sexo[id]", formValues.sexo);
    if (formValues.pais) data.append("pais[id]", formValues.pais);
    if (formValues.municipio) data.append("municipio[id]", formValues.municipio);

    // Arrays (nivel académico y profesión)
    if (formValues.nivel_academico)
      data.append("nivel_academico[0][id]", formValues.nivel_academico);
    if (formValues.profession)
      data.append("profession[0][id]", formValues.profession);

    // Foto
    if (file) data.append("foto_docente", file);

    // 📋 Log para verificar contenido
    console.log("📦 FormData que se envía al back:");
    for (const [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    // 🧩 Crear o actualizar
    if (isEdit && defaultValues?.id) {
      console.log("✏️ Actualizando docente con ID:", defaultValues.id);
      await updateDocente(defaultValues.id, data);
    } else {
      console.log("🆕 Creando nuevo docente...");
      await saveDocente(data);
    }

    onSuccess?.();
  } catch (error) {
    console.error("❌ Error al guardar docente:", error);
  }
};


  return (
    <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-2">
      <h2 className="text-xl font-semibold text-gray-700">{isEdit ? "Editar Docente" : "Agregar Docente"}</h2>

      <div className="flex flex-col items-center">
        <Avatar
          className="w-22 h-22 border-4 border-green-200 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {preview ? (
            <AvatarImage src={preview} alt="Foto del docente" />
          ) : (
            <AvatarFallback className="text-md font-bold bg-green-100 text-green-700">
              {formValues.nombres && formValues.apellido_paterno
                ? `${formValues.nombres[0]}${formValues.apellido_paterno[0]}`
                : <User className="w-10 h-10" />}
            </AvatarFallback>
          )}
        </Avatar>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Inputs y selects */}
      {[
        { name: "nombres", placeholder: "Nombres" },
        { name: "apellido_paterno", placeholder: "Primer Apellido" },
        { name: "apellido_materno", placeholder: "Segundo Apellido" },
        { name: "cedula_identidad", placeholder: "Cédula de Identidad" },
        { name: "cargo_nominal", placeholder: "Cargo Nominal" },
        { name: "cargo_real", placeholder: "Cargo Real" },
        { name: "unidad_administrativa", placeholder: "Unidad Administrativa" },
        { name: "telefono", placeholder: "Teléfono" },
        { name: "telefono_contacto_emergencia", placeholder: "Teléfono Contacto Emergencia" },
        { name: "nombre_contacto_emergencia", placeholder: "Nombre Contacto Emergencia" },
        { name: "direccion_domiciliar", placeholder: "Dirección Domiciliar" },
      ].map(input => (
        <input
          key={input.name}
          type="text"
          name={input.name}
          placeholder={input.placeholder}
          value={formValues[input.name as keyof typeof formValues]}
          onChange={handleInputChange}
          className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
          required
        />
      ))}

      <input
        type="date"
        name="fecha_nacimiento"
        placeholder="Fecha de Nacimiento"
        value={formValues.fecha_nacimiento}
        onChange={handleInputChange}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        required
      />
      <input
        type="date"
        name="fechaContratado"
        placeholder="Fecha Contratado"
        value={formValues.fechaContratado}
        onChange={handleInputChange}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        required
      />

      <select
        name="sexo"
        value={formValues.sexo}
        onChange={handleInputChange}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
      >
        <option value="">Sexo</option>
        {sexos.map(r => <option key={r.id} value={r.id}>{r.gender}</option>)}
      </select>

      <select
        name="nivel_academico"
        value={formValues.nivel_academico}
        onChange={handleInputChange}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
      >
        <option value="">Nivel Académico</option>
        {nivelesAcademicos.map(r => <option key={r.id} value={r.id}>{r.academicLevel}</option>)}
      </select>

      <select
        name="profession"
        value={formValues.profession}
        onChange={handleInputChange}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
      >
        <option value="">Profesión</option>
        {profesiones.map(r => <option key={r.id} value={r.id}>{r.profession}</option>)}
      </select>

      <select
        name="pais"
        value={formValues.pais}
        onChange={handleInputChange}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
      >
        <option value="">País de origen</option>
        {paises.map(r => <option key={r.id} value={r.id}>{r.pais}</option>)}
      </select>

      <select
        name="municipio"
        value={formValues.municipio}
        onChange={handleInputChange}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
      >
        <option value="">Municipio de origen</option>
        {municipios.map(r => <option key={r.id} value={r.id}>{r.municipio}</option>)}
      </select>

      <div className="flex justify-center">
        <button
          type="submit"
          className="px-20 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 mb-6"
        >
          {isEdit ? "Actualizar" : "Guardar"}
        </button>
      </div>
    </form>
  );
}
