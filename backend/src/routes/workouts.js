const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { admin } = require('../config/firebase');
const { verifyAuth } = require('../middleware/auth');

const db = admin.firestore();

const validateWorkout = [
  body('blockId').notEmpty().withMessage('blockId is required'),
  body('workoutDate').notEmpty().withMessage('workoutDate is required'),
  body('workoutType').isIn(['lifting_upper', 'lifting_lower', 'cardio', 'core', 'rest'])
    .withMessage('Invalid workoutType'),
];

/**
 * POST /api/workouts
 * Create/save a workout
 */
router.post('/', verifyAuth, validateWorkout, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { blockId, workoutDate, workoutType, status, totalDurationMinutes, userNotes, workoutData } = req.body;

    // Validate block ownership
    const blockDoc = await db.collection('blocks').doc(blockId).get();
    if (!blockDoc.exists || blockDoc.data().userId !== req.user.uid) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Validate workoutData if lifting
    if (workoutType.startsWith('lifting') && workoutData?.exercises) {
      for (const ex of workoutData.exercises) {
        if (ex.weightUsed !== undefined && (ex.weightUsed < 0 || ex.weightUsed > 500)) {
          return res.status(400).json({ error: `Invalid weight for ${ex.exerciseName}` });
        }
        if (ex.cycles) {
          for (const cycle of ex.cycles) {
            if (cycle.repsCompleted < 0 || cycle.repsCompleted > 10) {
              return res.status(400).json({ error: 'Reps must be 0-10' });
            }
          }
        }
      }
    }

    const workoutDoc = {
      userId: req.user.uid,
      blockId,
      workoutDate,
      workoutType,
      status: status || 'completed',
      totalDurationMinutes: totalDurationMinutes || null,
      userNotes: userNotes || null,
      workoutData: workoutData || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('workouts').add(workoutDoc);
    res.status(201).json({ workoutId: docRef.id, ...workoutDoc });
  } catch (err) {
    console.error('Create workout error:', err);
    res.status(500).json({ error: 'Failed to save workout' });
  }
});

/**
 * GET /api/workouts
 * Get all workouts for user (optionally filter by blockId)
 */
router.get('/', verifyAuth, async (req, res) => {
  try {
    let query = db.collection('workouts')
      .where('userId', '==', req.user.uid)
      .orderBy('workoutDate', 'desc');

    if (req.query.blockId) {
      query = query.where('blockId', '==', req.query.blockId);
    }

    if (req.query.limit) {
      query = query.limit(parseInt(req.query.limit));
    }

    const snapshot = await query.get();
    const workouts = snapshot.docs.map(doc => ({ workoutId: doc.id, ...doc.data() }));
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get workouts' });
  }
});

/**
 * GET /api/workouts/:workoutId
 * Get a specific workout
 */
router.get('/:workoutId', verifyAuth, async (req, res) => {
  try {
    const doc = await db.collection('workouts').doc(req.params.workoutId).get();
    if (!doc.exists) return res.status(404).json({ error: 'Workout not found' });
    const workout = { workoutId: doc.id, ...doc.data() };
    if (workout.userId !== req.user.uid) return res.status(403).json({ error: 'Forbidden' });
    res.json(workout);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get workout' });
  }
});

/**
 * PUT /api/workouts/:workoutId
 * Update a workout
 */
router.put('/:workoutId', verifyAuth, async (req, res) => {
  try {
    const doc = await db.collection('workouts').doc(req.params.workoutId).get();
    if (!doc.exists) return res.status(404).json({ error: 'Workout not found' });
    if (doc.data().userId !== req.user.uid) return res.status(403).json({ error: 'Forbidden' });

    const { status, totalDurationMinutes, userNotes, workoutData } = req.body;
    const updates = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };
    if (status) updates.status = status;
    if (totalDurationMinutes !== undefined) updates.totalDurationMinutes = totalDurationMinutes;
    if (userNotes !== undefined) updates.userNotes = userNotes;
    if (workoutData !== undefined) updates.workoutData = workoutData;

    await db.collection('workouts').doc(req.params.workoutId).update(updates);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update workout' });
  }
});

/**
 * DELETE /api/workouts/:workoutId
 * Delete a workout
 */
router.delete('/:workoutId', verifyAuth, async (req, res) => {
  try {
    const doc = await db.collection('workouts').doc(req.params.workoutId).get();
    if (!doc.exists) return res.status(404).json({ error: 'Workout not found' });
    if (doc.data().userId !== req.user.uid) return res.status(403).json({ error: 'Forbidden' });

    await db.collection('workouts').doc(req.params.workoutId).delete();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete workout' });
  }
});

module.exports = router;
