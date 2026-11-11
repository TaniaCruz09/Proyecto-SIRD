import { ExpedienteDocument } from "@/actions/documentsMethods/documentMethods"

export function formatSize(bytes?: number | null) {
  if (!bytes) return "—"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function formatDate(value?: string) {
  if (!value) return "—"
  return new Date(value).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function fileUrl(archivo: string) {
  return `${process.env.NEXT_PUBLIC_API_UPLOADS}${archivo}`
}

export function isImage(document: ExpedienteDocument) {
  return (
    (document.tipo ?? "").startsWith("image/") ||
    /\.(png|jpe?g|webp|gif|bmp)$/i.test(document.archivo)
  )
}

export function isPdf(document: ExpedienteDocument) {
  return document.tipo === "application/pdf" || /\.pdf$/i.test(document.archivo)
}

export function isWord(document: ExpedienteDocument) {
  return (
    document.tipo ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    document.tipo === "application/msword" ||
    /\.docx?$/i.test(document.archivo)
  )
}
