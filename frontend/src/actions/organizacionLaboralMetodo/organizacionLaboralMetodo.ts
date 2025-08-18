
import { OrganizacionLaboralPayload } from "@/interfaces/organizacionLaboralInterface"
import { feching } from "@/utils/cliente-http"


export  async function getOrganizacionLaboral() {
    const endpont = '/organizacionLaboral'
    const response = await feching(endpont, 'no-cache', 'GET')
    if (!response.data || response.error) {
        throw new Error(response?.error || 'error al obtener la organizacion laboral')

    }
    console.log(response.data ,'esto devuelve el get')
    return response.data
}

export async function getOrganizacionLaboralById(id: number) {
    const endPoint = `/organizacionLaboral/${id}`
    const response = await feching(endPoint, 'no-cache', 'GET')
    if (!response.data || response.error) {
        throw new Error(response?.error)
    }
    return response.data

}

 export async function saveOrganizacionLaboral(organizacionLaboral: OrganizacionLaboralPayload) {
     const endPoint = '/organizacionLaboral'
     console.log(organizacionLaboral, 'esta es la organizacion laboral que se envia al back')
     const response = await feching(endPoint, 'no-cache', 'POST', organizacionLaboral)
     if (!response.data || response.error) {
         throw new Error(response?.error || 'error al agregar organizacion laboral')

     }
     return response.data
 }

export async function ActualizarOrganizacionEscolar(id: number, organizacionLaboral: OrganizacionLaboralPayload) {
    console.log(organizacionLaboral, 'esta es la organizacion laboral que se envia al back para actualizar')
    const endPoint = `/organizacionLaboral/${id}`
    const response = await feching(endPoint, 'no-cache', 'PUT', organizacionLaboral)
    if (!response || response.error) {
        throw new Error(response?.error)
    }
    return response.data
}

export async function EliminarOrganizacionLaboral(id: number) {
    const endPoint = `/organizacionLaboral/${id}`
    const response = await feching(endPoint, 'no-cache', 'DELETE')
    if (!response.data || response.data.error) {
        throw new Error(response?.error)
    }

    return response.data
}