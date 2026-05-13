import { useCallback, useState } from "react";
import AppLayout from "../../components/common/AppLayout";
import SettingsSubpageHeader from "../../components/settings/SettingsSubpageHeader";
import ToggleRow from "../../components/settings/ToggleRow";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const STORAGE_KEY = "zotmate-notification-preferences";

const defaultPrefs = {
  email: true,
  push: true,
  weeklyMatch: true,
  messages: true,
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

export default function NotificationSettingsPage() {
  useDocumentTitle("Notifications");
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
        title="Notification settings"
        subtitle="Choose how you want to hear from ZotMate."
      />

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 mb-4">
        <ToggleRow
          id="notif-email"
          label="Email"
          description="Important updates, weekly summaries, and account notices."
          checked={prefs.email}
          onChange={(v) => update("email", v)}
        />
        <ToggleRow
          id="notif-push"
          label="Push notifications"
          description="Alerts on this device when something needs your attention."
          checked={prefs.push}
          onChange={(v) => update("push", v)}
        />
        <ToggleRow
          id="notif-weekly"
          label="Weekly match"
          description="When your new classmate match is ready and match-week reminders."
          checked={prefs.weeklyMatch}
          onChange={(v) => update("weeklyMatch", v)}
        />
        <ToggleRow
          id="notif-messages"
          label="Messages"
          description="New chat messages from your matches."
          checked={prefs.messages}
          onChange={(v) => update("messages", v)}
        />
      </div>

      <p className="text-slate-400 text-xs text-center">
        Preferences are saved on this device. Push and email delivery also depend on your OS and inbox settings.
      </p>
    </AppLayout>
  );
}
