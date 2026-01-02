import type { ChatSession } from "@/entities/chat"
import { typeSafeRequest } from "@/shared/lib/http"
import type { ApiRequestPayload } from "@/shared/types/http"

export type GetConversationByIdResult = {
  session_id: string
  trip_id: number
  messages: Array<{
    id: string
    role: string
    content: string
    timestamp: string
    ui: {
      type: string
      data: string
      is_expired: boolean
      expires_in_minutes: number
      expiration_message: string
    }
  }>
}

export type GetConversationListResult = {
  conversations: ChatSession[]
  total: number
}
export type GetConversationListRequestParams = {
  limit?: number
  offset?: number
  trip_id?: number
}

export async function getConversationById(
  payload: ApiRequestPayload<undefined, undefined> & { id: string },
) {
  return await typeSafeRequest<undefined, undefined, GetConversationByIdResult>(
    {
      url: `api/v1/conversations/${payload.id}`,
      method: "get",
      payload,
    },
  )
}

export async function getConversationList(
  payload?: ApiRequestPayload<undefined, GetConversationListRequestParams>,
) {
  return await typeSafeRequest<
    undefined,
    GetConversationListRequestParams,
    GetConversationListResult
  >({
    url: "api/v1/conversations",
    method: "get",
    payload,
  })
}

export async function deleteConversation(
  payload: ApiRequestPayload<undefined, undefined> & { id: string },
) {
  return await typeSafeRequest<undefined, undefined, { success: boolean }>({
    url: `api/v1/conversations/${payload.id}`,
    method: "delete",
    payload,
  })
}
