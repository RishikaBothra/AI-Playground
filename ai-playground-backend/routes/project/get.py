from fastapi import APIRouter, Depends, Request, HTTPException
from database import get_db
from sqlalchemy.orm import Session
from models import Project

router = APIRouter()

@router.get("/get")
def get_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).all()

    return {
        "projects": [
            {"name": p.name, "description": p.description} for p in projects
        ]
    }