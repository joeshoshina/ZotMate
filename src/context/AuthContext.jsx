import { db, auth } from "../firebase/config.js";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

async function loadProfile(uid) {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  if (snap.exists() && snap.data().isOnboarded) {
    return { uid: snap.id, ...snap.data() };
  }
  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const loaded = await loadProfile(firebaseUser.uid);
          setProfile(loaded);
        } catch (err) {
          console.error("Error loading profile:", err);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const registerUser = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Error creating account:", error.message);
      throw error;
    }
  };

  const signInUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loaded = await loadProfile(userCredential.user.uid);
      setProfile(loaded);
      return { user: userCredential.user, profile: loaded };
    } catch (error) {
      console.error("Error signing in:", error.message);
      throw error;
    }
  };

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
      if (!user) throw new Error("No user is logged in!");

      const userId = user.uid;
      const userRef = doc(db, "users", userId);

      const fullProfileData = {
        ...onboardingData,
        email: user.email,
        isOnboarded: true,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(userRef, fullProfileData, { merge: true });

      setProfile(fullProfileData);
    } catch (error) {
      console.error("Error saving profile to Firestore: ", error);
      throw error;
    }
  };

  const updateProfile = async (patch) => {
    if (!user) throw new Error("No user is logged in!");

    const userRef = doc(db, "users", user.uid);
    const updated = {
      ...patch,
      uid: user.uid,
      updatedAt: new Date().toISOString(),
    };

    await setDoc(userRef, updated, { merge: true });
    setProfile((prev) => (prev ? { ...prev, ...updated } : prev));
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        registerUser,
        signInUser,
        signInWithPhone,
        verifyOTP,
        completeOnboarding,
        updateProfile,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
