# 🎵 DreamVerse - Open Source AI Music Generator

<p align="center">
  <img src="https://img.shields.io/github/stars/dropmoltbot/dreamverse" alt="stars">
  <img src="https://img.shields.io/github/license/dropmoltbot/dreamverse" alt="license">
  <img src="https://img.shields.io/badge/Stack-React%20%2B%20FastAPI-purple" alt="stack">
</p>

> Generate unique music with AI • Open Source • Self-hostable

## ✨ Features

- 🎵 **AI Music Generation** - Powered by Meta MusicGen
- 🎨 **Modern UI** - Glassmorphism design with smooth animations
- 🔓 **Open Source** - Fully transparent and auditable
- 🚀 **Easy Deploy** - Vercel, Render, HuggingFace free tiers
- 📱 **Responsive** - Works on desktop and mobile

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend     │────▶│   Backend      │────▶│   AI Service   │
│   (Vercel)    │     │   (Render)    │     │  (HuggingFace) │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Supabase     │
                       │  (Database)    │
                       └─────────────────┘
```

## 🚀 Quick Deploy (100% Free)

### 1. Frontend → Vercel
```
1. https://vercel.com
2. Import GitHub: dropmoltbot/dreamverse
3. Framework: Vite
4. Output: dist
5. Deploy!
```

### 2. Database → Supabase
```
1. https://supabase.com → New Project
2. SQL Editor → Run schema.sql
3. Get URL + Anon Key
```

### 3. Backend → Render
```
1. https://render.com → New Web Service
2. Connect GitHub: dropmoltbot/dreamverse
3. Root: backend
4. Build: pip install -r requirements.txt  
5. Start: uvicorn main:app --reload
6. Add ENV: SUPABASE_URL, SUPABASE_KEY
7. Deploy!
```

### 4. AI → HuggingFace Spaces
```
1. https://huggingface.co/spaces → Create New Space
2. Repo: dreamverse-musicgen
3. SDK: Docker
4. Upload: ai/Dockerfile + ai/inference.py
5. Deploy!
```

## 📦 Tech Stack

| Layer | Tech | License |
|-------|------|---------|
| Frontend | React + Vite + Tailwind | MIT |
| Backend | FastAPI | MIT |
| AI | Meta MusicGen | Apache 2 |
| Database | Supabase (PostgreSQL) | Apache 2 |
| Hosting | Vercel + Render + HF | Free tiers |

## 🎵 Usage

```bash
# Clone
git clone https://github.com/dropmoltbot/dreamverse.git
cd dreamverse

# Frontend
cd frontend
npm install
npm run dev

# Backend
cd ../backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## 🔧 Environment Variables

```env
# Frontend (.env)
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx

# Backend (.env)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=xxx
```

## 📄 License

MIT © 2026 dropmoltbot

---

<p align="center">Made with 🎵 by <a href="https://github.com/dropmoltbot">dropmoltbot</a></p>
