import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/auth/Sign-up";
import Signin from "@/auth/Sign-in";
import Dashboard from "./pages/Dashboard";
import Projects from "@/pages/Projects";
import Settings from "@/pages/Settings";
import ProtectedRoute from "@/components/ProtectedRoutes";
import AuthRoute from "./auth/authroute";
import CreateProject from "./pages/createproject";
import EditProject from "./pages/editproject";
import ChatRoom from "./pages/ChatRoom";
import CreateChat from "@/pages/createchats";
import EditChat from "./pages/editchat";
import ProjectDashboard from "./pages/projectdashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to={
                localStorage.getItem("token") ? "/dashboard/projects" : "/login"
              }
              replace
            />
          }
        />
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />

        <Route
          path="/signin"
          element={
            <AuthRoute>
              <Signin />
            </AuthRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="projects/create" element={<CreateProject />} />
          <Route path="projects/edit/:projectId" element={<EditProject />} />
          <Route index element={<Navigate to="projects" replace />} />
          <Route path="projects" element={<Projects />} />
          <Route path="settings" element={<Settings />} />
          
          {/* Project-specific routes */}
          <Route path="projects/:projectId" element={<ProjectDashboard />} />
          <Route
            path="projects/:projectId/create-chat"
            element={<CreateChat />}
          />
          <Route
            path="projects/:projectId/chat/:chatId"
            element={<ChatRoom />}
          />
          <Route
            path="projects/:projectId/chat/:chatId/edit"
            element={<EditChat />}
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
