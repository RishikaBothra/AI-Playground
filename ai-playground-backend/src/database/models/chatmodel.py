from sqlalchemy import Column, ForeignKey, Integer, String
from src.database.database import Base
from sqlalchemy.orm import relationship
from datetime import datetime

class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    project_id = Column(Integer, ForeignKey("projects.id"))
    bot_provider = Column(String)
    created_at = Column(String, default=datetime.utcnow().isoformat)

    project = relationship("Project", back_populates="chats")
    messages = relationship("Message", back_populates="chat", cascade="all, delete-orphan")