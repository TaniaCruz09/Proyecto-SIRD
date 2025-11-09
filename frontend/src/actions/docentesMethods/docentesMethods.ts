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

export async function saveDocente(docente: DocentePayload) {
    const endPoint = `/docentes`;
    console.log(docente, 'este es el docente que se envia al back')
    const response = await feching(endPoint, "no-cache", "POST", docente)

    if (!response.data || response.error) {
        throw new Error(response?.error || "error desconocido desde el front de agragar docente")
    }

    return response.data;

}

export async function updateDocente(id: number, docente: DocentePayload) {
    const endPoint = `/docentes/${id}`;
    console.log(docente, 'este es el docente que se envia al back para actualizar')
    const response = await feching(endPoint, "no-cache", "PUT", docente);
    if (!response || response.error) {
        throw new Error(response?.error || "error desconocido desde el front de actualizar docente")
    }

    return response.data;
}

export async function deleteDocentes(id: number) {
    const endPoint = `/docentes/${id}`;

    const response = await feching(endPoint, "no-cache", "DELETE")

    if (!response.data || response.data.error) {
        throw new Error(response?.error)
    }

    return response.data
}

// 🔹 Subir la imagen de un docente (usa FormData)
export async function uploadDocenteImage(id: number, file: File) {
    const endPoint = `/docentes/${id}/uploads/docentes`;

    const formData = new FormData();
    formData.append("foto_docente", file);

    console.log("📸 Subiendo imagen de docente:", file.name);

    const response = await feching(endPoint, "no-cache", "POST", formData);

    if (!response.data || response.error) {
        throw new Error(response?.error || "Error al subir la imagen del docente");
    }

    return response.data; // ← { fileName: "nombre.jpg" }
}
