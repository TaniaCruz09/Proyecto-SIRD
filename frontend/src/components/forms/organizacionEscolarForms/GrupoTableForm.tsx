"use client"

import { getGrados } from '@/actions/catalogos/gradoMethods';
import { getSecciones } from '@/actions/catalogos/seccionMethods';
import { getTurnos } from '@/actions/catalogos/turnoMethods';
import { getDocentes } from '@/actions/docentesMethods/docentesMethods';
import { getOrganizacionEscolar } from '@/actions/organizacionEscolarMethods/organizacionMethods';
import { useToast } from '@/hooks/use-toast';
import { Docente, Grado, GrupoEscolarPayload, OrganizacionEscolar, Seccion, Turno } from '@/interfaces';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { saveGrupo } from '@/actions/organizacionEscolarMethods/GrupoEscolarMethods/GrupoEscolarMethods';
import { Button } from "@/components/ui/button"

interface GrupoTableForm {
    idOrganizacion: number;
    idTurno: number;
    onSuccess: () => void
}

export default function GrupoTableForm({ idOrganizacion, idTurno, onSuccess }: GrupoTableForm) {
    const { toast } = useToast()

    const [organizacionesEscolares, setOrganizacionesEscolares] = useState<OrganizacionEscolar[]>([])
    const [grados, setGrados] = useState<Grado[]>([])
    const [secciones, setSecciones] = useState<Seccion[]>([])
    const [turnos, setTurnos] = useState<Turno[]>([])
    const [docentes, setDocentes] = useState<Docente[]>([])

    const [formData, setFormData] = useState({
        grado: "",
        seccion: "",
        turno: "",
        docenteGuia: "",
    });

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [organizacionEscolarData, gradoData, seccionData, docenteGuiaData, turnoData] = await Promise.all([
                    getOrganizacionEscolar(),
                    getGrados(),
                    getSecciones(),
                    getDocentes(),
                    getTurnos(),
                ])
                setOrganizacionesEscolares(organizacionEscolarData)
                setGrados(gradoData)
                setSecciones(seccionData)
                setDocentes(docenteGuiaData)
                setTurnos(turnoData)
            } catch (error) {
                console.error("Error al cargar los datos del formulario:", error)
                toast({
                    title: "Error",
                    description: "No se pudieron cargar los datos del formulario",
                    variant: "destructive",
                })
            }
        }
        fetchData()
    }, [toast])

    // Maneja cambios de los inputs
    const handleSlectChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        try {
            if (!formData.grado || !formData.seccion || !formData.docenteGuia) {
                toast({
                    title: "Error",
                    description: "Todos los campos son obligatorios",
                    variant: "destructive",
                })
                return
            }

            const payload: GrupoEscolarPayload = {
                organizacionEscolar: { id: idOrganizacion },
                grado: { id: parseInt(formData.grado) },
                seccion: { id: parseInt(formData.seccion) },
                turno: { id: idTurno },
                docenteGuia: { id: parseInt(formData.docenteGuia) }
            }

            await saveGrupo(payload)
            await onSuccess()
            setFormData({
                grado: "",
                seccion: "",
                turno: "",
                docenteGuia: "",
            });

            toast({
                title: "Éxito",
                description: "Grupo agregado correctamente",
            })
        } catch (error) {
            console.error("Error al guardar grupo:", error)
            toast({
                title: "Error",
                description: "No se pudo guardar el grupo",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            {/* Formulario para agregar grupos */}
            <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-emerald-800">
                        <Plus className="h-5 w-5" />
                        Agregar Nuevo Grupo
                    </CardTitle>
                    <CardDescription className="text-emerald-700">
                        Configura un nuevo grupo con su docente guía para esta organización escolar
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Grado */}
                        <div className="space-y-2">
                            <Label htmlFor="grado" className="text-slate-700">
                                Grado *
                            </Label>
                            <Select value={formData.grado} onValueChange={(value) => handleSlectChange("grado", value)}>
                                <SelectTrigger className="bg-white border-slate-300">
                                    <SelectValue placeholder="Selecciona grado" />
                                </SelectTrigger>
                                <SelectContent>
                                    {grados.map((grado) => (
                                        <SelectItem key={grado.id} value={grado.id.toString()}>
                                            {grado.grades || grado.grades}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="seccion" className="text-slate-700">
                                Sección *
                            </Label>
                            <Select value={formData.seccion} onValueChange={(value) => handleSlectChange("seccion", value)}>
                                <SelectTrigger className="bg-white border-slate-300">
                                    <SelectValue placeholder="Selecciona sección" />
                                </SelectTrigger>
                                <SelectContent>
                                    {secciones.map((seccion) => (
                                        <SelectItem key={seccion.id} value={seccion.id.toString()}>
                                            {seccion.seccion || seccion.seccion}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="docente" className="text-slate-700">
                                Docente Guía *
                            </Label>
                            <Select
                                value={formData.docenteGuia}
                                onValueChange={(value) => handleSlectChange("docenteGuia", value)}
                            >
                                <SelectTrigger className="bg-white border-slate-300">
                                    <SelectValue placeholder="Selecciona docente" />
                                </SelectTrigger>
                                <SelectContent>
                                    {docentes.map((docente) => (
                                        <SelectItem key={docente.id} value={docente.id.toString()}>
                                            {docente.nombres || docente.nombres}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-end">
                            <Button onClick={handleSubmit} className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                                <Plus className="h-4 w-4 mr-2" />
                                {loading ? "Agregando..." : "Agregar"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
