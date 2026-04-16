import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import MessageList from "../../components/chat/MessageList";
import MessageInput from "../../components/chat/MessageInput";
import { MOCK_MATCHES, MOCK_MESSAGES } from "../../data/mockData";
import Sidebar from "../../components/common/Sidebar";
import BottomNav from "../../components/common/BottomNav";
import OfflineBanner from "../../components/common/OfflineBanner";

export default function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const match = MOCK_MATCHES.find(m => m.id === id);
  const [messages, setMessages] = useState(MOCK_MESSAGES[id] || []);

  if (!match) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white font-semibold">Match not found</p>
          <button onClick={() => navigate("/matches")} className="text-blue-400 text-sm mt-2">← Back to matches</button>
        </div>
      </div>
    );
  }

  const handleSend = (text) => {
    const newMsg = { id: `msg-${Date.now()}`, senderId: user?.uid || "mock-uid-1", text, createdAt: Date.now() };
    setMessages(prev => [...prev, newMsg]);
    if (Math.random() > 0.4) {
      const replies = ["That sounds great!", "Haha yes exactly 😄", "Definitely! When are you free?", "Same lol", "We should study together!"];
      setTimeout(() => {
        setMessages(prev => [...prev, { id: `reply-${Date.now()}`, senderId: id, text: replies[Math.floor(Math.random() * replies.length)], createdAt: Date.now() }]);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <OfflineBanner />
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Chat takes full height on mobile, offset on desktop */}
      <div className="flex-1 md:ml-64 flex flex-col h-screen">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-12 md:pt-4 pb-3 border-b border-slate-800 bg-slate-950 shrink-0">
          <button onClick={() => navigate("/matches")} className="text-slate-400 hover:text-white transition-colors p-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </button>
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-xs">{match.initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm">{match.name}</p>
            <p className="text-slate-400 text-xs">{match.year} · {match.major}</p>
          </div>
          <span className="bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-semibold px-2 py-0.5 rounded-full">{match.score}% match</span>
        </div>

        {/* Shared classes banner */}
        {match.classes?.length > 0 && (
          <div className="px-4 py-2 bg-blue-950/30 border-b border-blue-900/30 shrink-0">
            <p className="text-blue-300 text-xs">📚 Shared classes: <span className="font-mono font-semibold">{match.classes.join(", ")}</span></p>
          </div>
        )}

        <MessageList messages={messages} currentUserId={user?.uid || "mock-uid-1"} />
        <MessageInput onSend={handleSend} />

        {/* Mobile bottom nav placeholder spacing */}
        <div className="md:hidden h-16 shrink-0" />
      </div>

      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
