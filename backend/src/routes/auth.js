const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { admin } = require('../config/firebase');
const { verifyAuth } = require('../middleware/auth');

/**
 * POST /api/auth/verify-token
 * Verify Firebase token and return user info
 */
router.post('/verify-token', verifyAuth, (req, res) => {
  res.json({ uid: req.user.uid, email: req.user.email });
});

/**
 * POST /api/auth/refresh-token
 * Refresh custom token (optional, Firebase handles this client-side)
 */
router.post('/refresh-token', verifyAuth, async (req, res) => {
  try {
    const customToken = await admin.auth().createCustomToken(req.user.uid);
    res.json({ customToken });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create token' });
  }
});

module.exports = router;
