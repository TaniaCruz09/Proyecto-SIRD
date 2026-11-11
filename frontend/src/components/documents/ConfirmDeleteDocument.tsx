"use client"

import { Loader2, Trash2 } from "lucide-react"
import ModalBase from "@/components/modals/ModalBase"
import { ExpedienteDocument } from "@/actions/documentsMethods/documentMethods"

interface ConfirmDeleteDocumentProps {
  document: ExpedienteDocument | null
  deleting: boolean
  onCancel: () => void
  onConfirm: () => void
}

/** Confirmación de borrado de un documento del expediente. */
export default function ConfirmDeleteDocument({
  document,
  deleting,
  onCancel,
  onConfirm,
}: ConfirmDeleteDocumentProps) {
  if (!document) return null

  return (
    <ModalBase
      onshowModal
      onCloseModal={deleting ? () => undefined : onCancel}
      containerClassName="max-w-md p-6 sm:p-7"
      content={
        <div className="pt-1 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 ring-8 ring-red-50/60">
            <Trash2 className="h-6 w-6" />
          </div>

          <h3 className="text-lg font-semibold text-slate-900">
            Eliminar documento
          </h3>

          <p className="mt-2 text-sm text-slate-600">
            ¿Seguro que quieres eliminar{" "}
            <span className="font-semibold text-slate-900">
              “{document.nombre}”
            </span>
            ?
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Esta acción no se puede deshacer.
          </p>

          <div className="mt-6 flex flex-col-reverse justify-center gap-2 sm:flex-row">
            <button
              type="button"
              onClick={onCancel}
              disabled={deleting}
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={deleting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
              {deleting ? "Eliminando…" : "Sí, eliminar"}
            </button>
          </div>
        </div>
      }
    />
  )
}
