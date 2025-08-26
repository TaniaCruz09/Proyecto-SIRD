"use client"

import { asignarEstudianteAGrupo, eliminarEstudianteAsignado, getEstudiantesAsignados } from '@/actions/organizacionEscolarMethods/asignacionEstudiantesMethods';
import BtnDelete from '@/components/Buttons/BtnDelete';
import BtnMove from '@/components/Buttons/BtnMove';
import BuscarEstudiantes from '@/components/Filtros/BuscarEstudiantes';
import ConfirmDeletModal from '@/components/modals/ModalConfirmDeletion';
import MoveStudentToGroupModal from '@/components/modals/organizacionEscolar/gruposConEstudiantes/Move-student-to-group-modal';
import { useToast } from '@/hooks/use-toast';
import { GrupoConEstudiante, GrupoConEstudiantePayload } from '@/interfaces/organizacionEscolarInterface/grupoConEstudianteInterface';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';



export default function AsignarEstudiantesAGrupo() {
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [grupoConEstudianteAEliminar, setGrupoConEstudianteAEliminar] = useState<number | null>(null);

    const idGrupo = Number(searchParams.get("idGrupo"));
    const idAnioLectivo = Number(searchParams.get("idAnioLectivo"));
    const anioLectivo = searchParams.get("anioLectivo");
    const grupo = searchParams.get("grupo");
    const docenteGuia = searchParams.get("docenteGuia");

    const [estudiantes, setEstudiantes] = useState<GrupoConEstudiante[]>([]);

    const fetchGrupoConEstudiante = async () => {
        if (idGrupo) {
            await getEstudiantesAsignados(idGrupo)
                .then(data => setEstudiantes(data))
                .catch(err => {
                    console.error("Error en el useEffect al obtener estudiantes:", err);
                    setEstudiantes([]);
                });
        }
    }

    useEffect(() => {
        fetchGrupoConEstudiante()
    }, [idGrupo]);

    const handleEliminar = async (relacionId: number) => {
        try {
            await eliminarEstudianteAsignado(relacionId);
            setEstudiantes(prev => prev.filter(est => est.id !== relacionId));
        } catch (error) {
            console.error('Error eliminando estudiante asignado:', error);
        }
    };

    const handleDeleteClick = (id: number) => {
        setGrupoConEstudianteAEliminar(id);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        if (!grupoConEstudianteAEliminar) return;
        try {
            await eliminarEstudianteAsignado(grupoConEstudianteAEliminar);
            await fetchGrupoConEstudiante();
        } catch (error) {
            console.error("Error al eliminar usuario", error);
        } finally {
            setShowConfirm(false);
            setGrupoConEstudianteAEliminar(null);
        }
    };

    const handleAsignar = async (student: any) => {
        console.log(student)
        const grupoConEstudianteData: GrupoConEstudiantePayload = {
            grupo: { id: idGrupo },
            estudiante: { id: student }
        };

        try {
            const res = await asignarEstudianteAGrupo(grupoConEstudianteData);

            if (res.error) throw new Error(res.error.message || "Error al asignar el estudiante");

            getEstudiantesAsignados(idGrupo).then(setEstudiantes);

            toast({
                title: "Éxito",
                description: "Estudiante asignado correctamente",
                variant: "default",
            });

        } catch (error: any) {
            console.error("Error asignando estudiante:", error);
            // mensaje que viene del backend
            const errorMessage =
                error?.response?.data?.message ||
                error.message ||
                "No se pudo asignar el estudiante";
            await Swal.fire({
                icon: "warning",
                title: "No se pudo asignar",
                text: errorMessage,
                confirmButtonText: "Entendido"
            });
        }
    };

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
                    </div>

                    {/* Columna 2: buscador */}
                    <div className="flex justify-center lg:justify-end">
                        <BuscarEstudiantes onSelect={handleAsignar} anioId={idAnioLectivo} />
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
                        <th className="text-left px-4 py-2 font-semibold text-gray-700 border border-gray-300">Estudiantes</th>
                        <th className="text-left px-4 py-2 font-semibold text-gray-700 border border-gray-300">Código Estudiantil</th>
                        <th className="text-left px-4 py-2 font-semibold text-gray-700 border border-gray-300">Sexo</th>
                        <th className="text-center px-4 py-2 font-semibold text-gray-700 border border-gray-300">Traslado</th>
                        <th className="text-center px-4 py-2 font-semibold text-gray-700 border border-gray-300">Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {estudiantes.map((rel, index) => (
                        <tr key={rel.id} className="hover:bg-gray-50 transition-colors">
                            <td className="text-left px-4 py-2 border border-gray-300">{index + 1}</td>
                            <td className="text-left px-4 py-2 border border-gray-300">{rel.estudiante.name} {rel.estudiante.lastName}</td>
                            <td className="text-left px-4 py-2 border border-gray-300">{rel.estudiante.studentCode}</td>
                            <td className="text-left px-4 py-2 border border-gray-300">{rel.estudiante.gender.gender}</td>
                            <td className="px-4 py-2 border border-gray-300 text-center">
                                <MoveStudentToGroupModal
                                    grupoConEstudiante={rel}
                                    idAnioLectivo={idAnioLectivo}
                                    anioLectivo={anioLectivo}
                                    studentId={rel.estudiante.id}
                                    fetchGrupoConEstudiantes={fetchGrupoConEstudiante}
                                />
                            </td>
                            <td className="px-4 py-2 border border-gray-300 text-center">
                                <BtnDelete onClick={() => handleDeleteClick(rel.id)} />
                                <ConfirmDeletModal
                                    onshow={showConfirm}
                                    onCancel={() => setShowConfirm(false)}
                                    onConfirm={confirmDelete}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

}
