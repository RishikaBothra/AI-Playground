from fastapi import Depends, FastAPI, HTTPException, Request
from requests import Session
from auth.jwthandler import create_access_token
from bots import geminibot, sarvambot
from dotenv import load_dotenv
from database import SessionLocal
from models import Project
from database import engine, Base
from database import get_db
from models import User
from passlib.context import CryptContext
from middleware.auth_middleware import auth_middleware

from passlib.context import CryptContext
pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
pwd.hash("hello123")



load_dotenv()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


app = FastAPI()
app.include_router(sarvambot.router)
app.include_router(geminibot.router)
app.middleware("http")(auth_middleware)

@app.get("/")

def home():
    return {"message": "Hello, working!!"}

@app.post("/createProject")
async def createProject(request:Request,db: Session = Depends(get_db)):
    body = await request.json()
    projectName = body.get("projectName")
    projectDescription = body.get("projectDescription")

    user_id = request.state.user

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

@app.get("/getProjects")
def get_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).all()

    return {
        "projects": [
            {"name": p.name, "description": p.description} for p in projects
        ]
    }

@app.put("/updateProject/{project_id}")
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

@app.delete("/deleteProject/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"}

@app.post("/signin")
async def signin(request:Request,db:Session = Depends(get_db)):
    body = await request.json()

    email = body.get("email")
    password = body.get("password")

    user = db.query(User).filter(User.email == email).first()

    if not user:
        return {"error": "Invalid email"}
    
    if not pwd_context.verify(password, user.hashed_password):
        return {"error": "Invalid password."}
    
    token = create_access_token(data={"user_id": user.id})
    
    return {"message": "Signin successful", "user_id": user.id, "access_token": token}


@app.post("/signup")
async def signup(request: Request,db:Session = Depends(get_db)):
    body = await request.json()
    username = body.get("username")
    email = body.get("email")
    password = body.get("password")[:72]

    existing = db.query(User).filter(User.email == email).first()
    if existing:
        return {"error": "User with this email already exists."}
    
    if len(password) >72:
        password = password[:72]

    hashed_password = pwd_context.hash(password)

    new_user = User(username=username, email=email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(data={"user_id": new_user.id})
    
    return {"message": "User created successfully", "user_id": new_user.id, "access_token": token}
