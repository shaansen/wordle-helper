# Quick Deploy Guide

## 🚀 Deploy in 3 Steps

### Step 1: Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: Wordle Solver"
```

### Step 2: Push to GitHub

```bash
# Replace with your GitHub username and repo name
git remote add origin https://github.com/YOUR_USERNAME/wordle.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to: `https://github.com/YOUR_USERNAME/wordle/settings/pages`
2. Under **Source**, select **GitHub Actions** (not "Deploy from a branch")
3. Click **Save**

## ✅ Done!

GitHub Actions will automatically:

- Build your React app
- Deploy to GitHub Pages
- Update on every push to `main`

Your site will be live at:
**`https://YOUR_USERNAME.github.io/wordle/`**

## 🔍 Check Deployment Status

- Go to: `https://github.com/YOUR_USERNAME/wordle/actions`
- Look for "Deploy to GitHub Pages" workflow
- Wait for it to complete (usually 1-2 minutes)

## 📝 Next Steps

- Every time you push to `main`, the site auto-updates
- No manual deployment needed!
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for troubleshooting



