import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { api } from '../lib/api';

const palette = {
  joy: '#c06cff',
  calm: '#69a3ff',
  anxiety: '#6e5ae6',
  sadness: '#5a77d1',
  anger: '#d64d7b',
  positive: '#b16ce8',
  neutral: '#69a3ff',
  negative: '#d64d7b'
};

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-white/10 bg-[#1b102d]/95 px-4 py-3 text-sm shadow-panel">
      {label ? <p className="font-semibold text-moon">{label}</p> : null}
      {payload.map((item) => (
        <p key={`${item.name}_${item.dataKey}`} className="mt-1 text-mist/75">
          {item.name || item.dataKey}: <span className="text-moon">{item.value}</span>
        </p>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.getInsights().then(setData).catch(() => {});
  }, []);

  const profile = data?.profile;
  const insights = data?.insights;

  const radarData = profile ? [
    { trait: 'Self-awareness', value: Math.min(94, (profile.thinkingStyle || 55) + 6) },
    { trait: 'Empathy', value: Math.min(90, (profile.engagementLevel || 50) + 8) },
    { trait: 'Resilience', value: profile.emotionalStability || 55 },
    { trait: 'Optimism', value: profile.emotionalStability ? Math.min(90, profile.emotionalStability + 4) : 58 },
    { trait: 'Mindfulness', value: Math.min(92, (profile.thinkingStyle || 50) + 3) },
    { trait: 'Adaptability', value: Math.min(90, (profile.engagementLevel || 50) + 5) }
  ] : [];

  const weeklyEmotionData = useMemo(() => {
    const base = insights?.sentimentHistory?.length ? insights.sentimentHistory : [
      { point: 'W1', value: 1 },
      { point: 'W2', value: 0 },
      { point: 'W3', value: 2 },
      { point: 'W4', value: -1 },
      { point: 'W5', value: 3 },
      { point: 'W6', value: 2 }
    ];

    return base.map((item, index) => ({
      point: item.point || `W${index + 1}`,
      joy: 58 + index * 4 + Math.max(item.value, 0) * 5,
      calm: 52 + index * 3,
      anxiety: Math.max(16, 42 - index * 3 + (item.value < 0 ? 8 : 0))
    }));
  }, [insights]);

  const emotionDistribution = useMemo(() => {
    const tones = insights?.emotionHistory?.map((item) => item.tone) || [];
    if (!tones.length) {
      return [
        { name: 'Joy', value: 32 },
        { name: 'Calm', value: 24 },
        { name: 'Anxiety', value: 18 },
        { name: 'Sadness', value: 12 },
        { name: 'Anger', value: 6 }
      ];
    }

    const counts = tones.reduce((acc, tone) => {
      const mapped = tone === 'hopeful' ? 'Joy' : tone === 'warm' ? 'Calm' : tone === 'stressed' ? 'Anxiety' : tone === 'calm' ? 'Calm' : 'Joy';
      acc[mapped] = (acc[mapped] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [insights]);

  const wellbeingTrend = Array.from({ length: 12 }, (_, index) => ({
    point: `W${index + 1}`,
    score: Math.min(94, 58 + index * 3 + ((index % 3) - 1) * 4 + Math.round((profile?.emotionalStability || 55) / 12))
  }));

  const sentimentByTopic = [
    { topic: 'Work', positive: 66, neutral: 22, negative: 12 },
    { topic: 'Relationships', positive: 72, neutral: 18, negative: 10 },
    { topic: 'Health', positive: 48, neutral: 30, negative: 22 },
    { topic: 'Goals', positive: 85, neutral: 10, negative: 5 },
    { topic: 'Past', positive: 40, neutral: 34, negative: 26 },
    { topic: 'Creativity', positive: 90, neutral: 7, negative: 3 }
  ];

  const moodVsEnergy = [
    { mood: 45, energy: 30 },
    { mood: 55, energy: 35 },
    { mood: 72, energy: 50 },
    { mood: 60, energy: 48 },
    { mood: 84, energy: 78 },
    { mood: 65, energy: 72 },
    { mood: 90, energy: 88 },
    { mood: 78, energy: 82 }
  ];

  const moodTimeData = [
    { time: '9am', mood: 55, energy: 46 },
    { time: '12pm', mood: 76, energy: 84 },
    { time: '3pm', mood: 62, energy: 61 },
    { time: '6pm', mood: 68, energy: 55 },
    { time: '9pm', mood: 78, energy: 40 },
    { time: '12am', mood: 64, energy: 22 }
  ];

  const observationCards = profile?.behavioralPatterns?.length
    ? profile.behavioralPatterns
    : [
        'Your mood peaks during midday and early evening, suggesting these may be strong windows for reflective conversation.',
        'High-energy days appear to coincide with more constructive language and clearer self-expression.',
        'You tend to speak more openly when a topic feels personal rather than purely practical.'
      ];

  const statCards = [
    { label: 'Overall Mood', value: profile?.emotionalStability > 65 ? 'Positive' : 'Mixed', delta: '+12%', color: 'text-aqua' },
    { label: 'Mental Clarity', value: profile?.thinkingStyle > 60 ? 'High' : 'Growing', delta: '+8%', color: 'text-aqua' },
    { label: 'Emotional Balance', value: profile?.emotionalStability > 55 ? 'Stable' : 'Variable', delta: profile ? `±${Math.max(2, 100 - profile.emotionalStability)}%` : '±2%', color: 'text-mist' },
    { label: 'Energy Level', value: profile?.engagementLevel > 65 ? 'Elevated' : 'Moderate', delta: '-5%', color: 'text-rose-300' }
  ];

  return (
    <div className="space-y-6">
      <section className="glass-panel overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(142,77,255,0.36),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_35%)]" />
        <div className="relative page-hero">
          <div className="page-hero-copy">
            <p className="text-xs uppercase tracking-[0.35em] text-violet/80">Mood Insights</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Deep analysis of emotional patterns, cognitive trends, and psychological wellbeing over time.</h2>
            <p className="mt-4 max-w-3xl text-sm leading-8 text-mist/78">
              This dashboard is meant to feel alive: hover the charts, compare signals, and treat everything as a mirror for reflection rather than a label.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="glass-panel p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className={`text-2xl font-semibold ${card.color}`}>{card.value}</p>
                <p className="mt-1 text-sm text-mist/72">{card.label}</p>
              </div>
              <span className={`text-sm ${card.delta.startsWith('-') ? 'text-rose-300' : 'text-aqua'}`}>{card.delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <section className="glass-panel p-6">
          <p className="text-lg font-medium text-moon">Weekly Emotion Breakdown</p>
          <p className="mt-1 text-sm text-mist/68">Stacked emotional layers across the week</p>
          <div className="mt-6 h-[320px] min-w-0">
            <ResponsiveContainer>
              <AreaChart data={weeklyEmotionData}>
                <defs>
                  <linearGradient id="joyFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c06cff" stopOpacity={0.36} />
                    <stop offset="95%" stopColor="#c06cff" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="calmFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#69a3ff" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#69a3ff" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="point" tick={{ fill: '#c5b2e7', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#a38cc7', fontSize: 12 }} axisLine={false} tickLine={false} width={32} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ color: '#c5b2e7' }} />
                <Area type="monotone" dataKey="joy" name="Joy" stroke="#c06cff" fill="url(#joyFill)" strokeWidth={3} />
                <Area type="monotone" dataKey="calm" name="Calm" stroke="#69a3ff" fill="url(#calmFill)" strokeWidth={2.5} />
                <Line type="monotone" dataKey="anxiety" name="Anxiety" stroke="#6e5ae6" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="glass-panel p-6">
          <p className="text-lg font-medium text-moon">Emotion Distribution</p>
          <p className="mt-1 text-sm text-mist/68">How your emotions are distributed</p>
          <div className="mt-6 h-[320px] min-w-0">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={emotionDistribution} dataKey="value" nameKey="name" innerRadius={72} outerRadius={110} paddingAngle={4}>
                  {emotionDistribution.map((item) => (
                    <Cell key={item.name} fill={palette[item.name.toLowerCase()] || '#c06cff'} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <section className="glass-panel p-6">
          <p className="text-lg font-medium text-moon">Wellbeing Score Trend</p>
          <p className="mt-1 text-sm text-mist/68">12-week mental wellbeing trajectory</p>
          <div className="mt-6 h-[300px] min-w-0">
            <ResponsiveContainer>
              <LineChart data={wellbeingTrend}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="point" tick={{ fill: '#c5b2e7', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#a38cc7', fontSize: 12 }} axisLine={false} tickLine={false} width={32} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="score" stroke="#c06cff" strokeWidth={3} dot={{ r: 4, fill: '#c06cff' }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="glass-panel p-6">
          <p className="text-lg font-medium text-moon">Sentiment by Topic</p>
          <p className="mt-1 text-sm text-mist/68">How conversations feel across different subjects</p>
          <div className="mt-6 h-[300px] min-w-0">
            <ResponsiveContainer>
              <BarChart data={sentimentByTopic} layout="vertical" stackOffset="expand">
                <CartesianGrid stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis dataKey="topic" type="category" tick={{ fill: '#c5b2e7', fontSize: 12 }} axisLine={false} tickLine={false} width={88} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ color: '#c5b2e7' }} />
                <Bar dataKey="positive" stackId="a" fill="#b16ce8" radius={[6, 0, 0, 6]} />
                <Bar dataKey="neutral" stackId="a" fill="#69a3ff" />
                <Bar dataKey="negative" stackId="a" fill="#d64d7b" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="glass-panel p-6">
          <p className="text-lg font-medium text-moon">Cognitive Profile</p>
          <p className="mt-1 text-sm text-mist/68">Psychological trait mapping</p>
          <div className="mt-6 h-[290px] min-w-0">
            <ResponsiveContainer>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="trait" tick={{ fill: '#c5b2e7', fontSize: 11 }} />
                <Radar dataKey="value" stroke="#c06cff" fill="#c06cff" fillOpacity={0.24} />
                <Tooltip content={<ChartTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="glass-panel p-6">
          <p className="text-lg font-medium text-moon">Mood vs Energy</p>
          <p className="mt-1 text-sm text-mist/68">Correlation between energy and mood levels</p>
          <div className="mt-6 h-[290px] min-w-0">
            <ResponsiveContainer>
              <ScatterChart>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                <XAxis type="number" dataKey="energy" name="Energy" tick={{ fill: '#c5b2e7', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis type="number" dataKey="mood" name="Mood" tick={{ fill: '#c5b2e7', fontSize: 12 }} axisLine={false} tickLine={false} width={32} />
                <Tooltip cursor={{ strokeDasharray: '4 4' }} content={<ChartTooltip />} />
                <Scatter data={moodVsEnergy} fill="#b16ce8" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="glass-panel p-6">
          <p className="text-lg font-medium text-moon">Mood by Time of Day</p>
          <p className="mt-1 text-sm text-mist/68">When you feel your best</p>
          <div className="mt-6 h-[290px] min-w-0">
            <ResponsiveContainer>
              <LineChart data={moodTimeData}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="time" tick={{ fill: '#c5b2e7', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#a38cc7', fontSize: 12 }} axisLine={false} tickLine={false} width={30} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ color: '#c5b2e7' }} />
                <Line type="monotone" dataKey="mood" stroke="#c06cff" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="energy" stroke="#69a3ff" strokeWidth={2.5} strokeDasharray="4 4" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="glass-panel p-6">
        <p className="text-lg font-medium text-moon">Key Psychological Observations</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {observationCards.map((item) => (
            <div key={item} className="glow-card p-5 text-sm leading-8 text-mist/78">{item}</div>
          ))}
        </div>
      </section>
    </div>
  );
}
