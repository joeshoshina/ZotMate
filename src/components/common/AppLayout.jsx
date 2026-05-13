import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import OfflineBanner from "./OfflineBanner";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-medium focus:shadow-lg"
      >
        Skip to main content
      </a>
      <OfflineBanner />
      <Sidebar />
      <main id="main" tabIndex={-1} className="md:ml-64 min-h-screen pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto px-4 md:px-8">{children}</div>
      </main>
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
