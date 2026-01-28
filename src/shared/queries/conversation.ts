import { deleteConversation, getConversationList } from "@/services/conversation"
import { createMutation, createQuery } from "react-query-kit"
import type { FnParams } from "../types/utils"

export const useGetConversationListQuery = createQuery({
  queryKey: ["getConversationList"],
  fetcher: async (variables: FnParams<typeof getConversationList>) => {
    const result = await getConversationList(variables)
    if (result.isErr())
      throw new Error(result.error.message, {
        cause: result.error.detail,
      })
    return result.value
  },
})

export const useDeleteConversationMutation = createMutation({
  mutationFn: async (variables: FnParams<typeof deleteConversation>) => {
    const result = await deleteConversation(variables)
    if (result.isErr())
      throw new Error(result.error.message, {
        cause: result.error.detail,
      })
    return result.value
  },
})
