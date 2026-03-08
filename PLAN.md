# Open Live Trivia - React SPA Implementation Plan

## Tech Stack

| Component | Technology |
|-----------|------------|
| Build Tool | Vite |
| Language | TypeScript |
| UI Framework | Tailwind CSS |
| State Management | Zustand |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Real-time | socket.io-client |
| Authentication | Firebase Auth (Google Sign-In) |

## API Reference

- **Base URL**: `https://openlivetrivia.com/api/v1/`
- **WebSocket**: `https://openlivetrivia.com/api/socket.io`

### Key Endpoints

```
POST   /user/register         - Register new user
POST   /user/login           - Login
GET    /user/me              - Get current user info
DELETE /user/delete          - Delete account
GET    /user/availability/{username} - Check username
GET    /user/leaderboard     - Get paginated leaderboard
PUT    /user/rights/{id}/{level} - Update user rights (Admin)

GET    /reported_entry/get_reports - Get reports (with pagination)
PUT    /reported_entry/ban/{id}    - Ban entry
PUT    /reported_entry/unban/{id}  - Unban entry
PUT    /reported_entry/dismiss/{id} - Dismiss report

GET    /system/info          - Get system info
POST   /system/disconnect_everyone - Admin disconnect all
```

### WebSocket Events

**Client -> Server:**
- `authentication` - Send Firebase idToken
- `ATTEMPT` - Submit answer
- `REACTION` - Send emoji reaction
- `REPORT_ENTRY` - Report current entry
- `REQUEST_PLAYER_LIST` - Get list of connected players

**Server -> Client:**
- `authenticated` / `unauthorized` - Auth status
- `WELCOME` - Initial game state
- `PEER_JOIN` / `PEER_LEFT` - Player presence
- `PEER_ATTEMPT` - Other player's answer attempt
- `ROUND` - New round started
- `SPLIT` - Character revealed (every 5s)
- `REVEAL` - Answer revealed
- `COIN_DIFF` - Coin balance change
- `INSUFFICIENT_FUNDS` - Not enough coins
- `PLAYER_LIST` - List of active players
- `PEER_REACTION` - Emoji reaction

---

## Architecture

```
src/
├── api/              # Axios REST client setup
├── components/       # Reusable UI components
├── features/         # Feature-based modules
│   ├── auth/         # Authentication flow
│   ├── game/         # Gameplay screen
│   ├── leaderboard/  # Leaderboard screen
│   ├── mainmenu/     # Main menu screen
│   └── settings/     # Settings screen
├── hooks/            # Custom React hooks
├── lib/              # Utilities (firebase, socket.io)
├── stores/           # Zustand stores
├── types/            # TypeScript interfaces
├── App.tsx           # Main app with routing
└── main.tsx          # Entry point
```

---

## Phase 1: Core Setup (Auth + Gameplay)

### 1. Project Initialization
- Initialize Vite + TypeScript project
- Install dependencies:
  - `npm install tailwindcss @tailwindcss/vite zustand react-router-dom axios socket.io-client firebase`
  - `npm install -D @types/react-router-dom`
- Configure Tailwind CSS with Vite plugin
- Configure TypeScript paths

### 2. Authentication
- Set up Firebase project for web (Firebase Console)
- Create `src/lib/firebase.ts` with Firebase config
- Create Google Sign-In flow using Firebase Auth
- Implement login/register with backend API
- Create auth store (Zustand) for user state
- Implement token persistence (localStorage)
- Create ProtectedRoute component

### 3. Main Menu
- Display user profile (username, avatar, coins)
- Navigation buttons to Game, Leaderboard
- Emulate Android Material Design look

### 4. Game Screen
- Socket.io connection management (create hook)
- Game state handling:
  - Rounds, splits, attempts
  - Player presence
  - Coin management
- Answer submission UI
- Real-time updates display
- Report entry functionality

### 5. Leaderboard
- Fetch paginated leaderboard
- Display ranked users with coins
- Pull-to-refresh

---

## Phase 2: Full Features (Optional)

- Settings screen with preferences
- Moderation features (for MOD+ users):
  - View pending/dismissed/banned reports
  - Ban/unban/dismiss entries
- Responsive design for mobile/desktop
- Sound effects (optional)

---

## Implementation Order

1. Setup project + Tailwind
2. Firebase config + Auth flow
3. Auth store + Protected routes
4. Main menu
5. Socket.io hook + Game store
6. Game screen UI (emulate Android)
7. Leaderboard
8. Polish + Responsive design
