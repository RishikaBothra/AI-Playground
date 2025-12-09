from sqlalchemy import Column, ForeignKey, Integer, String
from src.database.database import Base
from sqlalchemy.orm import relationship
from datetime import datetime

class Messgae(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(Integer, ForeignKey("chats.id"))
    bot_provider = Column(String)
    sender = Column(String)
    content = Column(String)
    created_at = Column(String, default=datetime.utcnow().isoformat)

    chat = relationship("Chat", back_populates="messages")