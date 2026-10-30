import { formatRupiah } from '../data/constants';

// Export to formatted Excel (.xls XML format)
export function exportToExcel({ namaAe, idSc, tanggal, moduleName, totalQty, tierLabel, gross, paid, paidLabel, rows, notice, totalPotongan }) {
  const safeAe = namaAe || 'Sales AE';
  const safeDate = tanggal || new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#000000"/>
  </Style>
  <Style ss:ID="Title">
   <Font ss:FontName="Calibri" ss:Size="14" ss:Color="#6F2C91" ss:Bold="1"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="Subtitle">
   <Font ss:FontName="Calibri" ss:Size="10" ss:Color="#555555" ss:Italic="1"/>
  </Style>
  <Style ss:ID="Header">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#6F2C91" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#4A1863"/>
   </Borders>
  </Style>
  <Style ss:ID="MetaLabel">
   <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#333333"/>
  </Style>
  <Style ss:ID="MetaValue">
   <Font ss:FontName="Calibri" ss:Size="10" ss:Color="#111111"/>
  </Style>
  <Style ss:ID="CellLeft">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
   </Borders>
  </Style>
  <Style ss:ID="CellCenter">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
   </Borders>
  </Style>
  <Style ss:ID="CellCurrency">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="#,##0"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
   </Borders>
  </Style>
  <Style ss:ID="TotalLabel">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#222222"/>
   <Interior ss:Color="#F3E8FF" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#6F2C91"/>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#6F2C91"/>
   </Borders>
  </Style>
  <Style ss:ID="TotalValue">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#6F2C91"/>
   <Interior ss:Color="#F3E8FF" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="#,##0"/>
   <Borders>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#6F2C91"/>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#6F2C91"/>
   </Borders>
  </Style>
 </Styles>
 <Worksheet ss:Name="Laporan Insentif">
  <Table ss:DefaultRowHeight="20">
   <Column ss:Width="40"/>
   <Column ss:Width="220"/>
   <Column ss:Width="70"/>
   <Column ss:Width="110"/>
   <Column ss:Width="130"/>

   <Row ss:Height="26">
    <Cell ss:MergeAcross="4" ss:StyleID="Title"><Data ss:Type="String">MYREPUBLIC PURWOKERTO - LAPORAN ESTIMASI INSENTIF AE</Data></Cell>
   </Row>
   <Row ss:Height="18">
    <Cell ss:MergeAcross="4" ss:StyleID="Subtitle"><Data ss:Type="String">Dokumen internal perhitungan komisi penjualan &amp; achievement sales</Data></Cell>
   </Row>
   <Row><Cell ss:MergeAcross="4"><Data ss:Type="String"></Data></Cell></Row>

   <Row>
    <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">Nama Sales AE</Data></Cell>
    <Cell ss:StyleID="MetaValue"><Data ss:Type="String">${safeAe}</Data></Cell>
    <Cell><Data ss:Type="String"></Data></Cell>
    <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">Tanggal Laporan</Data></Cell>
    <Cell ss:StyleID="MetaValue"><Data ss:Type="String">${safeDate}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">ID SC UMP</Data></Cell>
    <Cell ss:StyleID="MetaValue"><Data ss:Type="String">${idSc || '-'}</Data></Cell>
    <Cell><Data ss:Type="String"></Data></Cell>
    <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">Modul Perhitungan</Data></Cell>
    <Cell ss:StyleID="MetaValue"><Data ss:Type="String">${moduleName}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">Total Penjualan</Data></Cell>
    <Cell ss:StyleID="MetaValue"><Data ss:Type="String">${totalQty} SA (Tier: ${tierLabel})</Data></Cell>
    <Cell><Data ss:Type="String"></Data></Cell>
    <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">${paidLabel}</Data></Cell>
    <Cell ss:StyleID="TotalValue"><Data ss:Type="Number">${paid}</Data></Cell>
   </Row>
   <Row><Cell ss:MergeAcross="4"><Data ss:Type="String"></Data></Cell></Row>

   <!-- Header Table -->
   <Row ss:Height="24">
    <Cell ss:StyleID="Header"><Data ss:Type="String">No</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Nama Paket / Produk</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Qty (SA)</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Tarif Satuan (Rp)</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Subtotal (Rp)</Data></Cell>
   </Row>`;

  if (rows.length === 0) {
    xml += `
   <Row>
    <Cell ss:MergeAcross="4" ss:StyleID="CellCenter"><Data ss:Type="String">Belum ada paket produk yang ditambahkan</Data></Cell>
   </Row>`;
  } else {
    rows.forEach((r, idx) => {
      xml += `
   <Row>
    <Cell ss:StyleID="CellCenter"><Data ss:Type="Number">${idx + 1}</Data></Cell>
    <Cell ss:StyleID="CellLeft"><Data ss:Type="String">${r.name}</Data></Cell>
    <Cell ss:StyleID="CellCenter"><Data ss:Type="Number">${r.qty}</Data></Cell>
    <Cell ss:StyleID="CellCurrency"><Data ss:Type="Number">${r.tariff}</Data></Cell>
    <Cell ss:StyleID="CellCurrency"><Data ss:Type="Number">${r.subtotal}</Data></Cell>
   </Row>`;
    });
  }

  // Summary rows
  xml += `
   <Row ss:Height="22">
    <Cell ss:MergeAcross="3" ss:StyleID="TotalLabel"><Data ss:Type="String">GROSS INCENTIVE (RP)</Data></Cell>
    <Cell ss:StyleID="TotalValue"><Data ss:Type="Number">${gross}</Data></Cell>
   </Row>`;

  if (totalPotongan > 0) {
    xml += `
   <Row ss:Height="20">
    <Cell ss:MergeAcross="3" ss:StyleID="TotalLabel"><Data ss:Type="String">Potongan Telah Cair Bln 1 &amp; 2 (Rp)</Data></Cell>
    <Cell ss:StyleID="TotalValue"><Data ss:Type="Number">-${totalPotongan}</Data></Cell>
   </Row>`;
  }

  xml += `
   <Row ss:Height="24">
    <Cell ss:MergeAcross="3" ss:StyleID="TotalLabel"><Data ss:Type="String">TOTAL ESTIMASI PENCAIRAN (${paidLabel.toUpperCase()})</Data></Cell>
    <Cell ss:StyleID="TotalValue"><Data ss:Type="Number">${paid}</Data></Cell>
   </Row>`;

  if (notice && notice.message) {
    xml += `
   <Row><Cell ss:MergeAcross="4"><Data ss:Type="String"></Data></Cell></Row>
   <Row>
    <Cell ss:MergeAcross="4" ss:StyleID="CellLeft"><Data ss:Type="String">Catatan: ${notice.message}</Data></Cell>
   </Row>`;
  }

  xml += `
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const filename = `Laporan_Insentif_${safeAe.replace(/[^a-zA-Z0-9]/g, '_')}_${safeDate}.xls`;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Print / Save as PDF
export function printPdfDocument({ namaAe, idSc, tanggal, moduleName, totalQty, tierLabel, gross, paid, paidLabel, rows, notice, totalPotongan }) {
  const safeAe = namaAe || 'Sales AE';
  const safeDate = tanggal || new Date().toISOString().split('T')[0];

  const printWindow = window.open('', '_blank', 'width=850,height=900');
  if (!printWindow) {
    alert('Harap izinkan popup browser untuk membuka pratinjau cetak PDF.');
    return;
  }

  const tableRowsHtml = rows.map((r, i) => `
    <tr>
      <td style="text-align:center;padding:10px 8px;border-bottom:1px solid #e2e8f0;font-size:12px;">${i + 1}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#1e293b;">${r.name}</td>
      <td style="text-align:center;padding:10px 8px;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:700;">${r.qty}</td>
      <td style="text-align:right;padding:10px 12px;border-bottom:1px solid #e2e8f0;font-size:12px;">${formatRupiah(r.tariff)}</td>
      <td style="text-align:right;padding:10px 12px;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:700;color:#6f2c91;">${formatRupiah(r.subtotal)}</td>
    </tr>
  `).join('');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Laporan Insentif - ${safeAe}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
      color: #1e293b;
      margin: 0;
      padding: 24px;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #6f2c91;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 800;
      color: #6f2c91;
      letter-spacing: -0.5px;
    }
    .brand-sub {
      font-size: 11px;
      color: #64748b;
      margin-top: 2px;
    }
    .badge {
      display: inline-block;
      padding: 6px 12px;
      background: #f3e8ff;
      color: #6f2c91;
      border-radius: 6px;
      font-weight: 700;
      font-size: 12px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px 24px;
      background: #faf5ff;
      border: 1px solid #e9d5ff;
      border-radius: 10px;
      padding: 16px;
      margin-bottom: 24px;
      font-size: 12px;
    }
    .meta-item { display: flex; justify-content: space-between; }
    .meta-label { color: #64748b; font-weight: 600; }
    .meta-val { font-weight: 700; color: #0f172a; }
    .kpi-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 24px;
    }
    .kpi-card {
      border: 1px solid #e2e8f0;
      border-left: 4px solid #6f2c91;
      border-radius: 8px;
      padding: 12px;
    }
    .kpi-card.highlight {
      background: #faf5ff;
      border-color: #d8b4fe;
      border-left: 4px solid #6f2c91;
    }
    .kpi-label { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748b; }
    .kpi-value { font-size: 16px; font-weight: 800; color: #0f172a; margin-top: 4px; }
    .kpi-card.highlight .kpi-value { color: #6f2c91; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    th {
      background: #6f2c91;
      color: #ffffff;
      padding: 10px 12px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      text-align: left;
    }
    .total-row {
      background: #faf5ff;
      font-weight: 800;
    }
    .total-row td {
      padding: 12px;
      border-top: 2px solid #6f2c91;
      border-bottom: 2px solid #6f2c91;
      font-size: 13px;
    }
    .sign-section {
      margin-top: 40px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      text-align: center;
      font-size: 12px;
      page-break-inside: avoid;
    }
    .sign-space { height: 60px; }
    .btn-print {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #6f2c91;
      color: #ffffff;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(111,44,145,0.3);
    }
    @media print {
      .btn-print { display: none; }
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <button class="btn-print" onclick="window.print()">Simpan / Cetak PDF</button>

  <div class="header">
    <div>
      <div class="brand-title">MyRepublic</div>
      <div class="brand-sub">Branch Purwokerto &bull; Form Laporan Komisi Sales AE</div>
    </div>
    <div class="badge">${moduleName}</div>
  </div>

  <div class="meta-grid">
    <div class="meta-item"><span class="meta-label">Nama Sales AE:</span><span class="meta-val">${safeAe}</span></div>
    <div class="meta-item"><span class="meta-label">Tanggal Dokumen:</span><span class="meta-val">${safeDate}</span></div>
    <div class="meta-item"><span class="meta-label">ID SC UMP:</span><span class="meta-val">${idSc || '-'}</span></div>
    <div class="meta-item"><span class="meta-label">Cabang:</span><span class="meta-val">Purwokerto</span></div>
  </div>

  <div class="kpi-row">
    <div class="kpi-card">
      <div class="kpi-label">Total Penjualan</div>
      <div class="kpi-value">${totalQty} SA</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Pencapaian Tier</div>
      <div class="kpi-value">${tierLabel}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Gross Incentive</div>
      <div class="kpi-value">${formatRupiah(gross)}</div>
    </div>
    <div class="kpi-card highlight">
      <div class="kpi-label">${paidLabel}</div>
      <div class="kpi-value">${formatRupiah(paid)}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:40px;text-align:center;">No</th>
        <th>Nama Paket Layanan</th>
        <th style="width:70px;text-align:center;">Qty</th>
        <th style="width:130px;text-align:right;">Tarif (Rp)</th>
        <th style="width:140px;text-align:right;">Subtotal (Rp)</th>
      </tr>
    </thead>
    <tbody>
      ${tableRowsHtml || '<tr><td colspan="5" style="text-align:center;padding:24px;color:#94a3b8;">Belum ada item penjualan</td></tr>'}
    </tbody>
    <tfoot>
      <tr class="total-row">
        <td colspan="4" style="text-align:right;">TOTAL ESTIMASI PENCAIRAN:</td>
        <td style="text-align:right;color:#6f2c91;">${formatRupiah(paid)}</td>
      </tr>
    </tfoot>
  </table>

  ${notice && notice.message ? `
    <div style="background:#fffbeb;border:1px solid #fef3c7;color:#92400e;padding:12px;border-radius:6px;font-size:11px;margin-bottom:24px;">
      <b>Catatan Ketentuan:</b> ${notice.message}
    </div>
  ` : ''}

  <div class="sign-section">
    <div>
      <div>Dibuat oleh,</div>
      <div class="sign-space"></div>
      <div style="font-weight:700;text-decoration:underline;">${safeAe}</div>
      <div style="color:#64748b;font-size:11px;">Account Executive (AE)</div>
    </div>
    <div>
      <div>Mengetahui,</div>
      <div class="sign-space"></div>
      <div style="font-weight:700;text-decoration:underline;">Area Sales Manager (ASM)</div>
      <div style="color:#64748b;font-size:11px;">Branch Purwokerto</div>
    </div>
  </div>

  <script>
    window.onload = function() {
      // Auto trigger print prompt after render
      setTimeout(function() { window.print(); }, 400);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

