"use client";

import { useEffect, useState } from "react";
import { asignarEstudianteAGrupo } from "@/actions/organizacionEscolarMethods/asignacionEstudiantesMethods";
import { getFiltarStudent } from "@/actions/resgisterEstudentMethods/regiterEstudentMethods";
import { GrupoConAsignaturasResponse } from "@/interfaces/organizacionEscolarInterface/gruposConAsignaturas";
import { GrupoConEstudiantePayload } from "@/interfaces/organizacionEscolarInterface/asignarEstudianteInterface";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Props {
    anioId: number;
    asignaturasDelGrupo: GrupoConAsignaturasResponse[];
    fetchGrupoConEstudiantes: () => Promise<void>;
}

export default function BuscarAsignarEstudianteAutocomplete({
    anioId,
    asignaturasDelGrupo,
    fetchGrupoConEstudiantes,
}: Props) {
    const { toast } = useToast();

    const [query, setQuery] = useState("");
    const [students, setStudents] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    /* 🔹 Cargar estudiantes una sola vez */
    useEffect(() => {
        const loadStudents = async () => {
            setLoading(true);
            try {
                const data = await getFiltarStudent("", anioId);
                setStudents(data);
            } catch (e) {
                console.error("Error cargando estudiantes", e);
            } finally {
                setLoading(false);
            }
        };
        loadStudents();
    }, [anioId]);

    /* 🔹 Filtrar mientras escribe */
    useEffect(() => {
        if (!query.trim()) {
            setFiltered([]);
            return;
        }

        const q = query.toLowerCase();

        const result = students.filter((s) =>
            `${s.name} ${s.lastName}`.toLowerCase().includes(q)
        );

        setFiltered(result);
    }, [query, students]);

    const getImageUrl = (path?: string) => {
        if (!path) return null;
        return `${process.env.NEXT_PUBLIC_API_UPLOADS}${path}`;
    };

    const estaAsignado = (student: any) => {
        if (student.asignadoGrupo) return true;
        if (Array.isArray(student.grupos) && student.grupos.length > 0) return true;
        if (Array.isArray(student.grupoAsignaturaConEstudiantes) && student.grupoAsignaturaConEstudiantes.length > 0) return true;
        return false;
    };

    const getGrupoAsignadoLabel = (student: any) => {
        if (typeof student.asignadoGrupo === "string" && student.asignadoGrupo.trim()) {
            return student.asignadoGrupo;
        }

        const grupoRel = Array.isArray(student.grupoAsignaturaConEstudiantes)
            ? student.grupoAsignaturaConEstudiantes.find((item: any) => item?.grupoAsignaturaDocente?.grupo)
            : null;
        const grupo = grupoRel?.grupoAsignaturaDocente?.grupo
            ?? (Array.isArray(student.grupos) ? student.grupos[0] : null);

        if (!grupo) return null;

        const grado = grupo.grado?.grades ?? "";
        const seccion = grupo.seccion?.seccion ?? "";
        const turno = grupo.turno?.turno ?? "";
        const modalidad = grupo.turno?.modalidad?.modalidad ?? "";
        const base = `${grado} ${seccion}`.trim();
        const extras = [turno, modalidad].filter(Boolean).join(" - ");

        return [base, extras].filter(Boolean).join(" - ") || null;
    };

    /* 🔹 Asignar estudiante */
    const handleAsignar = async (student: any) => {
        if (!asignaturasDelGrupo?.length) return;

        // 🚫 YA ASIGNADO
        if (estaAsignado(student)) {
            const grupoAsignado = getGrupoAsignadoLabel(student);
            toast({
                title: "Estudiante ya asignado",
                description: `${student.name} ${student.lastName} ya pertenece a ${grupoAsignado ?? "un grupo"}`,
                variant: "destructive", // o "default" si lo querés más suave
            });
            return;
        }

        try {
            await Promise.all(
                asignaturasDelGrupo.map((gad) => {
                    const payload: GrupoConEstudiantePayload = {
                        grupoAsignaturaDocente: { id: gad.id },
                        estudiante: { id: student.id },
                    };
                    return asignarEstudianteAGrupo(payload);
                })
            );

            await fetchGrupoConEstudiantes();

            toast({
                title: "Estudiante asignado",
                description: `${student.name} ${student.lastName}`,
            });

            setQuery("");
            setFiltered([]);
        } catch (e) {
            console.error("Error asignando estudiante", e);

            const grupoAsignado = getGrupoAsignadoLabel(student);
            const errorMessage = e instanceof Error ? e.message : "No se pudo asignar el estudiante";

            toast({
                title: errorMessage.toLowerCase().includes("ya") ? "Estudiante ya asignado" : "Error al asignar estudiante",
                description: grupoAsignado
                    ? `${student.name} ${student.lastName} ya pertenece a ${grupoAsignado}`
                    : errorMessage,
                variant: "destructive",
            });
        }
    };


    return (
        <div className="w-full max-w-md relative">
            {/* 🔍 Buscador */}
            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar estudiante..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            {/* ⏳ Loading */}
            {loading && (
                <p className="text-sm text-slate-500 mt-2">Cargando estudiantes...</p>
            )}

            {/* 📋 Resultados */}
            {filtered.length > 0 && (
                <div className="absolute z-20 mt-2 w-full max-h-72 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg">
                    {filtered.map((student) => (
                        <div
                            key={student.id}
                            onClick={() => handleAsignar(student)}
                            className="flex items-center gap-3 p-3 hover:bg-slate-100 cursor-pointer"
                        >
                            <Avatar className="w-11 h-11 border-2 border-green-200">
                                {student.profileImage ? (
                                    <AvatarImage
                                        src={getImageUrl(student.profileImage) || "/placeholder.svg"}
                                        alt={student.name}
                                    />
                                ) : (
                                    <AvatarFallback className="text-md font-bold bg-green-100 text-green-700">
                                        {`${student.name.split(" ")
                                            .map((n: string) => n[0])
                                            .join("")
                                            .slice(0, 1)}${student.lastName.split("")
                                                .map((n: string) => n[0])
                                                .join("")
                                                .slice(0, 1)}`}
                                    </AvatarFallback>
                                )}
                            </Avatar>

                            <div>
                                <p className="font-semibold text-slate-800">
                                    {student.name} {student.lastName}
                                </p>
                                <p className="text-xs text-slate-500">
                                    Código: {student.studentCode}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
