import { useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export default function PrivacyPage() {
  const [exported, setExported] = useState(null);
  const [status, setStatus] = useState('');
  const { logout } = useAuth();

  async function handleExport() {
    const result = await api.exportData();
    setExported(JSON.stringify(result, null, 2));
    setStatus('Data exported below.');
  }

  async function handleDelete() {
    await api.deleteData();
    setStatus('Your data was deleted.');
    logout();
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan/75">Privacy controls</p>
        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Consent, export, and deletion</h2>
        <p className="mt-4 text-sm leading-8 text-mist/78">PersonaAI is designed around user control. Profiling is optional, insights are non-diagnostic, and your information stays removable.</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-panel p-6">
          <h3 className="text-xl font-semibold">Export your data</h3>
          <p className="mt-3 text-sm leading-8 text-mist/76">Get your user profile, conversation history, and generated insights in JSON form.</p>
          <button onClick={handleExport} className="primary-btn mt-5">Export my data</button>
        </div>

        <div className="glass-panel p-6">
          <h3 className="text-xl font-semibold">Delete everything</h3>
          <p className="mt-3 text-sm leading-8 text-mist/76">Permanently remove your account, conversations, and insight data from the local store.</p>
          <button onClick={handleDelete} className="secondary-btn mt-5">Delete my data</button>
        </div>
      </div>

      {status ? <div className="glass-panel p-4 text-sm text-cyan">{status}</div> : null}
      {exported ? <pre className="code-panel overflow-x-auto p-6 text-xs text-mist/80">{exported}</pre> : null}
    </div>
  );
}
