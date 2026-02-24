const express = require('express');
const router = express.Router();
const { admin } = require('../config/firebase');
const { verifyAuth } = require('../middleware/auth');

const db = admin.firestore();

/**
 * POST /api/blocks
 * Create a new block
 */
router.post('/', verifyAuth, async (req, res) => {
  try {
    const { blockNumber, startDate, liftingExercises, cardio, core } = req.body;

    if (!blockNumber || !startDate) {
      return res.status(400).json({ error: 'blockNumber and startDate are required' });
    }

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(startDate);
    endDateObj.setDate(endDateObj.getDate() + 41);

    const blockData = {
      userId: req.user.uid,
      blockNumber,
      startDate: startDateObj.toISOString(),
      endDate: endDateObj.toISOString(),
      status: 'active',
      liftingExercises: liftingExercises || { upper: [], lower: [] },
      cardio: cardio || { cardioType: 'running' },
      core: core || { comboNumber: 1, exercises: [] },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Mark any previous active blocks as completed
    const existingQuery = db.collection('blocks')
      .where('userId', '==', req.user.uid)
      .where('status', '==', 'active');
    const existingSnapshot = await existingQuery.get();
    const batch = db.batch();
    existingSnapshot.docs.forEach(doc => {
      batch.update(doc.ref, { status: 'completed' });
    });
    await batch.commit();

    // Create new block
    const blockRef = await db.collection('blocks').add(blockData);

    // Update user's currentBlockId
    await db.collection('users').doc(req.user.uid).update({
      currentBlockId: blockRef.id,
    });

    res.status(201).json({ blockId: blockRef.id, ...blockData });
  } catch (err) {
    console.error('Create block error:', err);
    res.status(500).json({ error: 'Failed to create block' });
  }
});

/**
 * GET /api/blocks
 * Get all blocks for the user
 */
router.get('/', verifyAuth, async (req, res) => {
  try {
    const snapshot = await db.collection('blocks')
      .where('userId', '==', req.user.uid)
      .orderBy('blockNumber', 'desc')
      .get();

    const blocks = snapshot.docs.map(doc => ({ blockId: doc.id, ...doc.data() }));
    res.json(blocks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get blocks' });
  }
});

/**
 * GET /api/blocks/:blockId
 * Get a specific block
 */
router.get('/:blockId', verifyAuth, async (req, res) => {
  try {
    const doc = await db.collection('blocks').doc(req.params.blockId).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Block not found' });
    }
    const block = { blockId: doc.id, ...doc.data() };
    if (block.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.json(block);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get block' });
  }
});

/**
 * PUT /api/blocks/:blockId
 * Update block settings (exercises, cardio, core)
 */
router.put('/:blockId', verifyAuth, async (req, res) => {
  try {
    const doc = await db.collection('blocks').doc(req.params.blockId).get();
    if (!doc.exists) return res.status(404).json({ error: 'Block not found' });
    if (doc.data().userId !== req.user.uid) return res.status(403).json({ error: 'Forbidden' });

    const { liftingExercises, cardio, core, status } = req.body;
    const updates = {};
    if (liftingExercises) updates.liftingExercises = liftingExercises;
    if (cardio) updates.cardio = cardio;
    if (core) updates.core = core;
    if (status) updates.status = status;

    await db.collection('blocks').doc(req.params.blockId).update(updates);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update block' });
  }
});

module.exports = router;
