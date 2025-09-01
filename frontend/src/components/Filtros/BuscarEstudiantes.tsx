"use client"
import { asignarEstudianteAGrupo } from "@/actions/organizacionEscolarMethods/asignacionEstudiantesMethods";
import { getFiltarStudent } from "@/actions/resgisterEstudentMethods/regiterEstudentMethods";
import { GrupoConEstudiantePayload } from "@/interfaces/organizacionEscolarInterface/asignarEstudianteInterface";
import { GrupoConAsignaturasResponse } from "@/interfaces/organizacionEscolarInterface/gruposConAsignaturas";
import { useState } from "react";
import { useToast } from '@/hooks/use-toast';

interface BuscarEstudiantesProp {
    anioId: number
    asignaturasDelGrupo: GrupoConAsignaturasResponse[]
    fetchGrupoConEstudiantes: () => Promise<void>;
}

export default function BuscarYAsignarEstudiantes({ anioId, asignaturasDelGrupo, fetchGrupoConEstudiantes }: BuscarEstudiantesProp) {
    const { toast } = useToast();
    const [filters, setFilters] = useState({ name: "", lastName: "", studentCode: "" });
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false); // 👈 nuevo estado para mostrar/ocultar

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const buscarEstudiantes = async () => {
        setLoading(true);
        try {
            const data = await getFiltarStudent(
                new URLSearchParams(filters).toString(),
                anioId);
            setResults(data);
        } catch (error) {
            console.error("Error buscando estudiantes", error);
        }
        setLoading(false);
    };

    //funcion para asignar
    const handleAsignar = async (student: any) => {
        if (!asignaturasDelGrupo?.length) return;

        try {
            // Crear un array de promesas para cada asignación
            const asignaciones = asignaturasDelGrupo.map(gad => {
                const grupoConEstudianteData: GrupoConEstudiantePayload = {
                    grupoAsignaturaDocente: { id: gad.id },
                    estudiante: { id: student.id || student }
                };
                return asignarEstudianteAGrupo(grupoConEstudianteData);
            });

            // Ejecutar todas las promesas en paralelo
            const resultados = await Promise.all(asignaciones);

            // Verificar si alguna devolvió error
            const error = resultados.find(res => res.error);
            if (error) throw new Error(error.error?.message || "Error al asignar algún estudiante");

            await fetchGrupoConEstudiantes(); // refresca la lista

            toast({
                title: "Éxito",
                description: "Estudiante asignado correctamente",
                variant: "default",
            });

        } catch (error: any) {
            console.error("Error asignando estudiante:", error);
        }
    };

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="bg-gradient-to-r from-indigo-500/70 to-purple-600/70 px-6 py-2 w-full rounded-2xl"
            >
                <div className="flex items-center justify-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    <p className="text-lg font-bold text-white">Asignar Estudiantes</p>
                </div>
            </button>
            {
                open && (
                    <div className="p-6 space-y-4">
                        <div className="space-y-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    name="name"
                                    placeholder="Nombre del estudiante"
                                    value={filters.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-slate-50 hover:bg-white"
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    name="lastName"
                                    placeholder="Apellido del estudiante"
                                    value={filters.lastName}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-slate-50 hover:bg-white"
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                                        />
                                    </svg>
                                </div>
                                <input
                                    name="studentCode"
                                    placeholder="Código estudiantil"
                                    value={filters.studentCode}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-slate-50 hover:bg-white"
                                />
                            </div>
                        </div>

                        <button
                            onClick={buscarEstudiantes}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className=" w-5 h-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Buscando...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                    Buscar Estudiantes
                                </>
                            )}
                        </button>

                        {results.length > 0 && (
                            <div className="mt-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-semibold text-slate-700">Resultados encontrados</h4>
                                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">
                                        {results.length} estudiante{results.length !== 1 ? "s" : ""}
                                    </span>
                                </div>
                                <div className="max-h-80 overflow-y-auto space-y-2 border border-slate-200 rounded-xl p-2">
                                    {results.map((student) => (
                                        <div
                                            key={student.id}
                                            className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-all duration-200 border border-transparent hover:border-slate-200 group"
                                        >
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                    {student.name.charAt(0)}
                                                    {student.lastName.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-slate-900 group-hover:text-slate-700">
                                                        {student.name} {student.lastName}
                                                    </p>
                                                    <p className="text-sm text-slate-500">Código: {student.studentCode}</p>
                                                    {student.asignadoGrupo && (
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                                                                />
                                                            </svg>
                                                            <p className="text-xs text-amber-600 font-medium">Ya asignado a: {student.asignadoGrupo}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    handleAsignar(student.id)
                                                    setFilters({ name: "", lastName: "", studentCode: "" })
                                                    setResults([])
                                                }}
                                                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                    />
                                                </svg>
                                                Asignar
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )
            }
        </div>
    )
}
