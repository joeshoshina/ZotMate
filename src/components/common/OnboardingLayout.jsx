export default function OnboardingLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left branding panel - desktop only */}
      <div className="hidden md:flex flex-col justify-between w-2/5 max-w-md bg-slate-900 border-r border-slate-800 p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
            <span className="text-white font-black text-lg">Z</span>
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">ZotMate</p>
            <p className="text-slate-500 text-xs">UCI Student Matching</p>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white leading-tight">
              Find your perfect<br />study match at UCI
            </h1>
            <p className="text-slate-400 mt-3 text-sm leading-relaxed">
              ZotMate connects UCI students through shared classes, interests, and identity. One new match every week.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: "📚", title: "Class-based matching", desc: "Matched with students in your actual courses" },
              { icon: "🎯", title: "Interest compatibility", desc: "Shared hobbies and activities boost your score" },
              { icon: "🔒", title: "UCI verified only", desc: "Every member verifies their @uci.edu email" },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600/15 border border-blue-500/20 rounded-lg flex items-center justify-center shrink-0 text-sm">
                  {icon}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{title}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-slate-600 text-xs">Built at UCI · Spring 2026 🐜</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 md:py-12">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
