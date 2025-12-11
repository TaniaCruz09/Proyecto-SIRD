"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import ListaEstudiantes from "./ListaEstudiantes"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function TabsAsignaturas({
    asignaturas,
    estudiantes,
    corteActivo,
    cortes,
    getInitials,
    anioLectivo,
    handleGuardarIndividual,
    avanzarCorte,
    asignaturaActiva,
    setAsignaturaActiva,
    guardando,
    isAnioActivo
}: any) {
    return (
        <Tabs
            value={asignaturaActiva?.toString()}
            onValueChange={(v) => setAsignaturaActiva(Number(v))}
        >
            <TabsList className="grid w-full grid-cols-3 h-auto p-1">
                {asignaturas.map((as: any) => (
                    <TabsTrigger key={as.id} value={String(as.id)}>
                        {as.nombre}
                    </TabsTrigger>
                ))}
            </TabsList>

            {asignaturas.map((asignatura: any) => (
                <TabsContent key={asignatura.id} value={String(asignatura.id)} className="mt-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl">
                                        {asignatura.nombre} - {cortes.find((c: any) => c.id === corteActivo)?.corte}
                                    </CardTitle>
                                    <CardDescription>Ingresa las calificaciones</CardDescription>
                                </div>
                                <Badge variant="outline">{asignatura.codigo}</Badge>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <ListaEstudiantes
                                estudiantes={estudiantes}
                                asignatura={asignatura}
                                corteActivo={corteActivo}
                                guardando={guardando}
                                getInitials={getInitials}
                                anioLectivo={anioLectivo}
                                handleGuardarIndividual={handleGuardarIndividual}
                                isAnioActivo={isAnioActivo}
                            />
                        </CardContent>
                    </Card>

                    <div className="flex justify-end mb-4">
                        <Button onClick={avanzarCorte} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Aceptar y avanzar al siguiente corte
                        </Button>
                    </div>
                </TabsContent>
            ))}
        </Tabs>
    )
}
