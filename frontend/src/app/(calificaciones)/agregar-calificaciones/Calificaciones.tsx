"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { getGradosByDocenteId } from "@/actions/docentesMethods/docentesMethods"
import { getEsquelaHeadById } from "@/actions/calificaciones/esquelasHeadsMethods/esquelasHeadMethods"
import { EsquelaHeadInterface, EsquelaRowInterface } from "@/interfaces/calificaciones/EsquelaHead"
import { Corte } from "@/interfaces"
import { EsquelaRowPayload } from "@/interfaces/calificaciones/EsquelaRow"
import { saveEsquelaRow, updateEsquelaRow } from "@/actions/calificaciones/esquelasRowsMethods/esquelasRowsMethods"
import { getNotasCualitativas } from "@/actions/catalogos/notaCualitativaMethods"
import { getAnioLectivoById } from "@/actions/catalogos/anioLectivoMethods"
import CardCortesEvaluativos from "@/components/calificaciones/CardCortesEvaluativos"
import { Asignatura, CorteUI, Estudiante } from "@/interfaces/calificaciones/AgregarCalificaciones"
import HeaderAgregarCalificaciones from "@/components/calificaciones/HeaderAgregarCalificaciones"
import TabsAsignaturas from "@/components/calificaciones/TabsAsignaturas"
import { NotaCualitativa } from "@/interfaces"

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

type AnyPeriodo = {
    orden?: number
    cortes?: Corte[]
    cortesPeriodo?: Array<{ orden?: number; corte?: Corte }>
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
    const [notasCualitativas, setNotasCualitativas] = useState<NotaCualitativa[]>([])

    const storageKey = `calificaciones_${esquelaId}_${grupoId}`

    const ordenarCortes = (items: Corte[]) =>
        [...items].sort((a, b) => {
            const ordenA = a.orden ?? Number.MAX_SAFE_INTEGER
            const ordenB = b.orden ?? Number.MAX_SAFE_INTEGER
            if (ordenA !== ordenB) return ordenA - ordenB
            return (a.id ?? 0) - (b.id ?? 0)
        })

    const buildCortesFromAnioLectivo = (anioLectivoData: any): Corte[] => {
        if (!anioLectivoData) return []

        const periodos: AnyPeriodo[] =
            Array.isArray(anioLectivoData.periodosLectivos) && anioLectivoData.periodosLectivos.length > 0
                ? anioLectivoData.periodosLectivos
                : Array.isArray(anioLectivoData.periodos)
                    ? anioLectivoData.periodos
                    : []

        if (periodos.length > 0) {
            const unique = new Map<number, Corte>()

            periodos
                .slice()
                .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
                .forEach((periodo) => {
                    const fromCortes = Array.isArray(periodo.cortes) ? periodo.cortes : []
                    const fromCortesPeriodo: Corte[] = Array.isArray(periodo.cortesPeriodo)
                        ? periodo.cortesPeriodo
                            .slice()
                            .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
                            .map((item) => {
                                const corte = item.corte
                                return {
                                    id: Number(corte?.id ?? 0),
                                    abreviatura: corte?.abreviatura ?? "",
                                    corte: corte?.corte ?? `Corte ${item.orden ?? ""}`,
                                    semestre: corte?.semestre,
                                    orden: item.orden,
                                }
                            })
                            .filter((corte) => Number.isFinite(corte.id) && corte.id > 0)
                        : []

                    const merged = fromCortes.length > 0 ? fromCortes : fromCortesPeriodo
                    ordenarCortes(merged).forEach((corte) => {
                        if (corte?.id && !unique.has(corte.id)) {
                            unique.set(corte.id, corte)
                        }
                    })
                })

            return ordenarCortes(Array.from(unique.values()))
        }

        const fallback = (
            anioLectivoData.cortes ??
            anioLectivoData.cortesAnioLectivo?.map((item: any) => item.corte) ??
            []
        ) as Corte[]

        return ordenarCortes(fallback)
    }

    useEffect(() => {
        const fetchNotas = async () => {
            try {
                const response = await getNotasCualitativas()
                if (Array.isArray(response)) {
                    const ordered = response
                        .slice()
                        .sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
                    setNotasCualitativas(ordered)
                }
            } catch (error) {
                console.error("Error al cargar notas cualitativas", error)
            }
        }

        fetchNotas()
    }, [])

    // ---------- Cargar estudiantes y asignaturas (y restaurar notas) ----------
    const fetchGruposById = async () => {
        if (!docente?.id) return

        try {
            const response = await getEsquelaHeadById(Number(esquelaId))
            setEsquela(response)

            const anioLectivoRef = response?.grupo_asignatura?.organizacionEscolar?.anio_lectivo as any
            let anioLectivoSource = anioLectivoRef

            if (anioLectivoRef?.id) {
                try {
                    const anioLectivoById = await getAnioLectivoById(Number(anioLectivoRef.id))
                    if (anioLectivoById) {
                        anioLectivoSource = anioLectivoById
                    }
                } catch (error) {
                    console.warn("No se pudo obtener anio lectivo por id, se usara la data embebida en esquela", error)
                }
            }

            const cortesDelAnio = buildCortesFromAnioLectivo(anioLectivoSource)
            setCortes(cortesDelAnio)

            const colores = ["bg-blue-500", "bg-yellow-500", "bg-green-500", "bg-purple-500"]
            const adaptados: CorteUI[] = cortesDelAnio.map((c, i) => ({
                ...c,
                color: colores[i % colores.length]
            }))
            setCortesUI(adaptados)

            if (cortesDelAnio.length > 0) {
                const existeCorteActivo = cortesDelAnio.some((c) => c.id === corteActivo)
                if (!existeCorteActivo) {
                    setCorteActivo(cortesDelAnio[0].id)
                }
            } else {
                setCorteActivo(null)
            }

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

    const obtenerNotaCualitativa = (valor: number): string => {
        if (!Number.isFinite(valor)) return "AI"
        const match = notasCualitativas.find(
            (nota) => valor >= nota.rango_menor && valor <= nota.rango_mayor
        )
        return match?.abreviatura ?? "AI"
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

        const notaCualitativa = obtenerNotaCualitativa(notaNum);

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
