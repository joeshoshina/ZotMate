import { useState, useCallback } from "react";

const MOCK_COURSES = [
  { id: "CS161", code: "COMPSCI 161", title: "Design and Analysis of Algorithms" },
  { id: "CS122A", code: "COMPSCI 122A", title: "Introduction to Data Management" },
  { id: "CS122B", code: "COMPSCI 122B", title: "Projects in Databases and Web Applications" },
  { id: "CS142A", code: "COMPSCI 142A", title: "Compilers and Interpreters" },
  { id: "CS143A", code: "COMPSCI 143A", title: "Principles of Operating Systems" },
  { id: "IN4MATX121", code: "IN4MATX 121", title: "Software Design: Structure and Implementation" },
  { id: "IN4MATX124", code: "IN4MATX 124", title: "Internet and Web Application Development" },
  { id: "IN4MATX131", code: "IN4MATX 131", title: "Collaboration in Software Design" },
  { id: "IN4MATX151", code: "IN4MATX 151", title: "Project in Human-Computer Interaction" },
  { id: "STATS120A", code: "STATS 120A", title: "Introduction to Probability and Statistics I" },
  { id: "STATS120B", code: "STATS 120B", title: "Introduction to Probability and Statistics II" },
  { id: "MATH2D", code: "MATH 2D", title: "Multivariable Calculus" },
  { id: "MATH3A", code: "MATH 3A", title: "Introduction to Linear Algebra" },
  { id: "BIO93", code: "BIO 93", title: "DNA to Organisms" },
  { id: "CHEM1A", code: "CHEM 1A", title: "General Chemistry" },
  { id: "ECON20A", code: "ECON 20A", title: "Basic Economics I" },
  { id: "WRITING39A", code: "WRITING 39A", title: "Accelerated Academic English" },
  { id: "PHYSICS7C", code: "PHYSICS 7C", title: "Classical Physics" },
  { id: "PSYCH7A", code: "PSYCH 7A", title: "Biopsychological Foundations of Behavior" },
  { id: "SOCIOL1", code: "SOCIOL 1", title: "Introduction to Sociology" },
];

export default function ClassSearch({ selected, onAdd, onRemove }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const results = useCallback(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return MOCK_COURSES.filter(c =>
      (c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)) &&
      !selected.find(s => s.id === c.id)
    ).slice(0, 6);
  }, [query, selected])();

  return (
    <div>
      <div className="relative">
        <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl overflow-hidden focus-within:border-blue-500 transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 ml-4 text-slate-400 shrink-0">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input value={query} onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Search by course name or code..."
            className="flex-1 bg-transparent px-3 py-3 text-white placeholder-slate-500 text-sm outline-none" />
        </div>
        {focused && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-10 overflow-hidden">
            {results.map(c => (
              <button key={c.id} type="button" onMouseDown={() => { onAdd(c); setQuery(""); }}
                className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors border-b border-slate-700/50 last:border-0">
                <span className="text-blue-400 text-xs font-mono font-semibold">{c.code}</span>
                <p className="text-white text-sm mt-0.5">{c.title}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selected.map(c => (
            <span key={c.id} className="flex items-center gap-1.5 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs px-3 py-1.5 rounded-full">
              <span className="font-mono font-semibold">{c.code}</span>
              <button type="button" onClick={() => onRemove(c)}
                className="text-blue-400 hover:text-white transition-colors ml-0.5">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
