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

---

# Frontend Improvement Plan (Post-Implementation)

## Overview
This document outlines the plan to bring the web frontend to feature parity with the Android reference app.

---

## Current State Summary

### Working Features
- ✅ Authentication (Google Sign-In via Firebase)
- ✅ Main Menu navigation
- ✅ Game Screen core gameplay (real-time via Socket.io)
- ✅ Leaderboard (basic)
- ✅ Settings (UI skeleton)
- ✅ Player report functionality

### Missing Features (Priority Order)
1. Moderation page (critical)
2. Sound effects
3. Emoji reactions
4. Vibration feedback
5. Server version validation
6. Functional settings/preferences

---

## Phase 1: Critical Fixes (High Priority)

### 1.1 Create Moderation Page
**Files to create/modify:**
- `src/features/moderation/ModerationPage.tsx` (new)
- `src/App.tsx` - Add `/moderate` route

**Requirements:**
- Two tabs: "Reported Entries" and "Banned Entries"
- Display: category, clue, answer, reporter list, timestamp
- Actions: Ban, Unban, Dismiss (per entry)
- Use existing `reportApi` from `src/api/endpoints.ts`
- Admin/Moderator role check on route access

### 1.2 Fix Hardcoded Timer
**File:** `src/features/game/GamePage.tsx:58`

**Current code:**
```typescript
const maxSeconds = totalSplitSeconds || 15;
```

**Fix:** The `totalSplitSeconds` should already come from the server via `WELCOME` and `SPLIT` events. Verify the socket handler passes this correctly from `useSocket.ts`.

### 1.3 Make Settings Functional
**File:** `src/features/settings/SettingsPage.tsx`

**Requirements:**
- Add state management for preferences (use Zustand or localStorage)
- Persist: Sound Effects, Notifications, Relative Time, Show Rules
- Connect toggles to actual state and save/load from backend or localStorage

### 1.4 Server Version Check on Login
**File:** `src/features/auth/LoginPage.tsx`

**Requirements:**
- Call `systemApi.getInfo()` on login
- Compare frontend version with `minAppVersionCode` from server
- Show error/disable login if incompatible
- Show warning if update available (`latestAppVersionCode`)

---

## Phase 2: Core Gameplay Improvements (High Priority)

### 2.1 Fix Answer Display Logic
**File:** `src/features/game/GamePage.tsx:92`

**Current behavior:** Replaces ALL letters with underscores at once
**Expected behavior:** Progressive reveal during SPLIT phase

**Requirements:**
- Track revealed characters count from server (`revealedChars` array in store)
- Display only revealed letters, hide rest with underscores
- Show full answer when `isRevealed` is true

### 2.2 Click Own Attempt to Copy
**File:** `src/features/game/GamePage.tsx`

**Requirements:**
- Make user's own attempts clickable
- On click, copy message to input field for editing/resubmission

### 2.3 Add Player Rights Badges
**File:** `src/features/game/GamePage.tsx` (player drawer)

**Requirements:**
- Display MOD/ADMIN badges next to usernames in player drawer
- Show rights level from `player.rights` property

### 2.4 Improve Error Handling
**Files:** Multiple - add toast notifications

**Requirements:**
- Show user-friendly errors for:
  - Socket connection failures
  - API errors (login, leaderboard, reports)
  - Report submission failures
- Use a toast/notification library or create simple component

---

## Phase 3: Feature Parity (Medium Priority)

### 3.1 Sound Effects System
**Files to create:**
- `src/lib/sounds.ts` - Sound manager
- `src/hooks/useSound.ts` - React hook for sound playback
- Add sound files to `public/sounds/`

**Requirements:**
- Sounds: win, lose, attempt, split
- Respect user preference toggle from settings
- Use Web Audio API or HTML5 Audio

**Socket events to handle:**
- On correct answer win → play win sound
- On someone else wins → play lose sound
- On peer attempt → play attempt sound
- On split event → play split sound

### 3.2 Emoji Reactions
**Files to modify:**
- `src/hooks/useSocket.ts` - Add REACTION handler
- `src/features/game/GamePage.tsx` - Add reaction UI

**Requirements:**
- Add reaction button bar below game card
- Emit `REACTION` socket event with emoji
- Display peer reactions as floating emojis

### 3.3 Vibration Feedback
**File:** `src/features/game/GamePage.tsx`

**Requirements:**
- Vibrate on correct answer win
- Use Navigator.vibrate() API
- Respect user preference toggle

---

## Phase 4: Moderator/Admin Features (Medium Priority)

### 4.1 Leaderboard Moderation Actions
**File:** `src/features/leaderboard/LeaderboardPage.tsx`

**Requirements:**
- Long-press or right-click on user shows context menu
- Options: Promote to MOD, Demote to User (for MOD/ADMIN)
- Call `PUT /user/rights/{userId}/{rightsLevel}` endpoint

### 4.2 Player Drawer Moderation
**File:** `src/features/game/GamePage.tsx`

**Requirements:**
- Long-press on player in drawer shows admin options
- Same as leaderboard - promote/demote rights

### 4.3 Admin: Disconnect Everyone
**File:** `src/features/settings/SettingsPage.tsx`

**Requirements:**
- Only visible for ADMIN role
- Button: "Disconnect All Players"
- Call `POST /system/disconnect_everyone`

---

## Phase 5: Polish & UX Improvements (Low Priority)

### 5.1 Pull-to-Refresh
- Leaderboard: Replace refresh button with pull-to-refresh
- Player drawer: Add pull-to-refresh
- Settings: Add pull-to-refresh

### 5.2 Relative Time Display
- Use date-fns or similar library
- Show "2 minutes ago" instead of absolute dates
- Make configurable in settings

### 5.3 Coin Balance Animation
- Animate coin changes (like Android's CoinsTextView)
- Use CSS transitions for smooth number changes

### 5.4 Loading States
- Add skeleton loaders for all async content
- Improve perceived performance

---

## Technical Reference

### API Endpoints
```
POST   /user/register
POST   /user/login
DELETE /user/delete
GET    /user/availability/{username}
PUT    /user/rights/{userId}/{rightsLevel}
GET    /user/leaderboard
GET    /user/me
GET    /reported_entry/get_reports
PUT    /reported_entry/ban/{reportId}
PUT    /reported_entry/unban/{reportId}
PUT    /reported_entry/dismiss/{reportId}
POST   /system/disconnect_everyone
GET    /system/info
```

### Socket Events
**Incoming:**
- authenticated, welcome, round, split, peer_attempt
- peer_join, peer_left, coin_diff, reveal, player_list
- entry_reported_ok/error, peer_reaction

**Outgoing:**
- authentication, attempt, reaction, report_entry, request_player_list

### User Rights Levels
```
0 = REGULAR (normal player)
1 = MODERATOR (can ban entries, manage reports)
2 = ADMIN (full control, can promote/demote users)
```

---

## Testing Checklist

Before each release, verify:
1. ✅ Authentication works (Google login/logout)
2. ✅ Game flow: join → receive round → submit attempt → see results
3. ✅ Real-time updates: other players' attempts appear
4. ✅ Leaderboard loads and paginates
5. ✅ Settings persist across sessions
6. ✅ Moderation page (as admin) works correctly
7. ✅ No console errors on any page
8. ✅ Works on mobile viewport
