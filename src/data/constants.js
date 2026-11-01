
// Data produk dan konfigurasi insentif MyRepublic Purwokerto
export const PRODUCTS_DATA = [
  { name: "Ringan", catPrestasi: "Cat1", batRate: 20833, tariffs: { "0-5": 0, "6-10": 25000, "11-14": 35000, "15+": 45000 } },
  { name: "Pas", catPrestasi: "Cat1", batRate: 20833, tariffs: { "0-5": 0, "6-10": 25000, "11-14": 35000, "15+": 45000 } },
  { name: "Santai", catPrestasi: "Cat1", batRate: 41667, tariffs: { "0-5": 0, "6-10": 50000, "11-14": 60000, "15+": 70000 } },
  { name: "Ekonomis", catPrestasi: "Cat1", batRate: 41667, tariffs: { "0-5": 0, "6-10": 50000, "11-14": 60000, "15+": 70000 } },
  { name: "Sahabat", catPrestasi: "Cat2", batRate: 83333, tariffs: { "0-5": 0, "6-10": 65000, "11-14": 100000, "15+": 125000 } },
  { name: "Neo", catPrestasi: "Cat3", batRate: 83333, tariffs: { "0-5": 0, "6-10": 80000, "11-14": 150000, "15+": 175000 } },
  { name: "Velo", catPrestasi: "Cat3", batRate: 83333, tariffs: { "0-5": 0, "6-10": 100000, "11-14": 350000, "15+": 400000 } },
  { name: "Nexus", catPrestasi: "Cat4", batRate: 125000, tariffs: { "0-5": 0, "6-10": 100000, "11-14": 400000, "15+": 450000 } },
  { name: "Prime", catPrestasi: "Cat4", batRate: 125000, tariffs: { "0-5": 0, "6-10": 100000, "11-14": 500000, "15+": 525000 } },
  { name: "Wonder", catPrestasi: "Cat4", batRate: 125000, tariffs: { "0-5": 0, "6-10": 100000, "11-14": 600000, "15+": 625000 } },
  { name: "Ultra", catPrestasi: "Cat4", batRate: 125000, tariffs: { "0-5": 0, "6-10": 100000, "11-14": 700000, "15+": 725000 } },
  { name: "MyGamer", catPrestasi: "Cat4", batRate: 125000, tariffs: { "0-5": 0, "6-10": 100000, "11-14": 750000, "15+": 775000 } }
];

export const PRESTASI_TIERS = [
  { min: 25, label: ">= 25 SA", maxCap: 2800000, rates: { Cat1: 35000, Cat2: 110000, Cat3: 120000, Cat4: 185000 } },
  { min: 20, label: "20-24 SA", maxCap: 2100000, rates: { Cat1: 30000, Cat2: 95000, Cat3: 105000, Cat4: 165000 } },
  { min: 15, label: "15-19 SA", maxCap: 1400000, rates: { Cat1: 25000, Cat2: 80000, Cat3: 90000, Cat4: 145000 } },
  { min: 10, label: "10-14 SA", maxCap: 700000, rates: { Cat1: 20000, Cat2: 65000, Cat3: 75000, Cat4: 120000 } },
  { min: 0, label: "< 10 SA", maxCap: 0, rates: { Cat1: 0, Cat2: 0, Cat3: 0, Cat4: 0 } }
];

export const PRESTASI_3BLN_TIERS = [
  { min: 75, label: ">= 75 SA", maxCap: 16800000, rates: { Cat1: 35000, Cat2: 110000, Cat3: 120000, Cat4: 185000 } },
  { min: 60, label: "60-74 SA", maxCap: 12600000, rates: { Cat1: 30000, Cat2: 95000, Cat3: 105000, Cat4: 165000 } },
  { min: 45, label: "45-59 SA", maxCap: 8400000, rates: { Cat1: 25000, Cat2: 80000, Cat3: 90000, Cat4: 145000 } },
  { min: 30, label: "30-44 SA", maxCap: 4200000, rates: { Cat1: 20000, Cat2: 65000, Cat3: 75000, Cat4: 120000 } },
  { min: 0, label: "< 30 SA", maxCap: 0, rates: { Cat1: 0, Cat2: 0, Cat3: 0, Cat4: 0 } }
];

export const BAT_DATA = {
  "1": { label: "Januari", min: 240, maxCap: 20000000 },
  "2": { label: "Februari", min: 220, maxCap: 18333333 },
  "3": { label: "Maret", min: 200, maxCap: 16666667 },
  "4": { label: "April", min: 180, maxCap: 15000000 },
  "5": { label: "Mei", min: 160, maxCap: 13333333 },
  "6": { label: "Juni", min: 140, maxCap: 11666667 },
  "7": { label: "Juli", min: 120, maxCap: 10000000 },
  "8": { label: "Agustus", min: 100, maxCap: 8333333 },
  "9": { label: "September", min: 80, maxCap: 6666667 },
  "10": { label: "Oktober", min: 60, maxCap: 5000000 },
  "11": { label: "November", min: 40, maxCap: 3333333 },
  "12": { label: "Desember", min: 20, maxCap: 1666667 }
};

export const AREA_MASTER_DATA = {
  "REGULER": {
    title: "REGULER",
    notes: `TANGGUNG JAWAB SETIAP HARI :
- Sehari wajib visit 3 cluster
- Sehari wajib ketemu 42 orang
- Sehari wajib dapat 15 data leads
- Sehari wajib closing 1 SO
- Dua hari wajib ada 1 SA
- Minimal visit 3 cluster/hari, 1 cluster wajib di atas jam 17:00 WIB`
  },
  "RING & ECO": {
    title: "RING & ECO",
    notes: `TANGGUNG JAWAB SETIAP HARI :
- Sehari wajib visit 3 cluster
- Sehari wajib ketemu 42 orang
- Sehari wajib dapat 20 data leads
- Sehari wajib closing 2 SO
- Sehari wajib ada 1 SA
- Minimal visit 3 cluster/hari, 1 cluster wajib di atas jam 17:00 WIB`
  }
};

export const LEAD_STATUS_OPTIONS = [
  { value: "COOL", label: "COOL - Baru tanya-tanya", badgeBg: "bg-slate-100", badgeText: "text-slate-700" },
  { value: "WARM", label: "WARM - Minat 60%", badgeBg: "bg-amber-100", badgeText: "text-amber-800" },
  { value: "HOT", label: "HOT - Prospek 80%", badgeBg: "bg-orange-100", badgeText: "text-orange-800" },
  { value: "CLOSING", label: "CLOSING - Registrasi 100%", badgeBg: "bg-emerald-100", badgeText: "text-emerald-800" }
];

export function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
}
