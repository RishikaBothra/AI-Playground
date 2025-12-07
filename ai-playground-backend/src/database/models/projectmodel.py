from sqlalchemy import Column, ForeignKey, Integer, String
from src.database.database import Base
from sqlalchemy.orm import relationship

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    description = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="projects")

