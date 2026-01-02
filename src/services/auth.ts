import type { SignInPayload, SignInResult } from "@/features/auth/sign-in"
import type { SignUpPayload, SignUpResult } from "@/features/auth/sign-up"
import { typeSafeRequest } from "@/shared/lib/http"

export async function signInWithCredentials(payload: SignInPayload) {
  const searchParams = new URLSearchParams()
  searchParams.set("username", payload.email)
  searchParams.set("password", payload.password)

  return await typeSafeRequest<URLSearchParams, undefined, SignInResult>({
    url: "api/v1/auth/login",
    method: "post",
    payload: {
      body: searchParams,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
    isPublic: true,
  })
}

export async function registerUser(payload: SignUpPayload) {
  return await typeSafeRequest<SignUpPayload, undefined, SignUpResult>({
    url: "api/v1/auth/register",
    method: "post",
    payload: {
      body: payload,
    },
    isPublic: true,
  })
}
