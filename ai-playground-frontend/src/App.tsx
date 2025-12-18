import { BrowserRouter, Routes, Route } from "react-router-dom"
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
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="projects" element={<Projects />} />
          <Route path="chats" element={<Chats />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
