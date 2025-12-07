# How to Build the APK for WavePlay

Since WavePlay is built as a **Progressive Web App (PWA)**, you can easily convert it into an Android APK using **PWABuilder**.

## Step 1: Deploy the App
First, your app must be hosted online with HTTPS.
1.  Push this code to a **GitHub Repository**.
2.  Go to **[Vercel](https://vercel.com/)** and import your repository.
3.  Deploy it. You will get a URL like `https://waveplay.vercel.app`.

## Step 2: Generate APK via PWABuilder
1.  Go to **[PWABuilder.com](https://www.pwabuilder.com/)**.
2.  Enter your Vercel URL (e.g., `https://waveplay.vercel.app`) and click **Start**.
3.  Wait for the analysis to finish. Ensure you have a "Security" score and "Manifest" score.
    *   *Note: If icons are missing, you might need to upload real images to `public/images/` and update `manifest.json`.*
4.  Click **Package for Stores**.
5.  Select **Android**.
6.  Click **Generate**.
7.  Download the **Signed APK** or **Bundle**.

## Step 3: Install on Android
1.  Transfer the `.apk` file to your Android phone.
2.  Open it and select **Install**.
    *   *You may need to allow "Install from Unknown Sources".*
3.  Enjoy WavePlay!

## Troubleshooting
*   **"App not installed"**: Ensure you uninstalled any previous version.
*   **Icons not showing**: Replace the placeholder URLs in `public/manifest.json` with actual image files hosted on your server.
