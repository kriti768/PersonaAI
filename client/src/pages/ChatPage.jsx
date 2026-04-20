import { motion } from 'framer-motion';
import { SendHorizonal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';

const starters = [
  'I feel like I sound strong in conversations even when I am not fully okay.',
  'Can you help me understand whether my recent thoughts feel more anxious or reflective?',
  'I want to notice what emotional pattern keeps repeating in how I talk.'
];

export default function ChatPage() {
  const [conversation, setConversation] = useState(null);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.createConversation()
      .then((result) => setConversation(result.conversation))
      .catch((loadError) => setError(loadError.message));
  }, []);

  const suggestionLabel = useMemo(() => {
    if (!conversation?.messages?.length) return 'Start with a gentle reflection';
    return 'Keep the thread going';
  }, [conversation]);

  async function sendMessage(event) {
    event.preventDefault();
    if (!draft.trim() || !conversation) return;

    const optimistic = {
      ...conversation,
      messages: [...conversation.messages, { id: `temp_${Date.now()}`, role: 'user', content: draft.trim() }]
    };

    const nextDraft = draft;
    setDraft('');
    setConversation(optimistic);
    setTyping(true);
    setError('');

    try {
      const result = await api.sendMessage({ conversationId: conversation.id, content: nextDraft });
      setConversation(result.conversation);
    } catch (sendError) {
      setError(sendError.message);
      setConversation(conversation);
    } finally {
      setTyping(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="scene-shell min-h-[88vh] px-5 py-5 sm:px-8 sm:py-8">
        <div className="absolute left-[8%] top-[12%] h-14 w-14 rounded-full bg-moon/90 shadow-[0_0_40px_rgba(255,255,255,0.35)]" />
        <div className="absolute inset-x-0 bottom-[18%] h-52 bg-[radial-gradient(circle_at_20%_40%,rgba(65,35,96,0.95),transparent_45%),radial-gradient(circle_at_70%_60%,rgba(51,24,79,0.95),transparent_46%)] opacity-95" />
        <div className="scene-hill bottom-[-70px] left-[-8%] h-64 w-[56%] bg-[#2b1745]" />
        <div className="scene-hill bottom-[-86px] left-[24%] h-72 w-[52%] bg-[#221139]" />
        <div className="scene-hill bottom-[-86px] right-[-10%] h-72 w-[48%] bg-[#201033]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,transparent,rgba(18,10,31,0.88))]" />

        <div className="scene-message-wrap mx-auto flex h-full max-w-5xl flex-col">
          <div className="text-center">
            <p className="text-2xl font-semibold text-moon">PersonaAI</p>
            <p className="mt-2 text-sm text-mist/78">A calm conversation space for reflection, mood signals, and self-awareness.</p>
          </div>

          <div className="mt-8 flex-1 space-y-5 overflow-y-auto rounded-[34px] border border-white/8 bg-[linear-gradient(180deg,rgba(32,18,49,0.46),rgba(25,14,39,0.18))] px-4 py-5 sm:px-8 sm:py-8">
            {conversation?.messages?.length ? (
              conversation.messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={message.role === 'user' ? 'message-user ml-auto' : 'message-assistant'}
                >
                  {message.content}
                </motion.div>
              ))
            ) : (
              <div className="message-assistant">
                Hello. I am here whenever you are ready to talk. What is on your mind tonight?
              </div>
            )}

            {typing ? <div className="message-assistant text-sm text-mist/75">PersonaAI is reflecting on your message...</div> : null}
          </div>

          <div className="mt-5">
            <form onSubmit={sendMessage} className="rounded-[30px] border border-white/8 bg-[rgba(35,19,55,0.86)] px-3 py-3 shadow-panel sm:px-4">
              <div className="flex items-end gap-3">
                <textarea
                  rows={1}
                  className="input-field min-h-[56px] resize-none border-0 bg-white/6 px-5 py-4"
                  placeholder="Share your thoughts..."
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                />
                <button className="primary-btn flex h-[56px] shrink-0 items-center justify-center gap-2 rounded-full px-5 sm:w-[92px]" aria-label="Send message">
                  <SendHorizonal size={16} />
                  <span className="text-sm">Send</span>
                </button>
              </div>
              {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
            </form>

            <div className="mt-3 rounded-[28px] border border-white/8 bg-[rgba(27,15,42,0.72)] px-3 py-3 backdrop-blur-sm">
              <p className="px-2 text-xs uppercase tracking-[0.32em] text-blush/80">{suggestionLabel}</p>
              <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                {starters.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setDraft(item)}
                    className="glow-card min-w-[250px] shrink-0 px-4 py-3 text-left text-sm leading-7 text-mist/80 transition hover:bg-white/8 sm:min-w-[290px]"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
