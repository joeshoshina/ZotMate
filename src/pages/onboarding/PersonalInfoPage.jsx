import { useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import ProgressBar from "../../components/common/ProgressBar";
import OnboardingLayout from "../../components/common/OnboardingLayout";
import { SCHOOL_YEARS } from "../../data/mockData";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { fetchMajors } from "../../utils/anteaterApi";

/** Anteater sometimes uses different casing; bucket for optgroups. */
function majorBucket(m) {
  const d = String(m?.division ?? "").trim().toLowerCase();
  if (d === "undergraduate") return "undergraduate";
  if (d === "graduate") return "graduate";
  return "other";
}

export default function PersonalInfoPage() {
  useDocumentTitle("Personal info");
  const navigate = useNavigate();
  const TODAY = new Date().toISOString().split("T")[0];
  const MIN_DOB = "1900-01-01";
  const { firstName, lastName, dob, schoolYear, majorId, setField } = useOnboardingStore();
  const [errors, setErrors] = useState({});
  const [majors, setMajors] = useState([]);
  const [majorsLoading, setMajorsLoading] = useState(true);
  const [majorsError, setMajorsError] = useState(null);
  const [majorsReload, setMajorsReload] = useState(0);
  const majorsReqId = useRef(0);
  const ids = {
    firstName: useId(),
    lastName: useId(),
    dob: useId(),
    schoolYear: useId(),
    major: useId(),
  };
  const clr = (k) => setErrors((p) => ({ ...p, [k]: "" }));

  useEffect(() => {
    const reqRef = majorsReqId;
    const myId = ++reqRef.current;
    (async () => {
      setMajorsLoading(true);
      setMajorsError(null);
      try {
        const json = await fetchMajors();
        if (reqRef.current !== myId) return;
        if (json?.ok === true && Array.isArray(json.data)) {
          setMajors(
            [...json.data].sort((a, b) =>
              String(a.name).localeCompare(String(b.name), undefined, { sensitivity: "base" }),
            ),
          );
          setMajorsError(null);
        } else {
          setMajors([]);
          setMajorsError(typeof json?.message === "string" ? json.message : "Could not load majors");
        }
      } catch (e) {
        if (reqRef.current !== myId) return;
        setMajors([]);
        setMajorsError(e instanceof Error ? e.message : "Network error");
      } finally {
        if (reqRef.current === myId) setMajorsLoading(false);
      }
    })();
    return () => {
      reqRef.current += 1;
    };
  }, [majorsReload]);

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
    if (!majorId) e.major = "Required";
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
            value={majorId}
            disabled={majorsLoading || (!majors.length && majorsError)}
            onChange={(e) => {
              const id = e.target.value;
              const row = majors.find((m) => m.id === id);
              setField("majorId", id);
              setField("major", row ? `${row.name} (${row.type})` : "");
              clr("major");
            }}
            className={ic("major")}
            {...errorProps("major")}
          >
            <option value="">
              {majorsLoading ? "Loading majors…" : majorsError ? "Majors unavailable" : "Select major…"}
            </option>
            {majors.some((m) => majorBucket(m) === "undergraduate") && (
              <optgroup label="Undergraduate">
                {majors
                  .filter((m) => majorBucket(m) === "undergraduate")
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.type})
                    </option>
                  ))}
              </optgroup>
            )}
            {majors.some((m) => majorBucket(m) === "graduate") && (
              <optgroup label="Graduate">
                {majors
                  .filter((m) => majorBucket(m) === "graduate")
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.type})
                    </option>
                  ))}
              </optgroup>
            )}
            {majors.some((m) => majorBucket(m) === "other") && (
              <optgroup label="Other">
                {majors
                  .filter((m) => majorBucket(m) === "other")
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.type})
                    </option>
                  ))}
              </optgroup>
            )}
          </select>
          {majorsError && (
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <p className="text-amber-300/90 text-xs" role="status">
                {majorsError}
              </p>
              <button
                type="button"
                className="text-xs font-medium text-blue-300 hover:text-blue-200 underline"
                onClick={() => setMajorsReload((n) => n + 1)}
              >
                Retry
              </button>
            </div>
          )}
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
