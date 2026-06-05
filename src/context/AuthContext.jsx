// src/context/AuthContext.jsx
import { db, auth, isFirebaseReady } from "../firebase/config.js"; // Added auth here
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth"; // Added Firebase Auth import
import { createContext, useContext, useEffect, useState } from "react";
import { getDemoProfileForEmail } from "../data/mockData.js";

export const AuthContext = createContext(null);
const DEMO_CURRENT_USER_KEY = "zotmate:demo-current-user";
const DEMO_PROFILES_KEY = "zotmate:demo-profiles";

function readDemoProfiles() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(DEMO_PROFILES_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeDemoProfile(email, profile) {
  if (typeof window === "undefined") return;
  const profiles = readDemoProfiles();
  profiles[email] = profile;
  window.localStorage.setItem(DEMO_PROFILES_KEY, JSON.stringify(profiles));
}

async function loadProfileForUser(firebaseUser) {
  if (!db || !firebaseUser) return null;
  const profileSnap = await getDoc(doc(db, "users", firebaseUser.uid));
  if (profileSnap.exists()) return profileSnap.data();

  const demoProfile = getDemoProfileForEmail(firebaseUser.email);
  if (!demoProfile) return null;

  const profile = {
    ...demoProfile,
    uid: firebaseUser.uid,
    updatedAt: new Date().toISOString(),
  };
  await setDoc(doc(db, "users", firebaseUser.uid), profile, { merge: true });
  return profile;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseReady() || !auth) {
      const email = typeof window !== "undefined" ? window.localStorage.getItem(DEMO_CURRENT_USER_KEY) : null;
      if (email) {
        const demoUser = { uid: `demo-${email}`, email, emailVerified: true, isDemoUser: true };
        const profiles = readDemoProfiles();
        setUser(demoUser);
        setProfile(profiles[email] || getDemoProfileForEmail(email));
      }
      setLoading(false);
      return undefined;
    }

    return onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      try {
        setUser(firebaseUser);
        setProfile(firebaseUser ? await loadProfileForUser(firebaseUser) : null);
      } catch (error) {
        console.error("Error loading profile:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const registerUser = async (email, password) => {
    try {
      if (!isFirebaseReady() || !auth) {
        const demoProfile = readDemoProfiles()[email] || getDemoProfileForEmail(email);
        const mockUser = {
          uid: `demo-${email}`,
          email,
          emailVerified: true,
          isDemoUser: true,
        };
        if (typeof window !== "undefined") {
          window.localStorage.setItem(DEMO_CURRENT_USER_KEY, email);
        }
        setUser(mockUser);
        setProfile(demoProfile);
        return { user: mockUser, profile: demoProfile };
      }

      let userCredential;
      try {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } catch (error) {
        if (error?.code !== "auth/email-already-in-use") throw error;
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      const newUser = userCredential.user;
      const loadedProfile = await loadProfileForUser(newUser);

      // Tell React the user is officially logged in!
      setUser(newUser); 
      setProfile(loadedProfile);

      console.log("Real account created with UID:", newUser.uid);
      return { user: newUser, profile: loadedProfile };

    } catch (error) {
      console.error("Error creating account:", error.message);
      throw error; 
    }
  };

  // You can eventually delete these mock phone functions, 
  // but we can leave them for now so your UI doesn't crash!
  const signInWithPhone = async (phone) => {
    return { verificationId: "mock-verification-id", phone };
  };

  const verifyOTP = async (verificationId, otp) => {
    if (otp === "123456" || otp.length === 6) {
      const mockUser = { uid: "mock-uid-1", phoneNumber: verificationId.phone || "+19497771234" };
      setUser(mockUser);
      return mockUser;
    }
    throw new Error("Invalid OTP");
  };

  const completeOnboarding = async (onboardingData) => {
    try {
      // Security check: Make sure someone is actually logged in
      if (!user) throw new Error("No user is logged in!");

      // Use the REAL secure Firebase ID!
      const userId = user.uid; 

      // Group all the data together
      const fullProfileData = {
        ...onboardingData,
        schoolEmail: onboardingData.schoolEmail || user.email,
        isOnboarded: true,
        updatedAt: new Date().toISOString(),
      };

      // 1. Save it to the cloud database when Firebase is configured
      if (isFirebaseReady() && db) {
        const userRef = doc(db, "users", userId);
        await setDoc(userRef, fullProfileData, { merge: true });
      }

      // 2. THE MISSING LINK: Instantly update React's local memory!
      // This tells the ProtectedRoute bouncer that you are fully onboarded.
      setProfile(fullProfileData);
      if (user.isDemoUser && user.email) {
        writeDemoProfile(user.email, fullProfileData);
      }

      console.log(`Profile successfully saved to Firestore for user: ${userId}`);
      
    } catch (error) {
      console.error("Error saving profile to Firestore: ", error);
      throw error; // Throw the error so your UI can catch it and stop loading
    }
  };

  const updateProfile = (patch) => {
    setProfile((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const signOut = async () => {
    if (isFirebaseReady() && auth) {
      await firebaseSignOut(auth);
    }
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(DEMO_CURRENT_USER_KEY);
    }
    setUser(null);
    setProfile(null);
  };

  return (
    // Added registerUser to this list so your pages can use it!
    <AuthContext.Provider value={{ 
      user, profile, registerUser, signInWithPhone, verifyOTP, completeOnboarding, updateProfile, signOut, loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
