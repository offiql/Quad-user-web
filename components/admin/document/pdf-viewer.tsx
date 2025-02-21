"use client"

import { fetchPdf } from "@/app/actions/doc"
import * as PDFJS from "pdfjs-dist"
import type { PDFDocumentProxy, RenderParameters } from "pdfjs-dist/types/src/display/api"
import { useCallback, useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PDFViewer({src}:{src:string}) {
  PDFJS.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${PDFJS.version}/build/pdf.worker.min.mjs`
  // const src = "https://www.sldttc.org/allpdf/21583473018.pdf"
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy>()
  const [currentPage, setCurrentPage] = useState(1)
  let renderTask: PDFJS.RenderTask

  const renderPage = useCallback(
    (pageNum: number, pdf = pdfDoc) => {
      const canvas = canvasRef.current
      if (!canvas || !pdf) return
      canvas.height = 0
      canvas.width = 0
      pdf
        .getPage(pageNum)
        .then((page) => {
          const viewport = page.getViewport({ scale: 1.5 })
          canvas.height = viewport.height
          canvas.width = viewport.width
          const renderContext: RenderParameters = {
            canvasContext: canvas.getContext("2d")!,
            viewport: viewport,
          }
          try {
            if (renderTask) {
              renderTask.cancel()
            }
            renderTask = page.render(renderContext)
            return renderTask.promise
          } catch (error) {
            console.error("Error rendering page:", error)
          }
        })
        .catch((error) => console.log(error))
    },
    [pdfDoc], // Added renderTask to dependencies
  )

  useEffect(() => {
    renderPage(currentPage, pdfDoc)
  }, [pdfDoc, currentPage, renderPage])

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const doc = await fetchPdf(src)
        const loadingTask = PDFJS.getDocument(doc.data)
        const loadedDoc = await loadingTask.promise
        setPdfDoc(loadedDoc)
      } catch (error) {
        console.error("Error loading PDF:", error)
      }
    }
    loadPdf()
  }, [src])

  const nextPage = () => pdfDoc && currentPage < pdfDoc.numPages && setCurrentPage(currentPage + 1)
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1)

  return (
    <div>
      <div>
        <div className="flex justify-between items-center mb-4">
          <Button onClick={prevPage} disabled={currentPage <= 1} variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <span className="text-sm font-medium">
            Page {currentPage} of {pdfDoc?.numPages || "..."}
          </span>
          <Button onClick={nextPage} disabled={currentPage >= (pdfDoc?.numPages ?? -1)} variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
        <div className="">
          <canvas ref={canvasRef} className="max-w-full h-auto"></canvas>
        </div>
      </div>
    </div>
  )
}

