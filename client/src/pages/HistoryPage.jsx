import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function HistoryPage() {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    api.listConversations().then((result) => setConversations(result.conversations)).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <section className="glass-panel p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan/75">Conversation history</p>
        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Your saved reflection sessions</h2>
        <p className="mt-4 text-sm leading-8 text-mist/78">Browse previous conversations and revisit the moments that shaped your current profile.</p>
      </section>

      <div className="grid gap-4">
        {conversations.length ? conversations.map((conversation) => (
          <article key={conversation.id} className="glass-panel p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-semibold text-ice">{conversation.title}</h3>
                <p className="mt-2 text-sm text-mist/68">Updated {new Date(conversation.updatedAt).toLocaleString()}</p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-mist/72">{conversation.messages.length} messages</div>
            </div>
            <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-8 text-mist/78">
              {conversation.messages[0]?.content || 'No messages yet.'}
            </div>
          </article>
        )) : <div className="glass-panel p-6 text-sm text-mist/75">No saved conversations yet.</div>}
      </div>
    </div>
  );
}
