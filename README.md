# 5/25 Fitness App

A full-stack web/mobile fitness application implementing the 5/25 workout method.

## Tech Stack
- **Frontend**: React 19 + TypeScript
- **Backend**: Node.js + Express
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication

## Project Structure
```
5_25/
├── frontend/          # React/TypeScript app
│   └── src/
│       ├── contexts/  # Auth context
│       ├── pages/     # App screens
│       ├── services/  # Firebase services
│       ├── types/     # TypeScript types
│       └── utils/     # Exercise library, schedule logic
├── backend/           # Express API
│   └── src/
│       ├── routes/    # REST endpoints
│       ├── middleware/ # Firebase auth middleware
│       └── config/    # Firebase Admin SDK
└── .env.example
```

## Quick Start

### Firebase Setup
1. Create project at firebase.google.com
2. Enable Authentication (Email/Password)
3. Enable Firestore database
4. Get web app config

### Frontend
```bash
cd frontend
cp ../.env.example .env
# Fill Firebase config in .env
npm install
npm start
```

### Backend (optional)
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

## App Features

### Screens
- Login / Signup with Firebase auth
- Exercise Setup (Pick-5 for upper/lower per block)
- Home screen with today's workout, weekly calendar, stats
- Live Lifting: 5 cycles x 10 reps, weight tracking, failure detection, 2-min rest timer
- Live Cardio: 5 rounds x 5 min (Zone A → B → C), animated zone bars
- Live Core: 10-min AMRAP round counter
- Workout History with filters
- Progress tracking with weight progression
- Settings with dark mode, audio cues

### 5/25 Program Logic
- 6-week blocks with alternating Week A/B
- Lifting: 5 exercises, 10 reps each, no rest between = 1 cycle; rest 2 min; repeat 5 cycles
- Tempo: 2 sec up / 2 sec down (strict)
- Progression rules: Fail cycle 2-3 → drop; Fail cycle 4-5 → keep; Perfect → increase if easy
- Cardio: 5 rounds x (2:00 Zone A + 2:00 Zone B + 1:00 Zone C)
- Core AMRAP: 10 min post-cardio finisher

## Database Schema (Firestore)

```
users/{uid}           name, email, currentBlockId, preferences
blocks/{blockId}      userId, exercises (upper/lower), cardio, core, status
workouts/{workoutId}  userId, blockId, type, data (weights/reps/zones/rounds)
```
