from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from .database import get_db
from .schemas import UserCreate, UserPublic, Token, to_user_public

from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials


from .database import get_db
from .schemas import UserCreate, UserPublic, Token, to_user_public
from .security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_token,
)

router = APIRouter(prefix="/auth", tags=["auth"])

# ----------------------------------------------------------------
# Ortak auth dependency (bearer token + user çekme)
# ----------------------------------------------------------------

bearer = HTTPBearer()

async def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(bearer),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> UserPublic:
   
   # Authorization: Bearer <token> header'ını okur,
    #token'i çözer, Mongo'dan kullanıcıyı bulur ve public döner.
    
    sub = decode_token(creds.credentials)
    if not sub:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    user = await db.users.find_one({"email": sub})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    # hassas alanı sil
    user.pop("hashed_password", None)
    return to_user_public(user)

# ----------------------------------------------------------------
# REGISTER
# ----------------------------------------------------------------


@router.post("/register", response_model=UserPublic, status_code=201)
async def register(
    payload: UserCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    # email var mı diye bak
    existing = await db.users.find_one({"email": payload.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # şifreyi hashle
    hashed = hash_password(payload.password)

    doc = {
        "email": payload.email,
        "hashed_password": hashed,
    }

    res = await db.users.insert_one(doc)
    created = await db.users.find_one({"_id": res.inserted_id})

    return to_user_public(created)

# ----------------------------------------------------------------
# LOGIN
# ----------------------------------------------------------------


@router.post("/login", response_model=Token)
async def login(
    payload: UserCreate,  # sende UserCreate sadece email+password olduğu için bunu kullandım
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    user = await db.users.find_one({"email": payload.email})
    if not user or not verify_password(
        payload.password, user.get("hashed_password", "")
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    access_token = create_access_token(sub=user["email"])
    return {"access_token": access_token, "token_type": "bearer"}

# ----------------------------------------------------------------
# ME
# ----------------------------------------------------------------


@router.get("/me", response_model=UserPublic)
async def me(user: UserPublic = Depends(get_current_user)):
   
    #Frontend burayı çağıracak.
    #Header: Authorization: Bearer <token>
   
    return user
