#imports
from fastapi import APIRouter
from src.routes.chat import create
from routes.chat import updatebot
from src.routes.chat import get
from src.routes.chat import delete

#constants
chat = APIRouter(prefix="/api/v1/projects/chat")

#calling routes
chat.include_router(create.router)
chat.include_router(updatebot.router)
chat.include_router(get.router)
chat.include_router(delete.router)