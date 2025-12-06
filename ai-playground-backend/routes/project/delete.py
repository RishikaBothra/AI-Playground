from fastapi import APIRouter, Depends, Request, HTTPException
from database import get_db
from sqlalchemy.orm import Session
from models import Project

router = APIRouter()

@router.delete("/delete/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"}