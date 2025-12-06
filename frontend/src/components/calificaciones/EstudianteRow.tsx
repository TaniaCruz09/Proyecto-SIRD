"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { User, UserCircle, Save } from "lucide-react"

interface Props {
    estudiante: any
    asignaturaId: number
    corteActivo: number
    guardando: boolean
    getInitials: (name: string) => string
    onChange: (estId: number, asigId: number, corteId: number, val: string) => void
    onGuardar: (estudiante: any, asignaturaId: number) => void
}

export default function EstudianteRow({
    estudiante,
    asignaturaId,
    corteActivo,
    guardando,
    getInitials,
    onChange,
    onGuardar
}: Props) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

                    {/* Foto */}
                    <div className="col-span-1 flex justify-center">
                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                            {estudiante.foto ? (
                                <AvatarImage src={estudiante.foto} />
                            ) : (
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                    {getInitials(`${estudiante.nombre} ${estudiante.apellido}`)}
                                </AvatarFallback>
                            )}
                        </Avatar>
                    </div>

                    {/* Nombre */}
                    <div className="col-span-3">
                        <Label className="text-xs text-muted-foreground md:hidden">Nombre</Label>
                        <p className="font-semibold">{estudiante.nombre} {estudiante.apellido}</p>
                    </div>

                    {/* Código */}
                    <div className="col-span-3">
                        <Label className="text-xs text-muted-foreground md:hidden">Código</Label>
                        <p className="font-mono font-semibold">{estudiante.codigo}</p>
                    </div>

                    {/* Sexo */}
                    <div className="col-span-1 flex justify-center">
                        <Badge
                            variant="outline"
                            className={
                                estudiante.sexo === "M"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "bg-pink-50 text-pink-700 border-pink-200"
                            }
                        >
                            {estudiante.sexo === "M"
                                ? <><User className="h-3 w-3 mr-1" /> M</>
                                : <><UserCircle className="h-3 w-3 mr-1" /> F</>}
                        </Badge>
                    </div>

                    {/* Nota */}
                    <div className="col-span-4 flex items-center gap-2 justify-center">
                        <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0-100"
                            value={estudiante.calificaciones?.[asignaturaId]?.[corteActivo] ?? ""}
                            onChange={(e) =>
                                onChange(estudiante.id, asignaturaId, corteActivo, e.target.value)
                            }
                            className="text-center text-lg font-semibold h-12 border-2 focus:border-primary"
                        />

                        <Button
                            size="icon"
                            variant="secondary"
                            onClick={() => onGuardar(estudiante, asignaturaId)}
                            disabled={guardando}
                        >
                            <Save className="h-4 w-4" />
                        </Button>
                    </div>

                </div>
            </CardContent>
        </Card>
    )
}
