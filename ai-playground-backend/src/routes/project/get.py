from fastapi import APIRouter, Depends, Request
from src.database.database import get_db
from sqlalchemy.orm import Session
from src.database.models.projectmodel import Project

router = APIRouter()

@router.get("/get")
def get_projects(request: Request, db: Session = Depends(get_db)):
    user_id = getattr(request.state, "user", None)

    if user_id is None:
        return {"projects": []}

    projects = db.query(Project).filter(Project.user_id == user_id).all()

    return {
        "projects": [
            {"id": p.id, "name": p.name, "description": p.description} for p in projects
        ]
    }
    