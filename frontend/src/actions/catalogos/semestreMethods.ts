import { SemestrePayload } from "@/interfaces";
import { feching } from "@/utils/cliente-http"

export async function getSemestres() {
    const endpoint = `/semestre`

    const response = await feching(endpoint, "no-cache", "GET");

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al obtener");

    } return response.data
}

export async function saveSemestre(semestre: SemestrePayload) {
    const endpoint = `/semestre`

    const response = await feching(endpoint, "no-cache", "POST", semestre);

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al agregar");

    } return response.data
}

export async function updateSemestre (id:number, semestre: SemestrePayload){
 const endpoint = `/semestre/${id}`;

    const response = await feching(endpoint, "no-cache", "PUT", semestre);

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al actualizar");

    } return response.data
}

export async function deleteSemestre(id:number){
    const endpoint = `/semestre/${id}`;

    const response = await feching(endpoint, "no-cache", "DELETE");

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al eliminar");

    } return response.data
}