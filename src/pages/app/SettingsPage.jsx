import AppLayout from "../../components/common/AppLayout";
import { useAuth } from "../../context/AuthContext";

export default function SettingsPage() {
  const { profile } = useAuth();

  const initials = profile
    ? `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase()
    : "?";

  return (
    <AppLayout>
      <div className="pt-8 pb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Profile</h1>
      </div>

      {/* Desktop: two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Left: profile identity */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col items-center text-center gap-3">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <span className="text-white font-bold text-2xl">{initials}</span>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">{profile ? `${profile.firstName} ${profile.lastName}` : "?"}</h2>
              <p className="text-slate-400 text-sm">{profile?.schoolYear} · {profile?.major}</p>
              <p className="text-slate-500 text-xs mt-0.5">{profile?.schoolEmail || "-"}</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            {["🔔 Notifications", "🔒 Privacy Settings", "💬 Help and Support", "ℹ️ About ZotMate"].map((item, i, arr) => (
              <button key={item} className={`w-full flex items-center justify-between px-5 py-4 hover:bg-slate-800/60 transition-colors text-left ${i < arr.length - 1 ? "border-b border-slate-800" : ""}`}>
                <span className="text-white text-sm font-medium">{item}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-slate-600"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            ))}
          </div>
        </div>

        {/* Right: classes + interests */}
        <div className="md:col-span-2 space-y-4">
          {profile?.classes?.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-slate-400 text-xs uppercase tracking-wide font-medium mb-3">Current Classes</h3>
              <div className="flex flex-wrap gap-2">
                {profile.classes.map(c => (
                  <span key={c.id} className="text-xs font-mono font-semibold bg-blue-900/30 border border-blue-800/40 text-blue-300 px-3 py-1.5 rounded-lg">{c.code}</span>
                ))}
              </div>
            </div>
          )}

          {profile?.interests?.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-slate-400 text-xs uppercase tracking-wide font-medium mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map(i => (
                  <span key={i} className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-full">{i}</span>
                ))}
              </div>
            </div>
          )}

          {/* Match stats */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-slate-400 text-xs uppercase tracking-wide font-medium mb-4">Your Stats</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Total Matches", value: "3" },
                { label: "Avg Score", value: "74%" },
                { label: "Messages Sent", value: "12" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-800/60 rounded-xl p-3 text-center">
                  <p className="text-white font-bold text-xl">{value}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-slate-600 text-xs text-center pb-2">ZotMate v1.0 · Built at UCI 🐜</p>
        </div>
      </div>
    </AppLayout>
  );
}
