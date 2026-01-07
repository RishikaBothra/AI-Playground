import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { Trash2 } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

import type { Project } from "@/types/interface";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get("/api/v1/projects/get");
        setProjects(response.data.projects);
      } catch (err: any) {
        setError(
          err.response?.data?.detail ||
            err.response?.data?.error ||
            "Failed to fetch projects"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // 🔹 Loading state
  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading projects...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Select a project to view chats
          </p>
        </div>

        <Button onClick={() => navigate("/dashboard/projects/create")}>
          + New Project
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Empty state */}
      {!error && projects.length === 0 && (
        <div className="text-center text-muted-foreground py-10">
          <p>No projects found.</p>
          <p>Create your first project to get started.</p>
        </div>
      )}

      {/* Projects grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="relative cursor-pointer hover:shadow-lg transition"
            onClick={() => navigate(`/dashboard/projects/${project.id}`)}
          >
            {/* 🗑 Delete project */}
            <button
              className="absolute top-2 right-2 text-muted-foreground hover:text-red-600"
              onClick={async (e) => {
                e.stopPropagation();
                await api.delete(`/api/v1/projects/delete/${project.id}`);
                setProjects((prev) => prev.filter((p) => p.id !== project.id));
              }}
            >
              <Trash2 size={16} />
            </button>

            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
