# Deploy CBT Landing to GitHub + Netlify

## 1. Install Git (if needed)

- Download: https://git-scm.com/download/win  
- Install and restart the terminal.

---

## 2. Create the GitHub repo

1. Go to https://github.com/new  
2. **Repository name:** e.g. `cbt-landing`  
3. **Public**  
4. Do **not** add README, .gitignore, or license.  
5. Click **Create repository**.  
6. Copy the repo URL (e.g. `https://github.com/YOUR_USERNAME/cbt-landing.git`).

---

## 3. Push this folder to GitHub

Open **PowerShell** or **Command Prompt** and run:

```powershell
cd c:\CursorProject\Ali\cbt-landing

git init
git add .
git commit -m "Initial commit - CBT landing page"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cbt-landing.git
git push -u origin main
```

Replace `YOUR_USERNAME/cbt-landing` with your real GitHub username and repo name.

If GitHub asks for login, use a **Personal Access Token** as password (Settings → Developer settings → Personal access tokens).

---

## 4. Deploy on Netlify

1. Go to https://app.netlify.com and sign in (e.g. with GitHub).  
2. **Add new site** → **Import an existing project**.  
3. Choose **GitHub** and select the `cbt-landing` repo.  
4. Netlify will use the `netlify.toml` in the project:
   - **Build command:** (empty)  
   - **Publish directory:** `.`  
5. Click **Deploy site**.  
6. Your site will be at `https://something-random.netlify.app`.  
7. (Optional) In **Domain settings** you can add a custom domain.

---

## 5. Updates later

After changing files:

```powershell
cd c:\CursorProject\Ali\cbt-landing
git add .
git commit -m "Update site"
git push
```

Netlify will automatically redeploy when you push to `main`.
