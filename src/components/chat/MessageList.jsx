import { useEffect, useRef } from "react";

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MessageList({ messages, currentUserId }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-4">👋</div>
        <p className="text-white font-semibold">Say hello!</p>
        <p className="text-slate-400 text-sm mt-1">You've been matched. Break the ice!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
      {messages.map((msg, i) => {
        const isMe = msg.senderId === currentUserId;
        const prevMsg = messages[i - 1];
        const showTime = !prevMsg || msg.createdAt - prevMsg.createdAt > 300000;

        return (
          <div key={msg.id}>
            {showTime && (
              <p className="text-slate-600 text-xs text-center my-3">{formatTime(msg.createdAt)}</p>
            )}
            <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                ${isMe
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-slate-800 text-white border border-slate-700 rounded-bl-sm"
                }`}>
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
