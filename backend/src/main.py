import os
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorDatabase
from pymongo import ASCENDING

from .database import get_db
from .schemas import UserPublic, to_user_public
from .security import decode_token
from .auth import router as auth_router
from .ai_service import analyze_text   # kendi OpenAI fonksiyonun

app = FastAPI(title="FinSight AI (MongoDB)")

# ---- CORS ----
CORS_ORIGIN = os.getenv("CORS_ORIGIN", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[CORS_ORIGIN, "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Router ----
app.include_router(auth_router)

# ---- Startup ----
@app.on_event("startup")
async def create_indexes():
    db = get_db()
    await db.users.create_index([("email", ASCENDING)], name="uniq_email", unique=True)

# ---- Auth dependency ----
bearer = HTTPBearer()

async def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(bearer),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> UserPublic:
    sub = decode_token(creds.credentials)
    if not sub:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = await db.users.find_one({"email": sub})
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    user.pop("hashed_password", None)
    return to_user_public(user)

# ---- Request model ----
class AnalyzeRequest(BaseModel):
    prompt: str

@app.get("/health")
async def health():
    return {"ok": True}

@app.get("/me", response_model=UserPublic)
async def me(user: UserPublic = Depends(get_current_user)):
    return user

@app.post("/analyze")
async def analyze(req: AnalyzeRequest, user: UserPublic = Depends(get_current_user)):
    return {"response": analyze_text(req.prompt)}
