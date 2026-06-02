"use client"
import React, { useEffect, useState } from "react";
import { getModalidades } from "@/actions/catalogos/modalidadMethods";
import { getTurnos } from "@/actions/catalogos/turnoMethods";
import { saveOrganizacionEscolar } from "@/actions/organizacionEscolarMethods/organizacionMethods";
import { Modalidad, Turno, OrganizacionEscolarPayload, AnioLectivo } from "@/interfaces";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { GraduationCap, Clock, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAniosLectivos } from "@/actions/catalogos/anioLectivoMethods";

interface OrganizationEscolarFormProps {
    idAnioLectivo: number;
    onSuccess: () => void | Promise<void> | undefined
}

export function OrganizacionEscolarConAnioLectivoForm({ idAnioLectivo, onSuccess }: OrganizationEscolarFormProps) {
    const [modalidades, setModalidades] = useState<Modalidad[]>([]);
    const [turnos, setTurnos] = useState<Turno[]>([]);
    const [aniosLectivos, setAniosLectivos] = useState<AnioLectivo[]>([])

    const [formData, setFormData] = useState({
        modalidad: "",
        turno: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [modalidadData, turnosData, aniosLectivos] = await Promise.all([
                    getModalidades(),
                    getTurnos(),
                    getAniosLectivos(),
                ]);
                setModalidades(modalidadData);
                setTurnos(turnosData);
                setAniosLectivos(aniosLectivos)
            } catch (error) {
                console.error("Error cargando datos:", error);
            }
        };
        fetchData();
    }, []);

    const handleModalidadChange = (modalidad: string) => {
        setFormData({ modalidad, turno: "" });
    };

    const handleTurnoChange = (turno: string) => {
        setFormData((prev) => ({ ...prev, turno }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.modalidad || formData.turno.length === 0) {
            toast({
                title: "Campos incompletos",
                description: "Selecciona modalidad y turno",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);
        try {
            const payload: OrganizacionEscolarPayload = {
                anio_lectivo: { id: idAnioLectivo },
                turno: { id: parseInt(formData.turno) },
            };

            console.log(payload)
            await saveOrganizacionEscolar(payload); // solo un request

            toast({
                title: "Organización creada",
                description: "La organización escolar se guardó correctamente"
            });
            await onSuccess?.();
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "No se pudo guardar la organización", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };


    const filteredTurnos = turnos.filter((t) => t.modalidad?.id.toString() === formData.modalidad);

    return (
        <div className="w-full mx-auto space-y-6 overflow-y-auto">
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg">
                    <CardTitle className="flex items-center justify-center gap-2 text-slate-900">
                        <GraduationCap className="h-5 w-5 text-emerald-500" />
                        Año Lectivo {aniosLectivos.find(anio => anio.id === idAnioLectivo)?.anio_lectivo || "No disponible"}
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                        Configura la modalidad, turno y modalidad académicos
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Modalidad */}
                        <div className="space-y-3">
                            <Label className="text-base font-medium text-slate-700">Modalidad</Label>
                            <div className="grid gap-3">
                                {modalidades.map((modalidad) => (
                                    <div
                                        key={modalidad.id}
                                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${formData.modalidad === modalidad.id.toString()
                                            ? "border-emerald-300 bg-emerald-50 shadow-sm"
                                            : "border-slate-200 hover:border-emerald-200 hover:bg-slate-50"
                                            }`}
                                        onClick={() => handleModalidadChange(modalidad.id.toString())}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="modalidad"
                                                value={modalidad.id}
                                                checked={formData.modalidad === modalidad.id.toString()}
                                                onChange={() => handleModalidadChange(modalidad.id.toString())}
                                                className="text-emerald-500 focus:ring-emerald-500"
                                            />
                                            <span className="font-medium text-slate-700">{modalidad.modalidad}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Turno */}
                        {formData.modalidad && (
                            <div className="space-y-3">
                                <Label className="text-base font-medium flex items-center gap-2 text-slate-700">
                                    <Clock className="h-4 w-4 text-violet-500" />
                                    Turno
                                </Label>
                                <div className="grid gap-3">
                                    {filteredTurnos.map((turno) => (
                                        <div
                                            key={turno.id}
                                            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${formData.turno === turno.id.toString()
                                                ? "border-violet-300 bg-violet-50 shadow-sm"
                                                : "border-slate-200 hover:border-violet-200 hover:bg-slate-50"
                                                }`}
                                            onClick={() => handleTurnoChange(turno.id.toString())}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="turno"
                                                    value={turno.id}
                                                    checked={formData.turno === turno.id.toString()}
                                                    onChange={() => handleTurnoChange(turno.id.toString())}
                                                    className="text-violet-500 focus:ring-violet-500"
                                                />
                                                <span className="font-medium text-slate-700">{turno.turno}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm transition-colors"
                            disabled={isLoading || !formData.modalidad || formData.turno.length === 0}
                        >
                            {isLoading ? "Creando Organización..." : "Crear Organización"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
