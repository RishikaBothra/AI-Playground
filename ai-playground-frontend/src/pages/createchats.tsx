import { useState } from "react"
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

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export default function CreateChat() {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [botProvider, setBotProvider] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    try {
      setLoading(true)
      setError(null)

      await api.post(`/api/v1/projects/chat/create/${projectId}`, {
        name,
        description,
        bot_provider: botProvider,
      })

      navigate(`/dashboard/projects/${projectId}`)
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Failed to create chat"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-[420px]">
        <CardHeader>
          <CardTitle>Create Chat</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label>Chat name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <Label>Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* 🔽 BOT PROVIDER DROPDOWN */}
          <div>
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
            onClick={handleCreate}
            disabled={loading || !name || !description || !botProvider}
          >
            {loading ? "Creating..." : "Create Chat"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
