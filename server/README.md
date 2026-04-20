# PersonaAI

PersonaAI is a full-stack reflection platform where users chat naturally with an AI assistant while the system turns conversation patterns into self-awareness insights. It focuses on communication style, emotional tone, behavioral tendencies, and reflection prompts without making clinical claims.

## Stack

- Frontend: React + Vite + Tailwind CSS + Framer Motion + Recharts
- Backend: Node.js + Express
- AI: Gemini API with a deterministic fallback when no key is present
- Data: Local JSON persistence for easy setup, with room to swap in Mongo later

## Gemini Setup

Gemini is configured on the backend.

1. Open `C:\Users\DELL\Downloads\PersonaAI\server`
2. Copy `.env.example` to `.env`
3. Put your key in this line:

```env
GEMINI_API_KEY=your_actual_gemini_api_key
```

Keep the key in `server/.env`, not in the frontend.

When `GEMINI_API_KEY` is present:
- PersonaAI uses Gemini for the assistant reply
- PersonaAI also asks Gemini for a structured reflective analysis that feeds the dashboard

When `GEMINI_API_KEY` is missing:
- The app still works using the local fallback analysis engine

## Quick Start

1. From `C:\Users\DELL\Downloads\PersonaAI`, run `npm install`
2. Copy `server/.env.example` to `server/.env`
3. Add your Gemini API key in `server/.env`
4. Run `npm run dev:server`
5. In another terminal, run `npm run dev:client`

## Product Guardrails

- PersonaAI does not provide medical diagnosis
- Insights are suggestion-based and non-clinical
- Profiling requires user consent and can be turned off
- Users can export or delete their data
