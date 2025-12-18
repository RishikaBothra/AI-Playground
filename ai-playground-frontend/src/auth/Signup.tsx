import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Signup(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignup = () => {
    // minimal placeholder — backend wiring expected
    console.log('signup', { email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Email" onChange={e => setEmail((e.target as HTMLInputElement).value)} />
          <Input type="password" placeholder="Password" onChange={e => setPassword((e.target as HTMLInputElement).value)} />
          <Button className="w-full" onClick={handleSignup}>Sign up</Button>
        </CardContent>
      </Card>
    </div>
  )
}
