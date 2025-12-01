# Zarbik - Quick Start Guide

## Download & Setup

### 1. Extract the Project

```bash
# Extract the zip file
unzip zarbik-project.zip
cd zarbik
```

### 2. Install Dependencies

```bash
# Install all required packages
pnpm install
```

### 3. Run Locally

```bash
# Start development server
pnpm dev
```

The website will be available at `http://localhost:3000`

## First-Time Setup

1. Open your browser and go to `http://localhost:3000/admin/setup`
2. Create your admin account:
   - **Username**: Choose any username (minimum 3 characters)
   - **Email**: Your email address
   - **Password**: A secure password (minimum 6 characters)
3. Click "Create Admin Account"
4. You'll be redirected to the admin dashboard

## Add Your First Project

1. In the admin dashboard, click "Add New Project"
2. Fill in the details:
   - **Project Name**: Name of your project
   - **Project Link**: Full URL (e.g., `https://example.com`)
   - **Description**: Brief description
   - **Icon**: Icon name (`code`, `zap`, `globe`, `sparkles`)
3. Click "Save Project"
4. Visit the home page to see your project displayed

## Admin URLs

- **Setup**: `http://localhost:3000/admin/setup` (first time only)
- **Login**: `http://localhost:3000/admin/login`
- **Dashboard**: `http://localhost:3000/admin/dashboard`

## Build for Production

```bash
# Build the project
pnpm build

# Start production server
pnpm start
```

## Deploy to Vercel

See `VERCEL_DEPLOYMENT.md` for detailed deployment instructions.

## Project Structure

```
zarbik/
├── client/              # Frontend React code
│   └── src/
│       ├── pages/       # Page components (Home, Admin, etc.)
│       ├── components/  # Reusable UI components
│       └── App.tsx      # Main router
├── server/              # Backend Node.js code
│   ├── admin.ts         # Admin authentication & file I/O
│   ├── routers.ts       # API endpoints
│   └── admin.test.ts    # Tests
├── data/                # JSON data files (created at runtime)
│   ├── admin.json       # Admin account
│   └── projects.json    # Projects data
├── SETUP_GUIDE.md       # Detailed setup guide
├── VERCEL_DEPLOYMENT.md # Vercel deployment guide
└── package.json         # Dependencies
```

## Key Features

✅ Modern, responsive design with gradient backgrounds
✅ Hidden admin panel (no UI links)
✅ Secure password hashing (PBKDF2)
✅ JSON file-based data storage
✅ Professional Lucide React icons
✅ Full project CRUD operations
✅ Comprehensive test suite

## Troubleshooting

### Port Already in Use

```bash
# Use a different port
PORT=3001 pnpm dev
```

### Clear Cache

```bash
# Remove build artifacts
rm -rf dist node_modules
pnpm install
pnpm dev
```

### Admin Account Reset

```bash
# Delete the admin account file to reset
rm data/admin.json

# Then visit /admin/setup again
```

## Next Steps

1. **Customize Design**: Edit `client/src/pages/Home.tsx` and `client/src/index.css`
2. **Add More Icons**: Use any Lucide React icon name
3. **Deploy**: Follow `VERCEL_DEPLOYMENT.md`
4. **Add Database**: For persistent data, implement MongoDB or PostgreSQL

## Support

For detailed information, see:
- `SETUP_GUIDE.md` - Complete setup and usage guide
- `VERCEL_DEPLOYMENT.md` - Deployment instructions

---

**Ready to go! 🚀**
