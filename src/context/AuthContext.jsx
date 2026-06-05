import { db, auth } from "../firebase/config.js";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { createContext, useContext, useState } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const registerUser = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      setUser(newUser); 

      console.log("Real account created with UID:", newUser.uid);
      return newUser;

    } catch (error) {
      console.error("Error creating account:", error.message);
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
        isOnboarded: true,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(userRef, fullProfileData, { merge: true });

      setProfile(fullProfileData);

      console.log(`Profile successfully saved to Firestore for user: ${userId}`);
      
    } catch (error) {
      console.error("Error saving profile to Firestore: ", error);
      throw error;
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