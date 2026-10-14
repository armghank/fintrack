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

// Google sign-in with Drive permission: the sign-in component needs the main screen
// to pass Google's permission answer back to it (see @capgo/capacitor-social-login docs).
const mainActivity = "android/app/src/main/java/app/fintrack/personal/MainActivity.java";
fs.writeFileSync(
  mainActivity,
  `package app.fintrack.personal;

import android.content.Intent;
import android.util.Log;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginHandle;
import ee.forgr.capacitor.social.login.GoogleProvider;
import ee.forgr.capacitor.social.login.ModifiedMainActivityForSocialLoginPlugin;
import ee.forgr.capacitor.social.login.SocialLoginPlugin;

public class MainActivity extends BridgeActivity implements ModifiedMainActivityForSocialLoginPlugin {

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode >= GoogleProvider.REQUEST_AUTHORIZE_GOOGLE_MIN && requestCode < GoogleProvider.REQUEST_AUTHORIZE_GOOGLE_MAX) {
            PluginHandle pluginHandle = getBridge().getPlugin("SocialLogin");
            if (pluginHandle == null) {
                Log.i("FinTrack", "SocialLogin plugin handle is null");
                return;
            }
            Plugin plugin = pluginHandle.getInstance();
            if (!(plugin instanceof SocialLoginPlugin)) {
                Log.i("FinTrack", "SocialLogin plugin instance is not SocialLoginPlugin");
                return;
            }
            ((SocialLoginPlugin) plugin).handleGoogleLoginIntent(requestCode, data);
        }
    }

    @Override
    public void IHaveModifiedTheMainActivityForTheUseWithSocialLoginPlugin() {}
}
`
);
console.log("wrote", mainActivity);

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
