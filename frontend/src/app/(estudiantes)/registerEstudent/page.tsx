"use client"
import { getFiltarStudent } from "@/actions/resgisterEstudentMethods/regiterEstudentMethods";
import AddStudentModal from "@/components/modals/Estudiantes/AddStudentModal";
import SearchBar from "@/components/SearchBar";
import RegisterEstudentTable from "@/components/tables/RegisterEstudentTable";
import RegisterEstudent from "@/interfaces/registerEstudentInterface";
import { useEffect, useState } from "react";

interface StudentFilters {
    search: string;
    anioId: string;
    organizacionId: string;
    grado: string;
}

interface StudentAssignment {
    groupId: string;
    anioId: string;
    anioLabel: string;
    organizacionId: string;
    organizacionLabel: string;
    grado: string;
    grupoLabel: string;
}

const emptyFilters: StudentFilters = {
    search: "",
    anioId: "",
    organizacionId: "",
    grado: "",
};

function normalizeText(value?: string | null) {
    return (value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}

function getStudentAssignments(student: RegisterEstudent): StudentAssignment[] {
    const assignments = new Map<string, StudentAssignment>();

    for (const relation of student.grupoAsignaturaConEstudiantes ?? []) {
        const group = relation.grupoAsignaturaDocente?.grupo;
        const organization = group?.organizacionEscolar;
        const anio = organization?.anio_lectivo;

        if (!group?.id || !organization?.id || !anio?.id) {
            continue;
        }

        const groupId = String(group.id);
        if (assignments.has(groupId)) {
            continue;
        }

        const turno = group.turno?.turno ?? organization.turno?.turno ?? "";
        const modalidad = group.turno?.modalidad?.modalidad ?? organization.turno?.modalidad?.modalidad ?? "";
        const grado = group.grado?.grades ?? "";
        const seccion = group.seccion?.seccion ?? "";

        assignments.set(groupId, {
            groupId,
            anioId: String(anio.id),
            anioLabel: String(anio.anio_lectivo ?? ""),
            organizacionId: String(organization.id),
            organizacionLabel: [anio.anio_lectivo, turno, modalidad].filter(Boolean).join(" - "),
            grado,
            grupoLabel: [grado, seccion ? `Sección ${seccion}` : "", turno, modalidad].filter(Boolean).join(" - "),
        });
    }

    return Array.from(assignments.values()).sort((current, next) => Number(next.anioLabel || 0) - Number(current.anioLabel || 0));
}

function matchesSearch(student: RegisterEstudent, query: string) {
    const normalizedQuery = normalizeText(query);
    if (!normalizedQuery) {
        return true;
    }

    const tokens = normalizedQuery.split(" ").filter(Boolean);
    const fullName = normalizeText(`${student.name ?? ""} ${student.lastName ?? ""}`);
    const compactFullName = fullName.replace(/\s+/g, "");
    const studentCode = normalizeText(String(student.studentCode ?? ""));
    const compactQuery = normalizedQuery.replace(/\s+/g, "");

    return (
        studentCode.includes(normalizedQuery) ||
        fullName.includes(normalizedQuery) ||
        compactFullName.includes(compactQuery) ||
        tokens.every((token) => fullName.includes(token))
    );
}

function matchesAssignment(assignment: StudentAssignment, filters: StudentFilters) {
    const gradeFilter = normalizeText(filters.grado);
    const yearFilter = normalizeText(filters.anioId);
    const assignmentYear = normalizeText(assignment.anioLabel);

    return (
        (!yearFilter || assignmentYear.includes(yearFilter)) &&
        (!filters.organizacionId || assignment.organizacionId === filters.organizacionId) &&
        (!gradeFilter || normalizeText(assignment.grado) === gradeFilter)
    );
}

export default function RegistroEstudiantes() {
    const [draftFilters, setDraftFilters] = useState<StudentFilters>(emptyFilters)
    const [appliedFilters, setAppliedFilters] = useState<StudentFilters>(emptyFilters)
    const [student, setStudent] = useState<RegisterEstudent[]>([])

    const fetchEstudiantes = async () => {
        try {
            const res = await getFiltarStudent()
            const studentList = Array.isArray(res) ? res : res?.data ?? []
            const orderedStudents = studentList.slice().sort((a: RegisterEstudent, b: RegisterEstudent) => {
                const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                if (dateA && dateB && dateA !== dateB) return dateA - dateB;
                return (a.id ?? 0) - (b.id ?? 0);
            });
            setStudent(orderedStudents)
        } catch (error: unknown) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchEstudiantes()
    }, [])

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setAppliedFilters((current) => {
                const nextFilters = {
                    search: draftFilters.search.trim(),
                    anioId: draftFilters.anioId,
                    organizacionId: draftFilters.organizacionId,
                    grado: draftFilters.grado,
                };

                if (
                    current.search === nextFilters.search &&
                    current.anioId === nextFilters.anioId &&
                    current.organizacionId === nextFilters.organizacionId &&
                    current.grado === nextFilters.grado
                ) {
                    return current;
                }

                return nextFilters;
            })
        }, 250)

        return () => window.clearTimeout(timeout)
    }, [draftFilters])

    const assignmentCatalog = student
        .flatMap((currentStudent) => getStudentAssignments(currentStudent))
        .reduce<Map<string, StudentAssignment>>((catalog, assignment) => {
            const key = `${assignment.anioId}-${assignment.organizacionId}-${assignment.groupId}`;
            if (!catalog.has(key)) {
                catalog.set(key, assignment);
            }
            return catalog;
        }, new Map<string, StudentAssignment>());

    const availableAssignments = Array.from(assignmentCatalog.values());

    const availableOrganizations = Array.from(
        availableAssignments
            .filter((assignment) => !normalizeText(draftFilters.anioId) || normalizeText(assignment.anioLabel).includes(normalizeText(draftFilters.anioId)))
            .reduce<Map<string, { id: string; label: string }>>((catalog, assignment) => {
                if (!catalog.has(assignment.organizacionId)) {
                    catalog.set(assignment.organizacionId, {
                        id: assignment.organizacionId,
                        label: assignment.organizacionLabel,
                    });
                }
                return catalog;
            }, new Map<string, { id: string; label: string }>()).values()
    ).sort((current, next) => current.label.localeCompare(next.label));

    const availableGrades = Array.from(
        availableAssignments
            .filter((assignment) => !normalizeText(draftFilters.anioId) || normalizeText(assignment.anioLabel).includes(normalizeText(draftFilters.anioId)))
            .filter((assignment) => !draftFilters.organizacionId || assignment.organizacionId === draftFilters.organizacionId)
            .reduce<Map<string, string>>((catalog, assignment) => {
                const normalizedGrade = normalizeText(assignment.grado);
                if (normalizedGrade && !catalog.has(normalizedGrade)) {
                    catalog.set(normalizedGrade, assignment.grado);
                }
                return catalog;
            }, new Map<string, string>()).values()
    ).sort((current, next) => current.localeCompare(next));

    const filteredStudent = student
        .filter((currentStudent) => {
            if (!matchesSearch(currentStudent, appliedFilters.search)) {
                return false;
            }

            const hasStructuredFilters = Boolean(appliedFilters.anioId || appliedFilters.organizacionId || appliedFilters.grado);
            if (!hasStructuredFilters) {
                return true;
            }

            const assignments = getStudentAssignments(currentStudent);
            return assignments.some((assignment) => matchesAssignment(assignment, appliedFilters));
        })
        .map((currentStudent) => {
            const assignments = getStudentAssignments(currentStudent);
            const matchingAssignments = assignments.filter((assignment) => matchesAssignment(assignment, appliedFilters));
            const assignmentToShow = matchingAssignments[0] ?? assignments[0] ?? null;

            return {
                ...currentStudent,
                asignadoAnio: assignmentToShow?.anioLabel ?? null,
                asignadoGrupo: assignmentToShow?.grupoLabel ?? null,
                organizacionEscolarResumen: assignmentToShow?.organizacionLabel ?? null,
            };
        });

    const hasAppliedFilters = Boolean(
        appliedFilters.search || appliedFilters.anioId || appliedFilters.organizacionId || appliedFilters.grado
    );

    const handleClearFilters = () => {
        setDraftFilters(emptyFilters)
        setAppliedFilters(emptyFilters)
    }

    return (
        <div className="mx-6 space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="ml-10 text-2xl font-bold mb-4 tracking-tight text-gray-600 text-center">
                    Estudiantes
                </h1>
                <div className="flex justify-end mr-10 mb-6 mt-5">
                    <AddStudentModal fetchStudent={fetchEstudiantes} />
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-2 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-emerald-50 px-6 py-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800">
                            Listado de estudiantes
                        </h2>
                        <p className="text-sm text-slate-500">
                            Combina nombre o codigo, anio lectivo, organizacion escolar y grado para ubicar a un estudiante con precision.
                        </p>
                    </div>
                    <span className="inline-flex w-fit items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {filteredStudent.length} resultado(s)
                    </span>
                </div>

                <div className="space-y-4 px-4 py-4 md:px-6">
                    <SearchBar
                        value={draftFilters.search}
                        onChange={(value) => setDraftFilters((current) => ({ ...current, search: value }))}
                        onClear={() => setDraftFilters((current) => ({ ...current, search: "" }))}
                        placeholder="Buscar por nombres, apellidos o codigo del estudiante"
                    />

                    <div className="flex flex-wrap items-center gap-3">
                        <input
                            type="text"
                            value={draftFilters.anioId}
                            onChange={(event) =>
                                setDraftFilters((current) => ({
                                    ...current,
                                    anioId: event.target.value,
                                    organizacionId: "",
                                    grado: "",
                                }))
                            }
                            placeholder="Anio lectivo"
                            inputMode="numeric"
                            className="min-w-[170px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />

                        <select
                            value={draftFilters.organizacionId}
                            onChange={(event) =>
                                setDraftFilters((current) => ({
                                    ...current,
                                    organizacionId: event.target.value,
                                    grado: "",
                                }))
                            }
                            className="min-w-[220px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        >
                            <option value="">Organizacion escolar</option>
                            {availableOrganizations.map((organization) => (
                                <option key={organization.id} value={organization.id}>
                                    {organization.label}
                                </option>
                            ))}
                        </select>

                        <select
                            value={draftFilters.grado}
                            onChange={(event) =>
                                setDraftFilters((current) => ({
                                    ...current,
                                    grado: event.target.value,
                                }))
                            }
                            className="min-w-[170px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        >
                            <option value="">Grado</option>
                            {availableGrades.map((grade) => (
                                <option key={grade} value={grade}>
                                    {grade}
                                </option>
                            ))}
                        </select>

                        <button
                            type="button"
                            onClick={handleClearFilters}
                            disabled={!hasAppliedFilters && !draftFilters.search && !draftFilters.anioId && !draftFilters.organizacionId && !draftFilters.grado}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                </div>
            </div>

            <RegisterEstudentTable
                student={filteredStudent}
                fetchStudent={fetchEstudiantes}
            />
        </div>
    )
}