import { ProfesionPayload } from "@/interfaces";
import { feching } from "@/utils/cliente-http";

export async function getProfesiones () {
    const endPoint = `/profession`;
    
    const response = await feching (
        endPoint, "no-cache", "GET"
    
    )
     if (!response.data || response.error) {
    throw new Error(response?.error || "Error al obtener los datos");
  }
    return response.data
}

export async function saveProfesion(profecion: ProfesionPayload) {
    const endpoint = `/profession`

    const response = await feching(endpoint, "no-cache", "POST", profecion);

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al agregar");

    } return response.data
}

export async function updateProfesion (id:number, profecion: ProfesionPayload){
 const endpoint = `/profession/${id}`;

    const response = await feching(endpoint, "no-cache", "PUT", profecion);

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al actualizar");

    } return response.data
}

export async function deleteProfesion(id:number){
    const endpoint = `/profession/${id}`;

    const response = await feching(endpoint, "no-cache", "DELETE");

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al eliminar");

    } return response.data
}