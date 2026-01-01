import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { ChatInterface, ItineraryPreview } from "@/widgets/trip-planner/ui"
import { createFileRoute } from "@tanstack/react-router"
import { PanelRight } from "lucide-react"
import { useState } from "react"

export const Route = createFileRoute("/_app/chat/$chatId/")({
  component: RouteComponent,
})

function RouteComponent() {
  const [showPreview, setShowPreview] = useState(true)

  return (
    <>
      <div className="absolute top-4 right-4 z-20 xl:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowPreview(!showPreview)}
        >
          <PanelRight className="size-4" />
        </Button>
      </div>

      <main className="flex-1 overflow-hidden relative">
        <ChatInterface />
      </main>

      <aside
        className={cn(
          "transition-all duration-300 ease-in-out border-l border-border bg-card/30 backdrop-blur-sm",
          showPreview ? "w-96 translate-x-0" : "w-0 translate-x-full opacity-0",
          "hidden xl:block shrink-0 overflow-hidden",
        )}
      >
        <ItineraryPreview />
      </aside>
      <div className="fixed bottom-24 right-4 z-50 hidden xl:flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full shadow-lg border border-border"
          onClick={() => setShowPreview(!showPreview)}
          title="Toggle Preview"
        >
          <PanelRight
            className={cn(
              "size-4 transition-transform",
              !showPreview && "rotate-180",
            )}
          />
        </Button>
      </div>
    </>
  )
}
