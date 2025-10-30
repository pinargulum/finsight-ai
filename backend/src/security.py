import os
import base64
import hashlib
import hmac
from datetime import datetime, timedelta
from jose import jwt, JWTError
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY not found in environment")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# ---- basit PBKDF2 tabanlı şifreleme ----
# format: pbkdf2$iterations$salt$hash
PBKDF2_ITERATIONS = 390000  # güvenli bir seviye

def hash_password(password: str) -> str:
    if not isinstance(password, str):
        password = str(password)
    password = password.strip().encode("utf-8")

    salt = os.urandom(16)
    dk = hashlib.pbkdf2_hmac("sha256", password, salt, PBKDF2_ITERATIONS)
    return "pbkdf2${}${}${}".format(
        PBKDF2_ITERATIONS,
        base64.b64encode(salt).decode("ascii"),
        base64.b64encode(dk).decode("ascii"),
    )

def verify_password(password: str, hashed: str) -> bool:
    try:
        scheme, iter_s, salt_b64, hash_b64 = hashed.split("$", 3)
        if scheme != "pbkdf2":
            return False
        iters = int(iter_s)
        salt = base64.b64decode(salt_b64)
        real_hash = base64.b64decode(hash_b64)

        test_hash = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iters)
        return hmac.compare_digest(real_hash, test_hash)
    except Exception:
        return False

def create_access_token(sub: str) -> str:
    expire = datetime.now(datetime.timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode({"sub": sub, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> str | None:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None
