# CV Builder - AI-Powered Resume & Cover Letter Platform

A production-ready SaaS platform that helps job seekers create professional, AI-customized CVs and cover letters tailored to specific job descriptions.

## 🚀 Quick Start

```bash
# Install all dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your credentials

# Setup database
cd backend
npx prisma generate
npx prisma migrate dev
npx prisma db seed
cd ..

# Start development servers
npm run dev
```

## 📁 Project Structure

```
cv-builder/
├── frontend/         # Next.js 14 frontend (port 3000)
├── backend/          # Express.js API server (port 3001)
├── shared/           # Shared TypeScript types & validations
├── ARCHITECTURE.md   # System architecture documentation
├── FEATURE_TRACKER.md # Feature completion tracking
└── package.json      # Monorepo configuration
```

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| AI Customization | GPT-4/Claude/Gemini powered CV tailoring |
| Job Scraping | Extract job details from LinkedIn, Indeed, Glassdoor |
| Multiple Templates | Professional CV designs |
| ATS Optimization | Keyword optimization for ATS systems |
| PDF Generation | Instant high-quality PDF downloads |
| Credit System | Pay-as-you-go pricing |
| Admin Dashboard | Complete platform management |

## 🔧 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Node.js, Express, TypeScript, Prisma
- **Database**: PostgreSQL
- **AI**: OpenAI, Anthropic Claude, Google Gemini
- **Payments**: Stripe
- **Email**: Resend

## 📚 Documentation

- [Architecture Guide](./ARCHITECTURE.md)
- [Feature Tracker](./FEATURE_TRACKER.md)
- [API Documentation](./backend/README.md)
- [Frontend Guide](./frontend/README.md)

## 🔐 Default Credentials

After seeding the database:
- **Admin**: admin@cvbuilder.com / admin123456
- **Test User**: user@example.com / user123456

## 📄 License

MIT License
