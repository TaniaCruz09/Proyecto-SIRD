import { SexoPayload } from "@/interfaces";
import { feching } from "@/utils/cliente-http";

export async function getSexos () {
    const endPoint = `/gender`;
    
    const response = await feching (
        endPoint, "no-cache", "GET"
    
    )
     if (!response.data || response.error) {
    throw new Error(response?.error || "Error al obtener los datos");
  }
    return response.data
}

export async function saveSexo(sexo: SexoPayload) {
    const endpoint = `/gender`

    const response = await feching(endpoint, "no-cache", "POST", sexo);

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al agregar");

    } return response.data
}

export async function updateSexo (id:number, sexo: SexoPayload){
 const endpoint = `/gender/${id}`;

    const response = await feching(endpoint, "no-cache", "PUT", sexo);

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al actualizar");

    } return response.data
}

export async function deleteSexo(id:number){
    const endpoint = `/gender/${id}`;

    const response = await feching(endpoint, "no-cache", "DELETE");

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al eliminar");

    } return response.data
}