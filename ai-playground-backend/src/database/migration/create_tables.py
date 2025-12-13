from database.database import Base, engine
from src.database.models.projectmodel import Project, Chat, User, Message

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Tables created successfully!")
