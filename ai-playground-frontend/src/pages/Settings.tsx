import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "@/api/axios"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export default function Settings() {
  const { projectId } = useParams()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)


    // Load project details
     useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/api/v1/projects/get/${projectId}`)
        setName(res.data.project.name)
        setDescription(res.data.project.description || "")
      } catch (err) {
        setError("Failed to load project details")
      }
    }

    fetchProject()
  }, [projectId])

  // Save changes
  const saveSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      await api.put(`/api/v1/projects/update/${projectId}`, {
        projectName: name,
        projectDescription: description,
      })

      setSuccess(true)
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Failed to update project"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-[420px]">
        <CardHeader>
          <CardTitle>Project Settings</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Project updated successfully
              </AlertDescription>
            </Alert>
          )}

          <div>
            <label className="text-sm font-medium">Project name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button
            className="w-full"
            onClick={saveSettings}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
