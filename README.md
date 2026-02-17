# Student Programs Admin Panel

A comprehensive web-based admin panel for managing a Student Referral & Rewards Program. Built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Functionality

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

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
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

## 🔐 Demo Credentials

For testing purposes, use these credentials:

- **Email:** `admin@studentprograms.com`
- **Password:** `admin123`

## 📁 Project Structure

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

## 🎨 Key Components

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

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# JWT Secret for authentication
JWT_SECRET=your_jwt_secret

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important:** 
- Get your Supabase credentials from [supabase.com](https://supabase.com)
- Get your Resend API key from [resend.com](https://resend.com) to enable certificate emails
- Update the `from` email address in `src/lib/email.ts` to match your verified domain in Resend

### Tailwind Configuration

Custom color scheme defined in `tailwind.config.js`:

- Primary: Blue (#3B82F6)
- Secondary: Slate gray
- Success: Green
- Warning: Yellow
- Destructive: Red

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm start            # Start production server

# Linting
npm run lint         # Run ESLint
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy with one click

### Other Platforms

Build the production bundle:

```bash
npm run build
npm start
```

## 🔮 Future Enhancements

### Phase 1 (Immediate)

- [ ] Certificate PDF generation service
- [ ] Advanced filtering and search
- [ ] Export data to CSV/Excel
- [ ] Notification system

### Phase 2 (Short-term)

- [ ] Analytics and reporting
- [ ] Bulk operations
- [ ] Role-based access control
- [ ] Audit logs

### Phase 3 (Long-term)

- [ ] Mobile app integration
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

## 🛡️ Security Notes

> **✅ Production Ready:** This application includes:
>
> - JWT-based authentication
> - Secure session management
> - Environment variables for sensitive data
> - Database-backed user management
>
> **For production deployment, ensure:**
> - Use strong JWT secrets
> - Enable HTTPS
> - Configure CORS properly
> - Implement rate limiting
> - Set up proper database backups

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
