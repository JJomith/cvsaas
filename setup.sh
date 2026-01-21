#!/bin/bash

# CV Builder - Setup Script
# This script sets up the development environment

set -e

echo "🚀 CV Builder - Development Setup"
echo "=================================="

# Check Node.js version
echo ""
echo "📦 Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js $(node -v) detected"

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install
echo "✅ Backend dependencies installed"

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install
echo "✅ Frontend dependencies installed"

# Setup environment files
echo ""
echo "🔧 Setting up environment files..."
cd ..

if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env (please configure your settings)"
else
    echo "ℹ️  backend/.env already exists"
fi

if [ ! -f "frontend/.env.local" ]; then
    echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > frontend/.env.local
    echo "✅ Created frontend/.env.local"
else
    echo "ℹ️  frontend/.env.local already exists"
fi

# Setup database
echo ""
echo "🗄️  Setting up database..."
cd backend

# Check if PostgreSQL is available
if command -v psql &> /dev/null; then
    echo "ℹ️  PostgreSQL detected. Make sure your database is running."
    echo "   Run: npx prisma migrate dev --name init"
else
    echo "⚠️  PostgreSQL not found. You can:"
    echo "   1. Install PostgreSQL locally"
    echo "   2. Use Docker: docker-compose up -d postgres"
    echo "   3. Use a cloud database (update .env)"
fi

# Generate Prisma client
echo ""
echo "🔧 Generating Prisma client..."
npx prisma generate
echo "✅ Prisma client generated"

cd ..

echo ""
echo "=================================="
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Configure your environment variables:"
echo "   - Edit backend/.env with your database URL and API keys"
echo "   - Add AI provider API keys (OpenAI, Anthropic, Google)"
echo "   - Add Stripe API keys for payments"
echo ""
echo "2. Run database migrations:"
echo "   cd backend && npx prisma migrate dev --name init"
echo ""
echo "3. Start the development servers:"
echo "   - Backend: cd backend && npm run dev"
echo "   - Frontend: cd frontend && npm run dev"
echo ""
echo "4. Open in browser:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:3001"
echo ""
echo "Happy coding! 🎉"
