# CyberGuard AI frontend
npm install && npm run dev  -> http://localhost:5173
Backend: http://127.0.0.1:8000 (override with VITE_API_URL). Set VITE_DEMO_MODE=true to force demo telemetry.

Sign-up creates a browser-local demo account. This is not production authentication.
To show the Google sign-in button, set `VITE_GOOGLE_CLIENT_ID` to a Google OAuth web client ID
and add the app's local and deployed origins to that client's authorized JavaScript origins.
Google sign-in currently starts a local demo session; production use requires server-side
verification of Google's credential and a backend authentication/session flow.
