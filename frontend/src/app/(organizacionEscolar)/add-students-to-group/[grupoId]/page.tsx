"use client"
import { getGruposById } from '@/actions/organizacionEscolarMethods/GrupoEscolarMethods/GrupoEscolarMethods';
import BuscarYAsignarEstudiantes from '@/components/Filtros/BuscarEstudiantes';
import DeleteEstudianteDeGrupoModal from '@/components/modals/organizacionEscolar/gruposConEstudiantes/DeleteEstudianteDeGrupoModal';
import MoveStudentToGroupModal from '@/components/modals/organizacionEscolar/gruposConEstudiantes/Move-student-to-group-modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GrupoEscolar } from '@/interfaces';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AsignarEstudiantesAGrupo() {
    const { grupoId } = useParams();
    const [grupos, setGrupos] = useState<GrupoEscolar>();

    const fetchGrupoById = async () => {
        try {
            const response = await getGruposById(Number(grupoId))
            setGrupos(response)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchGrupoById()

    }, [grupoId]);

    // Sacar info base de la primera organización encontrada
    const idAnioLectivo = grupos?.organizacionEscolar?.anio_lectivo?.id ?? 0
    const anioLectivo = grupos?.organizacionEscolar?.anio_lectivo?.anio_lectivo ?? 0
    const grupo = grupos?.grado.grades ?? "N/A"
    const docenteGuia = grupos?.docenteGuia.nombres ?? "N/A"
    const asignaturasDelGrupo = grupos?.grupoAsignaturaDocente ?? [];
    const gradoId = grupos?.grado.id ?? 0

    const estudiantesUnicos = Object.values(
        grupos?.grupoAsignaturaDocente
            ?.reduce((acc, gad) => {
                gad.gruposConEstudiantes.forEach(ge => {
                    acc[ge.estudiante.id] = ge.estudiante;
                });
                return acc;
            }, {} as Record<number, any>) ?? {}
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
            {/* Contenedor de encabezado y buscador en dos columnas */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 px-8 py-4 mb-8">
                <div className="flex items-center gap-3 pb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-700">Listado de Estudiantes</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pb-10">
                    {/* Columna 1: Información del grupo */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
                                <p className="text-lg font-medium text-amber-600 mb-1">Año Lectivo</p>
                                <p className="text-lg font-bold text-amber-800">{anioLectivo}</p>
                            </div>
                            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
                                <p className="text-lg font-medium text-emerald-600 mb-1">Grupo</p>
                                <p className="text-sm font-bold text-emerald-800">{grupo}</p>
                            </div>
                            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                                <p className="text-lg font-medium text-purple-600 mb-1">Docente Guía</p>
                                <p className="text-lg font-bold text-purple-800">{docenteGuia}</p>
                            </div>
                        </div>

                        {/* Sección: Materias y Docentes */}
                        <div className="bg-white rounded-xl shadow p-4 border border-slate-200 mt-6">
                            <h3 className="text-lg font-bold text-slate-700 mb-2">Asignaturas y Docentes asignados</h3>

                            {asignaturasDelGrupo.length === 0 ? (
                                <p className="text-sm text-gray-500">No hay asignaturas asignadas a este grupo</p>
                            ) : (
                                <ul className="space-y-2">
                                    {asignaturasDelGrupo
                                        // eliminar duplicados por id de asignatura
                                        .filter((value, index, self) => self.findIndex(v => v.asignatura.id === value.asignatura.id) === index)
                                        .map((item, index) => (
                                            <li key={index} className="flex justify-between border-b border-gray-200 pb-1">
                                                <span className="font-medium text-gray-700">{item.asignatura.asignatura}</span>
                                                <span className="text-gray-600">
                                                    {item.docente.nombres} {item.docente.apellido_paterno && item.docente.apellido_materno}
                                                </span>
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Columna 2: buscador */}
                    <div className="flex justify-center lg:justify-end">
                        <BuscarYAsignarEstudiantes anioId={idAnioLectivo} asignaturasDelGrupo={asignaturasDelGrupo}
                            fetchGrupoConEstudiantes={fetchGrupoById} />
                    </div>
                </div>
            </div>

            {/* Título listado */}
            <div className="flex items-center bg-white border rounded-t-xl h-15">
                <h2 className="pl-6 text-xl font-bold text-gray-600">Listado de estudiantes</h2>
            </div>

            {/* Tabla */}
            <table className="w-full text-black border border-gray-300 border-collapse bg-white">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="text-left px-4 py-2 font-semibold text-gray-700 border border-gray-300">Nº</th>
                        <th className="text-left px-4 py-2 font-semibold text-gray-700 border border-gray-300">Foto</th>
                        <th className="text-left px-4 py-2 font-semibold text-gray-700 border border-gray-300">Estudiantes</th>
                        <th className="text-left px-4 py-2 font-semibold text-gray-700 border border-gray-300">Código Estudiantil</th>
                        <th className="text-left px-4 py-2 font-semibold text-gray-700 border border-gray-300">Sexo</th>
                        <th className="text-center px-4 py-2 font-semibold text-gray-700 border border-gray-300">Asignaturas</th>
                        <th className="text-center px-4 py-2 font-semibold text-gray-700 border border-gray-300">Traslado</th>
                        <th className="text-center px-4 py-2 font-semibold text-gray-700 border border-gray-300">Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {estudiantesUnicos.map((estudiante, index) => (
                        <tr key={estudiante.id} className="hover:bg-gray-50 transition-colors">
                            <td className="text-left px-4 py-2 border border-gray-300">{index + 1}</td>
                            <td className="text-left px-4 py-2 border border-gray-300">
                                <Avatar className="w-10 h-10 border-2 border-green-200">
                                    {estudiante.profileImage ? (
                                        <AvatarImage
                                            src={`${process.env.NEXT_PUBLIC_API_UPLOADS}${estudiante.profileImage}` || "/placeholder.svg"}
                                            alt={estudiante.name}
                                        />
                                    ) : (
                                        <AvatarFallback className="text-md font-bold bg-green-100 text-green-700">
                                            {`${estudiante.name.split(" ")
                                                .map((n: string) => n[0])
                                                .join("")
                                                .slice(0, 1)}${estudiante.lastName.split("")
                                                    .map((n: string) => n[0])
                                                    .join("")
                                                    .slice(0, 1)}`}
                                        </AvatarFallback>
                                    )}
                                </Avatar></td>
                            <td className="text-left px-4 py-2 border border-gray-300">
                                <Link href={`/historial-estudiante/${estudiante.id}`} className='text-blue-900 underline'>
                                    {estudiante.name} {estudiante.lastName}
                                </Link>
                            </td>
                            <td className="text-left px-4 py-2 border border-gray-300">{estudiante.studentCode}</td>
                            <td className="text-left px-4 py-2 border border-gray-300">{estudiante.gender?.gender}</td>
                            <td className="text-left px-4 py-2 border border-gray-300">
                                {grupos?.grupoAsignaturaDocente
                                    ?.filter(gad =>
                                        gad.gruposConEstudiantes.some(ge => ge.estudiante.id === estudiante.id)
                                    )
                                    .map(gad => gad.asignatura.asignatura)
                                    .join(", ") ?? "N/A"}
                            </td>
                            <td className="px-4 py-2 border border-gray-300 text-center">
                                <MoveStudentToGroupModal
                                    gradoId={gradoId}
                                    grupoOrigenId={Number(grupoId)}
                                    idAnioLectivo={idAnioLectivo}
                                    anioLectivo={anioLectivo}
                                    estudianteId={estudiante.id}
                                    fetchGrupoConEstudiantes={fetchGrupoById}
                                />
                            </td>
                            <td className="px-4 py-2 border border-gray-300 text-center">
                                <DeleteEstudianteDeGrupoModal grupoId={Number(grupoId)} estudianteId={estudiante.id} fetchGrupoConEstudiantes={fetchGrupoById} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

}
