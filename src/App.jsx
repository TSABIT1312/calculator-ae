import React, { useState, useEffect } from 'react';
import Navbar from './components/common/Navbar';
import Toast from './components/common/Toast';
import Loader from './components/common/Loader';
import KalkulatorView from './components/kalkulator/KalkulatorView';
import ReportView from './components/report/ReportView';
import { getAreaConfig } from './services/apiService';

export default function App() {
  const [activeTab, setActiveTab] = useState('kalkulator');
  const [clusters, setClusters] = useState({ "REGULER": [], "RING & ECO": [] });
  
  // Toast state
  const [toast, setToast] = useState({ show: false, title: '', message: '', type: 'success' });

  // Loader state
  const [loader, setLoader] = useState({ show: false, title: '', subtitle: '' });

  const showToast = (title, message, type = 'success') => {
    setToast({ show: true, title, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  useEffect(() => {
    async function initData() {
      try {
        const config = await getAreaConfig();
        if (config && config.clusters) {
          setClusters(config.clusters);
        }
      } catch (e) {
        console.error('Failed to load initial clusters:', e);
      }
    }
    initData();
  }, []);

  return (
    <div className="bg-[#f8f5fa] text-slate-800 flex flex-col min-h-screen font-sans selection:bg-[#6f2c91] selection:text-white">
      {/* Global Toast */}
      <Toast toast={toast} onClose={closeToast} />

      {/* Global Loader Modal */}
      <Loader
        isLoading={loader.show}
        title={loader.title || "Memuat Data"}
        subtitle={loader.subtitle || "Sedang memproses..."}
      />

      {/* Top Navbar */}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6 mt-1">
        {activeTab === 'kalkulator' ? (
          <KalkulatorView />
        ) : (
          <ReportView
            clusters={clusters}
            showToast={showToast}
            setLoader={setLoader}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-8 w-full">
        <div className="max-w-2xl mx-auto px-4 space-y-1">
          <p className="font-bold text-slate-700">&copy; {new Date().getFullYear()} MyRepublic Purwokerto &bull; Sistem Sales AE</p>
          <p className="text-[11px] text-slate-400">Dioptimalkan untuk smartphone & desktop &bull; Ditenagai oleh React 18</p>
        </div>
      </footer>
    </div>
  );
}
