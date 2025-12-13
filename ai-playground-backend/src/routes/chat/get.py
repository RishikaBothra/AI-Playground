from fastapi import APIRouter, Depends, Request, HTTPException
from src.database.database import get_db
from sqlalchemy.orm import Session
from src.database.models.projectmodel import Project
from src.database.models.chatmodel import Chat

router = APIRouter()

@router.get("/get/{project_id}")
async def getchats(project_id:int,request:Request,db:Session = Depends(get_db)):
    body = await request.json()
    bot_provider = body.get("bot_provider")

    if bot_provider is not None and not isinstance(bot_provider, str):
        raise HTTPException(status_code=400, detail="bot_provider must be a string")
    
    user_id = getattr(request.state,"user", None)
    if user_id is None:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    chat = db.query(Chat).join(Project).filter(Chat.project_id==project_id, Project.user_id==user_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found or you do not have permission to access this chat")
    
    chat.bot_provider = bot_provider
    db.commit()
    db.refresh(chat)
    return {"message": "Chat updated successfully", 
            "chat_id": chat.id,
            "chat": {
                "name": chat.name,
                "description": chat.description,
                "project_id": chat.project_id,
                "bot_provider": chat.bot_provider,
            }
    }