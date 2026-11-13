# FinTrack

Personal double-entry finance tracker for iPhone, Android and computers.
Each person's book stays private on their own phone, with a backup in **their own** Google Drive.

- **iPhone / iPad / computer:** web app at `https://armghank.github.io/fintrack/`. On iPhone, add it from Safari ("Add to Home Screen"). It works offline.
- **Android:** a real app (APK). It also saves automatic Excel backups to `Documents/FinTrack/Backups` on the phone.

GitHub builds and hosts everything for free. Part A is done once; after that, updates follow Part C.

*Last updated: November 2026.*

---

## What FinTrack does

- **Double-entry book:** every entry balances (debits = credits). Day book, trial balance, account pages and Excel statements.
- **Simple or Pro mode:** Simple (the default for new users) keeps it to accounts, spending and budgets. Pro adds the journal, savings, EMIs, PDCs, calendar, projection, trial balance and statements. Switching never changes your data.
- **Accounts:** bank, cash, credit cards, loans, people and other assets or liabilities.
  - **Opening balances are locked on their date.** An entry dated before an account's opening balance doesn't change today's balance; the earlier balance is worked out backwards.
  - **Credit cards** can have a credit limit, showing what's used and available with a green-to-red bar, and a warning before a spend goes over it.
- **Budgets:** one bar per month for your limit and what's left to spend.
- **Savings:** savings pots inside a bank account, plus a savings calculator.
- **Plans (Pro):** EMIs & bills, PDC cheques, calendar, and a projection of 6 months to 5 years with what-ifs.
- **Safety:** app lock with fingerprint, face or PIN, automatic Excel backups, and it works offline.
- **Help & feedback:** step-by-step guides with ▶ Show me walkthroughs, FAQs, and a feedback form.

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
Open the separate file **`KEEP-PRIVATE-android-signing.txt`**. It is *not* in the zip and must never be uploaded as a file.
1. In the repository: **Settings → Secrets and variables → Actions → New repository secret**.
2. Name `ANDROID_KEYSTORE_BASE64` → paste the long block of text → **Add secret**.
3. New secret again: name `ANDROID_KEYSTORE_PASSWORD` → paste the password → **Add secret**.

### 4. Turn on the website
**Settings → Pages → Build and deployment → Source: GitHub Actions.**

### 5. Build
**Actions** tab → **Build FinTrack** → **Run workflow** → **Run workflow**.
Wait about 5–8 minutes for both green ticks (Android app, then web app).
If an earlier run failed because steps 3–4 were not done yet, run it again.

---

## Part B — Install on phones

Your install link:

```
https://armghank.github.io/fintrack/install.html
```

Send this link to your family. The page detects the phone and shows the right steps.

**iPhone:** open the link in **Safari** → Share button → **Add to Home Screen** → **Add**. Open FinTrack from the FT icon.

**Android:** tap **Download for Android** → open `fintrack.apk` → allow your browser to install unknown apps if asked → **Install**.
The APK is also on the repository's **Releases** page.

**First open:** sign in with Google, pick your country and currency, then choose **Start with my own data** or **Show me example data first**. Example data is never saved.

---

## Part C — Updating the app later

Most updates change two files: **`www/index.html`** (the app) and **`whats-new.txt`** (the release notes).

1. **Back up first** (on your own phone): **Manage → Data → Back up now** (Android), **Save copy to Files** (iPhone) or **Download Excel backup** (computer).
2. On GitHub, open your `fintrack` repository and click the **`www`** folder.
3. **Add file → Upload files**, drag in the new `index.html`. It replaces the old one with the same name. Write a short message (e.g. "Locked opening balances") and click **Commit changes**.
4. Go back to the main folder of the repository and upload the new **`whats-new.txt`** the same way (it sits next to `package.json`).
5. Open the **Actions** tab and wait for **Build FinTrack** to show a green tick (about 5–8 minutes).

If an update includes other files, upload each one into its matching folder (for example `scripts/patch-android.js` into `scripts`). Never upload `KEEP-PRIVATE-android-signing.txt`, or any `.keystore` or `.jks` file.

### What people see after an update
- **Android:** when FinTrack is opened, an **Update available** pop-up shows the new version and its What's new list. **Update now** downloads it; tap **Install** (or **Update**). Their data stays, because every build is signed with the same key. They can also tap **Manage → Data → Check for updates**.
- **iPhone / web:** close FinTrack fully (swipe it away), then open it with internet on. If the new feature doesn't show, close and open it once more (the first open downloads the update, the second uses it). A **What's new** pop-up then lists the changes.

### Writing `whats-new.txt`
- One point per line, starting with `•`. Plain words, no technical terms.
- List **only this update's** changes. Replace the old text each time.
- The build turns it into the What's new pop-up, the Android update pop-up and the notes on the GitHub Release.

---

## Part D — Google sign-in, saving and your data

FinTrack asks you to **sign in with Google** the first time it opens. Each person signs in with their own Google account.

- **Saving on the phone:** there is no Save button. Every change is saved on the phone within a second, so FinTrack opens and works offline.
- **Backup to your Google Drive:** after a change, FinTrack backs up to a **FinTrack** folder in your own Google Drive. It does this after 2 quiet minutes, when you leave or close the app, or at least once an hour, and only when something has changed. The folder holds:
  - `FinTrack backup (latest).xlsx`
  - one `FinTrack-backup-YYYY-MM-DD.xlsx` per day. The last 30 days are kept.

  FinTrack can only see the files it creates there, not the rest of your Drive.
- **The top bar shows the state:**

  | Shows | Meaning |
  |---|---|
  | *✓ Saved on phone* | Saved, backup waiting |
  | *✓ Backed up 5m ago* | All backed up |
  | *☁ Offline · saved on phone* | Will back up when online |
  | *⚠ Tap to reconnect* | Google needs you to sign in again |
  | *⚠ Choose version* | Two devices changed the book |
  | *⚠ Not saved · tap* | The phone couldn't save; usually storage is full |
- **New or reset phone:** install FinTrack and sign in with the same Google account. Your book comes back automatically.
- **Two phones on one account:** if both changed the book, FinTrack asks which version to keep. Daily copies of earlier days stay in Drive either way.
- **Android extra:** an Excel copy is also written to `Documents/FinTrack/Backups` on the phone after your changes (last 30 days kept). These files stay even if FinTrack is uninstalled.
- **Restore:** Manage → Data → Restore from Excel backup.
- **Sign out:** Manage → Data → Google account → Sign out. Your data stays on the phone.

### App lock
**Manage → Settings → Security → Lock FinTrack** (off by default).
- **Android:** fingerprint or face, with the phone's PIN as a fallback.
- **iPhone and computer:** Face ID, Touch ID or Windows Hello.
- **Ask again:** every time, after 1 minute (default) or after 5 minutes.
- **Can't unlock?** On the lock screen, sign in with the same Google account. This turns the lock off.

### Google Cloud settings (already done once)
Project **FinTrack** in console.cloud.google.com, with the Google Drive API enabled and two sign-in clients. Their IDs and the Android key fingerprint are kept in the Google Cloud console, not here.
- **Web client**
  - Authorized JavaScript origin: `https://armghank.github.io`
  - Authorized redirect URI: `https://armghank.github.io/fintrack/index.html`
- **Android client**
  - Package `app.fintrack.personal`, with the SHA-1 fingerprint of your Android signing key
- Data Access: `openid`, `userinfo.email`, `userinfo.profile`, `drive.file`.
- Audience: in **Testing**, only the emails under **Test users** can sign in (add family members there).

---

## Part E — Users and feedback (your private Google Sheet)

Every person who signs in is listed in a private Google Sheet in **your** account. No financial data is ever sent. The app sends a Google ID token, which proves who signed in but cannot open anyone's Drive.

- **Users tab:** name, email, iPhone or Android, app version, country (the one they pick in FinTrack, never a location), first sign-in and last active.
- **Summary tab:** total users, active in the last 7 and 30 days, Android vs iPhone, new this month, users by country.
- **Feedback tab:** messages from the app's **Help & feedback → Send feedback** form (idea, problem, complaint or praise). It has a **Status** column for you to track them. Each device can send up to 5 messages every 6 hours, and messages can never run as formulas in the sheet.
- **Daily email:** at 09:00 you get one email summarising the last 24 hours of feedback, only if there was any.

### One-time setup (about 10 minutes)
1. Go to **sheets.new** (signed in as you) and name the sheet `FinTrack users`.
2. Menu **Extensions → Apps Script**. Delete everything in the editor and paste all of `user-register/FinTrack-Users.gs`. Click **Save** (disk icon).
3. Choose **setup** in the function list and click **▶ Run**, then allow access. This creates the tabs and the daily email timer. It needs permission to send you email.
4. **Deploy → New deployment** → gear icon → **Web app**.
   - Description `FinTrack users` · **Execute as: Me** · **Who has access: Anyone** → **Deploy**.
   - **Authorize access** → choose your account → "Google hasn't verified this app" → **Advanced → Go to … (unsafe) → Allow**. This is your own script.
5. Copy the **Web app URL** (starts with `https://script.google.com/macros/s/`, ends with `/exec`).
6. Open that link in a browser. It should show `{"ok":true,"app":"FinTrack user register",...}`.
7. Put the link in the app: in `www/index.html`, the line `const REGISTER_URL="...";` holds the link between the quotes. Commit.

Users appear when they next sign in, or within a day for people already signed in.

### Updating the script later
Open the sheet → **Extensions → Apps Script**, replace everything with the new `user-register/FinTrack-Users.gs`, **Save**, run **setup** once if the update says so, then **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**. The link stays the same, so nothing changes in the app.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Install link shows 404 | Pages takes a few minutes after the first build. Check Settings → Pages shows the site URL. |
| Build failed at "Build APK" | Check both secrets are named exactly as in Part A step 3, then re-run. |
| Android says "App not installed" when updating | The APK was signed with a different key (secrets were missing for that build). Back up to Excel, uninstall, install the new APK, restore the backup. |
| No "Update available" pop-up on Android | Check the build finished with a green tick, then close and reopen FinTrack with internet on. The pop-up waits until any open form is closed. |
| What's new shows last update's text | `whats-new.txt` wasn't replaced. Upload the new one and run the build again. |
| Google says "Error 400: redirect_uri_mismatch" | In the Web client, the redirect URI must be exactly `https://armghank.github.io/fintrack/index.html`. |
| Google says "Access blocked" or the user isn't allowed | Add that person's Gmail under Audience → Test users (or publish the app). |
| Android sign-in fails with "Developer error" or code 10 | The Android client's package name or SHA-1 doesn't match. In Google Cloud, check the package is `app.fintrack.personal` and the SHA-1 is your signing key's fingerprint. |
| Top bar says "⚠ Tap to reconnect" | Tap it and sign in again. On iPhone and the web, Google's sign-in lasts about an hour; changes stay safe on the phone until you reconnect. |
| Top bar says "⚠ Not saved · tap" | The phone's storage is probably full. Free some space, then tap it. |
| Locked out by the app lock | On the lock screen tap **Can't unlock?** and sign in with the same Google account. |
| Nobody appears in the users sheet | Check `REGISTER_URL` in `www/index.html` is your `/exec` link, and that the deployment's **Who has access** is **Anyone**. |
| No daily feedback email | Run **setup** once in Apps Script and allow the email permission. The email only comes when there was feedback that day. |
| iPhone shows a browser bar | It was opened in Safari instead of from the Home Screen icon. Add it to the Home Screen and open it from there. |

## What is inside

| Path | Purpose |
|---|---|
| `www/index.html` | The whole app in one file |
| `www/` (other files) | Install page, privacy page, offline support (`sw.js`), app manifest, icons, fonts, Excel library (`lib/`) |
| `whats-new.txt` | This update's release notes (see Part C) |
| `assets/` | Source artwork for the Android icon and splash screen |
| `scripts/patch-android.js` | Applies FinTrack's Android settings during the build (version, signing, storage, Google sign-in, fingerprint permission, app-data backup off) |
| `user-register/FinTrack-Users.gs` | Script for your private users and feedback Google Sheet (Part E) |
| `.github/workflows/build.yml` | The automatic build and hosting. It also writes `www/version.json`, which the app reads for update and What's new pop-ups |
| `capacitor.config.json`, `package.json`, `package-lock.json` | Android app settings: app id `app.fintrack.personal`, Capacitor 7, Google sign-in, fingerprint lock, files, sharing and Back button components |

Not in the repository on purpose: `android/` and `node_modules/` (rebuilt by each build), and the Android signing key.
