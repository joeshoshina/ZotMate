import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/home", label: "Home", icon: (active) => (
    <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9" strokeLinejoin="round"/>
    </svg>
  )},
  { to: "/matches", label: "Matches", icon: (active) => (
    <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  )},
  { to: "/settings", label: "Profile", icon: (active) => (
    <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  )},
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur border-t border-slate-800 pb-safe">
      <div className="flex items-center max-w-md mx-auto">
        {tabs.map(({ to, label, icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${isActive ? "text-blue-400" : "text-slate-500 hover:text-slate-300"}`
          }>
            {({ isActive }) => (
              <>
                {icon(isActive)}
                <span className="text-xs font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
