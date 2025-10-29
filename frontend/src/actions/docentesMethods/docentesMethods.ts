import { Docente, DocentePayload } from "@/interfaces";
import { feching } from "@/utils/cliente-http"

export async function getDocentes(docente: DocentePayload) {
    const endPoint = `/docentes`
    console.log(docente, 'este es el payload JSON que se envia al back');
    const response = await feching(endPoint, "no-cache", "GET", docente);

    if (!response.data || response.error) {
        throw new Error(response?.error || "Error al obtener docentes");
    }

    return response.data

}

export async function getDocenteById(id: number) {
    const endPoint = `/docentes/${id}`;

    const response = await feching(endPoint, "no-cache", "GET");

    if (!response.data || response.error) {
        throw new Error(response?.error || "error desconocido desde el front de obtener un usuario")
    }

    return response.data;

}

// export async function saveDocente(docente: FormData) {
//     const endPoint = `/docentes`;
//     console.log(docente, 'este es el docente que se envia al back')
//     const response = await feching(endPoint, "no-cache", "POST", docente)

//     if (!response.data || response.error) {
//         throw new Error(response?.error || "error desconocido desde el front de agragar docente")
//     }
 
//     return response.data;
    
// }

// Guardamos un docente
export const saveDocente = async (data: FormData) => {
  try {
    // POST a la API
    const res = await feching("/docentes/", "no-cache", "POST", data);
    return res;
  } catch (error) {
    console.error("❌ Error en saveDocente:", error);
    throw error;
  }
};

// export async function updateDocente(id: number, docente: FormData) {
//     const endPoint = `/docentes/${id}`;
// console.log(docente, 'este es el docente que se envia al back para actualizar')
//     const response = await feching(endPoint, "no-cache", "PUT", docente);

//     if (!response || response.error) {
//         throw new Error(response?.error || "error desconocido desde el front de actualizar docente")
//     }

//     return response.data;
// }

// Actualizamos un docente
// export const updateDocente = async (id: number, data: FormData) => {
//   try {
//     // PUT a la API
//     const res = await feching(`/docentes/${id}`, "no-cache", "PUT", data);
//     return res;
//   } catch (error) {
//     console.error("❌ Error en updateDocente:", error);
//     throw error;
//   }
// };
// updateDocente
export const updateDocente = async (id: number, formData: FormData) => {
  try {
    console.log(formData.get("dto"), 'este es el payload JSON que se envia al back'); // debug
    const res = await feching(`/docentes/${id}`, "no-cache", "PUT", formData);
    return res;
  } catch (error: any) {
    console.error("❌ Error en updateDocente:", error?.response?.data || error.message || error);
    throw new Error(
      error?.response?.data?.message || "Ocurrió un error al intentar actualizar el docente."
    );
  }
};






export async function deleteDocentes(id: number) {
    const endPoint = `/docentes/${id}`;

    const response = await feching(endPoint, "no-cache", "DELETE")

    if (!response.data || response.data.error) {
        throw new Error(response?.error)
    }

    return response.data
}
