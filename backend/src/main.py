from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os

from .ai_service import analyze_text  # ← önemli

app = FastAPI(title="FinSight AI")

CORS_ORIGIN = os.getenv("CORS_ORIGIN", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[CORS_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    prompt: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/analyze")
async def analyze(req: AnalyzeRequest):
    try:
        return {"response": analyze_text(req.prompt)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
