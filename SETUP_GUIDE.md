# Zarbik - Setup and Usage Guide

Welcome to **Zarbik**, your modern digital projects hub. This guide will help you set up and manage your website.

## Overview

Zarbik is a clean, modern portfolio website that displays your live-hosted projects. It features a hidden admin panel for managing projects without requiring a traditional database. All project data is stored in JSON files.

### Key Features

- **Modern, Responsive Design**: Beautiful gradient-based UI with smooth animations
- **Project Management**: Add, edit, and delete projects through the admin panel
- **JSON-Based Storage**: No database required; projects stored in simple JSON files
- **Admin Authentication**: Secure login system with password hashing
- **Hidden Admin Panel**: Admin features accessible only via `/admin` routes
- **Professional Icons**: Uses Lucide React icons (no emojis)

## Getting Started

### 1. First-Time Setup

When you first visit the website, the admin panel is not yet configured. Follow these steps:

1. Navigate to `/admin/setup`
2. Create your admin account by entering:
   - **Username**: Your admin username (minimum 3 characters)
   - **Email**: Your email address
   - **Password**: A secure password (minimum 6 characters)
3. Click "Create Admin Account"
4. You will be automatically logged in and redirected to the admin dashboard

### 2. Admin Login

After setup, access the admin panel:

1. Go to `/admin/login`
2. Enter your username and password
3. Click "Login"
4. You'll be redirected to the admin dashboard

### 3. Managing Projects

#### Adding a Project

1. In the admin dashboard, click "Add New Project"
2. Fill in the project details:
   - **Project Name**: The name of your project
   - **Project Link**: The full URL to your project (e.g., `https://example.com`)
   - **Description**: A brief description of what the project does
   - **Icon**: An icon name (e.g., `code`, `zap`, `globe`, `sparkles`) or custom icon identifier
3. Click "Save Project"
4. The project will appear on the home page immediately

#### Editing a Project

1. In the admin dashboard, find the project you want to edit
2. Click the "Edit" button on the project card
3. Modify the project details
4. Click "Save Project"

#### Deleting a Project

1. In the admin dashboard, find the project you want to delete
2. Click the "Delete" button on the project card
3. Confirm the deletion when prompted
4. The project will be removed from the home page

### 4. Logging Out

To log out from the admin panel:

1. Click the "Logout" button in the top-right corner of the admin dashboard
2. You will be redirected to the home page

## File Structure

```
zarbik/
├── client/
│   └── src/
│       ├── pages/
│       │   ├── Home.tsx              # Main landing page
│       │   ├── AdminSetup.tsx        # First-time admin setup
│       │   ├── AdminLogin.tsx        # Admin login page
│       │   └── AdminDashboard.tsx    # Project management dashboard
│       └── App.tsx                   # Main router
├── server/
│   ├── admin.ts                      # Admin utilities (auth, file I/O)
│   ├── routers.ts                    # tRPC API endpoints
│   └── admin.test.ts                 # Admin tests
├── data/
│   ├── admin.json                    # Admin account (created on setup)
│   └── projects.json                 # Projects data (auto-generated)
└── SETUP_GUIDE.md                    # This file
```

## Data Storage

### Admin Account (`data/admin.json`)

```json
{
  "username": "your-username",
  "email": "your@email.com",
  "passwordHash": "salt:hash",
  "createdAt": 1234567890
}
```

### Projects (`data/projects.json`)

```json
{
  "projects": [
    {
      "id": "project-1234567890",
      "name": "My Awesome Project",
      "description": "A brief description",
      "icon": "code",
      "link": "https://example.com",
      "createdAt": 1234567890,
      "updatedAt": 1234567890
    }
  ],
  "lastUpdated": 1234567890
}
```

## Available Icons

You can use any of these icon names for your projects:

- `code` - Code/development icon
- `zap` - Lightning/speed icon
- `globe` - Global/web icon
- `sparkles` - Magic/special icon

To use a custom icon, you can provide the icon name or SVG content.

## Security Notes

- **Password Hashing**: Admin passwords are hashed using PBKDF2 with SHA-512
- **Session Cookies**: Admin sessions are managed via secure HTTP-only cookies
- **No Database**: All data is stored locally in JSON files, making deployment simple
- **Hidden Routes**: Admin routes are not linked from the UI; access requires knowing the URLs

## Deployment

The Zarbik website is ready to deploy to any Node.js hosting platform:

1. Build the project: `pnpm build`
2. Start the server: `pnpm start`
3. The website will be available at `http://localhost:3000`

### Environment Variables

No additional environment variables are required for basic functionality. The following are automatically provided:

- `DATABASE_URL`: For future database integration (optional)
- `JWT_SECRET`: For session management
- `VITE_APP_TITLE`: Website title
- `VITE_APP_LOGO`: Website logo

## Troubleshooting

### Admin Account Not Created

If you encounter issues creating the admin account:

1. Ensure the `data/` directory exists
2. Check that the server has write permissions
3. Try again or contact support

### Projects Not Displaying

If your projects don't appear on the home page:

1. Verify the `data/projects.json` file exists
2. Check that the JSON is valid
3. Refresh the page or restart the server

### Can't Login

If you can't log in:

1. Verify your username and password are correct
2. Check that the `data/admin.json` file exists
3. Try resetting by deleting `data/admin.json` and running setup again

## Support

For issues or questions, refer to the project repository or contact the development team.

---

**Zarbik** - A modern identity built on discipline, creativity, and forward-thinking execution.
