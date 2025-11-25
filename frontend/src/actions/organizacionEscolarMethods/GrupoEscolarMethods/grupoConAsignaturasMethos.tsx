import { GrupoConAsignaturasPayload, GrupoConAsignaturasResponse } from "@/interfaces/organizacionEscolarInterface/gruposConAsignaturas"
import { feching } from "@/utils/cliente-http"

export async function getGrupoConAsignatura(): Promise<GrupoConAsignaturasResponse[]> {
    const endPoint = '/grupo-asignatura-docente'
    const response = await feching(endPoint, 'no-cache', 'GET')
    console.log(`esta es la repuesta ${response}`)
    if (!response.data || response.error) {
        throw new Error(response?.error || 'Error al obtener grupo con asignaturas')
    }
    return response.data
}

export async function getGrupoConAsignaturaById(id: number): Promise<GrupoConAsignaturasResponse[]> {
    const endPoint = `/grupo-asignatura-docente/grupo/${id}`
    const response = await feching(endPoint, 'no-cache', 'GET')
    console.log(`esta es la repuesta ${response}`)
    if (!response.data || response.error) {
        throw new Error(response?.error || 'Error al obtener grupo con asignatura por ID')
    }
    return response.data
}

export async function saveGrupoConAsignatura(grupoConAsignatura: GrupoConAsignaturasPayload): Promise<GrupoConAsignaturasResponse> {
    const endPoint = '/grupo-asignatura-docente'
    console.log(grupoConAsignatura, 'este es el grupo con asignatura que se envia al back')
    const response = await feching(endPoint, 'no-cache', 'POST', grupoConAsignatura)
    console.log(`esta es la repuesta ${response}`)
    if (!response.data || response.error) {
        throw new Error(response?.error || 'Error al agregar grupo con asignaturas')
    }
    return response.data
}

export async function actualizarGrupoConAsignatura(id: number, grupoConAsignatura: GrupoConAsignaturasPayload): Promise<GrupoConAsignaturasResponse> {
    console.log(grupoConAsignatura, 'este es el grupo con asignatura que se envia al back para actualizar')
    const endPoint = `/grupo-asignatura-docente/${id}`
    const response = await feching(endPoint, 'no-cache', 'PUT', grupoConAsignatura)
    if (!response.data || response.error) {
        throw new Error(response?.error || 'Error al actualizar grupo con asignaturas')
    }
    return response.data
}

export async function eliminarUnaAsignaturaAsignatura(grupoId: number, asignaturaId: number): Promise<{ message: string }> {
    const endPoint = `/grupo-asignatura-docente/grupo/${grupoId}/asignatura/${asignaturaId}`
    const response = await feching(endPoint, 'no-cache', 'DELETE')
    if (response.error) {
        throw new Error(response.error || "Error al eliminar la asignatura del grupo");
    }

    // Si la API solo devuelve { message }, entonces úsalo directo
    if (response.message) {
        return { message: response.message };
    }
    return response.data
}
export async function eliminarGrupoConTodasSusAsignatura(id: number): Promise<{ message: string }> {
    const endPoint = `/grupo-asignatura-docente/grupo/${id}`
    const response = await feching(endPoint, 'no-cache', 'DELETE')
    if (response.error) {
    throw new Error(response.error || "Error al eliminar las asignaturas del grupo");
  }

  // Si la API solo devuelve { message }, entonces úsalo directo
  if (response.message) {
    return { message: response.message };
  }
    return response.data
}
