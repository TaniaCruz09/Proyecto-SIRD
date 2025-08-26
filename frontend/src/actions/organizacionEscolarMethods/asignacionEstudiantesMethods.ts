
import { GrupoConEstudiante, GrupoConEstudiantePayload } from "@/interfaces/organizacionEscolarInterface/grupoConEstudianteInterface";
import { feching } from "@/utils/cliente-http";

export async function asignarEstudianteAGrupo(payload: GrupoConEstudiantePayload) {
    const endopoint = `/gruposConEstudiantes/asignar`

    const response = await feching(endopoint, 'no-cache', 'POST', payload)

    if (!response.data || response.error) {
        throw new Error(response?.error)
    }
    return response.data
}

export async function getEstudiantesAsignados(idGrupo: number) {
    const endpoint = `/gruposConEstudiantes/obtenerEstudiantes?grupoId=${idGrupo}`;
    const response = await feching(endpoint, 'no-cache', 'GET');

    if (!response || response.error) {
        throw new Error(response?.error);
    }

    return response;
}

export async function getGrupoEscolarConEstudiantes() {
    const endPoint = `/gruposConEstudiantes`;

    const response = await feching(endPoint, "no-cache", "GET");

    if (!response.data || response.error) {
        throw new Error(response?.error || "Error al obtener el grupo con sus estudiantes");
    }

    return response.data
}

export async function eliminarEstudianteAsignado(IdGrupoConEstudiante: number) {
    const endPoint = `/gruposConEstudiantes/${IdGrupoConEstudiante}`;
    const response = await feching(endPoint, "no-cache", "DELETE")
    return response.data;
}

//cambiar a un estudiante de grupo
export const moverEstudianteDeGrupo = async (id: number, nuevoGrupoConEstudiante: GrupoConEstudiantePayload) => {
    const endPoint = `/gruposConEstudiantes/${id}`

    const response = await feching(endPoint, "no-cache", "PUT", nuevoGrupoConEstudiante)
    if (!response.data || response.error) {
        throw new Error(response?.error)
    }
    return response.data
}

