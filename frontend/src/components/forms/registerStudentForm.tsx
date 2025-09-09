"use client"
import { getMunicipios } from "@/actions/catalogos/municipioMethods";
import { getPaises } from "@/actions/catalogos/paisMethods";
import { getSexos } from "@/actions/catalogos/sexoMethods";
import { ActualizarStudent, saveStudent } from "@/actions/resgisterEstudentMethods/regiterEstudentMethods";
import { Municipio, Pais, Sexo } from "@/interfaces";
import RegisterEstudent from "@/interfaces/registerEstudentInterface";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "lucide-react";

interface RegisterEstudentProps {
    defeaultValues?: RegisterEstudent | null;
    onSucess?: () => void;
}

export default function RegisterEstudentForm({ defeaultValues, onSucess }: RegisterEstudentProps) {
    const [formValues, setFormValues] = useState({ name: "", lastName: "", studentCode: "", identityCard: "", dateBirt: "", address: "", tutorName: "", tutorIdentityCard: "", tutorPhoneNumber: "", gender: "", observations: "", pais: "", municipio: "", telefono: "" })

    const [generos, setGeneros] = useState<Sexo[]>([]);
    const [paises, setPaises] = useState<Pais[]>([]);
    const [municipios, setMunicipios] = useState<Municipio[]>([]);
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)

    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const isEdit = Boolean(defeaultValues?.id)

    // Fetch catálogos
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [generosData, paisesData, municipiosData] = await Promise.all([
                    getSexos(),
                    getPaises(),
                    getMunicipios()
                ])
                setGeneros(generosData);
                setPaises(paisesData);
                setMunicipios(municipiosData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [])

    // Inicializar valores si estamos editando
    useEffect(() => {
        if (defeaultValues) {
            setFormValues({
                name: defeaultValues.name,
                lastName: defeaultValues.lastName,
                studentCode: defeaultValues.studentCode,
                identityCard: defeaultValues.identityCard,
                dateBirt: defeaultValues.dateBirt
                    ? new Date(defeaultValues.dateBirt).toISOString().split("T")[0]
                    : "",
                address: defeaultValues.address,
                tutorName: defeaultValues.tutorName,
                tutorIdentityCard: defeaultValues.tutorIdentityCard,
                tutorPhoneNumber: defeaultValues.tutorPhoneNumber,
                gender: defeaultValues.gender?.id?.toString() || "",
                observations: defeaultValues.observations,
                pais: defeaultValues.pais?.id?.toString() || "",
                municipio: defeaultValues.municipio?.id?.toString() || "",
                telefono: defeaultValues.phone || "",
            });

            if (defeaultValues.profileImage) {
                setPreview(`${process.env.NEXT_PUBLIC_API_UPLOADS}${defeaultValues.profileImage}`);
            }
        }
    }, [defeaultValues]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (!selectedFile) return;
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = new FormData();
            Object.entries(formValues).forEach(([key, value]) => {
                data.append(key, value);
            });
            if (file) data.append("profileImage", file);

            if (isEdit && defeaultValues?.id) {
                await ActualizarStudent(defeaultValues.id, data);
            } else {
                await saveStudent(data);
            }

            onSucess?.();
        } catch (error) {
            console.error("Error al guardar el estudiante:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-2">
            <h2 className="text-xl font-semibold text-gray-700">
                {isEdit ? "Editar Estudiante" : "Agregar Estudiante"}
            </h2>

            <div className="flex flex-col items-center">

                <Avatar className="w-22 h-22 border-4 border-green-200 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    {preview ? (
                        <AvatarImage
                            src={preview}
                            alt="Foto del estudiante"
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
                {/* Input oculto */}
                <input
                    type="file"
                    accept="image/*"
                    name="profileImage"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />

            </div>
            <input
                type="text"
                name="name"
                placeholder="Nombres"
                value={formValues.name}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                required
            />
            <input
                type="text"
                name="lastName"
                placeholder="Apellidos"
                value={formValues.lastName}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                required
            />
            <input
                type="text"
                name="studentCode"
                placeholder="codigo del estudiante"
                value={formValues.studentCode}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                required
            />
            <input
                type="text"
                name="identityCard"
                placeholder="Cedula Identidad"
                value={formValues.identityCard}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                required
            />
            <input
                type="date"
                name="dateBirt"
                placeholder="Fecha de nacimiento"
                value={formValues.dateBirt}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                required
            />
            <select
                name="gender"
                id=""
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                value={formValues.gender}
                onChange={handleInputChange}
            >
                <option value="">Sexo</option>
                {generos?.map((r) => (
                    <option key={r.id} value={r.id}>
                        {r.gender}
                    </option>
                ))}
            </select>
            <select
                name="municipio"
                id=""
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                value={formValues.municipio}
                onChange={handleInputChange}
            >
                <option value="">Municipio de origen</option>
                {municipios?.map((r) => (
                    <option key={r.id} value={r.id}>

                        {r.municipio}
                    </option>
                ))}
            </select>
            <input
                type="text"
                name="telefono"
                placeholder="Telefono del estudiante"
                value={formValues.telefono}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                required
            />
            <input
                type="text"
                name="tutorName"
                placeholder="Nombre del tutor"
                value={formValues.tutorName}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                required
            />
            <input
                type="text"
                name="tutorIdentityCard"
                placeholder="Cedula del tutor"
                value={formValues.tutorIdentityCard}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                required
            />
            <select
                name="pais"
                id=""
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                value={formValues.pais}
                onChange={handleInputChange}
            >
                <option value="">Pais de origen</option>
                {paises?.map((r) => (
                    <option key={r.id} value={r.id}>
                        {r.pais}
                    </option>
                ))}
            </select>
            <input
                type="text"
                name="observations"
                placeholder="Observacion"
                value={formValues.observations}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                required
            />
            <input
                type="text"
                name="address"
                placeholder="Direccion domiciliar"
                value={formValues.address}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                required
            />
            <input
                type="text"
                name="tutorPhoneNumber"
                placeholder="Numero de telefono del tutor"
                value={formValues.tutorPhoneNumber}
                onChange={handleInputChange}
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