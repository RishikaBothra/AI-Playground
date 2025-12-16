import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectsAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [error, setError] = useState('');
  const [modalError, setModalError] = useState('');
  const { signout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await projectsAPI.getAll();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Failed to load projects:', error);
      let errorMessage = 'Failed to load projects';
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.detail || 
                      error.response.data?.error || 
                      errorMessage;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = error.message || 'Network error: Could not reach the server. Make sure the backend is running.';
      } else {
        // Something else happened
        errorMessage = error.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setError('');
    setModalError('');

    try {
      const result = await projectsAPI.create(projectName, projectDescription);
      setShowCreateModal(false);
      setProjectName('');
      setProjectDescription('');
      setModalError('');
      // Clear any previous errors
      setError('');
      // Reload projects
      await loadProjects();
    } catch (error) {
      console.error('Create project error:', error);
      let errorMessage = 'Failed to create project';
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.detail || 
                      error.response.data?.error || 
                      errorMessage;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = error.message || 'Network error: Could not reach the server';
      } else {
        // Something else happened
        errorMessage = error.message || errorMessage;
      }
      
      setModalError(errorMessage);
      // Keep modal open so user can see the error and try again
    }
  };

  const handleDeleteProject = async (projectId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await projectsAPI.delete(projectId);
      loadProjects();
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to delete project');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400" />
            <span className="text-lg font-semibold tracking-tight">AI Playground</span>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={signout}
              className="text-slate-200 hover:bg-slate-800"
            >
              Sign out
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Projects</h2>
            <p className="text-sm text-slate-400">
              Organize your workspaces and chat bots by project.
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            + New Project
          </Button>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/40 text-red-200 px-4 py-3 rounded-md text-sm">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-slate-400 text-sm">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <Card className="border-dashed border-slate-700 bg-slate-900/60">
            <CardContent className="py-10 flex flex-col items-center justify-center text-center space-y-3">
              <p className="text-slate-300 text-sm">
                You don&apos;t have any projects yet.
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                Create your first project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="bg-slate-900/70 border-slate-800 hover:border-indigo-500/70 cursor-pointer transition-colors"
                onClick={() => navigate(`/project/${project.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base text-slate-50">
                      {project.name}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={(e) => handleDeleteProject(project.id, e)}
                    >
                      ×
                    </Button>
                  </div>
                  <CardDescription className="text-xs text-slate-400 line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm px-4">
          <Card className="w-full max-w-md border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle>Create new project</CardTitle>
              <CardDescription>
                Give your project a clear name and short description.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {modalError && (
                <div className="mb-4 bg-red-500/10 border border-red-500/40 text-red-200 px-4 py-3 rounded-md text-sm">
                  {modalError}
                </div>
              )}
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName" className="text-slate-200">
                    Project name
                  </Label>
                  <Input
                    id="projectName"
                    type="text"
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="My AI Playground"
                    className="bg-slate-950/60 border-slate-700 text-slate-50 placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectDescription" className="text-slate-200">
                    Description
                  </Label>
                  <Textarea
                    id="projectDescription"
                    required
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Describe what this project is about..."
                    rows={3}
                    className="bg-slate-950/60 border-slate-700 text-slate-50 placeholder:text-slate-500"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-slate-200 hover:bg-slate-800"
                    onClick={() => {
                      setShowCreateModal(false);
                      setProjectName('');
                      setProjectDescription('');
                      setModalError('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

