from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from .database import get_db
from .schemas import UserCreate, UserPublic, Token, to_user_public
from .security import hash_password, verify_password, create_access_token


router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserPublic, status_code=201)
async def register(payload: UserCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    try:
        print("DEBUG-1 Connecting to MongoDB...")

        existing = await db.users.find_one({"email": payload.email})
        print("DEBUG-2 Existing:", existing)

        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")

        hashed = hash_password(payload.password)
        print("DEBUG-3 Hashed password created")

        doc = {"email": payload.email, "hashed_password": hashed}
        res = await db.users.insert_one(doc)
        print("DEBUG-4 Inserted ID:", res.inserted_id)

        created = await db.users.find_one({"_id": res.inserted_id})
        print("DEBUG-5 Created user:", created)

        return to_user_public(created)

    except Exception as e:
        print("ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/login", response_model=Token)
async def login(payload: UserCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    user = await db.users.find_one({"email": payload.email})
    if not user or not verify_password(payload.password, user.get("hashed_password", "")):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    return {"access_token": create_access_token(sub=user["email"]), "token_type": "bearer"}
