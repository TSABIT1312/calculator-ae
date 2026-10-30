import React from 'react';

export default function Loader({ isLoading, title = "Memuat Aplikasi", subtitle = "Sedang memproses..." }) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center max-w-xs w-full text-center animate-in zoom-in-95 duration-200">
        <div className="w-12 h-12 border-4 border-[#5a699c] border-t-transparent rounded-full animate-spin mb-4" />
        <h3 className="text-slate-800 font-semibold text-lg">{title}</h3>
        <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

