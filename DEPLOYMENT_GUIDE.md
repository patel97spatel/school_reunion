# GitHub Actions Deployment Guide

## ✅ Workflow Created: Deploy to GitHub Pages

A GitHub Actions workflow has been created at `.github/workflows/deploy.yml` to automatically deploy your school reunion website to GitHub Pages **completely free**.

---

## 🚀 Setup Instructions

### Step 1: Push to GitHub
Commit and push this repository to GitHub:

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Pages deployment workflow"
git push origin main
```

**Note:** The workflow triggers on push to `main` or `master` branch. Update the branch names in `deploy.yml` if you use a different branch.

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages** (left sidebar)
3. Under "Build and deployment":
   - **Source:** Select "GitHub Actions" (if available) or keep default
   - **Branch:** Select `gh-pages` (the workflow creates this automatically)
4. Click **Save**

GitHub will display your site URL once deployment completes (typically `https://username.github.io/school-reunion`).

### Step 3: Configure Your Website

Before deployment, update `assets/js/config.js` with your details:

```javascript
const config = {
  school: "Kharsal School",
  location: "Ps-Bhatli,Baragada, Odisha",
  batch: "2008-2013",
  owner: "Spatel",
  whatsapp: "9556811679",
  apiUrl: "https://your-google-apps-script-url/exec" // Optional backend
};
```

---

## 📋 Workflow Features

✅ **Automatic Deployment:** Deploys on every push to main/master  
✅ **GitHub Pages Hosting:** Free, fast, and secure HTTPS  
✅ **No Build Step Required:** Serves your static files as-is  
✅ **Pull Request Preview:** Shows deployment status on PRs  
✅ **Concurrent Deployment Protection:** Prevents race conditions  

---

## 🌐 Your Website URL

After successful deployment, your site will be available at:

**`https://YOUR-USERNAME.github.io/school-reunion`**

Or if you have a custom domain configured in GitHub Pages settings, that URL will be used instead.

---

## ✨ Optional: Custom Domain

To use a custom domain (e.g., `reunionfriends.com`):

1. Go to **Settings** → **Pages**
2. Under "Custom domain," enter your domain
3. Add DNS records as instructed by GitHub
4. Enable "Enforce HTTPS"

---

## 🔄 How Updates Work

Every time you push changes to your repository:

1. GitHub automatically runs the workflow
2. Your static files are uploaded to GitHub Pages
3. Your site updates within seconds
4. You can monitor progress in **Actions** tab

---

## 📝 Workflow File Breakdown

| Component | Purpose |
|-----------|---------|
| `on: [push, pull_request]` | Triggers workflow on code changes |
| `permissions` | Grants necessary access to deploy |
| `checkout@v4` | Downloads your repository code |
| `configure-pages@v4` | Sets up GitHub Pages |
| `upload-pages-artifact@v3` | Packages files for deployment |
| `deploy-pages@v4` | Deploys to GitHub Pages |

---

## 🛠️ Troubleshooting

### Workflow not running?
- Check **Settings** → **Actions** → ensure "Allow all actions" is selected
- Verify branch name matches (main or master)

### Site not updating after push?
- Check the **Actions** tab for failed workflows
- Clear browser cache (`Ctrl+Shift+Del`)
- Wait 2-3 minutes for deployment to complete

### Wrong branch deploying?
- Edit `.github/workflows/deploy.yml` 
- Change `branches: [ main, master ]` to your branch name

### Custom domain not working?
- Verify DNS records at your domain registrar
- Wait 24 hours for DNS propagation

---

## 🔒 Security Notes

✅ Your repository can be **private** — GitHub Pages still works  
✅ Static files only — no server-side code exposure  
✅ HTTPS enforced automatically by GitHub  
⚠️ Ensure `google-apps-script/` folder is never published  

---

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Deploy to GitHub Pages Action](https://github.com/actions/deploy-pages)

---

## ❓ Next Steps

1. ✅ Commit the workflow file
2. ✅ Push to GitHub
3. ✅ Enable GitHub Pages in repository settings
4. ✅ Update `config.js` with your details
5. ✅ Set up Google Apps Script backend (optional, as per README)
6. ✅ Visit your deployed site!

**Completely free. Completely automated. Ready to celebrate your reunion!** 🎉
