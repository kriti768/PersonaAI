# PersonaAI

PersonaAI is a full-stack reflection platform that lets users chat naturally with an AI assistant while a safe, consent-aware profiling engine turns conversation patterns into self-awareness insights.

## Stack

- Frontend: React + Vite + Tailwind CSS + Framer Motion + Recharts
- Backend: Node.js + Express
- AI: Gemini API with a deterministic local fallback
- Data: MongoDB-ready design with a local JSON persistence fallback for quick setup

## Quick Start

1. Install dependencies from the project root.
2. Copy `server/.env.example` to `server/.env`.
3. Run `npm run dev:server`.
4. Run `npm run dev:client` in a second terminal.
