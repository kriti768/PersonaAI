import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import chatRouter from './routes/chat.js';
import insightsRouter from './routes/insights.js';
import profileRouter from './routes/profile.js';
import privacyRouter from './routes/privacy.js';

const app = express();

app.use(cors({ origin: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'personaai-server' });
});

app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/insights', insightsRouter);
app.use('/api/profile', profileRouter);
app.use('/api/privacy', privacyRouter);

export default app;
