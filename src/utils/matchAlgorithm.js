export function calculateMatchScore(candidate = {}) {
  const classOverlap = candidate.classOverlap ?? 0;
  const sharedInterests = candidate.sharedInterests ?? 0;
  const identityCompatibility = candidate.identityCompatibility ?? 0;

  return (
    classOverlap * 0.5 + sharedInterests * 0.3 + identityCompatibility * 0.2
  );
}
