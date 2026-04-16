import { useState, useEffect } from "react";
import { getNextMatchDate } from "../../data/mockData";

function pad(n) { return String(n).padStart(2, "0"); }

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const calc = () => {
      const diff = getNextMatchDate() - Date.now();
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: "Days", val: timeLeft.days },
    { label: "Hours", val: timeLeft.hours },
    { label: "Mins", val: timeLeft.mins },
    { label: "Secs", val: timeLeft.secs },
  ];

  return (
    <div className="flex items-center gap-2 justify-center">
      {units.map(({ label, val }, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <div className="bg-slate-800 border border-slate-700 rounded-lg w-12 h-12 flex items-center justify-center">
              <span className="text-white font-bold text-lg font-mono">{pad(val ?? 0)}</span>
            </div>
            <span className="text-slate-500 text-xs mt-1">{label}</span>
          </div>
          {i < 3 && <span className="text-slate-600 font-bold text-lg mb-4">:</span>}
        </div>
      ))}
    </div>
  );
}
