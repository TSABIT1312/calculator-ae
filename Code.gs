function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('MyRepublic Purwokerto Hub')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// ----------------------------------------------------
// Mock Data for "Report Data Lead AE" Purwokerto
// ----------------------------------------------------
function getAreaMasterData() {
  return {
    success: true,
    data: {
      "REGULER": { 
        title: "REGULER", 
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60", 
        notes: "TANGGUNG JAWAB SETIAP HARI :\n* Sehari Wajib Visit 3 cluster\n* Sehari wajib ketemu 42 orang\n* Sehari wajib dapat 15 data leads\n* Sehari wajib closing 1 SO\n* Dua hari wajib ada 1 SA\n* Minimal Visit 3 Cluster/Hari, 1 Cluster wajib diatas jam 5 sore" 
      },
      "RING & ECO": { 
        title: "RING & ECO", 
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60", 
        notes: "TANGGUNG JAWAB SETIAP HARI :\n* Sehari Wajib Visit 3 cluster\n* Sehari wajib ketemu 42 orang\n* Sehari wajib dapat 20 data leads\n* Sehari wajib closing 2 SO\n* Sehari wajib ada 1 SA\n* Minimal Visit 3 Cluster/Hari, 1 Cluster wajib diatas jam 5 sore" 
      }
    }
  };
}

function getDropdownData() {
  try {
    var url = "https://docs.google.com/spreadsheets/d/1B01TjztfhddPs5fYLwlmvXdV0dk_NBGS/edit";
    var ss = SpreadsheetApp.openByUrl(url);
    var sheet = ss.getSheetByName("CLUSTER");
    
    var reguler = [];
    var ringEco = [];
    
    if (sheet) {
      var data = sheet.getDataRange().getValues();
      
      if (data.length > 0) {
        var nameColIndex = -1;
        var statusColIndex = -1;
        var dataStartIndex = 1;
        
        // Cari posisi kolom berdasarkan judul header di 3 baris pertama (antisipasi judul di baris ke-2 atau ke-3)
        for (var r = 0; r < Math.min(3, data.length); r++) {
          var headerRow = data[r];
          for (var h = 0; h < headerRow.length; h++) {
            var headerName = headerRow[h].toString().toLowerCase().trim();
            if (headerName.includes("cluster name") || headerName === "nama cluster") {
              nameColIndex = h;
            } else if (headerName.includes("status cluster") || headerName === "status") {
              statusColIndex = h;
            }
          }
          
          if (nameColIndex !== -1 && statusColIndex !== -1) {
            dataStartIndex = r + 1; // Mulai baca data dari baris setelah header
            break;
          }
        }
        
        // Jika ketemu kolomnya, proses datanya
        if (nameColIndex !== -1 && statusColIndex !== -1) {
          for (var i = dataStartIndex; i < data.length; i++) { // Mulai dari baris setelah header
            var namaCluster = data[i][nameColIndex] ? data[i][nameColIndex].toString().trim() : "";
            var status = data[i][statusColIndex] ? data[i][statusColIndex].toString().trim().toLowerCase() : "";
            
            if (namaCluster) {
              if (status.includes("reguler")) {
                reguler.push(namaCluster);
              } else if (status.includes("ringan")) {
                ringEco.push(namaCluster);
              }
            }
          }
        } else {
          // Fallback jika judul header tidak sama persis
          reguler.push("(Format Header Salah - Harap tulis 'cluster name' & 'status cluster')");
        }
      }
    }
    
    return {
      success: true,
      clusterMap: {
        "REGULER": reguler,
        "RING & ECO": ringEco
      }
    };
  } catch (error) {
    return {
      success: false,
      message: error.toString(),
      clusterMap: {
        "REGULER": ["(Gagal memuat dari Spreadsheet)"],
        "RING & ECO": ["(Gagal memuat dari Spreadsheet)"]
      }
    };
  }
}

function searchIdSc(id) {
  try {
    // ==========================================
    // LANGKAH-LANGKAH PENGGUNAAN OPSI 1:
    // 1. Upload file "Project Dls.xlsx" ke Google Drive Anda.
    // 2. Buka file tersebut (nanti akan terbuka sebagai Google Sheets).
    // 3. Copy URL dari file Google Sheets tersebut dan paste di variabel 'spreadsheetUrl' di bawah ini.
    // 4. Pastikan nama Sheet/Tab di bawahnya (sheetName) sesuai dengan nama tab di file Anda (misal "Sheet1").
    // ==========================================
    
    var spreadsheetUrl = "https://docs.google.com/spreadsheets/d/1B01TjztfhddPs5fYLwlmvXdV0dk_NBGS/edit"; 
    
    // Nama tab untuk pencarian ID, AE, dan ASM
    var sheetName = "NAMA AE DAN ASM"; 

    var ss = SpreadsheetApp.openByUrl(spreadsheetUrl);

    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      return { success: false, message: "Tab/Sheet '" + sheetName + "' tidak ditemukan!" };
    }

    // Mengambil semua data dari sheet
    var data = sheet.getDataRange().getValues();
    
    // Asumsi Urutan Kolom di file Excel (Indeks dimulai dari 0):
    // Kolom 0 (A) = ID SC UMP
    // Kolom 1 (B) = Nama AE
    // Kolom 2 (C) = Nama ASM
    // Jika urutannya berbeda, silakan ubah angka 0, 1, dan 2 di bawah ini.
    
    var colIdIndex = 0;
    var colAeIndex = 1;
    var colAsmIndex = 2;

    for (var i = 1; i < data.length; i++) { // Mulai dari 1 untuk melewati baris Header
      var rowId = data[i][colIdIndex] ? data[i][colIdIndex].toString().trim() : "";
      
      // Jika ID cocok (case insensitive)
      if (rowId.toLowerCase() === id.toString().trim().toLowerCase()) {
        return { 
          success: true, 
          data: { 
            ae: data[i][colAeIndex].toString(), 
            asm: data[i][colAsmIndex].toString() 
          } 
        };
      }
    }
    
    return { success: false, message: "ID SC UMP tidak ditemukan di database." };
    
  } catch (error) {
    return { success: false, message: "Error saat membaca database: " + error.toString() };
  }
}

function submitKunjunganData(data) {
  try {
    // 1. MASUKKAN LINK GOOGLE SHEET ANDA DI SINI
    // Contoh: "https://docs.google.com/spreadsheets/d/1A2B3C4D5E6F/edit"
    var urlSpreadsheet = "https://docs.google.com/spreadsheets/d/1uztqTW7dWP7HCUDs4BjI4ECm0xHE0vJO4kqRO7-S8yE/edit?usp=sharing";
    
    var ss;
    if (urlSpreadsheet === "MASUKKAN_LINK_SPREADSHEET_ANDA_DISINI") {
      // Mencoba mengambil sheet aktif jika script ini menempel di spreadsheet
      ss = SpreadsheetApp.getActiveSpreadsheet();
      if (!ss) {
        return { success: false, message: "Link Spreadsheet belum diisi di Code.gs!" };
      }
    } else {
      // Membuka spreadsheet dari link yang diberikan
      ss = SpreadsheetApp.openByUrl(urlSpreadsheet);
    }
    
    // Tentukan nama sheet berdasarkan area (REGULER atau RING & ECO)
    var sheetName = data.area || "Lainnya";
    var sheet = ss.getSheetByName(sheetName);
    
    // Jika sheet belum ada, sistem akan otomatis membuatkannya dengan nama area tersebut
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      // Buat header untuk kolom (tanpa Kota dan BM)
      sheet.appendRow(["Timestamp", "ASM", "AE", "Area", "Cluster", "Nama Pelanggan", "No HP", "Alamat", "ISP Saat Ini", "Paket Diminati", "Status Lead"]);
      sheet.getRange(1, 1, 1, 11).setFontWeight("bold").setBackground("#d9d2e9");
      sheet.setFrozenRows(1);
    }

    var timestamp = new Date();
    
    // Memasukkan data dari form (index.html) ke baris baru di Spreadsheet
    sheet.appendRow([
      timestamp,
      data.asm,
      data.ae,
      data.area || "-",
      data.cluster,
      data.namaCapel,
      "'" + data.noHp, // Tambah petik agar nomor HP tidak hilang nol depannya
      data.alamatCapel,
      data.ispSekarang,
      data.paketDiminati,
      data.statusLead
    ]);

    return { success: true, message: "Data berhasil disimpan ke tab " + sheetName + "!" };
  } catch (error) {
    return { success: false, message: "Error: " + error.toString() };
  }
}

function checkDuplicateNoHp(noHp) {
  if (noHp === "081234567890") {
    return {
      isDuplicate: true,
      data: { namaCapel: "Dummy User", kota: "Purwokerto Utara", statusLead: "COOL", tanggalInput: "2026-10-01" }
    };
  }
  return { isDuplicate: false };
}

function hitungTotalInputAE(aeName) {
  try {
    var urlSpreadsheet = "https://docs.google.com/spreadsheets/d/1uztqTW7dWP7HCUDs4BjI4ECm0xHE0vJO4kqRO7-S8yE/edit"; // URL DB Laporan Kunjungan
    var ss = SpreadsheetApp.openByUrl(urlSpreadsheet);
    var sheets = ss.getSheets();
    
    var counts = { total: 0, cool: 0, warm: 0, hot: 0, closing: 0 };
    var aeLower = aeName.toLowerCase().trim();
    
    for (var s = 0; s < sheets.length; s++) {
      var sheet = sheets[s];
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) { // Lewati header
        var rowAe = data[i][2] ? data[i][2].toString().toLowerCase().trim() : ""; // Kolom AE (Indeks 2 / C)
        if (rowAe === aeLower) {
          var status = data[i][10] ? data[i][10].toString().toUpperCase().trim() : ""; // Kolom Status Lead (Indeks 10 / K)
          counts.total++;
          if (status === "COOL") counts.cool++;
          else if (status === "WARM") counts.warm++;
          else if (status === "HOT") counts.hot++;
          else if (status === "CLOSING") counts.closing++;
        }
      }
    }
    
    return {
      success: true,
      total: counts.total,
      cool: counts.cool,
      warm: counts.warm,
      hot: counts.hot,
      closing: counts.closing
    };
  } catch (error) {
    // Jika gagal baca DB atau belum ada data, kembalikan 0 semua
    return {
      success: true,
      total: 0,
      cool: 0,
      warm: 0,
      hot: 0,
      closing: 0
    };
  }
}

function getTimAsmData(asmName) {
  try {
    var spreadsheetUrl = "https://docs.google.com/spreadsheets/d/1B01TjztfhddPs5fYLwlmvXdV0dk_NBGS/edit"; 
    var sheetName = "NAMA AE DAN ASM"; 
    var ss = SpreadsheetApp.openByUrl(spreadsheetUrl);
    var sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) return { success: false, message: "Tab tidak ditemukan" };
    var data = sheet.getDataRange().getValues();
    
    // Sesuaikan indeks dengan struktur yang disepakati (0: ID, 1: AE, 2: ASM)
    var colAeIndex = 1; 
    var colAsmIndex = 2;
    
    var aeList = [];
    var aeSet = {};

    for (var i = 1; i < data.length; i++) {
      var rowAsm = data[i][colAsmIndex] ? data[i][colAsmIndex].toString().trim() : "";
      if (rowAsm.toLowerCase() === asmName.toLowerCase().trim()) {
        var ae = data[i][colAeIndex] ? data[i][colAeIndex].toString().trim() : "";
        if (ae && !aeSet[ae]) {
          aeSet[ae] = true;
          
          // Hitung real data tiap AE
          var counts = hitungTotalInputAE(ae); 
          aeList.push({
            name: ae,
            total: counts.total,
            cool: counts.cool,
            warm: counts.warm,
            hot: counts.hot,
            closing: counts.closing
          });
        }
      }
    }
    
    // Sort dari Total paling banyak ke sedikit
    aeList.sort(function(a, b) { return b.total - a.total; });
    
    return { success: true, data: aeList };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

function getAllAsmNames() {
  try {
    var spreadsheetUrl = "https://docs.google.com/spreadsheets/d/1B01TjztfhddPs5fYLwlmvXdV0dk_NBGS/edit"; 
    var sheetName = "NAMA AE DAN ASM"; 
    var ss = SpreadsheetApp.openByUrl(spreadsheetUrl);
    var sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) return { success: false, data: [] };
    var data = sheet.getDataRange().getValues();
    var colAsmIndex = 2; // ASM ada di kolom C (index 2)
    var asms = {};
    for (var i = 1; i < data.length; i++) {
      var asm = data[i][colAsmIndex] ? data[i][colAsmIndex].toString().trim() : "";
      if (asm && asm.toLowerCase() !== "asm") { // Abaikan header jika ikut terbaca
        asms[asm] = true;
      }
    }
    return { success: true, data: Object.keys(asms).sort() };
  } catch(e) {
    return { success: false, data: [] };
  }
}
