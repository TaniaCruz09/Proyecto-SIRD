"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Download,
  Eye,
  FileText,
  Loader2,
  Paperclip,
  Plus,
  Trash2,
  X,
} from "lucide-react"
import {
  deleteDocument,
  DocumentOwner,
  ExpedienteDocument,
  getDocuments,
  uploadDocument,
} from "@/actions/documentsMethods/documentMethods"
import ModalBase from "@/components/modals/ModalBase"
import DocumentPreview from "./DocumentPreview"
import ConfirmDeleteDocument from "./ConfirmDeleteDocument"
import { fileUrl, formatDate, formatSize } from "./document-format"

interface DocumentsCardProps {
  owner: DocumentOwner
  ownerId: number
}

const ACCEPTED_FILES =
  ".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx"

const PAGE_SIZE = 4

export default function DocumentsCard({ owner, ownerId }: DocumentsCardProps) {
  const [documents, setDocuments] = useState<ExpedienteDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [nombre, setNombre] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<ExpedienteDocument | null>(null)
  const [page, setPage] = useState(1)
  const [pendingDelete, setPendingDelete] = useState<ExpedienteDocument | null>(null)
  const [deleting, setDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const loadDocuments = useCallback(async () => {
    try {
      setError(null)
      setDocuments(await getDocuments(owner, ownerId))
    } catch (err: any) {
      setError(err?.message ?? "No se pudieron cargar los documentos")
    } finally {
      setLoading(false)
    }
  }, [owner, ownerId])

  useEffect(() => {
    loadDocuments()
  }, [loadDocuments])

  useEffect(() => {
    if (!preview && !pendingDelete) return

    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      if (pendingDelete) {
        if (!deleting) setPendingDelete(null)
        return
      }
      setPreview(null)
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [preview, pendingDelete, deleting])

  const totalPages = Math.max(1, Math.ceil(documents.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const pageDocuments = documents.slice(startIndex, startIndex + PAGE_SIZE)

  const resetForm = () => {
    setNombre("")
    setFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nombre.trim()) {
      setError("Escribe un nombre para el documento (ej. Cédula, Partida de nacimiento).")
      return
    }
    if (!file) {
      setError("Selecciona el archivo que quieres adjuntar.")
      return
    }

    setSaving(true)
    setError(null)

    try {
      await uploadDocument(owner, ownerId, nombre.trim(), file)
      resetForm()
      setShowForm(false)
      setPage(1)
      await loadDocuments()
    } catch (err: any) {
      setError(err?.message ?? "No se pudo subir el documento")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (document: ExpedienteDocument) => {
    setError(null)
    setPendingDelete(document)
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return

    setDeleting(true)

    try {
      await deleteDocument(owner, pendingDelete.id)
      setDocuments((prev) => prev.filter((item) => item.id !== pendingDelete.id))
      setPage((prev) =>
        Math.min(prev, Math.max(1, Math.ceil((documents.length - 1) / PAGE_SIZE))),
      )
      setPendingDelete(null)
    } catch (err: any) {
      setError(err?.message ?? "No se pudo eliminar el documento")
      setPendingDelete(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Card className="mt-6 border-0 shadow-lg">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 px-4 pb-4 sm:px-6">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-slate-800">
          <FileText className="w-5 h-5 text-green-600" />
          Documentos
          <Badge variant="outline" className="ml-2 text-xs">
            {documents.length}
          </Badge>
        </CardTitle>

        <Button
          type="button"
          onClick={() => {
            setShowForm((prev) => !prev)
            setError(null)
            if (showForm) resetForm()
          }}
          className="gap-2 bg-green-600 hover:bg-green-700"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancelar" : "Agregar documento"}
        </Button>
      </CardHeader>

      <CardContent className="space-y-4 px-4 sm:px-6">
        <p className="text-sm text-muted-foreground">
          Adjunta la cédula, partida de nacimiento, título u otro documento del
          expediente. Formatos: PDF, JPG, PNG, WEBP, Word o Excel (máx. 5 MB).
        </p>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-gray-200 bg-gray-50/70 p-4 space-y-3"
          >
            <div>
              <label
                htmlFor="documento-nombre"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Nombre del documento
              </label>
              <input
                id="documento-nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Cédula de identidad, Partida de nacimiento…"
                maxLength={120}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-400"
              />
            </div>

            <div>
              <span className="mb-1 block text-sm font-medium text-gray-700">
                Archivo
              </span>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-white px-4 py-3 text-sm text-gray-600 transition hover:border-green-400 hover:bg-green-50">
                <Paperclip className="w-4 h-4" />
                <span className="truncate">
                  {file ? file.name : "Seleccionar archivo"}
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_FILES}
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>

            <Button
              type="submit"
              disabled={saving}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {saving ? "Guardando…" : "Guardar documento"}
            </Button>
          </form>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {loading ? (
          <p className="py-4 text-center text-sm text-gray-500">
            Cargando documentos…
          </p>
        ) : documents.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50/60 px-4 py-6 text-center text-sm text-gray-500">
            Todavía no hay documentos adjuntos en este expediente.
          </p>
        ) : (
          <>
          <ul className="divide-y divide-gray-100 rounded-lg border border-gray-100">
            {pageDocuments.map((document) => (
              <li
                key={document.id}
                className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                    <FileText className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-900">
                      {document.nombre}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatSize(document.tamano)} · {formatDate(document.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreview(document)}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-blue-600 transition hover:bg-blue-50"
                  >
                    <Eye className="w-4 h-4" />
                    Ver
                  </button>
                  <a
                    href={`${fileUrl(document.archivo)}?download=1`}
                    download
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-slate-600 transition hover:bg-slate-100"
                  >
                    <Download className="w-4 h-4" />
                    Descargar
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDelete(document)}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-center justify-between gap-3 pt-1 text-sm text-gray-600 sm:flex-row">
            <p>
              Mostrando {startIndex + 1} - {startIndex + pageDocuments.length} de{" "}
              {documents.length} documento(s)
            </p>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">
                Página {currentPage} de {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-md bg-gray-200 px-3 py-1 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="rounded-md bg-gray-200 px-3 py-1 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
          </>
        )}
      </CardContent>

      {preview && (
        <ModalBase
          onshowModal={Boolean(preview)}
          onCloseModal={() => setPreview(null)}
          containerClassName="max-w-4xl p-4 sm:p-6"
          content={<DocumentPreview document={preview} />}
        />
      )}

      <ConfirmDeleteDocument
        document={pendingDelete}
        deleting={deleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </Card>
  )
}
