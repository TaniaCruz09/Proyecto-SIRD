"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { getGradosByDocenteId } from "@/actions/docentesMethods/docentesMethods"
import { getEsquelaHeadById } from "@/actions/calificaciones/esquelasHeadsMethods/esquelasHeadMethods"
import { EsquelaHeadInterface, EsquelaRowInterface } from "@/interfaces/calificaciones/EsquelaHead"
import { Corte } from "@/interfaces"
import { EsquelaRowPayload } from "@/interfaces/calificaciones/EsquelaRow"
import { saveEsquelaRow, updateEsquelaRow } from "@/actions/calificaciones/esquelasRowsMethods/esquelasRowsMethods"
import { getCortesEvaluativos } from "@/actions/catalogos/corteEvaluativoMethods"
import CardCortesEvaluativos from "@/components/calificaciones/CardCortesEvaluativos"
import { Asignatura, CorteUI, Estudiante } from "@/interfaces/calificaciones/AgregarCalificaciones"
import HeaderAgregarCalificaciones from "@/components/calificaciones/HeaderAgregarCalificaciones"
import TabsAsignaturas from "@/components/calificaciones/TabsAsignaturas"

export interface CalificacionesProps {
    esquelaId: number | string
    grupoId: number
    grupoNombre?: string
    isAnioActivo: boolean
    onVolver?: () => void
}

const getInitials = (nombre?: string) => {
    const partes = nombre?.trim()?.split?.(" ") ?? []
    if (partes.length === 0) return ""
    if (partes.length === 1) return (partes[0]?.[0] ?? "").toUpperCase()
    return ((partes[0][0] ?? "") + (partes[1][0] ?? "")).toUpperCase()
}

/** Genera la nota cualitativa según el valor numérico */
const generarNotaCualitativa = (valor: number): string => {
    if (isNaN(valor)) return "AI"
    if (valor >= 0 && valor <= 59) return "AI"
    if (valor >= 60 && valor <= 75) return "AF"
    if (valor >= 76 && valor <= 89) return "AS"
    if (valor >= 90 && valor <= 100) return "AA"
    return "AI"
}

export default function Calificaciones({
    esquelaId,
    grupoId,
    grupoNombre,
    isAnioActivo,
    onVolver,
}: CalificacionesProps) {

    const { docente } = useAuth()

    const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
    const [asignaturas, setAsignaturas] = useState<Asignatura[]>([])
    const [cortes, setCortes] = useState<Corte[]>([])
    const [esquela, setEsquela] = useState<EsquelaHeadInterface | undefined>()
    const [asignaturaActiva, setAsignaturaActiva] = useState<number | undefined>()
    const [guardando, setGuardando] = useState<boolean>(false)

    // corteActivo es el id numérico del corte (según lo devuelve tu backend)
    const [corteActivo, setCorteActivo] = useState<number | null>(null)

    const [cortesUI, setCortesUI] = useState<CorteUI[]>([])

    const storageKey = `calificaciones_${esquelaId}_${grupoId}`

    // ---------- Cargar cortes ----------
    useEffect(() => {
        const fetchCortes = async () => {
            try {
                const response = await getCortesEvaluativos()
                if (!Array.isArray(response)) return

                setCortes(response)

                if (response.length > 0 && corteActivo == null) {
                    setCorteActivo(response[0].id)
                }

                const colores = ["bg-blue-500", "bg-yellow-500", "bg-green-500", "bg-purple-500"]
                const adaptados: CorteUI[] = response.map((c, i) => ({
                    ...c,
                    color: colores[i % colores.length]
                }))
                setCortesUI(adaptados)
            } catch (error) {
                console.error("Error al cargar los cortes evaluativos", error)
            }
        }

        fetchCortes()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // ---------- Cargar estudiantes y asignaturas (y restaurar notas) ----------
    const fetchGruposById = async () => {
        if (!docente?.id) return

        try {
            const response = await getEsquelaHeadById(Number(esquelaId))
            setEsquela(response)

            // Extraer estudiantes (normalizando arrays y evitando duplicados)
            let rawStudents: any[] = []
            const grupoAsignaturasArray = Array.isArray(response?.grupo_asignatura)
                ? response.grupo_asignatura
                : response?.grupo_asignatura
                    ? [response.grupo_asignatura]
                    : []

            grupoAsignaturasArray.forEach((ga: any) => {
                Array.isArray(ga?.grupoAsignaturaDocente) &&
                    ga.grupoAsignaturaDocente.forEach((gad: any) => {
                        Array.isArray(gad?.gruposConEstudiantes) &&
                            gad.gruposConEstudiantes.forEach((ge: any) => {
                                if (ge?.estudiante) rawStudents.push(ge.estudiante)
                            })
                    })
            })

            rawStudents = rawStudents.filter(
                (v, i, self) => self.findIndex((s) => s.id === v.id) === i
            )

            // Normalizar estudiantes
            const normalized: Estudiante[] = rawStudents.map((s: any) => ({
                id: Number(s.id),
                codigo: s?.studentCode ?? "",
                nombre: s?.name ?? "",
                apellido: s?.lastName ?? "",
                sexo: s?.gender?.gender?.toUpperCase().startsWith("F") ? "F" : "M",
                foto: s?.profileImage ? `${process.env.NEXT_PUBLIC_API_UPLOADS}${s.profileImage}` : undefined,
                // mantenemos una estructura libre para calificaciones, usaremos indexing numérico
                // algunos lugares usan as any porque las interfaces previas estaban mixtas
                calificaciones: {}
            }))

            // 1) Restaurar desde localStorage (si existe)
            try {
                const almacen = localStorage.getItem(storageKey)
                if (almacen) {
                    const parsed = JSON.parse(almacen)
                    // parsed tiene la forma { [estId]: { [asignaturaId]: { [corteId]: "90" } } }
                    normalized.forEach(est => {
                        if (parsed?.[est.id]) {
                            // se asignan las calificaciones guardadas
                            est.calificaciones = {
                                ...(est.calificaciones as any),
                                ...parsed[est.id]
                            }
                        }
                    })
                }
            } catch (err) {
                console.warn("No se pudo restaurar localStorage:", err)
            }

            // 2) Si la respuesta del backend incluye filas (esquela_row / esquelaRows / rows), intentar restaurarlas
            // (esto cubre el caso en que el backend ya tiene notas guardadas)
            const posiblesKeys = ["esquelaRow"]
            for (const key of posiblesKeys) {
                const rows = (response as any)?.[key]
                if (Array.isArray(rows) && rows.length > 0) {
                    rows.forEach((r: any) => {
                        // Intentar extraer estudianteId, asignaturaId, corteId, notaCuantitativa
                        const studentId = r?.estudiante?.id ?? r?.estudiante_id ?? r?.studentId ?? r?.estudianteId
                        const asignaturaId = r?.asignatura?.id ?? r?.asignatura_id ?? r?.asignaturaId
                        const corteId = r?.corte?.id ?? r?.corte_id ?? r?.corteId
                        const notaNum = r?.notaCuantitativa ?? r?.nota_cuantitativa ?? r?.nota

                        if (studentId && asignaturaId && corteId && typeof notaNum !== "undefined") {
                            const est = normalized.find(e => Number(e.id) === Number(studentId))
                            if (est) {
                                est.calificaciones = {
                                    ...(est.calificaciones as any),
                                    [asignaturaId]: {
                                        ...((est.calificaciones as any)[asignaturaId] ?? {}),
                                        [corteId]: String(notaNum)
                                    }
                                }
                            }
                        }
                    })
                    // si encontramos filas, no necesitamos chequear otras keys
                    break
                }
            }

            setEstudiantes(normalized)

            // ---- Obtener asignaturas del docente ----
            const resDocente = await getGradosByDocenteId(docente.id)
            const grupoAsignaturaDocente = Array.isArray(resDocente?.grupoAsignaturaDocente)
                ? resDocente.grupoAsignaturaDocente
                : []

            const asignaturasUnicas: Record<number, Asignatura> = {}

            grupoAsignaturaDocente
                .filter((gad: any) => gad.grupo?.id === grupoId)
                .forEach((gad: any) => {
                    const a = gad.asignatura
                    if (a?.id && !asignaturasUnicas[a.id]) {
                        asignaturasUnicas[a.id] = {
                            id: Number(a.id),
                            nombre: a.asignatura,
                            codigo: a.codigo ?? String(a.asignatura).slice(0, 3).toUpperCase(),
                        }
                    }
                })

            const asignaturasArray = Object.values(asignaturasUnicas)
            setAsignaturas(asignaturasArray)

            if (asignaturasArray.length > 0) setAsignaturaActiva(asignaturasArray[0].id)

        } catch (error) {
            console.error("Error fetching grupo o asignaturas:", error)
            setEstudiantes([])
            setAsignaturas([])
        }
    }

    useEffect(() => {
        if (esquelaId && docente) fetchGruposById()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [esquelaId, docente])


    // ---------- Helper: guardar todo el estado de calificaciones en localStorage ----------
    const persistirLocal = (students: Estudiante[]) => {
        try {
            const saveObj: Record<string, any> = {}
            students.forEach(s => {
                saveObj[s.id] = s.calificaciones
            })
            localStorage.setItem(storageKey, JSON.stringify(saveObj))
        } catch (err) {
            console.warn("Error al persistir en localStorage", err)
        }
    }

    // ---------------- Guardar nota individual (envía a backend y actualiza localStorage) ----------------
    const handleGuardarIndividual = async (
        estudiante: Estudiante,
        asignaturaId: number,
        nota: string,
        setNotaBD: (nota: string) => void,
        isUpdate: boolean
    ) => {
        if (!esquela?.id || corteActivo == null) return;

        const raw = String(nota ?? "").trim();

        // Validaciones
        if (raw === "") return alert("Debe ingresar una nota");
        if (!/^\d{1,3}$/.test(raw)) return alert("La nota no es válida (solo números enteros)");

        const notaNum = Number(raw);
        if (notaNum < 0 || notaNum > 100) return alert("La nota debe estar entre 0 y 100");

        const corteEncontrado = cortes.find(c => c.id === corteActivo);
        if (!corteEncontrado) return alert("No se encontró el corte");

        const notaCualitativa = generarNotaCualitativa(notaNum);

        const payload: EsquelaRowPayload = {
            estudiante: { id: estudiante.id },
            asignatura: { id: asignaturaId },
            notaCualitativa,
            notaCuantitativa: notaNum,
            corte: { id: corteEncontrado.id },
            esquelaHead: { id: esquela!.id }
        };

        try {
            setGuardando(true);

            let savedRow;

            if (isUpdate) {
                const filasBD: EsquelaRowInterface[] =
                    esquela?.esquelaRow ??
                    [];

                const rowBD = filasBD.find(
                    r =>
                        Number(r.estudiante.id) === Number(estudiante.id) &&
                        Number(r.asignatura.id) === Number(asignaturaId) &&
                        Number(r.corte.id) === Number(corteActivo)
                );


                if (!rowBD) {
                    alert("No se pudo actualizar: la fila no existe en BD");
                    setGuardando(false);
                    return;
                }

                savedRow = await updateEsquelaRow(rowBD.id, payload);

            } else {
                // 👉 Guardar nueva nota
                savedRow = await saveEsquelaRow(payload);
            }

            setGuardando(false);

            const notaReal = savedRow?.notaCuantitativa ?? notaNum;

            // 👉 Actualizar estado local de estudiantes con la nota real
            setEstudiantes(prev => {
                const updated = prev.map(e => {
                    if (e.id === estudiante.id) {
                        const asignObj = {
                            ...((e.calificaciones as any)[asignaturaId] ?? {}),
                            [corteActivo!]: String(notaReal)
                        };
                        return {
                            ...e,
                            calificaciones: {
                                ...(e.calificaciones as any),
                                [asignaturaId]: asignObj
                            }
                        };
                    }
                    return e;
                });
                persistirLocal(updated);
                return updated;
            });

            // 👉 Actualizar la fila
            setNotaBD(String(notaReal));

            alert(isUpdate ? "Nota actualizada correctamente" : "Nota guardada correctamente");
        } catch (error) {
            console.error("Error al guardar nota:", error);
            setGuardando(false);
            alert("Error al guardar la nota");
        }
    };

    // --------- Avanzar al siguiente corte (solo cambia corteActivo localmente) ----------
    const avanzarCorte = () => {
        if (corteActivo == null || cortes.length === 0) return

        const index = cortes.findIndex(c => c.id === corteActivo)
        if (index < cortes.length - 1) {
            setCorteActivo(cortes[index + 1].id)
            alert(`Corte cambiado a: ${cortes[index + 1].corte}`)
        } else {
            alert("Ya estás en el último corte")
        }
    }

    const anioLectivo = esquela?.grupo_asignatura.organizacionEscolar.anio_lectivo.anio_lectivo

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <HeaderAgregarCalificaciones
                grupoNombre={grupoNombre}
                anioId={anioLectivo}
                onVolver={onVolver}
            />

            {/* Card de cortes */}
            <CardCortesEvaluativos
                estudiantes={estudiantes}
                asignaturaActiva={asignaturaActiva ?? 0}
                corteActivo={corteActivo}
                setCorteActivo={setCorteActivo}
                cortesUI={cortesUI}
            />

            {/* Tabs para asignaturas */}
            <TabsAsignaturas
                asignaturas={asignaturas}
                estudiantes={estudiantes}
                corteActivo={corteActivo}
                cortes={cortes}
                asignaturaActiva={asignaturaActiva}
                setAsignaturaActiva={setAsignaturaActiva}
                getInitials={getInitials}
                anioLectivo={anioLectivo}
                handleGuardarIndividual={handleGuardarIndividual}
                avanzarCorte={avanzarCorte}
                guardando={guardando}
                isAnioActivo={isAnioActivo}
            />
        </div>
    )
}
