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

# backend/src/main.py

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import ASCENDING

from .database import get_db
from .auth import router as auth_router, get_current_user
from .schemas import UserPublic

# analyze için kendi dosyan neyse onu import et
# sende daha önce "ai_service bulamadı" diyordu, o yüzden bunu böyle yazıyorum:
from .ai_service import analyze_text  # dosya adın farklıysa burayı değiştir 👈

app = FastAPI(title="FinSight AI")

# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# Router'ları ekle
# ---------------------------------------------------------
app.include_router(auth_router)  # /auth/... yolları buradan geldi

# ---------------------------------------------------------
# Startup: index oluştur
# ---------------------------------------------------------


@app.on_event("startup")
async def create_indexes():
    db = get_db()
    # users koleksiyonunda email'e unique index
    await db.users.create_index(
        [("email", ASCENDING)],
        name="uniq_email",
        unique=True,
    )

# ---------------------------------------------------------
# Basit modeller
# ---------------------------------------------------------


class AnalyzeRequest(BaseModel):
    prompt: str


# ---------------------------------------------------------
# Health
# ---------------------------------------------------------


@app.get("/health")
async def health():
    return {"ok": True}

# ---------------------------------------------------------
# Kullanıcıya açık olmayan /analyze
# Token'lı gelsin diye get_current_user kullanıyoruz
# ---------------------------------------------------------


@app.post("/analyze")
async def analyze(req: AnalyzeRequest, user: UserPublic = Depends(get_current_user)):
    answer = analyze_text(req.prompt)  
    return {"response": answer}
