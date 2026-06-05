/**
 * Creates matches/demo-match only (uses existing Auth users + profiles).
 *
 * PowerShell:
 *   $env:GOOGLE_APPLICATION_CREDENTIALS = ".\serviceAccount.json"
 *   node scripts/seedMatchOnly.mjs
 */

import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(join(__dirname, "../functions/package.json"));
const admin = require("firebase-admin");

const UCI_UID = "QaG1R1iIXtRkqgzoAAwYHPTAihY2"; // ecstewa1@uci.edu
const GMAIL_UID = "EKRMOu6o49dpEB9jAzVZuhMXqpt1"; // ecstewa1@gmail.com

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("Set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON path.");
  process.exit(1);
}

admin.initializeApp();
const db = admin.firestore();

await db.collection("matches").doc("demo-match").set({
  userAId: UCI_UID,
  userBId: GMAIL_UID,
  score: 87,
  sharedClasses: ["ICS 33", "ICS 45C"],
  sharedInterests: ["Gaming", "Coffee"],
  status: "active",
  createdAt: new Date().toISOString(),
  timestamp: admin.firestore.FieldValue.serverTimestamp(),
});

console.log("Created matches/demo-match");
console.log(`  userAId: ${UCI_UID} (ecstewa1@uci.edu)`);
console.log(`  userBId: ${GMAIL_UID} (ecstewa1@gmail.com)`);
