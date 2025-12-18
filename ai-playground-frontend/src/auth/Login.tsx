import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { Card,CardContent,CardHeader,CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login(){
    const navigate = useNavigate();
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
  
    const handleLogin = async () => {
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token)
            navigate('/projects');
        }
        catch (error) {
            console.error('Login failed:', error);
        }
    };

return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Email" onChange={e => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
          <Button className="w-full" onClick={handleLogin}>Login</Button>
        </CardContent>
      </Card>
    </div>
  )
}

