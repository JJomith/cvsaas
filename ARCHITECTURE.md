# CV/Resume/Cover Letter AI Customization Platform

## 📋 Project Overview

A SaaS platform that enables job seekers to create AI-powered, customized CVs and cover letters tailored to specific job descriptions. The platform offers pay-as-you-go pricing, multiple professional templates, and ATS optimization.

**Last Updated:** January 21, 2026

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (Next.js 14)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Landing &   │  │   User       │  │   CV/Letter  │  │    Admin     │    │
│  │  Marketing   │  │  Dashboard   │  │   Builder    │  │  Dashboard   │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND (Node.js/Express)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │     Auth     │  │   AI Service │  │    PDF       │  │   Payment    │    │
│  │   Service    │  │   Gateway    │  │  Generator   │  │   Service    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │    User      │  │   Template   │  │  Job Parser  │  │    Admin     │    │
│  │   Profile    │  │   Manager    │  │   Service    │  │   Service    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                      │
│  │   LinkedIn   │  │    Email     │  │     ATS      │                      │
│  │   Import     │  │   Service    │  │  Optimizer   │                      │
│  └──────────────┘  └──────────────┘  └──────────────┘                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
            ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
            │  PostgreSQL  │  │    Redis     │  │   AWS S3/    │
            │   Database   │  │    Cache     │  │   Storage    │
            └──────────────┘  └──────────────┘  └──────────────┘
                                      │
                                      ▼
            ┌─────────────────────────────────────────────────┐
            │              AI Service Integrations            │
            │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌───────┐ │
            │  │ OpenAI  │ │ Claude  │ │ Gemini  │ │ Custom│ │
            │  │  GPT-4  │ │   API   │ │   API   │ │  LLM  │ │
            │  └─────────┘ └─────────┘ └─────────┘ └───────┘ │
            └─────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS, Shadcn/UI |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | PostgreSQL with Prisma ORM |
| **Cache** | Redis |
| **Auth** | NextAuth.js (JWT + OAuth) |
| **Payments** | Stripe |
| **PDF Generation** | Puppeteer / React-PDF |
| **File Storage** | AWS S3 / Cloudflare R2 |
| **AI Integration** | OpenAI, Anthropic, Google AI SDKs |
| **Email** | Resend / SendGrid |
| **Job Scraping** | Cheerio, Puppeteer |
| **Deployment** | Vercel (Frontend) + Railway/Render (Backend) |

---

## 📁 Project Structure

```
cv-builder/
├── frontend/                    # Next.js 14 application
│   ├── app/
│   │   ├── (marketing)/        # Landing, pricing, about pages
│   │   ├── (auth)/             # Login, register, forgot password
│   │   ├── (dashboard)/        # User dashboard pages
│   │   ├── (admin)/            # Admin dashboard pages
│   │   ├── builder/            # CV/Cover letter builder
│   │   └── api/                # Next.js API routes
│   ├── components/
│   │   ├── ui/                 # Shadcn UI components
│   │   ├── cv-templates/       # CV template components
│   │   ├── cover-letter/       # Cover letter templates
│   │   ├── forms/              # Form components
│   │   ├── layout/             # Layout components
│   │   └── shared/             # Shared components
│   ├── lib/
│   │   ├── api.ts              # API client
│   │   ├── auth.ts             # Auth utilities
│   │   ├── utils.ts            # Helper functions
│   │   └── validations.ts      # Zod schemas
│   ├── hooks/                  # Custom React hooks
│   ├── store/                  # Zustand state management
│   ├── types/                  # TypeScript types
│   └── styles/                 # Global styles
│
├── backend/                     # Express API server
│   ├── src/
│   │   ├── config/             # Configuration files
│   │   ├── controllers/        # Route controllers
│   │   ├── services/           # Business logic
│   │   │   ├── ai/             # AI provider services
│   │   │   ├── pdf/            # PDF generation
│   │   │   ├── email/          # Email service
│   │   │   ├── scraper/        # Job URL scraper
│   │   │   └── linkedin/       # LinkedIn import
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # Express middleware
│   │   ├── utils/              # Utility functions
│   │   └── types/              # TypeScript types
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   ├── migrations/         # Database migrations
│   │   └── seed.ts             # Seed data
│   └── tests/                  # API tests
│
├── shared/                      # Shared code between frontend/backend
│   ├── types/                  # Shared TypeScript types
│   ├── constants/              # Shared constants
│   └── validations/            # Shared validation schemas
│
├── docs/                        # Documentation
│   └── api/                    # API documentation
│
├── docker-compose.yml          # Docker configuration
├── .env.example                # Environment variables example
└── README.md                   # Project README
```

---

## 🗃️ Database Schema

```
┌─────────────────┐
│      User       │
├─────────────────┤
│ id              │
│ email           │
│ password        │
│ name            │
│ role            │──────────────────────────────────┐
│ emailVerified   │                                  │
│ image           │                                  │
│ createdAt       │                                  │
│ updatedAt       │                                  │
└────────┬────────┘                                  │
         │                                           │
         │ 1:1                                       │
         ▼                                           │
┌─────────────────┐                                  │
│    Profile      │                                  │
├─────────────────┤                                  │
│ id              │                                  │
│ userId          │                                  │
│ headline        │                                  │
│ summary         │                                  │
│ phone           │                                  │
│ location        │                                  │
│ website         │                                  │
│ linkedinUrl     │                                  │
│ githubUrl       │                                  │
└────────┬────────┘                                  │
         │                                           │
         │ 1:N                                       │
         ▼                                           │
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Experience    │  │   Education     │  │     Skill       │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ id              │  │ id              │  │ id              │
│ profileId       │  │ profileId       │  │ profileId       │
│ company         │  │ institution     │  │ name            │
│ title           │  │ degree          │  │ level           │
│ location        │  │ field           │  │ category        │
│ startDate       │  │ startDate       │  └─────────────────┘
│ endDate         │  │ endDate         │
│ current         │  │ gpa             │  ┌─────────────────┐
│ description     │  │ description     │  │    Project      │
│ achievements    │  └─────────────────┘  ├─────────────────┤
└─────────────────┘                       │ id              │
                                          │ profileId       │
┌─────────────────┐  ┌─────────────────┐  │ name            │
│  Certification  │  │    Language     │  │ description     │
├─────────────────┤  ├─────────────────┤  │ technologies    │
│ id              │  │ id              │  │ url             │
│ profileId       │  │ profileId       │  │ startDate       │
│ name            │  │ name            │  │ endDate         │
│ issuer          │  │ proficiency     │  └─────────────────┘
│ issueDate       │  └─────────────────┘
│ expiryDate      │
│ credentialId    │
│ url             │
└─────────────────┘

┌─────────────────┐
│    Document     │
├─────────────────┤
│ id              │
│ userId          │◀──────────────────────────────────┘
│ type            │ (CV / COVER_LETTER)
│ name            │
│ templateId      │
│ content         │ (JSON)
│ jobDescription  │
│ jobUrl          │
│ atsScore        │
│ createdAt       │
│ updatedAt       │
└────────┬────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│ DocumentVersion │
├─────────────────┤
│ id              │
│ documentId      │
│ version         │
│ content         │
│ pdfUrl          │
│ createdAt       │
└─────────────────┘

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│    Template     │  │   CreditPack    │  │  UserCredits    │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ id              │  │ id              │  │ id              │
│ name            │  │ name            │  │ userId          │
│ type            │  │ credits         │  │ balance         │
│ thumbnail       │  │ price           │  │ totalPurchased  │
│ content         │  │ active          │  │ totalUsed       │
│ isPremium       │  │ popular         │  │ updatedAt       │
│ active          │  └─────────────────┘  └─────────────────┘
└─────────────────┘

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│    Payment      │  │  CreditUsage    │  │   PromoCode     │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ id              │  │ id              │  │ id              │
│ userId          │  │ userId          │  │ code            │
│ amount          │  │ credits         │  │ credits         │
│ currency        │  │ action          │  │ discount        │
│ status          │  │ documentId      │  │ maxUses         │
│ stripePaymentId │  │ createdAt       │  │ usedCount       │
│ creditPackId    │  └─────────────────┘  │ expiresAt       │
│ createdAt       │                       │ active          │
└─────────────────┘                       └─────────────────┘

┌─────────────────┐  ┌─────────────────┐
│   AIProvider    │  │  SystemConfig   │
├─────────────────┤  ├─────────────────┤
│ id              │  │ id              │
│ name            │  │ key             │
│ type            │  │ value           │
│ apiKey          │  │ description     │
│ model           │  │ updatedAt       │
│ isActive        │  └─────────────────┘
│ isPrimary       │
│ costPerToken    │
│ maxTokens       │
│ createdAt       │
└─────────────────┘
```

---

## 🎨 CV Template Options

| Template | Style | Best For |
|----------|-------|----------|
| **Modern Minimal** | Clean, single-column, lots of whitespace | Tech, Startups |
| **Professional Classic** | Traditional two-column | Corporate, Finance |
| **Creative Bold** | Accent colors, unique layout | Design, Marketing |
| **Tech Focused** | GitHub-style, skill badges | Developers, Engineers |
| **Executive** | Elegant, sophisticated | Senior/C-level |
| **Academic** | Publications, research focus | Research, Education |

---

## 💰 Default Pricing Model (Admin Configurable)

| Tier | Credits | Price | Features |
|------|---------|-------|----------|
| **Free** | 3 credits | $0 | Basic templates, watermark |
| **Starter** | 25 credits | $9.99 | All templates, no watermark |
| **Pro** | 100 credits | $29.99 | Priority AI, version history |
| **Unlimited** | Unlimited | $49.99/mo | Everything + API access |

### Credit Usage
- AI CV Generation: 1 credit
- AI Cover Letter: 1 credit
- ATS Optimization Check: 0.5 credits
- PDF Download: Free

---

## 📧 Email Notifications

| Event | Description |
|-------|-------------|
| Welcome Email | Sent after registration |
| Email Verification | Verify email address |
| Password Reset | Password reset link |
| Low Credits Warning | When credits below threshold |
| Purchase Confirmation | After successful payment |
| Document Ready | When AI generation completes |
| Weekly Summary | Optional usage summary |

---

## 🔐 API Endpoints Overview

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/linkedin` - LinkedIn OAuth
- `GET /api/auth/google` - Google OAuth

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/import/linkedin` - Import from LinkedIn
- `POST /api/profile/import/resume` - Import from uploaded resume

### Documents
- `GET /api/documents` - List user documents
- `POST /api/documents` - Create new document
- `GET /api/documents/:id` - Get document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document
- `GET /api/documents/:id/versions` - Get version history
- `POST /api/documents/:id/download` - Generate PDF

### AI Services
- `POST /api/ai/generate-cv` - Generate CV content
- `POST /api/ai/generate-cover-letter` - Generate cover letter
- `POST /api/ai/optimize-ats` - Optimize for ATS
- `POST /api/ai/analyze-job` - Analyze job description

### Job Scraping
- `POST /api/jobs/scrape` - Scrape job from URL
- `POST /api/jobs/parse` - Parse pasted job description

### Payments
- `GET /api/credits` - Get user credits
- `GET /api/credits/packs` - Get available credit packs
- `POST /api/payments/create-checkout` - Create Stripe checkout
- `POST /api/payments/webhook` - Stripe webhook
- `POST /api/promo/redeem` - Redeem promo code

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - List users
- `PUT /api/admin/users/:id` - Update user
- `POST /api/admin/users/:id/credits` - Grant credits
- `GET /api/admin/templates` - List templates
- `POST /api/admin/templates` - Create template
- `PUT /api/admin/templates/:id` - Update template
- `GET /api/admin/ai-providers` - List AI providers
- `POST /api/admin/ai-providers` - Add AI provider
- `PUT /api/admin/ai-providers/:id` - Update AI provider
- `GET /api/admin/pricing` - Get pricing config
- `PUT /api/admin/pricing` - Update pricing
- `GET /api/admin/promo-codes` - List promo codes
- `POST /api/admin/promo-codes` - Create promo code
- `GET /api/admin/analytics` - Get analytics

---
