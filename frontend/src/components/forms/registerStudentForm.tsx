"use client"

import { getDepartamentos } from "@/actions/catalogos/departamentoMethods";
import { getMunicipios } from "@/actions/catalogos/municipioMethods";
import { getPaises } from "@/actions/catalogos/paisMethods";
import { getSexos } from "@/actions/catalogos/sexoMethods";
import { ActualizarStudent, saveStudent } from "@/actions/resgisterEstudentMethods/regiterEstudentMethods";
import { Departamento, Municipio, Pais, Sexo } from "@/interfaces";
import RegisterEstudent, { RegisterEstudentPayload } from "@/interfaces/registerEstudentInterface";
import { useEffect, useState } from "react";

interface RegisterEstudentProps {
    defeaultValues?: RegisterEstudent | null;
    onSucess?: () => void;
}

export default function RegisterEstudentForm({ defeaultValues, onSucess }: RegisterEstudentProps) {
    const [name, setName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("");
    const [studentCode, setStudentCode] = useState<string>("");
    const [identityCard, setIdentityCard] = useState<string>("");
    const [dateBirt, setDateBirt] = useState<Date | null>();
    const [address, setAddress] = useState<string>("");
    const [tutorName, setTutorName] = useState<string>("");
    const [tutorIdentityCard, setTutorIdentityCard] = useState<string>("");
    const [tutorPhoneNumber, setTutorPhoneNumber] = useState<string>("");
    const [gender, setGender] = useState<string>("");
    const [observations, setObservations] = useState<string>("");
    const [pais, setPais] = useState<string>("");
    const [departamento, setDepartamento] = useState<string>("");
    const [municipio, setMunicipio] = useState<string>("");

    const [generos, setGeneros] = useState<Sexo[]>([]);
    const [paises, setPaises] = useState<Pais[]>([]);
    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [municipios, setMunicipios] = useState<Municipio[]>([]);
    const isEdit = Boolean(defeaultValues?.id)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    generosData,
                    paisesData,
                    departamentosData,
                    municipiosData
                ] = await Promise.all([
                    getSexos(),
                    getPaises(),
                    getDepartamentos(),
                    getMunicipios()
                ])
                setGeneros(generosData);
                setPaises(paisesData);
                setDepartamentos(departamentosData);
                setMunicipios(municipiosData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [])
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const selectedSexo = generos.find((s) => s.id === parseInt(gender))
            const selectedPais = paises.find((p) => p.id === parseInt(pais));
            const selectedDepartamento = departamentos.find((d) => d.id === parseInt(departamento));
            const selectedMunicipio = municipios.find((m) => m.id === parseInt(municipio));
            if (
                !selectedSexo ||
                !selectedPais ||
                !selectedDepartamento ||
                !selectedMunicipio
            ) {
                console.error("Faltan campos requeridos");
                return;
            }

            const registerStudentData: RegisterEstudentPayload = {
                name: name,
                lastName: lastName,
                studentCode: studentCode,
                identityCard: identityCard,
                dateBirt: dateBirt || new Date(),
                address: address,
                tutorName: tutorName,
                tutorIdentityCard: tutorIdentityCard,
                tutorPhoneNumber: tutorPhoneNumber,
                observations: observations,

                gender: selectedSexo,
                pais: selectedPais,
                departamento: selectedDepartamento,
                municipio: selectedMunicipio,
                // Opcionales:
                user_create_id: null,
                created_at: undefined,
                update_at: undefined,
                user_update_id: null,
                deleted_at: null,
                deleted_at_id: null,
            }
            if (isEdit && defeaultValues?.id) {
                await ActualizarStudent(defeaultValues.id, registerStudentData);
            } else {
                await saveStudent(registerStudentData);
            }
            onSucess?.();

        } catch (error) {
            console.error("Error al guardar el estudiante:", error);
        }

    }

    useEffect(() => {
        if (defeaultValues) {
            setName(defeaultValues.name);
            setLastName(defeaultValues.lastName);
            setStudentCode(defeaultValues.studentCode);
            setIdentityCard(defeaultValues.identityCard);
            setDateBirt(defeaultValues.dateBirt ? new Date(defeaultValues.dateBirt) : null);
            setAddress(defeaultValues.address);
            setTutorName(defeaultValues.tutorName);
            setTutorIdentityCard(defeaultValues.tutorIdentityCard);
            setTutorPhoneNumber(defeaultValues.tutorPhoneNumber);
            setGender(defeaultValues.gender?.id?.toString() || "");
            setObservations(defeaultValues.observations);
            setPais(defeaultValues.pais?.id?.toString() || "");
            setDepartamento(defeaultValues.departamento?.id?.toString() || "");
            setMunicipio(defeaultValues.municipio?.id?.toString() || "");
        }
    }, [defeaultValues]);
    return (
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-2">
            <h2 className="text-xl font-semibold text-gray-700">
                {isEdit ? "Editar Docente" : "Agregar Docente"}
            </h2>

            <input
                type="text"
                placeholder="Nombres"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                required
            />
            <input
                type="text"
                placeholder="Primer Apellido"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                required
            />
            <input
                type="text"
                placeholder="Segundo Apellido"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                required
            />
            <input
                type="text"
                placeholder="Cedula Identidad"
                value={identityCard}
                onChange={(e) => setIdentityCard(e.target.value)}
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                required
            />
            <input
                type="text"
                placeholder="Cedula Identidad"
                value={dateBirt}
                onChange={(e) => setDateBirt(e.target.value)}
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                required
            />
            <select
                name=""
                id=""
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
            >
                <option value="">Sexo</option>
                {generos?.map((r) => (
                    <option key={r.id} value={r.id}>
                        {r.gender}
                    </option>
                ))}
            </select>
            <select
                name=""
                id=""
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                value={pais}
                onChange={(e) => setPais(e.target.value)}
            >
                <option value="">Nivel Academico</option>
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
                <option value="">Profecion</option>
                {municipios?.map((r) => (
                    <option key={r.id} value={r.id}>
                        {r.municipio}
                    </option>
                ))}
            </select>
            <input
                type="text"
                placeholder="Telefono"
                value={tutorName}
                onChange={(e) => setTutorName(e.target.value)}
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                required
            />
            <input
                type="text"
                placeholder="Fecha de Nacimiento"
                value={tutorIdentityCard}
                onChange={(e) => setTutorIdentityCard(e.target.value)}
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
            <select
                name=""
                id=""
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                value={departamento}
                onChange={(e) => setDepartamento(e.target.value)}
            >
                <option value="">Municipio de origen</option>
                {departamentos?.map((r) => (
                    <option key={r.id} value={r.id}>
                        {r.departamento}
                    </option>
                ))}
            </select>
            <input
                type="text"
                placeholder="Fecha contratado"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                required
            />
            <input
                type="text"
                placeholder="Direccion domiciliar"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                required
            />
            <input
                type="text"
                placeholder="Nombre contacto de emergencia"
                value={tutorPhoneNumber}
                onChange={(e) => setTutorPhoneNumber(e.target.value)}
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
    )
}
