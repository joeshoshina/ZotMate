/* eslint-disable no-undef */
// Weekly match job — runs every Monday at midnight
// When Firebase is wired up, this will use Firestore + Cloud Scheduler

/**
 * Calculates match score between two user profiles.
 * classOverlap: 50%, sharedInterests: 30%, identityCompatibility: 20%
 */
function calcScore(userA, userB) {
  const classSetA = new Set((userA.classes || []).map(c => c.id || c));
  const classSetB = new Set((userB.classes || []).map(c => c.id || c));
  const sharedClasses = [...classSetA].filter(c => classSetB.has(c)).length;
  const classOverlap = Math.min(sharedClasses / Math.max(classSetA.size, 1), 1);

  const intSetA = new Set(userA.interests || []);
  const intSetB = new Set(userB.interests || []);
  const sharedInterests = [...intSetA].filter(i => intSetB.has(i)).length;
  const interestScore = Math.min(sharedInterests / Math.max(intSetA.size, 1), 1);

  const identityScore =
    userA.lookingFor === userB.iAm && userB.lookingFor === userA.iAm ? 1.0
    : userA.lookingFor === userB.iAm || userB.lookingFor === userA.iAm ? 0.5
    : 0;

  return Math.round((classOverlap * 0.5 + interestScore * 0.3 + identityScore * 0.2) * 100);
}

/**
 * Main matching logic — pairs users by best score, no repeats.
 * @param {Array} users - Array of user profile objects from Firestore
 * @returns {Array} matches - Array of { userAId, userBId, score, classOverlap, sharedInterests }
 */
function runMatchAlgorithm(users) {
  const matched = new Set();
  const matches = [];

  // Sort all possible pairs by score descending
  const pairs = [];
  for (let i = 0; i < users.length; i++) {
    for (let j = i + 1; j < users.length; j++) {
      pairs.push({ a: users[i], b: users[j], score: calcScore(users[i], users[j]) });
    }
  }
  pairs.sort((x, y) => y.score - x.score);

  for (const { a, b, score } of pairs) {
    if (matched.has(a.uid) || matched.has(b.uid)) continue;
    matched.add(a.uid);
    matched.add(b.uid);

    const classSetA = new Set((a.classes || []).map(c => c.id || c));
    const classSetB = new Set((b.classes || []).map(c => c.id || c));
    const sharedClasses = [...classSetA].filter(c => classSetB.has(c));

    const intSetA = new Set(a.interests || []);
    const intSetB = new Set(b.interests || []);
    const sharedInterests = [...intSetA].filter(i => intSetB.has(i));

    matches.push({
      userAId: a.uid,
      userBId: b.uid,
      score,
      sharedClasses,
      sharedInterests,
      createdAt: new Date().toISOString(),
    });
  }

  return matches;
}

function runWeeklyMatchJob() {
  console.log("[ZotMate] Weekly match job started at", new Date().toISOString());
  // TODO: wire up to Firestore when Firebase is configured:
  // 1. Fetch all users from db.collection("users").get()
  // 2. Run runMatchAlgorithm(users)
  // 3. Write each match to db.collection("matches").add(match)
  // 4. Send FCM push notifications to each matched pair
  console.log("[ZotMate] Match algorithm ready — awaiting Firebase connection.");
}

module.exports = { runWeeklyMatchJob, runMatchAlgorithm, calcScore };
