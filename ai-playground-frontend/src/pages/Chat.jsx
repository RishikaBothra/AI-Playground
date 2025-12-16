import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chatsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';

function Chat() {
  const { projectId, chatId } = useParams();
  const navigate = useNavigate();
  const { signout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setLoading(true);
    setError('');

    // Add user message to UI immediately
    const tempUserMessage = {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const data = await chatsAPI.sendMessage(chatId, userMessage);
      
      // Replace temp message and add bot response
      setMessages((prev) => {
        const updated = prev.filter((msg) => msg.id !== tempUserMessage.id);
        return [
          ...updated,
          {
            id: tempUserMessage.id,
            type: 'user',
            content: userMessage,
            timestamp: new Date(),
          },
          {
            id: Date.now() + 1,
            type: 'bot',
            content: data.bot_reply,
            timestamp: new Date(),
          },
        ];
      });
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to send message');
      // Remove the temp message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== tempUserMessage.id));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              className="text-slate-300 hover:bg-slate-800 px-2"
              onClick={() => navigate(`/project/${projectId}`)}
            >
              ← Back
            </Button>
            <h1 className="text-xl font-semibold tracking-tight">Chat</h1>
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

      <div className="flex-1 flex flex-col max-w-5xl w-full mx-auto px-4 py-6 gap-4">
        <Card className="flex-1 bg-slate-900/70 border-slate-800 flex flex-col">
          <CardHeader className="pb-3 border-b border-slate-800">
            <CardTitle className="text-sm font-medium text-slate-200">
              Conversation
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pt-4 pb-3 px-3 sm:px-4 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                <p>Start a conversation by sending a message below.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                        message.type === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-50'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm">
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </CardContent>
        </Card>

        {error && (
          <div className="bg-red-500/10 border border-red-500/40 text-red-200 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
          <Input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1 bg-slate-900/80 border-slate-700 text-slate-50 placeholder:text-slate-500"
          />
          <Button
            type="submit"
            disabled={loading || !inputMessage.trim()}
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Chat;

