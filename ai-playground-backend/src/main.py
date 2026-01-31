from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import bcrypt
from src.database.database import get_db
from src.database.models.usermodel import User
from src.middleware.auth_middleware import auth_middleware
from src.service.jwthandler import create_access_token
from src.routes.index import indexchat, indexproject
from src.bots import geminibot, sarvambot

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.middleware("http")(auth_middleware)
app.include_router(indexproject.project)
app.include_router(indexchat.chat)
app.include_router(geminibot.router)
app.include_router(sarvambot.router)

@app.get("/")
def home():
    return {"message": "Hello, working!!"}

# AUTH ROUTES
@app.post("/signin")
async def signin(request: Request, db: Session = Depends(get_db)):
    body = await request.json()
    email = body.get("email")
    password = body.get("password")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    if not isinstance(email, str) or not isinstance(password, str):
        raise HTTPException(status_code=400, detail="Email and password must be strings")

    if "@" not in email:
        raise HTTPException(status_code=400, detail="Invalid email address")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not bcrypt.checkpw(
        password.encode("utf-8"),
        user.hashed_password.encode("utf-8"),
    ):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(data={"user_id": user.id})

    return {
        "message": "Signin successful",
        "user_id": user.id,
        "access_token": token,
    }


@app.post("/signup")
async def signup(request: Request, db: Session = Depends(get_db)):
    body = await request.json()
    username = body.get("username")
    email = body.get("email")
    password = body.get("password")

    if not username or not email or not password:
        raise HTTPException(
            status_code=400,
            detail="Username, email and password are required",
        )

    if not all(isinstance(x, str) for x in [username, email, password]):
        raise HTTPException(
            status_code=400,
            detail="Username, email and password must be strings",
        )

    if "@" not in email:
        raise HTTPException(status_code=400, detail="Invalid email address")

    # bcrypt limit
    password = password[:72]

    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    if db.query(User).filter(User.username == username).first():
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt(),
    ).decode("utf-8")

    new_user = User(
        username=username,
        email=email,
        hashed_password=hashed_password,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(data={"user_id": new_user.id})

    return {
        "message": "User created successfully",
        "user_id": new_user.id,
        "access_token": token,
    }
