"use client";

import { useWorkoutStore } from "@/store/useWorkoutStore";

export default function Home() {
  const { currentWorkout, setMode } = useWorkoutStore();

  return (
    <div className="bg-dawn-surface rounded-t-3xl flex-1 p-6 min-h-[60vh] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Current Workout
      </h1>
      <div className="space-y-3">
        <p className="text-gray-600">
          Cycle: <span className="font-semibold">{currentWorkout.cycleNumber}</span> / 5
        </p>
        <p className="text-gray-600">
          Exercise: <span className="font-semibold">{currentWorkout.currentExerciseIndex + 1}</span> / 5
        </p>
        <p className="text-gray-600">
          Mode:{" "}
          <span
            className={`font-semibold ${
              currentWorkout.mode === "LIFTING"
                ? "text-dawn-citrus"
                : "text-dawn-teal"
            }`}
          >
            {currentWorkout.mode}
          </span>
        </p>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setMode("LIFTING")}
            className="px-4 py-2 rounded-lg bg-dawn-citrus text-gray-900 font-medium active:opacity-90"
          >
            Lifting
          </button>
          <button
            onClick={() => setMode("RESTING")}
            className="px-4 py-2 rounded-lg bg-dawn-teal text-white font-medium active:opacity-90"
          >
            Resting
          </button>
        </div>
      </div>
    </div>
  );
}
