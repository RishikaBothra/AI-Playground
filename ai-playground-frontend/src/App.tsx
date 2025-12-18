import { BrowserRouter,Routes,Route } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Projects from "./pages/Projects";
import Chats from "./pages/Chats";
import ChatRoom from "./pages/ChatRoom";
import ProtectedRoute from "./components/ProtectedRoutes";

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId/chats"
          element={
            <ProtectedRoute>
              <Chats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chats/:chatId"
          element={
            <ProtectedRoute>
              <ChatRoom />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;