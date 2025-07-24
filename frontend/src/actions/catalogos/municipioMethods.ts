import { MunicipioPayload } from "@/interfaces";
import { feching } from "@/utils/cliente-http";

export async function getMunicipios () {
    const endPoint = `/Municipio`;
    
    const response = await feching (
        endPoint, "no-cache", "GET"
    
    )
     if (!response.data || response.error) {
    throw new Error(response?.error || "Error al obtener los datos");
  }
    return response.data
}

export async function saveMunicipio(municipio: MunicipioPayload) {
    const endpoint = `/Municipio`

    const response = await feching(endpoint, "no-cache", "POST", municipio);

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al agregar");

    } return response.data
}

export async function updateMunicipio (id:number, municipio: MunicipioPayload){
 const endpoint = `/Municipio/${id}`;

    const response = await feching(endpoint, "no-cache", "PUT", municipio);

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al actualizar");

    } return response.data
}

export async function deleteMunicipio(id:number){
    const endpoint = `/Municipio/${id}`;

    const response = await feching(endpoint, "no-cache", "DELETE");

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al eliminar");

    } return response.data
}