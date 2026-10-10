// Applies FinTrack's Android settings to the project that `npx cap add android` generates:
// - version number from the build (so every new APK installs as an update)
// - signing with your private key from GitHub secrets (same key = updates keep your data)
// - storage permission for older Android versions (to save Excel files into Documents/FinTrack)
const fs = require("fs");

function patch(file, edits) {
  let s = fs.readFileSync(file, "utf8");
  for (const [find, replace, marker] of edits) {
    if (marker && s.includes(marker)) continue; // already patched
    if (!s.includes(find)) throw new Error(`Could not find expected text in ${file}:\n${find}`);
    s = s.replace(find, replace);
  }
  fs.writeFileSync(file, s);
  console.log("patched", file);
}

patch("android/app/build.gradle", [
  [
    `        versionCode 1\n        versionName "1.0"`,
    `        versionCode((project.findProperty("ftVersionCode") ?: "1") as Integer)\n        versionName((project.findProperty("ftVersionName") ?: "1.0") as String)`,
    "ftVersionCode",
  ],
  [
    `    buildTypes {\n        release {\n            minifyEnabled false`,
    `    signingConfigs {
        release {
            if (System.getenv("FT_KEYSTORE")) {
                storeFile file(System.getenv("FT_KEYSTORE"))
                storePassword System.getenv("FT_KEYSTORE_PASSWORD")
                keyAlias(System.getenv("FT_KEY_ALIAS") ?: "fintrack")
                keyPassword System.getenv("FT_KEYSTORE_PASSWORD")
            }
        }
    }
    buildTypes {
        release {
            signingConfig System.getenv("FT_KEYSTORE") ? signingConfigs.release : signingConfigs.debug
            minifyEnabled false`,
    "FT_KEYSTORE",
  ],
]);

patch("android/app/src/main/AndroidManifest.xml", [
  [
    `    <application\n        android:allowBackup="true"`,
    `    <application\n        android:requestLegacyExternalStorage="true"\n        android:allowBackup="true"`,
    "requestLegacyExternalStorage",
  ],
  [
    `    <uses-permission android:name="android.permission.INTERNET" />`,
    `    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="29" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />`,
    "WRITE_EXTERNAL_STORAGE",
  ],
]);
