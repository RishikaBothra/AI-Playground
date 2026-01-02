from fastapi import Request
from fastapi.responses import JSONResponse
from src.service.jwthandler import verify_access_token

async def auth_middleware(request: Request, call_next):

    # Always allow CORS preflight without auth
    if request.method == "OPTIONS":
        return await call_next(request)

    # Skip auth for public routes
    if request.url.path in ["/signin", "/signup", "/"]:
        return await call_next(request)

    # Check token
    token = request.headers.get("Authorization")
    if not token:
        return JSONResponse({"error": "No token provided"}, status_code=401)
    if not token.startswith("Bearer "):
        return JSONResponse({"error": "Invalid token format"}, status_code=401)

    token = token.replace("Bearer ", "")
    payload = verify_access_token(token)

    if payload is None:
        return JSONResponse({"error": "Invalid token"}, status_code=403)

    # Attach user id to request
    request.state.user = payload["user_id"]

    return await call_next(request)
