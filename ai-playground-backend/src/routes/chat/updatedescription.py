from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from src.database.database import get_db
from src.database.models.projectmodel import Project
from src.database.models.chatmodel import Chat

router = APIRouter()

@router.patch("/updatedescription/{chat_id}")
async def update_description(
    chat_id: int,
    request: Request,
    db: Session = Depends(get_db)
):
    body = await request.json()
    description = body.get("description")

    if description is None or not isinstance(description, str):
        raise HTTPException(
            status_code=400,
            detail="description must be a string"
        )

    user_id = getattr(request.state, "user", None)
    if user_id is None:
        raise HTTPException(status_code=401, detail="Unauthorized")

    chat = (
        db.query(Chat)
        .join(Project)
        .filter(Chat.id == chat_id, Project.user_id == user_id)
        .first()
    )

    if not chat:
        raise HTTPException(
            status_code=404,
            detail="Chat not found or access denied"
        )

    chat.description = description
    db.commit()
    db.refresh(chat)

    return {
        "message": "Chat description updated successfully",
        "chat": {
            "id": chat.id,
            "name": chat.name,
            "description": chat.description,
            "bot_provider": chat.bot_provider
        }
    }
