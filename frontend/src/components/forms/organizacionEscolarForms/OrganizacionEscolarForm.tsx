"use client"
import { getAniosLectivos } from '@/actions/catalogos/anioLectivoMethods';
import { getTurnos } from '@/actions/catalogos/turnoMethods';
import { saveOrganizacionEscolar, updateOrganizacionEscolar } from '@/actions/organizacionEscolarMethods/organizacionMethods';
import { AnioLectivo, OrganizacionEscolar, OrganizacionEscolarPayload, Turno } from '@/interfaces';
import React, { useEffect, useState } from 'react'
interface OrganizacionFormProp {
    defaultValues?: OrganizacionEscolar | null;
    onSuccess: () => void;
}


export default function OrganizacionEscolarForm({ defaultValues, onSuccess }: OrganizacionFormProp) {
    const [anioLectivo, setAnioLectivo] = useState<string>("")
    const [aniosLectivos, setAniosLectivos] = useState<AnioLectivo[]>([])

    const [turno, setTurno] = useState<string>("")
    const [turnos, setTurnos] = useState<Turno[]>([])

    const isEdit = Boolean(defaultValues?.id);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    anioLectivoData,
                    turnoData,
                ] = await Promise.all([
                    getAniosLectivos(),
                    getTurnos(),
                ]);
                setAniosLectivos(anioLectivoData);
                setTurnos(turnoData);
            } catch (error) {
                console.error("Error al cargar los datos del formulario:", error);
            }
        }
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const selectedAnioEscolar = aniosLectivos.find((a) => a.id === parseInt(anioLectivo));
            const selectedTurno = turnos.find((t) => t.id === parseInt(turno));

            if (
                !selectedAnioEscolar || !selectedTurno
            ) {
                console.error("Faltan campos requeridos");
                return;
            }

            const organizacionEscolarData: OrganizacionEscolarPayload = {
                anio_lectivo: selectedAnioEscolar,
                turno: selectedTurno,
            }
            if (isEdit && defaultValues?.id) {
                await updateOrganizacionEscolar(defaultValues.id, organizacionEscolarData);
            } else {
                await saveOrganizacionEscolar(organizacionEscolarData)
            }
            onSuccess();
        } catch (error) {
            console.error("Error al guardar o actualizar organizacion Escolar:", error);
        }
    }

    useEffect(() => {
        if (defaultValues) {
            setAnioLectivo(defaultValues.anio_lectivo?.id?.toString() || "");
            setTurno(defaultValues.turno?.id?.toString() || "");
        }
    }, [defaultValues])
    return (
        <form onSubmit={handleSubmit} className=" w-full space-y-4 overflow-y-auto px-10">
            <h2 className="text-xl font-semibold text-gray-700">
                {isEdit ? "Editar Organizacion Escolar" : "Agregar Organizacion Escolar"}
            </h2>
            <select
                name="anioLectivo"
                id="anioLectivo"
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                value={anioLectivo}
                onChange={(e) => setAnioLectivo(e.target.value)}
            >
                <option value="">Año Lectivo</option>
                {aniosLectivos?.map((r) => (
                    <option key={r.id} value={r.id}>
                        {r.anio_lectivo}
                    </option>
                ))}
            </select>

            <select
                name="turno"
                id="turno"
                className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
                value={turno}
                onChange={(e) => setTurno(e.target.value)}
            >
                <option value="">Turno</option>
                {turnos?.map((t) => (
                    <option key={t.id} value={t.id}>
                        {t.turno}
                    </option>
                ))}
            </select>

            <div className="flex justify-center">
                <button
                    type="submit"
                    className="px-20 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 mb-6"
                >
                    {isEdit ? "Actualizar" : "Guardar"}
                </button>
            </div>
        </form>
    )
}
