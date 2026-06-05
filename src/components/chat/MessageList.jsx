import { useEffect, useRef } from "react";
import { normalizeEmail } from "../../utils/messaging";

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function isoTime(ts) {
  return new Date(ts).toISOString();
}

function senderLabel(message, isMe, otherUserName) {
  if (isMe) return "You";
  return otherUserName || message.senderEmail || "Matched account";
}

export default function MessageList({ messages, currentUserEmail, otherUserName }) {
  const bottomRef = useRef(null);
  const normalizedCurrentUserEmail = normalizeEmail(currentUserEmail);

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
        const normalizedSenderEmail = normalizeEmail(msg.senderEmail || msg.senderId);
        const isMe = normalizedSenderEmail === normalizedCurrentUserEmail;
        const prevMsg = messages[i - 1];
        const prevSenderEmail = normalizeEmail(prevMsg?.senderEmail || prevMsg?.senderId);
        const showTime = !prevMsg || msg.createdAt - prevMsg.createdAt > 300000;
        const startsGroup = showTime || prevSenderEmail !== normalizedSenderEmail;
        const label = senderLabel(msg, isMe, otherUserName);

        return (
          <div key={msg.id} className={startsGroup ? "pt-2" : ""}>
            {showTime && (
              <p className="text-slate-400 text-xs text-center my-3">
                <time dateTime={isoTime(msg.createdAt)}>{formatTime(msg.createdAt)}</time>
              </p>
            )}
            <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                {startsGroup && (
                  <p className={`text-[11px] text-slate-400 mb-1 px-1 ${isMe ? "text-right" : "text-left"}`}>
                    {label}
                  </p>
                )}
                <div
                  className={`px-4 py-2.5 text-sm leading-relaxed shadow-sm
                  ${
                    isMe
                      ? "bg-blue-600 text-white rounded-2xl rounded-br-md"
                      : "bg-slate-800 text-white border border-slate-700 rounded-2xl rounded-bl-md"
                  }`}
                >
                  <span className="sr-only">{label} said: </span>
                  {msg.text}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
