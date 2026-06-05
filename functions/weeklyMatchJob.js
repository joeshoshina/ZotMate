const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

const { runWeeklyMatching } = require("./utils/weeklyMatchmaking");

exports.runWeeklyMatchJob = functions.pubsub
  .schedule("59 23 * * 0")
  .timeZone("America/Los_Angeles")
  .onRun(async (context) => {
    try {
      console.log("Starting weekly matchmaking process...");

      const usersSnapshot = await db
        .collection("users")
        .where("isOnboarded", "==", true)
        .get();

      if (usersSnapshot.empty) {
        console.log("No eligible users found for matchmaking.");
        return null;
      }

    const allUsers = usersSnapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data()
    }));
    console.log(`Found ${allUsers.length} users ready to match.`);

      const newMatches = runWeeklyMatching(allUsers);
      console.log(`Algorithm generated ${newMatches.length} successful pairs!`);

      const batch = db.batch();

      newMatches.forEach((match) => {
        const matchRef = db.collection("matches").doc();
        
        const matchData = {
          ...match,
          status: "active", 
          timestamp: FieldValue.serverTimestamp(),
        };

        batch.set(matchRef, matchData);
      });

      await batch.commit();
      console.log("Matchmaking complete and saved to Firestore!");

      return null;
      
    } catch (error) {
      console.error("CRITICAL ERROR during weekly matchmaking:", error);
      return null;
    }
  });

exports.testMatchmaking = functions.https.onRequest(async (req, res) => {
  try {
    console.log("MANUAL TEST: Starting matchmaking...");

    const usersSnapshot = await db
      .collection("users")
      .where("isOnboarded", "==", true)
      .get();

    if (usersSnapshot.empty) {
      res.send("No eligible users found for matchmaking. Go onboard some test accounts!");
      return;
    }

    const allUsers = usersSnapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data()
    }));
    const newMatches = runWeeklyMatching(allUsers);

    const batch = db.batch();

    newMatches.forEach((match) => {
      const matchRef = db.collection("matches").doc();
      const matchData = {
        ...match,
        status: "active",
        timestamp: FieldValue.serverTimestamp(),
      };
      batch.set(matchRef, matchData);
    });

    await batch.commit();
    res.send(`SUCCESS! The algorithm ran and generated ${newMatches.length} pairs. Check your Firestore database!`);
    
  } catch (error) {
    console.error("TEST ERROR:", error);
    res.status(500).send("Error running test. Check your terminal logs.");
  }
});