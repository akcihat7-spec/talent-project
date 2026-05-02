# Synthetic Talent Marketplace

A Next.js marketplace platform for synthetic AI talents and services, built with TypeScript, Tailwind CSS, and Supabase.

## Features

- 🎨 **Modern UI** - Built with Tailwind CSS for responsive, beautiful interfaces
- 🔐 **Authentication** - Secure user authentication with Supabase Auth
- 🛡️ **Route Protection** - Middleware-protected dashboard routes
- 🏪 **Marketplace** - Support for talents and clients with different roles
- 🤖 **Synthetic Talents** - AI-powered talent profiles with persona data
- 💼 **Job Management** - Complete job posting and hiring workflow
- 📊 **Database Schema** - Optimized PostgreSQL schema with RLS policies

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase project (create one at [supabase.com](https://supabase.com))

### 1. Clone and Install

```bash
git clone <repository-url>
cd windsurf-project
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase/schema.sql` in your Supabase SQL Editor
3. Get your project URL and anon key from Supabase Settings > API

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following main tables:

- **profiles**: User profiles with roles (talent/client)
- **synthetic_talents**: AI talent profiles with persona data
- **jobs**: Job postings by clients
- **hires**: Hiring relationships between talents and jobs

See `supabase/schema.sql` for the complete schema including RLS policies.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Protected dashboard
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   └── layout.tsx        # Root layout with AuthProvider
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── lib/                  # Utility libraries
│   └── supabase.ts       # Supabase client configuration
└── middleware.ts         # Route protection middleware
```

## Authentication Flow

1. Users sign up/login via `/signup` and `/login` pages
2. Middleware protects `/dashboard` routes
3. AuthContext provides authentication state throughout the app
4. Profiles are automatically created during signup

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

1. Update database schema in `supabase/schema.sql`
2. Add TypeScript types in `src/lib/supabase.ts`
3. Implement UI components with Tailwind CSS
4. Test authentication flow with middleware

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your Vercel account to the repository
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

Ensure your platform supports:
- Node.js 18+
- Environment variables
- Serverless functions (for API routes)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
