import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { mapMatchCard } from "../utils/matches";

export function useLiveMatch(matchId, currentUid, currentProfile) {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!matchId || !currentUid) {
      setMatch(null);
      setLoading(false);
      return;
    }

    let matchData = null;
    let otherProfile = null;
    let profileUnsub = null;

    const rebuild = () => {
      if (!matchData) {
        setMatch(null);
        return;
      }

      const isParticipant =
        matchData.userAId === currentUid || matchData.userBId === currentUid;
      if (!isParticipant) {
        setMatch(null);
        return;
      }

      setMatch(mapMatchCard(matchId, matchData, currentProfile, otherProfile));
    };

    setLoading(true);
    setError(null);

    const unsubMatch = onSnapshot(
      doc(db, "matches", matchId),
      (snap) => {
        if (!snap.exists()) {
          matchData = null;
          profileUnsub?.();
          profileUnsub = null;
          setMatch(null);
          setLoading(false);
          return;
        }

        matchData = snap.data();
        const otherUserId =
          matchData.userAId === currentUid ? matchData.userBId : matchData.userAId;

        profileUnsub?.();
        profileUnsub = onSnapshot(
          doc(db, "users", otherUserId),
          (userSnap) => {
            otherProfile = userSnap.exists()
              ? { uid: userSnap.id, ...userSnap.data() }
              : null;
            rebuild();
          },
          (err) => {
            console.error("Error listening to match profile:", err);
            setError(err.message);
          }
        );

        rebuild();
        setLoading(false);
      },
      (err) => {
        console.error("Error listening to match:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      unsubMatch();
      profileUnsub?.();
    };
  }, [matchId, currentUid, currentProfile]);

  return { match, loading, error };
}
