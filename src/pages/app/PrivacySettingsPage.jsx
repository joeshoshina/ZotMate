import { useCallback, useState } from "react";
import AppLayout from "../../components/common/AppLayout";
import SettingsSubpageHeader from "../../components/settings/SettingsSubpageHeader";
import ToggleRow from "../../components/settings/ToggleRow";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const STORAGE_KEY = "zotmate-privacy-preferences";

const defaultPrefs = {
  profileVisible: true,
  analytics: true,
  marketing: false,
  personalized: true,
};

function loadPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultPrefs };
    const parsed = JSON.parse(raw);
    return { ...defaultPrefs, ...parsed };
  } catch {
    return { ...defaultPrefs };
  }
}

function savePrefs(prefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* ignore */
  }
}

export default function PrivacySettingsPage() {
  useDocumentTitle("Privacy");
  const [prefs, setPrefs] = useState(loadPrefs);

  const update = useCallback((key, value) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: value };
      savePrefs(next);
      return next;
    });
  }, []);

  return (
    <AppLayout>
      <SettingsSubpageHeader
        title="Privacy"
        subtitle="Control how your data is used and who can find you."
      />

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 mb-4">
        <ToggleRow
          id="privacy-visible"
          label="Show my profile to suggested matches"
          description="When off, you won’t appear in new match rounds until you turn this back on."
          checked={prefs.profileVisible}
          onChange={(v) => update("profileVisible", v)}
        />
        <ToggleRow
          id="privacy-personalized"
          label="Personalized matching"
          description="Use your classes and interests to improve who we suggest. You can turn this off anytime."
          checked={prefs.personalized}
          onChange={(v) => update("personalized", v)}
        />
        <ToggleRow
          id="privacy-analytics"
          label="Usage & diagnostics"
          description="Anonymous analytics to fix bugs and improve stability. Does not include your chat content."
          checked={prefs.analytics}
          onChange={(v) => update("analytics", v)}
        />
        <ToggleRow
          id="privacy-marketing"
          label="Product updates & tips"
          description="Occasional emails about new features and campus tips. We won’t sell your data."
          checked={prefs.marketing}
          onChange={(v) => update("marketing", v)}
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6">
        <h2 className="text-white text-sm font-semibold mb-2">Your rights</h2>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          You can request a copy of your data, correct inaccurate information, or ask us to delete your account
          from the Help & Support page. California residents may have additional rights under the CCPA.
        </p>
        <p className="text-slate-400 text-xs leading-relaxed">
          ZotMate is designed for UCI students. Don’t share passwords or verification codes. Report safety
          concerns through Help & Support.
        </p>
      </div>
    </AppLayout>
  );
}
