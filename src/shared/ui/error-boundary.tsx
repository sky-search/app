import { Component, type ErrorInfo, type ReactNode } from "react"

export interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  FallbackComponent?: React.ComponentType<ErrorFallbackProps>
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  onReset?: () => void
  resetKeys?: unknown[]
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (!this.state.hasError) return

    const { resetKeys } = this.props
    const { resetKeys: prevResetKeys } = prevProps

    if (resetKeys && prevResetKeys) {
      const hasChanged =
        resetKeys.length !== prevResetKeys.length ||
        resetKeys.some((key, index) => key !== prevResetKeys[index])
      if (hasChanged) {
        this.reset()
      }
    }
  }

  reset = (): void => {
    this.props.onReset?.()
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    const { hasError, error } = this.state
    const { children, fallback, FallbackComponent } = this.props

    if (hasError && error) {
      if (FallbackComponent) {
        return (
          <FallbackComponent error={error} resetErrorBoundary={this.reset} />
        )
      }
      if (fallback) {
        return fallback
      }
      return null
    }

    return children
  }
}
