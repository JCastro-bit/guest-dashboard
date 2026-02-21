import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Invitation Not Found</h1>
        <p className="text-muted-foreground">
          The invitation you're looking for doesn't exist or has been removed.
        </p>
      </div>
      <Button asChild>
        <Link href="/invitations">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Invitations
        </Link>
      </Button>
    </div>
  )
}
