'use client'

import { getEstudiantesAsignados } from '@/actions/organizacionEscolarMethods/asignacionEstudiantesMethods'
import RegisterEstudent from '@/interfaces/registerEstudentInterface'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function RegistroCalificaciones() {
    const searchParams = useSearchParams()

    const idOrganizacionEscolar = searchParams.get('idGrupo')
    const anio = searchParams.get('anio')
    const asignatura = searchParams.get('asignatura')

    const [estudiantes, setEstudiantes] = useState<RegisterEstudent[]>([])

    useEffect(() => {
        if (idOrganizacionEscolar && anio && asignatura) {
            getEstudiantesAsignados(Number(idOrganizacionEscolar))
                .then(data => {
                    const soloEstudiantes = data
                        .filter((item: any) => item?.activo !== false)
                        .map((item: any) => item.estudiante);
                    setEstudiantes(soloEstudiantes);
                })
                .catch(err => {
                    console.error("Error en el useEffect al obtener estudiantes:", err);
                    setEstudiantes([]);
                });

        }
    }, [idOrganizacionEscolar, anio, asignatura])

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Registro de Calificaciones</h1>

            <p className="mb-2">Grupo: {idOrganizacionEscolar}</p>
            <p className="mb-2">Año: {anio}</p>
            <p className="mb-4">Asignatura: {asignatura}</p>

            <table className="w-full border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border">Estudiante</th>
                        <th className="p-2 border">Nota</th>
                    </tr>
                </thead>
                <tbody>
                    {estudiantes.map((est) => (
                        <tr key={est.id}>
                            <td className="border p-2">{est.name} {est.lastName}</td>
                            <td className="border p-2">
                                <input
                                    type="number"
                                    className="border px-2 py-1 w-full rounded"
                                    placeholder="0 - 100"
                                    min={0}
                                    max={100}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
