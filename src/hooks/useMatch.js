import { useMemo } from "react";

export function useMatch(matches = []) {
  const sortedMatches = useMemo(
    () => [...matches].sort((a, b) => (b.score ?? 0) - (a.score ?? 0)),
    [matches],
  );

  return { matches: sortedMatches };
}
