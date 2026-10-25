import React, { useState } from 'react';
import { ASSETS } from '../../data/mockData';
import { ReportItem } from '../../types';

interface GisMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: ReportItem[];
  onSelectReport: (report: ReportItem) => void;
}

export const GisMapModal: React.FC<GisMapModalProps> = ({
  isOpen,
  onClose,
  reports,
  onSelectReport
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeReport, setActiveReport] = useState<ReportItem | null>(null);

  if (!isOpen) return null;

  const filteredReports = reports.filter((r) => {
    const matchesFilter = selectedFilter === 'all' || r.category === selectedFilter;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getPinColor = (status: ReportItem['status']) => {
    switch (status) {
      case 'Selesai':
        return 'bg-emerald-600 ring-white';
      case 'Sedang Dikerjakan':
        return 'bg-blue-600 ring-white';
      case 'Dijadwalkan':
        return 'bg-purple-600 ring-white';
      case 'Diajukan':
      default:
        return 'bg-amber-500 ring-white animate-bounce';
    }
  };

  const getPinIcon = (status: ReportItem['status']) => {
    switch (status) {
      case 'Selesai':
        return 'check';
      case 'Sedang Dikerjakan':
        return 'build';
      case 'Dijadwalkan':
        return 'calendar_month';
      case 'Diajukan':
      default:
        return 'priority_high';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">map</span>
            </div>
            <div>
              <h2 className="font-headline text-lg sm:text-xl font-bold text-slate-900">
                Peta Wilayah Interaktif GIS Desa Mandiri
              </h2>
              <p className="text-xs text-slate-500">
                Pemetaan geografis persebaran aduan fasilitas umum &amp; infrastruktur 6 dusun.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Selesai
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Proses
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Diajukan
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Toolbar Filter */}
        <div className="px-6 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { key: 'all', label: 'Semua Kategori' },
              { key: 'jalan', label: 'Jalan' },
              { key: 'irigasi', label: 'Irigasi' },
              { key: 'penerangan', label: 'PJU' },
              { key: 'kebersihan', label: 'Sampah' },
              { key: 'taman', label: 'Pohon' },
              { key: 'fasilitas', label: 'Balai/Pos' }
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setSelectedFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors ${
                  selectedFilter === f.key
                    ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari lokasi / tiket..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 border border-slate-200">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
                className="p-1 hover:bg-white rounded-lg text-slate-700 cursor-pointer"
                title="Perbesar Peta"
              >
                <span className="material-symbols-outlined text-[18px]">zoom_in</span>
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
                className="p-1 hover:bg-white rounded-lg text-slate-700 cursor-pointer"
                title="Perkecil Peta"
              >
                <span className="material-symbols-outlined text-[18px]">zoom_out</span>
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1 hover:bg-white rounded-lg text-slate-700 cursor-pointer"
                title="Reset Zoom"
              >
                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              </button>
            </div>
          </div>
        </div>

        {/* Map Body & Pin Overlay */}
        <div className="relative flex-1 bg-slate-100 overflow-hidden">
          <div
            className="w-full h-full relative transition-transform duration-300 ease-out origin-center cursor-grab active:cursor-grabbing"
            style={{
              backgroundImage: `url('${ASSETS.mapBg}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: `scale(${zoomLevel})`
            }}
          >
            {/* Soft grid lines to mimic village cadastral GIS */}
            <div className="absolute inset-0 bg-radial from-transparent via-slate-900/5 to-slate-900/15 pointer-events-none" />

            {/* Boundary Labels for Dusun */}
            <div className="absolute top-12 left-16 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-bold text-emerald-800 border border-emerald-200 shadow-xs pointer-events-none">
              Dusun Krajan (Wilayah Utara)
            </div>
            <div className="absolute top-24 right-20 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-bold text-emerald-800 border border-emerald-200 shadow-xs pointer-events-none">
              Blok Sawah Kidul (Irigasi Tersier)
            </div>
            <div className="absolute bottom-24 left-24 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-bold text-emerald-800 border border-emerald-200 shadow-xs pointer-events-none">
              Dusun Sukamaju (Pemukiman Selatan)
            </div>
            <div className="absolute bottom-16 right-32 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-bold text-emerald-800 border border-emerald-200 shadow-xs pointer-events-none">
              Dusun Melati &amp; Balai RW
            </div>

            {/* Markers */}
            {filteredReports.map((report) => (
              <div
                key={report.id}
                onClick={() => {
                  setActiveReport(report);
                }}
                style={{
                  top: `${report.coordinates.yPercent}%`,
                  left: `${report.coordinates.xPercent}%`
                }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
              >
                <div
                  className={`w-9 h-9 rounded-full ${getPinColor(
                    report.status
                  )} text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-white/50 transition-transform group-hover:scale-125`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {getPinIcon(report.status)}
                  </span>
                </div>
                {/* Micro Label */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-[10px] font-mono px-2 py-0.5 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
                  {report.id}
                </div>
              </div>
            ))}
          </div>

          {/* Active Report Popup Card */}
          {activeReport && (
            <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-96 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-slate-200 z-30 animate-in slide-in-from-bottom-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-xs text-emerald-700">
                  {activeReport.id} • {activeReport.categoryLabel}
                </span>
                <button
                  onClick={() => setActiveReport(null)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <h4 className="font-headline font-bold text-sm text-slate-900 mb-1 line-clamp-2">
                {activeReport.title}
              </h4>
              <p className="text-xs text-slate-500 mb-2 truncate">
                📍 {activeReport.location}
              </p>
              <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                {activeReport.description}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-600">
                  Status: <strong className="text-slate-900">{activeReport.status}</strong>
                </span>
                <button
                  onClick={() => {
                    onSelectReport(activeReport);
                    onClose();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors cursor-pointer shadow-xs"
                >
                  Buka Detail
                </button>
              </div>
            </div>
          )}

          {/* Map Overlay Stats Card */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-xs border border-slate-200 hidden md:block">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Statistik GIS Lapangan
            </span>
            <span className="text-sm font-bold text-slate-900 block">
              {filteredReports.length} Laporan Terpetakan
            </span>
            <span className="text-[11px] text-slate-500">
              Klik pada titik lingkaran untuk melihat data aduan
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
