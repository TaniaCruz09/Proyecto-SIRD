import { DepartamentoPayload } from "@/interfaces";
import { feching } from "@/utils/cliente-http"

export async function getDepartamentos() {
    const endpoint = `/departamento`

    const response = await feching(endpoint, "no-cache", "GET");

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al obtener");

    } return response.data
}

export async function saveDepartamento(departamento:DepartamentoPayload) {
    const endpoint = `/departamento`

    const response = await feching(endpoint, "no-cache", "POST", departamento);

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al agregar");

    } return response.data
}

export async function updateDepartamento (id:number, departamento:DepartamentoPayload){
 const endpoint = `/departamento/${id}`;

    const response = await feching(endpoint, "no-cache", "PUT", departamento);

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al actualizar");

    } return response.data
}

export async function deleteDepartamento(id:number){
    const endpoint = `/departamento/${id}`;

    const response = await feching(endpoint, "no-cache", "DELETE");

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al eliminar");

    } return response.data
}