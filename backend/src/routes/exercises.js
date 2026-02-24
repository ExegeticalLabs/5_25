const express = require('express');
const router = express.Router();

// Exercise library (same as frontend, so client and server are in sync)
const EXERCISE_LIBRARY = [
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

  // SHOULDERS
  { exerciseId: 'ex_shoulders_01', exerciseName: 'Standing Dumbbell Overhead Press', category: 'shoulders', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_shoulders_02', exerciseName: 'Seated Dumbbell Overhead Press', category: 'shoulders', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_shoulders_03', exerciseName: 'Arnold Press', category: 'shoulders', equipmentType: 'dumbbell', difficultyLevel: 'intermediate' },
  { exerciseId: 'ex_shoulders_06', exerciseName: 'Shoulder Press Machine', category: 'shoulders', equipmentType: 'machine', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_shoulders_08', exerciseName: 'Dumbbell Lateral Raise', category: 'shoulders', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },

  // BICEPS
  { exerciseId: 'ex_biceps_01', exerciseName: 'Dumbbell Curl', category: 'biceps', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_biceps_02', exerciseName: 'Alternate Dumbbell Curl', category: 'biceps', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_biceps_04', exerciseName: 'Hammer Curl', category: 'biceps', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_biceps_06', exerciseName: 'Barbell Curl / EZ-Bar Curl', category: 'biceps', equipmentType: 'barbell', difficultyLevel: 'beginner' },

  // TRICEPS
  { exerciseId: 'ex_triceps_01', exerciseName: 'Cable Pressdown / Triceps Pushdown', category: 'triceps', equipmentType: 'cable', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_triceps_02', exerciseName: 'Overhead Triceps Extension', category: 'triceps', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_triceps_06', exerciseName: 'Bench Dip', category: 'triceps', equipmentType: 'bodyweight', difficultyLevel: 'beginner' },

  // QUADS
  { exerciseId: 'ex_quads_01', exerciseName: 'Goblet Squat', category: 'quads', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_quads_08', exerciseName: 'Leg Press', category: 'quads', equipmentType: 'machine', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_quads_11', exerciseName: 'Leg Extension', category: 'quads', equipmentType: 'machine', difficultyLevel: 'beginner' },

  // HAMSTRINGS
  { exerciseId: 'ex_hamstrings_01', exerciseName: 'Dumbbell Romanian Deadlift (RDL)', category: 'hamstrings', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_hamstrings_08', exerciseName: 'Seated Leg Curl', category: 'hamstrings', equipmentType: 'machine', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_hamstrings_09', exerciseName: 'Lying Leg Curl', category: 'hamstrings', equipmentType: 'machine', difficultyLevel: 'beginner' },

  // GLUTES
  { exerciseId: 'ex_glutes_01', exerciseName: 'Hip Thrust / Weighted Glute Bridge', category: 'glutes', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_glutes_03', exerciseName: 'Walking Lunge (DB)', category: 'glutes', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },

  // CALVES
  { exerciseId: 'ex_calves_01', exerciseName: 'Standing Calf Raise (Machine)', category: 'calves', equipmentType: 'machine', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_calves_03', exerciseName: 'Standing Calf Raise (DB)', category: 'calves', equipmentType: 'dumbbell', difficultyLevel: 'beginner' },

  // CORE
  { exerciseId: 'ex_core_01', exerciseName: 'Dead Bug', category: 'core', equipmentType: 'bodyweight', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_core_02', exerciseName: 'RKC Plank', category: 'core', equipmentType: 'bodyweight', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_core_03', exerciseName: 'Bird Dog', category: 'core', equipmentType: 'bodyweight', difficultyLevel: 'beginner' },
  { exerciseId: 'ex_core_04', exerciseName: 'Side Plank', category: 'core', equipmentType: 'bodyweight', difficultyLevel: 'beginner' },
];

/**
 * GET /api/exercises
 * Get all exercises
 */
router.get('/', (req, res) => {
  const { category } = req.query;
  if (category) {
    const filtered = EXERCISE_LIBRARY.filter(ex => ex.category === category);
    return res.json(filtered);
  }
  res.json(EXERCISE_LIBRARY);
});

/**
 * GET /api/exercises/:exerciseId
 * Get a specific exercise
 */
router.get('/:exerciseId', (req, res) => {
  const exercise = EXERCISE_LIBRARY.find(ex => ex.exerciseId === req.params.exerciseId);
  if (!exercise) return res.status(404).json({ error: 'Exercise not found' });
  res.json(exercise);
});

module.exports = router;
