from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session

from src.database.database import get_db
from src.database.models.chatmodel import Chat
from src.database.models.projectmodel import Project

router = APIRouter()

@router.delete("/delete/{chat_id}")
async def delete_chat(
    chat_id: int,
    request: Request,
    db: Session = Depends(get_db)
):
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

    db.delete(chat)
    db.commit()

    return {"message": "Chat deleted successfully"}
