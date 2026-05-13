import { useEffect, useRef } from "react";

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function isoTime(ts) {
  return new Date(ts).toISOString();
}

export default function MessageList({ messages, currentUserId }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    bottomRef.current?.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-4" aria-hidden="true">👋</div>
        <p className="text-white font-semibold">Say hello!</p>
        <p className="text-slate-300 text-sm mt-1">You've been matched. Break the ice!</p>
      </div>
    );
  }

  return (
    <div
      role="log"
      aria-label="Message history"
      aria-live="polite"
      aria-relevant="additions"
      className="flex-1 overflow-y-auto px-4 py-4 space-y-2"
    >
      {messages.map((msg, i) => {
        const isMe = msg.senderId === currentUserId;
        const prevMsg = messages[i - 1];
        const showTime = !prevMsg || msg.createdAt - prevMsg.createdAt > 300000;

        return (
          <div key={msg.id}>
            {showTime && (
              <p className="text-slate-400 text-xs text-center my-3">
                <time dateTime={isoTime(msg.createdAt)}>{formatTime(msg.createdAt)}</time>
              </p>
            )}
            <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                ${
                  isMe
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-slate-800 text-white border border-slate-700 rounded-bl-sm"
                }`}
              >
                <span className="sr-only">{isMe ? "You said:" : "They said:"} </span>
                {msg.text}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
