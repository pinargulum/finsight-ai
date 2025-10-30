from pydantic import BaseModel, EmailStr, ConfigDict

# ---- Basit şemalar (ObjectId yerine string id) ----
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserPublic(BaseModel):
    id: str
    email: EmailStr
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# ---- Mongo dökümanı -> API modeli dönüşümü ----
def to_user_public(doc: dict) -> UserPublic:
    return UserPublic(
        id=str(doc.get("_id", "")),
        email=doc.get("email", "")
    )

