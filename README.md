# Open Live Trivia - Frontend

React-based frontend for Open Live Trivia game.

## Prerequisites

- [mise](https://mise.jdx.dev) - Dev tool manager

## Setup

1. **Install mise** (if not already installed):
   ```bash
   curl https://mise.run | sh
   ```

2. **Add mise to your shell** (`~/.bashrc` or `~/.zshrc`):
   ```bash
   echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc
   ```

3. **Install dependencies**:
   ```bash
   cd ~/Source/open-live-trivia-fe-minimax
   mise install
   ```

4. **Set up environment variables**:
   ```bash
   export ENV_FILE=~/Desktop/olt-keys/.env
   ```
   Or add to your shell profile for persistence.

## Running

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

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
