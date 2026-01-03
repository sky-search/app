import { CryptoIdGenerator } from "@/shared/lib/id-generator"
import { Button } from "@/shared/ui/button"
import { useNavigate } from "@tanstack/react-router"
import { MessageSquare } from "lucide-react"

export function NewChatButton() {
    const navigate = useNavigate()

    const handleNewChat = () => {
        const randomChatId = CryptoIdGenerator.new().generate()
        navigate({ to: "/chat/$chatId", params: { chatId: randomChatId } })
    }

    return (
        <Button variant="outline" className="w-full" onClick={handleNewChat}>
            <MessageSquare className="size-4" />
            New chat
        </Button>
    )
}
