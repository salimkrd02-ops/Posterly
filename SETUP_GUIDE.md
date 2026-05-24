# PosterGen - Complete Project Setup Guide

## Project Structure to Create

```
PosterGen/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── (auth)/
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── signup/
│   │   │   │   └── page.tsx
│   │   │   └── forgot-password/
│   │   │       └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── events/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── templates/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── editor/
│   │   │   └── [templateId]/
│   │   │       └── page.tsx
│   │   ├── admin/
│   │   │   ├── page.tsx
│   │   │   ├── users/
│   │   │   └── reports/
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── signup/route.ts
│   │       │   ├── login/route.ts
│   │       │   ├── logout/route.ts
│   │       │   ├── verify-email/route.ts
│   │       │   └── forgot-password/route.ts
│   │       ├── events/
│   │       │   └── route.ts (GET, POST, PUT, DELETE)
│   │       ├── templates/
│   │       │   └── route.ts (GET, POST, PUT, DELETE)
│   │       ├── results/
│   │       │   └── route.ts (GET, POST, PUT, DELETE)
│   │       ├── posters/
│   │       │   ├── generate/route.ts
│   │       │   └── route.ts
│   │       └── upload/
│   │           └── route.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── forms/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   ├── EventForm.tsx
│   │   │   └── ResultForm.tsx
│   │   ├── editor/
│   │   │   ├── CanvasEditor.tsx
│   │   │   ├── Toolbar.tsx
│   │   │   ├── PropertiesPanel.tsx
│   │   │   └── LayersPanel.tsx
│   │   ├── dashboard/
│   │   │   ├── StatsCard.tsx
│   │   │   ├── QuickActions.tsx
│   │   │   └── RecentActivity.tsx
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       └── Loading.tsx
│   ├── lib/
│   │   ├── auth.ts - JWT/Password utilities
│   │   ├── db.ts - Prisma client
│   │   ├── canvas.ts - Fabric.js utilities
│   │   ├── export.ts - Canvas export logic
│   │   └── utils.ts - General utilities
│   └── styles/
│       └── globals.css
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   ├── images/
│   └── fonts/
├── .env.example
├── .env.local
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Step 1: Initialize Project Files

Run the following commands to create the directory structure:

```bash
# Create main directories
mkdir -p src/app/{(auth)/{login,signup,forgot-password},dashboard,events,templates,editor,admin,api/{auth,events,templates,results,posters,upload}}
mkdir -p src/components/{layout,forms,editor,dashboard,common}
mkdir -p src/lib
mkdir -p src/styles
mkdir -p prisma
mkdir -p public/{images,fonts}
```

## Step 2: Copy Configuration Files

Already created:
- package.json ✓
- tsconfig.json ✓
- next.config.js ✓
- tailwind.config.js ✓
- postcss.config.js ✓
- .env.example ✓
- .env.local ✓
- README.md ✓
- globals.css ✓
- schema.prisma (should move to prisma/ directory)

## Step 3: Create Core Library Files

### src/lib/auth.ts
```typescript
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

export function generateToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
  } catch {
    return null;
  }
}
```

### src/lib/db.ts
```typescript
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const db = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
```

### src/lib/utils.ts
```typescript
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}
```

### src/lib/canvas.ts
```typescript
// Fabric.js utilities for canvas operations
import { Canvas, Object as FabricObject } from 'fabric';

export const canvasPresets = {
  instagram_square: { width: 1080, height: 1080 },
  instagram_story: { width: 1080, height: 1920 },
  facebook_post: { width: 1200, height: 628 },
  youtube_thumbnail: { width: 1280, height: 720 },
  a4_poster: { width: 2480, height: 3508 },
};

export interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'background';
  properties: Record<string, any>;
}

export function createCanvasInstance(
  container: HTMLCanvasElement,
  options: { width: number; height: number }
) {
  return new Canvas(container, {
    width: options.width,
    height: options.height,
    backgroundColor: '#ffffff',
  });
}

export function addTextElement(
  canvas: Canvas,
  text: string,
  options: Record<string, any>
) {
  const textObject = new FabricObject.Text(text, {
    left: options.left || 50,
    top: options.top || 50,
    fontSize: options.fontSize || 24,
    fill: options.fill || '#000000',
    ...options,
  });

  canvas.add(textObject);
  return textObject;
}

export function exportCanvasAsImage(
  canvas: Canvas,
  format: 'png' | 'jpg' = 'png'
): string {
  const dataUrl = canvas.toDataURL({ format });
  return dataUrl;
}
```

### src/lib/export.ts
```typescript
// Poster export utilities
export async function generatePNG(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
    }, 'image/png', 1.0);
  });
}

export async function generateJPG(canvas: HTMLCanvasElement, quality: number = 0.9): Promise<Blob> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
    }, 'image/jpeg', quality);
  });
}

export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
```

## Step 4: Create Layout Components

### src/app/layout.tsx
```typescript
import type { Metadata } from 'next';
import '../styles/globals.css';

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
      <body>{children}</body>
    </html>
  );
}
```

### src/app/page.tsx (Landing Page)
```typescript
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">PosterGen</div>
          <div className="space-x-4">
            <Link href="/login" className="text-gray-700 hover:text-gray-900">
              Login
            </Link>
            <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded">
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Create Professional Event Posters</h1>
          <p className="text-xl mb-8">Design beautiful posters instantly with our visual editor</p>
          <Link
            href="/signup"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100"
          >
            Get Started Free
          </Link>
        </div>
      </main>
    </div>
  );
}
```

## Step 5: Install Dependencies

```bash
npm install
```

## Step 6: Setup Database

```bash
npm run prisma:migrate
```

## Step 7: Start Development

```bash
npm run dev
```

Then visit `http://localhost:3000`

## Next Implementation Steps

1. Create authentication routes (signup, login, logout)
2. Build event management pages and APIs
3. Develop template editor with Fabric.js
4. Implement result data entry forms
5. Build poster generation pipeline
6. Create dashboard
7. Add admin panel

Each component should follow React best practices and use TypeScript for type safety.
