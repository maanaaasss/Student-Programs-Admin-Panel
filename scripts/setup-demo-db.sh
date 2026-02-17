#!/bin/bash

# ============================================================================
# DEMO DATABASE SETUP SCRIPT
# ============================================================================
# This script sets up the database with comprehensive demo data
# ============================================================================

set -e  # Exit on any error

echo "🚀 Starting Demo Database Setup..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ Error: .env.local file not found${NC}"
    echo "Please create .env.local with your database connection string"
    echo "Example: DATABASE_URL=postgresql://user:password@localhost:5432/dbname"
    exit 1
fi

# Load environment variables
export $(cat .env.local | grep DATABASE_URL | xargs)

if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ Error: DATABASE_URL not found in .env.local${NC}"
    exit 1
fi

echo -e "${YELLOW}⚠️  WARNING: This will DELETE all existing data!${NC}"
echo -e "${YELLOW}⚠️  Use this ONLY for demo/development environments${NC}"
echo ""
read -p "Are you sure you want to continue? (yes/no): " -r
echo ""

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "❌ Setup cancelled"
    exit 0
fi

echo "📋 Step 1/3: Creating database schema..."
psql "$DATABASE_URL" -f database/schema.sql
echo -e "${GREEN}✅ Schema created successfully${NC}"
echo ""

echo "📋 Step 2/3: Loading demo seed data..."
psql "$DATABASE_URL" -f database/seed-demo.sql
echo -e "${GREEN}✅ Demo data loaded successfully${NC}"
echo ""

echo "📋 Step 3/3: Verifying data..."
echo ""

# Verify counts
echo "📊 Database Statistics:"
echo "----------------------"

USERS_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM users;")
echo "👥 Users: $USERS_COUNT"

ADMINS_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM admins;")
echo "👤 Admins: $ADMINS_COUNT"

TASKS_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM tasks;")
echo "📌 Tasks: $TASKS_COUNT"

SUBMISSIONS_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM task_submissions;")
echo "🧾 Submissions: $SUBMISSIONS_COUNT"

CERTIFICATES_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM certificates;")
echo "🎓 Certificates: $CERTIFICATES_COUNT"

REDEMPTIONS_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM redeem_requests;")
echo "💰 Redeem Requests: $REDEMPTIONS_COUNT"

PAYOUTS_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM payouts;")
echo "🏦 Payouts: $PAYOUTS_COUNT"

REFERRALS_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM referrals;")
echo "🔗 Referrals: $REFERRALS_COUNT"

echo ""
echo -e "${GREEN}✅ Demo database setup complete!${NC}"
echo ""
echo "🔐 Login Credentials:"
echo "--------------------"
echo "Email: admin@studentprograms.com"
echo "Password: admin123"
echo ""
echo "🎉 You can now start the application and explore all features!"
echo "   Run: npm run dev"
