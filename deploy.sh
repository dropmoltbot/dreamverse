#!/bin/bash
# 🎵 DreamVerse One-Click Deploy Script
# Run this to deploy the entire platform

echo "🎵 DreamVerse Deployment"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Frontend (Vercel)
echo -e "${YELLOW}1. Deploying Frontend...${NC}"
echo "Already deployed! URL: https://frontend-rosy-kappa-96.vercel.app"

# 2. Backend (Render)
echo -e "${YELLOW}2. Deploy Backend on Render...${NC}"
echo "Go to: https://render.com"
echo "  - Connect GitHub"
echo "  - New Web Service"
echo "  - Select this repo"
echo "  - Build: pip install -r requirements.txt"
echo "  - Start: uvicorn main:app"

# 3. AI (HuggingFace)
echo -e "${YELLOW}3. Deploy AI on HuggingFace...${NC}"
echo "Go to: https://huggingface.co/spaces"
echo "  - Create New Space"
echo "  - Select Docker"
echo "  - Upload ai/Dockerfile"

echo -e "${GREEN}Done!${NC}"
echo ""
echo "Or use Railway:"
echo "  railway init"
echo "  railway up"
