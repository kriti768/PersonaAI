import { useEffect, useState } from 'react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { api } from '../lib/api';

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-white/10 bg-[#071722]/95 px-4 py-3 text-sm shadow-panel">
      <p className="font-semibold text-ice">{payload[0].payload.trait}</p>
      <p className="mt-1 text-mist/75">Score: <span className="text-ice">{payload[0].value}</span></p>
    </div>
  );
}

export default function InsightsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.getInsights().then(setData).catch(() => {});
  }, []);

  const profile = data?.profile;
  const radarData = profile ? [
    { trait: 'Stability', value: profile.emotionalStability },
    { trait: 'Thinking', value: profile.thinkingStyle },
    { trait: 'Engagement', value: profile.engagementLevel },
    { trait: 'Warmth', value: 67 },
    { trait: 'Openness', value: 71 }
  ] : [];

  return (
    <div className="space-y-6">
      <section className="glass-panel p-6 sm:p-8">
        <div className="page-hero">
          <div className="page-hero-copy">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan/75">Detailed insights</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Traits, tendencies, and reflection prompts</h2>
            <p className="mt-4 text-sm leading-8 text-mist/78">This page goes deeper into the profile language. It is intentionally careful: the system suggests possible patterns based on conversation data, but leaves interpretation to the user.</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <section className="glass-panel p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-aqua/72">Trait field</p>
          <div className="mt-5 h-[340px] min-w-0">
            <ResponsiveContainer>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(182, 215, 232, 0.18)" />
                <PolarAngleAxis dataKey="trait" tick={{ fill: '#b6d7e8', fontSize: 12 }} />
                <Radar dataKey="value" stroke="#ffb84d" fill="#ffb84d" fillOpacity={0.3} />
                <Tooltip content={<ChartTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="glass-panel p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-amber/72">Trait chips</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {(profile?.traits || ['Reflective', 'Adaptive']).map((trait, index) => (
              <span key={trait} className={`rounded-full border px-4 py-2 text-sm ${index % 3 === 0 ? 'border-cyan/30 bg-cyan/10 text-cyan' : index % 3 === 1 ? 'border-aqua/30 bg-aqua/10 text-aqua' : 'border-amber/30 bg-amber/10 text-amber'}`}>
                {trait}
              </span>
            ))}
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="glow-card p-4"><p className="text-sm text-mist/62">Headline</p><p className="mt-2 text-base leading-7">{profile?.headline || 'Your conversation profile will grow here.'}</p></div>
            <div className="glow-card p-4"><p className="text-sm text-mist/62">Communication style</p><p className="mt-2 text-base leading-7">{profile?.communicationStyle || 'Emerging'}</p></div>
            <div className="glow-card p-4"><p className="text-sm text-mist/62">Thinking style</p><p className="mt-2 text-base leading-7">{profile?.thinkingStyle || 0}/100</p></div>
            <div className="glow-card p-4"><p className="text-sm text-mist/62">Engagement</p><p className="mt-2 text-base leading-7">{profile?.engagementLevel || 0}/100</p></div>
          </div>
        </section>
      </div>

      <section className="glass-panel p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-coral/75">Reflection prompts</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {(profile?.recentInsights || ['Keep chatting to generate prompts.']).map((item) => (
            <div key={item} className="glow-card p-5 text-sm leading-8 text-mist/78">{item}</div>
          ))}
        </div>
      </section>
    </div>
  );
}
