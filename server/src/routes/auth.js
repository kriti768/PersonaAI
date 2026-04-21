import express from 'express';
import bcrypt from 'bcryptjs';
import { createUser, findUserByEmail } from '../data/store.js';
import { createToken } from '../utils/tokens.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, consentGiven } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (!consentGiven) {
      return res.status(400).json({ message: 'Consent is required before profiling can be enabled.' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'An account with that email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({ name, email, passwordHash, consentGiven });
    const token = createToken(user);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        preferences: user.preferences,
        profile: user.profile
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || 'Signup failed unexpectedly.'
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email || '');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const valid = await bcrypt.compare(password || '', user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = createToken(user);
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        preferences: user.preferences,
        profile: user.profile
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || 'Login failed unexpectedly.'
    });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      preferences: req.user.preferences,
      profile: req.user.profile
    }
  });
});

export default router;
