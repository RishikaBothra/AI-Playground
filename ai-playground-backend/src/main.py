#imports
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from requests import Session
from src.service.jwthandler import create_access_token
from src.bots import geminibot, sarvambot
from dotenv import load_dotenv
from src.database.database import get_db
from src.middleware.auth_middleware import auth_middleware
from src.database.models.usermodel import User
from src.routes.index import indexchat, indexproject
import bcrypt

load_dotenv()

#routes
app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(sarvambot.router)
app.include_router(geminibot.router)
app.middleware("http")(auth_middleware)
app.include_router(indexproject.project)
app.include_router(indexchat.chat)

#testing route
@app.get("/")
def home():
    return {"message": "Hello, working!!"}

#authentication routes
@app.post("/signin")
async def signin(request:Request,db:Session = Depends(get_db)):
    body = await request.json()

    email = body.get("email")
    password = body.get("password")

    print("Signin attempt for email:", email, "and password:", password)

    if email is None or password is None:
        raise HTTPException(status_code=400, detail="Email and password are required")
    if not isinstance(email, str) or not isinstance(password, str):
        raise HTTPException(status_code=400, detail="Email and password must be strings")
    if "@" not in email:
        raise HTTPException(status_code=400, detail="Invalid email address")

    user = db.query(User).filter(User.email == email).first()

    if not user:
        return {"error": "Invalid email"}
    
    if not bcrypt.checkpw(password.encode('utf-8'), user.hashed_password.encode("utf-8")):
        return {"error": "Invalid password."}
    
    token = create_access_token(data={"user_id": user.id})
    
    return {"message": "Signin successful", "user_id": user.id, "access_token": token}


@app.post("/signup")
async def signup(request: Request,db:Session = Depends(get_db)):
    body = await request.json()
    username = body.get("username")
    email = body.get("email")
    password = body.get("password")[:72]

    Email = db.query(User).filter(User.email == email).first()
    Username = db.query(User).filter(User.username == username).first()
    if Email:
        return {"error": "User with this email already exists."}
    if Username:
        return {"error": "User with this username already exists."}
    
    if not isinstance(username, str) or not isinstance(email, str) or not isinstance(password, str):
        raise HTTPException(status_code=400, detail="Username, email and password must be strings")
    if username is None or email is None or password is None:
        raise HTTPException(status_code=400, detail="Username, email and password are required")
    if "@" not in email:
        raise HTTPException(status_code=400, detail="Invalid email address")
    
    if len(password) >72:
        password = password[:72]

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    new_user = User(username=username, email=email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(data={"user_id": new_user.id})
    
    return {"message": "User created successfully", "user_id": new_user.id, "access_token": token}
