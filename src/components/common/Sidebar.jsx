import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const tabs = [
  {
    to: "/home",
    label: "Home",
    icon: (active) => (
      <svg
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        className="w-5 h-5"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" />
        <path d="M9 21V12h6v9" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    to: "/matches",
    label: "Matches",
    icon: (active) => (
      <svg
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        className="w-5 h-5"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    to: "/settings",
    label: "Profile",
    icon: (active) => (
      <svg
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        className="w-5 h-5"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const initials = profile
    ? `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase()
    : "?";

  return (
    <aside
      aria-label="Primary navigation"
      className="hidden md:flex flex-col w-64 min-h-screen bg-slate-900 border-r border-slate-800 fixed left-0 top-0 bottom-0 z-30"
    >
      <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800">
        <div
          className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30 shrink-0"
          aria-hidden="true"
        >
          <span className="text-white font-black text-base">Z</span>
        </div>
        <div>
          <p className="text-white font-bold text-base leading-tight">ZotMate</p>
          <p className="text-slate-400 text-xs">UCI Matching</p>
        </div>
      </div>

      <nav aria-label="Sections" className="flex-1 px-3 py-4 space-y-1">
        {tabs.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => {
              const active = to === "/settings" ? pathname.startsWith("/settings") : isActive;
              return `flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium
            ${
              active
                ? "bg-blue-600/15 text-blue-300 border border-blue-500/30"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`;
            }}
            aria-current={
              (to === "/settings" ? pathname.startsWith("/settings") : pathname === to)
                ? "page"
                : undefined
            }
          >
            {({ isActive }) => {
              const active = to === "/settings" ? pathname.startsWith("/settings") : isActive;
              return (
                <>
                  {icon(active)}
                  {label}
                </>
              );
            }}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-4 pt-3 border-t border-slate-800 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <div
            className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0"
            role="img"
            aria-label={profile ? `${profile.firstName} ${profile.lastName}` : "Anteater avatar"}
          >
            <span className="text-white font-bold text-xs" aria-hidden="true">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {profile ? `${profile.firstName} ${profile.lastName}` : "Anteater"}
            </p>
            <p className="text-slate-400 text-xs truncate">{profile?.schoolEmail || "UCI Student"}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            signOut();
            navigate("/login");
          }}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-slate-300 hover:text-red-300 hover:bg-red-950/40 transition-all"
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
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
