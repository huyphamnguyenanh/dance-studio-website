# Dance Studio Website - Deployment Guide

This guide explains how to deploy the Dance Studio Management website to various hosting platforms.

## Option 1: Deploy to Vercel (Recommended - Free)

Vercel is the easiest option for deploying React/Vite applications.

### Steps:

1. **Create a Vercel account** at https://vercel.com (free)

2. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

3. **Deploy:**
   ```bash
   cd /home/ubuntu/dance-studio-website
   vercel
   ```

4. Follow the prompts and your site will be live!

### Benefits:
- Free tier includes unlimited deployments
- Automatic HTTPS
- Global CDN
- Automatic builds on git push

---

## Option 2: Deploy to Netlify (Free)

### Steps:

1. **Create a Netlify account** at https://netlify.com (free)

2. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

3. **Build and deploy:**
   ```bash
   cd /home/ubuntu/dance-studio-website
   npm run build
   netlify deploy --prod --dir=dist
   ```

### Benefits:
- Free tier with generous limits
- Automatic HTTPS
- Form handling
- Serverless functions

---

## Option 3: Deploy to GitHub Pages (Free)

### Steps:

1. **Create a GitHub repository** at https://github.com

2. **Update vite.config.js** (if using a subdirectory):
   ```javascript
   export default {
     base: '/repository-name/',
     // ... rest of config
   }
   ```

3. **Build and push to GitHub:**
   ```bash
   cd /home/ubuntu/dance-studio-website
   npm run build
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

4. **Enable GitHub Pages:**
   - Go to repository Settings
   - Select "Pages" from sidebar
   - Set source to "GitHub Actions"
   - Create `.github/workflows/deploy.yml`

---

## Option 4: Deploy to AWS S3 + CloudFront

### Steps:

1. **Create AWS account** at https://aws.amazon.com

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Upload to S3:**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name/
   ```

4. **Create CloudFront distribution** pointing to S3 bucket

---

## Option 5: Traditional Web Server (Apache/Nginx)

### Steps:

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload `dist` folder to your server:**
   ```bash
   scp -r dist/* user@your-server.com:/var/www/html/
   ```

3. **Configure your web server** to serve `index.html` for all routes

### Nginx Configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /var/www/html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Apache Configuration:
Create `.htaccess` in the root:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## Environment Variables

If you need to add environment variables for different environments:

1. Create `.env` file in the root:
   ```
   VITE_API_URL=https://api.example.com
   ```

2. Access in code:
   ```javascript
   const apiUrl = import.meta.env.VITE_API_URL;
   ```

3. For Vercel/Netlify, add environment variables in their dashboard

---

## Post-Deployment Checklist

- [ ] Test login with all three demo accounts
- [ ] Verify responsive design on mobile
- [ ] Test all navigation links
- [ ] Check that classes filter works
- [ ] Verify profile page displays correctly
- [ ] Test logout functionality
- [ ] Check browser console for errors
- [ ] Verify logo loads correctly
- [ ] Test on different browsers (Chrome, Firefox, Safari, Edge)

---

## Troubleshooting

### White screen after deployment
- Check browser console for errors
- Verify all assets are loading (check Network tab)
- Ensure base path is correct in vite.config.js

### Routes not working
- Make sure your server is configured to serve index.html for all routes
- Check that React Router is properly configured

### Styling not loading
- Clear browser cache
- Verify CSS files are in the dist folder
- Check that Tailwind CSS is properly configured

### Logo not showing
- Verify logo.png exists in dist/assets/
- Check image path in components

---

## Support

For deployment issues, refer to:
- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- Vite Docs: https://vitejs.dev
- React Router Docs: https://reactrouter.com
