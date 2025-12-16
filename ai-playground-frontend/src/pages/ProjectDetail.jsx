import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsAPI, chatsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { signout } = useAuth();
  const [project, setProject] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [chatName, setChatName] = useState('');
  const [chatDescription, setChatDescription] = useState('');
  const [botProvider, setBotProvider] = useState('gemini');
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const projectsData = await projectsAPI.getAll();
      const foundProject = projectsData.projects.find((p) => p.id == projectId);
      
      if (foundProject) {
        setProject(foundProject);
        try {
          const chatsData = await chatsAPI.getByProject(projectId);
          setChats(chatsData.chats || []);
        } catch (err) {
          console.log('Could not load chats:', err);
          setChats([]);
        }
      }
    } catch (error) {
      console.error('Failed to load project:', error);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChat = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await chatsAPI.create(projectId, chatName, chatDescription, botProvider);
      setShowCreateModal(false);
      setChatName('');
      setChatDescription('');
      setBotProvider('gemini');
      // Navigate to the new chat
      navigate(`/project/${projectId}/chat/${data.chat_id}`);
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to create chat');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
        <div className="flex items-center gap-3 text-sm">
          <span className="h-3 w-3 rounded-full bg-indigo-500 animate-pulse" />
          <span>Loading project...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-red-300">
        <div className="text-sm">Project not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              className="text-slate-300 hover:bg-slate-800 px-2"
              onClick={() => navigate('/dashboard')}
            >
              ← Back
            </Button>
            <h1 className="text-xl font-semibold tracking-tight">{project.name}</h1>
          </div>
          <Button
            variant="ghost"
            className="text-slate-200 hover:bg-slate-800"
            onClick={signout}
          >
            Sign out
          </Button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        <Card className="bg-slate-900/70 border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Project overview</CardTitle>
            <CardDescription className="text-slate-300">
              {project.description}
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Chats</h2>
            <p className="text-xs text-slate-400">
              Each chat can use a different provider and has its own history.
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>+ New Chat</Button>
        </div>

        {error && (
          <div className="mb-2 bg-red-500/10 border border-red-500/40 text-red-200 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {chats.length === 0 ? (
          <Card className="border-dashed border-slate-700 bg-slate-900/60">
            <CardContent className="py-10 flex flex-col items-center justify-center text-center space-y-3">
              <p className="text-slate-300 text-sm">
                No chats yet for this project.
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                Create your first chat
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {chats.map((chat) => (
              <Card
                key={chat.id}
                className="bg-slate-900/70 border-slate-800 hover:border-indigo-500/70 cursor-pointer transition-colors"
                onClick={() => navigate(`/project/${projectId}/chat/${chat.id}`)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-slate-50">
                    {chat.name}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400 line-clamp-2">
                    {chat.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="inline-flex items-center rounded-full border border-indigo-500/40 bg-indigo-500/10 px-2 py-0.5 text-[11px] font-medium text-indigo-200">
                    {chat.bot_provider}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm px-4">
          <Card className="w-full max-w-md border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle>Create new chat</CardTitle>
              <CardDescription>
                Configure a chat room for this project.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateChat} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="chatName" className="text-slate-200">
                    Chat name
                  </Label>
                  <Input
                    id="chatName"
                    type="text"
                    required
                    value={chatName}
                    onChange={(e) => setChatName(e.target.value)}
                    placeholder="Brainstorming room"
                    className="bg-slate-950/60 border-slate-700 text-slate-50 placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chatDescription" className="text-slate-200">
                    Description
                  </Label>
                  <Textarea
                    id="chatDescription"
                    required
                    value={chatDescription}
                    onChange={(e) => setChatDescription(e.target.value)}
                    placeholder="What is this chat used for?"
                    rows={3}
                    className="bg-slate-950/60 border-slate-700 text-slate-50 placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="botProvider" className="text-slate-200">
                    Bot provider
                  </Label>
                  <select
                    id="botProvider"
                    value={botProvider}
                    onChange={(e) => setBotProvider(e.target.value)}
                    className="w-full h-10 rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                  >
                    <option value="gemini">Gemini</option>
                    <option value="sarvam">Sarvam</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-slate-200 hover:bg-slate-800"
                    onClick={() => {
                      setShowCreateModal(false);
                      setChatName('');
                      setChatDescription('');
                      setBotProvider('gemini');
                      setError('');
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

export default ProjectDetail;

