import { createContext, useContext, useState } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

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

  const completeOnboarding = (profileData) => {
    setProfile(profileData);
  };

  const signOut = () => {
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, signInWithPhone, verifyOTP, completeOnboarding, signOut, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
