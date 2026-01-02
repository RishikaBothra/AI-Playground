import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function Signin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post("/signup", {username, email, password });
      if (response.data?.error) {
        setError(response.data.error);
        return;
      }
      // proceed when signup is successful
      localStorage.setItem("token", response.data.access_token);
      navigate("/dashboard/projects");
    } catch (err: any) {
      const message =
        err.response?.data?.detail || // FastAPI validation error
        err.response?.data?.error || // Custom error message from backend
        "Sign Up failed. Please check your credentials.";

      setError(message|| "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <Card className="w-[380px] shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <Separator />
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Sign Up failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Your username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError(null); // Clear error on input change
              }}
            />
          </div>
        </CardContent>

        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
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
                setPassword(e.target.value);
                if (error) setError(null); // Clear error on input change
              }}
            />
          </div>

          <Button
            className="w-full"
            onClick={handleSignup}
            disabled={loading || !email || !password}
          >
            {loading ? "Signing up..." : "Sign Up"}
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
              onClick={() => navigate("/signin")}
            >
              Sign in here!!
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
