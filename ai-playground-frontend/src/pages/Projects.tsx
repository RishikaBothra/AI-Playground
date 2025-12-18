import { useEffect, useState } from "react"
import api from "@/api/axios"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Project } from "@/types"

export default function Projects(){
    const [projects, setProjects] = useState<Project[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        api.get("/api/v1/projects/get").then((response) => {
            setProjects(response.data.projects)
        }).catch((error) => {
            console.error("Error fetching projects:", error)
        })
    }, [])

 return (
    <div className="p-6 grid grid-cols-3 gap-4">
      {projects.map(p => (
        <Card key={p.id} className="cursor-pointer"
          onClick={() => navigate(`/projects/${p.id}/chats`)}>
          <CardHeader>
            <CardTitle>{p.name}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
