# Steam Store UI Assessment

A responsive storefront recreation with three routes:

- `/` — featured titles and the main store shelf
- `/app/1091500/Cyberpunk_2077/` — Cyberpunk 2077 product page and age confirmation
- `/explore/new/` — discovery catalog, filters, search, and manual pagination

## Run locally in VS Code

Requirements: Node.js 20 or newer.

1. Extract the project ZIP and open its folder in VS Code.
2. Open the VS Code terminal in that folder.
3. Install dependencies and start the dev server:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local URL printed in the terminal.

Copy `.env.example` to `.env.local` to enable live service integrations. On macOS/Linux, run `cp .env.example .env.local`; in Windows PowerShell, run `Copy-Item .env.example .env.local`. Restart the dev server after changing environment values.

## Configure TMDB catalog access

Create a TMDB API key in your TMDB account, then set:

```env
VITE_TMDB_API_KEY=your_tmdb_v3_api_key
```

The catalog uses TMDB trending, discovery, and search endpoints. Until configured, the local catalog remains available. Results are stored by search/filter/page in browser storage and shown when the network or API is unavailable.

## Configure Firebase signup

1. Create a Firebase project and register a Web app.
2. In Firebase Console, enable **Authentication → Sign-in method → Email/Password**.
3. Copy the Web App configuration values to `.env.local`:

   ```env
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_APP_ID=
   ```

Signup uses the Firebase client SDK and Firebase Authentication only. No account is simulated when configuration is missing. Firebase signup needs an active network connection. Web App configuration belongs in the browser; do not put Firebase Admin SDK credentials or private service-account keys in this project.

## Offline behavior

After the site has been opened online once, the service worker caches the app shell and TMDB poster images. TMDB results, wishlist items, and cart items are saved in browser storage. Previously loaded catalog pages remain available offline; a page that has never been loaded cannot be fetched while disconnected. The network indicator reports the current connection state. Firebase signup requires a network connection.

For a local offline check, build and serve the production version over localhost:

```bash
npm run build
npm run preview
```

Open the preview online once so the service worker can install, then switch the browser to offline mode and refresh.

## Accessibility and interaction

- Semantic page landmarks, headings, labels, and live status messages
- Keyboard-operable navigation, controls, forms, and dialogs
- Visible keyboard focus indicators and focus trapping in the signup dialog
- Descriptive image alternatives and state labels for toggle buttons
- Reduced-motion support, responsive layouts, and visible loading/error/empty states

## GitHub assessment handoff

The assessment asks for an initial fork named `Binaire-FreznelAI-Assessment` and a final repository named `Binaire_Freznel_Assessment`. With GitHub CLI installed and authenticated, fork the supplied assessment repository, copy this project into the cloned fork, commit, and push:

```bash
gh repo fork Binaire-0101/FreznelAI-Assessment-1 --fork-name Binaire-FreznelAI-Assessment --clone
# In the cloned fork, replace the assessment files with this project.
git add .
git commit -m "Complete storefront assessment"
git push
gh repo rename Binaire_Freznel_Assessment --repo YOUR_GITHUB_NAME/Binaire-FreznelAI-Assessment
```

Keep `.env.local` out of Git. Do not commit personal API configuration.

Final email subject from the assessment: `Javascript Developer - Web-Store UI Assessment – [Your Full Name]`.
