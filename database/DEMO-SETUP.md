# Demo Database Setup Guide

This guide explains how to set up the comprehensive demo database for the Student Programs Admin Panel.

## 📋 What's Included

The demo database includes realistic data for all admin panel features:

### 👥 Users (7 Students)
- **Alice Johnson** - High points (2500), top referrer (referred 2 people)
- **Bob Smith** - Moderate points (1200), referred by Alice, has 1 referral
- **Charlie Brown** - Moderate points (1500), referred by Alice, has 1 referral
- **Diana Prince** - Low points (650), referred by Bob
- **Eve Wilson** - ZERO points, new user with no activity
- **Frank Miller** - High points (1800), independent (no referral relationships)
- **Grace Lee** - Low points (400), missing phone number

### 📌 Tasks (6 Different Tasks)
- Refer a Friend (100 points)
- Complete Profile Setup (50 points)
- Submit Academic Assignment (200 points)
- Attend Workshop (150 points)
- Write Blog Post (250 points)
- Community Contribution (300 points)

### 🧾 Task Submissions
- **2 Pending**: Bob's profile completion, Diana's assignment
- **6 Approved**: Various submissions from Alice, Charlie, Frank, and Bob
- **1 Rejected**: Eve's incomplete referral (with detailed rejection reason)

### 🎓 Certificates (6 Certificates)
- 5 certificates marked as "sent"
- 1 certificate marked as "resent" (Charlie's workshop)
- 1 certificate not yet sent (Alice's assignment)

### 💰 Redeem Requests
- **2 Pending**: Alice (500 points), Frank (800 points)
- **1 Approved**: Charlie (300 points) with admin notes
- **1 Rejected**: Bob (1500 points) with explanation

### 🏦 Payouts
- **2 Pending**: Alice ($50), Frank ($80)
- **1 Completed**: Charlie ($30) with transaction reference

### 🔗 Referrals
- Alice referred 2 users (Bob, Charlie)
- Bob referred 1 user (Diana)
- Charlie referred 1 user (Eve)
- Frank and Grace have no referral relationships

## 🚀 Setup Methods

### Method 1: Supabase SQL Editor (Recommended for Supabase)

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Click **"New query"**
4. Copy the entire contents of `database/schema.sql`
5. Click **"Run"** to create tables
6. Create another new query
7. Copy the entire contents of `database/seed-demo.sql`
8. Click **"Run"** to load demo data
9. Verify in **Table Editor** that all tables have data

### Method 2: Command Line (For Local PostgreSQL)

```bash
# Run the automated setup script
./scripts/setup-demo-db.sh
```

The script will:
1. Verify your database connection
2. Create the schema
3. Load demo data
4. Display statistics

### Method 3: Manual Command Line

```bash
# Set your database URL
export DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Create schema
psql $DATABASE_URL -f database/schema.sql

# Load demo data
psql $DATABASE_URL -f database/seed-demo.sql
```

## 🔐 Login Credentials

After setup, use these credentials to access the admin panel:

```
Email: admin@studentprograms.com
Password: admin123
```

## ⚠️ Important Notes

- **This deletes all existing data!** Only use in development/demo environments
- The command-line method requires `psql` (PostgreSQL command-line tool)
- For Supabase, use the SQL Editor (no psql needed)
- Make sure your `.env.local` contains the correct database credentials

## 🎯 Demo Scenarios Coverage

The seed data supports demonstrating ALL admin panel features:

### ✅ Students Page
- Mix of users with different point levels (0 to 2500 points)
- Users with referrals (Alice referred 2 people)
- Users without referrals (Frank, Grace are independent)
- Users with missing data (Grace has no phone)
- High-point users (Alice: 2500, Frank: 1800)
- Zero-point users (Eve: 0)

### ✅ Submissions Page (Task Validation)
- **2 Pending submissions** ready to approve/reject:
  - Bob's profile completion
  - Diana's assignment
- **6 Approved submissions** showing completed tasks
- **1 Rejected submission** with detailed reason (Eve's incomplete referral)
- Submissions include proof URLs and timestamps

### ✅ Certificates Page
- **5 Sent certificates** showing successful deliveries
- **1 Resent certificate** (Charlie's workshop - email_sent_at is later than issued_at)
- **1 Unsent certificate** (Alice's assignment - ready to send)
- Linked to students and tasks

### ✅ Redemptions Page
- **2 Pending requests** waiting for approval:
  - Alice requesting 500 points
  - Frank requesting 800 points
- **1 Approved request** (Charlie - 300 points) with admin notes
- **1 Rejected request** (Bob - 1500 points) with detailed explanation about insufficient balance

### ✅ Payouts Page
- **2 Pending payouts** ready to process:
  - Alice: $50 for 500 points (bank transfer)
  - Frank: $80 for 800 points (PayPal)
- **1 Completed payout** with full details:
  - Charlie: $30 for 300 points
  - Transaction reference: TXN-20240315-CH001
  - Admin notes and completion timestamp

### ✅ Referrals Page
- **Alice** - Top referrer with 2 successful referrals (Bob, Charlie)
- **Bob** - Both referred and referrer (referred by Alice, referred Diana)
- **Charlie** - Both referred and referrer (referred by Alice, referred Eve)
- **Diana** - Only referred by Bob
- **Eve** - Only referred by Charlie, no activity yet
- **Frank & Grace** - No referral relationships

### ✅ Dashboard
- Total points distributed across all users
- Active redemption requests
- Pending submissions for validation
- Recent activity with timestamps

## 📊 Data Verification

After setup, verify the data in Supabase Table Editor or using SQL:

```sql
-- Check user counts
SELECT COUNT(*) FROM users;  -- Should return 7

-- Check submission statuses
SELECT status, COUNT(*) FROM task_submissions GROUP BY status;
-- Expected: pending: 2, approved: 6, rejected: 1

-- Check redeem request statuses
SELECT status, COUNT(*) FROM redeem_requests GROUP BY status;
-- Expected: pending: 2, approved: 1, rejected: 1

-- Check payout statuses
SELECT status, COUNT(*) FROM payouts GROUP BY status;
-- Expected: pending: 2, completed: 1

-- Check referrals
SELECT COUNT(*) FROM referrals;  -- Should return 4

-- Check certificates
SELECT COUNT(*) FROM certificates;  -- Should return 6
SELECT email_sent, COUNT(*) FROM certificates GROUP BY email_sent;
-- Expected: true: 5, false: 1
```

## 🔄 Reset Demo Data

To reset the demo data at any time:

**In Supabase:**
- Run `database/seed-demo.sql` again in SQL Editor

**Command Line:**
```bash
./scripts/setup-demo-db.sh
```

## 🛠️ Troubleshooting

### Supabase SQL Editor

**Foreign Key Errors:**
- Make sure you run `schema.sql` first
- Check that UUID extension is enabled
- Verify all tables were created successfully

**Data Not Appearing:**
- Check for errors in the SQL output
- Verify tables exist in Table Editor
- Try running the seed file again

### Command Line

**"DATABASE_URL not found":**
Make sure `.env.local` exists and contains:
```
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

**"psql: command not found":**
Install PostgreSQL client:
```bash
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql-client
```

**Connection Errors:**
- Verify your database is running
- Check DATABASE_URL is correct
- Ensure database user has proper permissions

## 📝 Customization

To customize the demo data:

1. Edit `database/seed-demo.sql`
2. Modify the INSERT statements
3. Run the setup again

Tips:
- Keep foreign key relationships valid
- Use UUIDs in the format shown
- Maintain timestamp logic for realistic data

## 🎉 Next Steps

After setting up the demo database:

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open the admin panel:**
   ```
   http://localhost:3000/admin/login
   ```

3. **Login with admin credentials**

4. **Explore all features:**
   - Review pending submissions
   - Approve/reject redemption requests
   - Process payouts
   - Send certificates
   - View referral chains
   - Check dashboard statistics

## 📚 Additional Resources

- [Main Database README](./README.md) - General database setup
- [Schema Documentation](./schema.sql) - Table structure
- [Original Seed File](./seed.sql) - Minimal seed data

## 💡 Tips for Demos

1. **Start with Dashboard** - Shows overview of all data
2. **Show Pending Items** - Demonstrate approval workflows
3. **Process a Payout** - Complete a pending payout with transaction reference
4. **Approve a Submission** - Show certificate generation
5. **Check Referrals** - Visualize the referral tree
6. **Reject with Reason** - Show rejection workflow with admin notes

---

For questions or issues, create an issue in the project repository.
