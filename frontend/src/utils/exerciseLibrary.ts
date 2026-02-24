import { Exercise, ExerciseCategory } from '../types';

export const EXERCISE_LIBRARY: Exercise[] = [
  // CHEST
  { exerciseId: 'ex_chest_01', exerciseName: 'Dumbbell Flat Bench Press', category: 'chest', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_chest_02', exerciseName: 'Dumbbell Incline Bench Press', category: 'chest', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_chest_03', exerciseName: 'Dumbbell Fly', category: 'chest', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_chest_04', exerciseName: 'Barbell Bench Press', category: 'chest', equipmentType: 'barbell', difficultyLevel: 'intermediate' },
  { exerciseId: 'ex_chest_05', exerciseName: 'Incline Barbell Bench Press', category: 'chest', equipmentType: 'barbell', difficultyLevel: 'intermediate' },
  { exerciseId: 'ex_chest_06', exerciseName: 'Chest Press Machine', category: 'chest', equipmentType: 'machine', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_chest_07', exerciseName: 'Incline Press Machine', category: 'chest', equipmentType: 'machine', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_chest_08', exerciseName: 'Pec Deck / Machine Fly', category: 'chest', equipmentType: 'machine', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_chest_09', exerciseName: 'Cable Crossover', category: 'chest', equipmentType: 'cable', difficultyLevel: 'intermediate' },
  { exerciseId: 'ex_chest_10', exerciseName: 'User Choice (Chest)', category: 'chest', equipmentType: 'bodyweight', difficultyLevel: 'beginner' },

  // BACK
  { exerciseId: 'ex_back_01', exerciseName: 'One-Arm Dumbbell Row', category: 'back', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_back_02', exerciseName: 'Lat Pulldown', category: 'back', equipmentType: 'cable', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_back_03', exerciseName: 'Assisted Pull-Up', category: 'back', equipmentType: 'machine', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_back_04', exerciseName: 'Seated Cable Row', category: 'back', equipmentType: 'cable', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_back_05', exerciseName: 'Row Machine', category: 'back', equipmentType: 'machine', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_back_06', exerciseName: 'Dumbbell Row', category: 'back', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_back_07', exerciseName: 'Barbell Bent-Over Row', category: 'back', equipmentType: 'barbell', difficultyLevel: 'intermediate' },
  { exerciseId: 'ex_back_08', exerciseName: 'Straight-Arm Cable Pulldown', category: 'back', equipmentType: 'cable', difficultyLevel: 'intermediate' },
  { exerciseId: 'ex_back_09', exerciseName: 'Pull-Up', category: 'back', equipmentType: 'bodyweight', difficultyLevel: 'advanced' },
  { exerciseId: 'ex_back_10', exerciseName: 'User Choice (Back)', category: 'back', equipmentType: 'bodyweight', difficultyLevel: 'beginner' },

  // SHOULDERS
  { exerciseId: 'ex_shoulders_01', exerciseName: 'Standing Dumbbell Overhead Press', category: 'shoulders', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_shoulders_02', exerciseName: 'Seated Dumbbell Overhead Press', category: 'shoulders', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_shoulders_03', exerciseName: 'Arnold Press', category: 'shoulders', equipmentType: 'dumbbell', difficultyLevel: 'intermediate' },
  { exerciseId: 'ex_shoulders_04', exerciseName: 'Standing Barbell Overhead Press', category: 'shoulders', equipmentType: 'barbell', difficultyLevel: 'intermediate' },
  { exerciseId: 'ex_shoulders_05', exerciseName: 'Push Press', category: 'shoulders', equipmentType: 'barbell', difficultyLevel: 'intermediate' },
  { exerciseId: 'ex_shoulders_06', exerciseName: 'Shoulder Press Machine', category: 'shoulders', equipmentType: 'machine', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_shoulders_07', exerciseName: 'Smith Machine Overhead Press', category: 'shoulders', equipmentType: 'machine', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_shoulders_08', exerciseName: 'Dumbbell Lateral Raise', category: 'shoulders', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_shoulders_09', exerciseName: 'Cable Lateral Raise', category: 'shoulders', equipmentType: 'cable', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_shoulders_10', exerciseName: 'Dumbbell Rear-Delt Raise', category: 'shoulders', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_shoulders_11', exerciseName: 'Reverse Pec Deck', category: 'shoulders', equipmentType: 'machine', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_shoulders_12', exerciseName: 'Face Pull (Cable)', category: 'shoulders', equipmentType: 'cable', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_shoulders_13', exerciseName: 'Dumbbell Front Raise', category: 'shoulders', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_shoulders_14', exerciseName: 'Upright Row', category: 'shoulders', equipmentType: 'barbell', difficultyLevel: 'intermediate' },
  { exerciseId: 'ex_shoulders_15', exerciseName: 'User Choice (Shoulders)', category: 'shoulders', equipmentType: 'bodyweight', difficultyLevel: 'beginner' },

  // BICEPS
  { exerciseId: 'ex_biceps_01', exerciseName: 'Dumbbell Curl', category: 'biceps', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_biceps_02', exerciseName: 'Alternate Dumbbell Curl', category: 'biceps', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_biceps_03', exerciseName: 'Incline Dumbbell Curl', category: 'biceps', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_biceps_04', exerciseName: 'Hammer Curl', category: 'biceps', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_biceps_05', exerciseName: 'Concentration Curl', category: 'biceps', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_biceps_06', exerciseName: 'Barbell Curl / EZ-Bar Curl', category: 'biceps', equipmentType: 'barbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_biceps_07', exerciseName: 'Preacher Curl', category: 'biceps', equipmentType: 'machine', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_biceps_08', exerciseName: 'Cable Curl', category: 'biceps', equipmentType: 'cable', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_biceps_09', exerciseName: 'User Choice (Biceps)', category: 'biceps', equipmentType: 'bodyweight', difficultyLevel: 'beginner' },

  // TRICEPS
  { exerciseId: 'ex_triceps_01', exerciseName: 'Cable Pressdown / Triceps Pushdown', category: 'triceps', equipmentType: 'cable', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_triceps_02', exerciseName: 'Overhead Triceps Extension', category: 'triceps', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_triceps_03', exerciseName: 'Lying Triceps Extension / Skullcrusher', category: 'triceps', equipmentType: 'dumbbell', difficultyLevel: 'intermediate' },
  { exerciseId: 'ex_triceps_04', exerciseName: 'Seated Triceps Press', category: 'triceps', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_triceps_05', exerciseName: 'Triceps Kickback', category: 'triceps', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_triceps_06', exerciseName: 'Bench Dip', category: 'triceps', equipmentType: 'bodyweight', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_triceps_07', exerciseName: 'Dip Machine (Assisted)', category: 'triceps', equipmentType: 'machine', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_triceps_08', exerciseName: 'User Choice (Triceps)', category: 'triceps', equipmentType: 'bodyweight', difficultyLevel: 'beginner' },

  // QUADS
  { exerciseId: 'ex_quads_01', exerciseName: 'Goblet Squat', category: 'quads', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_quads_02', exerciseName: 'Dumbbell Front Squat', category: 'quads', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_quads_03', exerciseName: 'Dumbbell Squat (Suitcase)', category: 'quads', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_quads_04', exerciseName: 'Heels-Elevated Goblet Squat', category: 'quads', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_quads_05', exerciseName: 'Step-Up (DB)', category: 'quads', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_quads_06', exerciseName: 'Back Squat', category: 'quads', equipmentType: 'barbell', difficultyLevel: 'intermediate' },
  { exerciseId: 'ex_quads_07', exerciseName: 'Front Squat', category: 'quads', equipmentType: 'barbell', difficultyLevel: 'intermediate' },
  { exerciseId: 'ex_quads_08', exerciseName: 'Leg Press', category: 'quads', equipmentType: 'machine', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_quads_09', exerciseName: 'Hack Squat', category: 'quads', equipmentType: 'machine', difficultyLevel: 'intermediate' },
  { exerciseId: 'ex_quads_10', exerciseName: 'Smith Squat', category: 'quads', equipmentType: 'machine', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_quads_11', exerciseName: 'Leg Extension', category: 'quads', equipmentType: 'machine', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_quads_12', exerciseName: 'User Choice (Quads)', category: 'quads', equipmentType: 'bodyweight', difficultyLevel: 'beginner' },

  // HAMSTRINGS
  { exerciseId: 'ex_hamstrings_01', exerciseName: 'Dumbbell Romanian Deadlift (RDL)', category: 'hamstrings', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_hamstrings_02', exerciseName: 'Dumbbell Stiff-Leg Deadlift', category: 'hamstrings', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_hamstrings_03', exerciseName: 'Single-Leg Dumbbell RDL', category: 'hamstrings', equipmentType: 'dumbbell', difficultyLevel: 'intermediate' },
  { exerciseId: 'ex_hamstrings_04', exerciseName: 'Barbell Romanian Deadlift', category: 'hamstrings', equipmentType: 'barbell', difficultyLevel: 'intermediate' },
  { exerciseId: 'ex_hamstrings_05', exerciseName: 'Straight-Leg Deadlift', category: 'hamstrings', equipmentType: 'barbell', difficultyLevel: 'intermediate' },
  { exerciseId: 'ex_hamstrings_06', exerciseName: 'Conventional Deadlift', category: 'hamstrings', equipmentType: 'barbell', difficultyLevel: 'intermediate' },
  { exerciseId: 'ex_hamstrings_07', exerciseName: 'Trap-Bar Deadlift', category: 'hamstrings', equipmentType: 'barbell', difficultyLevel: 'intermediate' },
  { exerciseId: 'ex_hamstrings_08', exerciseName: 'Seated Leg Curl', category: 'hamstrings', equipmentType: 'machine', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_hamstrings_09', exerciseName: 'Lying Leg Curl', category: 'hamstrings', equipmentType: 'machine', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_hamstrings_10', exerciseName: 'Back Extension / Hip Extension Machine', category: 'hamstrings', equipmentType: 'machine', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_hamstrings_11', exerciseName: 'User Choice (Hamstrings)', category: 'hamstrings', equipmentType: 'bodyweight', difficultyLevel: 'beginner' },

  // GLUTES
  { exerciseId: 'ex_glutes_01', exerciseName: 'Hip Thrust / Weighted Glute Bridge', category: 'glutes', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_glutes_02', exerciseName: 'Hip Thrust Machine / Glute Drive', category: 'glutes', equipmentType: 'machine', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_glutes_03', exerciseName: 'Walking Lunge (DB)', category: 'glutes', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_glutes_04', exerciseName: 'Reverse Lunge (DB)', category: 'glutes', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_glutes_05', exerciseName: 'Split Squat (DB)', category: 'glutes', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_glutes_06', exerciseName: 'Bulgarian Split Squat (DB)', category: 'glutes', equipmentType: 'dumbbell', difficultyLevel: 'intermediate' },
  { exerciseId: 'ex_glutes_07', exerciseName: 'Lateral Lunge (DB)', category: 'glutes', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_glutes_08', exerciseName: 'Reverse Lunge (Barbell)', category: 'glutes', equipmentType: 'barbell', difficultyLevel: 'intermediate' },
  { exerciseId: 'ex_glutes_09', exerciseName: 'Split Squat (Barbell)', category: 'glutes', equipmentType: 'barbell', difficultyLevel: 'intermediate' },
  { exerciseId: 'ex_glutes_10', exerciseName: 'Smith Split Squat / Smith Lunge', category: 'glutes', equipmentType: 'machine', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_glutes_11', exerciseName: 'Single-Leg Leg Press', category: 'glutes', equipmentType: 'machine', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_glutes_12', exerciseName: 'User Choice (Glutes)', category: 'glutes', equipmentType: 'bodyweight', difficultyLevel: 'beginner' },

  // CALVES
  { exerciseId: 'ex_calves_01', exerciseName: 'Standing Calf Raise (Machine)', category: 'calves', equipmentType: 'machine', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_calves_02', exerciseName: 'Seated Calf Raise (Machine)', category: 'calves', equipmentType: 'machine', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_calves_03', exerciseName: 'Standing Calf Raise (DB)', category: 'calves', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_calves_04', exerciseName: 'Single-Leg Calf Raise (DB)', category: 'calves', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_calves_05', exerciseName: 'Standing Calf Raise (Barbell)', category: 'calves', equipmentType: 'barbell', difficultyLevel: 'intermediate' },
  { exerciseId: 'ex_calves_06', exerciseName: 'Bent Leg Calf Raise', category: 'calves', equipmentType: 'bodyweight', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_calves_07', exerciseName: 'Wall Lean Calf Raise', category: 'calves', equipmentType: 'bodyweight', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_calves_08', exerciseName: 'Wall Lean Single-Leg Calf Raise', category: 'calves', equipmentType: 'bodyweight', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_calves_09', exerciseName: 'User Choice (Calves)', category: 'calves', equipmentType: 'bodyweight', difficultyLevel: 'beginner' },

  // CORE
  { exerciseId: 'ex_core_01', exerciseName: 'Dead Bug', category: 'core', equipmentType: 'bodyweight', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_core_02', exerciseName: 'RKC Plank', category: 'core', equipmentType: 'bodyweight', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_core_03', exerciseName: 'Bird Dog', category: 'core', equipmentType: 'bodyweight', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_core_04', exerciseName: 'Side Plank', category: 'core', equipmentType: 'bodyweight', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_core_05', exerciseName: 'Reverse Crunch', category: 'core', equipmentType: 'bodyweight', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_core_06', exerciseName: 'Hollow Hold', category: 'core', equipmentType: 'bodyweight', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_core_07', exerciseName: 'Forearm Plank', category: 'core', equipmentType: 'bodyweight', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_core_08', exerciseName: 'Plank Shoulder Taps', category: 'core', equipmentType: 'bodyweight', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_core_09', exerciseName: 'Sit-Up (Controlled)', category: 'core', equipmentType: 'bodyweight', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_core_10', exerciseName: 'High Plank', category: 'core', equipmentType: 'bodyweight', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_core_11', exerciseName: 'Body Saw', category: 'core', equipmentType: 'bodyweight', difficultyLevel: 'intermediate' },
  { exerciseId: 'ex_core_12', exerciseName: 'Pallof Press', category: 'core', equipmentType: 'cable', difficultyLevel: 'beginner' },
];

export const CORE_COMBOS: { [key: number]: string[] } = {
  1: ['ex_core_01', 'ex_core_02', 'ex_core_03', 'ex_core_04'],
  2: ['ex_core_05', 'ex_core_06', 'ex_core_07', 'ex_core_08'],
  3: ['ex_core_09', 'ex_core_05', 'ex_core_10', 'ex_core_11'],
  4: ['ex_core_12', 'ex_core_04', 'ex_core_03', 'ex_core_02'],
};

export const getExercisesByCategory = (category: ExerciseCategory): Exercise[] => {
  return EXERCISE_LIBRARY.filter(ex => ex.category === category);
};

export const getExerciseById = (id: string): Exercise | undefined => {
  return EXERCISE_LIBRARY.find(ex => ex.exerciseId === id);
};

export const UPPER_CATEGORIES: ExerciseCategory[] = ['chest', 'back', 'shoulders', 'biceps', 'triceps'];
export const LOWER_CATEGORIES: ExerciseCategory[] = ['quads', 'hamstrings', 'glutes', 'calves'];

export const CATEGORY_DISPLAY_NAMES: { [key in ExerciseCategory]: string } = {
  chest: 'Chest',
  back: 'Back',
  shoulders: 'Shoulders',
  biceps: 'Biceps',
  triceps: 'Triceps',
  quads: 'Quads',
  hamstrings: 'Hamstrings / Hinge',
  glutes: 'Glutes / Accessory',
  calves: 'Calves',
  core: 'Core',
};

export const CARDIO_TYPES = [
  { id: 'running', label: 'Treadmill Running' },
  { id: 'outdoor_running', label: 'Outdoor Running' },
  { id: 'biking', label: 'Stationary Bike' },
  { id: 'rowing', label: 'Rowing Machine' },
  { id: 'stair_climbing', label: 'Stair Climber' },
  { id: 'elliptical', label: 'Elliptical' },
  { id: 'swimming', label: 'Swimming' },
  { id: 'jump_rope', label: 'Jump Rope' },
];

export const CORE_COMBO_NAMES: { [key: number]: string } = {
  1: 'Combo 1 — Foundational Stability (Recommended)',
  2: 'Combo 2 — Abs + Stability Blend',
  3: 'Combo 3 — Traditional + Modern Core',
  4: 'Combo 4 — Anti-Rotation / Full Trunk Control',
};
