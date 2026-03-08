# Open Live Trivia - Frontend Improvement Plan

## Completed Phases

### Phase 1: Critical Fixes ✅
- Moderation Page with tabs (Reported/Banned entries)
- `/moderate` route in App.tsx
- Fixed hardcoded 15-second timer
- Settings toggles functional with localStorage persistence
- Server Version Check on Login

### Phase 2: Core Gameplay Improvements ✅
- Answer display progressive reveal during SPLIT
- Click own attempt to copy to input field
- Player rights badges in drawer
- Toast notification system for errors

---

## Remaining: Phase 3-5

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
- ✅ Already implemented in SettingsPage.tsx

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
