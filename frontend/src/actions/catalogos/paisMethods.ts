import { PaisPayload } from "@/interfaces";
import { feching } from "@/utils/cliente-http";

export async function getPaises () {
    const endPoint = `/pais`;
    
    const response = await feching (
        endPoint, "no-cache", "GET"
    
    )
     if (!response.data || response.error) {
    throw new Error(response?.error || "Error al obtener paises");
  }
    return response.data
}

export async function savePais(pais: PaisPayload) {
    const endpoint = `/pais`

    const response = await feching(endpoint, "no-cache", "POST", pais);

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al agregar");

    } return response.data
}

export async function updatePais (id:number, pais: PaisPayload){
 const endpoint = `/pais/${id}`;

    const response = await feching(endpoint, "no-cache", "PUT", pais);

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al actualizar");

    } return response.data
}

export async function deletePais(id:number){
    const endpoint = `/pais/${id}`;

    const response = await feching(endpoint, "no-cache", "DELETE");

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al eliminar");

    } return response.data
}