import { useEffect, useState, useCallback } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

function toMillis(ts) {
  if (!ts) return 0;
  if (typeof ts.toMillis === "function") return ts.toMillis();
  if (typeof ts === "number") return ts;
  return new Date(ts).getTime();
}

export function useChatMessages(matchId, senderId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!matchId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const messagesRef = collection(db, "matches", matchId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const next = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            senderId: data.senderId,
            text: data.text,
            createdAt: toMillis(data.createdAt),
          };
        });
        setMessages(next);
        setLoading(false);
      },
      (err) => {
        console.error("Error listening to messages:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [matchId]);

  const sendMessage = useCallback(
    async (text) => {
      if (!matchId || !senderId || !text.trim()) return;

      const messagesRef = collection(db, "matches", matchId, "messages");
      await addDoc(messagesRef, {
        senderId,
        text: text.trim(),
        createdAt: serverTimestamp(),
      });
    },
    [matchId, senderId]
  );

  return { messages, loading, error, sendMessage };
}
