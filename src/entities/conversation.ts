import type { ChatSession } from "./chat"

export function getEmptyConversation(
  conversationId: string,
  title: string = "New chat",
): ChatSession {
  return {
    has_flights: false,
    has_itinerary: false,
    last_message_at: null,
    message_count: 0,
    preview: null,
    session_id: conversationId,
    trip_id: null,
    title,
  }
}
