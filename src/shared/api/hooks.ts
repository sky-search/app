import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios"
import { getSessionToken } from "../lib/auth"

export const setupInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const result = await getSessionToken()
      if (result.success) {
        config.headers.Authorization = `Bearer ${result.data}`
      }
      return config
    },
  )

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<any>) => {
      if (
        error.response?.data &&
        typeof error.response.data === "object" &&
        "detail" in error.response.data
      ) {
        error.message = (error.response.data as any).detail
      }
      return Promise.reject(error)
    },
  )
}
