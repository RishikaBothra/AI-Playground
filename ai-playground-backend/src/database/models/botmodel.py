from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from src.database.models.base import Base

class Bot(Base):
    __tablename__ = 'bots'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    key = Column(String, nullable=False)
    prompt_template = Column(Text, nullable=False)
    chats = relationship("Chat", back_populates="bot")