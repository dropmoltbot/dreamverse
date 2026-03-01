# DreamVerse - Open Source AI Music Platform

## 🏗️ Architecture Open Source

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│  DreamVerse (Vercel)                                           │
│  - React + Vite + Tailwind                                     │
│  - Framer Motion + Lenis Scroll                                │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND (Open Source)                     │
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐                    │
│  │  Supabase       │    │  MusicGen API   │                    │
│  │  - Auth         │    │  (Meta)         │                    │
│  │  - Database     │    │  - Docker       │                    │
│  │  - Storage     │    │  - GPU/CPU      │                    │
│  └─────────────────┘    └─────────────────┘                    │
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐                    │
│  │  Uvicorn/FastAPI│    │  HuggingFace   │                    │
│  │  - Routes       │    │  Inference     │                    │
│  │  - Middleware  │    │  - Endpoints   │                    │
│  └─────────────────┘    └─────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Stack Open Source

| Feature | Solution | License |
|---------|----------|---------|
| **AI Music** | Meta MusicGen | MIT |
| **Auth** | Supabase Auth | Apache 2 |
| **Database** | Supabase PostgreSQL | Apache 2 |
| **Storage** | Supabase Storage | Apache 2 |
| **Backend** | FastAPI | MIT |
| **Frontend** | React + Vite | MIT |
| **Hosting** | Vercel + Railway | Freemium |

---

## 📦 Dépendances

### Backend
```json
{
  "fastapi": "^0.109.0",
  "uvicorn": "^0.27.0",
  "supabase": "^2.3.0",
  "python-multipart": "^0.0.6",
  "httpx": "^0.26.0",
  "pydantic": "^2.5.0"
}
```

### AI Inference
```python
# MusicGen Docker
# Meta's MusicGen - Apache 2 License
# https://github.com/facebookresearch/audiocraft
```

---

## 🔧 Setup

### 1. Backend (FastAPI + MusicGen)
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### 2. AI Service (MusicGen)
```bash
# Option A: Local Docker
docker build -t musicgen .
docker run -p 7860:7860 musicgen

# Option B: HuggingFace Inference API
# Plus simple, gratuit jusqu'à certain limit
```

### 3. Database (Supabase)
```bash
# Créer un projet sur supabase.com
#Importer schema.sql
```

---

## 📁 Structure

```
dreamverse/
├── frontend/           # React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── lib/
│   └── package.json
├── backend/           # FastAPI
│   ├── routes/
│   ├── services/
│   ├── models/
│   └── main.py
├── ai/               # MusicGen
│   ├── docker/
│   └── inference.py
└── supabase/
    ├── schema.sql
    └── seed.sql
```

---

## 🎵 MusicGen - Génération

```python
from audiocraft.models import MusicGen

model = MusicGen.get_pretrained('facebook/musicgen-large')
model.set_generation_duration(30)  # 30 seconds

# Generate from text prompt
output = model.generate(
    descriptions=["lo-fi chill beats with piano and guitar"],
    progress=True
)

# Save audio
output[0].export("output.wav")
```

---

## 👤 Auth Flow

```
User → Frontend → Supabase Auth → JWT Token
                              ↓
                      Store in localStorage
                              ↓
              Include in API requests: Authorization: Bearer <token>
                              ↓
                      Backend validates with Supabase
```

---

## 💰 Coût Open Source

| Service | Free Tier | Paid |
|---------|-----------|------|
| **Supabase** | 500MB DB, 1GB Storage, 50K MAU | $25/mo |
| **HuggingFace** | 500 inference minutes/mo | $10/mo |
| **Vercel** | 100GB bandwidth | $20/mo |
| **Railway** | $5 credit/mo | $20/mo |
| **Total** | **~Free** | **~$75/mo** |

---

## 🚀 Déploiement

### Backend (Railway/Render)
```bash
railway init
railway up
```

### AI Service (HuggingFace Spaces)
```bash
# Déployer sur HuggingFace Spaces (gratuit)
hf space create dreamverse-musicgen
git push
```

---

## 📝 License

MIT License - 2026 dropmoltbot
