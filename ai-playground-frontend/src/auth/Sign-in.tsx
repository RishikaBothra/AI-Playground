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

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function Signin() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  

  const handleSignin = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await api.post("/signin", {email, password })

      if (response.data?.error) {
        setError(response.data.error)
        return
      }
      localStorage.setItem("token", response.data.access_token)

      if (response.data?.error) {
        setError(response.data.error)
        return
      }
      // proceed when signup is successful
      localStorage.setItem("token", response.data.access_token)
      navigate("/dashboard/projects")

    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Signup failed. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <Card className="w-[380px] shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <Separator />
        <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="m-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError(null); // Clear error on input change
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (error) setError(null); // Clear error on input change
              }}
            />
          </div>

          <Button
            className="w-full"
            onClick={handleSignin}
            disabled={loading || !email || !password}
          >
            {loading ? "Signing in..." : "Sign In"}
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
            <span className="text-muted-foreground">New here?</span>{" "}
            <Button
              variant="link"
              className="px-1"
              onClick={() => navigate("/signup")}
            >
              Sign-up here!!
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
