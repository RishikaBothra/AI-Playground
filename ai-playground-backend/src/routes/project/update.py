from fastapi import APIRouter, Depends, Request, HTTPException
from src.database.database import get_db
from sqlalchemy.orm import Session
from src.database.models.projectmodel import Project

router = APIRouter()

@router.put("/update/{project_id}")
async def update_project(project_id: int, request: Request, db: Session = Depends(get_db)):
    body = await request.json()

    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project.name = body.get("projectName", project.name)
    project.description = body.get("projectDescription", project.description)

    if project.name is None or project.description is None:
        raise HTTPException(status_code=400, detail="Project name and description are required")
    if not isinstance(project.name, str) or not isinstance(project.description, str):
        raise HTTPException(status_code=400, detail="Project name and description must be strings")
    db.commit()
    db.refresh(project)
    return {"message": "Project updated successfully", 
            "project": {
                "name": project.name, 
                "description": project.description
            }
           }
