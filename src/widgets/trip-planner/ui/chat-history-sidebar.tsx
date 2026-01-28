import { queryClient } from "@/app/providers/tanstack-query/provider"
import { CryptoIdGenerator } from "@/shared/lib/id-generator"
import { cn, formatStringDate } from "@/shared/lib/utils"
import {
  useDeleteConversationMutation,
  useGetConversationListQuery,
} from "@/shared/queries/conversation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { Input } from "@/shared/ui/input"
import { ScrollArea } from "@/shared/ui/scroll-area"
import { Separator } from "@/shared/ui/separator"
import { Link, useNavigate, useParams } from "@tanstack/react-router"
import {
  History,
  MessageSquare,
  MoreVertical,
  Search,
  Trash2,
} from "lucide-react"
import { useState } from "react"
import { match } from "ts-pattern"
import { NewChatButton } from "./new-chat-button"

function ChatItemSkeleton() {
  return (
    <div className="px-4 py-3 rounded-xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Skeleton className="size-2 rounded-full shrink-0" />
          <Skeleton className="h-4 w-full max-w-[140px]" />
        </div>
        <Skeleton className="h-3 w-12 shrink-0" />
      </div>
    </div>
  )
}

function ChatListSkeleton() {
  return (
    <div className="space-y-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <ChatItemSkeleton key={i} />
      ))}
    </div>
  )
}

function ChatListEmpty() {
  return (
    <div className="p-8 text-center space-y-2">
      <div className="size-12 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto opacity-40">
        <MessageSquare className="size-6 text-muted-foreground" />
      </div>
      <p className="text-xs text-muted-foreground">No chats found</p>
    </div>
  )
}

export function ChatHistorySidebar() {
  const [searchQuery, setSearchQuery] = useState("")
  const { data } = useGetConversationListQuery()
  const navigate = useNavigate()
  const params = useParams({ strict: false })
  const currentChatId = params.chatId as string | undefined
  const deleteConversation = useDeleteConversationMutation()

  const filteredChats = data?.conversations?.filter?.((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDeleteChat = (sessionId: string) => {
    const isActiveChat = currentChatId === sessionId

    deleteConversation.mutate(
      { id: sessionId },
      {
        onSuccess: () => {
          // Update the conversation list cache
          const query = useGetConversationListQuery
          queryClient.setQueryData(query.getKey(), (prevData) => {
            if (!prevData) return prevData
            const updatedConversations = prevData.conversations.filter(
              (chat) => chat.session_id !== sessionId,
            )
            return {
              conversations: updatedConversations,
              total: prevData.total - 1,
            }
          })

          // If deleting the active chat, redirect to the first remaining chat
          if (isActiveChat) {
            const remainingChats = data?.conversations?.filter(
              (chat) => chat.session_id !== sessionId,
            )
            if (remainingChats && remainingChats.length > 0) {
              navigate({
                to: "/chat/$chatId",
                params: { chatId: remainingChats[0].session_id },
              })
            } else {
              // new chat behavior here
              navigate({
                to: "/chat/$chatId",
                params: { chatId: CryptoIdGenerator.new().generate() },
              })
            }
          }
        },
      },
    )
  }

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
      <ScrollArea className="flex-1 px-3 mt-4 max-h-[70vh]">
        <div className="space-y-1">
          <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            Recent Chats
          </div>
          <ScrollArea className="max-h-[60vh] pb-6">
            <ul>
              {filteredChats?.map((chat) => (
                <li
                  key={chat.session_id}
                  className="w-full group/item relative"
                >
                  <Link
                    to="/chat/$chatId"
                    preload="intent"
                    params={{ chatId: chat.session_id }}
                    className={cn(
                      "w-full text-left px-4 py-3 pr-10 rounded-xl transition-all group block",
                      currentChatId === chat.session_id
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "hover:bg-muted/50 text-foreground/70 hover:text-foreground",
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "size-2 rounded-full shrink-0",
                          currentChatId === chat.session_id
                            ? "bg-primary"
                            : "bg-muted-foreground/30 group-hover:bg-primary/50",
                        )}
                      />
                      <span className="text-sm font-medium truncate flex-1">
                        {chat.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground shrink-0 tabular-nums uppercase">
                        {formatStringDate(chat.last_message_at ?? "")}
                      </span>
                    </div>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className={cn(
                        "absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity hover:bg-muted/80 z-10",
                        currentChatId === chat.session_id && "opacity-100",
                      )}
                    >
                      <MoreVertical className="size-4 text-muted-foreground" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="bottom">
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleDeleteChat(chat.session_id)}
                      >
                        <Trash2 className="size-4" />
                        Delete chat
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              ))}
            </ul>
          </ScrollArea>

          {match(queryResult)
            .with({ isSuccess: true }, ({ data }) =>
              match({
                isEmpty: data.conversations.length === 0,
                filteredChats: data.conversations.filter?.((chat) =>
                  chat.title.toLowerCase().includes(searchQuery.toLowerCase()),
                ),
              })
                .with({ isEmpty: true }, () => <ChatListEmpty />)
                .with({ isEmpty: false }, ({ filteredChats }) => (
                  <ScrollArea className="max-h-[60vh] pb-6">
                    <ul>
                      {filteredChats.map((chat) => (
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
                  </ScrollArea>
                ))
                .exhaustive(),
            )
            .with({ isLoading: true }, () => <ChatListSkeleton />)
            .otherwise(() => null)}
        </div>
      </ScrollArea>
    </div>
  )
}
