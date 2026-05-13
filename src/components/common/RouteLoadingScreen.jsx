import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function RouteLoadingScreen() {
  useDocumentTitle("Loading");

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <p className="text-slate-300" role="status" aria-live="polite">
        Loading…
      </p>
    </div>
  );
}
