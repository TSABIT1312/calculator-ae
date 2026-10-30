import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Search, Database, Users } from 'lucide-react';
import { searchIdSc, countLeadStats, getAllAsms, getTeamDataForAsm } from '../../services/apiService';

export default function StepCekLead({ onBack, showToast, setLoader }) {
  const [activeTab, setActiveTab] = useState('ae'); // 'ae' | 'tim'

  // AE Mode States
  const [searchScId, setSearchScId] = useState('');
  const [aeInfo, setAeInfo] = useState(null);
  const [aeStats, setAeStats] = useState(null);

  // Tim Mode States
  const [asmList, setAsmList] = useState([]);
  const [selectedAsm, setSelectedAsm] = useState('');
  const [teamData, setTeamData] = useState([]);
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);

  // Load ASM list on mount
  useEffect(() => {
    async function loadAsms() {
      try {
        const list = await getAllAsms();
        setAsmList(list);
      } catch (e) {
        console.error(e);
      }
    }
    loadAsms();
  }, []);

  // Search AE via SC UMP
  const handleSearchAe = async () => {
    if (!searchScId.trim()) {
      showToast('Peringatan', 'Ketik ID SC UMP terlebih dahulu', 'warning');
      return;
    }

    setLoader({ show: true, title: 'Mencari Data', subtitle: 'Mencari data AE...' });

    try {
      const res = await searchIdSc(searchScId.trim());
      if (res.success && res.data) {
        setAeInfo(res.data);
        const stats = await countLeadStats(res.data.ae);
        setAeStats(stats);
        setLoader({ show: false });
        showToast('Ditemukan', `AE: ${res.data.ae}`, 'success');
      } else {
        setAeInfo(null);
        setAeStats(null);
        setLoader({ show: false });
        showToast('Tidak Ditemukan', res.message || 'ID SC tidak ditemukan', 'error');
      }
    } catch (e) {
      setLoader({ show: false });
      showToast('Error', 'Gagal memuat data', 'error');
    }
  };

  // When ASM selection changes
  const handleAsmChange = async (asmName) => {
    setSelectedAsm(asmName);
    if (!asmName) return;

    setIsLoadingTeam(true);
    try {
      const data = await getTeamDataForAsm(asmName);
      setTeamData(data);
      setIsLoadingTeam(false);
    } catch (e) {
      setIsLoadingTeam(false);
      showToast('Error', 'Gagal memuat rekap tim ASM', 'error');
    }
  };

  // Switch to Tim tab with preselected ASM
  const handleViewTeamForCurrentAsm = () => {
    if (aeInfo && aeInfo.asm) {
      setActiveTab('tim');
      handleAsmChange(aeInfo.asm);
    }
  };

  // Team totals
  const teamTotals = useMemo(() => {
    return teamData.reduce(
      (acc, item) => ({
        total: acc.total + (item.total || 0),
        cool: acc.cool + (item.cool || 0),
        warm: acc.warm + (item.warm || 0),
        hot: acc.hot + (item.hot || 0),
        closing: acc.closing + (item.closing || 0)
      }),
      { total: 0, cool: 0, warm: 0, hot: 0, closing: 0 }
    );
  }, [teamData]);

  return (
    <section className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6f2c91] hover:text-[#582173] transition"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Menu Utama
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5 sm:p-6 space-y-5">
        <div className="text-center mb-6">
          <h3 className="font-extrabold text-xl text-slate-800">Cek Jumlah Data Lead Sales</h3>
          <p className="text-xs text-slate-500 mt-1">Cari berdasarkan ID SC UMP atau pilih nama ASM untuk melihat rekapitulasi tim</p>
        </div>

        {/* Tab switchers */}
        <div className="flex p-1 bg-slate-100 rounded-xl mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('ae')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${activeTab === 'ae'
                ? 'bg-white text-[#6f2c91] shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            Pencarian Individual (ID SC)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tim')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${activeTab === 'tim'
                ? 'bg-white text-[#6f2c91] shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            Rekap Tim ASM
          </button>
        </div>

        {/* Tab Content: AE */}
        {activeTab === 'ae' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Masukkan ID SC UMP
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchScId}
                  onChange={(e) => setSearchScId(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearchAe();
                    }
                  }}
                  placeholder="Ketik ID SC UMP..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#6f2c91] transition"
                />
                <button
                  type="button"
                  onClick={handleSearchAe}
                  className="bg-[#6f2c91] hover:bg-[#582173] text-white font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 shrink-0"
                >
                  <Search className="w-4 h-4" /> Cari
                </button>
              </div>
            </div>

            {aeInfo && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama ASM</label>
                  <input
                    type="text"
                    readOnly
                    value={aeInfo.asm}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 font-bold cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama AE</label>
                  <input
                    type="text"
                    readOnly
                    value={aeInfo.ae}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 font-bold cursor-not-allowed"
                  />
                </div>
              </div>
            )}

            {aeStats && (
              <div className="mt-6 space-y-3">
                <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#6f2c91] text-white rounded-xl shadow-sm">
                      <Database className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm">{aeInfo.ae}</h4>
                      <p className="text-xs text-[#6f2c91] font-bold">Total Input Lead Bulan Ini</p>
                    </div>
                  </div>
                  <div className="text-right border-l border-purple-200 pl-5">
                    <span className="text-3xl font-black text-[#6f2c91]">{aeStats.total}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cool</p>
                    <p className="text-lg font-black text-slate-700 mt-0.5">{aeStats.cool}</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                    <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Warm</p>
                    <p className="text-lg font-black text-amber-800 mt-0.5">{aeStats.warm}</p>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-center">
                    <p className="text-[10px] font-bold text-orange-700 uppercase tracking-wider">Hot</p>
                    <p className="text-lg font-black text-orange-800 mt-0.5">{aeStats.hot}</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                    <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Closing</p>
                    <p className="text-lg font-black text-emerald-800 mt-0.5">{aeStats.closing}</p>
                  </div>
                </div>

                {aeInfo.asm && (
                  <div className="mt-6 text-center pt-2">
                    <button
                      type="button"
                      onClick={handleViewTeamForCurrentAsm}
                      className="text-xs sm:text-sm font-bold text-[#6f2c91] hover:text-[#582173] flex items-center justify-center gap-1.5 w-full bg-purple-50 py-3 rounded-xl transition"
                    >
                      <Users className="w-4 h-4" /> Lihat Rekap Seluruh AE di Tim {aeInfo.asm}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Tim (ASM) */}
        {activeTab === 'tim' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Pilih Nama ASM</label>
              <select
                value={selectedAsm}
                onChange={(e) => handleAsmChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6f2c91] transition font-bold"
              >
                <option value="" disabled>-- Pilih Nama ASM --</option>
                {asmList.map((asm, i) => (
                  <option key={i} value={asm}>{asm}</option>
                ))}
              </select>
            </div>

            {isLoadingTeam && (
              <div className="py-8 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[#6f2c91] border-t-transparent rounded-full animate-spin" />
                Memuat data tim...
              </div>
            )}

            {!isLoadingTeam && selectedAsm && (
              <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs sm:text-sm text-left">
                  <thead className="bg-[#6f2c91] text-[11px] text-white uppercase font-bold tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Nama AE</th>
                      <th className="px-3 py-3 text-center">Total</th>
                      <th className="px-3 py-3 text-center">Cool</th>
                      <th className="px-3 py-3 text-center">Warm</th>
                      <th className="px-3 py-3 text-center">Hot</th>
                      <th className="px-3 py-3 text-center">Closing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {teamData.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-6 text-center text-slate-400 text-xs italic">
                          Belum ada data AE untuk tim ini.
                        </td>
                      </tr>
                    ) : (
                      teamData.map((ae, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-bold text-slate-800 whitespace-nowrap">{ae.name}</td>
                          <td className="px-3 py-3 text-center font-black text-[#6f2c91]">{ae.total}</td>
                          <td className="px-3 py-3 text-center text-slate-600">{ae.cool}</td>
                          <td className="px-3 py-3 text-center text-amber-700 font-semibold">{ae.warm}</td>
                          <td className="px-3 py-3 text-center text-orange-700 font-semibold">{ae.hot}</td>
                          <td className="px-3 py-3 text-center text-emerald-700 font-bold">{ae.closing}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {teamData.length > 0 && (
                    <tfoot>
                      <tr className="bg-purple-50 font-black border-t-2 border-[#6f2c91] text-xs sm:text-sm">
                        <td className="px-4 py-3 text-purple-950 uppercase">TOTAL TIM</td>
                        <td className="px-3 py-3 text-center text-[#6f2c91]">{teamTotals.total}</td>
                        <td className="px-3 py-3 text-center text-slate-700">{teamTotals.cool}</td>
                        <td className="px-3 py-3 text-center text-amber-800">{teamTotals.warm}</td>
                        <td className="px-3 py-3 text-center text-orange-800">{teamTotals.hot}</td>
                        <td className="px-3 py-3 text-center text-emerald-800">{teamTotals.closing}</td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}