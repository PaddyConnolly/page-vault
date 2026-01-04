from fastapi import APIRouter, Depends, HTTPException
from src.db import DBConnection, get_db_dep
import sqlite3
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel
import jwt
import bcrypt
import os
from dotenv import load_dotenv

class AuthRequest(BaseModel):
    email: str
    password: str


auth_router = APIRouter()
load_dotenv()

def create_token(user_id: int) -> bytes:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user_id),
        "iss": "page-vault",
        "aud": "page-vault-api",
        "iat": now,
        "exp": now + timedelta(hours=1)
    }
    secret = os.environ.get("JWT_SECRET", "dev-fallback-secret")
    token =  jwt.encode(payload, secret, algorithm="HS256")
    return token



@auth_router.post("/register")
def register_user(req: AuthRequest, conn: DBConnection = Depends(get_db_dep)):
    hash = bcrypt.hashpw(req.password.encode("utf-8"), bcrypt.gensalt(rounds=12))
    cur = conn.cursor()
    try:
        cur.execute("INSERT INTO user (email, password_hash) VALUES (?, ?)", (req.email, hash))
        conn.commit()
        return {"message": "User created"}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already exists")


@auth_router.post("/login")
def login_user(req: AuthRequest, conn: DBConnection = Depends(get_db_dep)):
    cur = conn.cursor()
    cur.execute("SELECT id, password_hash FROM user WHERE email = ? ", (req.email,))
    row = cur.fetchone()
    if row:
        if bcrypt.checkpw(req.password.encode("utf-8"), row["password_hash"]):
            token = create_token(row["id"])
            return {"id": row["id"], "token": token}
        else:
            raise HTTPException(status_code=401, detail="Invalid username or password")
    else:
        raise HTTPException(status_code=401, detail="Invalid username or password")


