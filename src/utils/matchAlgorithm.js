/**
 * Algo Logic: Filters pairs by gender and looking for, then based on score compatibility.
 * Done with point system +10 per shared class, +5 for major, +3 for year, +5 per shared interest.
 * Matches greedily based on highest total score.
 */

// Pure point breakdown per category
const POINTS = {
  CLASS: 10,
  MAJOR: 5,
  YEAR: 3,
  INTEREST: 5,
};

/** @param {object} user */
function classIds(user) {
  return new Set(
    (user.classes || []).map((c) => (typeof c === "object" ? c.id : c))
  );
}

/** @param {object} user */
function interestSet(user) {
  return new Set(user.interests || []);
}

/** @param {object} userA @param {object} userB */
function sameMajor(userA, userB) {
  const idA = userA.majorId;
  const idB = userB.majorId;
  if (idA && idB) return idA === idB;

  const majorA = userA.major ? String(userA.major).trim().toLowerCase() : "";
  const majorB = userB.major ? String(userB.major).trim().toLowerCase() : "";
  return Boolean(majorA && majorB && majorA === majorB);
}

/**
 * Users must be mutually compatible from gender and looking for preferences (iAm and lookingFor)
 * @param {object} userA 
 * @param {object} userB 
 */
export function isMutuallyCompatible(userA, userB) {
  return userA.lookingFor === userB.iAm && userB.lookingFor === userA.iAm;
}

/**
 * Calculates total match score based purely on the point system (+10, +5, +3, +5)
 * @param {object} userA 
 * @param {object} userB 
 */
export function calculateMatchScore(userA, userB) {
  const emptyBreakdown = {
    sharedClasses: 0,
    classPoints: 0,
    sameMajor: false,
    majorPoints: 0,
    sameYear: false,
    yearPoints: 0,
    sharedInterests: 0,
    interestPoints: 0,
  };

  // Check that they have mutual preference compatibility
  if (!isMutuallyCompatible(userA, userB)) {
    return {
      score: 0,
      userProfileBreakdown: emptyBreakdown,
      sharedClasses: [],
      sharedInterests: [],
    };
  }

  // Calculate Base Points
  const classSetA = classIds(userA);
  const classSetB = classIds(userB);
  const sharedClasses = [...classSetA].filter((id) => classSetB.has(id));
  const classPoints = sharedClasses.length * POINTS.CLASS;

  const sameMajorFlag = sameMajor(userA, userB);
  const majorPoints = sameMajorFlag ? POINTS.MAJOR : 0;

  const sameYearFlag = Boolean(
    userA.schoolYear && userA.schoolYear === userB.schoolYear
  );
  const yearPoints = sameYearFlag ? POINTS.YEAR : 0;

  const intSetA = interestSet(userA);
  const intSetB = interestSet(userB);
  const sharedInterests = [...intSetA].filter((interest) =>
    intSetB.has(interest)
  );
  const interestPoints = sharedInterests.length * POINTS.INTEREST;

  // Pure additive score (no weights)
  const finalScore = classPoints + majorPoints + yearPoints + interestPoints;

  // Return the calculated payload
  return {
    score: finalScore,
    userProfileBreakdown: {
      sharedClasses: sharedClasses.length,
      classPoints,
      sameMajor: sameMajorFlag,
      majorPoints,
      sameYear: sameYearFlag,
      yearPoints,
      sharedInterests: sharedInterests.length,
      interestPoints,
    },
    sharedClasses,
    sharedInterests,
  };
}

/**
 * Greedy algorithm for point comparison to determine the best match
 * @param {object} x 
 * @param {object} y 
 */
function comparePairsForGreedy(x, y) {
  // Primary Sort: Highest Total Score
  if (y.score !== x.score) return y.score - x.score;

  // Secondary Sort (Tie-breaker): Amount of Shared Classes
  const classDiff =
    y.userProfileBreakdown.sharedClasses - x.userProfileBreakdown.sharedClasses;
  if (classDiff !== 0) return classDiff;

  // Tertiary Sort (Tie-breaker): Same Major
  if (x.userProfileBreakdown.sameMajor !== y.userProfileBreakdown.sameMajor) {
    return (
      (y.userProfileBreakdown.sameMajor ? 1 : 0) -
      (x.userProfileBreakdown.sameMajor ? 1 : 0)
    );
  }

  // Quaternary Sort (Tie-breaker): Same Year
  if (x.userProfileBreakdown.sameYear !== y.userProfileBreakdown.sameYear) {
    return (
      (y.userProfileBreakdown.sameYear ? 1 : 0) -
      (x.userProfileBreakdown.sameYear ? 1 : 0)
    );
  }

  // Quinary Sort (Tie-breaker): Shared Interests
  const interestDiff =
    y.userProfileBreakdown.sharedInterests -
    x.userProfileBreakdown.sharedInterests;
  if (interestDiff !== 0) return interestDiff;

  // Final tie-breaker: UID string comparison to ensure consistent, stable sorting
  const uidCmp = String(x.a.uid).localeCompare(String(y.a.uid));
  if (uidCmp !== 0) return uidCmp;
  return String(x.b.uid).localeCompare(String(y.b.uid));
}

/**
 * Run the full weekly matching pass: score all compatible pairs, greedy pair by score.
 * Users without `uid` are skipped. An odd user out remains unmatched.
 * @param {object[]} users 
 */
export function runWeeklyMatching(users) {
  const eligible = (users || []).filter((user) => user?.uid);
  const pairs = [];

  for (let i = 0; i < eligible.length; i++) {
    for (let j = i + 1; j < eligible.length; j++) {
      const a = eligible[i];
      const b = eligible[j];
      
      if (!isMutuallyCompatible(a, b)) continue;

      const result = calculateMatchScore(a, b);
      pairs.push({
        a,
        b,
        score: result.score,
        userProfileBreakdown: result.userProfileBreakdown,
        sharedClasses: result.sharedClasses,
        sharedInterests: result.sharedInterests,
      });
    }
  }

  // Sort pairs highest score to lowest based on our greedy comparison logic
  pairs.sort(comparePairsForGreedy);

  const matched = new Set();
  const matches = [];

  for (const pair of pairs) {
    // If either user is already matched, skip this pair
    if (matched.has(pair.a.uid) || matched.has(pair.b.uid)) continue;

    // Mark both users as matched
    matched.add(pair.a.uid);
    matched.add(pair.b.uid);

    matches.push({
      userAId: pair.a.uid,
      userBId: pair.b.uid,
      score: pair.score,
      userProfileBreakdown: pair.userProfileBreakdown,
      sharedClasses: pair.sharedClasses,
      sharedInterests: pair.sharedInterests,
      createdAt: new Date().toISOString(),
    });
  }

  return matches;
}
