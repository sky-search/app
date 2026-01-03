import { getConversationById } from "@/services/conversation"
import { cn } from "@/shared/lib/utils"
import { ChatInterface, ItineraryPreview } from "@/widgets/trip-planner/ui"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_app/chat/$chatId/")({
  component: RouteComponent,
  async loader(ctx) {
    const { chatId } = ctx.params
    const result = await getConversationById({
      id: chatId,
    })
    return {
      chat: result,
    }
  },
})

function RouteComponent() {
  return (
    <>
      <main className="flex-1 overflow-hidden relative">
        <ChatInterface />
      </main>

      <aside
        className={cn(
          "transition-all duration-300 ease-in-out border-l border-border bg-card/30 backdrop-blur-sm w-96 translate-x-0",
          "hidden xl:block shrink-0 overflow-hidden",
        )}
      >
        <ItineraryPreview />
      </aside>
    </>
  )
}
