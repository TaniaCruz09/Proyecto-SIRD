"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

interface PdfViewerProps {
  url: string
}

const TARGET_WIDTH = 820
const MIN_SCALE = 1.5
const MAX_SCALE = 3

/**
 * pdf.js trocea el render con requestAnimationFrame; si la pestaña está en
 * segundo plano (o el navegador lo limita) el frame nunca llega y el PDF se
 * queda cargando. Con este reemplazo temporal usa setTimeout y siempre termina.
 */
async function withAnimationFrameFallback<T>(task: () => Promise<T>): Promise<T> {
  const original =
    typeof window !== "undefined" ? window.requestAnimationFrame : undefined

  if (original) {
    window.requestAnimationFrame = ((callback: FrameRequestCallback) =>
      window.setTimeout(() => callback(performance.now()), 0)) as typeof window.requestAnimationFrame
  }

  try {
    return await task()
  } finally {
    if (original) {
      window.requestAnimationFrame = original
    }
  }
}

/**
 * Renderiza un PDF con pdf.js a imágenes (canvas -> data URL), sin depender
 * del visor nativo del navegador.
 */
export default function PdfViewer({ url }: PdfViewerProps) {
  const [pages, setPages] = useState<string[]>([])
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")

  useEffect(() => {
    let cancelled = false

    const renderPdf = async () => {
      try {
        setStatus("loading")
        setPages([])

        const pdfjs = await import("pdfjs-dist")
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"

        const pdf = await pdfjs.getDocument({ url }).promise
        const renderedPages: string[] = []

        await withAnimationFrameFallback(async () => {
          for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
            const page = await pdf.getPage(pageNumber)
            const baseViewport = page.getViewport({ scale: 1 })
            const scale = Math.min(
              Math.max(TARGET_WIDTH / baseViewport.width, MIN_SCALE),
              MAX_SCALE,
            )
            const viewport = page.getViewport({ scale })

            const canvas = document.createElement("canvas")
            canvas.width = Math.floor(viewport.width)
            canvas.height = Math.floor(viewport.height)

            const context = canvas.getContext("2d")
            if (!context) continue

            await page.render({ canvas, canvasContext: context, viewport }).promise
            renderedPages.push(canvas.toDataURL("image/png"))
          }
        })

        if (!cancelled) {
          setPages(renderedPages)
          setStatus("ready")
        }
      } catch {
        if (!cancelled) setStatus("error")
      }
    }

    renderPdf()

    return () => {
      cancelled = true
    }
  }, [url])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-600">
        <Loader2 className="h-4 w-4 animate-spin" />
        Cargando PDF…
      </div>
    )
  }

  if (status === "error" || pages.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-slate-600">
        No se pudo mostrar el PDF. Descárgalo para abrirlo.
      </p>
    )
  }

  return (
    <div className="max-h-[68vh] overflow-auto bg-slate-200/60 p-3">
      <div className="mx-auto flex w-fit flex-col gap-3">
        {pages.map((source, index) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={index}
            src={source}
            alt={`Página ${index + 1}`}
            className="h-auto max-w-full rounded bg-white shadow-sm"
          />
        ))}
      </div>
    </div>
  )
}
