import { OrganizacionEscolarConEstudiantePayload } from "@/interfaces/organizacionEscolarInterface/organizacionConEstudianteInterface";
import { feching } from "@/utils/cliente-http";

export async function asignarEstudianteAGrupo(payload: OrganizacionEscolarConEstudiantePayload) {
    const endopoint = `/organizacionConEstudiantes/asignar`

    const response = await feching(endopoint, 'no-cache', 'POST', payload)

    if (!response.data || response.error) {
        throw new Error(response?.error)
    }
    return response.data
}

export async function getEstudiantesAsignados(idOrganizacionEscolar: number) {
    const endpoint = `/organizacionConEstudiantes/obtenerEstudiantes?organizacionEscolarId=${idOrganizacionEscolar}`;
    const response = await feching(endpoint, 'no-cache', 'GET');

    if (!response || response.error) {
        throw new Error(response?.error);
    }

    return response;
}

export async function getOrganizacionEscolarConEstudiantes() {
    const endPoint = `/organizacionConEstudiantes`;

    const response = await feching(endPoint, "no-cache", "GET");

    if (!response.data || response.error) {
        throw new Error(response?.error || "Error al obtener la organizacion escolar con sus estudiantes");
    }

    return response.data
}

export async function eliminarEstudianteAsignado(IdOrganizacionConEstudiante: number) {
    const endPoint = `/organizacionConEstudiantes/${IdOrganizacionConEstudiante}`;
    const response = await feching(endPoint, "no-cache", "DELETE")
    return response.data;
}

