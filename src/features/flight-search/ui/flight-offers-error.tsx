import { getErrorMessage } from "@/shared/lib/error"
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert"
import { Button } from "@/shared/ui/button"
import { AlertCircle, Plane, RefreshCw } from "lucide-react"

interface FlightOffersErrorProps {
  error?: Error | null
  errorMessage?: string
  onRetry?: () => void
}

export function FlightOffersError({
  error,
  errorMessage,
  onRetry,
}: FlightOffersErrorProps) {
  const message = errorMessage || getErrorMessage(error)

  return (
    <Alert variant="destructive" className="animate-in fade-in duration-300">
      <div className="flex items-center gap-1">
        <AlertCircle className="size-4" />
        <Plane className="size-4" />
      </div>
      <AlertTitle>Failed to load flight offers</AlertTitle>
      <AlertDescription className="flex flex-col gap-3">
        <span>{message}</span>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="w-fit gap-2"
          >
            <RefreshCw className="size-3" />
            Try again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
