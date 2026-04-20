import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { updateUser } from '../data/store.js';

const router = express.Router();
router.use(requireAuth);

router.patch('/', async (req, res) => {
  const { name, preferences } = req.body;
  const updatedUser = await updateUser(req.user.id, {
    ...(name ? { name } : {}),
    ...(preferences ? { preferences } : {})
  });

  res.json({
    user: {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      preferences: updatedUser.preferences,
      profile: updatedUser.profile
    }
  });
});

export default router;
