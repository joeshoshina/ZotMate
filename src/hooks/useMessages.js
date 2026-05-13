import { useMemo } from "react";

export function useMessages(messages = []) {
  const orderedMessages = useMemo(
    () => [...messages].sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0)),
    [messages],
  );

  return { messages: orderedMessages };
}
