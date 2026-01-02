import { getCurrentUser } from "@/services/user"
import { useAppSession } from "@/shared/lib/session"
import { createServerFn } from "@tanstack/react-start"

// Get current user
export const getCurrentUserFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await useAppSession()
    const userId = session.data.userId

    if (!userId) {
      return null
    }
    const result = await getCurrentUser()
    if (result.isErr()) return null

    return result.value
  },
)

export const logOut = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useAppSession()
  session.clear()
})

export const getSessionToken = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await useAppSession()
    if (session.data === undefined || session.data === null)
      return {
        success: false,
        error: {
          type: "SESSION_NOT_FOUND",
        },
      }
    if (typeof session.data?.accessToken !== "string")
      return {
        success: false,
        error: {
          type: "TOKEN_NOT_FOUND",
        },
      }

    return {
      success: true,
      data: session.data.accessToken,
    }
  },
)
