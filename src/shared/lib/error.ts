/**
 * Extracts a user-friendly error message from an unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === "string") {
    return error
  }
  return "An unexpected error occurred"
}

/**
 * Checks if an error is likely a network-related error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    return (
      message.includes("network") ||
      message.includes("fetch") ||
      message.includes("failed to fetch") ||
      message.includes("connection") ||
      message.includes("timeout") ||
      message.includes("offline") ||
      error.name === "NetworkError"
    )
  }
  return false
}
