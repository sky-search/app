import type { User } from "@/entities/user"
import { typeSafeRequest } from "@/shared/lib/http"

export async function getCurrentUser() {
  return await typeSafeRequest<null, null, User>({
    method: "get",
    url: "/api/v1/auth/me",
  })
}
