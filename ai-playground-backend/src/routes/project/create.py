from fastapi import APIRouter, Depends, Request, HTTPException
from src.database.database import get_db
from sqlalchemy.orm import Session
from src.database.models.projectmodel import Project

router = APIRouter()

@router.post("/create")
async def createProject(request:Request,db: Session = Depends(get_db)):
    body = await request.json()
    name = body.get("name")
    description = body.get("description")
    bot_id = body.get("bot_id")

    user_id = request.state.user

    if name is None or description is None:
        raise HTTPException(status_code=400, detail="Project name and description are required")
    if not isinstance(name, str) or not isinstance(description, str):
        raise HTTPException(status_code=400, detail="Project name and description must be strings")
    
    #check if a project with same name exists for the user
    existing_project = db.query(Project).filter(Project.name == name, Project.user_id == user_id).first()
    if existing_project:
        raise HTTPException(status_code=400, detail="Project with this name already exists")

    # Store project details in the database
    try:
        newProject = Project(name=name, description=description, user_id=user_id)
        db.add(newProject)
        db.commit()
        db.refresh(newProject)
    except Exception as e:
        db.rollback()
        if "UNIQUE constraint failed" in str(e) or "unique constraint" in str(e).lower():
            raise HTTPException(status_code=400, detail="Project with this name already exists")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    return {"message": "Project created successfully", 
            "project": {
                "id": newProject.id,
                "name": newProject.name, 
                "description": newProject.description,
                "user_id": newProject.user_id
            }
              }