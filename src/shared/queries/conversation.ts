import { getConversationList } from "@/services/conversation"
import { createQuery } from "react-query-kit"
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
