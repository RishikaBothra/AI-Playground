from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from src.database.models.base import Base
from sqlalchemy.orm import relationship
from datetime import datetime


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(Integer, ForeignKey("chats.id"))
    user_message = Column(String)
    bot_response = Column(String)
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())
    timestamp = Column(DateTime, default=datetime.utcnow)

    chat = relationship("Chat", back_populates="messages")