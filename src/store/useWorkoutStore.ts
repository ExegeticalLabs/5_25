import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type WorkoutMode = "LIFTING" | "RESTING";

const noopStorage: Storage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  key: () => null,
  length: 0,
  clear: () => {},
};

export interface CurrentWorkout {
  cycleNumber: number;
  currentExerciseIndex: number;
  mode: WorkoutMode;
}

interface WorkoutStore {
  currentWorkout: CurrentWorkout;
  setCycleNumber: (cycle: number) => void;
  setCurrentExerciseIndex: (index: number) => void;
  setMode: (mode: WorkoutMode) => void;
  setCurrentWorkout: (workout: Partial<CurrentWorkout>) => void;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set) => ({
      currentWorkout: {
        cycleNumber: 1,
        currentExerciseIndex: 0,
        mode: "LIFTING",
      },
      setCycleNumber: (cycleNumber) =>
        set((state) => ({
          currentWorkout: {
            ...state.currentWorkout,
            cycleNumber: clamp(cycleNumber, 1, 5),
          },
        })),
      setCurrentExerciseIndex: (currentExerciseIndex) =>
        set((state) => ({
          currentWorkout: {
            ...state.currentWorkout,
            currentExerciseIndex: clamp(currentExerciseIndex, 0, 4),
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
            cycleNumber: workout.cycleNumber !== undefined
              ? clamp(workout.cycleNumber, 1, 5)
              : state.currentWorkout.cycleNumber,
            currentExerciseIndex: workout.currentExerciseIndex !== undefined
              ? clamp(workout.currentExerciseIndex, 0, 4)
              : state.currentWorkout.currentExerciseIndex,
          },
        })),
    }),
    {
      name: "fitness-workout-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : noopStorage
      ),
    }
  )
);
