"use client";

import { getNivelesAcademicos } from "@/actions/catalogos/academicLevelMethods";
import { getPaises } from "@/actions/catalogos/paisMethods";
import { getMunicipios } from "@/actions/catalogos/municipioMethods";
import { getProfesiones } from "@/actions/catalogos/profesionMethods";
import { getSexos } from "@/actions/catalogos/sexoMethods";
import {
  saveDocente,
  updateDocente,
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
import React, { useEffect, useState } from "react";

interface DocenteFormProps {
  defaultValues?: Docente | null;
  onSuccess: () => void;
}

export default function DocenteForm({ defaultValues, onSuccess }: DocenteFormProps) {
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState(""); // 🔹 Un solo campo
  const [cedulaIdentidad, setCedulaIdentidad] = useState("");
  const [sexo, setSexo] = useState("");
  const [nivelAcademico, setNivelAcademico] = useState("");
  const [profession, setProfession] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [pais, setPais] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [fechaContratado, setFechaContratado] = useState("");
  const [direccionDomiciliar, setDireccionDomiciliar] = useState("");
  const [nombreContactoEmergencia, setNombreContactoEmergencia] = useState("");
  const [telefonoContactoEmergencia, setTelefonoContactoEmergencia] = useState("");

  const [sexos, setSexos] = useState<Sexo[]>([]);
  const [nivelesAcademicos, setNivelesAcademicos] = useState<NivelAcademico[]>([]);
  const [profesiones, setProfesiones] = useState<Profesion[]>([]);
  const [paises, setPaises] = useState<Pais[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);

  const isEdit = Boolean(defaultValues?.id);

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

  // 🔹 Manejo de submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Divide apellidos en dos partes (si hay una sola palabra, el segundo se deja vacío)
      const [apellido_paterno = "", apellido_materno = ""] = apellidos.trim().split(" ", 2);

      const selectedSexo = sexos.find((s) => s.id === parseInt(sexo));
      const selectedPais = paises.find((p) => p.id === parseInt(pais));
      const selectedMunicipio = municipios.find((m) => m.id === parseInt(municipio));
      const selectedNivelAcademico = nivelesAcademicos.find(
        (n) => n.id === parseInt(nivelAcademico)
      );
      const selectedProfesion = profesiones.find((p) => p.id === parseInt(profession));

      if (!selectedSexo || !selectedPais || !selectedMunicipio || !selectedNivelAcademico || !selectedProfesion) {
        console.error("Faltan campos requeridos");
        return;
      }

      const docenteData: DocentePayload = {
        nombres,
        apellido_paterno,
        apellido_materno,
        cedula_identidad: cedulaIdentidad,
        telefono,
        fecha_nacimiento: fechaNacimiento ? new Date(fechaNacimiento) : undefined,
        direccion_domiciliar: direccionDomiciliar,
        fechaContratado: fechaContratado ? new Date(fechaContratado) : undefined,
        nombre_contacto_emergencia: nombreContactoEmergencia,
        telefono_contacto_emergencia: telefonoContactoEmergencia,

        sexo: selectedSexo,
        pais: selectedPais,
        municipio: selectedMunicipio,
        nivel_academico: [selectedNivelAcademico],
        profession: [selectedProfesion],

        user_create_id: null,
        created_at: undefined,
        update_at: undefined,
        user_update_id: null,
        deleted_at: null,
        deleted_at_id: null,
      };

      if (isEdit && defaultValues?.id) {
        await updateDocente(defaultValues.id, docenteData);
      } else {
        await saveDocente(docenteData);
      }

      onSuccess();
    } catch (error) {
      console.error("Error al guardar o actualizar docente:", error);
    }
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
    }
  }, [defaultValues]);

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

      <div className="flex justify-center pt-4">
        <button
          type="submit"
          className="px-20 py-3 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 shadow-md transition"
        >
          {isEdit ? "Actualizar" : "Guardar"}
        </button>
      </div>
    </form>

  );
}

/* 🔹 Agrega esta clase global en tu CSS o Tailwind */
