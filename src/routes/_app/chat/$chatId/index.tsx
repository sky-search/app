import { queryClient } from "@/app/providers/tanstack-query/provider"
import { getConversationById } from "@/services/conversation"
import { ChatInterface } from "@/widgets/trip-planner/ui"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"

export const Route = createFileRoute("/_app/chat/$chatId/")({
  component: RouteComponent,
  loader({ params }) {
    const { chatId } = params

    const getConversationQueryResult = queryClient.ensureQueryData({
      queryKey: ["conversation", chatId],
      queryFn: async () => {
        const result = await getConversationById({ id: chatId })
        if (result.isErr()) {
          throw new Error(result.error.message)
        }
        return result.value
      },
    })

    return {
      getConversationQueryResult,
    }
  },
})

function RouteComponent() {
  const params = Route.useParams()

  return (
    <>
      <main className="flex-1 overflow-hidden relative">
        <ChatInterface key={params.chatId} />
      </main>
      <RouteWatcher />
    </>
  )
}

function RouteWatcher() {
  const params = Route.useParams()

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ["conversation", params.chatId] })
    queryClient.invalidateQueries({ queryKey: ["conversation", params.chatId] })
  }, [params.chatId])

  return null
}
