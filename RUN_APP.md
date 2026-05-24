# 🚀 POSTERGEN - HOW TO RUN

This guide will help you get PosterGen running on your machine in minutes.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL running locally (or Supabase account)
- A code editor (VS Code recommended)

## Step 1: Create Directory Structure

### Option A: Windows Command Prompt (Copy & Paste)
```cmd
md src\app\api\auth
md src\app\api\events
md src\app\api\templates
md src\app\api\results
md src\app\api\posters
md src\app\(auth)\login
md src\app\(auth)\signup
md src\app\dashboard
md src\app\events
md src\app\templates
md src\app\editor
md src\app\admin
md src\components\layout
md src\components\forms
md src\components\editor
md src\components\dashboard
md src\components\common
md src\lib
md src\styles
md prisma
md public\images
```

### Option B: Windows PowerShell
```powershell
$dirs = @(
    "src/app/api/auth",
    "src/app/api/events",
    "src/app/api/templates",
    "src/app/api/results",
    "src/app/api/posters",
    "src/app/(auth)/login",
    "src/app/(auth)/signup",
    "src/app/dashboard",
    "src/app/events",
    "src/app/templates",
    "src/app/editor",
    "src/app/admin",
    "src/components/layout",
    "src/components/forms",
    "src/components/editor",
    "src/components/dashboard",
    "src/components/common",
    "src/lib",
    "src/styles",
    "prisma",
    "public/images"
)
$dirs | ForEach-Object { New-Item -ItemType Directory -Force -Path $_ | Out-Null }
```

### Option C: Git Bash (Linux/Mac style)
```bash
mkdir -p src/app/api/{auth,events,templates,results,posters}
mkdir -p src/app/{(auth)/{login,signup},dashboard,events,templates,editor,admin}
mkdir -p src/components/{layout,forms,editor,dashboard,common}
mkdir -p src/{lib,styles}
mkdir -p prisma
mkdir -p public/images
```

## Step 2: Create Essential Files

### Move existing files:
```bash
# Move schema.prisma to prisma folder
move schema.prisma prisma\schema.prisma

# Move globals.css to src/styles folder  
move globals.css src\styles\globals.css
```

### Create src/app/layout.tsx
```typescript
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PosterGen - Event Poster Generator',
  description: 'Create professional event posters instantly',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
```

Create file: `src/app/layout.tsx` with content above.

### Create src/app/page.tsx
```typescript
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">PosterGen</div>
          <div className="space-x-4">
            <Link href="/" className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <a href="#features" className="text-gray-700 hover:text-gray-900">
              Features
            </a>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Create Professional Event Posters</h1>
          <p className="text-xl mb-8 text-blue-100">
            Design beautiful posters instantly with our visual editor
          </p>
          <div className="space-x-4">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100">
              Get Started
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700">
              Learn More
            </button>
          </div>
        </div>

        <div id="features" className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Visual Editor</h3>
            <p className="text-gray-600">Drag and drop to create stunning posters without design experience</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Instant Export</h3>
            <p className="text-gray-600">Download as PNG, JPG, or PDF in high quality for print and social media</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Data Mapping</h3>
            <p className="text-gray-600">Automatically fill poster data from your event results and team standings</p>
          </div>
        </div>
      </main>
    </div>
  );
}
```

Create file: `src/app/page.tsx` with content above.

## Step 3: Copy globals.css

The file `globals.css` already exists in the root. Move it to `src/styles/globals.css`:

```bash
move globals.css src\styles\globals.css
```

Then update `src/app/layout.tsx` to import from styles:
```typescript
import '../styles/globals.css';
```

## Step 4: Install Dependencies

```bash
npm install
```

This will install all packages listed in package.json (takes 2-5 minutes on first install).

## Step 5: Setup Prisma

```bash
npm run prisma:generate
```

This generates the Prisma client from schema.prisma.

## Step 6: Configure Environment (Optional for now)

Create or edit `.env.local`:

```env
# For basic testing, you can skip this
# DATABASE_URL is not needed for the landing page

# Add these only when implementing features:
# DATABASE_URL="postgresql://user:password@localhost:5432/postergen"
# JWT_SECRET="your-secret-key"
```

## Step 7: Start Development Server

```bash
npm run dev
```

You should see:
```
▲ Next.js 14.2.3
- Local:        http://localhost:3000
```

## Step 8: Open in Browser

Visit: **http://localhost:3000**

You should see the PosterGen landing page! 🎉

---

## What's Running

✅ Next.js development server
✅ Hot reload enabled (changes appear automatically)
✅ Landing page with features overview
✅ Ready for further development

## Next Steps (After Landing Page Works)

1. Create more pages from `COMPLETE_CODE.md`
2. Setup database connection
3. Implement authentication
4. Build event management
5. Create template editor
6. Generate posters

## Common Issues

### Port 3000 Already in Use
```bash
npm run dev -- -p 3001
```

### Module Not Found
```bash
npm install
npm run prisma:generate
```

### Build Errors
- Check for TypeScript errors
- Clear `.next` cache: `rm -rf .next`
- Reinstall: `rm -rf node_modules && npm install`

## Commands Reference

```bash
npm run dev              # Start development (http://localhost:3000)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations (when DB configured)
```

## That's It!

Your PosterGen app is now running! 🚀

### Next: Create More Pages

Copy examples from `COMPLETE_CODE.md`:
- Authentication pages
- Event management pages
- Template pages
- Admin pages

Refer to `COMPLETE_CODE.md` for full implementation code.
