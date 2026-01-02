import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/api/axios"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export default function CreateProject() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await api.post("/api/v1/projects/create", {
        name,
        description,
      })

      navigate("/dashboard/projects")
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Failed to create project"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-[420px]">
        <CardHeader>
          <CardTitle>Create Project</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label>Project name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div>
            <Label>Description</Label>
            <Input value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          <Button
            className="w-full"
            onClick={handleCreate}
            disabled={loading || !name || !description}
          >
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
