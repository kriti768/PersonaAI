import { verifyToken } from '../utils/tokens.js';
import { getUserById } from '../data/store.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';

    if (!token) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const payload = verifyToken(token);
    const user = await getUserById(payload.userId);

    if (!user) {
      return res.status(401).json({ message: 'User session is no longer valid.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
}
