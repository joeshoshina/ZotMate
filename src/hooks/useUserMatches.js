import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import { mapMatchCard } from "../utils/matches";

export function useUserMatches(uid, currentProfile) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid) {
      setMatches([]);
      setLoading(false);
      return;
    }

    let matchesA = [];
    let matchesB = [];
    const profileCache = new Map();
    const profileUnsubs = new Map();

    const rebuild = () => {
      const byId = new Map();
      for (const matchDoc of [...matchesA, ...matchesB]) {
        byId.set(matchDoc.id, matchDoc);
      }

      const next = [];
      for (const [id, matchDoc] of byId) {
        const matchData = matchDoc.data();
        const otherUserId =
          matchData.userAId === uid ? matchData.userBId : matchData.userAId;
        const otherUser = profileCache.get(otherUserId) ?? null;
        next.push(mapMatchCard(id, matchData, currentProfile, otherUser));
      }
      setMatches(next);
      setLoading(false);
    };

    const ensureProfileListener = (otherUserId) => {
      if (!otherUserId || profileUnsubs.has(otherUserId)) return;

      const unsub = onSnapshot(
        doc(db, "users", otherUserId),
        (snap) => {
          profileCache.set(
            otherUserId,
            snap.exists() ? { uid: snap.id, ...snap.data() } : null
          );
          rebuild();
        },
        (err) => {
          console.error("Error listening to match profile:", err);
          setError(err.message);
        }
      );
      profileUnsubs.set(otherUserId, unsub);
    };

    const syncProfiles = (docs) => {
      for (const matchDoc of docs) {
        const matchData = matchDoc.data();
        const otherUserId =
          matchData.userAId === uid ? matchData.userBId : matchData.userAId;
        ensureProfileListener(otherUserId);
      }
    };

    setLoading(true);
    setError(null);

    const matchesRef = collection(db, "matches");
    const unsubA = onSnapshot(
      query(matchesRef, where("userAId", "==", uid)),
      (snap) => {
        matchesA = snap.docs;
        syncProfiles(snap.docs);
        rebuild();
      },
      (err) => {
        console.error("Error listening to matches:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    const unsubB = onSnapshot(
      query(matchesRef, where("userBId", "==", uid)),
      (snap) => {
        matchesB = snap.docs;
        syncProfiles(snap.docs);
        rebuild();
      },
      (err) => {
        console.error("Error listening to matches:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      unsubA();
      unsubB();
      profileUnsubs.forEach((unsub) => unsub());
    };
  }, [uid, currentProfile]);

  return { matches, loading, error };
}
