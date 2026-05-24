# START HERE: Run PosterGen in 5 Minutes

## 📋 Copy-Paste Setup (3 Steps)

### Step 1: Create Directories (Run in Windows Command Prompt)

```batch
cd C:\Users\Admin\OneDrive\文档\web\PosterGen

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

### Step 2: Create Files

**USE VS CODE:**
1. Open PosterGen folder in VS Code
2. Right-click in explorer → New File
3. Create these files with exact names:
   - `src/app/layout.tsx`
   - `src/app/page.tsx`
   - `src/styles/globals.css`

**File Contents Below** ↓

---

## 📄 File: src/app/layout.tsx

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

---

## 📄 File: src/app/page.tsx

```typescript
'use client';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">🎨 PosterGen</div>
          <div className="space-x-4">
            <span className="text-gray-700">Event Poster Generator</span>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center text-white mb-20">
          <h1 className="text-5xl font-bold mb-6">Create Professional Event Posters</h1>
          <p className="text-xl mb-8 text-blue-100">
            Design beautiful posters instantly with our visual editor
          </p>
          <button 
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
            onClick={() => alert('Get Started - Coming Soon!')}
          >
            Get Started Free
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-3xl mb-3">✏️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Visual Editor</h3>
            <p className="text-gray-600">Drag and drop interface to create stunning posters without design experience</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-3xl mb-3">💾</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Instant Export</h3>
            <p className="text-gray-600">Download as PNG, JPG, or PDF in high quality for print and social media</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-3xl mb-3">🔗</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Data Mapping</h3>
            <p className="text-gray-600">Automatically fill poster data from your event results and team standings</p>
          </div>
        </div>

        <div className="mt-20 bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Features</h2>
          <ul className="grid md:grid-cols-2 gap-4 text-gray-700">
            <li className="flex items-center"><span className="text-green-500 mr-3">✓</span> Event Management</li>
            <li className="flex items-center"><span className="text-green-500 mr-3">✓</span> Team Standings</li>
            <li className="flex items-center"><span className="text-green-500 mr-3">✓</span> Result Entry</li>
            <li className="flex items-center"><span className="text-green-500 mr-3">✓</span> Program Results</li>
            <li className="flex items-center"><span className="text-green-500 mr-3">✓</span> Template Templates</li>
            <li className="flex items-center"><span className="text-green-500 mr-3">✓</span> Poster Generation</li>
            <li className="flex items-center"><span className="text-green-500 mr-3">✓</span> High-Quality Export</li>
            <li className="flex items-center"><span className="text-green-500 mr-3">✓</span> User Authentication</li>
          </ul>
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p className="mb-2">Built with Next.js 14 • React • TypeScript • Tailwind CSS</p>
          <p>🚀 Ready for production development</p>
        </div>
      </main>
    </div>
  );
}
```

---

## 📄 File: src/styles/globals.css

(Already exists in root, but here's the content for reference)

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

---

## Step 3: Run in Terminal

```bash
# Navigate to project
cd "C:\Users\Admin\OneDrive\文档\web\PosterGen"

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

**Then open browser to: http://localhost:3000**

---

## ✅ Success Indicators

You should see:
- ✅ Landing page with PosterGen header
- ✅ Blue gradient background
- ✅ "Create Professional Event Posters" heading
- ✅ Get Started button
- ✅ Three feature cards
- ✅ Features list

---

## 🛑 Troubleshooting

### "npm: command not found"
- Node.js not installed
- Download from: https://nodejs.org/ (v18+)
- Restart terminal after install

### Port 3000 in use
```bash
npm run dev -- -p 3001
```

### Module errors
```bash
npm install
npm run prisma:generate
```

### Files not created
- Use VS Code to create files
- Or copy/paste into text editor
- Save with exact filenames

---

## 🚀 Next Steps (After Landing Page Works)

1. Create more pages from `COMPLETE_CODE.md`
2. Add authentication
3. Build event management
4. Create template editor
5. Add poster generation

---

## 📚 References

- `COMPLETE_CODE.md` - All code examples
- `QUICKSTART.md` - Fast setup
- `POSTERGEN_SUMMARY.md` - Full overview
- `INDEX.md` - Find anything

---

**Your PosterGen app is now running!** 🎉
