import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import OfflineBanner from "./OfflineBanner";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950">
      <OfflineBanner />
      <Sidebar />
      {/* On desktop: offset by sidebar width. On mobile: full width with bottom nav padding */}
      <main className="md:ml-64 min-h-screen pb-20 md:pb-8">
        {/* Desktop: constrain content width nicely */}
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          {children}
        </div>
      </main>
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
