import {
  createChatClientOptions,
  fetchServerSentEvents,
  type InferChatMessages,
} from "@tanstack/ai-client"

export const chatOptions = createChatClientOptions({
  connection: fetchServerSentEvents("/api/chat"),
})

export type Messages = InferChatMessages<typeof chatOptions>
