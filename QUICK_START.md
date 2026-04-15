# Quick Start Guide - Admin Dashboard

## What Was Created

✅ **Login System** (`login.html`, `login.js`, `login.css`)
- Secure email/password authentication
- New account signup
- Remember me functionality

✅ **Admin Dashboard** (`admin.html`, `admin.js`, `admin.css`)
- Manage projects
- Create/edit blog posts
- Manage certifications
- Account settings and data export

✅ **Firebase Integration** (`firebase-config.js`)
- Real-time database connection
- Authentication functions
- Data management utilities

## Get Started in 5 Steps

### 1. Create Firebase Project (5 minutes)
- Visit: https://console.firebase.google.com/
- Click "Add Project"
- Follow the prompts

### 2. Enable Authentication (2 minutes)
- In Firebase: Authentication → Sign-in method
- Enable "Email/Password"
- Click Save

### 3. Create Realtime Database (2 minutes)
- In Firebase: Realtime Database
- Click "Create Database"
- Start in test mode
- Click Enable

### 4. Get Credentials (2 minutes)
- Firebase: Project Settings (gear icon)
- Copy your Web app config
- Paste into `firebase-config.js`

### 5. Set Up Security Rules (2 minutes)
- Firebase: Realtime Database → Rules
- Copy from FIREBASE_SETUP.md (Step 6)
- Publish

## Login Page URL
```
https://yourdomain.com/login.html
```

## First Login
1. Click "Create one" to sign up
2. Use your email and a strong password
3. You'll be redirected to admin dashboard

## Files Reference

| File | Purpose |
|------|---------|
| `login.html` | Login/signup page UI |
| `login.js` | Login authentication logic |
| `login.css` | Login page styling |
| `admin.html` | Admin dashboard UI |
| `admin.js` | Dashboard logic (CRUD operations) |
| `admin.css` | Dashboard styling |
| `firebase-config.js` | Firebase setup & database functions |
| `FIREBASE_SETUP.md` | Detailed setup instructions |

## Key URLs

- **Login**: `/login.html`
- **Admin Dashboard**: `/admin.html` (auto-redirects if not logged in)
- **Main Site**: `/index.html` (unchanged)

## Features Available

### Projects
- Add/edit/delete projects
- Track technologies used
- Link to project repositories

### Blog Posts
- Create technical and personal posts
- Add tags and categories
- Full WYSIWYG editing

### Certifications
- Log all certifications
- Track dates and issuers
- Link to credentials

### Settings
- Change password
- Delete account
- Export all data as JSON

## Firebase Security Rules Explained

```json
{
  "admin": {       // Private admin data
    ".read": "auth != null",        // Only logged-in users
    ".write": "auth != null"        // Only logged-in users
  },
  "projects": {    // Public projects
    ".read": true,                  // Anyone can read
    ".write": "auth != null"        // Only logged-in users can write
  },
  "blog": {        // Public blog
    ".read": true,                  // Anyone can read
    ".write": "auth != null"        // Only logged-in users can write
  },
  "certifications": { // Public certifications
    ".read": true,                  // Anyone can read
    ".write": "auth != null"        // Only logged-in users can write
  }
}
```

## Common Tasks

### Add a New Project
1. Go to Admin Dashboard → Projects
2. Click "+ Add Project"
3. Fill in: Title, Description, Technologies, Link
4. Click "Save Project"

### Write a Blog Post
1. Go to Admin Dashboard → Blog Posts
2. Click "+ New Post"
3. Fill in: Title, Category, Content, Tags
4. Click "Publish Post"

### Change Your Password
1. Go to Admin Dashboard → Settings
2. Click "Change" next to "Change Password"
3. Enter new password
4. Confirm

### Export Your Data
1. Go to Admin Dashboard → Settings
2. Click "Export"
3. JSON file downloads with all your content

## Theme Support

The admin dashboard automatically supports:
- ✅ Dark mode (default)
- ✅ Light mode (toggle in navbar)
- ✅ Persists your theme preference

## Mobile Friendly

- ✅ Login works on all devices
- ✅ Admin dashboard responsive
- ✅ Optimized for tablets and phones

## Troubleshooting

**"Firebase is not defined"**
- Make sure `firebase-config.js` comes after the Firebase SDK scripts

**Login fails**
- Check `firebase-config.js` credentials
- Verify Email/Password auth is enabled in Firebase

**Can't access admin dashboard**
- You must be logged in first
- Login at `/login.html`

**Database won't save**
- Check your security rules are published
- Make sure you're authenticated

## Next: Advanced Setup

See `FIREBASE_SETUP.md` for:
- Detailed Firebase configuration
- Security best practices
- Troubleshooting guide
- Advanced features

## Need Help?

1. Check `FIREBASE_SETUP.md` for detailed instructions
2. Visit Firebase documentation: https://firebase.google.com/docs
3. Check browser console (F12) for error messages

---

**Happy Admin Dashboard-ing!** 🚀
