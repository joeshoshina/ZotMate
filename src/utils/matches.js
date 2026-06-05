import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { calculateMatchScore, rawScoreToPercentage } from "./matchAlgorithm";

const FALLBACK_USER = {
  firstName: "Your",
  lastName: "Match",
  major: "UCI",
  schoolYear: "Student",
};

function classCodeForId(user, id) {
  const entry = (user?.classes || []).find((c) =>
    typeof c === "object" ? c.id === id : c === id
  );
  if (typeof entry === "object") return entry.code || entry.id;
  return id;
}

function classCodesForIds(currentUser, otherUser, ids) {
  return ids.map(
    (id) => classCodeForId(otherUser, id) || classCodeForId(currentUser, id) || id
  );
}

export function computeLiveMatchDetails(currentUserData, otherUserData, fallbackScore) {
  if (!currentUserData || !otherUserData) {
    return { score: fallbackScore ?? 0, sharedClassCodes: [], sharedInterests: [] };
  }

  const result = calculateMatchScore(currentUserData, otherUserData);
  return {
    score: rawScoreToPercentage(result.score),
    sharedClassCodes: classCodesForIds(
      currentUserData,
      otherUserData,
      result.sharedClasses
    ),
    sharedInterests: result.sharedInterests,
  };
}

export function mapMatchCard(matchDocId, matchData, currentUserData, otherUserData) {
  const user = otherUserData || FALLBACK_USER;
  const live = computeLiveMatchDetails(
    currentUserData,
    otherUserData,
    matchData.score
  );

  return {
    id: matchDocId,
    name: `${user.firstName || "Your"} ${user.lastName || "Match"}`.trim(),
    major: user.major || "UCI",
    year: user.schoolYear || "Student",
    interests: user.interests || [],
    classes: live.sharedClassCodes,
    score: live.score,
    avatar: user.photoURL || null,
    initials: `${user.firstName?.[0] || "Y"}${user.lastName?.[0] || "M"}`,
    bio: user.bio,
  };
}

async function queryMatchesForUser(uid) {
  const matchesRef = collection(db, "matches");
  const [asUserA, asUserB] = await Promise.all([
    getDocs(query(matchesRef, where("userAId", "==", uid))),
    getDocs(query(matchesRef, where("userBId", "==", uid))),
  ]);

  const byId = new Map();
  for (const snap of [asUserA, asUserB]) {
    for (const matchDoc of snap.docs) {
      byId.set(matchDoc.id, matchDoc);
    }
  }
  return [...byId.values()];
}

export async function fetchUserMatches(uid, currentUserData) {
  if (!uid) return [];

  const matchDocs = await queryMatchesForUser(uid);
  const matches = [];

  for (const matchDoc of matchDocs) {
    const matchData = matchDoc.data();
    const otherUserId =
      matchData.userAId === uid ? matchData.userBId : matchData.userAId;

    const otherUserSnap = await getDoc(doc(db, "users", otherUserId));
    const otherUserData = otherUserSnap.exists()
      ? { uid: otherUserSnap.id, ...otherUserSnap.data() }
      : null;
    matches.push(mapMatchCard(matchDoc.id, matchData, currentUserData, otherUserData));
  }

  return matches;
}

export async function fetchMatchById(matchId, currentUid, currentUserData) {
  if (!matchId || !currentUid) return null;

  const matchSnap = await getDoc(doc(db, "matches", matchId));
  if (!matchSnap.exists()) return null;

  const matchData = matchSnap.data();
  const isParticipant =
    matchData.userAId === currentUid || matchData.userBId === currentUid;
  if (!isParticipant) return null;

  const otherUserId =
    matchData.userAId === currentUid ? matchData.userBId : matchData.userAId;
  const otherUserSnap = await getDoc(doc(db, "users", otherUserId));
  const otherUserData = otherUserSnap.exists()
    ? { uid: otherUserSnap.id, ...otherUserSnap.data() }
    : null;

  return {
    match: mapMatchCard(matchSnap.id, matchData, currentUserData, otherUserData),
    matchData,
    otherUserId,
  };
}
