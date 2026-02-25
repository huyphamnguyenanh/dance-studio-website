# Dance Studio Website - Quick Start Guide

## What You Have

A fully functional Dance Studio Management website built with React, ready to use and deploy.

## Demo Credentials

Use these to test the website:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@studio.com | password |
| Instructor | instructor@studio.com | password |
| Student | student@studio.com | password |

## Running Locally

### Start the development server:
```bash
cd /home/ubuntu/dance-studio-website
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Building for Production

### Create an optimized build:
```bash
npm run build
```

The `dist/` folder contains your production-ready website.

## Deploying to the Web

### Easiest Option: Vercel (Free)

1. Go to https://vercel.com and sign up
2. Click "New Project" and select your Git repository
3. Click "Deploy"
4. Your site is live!

### Alternative: Netlify (Free)

1. Go to https://netlify.com and sign up
2. Click "New site from Git"
3. Select your repository
4. Click "Deploy site"
5. Your site is live!

## Features

### For Admins
- View studio statistics (students, instructors, classes, attendance)
- Browse all classes and instructors
- Manage student enrollments

### For Instructors
- Browse assigned classes
- View student roster
- Track attendance

### For Students
- Browse available classes
- Filter by dance style
- Enroll in classes
- View personal schedule

## Project Structure

```
dance-studio-website/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components (Login, Home, Classes, Profile)
│   ├── context/            # Auth context for state management
│   ├── assets/             # Images and static files
│   ├── App.jsx             # Main app component with routing
│   ├── main.jsx            # Entry point
│   └── index.css           # Tailwind CSS styles
├── dist/                   # Production build (created by npm run build)
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── package.json            # Dependencies
├── README.md               # Full documentation
├── DEPLOYMENT.md           # Detailed deployment guide
└── QUICKSTART.md           # This file
```

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/context/AuthContext.jsx` | Handles user login/logout |
| `src/pages/Login.jsx` | Login page |
| `src/pages/Home.jsx` | Dashboard with stats |
| `src/pages/Classes.jsx` | Classes list with filtering |
| `src/pages/Profile.jsx` | User profile and settings |
| `src/components/Navigation.jsx` | Top navigation bar |

## Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
    }
  }
}
```

### Change Logo
Replace `src/assets/images/logo.png` with your logo.

### Add More Classes
Edit the `MOCK_CLASSES` array in `src/pages/Classes.jsx`.

### Change Demo Credentials
Edit the `demoUsers` object in `src/context/AuthContext.jsx`.

## Technology Stack

- **React 19** - UI library
- **Vite** - Fast build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **JavaScript/JSX** - Programming

## Next Steps

1. **Test locally** - Run `npm run dev` and test all features
2. **Customize** - Update colors, logo, and demo data
3. **Deploy** - Follow the deployment guide to go live
4. **Add backend** - Connect to a real API/database (optional)

## Getting Help

- **Vite Docs**: https://vitejs.dev
- **React Docs**: https://react.dev
- **React Router**: https://reactrouter.com
- **Tailwind CSS**: https://tailwindcss.com

## Support

For issues or questions:
1. Check the DEPLOYMENT.md guide
2. Review the README.md for detailed documentation
3. Check browser console for error messages
4. Verify all dependencies are installed with `npm install`

---

**Ready to deploy?** See DEPLOYMENT.md for detailed instructions!
