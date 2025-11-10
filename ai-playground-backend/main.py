from fastapi import Depends, FastAPI, Request
from requests import Session
from bots import geminibot, sarvambot
from dotenv import load_dotenv
from database import SessionLocal
from models import Project
from database import engine, Base

Base.metadata.create_all(bind=engine)
load_dotenv()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI()
app.include_router(sarvambot.router)
app.include_router(geminibot.router)

@app.get("/")

def home():
    return {"message": "Hello, working!!"}


@app.post("/createProject")
async def createProject(request:Request,db: Session = Depends(get_db)):
    body = await request.json()
    projectName = body.get("projectName")
    projectDescription = body.get("projectDescription")

    # Store project details in the database
    newProject = Project(name=projectName, description=projectDescription)
    db.add(newProject)
    db.commit()
    db.refresh(newProject)
    return {"message": "Project created successfully", 
            "project": {
                "name": newProject.name, 
                "description": newProject.description
            }
              }

@app.get("/getProjects")
def get_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).all()

    return {
        "projects": [
            {"name": p.name, "description": p.description} for p in projects
        ]
    }

