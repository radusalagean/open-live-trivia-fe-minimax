# [Open Live Trivia](https://openlivetrivia.com/) - Frontend - Minimax LLM Experiment

React-based frontend for Open Live Trivia game.

**Disclaimer:** This web frontend is an experimental project created 100% by prompting the MiniMax M2.5 LLM, to test its capabilities. The backend code was artisanally crafted in 2019 and so was the [Android app](https://play.google.com/store/apps/details?id=com.busytrack.openlivetrivia). Use the Android app if you want a more reliable experience with this game.

## Prerequisites

- Docker
- Docker Compose

## Setup

1. **Create config directory**:
   ```bash
   mkdir -p $HOME/.open-live-trivia_vault/fe
   ```

2. **Create `$HOME/.open-live-trivia_vault/fe/firebase-config.js`** with your Firebase configuration:
   ```javascript
   window.FIREBASE_CONFIG = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

3. **Create `$HOME/.open-live-trivia_vault/fe/config.js`** with your API URL:
   ```javascript
   window.APP_CONFIG = {
     apiUrl: "http://localhost:8080/api"
   };
   ```

   - For local development, use `http://localhost:8080/api`
   - For production, use `https://openlivetrivia.com/api`

## Running (Docker)

```bash
docker compose up -d
```

The app will be available at `http://localhost:5173`

## Tech Stack

- Vite
- React + TypeScript
- Tailwind CSS
- Zustand (state management)
- React Router v6
- Firebase Auth
- Socket.io Client
