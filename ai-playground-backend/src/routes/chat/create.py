from fastapi import APIRouter, Depends, Request, HTTPException
from src.database.database import get_db
from sqlalchemy.orm import Session
from src.database.models.projectmodel import Project
from src.database.models.chatmodel import Chat

router = APIRouter()

@router.post("/create/{project_id}")
async def createchat(project_id:int,request:Request,db:Session = Depends(get_db)):
    body = await request.json()
    name = body.get("name")
    description = body.get("description")
    bot_provider = body.get("bot_provider")
    model_name = body.get("model_name")

    user_id = getattr(request.state,"user", None)
    if user_id is None:
        raise HTTPException(status_code=401, detail="Unauthorized")
    if name is None or description is None or bot_provider is None or model_name is None:
        raise HTTPException(status_code=400, detail="All fields are required")
    if not isinstance(name, str) or not isinstance(description, str) or not isinstance(bot_provider, str) or not isinstance(model_name, str):
        raise HTTPException(status_code=400, detail="All fields must be strings")
    
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == user_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found or you do not have permission to add chat to this project")
    
    newchat = Chat(
        name = name,
        description = description,
        project_id = project_id,
        bot_provider = bot_provider,
        model_name = model_name
    )
    db.add(newchat)
    db.commit()
    db.refresh(newchat)
    return {"message": "Chat created successfully", 
            "chat_id": newchat.id,
            "chat": {
                "name": newchat.name,
                "description": newchat.description,
                "project_id": newchat.project_id,
                "bot_provider": newchat.bot_provider,
                "model_name": newchat.model_name
            }
    }