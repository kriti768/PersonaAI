import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getInsights } from '../data/store.js';

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const insights = await getInsights(req.user.id);
  res.json({ insights, profile: req.user.profile });
});

export default router;
