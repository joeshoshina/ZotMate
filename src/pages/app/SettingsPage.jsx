import { useState } from "react";
import { NavLink } from "react-router-dom";
import AppLayout from "../../components/common/AppLayout";
import Modal from "../../components/common/Modal";
import ClassSearch from "../../components/onboarding/ClassSearch";
import GenderSelect from "../../components/onboarding/GenderSelect";
import InterestBubble from "../../components/onboarding/InterestBubble";
import { INTERESTS } from "../../data/mockData";
import { useAuth } from "../../context/AuthContext";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const MENU_ITEMS = [
  { to: "/settings/notifications", label: "Notifications", icon: "🔔" },
  { to: "/settings/privacy", label: "Privacy Settings", icon: "🔒" },
  { to: "/settings/help", label: "Help and Support", icon: "💬" },
  { to: "/settings/about", label: "About ZotMate", icon: "ℹ️" },
];

const MAX_CLASSES = 8;

function EditButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-200 hover:text-white bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/40 hover:border-blue-500/60 rounded-lg px-2.5 py-1 transition-colors"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="w-3.5 h-3.5"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M12 20h9" strokeLinecap="round" />
        <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinejoin="round" />
      </svg>
      Edit
    </button>
  );
}

export default function SettingsPage() {
  useDocumentTitle("Profile");
  const { profile, updateProfile } = useAuth();

  const [classesOpen, setClassesOpen] = useState(false);
  const [interestsOpen, setInterestsOpen] = useState(false);
  const [identityOpen, setIdentityOpen] = useState(false);
  const [draftClasses, setDraftClasses] = useState([]);
  const [draftInterests, setDraftInterests] = useState([]);
  const [draftIAm, setDraftIAm] = useState("");
  const [draftLookingFor, setDraftLookingFor] = useState("");
  const [classError, setClassError] = useState("");
  const [interestError, setInterestError] = useState("");
  const [identityError, setIdentityError] = useState("");

  const initials = profile
    ? `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase()
    : "?";

  const avatarLabel = profile
    ? `${profile.firstName} ${profile.lastName} profile picture`
    : "Profile picture";

  const openClasses = () => {
    setDraftClasses(profile?.classes ? [...profile.classes] : []);
    setClassError("");
    setClassesOpen(true);
  };

  const openInterests = () => {
    setDraftInterests(profile?.interests ? [...profile.interests] : []);
    setInterestError("");
    setInterestsOpen(true);
  };

  const openIdentity = () => {
    setDraftIAm(profile?.iAm || "");
    setDraftLookingFor(profile?.lookingFor || "");
    setIdentityError("");
    setIdentityOpen(true);
  };

  const addDraftClass = (c) => {
    if (draftClasses.find((existing) => existing.id === c.id)) return;
    if (draftClasses.length >= MAX_CLASSES) {
      setClassError(`Max ${MAX_CLASSES} classes`);
      return;
    }
    setClassError("");
    setDraftClasses((prev) => [...prev, c]);
  };

  const removeDraftClass = (c) => {
    setClassError("");
    setDraftClasses((prev) => prev.filter((existing) => existing.id !== c.id));
  };

  const toggleDraftInterest = (label) => {
    setInterestError("");
    setDraftInterests((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label],
    );
  };

  const saveClasses = () => {
    updateProfile({ classes: draftClasses });
    setClassesOpen(false);
  };

  const saveInterests = () => {
    if (draftInterests.length < 3) {
      setInterestError("Pick at least 3 interests");
      return;
    }
    updateProfile({ interests: draftInterests });
    setInterestsOpen(false);
  };

  const saveIdentity = () => {
    if (!draftIAm || !draftLookingFor) {
      setIdentityError("Please make a selection for both");
      return;
    }
    updateProfile({ iAm: draftIAm, lookingFor: draftLookingFor });
    setIdentityOpen(false);
  };

  const cancelButton = (onClick) => (
    <button
      type="button"
      onClick={onClick}
      className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
    >
      Cancel
    </button>
  );

  const saveButton = (onClick, label = "Save") => (
    <button
      type="button"
      onClick={onClick}
      className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-5 py-2 rounded-lg transition-colors shadow-lg shadow-blue-600/20"
    >
      {label}
    </button>
  );

  return (
    <AppLayout>
      <div className="pt-8 pb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col items-center text-center gap-3">
            <div
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/20"
              role="img"
              aria-label={avatarLabel}
            >
              <span className="text-white font-bold text-2xl" aria-hidden="true">{initials}</span>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">{profile ? `${profile.firstName} ${profile.lastName}` : "?"}</h2>
              <p className="text-slate-300 text-sm">{profile?.schoolYear} · {profile?.major}</p>
              <p className="text-slate-400 text-xs mt-0.5">{profile?.schoolEmail || "-"}</p>
            </div>
          </div>

          <nav
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800"
            aria-label="Account settings"
          >
            {MENU_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `w-full flex items-center justify-between px-5 py-4 hover:bg-slate-800/60 transition-colors text-left ${
                    isActive ? "bg-slate-800/50 text-white" : "text-slate-200"
                  }`
                }
              >
                <span className="text-sm font-medium">
                  <span className="mr-2" aria-hidden="true">
                    {item.icon}
                  </span>
                  {item.label}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4 text-slate-400 shrink-0"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="text-slate-300 text-xs uppercase tracking-wide font-medium">Current Classes</h3>
              <EditButton label="Edit current classes" onClick={openClasses} />
            </div>
            {profile?.classes?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.classes.map((c) => (
                  <span key={c.id} className="text-xs font-mono font-semibold bg-blue-900/30 border border-blue-800/50 text-blue-200 px-3 py-1.5 rounded-lg">
                    {c.code}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-300 text-sm">No classes yet. Tap edit to add some.</p>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="text-slate-300 text-xs uppercase tracking-wide font-medium">Interests</h3>
              <EditButton label="Edit interests" onClick={openInterests} />
            </div>
            {profile?.interests?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((i) => (
                  <span key={i} className="text-xs bg-slate-800 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-full">
                    {i}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-300 text-sm">No interests yet. Tap edit to pick some.</p>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="text-slate-300 text-xs uppercase tracking-wide font-medium">Identity</h3>
              <EditButton label="Edit identity" onClick={openIdentity} />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-slate-300 text-xs uppercase tracking-wide font-medium mb-1">I am a...</p>
                <p className="text-white text-sm">{profile?.iAm ? profile.iAm : "Not set"}</p>
              </div>
              <div>
                <p className="text-slate-300 text-xs uppercase tracking-wide font-medium mb-1">Looking for...</p>
                <p className="text-white text-sm">{profile?.lookingFor ? profile.lookingFor : "Not set"}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-slate-300 text-xs uppercase tracking-wide font-medium mb-4">Your Stats</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Total Matches", value: "3" },
                { label: "Avg Score", value: "74%" },
                { label: "Messages Sent", value: "12" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-800/60 rounded-xl p-3 text-center">
                  <p className="text-white font-bold text-xl">{value}</p>
                  <p className="text-slate-300 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-slate-400 text-xs text-center pb-2">
            ZotMate v1.0 · Built at UCI <span aria-hidden="true">🐜</span>
          </p>
        </div>
      </div>

      <Modal
        open={classesOpen}
        onClose={() => setClassesOpen(false)}
        title="Edit current classes"
        subtitle={`Add up to ${MAX_CLASSES} courses you're taking this quarter.`}
        footer={
          <>
            {cancelButton(() => setClassesOpen(false))}
            {saveButton(saveClasses)}
          </>
        }
      >
        <ClassSearch selected={draftClasses} onAdd={addDraftClass} onRemove={removeDraftClass} />
        {classError && (
          <p role="alert" className="text-red-300 text-xs mt-3">
            {classError}
          </p>
        )}
        {draftClasses.length === 0 ? (
          <div className="mt-4 border border-dashed border-slate-700 rounded-xl p-6 text-center">
            <div className="text-2xl mb-1" aria-hidden="true">📚</div>
            <p className="text-slate-300 text-sm">Search above to add a class</p>
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            <p className="text-slate-300 text-xs uppercase tracking-wide font-medium">
              {draftClasses.length} class{draftClasses.length !== 1 ? "es" : ""} selected
            </p>
            {draftClasses.map((c) => (
              <div key={c.id} className="flex items-center justify-between bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3">
                <div className="min-w-0">
                  <span className="text-blue-300 text-xs font-mono font-bold">{c.code}</span>
                  <p className="text-white text-sm mt-0.5 truncate">{c.title}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeDraftClass(c)}
                  aria-label={`Remove ${c.code}`}
                  className="text-slate-300 hover:text-red-300 transition-colors ml-3 shrink-0 p-1.5 -m-1.5 rounded-md"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-4 h-4"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <Modal
        open={interestsOpen}
        onClose={() => setInterestsOpen(false)}
        title="Edit interests"
        subtitle="Pick at least 3 — the more the better."
        footer={
          <>
            {cancelButton(() => setInterestsOpen(false))}
            {saveButton(saveInterests)}
          </>
        }
      >
        <div className="flex flex-wrap gap-2" role="group" aria-label="Select interests">
          {INTERESTS.map((i) => (
            <InterestBubble
              key={i}
              label={i}
              selected={draftInterests.includes(i)}
              onToggle={toggleDraftInterest}
            />
          ))}
        </div>
        {interestError && (
          <p role="alert" className="text-red-300 text-xs mt-3">
            {interestError}
          </p>
        )}
        <p className="text-slate-300 text-xs text-center mt-4" aria-live="polite">
          {draftInterests.length} selected
          {draftInterests.length >= 3 ? " ✓" : ` — pick ${3 - draftInterests.length} more`}
        </p>
      </Modal>

      <Modal
        open={identityOpen}
        onClose={() => setIdentityOpen(false)}
        title="Edit identity"
        subtitle="Update who you are and who you're looking for."
        footer={
          <>
            {cancelButton(() => setIdentityOpen(false))}
            {saveButton(saveIdentity)}
          </>
        }
      >
        <div className="space-y-6">
          <GenderSelect
            label="I am a..."
            value={draftIAm}
            onChange={(v) => {
              setIdentityError("");
              setDraftIAm(v);
            }}
          />
          <GenderSelect
            label="Looking for..."
            value={draftLookingFor}
            onChange={(v) => {
              setIdentityError("");
              setDraftLookingFor(v);
            }}
          />
        </div>
        {identityError && (
          <p role="alert" className="text-red-300 text-xs mt-3">
            {identityError}
          </p>
        )}
      </Modal>
    </AppLayout>
  );
}
