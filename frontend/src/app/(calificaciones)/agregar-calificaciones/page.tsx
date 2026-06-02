"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { getGradosByDocenteId } from "@/actions/docentesMethods/docentesMethods"
import { getEsquelaHeadById } from "@/actions/calificaciones/esquelasHeadsMethods/esquelasHeadMethods"
import { EsquelaHeadInterface, EsquelaRowInterface } from "@/interfaces/calificaciones/EsquelaHead"
import { AnioLectivoCalendarizacionItem, Corte, NotaCualitativa } from "@/interfaces"
import { EsquelaRowPayload } from "@/interfaces/calificaciones/EsquelaRow"
import { saveEsquelaRow, updateEsquelaRow } from "@/actions/calificaciones/esquelasRowsMethods/esquelasRowsMethods"
import { getCortesEvaluativos } from "@/actions/catalogos/corteEvaluativoMethods"
import { getNotasCualitativas } from "@/actions/catalogos/notaCualitativaMethods"
import { getAnioLectivoCalendarizacion } from "@/actions/catalogos/anioLectivoCalendarizacionMethods"
import CardCortesEvaluativos from "@/components/calificaciones/CardCortesEvaluativos"
import { Asignatura, CorteUI, Estudiante } from "@/interfaces/calificaciones/AgregarCalificaciones"
import HeaderAgregarCalificaciones from "@/components/calificaciones/HeaderAgregarCalificaciones"
import TabsAsignaturas from "@/components/calificaciones/TabsAsignaturas"
import { useToast } from "@/hooks/use-toast"

export interface CalificacionesProps {
    esquelaId: number | string
    grupoId: number
    grupoNombre?: string
    isAnioActivo: boolean
    onVolver?: () => void
}

type CorteEstadoFecha = "open" | "future" | "closed" | "unconfigured"

type CorteStatus = {
    habilitado: boolean
    editable: boolean
    completo: boolean
    mensaje: string
    rango: string
    estadoFecha: CorteEstadoFecha
}

const getInitials = (nombre?: string) => {
    const partes = nombre?.trim()?.split?.(" ") ?? []
    if (partes.length === 0) return ""
    if (partes.length === 1) return (partes[0]?.[0] ?? "").toUpperCase()
    return ((partes[0][0] ?? "") + (partes[1][0] ?? "")).toUpperCase()
}

const deduplicarCortesPorId = (items: Corte[]) => {
    const unique = new Map<number, Corte>()

    items.forEach((item) => {
        if (item?.id != null && !unique.has(item.id)) {
            unique.set(item.id, item)
        }
    })

    return Array.from(unique.values())
}

const extraerCortesDesdePeriodos = (anioLectivoData: any): Corte[] => {
    const periodos = anioLectivoData?.periodos ?? anioLectivoData?.periodosLectivos ?? []

    if (!Array.isArray(periodos)) return []

    const cortes: Corte[] = []

    periodos.forEach((periodo: any) => {
        const cortesDirectos = Array.isArray(periodo?.cortes) ? periodo.cortes : []
        const cortesRelacion = Array.isArray(periodo?.cortesPeriodo)
            ? periodo.cortesPeriodo
                .map((item: any) => item?.corte)
                .filter((item: Corte | undefined) => Boolean(item))
            : []

        cortes.push(...cortesDirectos, ...cortesRelacion)
    })

    return deduplicarCortesPorId(cortes)
}

const parseCalendarDate = (value?: string | null, endOfDay = false) => {
    if (!value) return null

    const [year, month, day] = value.split("-").map(Number)
    if (![year, month, day].every((part) => Number.isFinite(part))) return null

    return new Date(year, month - 1, day, endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0, endOfDay ? 999 : 0)
}

const formatCalendarDate = (value?: string | null) => {
    const parsed = parseCalendarDate(value)
    if (!parsed) return ""

    return parsed.toLocaleDateString("es-NI", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })
}

export default function Calificaciones({
    esquelaId,
    grupoId,
    grupoNombre,
    isAnioActivo,
    onVolver,
}: CalificacionesProps) {

    const { docente } = useAuth()
    const { toast } = useToast()

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
        items.slice().sort((a, b) => (a.id ?? 0) - (b.id ?? 0))

    const mapearCortesUI = (items: Corte[]) => {
        const colores = ["bg-blue-500", "bg-yellow-500", "bg-green-500", "bg-purple-500"]
        return items.map((c, i) => ({
            ...c,
            color: colores[i % colores.length]
        }))
    }

    const verificarCorteCompleto = (corteId: number, asignaturaId?: number) => {
        if (asignaturaId == null) return false

        return estudiantes.every(est => {
            const calificacion = est.calificaciones[asignaturaId]?.[corteId]
            return typeof calificacion !== "undefined" && calificacion !== ""
        })
    }

    const cambiarCorte = (corteId: number) => {
        const estadoCorte = obtenerEstadoCorte(corteId)

        if (!estadoCorte.habilitado) {
            toast({
                title: "Corte bloqueado",
                description: estadoCorte.mensaje,
                variant: "destructive",
            })
            return
        }

        setCorteActivo(corteId)
    }

    const obtenerRangoCorte = (corte?: CorteUI) => {
        if (!corte?.fecha_inicio || !corte?.fecha_fin) return ""
        return `${formatCalendarDate(corte.fecha_inicio)} - ${formatCalendarDate(corte.fecha_fin)}`
    }

    const obtenerEstadoFechaCorte = (corte?: CorteUI) => {
        if (!corte) {
            return {
                estadoFecha: "future" as CorteEstadoFecha,
                navegable: false,
                editable: false,
                mensaje: "Corte no encontrado",
                rango: "",
            }
        }

        const rango = obtenerRangoCorte(corte)

        if (!isAnioActivo) {
            return {
                estadoFecha: "open" as CorteEstadoFecha,
                navegable: true,
                editable: false,
                mensaje: "Solo consulta",
                rango,
            }
        }

        if (!corte.fecha_inicio || !corte.fecha_fin) {
            return {
                estadoFecha: "unconfigured" as CorteEstadoFecha,
                navegable: false,
                editable: false,
                mensaje: "Sin fechas asignadas en calendarización",
                rango: "Sin fechas",
            }
        }

        const hoy = new Date()
        const hoyInicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
        const fechaInicio = parseCalendarDate(corte.fecha_inicio)
        const fechaFin = parseCalendarDate(corte.fecha_fin, true)

        if (!fechaInicio || !fechaFin) {
            return {
                estadoFecha: "unconfigured" as CorteEstadoFecha,
                navegable: false,
                editable: false,
                mensaje: "Sin fechas asignadas en calendarización",
                rango: "Sin fechas",
            }
        }

        if (hoyInicio < fechaInicio) {
            return {
                estadoFecha: "future" as CorteEstadoFecha,
                navegable: false,
                editable: false,
                mensaje: "Aún no inicia",
                rango,
            }
        }

        if (hoyInicio > fechaFin) {
            return {
                estadoFecha: "closed" as CorteEstadoFecha,
                navegable: false,
                editable: false,
                mensaje: "Fecha cerrada",
                rango,
            }
        }

        return {
            estadoFecha: "open" as CorteEstadoFecha,
            navegable: true,
            editable: true,
            mensaje: "En fecha",
            rango,
        }
    }

    const obtenerEstadoCorte = (corteId: number): CorteStatus => {
        const index = cortesUI.findIndex((corte) => corte.id === corteId)
        if (index === -1) {
            return {
                habilitado: false,
                editable: false,
                completo: false,
                mensaje: "Corte no encontrado",
                rango: "",
                estadoFecha: "future",
            }
        }

        const corte = cortesUI[index]
        const estadoFecha = obtenerEstadoFechaCorte(corte)
        const completo = asignaturaActiva != null ? verificarCorteCompleto(corte.id, asignaturaActiva) : false

        if (!isAnioActivo) {
            return {
                habilitado: true,
                editable: false,
                completo,
                mensaje: completo ? "Completado" : "Solo consulta",
                rango: estadoFecha.rango,
                estadoFecha: estadoFecha.estadoFecha,
            }
        }

        let secuenciaCompleta = true
        if (index > 0) {
            const corteAnterior = cortesUI[index - 1]
            const estadoFechaAnterior = obtenerEstadoFechaCorte(corteAnterior)
            secuenciaCompleta =
                (asignaturaActiva != null && verificarCorteCompleto(corteAnterior.id, asignaturaActiva)) ||
                estadoFechaAnterior.estadoFecha === "closed"
        }

        const habilitado = estadoFecha.navegable && secuenciaCompleta
        const editable = estadoFecha.editable && secuenciaCompleta

        let mensaje = estadoFecha.mensaje
        if (!secuenciaCompleta) {
            mensaje = "Completa el corte anterior"
        } else if (estadoFecha.estadoFecha === "open" && completo) {
            mensaje = "Completado"
        } else if (estadoFecha.estadoFecha === "open") {
            mensaje = "En progreso"
        }

        return {
            habilitado,
            editable,
            completo,
            mensaje,
            rango: estadoFecha.rango,
            estadoFecha: estadoFecha.estadoFecha,
        }
    }

    const estadoCorteActivo = corteActivo != null ? obtenerEstadoCorte(corteActivo) : null

    // ---------- Cargar cortes segun anio lectivo ----------
    useEffect(() => {
        const fetchCortes = async () => {
            try {
                const anioLectivoData = esquela?.grupo_asignatura?.organizacionEscolar?.anio_lectivo
                const anioLectivoId = Number(anioLectivoData?.id ?? 0)
                const cortesDesdeRelacion = anioLectivoData?.cortesAnioLectivo?.map((item: any) => item.corte) ?? []
                const cortesDesdeAnio = anioLectivoData?.cortes ?? []
                const cortesDesdePeriodos = extraerCortesDesdePeriodos(anioLectivoData)
                const cortesFromAnio = deduplicarCortesPorId([
                    ...cortesDesdeRelacion,
                    ...cortesDesdeAnio,
                    ...cortesDesdePeriodos,
                ])

                let ordered: Corte[] = []

                if (cortesFromAnio.length > 0) {
                    ordered = ordenarCortes(cortesFromAnio)
                } else if (!anioLectivoData) {
                    const response = await getCortesEvaluativos()
                    if (Array.isArray(response)) {
                        ordered = ordenarCortes(deduplicarCortesPorId(response))
                    }
                }

                let calendarizacionMap = new Map<number, AnioLectivoCalendarizacionItem>()
                if (anioLectivoId) {
                    const modalidadId = Number(
                        (esquela as any)?.grupo_asignatura?.turno?.modalidad?.id ?? 0
                    )
                    try {
                        const calendarizacion = modalidadId
                            ? await getAnioLectivoCalendarizacion(anioLectivoId, modalidadId)
                            : await getAnioLectivoCalendarizacion(anioLectivoId, 0)
                        calendarizacionMap = new Map(
                            (calendarizacion ?? [])
                                .filter((item) => item?.corte_id != null && item.isActive !== false)
                                .map((item) => [Number(item.corte_id), item]),
                        )
                    } catch (error) {
                        console.warn("No se pudo cargar la calendarización del año lectivo", error)
                    }
                }

                setCortes(ordered)

                if (ordered.length > 0 && (corteActivo == null || !ordered.some(c => c.id === corteActivo))) {
                    setCorteActivo(ordered[0].id)
                }

                setCortesUI(
                    mapearCortesUI(ordered).map((corte) => {
                        const item = calendarizacionMap.get(Number(corte.id))
                        return {
                            ...corte,
                            fecha_inicio: item?.fecha_inicio ?? null,
                            fecha_fin: item?.fecha_fin ?? null,
                            observacion: item?.observacion ?? null,
                        }
                    }),
                )
            } catch (error) {
                console.error("Error al cargar los cortes evaluativos", error)
            }
        }

        if (esquela) fetchCortes()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [esquela])

    useEffect(() => {
        if (asignaturaActiva == null || cortesUI.length === 0) return

        const corteSeleccionadoEsValido =
            corteActivo != null && obtenerEstadoCorte(corteActivo).habilitado

        if (corteSeleccionadoEsValido) return

        const siguienteDisponible = cortesUI.find((corte) => obtenerEstadoCorte(corte.id).habilitado)

        if (siguienteDisponible && siguienteDisponible.id !== corteActivo) {
            setCorteActivo(siguienteDisponible.id)
            return
        }

        if (corteActivo == null && cortesUI[0]?.id != null) {
            setCorteActivo(cortesUI[0].id)
        }
    }, [asignaturaActiva, corteActivo, cortesUI, estudiantes, isAnioActivo])

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
                                if (ge?.estudiante && ge?.activo !== false) {
                                    rawStudents.push(ge.estudiante)
                                }
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

    const sincronizarFilaGuardada = (savedRow?: EsquelaRowInterface) => {
        if (!savedRow?.id) return

        setEsquela(prev => {
            if (!prev) return prev

            const filasActuales = Array.isArray(prev.esquelaRow) ? prev.esquelaRow : []
            const filaIndex = filasActuales.findIndex((row) => {
                if (Number(row?.id) === Number(savedRow.id)) {
                    return true
                }

                return (
                    Number(row?.estudiante?.id) === Number(savedRow.estudiante?.id) &&
                    Number(row?.asignatura?.id) === Number(savedRow.asignatura?.id) &&
                    Number(row?.corte?.id) === Number(savedRow.corte?.id)
                )
            })

            const siguientesFilas = filaIndex >= 0
                ? filasActuales.map((row, index) => index === filaIndex ? savedRow : row)
                : [...filasActuales, savedRow]

            return {
                ...prev,
                esquelaRow: siguientesFilas,
            }
        })
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

        const estadoActual = obtenerEstadoCorte(corteActivo)
        if (isAnioActivo && !estadoActual.editable) {
            toast({
                title: "Corte bloqueado",
                description: estadoActual.mensaje,
                variant: "destructive",
            })
            return
        }

        const raw = String(nota ?? "").trim();

        // Validaciones
        if (raw === "") {
            toast({
                title: "Nota requerida",
                description: "Debe ingresar una nota.",
                variant: "destructive",
            })
            return
        }
        if (!/^\d{1,3}$/.test(raw)) {
            toast({
                title: "Nota inválida",
                description: "Solo se permiten números enteros.",
                variant: "destructive",
            })
            return
        }

        const notaNum = Number(raw);
        if (notaNum < 0 || notaNum > 100) {
            toast({
                title: "Rango inválido",
                description: "La nota debe estar entre 0 y 100.",
                variant: "destructive",
            })
            return
        }

        const corteEncontrado = cortes.find(c => c.id === corteActivo);
        if (!corteEncontrado) {
            toast({
                title: "Corte no encontrado",
                description: "No se encontró el corte seleccionado.",
                variant: "destructive",
            })
            return
        }

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
            const filasBD: EsquelaRowInterface[] = esquela?.esquelaRow ?? [];
            const rowBD = filasBD.find(r => {
                const estudianteIdBD = r?.estudiante?.id
                const asignaturaIdBD = r?.asignatura?.id
                const corteIdBD = r?.corte?.id

                if (estudianteIdBD == null || asignaturaIdBD == null || corteIdBD == null) return false

                return (
                    Number(estudianteIdBD) === Number(estudiante.id) &&
                    Number(asignaturaIdBD) === Number(asignaturaId) &&
                    Number(corteIdBD) === Number(corteActivo)
                )
            });
            const shouldUpdate = Boolean(rowBD)

            if (shouldUpdate && rowBD) {
                savedRow = await updateEsquelaRow(rowBD.id, payload);

            } else {
                // 👉 Guardar nueva nota
                savedRow = await saveEsquelaRow(payload);
            }

            sincronizarFilaGuardada(savedRow)

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

            toast({
                title: shouldUpdate ? "Nota actualizada" : "Nota guardada",
                description: "La nota se guardó correctamente.",
                variant: "success",
            })
        } catch (error) {
            console.error("Error al guardar nota:", error);
            setGuardando(false);
            toast({
                title: "Error al guardar",
                description: "Ocurrió un error al guardar la nota.",
                variant: "destructive",
            })
        }
    };

    // --------- Avanzar al siguiente corte (solo cambia corteActivo localmente) ----------
    const avanzarCorte = () => {
        if (corteActivo == null || cortes.length === 0) return

        const index = cortes.findIndex(c => c.id === corteActivo)
        if (index < cortes.length - 1) {
            const siguienteCorte = cortes[index + 1]
            const estadoSiguienteCorte = obtenerEstadoCorte(siguienteCorte.id)
            if (!estadoSiguienteCorte.habilitado) {
                toast({
                    title: "Corte bloqueado",
                    description: estadoSiguienteCorte.mensaje,
                    variant: "destructive",
                })
                return
            }

            cambiarCorte(siguienteCorte.id)
            toast({
                title: "Corte cambiado",
                description: `Corte actual: ${siguienteCorte.corte}`,
                variant: "default",
            })
        } else {
            toast({
                title: "Último corte",
                description: "Ya estás en el último corte.",
                variant: "default",
            })
        }
    }

    const anioLectivo = esquela?.grupo_asignatura.organizacionEscolar.anio_lectivo.anio_lectivo
    const tipoPeriodizacion =
        (esquela?.grupo_asignatura?.organizacionEscolar?.anio_lectivo as any)?.tipo_periodizacion ??
        (esquela?.grupo_asignatura?.organizacionEscolar?.anio_lectivo as any)?.periodos?.[0]?.tipo ??
        (esquela?.grupo_asignatura?.organizacionEscolar?.anio_lectivo as any)?.periodosLectivos?.[0]?.tipo

    const puedeAvanzarCorte = (() => {
        if (!isAnioActivo || corteActivo == null || cortes.length === 0) return false

        const index = cortes.findIndex((c) => c.id === corteActivo)
        if (index === -1 || index >= cortes.length - 1) return false

        return obtenerEstadoCorte(cortes[index + 1].id).habilitado
    })()

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <HeaderAgregarCalificaciones
                grupoNombre={grupoNombre}
                anioId={anioLectivo}
                onVolver={onVolver}
            />

            {/* Card de cortes */}
            <CardCortesEvaluativos
                corteActivo={corteActivo}
                setCorteActivo={cambiarCorte}
                cortesUI={cortesUI}
                tipoPeriodizacion={tipoPeriodizacion}
                getCorteStatus={obtenerEstadoCorte}
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
                puedeAvanzarCorte={puedeAvanzarCorte}
                guardando={guardando}
                isAnioActivo={isAnioActivo}
                isCorteEditable={Boolean(estadoCorteActivo?.editable)}
                corteBloqueadoMensaje={estadoCorteActivo?.mensaje ?? "Selecciona un corte disponible"}
            />
        </div>
    )
}
