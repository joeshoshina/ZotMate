/**
 *
 * Algo Logic: Filters pairs by gender and looking for, then based on score commpatibility
 * Done with point system +10 per shared class, +5 for major, +3 for year, +5 per shared interest
 * 
 * uses fileds uid, iAm, lookingFor, schoolYear, major, classes, and interests
 *
 * EX:
 * import { runWeeklyMatching } from "./weeklyMatchmaking.js";
 * const users = [
 *   {
 *     uid: "u1",
 *     iAm: "Man",
 *     lookingFor: "Woman",
 *     schoolYear: "Junior",
 *     majorId: "cs-bs",
 *     major: "Computer Science (BS)",
 *     classes: [{ id: "COMPSCI161" }, { id: "I&CSCI46" }],
 *     interests: ["Coding", "Coffee", "Hiking"],
 *   },
 *   {
 *     uid: "u2",
 *     iAm: "Woman",
 *     lookingFor: "Man",
 *     schoolYear: "Junior",
 *     majorId: "cs-bs",
 *     major: "Computer Science (BS)",
 *     classes: [{ id: "COMPSCI161" }],
 *     interests: ["Coding", "Coffee", "Music"],
 *   },
 * ];
 *
 * const matches = runWeeklyMatching(users);
 * // [{ userAId, userBId, score, userProfileBreakdown, sharedClasses, sharedInterests, createdAt }]
 */


//Point system breakdown per class +10, major +5, year +3, per itnerest +5
const POINTS = {
    CLASS: 10,
    MAJOR: 5,
    YEAR: 3,
    INTEREST: 5,
};

/** @param {object} user */
function classIds(user) {
    return new Set((user.classes || []).map((c) => c.id || c));
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
 *@param {object} userA
 *@param {object} userB
 */
//Users must be mutally compatible from gender and looking for preferences (iAm and lookingFor)
export function isMutuallyCompatible(userA, userB) {
    return userA.lookingFor === userB.iAm && userB.lookingFor === userA.iAm;
}

/**
 * Point breakdown for a pair
 * @param {object} userA
 * @param {object} userB
 * @returns {{
 *      score: number,
 *          userProfileBreakdown: {
 *          sharedClasses: number,
 *          classPoints: number,
 *          sameMajor: boolean,
 *          majorPoints: number,
 *          sameYear: boolean,
 *          yearPoints: number,
 *          sharedInterests: number,
 *          interestPoints: number,
 *      },
 *      sharedClasses: string[],
 *      haredInterests: string[],
 * }}
 */

//Calcualtes score based on score totals intalized to zero
export function calculateMatchScore(userA, userB) {
    const emptyUserProfileBreakdown = {
        sharedClasses: 0,
        classPoints: 0,
        sameMajor: false,
        majorPoints: 0,
        sameYear: false,
        yearPoints: 0,
        sharedInterests: 0,
        interestPoints: 0,
    };

    //check that they have at least 1 thing in common
    if (!isMutuallyCompatible(userA, userB)) {
        return { score: 0, userProfileBreakdown: emptyUserProfileBreakdown, sharedClasses: [], sharedInterests: [] };
    }

    //Point adding logic
    const classSetA = classIds(userA);
    const classSetB = classIds(userB);
    const sharedClasses = [...classSetA].filter((id) => classSetB.has(id));
    const classPoints = sharedClasses.length * POINTS.CLASS;

    const sameMajorFlag = sameMajor(userA, userB);
    const majorPoints = sameMajorFlag ? POINTS.MAJOR : 0;

    const sameYearFlag = Boolean(userA.schoolYear && userA.schoolYear === userB.schoolYear);
    const yearPoints = sameYearFlag ? POINTS.YEAR : 0;

    const intSetA = interestSet(userA);
    const intSetB = interestSet(userB);
    const sharedInterests = [...intSetA].filter((interest) => intSetB.has(interest));
    const interestPoints = sharedInterests.length * POINTS.INTEREST;

    //return the score and breakdown
  return {
    score: classPoints + majorPoints + yearPoints + interestPoints,
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

//Greedly algo for point comparison 
/** @param {object} x @param {object} y */
function comparePairsForGreedy(x, y) {
    //return score differential
    if (y.score !== x.score) return y.score - x.score;
    
    const classDiff = y.userProfileBreakdown.sharedClasses - x.userProfileBreakdown.sharedClasses;
    if (classDiff !== 0) return classDiff;

    if (x.userProfileBreakdown.sameMajor !== y.userProfileBreakdown.sameMajor) {
        return (y.userProfileBreakdown.sameMajor ? 1 : 0) - (x.userProfileBreakdown.sameMajor ? 1 : 0);
    }

    if (x.userProfileBreakdown.sameYear !== y.userProfileBreakdown.sameYear) {
        return (y.userProfileBreakdown.sameYear ? 1 : 0) - (x.userProfileBreakdown.sameYear ? 1 : 0);
    }

    const interestDiff = y.userProfileBreakdown.sharedInterests - x.userProfileBreakdown.sharedInterests;
    if (interestDiff !== 0) return interestDiff;

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

  pairs.sort(comparePairsForGreedy);

  const matched = new Set();
  const matches = [];

  for (const pair of pairs) {
    if (matched.has(pair.a.uid) || matched.has(pair.b.uid)) continue;

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
