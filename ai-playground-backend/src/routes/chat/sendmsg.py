from fastapi import APIRouter, Depends, Request, HTTPException
from src.routes.chat.aicall import aicall
from src.database.database import get_db
from sqlalchemy.orm import Session
from src.database.models.projectmodel import Project
from src.database.models.chatmodel import Chat
from src.database.models.messagemodel import Message

router = APIRouter()

@router.post("/messages/{chat_id}")
async def send_message(chat_id:int,request:Request,db:Session = Depends(get_db)):
    body = await request.json()
    user_message = body.get("message")

    user_id = getattr(request.state,"user", None)
    if user_id is None:
        raise HTTPException(status_code=401, detail="Unauthorized")
    if user_message is None or not isinstance(user_message, str):
        raise HTTPException(status_code=400, detail="Message is required and must be a string")
    
    chat = db.query(Chat).join(Project).filter(Chat.id ==chat_id, Project.user_id == user_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found or you do not have permission to access this chat")
    
    # fetching the history
    history = (db.query(Message)
                .filter(Message.chat_id == chat_id)
                        .order_by(Message.timestamp.asc())).all()
    
    history_texts = "\n".join([f"User: {msg.user_message}\nBot: {msg.bot_response}" for msg in history])

    full_context = f"""
Project description: {Project.description and Chat.description or "No description"}
chat room info : {chat.description}

Previous messages:
{history_texts}

User: {user_message}
"""
    ai_reply = await aicall(
        bot_provider=chat.bot_provider, 
        model_name=chat.model_name, 
        context=full_context
        )
    
    db.add(Message(
        chat_id = chat_id,
        user_message = user_message,
        bot_response = ai_reply
    ))
    db.commit()
    return {"message": "Message sent successfully",
            "chat_id": chat_id}
    