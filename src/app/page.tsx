'use client'

import { useWorkoutStore } from '@/store/useWorkoutStore'

export default function Home() {
  const { currentWorkout } = useWorkoutStore()

  return (
    <div className="flex flex-col gap-6 pt-6">
      <h1 className="text-2xl font-bold text-dawn-teal">5_25 Fitness</h1>
      <div className="rounded-xl bg-dawn-surface p-4 shadow-sm">
        <h2 className="text-sm font-medium text-gray-600 mb-2">
          Current Workout
        </h2>
        <p className="text-dawn-teal">
          Cycle: {currentWorkout.cycleNumber} / Exercise:{' '}
          {currentWorkout.currentExerciseIndex + 1} / Mode:{' '}
          <span
            className={
              currentWorkout.mode === 'LIFTING'
                ? 'text-dawn-citrus font-semibold'
                : 'text-dawn-teal'
            }
          >
            {currentWorkout.mode}
          </span>
        </p>
      </div>
    </div>
  )
}
