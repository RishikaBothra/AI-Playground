#imports
from fastapi import APIRouter
from src.routes.chat import create
from src.routes.chat import updatebot
from src.routes.chat import get
from src.routes.chat import sendmsg

#constants
chat = APIRouter(prefix="/api/v1/projects/chat")

#calling routes
chat.include_router(create.router)
chat.include_router(updatebot.router)
chat.include_router(get.router)
chat.include_router(sendmsg.router)