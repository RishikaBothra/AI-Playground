import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/api/axios"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function Signin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      setLoading(true)
      const response = await api.post("/auth/signin", { name,email, password })
      localStorage.setItem("token", response.data.token)
      navigate("/dashboard/projects")
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setLoading(false)
    }
  }

return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <Card className="w-[380px] shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            className="w-full"
            onClick={handleLogin}
            disabled={loading || !email || !password}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          {/* Divider */}
          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 -top-2 bg-background px-2 text-xs text-muted-foreground">
              OR
            </span>
          </div>

          {/* Sign up redirect */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account?</span>{" "}
            <Button
              variant="link"
              className="px-1"
              onClick={() => navigate("/login")}
            >
              Login here!!
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
