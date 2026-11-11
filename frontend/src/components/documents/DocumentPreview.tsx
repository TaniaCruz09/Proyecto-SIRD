"use client"

import { Download, FileWarning } from "lucide-react"
import { ExpedienteDocument } from "@/actions/documentsMethods/documentMethods"
import {
  fileUrl,
  formatDate,
  formatSize,
  isImage,
  isPdf,
  isWord,
} from "./document-format"
import PdfViewer from "./PdfViewer"

interface DocumentPreviewProps {
  document: ExpedienteDocument
}

/**
 * Contenido del modal para previsualizar un documento del expediente.
 * Imágenes y PDF se muestran dentro del sistema; el resto se ofrece descargar.
 */
export default function DocumentPreview({ document }: DocumentPreviewProps) {
  const url = fileUrl(document.archivo)

  return (
    <div className="space-y-4 p-2">
      <div className="pr-8">
        <h3 className="truncate text-lg font-semibold text-slate-900">
          {document.nombre}
        </h3>
        <p className="text-xs text-slate-500">
          {formatSize(document.tamano)} · {formatDate(document.createdAt)}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
        {isImage(document) ? (
          <img
            src={url}
            alt={document.nombre}
            className="mx-auto max-h-[68vh] w-auto max-w-full object-contain"
          />
        ) : isPdf(document) ? (
          <PdfViewer url={url} />
        ) : (
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <FileWarning className="h-10 w-10 text-slate-400" />
            <p className="text-sm text-slate-600">
              {isWord(document)
                ? "El navegador no puede mostrar archivos Word. Descárgalo para abrirlo, o vuelve a subirlo como PDF."
                : "Este tipo de archivo no se puede previsualizar en el navegador."}
            </p>
            <p className="text-xs text-slate-500">
              Descárgalo para abrirlo con la aplicación correspondiente.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <a
          href={`${url}?download=1`}
          download
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
        >
          <Download className="h-4 w-4" />
          Descargar
        </a>
      </div>
    </div>
  )
}
