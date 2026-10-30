# MyRepublic Purwokerto Hub - React JS

Aplikasi kalkulator insentif sales AE dan pelaporan data leads prospek MyRepublic Branch Purwokerto yang telah dikonversi sepenuhnya ke **React JS**.

---

## 🚀 Fitur yang Dikonversi ke React JS

### 1. 🧮 Kalkulator Insentif Reaktif
- **Modul Perhitungan:**
  - 🌟 **Insentif New SA:** Tiering dinamis (0-5, 6-10, 11-14, 15+), komisi gross, dan pencairan estimasi 80%.
  - 🏆 **Uang Prestasi Bulanan:** Kategori produk (Cat 1 - Cat 4), syarat minimal 10 SA, tiering bertingkat, notifikasi capping batas maksimal (maxCap), dan pencairan estimasi 50%.
  - 🔥 **Uang Prestasi 3 Bulanan:** Kategori sales (Junior min 9/bln, Senior min 12/bln), validasi kelayakan bulanan (status HANGUS jika tidak lolos), potongan pencairan bulan 1 & 2, serta final payout.
  - 🎉 **BAT (Bonus Akhir Tahun):** Join date bulan masuk (Januari - Desember), target minimal SA tahunan, pembatasan maxCap, dan komisi final tahunan.
- **Interaktivitas:**
  - Tambah/hapus produk secara dinamis.
  - Perhitungan reaktif instan saat kuantitas (Qty) diubah tanpa perlu refresh.
  - Tabel rincian perhitungan otomatis lengkap dengan alert pembatasan tarif / potongan.
  - 4 Kartu KPI (Total SA, Tier/Status, Gross Incentive, Paid Payout).

### 2. 📋 Data Leads & Form Kunjungan AE
- **Multi-step Form Flow:**
  - **Pilih Area:** REGULER, RING & ECO, atau menu CEK JUMLAH DATA LEAD.
  - **Strategi Area:** Catatan & SOP harian sales per area.
  - **Form Kunjungan Prospek:**
    - Autocomplete pencarian **ID SC UMP** (otomatis mengisi Nama AE & ASM dari database).
    - **Combobox Pencarian Cluster:** Pencarian cepat dari 800+ Cluster (Reguler & Ring/Eco).
    - **Validasi No HP Capel Realtime:** Deteksi nomor valid Indonesia (awalan 08/628, 10–14 digit).
    - Pilihan ISP saat ini, paket diminati, dan status lead (COOL, WARM, HOT, CLOSING).
    - Penyimpanan lokal (LocalStorage) & kompatibel dengan Google Apps Script `google.script.run`.
- **Cek Data Lead & Rekap Tim:**
  - **Pencarian AE:** Menampilkan akumulasi total input lead bulan ini beserta breakdown 4 status (Cool, Warm, Hot, Closing).
  - **Rekap Tim ASM:** Pilih nama ASM untuk melihat tabel perolehan seluruh sales AE di bawah tim tersebut dengan baris **TOTAL TIM**.

---

## 📁 Struktur Folder Proyek

```text
kalkulator-ae-main/
├── index.html                    # Versi Standalone React 18 (Siap dibuka langsung / GAS)
├── react-app.html                # Salinan mandiri Standalone React 18
├── index.vite.html               # Entry point untuk Vite development
├── package.json                  # Dependensi Vite + React 18
├── vite.config.js                # Konfigurasi Vite bundler
├── tailwind.config.js            # Konfigurasi Tailwind CSS
├── postcss.config.js             # Konfigurasi PostCSS
├── Code.gs                       # Backend Google Apps Script (tetap didukung)
├── Project DL.xlsx               # File sumber database Excel
├── src/
│   ├── main.jsx                  # Entry point React Vite
│   ├── App.jsx                   # Komponen utama aplikasi
│   ├── index.css                 # Style dasar & custom scrollbar
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx        # Navigasi tab Kalkulator & Data Leads
│   │   │   ├── Toast.jsx         # Notifikasi alert floating
│   │   │   └── Loader.jsx        # Loading overlay modal
│   │   ├── kalkulator/
│   │   │   ├── KalkulatorView.jsx# Logika perhitungan reaktif kalkulator
│   │   │   └── KpiCard.jsx       # Kartu metrik KPI
│   │   └── report/
│   │       ├── ReportView.jsx    # Pengendali alur step laporan
│   │       ├── StepArea.jsx      # Step 1: Pemilihan area
│   │       ├── StepStrategy.jsx  # Step 2: Catatan strategi
│   │       ├── StepForm.jsx      # Step 3: Form input data prospek
│   │       └── StepCekLead.jsx   # Step 4: Pencarian data lead & rekap tim ASM
│   ├── data/
│   │   ├── constants.js          # Skema tarif, tiering, dan konfigurasi produk
│   │   └── excelData.json        # Ekstraksi riil 184 AE & 825 Cluster dari Project DL.xlsx
│   └── services/
│       └── apiService.js         # Layanan API (Google Apps Script / Offline LocalStorage)
```

---

## 💻 3 Cara Menjalankan Aplikasi

### Cara 1: Langsung Buka di Browser (Paling Mudah, Tanpa Install Apapun)
1. Cukup klik ganda (double-click) file **`index.html`** atau **`react-app.html`** di Windows Explorer.
2. File akan langsung terbuka di browser (Chrome, Edge, Firefox, Opera) dan langsung berfungsi 100% menggunakan React 18 CDN.
3. Seluruh database 184 AE dan 800+ Cluster sudah terpasang di dalamnya sehingga pencarian ID SC dan cluster berfungsi offline.

### Cara 2: Menjalankan via Vite React (Mode Development Modern)
Jika Anda memiliki Node.js terpasang di komputer:
```bash
# 1. Install dependensi
npm install

# 2. Jalankan server lokal
npm run dev

# 3. Build untuk produksi
npm run build
```

### Cara 3: Menggunakan di Google Apps Script (Deployment Spreadsheet)
File `index.html` dan `Code.gs` sudah disesuaikan agar dapat langsung di-paste ke script editor Google Workspace:
1. Buka [Google Apps Script](https://script.google.com).
2. Salin isi `Code.gs` ke file script.
3. Buat file HTML dengan nama `index` lalu salin isi `index.html`.
4. Deploy sebagai Web App (`Deploy` > `New Deployment` > `Web app`).

