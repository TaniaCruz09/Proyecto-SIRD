"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { User, UserCircle, Save, Edit } from "lucide-react"

interface Props {
    estudiante: any
    asignaturaId: number
    corteActivo: number
    guardando: boolean
    getInitials: (name: string) => string
    onGuardar: (estudiante: any, asignaturaId: number, nota: string, setNotaBD: (nota: string) => void, isUpdate: boolean) => Promise<void> | void
    notaBD?: { notaCuantitativa?: number; notaCualitativa?: string }
    isAnioActivo: boolean
}

export default function EstudianteRow({
    estudiante,
    asignaturaId,
    corteActivo,
    guardando,
    getInitials,
    onGuardar,
    notaBD,
    isAnioActivo
}: Props) {
    // usamos string para permitir borrar y editar libremente
    const inicial = typeof notaBD?.notaCuantitativa !== "undefined" ? String(notaBD.notaCuantitativa) : ""
    const [notaLocal, setNotaLocal] = useState<string>(inicial)
    const [editando, setEditando] = useState<boolean>(inicial === "")

    // si cambia la nota desde fuera (backend), actualizamos
    useEffect(() => {
        const nueva = typeof notaBD?.notaCuantitativa !== "undefined" ? String(notaBD.notaCuantitativa) : ""
        setNotaLocal(nueva)
        setEditando(nueva === "")
    }, [notaBD, asignaturaId, corteActivo])

    const handleGuardarClick = async () => {
        const valor = notaLocal.trim()
        if (valor === "") return alert("Debe ingresar una nota antes de guardar")

        const notaNumerica = Number(valor)
        // 👉 SI EXISTE NOTA EN BD → HACER UPDATE
        if (notaBD && typeof notaBD.notaCuantitativa !== "undefined") {
            await onGuardar(
                estudiante,
                asignaturaId,
                valor,
                (notaActualizada: string) => {
                    setNotaLocal(notaActualizada)
                    setEditando(false)   // se regresa a modo NO edición
                },
                true // <-- señalamos que es ACTUALIZACIÓN
            )
            return
        }

        // 👉 SI NO EXISTE NOTA → GUARDAR NUEVA
        await onGuardar(
            estudiante,
            asignaturaId,
            valor,
            (notaNueva: string) => {
                setNotaLocal(notaNueva)
                setEditando(false)
            },
            false // <-- señalamos que es NUEVO registro
        )
    }


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
                        <Badge variant="outline" className={estudiante.sexo === "M" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-pink-50 text-pink-700 border-pink-200"}>
                            {estudiante.sexo === "M" ? <><User className="h-3 w-3 mr-1" /> M</> : <><UserCircle className="h-3 w-3 mr-1" /> F</>}
                        </Badge>
                    </div>

                    {/* Nota */}
                    <div className="col-span-4 flex items-center gap-2 justify-center">
                        <Input
                            type="text" // text para controlar con string y permitir borrar
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="0-100"
                            value={notaLocal}
                            readOnly={!isAnioActivo}
                            onChange={(e) => {
                                // permitimos borrar y solo números hasta 3 dígitos
                                const v = e.target.value
                                if (v === "" || (/^\d{1,3}$/.test(v) && Number(v) <= 100)) {
                                    setNotaLocal(v)
                                }
                            }}
                            disabled={!editando || guardando}
                            className="text-center text-lg font-semibold h-12 border-2 focus:border-primary"
                        />

                        {editando ? (
                            <Button
                                size="icon"
                                variant="secondary"
                                onClick={handleGuardarClick}
                                disabled={!isAnioActivo || guardando || notaLocal.trim() === ""}
                            >
                                <Save className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                size="icon"
                                variant="outline"
                                onClick={() => setEditando(true)}
                                disabled={!isAnioActivo} // <-- aquí se bloquea edición si el año no está activo
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                        )}

                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
