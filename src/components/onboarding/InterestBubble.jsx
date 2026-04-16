export default function InterestBubble({ label, selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(label)}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 select-none
        ${selected
          ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/20 scale-105"
          : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white"
        }`}
    >
      {label}
    </button>
  );
}
