import React, { useState, useMemo } from 'react';
import {
  Trash2,
  Plus,
  RotateCcw,
  FileSpreadsheet,
  FileText,
  User,
  Calendar,
  Layers,
  Award,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import {
  PRODUCTS_DATA,
  PRESTASI_TIERS,
  PRESTASI_3BLN_TIERS,
  BAT_DATA,
  formatRupiah
} from '../../data/constants';
import KpiCard from './KpiCard';
import { exportToExcel, printPdfDocument } from '../../services/exportService';

export default function KalkulatorView() {
  // AE Identity & Date
  const [namaAe, setNamaAe] = useState('');
  const [idSc, setIdSc] = useState('');
  const [tanggal, setTanggal] = useState(() => new Date().toISOString().split('T')[0]);

  // Active module
  const [activeModule, setActiveModule] = useState('new_sa');
  const [selectedProductIndex, setSelectedProductIndex] = useState('');
  
  // Dynamic list of products: [{ index, name, qty }]
  const [addedProducts, setAddedProducts] = useState([]);

  // Extra fields for 3 Bulan
  const [kategoriSales, setKategoriSales] = useState('junior');
  const [qtyBln1, setQtyBln1] = useState('');
  const [qtyBln2, setQtyBln2] = useState('');
  const [qtyBln3, setQtyBln3] = useState('');
  const [potonganBln1, setPotonganBln1] = useState('');
  const [potonganBln2, setPotonganBln2] = useState('');

  // Extra fields for BAT
  const [bulanMasuk, setBulanMasuk] = useState('1');

  // Handle module change
  const handleModuleChange = (e) => {
    setActiveModule(e.target.value);
    handleReset();
  };

  // Add product to list
  const handleAddProduct = () => {
    if (selectedProductIndex === '') return;
    const idx = parseInt(selectedProductIndex, 10);
    const existing = addedProducts.find(p => p.index === idx);
    if (!existing) {
      setAddedProducts(prev => [...prev, { index: idx, name: PRODUCTS_DATA[idx].name, qty: 1 }]);
    }
    setSelectedProductIndex('');
  };

  // Update qty of product
  const handleQtyChange = (index, val) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setAddedProducts(prev => prev.map(p => p.index === index ? { ...p, qty: num } : p));
  };

  // Remove product
  const handleRemoveProduct = (index) => {
    setAddedProducts(prev => prev.filter(p => p.index !== index));
  };

  // Reset form
  const handleReset = () => {
    setAddedProducts([]);
    setSelectedProductIndex('');
    setQtyBln1('');
    setQtyBln2('');
    setQtyBln3('');
    setPotonganBln1('');
    setPotonganBln2('');
    setBulanMasuk('1');
  };

  // Total Qty calculation
  const totalQty = useMemo(() => {
    return addedProducts.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
  }, [addedProducts]);

  // Module human readable name
  const moduleName = useMemo(() => {
    switch (activeModule) {
      case 'new_sa': return 'Insentif New SA';
      case 'prestasi_bln': return 'Uang Prestasi Bulanan';
      case 'prestasi_3bln': return 'Uang Prestasi 3 Bulanan';
      case 'bat': return 'Bonus Akhir Tahun (BAT)';
      default: return 'Kalkulator Insentif';
    }
  }, [activeModule]);

  // Main calculation result
  const calculation = useMemo(() => {
    const rows = [];
    let gross = 0;
    let paid = 0;
    let tierLabel = '-';
    let paidLabel = 'Paid (80%)';
    let notice = null;

    if (activeModule === 'new_sa') {
      paidLabel = 'Paid (80%)';
      const tier = totalQty >= 15 ? '15+' : totalQty >= 11 ? '11-14' : totalQty >= 6 ? '6-10' : '0-5';
      tierLabel = tier;

      addedProducts.forEach(item => {
        if (item.qty > 0) {
          const prod = PRODUCTS_DATA[item.index];
          const tariff = prod.tariffs[tier];
          const sub = item.qty * tariff;
          gross += sub;
          rows.push({
            name: prod.name,
            qty: item.qty,
            tariff,
            subtotal: sub
          });
        }
      });
      paid = gross * 0.8;
    } else if (activeModule === 'prestasi_bln') {
      paidLabel = 'Paid (50%)';
      const activeTier = PRESTASI_TIERS.find(t => totalQty >= t.min) || PRESTASI_TIERS[PRESTASI_TIERS.length - 1];
      tierLabel = activeTier.label;

      if (totalQty >= 10) {
        addedProducts.forEach(item => {
          if (item.qty > 0) {
            const prod = PRODUCTS_DATA[item.index];
            const tariff = activeTier.rates[prod.catPrestasi] || 0;
            const sub = item.qty * tariff;
            gross += sub;
            rows.push({
              name: prod.name,
              qty: item.qty,
              tariff,
              subtotal: sub
            });
          }
        });
      } else if (addedProducts.length > 0) {
        notice = {
          type: 'warning',
          message: 'Minimal pencapaian 10 SA untuk mendapatkan Uang Prestasi.'
        };
      }

      paid = gross * 0.5;
      if (paid > activeTier.maxCap && activeTier.maxCap > 0) {
        paid = activeTier.maxCap;
        notice = {
          type: 'capped',
          message: `Pemberitahuan Limit: Estimasi pencairan 50% mencapai ${formatRupiah(gross * 0.5)}. Batas maksimal tier ini adalah ${formatRupiah(activeTier.maxCap)}.`
        };
      }
    } else if (activeModule === 'prestasi_3bln') {
      paidLabel = 'Final Payout';
      const minTarget = kategoriSales === 'senior' ? 12 : 9;
      const q1 = parseInt(qtyBln1, 10) || 0;
      const q2 = parseInt(qtyBln2, 10) || 0;
      const q3 = parseInt(qtyBln3, 10) || 0;
      const pot1 = parseInt(potonganBln1, 10) || 0;
      const pot2 = parseInt(potonganBln2, 10) || 0;

      const isQualified = q1 >= minTarget && q2 >= minTarget && q3 >= minTarget;

      if (!isQualified && (q1 > 0 || q2 > 0 || q3 > 0 || addedProducts.length > 0)) {
        tierLabel = 'HANGUS';
        let reason = `Pencapaian bulanan Anda (${q1}, ${q2}, ${q3}) tidak memenuhi syarat minimum ${kategoriSales.toUpperCase()} (${minTarget} SA/bulan).`;
        if (q1 === 0 && q2 === 0 && q3 === 0) {
          reason = 'Mohon lengkapi data penjualan per bulan di form di atas.';
        }
        notice = {
          type: 'danger',
          title: 'TIDAK KUALIFIKASI',
          message: reason
        };
        return { totalQty, tierLabel, gross: 0, paid: 0, rows: [], notice, paidLabel };
      }

      const activeTier = PRESTASI_3BLN_TIERS.find(t => totalQty >= t.min) || PRESTASI_3BLN_TIERS[PRESTASI_3BLN_TIERS.length - 1];
      tierLabel = activeTier.label;

      if (totalQty >= 30) {
        addedProducts.forEach(item => {
          if (item.qty > 0) {
            const prod = PRODUCTS_DATA[item.index];
            const tariff = activeTier.rates[prod.catPrestasi] || 0;
            const sub = item.qty * tariff;
            gross += sub;
            rows.push({
              name: prod.name,
              qty: item.qty,
              tariff,
              subtotal: sub
            });
          }
        });
      } else if (addedProducts.length > 0) {
        notice = {
          type: 'warning',
          message: 'Lolos syarat bulanan, namun Total Akumulasi 3 Bulan belum mencapai 30 SA.'
        };
      }

      let finalGross = gross;
      if (gross > activeTier.maxCap && activeTier.maxCap > 0) {
        finalGross = activeTier.maxCap;
        notice = {
          type: 'capped',
          message: `Pemberitahuan Limit: Gross Anda mencapai ${formatRupiah(gross)}. Batas maksimal tier ${activeTier.label} adalah ${formatRupiah(activeTier.maxCap)}.`
        };
      }

      const totalPotongan = pot1 + pot2;
      paid = Math.max(0, finalGross - totalPotongan);

      return {
        totalQty,
        tierLabel,
        gross,
        paid,
        rows,
        notice,
        totalPotongan,
        paidLabel
      };
    } else if (activeModule === 'bat') {
      paidLabel = 'BAT Payout';
      const targetBulan = BAT_DATA[bulanMasuk] || BAT_DATA['1'];

      if (totalQty < targetBulan.min && addedProducts.length > 0) {
        tierLabel = 'HANGUS';
        notice = {
          type: 'danger',
          title: 'TIDAK KUALIFIKASI',
          message: `Total Akumulasi Anda (${totalQty} SA) belum memenuhi batas minimal ${targetBulan.min} SA untuk bulan masuk ${targetBulan.label}.`
        };
        return { totalQty, tierLabel, gross: 0, paid: 0, rows: [], notice, paidLabel };
      }

      tierLabel = `>= ${targetBulan.min} SA`;

      addedProducts.forEach(item => {
        if (item.qty > 0) {
          const prod = PRODUCTS_DATA[item.index];
          const tariff = prod.batRate;
          const sub = item.qty * tariff;
          gross += sub;
          rows.push({
            name: prod.name,
            qty: item.qty,
            tariff,
            subtotal: sub
          });
        }
      });

      paid = Math.min(gross, targetBulan.maxCap);
      if (gross > targetBulan.maxCap) {
        notice = {
          type: 'capped',
          message: `Pemberitahuan Limit: Total Kalkulasi BAT Anda mencapai ${formatRupiah(gross)}. Namun batas maksimal pencairan adalah ${formatRupiah(targetBulan.maxCap)}.`
        };
      }
    }

    return {
      totalQty,
      tierLabel: addedProducts.length === 0 ? '-' : tierLabel,
      gross,
      paid,
      rows,
      notice,
      paidLabel
    };
  }, [
    activeModule,
    totalQty,
    addedProducts,
    kategoriSales,
    qtyBln1,
    qtyBln2,
    qtyBln3,
    potonganBln1,
    potonganBln2,
    bulanMasuk
  ]);

  // Handle Export
  const handleExportExcel = () => {
    exportToExcel({
      namaAe,
      idSc,
      tanggal,
      moduleName,
      totalQty: calculation.totalQty,
      tierLabel: calculation.tierLabel,
      gross: calculation.gross,
      paid: calculation.paid,
      paidLabel: calculation.paidLabel,
      rows: calculation.rows,
      notice: calculation.notice,
      totalPotongan: calculation.totalPotongan || 0
    });
  };

  const handleExportPdf = () => {
    printPdfDocument({
      namaAe,
      idSc,
      tanggal,
      moduleName,
      totalQty: calculation.totalQty,
      tierLabel: calculation.tierLabel,
      gross: calculation.gross,
      paid: calculation.paid,
      paidLabel: calculation.paidLabel,
      rows: calculation.rows,
      notice: calculation.notice,
      totalPotongan: calculation.totalPotongan || 0
    });
  };

  return (
    <div className="space-y-6">
      {/* Profil AE Header Card */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
          <User className="w-4 h-4 text-[#6f2c91]" />
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Identitas Sales AE & Periode Perhitungan
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Sales AE
            </label>
            <input
              type="text"
              value={namaAe}
              onChange={(e) => setNamaAe(e.target.value)}
              placeholder="Tuliskan nama Anda..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#6f2c91] focus:border-[#6f2c91] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ID SC UMP (Opsional)
            </label>
            <input
              type="text"
              value={idSc}
              onChange={(e) => setIdSc(e.target.value)}
              placeholder="Contoh: 6182994"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#6f2c91] focus:border-[#6f2c91] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tanggal Perhitungan
            </label>
            <div className="relative">
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#6f2c91] focus:border-[#6f2c91] outline-none transition"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Module Selector Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="w-full md:w-1/2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Pilih Skema Insentif:
          </label>
          <div className="relative">
            <select
              value={activeModule}
              onChange={handleModuleChange}
              className="w-full p-2.5 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-[#6f2c91] focus:border-[#6f2c91] bg-slate-50 text-sm font-bold text-slate-800"
            >
              <option value="new_sa">Insentif New SA</option>
              <option value="prestasi_bln">Uang Prestasi Bulanan</option>
              <option value="prestasi_3bln">Uang Prestasi 3 Bulanan</option>
              <option value="bat">Bonus Akhir Tahun (BAT)</option>
            </select>
          </div>
        </div>

        {/* Action Export Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
          <button
            type="button"
            onClick={handleExportExcel}
            className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
            title="Download Laporan Format Excel (.xls)"
          >
            <FileSpreadsheet className="w-4 h-4 shrink-0" />
            <span>Download Excel</span>
          </button>

          <button
            type="button"
            onClick={handleExportPdf}
            className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-[#6f2c91] hover:bg-[#582173] text-white rounded-xl font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
            title="Download / Cetak Dokumen PDF Resmi"
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: Product list & extra config */}
        <div className="lg:col-span-1 bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                Input Paket Penjualan
              </h2>
              <span className="text-[11px] font-bold text-[#6f2c91] bg-purple-50 px-2.5 py-0.5 rounded-full">
                {moduleName}
              </span>
            </div>

            {/* Extra Fields for 3 Bulan */}
            {activeModule === 'prestasi_3bln' && (
              <div className="mb-4 p-3 bg-purple-50/70 rounded-xl border border-purple-100 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#4a1863] mb-1">Kategori Sales</label>
                  <select
                    value={kategoriSales}
                    onChange={(e) => setKategoriSales(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#6f2c91]"
                  >
                    <option value="junior">Junior (Min. 9/bln)</option>
                    <option value="senior">Senior (Min. 12/bln)</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Qty Bln 1</label>
                    <input
                      type="number"
                      min="0"
                      value={qtyBln1}
                      onChange={(e) => setQtyBln1(e.target.value)}
                      placeholder="0"
                      className="w-full p-1.5 border border-slate-300 rounded-lg text-sm text-center bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Qty Bln 2</label>
                    <input
                      type="number"
                      min="0"
                      value={qtyBln2}
                      onChange={(e) => setQtyBln2(e.target.value)}
                      placeholder="0"
                      className="w-full p-1.5 border border-slate-300 rounded-lg text-sm text-center bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Qty Bln 3</label>
                    <input
                      type="number"
                      min="0"
                      value={qtyBln3}
                      onChange={(e) => setQtyBln3(e.target.value)}
                      placeholder="0"
                      className="w-full p-1.5 border border-slate-300 rounded-lg text-sm text-center bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-purple-200/60">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-semibold text-slate-700 w-1/2">Telah Cair Bln 1 (Rp)</label>
                    <input
                      type="number"
                      min="0"
                      value={potonganBln1}
                      onChange={(e) => setPotonganBln1(e.target.value)}
                      placeholder="0"
                      className="w-1/2 p-1.5 border border-slate-300 rounded-lg text-sm text-right bg-white"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-semibold text-slate-700 w-1/2">Telah Cair Bln 2 (Rp)</label>
                    <input
                      type="number"
                      min="0"
                      value={potonganBln2}
                      onChange={(e) => setPotonganBln2(e.target.value)}
                      placeholder="0"
                      className="w-1/2 p-1.5 border border-slate-300 rounded-lg text-sm text-right bg-white"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-[#6f2c91] font-medium text-center">
                  *Tambahkan akumulasi paket produk di bawah.
                </p>
              </div>
            )}

            {/* Extra Fields for BAT */}
            {activeModule === 'bat' && (
              <div className="mb-4 p-3 bg-purple-50/70 rounded-xl border border-purple-100 space-y-2">
                <label className="block text-xs font-bold text-[#4a1863] mb-1">Bulan Masuk (Join Date)</label>
                <select
                  value={bulanMasuk}
                  onChange={(e) => setBulanMasuk(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#6f2c91]"
                >
                  {Object.entries(BAT_DATA).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.label} (Min: {val.min} SA | Max: {(val.maxCap / 1000000).toFixed(1)} Jt)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Product Selector */}
            <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-2">Pilih Paket Terjual:</label>
              <div className="flex space-x-2">
                <select
                  value={selectedProductIndex}
                  onChange={(e) => setSelectedProductIndex(e.target.value)}
                  className="flex-1 p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#6f2c91] outline-none bg-white font-medium text-slate-700 truncate"
                >
                  <option value="" disabled>-- Pilih Paket Layanan --</option>
                  {PRODUCTS_DATA.map((prod, idx) => (
                    <option key={idx} value={idx}>{prod.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="bg-[#6f2c91] hover:bg-[#582173] text-white px-3.5 py-2 rounded-lg font-bold transition text-xs sm:text-sm flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-4 h-4" /> Tambah
                </button>
              </div>
            </div>

            {/* Added Products Dynamic List */}
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {addedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-slate-400 text-xs text-center border-2 border-dashed border-slate-200 rounded-xl">
                  Belum ada paket ditambahkan.<br />Pilih paket di atas lalu klik Tambah.
                </div>
              ) : (
                addedProducts.map(item => (
                  <div
                    key={item.index}
                    className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm transition hover:border-purple-300"
                  >
                    <div className="w-1/2 md:w-3/5">
                      <label className="text-xs font-bold text-slate-800 block truncate" title={item.name}>
                        {item.name}
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 w-1/2 md:w-2/5 justify-end">
                      <input
                        type="number"
                        min="0"
                        value={item.qty}
                        onChange={(e) => handleQtyChange(item.index, e.target.value)}
                        className="w-16 p-1.5 border border-slate-300 rounded-lg text-right text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#6f2c91] outline-none"
                        placeholder="Qty"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(item.index)}
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg transition"
                        title="Hapus paket"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 flex space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 transition"
            >
              <RotateCcw className="w-4 h-4" /> Reset Form
            </button>
          </div>
        </div>

        {/* Right Panel: KPI Cards and Details Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <KpiCard
              title="Total SA"
              value={`${calculation.totalQty} SA`}
              borderClass="border-[#6f2c91]"
            />
            <KpiCard
              title="Tier / Status"
              value={calculation.tierLabel}
              borderClass={calculation.tierLabel === 'HANGUS' ? 'border-rose-500' : 'border-[#6f2c91]'}
              textClass={calculation.tierLabel === 'HANGUS' ? 'text-rose-600 font-black' : 'text-slate-800'}
            />
            <KpiCard
              title="Gross Incentive"
              value={formatRupiah(calculation.gross)}
              borderClass="border-amber-500"
            />
            <KpiCard
              title={calculation.paidLabel}
              value={formatRupiah(calculation.paid)}
              borderClass="border-[#6f2c91]"
              bgClass="bg-purple-50"
              textClass="text-[#6f2c91] font-black"
            />
          </div>

          {/* Detailed Calculations Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                Rincian Perhitungan
              </h2>
              <span className="text-xs text-slate-400 font-semibold">
                {namaAe ? `AE: ${namaAe}` : 'MyRepublic Purwokerto'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-xs sm:text-sm text-left text-slate-600">
                <thead className="text-[11px] sm:text-xs text-white uppercase bg-[#6f2c91]">
                  <tr>
                    <th className="px-4 py-3 font-bold">Produk / Layanan</th>
                    <th className="px-4 py-3 font-bold text-center">Qty</th>
                    <th className="px-4 py-3 font-bold text-right">Tarif (Rp)</th>
                    <th className="px-4 py-3 font-bold text-right">Subtotal (Rp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {calculation.notice && calculation.notice.type === 'danger' && (
                    <tr>
                      <td colSpan="4" className="px-5 py-6 text-center text-rose-600 font-bold bg-rose-50">
                        {calculation.notice.title}<br />
                        <span className="text-xs font-normal text-rose-500 mt-1 block">
                          {calculation.notice.message}
                        </span>
                      </td>
                    </tr>
                  )}

                  {calculation.rows.length === 0 && !calculation.notice && (
                    <tr>
                      <td colSpan="4" className="px-5 py-8 text-center italic text-slate-400">
                        Pilih & Tambah paket produk untuk melihat rincian estimasi komisi.
                      </td>
                    </tr>
                  )}

                  {calculation.rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-800">{row.name}</td>
                      <td className="px-4 py-3 text-center font-bold text-slate-700">{row.qty}</td>
                      <td className="px-4 py-3 text-right">{formatRupiah(row.tariff)}</td>
                      <td className="px-4 py-3 text-right font-black text-[#6f2c91]">
                        {formatRupiah(row.subtotal)}
                      </td>
                    </tr>
                  ))}

                  {/* Limit Notices */}
                  {calculation.notice && calculation.notice.type === 'capped' && (
                    <tr className="bg-amber-50">
                      <td colSpan="4" className="px-4 py-3 text-xs text-amber-900 border-t border-amber-200">
                        {calculation.notice.message}
                      </td>
                    </tr>
                  )}

                  {calculation.notice && calculation.notice.type === 'warning' && (
                    <tr className="bg-amber-50">
                      <td colSpan="4" className="px-4 py-4 text-center text-xs font-bold text-amber-800">
                        {calculation.notice.message}
                      </td>
                    </tr>
                  )}

                  {/* Deductions Row for 3 Bulan */}
                  {calculation.totalPotongan > 0 && (
                    <tr className="bg-rose-50 text-rose-700 font-semibold border-t border-rose-100">
                      <td colSpan="3" className="px-4 py-3 text-right">Potongan Telah Cair (Bln 1 & 2):</td>
                      <td className="px-4 py-3 text-right font-bold">- {formatRupiah(calculation.totalPotongan)}</td>
                    </tr>
                  )}
                </tbody>
                {calculation.rows.length > 0 && (
                  <tfoot>
                    <tr className="bg-purple-50 font-bold border-t-2 border-[#6f2c91] text-xs sm:text-sm">
                      <td colSpan="3" className="px-4 py-3 text-right text-purple-900 uppercase">
                        Total Estimasi ({calculation.paidLabel}):
                      </td>
                      <td className="px-4 py-3 text-right font-black text-[#6f2c91] text-base">
                        {formatRupiah(calculation.paid)}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
