import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createConversation, getConversationById, listConversations, saveConversation, updateInsights, updateUser } from '../data/store.js';
import { processConversation } from '../services/analysisService.js';

const router = express.Router();

router.use(requireAuth);

router.get('/conversations', async (req, res) => {
  const conversations = await listConversations(req.user.id);
  res.json({ conversations });
});

router.post('/conversations', async (req, res) => {
  const conversation = await createConversation(req.user.id);
  res.status(201).json({ conversation });
});

router.get('/conversations/:conversationId', async (req, res) => {
  const conversation = await getConversationById(req.params.conversationId, req.user.id);
  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found.' });
  }
  res.json({ conversation });
});

router.post('/message', async (req, res) => {
  const { conversationId, content } = req.body;
  if (!content?.trim()) {
    return res.status(400).json({ message: 'Message content is required.' });
  }

  const conversation = conversationId
    ? await getConversationById(conversationId, req.user.id)
    : await createConversation(req.user.id);

  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found.' });
  }

  const userMessage = {
    id: `msg_${Date.now()}_user`,
    role: 'user',
    content: content.trim(),
    createdAt: new Date().toISOString()
  };

  const historyWithUser = [...conversation.messages, userMessage];
  const { assistantReply, analysis, provider, model } = await processConversation({
    message: content.trim(),
    history: historyWithUser
  });

  const assistantMessage = {
    id: `msg_${Date.now()}_assistant`,
    role: 'assistant',
    content: assistantReply,
    createdAt: new Date().toISOString()
  };

  conversation.messages = [...historyWithUser, assistantMessage];
  conversation.updatedAt = new Date().toISOString();
  conversation.title = conversation.messages.find((item) => item.role === 'user')?.content.slice(0, 48) || 'New reflection';

  await saveConversation(conversation);

  if (req.user.preferences.consentGiven && req.user.preferences.profilingEnabled) {
    await updateInsights(req.user.id, {
      traits: analysis.profile.traits,
      behavioralPatterns: analysis.profile.behavioralPatterns,
      sentimentHistory: analysis.profile.sentimentHistory,
      emotionHistory: analysis.profile.emotionHistory,
      communicationStyle: analysis.profile.communicationStyle,
      emotionalStability: analysis.profile.emotionalStability,
      thinkingStyle: analysis.profile.thinkingStyle,
      engagementLevel: analysis.profile.engagementLevel,
      summary: analysis.profile.summary
    });

    await updateUser(req.user.id, {
      profile: {
        headline: analysis.profile.headline,
        summary: analysis.profile.summary,
        communicationStyle: analysis.profile.communicationStyle,
        emotionalStability: analysis.profile.emotionalStability,
        thinkingStyle: analysis.profile.thinkingStyle,
        engagementLevel: analysis.profile.engagementLevel,
        traits: analysis.profile.traits,
        behavioralPatterns: analysis.profile.behavioralPatterns,
        recentInsights: analysis.profile.recentInsights,
        sentimentHistory: analysis.profile.sentimentHistory,
        emotionHistory: analysis.profile.emotionHistory
      }
    });
  }

  res.json({
    conversation,
    message: assistantMessage,
    analysis: req.user.preferences.profilingEnabled ? analysis : null,
    provider,
    model
  });
});

export default router;
