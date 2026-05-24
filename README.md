# PosterGen - Event Poster Generation Platform

A modern, full-stack web application for creating professional event posters with dynamic data mapping and visual template editor.

## Features

### Core Features
- **User Authentication**: Signup, login, email verification, forgot password
- **Event Management**: Create and manage events with teams, categories, and programs
- **Template Editor**: Visual drag-and-drop editor with Fabric.js
- **Result Data Entry**: Enter program results and team standings with auto-ranking
- **Dynamic Poster Generation**: Map template fields to event data with real-time preview
- **Export**: Download posters as PNG, JPG, and PDF with watermark
- **Dashboard**: Overview of events, templates, and generated posters
- **Admin Panel**: Manage users, events, and templates

### Template Features
- Drag-and-drop elements (text, images, shapes, backgrounds)
- Resize, rotate, move, lock elements
- Layer management
- Alignment tools
- Canvas presets (Instagram, A4, etc.)
- Dynamic data field mapping
- Template saving and duplication

### Poster Types
- Program Result Posters (winners, scores, teams)
- Team Standing Posters (ranks, scores)
- Framed Posts (custom frames with photos)
- Custom Posters (blank canvas)

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Storage**: Supabase Storage
- **Canvas Editor**: Fabric.js
- **Export**: html2canvas, jsPDF
- **Authentication**: NextAuth.js
- **Validation**: Zod
- **Forms**: React Hook Form

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Supabase account (for storage)

### Installation

1. Clone the repository
```bash
git clone <repo-url>
cd PosterGen
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

4. Run database migrations
```bash
npm run prisma:migrate
```

5. Start development server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
PosterGen/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   └── forgot-password/
│   ├── dashboard/
│   ├── events/
│   ├── templates/
│   ├── editor/
│   ├── admin/
│   └── api/
│       ├── auth/
│       ├── events/
│       ├── templates/
│       ├── results/
│       ├── posters/
│       └── upload/
├── components/
│   ├── layout/
│   ├── forms/
│   ├── editor/
│   ├── dashboard/
│   └── common/
├── lib/
│   ├── db/
│   ├── auth/
│   ├── canvas/
│   ├── export/
│   └── utils/
├── styles/
│   └── globals.css
├── prisma/
│   └── schema.prisma
└── public/
```

## Database Schema

### Core Tables
- **users**: User accounts with roles
- **events**: Events with metadata
- **teams**: Teams participating in events
- **categories**: Event categories
- **programs**: Programs/items in events
- **results**: Results and rankings
- **templates**: Reusable poster templates
- **generated_posters**: History of generated posters
- **activity_logs**: User activity tracking

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/forgot-password` - Request password reset

### Events
- `GET /api/events` - List user events
- `POST /api/events` - Create event
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Templates
- `GET /api/templates` - List templates
- `POST /api/templates` - Create template
- `GET /api/templates/:id` - Get template
- `PUT /api/templates/:id` - Update template
- `DELETE /api/templates/:id` - Delete template

### Results
- `GET /api/results` - List results
- `POST /api/results` - Create result
- `PUT /api/results/:id` - Update result
- `DELETE /api/results/:id` - Delete result

### Posters
- `POST /api/posters/generate` - Generate poster
- `GET /api/posters` - List generated posters
- `GET /api/posters/:id/download` - Download poster

## Development

### Available Scripts
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio
```

## Features Roadmap

### Phase 1: MVP (Completed)
- ✅ Authentication
- ✅ Event management
- ✅ Template editor
- ✅ Result entry
- ✅ Poster generation
- ✅ Dashboard

### Phase 2: Enhancement
- ⏳ Bulk import/export
- ⏳ AI features (color palette, font pairing)
- ⏳ Public template library
- ⏳ Advanced admin panel

### Phase 3: Advanced
- ⏳ Collaboration features
- ⏳ Subscription system
- ⏳ Brand Kit
- ⏳ Mobile app
- ⏳ Advanced AI

## License

MIT

## Support

For issues and feature requests, please use the GitHub issue tracker.
