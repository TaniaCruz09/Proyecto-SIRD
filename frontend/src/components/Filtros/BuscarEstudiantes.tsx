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
        <div className="space-y-4 border p-4 rounded-lg bg-white">
            <h3 className="text-lg font-semibold">Buscar estudiantes</h3>

            <div className="grid grid-cols-3 gap-2">
                <input name="name" placeholder="Nombre" value={filters.name} onChange={handleChange} className="border p-2 rounded" />
                <input name="lastName" placeholder="Apellido" value={filters.lastName} onChange={handleChange} className="border p-2 rounded" />
                <input name="studentCode" placeholder="Código" value={filters.studentCode} onChange={handleChange} className="border p-2 rounded" />
            </div>

            <button onClick={buscarEstudiantes} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                {loading ? "Buscando..." : "Buscar"}
            </button>

            {results.length > 0 && (
                <ul className="divide-y mt-4">
                    {results.map((student) => (
                        <li key={student.id} className="flex justify-between items-center py-2">
                            <div>
                                <p className="font-semibold">{student.name} {student.lastName}</p>
                                <p className="text-sm text-gray-500">Código: {student.studentCode}</p>
                            </div>
                            <button
                                onClick={() => onSelect(student)}
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
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
