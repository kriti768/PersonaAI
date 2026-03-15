import aiAvatarImg from "@/assets/ai-avatar.png";

interface AiAvatarProps {
  isThinking?: boolean;
  size?: number;
}

const AiAvatar = ({ isThinking = false, size = 40 }: AiAvatarProps) => {
  return (
    <div
      className="relative rounded-full flex-shrink-0 overflow-hidden"
      style={{ width: size, height: size }}
    >
      {/* Spinning gradient border when thinking */}
      {isThinking && (
        <div
          className="absolute -inset-[2px] rounded-full animate-gradient-spin animate-pulse-glow"
          style={{
            background: "conic-gradient(from 0deg, hsl(270 80% 60%), hsl(330 80% 72%), hsl(260 70% 50%), hsl(270 80% 60%))",
          }}
        />
      )}
      <img
        src={aiAvatarImg}
        alt="AI"
        className={`relative w-full h-full rounded-full object-cover ${isThinking ? "scale-[0.85]" : ""}`}
      />
    </div>
  );
};

export default AiAvatar;
