import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import api from "@/api/axios"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export default function EditProject() {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleUpdate = async () => {
    try {
      setError(null)

      await api.put(`/api/v1/projects/update/${projectId}`, {
        projectName,
        projectDescription,
      })

      navigate("/dashboard/projects")
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Failed to update project"
      )
    }
  }

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-[420px]">
        <CardHeader>
          <CardTitle>Edit Project</CardTitle>
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
            <Input value={projectName} onChange={e => setProjectName(e.target.value)} />
          </div>

          <div>
            <Label>Description</Label>
            <Input value={projectDescription} onChange={e => setProjectDescription(e.target.value)} />
          </div>

          <Button className="w-full" onClick={handleUpdate}>
            Save changes
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
