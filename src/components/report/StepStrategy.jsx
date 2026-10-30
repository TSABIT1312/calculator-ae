import React from 'react';
import { ArrowLeft, Target, FileText, ChevronRight } from 'lucide-react';
import { AREA_MASTER_DATA } from '../../data/constants';

export default function StepStrategy({ areaName, onBack, onProceed }) {
  const areaInfo = AREA_MASTER_DATA[areaName] || {
    title: areaName,
    notes: 'Pastikan kelengkapan form data kunjungan pelanggan di area ini.'
  };

  return (
    <section className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6f2c91] hover:text-[#582173] transition"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Pilih Area
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[#6f2c91] text-white p-5 flex justify-between items-center">
          <div>
            <span className="text-[10px] text-purple-200 font-bold uppercase tracking-wider">
              Strategi & Target Kerja Harian
            </span>
            <h3 className="text-xl font-black tracking-tight">{areaName}</h3>
          </div>
          <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
            <Target className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="p-6 space-y-4">
          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#6f2c91]" /> Instruksi & Tanggung Jawab Harian
          </h4>
          <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-100">
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line font-medium">
              {areaInfo.notes}
            </p>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onProceed}
            className="px-6 py-3 bg-[#6f2c91] hover:bg-[#582173] text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            Lanjutkan Mengisi Form <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
