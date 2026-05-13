import AppLayout from "../../components/common/AppLayout";
import SettingsSubpageHeader from "../../components/settings/SettingsSubpageHeader";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function AboutZotMatePage() {
  useDocumentTitle("About");

  return (
    <AppLayout>
      <SettingsSubpageHeader title="About ZotMate" subtitle="Built for Anteaters, by Anteaters." />

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 shrink-0"
            aria-hidden="true"
          >
            <span className="text-white text-2xl font-black">Z</span>
          </div>
          <div>
            <p className="text-white font-bold text-lg">ZotMate</p>
            <p className="text-slate-300 text-sm">UCI student matching</p>
          </div>
        </div>

        <div className="space-y-4 text-slate-200 text-sm leading-relaxed">
          <p>
            ZotMate was made by five UCI students who wanted a better way for Anteaters to connect. We were
            tired of shallow dating apps that lead with photos instead of substance.
          </p>
          <p>
            ZotMate focuses on shared interests and real common ground. That is why we match you with people
            in your classes—you instantly have something meaningful to talk about, whether that is study groups,
            projects, or campus life.
          </p>
          <p className="text-slate-400 text-xs pt-2 border-t border-slate-800">
            ZotMate v1.0 · Not affiliated with UC Irvine administration. For students, by students.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
