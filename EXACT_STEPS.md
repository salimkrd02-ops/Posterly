# 🎯 EXACT STEPS TO RUN POSTERGEN

## Copy & Paste These Commands

### Command 1: Navigate to Project Folder

```batch
cd /d C:\Users\Admin\OneDrive\文档\web\PosterGen
```

### Command 2: Create Directory Structure

```batch
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

echo ✓ Directories created successfully!
```

### Command 3: Create the Three Essential Files

Use Notepad or VS Code to create these files:

**File 1: src/app/layout.tsx**
```
Location: C:\Users\Admin\OneDrive\文档\web\PosterGen\src\app\layout.tsx

Content:
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

**File 2: src/app/page.tsx**
```
Location: C:\Users\Admin\OneDrive\文档\web\PosterGen\src\app\page.tsx

Content:
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
            onClick={() => alert('Get Started - Feature Coming Soon!')}
          >
            Get Started Free
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-3xl mb-3">✏️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Visual Editor</h3>
            <p className="text-gray-600">Drag and drop interface to create stunning posters</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-3xl mb-3">💾</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Instant Export</h3>
            <p className="text-gray-600">Download as PNG, JPG, or PDF in high quality</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-3xl mb-3">🔗</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Data Mapping</h3>
            <p className="text-gray-600">Automatically fill poster data from event results</p>
          </div>
        </div>

        <div className="mt-20 bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Features</h2>
          <ul className="grid md:grid-cols-2 gap-4 text-gray-700">
            <li className="flex items-center"><span className="text-green-500 mr-3">✓</span> Event Management</li>
            <li className="flex items-center"><span className="text-green-500 mr-3">✓</span> Team Standings</li>
            <li className="flex items-center"><span className="text-green-500 mr-3">✓</span> Result Entry</li>
            <li className="flex items-center"><span className="text-green-500 mr-3">✓</span> Program Results</li>
            <li className="flex items-center"><span className="text-green-500 mr-3">✓</span> Template Design</li>
            <li className="flex items-center"><span className="text-green-500 mr-3">✓</span> Poster Generation</li>
            <li className="flex items-center"><span className="text-green-500 mr-3">✓</span> High-Quality Export</li>
            <li className="flex items-center"><span className="text-green-500 mr-3">✓</span> User Authentication</li>
          </ul>
        </div>

        <footer className="mt-12 text-center text-white">
          <p>Built with Next.js 14 • React • TypeScript • Tailwind CSS</p>
          <p className="text-sm text-blue-100">🚀 Ready for production development</p>
        </footer>
      </main>
    </div>
  );
}
```

**File 3: src/styles/globals.css**
```
Location: C:\Users\Admin\OneDrive\文档\web\PosterGen\src\styles\globals.css

Content:
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

### Command 4: Install Dependencies

```batch
npm install
```

Wait for completion (2-5 minutes)

### Command 5: Generate Prisma Client

```batch
npm run prisma:generate
```

### Command 6: Start Development Server

```batch
npm run dev
```

You should see:
```
▲ Next.js 14.2.3
- Local:        http://localhost:3000

✓ Ready in 2.5s
```

### Command 7: Open in Browser

**Automatically opens http://localhost:3000**

Or manually visit: http://localhost:3000

---

## 🎉 What You'll See

✅ PosterGen landing page with:
- Blue gradient background
- Header with logo
- "Create Professional Event Posters" title
- Get Started button
- Three feature cards
- Features list
- Footer

---

## ⏱️ Total Time: ~10-15 minutes

- Directory creation: 1 min
- File creation: 3 min  
- npm install: 5-10 min
- Startup: 1 min
- **Total: ~10-15 min**

---

## 🛑 Stop the Server

Press **Ctrl + C** in terminal

---

## ✅ All Done!

Your PosterGen app is running! 🚀

Next step: See `COMPLETE_CODE.md` for more pages and features.

---

## 📝 For Easier File Creation

### Using VS Code (Recommended)

1. Open PosterGen folder in VS Code
2. Right-click explorer panel
3. Select "New File"
4. Name it (with path like `src/app/layout.tsx`)
5. Paste content from above sections
6. Save (Ctrl+S)
7. Repeat for other two files

### Using Notepad

1. Open Notepad
2. Paste content from section above
3. File → Save As
4. Name: `layout.tsx`
5. Type: All Files
6. Navigate to: `src\app\` folder
7. Save
8. Repeat for other files

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| "npm not found" | Install Node.js from nodejs.org |
| Port 3000 in use | Run: `npm run dev -- -p 3001` |
| Module not found | Run: `npm install && npm run prisma:generate` |
| File not found | Check filename and path are exact |

---

**Happy coding! 🎉**

See `COMPLETE_CODE.md` for more code to build out the full application.
