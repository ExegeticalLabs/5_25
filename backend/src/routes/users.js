const express = require('express');
const router = express.Router();
const { admin } = require('../config/firebase');
const { verifyAuth } = require('../middleware/auth');

const db = admin.firestore();

/**
 * GET /api/users/me
 * Get current user profile
 */
router.get('/me', verifyAuth, async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.user.uid);
    const doc = await userRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ uid: req.user.uid, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

/**
 * PUT /api/users/me
 * Update user profile
 */
router.put('/me', verifyAuth, async (req, res) => {
  try {
    const { name, preferences } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (preferences) updates.preferences = preferences;

    const userRef = db.collection('users').doc(req.user.uid);
    await userRef.update(updates);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

/**
 * GET /api/users/me/stats
 * Get overall user stats
 */
router.get('/me/stats', verifyAuth, async (req, res) => {
  try {
    const workoutsRef = db.collection('workouts');
    const query = workoutsRef
      .where('userId', '==', req.user.uid)
      .where('status', '==', 'completed');
    const snapshot = await query.get();

    const workouts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const totalMinutes = workouts.reduce((sum, w) => sum + (w.totalDurationMinutes || 0), 0);
    const liftingCount = workouts.filter(w => w.workoutType === 'lifting_upper' || w.workoutType === 'lifting_lower').length;
    const cardioCount = workouts.filter(w => w.workoutType === 'cardio').length;
    const coreCount = workouts.filter(w => w.workoutType === 'core').length;

    res.json({
      totalWorkouts: workouts.length,
      totalMinutes,
      liftingWorkouts: liftingCount,
      cardioWorkouts: cardioCount,
      coreWorkouts: coreCount,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

module.exports = router;
