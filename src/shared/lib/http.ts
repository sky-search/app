import { apiClient, publicApiClient } from "@/shared/api/client"
import axios, { type AxiosRequestConfig } from "axios"
import { ResultAsync } from "neverthrow"
import type { ApiError, ApiRequestPayload } from "../types/http"

interface RequestConfig<TBody, TParams> {
  url: string
  method: "get" | "post" | "put" | "delete" | "patch"
  payload?: ApiRequestPayload<TBody, TParams>
  isPublic?: boolean
  options?: AxiosRequestConfig
  isStream?: boolean
}

export function typeSafeRequest<TBody, TParams, TResult>(
  config: RequestConfig<TBody, TParams>,
) {
  const {
    url,
    method,
    payload,
    isPublic,
    options: customOptions,
    isStream,
  } = config
  const client = isPublic ? publicApiClient : apiClient

  const reqFn = async () => {
    const axiosConfig: AxiosRequestConfig = {
      ...customOptions,
      url,
      method,
      headers: {
        ...payload?.headers,
        ...customOptions?.headers,
      },
      params: payload?.params,
      data: payload?.body,
    }

    if (isStream) {
      axiosConfig.responseType = "stream"
    }

    const response = await client.request<TResult>(axiosConfig)

    return response.data
  }

  return ResultAsync.fromPromise(reqFn(), async (error): Promise<ApiError> => {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as Record<string, unknown> | undefined
      const detail = data?.detail as any

      return {
        type:
          error.response?.status === 422 ? "VALIDATION_ERROR" : "HTTP_ERROR",
        status: error.response?.status || 500,
        message: error.message,
        detail,
      }
    }

    return {
      type: "UNKNOWN_ERROR",
      message: (error as Error).message || "An unknown error occurred",
    }
  })
}
