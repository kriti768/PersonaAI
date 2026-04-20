import { BarChart3, BrainCircuit, History, Lock, MessageCircleHeart, Settings, Sparkles } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/chat', label: 'Chat', icon: MessageCircleHeart },
  { to: '/insights', label: 'Insights', icon: BrainCircuit },
  { to: '/history', label: 'Conversation History', icon: History },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/privacy', label: 'Privacy', icon: Lock }
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="glass-panel sticky top-6 flex h-[calc(100vh-3rem)] flex-col justify-between rounded-[34px] bg-[linear-gradient(180deg,rgba(38,21,60,0.92),rgba(22,12,34,0.95))] p-5">
      <div>
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#ff9a62,#8e4dff_75%)] text-white shadow-glow">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="text-xl font-semibold text-moon">PersonaAI</p>
            <p className="text-xs text-mist/68">Reflective companion</p>
          </div>
        </div>

        <nav className="mt-8 space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${isActive ? 'bg-white/6 text-violet shadow-glow border border-violet/20' : 'border border-transparent text-mist/78 hover:bg-white/6 hover:text-moon'}`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3">
        <div className="rounded-[28px] border border-white/8 bg-white/5 px-4 py-4">
          <p className="font-semibold text-moon">{user?.name}</p>
          <p className="mt-1 text-sm text-mist/70">{user?.email}</p>
          <p className="mt-2 text-xs text-mist/60">Profiling {user?.preferences?.profilingEnabled ? 'enabled' : 'paused'}</p>
        </div>
        <button onClick={logout} className="secondary-btn w-full">Log out</button>
      </div>
    </aside>
  );
}
