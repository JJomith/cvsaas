# CV Builder - AI-Powered Resume & Cover Letter Generator

A full-stack SaaS platform for creating AI-customized CVs and cover letters based on job descriptions.

## Features

- 🤖 **AI-Powered Customization** - Automatically tailor CVs and cover letters to job descriptions
- 🔗 **Job URL Scraping** - Extract job details from LinkedIn, Indeed, and Glassdoor
- 📄 **Multiple Templates** - Professional CV templates with customizable styling
- 📊 **ATS Optimization** - Keyword optimization for Applicant Tracking Systems
- 💳 **Credit-Based Pricing** - Pay-as-you-go with Stripe integration
- 👤 **Profile Management** - Store your experience, education, skills, and more
- 📥 **Instant PDF Download** - Generate and download professional PDFs
- 🔐 **Secure Authentication** - JWT-based auth with email verification
- 👨‍💼 **Admin Dashboard** - Manage users, templates, AI providers, and pricing

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Shadcn/UI
- React Query
- Zustand (State Management)

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL
- Prisma ORM
- Redis (Caching)

### Services
- OpenAI / Anthropic Claude / Google Gemini (AI)
- Stripe (Payments)
- Resend (Email)
- Puppeteer (PDF Generation & Scraping)

## Project Structure

```
cv-builder/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   └── lib/             # Utilities, API, stores
│   └── package.json
├── backend/                  # Express backend
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Auth, validation, errors
│   │   ├── routes/          # API routes
│   │   └── config/          # Configuration
│   ├── prisma/              # Database schema & migrations
│   └── package.json
├── shared/                   # Shared types & utilities
│   └── src/
│       ├── types/           # TypeScript types
│       ├── validations/     # Zod schemas
│       └── constants/       # Shared constants
└── package.json             # Monorepo root
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for caching)
- Stripe account
- OpenAI / Anthropic / Google AI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cv-builder.git
cd cv-builder
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example env file
cp .env.example .env

# Edit with your values
nano .env
```

4. Set up the database:
```bash
# Generate Prisma client
cd backend
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed
```

5. Start the development servers:
```bash
# From root directory
npm run dev
```

This starts:
- Frontend at http://localhost:3000
- Backend at http://localhost:3001

### Default Admin Account

After seeding, you can login with:
- Email: `admin@cvbuilder.com`
- Password: `admin123456`

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/experience` - Add experience
- `POST /api/profile/education` - Add education
- `POST /api/profile/skill` - Add skill

### Documents
- `GET /api/documents` - List documents
- `POST /api/documents/cv` - Generate CV
- `POST /api/documents/cover-letter` - Generate cover letter
- `GET /api/documents/:id/download` - Download PDF
- `POST /api/documents/:id/optimize-ats` - Optimize for ATS

### Jobs
- `POST /api/jobs/scrape` - Scrape job from URL
- `POST /api/jobs/parse` - Parse job description

### Payments
- `GET /api/payments/credits` - Get credit balance
- `POST /api/payments/checkout` - Create Stripe checkout
- `POST /api/payments/promo-code` - Apply promo code

### Admin (requires admin role)
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - List users
- `GET /api/admin/ai-providers` - List AI providers
- `PUT /api/admin/ai-providers/:id` - Update AI provider
- `POST /api/admin/templates` - Create template
- `POST /api/admin/promo-codes` - Create promo code

## Environment Variables

See `.env.example` for all required environment variables.

## Deployment

### Backend (Railway/Render)
1. Connect your repository
2. Set environment variables
3. Build command: `cd backend && npm run build`
4. Start command: `cd backend && npm start`

### Frontend (Vercel)
1. Import project
2. Set environment variables
3. Deploy

### Database (Supabase/Railway)
1. Create PostgreSQL database
2. Get connection string
3. Run migrations: `npx prisma migrate deploy`

## License

MIT License - see LICENSE file for details.

## Support

For support, email support@cvbuilder.com or open an issue on GitHub.
