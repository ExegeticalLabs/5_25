// User types
export interface User {
  uid: string;
  email: string;
  name: string;
  createdDate: string;
  currentBlockId: string | null;
  preferences: UserPreferences;
}

export interface UserPreferences {
  darkMode: boolean;
  notificationsEnabled: boolean;
  audioCuesEnabled: boolean;
  cardioUnit: 'mph' | 'km/h';
}

// Block types
export interface Block {
  blockId: string;
  userId: string;
  blockNumber: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'archived';
  liftingExercises: {
    upper: string[];
    lower: string[];
  };
  cardio: {
    cardioType: CardioType;
    equipment?: string;
  };
  core: {
    comboNumber: 1 | 2 | 3 | 4;
    exercises: string[];
    swappedExercise?: string;
  };
}

export type CardioType = 'running' | 'biking' | 'rowing' | 'stair_climbing' | 'elliptical' | 'swimming' | 'outdoor_running' | 'jump_rope';

// Exercise types
export interface Exercise {
  exerciseId: string;
  exerciseName: string;
  category: ExerciseCategory;
  equipmentType: EquipmentType;
  description?: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
}

export type ExerciseCategory = 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'quads' | 'hamstrings' | 'glutes' | 'calves' | 'core';
export type EquipmentType = 'dumbbell' | 'barbell' | 'machine' | 'cable' | 'bodyweight' | 'cardio_equipment';

// Workout types
export type WorkoutType = 'lifting_upper' | 'lifting_lower' | 'cardio' | 'core' | 'rest';

export interface Workout {
  workoutId: string;
  userId: string;
  blockId: string;
  workoutDate: string;
  workoutType: WorkoutType;
  status: 'completed' | 'in_progress' | 'abandoned' | 'skipped';
  totalDurationMinutes?: number;
  userNotes?: string;
  workoutData?: LiftingWorkoutData | CardioWorkoutData | CoreWorkoutData;
}

// Lifting workout data
export interface LiftingWorkoutData {
  exercises: LiftingExerciseData[];
  restSecondsBetweenCycles: number;
}

export interface LiftingExerciseData {
  exerciseId: string;
  exerciseName: string;
  weightUsed: number;
  cycles: CycleData[];
  notesForExercise?: string;
}

export interface CycleData {
  cycleNumber: number;
  repsCompleted: number;
  failedOnRep?: number;
  notes?: string;
}

// Cardio workout data
export interface CardioWorkoutData {
  cardioType: CardioType;
  equipment?: string;
  totalDistance?: number;
  roundsCompleted: CardioRound[];
  notesOverall?: string;
}

export interface CardioRound {
  roundNumber: number;
  zoneAPace?: number;
  zoneBPace?: number;
  zoneCPace?: number;
  notes?: string;
}

// Core workout data
export interface CoreWorkoutData {
  coreComboNumber: 1 | 2 | 3 | 4;
  exercises: string[];
  roundsCompleted: number;
  swappedExercise?: string;
  notes?: string;
}

// Schedule types
export type WeekType = 'week_a' | 'week_b';

export interface DaySchedule {
  dayNumber: number;
  dayName: string;
  workoutType: WorkoutType;
}

export interface WeekSchedule {
  weekType: WeekType;
  days: DaySchedule[];
}

// Auth types
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Live workout state types
export interface LiveLiftingState {
  workoutId: string;
  blockId: string;
  workoutType: 'lifting_upper' | 'lifting_lower';
  exercises: LiftingExerciseData[];
  currentExerciseIndex: number;
  currentCycleIndex: number;
  currentRep: number;
  isResting: boolean;
  restTimeRemaining: number;
  startTime: number;
  status: 'not_started' | 'active' | 'resting' | 'completed' | 'paused';
}

export interface LiveCardioState {
  workoutId: string;
  blockId: string;
  cardioType: CardioType;
  currentRound: number;
  currentZone: 'A' | 'B' | 'C';
  timeRemaining: number;
  rounds: CardioRound[];
  startTime: number;
  status: 'not_started' | 'active' | 'completed' | 'paused';
}

export interface LiveCoreState {
  workoutId: string;
  blockId: string;
  comboNumber: 1 | 2 | 3 | 4;
  exercises: string[];
  roundsCompleted: number;
  timeRemaining: number;
  startTime: number;
  status: 'not_started' | 'active' | 'completed' | 'paused';
}
