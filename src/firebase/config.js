import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAvldTIqdhuPyFNp3B_qw4Y9HZ59Y_7TnI",
  authDomain: "zotmate.firebaseapp.com",
  databaseURL: "https://zotmate-default-rtdb.firebaseio.com",
  projectId: "zotmate",
  storageBucket: "zotmate.firebasestorage.app",
  messagingSenderId: "856029640464",
  appId: "1:856029640464:web:f9bde326e5b1b6f70f1795",
  measurementId: "G-X3S20W22RE"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

connectFirestoreEmulator(db, "localhost", 8080);
connectFirestoreEmulator(db, "localhost", 8080);