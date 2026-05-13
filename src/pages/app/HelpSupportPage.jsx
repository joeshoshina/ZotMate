import { useId, useState } from "react";
import AppLayout from "../../components/common/AppLayout";
import SettingsSubpageHeader from "../../components/settings/SettingsSubpageHeader";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function HelpSupportPage() {
  useDocumentTitle("Help");
  const messageErrId = useId();
  const [topic, setTopic] = useState("general");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (trimmed.length < 10) {
      setError("Please enter a bit more detail (at least 10 characters).");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <AppLayout>
      <SettingsSubpageHeader
        title="Help & Support"
        subtitle="Tell us what's going on and we'll get back as soon as we can."
      />

      {submitted ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <div
            className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-green-600/20 border border-green-500/40 flex items-center justify-center"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-7 h-7 text-green-300"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-white font-semibold text-lg mb-2">Thanks — we received your message</h2>
          <p className="text-slate-300 text-sm leading-relaxed max-w-md mx-auto">
            In a full release this would go to our support inbox. For the prototype, nothing is sent yet; your
            feedback still helps us know what to build next.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setMessage("");
              setTopic("general");
            }}
            className="mt-6 text-blue-300 hover:text-blue-200 text-sm font-medium"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-5" noValidate>
          <div>
            <label htmlFor="help-topic" className="block text-slate-300 text-xs font-medium mb-1.5 uppercase tracking-wide">
              Topic
            </label>
            <select
              id="help-topic"
              name="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500 transition-colors"
            >
              <option value="general">General question</option>
              <option value="account">Account & login</option>
              <option value="matching">Matching & profile</option>
              <option value="safety">Safety or harassment</option>
              <option value="bug">Bug report</option>
            </select>
          </div>

          <div>
            <label htmlFor="help-email" className="block text-slate-300 text-xs font-medium mb-1.5 uppercase tracking-wide">
              Email (optional)
            </label>
            <input
              id="help-email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@uci.edu"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500 transition-colors placeholder-slate-400"
            />
          </div>

          <div>
            <label htmlFor="help-message" className="block text-slate-300 text-xs font-medium mb-1.5 uppercase tracking-wide">
              How can we help?
            </label>
            <textarea
              id="help-message"
              name="message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setError("");
              }}
              rows={6}
              required
              minLength={10}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? messageErrId : undefined}
              placeholder="Describe your question or issue…"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500 transition-colors placeholder-slate-400 resize-y min-h-[140px]"
            />
            {error && (
              <p id={messageErrId} role="alert" className="text-red-300 text-xs mt-2">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm shadow-lg shadow-blue-600/20"
          >
            Submit support request
          </button>
        </form>
      )}
    </AppLayout>
  );
}
