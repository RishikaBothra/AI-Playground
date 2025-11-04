from fastapi import FastAPI, Request

app = FastAPI()
@app.get("/")

def home():
    return {"Hello","working!!"}

project = {}

@app.post("/createProject")
async def createProject(request:Request):
    body = await request.json()
    projectName = body.get("projectName")
    projectDescription = body.get("projectDescription")

    # Store project details in the project dictionary
    project[projectName] = {
        "description": projectDescription,
        "bot": {}
    }

    return {"message": f"Project '{projectName}' created successfully."}