#!/bin/bash
# CHE·NU Setup Script
# ==================

set -e

echo "🏠 CHE·NU Setup"
echo "==============="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo "❌ Python not found. Please install Python 3.11+"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites OK${NC}"
echo ""

# Backend setup
echo -e "${YELLOW}Setting up backend...${NC}"
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..
echo -e "${GREEN}✅ Backend ready${NC}"
echo ""

# Frontend setup
echo -e "${YELLOW}Setting up frontend...${NC}"
npm install
echo -e "${GREEN}✅ Frontend ready${NC}"
echo ""

# Environment
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env from example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .env created - Please update with your values${NC}"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start development:"
echo "  Backend:  cd backend && source venv/bin/activate && python main.py"
echo "  Frontend: npm run dev"
echo ""
echo "🧭 CHE·NU - Human responsibility active"
