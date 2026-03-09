
"use client"
import React, { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "../ui/button"
import { EsquelaHeadInterface } from "@/interfaces/calificaciones/EsquelaHead"
import { getEsquelaHeadById } from "@/actions/calificaciones/esquelasHeadsMethods/esquelasHeadMethods"
import { getEsquelaRowByEstudianteAndAnio } from "@/actions/calificaciones/esquelasRowsMethods/esquelasRowsMethods"
import { getNotasCualitativas } from "@/actions/catalogos/notaCualitativaMethods"
import { EsquelaHead } from "./EsquelaHead"
import ExcelJS, { Borders, BorderStyle } from "exceljs"
import { saveAs } from "file-saver"
import { getCentros } from "@/actions/centroMethods/centroEducativoMethods"
import { CentroEscolar } from "@/interfaces/centroInterface"
import { Corte, NotaCualitativa } from "@/interfaces"


/* ================= HELPERS ================= */
function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .map(n => n.charAt(0))
    .join("")
    .substring(0, 2)
    .toUpperCase()
}

/* ================= TYPES ================= */

interface Estudiante {
  id: number
  name: string
  lastName: string
  studentCode: string
  gender?: { gender?: string }
  profileImage?: string | null
}

interface GEItem {
  estudiante: Estudiante
}

interface GADItem {
  asignatura: { id: number; asignatura: string }
  gruposConEstudiantes: GEItem[]
}

interface EsquelaRowProps {
  esquelaHeadId: number
  estudianteId?: number
}

type VistaType = "ALL" | "FINAL" | `C-${number}` | `S-${number}`

type Columna = {
  key: string
  label: string
  corteIds: number[]
  type: "CORTE" | "SEMESTRE" | "FINAL"
}

/* ================= COMPONENT ================= */

export function EsquelaRow({ esquelaHeadId, estudianteId }: EsquelaRowProps) {
  const [esquelaHead, setEsquelaHead] = useState<EsquelaHeadInterface>()
  const [calificaciones, setCalificaciones] = useState<any[]>([])
  const [vista, setVista] = useState<VistaType>("ALL")
  const [centro, setCentro] = useState<CentroEscolar | null>(null)
  const [notasCualitativas, setNotasCualitativas] = useState<NotaCualitativa[]>([])


  useEffect(() => {
    const fetchData = async () => {
      const response = await getEsquelaHeadById(esquelaHeadId)
      setEsquelaHead(response)

      const anio =
        response?.grupo_asignatura?.organizacionEscolar?.anio_lectivo?.anio_lectivo ?? 0

      const estudiantes =
        response?.grupo_asignatura?.grupoAsignaturaDocente
          ?.flatMap((g: any) =>
            g.gruposConEstudiantes.map((ge: any) => ge.estudiante)
          )
          .filter((v: any): v is Estudiante => Boolean(v && v.id))
          .filter(
            (v: Estudiante, i: number, self: Estudiante[]) =>
              self.findIndex((s) => s.id === v.id) === i
          ) ?? []

      if (estudiantes.length) {
        const rows = await Promise.all(
          estudiantes.map((e: any) =>
            getEsquelaRowByEstudianteAndAnio(e.id, anio)
          )
        )
        setCalificaciones(rows.flat())
      }
    }


    const fetchCentro = async () => {
      try {
        const centros = await getCentros()
        // Si solo tienes un centro registrado
        setCentro(centros[0])
      } catch (error) {
        console.error("Error cargando centro:", error)
      }
    }
    fetchData()
    fetchCentro()
  }, [esquelaHeadId])

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
        console.error("Error cargando notas cualitativas:", error)
      }
    }

    fetchNotas()
  }, [])

  const asignaturas: GADItem[] =
    esquelaHead?.grupo_asignatura?.grupoAsignaturaDocente ?? []

  const estudiantes: Estudiante[] =
    asignaturas
      .flatMap((g) => g.gruposConEstudiantes.map((ge) => ge.estudiante))
      .filter((v): v is Estudiante => Boolean(v && v.id))
      .filter((v, i, self) => self.findIndex((s) => s.id === v.id) === i)
      .filter((est) => !estudianteId || est.id === estudianteId)

  const findNota = (estId: number, asigId: number, corteId: number) => {
    const row = calificaciones.find(
      (r) =>
        r?.estudiante?.id === estId &&
        r?.asignatura?.id === asigId &&
        r?.corte?.id === corteId
    )

    return {
      cuant: row?.notaCuantitativa ?? 0,
      cual: row?.notaCualitativa ?? "AI"
    }
  }

  const getQualitativeGrade = (grade: number): string => {
    if (!Number.isFinite(grade)) return "AI"
    const match = notasCualitativas.find(
      (nota) => grade >= nota.rango_menor && grade <= nota.rango_mayor
    )
    return match?.abreviatura ?? "AI"
  }

  const anioLectivoData = esquelaHead?.grupo_asignatura?.organizacionEscolar?.anio_lectivo

  const ordenarCortes = (items: Corte[]) =>
    [...items].sort((a, b) => (a.id ?? 0) - (b.id ?? 0))

  const cortesDisponibles = React.useMemo(() => {
    const cortesFromAnio =
      anioLectivoData?.cortes ??
      anioLectivoData?.cortesAnioLectivo?.map((item) => item.corte) ?? []

    if (cortesFromAnio.length > 0) {
      return ordenarCortes(cortesFromAnio)
    }

    const unique = new Map<number, Corte>()
    calificaciones.forEach((row) => {
      const corte = row?.corte
      if (corte?.id) {
        unique.set(corte.id, corte)
      }
    })

    return ordenarCortes(Array.from(unique.values()))
  }, [anioLectivoData, calificaciones])

  const semestres = React.useMemo(() => {
    const map = new Map<number, { id: number; label: string; cortes: Corte[] }>()
    cortesDisponibles.forEach((corte) => {
      const id = corte.semestre?.id ?? 0
      const label = corte.semestre?.semestre ?? "Sin semestre"
      const current = map.get(id)
      if (current) {
        current.cortes.push(corte)
      } else {
        map.set(id, { id, label, cortes: [corte] })
      }
    })
    return Array.from(map.values())
  }, [cortesDisponibles])

  const getColumnas = React.useCallback((): Columna[] => {
    if (cortesDisponibles.length === 0) return []

    if (vista === "ALL") {
      const allCorteIds = cortesDisponibles.map((corte) => corte.id)
      const columnas: Columna[] = []

      semestres.forEach((sem) => {
        sem.cortes.forEach((corte) => {
          columnas.push({
            key: `corte-${corte.id}`,
            label: corte.abreviatura || corte.corte,
            corteIds: [corte.id],
            type: "CORTE",
          })
        })

        columnas.push({
          key: `semestre-${sem.id}`,
          label: sem.label,
          corteIds: sem.cortes.map((corte) => corte.id),
          type: "SEMESTRE",
        })
      })

      columnas.push({
        key: "final",
        label: "Nota Final",
        corteIds: allCorteIds,
        type: "FINAL",
      })

      return columnas
    }

    if (vista === "FINAL") {
      return [
        {
          key: "final",
          label: "Nota Final",
          corteIds: cortesDisponibles.map((corte) => corte.id),
          type: "FINAL",
        },
      ]
    }

    if (vista.startsWith("C-")) {
      const corteId = Number(vista.replace("C-", ""))
      const corte = cortesDisponibles.find((item) => item.id === corteId)
      if (!corte) return []
      return [
        {
          key: `corte-${corte.id}`,
          label: corte.abreviatura || corte.corte,
          corteIds: [corte.id],
          type: "CORTE",
        },
      ]
    }

    if (vista.startsWith("S-")) {
      const semestreId = Number(vista.replace("S-", ""))
      const sem = semestres.find((item) => item.id === semestreId)
      if (!sem) return []

      const columnas: Columna[] = [
        {
          key: `semestre-${sem.id}`,
          label: sem.label,
          corteIds: sem.cortes.map((corte) => corte.id),
          type: "SEMESTRE",
        },
      ]

      return columnas
    }

    return []
  }, [vista, cortesDisponibles, semestres])

  const columnas = getColumnas()

  const promedioCortes = (estId: number, asigId: number, corteIds: number[]) => {
    const values = corteIds
      .map((id) => findNota(estId, asigId, id).cuant)
      .filter((v) => Number.isFinite(v))
    if (values.length === 0) return 0
    return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length)
  }
  /* ==========================
    cOLORES ESTILOS DE LA TABLA
 ========================== */

  const exportToExcel = async () => {
    if (columnas.length === 0) {
      return
    }
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet("Esquela")
    sheet.properties.defaultRowHeight = 22

    const borderAll: Partial<Borders> = {
      top: { style: "thin" as BorderStyle },
      left: { style: "thin" as BorderStyle },
      bottom: { style: "thin" as BorderStyle },
      right: { style: "thin" as BorderStyle }
    }


    const columnasExport = columnas
    const totalColumns = 4 + asignaturas.length * (columnasExport.length * 2)


    /* ==========================
           ENCABEZADO GENERAL
        ========================== */
    sheet.mergeCells(1, 1, 1, totalColumns)
    sheet.getCell("A1").value = "MINISTERIO DE EDUCACION"
    sheet.getCell("A1").font = { bold: true, size: 12 }
    sheet.getCell("A1").alignment = { horizontal: "center" }
    sheet.mergeCells(2, 1, 2, totalColumns)
    sheet.getCell("A2").value = "MINED NUEVA GUINEA"
    sheet.getCell("A2").font = { bold: true, size: 12 }
    sheet.getCell("A2").alignment = { horizontal: "center" }

    sheet.mergeCells(3, 1, 3, Math.floor(totalColumns / 2))
    sheet.getCell("A3").value = ` CALIFICACIONES DE ${esquelaHead?.grupo_asignatura?.turno.turno}`
    sheet.getCell("A3").font = { bold: true, size: 12 }
    sheet.getCell("A3").alignment = { horizontal: "center" }
    sheet.mergeCells(
      3,
      Math.floor(totalColumns / 2) + 1,
      3,
      totalColumns
    )
    sheet.getCell(3, Math.floor(totalColumns / 2) + 1).value = `${centro?.nombreCentro ?? ""} `
    sheet.getCell(3, Math.floor(totalColumns / 2) + 1).font = { bold: true }
    sheet.getCell(3, Math.floor(totalColumns / 2) + 1).alignment = { horizontal: 'center' }


    const colEst = Math.floor(totalColumns * 0.35)
    const colCentro = Math.floor(totalColumns * 0.25)
    const colCorte = Math.floor(totalColumns * 0.2)
    const colSeccion = totalColumns - (colEst + colCentro + colCorte)
    // ===== FILA 4: CÓDIGOS / CORTE / SECCIÓN =====
    let colStart = 1

    // Código del establecimiento
    sheet.mergeCells(4, colStart, 4, colStart + colEst - 1)
    sheet.getCell(4, colStart).value =
      `CÓDIGO DEL ESTABLECIMIENTO: ${centro?.codigoEstablecimiento ?? ""}`
    sheet.getCell(4, colStart).font = { bold: true }
    sheet.getCell(4, colStart).alignment = { horizontal: "center" }
    colStart += colEst

    // Código del centro
    sheet.mergeCells(4, colStart, 4, colStart + colCentro - 1)
    sheet.getCell(4, colStart).value = `CÓDIGO DE CENTRO: ${centro?.codigoCentro ?? ""}`
    sheet.getCell(4, colStart).font = { bold: true }
    sheet.getCell(4, colStart).alignment = { horizontal: "center" }
    colStart += colCentro

    // Corte
    sheet.mergeCells(4, colStart, 4, colStart + colCorte - 1)
    const vistaLabel = (() => {
      if (vista === "ALL") return "COMPLETO"
      if (vista === "FINAL") return "NOTA FINAL"
      if (vista.startsWith("C-")) {
        const corteId = Number(vista.replace("C-", ""))
        const corte = cortesDisponibles.find((item) => item.id === corteId)
        return corte?.abreviatura || corte?.corte || "CORTE"
      }
      if (vista.startsWith("S-")) {
        const semestreId = Number(vista.replace("S-", ""))
        return semestres.find((item) => item.id === semestreId)?.label || "SEMESTRE"
      }
      return "COMPLETO"
    })()

    sheet.getCell(4, colStart).value = vistaLabel
    sheet.getCell(4, colStart).font = { bold: true }
    sheet.getCell(4, colStart).alignment = { horizontal: "center" }
    colStart += colCorte

    // Sección
    sheet.mergeCells(4, colStart, 4, totalColumns)
    sheet.getCell(4, colStart).value = `${esquelaHead?.grupo_asignatura?.seccion.seccion ?? ""}`
    sheet.getCell(4, colStart).font = { bold: true }
    sheet.getCell(4, colStart).alignment = { horizontal: "center" }

    sheet.mergeCells(5, 1, 5, Math.floor(totalColumns / 2))
    sheet.getCell("A5").value = `TURNO: ${esquelaHead?.grupo_asignatura?.turno.modalidad?.modalidad ?? ""}`
    sheet.getCell("A5").font = { bold: true }
    sheet.getCell("A5").alignment = { horizontal: "center" }
    sheet.mergeCells(
      5,
      Math.floor(totalColumns / 2) + 1,
      5,
      totalColumns
    )
    sheet.getCell(5, Math.floor(totalColumns / 2) + 1).value = `ASIGNATURAS CURSO ESCOLAR ${esquelaHead?.grupo_asignatura.organizacionEscolar.anio_lectivo.anio_lectivo}`
    sheet.getCell(5, Math.floor(totalColumns / 2) + 1).font = { bold: true }
    sheet.getCell(5, Math.floor(totalColumns / 2) + 1).alignment = { horizontal: 'center' }
    const startRow = sheet.rowCount + 1

    /* =====================================================
      HEADER ESQUELA (DINAMICO)
    ===================================================== */

    const header1Data: any[] = [
      "N°",
      "Nombres y Apellidos",
      "Código del estudiante",
      "Sexo"
    ]

    asignaturas.forEach(a => {
      header1Data.push(a.asignatura.asignatura)
      for (let i = 1; i < columnasExport.length * 2; i++) {
        header1Data.push("")
      }
    })

    const header1 = sheet.addRow(header1Data)

    let colIndex = 5
    asignaturas.forEach(() => {
      sheet.mergeCells(
        header1.number,
        colIndex,
        header1.number,
        colIndex + columnasExport.length * 2 - 1
      )
      colIndex += columnasExport.length * 2
    })

    header1.eachCell(cell => {
      cell.font = { bold: true }
      cell.alignment = { horizontal: "center", vertical: "middle" }
      cell.border = borderAll
    })



    const header2Data: any[] = ["", "", "", ""]

    asignaturas.forEach(() => {
      columnasExport.forEach((col) => {
        header2Data.push(col.label)
        header2Data.push("")
      })
    })

    const header2 = sheet.addRow(header2Data)

    let col2 = 5
    asignaturas.forEach(() => {
      columnasExport.forEach(() => {
        sheet.mergeCells(header2.number, col2, header2.number, col2 + 1)
        col2 += 2
      })
    })

    header2.eachCell(cell => {
      cell.font = { bold: true }
      cell.alignment = { horizontal: "center", vertical: "middle" }
      cell.border = borderAll
    })

    const header3Data: any[] = ["", "", "", ""]

    asignaturas.forEach(() => {
      columnasExport.forEach(() => {
        header3Data.push("CUAL")
        header3Data.push("CUANT")
      })
    })

    const header3 = sheet.addRow(header3Data)

    header3.eachCell(cell => {
      cell.font = { bold: true }
      cell.alignment = { horizontal: "center", vertical: "middle" }
      cell.border = borderAll
    })

    /* ==========================
    DATOS
    ========================== */

    estudiantes.forEach((est, index) => {
      const rowData = [
        index + 1,
        ` ${est.name} ${est.lastName}`,
        est.studentCode,
        est.gender?.gender ?? ""
      ]

      asignaturas.forEach(a => {
        columnasExport.forEach((col) => {
          const cuant = col.type === "CORTE"
            ? findNota(est.id, a.asignatura.id, col.corteIds[0]).cuant
            : promedioCortes(est.id, a.asignatura.id, col.corteIds)
          rowData.push(getQualitativeGrade(cuant))
          rowData.push(cuant)
        })
      })

      const row = sheet.addRow(rowData)

      row.eachCell(cell => {
        cell.alignment = { horizontal: "center" }
        cell.border = borderAll
        cell.font = { bold: true }

        // 🔴 PINTAR NOTAS BAJAS
        if (
          (typeof cell.value === "number" && cell.value < 60) ||
          cell.value === "AI"
        ) {
          cell.font = { bold: true, color: { argb: "FFFF0000" } }
        }
      })

    })

    sheet.columns.forEach((col, i) => {
      switch (i) {
        case 0: // N°
          col.width = 5
          break
        case 1: // Nombres y Apellidos
          col.width = 35
          break
        case 2: // Código del estudiante
          col.width = 18
          break
        case 3: // Sexo
          col.width = 6
          break
        default: // Notas
          col.width = 6
      }
    })


    const buffer = await workbook.xlsx.writeBuffer()
    saveAs(new Blob([buffer]), "Esquela.xlsx")
  }

  const botones: { key: VistaType; label: string }[] = []
  botones.push({ key: "ALL", label: "Completa" })
  semestres.forEach((sem) => {
    sem.cortes.forEach((corte) => {
      botones.push({
        key: `C-${corte.id}` as VistaType,
        label: corte.abreviatura || corte.corte,
      })
    })
    botones.push({ key: `S-${sem.id}` as VistaType, label: sem.label })
  })
  botones.push({ key: "FINAL", label: "Nota Final" })


  return (
    <div className="space-y-6 bg-gradient-to-br from-rose-50 via-pink-50 to-white min-h-screen p-4">

      <EsquelaHead
        nombreCentro={centro?.nombreCentro ?? ""}
        grade={esquelaHead?.grupo_asignatura?.grado.grades ?? ""}
        section={esquelaHead?.grupo_asignatura?.seccion.seccion ?? ""}
        shift={esquelaHead?.grupo_asignatura?.turno.turno ?? ""}
        year={esquelaHead?.grupo_asignatura?.organizacionEscolar?.anio_lectivo?.anio_lectivo ?? 0}
        modality={esquelaHead?.grupo_asignatura?.turno.modalidad?.modalidad ?? ""}
        teacherName={esquelaHead?.grupo_asignatura?.docenteGuia.nombres ?? ""}
      />

      {/* ===== BOTONES ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {botones.map((b) => (
          <Button
            key={b.key}
            onClick={() => setVista(b.key)}
            variant={vista === b.key ? "default" : "outline"}
          >
            {b.label}
          </Button>
        ))}
        <Button
          variant="secondary"
          onClick={() => exportToExcel()}
        >
          Exportar Excel
        </Button>

      </div>

      {/* ===== TABLA ===== */}
      <Card className="shadow-2xl border-0 bg-white/95">
        <CardContent className="p-0 overflow-x-auto">
          <Table>

            {/* ================= HEADER ================= */}
            <TableHeader>

              {/* PRINCIPAL */}
              <TableRow className="bg-gradient-to-r from-rose-100 to-pink-100 border-b-2 border-rose-200">
                <TableHead className="text-center font-bold text-rose-900">Nº</TableHead>
                <TableHead className="text-center font-bold text-rose-900">Foto</TableHead>
                <TableHead className="text-center font-bold text-rose-900">Estudiante</TableHead>
                <TableHead className="text-center font-bold text-rose-900">Código</TableHead>
                <TableHead className="text-center font-bold text-rose-900">Sexo</TableHead>

                {asignaturas.map((a, idx) => (
                  <TableHead
                    key={idx}
                    colSpan={Math.max(columnas.length, 1) * 2}
                    className={`text-center font-bold
                      ${idx % 3 === 0 ? "bg-emerald-100 text-emerald-900"
                        : idx % 3 === 1 ? "bg-amber-100 text-amber-900"
                          : "bg-violet-100 text-violet-900"}`}
                  >
                    {a.asignatura.asignatura}
                  </TableHead>
                ))}
              </TableRow>

              {/* PARCIALES */}
              <TableRow className="bg-rose-50 border-b border-rose-200">
                <TableHead colSpan={5}></TableHead>
                {asignaturas.map((_, idx) => (
                  <React.Fragment key={idx}>
                    {columnas.map((col) => (
                      <TableHead
                        key={col.key}
                        colSpan={2}
                        className={`text-xs text-center font-semibold
                          ${idx % 3 === 0 ? "bg-emerald-50 text-emerald-800"
                            : idx % 3 === 1 ? "bg-amber-50 text-amber-800"
                              : "bg-violet-50 text-violet-800"}`}
                      >
                        {col.label}
                      </TableHead>
                    ))}
                  </React.Fragment>
                ))}
              </TableRow>

              {/* CUAL / CUANT */}
              <TableRow className="bg-rose-100 border-b border-rose-200">
                <TableHead colSpan={5}></TableHead>
                {asignaturas.map((_, idx) => (
                  <React.Fragment key={idx}>
                    {columnas.map((col) => (
                      <React.Fragment key={col.key}>
                        <TableHead className={`text-xs text-center
                          ${idx % 3 === 0 ? "bg-emerald-50"
                            : idx % 3 === 1 ? "bg-amber-50"
                              : "bg-violet-50"}`}>
                          Cual.
                        </TableHead>
                        <TableHead className={`text-xs text-center
                          ${idx % 3 === 0 ? "bg-emerald-50"
                            : idx % 3 === 1 ? "bg-amber-50"
                              : "bg-violet-50"}`}>
                          Cuant.
                        </TableHead>
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ))}
              </TableRow>
            </TableHeader>

            {/* ================= BODY ================= */}
            <TableBody>
              {estudiantes.map((est, index) => (
                <TableRow key={est.id}>
                  <TableCell className="text-center font-bold">{index + 1}</TableCell>

                  <TableCell>
                    <Avatar>
                      {est.profileImage && (
                        <AvatarImage src={`${process.env.NEXT_PUBLIC_API_UPLOADS}${est.profileImage}`} />
                      )}
                      <AvatarFallback>{getInitials(est.name)}</AvatarFallback>
                    </Avatar>
                  </TableCell>

                  <TableCell className="font-bold text-center">{est.name}</TableCell>
                  <TableCell className="text-center">{est.studentCode}</TableCell>
                  <TableCell className="text-center">{est.gender?.gender ?? "—"}</TableCell>

                  {asignaturas.map((a, aIdx) =>
                    columnas.map((col) => {
                      const cuant = col.type === "CORTE"
                        ? findNota(est.id, a.asignatura.id, col.corteIds[0]).cuant
                        : promedioCortes(est.id, a.asignatura.id, col.corteIds)

                      const cual = getQualitativeGrade(cuant)

                      const bgColor =
                        aIdx % 3 === 0
                          ? "bg-emerald-50"
                          : aIdx % 3 === 1
                            ? "bg-amber-50"
                            : "bg-violet-50"

                      const isFail = cuant < 60 || cual === "AI"

                      return (
                        <React.Fragment key={`${aIdx}-${col.key}`}>
                          <TableCell
                            className={`text-center font-semibold ${bgColor}
                              ${isFail ? "text-red-600 font-bold" : ""}`}
                          >
                            {cual}
                          </TableCell>
                          <TableCell
                            className={`text-center font-bold ${bgColor}
                              ${cuant < 60 ? "text-red-600" : ""}`}
                          >
                            {cuant}
                          </TableCell>
                        </React.Fragment>
                      )
                    })
                  )}
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </CardContent>
      </Card>
    </div>
  )
}