import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type WorkoutMode = 'LIFTING' | 'RESTING'

export interface CurrentWorkout {
  cycleNumber: number
  currentExerciseIndex: number
  mode: WorkoutMode
}

interface WorkoutStore {
  currentWorkout: CurrentWorkout
  setCycleNumber: (cycleNumber: number) => void
  setCurrentExerciseIndex: (index: number) => void
  setMode: (mode: WorkoutMode) => void
  setCurrentWorkout: (workout: Partial<CurrentWorkout>) => void
  resetWorkout: () => void
}

const defaultWorkout: CurrentWorkout = {
  cycleNumber: 1,
  currentExerciseIndex: 0,
  mode: 'LIFTING',
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set) => ({
      currentWorkout: defaultWorkout,

      setCycleNumber: (cycleNumber) =>
        set((state) => ({
          currentWorkout: {
            ...state.currentWorkout,
            cycleNumber: Math.max(1, Math.min(5, cycleNumber)),
          },
        })),

      setCurrentExerciseIndex: (currentExerciseIndex) =>
        set((state) => ({
          currentWorkout: {
            ...state.currentWorkout,
            currentExerciseIndex: Math.max(0, Math.min(4, currentExerciseIndex)),
          },
        })),

      setMode: (mode) =>
        set((state) => ({
          currentWorkout: {
            ...state.currentWorkout,
            mode,
          },
        })),

      setCurrentWorkout: (workout) =>
        set((state) => ({
          currentWorkout: {
            ...state.currentWorkout,
            ...workout,
            ...(workout.cycleNumber !== undefined && {
              cycleNumber: Math.max(1, Math.min(5, workout.cycleNumber)),
            }),
            ...(workout.currentExerciseIndex !== undefined && {
              currentExerciseIndex: Math.max(
                0,
                Math.min(4, workout.currentExerciseIndex)
              ),
            }),
          },
        })),

      resetWorkout: () =>
        set({
          currentWorkout: defaultWorkout,
        }),
    }),
    {
      name: 'fitness-workout-storage',
      storage: {
        getItem: (name) => {
          if (typeof window === 'undefined') return null
          const str = localStorage.getItem(name)
          return str ? JSON.parse(str) : null
        },
        setItem: (name, value) => {
          if (typeof window === 'undefined') return
          localStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          if (typeof window === 'undefined') return
          localStorage.removeItem(name)
        },
      },
    }
  )
)
