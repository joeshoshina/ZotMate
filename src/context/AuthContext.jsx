// src/context/AuthContext.jsx
import { db, auth } from "../firebase/config.js"; // Added auth here
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth"; // Added Firebase Auth import
import { createContext, useContext, useState } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const registerUser = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // Tell React the user is officially logged in!
      setUser(newUser); 

      console.log("Real account created with UID:", newUser.uid);
      return newUser;

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
      const userRef = doc(db, "users", userId);

      // Group all the data together
      const fullProfileData = {
        ...onboardingData,
        isOnboarded: true,
        updatedAt: new Date().toISOString(),
      };

      // 1. Save it to the cloud database
      await setDoc(userRef, fullProfileData, { merge: true });

      // 2. THE MISSING LINK: Instantly update React's local memory!
      // This tells the ProtectedRoute bouncer that you are fully onboarded.
      setProfile(fullProfileData);

      console.log(`Profile successfully saved to Firestore for user: ${userId}`);
      
    } catch (error) {
      console.error("Error saving profile to Firestore: ", error);
      throw error; // Throw the error so your UI can catch it and stop loading
    }
  };

  const updateProfile = (patch) => {
    setProfile((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const signOut = () => {
    setUser(null);
    setProfile(null);
  };

  return (
    // Added registerUser to this list so your pages can use it!
    <AuthContext.Provider value={{ 
      user, profile, registerUser, signInWithPhone, verifyOTP, completeOnboarding, updateProfile, signOut, loading: false 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}