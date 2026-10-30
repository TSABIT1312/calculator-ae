import excelData from '../data/excelData.json';
import { AREA_MASTER_DATA } from '../data/constants';

const STORAGE_LEADS_KEY = 'myrep_purwokerto_leads';

// Helper to get stored leads from localStorage
export function getStoredLeads() {
  try {
    const raw = localStorage.getItem(STORAGE_LEADS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

// Helper to save lead to localStorage
export function saveLeadLocally(lead) {
  try {
    const current = getStoredLeads();
    current.unshift({
      ...lead,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(current));
    return true;
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
    return false;
  }
}

// Search ID SC UMP
export async function searchIdSc(id) {
  const cleanId = id.toString().trim().toLowerCase();

  // 1. If running in Google Apps Script context
  if (typeof window !== 'undefined' && window.google && window.google.script) {
    return new Promise((resolve) => {
      window.google.script.run
        .withSuccessHandler((res) => resolve(res))
        .withFailureHandler((err) => resolve({ success: false, message: err.toString() }))
        .searchIdSc(cleanId);
    });
  }

  // 2. Query from bundled Excel Data
  const found = excelData.aeDatabase.find(
    item => item.id.toString().toLowerCase().trim() === cleanId
  );

  if (found) {
    return {
      success: true,
      data: {
        id: found.id,
        ae: found.ae,
        asm: found.asm
      }
    };
  }

  // 3. Fallback dummy if testing with '123'
  if (cleanId === '123') {
    return {
      success: true,
      data: {
        id: '123',
        ae: 'Fani',
        asm: 'Bima'
      }
    };
  }

  return {
    success: false,
    message: `ID SC UMP '${id}' tidak ditemukan di database.`
  };
}

// Get area master data & clusters
export async function getAreaConfig() {
  if (typeof window !== 'undefined' && window.google && window.google.script) {
    return new Promise((resolve) => {
      window.google.script.run
        .withSuccessHandler((res) => {
          if (res.success) {
            window.google.script.run
              .withSuccessHandler((dropRes) => {
                resolve({
                  areaMaster: res.data,
                  clusters: dropRes.clusterMap || excelData.clusters
                });
              })
              .getDropdownData();
          } else {
            resolve({
              areaMaster: AREA_MASTER_DATA,
              clusters: excelData.clusters
            });
          }
        })
        .withFailureHandler(() => {
          resolve({
            areaMaster: AREA_MASTER_DATA,
            clusters: excelData.clusters
          });
        })
        .getAreaMasterData();
    });
  }

  return {
    areaMaster: AREA_MASTER_DATA,
    clusters: excelData.clusters
  };
}

// Submit Kunjungan Prospek
export async function submitKunjungan(payload) {
  // Always save locally so client-side queries work offline/stand-alone
  saveLeadLocally(payload);

  if (typeof window !== 'undefined' && window.google && window.google.script) {
    return new Promise((resolve) => {
      window.google.script.run
        .withSuccessHandler((res) => resolve(res))
        .withFailureHandler((err) => resolve({ success: false, message: err.toString() }))
        .submitKunjunganData(payload);
    });
  }

  // Standalone mock delay
  await new Promise(r => setTimeout(r, 600));
  return {
    success: true,
    message: `Data berhasil disimpan ke tab ${payload.area}!`
  };
}

// Count Lead stats for an AE
export async function countLeadStats(aeName) {
  const cleanName = (aeName || '').toLowerCase().trim();

  if (typeof window !== 'undefined' && window.google && window.google.script) {
    return new Promise((resolve) => {
      window.google.script.run
        .withSuccessHandler((res) => resolve(res))
        .withFailureHandler(() => resolve(getLocalLeadCounts(cleanName)))
        .hitungTotalInputAE(aeName);
    });
  }

  return getLocalLeadCounts(cleanName);
}

function getLocalLeadCounts(aeLower) {
  const leads = getStoredLeads();
  const counts = { total: 0, cool: 0, warm: 0, hot: 0, closing: 0 };

  leads.forEach(l => {
    if ((l.ae || '').toLowerCase().trim() === aeLower) {
      counts.total++;
      const status = (l.statusLead || '').toUpperCase();
      if (status === 'COOL') counts.cool++;
      else if (status === 'WARM') counts.warm++;
      else if (status === 'HOT') counts.hot++;
      else if (status === 'CLOSING') counts.closing++;
    }
  });

  return {
    success: true,
    ...counts
  };
}

// Get all unique ASM names
export async function getAllAsms() {
  if (typeof window !== 'undefined' && window.google && window.google.script) {
    return new Promise((resolve) => {
      window.google.script.run
        .withSuccessHandler((res) => {
          if (res.success && res.data && res.data.length > 0) {
            resolve(res.data);
          } else {
            resolve(extractAsmsFromLocal());
          }
        })
        .withFailureHandler(() => resolve(extractAsmsFromLocal()))
        .getAllAsmNames();
    });
  }

  return extractAsmsFromLocal();
}

function extractAsmsFromLocal() {
  const set = new Set();
  excelData.aeDatabase.forEach(item => {
    if (item.asm && item.asm.toLowerCase() !== 'asm / bm' && item.asm.toLowerCase() !== 'asm') {
      set.add(item.asm);
    }
  });
  return Array.from(set).sort();
}

// Get Team Data for an ASM
export async function getTeamDataForAsm(asmName) {
  const cleanAsm = (asmName || '').toLowerCase().trim();

  if (typeof window !== 'undefined' && window.google && window.google.script) {
    return new Promise((resolve) => {
      window.google.script.run
        .withSuccessHandler((res) => {
          if (res.success) resolve(res.data);
          else resolve(getLocalTeamData(cleanAsm));
        })
        .withFailureHandler(() => resolve(getLocalTeamData(cleanAsm)))
        .getTimAsmData(asmName);
    });
  }

  return getLocalTeamData(cleanAsm);
}

function getLocalTeamData(cleanAsm) {
  // Find all AEs under this ASM
  const aeList = [];
  const seenAe = new Set();

  excelData.aeDatabase.forEach(item => {
    if ((item.asm || '').toLowerCase().trim() === cleanAsm) {
      const ae = item.ae;
      if (ae && !seenAe.has(ae)) {
        seenAe.add(ae);
        const stats = getLocalLeadCounts(ae.toLowerCase().trim());
        aeList.push({
          name: ae,
          id: item.id,
          total: stats.total,
          cool: stats.cool,
          warm: stats.warm,
          hot: stats.hot,
          closing: stats.closing
        });
      }
    }
  });

  aeList.sort((a, b) => b.total - a.total);
  return aeList;
}

