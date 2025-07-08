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