import { create } from "zustand";

export const useOnboardingStore = create((set) => ({
  firstName: "",
  lastName: "",
  schoolEmail: "",
  schoolYear: "",
  major: "",
  dob: "",
  classes: [],
  iAm: "",
  lookingFor: "",
  interests: [],
  setField: (key, value) => set({ [key]: value }),
  addClass: (cls) => set((state) => ({ classes: [...state.classes, cls] })),
  removeClass: (cls) =>
    set((state) => ({
      classes: state.classes.filter((course) => course !== cls),
    })),
  toggleInterest: (interest) =>
    set((state) => ({
      interests: state.interests.includes(interest)
        ? state.interests.filter((item) => item !== interest)
        : [...state.interests, interest],
    })),
  reset: () =>
    set({
      firstName: "",
      lastName: "",
      schoolEmail: "",
      schoolYear: "",
      major: "",
      dob: "",
      classes: [],
      iAm: "",
      lookingFor: "",
      interests: [],
    }),
}));
