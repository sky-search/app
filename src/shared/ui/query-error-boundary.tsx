import { useQueryErrorResetBoundary } from "@tanstack/react-query"
import type { ReactNode } from "react"
import { ErrorBoundary, type ErrorFallbackProps } from "./error-boundary"
import { ErrorFallback } from "./error-fallback"

interface QueryErrorBoundaryProps {
  children: ReactNode
  fallbackTitle?: string
  fallbackDescription?: string
  FallbackComponent?: React.ComponentType<ErrorFallbackProps>
}

function DefaultFallback({
  error,
  resetErrorBoundary,
  title,
  description,
}: ErrorFallbackProps & { title?: string; description?: string }) {
  return (
    <ErrorFallback
      error={error}
      title={title}
      description={description}
      onRetry={resetErrorBoundary}
    />
  )
}

export function QueryErrorBoundary({
  children,
  fallbackTitle,
  fallbackDescription,
  FallbackComponent,
}: QueryErrorBoundaryProps) {
  const { reset } = useQueryErrorResetBoundary()

  const Fallback = FallbackComponent
    ? FallbackComponent
    : (props: ErrorFallbackProps) => (
        <DefaultFallback
          {...props}
          title={fallbackTitle}
          description={fallbackDescription}
        />
      )

  return (
    <ErrorBoundary onReset={reset} FallbackComponent={Fallback}>
      {children}
    </ErrorBoundary>
  )
}
