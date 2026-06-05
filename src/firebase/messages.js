import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db, isFirebaseReady } from "./config";
import { getConversationId, messageTimestamp, normalizeEmail } from "../utils/messaging";

export function canUseFirestoreMessages() {
  return isFirebaseReady() && Boolean(db);
}

export function subscribeToConversation({ currentUserEmail, matchEmail, matchId }, onMessages, onError) {
  if (!canUseFirestoreMessages()) return null;

  const participantEmails = [normalizeEmail(currentUserEmail), normalizeEmail(matchEmail)].sort();
  const conversationId = getConversationId(participantEmails[0], participantEmails[1]);
  const conversationRef = doc(db, "conversations", conversationId);

  setDoc(
    conversationRef,
    {
      id: conversationId,
      matchId,
      participantEmails,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  ).catch((error) => onError?.(error));

  const messagesQuery = query(
    collection(db, "conversations", conversationId, "messages"),
    orderBy("createdAt", "asc"),
  );

  return onSnapshot(
    messagesQuery,
    (snapshot) => {
      onMessages(
        snapshot.docs.map((messageDoc) => {
          const data = messageDoc.data();
          return {
            id: messageDoc.id,
            ...data,
            createdAt: messageTimestamp(data),
          };
        }),
      );
    },
    (error) => onError?.(error),
  );
}

export async function sendFirestoreMessage({ currentUserEmail, matchEmail, matchId, text }) {
  if (!canUseFirestoreMessages()) {
    throw new Error("Firestore is not configured.");
  }

  const participantEmails = [normalizeEmail(currentUserEmail), normalizeEmail(matchEmail)].sort();
  const conversationId = getConversationId(participantEmails[0], participantEmails[1]);
  const conversationRef = doc(db, "conversations", conversationId);
  const now = Date.now();

  await setDoc(
    conversationRef,
    {
      id: conversationId,
      matchId,
      participantEmails,
      lastMessageText: text,
      lastSenderEmail: normalizeEmail(currentUserEmail),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  await addDoc(collection(db, "conversations", conversationId, "messages"), {
    senderEmail: normalizeEmail(currentUserEmail),
    text,
    createdAt: serverTimestamp(),
    clientCreatedAt: now,
  });
}
