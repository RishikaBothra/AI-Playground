import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Chat } from '@/types'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

export default function Chats(){
  const navigate = useNavigate()
  const { projectId } = useParams()
  const [chats, setChats] = useState<Chat[]>([])

  useEffect(() => {
    // placeholder: load chats for project
    setChats([{ id: 1, name: 'General', description: '', bot_provider: 'local' }])
  }, [projectId])

  return (
    <div className="p-6 grid grid-cols-1 gap-4">
      {chats.map(c => (
        <Card key={c.id} className="cursor-pointer" onClick={() => navigate(`/chats/${c.id}`)}>
          <CardHeader>
            <CardTitle>{c.name}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
