import React from 'react';
import { ASSETS } from '../../data/mockData';

export type AdminTab = 
  | 'dasbor'
  | 'laporan'
  | 'verifikasi'
  | 'peta'
  | 'petugas'
  | 'catatan'
  | 'statistik'
  | 'pengaturan';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  pendingCount: number;
  totalCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingCount,
  totalCount,
  isOpenMobile,
  onCloseMobile,
}) => {
  const menuSections = [
    {
      title: 'MENU UTAMA',
      items: [
        {
          id: 'dasbor' as AdminTab,
          label: 'Dasbor Ringkasan',
          icon: 'dashboard',
        },
        {
          id: 'laporan' as AdminTab,
          label: 'Semua Laporan',
          icon: 'table_chart',
          badge: `${totalCount}`,
          badgeClass: 'bg-slate-800 text-slate-300',
        },
        {
          id: 'verifikasi' as AdminTab,
          label: 'Antrean Verifikasi',
          icon: 'verified',
          badge: pendingCount > 0 ? `${pendingCount} Baru` : undefined,
          badgeClass: 'bg-amber-500 text-slate-950 font-bold animate-pulse',
        },
      ],
    },
    {
      title: 'OPERASIONAL & LAPANGAN',
      items: [
        {
          id: 'peta' as AdminTab,
          label: 'Peta GIS Wilayah',
          icon: 'map',
        },
        {
          id: 'petugas' as AdminTab,
          label: 'Regu Petugas Lapangan',
          icon: 'engineering',
        },
        {
          id: 'catatan' as AdminTab,
          label: 'Catatan Koordinasi',
          icon: 'assignment',
        },
      ],
    },
    {
      title: 'ANALISIS & SISTEM',
      items: [
        {
          id: 'statistik' as AdminTab,
          label: 'Statistik & SLA',
          icon: 'analytics',
        },
        {
          id: 'pengaturan' as AdminTab,
          label: 'Pengaturan Sistem',
          icon: 'settings',
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-slate-200 flex flex-col justify-between border-r border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out z-40 lg:z-30 lg:translate-x-0 ${
        isOpenMobile ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Scrollable menu items */}
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
          {/* Brand Header */}
          <div className="h-18 px-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-900/30 shrink-0">
                <span className="material-symbols-outlined text-[22px]">account_balance</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline text-base font-bold text-white tracking-tight leading-tight">
                  Desa Mandiri
                </span>
                <span className="text-[11px] font-semibold text-emerald-400 tracking-wider uppercase">
                  Panel Administrator
                </span>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
              title="Tutup Menu"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-5">
            {menuSections.map((section) => (
              <div key={section.title}>
                <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {section.title}
                </div>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectTab(item.id);
                          onCloseMobile();
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                          isActive
                            ? 'bg-emerald-600 text-white font-bold shadow-sm shadow-emerald-950'
                            : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`material-symbols-outlined text-[19px] ${isActive ? 'text-white' : 'text-slate-400'}`}>
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeClass || 'bg-slate-800 text-slate-300'}`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Section: Portal Warga & Profile */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 space-y-2 shrink-0">
          {/* Direct Switcher to Public Portal */}
          <a
            href="/"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/20 transition-colors"
            title="Lihat website publik layanan warga"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px]">public</span>
              <span>Buka Portal Warga</span>
            </div>
            <span className="material-symbols-outlined text-[15px]">open_in_new</span>
          </a>

          {/* Profile Card */}
          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img 
                alt="Profile Budi Santoso" 
                className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-emerald-500/40" 
                src={ASSETS.avatar} 
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-white truncate">
                  Budi Santoso
                </span>
                <span className="text-[10px] text-slate-400 truncate">
                  Kaur Pelayanan Desa
                </span>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-950" title="Online" />
          </div>
        </div>
      </aside>
    </>
  );
};
