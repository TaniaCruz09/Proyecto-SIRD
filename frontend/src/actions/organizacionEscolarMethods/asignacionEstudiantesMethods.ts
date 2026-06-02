
import { GrupoConEstudiantePayload } from "@/interfaces/organizacionEscolarInterface/asignarEstudianteInterface";
import { feching } from "@/utils/cliente-http";

export async function asignarEstudianteAGrupo(payload: GrupoConEstudiantePayload) {
    const endopoint = `/grupo-asignatura-estudiantes/asignar`

    const response = await feching(endopoint, 'no-cache', 'POST', payload)

    if (!response.data || response.error) {
        throw new Error(response?.error)
    }
    return response.data
}

export async function getGrupoEscolarConEstudiantes() {
    const endPoint = `/grupo-asignatura-estudiantes`;

    const response = await feching(endPoint, "no-cache", "GET");

    if (!response.data || response.error) {
        throw new Error(response?.error || "Error al obtener el grupo con sus estudiantes");
    }

    return response.data
}

export async function getEstudiantesAsignados(idGrupo: number) {
    const endpoint = `/grupo-asignatura-estudiantes/obtenerEstudiantes-por-grupo/${idGrupo}`;
    const response = await feching(endpoint, 'no-cache', 'GET');

    if (!response.data || response.error) {
        throw new Error(response?.error);
    }

    return response.data;
}

// Cambiar a un estudiante de grupo
export const moverEstudianteDeGrupo = async (
    estudianteId: number,
    grupoOrigenId: number,
    grupoDestinoId: number
) => {
    const body = {
        estudianteId,
        grupoOrigenId,
        grupoDestinoId
    };

    const endPoint = `/grupo-asignatura-estudiantes/mover-estudiante`;

    const response = await feching(endPoint, "no-cache", "POST", body);

    if (!response.data || response.error) {
        throw new Error(response?.error || 'Error al mover al estudiante');
    }

    return response.data;
};


export async function eliminarEstudianteAsignado(grupoId: number, estudianteId: number) {
    const endPoint = `/grupo-asignatura-estudiantes/grupo/${grupoId}/estudiante/${estudianteId}`;
    const response = await feching(endPoint, "no-cache", "DELETE")
    return response.data;
}

export async function actualizarEstadoEstudianteEnGrupo(
    grupoId: number,
    estudianteId: number,
    activo: boolean,
) {
    const endPoint = `/grupo-asignatura-estudiantes/grupo/${grupoId}/estudiante/${estudianteId}/estado`;
    const response = await feching(endPoint, "no-cache", "PATCH", { activo });

    if (!response.data || response.error) {
        throw new Error(response?.error || "Error al actualizar el estado del estudiante en el grupo");
    }

    return response.data;
}


