# Deploy CBT Landing to GitHub + Netlify

## עדכון האתר (Deploy אחרי שינויים)

**מתי משתמשים:** האתר כבר על GitHub ו-Netlify, ורוצים רק לעדכן את מה ששינית בפרויקט.

**מה עושים:**

1. פתח **PowerShell** (חפש "PowerShell" בתפריט התחל ב-Windows).

2. העתק והדבק את הפקודות הבאות, **אחת אחרי השנייה**, ולחץ Enter אחרי כל אחת:
   ```
   cd c:\CursorProject\Ali\cbt-landing
   ```
   ```
   git add .
   ```
   ```
   git commit -m "Update site"
   ```
   ```
   git push
   ```

3. אם GitHub מבקש התחברות – השתמש ב-Personal Access Token (לא בסיסמה הרגילה).  
   ליצירת טוקן: GitHub → Settings → Developer settings → Personal access tokens.

4. Netlify יעדכן את האתר אוטומטית תוך דקה–שתיים אחרי שה-`git push` הצליח.

**אם מופיעה שגיאה על קובץ index.lock:**  
מחק את הקובץ `c:\CursorProject\Ali\cbt-landing\.git\index.lock` (למשל דרך סייר הקבצים) ונסה שוב את הפקודות משלב 2.

---

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

---

## If you see "Page not found" (404) on the thank-you page

Netlify’s [support guide](https://answers.netlify.com/t/support-guide-i-ve-deployed-my-site-but-i-still-see-page-not-found/125) says the most common cause is **wrong Publish directory**. Follow this checklist:

### 1. Check Build & deploy settings

1. Go to **https://app.netlify.com** and open your site (**ornit**).
2. Go to **Site configuration** → **Build** (or **Build & deploy** → **Build settings**).
3. Check **Base directory**  
   - Leave it **empty** if your GitHub repo root contains `index.html` (repo = `cbt-landing` with files at root).  
   - Set it to the folder that contains `index.html` only if your repo has the site inside a subfolder (e.g. `cbt-landing`).
4. Check **Publish directory**  
   - It **must** be **`.`** (a single dot) for this project.  
   - If it is `dist`, `build`, `out`, or anything else, change it to **`.`**, then **Save**.

### 2. Trigger a new deploy

- Click **Trigger deploy** → **Deploy site** (or push a commit to `main`).  
- Wait until the deploy shows **Published**.

### 3. Confirm files are in the deploy

- Open the **latest deploy** (click it in the Deploys list).
- Use **Browse deploy** / **Deploy file browser** (or **Download deploy**) and check that at the root you see:
  - `index.html`
  - `thank-you.html`
  - `thank-you/` (folder with `index.html` inside)
  - `css/`, `js/`, `assets/`, `_redirects`
- If `thank-you.html` is **missing**, the Publish directory is wrong: set it to **`.`** and redeploy.

### 4. If the homepage works but thank-you still 404s

- **Try first:** Open **https://ornit.netlify.app/thank-you.html** in a **private/incognito** window (or clear cache). The thank-you page is deployed; a cached 404 is common.
- In Netlify, go to **Site configuration** → **Build** and ensure **Build command** is empty (no build step for this static site).
