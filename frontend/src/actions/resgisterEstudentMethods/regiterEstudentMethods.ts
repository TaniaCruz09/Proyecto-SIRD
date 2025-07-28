
import RegisterEstudent from "@/interfaces/registerEstudentInterface"
import { feching } from "@/utils/cliente-http"


export  async function getRegisterEstudent() {
    const endpont = '/student'
    const response = await feching(endpont, 'no-cache', 'GET')
    if (!response.data || response.error) {
        throw new Error(response?.error || 'error al obtener los estudiantes')

    }
    console.log(response.data ,'esto devuelve el get')
    return response.data
}

export async function getEstudentById(id: number) {
    const endPoint = `/student/${id}`
    const response = await feching(endPoint, 'no-cache', 'GET')
    if (!response.data || response.error) {
        throw new Error(response?.error)
    }
    return response.data

}

 export async function saveStudent(student: RegisterEstudent) {
     const data = { student }
     const endPoint = '/student'
     const response = await feching(endPoint, 'no-cache', 'POST', data)
     if (!response.data || response.error) {
         throw new Error(response?.error || 'error al agregar estudiante')

     }
     return response.data
 }

export async function ActualizarStudent(id: number, student: RegisterEstudent) {
    const data = { student }
    const endPoint = `/student${id}`
    const response = await feching(endPoint, 'no-cache', 'PUT', data)
    if (!response || response.error) {
        throw new Error(response?.error)
    }
    return response.data
}

export async function EliminarStudent(id: number) {
    const endPoint = `/student${id}`
    const response = await feching(endPoint, 'no-cache', 'DELETE')
    if (!response.data || response.data.error) {
        throw new Error(response?.error)
    }

    return response.data
}