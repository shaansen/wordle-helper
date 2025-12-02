# Deploying to GitHub Pages

This guide will help you deploy the Wordle Solver React app to GitHub Pages.

## Prerequisites

- A GitHub account
- Git installed on your computer
- The repository initialized with Git

## Step 1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions** (not "Deploy from a branch")
4. Save the settings

## Step 2: Configure Base Path

The app is configured to work with GitHub Pages. The base path is automatically set based on your repository name.

**If your repository is named `wordle`:**

- The app will be available at: `https://yourusername.github.io/wordle/`
- Base path is already configured as `/wordle/`

**If your repository is `username.github.io` (user/organization page):**

- The app will be available at: `https://yourusername.github.io/`
- Update `vite.config.ts` to set `base: '/'` instead of `/wordle/`

## Step 3: Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Wordle Solver React app"

# Add your GitHub repository as remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/wordle.git

# Push to main branch
git branch -M main
git push -u origin main
```

## Step 4: Automatic Deployment

Once you push to the `main` branch:

1. GitHub Actions will automatically:
   - Build the React app
   - Deploy it to GitHub Pages
2. You can check the deployment status:

   - Go to **Actions** tab in your repository
   - Watch the "Deploy to GitHub Pages" workflow run

3. After deployment completes (usually 1-2 minutes):
   - Your site will be live at: `https://yourusername.github.io/wordle/`
   - You can find the URL in: **Settings** → **Pages**

## Manual Deployment

If you want to deploy manually:

```bash
# Build the app
npm run build:gh-pages

# The dist/ folder contains the built files
# You can manually upload these to GitHub Pages if needed
```

## Troubleshooting

### 404 Errors

If you see 404 errors, check:

- The base path in `vite.config.ts` matches your repository name
- GitHub Pages is enabled and using GitHub Actions
- The workflow completed successfully in the Actions tab

### Build Fails

If the build fails:

- Check the Actions tab for error messages
- Ensure all dependencies are in `package.json`
- Try running `npm run build:react` locally to see errors

### Assets Not Loading

If images/styles don't load:

- Ensure the base path is correct
- Check browser console for 404 errors
- Verify paths in your code use relative paths (not absolute)

## Custom Domain (Optional)

If you want to use a custom domain:

1. Add a `CNAME` file in the `public/` folder with your domain:

   ```
   yourdomain.com
   ```

2. Update your DNS settings to point to GitHub Pages
3. GitHub will automatically detect and configure the CNAME

## Updating the Site

Every time you push to the `main` branch, the site will automatically rebuild and deploy. No manual steps needed!

```bash
git add .
git commit -m "Update Wordle Solver"
git push
```

## Local Testing

Test the production build locally before deploying:

```bash
# Build for production
npm run build:gh-pages

# Preview the build
npm run preview
```

This will start a local server showing how the site will look on GitHub Pages.



