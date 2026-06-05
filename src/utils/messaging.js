export const DEMO_USER_EMAIL = "demo.anteater@uci.edu";

export function normalizeEmail(email) {
  return (email || DEMO_USER_EMAIL).trim().toLowerCase();
}

export function getParticipantEmail(user, profile) {
  return normalizeEmail(user?.email || profile?.schoolEmail || DEMO_USER_EMAIL);
}

export function getConversationId(emailA, emailB) {
  return [normalizeEmail(emailA), normalizeEmail(emailB)].sort().join("__");
}

export function getConversationStorageKey(emailA, emailB) {
  return `zotmate:messages:${getConversationId(emailA, emailB)}`;
}

export function loadStoredMessages(storageKey, fallbackMessages = []) {
  if (typeof window === "undefined") return fallbackMessages;

  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : fallbackMessages;
  } catch {
    return fallbackMessages;
  }
}

export function saveStoredMessages(storageKey, messages) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(storageKey, JSON.stringify(messages));
}

export function messageTimestamp(message) {
  if (typeof message?.createdAt === "number") return message.createdAt;
  if (typeof message?.clientCreatedAt === "number") return message.clientCreatedAt;
  if (message?.createdAt?.toMillis) return message.createdAt.toMillis();
  return Date.now();
}
