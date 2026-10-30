import React from 'react';

export default function KpiCard({ title, value, borderClass = "border-[#6f2c91]", bgClass = "bg-white", textClass = "text-slate-800", valueClass = "text-xl sm:text-2xl font-black" }) {
  return (
    <div className={`${bgClass} p-4 rounded-xl shadow-sm border border-slate-200 border-l-4 ${borderClass} flex flex-col justify-center transition-all hover:shadow-md`}>
      <p className="text-[10px] sm:text-xs text-slate-500 uppercase font-bold tracking-wider truncate">
        {title}
      </p>
      <p className={`${valueClass} ${textClass} mt-1 truncate tracking-tight`}>
        {value}
      </p>
    </div>
  );
}
