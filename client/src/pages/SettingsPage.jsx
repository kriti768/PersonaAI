import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [profilingEnabled, setProfilingEnabled] = useState(Boolean(user?.preferences?.profilingEnabled));
  const [aiMode, setAiMode] = useState(user?.preferences?.aiMode || 'Reflective');
  const [message, setMessage] = useState('');

  async function handleSave(event) {
    event.preventDefault();
    const result = await api.updateProfile({
      name,
      preferences: {
        profilingEnabled,
        aiMode
      }
    });
    setUser(result.user);
    setMessage('Settings saved.');
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan/75">Profile & settings</p>
        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Tune the experience to fit you</h2>
      </section>

      <form onSubmit={handleSave} className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-panel space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm text-mist/70">Display name</label>
            <input className="input-field" value={name} onChange={(event) => setName(event.target.value)} />
          </div>
          <div>
            <label className="mb-2 block text-sm text-mist/70">AI personality mode</label>
            <select className="input-field" value={aiMode} onChange={(event) => setAiMode(event.target.value)}>
              <option>Reflective</option>
              <option>Gentle coach</option>
              <option>Curious mirror</option>
            </select>
          </div>
          <label className="glow-card flex items-center justify-between gap-4 p-4 text-sm text-mist/80">
            Enable profiling insights
            <input type="checkbox" checked={profilingEnabled} onChange={(event) => setProfilingEnabled(event.target.checked)} />
          </label>
          {message ? <p className="text-sm text-cyan">{message}</p> : null}
          <button className="primary-btn w-full sm:w-auto">Save changes</button>
        </div>

        <div className="glass-panel p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-aqua/72">What these settings control</p>
          <div className="mt-5 grid gap-4">
            <div className="glow-card p-4 text-sm leading-8 text-mist/78">Profiling toggle controls whether PersonaAI updates your communication and emotional summary after each message.</div>
            <div className="glow-card p-4 text-sm leading-8 text-mist/78">AI mode changes the tone of replies, while keeping the same non-clinical safety posture.</div>
            <div className="glow-card p-4 text-sm leading-8 text-mist/78">Your settings affect presentation, not your ownership. You can still export or delete everything from Privacy.</div>
          </div>
        </div>
      </form>
    </div>
  );
}
