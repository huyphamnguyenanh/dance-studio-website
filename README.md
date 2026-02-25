# Dance Studio Management Website

A modern, responsive web application for managing dance studio operations. Built with React, Vite, and Tailwind CSS.

## Features

- **Authentication System** - Login with role-based access (Admin, Instructor, Student)
- **Dashboard** - Overview of studio statistics and quick actions
- **Classes Management** - Browse, filter, and manage dance classes
- **Profile Management** - User account settings and preferences
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Studio Branding** - Custom logo and purple/pink color scheme

## Demo Credentials

- **Admin**: admin@studio.com / password
- **Instructor**: instructor@studio.com / password
- **Student**: student@studio.com / password

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
cd dance-studio-website
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/      # Reusable components
├── pages/          # Page components
├── context/        # React context for state management
├── assets/         # Images and static files
├── App.jsx         # Main app component
└── main.jsx        # Entry point
```

## Technology Stack

- **React 19** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

## Features by Role

### Admin
- View studio statistics (students, instructors, classes, attendance)
- Manage all classes and instructors
- View student enrollments

### Instructor
- Browse and manage assigned classes
- View student roster
- Track attendance

### Student
- Browse available classes
- Enroll in classes
- View personal schedule

## Deployment

The website can be deployed to any static hosting service:

- **Vercel** (Recommended) - Free tier available
- **Netlify** - Free tier available
- **GitHub Pages** - Free
- **AWS S3 + CloudFront**
- **Any web server** (Apache, Nginx, etc.)

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

## License

ISC
