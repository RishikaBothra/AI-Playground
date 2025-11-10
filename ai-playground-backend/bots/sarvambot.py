from sarvamai import SarvamAI
from fastapi import APIRouter, Request
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")
client = SarvamAI(api_subscription_key=SARVAM_API_KEY)

@router.post("/chat/sarvam")
async def chatSarvam(request:Request):
    body = await request.json()
    project = body.get("project")
    message = body.get("message")
    role = body.get("role", "user")

    context = f"Project: {project}, Message: {message}"

    response = client.chat.completions(messages=[
        {"role": role, "content": context}
])
    return {"response": response.choices[0].message.content}
