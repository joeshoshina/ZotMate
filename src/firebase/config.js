// Firebase config — requires .env with VITE_FIREBASE_* variables
// Mock mode active when env vars are missing

const hasConfig = import.meta.env.VITE_FIREBASE_API_KEY;

export const auth = null;
export const db = null;
export const messaging = null;

export function isFirebaseReady() {
  return !!hasConfig;
}
