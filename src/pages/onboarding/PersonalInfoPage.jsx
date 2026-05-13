import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import ProgressBar from "../../components/common/ProgressBar";
import OnboardingLayout from "../../components/common/OnboardingLayout";
import { SCHOOL_YEARS, MAJORS } from "../../data/mockData";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function PersonalInfoPage() {
  useDocumentTitle("Personal info");
  const navigate = useNavigate();
  const TODAY = new Date().toISOString().split("T")[0];
  const MIN_DOB = "1900-01-01";
  const { firstName, lastName, dob, schoolYear, major, setField } = useOnboardingStore();
  const [errors, setErrors] = useState({});
  const ids = {
    firstName: useId(),
    lastName: useId(),
    dob: useId(),
    schoolYear: useId(),
    major: useId(),
  };
  const clr = (k) => setErrors((p) => ({ ...p, [k]: "" }));

  const validate = () => {
    const e = {};
    if (!firstName.trim()) e.firstName = "Required";
    if (!lastName.trim()) e.lastName = "Required";
    if (!dob) e.dob = "Required";
    else if (dob < MIN_DOB) {
      e.dob = "Date of birth must be on or after January 1, 1900";
    } else if (dob > TODAY) {
      e.dob = "Date of birth cannot be in the future";
    }
    if (!schoolYear) e.schoolYear = "Required";
    if (!major) e.major = "Required";
    return e;
  };

  const handleSubmit = (e) => {
    if (e?.preventDefault) e.preventDefault();
    const result = validate();
    if (Object.keys(result).length) {
      setErrors(result);
      return;
    }
    navigate("/onboarding/verify-email");
  };

  const ic = (k) =>
    `w-full bg-slate-800 border rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors placeholder-slate-400 ${
      errors[k] ? "border-red-500" : "border-slate-700 focus:border-blue-500"
    }`;

  const errorProps = (k) =>
    errors[k]
      ? { "aria-invalid": "true", "aria-describedby": `${ids[k]}-err` }
      : { "aria-invalid": undefined };

  return (
    <OnboardingLayout>
      <ProgressBar current={1} total={5} />
      <div className="mt-6 mb-5">
        <h1 className="text-white font-bold text-xl">Personal Info</h1>
        <p className="text-slate-300 text-sm mt-1">Let's start with the basics</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={ids.firstName} className="block text-slate-300 text-xs font-medium mb-1.5 uppercase tracking-wide">
              First Name
            </label>
            <input
              id={ids.firstName}
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => {
                setField("firstName", e.target.value);
                clr("firstName");
              }}
              placeholder="Peter"
              className={ic("firstName")}
              {...errorProps("firstName")}
            />
            {errors.firstName && (
              <p id={`${ids.firstName}-err`} role="alert" className="text-red-300 text-xs mt-1">
                {errors.firstName}
              </p>
            )}
          </div>
          <div>
            <label htmlFor={ids.lastName} className="block text-slate-300 text-xs font-medium mb-1.5 uppercase tracking-wide">
              Last Name
            </label>
            <input
              id={ids.lastName}
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => {
                setField("lastName", e.target.value);
                clr("lastName");
              }}
              placeholder="Anteater"
              className={ic("lastName")}
              {...errorProps("lastName")}
            />
            {errors.lastName && (
              <p id={`${ids.lastName}-err`} role="alert" className="text-red-300 text-xs mt-1">
                {errors.lastName}
              </p>
            )}
          </div>
        </div>
        <div>
          <label htmlFor={ids.dob} className="block text-slate-300 text-xs font-medium mb-1.5 uppercase tracking-wide">
            Date of Birth
          </label>
          <input
            id={ids.dob}
            type="date"
            autoComplete="bday"
            min={MIN_DOB}
            max={TODAY}
            value={dob}
            onChange={(e) => {
              const v = e.target.value;
              if (v && v.length > 0) {
                const yearPart = v.split("-")[0];
                if (yearPart && yearPart.length > 4) return;
              }
              setField("dob", v);
              clr("dob");
            }}
            onBlur={(e) => {
              const v = e.target.value;
              if (!v) return;
              if (v < MIN_DOB) {
                setField("dob", MIN_DOB);
                clr("dob");
              } else if (v > TODAY) {
                setField("dob", TODAY);
                clr("dob");
              }
            }}
            className={ic("dob")}
            {...errorProps("dob")}
          />
          {errors.dob && (
            <p id={`${ids.dob}-err`} role="alert" className="text-red-300 text-xs mt-1">
              {errors.dob}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={ids.schoolYear} className="block text-slate-300 text-xs font-medium mb-1.5 uppercase tracking-wide">
            School Year
          </label>
          <select
            id={ids.schoolYear}
            value={schoolYear}
            onChange={(e) => {
              setField("schoolYear", e.target.value);
              clr("schoolYear");
            }}
            className={ic("schoolYear")}
            {...errorProps("schoolYear")}
          >
            <option value="">Select year...</option>
            {SCHOOL_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          {errors.schoolYear && (
            <p id={`${ids.schoolYear}-err`} role="alert" className="text-red-300 text-xs mt-1">
              {errors.schoolYear}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={ids.major} className="block text-slate-300 text-xs font-medium mb-1.5 uppercase tracking-wide">
            Major
          </label>
          <select
            id={ids.major}
            value={major}
            onChange={(e) => {
              setField("major", e.target.value);
              clr("major");
            }}
            className={ic("major")}
            {...errorProps("major")}
          >
            <option value="">Select major...</option>
            {MAJORS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          {errors.major && (
            <p id={`${ids.major}-err`} role="alert" className="text-red-300 text-xs mt-1">
              {errors.major}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm shadow-lg shadow-blue-600/20 mt-2"
        >
          Continue →
        </button>
      </form>
    </OnboardingLayout>
  );
}
