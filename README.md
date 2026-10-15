# FinTrack

Personal double-entry finance tracker for iPhone and Android.
Each person's data stays private on their own phone. Nothing is uploaded.

- **iPhone / iPad:** web app installed from Safari ("Add to Home Screen"), works offline.
- **Android:** real app (APK), saves automatic Excel backups to `Documents/FinTrack/Backups`.

GitHub builds and hosts everything for free. You do this setup once.

---

## Part A — Put FinTrack on GitHub (one time, about 15 minutes)

### 1. Create the repository
1. Sign in at github.com, click **+** (top right) → **New repository**.
2. Name: `fintrack`. Choose **Public** (free hosting needs a public repository; only the app's code is public, never anyone's data).
3. Leave "Add a README" **unticked**. Click **Create repository**.

### 2. Upload the files
1. Unzip `fintrack-app.zip` on your computer.
2. On the new repository page, click **uploading an existing file**.
3. Open the unzipped `fintrack-app` folder, select **everything inside it** (including the `.github` folder) and drag it into the browser.
   - Mac: press `Cmd + Shift + .` in Finder to show hidden folders like `.github`.
   - Windows: in File Explorer, View → Show → Hidden items.
4. Click **Commit changes**.
5. Check that the repository now shows a `.github` folder. If it does not: **Add file → Create new file**, type the name `.github/workflows/build.yml`, paste the contents of that file from the zip, and commit.

### 3. Add your private signing key (Android updates depend on it)
Open the separate file **`KEEP-PRIVATE-android-signing.txt`** (it is *not* in the zip and must never be uploaded as a file).
1. In the repository: **Settings → Secrets and variables → Actions → New repository secret**.
2. Name `ANDROID_KEYSTORE_BASE64` → paste the long block of text → **Add secret**.
3. New secret again: name `ANDROID_KEYSTORE_PASSWORD` → paste the password → **Add secret**.

### 4. Turn on the website
**Settings → Pages → Build and deployment → Source: GitHub Actions.**

### 5. Build
**Actions** tab → **Build FinTrack** → **Run workflow** → **Run workflow**.
Wait about 5–8 minutes for both green ticks (Android app, then web app).
If an earlier run failed because steps 3–4 were not done yet, simply run it again.

---

## Part B — Install on phones

Your install link (replace `YOUR-USERNAME`):

```
https://YOUR-USERNAME.github.io/fintrack/install.html
```

Send this link to your family. The page detects the phone and shows the right steps.

**iPhone:** open the link in **Safari** → Share button → **Add to Home Screen** → **Add**. Open FinTrack from the FT icon.

**Android:** tap **Download for Android** → open `fintrack.apk` → allow your browser to install unknown apps if asked → **Install**.
The APK is also on the repository's **Releases** page.

---

## Part C — Updating the app later

Most updates only change one file: `www/index.html`.

1. **Back up first** (on each phone): Manage → Data → Download Excel backup.
2. On GitHub, open your `fintrack` repository and click the **`www`** folder.
3. **Add file → Upload files**, drag in the new `index.html`. It replaces the old one with the same name.
4. Write a short message (e.g. "Cheque savings + hide balances") and click **Commit changes**.
5. Open the **Actions** tab and wait for **Build FinTrack** to show a green tick (about 5–8 minutes).

Then on the phones:

- **iPhone:** close FinTrack fully (swipe it away), then open it with internet on. If the new feature does not show, close and open it once more (the first open downloads the update, the second uses it).
- **Android:** open the install link → **Download for Android** → open `fintrack.apk` → **Update**. Your data stays, because every build is signed with your same key.

To update several files at once (for example a whole new zip), upload them the same way into the matching folders. Never upload `KEEP-PRIVATE-android-signing.txt`.

---

## Part D — Google sign-in and your data

FinTrack asks you to **sign in with Google** the first time it opens. Each person signs in with their own Google account.

- **On the phone:** your book is kept on the phone, so FinTrack opens and works offline. Sign-in is only needed once per phone.
- **In your Google Drive:** every **Save** uploads your book to a **FinTrack** folder in your own Google Drive:
  `FinTrack backup (latest).xlsx` plus one `FinTrack-backup-YYYY-MM-DD.xlsx` per day (the last 30 days are kept).
  FinTrack can only see the files it creates there, not the rest of your Drive.
- **Offline:** saves wait on the phone and upload the next time FinTrack is open with internet.
  The top bar shows the state: *Backed up 5m ago*, *Not backed up*, *Offline*, or *Reconnect*.
- **New or reset phone:** install FinTrack and sign in with the same Google account. Your book comes back automatically.
- **Two phones on one account:** if both changed the book, FinTrack asks which version to keep. Daily copies of earlier days stay in Drive either way.
- **Android extra:** an Excel copy is also written to `Documents/FinTrack/Backups` on the phone after every Save.
- **Sign out:** Manage → Data → Google account → Sign out. Your data stays on the phone.

### Google Cloud settings (already done once)
Project **FinTrack** in console.cloud.google.com, with the Google Drive API enabled and these sign-in clients:
- **Web client** `81483299774-or3u05dvqpkf89l6ir9ita0fadnn6d94.apps.googleusercontent.com`
  - Authorized JavaScript origin: `https://armghank.github.io`
  - Authorized redirect URI: `https://armghank.github.io/fintrack/index.html`
- **Android client** `81483299774-u2hfmt2l9m8irqi35jdrq2a9thodp1q0.apps.googleusercontent.com`
  - Package `app.fintrack.personal`, SHA-1 `B2:D4:4B:51:85:3C:A5:64:CC:0D:44:84:B9:32:D7:4C:07:80:A6:92`
- Data Access: `openid`, `userinfo.email`, `userinfo.profile`, `drive.file`.
- Audience: in **Testing**, only the emails under **Test users** can sign in (add family members there).

---

## Part E — See who uses FinTrack (user register)

Every person who signs in is listed in a private Google Sheet in **your** account: name, email, iPhone or Android,
app version, first sign-in and last active. No financial data is ever sent. The app sends a Google ID token, which
proves who signed in but cannot open anyone's Drive.

### One-time setup (about 10 minutes)
1. Go to **sheets.new** (signed in as you) and name the sheet `FinTrack users`.
2. Menu **Extensions → Apps Script**. Delete everything in the editor and paste all of `user-register/FinTrack-Users.gs`. Click **Save** (disk icon).
3. Optional: choose **setup** in the function list and click **▶ Run**, then allow access. This creates the *Users* and *Summary* tabs now instead of on the first sign-in.
4. **Deploy → New deployment** → gear icon → **Web app**.
   - Description `FinTrack users` · **Execute as: Me** · **Who has access: Anyone** → **Deploy**.
   - **Authorize access** → choose your account → "Google hasn't verified this app" → **Advanced → Go to … (unsafe) → Allow**. This is your own script.
5. Copy the **Web app URL** (starts with `https://script.google.com/macros/s/`, ends with `/exec`).
6. Open that link in a browser. It should show `{"ok":true,"app":"FinTrack user register",...}`.
7. Put the link in the app: in `www/index.html`, the line `const REGISTER_URL="";` gets the link between the quotes. Commit.

Users appear when they next sign in, or within a day for people already signed in. The **Summary** tab shows total users,
active in the last 7 and 30 days, Android vs iPhone, and new this month.

If you change the script later: **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**. The link stays the same.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Install link shows 404 | Pages takes a few minutes after the first build. Check Settings → Pages shows the site URL. |
| Build failed at "Build APK" | Check both secrets are named exactly as in step 3, then re-run. |
| Android says "App not installed" when updating | The APK was signed with a different key (secrets were missing for that build). Back up to Excel, uninstall, install the new APK, restore the backup. |
| Google says "Error 400: redirect_uri_mismatch" | In the Web client, the redirect URI must be exactly `https://armghank.github.io/fintrack/index.html`. |
| Google says "Access blocked" or the user isn't allowed | Add that person's Gmail under Audience → Test users (or publish the app). |
| Android sign-in fails with "Developer error" or code 10 | The Android client's package name or SHA-1 doesn't match. Check them against Part D. |
| Nobody appears in the users sheet | Check `REGISTER_URL` in `www/index.html` is your `/exec` link, and that the deployment's **Who has access** is **Anyone**. |
| Top bar keeps saying "Reconnect" | Tap it and sign in again. In Testing mode Google asks for this about once a week. |
| iPhone shows a browser bar | It was opened in Safari instead of from the Home Screen icon. Add it to the Home Screen and open it from there. |

## What is inside

| Path | Purpose |
|---|---|
| `www/` | The app itself (`index.html`), install page, offline support, icons, fonts, Excel library |
| `assets/` | Source artwork for the Android icon and splash screen |
| `scripts/patch-android.js` | Applies FinTrack's Android settings during the build (version, signing, storage, Google sign-in) |
| `user-register/FinTrack-Users.gs` | Script for your private who-uses-FinTrack Google Sheet (Part E) |
| `.github/workflows/build.yml` | The automatic build and hosting |
| `capacitor.config.json`, `package.json` | Android app settings (app id `app.fintrack.personal`, Capacitor 7, Google sign-in component) |
