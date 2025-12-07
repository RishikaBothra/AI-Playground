#imports
from fastapi import APIRouter
from src.routes.project import create
from src.routes.project import update
from src.routes.project import get
from src.routes.project import delete

#constants
project = APIRouter(prefix="/api/v1/projects")

#calling routes
project.include_router(create.router)
project.include_router(update.router)
project.include_router(get.router)
project.include_router(delete.router)