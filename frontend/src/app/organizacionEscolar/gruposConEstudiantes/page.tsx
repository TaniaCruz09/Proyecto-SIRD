"use client"

import { asignarEstudianteAGrupo, eliminarEstudianteAsignado, getEstudiantesAsignados } from '@/actions/organizacionEscolarMethods/asignacionEstudiantesMethods';
import BuscarEstudiantes from '@/components/Filtros/BuscarEstudiantes';
import NavbarAdmin from '@/components/navbarAdmin';
import { OrganizacionEscolarConEstudiante, OrganizacionEscolarConEstudiantePayload } from '@/interfaces/organizacionEscolarInterface/organizacionConEstudianteInterface';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function AsignarEstudiantesAOrganizacion() {
    const searchParams = useSearchParams();

    const idOrganizacion = Number(searchParams.get("idOrganizacion"));
    const anioLectivo = searchParams.get("anioLectivo");
    const grupo = searchParams.get("grupo");
    const docenteGuia = searchParams.get("docenteGuia");

    const [estudiantes, setEstudiantes] = useState<OrganizacionEscolarConEstudiante[]>([]);

    useEffect(() => {
        if (idOrganizacion) {
            getEstudiantesAsignados(idOrganizacion)
                .then(data => setEstudiantes(data))
                .catch(err => {
                    console.error("Error en el useEffect al obtener estudiantes:", err);
                    setEstudiantes([]);
                });
        }
    }, [idOrganizacion]);

    const handleEliminar = async (relacionId: number) => {
        try {
            await eliminarEstudianteAsignado(relacionId);
            setEstudiantes(prev => prev.filter(est => est.id !== relacionId));
        } catch (error) {
            console.error('Error eliminando estudiante asignado:', error);
        }
    };

    const handleAsignar = async (student: any) => {
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
        <div className="flex h-screen">
            <div>
                <NavbarAdmin />
            </div>
            <div className="w-screen p-6 bg-gray-100">
                <div className="">
                    <h1 className="ml-10 text-2xl font-bold mb-4 tracking-tight text-gray-600 text-center">
                        Organizacion con Estudiantes
                    </h1>
                    <p className="text-lg font-bold mb-4 tracking-tight text-gray-600 ">Grupo: {grupo}</p>
                    <p className=" text-lg font-bold mb-4 tracking-tight text-gray-600 ">Año Lectivo: {anioLectivo}</p>
                    <p className=" text-lg font-bold mb-4 tracking-tight text-gray-600 ">Docente Guia: {docenteGuia}</p>
                </div>

                {/* Buscador aquí */}
                <div className="my-6 text-black">
                    <BuscarEstudiantes onSelect={handleAsignar} />
                </div>

                <div className="flex items-center justify-between bg-white border rounded-t-xl">
                    <h2 className="pl-10 text-xl font-bold text-gray-600">
                        Listado de estudiantes
                    </h2>
                </div>

                <table className="w-full border border-gray-300 text-black">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">Estudiante</th>
                            <th className="p-2 border">Codigo Estudiantil</th>
                            <th className="p-2 border">Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {estudiantes.map((rel) => (
                            <tr key={rel.id}>
                                <td className="border p-2">{rel.estudiante.name} {rel.estudiante.lastName}</td>
                                <td className="border p-2">{rel.estudiante.studentCode}</td>
                                <td className="border p-2 text-center">
                                    <button
                                        onClick={() => handleEliminar(rel.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
