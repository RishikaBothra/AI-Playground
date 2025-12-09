from fastapi import APIRouter, Depends, Request, HTTPException
from src.database.database import get_db
from sqlalchemy.orm import Session
from src.database.models.projectmodel import Project

router = APIRouter()

@router.post("/create")
async def createProject(request:Request,db: Session = Depends(get_db)):
    body = await request.json()
    projectName = body.get("projectName")
    projectDescription = body.get("projectDescription")

    user_id = request.state.user

    if projectName is None or projectDescription is None:
        raise HTTPException(status_code=400, detail="Project name and description are required")
    if not isinstance(projectName, str) or not isinstance(projectDescription, str):
        raise HTTPException(status_code=400, detail="Project name and description must be strings")

    # Store project details in the database
    newProject = Project(
        name=projectName, 
        description=projectDescription,
        user_id=user_id
    )
    db.add(newProject)
    db.commit()
    db.refresh(newProject)
    return {"message": "Project created successfully", 
            "project": {
                "name": newProject.name, 
                "description": newProject.description,
                "user_id": newProject.user_id
            }
              }