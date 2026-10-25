import React, { useState } from 'react';
import { FIELD_TEAMS } from '../../data/mockData';
import { ReportItem } from '../../types';

interface AdminTeamsViewProps {
  reports: ReportItem[];
  onOpenReportDetail?: (report: ReportItem) => void;
}

export const AdminTeamsView: React.FC<AdminTeamsViewProps> = ({ reports, onOpenReportDetail }) => {
  const [teams, setTeams] = useState(FIELD_TEAMS);

  const toggleTeamStatus = (teamId: string) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          const nextStatus = t.status === 'Bertugas' ? 'Siaga' : t.status === 'Siaga' ? 'Istirahat' : 'Bertugas';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const totalMembers = teams.reduce((acc, curr) => acc + curr.activeMembers, 0);
  const activeTeams = teams.filter((t) => t.status === 'Bertugas').length;

  return (
    <div className="space-y-6">
      {/* Overview Header Banner */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[24px]">engineering</span>
            <h2 className="font-headline text-lg font-bold text-slate-900">
              Manajemen Petugas &amp; Regu Lapangan Desa
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Pantau ketersediaan armada, koordinator lapangan, dan distribusi penanganan aduan di setiap divisi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            {activeTeams} Regu Sedang Bertugas ({totalMembers} Personil Aktif)
          </span>
        </div>
      </div>

      {/* Grid of Teams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {teams.map((team) => {
          // Count active reports assigned to this team
          const assignedReports = reports.filter(
            (r) => r.assignedTeam === team.name && (r.status === 'Sedang Dikerjakan' || r.status === 'Dijadwalkan')
          );

          const getStatusBadge = (status: string) => {
            switch (status) {
              case 'Bertugas':
                return 'bg-blue-50 text-blue-700 border-blue-200';
              case 'Siaga':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
              default:
                return 'bg-slate-100 text-slate-600 border-slate-200';
            }
          };

          return (
            <div
              key={team.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      {team.code}
                    </div>
                    <div>
                      <h3 className="font-headline text-base font-bold text-slate-900 leading-tight">
                        {team.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{team.division}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleTeamStatus(team.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-all hover:scale-105 ${getStatusBadge(
                      team.status
                    )}`}
                    title="Klik untuk ubah status regu"
                  >
                    {team.status}
                  </button>
                </div>

                <div className="space-y-2.5 text-xs text-slate-600 py-3 border-y border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Koordinator Lapangan:</span>
                    <strong className="text-slate-900 font-semibold">{team.leader}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Jumlah Personil:</span>
                    <strong className="text-slate-900 font-semibold">{team.activeMembers} Anggota</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Armada / Kendaraan:</span>
                    <strong className="text-slate-900 font-semibold">{team.vehicle}</strong>
                  </div>
                </div>

                {/* Assigned reports list */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Tiket Sedang Ditangani ({assignedReports.length})
                    </span>
                  </div>

                  {assignedReports.length === 0 ? (
                    <div className="p-3 rounded-xl bg-slate-50 text-slate-400 text-xs text-center border border-slate-100">
                      Tidak ada tiket aktif yang sedang ditugaskan ke regu ini.
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {assignedReports.map((r) => (
                        <div
                          key={r.id}
                          onClick={() => onOpenReportDetail && onOpenReportDetail(r)}
                          className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 transition-all flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="font-mono text-xs font-bold text-emerald-700">{r.id}</span>
                            <span className="text-xs text-slate-800 font-medium truncate">{r.title}</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold shrink-0">
                            {r.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Klik label status untuk ubah status regu</span>
                <span className="material-symbols-outlined text-[16px] text-slate-400">sync_alt</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
