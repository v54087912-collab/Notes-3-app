# WavePlay – Music Player App

Professional Music Player App with Neon UI, Glassmorphism, and 3D Buttons.

## Features
- **Modern Neon UI**: Smooth animations and premium feel.
- **Offline Support**: Caches songs and interface for offline use (PWA).
- **Playlist System**: Create and manage local playlists.
- **Background Play**: Music keeps playing when you switch tabs or minimize (on supported browsers/modes).
- **Search & Sort**: Filter by category or search term.

## Setup Instructions

### Option 1: Run on Browser (Quickest)

1.  You need a local web server because of Service Worker policies and CORS.
2.  If you have Python installed:
    ```bash
    cd public
    python3 -m http.server
    ```
3.  Open `http://localhost:8000` in your browser.
4.  To verify "App" behavior on Desktop: Open Chrome DevTools -> Toggle Device Toolbar -> Select a Mobile Device (e.g., iPhone 12).

### Option 2: Convert to Android APK

To turn this into a real APK file for Android:

#### Method A: Website 2 APK Builder (Easiest)
1.  Download a tool like **Website 2 APK Builder** (Windows).
2.  Select "Local HTML Site".
3.  Choose the folder containing these files.
4.  Set App Title "WavePlay" and Package Name `com.waveplay.music`.
5.  Click **Build APK**.

#### Method B: Capacitor (Professional)
1.  Install Node.js.
2.  Run these commands in this folder:
    ```bash
    npm init -y
    npm install @capacitor/core @capacitor/cli @capacitor/android
    npx cap init WavePlay com.waveplay.music --web-dir=.
    npx cap add android
    npx cap open android
    ```
3.  This opens Android Studio. Build the APK from there.

#### Method C: Trusted Web Activity (TWA)
1.  Deploy this code to a live URL (e.g., GitHub Pages, Netlify, Vercel).
2.  Use [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) to wrap the URL into an APK.

### Deploy on Vercel
1.  Push this code to a GitHub repository.
2.  Go to [Vercel](https://vercel.com) and click "Add New Project".
3.  Import the repository.
4.  Vercel will automatically detect the configuration.
5.  Click **Deploy**.
    *   *Note*: A `vercel.json` file is included to ensure the Service Worker and caching work correctly.

## Adding Songs
Edit `js/songs.js` to add your music.
Format:
```javascript
{
  "id": "unique_id",
  "title": "Song Title",
  "artist": "Artist Name",
  "category": "Genre",
  "cover": "https://link.to/image.jpg",
  "url": "https://link.to/song.mp3" // Use GitHub Raw Links or any direct MP3 link
}
```

## Note on GitHub Raw Links
Ensure the links are directly pointing to the file (raw) and that the repository allows access.
