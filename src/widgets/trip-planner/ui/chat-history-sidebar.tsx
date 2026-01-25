import { cn, formatStringDate } from "@/shared/lib/utils"
import { useGetConversationListQuery } from "@/shared/queries/conversation"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { ScrollArea } from "@/shared/ui/scroll-area"
import { Separator } from "@/shared/ui/separator"
import { Link } from "@tanstack/react-router"
import {
  AlertCircle,
  History,
  MessageSquare,
  RefreshCw,
  Search,
} from "lucide-react"
import { useState } from "react"
import { NewChatButton } from "./new-chat-button"

export function ChatHistorySidebar() {
  const [searchQuery, setSearchQuery] = useState("")
  const { data, isError, refetch } = useGetConversationListQuery()
  const selectedChatId = null

  const filteredChats = data?.conversations?.filter?.((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Header */}
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <History className="size-5 text-primary" />
          <h2 className="text-xl font-bold tracking-tight">Chats</h2>
        </div>

        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/30 border-muted-foreground/10 focus:bg-background transition-all rounded-xl"
          />
        </div>

        <NewChatButton />
      </div>

      <Separator className="bg-muted-foreground/5 mx-6 w-auto" />

      {/* Chat List */}
      <ScrollArea className="flex-1 px-3 mt-4">
        <div className="space-y-1">
          <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            Recent Chats
          </div>

          {isError && (
            <div className="p-4 text-center space-y-3">
              <div className="size-10 rounded-xl bg-destructive/10 flex items-center justify-center mx-auto">
                <AlertCircle className="size-5 text-destructive" />
              </div>
              <p className="text-xs text-muted-foreground">
                Failed to load chats
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => refetch()}
                className="gap-2 text-xs"
              >
                <RefreshCw className="size-3" />
                Try again
              </Button>
            </div>
          )}

          {!isError && (
            <>
              <ul>
                {filteredChats?.map((chat) => (
                  <li key={chat.session_id} className="w-full">
                    <Link
                      key={chat.session_id}
                      to="/chat/$chatId"
                      preload="intent"
                      params={{ chatId: chat.session_id }}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl transition-all group block",
                        selectedChatId === chat.session_id
                          ? "bg-primary/10 text-primary shadow-sm"
                          : "hover:bg-muted/50 text-foreground/70 hover:text-foreground",
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={cn(
                              "size-2 rounded-full",
                              selectedChatId === chat.session_id
                                ? "bg-primary"
                                : "bg-muted-foreground/30 group-hover:bg-primary/50",
                            )}
                          />
                          <span className="text-sm font-medium truncate">
                            {chat.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0 tabular-nums uppercase">
                          {formatStringDate(chat.last_message_at ?? "")}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>

              {filteredChats?.length === 0 && (
                <div className="p-8 text-center space-y-2">
                  <div className="size-12 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto opacity-40">
                    <MessageSquare className="size-6 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    No chats found
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
