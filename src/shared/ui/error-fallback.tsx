import { getErrorMessage } from "@/shared/lib/error"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./alert"
import { Button } from "./button"

interface ErrorFallbackProps {
  error?: Error | null
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}

export function ErrorFallback({
  error,
  title = "Something went wrong",
  description,
  onRetry,
  className,
}: ErrorFallbackProps) {
  const errorMessage = description || getErrorMessage(error)

  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="size-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex flex-col gap-3">
        <span>{errorMessage}</span>
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

interface ErrorFallbackInlineProps {
  error?: Error | null
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorFallbackInline({
  error,
  message,
  onRetry,
  className,
}: ErrorFallbackInlineProps) {
  const errorMessage = message || getErrorMessage(error)

  return (
    <div
      className={`flex items-center gap-3 p-3 text-sm text-destructive ${className || ""}`}
    >
      <AlertCircle className="size-4 shrink-0" />
      <span className="flex-1 truncate">{errorMessage}</span>
      {onRetry && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRetry}
          className="shrink-0 h-7 px-2 text-destructive hover:text-destructive"
        >
          <RefreshCw className="size-3" />
        </Button>
      )}
    </div>
  )
}
