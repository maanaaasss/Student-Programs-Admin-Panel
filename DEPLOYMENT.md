# Deploying Student Programs Admin Panel to Vercel

This guide will walk you through deploying your Student Programs Admin Panel to Vercel.

## Prerequisites

- A GitHub account
- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Your code pushed to a GitHub repository
- All required API keys and credentials

## Step 1: Push Your Code to GitHub

If you haven't already, push your code to GitHub:

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

## Step 2: Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository
5. Vercel will automatically detect it's a Next.js project

## Step 3: Configure Environment Variables

Before deploying, you need to add all environment variables. In the Vercel project settings, add the following:

### Required Environment Variables:

| Variable Name | Description | Example Value |
|--------------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://llleqtjvxlbrluskwbhm.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` |
| `JWT_SECRET` | Secret key for JWT tokens | `6d6a494c30fe534810965406d641e1c6` |
| `RESEND_API_KEY` | Your Resend API key for emails | `re_EwfdhmtC_Ey4AXWcTNgXN5Sqf5CzSEi9P` |
| `NEXT_PUBLIC_APP_URL` | Your production app URL | `https://your-app.vercel.app` |

### How to Add Environment Variables in Vercel:

1. In your Vercel project dashboard, click **"Settings"**
2. Click **"Environment Variables"** in the left sidebar
3. For each variable:
   - Enter the **Name** (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - Enter the **Value**
   - Select **Production**, **Preview**, and **Development** environments
   - Click **"Save"**

### Where to Find Your Values:

#### Supabase Credentials:
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### JWT Secret:
- Use your existing value from `.env.local`: `6d6a494c30fe534810965406d641e1c6`
- Or generate a new one: `openssl rand -hex 32`

#### Resend API Key:
1. Go to [Resend Dashboard](https://resend.com/api-keys)
2. Create a new API key or use existing: `re_EwfdhmtC_Ey4AXWcTNgXN5Sqf5CzSEi9P`

#### App URL:
- Initially use: `https://your-project-name.vercel.app`
- After deployment, Vercel will give you the actual URL
- You can update this later

## Step 4: Deploy

1. After adding all environment variables, click **"Deploy"**
2. Vercel will:
   - Install dependencies
   - Build your Next.js application
   - Deploy to production
3. Wait for the deployment to complete (usually 2-5 minutes)

## Step 5: Update App URL

After your first deployment:

1. Copy your production URL (e.g., `https://your-app-name.vercel.app`)
2. Go to **Settings** → **Environment Variables**
3. Update `NEXT_PUBLIC_APP_URL` with your actual URL
4. Redeploy the project

## Step 6: Configure Supabase for Production

Update your Supabase settings to allow requests from your production domain:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Authentication** → **URL Configuration**
4. Add your Vercel URL to:
   - **Site URL**: `https://your-app-name.vercel.app`
   - **Redirect URLs**: `https://your-app-name.vercel.app/**`

## Step 7: Set Up Custom Domain (Optional)

1. Go to your Vercel project
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow Vercel's instructions to update your DNS records
5. Update `NEXT_PUBLIC_APP_URL` environment variable with your custom domain

## Step 8: Configure Email Sending (Production)

For production email sending with Resend:

1. Go to [Resend Dashboard](https://resend.com/domains)
2. Click **"Add Domain"**
3. Enter your domain name
4. Add the DNS records to your domain provider
5. Wait for verification (usually a few minutes)
6. Update `src/lib/email.ts` to use your verified domain:
   ```typescript
   from: 'Student Programs <noreply@yourdomain.com>',
   ```
7. Commit and push the change

## Continuous Deployment

Vercel automatically deploys your application when you push to GitHub:

- **Push to `main` branch** → Deploys to production
- **Push to other branches** → Creates preview deployments
- Each pull request gets a unique preview URL

## Monitoring and Logs

### View Deployment Logs:
1. Go to your Vercel dashboard
2. Click on your project
3. Click **"Deployments"**
4. Click on any deployment to see logs

### View Runtime Logs:
1. Go to your project dashboard
2. Click **"Logs"** or **"Analytics"**
3. Monitor errors, function invocations, and performance

## Troubleshooting

### Build Fails
- Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set correctly

### 500 Errors
- Check **Runtime Logs** in Vercel dashboard
- Verify database connection (Supabase credentials)
- Check API routes for errors

### Email Not Sending
- Verify `RESEND_API_KEY` is set correctly
- For production, verify your domain in Resend
- Check logs for email errors

### Database Connection Issues
- Verify Supabase credentials
- Check Supabase project is active
- Ensure Row Level Security (RLS) policies allow operations

## Important Notes

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Keep API keys secret** - Only add them in Vercel dashboard
3. **Test in Preview** - Push to a branch first to test before production
4. **Monitor logs** - Check logs regularly for errors
5. **Update dependencies** - Keep packages up to date for security

## Post-Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] Application builds successfully
- [ ] Can access the admin login page
- [ ] Can log in as admin
- [ ] Database operations work (create, read, update, delete)
- [ ] Email sending works
- [ ] All API endpoints respond correctly
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate is active (Vercel provides this automatically)

## Support

If you encounter issues:
1. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
2. Check Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)
3. Check deployment logs in Vercel dashboard
4. Check runtime logs for errors

## Useful Commands

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy from CLI
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# Pull environment variables
vercel env pull
```

---

**Your deployment is complete!** 🎉

Visit your app at: `https://your-app-name.vercel.app`
