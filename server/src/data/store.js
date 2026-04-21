import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const dbPath = path.resolve(currentDir, 'personaai-db.json');

const defaultDb = {
  users: [],
  conversations: [],
  insights: []
};

function cloneDb(data) {
  return JSON.parse(JSON.stringify(data));
}

if (!globalThis.__personaAiMemoryDb) {
  globalThis.__personaAiMemoryDb = cloneDb(defaultDb);
}

const memoryDb = globalThis.__personaAiMemoryDb;
const useMemoryDb = Boolean(process.env.VERCEL);

async function ensureDb() {
  if (useMemoryDb) {
    return;
  }

  try {
    await fs.access(dbPath);
  } catch {
    await fs.writeFile(dbPath, JSON.stringify(defaultDb, null, 2), 'utf8');
  }
}

async function readDb() {
  if (useMemoryDb) {
    return cloneDb(memoryDb);
  }

  await ensureDb();
  const raw = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(raw);
}

async function writeDb(data) {
  if (useMemoryDb) {
    memoryDb.users = data.users;
    memoryDb.conversations = data.conversations;
    memoryDb.insights = data.insights;
    return;
  }

  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

function createId(prefix) {
  return `${prefix}_${crypto.randomBytes(8).toString('hex')}`;
}

export async function createUser(payload) {
  const db = await readDb();
  const user = {
    id: createId('user'),
    createdAt: new Date().toISOString(),
    preferences: {
      profilingEnabled: true,
      consentGiven: Boolean(payload.consentGiven),
      aiMode: 'Reflective',
      theme: 'Night Bloom'
    },
    profile: {
      headline: 'Your reflective profile will grow with each conversation.',
      summary: 'Suggestions will appear here after a few meaningful messages.',
      communicationStyle: 'Emerging',
      emotionalStability: 55,
      thinkingStyle: 52,
      engagementLevel: 50,
      traits: [],
      behavioralPatterns: [],
      recentInsights: [],
      sentimentHistory: [],
      emotionHistory: []
    },
    ...payload
  };

  db.users.push(user);
  db.insights.push({
    id: createId('insight'),
    userId: user.id,
    traits: [],
    behavioralPatterns: [],
    sentimentHistory: [],
    emotionHistory: [],
    communicationStyle: 'Emerging',
    emotionalStability: 55,
    thinkingStyle: 52,
    engagementLevel: 50,
    summary: 'Start chatting to unlock your first reflection summary.',
    updatedAt: new Date().toISOString()
  });

  await writeDb(db);
  return user;
}

export async function findUserByEmail(email) {
  const db = await readDb();
  return db.users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function getUserById(id) {
  const db = await readDb();
  return db.users.find((user) => user.id === id) || null;
}

export async function updateUser(id, updates) {
  const db = await readDb();
  const index = db.users.findIndex((user) => user.id === id);
  if (index === -1) return null;

  db.users[index] = {
    ...db.users[index],
    ...updates,
    preferences: {
      ...db.users[index].preferences,
      ...(updates.preferences || {})
    },
    profile: {
      ...db.users[index].profile,
      ...(updates.profile || {})
    }
  };

  await writeDb(db);
  return db.users[index];
}

export async function createConversation(userId) {
  const db = await readDb();
  const conversation = {
    id: createId('conversation'),
    userId,
    title: 'New reflection',
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.conversations.unshift(conversation);
  await writeDb(db);
  return conversation;
}

export async function getConversationById(id, userId) {
  const db = await readDb();
  return db.conversations.find((item) => item.id === id && item.userId === userId) || null;
}

export async function listConversations(userId) {
  const db = await readDb();
  return db.conversations.filter((item) => item.userId === userId).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

export async function saveConversation(conversation) {
  const db = await readDb();
  const index = db.conversations.findIndex((item) => item.id === conversation.id);
  if (index === -1) {
    db.conversations.unshift(conversation);
  } else {
    db.conversations[index] = conversation;
  }
  await writeDb(db);
  return conversation;
}

export async function getInsights(userId) {
  const db = await readDb();
  return db.insights.find((item) => item.userId === userId) || null;
}

export async function updateInsights(userId, updates) {
  const db = await readDb();
  const index = db.insights.findIndex((item) => item.userId === userId);
  if (index === -1) return null;

  db.insights[index] = {
    ...db.insights[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  await writeDb(db);
  return db.insights[index];
}

export async function exportUserData(userId) {
  const db = await readDb();
  return {
    user: db.users.find((item) => item.id === userId) || null,
    conversations: db.conversations.filter((item) => item.userId === userId),
    insights: db.insights.find((item) => item.userId === userId) || null
  };
}

export async function deleteUserData(userId) {
  const db = await readDb();
  db.users = db.users.filter((item) => item.id !== userId);
  db.conversations = db.conversations.filter((item) => item.userId !== userId);
  db.insights = db.insights.filter((item) => item.userId !== userId);
  await writeDb(db);
}
