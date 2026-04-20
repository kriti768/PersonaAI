import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { deleteUserData, exportUserData } from '../data/store.js';

const router = express.Router();
router.use(requireAuth);

router.get('/export', async (req, res) => {
  const data = await exportUserData(req.user.id);
  res.json({ exportedAt: new Date().toISOString(), data });
});

router.delete('/delete', async (req, res) => {
  await deleteUserData(req.user.id);
  res.json({ message: 'Your PersonaAI data has been deleted.' });
});

export default router;
