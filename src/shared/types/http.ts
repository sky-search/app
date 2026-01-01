export interface ApiError {
  type: "HTTP_ERROR" | "UNKNOWN_ERROR" | "VALIDATION_ERROR"
  status?: number
  message: string
  detail?: string | Record<string, unknown> | Array<Record<string, unknown>>
}

export interface ApiRequestPayload<TBody = undefined, TParams = undefined> {
  body?: TBody
  params?: TParams
  headers?: Record<string, string>
}
