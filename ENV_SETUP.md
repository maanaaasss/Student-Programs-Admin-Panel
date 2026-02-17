# Environment Variables Setup Guide

This document lists all required environment variables for the Student Programs Admin Panel.

## Quick Setup

Copy the values from your `.env.local` file to the Vercel dashboard or create a new `.env.local` file with these values:

## Environment Variables

### 1. Supabase Configuration

```bash
# Your Supabase project URL
NEXT_PUBLIC_SUPABASE_URL=https://llleqtjvxlbrluskwbhm.supabase.co

# Your Supabase anonymous/public API key
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsbGVxdGp2eGxicmx1c2t3YmhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMjE4MzcsImV4cCI6MjA4Njc5NzgzN30.2h2UINtXxEoORV8MGIsER_zKG85OrFhRxM5O0f7OYcM
```

**Where to find:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Settings → API
4. Copy "Project URL" and "anon public" key

---

### 2. JWT Secret

```bash
# Secret key for signing JWT tokens
JWT_SECRET=6d6a494c30fe534810965406d641e1c6
```

**How to generate a new one:**
```bash
openssl rand -hex 32
```

**Important:** Use the same JWT_SECRET across all environments (development, preview, production)

---

### 3. Resend Email API

```bash
# Resend API key for sending emails
RESEND_API_KEY=re_EwfdhmtC_Ey4AXWcTNgXN5Sqf5CzSEi9P
```

**Where to find:**
1. Go to [Resend Dashboard](https://resend.com/api-keys)
2. Create a new API key or use existing
3. Copy the API key (starts with `re_`)

**Note:** 
- For development: Use `onboarding@resend.dev` as sender (already configured)
- For production: Verify your domain in Resend and update `src/lib/email.ts`

---

### 4. Application URL

```bash
# Your application's public URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Values by environment:**
- **Development:** `http://localhost:3000`
- **Preview:** `https://your-app-git-branch-name.vercel.app`
- **Production:** `https://your-app-name.vercel.app` or your custom domain

---

## Environment Variable Table

| Variable | Required | Environment | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | All | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | All | `eyJhbGciOiJIUzI1NiIs...` |
| `JWT_SECRET` | ✅ Yes | All | `6d6a494c30fe5348...` |
| `RESEND_API_KEY` | ✅ Yes | All | `re_EwfdhmtC_Ey4AXW...` |
| `NEXT_PUBLIC_APP_URL` | ✅ Yes | All | `https://yourapp.com` |

---

## Setting Up in Different Environments

### Local Development

Create a `.env.local` file in the project root:

```bash
# Copy .env.example to .env.local
cp .env.example .env.local

# Edit .env.local with your values
nano .env.local
```

### Vercel (Production/Preview)

1. Go to your project in Vercel dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - **Key:** Variable name (e.g., `RESEND_API_KEY`)
   - **Value:** Your actual value
   - **Environments:** Select Production, Preview, and Development
4. Click **Save**
5. Redeploy your application

### Using Vercel CLI

```bash
# Pull environment variables from Vercel to local
vercel env pull

# Add a new environment variable
vercel env add VARIABLE_NAME

# List all environment variables
vercel env ls
```

---

## Security Best Practices

### ✅ DO:
- Keep API keys secret and never commit them to Git
- Use different API keys for development and production
- Rotate API keys regularly
- Use environment variables for all sensitive data
- Verify `.env*.local` is in `.gitignore`

### ❌ DON'T:
- Never commit `.env.local` to Git
- Never share API keys in screenshots or documentation
- Never hardcode secrets in your code
- Never use production keys in development
- Don't expose sensitive keys in client-side code (unless prefixed with `NEXT_PUBLIC_`)

---

## Testing Environment Variables

After setting up, verify they're working:

### Test in Development:

```bash
# Start development server
npm run dev

# Check console for any missing variable warnings
```

### Test in Vercel:

1. Deploy to preview/production
2. Check deployment logs for errors
3. Test each feature:
   - Admin login (JWT_SECRET)
   - Database operations (Supabase)
   - Email sending (Resend)

---

## Troubleshooting

### Variables Not Loading

**Problem:** Environment variables are undefined

**Solutions:**
1. Restart your development server after adding variables
2. Ensure variable names match exactly (case-sensitive)
3. For `NEXT_PUBLIC_*` variables, rebuild the app: `npm run build`
4. In Vercel, redeploy after adding variables

### Supabase Connection Errors

**Problem:** Database operations fail

**Solutions:**
1. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
2. Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the **anon** key, not service role
3. Check Supabase project is active
4. Verify your Vercel domain is allowed in Supabase settings

### Email Not Sending

**Problem:** Resend emails fail

**Solutions:**
1. Verify `RESEND_API_KEY` is correct
2. Check API key has proper permissions
3. For production, verify your domain in Resend
4. Use `onboarding@resend.dev` for testing

### JWT Errors

**Problem:** Authentication fails

**Solutions:**
1. Verify `JWT_SECRET` is at least 32 characters
2. Ensure same secret is used across all environments
3. Clear browser cookies and try again

---

## Example .env.local File

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://llleqtjvxlbrluskwbhm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsbGVxdGp2eGxicmx1c2t3YmhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMjE4MzcsImV4cCI6MjA4Njc5NzgzN30.2h2UINtXxEoORV8MGIsER_zKG85OrFhRxM5O0f7OYcM

# JWT Secret for authentication
JWT_SECRET=6d6a494c30fe534810965406d641e1c6

# Email Service (Resend)
RESEND_API_KEY=re_EwfdhmtC_Ey4AXWcTNgXN5Sqf5CzSEi9P

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Quick Reference Commands

```bash
# Copy example env file
cp .env.example .env.local

# Generate new JWT secret
openssl rand -hex 32

# Check environment variables are loaded (add to any file temporarily)
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)

# Vercel CLI - Pull environment variables
vercel env pull

# Vercel CLI - Add environment variable
vercel env add VARIABLE_NAME
```

---

**Need help?** Check the [DEPLOYMENT.md](./DEPLOYMENT.md) guide for more information.
