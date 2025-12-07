from fastapi import APIRouter, Request
import google.generativeai as genai
import os
from dotenv import load_dotenv


load_dotenv()

router = APIRouter()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)


@router.post("/chat/gemini")
async def chatGemini(request:Request):
    body = await request.json()
    project = body.get("project")
    message = body.get("message")
    role = body.get("role", "user")

    model = genai.GenerativeModel("gemini-2.5-flash")


    prompt = f"""
    Project: {project}
    Role: {role}
    Message: {message}
    Respond helpfully.
    """

    response = model.generate_content(prompt)

    return {"response": response.text}