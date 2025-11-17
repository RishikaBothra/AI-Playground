from fastapi import Depends, FastAPI, Request
from requests import Session
from bots import geminibot, sarvambot
from dotenv import load_dotenv
from database import SessionLocal
from models import Project
from database import engine, Base
from database import get_db
from models import User
from passlib.context import CryptContext

load_dotenv()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


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
    
    return {"message": "Signin successful", "user_id": user.id}


@app.post("/signup")
async def signup(request: Request,db:Session = Depends(get_db)):
    body = await request.json()
    username = body.get("username")
    email = body.get("email")
    password = body.get("password")

    existing = db.query(User).filter(User.email == email).first()
    if existing:
        return {"error": "User with this email already exists."}
    
    hashed_password = pwd_context.hash(password)

    new_user = User(username=username, email=email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully", "user_id": new_user.id}

