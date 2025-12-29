import { Outlet } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { NavLink, useNavigate } from "react-router-dom"

export default function Dashboard() {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r p-4 space-y-4">
        <h2 className="text-xl font-bold">AI Playground</h2>
        <Separator />

        <nav className="space-y-2">
          <NavLink to="/dashboard/projects" className="block">
            <Button variant="ghost" className="w-full justify-start">
              Projects
            </Button>
          </NavLink>

          <NavLink to="/dashboard/chats" className="block">
            <Button variant="ghost" className="w-full justify-start">
              Chats
            </Button>
          </NavLink>

          <NavLink to="/dashboard/settings" className="block">
            <Button variant="ghost" className="w-full justify-start">
              Settings
            </Button>
          </NavLink>
        </nav>

        <Separator />

        <Button variant="destructive" onClick={logout} className="w-full">
          Logout
        </Button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
