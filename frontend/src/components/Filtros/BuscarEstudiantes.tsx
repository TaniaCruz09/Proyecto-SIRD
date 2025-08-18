"use client"

import { getFiltarStudent } from "@/actions/resgisterEstudentMethods/regiterEstudentMethods";
import { useState } from "react";

export default function BuscarEstudiantes({ onSelect }: { onSelect: (student: any) => void }) {
    const [filters, setFilters] = useState({ name: "", lastName: "", studentCode: "" });
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const buscarEstudiantes = async () => {
        setLoading(true);
        try {
            const data = await getFiltarStudent(new URLSearchParams(filters).toString());
            setResults(data);
        } catch (error) {
            console.error("Error buscando estudiantes", error);
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6 border border-gray-200 p-6 rounded-xl bg-white shadow-sm mx-auto max-w-md">
            <h3 className="text-xl font-semibold text-gray-800">Buscar estudiantes</h3>

            <div className="grid grid-cols-1 gap-4">
                <input
                    name="name"
                    placeholder="Nombre"
                    value={filters.name}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
                <input
                    name="lastName"
                    placeholder="Apellido"
                    value={filters.lastName}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
                <input
                    name="studentCode"
                    placeholder="Código"
                    value={filters.studentCode}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
            </div>

            <button
                onClick={buscarEstudiantes}
                disabled={loading}
                className={`bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-60 disabled:cursor-not-allowed`}
            >
                {loading ? "Buscando..." : "Buscar"}
            </button>

            {results.length > 0 && (
                <ul className="divide-y divide-gray-200 mt-4 max-h-72 overflow-y-auto">
                    {results.map((student) => (
                        <li
                            key={student.id}
                            className="flex justify-between items-center py-3 px-4 hover:bg-gray-50 rounded-lg transition cursor-pointer"
                        >
                            <div>
                                <p className="font-semibold text-gray-900">{student.name} {student.lastName}</p>
                                <p className="text-sm text-gray-500">Código: {student.studentCode}</p>
                                {student.asignadoGrupo && (
                                    <p className="text-sm text-red-500">
                                        Ya asignado a: {student.asignadoGrupo}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => onSelect(student)}
                                className="bg-green-600 text-white px-5 py-1 rounded-lg hover:bg-green-700 transition"
                            >
                                Asignar
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );


}
