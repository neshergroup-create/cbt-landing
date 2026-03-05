# Google Apps Script – Contact form setup

This folder contains the script that receives contact form submissions from the CBT landing page and sends them by email (and optionally logs to a Google Sheet).

## Steps

1. **Open [script.google.com](https://script.google.com)** and sign in with your Google account.

2. **New project** → delete the sample code in the editor.

3. **Paste the contents of `ContactForm.gs`** into the editor.

4. **Edit the config at the top of the script:**
   - `RECIPIENT_EMAIL` – the Gmail address that should receive each submission (e.g. Ornit’s email).
   - `SHEET_ID` – optional. To log submissions to a spreadsheet:
     - Create a new Google Sheet.
     - Copy the Sheet ID from the URL:  
       `https://docs.google.com/spreadsheets/d/`**`SHEET_ID`**`/edit`
     - Paste that ID between the quotes in `SHEET_ID = '...'`.  
     - Leave as `''` to skip the sheet.

5. **Deploy as a web app:**
   - Click **Deploy** → **New deployment**.
   - Click the gear icon next to “Select type” → **Web app**.
   - **Description:** e.g. “Contact form”.
   - **Execute as:** Me (your account).
   - **Who has access:** **Anyone** (so the site can POST from the browser).
   - Click **Deploy**.
   - When prompted, **Authorize** the app (choose your Google account and allow access).
   - Copy the **Web app URL** (it ends with `/exec`).

6. **Wire the URL into the site:**
   - Open `cbt-landing/js/main.js`.
   - Find:  
     `var CONTACT_FORM_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';`
   - Replace the whole URL with the Web app URL you copied (the one ending in `/exec`).

7. **Test:** Fill out the contact form on the site and submit. You should get an email and, if you set `SHEET_ID`, a new row in the sheet.

## Updating the script

After you change the code in the script editor:

- **Deploy** → **Manage deployments** → pencil icon on the current deployment → **Version** → **New version** → **Deploy**.  
The same URL keeps working; no need to change anything in `main.js`.
