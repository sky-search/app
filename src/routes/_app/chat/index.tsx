import { getConversationList } from "@/services/conversation"
import { generateRandomChatId } from "@/shared/lib/utils"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_app/chat/")({
  async beforeLoad() {
    const conversations = await getConversationList()
    if (conversations.isErr()) return

    if (conversations.value.conversations.length === 0) {
      const chatId = generateRandomChatId()
      throw redirect({
        to: "/chat/$chatId",
        params: {
          chatId,
        },
      })
    } else {
      throw redirect({
        to: "/chat/$chatId",
        params: {
          chatId: conversations.value.conversations[0].session_id,
        },
      })
    }
  },
})
