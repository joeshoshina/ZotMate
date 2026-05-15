import { useEffect, useId, useMemo, useRef, useState } from "react";
import { mapCatalogCourse, fetchCourseById, mapFullCourseDetail, searchCoursesFromQuery } from "../../utils/anteaterApi";

const MIN_QUERY_LEN = 2;
const SEARCH_DEBOUNCE_MS = 280;

export default function ClassSearch({ selected, onAdd, onRemove }) {
  const [deptFilter, setDeptFilter] = useState("");
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [remoteResults, setRemoteResults] = useState([]);
  const [remoteLoading, setRemoteLoading] = useState(false);
  const [remoteError, setRemoteError] = useState(null);
  const [pendingDetail, setPendingDetail] = useState(false);
  const blurTimer = useRef(null);
  const listboxId = useId();
  const inputId = useId();
  const deptInputId = useId();

  useEffect(() => {
    const q = query.trim();
    const d = deptFilter.trim();
    if (q.length < MIN_QUERY_LEN && d.length < MIN_QUERY_LEN) {
      setRemoteResults([]);
      setRemoteError(null);
      setRemoteLoading(false);
      return;
    }

    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      setRemoteLoading(true);
      setRemoteError(null);
      try {
        const json = await searchCoursesFromQuery(q, ctrl.signal, { department: d });
        if (ctrl.signal.aborted) return;
        if (json?.ok === true && Array.isArray(json.data)) {
          setRemoteResults(json.data.map(mapCatalogCourse));
        } else {
          setRemoteResults([]);
          setRemoteError(
            typeof json?.message === "string" ? json.message : "Could not load courses",
          );
        }
      } catch (e) {
        if (ctrl.signal.aborted || e?.name === "AbortError") return;
        setRemoteResults([]);
        setRemoteError("Network error");
      } finally {
        if (!ctrl.signal.aborted) setRemoteLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [query, deptFilter]);

  const results = useMemo(
    () => remoteResults.filter((c) => !selected.some((s) => s.id === c.id)).slice(0, 8),
    [remoteResults, selected],
  );

  const qTrim = query.trim();
  const dTrim = deptFilter.trim();
  const hasQuery = qTrim.length >= MIN_QUERY_LEN;
  const hasDept = dTrim.length >= MIN_QUERY_LEN;
  const showPanel =
    focused && (hasQuery || hasDept) && (remoteLoading || remoteError || results.length > 0);

  const open = showPanel;

  const choose = (course) => {
    void (async () => {
      setPendingDetail(true);
      setRemoteError(null);
      try {
        const json = await fetchCourseById(course.id);
        if (json?.ok === true && json.data) {
          onAdd(mapFullCourseDetail(json.data));
        } else {
          onAdd(course);
        }
      } catch {
        onAdd(course);
      } finally {
        setPendingDetail(false);
        setQuery("");
        setActiveIndex(-1);
      }
    })();
  };

  const onKeyDown = (e) => {
    if (pendingDetail) return;
    if (!open || results.length === 0) {
      if (e.key === "ArrowDown" && results.length > 0) {
        e.preventDefault();
        setFocused(true);
        setActiveIndex(0);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < results.length && !pendingDetail) {
        e.preventDefault();
        choose(results[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setFocused(false);
      setActiveIndex(-1);
    }
  };

  const focusIn = () => {
    if (blurTimer.current) clearTimeout(blurTimer.current);
    setFocused(true);
  };

  const focusOutSoon = () => {
    blurTimer.current = setTimeout(() => {
      setFocused(false);
      setActiveIndex(-1);
    }, 150);
  };

  return (
    <div>
      <p className="text-slate-400 text-xs mb-2 leading-relaxed">
        <span className="text-slate-500">Department filter</span> lists courses in that department (or narrows the search below).{" "}
        <span className="text-slate-500">Search</span>: catalog id (e.g.{" "}
        <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-600 font-mono text-slate-200 text-[11px]">
          COMPSCI161
        </kbd>
        ), dept + number (e.g.{" "}
        <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-600 font-mono text-slate-200 text-[11px]">
          I&C SCI 45C
        </kbd>
        ), course #, or words in the title.
      </p>

      <div onFocusCapture={focusIn} onBlurCapture={focusOutSoon}>
        <label htmlFor={deptInputId} className="block text-slate-400 text-xs font-medium mb-1.5">
          Filter by department
        </label>
        <input
          id={deptInputId}
          type="text"
          value={deptFilter}
          onChange={(e) => {
            setDeptFilter(e.target.value);
            setActiveIndex(-1);
          }}
          placeholder="e.g. I&C SCI, IN4MATX"
          disabled={pendingDetail}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 text-sm outline-none focus:border-blue-500 transition-colors mb-3"
        />

        <label htmlFor={inputId} className="sr-only">
          Search courses by catalog id, department and number, or title
        </label>
        <div
          className="relative"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-owns={listboxId}
        >
          <div
            className={`flex items-center bg-slate-800 border border-slate-700 rounded-xl overflow-hidden focus-within:border-blue-500 transition-colors ${
              pendingDetail ? "opacity-60 pointer-events-none" : ""
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4 ml-4 text-slate-300 shrink-0"
              aria-hidden="true"
              focusable="false"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              id={inputId}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(-1);
              }}
              onKeyDown={onKeyDown}
              aria-autocomplete="list"
              aria-controls={listboxId}
              aria-activedescendant={
                open && activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined
              }
              placeholder={pendingDetail ? "Loading course…" : "Search courses…"}
              className="flex-1 bg-transparent px-3 py-3 text-white placeholder-slate-400 text-sm outline-none"
            />
          </div>
        {open && (
          <ul
            id={listboxId}
            role="listbox"
            className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-10 overflow-hidden"
          >
            {remoteLoading && results.length === 0 && (
              <li className="px-4 py-3 text-slate-400 text-sm">Searching…</li>
            )}
            {remoteError && !remoteLoading && results.length === 0 && (
              <li className="px-4 py-3 text-red-300 text-sm">{remoteError}</li>
            )}
            {results.map((c, i) => (
              <li
                key={c.id}
                id={`${listboxId}-opt-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (pendingDetail) return;
                  choose(c);
                }}
                className={`px-4 py-3 cursor-pointer border-b border-slate-700/50 last:border-0 ${
                  i === activeIndex ? "bg-slate-700" : "hover:bg-slate-700"
                }`}
              >
                <span className="text-blue-300 text-xs font-mono font-semibold">{c.code}</span>
                <p className="text-white text-sm mt-0.5">{c.title}</p>
              </li>
            ))}
          </ul>
        )}
        </div>
      </div>

      {selected.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selected.map((c) => (
            <span
              key={c.id}
              className="flex items-center gap-1.5 bg-blue-600/20 border border-blue-500/40 text-blue-200 text-xs px-3 py-1.5 rounded-full"
            >
              <span className="font-mono font-semibold">{c.code}</span>
              <button
                type="button"
                onClick={() => onRemove(c)}
                aria-label={`Remove ${c.code}`}
                className="text-blue-200 hover:text-white transition-colors ml-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-3 h-3"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
