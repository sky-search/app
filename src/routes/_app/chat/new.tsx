import { generateRandomChatId } from "@/shared/lib/utils"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_app/chat/new")({
  beforeLoad() {
    const chatId = generateRandomChatId()

    throw redirect({
      to: "/chat/$chatId",
      params: {
        chatId,
      },
    })
  },
})
