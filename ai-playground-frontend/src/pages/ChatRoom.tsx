import { useParams } from "react-router-dom"
import { useState } from "react"
import api from "@/api/axios"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Message } from "@/types/interface"

export default function ChatRoom(){
    const { chatId } = useParams()
    const [message, setMessage] = useState<string>("")
    const [messages, setMessages] = useState<Message[]>([])

    const sendMessage = async () => {
        try {
            const response = await api.post(`/api/v1/chats/${chatId}/messages`, {
                message,
            })
            setMessages(prev => [
                ...prev,
                { user: message, bot: response.data.bot_reply }
            ])
            setMessage("")
        } catch (error) {
            console.error('Error sending message:', error)
        }
    }

    return (
        <div className="p-6 flex flex-col gap-4">
            <div className="flex-1 space-y-2 overflow-y-auto">
                {messages.map((m, i) => (
                    <Card key={i} className="p-3">
                        <p><b>You:</b> {m.user}</p>
                        <p className="text-muted-foreground"><b>Bot:</b> {m.bot}</p>
                    </Card>
                ))}
            </div>

            <div className="flex gap-2">
                <Input
                    value={message}
                    onChange={e => setMessage((e.target as HTMLInputElement).value)}
                    placeholder="Type your message..."
                />
                <Button onClick={sendMessage}>Send</Button>
            </div>
        </div>
    )
}