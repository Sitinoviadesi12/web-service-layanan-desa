import React, { useState } from 'react';
import { ReportItem } from '../../types';
import { VILLAGE_DUSUNS } from '../../data/mockData';

interface AdminMapViewProps {
  reports: ReportItem[];
  onSelectReport: (report: ReportItem) => void;
}

export const AdminMapView: React.FC<AdminMapViewProps> = ({ reports, onSelectReport }) => {
  const [selectedDusun, setSelectedDusun] = useState<string>('all');
  const [activeFilterStatus, setActiveFilterStatus] = useState<string>('all');

  const filteredReports = reports.filter((r) => {
    if (selectedDusun !== 'all' && r.dusun !== selectedDusun) return false;
    if (activeFilterStatus !== 'all' && r.status !== activeFilterStatus) return false;
    return true;
  });

  const getPinColor = (status: ReportItem['status']) => {
    switch (status) {
      case 'Selesai':
        return 'bg-emerald-600 ring-white text-white';
      case 'Sedang Dikerjakan':
        return 'bg-blue-600 ring-white text-white';
      case 'Dijadwalkan':
        return 'bg-purple-600 ring-white text-white';
      case 'Ditolak':
        return 'bg-red-600 ring-white text-white';
      case 'Diajukan':
      default:
        return 'bg-amber-500 ring-white text-slate-950 animate-bounce';
    }
  };

  return (
    <div className="space-y-5">
      {/* Filter and Overview Bar */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[22px]">map</span>
            <h2 className="font-headline text-lg font-bold text-slate-900">
              Peta GIS Sebaran Aduan Desa Mandiri
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Visualisasi lokasi kerusakan fasilitas di 6 wilayah dusun untuk pemetaan rute respon regu.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedDusun('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedDusun === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Semua Dusun ({reports.length})
          </button>
          {VILLAGE_DUSUNS.map((d) => {
            const count = reports.filter((r) => r.dusun === d).length;
            return (
              <button
                key={d}
                onClick={() => setSelectedDusun(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedDusun === d
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {d} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Map Visual */}
      <div className="relative w-full h-[520px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-lg">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>

        {/* River & roads SVG lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
          <path d="M 0 140 Q 280 80, 520 280 T 1000 320 T 1600 400" fill="none" stroke="#38bdf8" strokeWidth="8" />
          <path d="M 140 0 L 340 240 L 720 300 L 1020 540" fill="none" stroke="#94a3b8" strokeWidth="5" strokeDasharray="8 6" />
          <path d="M 480 0 L 510 540" fill="none" stroke="#64748b" strokeWidth="3" strokeDasharray="4 4" />
          <path d="M 0 350 L 500 350 L 1200 480" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="3 3" />
        </svg>

        {/* Dusun boundary badges */}
        <div className="absolute top-5 left-6 p-2.5 px-3.5 rounded-xl bg-slate-900/80 backdrop-blur-md text-white border border-slate-700">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">Dusun Krajan (Pusat Desa)</p>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Kantor Desa, Pasar, &amp; Jembatan Utama</p>
        </div>

        <div className="absolute top-6 right-6 p-2.5 px-3.5 rounded-xl bg-slate-900/80 backdrop-blur-md text-white border border-slate-700">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-300">Dusun Sukamaju</p>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Pemukiman Warga RT 01 - RT 06</p>
        </div>

        <div className="absolute bottom-6 left-6 p-2.5 px-3.5 rounded-xl bg-slate-900/80 backdrop-blur-md text-white border border-slate-700">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">Blok Sawah Kidul &amp; Melati</p>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Sentra Pertanian, Tanggul, &amp; Saluran Irigasi</p>
        </div>

        {/* Legend */}
        <div className="absolute bottom-6 right-6 p-3.5 rounded-xl bg-slate-900/90 backdrop-blur-md text-white border border-slate-700 text-xs space-y-1.5 z-10 hidden sm:block">
          <p className="font-bold text-[11px] uppercase tracking-wider text-slate-400 mb-2">Status Titik Aduan</p>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-slate-200">Diajukan ({reports.filter((r) => r.status === 'Diajukan').length})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span className="text-slate-200">Sedang Dikerjakan ({reports.filter((r) => r.status === 'Sedang Dikerjakan').length})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            <span className="text-slate-200">Dijadwalkan ({reports.filter((r) => r.status === 'Dijadwalkan').length})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-200">Selesai ({reports.filter((r) => r.status === 'Selesai').length})</span>
          </div>
        </div>

        {/* Dynamic Pins */}
        <div className="absolute inset-0 pointer-events-auto">
          {filteredReports.map((report) => {
            const posX = report.coordinates?.xPercent ?? 50;
            const posY = report.coordinates?.yPercent ?? 50;

            return (
              <div
                key={report.id}
                style={{ left: `${posX}%`, top: `${posY}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
                onClick={() => onSelectReport(report)}
              >
                {/* Pin Bubble */}
                <div
                  className={`p-2 rounded-full shadow-lg ring-2 ${getPinColor(
                    report.status
                  )} flex items-center justify-center transition-all group-hover:scale-130`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {report.categoryIcon || 'location_on'}
                  </span>
                </div>

                {/* Hover Tooltip Popup */}
                <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-52 p-3 bg-slate-900 text-white rounded-xl shadow-2xl text-left border border-slate-700 z-40 pointer-events-none">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-mono font-bold text-emerald-400">{report.id}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-semibold">{report.status}</span>
                  </div>
                  <p className="text-xs font-bold leading-snug line-clamp-2">{report.title}</p>
                  <p className="text-[11px] text-slate-300 truncate mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-slate-400">pin_drop</span>
                    {report.location}
                  </p>
                  <div className="mt-2 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px]">
                    <span className="text-amber-300 font-bold">P: {report.priority}</span>
                    <span className="text-emerald-400 font-medium">Klik untuk rincian &rarr;</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
