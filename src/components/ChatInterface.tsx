import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import ChatMessage from "./ChatMessage";
import aiAvatarImg from "@/assets/ai-avatar.png";

interface Message {
  id: number;
  content: string;
  isAi: boolean;
}

const initialMessages: Message[] = [
  {
    id: 1,
    content: "Hello… I'm here whenever you're ready to talk. What's on your mind tonight?",
    isAi: true,
  },
];

const aiResponses = [
  "That's a really thoughtful perspective. Sometimes the quietest moments reveal the most about ourselves.",
  "I hear you. It's okay to sit with those feelings — they don't always need an answer right away.",
  "The fact that you're reflecting on this shows real self-awareness. What do you think triggered that thought?",
  "That's interesting… sometimes the things we notice in the stillness are the ones that matter most.",
  "Take your time. There's no rush here. This space is yours.",
];

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || isThinking) return;

    const userMsg: Message = { id: Date.now(), content: input.trim(), isAi: false };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    setTimeout(() => {
      const response = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      setMessages((prev) => [...prev, { id: Date.now() + 1, content: response, isAi: true }]);
      setIsThinking(false);
    }, 1500 + Math.random() * 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="relative z-20 flex flex-col h-full max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 pb-4">
        <h1 className="font-display text-lg font-medium tracking-wide text-foreground/80">
          Midnight Reflection
        </h1>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pb-4 scrollbar-none">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} content={msg.content} isAi={msg.isAi} />
        ))}
        {isThinking && (
          <div className="flex gap-3 items-end animate-message-in">
            <div className="relative w-10 h-10 rounded-full flex-shrink-0 overflow-hidden">
              <div
                className="absolute -inset-[2px] rounded-full animate-gradient-spin animate-pulse-glow"
                style={{
                  background: "conic-gradient(from 0deg, hsl(270 80% 60%), hsl(330 80% 72%), hsl(260 70% 50%), hsl(270 80% 60%))",
                }}
              />
              <img
                src={aiAvatarImg}
                alt="AI thinking"
                className="relative w-full h-full rounded-full object-cover scale-[0.85]"
              />
            </div>
            <div className="glass rounded-2xl rounded-tl-md px-4 py-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="glass-strong rounded-2xl flex items-center gap-2 px-4 py-2">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Share your thoughts…"
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || isThinking}
          className="p-2 rounded-xl bg-secondary/50 text-foreground/70 hover:bg-secondary hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
