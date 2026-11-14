import { feching } from "@/utils/cliente-http"


export async function getRegisterEstudent() {
    const endpont = '/student'
    const response = await feching(endpont, 'no-cache', 'GET')
    if (!response.data || response.error) {
        throw new Error(response?.error || 'error al obtener los estudiantes')

    }
    console.log(response.data, 'esto devuelve el get')
    return response.data
}

export async function getFiltarStudent(params?: string, anioId?: number | string) {
    const searchParams = new URLSearchParams(params ?? "")

    if (anioId !== undefined && anioId !== null && String(anioId).trim() !== "" && Number(anioId) > 0) {
        searchParams.set("anioId", String(anioId))
    }

    const query = searchParams.toString()
    const endPoint = query ? `/student/filtrar?${query}` : '/student/filtrar'
    const response = await feching(endPoint, 'no-cache', 'GET')
    if (!response || response.error) {
        throw new Error(response?.error)
    }
    return response;

}
export async function getEstudentById(id: number) {
    const endPoint = `/student/${id}`
    const response = await feching(endPoint, 'no-cache', 'GET')
    console.log(response.data, '📞 Estudiante obtenido por ID');
    if (!response.data || response.error) {
        throw new Error(response?.error)
    }
    return response.data
}

export async function saveStudent(student: FormData) {
    const endPoint = '/student'

    const response = await feching(endPoint, 'no-cache', 'POST', student)
    if (!response.data || response.error) {
        throw new Error(response?.error || 'error al agregar estudiante')

    }
    return response.data
}

export async function ActualizarStudent(id: number, student: FormData) {

    const endPoint = `/student/${id}`
    const response = await feching(endPoint, 'no-cache', 'PUT', student)
    if (!response || response.error) {
        throw new Error(response?.error)
    }
    return response.data
}

export async function EliminarStudent(id: number) {
    const endPoint = `/student/${id}`
    const response = await feching(endPoint, 'no-cache', 'DELETE')
    if (!response.data || response.data.error) {
        throw new Error(response?.error)
    }

    return response.data
}
export interface ExistenciaEstudiante {
    existe: boolean
    campo: "cedula" | "codigo" | null
    valor: string | null
}

/**
 * Consulta en el backend si la cédula o el código ya pertenecen a otro estudiante
 * (ignora guiones y mayúsculas). No descarga el listado completo.
 */
export async function existeEstudiante(params: {
    cedula?: string
    codigo?: string
    excluirId?: number
}): Promise<ExistenciaEstudiante> {
    const searchParams = new URLSearchParams()
    if (params.cedula?.trim()) searchParams.set("cedula", params.cedula.trim())
    if (params.codigo?.trim()) searchParams.set("codigo", params.codigo.trim())
    if (params.excluirId) searchParams.set("excluirId", String(params.excluirId))

    const endPoint = `/student/existe?${searchParams.toString()}`
    const response = await feching(endPoint, "no-cache", "GET")

    return (
        response?.data ?? {
            existe: false,
            campo: null,
            valor: null,
        }
    )
}
