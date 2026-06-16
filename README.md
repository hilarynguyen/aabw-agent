<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/26bd7b71-7fb8-419d-bbbc-c53e5bf4b5d0

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. (Optional) Enable Google Sign-In by setting `VITE_GOOGLE_CLIENT_ID` in your `.env` to a
   Google OAuth Web client ID (create one in Google Cloud Console → Credentials, and add your
   dev origin e.g. `http://localhost:3000` to the Authorized JavaScript origins). Without it,
   the login screen still works via the "Continue as Guest" button.
4. Run the app:
   `npm run dev`

## Authentication

The app is gated behind a login screen. Users sign in with **Google** (Google Identity Services);
the returned ID token is verified server-side at `POST /api/auth/google` via Google's `tokeninfo`
endpoint, and the profile (name, email, avatar) is kept in `localStorage`. A guest fallback is
always available. Sign out from the user chip in the chat header.
