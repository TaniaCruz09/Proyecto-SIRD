
import { AsignaturasGruposPayload } from "@/interfaces/asignaturasAGruposInterface"
import { feching } from "@/utils/cliente-http"


export  async function getAsignaturasGrupos() {
    const endpont = '/asignaturaGrupo'
    const response = await feching(endpont, 'no-cache', 'GET')
    if (!response.data || response.error) {
        throw new Error(response?.error || 'error al obtener la organizacion laboral')

    }
    console.log(response.data ,'esto devuelve el get')
    return response.data
}

export async function getAsignaturasGruposById(id: number) {
    const endPoint = `/asignaturaGrupo/${id}`
    const response = await feching(endPoint, 'no-cache', 'GET')
    if (!response.data || response.error) {
        throw new Error(response?.error)
    }
    return response.data

}

 export async function saveAsignaturasGrupos(organizacionLaboral: AsignaturasGruposPayload) {
     const endPoint = '/asignaturaGrupo'
     console.log(organizacionLaboral, 'esta es la organizacion laboral que se envia al back')
     const response = await feching(endPoint, 'no-cache', 'POST', organizacionLaboral)
     if (!response.data || response.error) {
         throw new Error(response?.error || 'error al agregar organizacion laboral')

     }
     return response.data
 }

export async function ActualizarAsignaturaGrupos(id: number, organizacionLaboral: AsignaturasGruposPayload) {
    console.log(organizacionLaboral, 'esta es la organizacion laboral que se envia al back para actualizar')
    const endPoint = `/asignaturaGrupo/${id}`
    const response = await feching(endPoint, 'no-cache', 'PUT', organizacionLaboral)
    if (!response || response.error) {
        throw new Error(response?.error)
    }
    return response.data
}

export async function EliminarAsignaturaGrupos(id: number) {
    const endPoint = `/asignaturaGrupo/${id}`
    const response = await feching(endPoint, 'no-cache', 'DELETE')
    if (!response.data || response.data.error) {
        throw new Error(response?.error)
    }

    return response.data
}