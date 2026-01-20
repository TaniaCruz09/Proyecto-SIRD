
"use client"
import React, { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "../ui/button"
import { EsquelaHeadInterface } from "@/interfaces/calificaciones/EsquelaHead"
import { getEsquelaHeadById } from "@/actions/calificaciones/esquelasHeadsMethods/esquelasHeadMethods"
import { getEsquelaRowByEstudianteAndAnio } from "@/actions/calificaciones/esquelasRowsMethods/esquelasRowsMethods"
import { EsquelaHead } from "./EsquelaHead"
import ExcelJS, { Borders, BorderStyle } from "exceljs"
import { saveAs } from "file-saver"
import { getCentros } from "@/actions/centroMethods/centroEducativoMethods"
import { CentroEscolar } from "@/interfaces/centroInterface"


/* ================= HELPERS ================= */

function getQualitativeGrade(grade: number): string {
  if (grade >= 90) return "AA"
  if (grade >= 76) return "AS"
  if (grade >= 60) return "AF"
  return "AI"
}

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
}

type VistaType = "ALL" | 0 | 1 | 2 | 3 | 4 | 5 | 6

/* ================= COMPONENT ================= */

export function EsquelaRow({ esquelaHeadId }: EsquelaRowProps) {
  const [esquelaHead, setEsquelaHead] = useState<EsquelaHeadInterface>()
  const [calificaciones, setCalificaciones] = useState<any[]>([])
  const [vista, setVista] = useState<VistaType>("ALL")
  const [centro, setCentro] = useState<CentroEscolar | null>(null)


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
          .filter(
            (v: any, i: number, self: any[]) =>
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

  const asignaturas: GADItem[] =
    esquelaHead?.grupo_asignatura?.grupoAsignaturaDocente ?? []

  const estudiantes: Estudiante[] =
    asignaturas
      .flatMap((g) => g.gruposConEstudiantes.map((ge) => ge.estudiante))
      .filter((v, i, self) => self.findIndex((s) => s.id === v.id) === i)

  const findNota = (estId: number, asigId: number, corteId: number) => {
    const row = calificaciones.find(
      (r) =>
        r.estudiante.id === estId &&
        r.asignatura.id === asigId &&
        r.corte.id === corteId
    )

    return {
      cuant: row?.notaCuantitativa ?? 0,
      cual: row?.notaCualitativa ?? "AI"
    }
  }

  const cortes = [1, 2, 1, 3, 4, 3, 4]
  /* ==========================
    cOLORES ESTILOS DE LA TABLA
 ========================== */

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet("Esquela")
    sheet.properties.defaultRowHeight = 22

    const borderAll: Partial<Borders> = {
      top: { style: "thin" as BorderStyle },
      left: { style: "thin" as BorderStyle },
      bottom: { style: "thin" as BorderStyle },
      right: { style: "thin" as BorderStyle }
    }


    const cortesLabels = [
      "1er Parcial",
      "2do Parcial",
      "1er Semestre",
      "3er Parcial",
      "4to Parcial",
      "2do Semestre",
      "Nota Final"
    ]

    const cortesActivos =
      vista === "ALL"
        ? cortesLabels.map((_, i) => i)
        : [vista]

    const totalColumns =
      4 + asignaturas.length * (cortesActivos.length * 2)


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
    sheet.getCell(4, colStart).value =
      `${vista === "ALL" ? "COMPLETO" : cortesLabels[vista]}`
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
       HEADER SEGÚN TIPO DE ESQUELA
    ===================================================== */

    if (vista === "ALL") {
      /* ==========================================
         🔵 HEADER ESQUELA COMPLETA (HORIZONTAL)
      ========================================== */

      const header1Data: any[] = [
        "N°",
        "Nombres y Apellidos",
        "Código del estudiante",
        "Sexo"
      ]

      asignaturas.forEach(a => {
        header1Data.push(a.asignatura.asignatura)
        for (let i = 1; i < cortesLabels.length * 2; i++) {
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
          colIndex + cortesLabels.length * 2 - 1
        )
        colIndex += cortesLabels.length * 2
      })

      header1.eachCell(cell => {
        cell.font = { bold: true }
        cell.alignment = { horizontal: "center", vertical: "middle" }
        cell.border = borderAll
      })



      const header2Data: any[] = ["", "", "", ""]

      asignaturas.forEach(() => {
        cortesLabels.forEach(label => {
          header2Data.push(label)
          header2Data.push("")
        })
      })

      const header2 = sheet.addRow(header2Data)

      let col2 = 5
      asignaturas.forEach(() => {
        cortesLabels.forEach(() => {
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
        cortesLabels.forEach(() => {
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


    } else {
      /* ==========================================
         🟢 HEADER ESQUELA SIMPLE (VERTICAL)
      ========================================== */

      const h1 = sheet.addRow([])
      const h2 = sheet.addRow([])

      h1.height = 110
      h2.height = 60

      const base = ["N°", "Nombres y Apellidos", "Código del estudiante", "Sexo"]

      base.forEach((t, i) => {
        sheet.mergeCells(h1.number, i + 1, h2.number, i + 1)
        const cell = sheet.getCell(h1.number, i + 1)
        cell.value = t
        cell.font = { bold: true }
        cell.border = borderAll
        cell.alignment =
          t === "Sexo"
            ? { textRotation: 90, vertical: "middle", horizontal: "center" }
            : { horizontal: "center", vertical: "middle" }
      })

      let col = 5
      asignaturas.forEach(a => {
        sheet.mergeCells(h1.number, col, h1.number, col + 1)
        const cell = sheet.getCell(h1.number, col)
        cell.value = a.asignatura.asignatura
        cell.font = { bold: true }
        cell.border = borderAll
        cell.alignment = {
          textRotation: 90,
          vertical: "middle",
          horizontal: "center"
        }

        const cual = sheet.getCell(h2.number, col)
        cual.value = "CUAL"
        cual.font = { bold: true }
        cual.border = borderAll
        cual.alignment = { textRotation: 90, vertical: "middle", horizontal: "center" }

        const cuant = sheet.getCell(h2.number, col + 1)
        cuant.value = "CUANT"
        cuant.font = { bold: true }
        cuant.border = borderAll
        cuant.alignment = { textRotation: 90, vertical: "middle", horizontal: "center" }

        col += 2
      })
    }

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
        cortesActivos.forEach(i => {
          const cuant = findNota(est.id, a.asignatura.id, i + 1).cuant
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
        {["1er Parcial", "2do Parcial", "1er Semestre", "3er Parcial", "4to Parcial", "2do Semestre", "Nota Final"].map(
          (t, i) => (
            <Button
              key={i}
              onClick={() => setVista(i as VistaType)}
              variant={vista === i ? "default" : "outline"}
            >
              {t}
            </Button>
          )
        )}
        <Button variant="secondary" onClick={() => setVista("ALL")}>
          Completa
        </Button>
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
                    colSpan={(vista === "ALL" ? 7 : 1) * 2}
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
                    {["1er Parcial", "2do Parcial", "1er Semestre", "3er Parcial", "4to Parcial", "2do Semestre", "Nota Final"]
                      .filter((_, i) => vista === "ALL" || vista === i)
                      .map((label, i) => (
                        <TableHead
                          key={i}
                          colSpan={2}
                          className={`text-xs text-center font-semibold
                            ${idx % 3 === 0 ? "bg-emerald-50 text-emerald-800"
                              : idx % 3 === 1 ? "bg-amber-50 text-amber-800"
                                : "bg-violet-50 text-violet-800"}`}
                        >
                          {label}
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
                    {Array.from({ length: vista === "ALL" ? 7 : 1 }).map((_, i) => (
                      <React.Fragment key={i}>
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
                    cortes
                      .map((corte, i) => ({ corte, i }))
                      .filter(({ i }) => vista === "ALL" || vista === i)
                      .map(({ corte, i }) => {
                        let cuant = 0

                        if (i === 2) {
                          cuant = Math.round(
                            (findNota(est.id, a.asignatura.id, 1).cuant +
                              findNota(est.id, a.asignatura.id, 2).cuant) / 2
                          )
                        } else if (i === 5) {
                          cuant = Math.round(
                            (findNota(est.id, a.asignatura.id, 3).cuant +
                              findNota(est.id, a.asignatura.id, 4).cuant) / 2
                          )
                        } else if (i === 6) {
                          cuant = Math.round(
                            (findNota(est.id, a.asignatura.id, 1).cuant +
                              findNota(est.id, a.asignatura.id, 2).cuant +
                              findNota(est.id, a.asignatura.id, 3).cuant +
                              findNota(est.id, a.asignatura.id, 4).cuant) / 4
                          )
                        } else {
                          cuant = findNota(est.id, a.asignatura.id, corte).cuant
                        }

                        const cual = getQualitativeGrade(cuant)

                        const bgColor =
                          aIdx % 3 === 0
                            ? "bg-emerald-50"
                            : aIdx % 3 === 1
                              ? "bg-amber-50"
                              : "bg-violet-50"

                        const isFail = cuant < 60 || cual === "AI"

                        return (
                          <React.Fragment key={`${aIdx}-${i}`}>
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