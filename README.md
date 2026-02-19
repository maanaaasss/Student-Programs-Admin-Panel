# Student Programs Admin Panel

A comprehensive admin panel for managing student programs, task submissions, certificates, redemptions, payouts, and referral tracking.

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Documentation](#-documentation)
- [Project Structure](#project-structure)
- [Components](#components)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## Features

- **Admin Authentication** - Secure login with JWT-based authentication
- **Dashboard** - Real-time statistics and activity overview
- **Task Validation** - Review and approve/reject student task submissions
- **Certificate Management** - Track, download, and email completion certificates
- **Redemption Management** - Handle student point redemption requests
- **Payout Tracking** - Monitor and manage student payouts
- **Referral Tracking** - Search and visualize referral networks
- **Email Notifications** - Automated certificate delivery via email

### Technical Highlights

- ✅ Modern Next.js 15 with App Router
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for responsive design
- ✅ Supabase for database and authentication
- ✅ Resend for email service
- ✅ Component-based architecture
- ✅ Clean, professional UI/UX

## Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (for database)
- Resend account (for email service)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/maanaaasss/Student-Programs-Admin-Panel
   cd Student-Programs-Admin-Panel
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.example` to `.env.local` and fill in your credentials:
   
   ```bash
   cp .env.example .env.local
   ```
   
   See **[Environment Variables Setup](./ENV_SETUP.md)** for detailed configuration.

4. **Set up the database**

   Follow the **[Database Setup Guide](./database/README.md)** to:
   - Create tables and relationships
   - Set up Row Level Security (RLS) policies
   - Seed demo data for testing
   
   ```bash
   # Execute the schema in your Supabase SQL editor
   # Located at: database/schema.sql
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Credentials

For testing purposes, use these credentials:

- **Email:** `admin@studentprograms.com`
- **Password:** `admin123`

> **Note:** After setting up the database, you can use the demo data in [database/DEMO-SETUP.md](./database/DEMO-SETUP.md) to populate your database with sample users, tasks, and submissions.

## Documentation

### Essential Guides

| Document | Description |
|----------|-------------|
| **[API Documentation](./API.md)** | Complete REST API reference with all endpoints, request/response formats, authentication, and code examples |
| **[Database Setup](./database/README.md)** | Database schema, table relationships, RLS policies, and setup instructions |
| **[Demo Data Guide](./database/DEMO-SETUP.md)** | Comprehensive demo data for testing all features including users, tasks, submissions, and referrals |
| **[Environment Variables](./ENV_SETUP.md)** | Detailed guide for configuring all environment variables with examples and troubleshooting |
| **[Deployment Guide](./DEPLOYMENT.md)** | Step-by-step instructions for deploying to Vercel with production best practices |

### API Documentation

The **[API Documentation](./API.md)** covers:

- **Authentication Endpoints** - Login, token validation
- **User Management** - CRUD operations, referral tracking
- **Task Management** - Task creation and listing
- **Submission Handling** - Approve/reject workflows, status updates
- **Certificate Management** - Generation, email delivery, resending
- **Redemption Processing** - Point redemption approval/rejection
- **Payout Tracking** - Status updates and transaction management
- **Dashboard Analytics** - Statistics and metrics endpoints

Each endpoint includes:
- HTTP method and path
- Request parameters and body schema
- Response format with examples
- Authentication requirements
- Error handling

### Database Documentation

The **[Database Setup Guide](./database/README.md)** includes:

- **Complete Schema** - All tables, columns, and data types
- **Relationships** - Foreign keys and table connections
- **RLS Policies** - Security policies for data access
- **Indexes** - Performance optimization
- **Triggers** - Automated database operations
- **Setup Instructions** - Step-by-step database initialization

**Key Tables:**
- `users` - Student and admin accounts
- `tasks` - Available program tasks
- `task_submissions` - Student task submissions
- `certificates` - Generated certificates
- `redeem_requests` - Point redemption requests
- `payouts` - Payment tracking
- `referrals` - Referral relationships

### Demo Data

The **[Demo Data Guide](./database/DEMO-SETUP.md)** provides:

- Ready-to-use SQL insert statements
- Sample data for all features
- Realistic test scenarios
- Referral network examples
- Complete workflow testing data

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── admin/               # Admin panel routes
│   │   ├── dashboard/       # Dashboard page
│   │   ├── submissions/     # Task validation
│   │   ├── certificates/    # Certificate management
│   │   ├── redemptions/     # Redemption management
│   │   ├── payouts/         # Payout tracking
│   │   ├── referrals/       # Referral tracking
│   │   ├── login/           # Login page
│   │   └── layout.tsx       # Admin layout with sidebar
│   ├── api/                 # API Routes (see API.md)
│   │   └── admin/          # Admin API endpoints
│   ├── globals.css          # Global styles
│   └── layout.tsx           # Root layout
├── components/
│   └── ui/                  # Reusable UI components
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       ├── table.tsx
│       └── badge.tsx
├── lib/
│   ├── db/                  # Database utilities
│   │   └── supabase.ts     # Supabase client & queries
│   ├── auth.ts              # Authentication utilities
│   ├── email.ts             # Email service (Resend)
│   └── utils.ts             # Helper functions
├── types/
│   └── index.ts             # TypeScript type definitions
├── database/                # Database files
│   ├── schema.sql          # Complete database schema
│   ├── README.md           # Database documentation
│   └── DEMO-SETUP.md       # Demo data setup
└── docs/
    ├── API.md              # API documentation
    ├── DEPLOYMENT.md       # Deployment guide
    └── ENV_SETUP.md        # Environment setup
```

## Components

### Dashboard

- Displays 6 key statistics cards
- Shows recent task submissions
- Lists pending redemptions
- Real-time data updates

### Task Validation

- Filter submissions by status (all, pending, approved, rejected)
- View submission details and proof
- Approve or reject with reasons
- Automatic point crediting

### Certificates

- View all issued certificates
- Download certificates as PDF
- Send/resend certificates via email
- Track email delivery status
- Automatic email on task approval

### Redemptions

- Manage point redemption requests
- Approve/reject requests
- Add admin notes
- Track redemption history

### Payouts

- Monitor payout status
- Edit transaction references
- Update payout status
- Filter by status

### Referrals

- Search users by name or email
- View referral trees
- Track referral counts
- Visualize referral networks

## API & Database

### API Endpoints

The application provides RESTful API endpoints for all operations. See **[API.md](./API.md)** for complete documentation.

**Key endpoint categories:**
- `/api/admin/auth` - Authentication
- `/api/admin/users` - User management
- `/api/admin/tasks` - Task management
- `/api/admin/submissions` - Submission handling
- `/api/admin/certificates` - Certificate operations
- `/api/admin/redeem-requests` - Redemption processing
- `/api/admin/payouts` - Payout tracking
- `/api/admin/dashboard` - Analytics

### Database Schema

PostgreSQL database via Supabase with:
- **8 core tables** with proper relationships
- **Row Level Security (RLS)** for data protection
- **Indexes** for query optimization
- **Triggers** for automated operations

See **[database/README.md](./database/README.md)** for complete schema and setup.

## Deployment

### Deploy to Vercel

This project is optimized for Vercel deployment:

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your repository
   - Configure environment variables
   - Deploy

3. **Configure Production**
   - Set up Supabase for production
   - Verify domain in Resend
   - Update environment variables

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for detailed instructions.

### Environment Variables

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `JWT_SECRET` - JWT signing secret
- `RESEND_API_KEY` - Resend email API key
- `NEXT_PUBLIC_APP_URL` - Application URL

See **[ENV_SETUP.md](./ENV_SETUP.md)** for detailed configuration.

## Documentation

- **[API Documentation](./API.md)** - Complete API reference with endpoints, request/response formats, and examples
- **[Database Setup](./database/README.md)** - Database schema and setup instructions
- **[Demo Data Guide](./database/DEMO-SETUP.md)** - Comprehensive demo data for testing all features

## Development

### Tech Stack

- **Frontend:** Next.js 15, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** JWT
- **Email:** Resend
- **Deployment:** Vercel (recommended)

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database by [Supabase](https://supabase.com/)
- Icons from [Lucide](https://lucide.dev/)
