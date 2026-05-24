# 🚀 RUN POSTERGEN - COMPLETE SETUP GUIDE

## Quick Start (3 Steps)

### Step 1: Create Directories
Copy and run this in Command Prompt (Windows):

```cmd
@echo off
md src\app\api\auth 2>nul
md src\app\api\events 2>nul
md src\app\api\templates 2>nul
md src\app\api\results 2>nul
md src\app\api\posters 2>nul
md src\app\(auth)\login 2>nul
md src\app\(auth)\signup 2>nul
md src\app\dashboard 2>nul
md src\app\events 2>nul
md src\app\templates 2>nul
md src\app\editor 2>nul
md src\app\admin 2>nul
md src\components\layout 2>nul
md src\components\forms 2>nul
md src\components\editor 2>nul
md src\components\dashboard 2>nul
md src\components\common 2>nul
md src\lib 2>nul
md src\styles 2>nul
md prisma 2>nul
md public\images 2>nul
echo Directories created!
```

### Step 2: Create Core App Files

#### File 1: src/app/layout.tsx
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

#### File 2: src/app/page.tsx
```typescript
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">PosterGen</div>
          <div className="space-x-4">
            <button className="text-gray-700 hover:text-gray-900">Home</button>
            <button className="text-gray-700 hover:text-gray-900">Features</button>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-20 text-center text-white">
        <h1 className="text-5xl font-bold mb-6">Create Professional Event Posters</h1>
        <p className="text-xl mb-8 text-blue-100">
          Design beautiful posters instantly with our visual editor
        </p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100">
          Get Started
        </button>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-lg text-gray-800">
            <h3 className="text-xl font-bold mb-3">Visual Editor</h3>
            <p>Drag and drop to create stunning posters</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg text-gray-800">
            <h3 className="text-xl font-bold mb-3">Instant Export</h3>
            <p>Download as PNG, JPG, or PDF</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg text-gray-800">
            <h3 className="text-xl font-bold mb-3">Data Mapping</h3>
            <p>Automatically fill poster data from events</p>
          </div>
        </div>
      </main>
    </div>
  );
}
```

#### File 3: src/styles/globals.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  @apply box-border;
}

html {
  scroll-behavior: smooth;
}

body {
  @apply bg-gray-50 text-gray-900;
}

@layer components {
  .form-input {
    @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition;
  }

  .btn {
    @apply px-4 py-2 rounded-lg font-medium transition-colors;
  }

  .btn-primary {
    @apply bg-blue-600 text-white hover:bg-blue-700;
  }
}
```

#### File 4: prisma/schema.prisma
(Already created - just verify it's in prisma/ folder)

### Step 3: Run the App

```bash
cd "C:\Users\Admin\OneDrive\文档\web\PosterGen"
npm install
npm run dev
```

Visit: **http://localhost:3000**

---

## Detailed Manual File Creation

If automatic file creation doesn't work, create files manually:

1. **Open VS Code**
2. **Open folder**: PosterGen
3. **Create files** in left sidebar:
   - New File: `src/app/layout.tsx` → paste content from File 1
   - New File: `src/app/page.tsx` → paste content from File 2
   - New File: `src/styles/globals.css` → paste content from File 3

---

## Installation Commands (Copy-Paste)

```bash
# Navigate to project
cd "C:\Users\Admin\OneDrive\文档\web\PosterGen"

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Start development server
npm run dev
```

---

## What You'll See

When running `npm run dev`, you should see:

```
▲ Next.js 14.2.3
- Local:        http://localhost:3000

✓ Ready in 2.5s
```

Then automatically opens http://localhost:3000 in your browser.

The page shows:
- ✅ PosterGen header with navigation
- ✅ Large heading: "Create Professional Event Posters"
- ✅ Get Started button
- ✅ Three feature cards below

---

## If You Get Errors

### "Cannot find module 'next'"
```bash
npm install
```

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### Module not found errors
```bash
npm run prisma:generate
```

### "No such file or directory"
- Make sure directories were created
- Check file names have `.tsx` extension (not `.txt`)

---

## Stop the App

Press: **Ctrl + C** in terminal

---

## After Landing Page Works

1. Copy more pages from `COMPLETE_CODE.md`
2. Create API routes
3. Setup database
4. Build features

See `COMPLETE_CODE.md` for more code examples.

---

## Full Command Sequence to Run

```bash
# 1. Go to project folder
cd C:\Users\Admin\OneDrive\文档\web\PosterGen

# 2. Install packages
npm install

# 3. Generate Prisma
npm run prisma:generate

# 4. Start development
npm run dev

# 5. Open browser to http://localhost:3000
```

That's it! Your app is running! 🚀
