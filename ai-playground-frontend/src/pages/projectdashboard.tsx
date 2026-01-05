import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/api/axios";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

type Chat = {
  id: number;
  name: string;
  description: string;
  bot_provider: string;
};

export default function ProjectDashboard() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [chats, setChats] = useState<Chat[]>([]);
  const [newChatName, setNewChatName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fetch chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/v1/projects/chat/get/${projectId}`);
        setChats(res.data.chats);
      } catch (err: any) {
        setError(
          err.response?.data?.detail ||
            err.response?.data?.error ||
            "Failed to load chats"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [projectId]);

  const createChat = async () => {
  const firstMessage = newChatName.trim()
  if (!firstMessage) return

  try {
    // createing chat
    const res = await api.post(
      `api/v1/projects/chat/create/${projectId}`,
      {
        name: "New chat",
        description: "New chat",
        bot_provider: "gemini",
      }
    )

    const chatId = res.data.chat_id

    // immediately send it to message section
    await api.post(
      `api/v1/projects/chat/messages/${chatId}`,
      { message: firstMessage }
    )

    // open chat 
    navigate(`/dashboard/projects/${projectId}/chat/${chatId}`)

    setNewChatName("")
  } catch (err: any) {
    setError(
      err.response?.data?.detail ||
        err.response?.data?.error ||
        "Failed to create chat"
    )
  }
}

  
  // const createChat = async () => {
  //   if (!newChatName.trim()) return;

  //   try {
  //     const res = await api.post(`/api/v1/projects/chat/create/${projectId}` ,{
  //       name: newChatName,
  //       description: "New chat",
  //       bot_provider: "sarvam", // default
  //     });

  //     const ress = await api.post(`/api/v1/projects/chat/create/${projectId}`, {
  //       name: newChatName,
  //       description: "New chat",
  //       bot_provider: "gemini",
  //     });
  //     navigate(`/dashboard/projects/${projectId}/chat/${ress.data.chat_id}`);
  //   } catch (err: any) {
  //     setError(
  //       err.response?.data?.detail ||
  //         err.response?.data?.error ||
  //         "Failed to create chat"
  //     );
  //   }
  // };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Project Header */}
      <h1 className="text-2xl font-bold">Project</h1>

      {/* New Chat Input (ChatGPT style) */}
      <div className="flex gap-2">
        <Input
          placeholder="New chat in this project"
          value={newChatName}
          onChange={(e) => setNewChatName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createChat()}
        />
        <Button onClick={createChat}>+</Button>
      </div>

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Chats List */}
      {loading ? (
        <p className="text-muted-foreground">Loading chats...</p>
      ) : chats.length === 0 ? (
        <p className="text-muted-foreground">No chats yet. Start one above.</p>
      ) : (
        <div className="space-y-2">
          {chats.map((chat) => (
            <Card
              key={chat.id}
              className="p-3 cursor-pointer hover:bg-muted transition"
              onClick={() =>
                navigate(`/dashboard/projects/${projectId}/chat/${chat.id}`)
              }
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">{chat.name}</p>

                <Badge variant="secondary">
                  {chat.bot_provider === "gemini" ? "Gemini" : "Sarvam"}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                {chat.description}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
