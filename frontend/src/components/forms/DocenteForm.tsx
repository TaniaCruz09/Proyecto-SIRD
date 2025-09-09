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
import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "lucide-react";

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
    const [cargo_nominal, setCargoNominal] = useState<string>("");
    const [cargo_real, setCargoReal] = useState <string> ("")
    const [unidad_administrativa, setUnidadAdministrativa] = useState<string>("")
    const [file, setFile] = useState<File | null>(null)
    
  const [sexos, setSexos] = useState<Sexo[]>([]);
  const [nivelesAcademicos, setNivelesAcademicos] = useState<NivelAcademico[]>(
    []
  );
  const [profesiones, setProfesiones] = useState<Profesion[]>([]);
  const [paises, setPaises] = useState<Pais[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);

  const isEdit = Boolean(defaultValues?.id);

   const fileInputRef = useRef<HTMLInputElement | null>(null)

   const [preview, setPreview] = useState<string | null>(null)

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

    if (defaultValues?.foto_docente) {
      setPreview(defaultValues.foto_docente)
    }
  }, [defaultValues]);

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
        telefono,
        fecha_nacimiento: fechaNacimiento ? new Date(fechaNacimiento) : undefined,
        direccion_domiciliar: direccionDomiciliar,
        fechaContratado: fechaContratado ? new Date(fechaContratado) : undefined,
        nombre_contacto_emergencia: nmobreContactoemergencia,
        telefono_contacto_emergencia: telefonoContactoEmergencia,
        unidad_administrativa: unidad_administrativa,
        cargo_nominal: cargo_nominal,
        cargo_real: cargo_real,


        sexo: selectedSexo,
        pais: selectedPais,
        municipio: selectedMunicipio,
        nivel_academico: [selectedNivelAcademico],
        profession: [selectedProfesion],

    //     formData.append("nombres", nombres);
    // formData.append("apellido_paterno", apellido1);
    // formData.append("apellido_materno", apellido2);
    // formData.append("cedula_identidad", cedulaIdentidad);
    // formData.append("telefono", telefono);
    // formData.append("fecha_nacimiento", fechaNacimiento);
    // formData.append("direccion_domiciliar", direccionDomiciliar);
    // formData.append("fechaContratado", fechaContratado);
    // formData.append("nombre_contacto_emergencia", nmobreContactoemergencia);
    // formData.append("telefono_contacto_emergencia", telefonoContactoEmergencia);
    // formData.append("unidad_administrativa", unidad_administrativa);
    // formData.append("cargo_nominal", cargo_nominal);
    // formData.append("cargo_real", cargo_real);

    // formData.append("sexoId", sexo);
    // formData.append("paisId", pais);
    // formData.append("municipioId", municipio);
    // formData.append("nivelAcademicoId", nivelAcademico);
    // formData.append("profesionId", profession);
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
<<<<<<< HEAD
  if (defaultValues) {
    setNombres(defaultValues.nombres || "");
    setApellido1(defaultValues.apellido_paterno || "");
    setApellido2(defaultValues.apellido_materno || "");
    setCedulaIdentidad(defaultValues.cedula_identidad || "");
    setSexo(defaultValues.sexo?.id?.toString() || "");
    setNivelAcademico(defaultValues.nivel_academico?.[0]?.id?.toString() || "");
    SetProfession(defaultValues.profession?.[0]?.id?.toString() || "");
    setTelefono(defaultValues.telefono || "");
    setPais(defaultValues.pais?.id?.toString() || "");
    setMunicipio(defaultValues.municipio?.id?.toString() || "");
    setDireccionDomiciliar(defaultValues.direccion_domiciliar || "");
    setNombreContactoEmergencia(defaultValues.nombre_contacto_emergencia || "");
    setTelefonoContactoEmergencia(defaultValues.telefono_contacto_emergencia || "");
    setUnidadAdministrativa(defaultValues.unidad_administrativa || "")
    setCargoNominal(defaultValues.cargo_nominal || "");
    setCargoReal(defaultValues.cargo_real || "");
     // ✅ Convertir Date a string tipo "YYYY-MM-DD"
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
=======
    if (defaultValues) {
      setNombres(defaultValues.nombres || "");
      setApellido1(defaultValues.apellido_paterno || "");
      setApellido2(defaultValues.apellido_materno || "");
      setCedulaIdentidad(defaultValues.cedula_identidad || "");
      setSexo(defaultValues.sexo?.id?.toString() || "");
      setNivelAcademico(defaultValues.nivel_academico?.[0]?.id?.toString() || "");
      SetProfession(defaultValues.profession?.[0]?.id?.toString() || "");
      setTelefono(defaultValues.telefono || "");
      setPais(defaultValues.pais?.id?.toString() || "");
      setMunicipio(defaultValues.municipio?.id?.toString() || "");
      setDireccionDomiciliar(defaultValues.direccion_domiciliar || "");
      setNombreContactoEmergencia(defaultValues.nombre_contacto_emergencia || "");
      setTelefonoContactoEmergencia(defaultValues.telefono_contacto_emergencia || "");
      // ✅ Convertir Date a string tipo "YYYY-MM-DD"
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
>>>>>>> 9b132c965e68a32ccc7bc9fbb747dee92ac6fc67

  const handleClick = ()=> {
    fileInputRef.current?.click()
  }

  const handlefileChange = (event: React.ChangeEvent<HTMLInputElement>)=> {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
      const url = URL.createObjectURL(selectedFile)
      setPreview(url)

  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-2">
      <h2 className="text-xl font-semibold text-gray-700">
        {isEdit ? "Editar Docente" : "Agregar Docente"}
      </h2>

      <div className="flex flex-col items-center">
        <Avatar className="w-22 h-22 border-4 border-green-200 cursor-pointer"
        onClick={handleClick}>

                    {preview ? (
                        <AvatarImage
                            src={preview}
                            alt={"Foto del docente"}
                        />
                    ) : (

                    <AvatarFallback className="text-md font-bold bg-green-100 text-green-700">
                        {nombres && apellido1
                        ?`${nombres[0] ?? ""}
                        ${apellido1[0] ?? ""}`: 
                        <User className="w-10 h-10"/>
                        }
                    </AvatarFallback>
                    )}
                </Avatar>
                    <input
                    type="file"
                    accept = "image/*"
                    ref={fileInputRef}
                    onChange={handlefileChange}
                    className="hidden"
                    />
      </div>

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

      <input
      type= "text"
      placeholder="Cargo Nominal"
      value={cargo_nominal}
      onChange={(e) => setCargoNominal(e.target.value)}
      className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
      required
      />

      <input 
      type="text"
      placeholder="Cargo real"
      value={cargo_real}
      onChange={(e) => setCargoReal(e.target.value)}
      className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
      required
      />

      <input
      type="text"
      placeholder="Unidad_administrativa"
      value={unidad_administrativa}
      onChange={(e) => setUnidadAdministrativa(e.target.value)}
      className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
      required
      />
      <select
        name="sexo"
        id="sexo"
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
