import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import ProgressBar from "../../components/common/ProgressBar";
import OnboardingLayout from "../../components/common/OnboardingLayout";
import { SCHOOL_YEARS, MAJORS } from "../../data/mockData";

export default function PersonalInfoPage() {
  const navigate = useNavigate();
  const { firstName, lastName, dob, schoolYear, major, setField } = useOnboardingStore();
  const [errors, setErrors] = useState({});
  const clr = (k) => setErrors(p => ({ ...p, [k]: "" }));

  const validate = () => {
    const e = {};
    if (!firstName.trim()) e.firstName = "Required";
    if (!lastName.trim()) e.lastName = "Required";
    if (!dob) e.dob = "Required";
    if (!schoolYear) e.schoolYear = "Required";
    if (!major) e.major = "Required";
    return e;
  };

  const handleNext = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    navigate("/onboarding/verify-email");
  };

  const ic = (k) => `w-full bg-slate-800 border rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors placeholder-slate-500 ${errors[k] ? "border-red-500" : "border-slate-700 focus:border-blue-500"}`;

  return (
    <OnboardingLayout>
      <ProgressBar current={1} total={5} />
      <div className="mt-6 mb-5">
        <h2 className="text-white font-bold text-xl">Personal Info</h2>
        <p className="text-slate-400 text-sm mt-1">Let's start with the basics</p>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">First Name</label>
            <input value={firstName} onChange={e => { setField("firstName", e.target.value); clr("firstName"); }} placeholder="Peter" className={ic("firstName")} />
            {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">Last Name</label>
            <input value={lastName} onChange={e => { setField("lastName", e.target.value); clr("lastName"); }} placeholder="Anteater" className={ic("lastName")} />
            {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
          </div>
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">Date of Birth</label>
          <input type="date" value={dob} onChange={e => { setField("dob", e.target.value); clr("dob"); }} className={ic("dob")} />
          {errors.dob && <p className="text-red-400 text-xs mt-1">{errors.dob}</p>}
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">School Year</label>
          <select value={schoolYear} onChange={e => { setField("schoolYear", e.target.value); clr("schoolYear"); }} className={ic("schoolYear")}>
            <option value="">Select year...</option>
            {SCHOOL_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          {errors.schoolYear && <p className="text-red-400 text-xs mt-1">{errors.schoolYear}</p>}
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">Major</label>
          <select value={major} onChange={e => { setField("major", e.target.value); clr("major"); }} className={ic("major")}>
            <option value="">Select major...</option>
            {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          {errors.major && <p className="text-red-400 text-xs mt-1">{errors.major}</p>}
        </div>
        <button onClick={handleNext} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm shadow-lg shadow-blue-600/20 mt-2">
          Continue →
        </button>
      </div>
    </OnboardingLayout>
  );
}
