import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ArrowLeft, Search, ChevronDown, Save, X, Check } from 'lucide-react';
import { PRODUCTS_DATA, LEAD_STATUS_OPTIONS } from '../../data/constants';
import { searchIdSc, submitKunjungan } from '../../services/apiService';

export default function StepForm({ areaName, clusters, onBack, onFormSubmitted, showToast, setLoader }) {
  const [scIdInput, setScIdInput] = useState('');
  const [asm, setAsm] = useState('');
  const [ae, setAe] = useState('');
  const [isSearchingSc, setIsSearchingSc] = useState(false);

  // Cluster search combobox
  const [clusterSearch, setClusterSearch] = useState('');
  const [selectedCluster, setSelectedCluster] = useState('');
  const [isClusterDropdownOpen, setIsClusterDropdownOpen] = useState(false);
  const clusterDropdownRef = useRef(null);

  // Form fields
  const [namaCapel, setNamaCapel] = useState('');
  const [noHp, setNoHp] = useState('');
  const [hpError, setHpError] = useState('');
  const [alamat, setAlamat] = useState('');
  const [isp, setIsp] = useState('');
  const [paket, setPaket] = useState('');
  const [statusLead, setStatusLead] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter clusters by current area
  const areaClusters = useMemo(() => {
    return clusters[areaName] || [];
  }, [clusters, areaName]);

  const filteredClusters = useMemo(() => {
    if (!clusterSearch.trim()) return areaClusters.slice(0, 100);
    const q = clusterSearch.toLowerCase().trim();
    return areaClusters.filter(c => c.toLowerCase().includes(q)).slice(0, 100);
  }, [areaClusters, clusterSearch]);

  // Close cluster dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (clusterDropdownRef.current && !clusterDropdownRef.current.contains(event.target)) {
        setIsClusterDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search ID SC UMP
  const handleSearchSc = async () => {
    if (!scIdInput.trim()) {
      showToast('Peringatan', 'Masukkan ID SC UMP terlebih dahulu', 'warning');
      return;
    }

    setIsSearchingSc(true);
    setLoader({ show: true, title: 'Mencari Data', subtitle: 'Mencocokkan ID dengan database...' });

    try {
      const res = await searchIdSc(scIdInput.trim());
      setLoader({ show: false });
      setIsSearchingSc(false);

      if (res.success && res.data) {
        setAsm(res.data.asm || '');
        setAe(res.data.ae || '');
        showToast('Ditemukan', `AE: ${res.data.ae} | ASM: ${res.data.asm}`, 'success');
      } else {
        setAsm('');
        setAe('');
        showToast('Tidak Ditemukan', res.message || 'ID SC UMP tidak valid', 'error');
      }
    } catch (err) {
      setLoader({ show: false });
      setIsSearchingSc(false);
      showToast('Koneksi Gagal', 'Gagal memproses data', 'error');
    }
  };

  // Validate phone number
  const handleNoHpChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setNoHp(raw);

    if (raw.length > 0) {
      const isValid = (raw.startsWith('08') || raw.startsWith('628')) && raw.length >= 10 && raw.length <= 14;
      if (!isValid) {
        setHpError('Nomor harus diawali 08 atau 628 dengan panjang 10-14 digit angka.');
      } else {
        setHpError('');
      }
    } else {
      setHpError('');
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!asm || !ae) {
      showToast('Validasi Gagal', 'Harap cari dan temukan ID SC UMP yang valid terlebih dahulu!', 'warning');
      return;
    }

    if (!selectedCluster) {
      showToast('Validasi Gagal', 'Silakan pilih Nama Cluster dari daftar!', 'warning');
      return;
    }

    if (hpError || noHp.length < 10) {
      showToast('Validasi Gagal', 'Nomor HP Capel tidak valid!', 'warning');
      return;
    }

    const payload = {
      area: areaName,
      asm,
      ae,
      namaCapel: namaCapel.trim(),
      noHp: noHp.trim(),
      alamatCapel: alamat.trim(),
      ispSekarang: isp.trim(),
      paketDiminati: paket,
      statusLead,
      cluster: selectedCluster
    };

    setIsSubmitting(true);
    setLoader({ show: true, title: 'Menyimpan Data', subtitle: 'Sedang merekam kunjungan prospek...' });

    try {
      const res = await submitKunjungan(payload);
      setLoader({ show: false });
      setIsSubmitting(false);

      if (res.success) {
        showToast('Laporan Sukses!', `Data kunjungan untuk ${namaCapel} berhasil disimpan!`, 'success');
        onFormSubmitted();
      } else {
        showToast('Gagal Menyimpan', res.message || 'Terjadi kesalahan sistem', 'error');
      }
    } catch (err) {
      setLoader({ show: false });
      setIsSubmitting(false);
      showToast('Error', 'Gagal menghubungi server.', 'error');
    }
  };

  return (
    <section className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6f2c91] hover:text-[#582173] transition"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Strategi
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[#6f2c91] p-5 text-white flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-lg">Form Kunjungan Prospek</h3>
            <p className="text-[11px] text-purple-200">Silakan isi data calon pelanggan dengan akurat</p>
          </div>
          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-black tracking-wider border border-white/30">
            {areaName}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Cari ID SC */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              Cari ID SC UMP <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={scIdInput}
                onChange={(e) => setScIdInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearchSc();
                  }
                }}
                placeholder="Masukkan ID SC UMP..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6f2c91] focus:border-[#6f2c91] transition"
              />
              <button
                type="button"
                onClick={handleSearchSc}
                disabled={isSearchingSc}
                className="bg-[#6f2c91] hover:bg-[#582173] text-white font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 shrink-0 disabled:opacity-50"
              >
                <Search className="w-4 h-4" /> Cari
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Contoh ID SC Purwokerto: 6182994, 6213766, 6245785, atau tes 123.
            </p>
          </div>

          {/* ASM & AE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama ASM</label>
              <input
                type="text"
                readOnly
                value={asm}
                placeholder="Otomatis terisi..."
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 font-bold focus:outline-none cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama AE</label>
              <input
                type="text"
                readOnly
                value={ae}
                placeholder="Otomatis terisi..."
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 font-bold focus:outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {/* Cluster Combobox */}
          <div className="relative" ref={clusterDropdownRef}>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              Nama Cluster <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={clusterSearch}
                onChange={(e) => {
                  setClusterSearch(e.target.value);
                  setIsClusterDropdownOpen(true);
                }}
                onFocus={() => setIsClusterDropdownOpen(true)}
                placeholder="Ketik untuk cari Cluster kampus / perumahan..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-10 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6f2c91] focus:border-[#6f2c91] transition"
              />
              <div
                className="absolute right-3 top-3 text-slate-400 cursor-pointer"
                onClick={() => setIsClusterDropdownOpen(prev => !prev)}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            {selectedCluster && (
              <p className="text-[11px] text-[#6f2c91] font-bold mt-1 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Terpilih: {selectedCluster}
              </p>
            )}

            {isClusterDropdownOpen && (
              <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl max-h-56 overflow-y-auto z-50 divide-y divide-slate-50">
                <div className="p-2 sticky top-0 bg-purple-50 border-b border-purple-100 text-[11px] font-bold text-[#6f2c91] tracking-wider">
                  CARI DARI {areaClusters.length} CLUSTER ({areaName})
                </div>
                {filteredClusters.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 font-medium italic">
                    Cluster tidak ditemukan untuk kata kunci tersebut.
                  </div>
                ) : (
                  filteredClusters.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setSelectedCluster(c);
                        setClusterSearch(c);
                        setIsClusterDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-purple-50 hover:text-[#6f2c91] transition-colors block"
                    >
                      {c}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* Nama Capel & No HP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                Nama Calon Pelanggan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={namaCapel}
                onChange={(e) => setNamaCapel(e.target.value)}
                placeholder="Masukkan nama lengkap calon pelanggan"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6f2c91] focus:border-[#6f2c91] transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                Nomor WhatsApp / HP Capel <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={noHp}
                onChange={handleNoHpChange}
                maxLength={14}
                placeholder="Contoh: 081234567890"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6f2c91] focus:border-[#6f2c91] transition"
              />
              {hpError && (
                <p className="text-[11px] text-rose-500 mt-1">{hpError}</p>
              )}
            </div>
          </div>

          {/* Alamat */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              Alamat Lengkap Capel <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows="3"
              required
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              placeholder="Tuliskan alamat lengkap beserta patokan rumah atau blok..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6f2c91] focus:border-[#6f2c91] transition"
            />
          </div>

          {/* ISP & Paket */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                ISP Saat Ini <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={isp}
                onChange={(e) => setIsp(e.target.value)}
                placeholder="Contoh: Indihome, Biznet, Belum Berlangganan"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6f2c91] focus:border-[#6f2c91] transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                Pilih Paket Diminati <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={paket}
                onChange={(e) => setPaket(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6f2c91] focus:border-[#6f2c91] transition font-medium"
              >
                <option value="" disabled>-- Pilih Paket Layanan --</option>
                {PRODUCTS_DATA.map((prod, i) => (
                  <option key={i} value={prod.name}>{prod.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Lead */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              Status Lead / Follow-Up <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={statusLead}
              onChange={(e) => setStatusLead(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6f2c91] focus:border-[#6f2c91] transition font-bold"
            >
              <option value="" disabled>-- Pilih Status Lead --</option>
              {LEAD_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3.5 bg-[#6f2c91] hover:bg-[#582173] text-white font-bold rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> Simpan Laporan Kunjungan
            </button>
            <button
              type="button"
              onClick={onBack}
              className="py-3.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" /> Batalkan
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
