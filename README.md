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

Edit or replace files in the repository (for example a new `www/index.html` from Claude) and commit. GitHub rebuilds automatically.

- **iPhone:** the app updates by itself the next time it is opened with internet.
- **Android:** download the new APK from the install page and install it over the old one. Your data stays, because every build is signed with your same key.

---

## Part D — Your data and backups

- Data lives only on each phone. If the app (or Safari's website data, on iPhone) is deleted, the data is deleted too.
- **Manage → Data → Excel backup.**
  - Android: automatic, into `Documents/FinTrack/Backups` (keeps the last 10).
  - iPhone: tap **Download Excel backup** → **Save to Files** → choose a folder (iCloud Drive keeps it safe if your phone is lost).
- To move to a new phone: restore the Excel backup from **Manage → Data → Restore from Excel backup**.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Install link shows 404 | Pages takes a few minutes after the first build. Check Settings → Pages shows the site URL. |
| Build failed at "Build APK" | Check both secrets are named exactly as in step 3, then re-run. |
| Android says "App not installed" when updating | The APK was signed with a different key (secrets were missing for that build). Back up to Excel, uninstall, install the new APK, restore the backup. |
| iPhone shows a browser bar | It was opened in Safari instead of from the Home Screen icon. Add it to the Home Screen and open it from there. |

## What is inside

| Path | Purpose |
|---|---|
| `www/` | The app itself (`index.html`), install page, offline support, icons, fonts, Excel library |
| `assets/` | Source artwork for the Android icon and splash screen |
| `scripts/patch-android.js` | Applies FinTrack's Android settings during the build |
| `.github/workflows/build.yml` | The automatic build and hosting |
| `capacitor.config.json`, `package.json` | Android app settings (app id `app.fintrack.personal`) |
