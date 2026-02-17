# Database Setup Instructions

## Prerequisites

- Supabase account (sign up at https://supabase.com)

## Step 1: Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in project details:
   - Name: `student-programs-admin`
   - Database Password: (create a strong password)
   - Region: (choose closest to you)
4. Click "Create new project"
5. Wait for the project to be provisioned (~2 minutes)

## Step 2: Get Your Credentials

1. In your Supabase project dashboard, click on "Settings" (gear icon)
2. Go to "API" section
3. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 3: Configure Environment Variables

1. In your project root, create a `.env.local` file
2. Copy the contents from `.env.example`
3. Replace the placeholder values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   JWT_SECRET=generate_a_random_secret_key
   ```

## Step 4: Run Database Schema

1. In Supabase dashboard, go to "SQL Editor"
2. Click "New query"
3. Copy the entire contents of `database/schema.sql`
4. Paste into the SQL editor
5. Click "Run" to execute
6. Verify all tables were created (check "Table Editor")

## Step 5: Seed Database with Sample Data

1. In Supabase SQL Editor, create another new query
2. Copy the entire contents of `database/seed.sql`
3. Paste into the SQL editor
4. Click "Run" to execute
5. Verify data was inserted (check "Table Editor" for each table)

## Step 6: Generate Admin Password Hash

The seed data includes a default admin with password `admin123`. If you want to change this:

1. Run this Node.js script to generate a new hash:

   ```javascript
   const bcrypt = require("bcryptjs");
   const password = "your_new_password";
   bcrypt.hash(password, 10, (err, hash) => {
     console.log(hash);
   });
   ```

2. Update the admin record in Supabase:
   ```sql
   UPDATE admins
   SET password_hash = 'your_new_hash_here'
   WHERE email = 'admin@studentprograms.com';
   ```

## Step 7: Test Connection

1. Restart your Next.js development server:

   ```bash
   npm run dev
   ```

2. The application should now connect to Supabase
3. Check browser console for any connection errors

## Troubleshooting

### Connection Errors

- Verify your `.env.local` file has correct values
- Ensure Supabase project is active (not paused)
- Check that environment variables are loaded (restart dev server)

### Schema Errors

- Make sure UUID extension is enabled
- Run schema.sql before seed.sql
- Check for any SQL syntax errors in the output

### Authentication Errors

- Verify JWT_SECRET is set in `.env.local`
- Check that admin password hash is correct
- Ensure bcryptjs is installed

## Default Admin Credentials

After seeding:

- **Email**: `admin@studentprograms.com`
- **Password**: `admin123`

**⚠️ IMPORTANT**: Change this password in production!

## Demo Database Setup (Alternative)

For a comprehensive demo with realistic data covering all features, use the demo seed file instead:

### Quick Setup with Demo Data

```bash
# Run the automated setup script
./scripts/setup-demo-db.sh
```

Or manually:

```bash
# In Supabase SQL Editor, run:
# 1. database/schema.sql
# 2. database/seed-demo.sql
```

### What's Included in Demo Data

The `seed-demo.sql` includes:

- **7 Students** with varying point levels, referral relationships, and activity
- **6 Tasks** with different point values (50-300 points)
- **9 Task Submissions** (2 pending, 6 approved, 1 rejected)
- **6 Certificates** (5 sent, 1 resent, 1 not sent)
- **4 Redeem Requests** (2 pending, 1 approved, 1 rejected)
- **3 Payouts** (2 pending, 1 completed)
- **4 Referral Chains** showing complete referral trees

This data supports demonstrating **ALL admin panel features** without manual data creation.

📖 For detailed information about demo data, see the [Demo Setup Guide](./DEMO-SETUP.md)

## Next Steps

Once database is set up:

1. Test the admin login
2. Verify data is loading from Supabase
3. Test CRUD operations
4. Deploy to production with production environment variables
