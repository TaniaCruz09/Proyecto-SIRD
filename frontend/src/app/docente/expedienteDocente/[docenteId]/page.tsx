"use client"

import { getDocenteById } from '@/actions/docentesMethods/docentesMethods'
import { Docente } from '@/interfaces'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import EditDocenteModal from '@/components/modals/docentes/EditDocenteModal'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/pogress"
import {
  CalendarDays,
  GraduationCap,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  User,
  Mail,
  Briefcase,
  Globe,
  Building2,
} from "lucide-react"
import { TablaRegistrosDocente } from '@/components/tables/expedientes/Tabla-registros-docente'
export interface AsignacionDocente {
  id: string
  grado: string
  modalidad: string
  materia: string
  anioLectivo: string
  activo: boolean
  cantidadEstudiantes: number
  esquela: number
}

export default function DocenteExpedientePage() {
  const [docenteData, setDocenteData] = useState<Docente | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const { docenteId } = useParams();

  const handleVerGrupo = (asignacionId: number) => {
    router.push(`/esquela-calificaciones/${asignacionId}`)
  }

  const fetchDocenteById = async () => {
    try {
      const docente = await getDocenteById(Number(docenteId))

      setDocenteData(docente)
    } catch (error) {
      console.error("Error cargando docente", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocenteById()
  }, [])

  if (loading) {
    return <div className="p-6 text-center">Cargando el docente...</div>
  }

  if (!docenteData) {
    return <div className="p-6 text-center text-red-500">No se encontró el docente</div>
  }

  const asignaciones: AsignacionDocente[] =
    docenteData.grupos?.map((grupo) => ({
      id: String(grupo.id),
      grado: `${grupo.grado.grades} ${grupo.seccion.seccion} ${grupo.turno.turno}`,
      modalidad: grupo?.turno?.modalidad?.modalidad ?? "Sin modalidad",
      // Concatenamos todas las materias en un string
      materia:
        grupo.grupoAsignaturaDocente && grupo.grupoAsignaturaDocente.length > 0
          ? Array.from(new Set(
            grupo.grupoAsignaturaDocente
              .map((gd) => gd.asignatura?.asignatura)
              .filter(Boolean)
          ))
            .join(", ")
          : "Sin materias",
      anioLectivo: String(grupo.organizacionEscolar.anio_lectivo.anio_lectivo),
      activo: grupo.organizacionEscolar.anio_lectivo.isActive,
      cantidadEstudiantes: new Set(
        (grupo.grupoAsignaturaDocente || [])
          .flatMap((gd) => gd.gruposConEstudiantes || [])
          .map((relacion) => relacion?.estudiante?.id)
          .filter((id) => Number.isFinite(Number(id)))
      ).size,
      esquela: grupo.esquelaHead?.id ?? 0
    })) || [];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header del Perfil */}
      <Card className="mb-8">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <GraduationCap className="w-6 h-6 text-green-600" />
            Expediente del Docente
          </CardTitle>

          <EditDocenteModal docente={docenteData} fetchDocentes={fetchDocenteById} />
        </CardHeader>
        <CardContent className="px-5">
          <div className="flex flex-col md:flex-row gap-8 items-center">

            {/* Foto y código del estudiante */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-32 h-32 border-4 border-green-200">
                {docenteData.foto_docente ? (
                  <AvatarImage
                    src={`${process.env.NEXT_PUBLIC_API_UPLOADS}${docenteData.foto_docente}` || "/placeholder.svg"}
                    alt={docenteData.nombres}
                  />
                ) : null}
                <AvatarFallback className="text-2xl font-bold bg-green-100 text-green-700">
                  {`${docenteData.nombres.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 1)}${docenteData.apellido_paterno.split("")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 1)}`}
                </AvatarFallback>
              </Avatar>
              <Badge variant="secondary" className="text-sm font-medium">
                Cédula: {String(docenteData.cedula_identidad)}
              </Badge>
            </div>

            {/* Información del estudiante */}
            <div className="flex-1 space-y-6">
              {/* Nombre */}
              <div>
                <h1 className="text-3xl text-start font-bold text-gray-900 mb-2">
                  {docenteData.nombres} {docenteData.apellido_paterno} {docenteData.apellido_materno}
                </h1>
                <div className="flex items-center gap-2 text-lg text-gray-600 mb-4">
                  <span className="font-medium">Información Personal:</span>
                </div>
              </div>

              {/* Detalles personales */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-600" />
                  <span>Teléfono: {docenteData.telefono}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-green-600" />
                  <span>Fecha Contratado: {" "}
                    {docenteData?.fecha_nacimiento &&
                      new Date(docenteData.fechaContratado).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-green-600 mt-1" />
                  <span>Nivel Academico: {docenteData.nivel_academico.map((e) => e.academicLevel)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-green-600 mt-1" />
                  <span>Correo: {docenteData.correo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-green-600 mt-1" />
                  <span>País: {docenteData.pais.pais}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-green-600 mt-1" />
                  <span>Profección: {docenteData.profession.map((e) => e.profession)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-green-600" />
                  <span>Sexo: {docenteData.sexo.gender}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-green-600 mt-1" />
                  <span>Municipio: {docenteData.municipio.municipio}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-600" />
                  <span>Telf Contacto Emergencia: {docenteData.telefono_contacto_emergencia}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CalendarDays className="w-4 h-4 text-green-600" />
                  <span>
                    Fecha de Nacimiento:{" "}
                    {docenteData?.fecha_nacimiento &&
                      new Date(docenteData.fecha_nacimiento).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span className="flex-1 text-left break-words">Dirección: {docenteData.direccion_domiciliar}</span>
                </div>
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-green-600" />
                  <span className="flex-1 text-left break-words">Nombre Contacto Emergencia: {docenteData.nombre_contacto_emergencia}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <TablaRegistrosDocente asignaciones={asignaciones}
        onVerGrupo={handleVerGrupo} />
    </div>
  )
}
