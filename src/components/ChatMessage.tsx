import AiAvatar from "./AiAvatar";

interface ChatMessageProps {
  content: string;
  isAi: boolean;
  isThinking?: boolean;
}

const ChatMessage = ({ content, isAi, isThinking }: ChatMessageProps) => {
  return (
    <div
      className={`flex gap-3 animate-message-in ${isAi ? "justify-start" : "justify-end"}`}
    >
      {isAi && <AiAvatar isThinking={isThinking} />}
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isAi
            ? "glass rounded-tl-md"
            : "bg-secondary/60 backdrop-blur-md rounded-tr-md"
        }`}
      >
        <p className="text-foreground">{content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
