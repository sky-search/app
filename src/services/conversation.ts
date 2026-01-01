import type { ChatSession } from "@/entities/chat"
import { typeSafeRequest } from "@/shared/lib/http"
import type { ApiRequestPayload } from "@/shared/types/http"

export type GetConversationByIdResult = ChatSession
export type GetConversationListResult = ChatSession[]

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
  payload: ApiRequestPayload<
    undefined,
    { limit?: number; offset?: number; trip_id?: number }
  >,
) {
  return await typeSafeRequest<
    undefined,
    { limit?: number; offset?: number; trip_id?: number },
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
