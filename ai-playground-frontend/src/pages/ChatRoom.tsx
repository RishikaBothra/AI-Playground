import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "@/api/axios";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Settings } from "lucide-react";

import type { Message } from "@/types/interface";

export default function ChatRoom() {
  const { chatId } = useParams();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isFirstMessage, setIsFirstMessage] = useState(false);

  const [bot, setBot] = useState("gemini");
  const [openSettings, setOpenSettings] = useState(false);
  const [chatName, setChatName] = useState("");
  const [chatDescription, setChatDescription] = useState("");

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

    fetchMessages();
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

    // rename chat only once
    if (isFirstMessage) {
      const newName = message.split(" ").slice(0, 6).join(" ");
      await api.patch(`/api/v1/projects/chat/rename/${chatId}`, {
        name: newName,
      });
      setIsFirstMessage(false);
    }

    setMessage("");
  };

  return (
    <div className="p-6 flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        {/* Bot selector */}
        <Select
          value={bot}
          onValueChange={async (value) => {
            setBot(value);
            await api.patch(
              `/api/v1/projects/chat/updatebot/${chatId}`,
              { bot_provider: value }
            );
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gemini">Gemini</SelectItem>
            <SelectItem value="sarvam">Sarvam</SelectItem>
          </SelectContent>
        </Select>

        {/* Settings */}
        <Button variant="ghost" size="icon" onClick={() => setOpenSettings(true)}>
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((m, i) => (
          <div key={i} className="flex flex-col gap-2">
            {/* User */}
            <div className="ml-auto bg-muted px-4 py-2 rounded-xl max-w-[70%]">
              {m.user}
            </div>

            {/* Bot */}
            <div className="mr-auto bg-white border px-4 py-2 rounded-xl max-w-[70%]">
              {m.bot}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-4">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>

      {/* Settings Dialog */}
     <Dialog open={openSettings} onOpenChange={setOpenSettings}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Chat</DialogTitle>
    </DialogHeader>

    {/* Chat Name */}
    <Input
      placeholder="Chat name"
      value={chatName}
      onChange={(e) => setChatName(e.target.value)}
    />

    {/* Chat Description */}
    <Input
      placeholder="Chat description"
      value={chatDescription}
      onChange={(e) => setChatDescription(e.target.value)}
    />

    <Button
      onClick={async () => {
        // rename
        if (chatName.trim()) {
          await api.patch(
            `/api/v1/projects/chat/rename/${chatId}`,
            { name: chatName }
          );
        }

        // description update (new route later)
        if (chatDescription.trim()) {
          await api.patch(
            `/api/v1/projects/chat/updatedescription/${chatId}`,
            { description: chatDescription }
          );
        }

        setOpenSettings(false);
      }}
    >
      Save
    </Button>
  </DialogContent>
</Dialog>

    </div>
  );
}
