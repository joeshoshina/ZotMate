/**
 * One-time demo seed: creates two Firebase Auth users, Firestore profiles,
 * and a hardcoded match between them.
 *
 * Prerequisites:
 *   1. Download service account JSON from Firebase Console
 *      (Project Settings → Service accounts → Generate new private key)
 *   2. Deploy Firestore rules first: firebase deploy --only firestore:rules
 *
 * Usage (PowerShell):
 *   $env:GOOGLE_APPLICATION_CREDENTIALS = ".\serviceAccount.json"
 *   $env:DEMO_SEED_PASSWORD = "YourDemoPassword"
 *   node scripts/seedDemoMatch.mjs
 *
 * Usage (bash):
 *   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json DEMO_SEED_PASSWORD=YourDemoPassword node scripts/seedDemoMatch.mjs
 *
 * Default password (if DEMO_SEED_PASSWORD unset): ZotMateDemo2026!
 */

import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(join(__dirname, "../functions/package.json"));
const admin = require("firebase-admin");

const DEMO_USER_A_EMAIL = "ecstewa1@uci.edu";
const DEMO_USER_B_EMAIL = "evanstewa1@gmail.com";
const DEFAULT_PASSWORD = "ZotMateDemo2026!";

const password = process.env.DEMO_SEED_PASSWORD || DEFAULT_PASSWORD;

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("Error: Set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON path.");
  process.exit(1);
}

admin.initializeApp();
const auth = admin.auth();
const db = admin.firestore();

const DEMO_PROFILES = {
  [DEMO_USER_A_EMAIL]: {
    firstName: "Evan",
    lastName: "Stewart",
    schoolEmail: DEMO_USER_A_EMAIL,
    schoolYear: "Junior",
    major: "Computer Science",
    majorId: "04250",
    dob: "2004-01-15",
    classes: ["ICS 33", "ICS 45C", "MATH 3A"],
    iAm: "man",
    lookingFor: "everyone",
    interests: ["Gaming", "Coffee", "Hiking", "Music"],
  },
  [DEMO_USER_B_EMAIL]: {
    firstName: "Evan",
    lastName: "Stewart",
    schoolEmail: DEMO_USER_B_EMAIL,
    schoolYear: "Junior",
    major: "Computer Science",
    majorId: "04250",
    dob: "2004-01-15",
    classes: ["ICS 33", "ICS 45C", "MATH 3A"],
    iAm: "man",
    lookingFor: "everyone",
    interests: ["Gaming", "Coffee", "Hiking", "Music"],
  },
};

async function getOrCreateUser(email) {
  try {
    const existing = await auth.getUserByEmail(email);
    await auth.updateUser(existing.uid, { emailVerified: true, password });
    console.log(`Updated existing user: ${email} (${existing.uid})`);
    return existing.uid;
  } catch (err) {
    if (err.code === "auth/user-not-found") {
      const created = await auth.createUser({
        email,
        password,
        emailVerified: true,
      });
      console.log(`Created user: ${email} (${created.uid})`);
      return created.uid;
    }
    throw err;
  }
}

async function seedProfile(uid, email) {
  const profile = {
    uid,
    email,
    ...DEMO_PROFILES[email],
    isOnboarded: true,
    updatedAt: new Date().toISOString(),
  };
  await db.collection("users").doc(uid).set(profile, { merge: true });
  console.log(`Seeded profile for ${email}`);
}

async function seedMatch(uidA, uidB) {
  const existing = await db
    .collection("matches")
    .where("userAId", "in", [uidA, uidB])
    .get();

  for (const doc of existing.docs) {
    const data = doc.data();
    const pair = new Set([data.userAId, data.userBId]);
    if (pair.has(uidA) && pair.has(uidB)) {
      console.log(`Match already exists: ${doc.id}`);
      return doc.id;
    }
  }

  const matchRef = db.collection("matches").doc("demo-match");
  await matchRef.set({
    userAId: uidA,
    userBId: uidB,
    score: 87,
    sharedClasses: ["ICS 33", "ICS 45C", "MATH 3A"],
    sharedInterests: ["Gaming", "Coffee", "Hiking", "Music"],
    status: "active",
    createdAt: new Date().toISOString(),
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log(`Created match: ${matchRef.id}`);
  return matchRef.id;
}

async function main() {
  console.log("Seeding ZotMate demo data...\n");

  const uidA = await getOrCreateUser(DEMO_USER_A_EMAIL);
  const uidB = await getOrCreateUser(DEMO_USER_B_EMAIL);

  await seedProfile(uidA, DEMO_USER_A_EMAIL);
  await seedProfile(uidB, DEMO_USER_B_EMAIL);

  const matchId = await seedMatch(uidA, uidB);

  console.log("\nDone! Demo credentials:");
  console.log(`  ${DEMO_USER_A_EMAIL} / ${password}`);
  console.log(`  ${DEMO_USER_B_EMAIL} / ${password}`);
  console.log(`  Match ID: ${matchId}`);
  console.log("\nNext steps:");
  console.log("  1. firebase deploy --only firestore:rules");
  console.log("  2. Sign in on two browsers and open Matches → chat");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
