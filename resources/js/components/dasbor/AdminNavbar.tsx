import React from 'react';
import { AdminTab } from './AdminSidebar';

interface AdminNavbarProps {
  activeTab: AdminTab;
  onOpenMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNewReportClick: () => void;
  onExportClick: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  urgentCount: number;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({
  activeTab,
  onOpenMobileMenu,
  searchQuery,
  onSearchChange,
  onNewReportClick,
  onExportClick,
  onRefresh,
  isRefreshing,
  urgentCount,
}) => {
  const tabTitles: Record<AdminTab, { title: string; subtitle: string }> = {
    dasbor: { title: 'Dasbor Ringkasan', subtitle: 'Ikhtisar operasional & penanganan fasilitas desa' },
    laporan: { title: 'Semua Laporan Warga', subtitle: 'Daftar seluruh aduan & riwayat penanganan tiket' },
    verifikasi: { title: 'Antrean Verifikasi & Disposisi', subtitle: 'Aduan masuk yang memerlukan verifikasi dan penugasan regu' },
    peta: { title: 'Peta GIS Persebaran Wilayah', subtitle: 'Sebaran spasial titik kerusakan fasilitas umum di 6 dusun' },
    petugas: { title: 'Regu Petugas Lapangan', subtitle: 'Monitoring kesiapan armada & personil siaga desa' },
    catatan: { title: 'Catatan Koordinasi Harian', subtitle: 'Log briefing operasional harian antar perangkat desa' },
    statistik: { title: 'Statistik & Analisis SLA', subtitle: 'Metrik capaian standar pelayanan minimal penanganan aduan' },
    pengaturan: { title: 'Pengaturan Sistem Desa', subtitle: 'Identitas portal desa, parameter SLA, dan konfigurasi' },
  };

  const currentInfo = tabTitles[activeTab] || tabTitles.dasbor;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4 shadow-2xs shrink-0">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-none"
          title="Buka Menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Admin /</span>
            <h1 className="font-headline text-base sm:text-lg font-bold text-slate-900 leading-tight">
              {currentInfo.title}
            </h1>
          </div>
          <span className="text-[11px] text-slate-500 hidden md:inline leading-none">
            {currentInfo.subtitle}
          </span>
        </div>
      </div>

      {/* Right: Search, Actions, Server Status */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Search */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Cari tiket, nama, lokasi..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-lg border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined text-[14px]">cancel</span>
            </button>
          )}
        </div>

        {/* Server Status Pill */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>JSON Database Aktif</span>
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
          title="Segarkan data dari server JSON"
        >
          <span className={`material-symbols-outlined text-[20px] ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`}>
            refresh
          </span>
        </button>

        {/* Export Data Button */}
        <button
          onClick={onExportClick}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          title="Ekspor laporan ke CSV atau JSON"
        >
          <span className="material-symbols-outlined text-[17px]">download</span>
          <span>Ekspor</span>
        </button>

        {/* Primary Action: New Report */}
        <button
          onClick={onNewReportClick}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all hover:shadow-md"
        >
          <span className="material-symbols-outlined text-[17px]">add_circle</span>
          <span className="hidden sm:inline">Input Aduan</span>
        </button>
      </div>
    </header>
  );
};
