import { NivelAcademicoPayload } from "@/interfaces";
import { feching } from "@/utils/cliente-http";

export async function getNivelesAcademicos () {
    const endPoint = `/academicLevel`;
    
    const response = await feching (
        endPoint, "no-cache", "GET"
    
    )
     if (!response.data || response.error) {
    throw new Error(response?.error || "Error al obtener los datos");
  }
    return response.data
}

export async function saveNivelAcademico(nivelAcademico: NivelAcademicoPayload) {
    const endpoint = `/academicLevel`

    const response = await feching(endpoint, "no-cache", "POST", nivelAcademico);

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al agregar");

    } return response.data
}

export async function updateNivelAcademico (id:number, nivelAcademico: NivelAcademicoPayload){
 const endpoint = `/academicLevel/${id}`;

    const response = await feching(endpoint, "no-cache", "PUT", nivelAcademico);

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al actualizar");

    } return response.data
}

export async function deleteNivelAcademico(id:number){
    const endpoint = `/academicLevel/${id}`;

    const response = await feching(endpoint, "no-cache", "DELETE");

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al eliminar");

    } return response.data
}