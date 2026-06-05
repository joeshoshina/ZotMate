import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import MessageList from "../../components/chat/MessageList";
import MessageInput from "../../components/chat/MessageInput";
import { getMatchByIdForEmail, MOCK_MESSAGES, WEEKLY_FEATURED_MATCH_ID } from "../../data/mockData";
import {
  canUseFirestoreMessages,
  sendFirestoreMessage,
  subscribeToConversation,
} from "../../firebase/messages";
import Sidebar from "../../components/common/Sidebar";
import BottomNav from "../../components/common/BottomNav";
import OfflineBanner from "../../components/common/OfflineBanner";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useMatchReveal } from "../../hooks/useMatchReveal";
import { useMessages } from "../../hooks/useMessages";
import WeeklyMatchLockedCard from "../../components/match/WeeklyMatchLockedCard";
import {
  DEMO_USER_EMAIL,
  getConversationStorageKey,
  getParticipantEmail,
  loadStoredMessages,
  saveStoredMessages,
} from "../../utils/messaging";

export default function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [revealed, reveal] = useMatchReveal();
  const [chatError, setChatError] = useState("");
  const currentUserEmail = getParticipantEmail(user, profile);
  const match = getMatchByIdForEmail(id, currentUserEmail);
  const matchEmail = match?.email;
  const usingFirestore = canUseFirestoreMessages();
  const storageKey = useMemo(
    () => (matchEmail ? getConversationStorageKey(currentUserEmail, matchEmail) : null),
    [currentUserEmail, matchEmail]
  );
  const seededMessages = useMemo(
    () =>
      (MOCK_MESSAGES[id] || []).map((message) =>
        message.senderEmail === DEMO_USER_EMAIL
          ? { ...message, senderEmail: currentUserEmail }
          : message
      ),
    [currentUserEmail, id]
  );
  const initialMessages = useMemo(
    () => (storageKey && !usingFirestore ? loadStoredMessages(storageKey, seededMessages) : []),
    [seededMessages, storageKey, usingFirestore]
  );
  const [draftMessages, setDraftMessages] = useState(initialMessages);
  const { messages } = useMessages(draftMessages);
  useDocumentTitle(
    !match ? "Chat" : match.id === WEEKLY_FEATURED_MATCH_ID && !revealed ? "Match" : `Chat with ${match.name}`
  );

  useEffect(() => {
    if (!storageKey || usingFirestore) return;
    saveStoredMessages(storageKey, draftMessages);
  }, [draftMessages, storageKey, usingFirestore]);

  useEffect(() => {
    if (!usingFirestore || !matchEmail) return undefined;

    return subscribeToConversation(
      { currentUserEmail, matchEmail, matchId: match.id },
      (nextMessages) => {
        setDraftMessages(nextMessages);
        setChatError("");
      },
      (error) => {
        console.error("Error loading conversation:", error);
        setChatError("Could not sync this chat from Firebase. Check Firestore rules and config.");
      },
    );
  }, [currentUserEmail, match, matchEmail, usingFirestore]);

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

  if (match.id === WEEKLY_FEATURED_MATCH_ID && !revealed) {
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

  const handleSend = (text) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderEmail: currentUserEmail,
      text,
      createdAt: Date.now(),
    };

    if (usingFirestore) {
      setChatError("");
      sendFirestoreMessage({ currentUserEmail, matchEmail, matchId: match.id, text }).catch((error) => {
        console.error("Error sending message:", error);
        setChatError("Could not send this message to Firebase. Check Firestore rules and config.");
      });
      return;
    }

    setDraftMessages((prev) => [...prev, newMsg]);
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
            <p className="text-slate-400 text-xs truncate">
              {currentUserEmail} to {matchEmail}
            </p>
          </div>
          <span className="bg-blue-600/20 border border-blue-500/40 text-blue-200 text-xs font-semibold px-2 py-0.5 rounded-full">
            {match.score}% match
          </span>
        </div>

        <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/50 shrink-0">
          <p className="text-slate-300 text-xs">
            {usingFirestore ? "Firebase chat sync is on" : "Local demo chat sync is on"}
          </p>
          {chatError && (
            <p role="alert" className="text-red-300 text-xs mt-1">
              {chatError}
            </p>
          )}
        </div>

        {match.classes?.length > 0 && (
          <div className="px-4 py-2 bg-blue-950/30 border-b border-blue-900/30 shrink-0">
            <p className="text-blue-200 text-xs">
              <span aria-hidden="true">📚 </span>Shared classes:{" "}
              <span className="font-mono font-semibold">{match.classes.join(", ")}</span>
            </p>
          </div>
        )}

        <MessageList messages={messages} currentUserEmail={currentUserEmail} />
        <MessageInput onSend={handleSend} />

        <div className="md:hidden h-16 shrink-0" />
      </main>

      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
