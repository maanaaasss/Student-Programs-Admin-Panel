# Student Programs Admin Panel

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

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation

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

4. **Set up the database**

   Run the SQL schema in your Supabase project:
   
   ```bash
   # The schema is located at database/schema.sql
   # Execute it in your Supabase SQL editor
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Demo Credentials

For testing purposes, use these credentials:

- **Email:** `admin@studentprograms.com`
- **Password:** `admin123`

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
│   ├── auth.ts              # Authentication utilities
│   ├── utils.ts             # Helper functions
│   └── data/
│       └── template-data.ts # Demo data
└── types/
    └── index.ts             # TypeScript type definitions
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

## 📚 Documentation

- **[API Documentation](./API.md)** - Complete API reference with endpoints, request/response formats, and examples
- **[Database Setup](./database/README.md)** - Database schema and setup instructions
- **[Demo Data Guide](./database/DEMO-SETUP.md)** - Comprehensive demo data for testing all features

## 🚀 Development

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

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database by [Supabase](https://supabase.com/)
- Icons from [Lucide](https://lucide.dev/)
