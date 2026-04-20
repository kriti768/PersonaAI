import { motion } from 'framer-motion';
import { BarChart3, BrainCircuit, Lock, MessageCircleHeart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import AmbientBackdrop from '../components/AmbientBackdrop';

const features = [
  {
    icon: MessageCircleHeart,
    title: 'Natural AI conversation',
    copy: 'Users chat with PersonaAI like a calm reflective partner, not a rigid questionnaire.'
  },
  {
    icon: BrainCircuit,
    title: 'Background profiling engine',
    copy: 'Each conversation is analyzed for sentiment, tone, topic, engagement, and communication style.'
  },
  {
    icon: BarChart3,
    title: 'Visual insight dashboard',
    copy: 'Charts turn your chat history into trends, snapshots, and suggestion-based reflection prompts.'
  },
  {
    icon: Lock,
    title: 'Consent and privacy controls',
    copy: 'Profiling is opt-in, non-clinical, exportable, and removable whenever the user wants.'
  }
];

const summaryItems = [
  'AI chat with a warm reflective tone',
  'Conversation history and profile memory',
  'Emotion, trend, and behavioral visualizations',
  'Gemini-powered replies and structured analysis when configured'
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden text-moon">
      <AmbientBackdrop />
      <div className="relative mx-auto max-w-7xl px-6 py-6">
        <header className="glass-panel flex flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#ff9a62,#8e4dff_75%)] text-white shadow-glow">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-lg font-semibold">PersonaAI</p>
              <p className="text-xs uppercase tracking-[0.35em] text-mist/70">AI Psychological Profiling through Conversations</p>
            </div>
          </div>
          <div className="flex gap-3">
            <a href="#summary" className="secondary-btn">Summary</a>
            <Link to="/auth" className="primary-btn">Open app</Link>
          </div>
        </header>

        <section className="grid items-center gap-10 py-14 lg:grid-cols-[1.04fr_0.96fr]">
          <div>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="text-sm uppercase tracking-[0.45em] text-blush/85">
              Understand yourself through conversations
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl">
              A mood-rich AI reflection app where conversation becomes insight.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="mt-6 max-w-2xl text-lg leading-8 text-mist/82">
              PersonaAI is a full-stack product that lets users chat normally with an AI assistant while the system quietly analyzes communication style, emotional patterns, and behavioral tendencies in the background for self-awareness.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="mt-8 flex flex-wrap gap-4">
              <Link to="/auth" className="primary-btn">Start chatting</Link>
              <a href="#features" className="secondary-btn">See features</a>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-6 sm:p-8">
            <div className="rounded-[26px] border border-white/8 bg-[linear-gradient(180deg,rgba(115,66,173,0.4),rgba(37,20,55,0.38))] p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-blush/85">Basic app summary</p>
              <p className="mt-4 text-lg leading-8 text-moon">
                PersonaAI combines a chat assistant, a psychological-pattern analysis layer, and a visual dashboard so users can reflect on how they communicate without being clinically labeled.
              </p>
            </div>

            <div id="summary" className="mt-5 grid gap-3">
              {summaryItems.map((item) => (
                <div key={item} className="glow-card flex items-center gap-3 px-4 py-4 text-sm text-mist/82">
                  <div className="h-2.5 w-2.5 rounded-full bg-violet shadow-glow" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section id="features" className="grid gap-5 pb-10 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="glass-panel p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/6 text-violet">
                  <Icon size={20} />
                </div>
                <h2 className="mt-5 text-2xl font-semibold">{feature.title}</h2>
                <p className="mt-3 text-sm leading-7 text-mist/78">{feature.copy}</p>
              </motion.article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
