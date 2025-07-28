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

export default function DocenteForm({
  defaultValues,
  onSuccess,
}: DocenteFormProps) {
  const [nombres, setNombres] = useState<string>("");
  const [apellido1, setApellido1] = useState<string>("");
  const [apellido2, setApellido2] = useState<string>("");
  const [cedulaIdentidad, setCedulaIdentidad] = useState<string>("");
  const [sexo, setSexo] = useState<string>("");
  const [nivelAcademico, setNivelAcademico] = useState<string>("");
  const [profession, SetProfession] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");
  const [fechaNacimiento, setFechaNacimiento] = useState<string>("");
  const [pais, setPais] = useState<string>("");
  const [municipio, setMunicipio] = useState<string>("");
  const [fechaContratado, setFechaContratado] = useState<string>("");
  const [direccionDomiciliar, setDireccionDomiciliar] = useState<string>("");
  const [nmobreContactoemergencia, setNombreContactoEmergencia] =
    useState<string>("");
  const [telefonoContactoEmergencia, setTelefonoContactoEmergencia] =
    useState<string>("");

  const [sexos, setSexos] = useState<Sexo[]>([]);
  const [nivelesAcademicos, setNivelesAcademicos] = useState<NivelAcademico[]>(
    []
  );
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
        console.error("Error al cargar los datos del formulario:", error);
      }
    };

    fetchData();
  }, []);

  //funcion con la que enviamos los datos para agregar un nuevo usuario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Buscar los objetos completos desde los estados
      const selectedSexo = sexos.find((s) => s.id === parseInt(sexo));
      const selectedPais = paises.find((p) => p.id === parseInt(pais));
      const selectedMunicipio = municipios.find(
        (m) => m.id === parseInt(municipio)
      );
      const selectedNivelAcademico = nivelesAcademicos.find(
        (n) => n.id === parseInt(nivelAcademico)
      );
      const selectedProfesion = profesiones.find(
        (p) => p.id === parseInt(profession)
      );

      if (
        !selectedSexo ||
        !selectedPais ||
        !selectedMunicipio ||
        !selectedNivelAcademico ||
        !selectedProfesion
      ) {
        console.error("Faltan campos requeridos");
        return;
      }

      const docenteData: DocentePayload = {
        nombres,
        apellido_paterno: apellido1,
        apellido_materno: apellido2,
        cedula_identidad: cedulaIdentidad,
        telefono: telefono,
        fecha_nacimiento: new Date (fechaNacimiento),
        direccion_domiciliar: direccionDomiciliar,
        fechaContratado:new Date (fechaContratado) ,
        nombre_contacto_emergencia: nmobreContactoemergencia,
        telefono_contacto_emergencia: telefonoContactoEmergencia,

        sexo: selectedSexo,
        pais: selectedPais,
        municipio: selectedMunicipio,
        nivel_academico: [selectedNivelAcademico],
        profession: [selectedProfesion],

        // Opcionales:
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

      onSuccess(); // cerrar modal o refrescar datos
    } catch (error) {
      console.error("Error al guardar o actualizar docente:", error);
    }
  };

  //rellena los inputs y select si esta en modo edicion
  useEffect(() => {
  if (defaultValues) {
    setNombres(defaultValues.nombres || "");
    setApellido1(defaultValues.apellido_paterno || "");
    setApellido2(defaultValues.apellido_materno || "");
    setCedulaIdentidad(defaultValues.cedula_identidad || "");
    setSexo(defaultValues.sexo?.id?.toString() || "");
    setNivelAcademico(defaultValues.nivel_academico?.[0]?.id?.toString() || "");
    SetProfession(defaultValues.profession?.[0]?.id?.toString() || "");
    setTelefono(defaultValues.telefono || "");
    setFechaNacimiento(defaultValues.fecha_nacimiento ? new Date(defaultValues.fecha_nacimiento).toISOString().split("T")[0] : "");
    setPais(defaultValues.pais?.id?.toString() || "");
    setMunicipio(defaultValues.municipio?.id?.toString() || "");
    setFechaContratado(defaultValues.fechaContratado ? new Date(defaultValues.fechaContratado).toISOString().split("T")[0] : "");
    setDireccionDomiciliar(defaultValues.direccion_domiciliar || "");
    setNombreContactoEmergencia(defaultValues.nombre_contacto_emergencia || "");
    setTelefonoContactoEmergencia(defaultValues.telefono_contacto_emergencia || "");
  }
}, [defaultValues]);


  return (
    <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-2">
      <h2 className="text-xl font-semibold text-gray-700">
        {isEdit ? "Editar Docente" : "Agregar Docente"}
      </h2>

      <input
        type="text"
        placeholder="Nombres"
        value={nombres}
        onChange={(e) => setNombres(e.target.value)}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        required
      />
      <input
        type="text"
        placeholder="Primer Apellido"
        value={apellido1}
        onChange={(e) => setApellido1(e.target.value)}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        required
      />
      <input
        type="text"
        placeholder="Segundo Apellido"
        value={apellido2}
        onChange={(e) => setApellido2(e.target.value)}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        required
      />
      <input
        type="text"
        placeholder="Cedula Identidad"
        value={cedulaIdentidad}
        onChange={(e) => setCedulaIdentidad(e.target.value)}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        required
      />
      <select
        name=""
        id=""
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        value={sexo}
        onChange={(e) => setSexo(e.target.value)}
      >
        <option value="">Sexo</option>
        {sexos?.map((r) => (
          <option key={r.id} value={r.id}>
            {r.gender}
          </option>
        ))}
      </select>
      <select
        name=""
        id=""
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        value={nivelAcademico}
        onChange={(e) => setNivelAcademico(e.target.value)}
      >
        <option value="">Nivel Academico</option>
        {nivelesAcademicos?.map((r) => (
          <option key={r.id} value={r.id}>
            {r.academicLevel}
          </option>
        ))}
      </select>
      <select
        name=""
        id=""
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        value={profession}
        onChange={(e) => SetProfession(e.target.value)}
      >
        <option value="">Profecion</option>
        {profesiones?.map((r) => (
          <option key={r.id} value={r.id}>
            {r.profession}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Telefono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        required
      />
      <input
        type="date"
        placeholder="Fecha de Nacimiento"
        value={fechaNacimiento}
        onChange={(e) => setFechaNacimiento(e.target.value)}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        required
      />
      <select
        name=""
        id=""
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        value={pais}
        onChange={(e) => setPais(e.target.value)}
      >
        <option value="">Pais de origen</option>
        {paises?.map((r) => (
          <option key={r.id} value={r.id}>
            {r.pais}
          </option>
        ))}
      </select>
      <select
        name=""
        id=""
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        value={municipio}
        onChange={(e) => setMunicipio(e.target.value)}
      >
        <option value="">Municipio de origen</option>
        {municipios?.map((r) => (
          <option key={r.id} value={r.id}>
            {r.municipio}
          </option>
        ))}
      </select>
      <input
        type="date"
        placeholder="Fecha contratado"
        value={fechaContratado}
        onChange={(e) => setFechaContratado(e.target.value)}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        required
      />
      <input
        type="text"
        placeholder="Direccion domiciliar"
        value={direccionDomiciliar}
        onChange={(e) => setDireccionDomiciliar(e.target.value)}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        required
      />
      <input
        type="text"
        placeholder="Nombre contacto de emergencia"
        value={nmobreContactoemergencia}
        onChange={(e) => setNombreContactoEmergencia(e.target.value)}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        required
      />
      <input
        type="text"
        placeholder="Telefono contacto de emergencia"
        value={telefonoContactoEmergencia}
        onChange={(e) => setTelefonoContactoEmergencia(e.target.value)}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        required
      />
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