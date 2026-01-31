# GitHub Push Instructions

## Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: snapcart-v7
3. Make it Private (recommended)
4. Don't initialize with README
5. Click "Create repository"

## Step 2: Copy your repository URL
After creating, GitHub will show you a URL like:
https://github.com/yourusername/snapcart-v7.git

## Step 3: Run these commands
Replace YOUR_GITHUB_URL with your actual repository URL

```bash
# Add GitHub as remote
git remote add origin YOUR_GITHUB_URL

# Push to GitHub
git branch -M main
git push -u origin main
```

## Example:
```bash
git remote add origin https://github.com/quakestartup/snapcart-v7.git
git branch -M main
git push -u origin main
```

## If you get authentication errors:
1. Use GitHub Personal Access Token instead of password
2. Or use GitHub Desktop app
3. Or use SSH key

---

## After Pushing to GitHub

### Deploy to Hostinger

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload to Hostinger:**
   - Go to Hostinger File Manager
   - Navigate to public_html (or your domain folder)
   - Upload everything from the `dist/` folder
   - NOT the dist folder itself, just its contents

3. **Set Environment Variables in Hostinger:**
   - Go to Hostinger Dashboard
   - Find "Environment Variables" or ".env" settings
   - Add:
     ```
     VITE_SUPABASE_URL=https://xgxgfzxtswlbfhyiuytl.supabase.co
     VITE_SUPABASE_ANON_KEY=your_anon_key
     ```

4. **Configure Hostinger for SPA:**
   - Create `.htaccess` file in public_html:
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

5. **Test your site:**
   - Visit your domain
   - Test login, marketplace, seller features

---

## Troubleshooting

### If site shows blank page:
- Check browser console for errors
- Verify environment variables are set
- Check if .htaccess is uploaded

### If API calls fail:
- Verify Supabase URL and key
- Check Supabase dashboard for errors
- Ensure RLS policies are set up

### If images don't load:
- Check Supabase storage buckets are public
- Verify image URLs in database

---

**Need help?** Check the logs in:
- Browser Console (F12)
- Hostinger Error Logs
- Supabase Dashboard Logs
