import { feching } from "@/utils/cliente-http"

export type DocumentOwner = "estudiante" | "docente"

export interface ExpedienteDocument {
  id: number
  nombre: string
  archivo: string
  tipo?: string | null
  tamano?: number | null
  createdAt: string
}

const ENDPOINTS: Record<DocumentOwner, string> = {
  estudiante: "/student-documents",
  docente: "/docente-documents",
}

const OWNER_PARAMS: Record<DocumentOwner, string> = {
  estudiante: "studentId",
  docente: "docenteId",
}

export async function getDocuments(
  owner: DocumentOwner,
  ownerId: number,
): Promise<ExpedienteDocument[]> {
  const response = await feching(
    `${ENDPOINTS[owner]}?${OWNER_PARAMS[owner]}=${ownerId}`,
    "no-cache",
    "GET",
  )

  return Array.isArray(response) ? response : []
}

export async function uploadDocument(
  owner: DocumentOwner,
  ownerId: number,
  nombre: string,
  file: File,
): Promise<ExpedienteDocument> {
  const formData = new FormData()
  formData.append(OWNER_PARAMS[owner], String(ownerId))
  formData.append("nombre", nombre)
  formData.append("archivo", file)

  return await feching(ENDPOINTS[owner], "no-cache", "POST", formData)
}

export async function deleteDocument(owner: DocumentOwner, id: number) {
  return await feching(`${ENDPOINTS[owner]}/${id}`, "no-cache", "DELETE")
}
