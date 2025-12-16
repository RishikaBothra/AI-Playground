from fastapi import APIRouter, Depends, Request, HTTPException
from src.database.database import get_db
from sqlalchemy.orm import Session
from src.database.models.projectmodel import Project
from src.database.models.chatmodel import Chat

router = APIRouter()

@router.get("/get/{project_id}")
async def getchats(project_id:int,request:Request,db:Session = Depends(get_db)):
    user_id = getattr(request.state,"user", None)
    if user_id is None:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    # Verify project belongs to user
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == user_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found or you do not have permission to access this project")
    
    # Get all chats for this project
    chats = db.query(Chat).filter(Chat.project_id == project_id).all()
    
    return {
        "chats": [
            {
                "id": chat.id,
                "name": chat.name,
                "description": chat.description,
                "project_id": chat.project_id,
                "bot_provider": chat.bot_provider,
            } for chat in chats
        ]
    }