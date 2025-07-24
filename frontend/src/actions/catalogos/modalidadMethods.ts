import { Modalidad, ModalidadPayload } from "@/interfaces";
import { feching } from "@/utils/cliente-http"

export async function getModalidades() {
    const endpoint = `/modalidad`

    const response = await feching(endpoint, "no-cache", "GET");

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al obtener modalidad");

    } return response.data

}

export async function getModalidadById(id:number) {
    const endpoint = `/modalidad/${id}`;

    const response = await feching(endpoint, "no-cache", "GET");

    if(!response.data || response.error) {
        throw new Error(response?.error || "error desconocido desde el front de obtener una modalidad")

    } return response.data;
    
}

export async function saveModalidad(modalidad: ModalidadPayload){
    const endPoint = `/modalidad`;

    const response = await feching(endPoint, "no-cache", "POST", modalidad)

    if(!response.data || response.error) {
        throw new Error(response?.error || "error desde el front de agregar modalidad")
    } 

    return response.data;
}

export async function updateModalidad(id: number, modalidad: ModalidadPayload ) {
    const endPoint = `/modalidad/${id}`;

    const response = await feching(endPoint, "no-cache", "PUT", modalidad);

    if (!response || response.error) {
        throw new Error (response?.error || "error desconocido desde el front al actualidar modalidad")

    }

    return response.data;

}

export async function deleteModalidad(id:number) {
    const endPoint = `/modalidad/${id}`;

    const response = await feching(endPoint, "no-cache", "DELETE")

    if (!response.data || response.data.error){
        throw new Error(response?.error)
    }
    return response.data
}