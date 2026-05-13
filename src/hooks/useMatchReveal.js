import { useCallback, useEffect, useState } from "react";
import { getMatchRoundId } from "../data/mockData";

const STORAGE_KEY = "zotmate-match-revealed";

/**
 * Weekly match starts unrevealed. After the user reveals, that choice persists for the
 * rest of the round until the next Monday (new match round), when the stored round id
 * no longer matches and the UI resets to unrevealed.
 */
function safeGetItem() {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function safeSetItem(value) {
  try {
    if (typeof window === "undefined") return false;
    window.localStorage.setItem(STORAGE_KEY, value);
    return true;
  } catch {
    return false;
  }
}

export function useMatchReveal() {
  const [roundId, setRoundId] = useState(() =>
    typeof window !== "undefined" ? getMatchRoundId() : ""
  );
  const [storedRevealedRoundId, setStoredRevealedRoundId] = useState(() => safeGetItem());

  useEffect(() => {
    const tick = () => {
      setRoundId(getMatchRoundId());
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setStoredRevealedRoundId(e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const revealed = Boolean(storedRevealedRoundId && storedRevealedRoundId === roundId);

  const reveal = useCallback(() => {
    const id = getMatchRoundId();
    safeSetItem(id);
    setStoredRevealedRoundId(id);
  }, []);

  return [revealed, reveal];
}
