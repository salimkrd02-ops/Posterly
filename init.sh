#!/bin/bash
# PosterGen Project Initialization Script

echo "Creating PosterGen project structure..."

# Create directories
mkdir -p src/app/{(auth)/{login,signup,forgot-password},dashboard,events,templates,editor,admin,api/{auth,events,templates,results,posters,upload}}
mkdir -p src/components/{layout,forms,editor,dashboard,common}
mkdir -p src/lib/{db,auth,canvas,export,utils}
mkdir -p src/styles
mkdir -p prisma
mkdir -p public

echo "✓ Directories created"

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "✓ Created .env.local (configure with your values)"
fi

# Create placeholder files
touch .gitignore

echo "✓ Project structure created successfully"
echo ""
echo "Next steps:"
echo "1. Configure .env.local with your database and service credentials"
echo "2. Run: npm install"
echo "3. Run: npm run prisma:migrate"
echo "4. Run: npm run dev"
