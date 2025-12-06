from fastapi import APIRouter, Depends, Request, HTTPException
from database import get_db
from sqlalchemy.orm import Session
from models import Project

router = APIRouter()

@router.put("/update/{project_id}")
async def update_project(project_id: int, request: Request, db: Session = Depends(get_db)):
    body = await request.json()

    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project.name = body.get("projectName", project.name)
    project.description = body.get("projectDescription", project.description)
    db.commit()
    db.refresh(project)
    return {"message": "Project updated successfully", 
            "project": {
                "name": project.name, 
                "description": project.description
            }
           }
