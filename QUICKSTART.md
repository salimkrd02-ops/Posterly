# PosterGen - Quick Start Guide

## Project Status

✅ Configuration files created
✅ Package.json with all dependencies
✅ Database schema (Prisma)
✅ Project structure documentation
✅ Complete API route templates
✅ React component templates

## Getting Started

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Create Directory Structure

**For Windows PowerShell:**
```powershell
# Create src directory structure
New-Item -ItemType Directory -Force -Path "src\app\(auth)\login" | Out-Null
New-Item -ItemType Directory -Force -Path "src\app\(auth)\signup" | Out-Null
New-Item -ItemType Directory -Force -Path "src\app\(auth)\forgot-password" | Out-Null
New-Item -ItemType Directory -Force -Path "src\app\dashboard" | Out-Null
New-Item -ItemType Directory -Force -Path "src\app\events" | Out-Null
New-Item -ItemType Directory -Force -Path "src\app\templates" | Out-Null
New-Item -ItemType Directory -Force -Path "src\app\editor" | Out-Null
New-Item -ItemType Directory -Force -Path "src\app\admin" | Out-Null
New-Item -ItemType Directory -Force -Path "src\app\api\auth" | Out-Null
New-Item -ItemType Directory -Force -Path "src\app\api\events" | Out-Null
New-Item -ItemType Directory -Force -Path "src\app\api\templates" | Out-Null
New-Item -ItemType Directory -Force -Path "src\app\api\results" | Out-Null
New-Item -ItemType Directory -Force -Path "src\app\api\posters" | Out-Null
New-Item -ItemType Directory -Force -Path "src\app\api\upload" | Out-Null
New-Item -ItemType Directory -Force -Path "src\components\layout" | Out-Null
New-Item -ItemType Directory -Force -Path "src\components\forms" | Out-Null
New-Item -ItemType Directory -Force -Path "src\components\editor" | Out-Null
New-Item -ItemType Directory -Force -Path "src\components\dashboard" | Out-Null
New-Item -ItemType Directory -Force -Path "src\components\common" | Out-Null
New-Item -ItemType Directory -Force -Path "src\lib" | Out-Null
New-Item -ItemType Directory -Force -Path "src\styles" | Out-Null
New-Item -ItemType Directory -Force -Path "prisma" | Out-Null
New-Item -ItemType Directory -Force -Path "public\images" | Out-Null
New-Item -ItemType Directory -Force -Path "public\fonts" | Out-Null
```

**For macOS/Linux bash:**
```bash
mkdir -p src/app/{(auth)/{login,signup,forgot-password},dashboard,events,templates,editor,admin,api/{auth,events,templates,results,posters,upload}}
mkdir -p src/components/{layout,forms,editor,dashboard,common}
mkdir -p src/lib
mkdir -p src/styles
mkdir -p prisma
mkdir -p public/{images,fonts}
```

### Step 3: Move Configuration Files

```bash
# Move schema.prisma to prisma directory
mv schema.prisma prisma/schema.prisma

# Move globals.css to styles directory
mv globals.css src/styles/globals.css
```

### Step 4: Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/postergen"

# NextAuth
NEXTAUTH_SECRET="generate-a-random-secret"
NEXTAUTH_URL="http://localhost:3000"

# Supabase (if using)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# JWT
JWT_SECRET="generate-a-random-secret"

# OpenAI (for AI features)
OPENAI_API_KEY="your-api-key"
```

### Step 5: Setup Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

You'll be prompted to name your migration. Enter something like "init".

### Step 6: Create Core Files

Copy the code from `COMPLETE_CODE.md` and create the following files:

**Essential files to create first:**
1. `src/app/layout.tsx` - Root layout
2. `src/app/page.tsx` - Landing page
3. `src/app/globals.css` - Copy from provided globals.css
4. `src/lib/auth.ts` - Authentication utilities
5. `src/lib/db.ts` - Database connection
6. `src/lib/utils.ts` - Utility functions
7. `src/components/common/Button.tsx` - Button component
8. `src/components/common/Input.tsx` - Input component
9. `src/components/forms/LoginForm.tsx` - Login form
10. `src/app/api/auth/login/route.ts` - Login API

### Step 7: Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
PosterGen/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── lib/                 # Utilities and helpers
│   └── styles/              # CSS files
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Migration files
├── public/                  # Static assets
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── next.config.js           # Next.js config
├── tailwind.config.js       # Tailwind config
├── postcss.config.js        # PostCSS config
├── .env.example             # Environment template
└── README.md                # Project README
```

## Development Workflow

### Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (GUI)
```

### Code Organization

- **Pages**: `src/app/[route]/page.tsx`
- **API Routes**: `src/app/api/[route]/route.ts`
- **Components**: `src/components/[category]/ComponentName.tsx`
- **Utils**: `src/lib/[utility].ts`

## Features Checklist

### Phase 1: MVP (Current)
- [ ] Authentication (signup, login, logout)
- [ ] Event Management (CRUD)
- [ ] Team & Category Management
- [ ] Result Data Entry
- [ ] Template Editor
- [ ] Poster Generation
- [ ] Dashboard

### Phase 2: Enhancement
- [ ] Bulk import/export
- [ ] AI features
- [ ] Public template library
- [ ] Advanced admin panel

### Phase 3: Advanced
- [ ] Collaboration
- [ ] Subscriptions
- [ ] Brand Kit
- [ ] Mobile app

## Database Schema Overview

**Key Tables:**
- `users` - User accounts with roles
- `events` - Events with metadata
- `teams` - Teams in events
- `categories` - Event categories
- `programs` - Programs in events
- `results` - Results and rankings
- `templates` - Poster templates
- `generated_posters` - History of generated posters
- `activity_logs` - User activity tracking

## Common Tasks

### Adding a New API Route

1. Create file: `src/app/api/[resource]/route.ts`
2. Import database: `import { db } from '@/lib/db'`
3. Implement HTTP methods (GET, POST, PUT, DELETE)
4. Use Prisma for database operations
5. Return JSON responses

### Adding a New Page

1. Create directory: `src/app/[route]`
2. Create file: `src/app/[route]/page.tsx`
3. Export default React component
4. Use client-side features with 'use client' directive

### Adding a New Component

1. Create file: `src/components/[category]/ComponentName.tsx`
2. Use 'use client' for interactive components
3. Export named component
4. Use TypeScript interfaces for props

## Troubleshooting

### Database Connection Error
- Check `DATABASE_URL` in `.env.local`
- Ensure PostgreSQL is running
- Run `npm run prisma:migrate`

### Module Not Found
- Run `npm install` to install dependencies
- Run `npm run prisma:generate` to generate Prisma client
- Check import paths use `@/` alias

### Port Already in Use
- Default port is 3000
- Change with: `npm run dev -- -p 3001`

## Next Steps

1. Create all necessary directories
2. Set up environment variables
3. Install dependencies
4. Run database migrations
5. Copy code from COMPLETE_CODE.md
6. Start development server
7. Build features incrementally

For detailed code examples, see `COMPLETE_CODE.md`.

## Support

- **Documentation**: See README.md and SETUP_GUIDE.md
- **Code Templates**: See COMPLETE_CODE.md
- **GitHub**: Check repository for issues and discussions

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Fabric.js Documentation](http://fabricjs.com/)
