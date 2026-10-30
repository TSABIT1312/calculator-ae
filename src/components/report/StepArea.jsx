import React from 'react';
import { Map, MapPin, BarChart2, ArrowRight } from 'lucide-react';

export default function StepArea({ onSelectArea, onGoToCekLead }) {
  return (
    <section className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="text-center py-4">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
          Pilih Area Penugasan Sales AE
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Branch Purwokerto &bull; Form Pelaporan Kunjungan Prospek
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
        {/* Card REGULER */}
        <div
          onClick={() => onSelectArea('REGULER')}
          className="group bg-white border border-slate-200 hover:border-[#6f2c91] rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-center text-center"
        >
          <div className="p-4 bg-purple-50 text-[#6f2c91] rounded-2xl group-hover:bg-[#6f2c91] group-hover:text-white transition-all duration-300 mb-4 ring-1 ring-purple-100">
            <Map className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-base uppercase tracking-wider group-hover:text-[#6f2c91] transition-colors">
            Area Reguler
          </h3>
          <p className="text-slate-500 text-xs mt-2 leading-relaxed px-4">
            Menu input laporan data leads kunjungan pelanggan untuk area Reguler
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#6f2c91] opacity-0 group-hover:opacity-100 transition-opacity">
            Pilih Area <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card RING & ECO */}
        <div
          onClick={() => onSelectArea('RING & ECO')}
          className="group bg-white border border-slate-200 hover:border-emerald-600 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-center text-center"
        >
          <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl group-hover:bg-emerald-700 group-hover:text-white transition-all duration-300 mb-4 ring-1 ring-emerald-100">
            <MapPin className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-base uppercase tracking-wider group-hover:text-emerald-700 transition-colors">
            Area Ring & Eco
          </h3>
          <p className="text-slate-500 text-xs mt-2 leading-relaxed px-4">
            Menu input laporan data leads kunjungan pelanggan untuk area Ringan & Eco
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity">
            Pilih Area <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card CEK JUMLAH DATA LEAD */}
        <div
          onClick={onGoToCekLead}
          className="sm:col-span-2 group bg-white border border-slate-200 hover:border-[#6f2c91] rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="p-3.5 bg-purple-50 text-[#6f2c91] rounded-2xl group-hover:bg-[#6f2c91] group-hover:text-white transition-all duration-300 shrink-0 ring-1 ring-purple-100">
              <BarChart2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-base uppercase tracking-wider group-hover:text-[#6f2c91] transition-colors">
                Cek Jumlah Data Lead
              </h3>
              <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                Pantau total input data kunjungan per sales AE atau rekapitulasi tim ASM bulan berjalan
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-purple-50 group-hover:bg-[#6f2c91] text-[#6f2c91] group-hover:text-white font-bold text-xs rounded-xl transition-all">
            Buka Rekap <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </section>
  );
}
