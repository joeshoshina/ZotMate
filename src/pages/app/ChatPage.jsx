import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import MessageList from "../../components/chat/MessageList";
import MessageInput from "../../components/chat/MessageInput";
import Sidebar from "../../components/common/Sidebar";
import BottomNav from "../../components/common/BottomNav";
import OfflineBanner from "../../components/common/OfflineBanner";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useMatchReveal } from "../../hooks/useMatchReveal";
import WeeklyMatchLockedCard from "../../components/match/WeeklyMatchLockedCard";
import { useChatMessages } from "../../hooks/useChatMessages";
import { useLiveMatch } from "../../hooks/useLiveMatch";
import RouteLoadingScreen from "../../components/common/RouteLoadingScreen";

export default function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [revealed, reveal] = useMatchReveal();
  const { match, loading: loadingMatch } = useLiveMatch(id, user?.uid, profile);
  const { messages, loading: loadingMessages, sendMessage } = useChatMessages(
    id,
    user?.uid
  );

  useDocumentTitle(
    !match ? "Chat" : !revealed ? "Match" : `Chat with ${match.name}`
  );

  if (loadingMatch) {
    return <RouteLoadingScreen />;
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white font-semibold">Match not found</p>
          <button
            type="button"
            onClick={() => navigate("/matches")}
            className="text-blue-300 text-sm mt-2 hover:text-blue-200"
          >
            ← Back to matches
          </button>
        </div>
      </div>
    );
  }

  if (!revealed) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 pb-24 md:pb-8">
        <div className="w-full max-w-md">
          <p className="text-slate-300 text-sm text-center mb-4">This chat unlocks after you reveal.</p>
          <WeeklyMatchLockedCard onReveal={reveal} />
          <button
            type="button"
            onClick={() => navigate("/matches")}
            className="w-full mt-4 text-blue-300 text-sm hover:text-blue-200"
          >
            ← Back to matches
          </button>
        </div>
        <div className="md:hidden fixed bottom-0 left-0 right-0">
          <BottomNav />
        </div>
      </div>
    );
  }

  const handleSend = async (text) => {
    try {
      await sendMessage(text);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <a
        href="#chat-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-medium focus:shadow-lg"
      >
        Skip to chat
      </a>
      <OfflineBanner />
      <Sidebar />

      <main
        id="chat-main"
        tabIndex={-1}
        className="flex-1 md:ml-64 flex flex-col h-screen"
        aria-label={`Conversation with ${match.name}`}
      >
        <div className="flex items-center gap-3 px-4 pt-12 md:pt-4 pb-3 border-b border-slate-800 bg-slate-950 shrink-0">
          <button
            type="button"
            onClick={() => navigate("/matches")}
            aria-label="Back to matches"
            className="text-slate-300 hover:text-white transition-colors p-1"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-5 h-5"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <div
            className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shrink-0"
            role="img"
            aria-label={`${match.name} avatar`}
          >
            <span className="text-white font-bold text-xs" aria-hidden="true">{match.initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-semibold text-sm">{match.name}</h1>
            <p className="text-slate-300 text-xs">
              {match.year} · {match.major}
            </p>
          </div>
          <span className="bg-blue-600/20 border border-blue-500/40 text-blue-200 text-xs font-semibold px-2 py-0.5 rounded-full">
            {match.score}% match
          </span>
        </div>

        {match.classes?.length > 0 && (
          <div className="px-4 py-2 bg-blue-950/30 border-b border-blue-900/30 shrink-0">
            <p className="text-blue-200 text-xs">
              <span aria-hidden="true">📚 </span>Shared classes:{" "}
              <span className="font-mono font-semibold">{match.classes.join(", ")}</span>
            </p>
          </div>
        )}

        {loadingMessages ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-slate-400 text-sm">Loading messages...</p>
          </div>
        ) : (
          <MessageList messages={messages} currentUserId={user?.uid} />
        )}
        <MessageInput onSend={handleSend} />

        <div className="md:hidden h-16 shrink-0" />
      </main>

      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
