import { useState } from "react";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="px-4 py-3 border-t border-slate-800 bg-slate-950">
      <div className="flex items-end gap-2">
        <div className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden focus-within:border-blue-500 transition-colors">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="w-full bg-transparent px-4 py-3 text-white placeholder-slate-500 text-sm outline-none resize-none max-h-28"
            style={{ height: "auto" }}
            onInput={e => { e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
          />
        </div>
        <button onClick={handleSend} disabled={!text.trim()}
          className="w-10 h-10 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors shrink-0 mb-0.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4">
            <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
