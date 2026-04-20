import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env.js';

const positiveWords = ['good', 'great', 'calm', 'happy', 'hopeful', 'excited', 'grateful', 'confident', 'clear', 'better'];
const negativeWords = ['sad', 'angry', 'tired', 'overwhelmed', 'stressed', 'anxious', 'confused', 'frustrated', 'lonely', 'afraid'];
const emotionalWords = {
  calm: ['calm', 'steady', 'grounded', 'peaceful'],
  hopeful: ['hopeful', 'optimistic', 'curious', 'open'],
  stressed: ['stressed', 'pressured', 'overwhelmed', 'burned'],
  reflective: ['thinking', 'reflecting', 'noticing', 'processing'],
  warm: ['care', 'kind', 'love', 'support']
};
const topicMap = {
  work: ['work', 'job', 'career', 'boss', 'deadline', 'meeting'],
  relationships: ['friend', 'partner', 'relationship', 'family', 'people', 'trust'],
  growth: ['grow', 'improve', 'habit', 'goal', 'future', 'change'],
  stress: ['stress', 'anxiety', 'pressure', 'overwhelmed', 'coping'],
  identity: ['myself', 'identity', 'who i am', 'authentic', 'confidence']
};

const gemini = env.geminiApiKey ? new GoogleGenerativeAI(env.geminiApiKey) : null;
const geminiModelName = 'gemini-2.5-flash';

function tokenize(text) {
  return text.toLowerCase().match(/[a-z']+/g) || [];
}

function pickTopKeywords(tokens) {
  const stopWords = new Set(['the', 'and', 'for', 'that', 'with', 'have', 'this', 'from', 'about', 'would', 'there', 'their', 'they', 'them', 'just', 'into', 'your', 'you', 'feel', 'been']);
  const counts = new Map();
  tokens.forEach((token) => {
    if (token.length < 4 || stopWords.has(token)) return;
    counts.set(token, (counts.get(token) || 0) + 1);
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([word]) => word);
}

function analyzeSentiment(tokens) {
  let score = 0;
  tokens.forEach((token) => {
    if (positiveWords.includes(token)) score += 1;
    if (negativeWords.includes(token)) score -= 1;
  });
  const label = score > 1 ? 'positive' : score < -1 ? 'negative' : 'neutral';
  return { score, label };
}

function detectTone(tokens) {
  const scores = Object.entries(emotionalWords).map(([tone, words]) => ({
    tone,
    score: words.reduce((sum, word) => sum + (tokens.includes(word) ? 1 : 0), 0)
  }));

  scores.sort((a, b) => b.score - a.score);
  return scores[0].score ? scores[0].tone : 'reflective';
}

function classifyTopic(text) {
  const lowered = text.toLowerCase();
  const matches = Object.entries(topicMap).map(([topic, keywords]) => ({
    topic,
    score: keywords.reduce((sum, word) => sum + (lowered.includes(word) ? 1 : 0), 0)
  }));
  matches.sort((a, b) => b.score - a.score);
  return matches[0].score ? matches[0].topic : 'general reflection';
}

function buildFallbackProfile(messages) {
  const combined = messages.filter((item) => item.role === 'user').map((item) => item.content).join(' ');
  const tokens = tokenize(combined);
  const sentiment = analyzeSentiment(tokens);
  const tone = detectTone(tokens);
  const keywords = pickTopKeywords(tokens);
  const topics = [...new Set(messages.filter((item) => item.role === 'user').map((item) => classifyTopic(item.content)))];
  const questionCount = (combined.match(/\?/g) || []).length;

  const communicationStyle = questionCount > 3 ? 'Curious and exploratory' : tone === 'calm' ? 'Measured and composed' : tone === 'stressed' ? 'Open but pressure-aware' : 'Thoughtful and expressive';
  const emotionalStability = Math.max(30, Math.min(88, 60 + sentiment.score * 4 + (tone === 'calm' ? 8 : 0) - (tone === 'stressed' ? 10 : 0)));
  const thinkingStyle = Math.max(35, Math.min(90, 50 + keywords.filter((word) => ['plan', 'think', 'because', 'future', 'goal'].includes(word)).length * 7));
  const engagementLevel = Math.max(40, Math.min(95, 45 + messages.filter((item) => item.role === 'user').length * 5));

  const traits = [
    communicationStyle,
    tone === 'hopeful' ? 'Future-oriented' : 'Emotionally aware',
    thinkingStyle > 60 ? 'Analytical reflection' : 'Emotion-led processing'
  ];

  const behavioralPatterns = [
    `Conversation often circles around ${topics[0] || 'personal reflection'}.`,
    `Current tone reads as ${tone}, which may shift with stress or context.`,
    sentiment.label === 'negative'
      ? 'You are willing to name tension directly, which can support honest self-awareness.'
      : 'You tend to frame thoughts constructively even when discussing uncertainty.'
  ];

  const recentInsights = [
    'Treat these patterns as signals, not fixed labels.',
    'Notice which topics make your tone feel more grounded versus more reactive.',
    'Small wording shifts over time can reveal meaningful emotional changes.'
  ];

  return {
    sentiment,
    emotionalTone: tone,
    keywords,
    topic: topics[0] || 'general reflection',
    profile: {
      communicationStyle,
      emotionalStability,
      thinkingStyle,
      engagementLevel,
      summary: `Your recent conversations suggest a ${communicationStyle.toLowerCase()} style with ${tone} emotional coloring. These are reflective cues for self-awareness, not diagnoses.`,
      headline: 'A conversation-based snapshot of how you currently express and process experience.',
      traits,
      behavioralPatterns,
      recentInsights,
      sentimentHistory: messages
        .filter((item) => item.role === 'user')
        .slice(-8)
        .map((item, index) => ({ point: `M${index + 1}`, value: analyzeSentiment(tokenize(item.content)).score })),
      emotionHistory: messages
        .filter((item) => item.role === 'user')
        .slice(-8)
        .map((item, index) => ({ point: `M${index + 1}`, tone: detectTone(tokenize(item.content)) }))
    }
  };
}

function safeJsonParse(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) return null;

  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

async function runGeminiStructuredAnalysis({ message, history, fallback }) {
  if (!gemini) return null;

  const model = gemini.getGenerativeModel({ model: geminiModelName });
  const prompt = `You are PersonaAI, an ethical self-awareness assistant. Analyze the user's conversation without medical or clinical diagnosis. Return only valid JSON with these keys: assistantReply, sentimentLabel, sentimentScore, emotionalTone, keywords, topic, communicationStyle, emotionalStability, thinkingStyle, engagementLevel, traits, behavioralPatterns, recentInsights, summary, headline.\n\nRules:\n- Keep all output non-clinical and suggestion-based.\n- Emotional stability, thinking style, and engagement level must be integers from 0 to 100.\n- traits, behavioralPatterns, and recentInsights should each be arrays of 3 short strings.\n- assistantReply should be a warm conversational response to the latest user message.\n\nLatest user message: ${message}\n\nFallback profile for reference: ${JSON.stringify(fallback.profile)}\n\nRecent history:\n${history.slice(-8).map((item) => `${item.role}: ${item.content}`).join('\n')}`;

  const response = await model.generateContent(prompt);
  return safeJsonParse(response.response.text());
}

function mergeGeminiWithFallback(geminiResult, fallback) {
  if (!geminiResult) return null;

  return {
    assistantReply: geminiResult.assistantReply,
    analysis: {
      sentiment: {
        label: geminiResult.sentimentLabel || fallback.sentiment.label,
        score: Number.isFinite(geminiResult.sentimentScore) ? geminiResult.sentimentScore : fallback.sentiment.score
      },
      emotionalTone: geminiResult.emotionalTone || fallback.emotionalTone,
      keywords: Array.isArray(geminiResult.keywords) && geminiResult.keywords.length ? geminiResult.keywords : fallback.keywords,
      topic: geminiResult.topic || fallback.topic,
      profile: {
        communicationStyle: geminiResult.communicationStyle || fallback.profile.communicationStyle,
        emotionalStability: Number.isFinite(geminiResult.emotionalStability) ? geminiResult.emotionalStability : fallback.profile.emotionalStability,
        thinkingStyle: Number.isFinite(geminiResult.thinkingStyle) ? geminiResult.thinkingStyle : fallback.profile.thinkingStyle,
        engagementLevel: Number.isFinite(geminiResult.engagementLevel) ? geminiResult.engagementLevel : fallback.profile.engagementLevel,
        summary: geminiResult.summary || fallback.profile.summary,
        headline: geminiResult.headline || fallback.profile.headline,
        traits: Array.isArray(geminiResult.traits) && geminiResult.traits.length ? geminiResult.traits.slice(0, 3) : fallback.profile.traits,
        behavioralPatterns: Array.isArray(geminiResult.behavioralPatterns) && geminiResult.behavioralPatterns.length ? geminiResult.behavioralPatterns.slice(0, 3) : fallback.profile.behavioralPatterns,
        recentInsights: Array.isArray(geminiResult.recentInsights) && geminiResult.recentInsights.length ? geminiResult.recentInsights.slice(0, 3) : fallback.profile.recentInsights,
        sentimentHistory: fallback.profile.sentimentHistory,
        emotionHistory: fallback.profile.emotionHistory
      }
    }
  };
}

export async function processConversation({ message, history }) {
  const fallback = buildFallbackProfile(history);

  try {
    const geminiStructured = await runGeminiStructuredAnalysis({
      message,
      history,
      fallback
    });

    const merged = mergeGeminiWithFallback(geminiStructured, fallback);
    if (merged?.assistantReply) {
      return {
        ...merged,
        provider: 'gemini',
        model: geminiModelName
      };
    }
  } catch {
  }

  return {
    assistantReply: `I'm hearing ${fallback.emotionalTone} energy in what you shared. It sounds like ${message.length > 120 ? 'this has been sitting with you for a while' : 'you are trying to make sense of something important'}. One pattern that stands out is ${fallback.profile.communicationStyle.toLowerCase()}. If you want, we can unpack what may be sitting underneath that feeling.`,
    analysis: fallback,
    provider: 'fallback',
    model: 'local-reflection-engine'
  };
}
