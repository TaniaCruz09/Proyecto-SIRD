import { Docente, DocentePayload } from "@/interfaces";
import { feching } from "@/utils/cliente-http"

export async function getDocentes() {
  const endPoint = `/docentes`

  const response = await feching(endPoint, "no-cache", "GET");

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

export async function getGradosByDocenteId(id: number) {
  const endPoint = `/docentes/getGradosByDocenteId/${id}`;

  const response = await feching(endPoint, "no-cache", "GET");

  if (!response.data || response.error) {
    throw new Error(response?.error || "error desconocido desde el front de obtener un usuario")
  }

  return response.data;

}

export async function saveDocente(formData: FormData) {
  const endPoint = `/docentes`;

  const response = await feching(endPoint, "no-cache", "POST", formData);

  if (!response.data || response.error) {
    throw new Error(response?.error || "Error desconocido al agregar docente");
  }

  return response.data;
}

export async function updateDocente(id: number, formData: FormData) {
  const endPoint = `/docentes/${id}`;
  const response = await feching(endPoint, "no-cache", "PUT", formData);

  if (!response || response.error) {
    throw new Error(response?.error || "Error desconocido al actualizar docente");
  }

  return response.data;
}

// // Subir imagen de docente (FormData)
// export async function uploadDocenteImage(id: number, file: File) {
//   const formData = new FormData();
//   formData.append("foto_docente", file);

//   const response = await feching(`/docentes/${id}/uploads/docentes`, "no-cache", "POST", formData);
//   if (!response.data || response.error) throw new Error(response?.error || "Error al subir la imagen del docente");
//   return response.data; // { fileName: "nombre.jpg" }
// }

export async function deleteDocentes(id: number) {
  const endPoint = `/docentes/${id}`;

  const response = await feching(endPoint, "no-cache", "DELETE")

  if (!response.data || response.data.error) {
    throw new Error(response?.error)
  }

  return response.data
}