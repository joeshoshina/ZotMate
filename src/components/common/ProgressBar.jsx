export default function ProgressBar({ current, total }) {
  return (
    <div className="w-full">
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300
            ${i < current ? "bg-blue-500" : i === current ? "bg-blue-500/60" : "bg-slate-700"}`} />
        ))}
      </div>
      <p className="text-slate-500 text-xs mt-1.5 text-right">{current} of {total}</p>
    </div>
  );
}
