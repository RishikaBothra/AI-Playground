import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "@/api/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Message } from "@/types/interface";

export default function ChatRoom() {
  const { chatId } = useParams();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isFirstMessage, setIsFirstMessage] = useState(false); 
  // 🔴 CHANGED: default false (we decide after loading messages)

  /* ================================
     🔹 NEW: Load existing messages
     ================================ */
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(
          `/api/v1/projects/chat/messages/${chatId}`
        );

        setMessages(res.data.messages);

        if (res.data.messages.length === 0) {
          setIsFirstMessage(true);
        }
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };

    fetchMessages(); // first msg from history 
  }, [chatId]);

  const sendMessage = async () => { //send message 
    if (!message.trim()) return;

    const res = await api.post(
      `/api/v1/projects/chat/messages/${chatId}`,
      { message }
    );

    setMessages((prev) => [
      ...prev,
      { user: message, bot: res.data.bot_reply },
    ]);

    /* ================================
       🔹 Rename chat ONLY once
       ================================ */
    if (isFirstMessage) {
      const newName = message.split(" ").slice(0, 6).join(" ");

      await api.patch(
        `/api/v1/projects/chat/rename/${chatId}`,
        { name: newName }
      );

      setIsFirstMessage(false);
    }

    setMessage("");
  };

  return (
    <div className="p-6 flex flex-col gap-4">
      <div className="flex-1 space-y-2 overflow-y-auto">
        {messages.map((m, i) => (
          <Card key={i} className="p-3">
            <p>
              <b>You:</b> {m.user}
            </p>
            <p className="text-muted-foreground">
              <b>Bot:</b> {m.bot}
            </p>
          </Card>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}
