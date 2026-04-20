import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AmbientBackdrop from '../components/AmbientBackdrop';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage() {
  const [mode, setMode] = useState('signup');
  const [form, setForm] = useState({ name: '', email: '', password: '', consentGiven: true });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        await signup(form);
      } else {
        await login({ email: form.email, password: form.password });
      }
      navigate('/chat');
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-ice">
      <AmbientBackdrop />
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-10">
        <div className="glass-panel grid w-full max-w-5xl overflow-hidden lg:grid-cols-[0.94fr_1.06fr]">
          <div className="hidden border-r border-white/10 p-10 lg:block">
            <p className="text-sm uppercase tracking-[0.45em] text-aqua/72">Consent-aware reflection</p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight">Talk honestly. Get clearer about how you show up.</h1>
            <p className="mt-6 max-w-md text-sm leading-8 text-mist/76">Create an account to save conversations, unlock your interactive dashboard, and control exactly how profiling is handled.</p>
            <div className="mt-8 grid gap-4">
              <div className="glow-card p-4 text-sm leading-7 text-mist/78">Natural AI chat with conversation memory</div>
              <div className="glow-card p-4 text-sm leading-7 text-mist/78">Profile signals for tone, thinking style, and engagement</div>
              <div className="glow-card p-4 text-sm leading-7 text-mist/78">Export and delete controls built into the product</div>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <div className="flex gap-2 rounded-full border border-white/10 bg-white/5 p-1">
              {['signup', 'login'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMode(item)}
                  className={`flex-1 rounded-full px-4 py-3 text-sm font-medium capitalize transition ${mode === item ? 'bg-cyan/14 text-ice' : 'text-mist/70'}`}
                >
                  {item}
                </button>
              ))}
            </div>

            <h2 className="mt-8 text-3xl font-semibold">{mode === 'signup' ? 'Create your PersonaAI account' : 'Welcome back'}</h2>
            <p className="mt-3 text-sm text-mist/70">A clean interface for reflective AI chat, profile tracking, and privacy-first controls.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {mode === 'signup' ? <input className="input-field" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /> : null}
              <input className="input-field" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input className="input-field" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

              {mode === 'signup' ? (
                <label className="glow-card flex items-start gap-3 p-4 text-sm text-mist/80">
                  <input type="checkbox" checked={form.consentGiven} onChange={(e) => setForm({ ...form, consentGiven: e.target.checked })} className="mt-1" />
                  I consent to conversation-based profiling for self-awareness insights. I understand this is not medical diagnosis and can be disabled later.
                </label>
              ) : null}

              {error ? <p className="text-sm text-rose-300">{error}</p> : null}
              <button className="primary-btn w-full" disabled={loading}>{loading ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Log in'}</button>
            </form>

            <p className="mt-6 text-sm text-mist/60">
              <Link to="/" className="text-cyan">Back to landing</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
