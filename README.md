# Fitness PWA

A mobile-first fitness progressive web app built with Next.js (App Router), Tailwind CSS, and Framer Motion.

## Tech Stack

- **Next.js 15** – App Router
- **Tailwind CSS** – Dawn palette (background, surface, citrus, teal)
- **Zustand** – Global state with LocalStorage persistence
- **Framer Motion** – Animations

## Setup

```bash
npm install
npm run dev
```

## Dawn Palette

| Color   | Hex      | Usage                    |
|---------|----------|--------------------------|
| background | #FAFAFA | App background           |
| surface | #FFFFFF   | Cards, surfaces          |
| citrus  | #E1FF00   | Active / go states       |
| teal    | #008080   | Resting states           |

## State Store

The Zustand store (`useWorkoutStore`) tracks `currentWorkout`:
- `cycleNumber` (1–5)
- `currentExerciseIndex` (0–4)
- `mode` ('LIFTING' | 'RESTING')

State persists to LocalStorage under the key `fitness-workout-storage`.
