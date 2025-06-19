from app.src.features.users.model import User
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends
from uuid import uuid4
from dotenv import load_dotenv
from app.src.core.settings import settings
from app.src.core.auth import get_current_user
from app.src.features.games.face.endpoints import router as face_game_router

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(face_game_router)

@app.get('/auth/new')
async def new_auth():
    new_token = uuid4().hex
    return {
        "id": uuid4(),
        "session_token": new_token
    }
    

@app.get("/auth/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)) -> User:
    return  current_user
