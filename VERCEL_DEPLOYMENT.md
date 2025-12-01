# Zarbik - Vercel Deployment Guide

This guide will help you deploy your Zarbik website to Vercel, a modern serverless platform perfect for full-stack Next.js applications.

## Prerequisites

- A [Vercel account](https://vercel.com) (free tier is sufficient)
- [Git](https://git-scm.com) installed on your machine
- Your Zarbik project files

## Step-by-Step Deployment

### 1. Prepare Your Project

Ensure your project is ready for production:

```bash
# Navigate to your project directory
cd /path/to/zarbik

# Install dependencies
pnpm install

# Build the project
pnpm build

# Test locally
pnpm start
```

### 2. Initialize Git Repository

If you haven't already, initialize a Git repository:

```bash
git init
git add .
git commit -m "Initial commit: Zarbik website"
```

### 3. Push to GitHub

Create a new repository on [GitHub](https://github.com/new) and push your code:

```bash
git remote add origin https://github.com/YOUR_USERNAME/zarbik.git
git branch -M main
git push -u origin main
```

### 4. Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy your project:
```bash
vercel
```

3. Follow the prompts:
   - Link to existing project? → No
   - Set project name → `zarbik`
   - Select framework → Detect automatically (or select "Other")
   - Root directory → `./`
   - Build command → `pnpm build`
   - Output directory → `dist`
   - Environment variables → Skip for now

4. Your project will be deployed and you'll get a live URL

#### Option B: Using Vercel Web Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Paste your GitHub repository URL
4. Click "Import"
5. Configure project settings:
   - **Framework Preset**: Other
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
6. Click "Deploy"

### 5. Configure Environment Variables (Optional)

If you need to set environment variables:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add any required variables (usually none needed for basic setup)
4. Redeploy your project

## File Structure in Production

When deployed to Vercel:

```
Production (dist/)
├── index.html                 # Main HTML file
├── assets/                    # CSS, JS bundles
├── api/                       # Server-side API routes
│   └── trpc/                  # tRPC endpoints
└── data/                      # JSON data files
    ├── admin.json             # Admin account (created on first setup)
    └── projects.json          # Projects data
```

## Important Notes

### Data Persistence

**⚠️ Critical**: Vercel is a **stateless serverless platform**. This means:

- Files created during runtime (like `data/admin.json` and `data/projects.json`) will **persist during the current deployment**
- However, when you redeploy or Vercel rebuilds your project, these files may be lost
- For long-term data persistence, consider:
  - Using a database (MongoDB, PostgreSQL, etc.)
  - Using Vercel KV (Redis) for session/admin data
  - Using external file storage (AWS S3, etc.)

### Current Setup Limitations

The current JSON file-based approach works for:
- **Development and testing**
- **Short-term production use** (before redeployment)
- **Low-traffic projects** with infrequent data changes

For production with data persistence, you'll need to implement one of the solutions above.

## Admin Panel Access

After deployment, access your admin panel:

1. **First-time setup**: Visit `https://your-domain.vercel.app/admin/setup`
2. **Login**: Visit `https://your-domain.vercel.app/admin/login`
3. **Dashboard**: Visit `https://your-domain.vercel.app/admin/dashboard`

Replace `your-domain` with your actual Vercel deployment URL.

## Updating Your Website

To update your website after deployment:

1. Make changes to your code locally
2. Commit and push to GitHub:
```bash
git add .
git commit -m "Update: [describe changes]"
git push origin main
```

3. Vercel will automatically redeploy your project

## Custom Domain

To use a custom domain:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Domains**
3. Add your custom domain
4. Follow the DNS configuration instructions
5. Wait for DNS propagation (usually 5-30 minutes)

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify `pnpm build` works locally

### Admin Panel Not Accessible

- Ensure you're using the correct URL: `/admin/setup`, `/admin/login`, `/admin/dashboard`
- Clear browser cache
- Check Vercel function logs for errors

### Projects Not Displaying

- Verify `data/projects.json` exists
- Check that JSON is valid
- Refresh the page

### Data Lost After Redeployment

This is expected with the current JSON file approach. To fix:
- Implement a database solution
- Use Vercel KV for data storage
- Export/backup your projects before redeployment

## Next Steps for Production

For a robust production setup, consider:

1. **Add a Database**:
   - MongoDB Atlas (free tier available)
   - PostgreSQL with Vercel Postgres
   - Supabase (PostgreSQL + Auth)

2. **Implement Session Storage**:
   - Vercel KV (Redis)
   - Database sessions

3. **Add Analytics**:
   - Vercel Analytics
   - Google Analytics

4. **Set Up Monitoring**:
   - Vercel error tracking
   - Sentry for error monitoring

5. **Add Email Notifications**:
   - SendGrid or Resend for admin notifications
   - Project submission alerts

## Support

For Vercel-specific issues:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)

For Zarbik-specific issues:
- Check the `SETUP_GUIDE.md` file
- Review the project README

---

**Happy Deploying! 🚀**
