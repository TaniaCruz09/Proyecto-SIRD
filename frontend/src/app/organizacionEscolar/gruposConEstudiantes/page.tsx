"use client"

import { asignarEstudianteAGrupo, eliminarEstudianteAsignado, getEstudiantesAsignados } from '@/actions/organizacionEscolarMethods/asignacionEstudiantesMethods';
import { deleteOrganizacionEscolar } from '@/actions/organizacionEscolarMethods/organizacionMethods';
import BtnDelete from '@/components/Buttons/BtnDelete';
import BuscarEstudiantes from '@/components/Filtros/BuscarEstudiantes';
import ConfirmDeletModal from '@/components/modals/ModalConfirmDeletion';
import { OrganizacionEscolarConEstudiante, OrganizacionEscolarConEstudiantePayload } from '@/interfaces/organizacionEscolarInterface/organizacionConEstudianteInterface';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';


export default function AsignarEstudiantesAOrganizacion() {
    const searchParams = useSearchParams();
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [grupoConEstudianteAEliminar, setGrupoConEstudianteAEliminar] = useState<number | null>(null);

    const idOrganizacion = Number(searchParams.get("idOrganizacion"));
    const anioLectivo = searchParams.get("anioLectivo");
    const grupo = searchParams.get("grupo");
    const docenteGuia = searchParams.get("docenteGuia");

    const [estudiantes, setEstudiantes] = useState<OrganizacionEscolarConEstudiante[]>([]);

    const fetchOrganizacionConEstudiante = () => {
        if (idOrganizacion) {
            getEstudiantesAsignados(idOrganizacion)
                .then(data => setEstudiantes(data))
                .catch(err => {
                    console.error("Error en el useEffect al obtener estudiantes:", err);
                    setEstudiantes([]);
                });
        }
    }

    useEffect(() => {
        fetchOrganizacionConEstudiante()
    }, [idOrganizacion]);

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
            await fetchOrganizacionConEstudiante();
        } catch (error) {
            console.error("Error al eliminar usuario", error);
        } finally {
            setShowConfirm(false);
            setGrupoConEstudianteAEliminar(null);
        }
    };

    const handleAsignar = async (student: any) => {
        if (student.asignadoGrupo) {
            await Swal.fire({
                icon: "warning",
                title: "Estudiante ya asignado",
                text: `Este estudiante ya está en: ${student.asignadoGrupo}`,
                confirmButtonText: "Entendido"
            });
            return;
        }
        const organizacionConEstudianteData: OrganizacionEscolarConEstudiantePayload = {
            organizacionEscolar: { id: idOrganizacion },
            estudiante: { id: student.id }
        };

        try {
            const res = await asignarEstudianteAGrupo(organizacionConEstudianteData);

            if (res.error) throw new Error("Error al asignar el estudiante");

            getEstudiantesAsignados(idOrganizacion).then(setEstudiantes);
        } catch (error) {
            console.error("Error asignando estudiante:", error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Contenedor de encabezado y buscador en dos columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pb-10">
                {/* Columna 1: textos */}
                <div>
                    <h1 className="text-2xl font-bold mb-6 tracking-tight text-gray-600 text-center md:text-left">
                        Asignar Estudiantes
                    </h1>
                    <p className="text-lg font-bold mb-3 tracking-tight text-gray-600 text-left">Grupo: {grupo}</p>
                    <p className="text-lg font-bold mb-3 tracking-tight text-gray-600 text-left">Año Lectivo: {anioLectivo}</p>
                    <p className="text-lg font-bold mb-3 tracking-tight text-gray-600 text-left">Docente Guía: {docenteGuia}</p>
                </div>

                {/* Columna 2: buscador */}
                <div className="text-black">
                    <BuscarEstudiantes onSelect={handleAsignar} />
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
                        <th className="text-left px-4 py-2 font-semibold text-gray-700 border border-gray-300">Estudiantes</th>
                        <th className="text-left px-4 py-2 font-semibold text-gray-700 border border-gray-300">Código Estudiantil</th>
                        <th className="text-center px-4 py-2 font-semibold text-gray-700 border border-gray-300">Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {estudiantes.map((rel) => (
                        <tr key={rel.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-2 border border-gray-300">{rel.estudiante.name} {rel.estudiante.lastName}</td>
                            <td className="px-4 py-2 border border-gray-300">{rel.estudiante.studentCode}</td>
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
