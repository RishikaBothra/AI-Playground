import { Navigate } from "react-router-dom"
import type { ReactNode } from "react"

export default function AuthRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem("token")

  if (token) {
    return <Navigate to="/dashboard/projects" replace />
  }

  return <>{children}</>
}
