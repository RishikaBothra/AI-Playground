import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "@/auth/Login"
import Dashboard from "./pages/Dashboard"
import Projects from "@/pages/Projects"
import Chats from "@/pages/Chats"
import Settings from "@/pages/Settings"
import ProtectedRoute from "@/components/ProtectedRoutes"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to={localStorage.getItem("token") ? "/dashboard/projects" : "/login"}
              replace
            />
          }
        />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard>
                <Route index element={<Navigate to="projects" replace />} />
                <Route path="projects" element={<Projects />} />
                <Route path="chats" element={<Chats />} />
                <Route path="settings" element={<Settings />} />
              </Dashboard>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
