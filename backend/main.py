"""
🎵 DreamVerse Backend - FastAPI
Open Source AI Music Generation Platform
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, List
import os
import uuid
from datetime import datetime

# Supabase import (optional - will work without if not configured)
try:
    from supabase import create_client, Client
    SUPABASE_URL = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
    supabase: Optional[Client] = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL else None
except ImportError:
    supabase = None

app = FastAPI(
    title="DreamVerse API",
    description="Open Source AI Music Generation Platform",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# ==================== MODELS ====================

class UserCreate(BaseModel):
    email: str
    password: str
    username: str

class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    created_at: str

class MusicGenerateRequest(BaseModel):
    prompt: str
    duration: int = 30  # seconds
    model: str = "musicgen-medium"

class MusicGenerateResponse(BaseModel):
    id: str
    prompt: str
    audio_url: Optional[str] = None
    status: str  # generating, completed, failed
    created_at: str

class TrackResponse(BaseModel):
    id: str
    user_id: str
    title: str
    prompt: str
    audio_url: str
    duration: int
    created_at: str

# ==================== AUTH ====================

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token and return user"""
    if not supabase:
        # Mock user for development
        return {"id": "demo-user", "email": "demo@dreamverse.ai", "username": "demo"}
    
    try:
        token = credentials.credentials
        user = supabase.auth.get_user(token)
        return user.user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token"
        )

# ==================== ROUTES ====================

@app.get("/")
async def root():
    return {
        "name": "DreamVerse API",
        "version": "1.0.0",
        "status": "online",
        "docs": "/docs"
    }

# Health check
@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "supabase": "connected" if supabase else "mock mode"
    }

# ==================== AUTH ROUTES ====================

@app.post("/auth/register", response_model=UserResponse)
async def register(user: UserCreate):
    """Register a new user"""
    if not supabase:
        # Mock response for development
        return UserResponse(
            id=str(uuid.uuid4()),
            email=user.email,
            username=user.username,
            created_at=datetime.utcnow().isoformat()
        )
    
    try:
        response = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password,
            "options": {"data": {"username": user.username}}
        })
        
        return UserResponse(
            id=response.user.id,
            email=response.user.email,
            username=user.username,
            created_at=response.user.created_at
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/auth/login")
async def login(email: str, password: str):
    """Login and return JWT token"""
    if not supabase:
        # Mock response for development
        return {
            "access_token": "demo-token-" + str(uuid.uuid4()),
            "token_type": "bearer",
            "user": {"id": "demo-user", "email": email, "username": "demo"}
        }
    
    try:
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        return {
            "access_token": response.session.access_token,
            "token_type": "bearer",
            "user": {
                "id": response.user.id,
                "email": response.user.email,
                "username": response.user.user_metadata.get("username", "")
            }
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/auth/logout")
async def logout(current_user = Depends(get_current_user)):
    """Logout user"""
    if supabase:
        supabase.auth.sign_out()
    return {"message": "Logged out successfully"}

@app.get("/auth/me", response_model=UserResponse)
async def get_me(current_user = Depends(get_current_user)):
    """Get current user info"""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        username=current_user.user_metadata.get("username", ""),
        created_at=current_user.created_at
    )

# ==================== MUSIC ROUTES ====================

@app.post("/music/generate", response_model=MusicGenerateResponse)
async def generate_music(
    request: MusicGenerateRequest,
    current_user = Depends(get_current_user)
):
    """Generate music from text prompt using AI"""
    track_id = str(uuid.uuid4())
    
    # Store generation request in DB
    if supabase:
        supabase.table("tracks").insert({
            "id": track_id,
            "user_id": current_user.id,
            "title": request.prompt[:50],
            "prompt": request.prompt,
            "duration": request.duration,
            "status": "generating",
            "audio_url": None
        })
    
    # In production, this would call MusicGen API
    # For now, return with "generating" status
    
    return MusicGenerateResponse(
        id=track_id,
        prompt=request.prompt,
        status="generating",
        created_at=datetime.utcnow().isoformat()
    )

@app.get("/music/generate/{track_id}")
async def get_generation_status(
    track_id: str,
    current_user = Depends(get_current_user)
):
    """Check generation status"""
    if not supabase:
        # Mock response
        return MusicGenerateResponse(
            id=track_id,
            prompt="demo prompt",
            audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            status="completed",
            created_at=datetime.utcnow().isoformat()
        )
    
    try:
        response = supabase.table("tracks").select("*").eq("id", track_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Track not found")
        
        track = response.data[0]
        return MusicGenerateResponse(
            id=track["id"],
            prompt=track["prompt"],
            audio_url=track["audio_url"],
            status=track["status"],
            created_at=track["created_at"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/music/tracks", response_model=List[TrackResponse])
async def get_user_tracks(current_user = Depends(get_current_user)):
    """Get all tracks for current user"""
    if not supabase:
        # Mock response
        return []
    
    try:
        response = supabase.table("tracks").select("*").eq("user_id", current_user.id).execute()
        return [
            TrackResponse(
                id=track["id"],
                user_id=track["user_id"],
                title=track["title"],
                prompt=track["prompt"],
                audio_url=track["audio_url"],
                duration=track["duration"],
                created_at=track["created_at"]
            )
            for track in response.data
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/music/tracks/{track_id}")
async def delete_track(
    track_id: str,
    current_user = Depends(get_current_user)
):
    """Delete a track"""
    if supabase:
        supabase.table("tracks").delete().eq("id", track_id).execute()
    
    return {"message": "Track deleted successfully"}

# ==================== PRESETS ====================

@app.get("/music/presets")
async def get_presets():
    """Get available music generation presets"""
    return [
        {"id": "lofi", "name": "Lo-Fi Chill", "prompt": "lo-fi chill beats with piano and guitar"},
        {"id": "edm", "name": "EDM", "prompt": "energetic electronic dance music with heavy bass"},
        {"id": "classical", "name": "Classical", "prompt": "orchestral symphony with strings and brass"},
        {"id": "jazz", "name": "Jazz", "prompt": "smooth jazz with saxophone and piano"},
        {"id": "rock", "name": "Rock", "prompt": "guitar rock with drums and bass"},
        {"id": "ambient", "name": "Ambient", "prompt": "atmospheric ambient soundscapes"},
        {"id": "hiphop", "name": "Hip Hop", "prompt": "hip hop beat with 808 and rap"},
        {"id": "synthwave", "name": "Synthwave", "prompt": "retro synthwave with neon sounds"},
    ]

# ==================== MODELS ====================

@app.get("/music/models")
async def get_available_models():
    """Get available AI models"""
    return [
        {
            "id": "musicgen-medium",
            "name": "MusicGen Medium",
            "description": "Good balance of quality and speed",
            "duration_limit": 30
        },
        {
            "id": "musicgen-large",
            "name": "MusicGen Large",
            "description": "Highest quality, slower generation",
            "duration_limit": 60
        },
        {
            "id": "musicgen-melody",
            "name": "MusicGen Melody",
            "description": "Generate music from melody audio",
            "duration_limit": 30
        }
    ]

# Run with: uvicorn main:app --reload --port 8000
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
