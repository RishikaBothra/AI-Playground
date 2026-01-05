import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "@/api/axios"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export default function EditChat() {
  const { projectId, chatId } = useParams()
  const navigate = useNavigate()

  const [botProvider, setBotProvider] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  //  fetch current chat to prefill bot provider
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await api.get(`/api/v1/projects/chat/get/${projectId}`)
        const chat = res.data.chats.find((c: any) => c.id === Number(chatId))
        if (chat) {
          setBotProvider(chat.bot_provider)
        }
      } catch {
      }
    }

    fetchChat()
  }, [projectId, chatId])

  const handleUpdate = async () => {
    try {
      setLoading(true)
      setError(null)

      await api.patch(`/api/v1/chats/updatebot/${chatId}`, {
        bot_provider: botProvider,
      })

      navigate(`/dashboard/projects/${projectId}`)
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Failed to update bot provider"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-[420px]">
        <CardHeader>
          <CardTitle>Edit Chat</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* BOT PROVIDER DROPDOWN */}
          <div className="space-y-2">
            <Label>Bot Provider</Label>
            <Select value={botProvider} onValueChange={setBotProvider}>
              <SelectTrigger>
                <SelectValue placeholder="Select a bot" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="gemini">Gemini</SelectItem>
                <SelectItem value="sarvam">Sarvam</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full"
            onClick={handleUpdate}
            disabled={loading || !botProvider}
          >
            {loading ? "Updating..." : "Update Bot"}
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              navigate(`/dashboard/projects/${projectId}`)
            }
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
