import express from 'express';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/preferences', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('alertPreferences');
    res.json(user.alertPreferences);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.post('/preferences', auth, async (req, res) => {
  try {
    const { minRiskScore, notifyImminent, emailFrequency } = req.body;
    const user = await User.findById(req.user.id);

    user.alertPreferences = { minRiskScore, notifyImminent, emailFrequency };
    await user.save();

    res.json(user.alertPreferences);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

export default router;