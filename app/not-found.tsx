import { FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/50">
        <FileQuestion className="w-8 h-8 text-muted-foreground" />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground mb-1">
          Pagina no encontrada
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          La pagina que buscas no existe o fue movida.
        </p>
      </div>
      <Button asChild>
        <Link href="/">Ir al inicio</Link>
      </Button>
    </div>
  )
}
