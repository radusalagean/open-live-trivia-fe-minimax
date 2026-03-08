# Open Live Trivia - Frontend

React-based frontend for Open Live Trivia game.

**Disclaimer:** This web frontend is an experimental project created 100% by prompting the MiniMax M2.5 LLM, to test its capabilities. The backend code was artisanally crafted in 2019 and so was the [Android app](https://play.google.com/store/apps/details?id=com.busytrack.openlivetrivia). Use the Android app if you want a more reliable experience with this game.

## Prerequisites

- Docker
- Docker Compose
- Create `$HOME/.open-live-trivia_vault/fe/.env` with environment variables (see `env/fe.env` for required variables)

## Running (Docker)

```bash
docker compose up -d
```

The app will be available at `http://localhost:5173`

## Running (Native)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   export ENV_FILE=$HOME/.open-live-trivia_vault/fe/.env
   ```

3. **Run**:
   ```bash
   npm run dev
   ```

## Building

```bash
npm run build
```

## Tech Stack

- Vite
- React + TypeScript
- Tailwind CSS
- Zustand (state management)
- React Router v6
- Firebase Auth
- Socket.io Client
