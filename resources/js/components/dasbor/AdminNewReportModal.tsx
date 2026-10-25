import React, { useState } from 'react';
import { ReportItem, ReportCategory, ReportPriority } from '../../types';
import { CATEGORY_OPTIONS, VILLAGE_DUSUNS } from '../../data/mockData';

interface AdminNewReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReport: (newReport: ReportItem) => void;
}

export const AdminNewReportModal: React.FC<AdminNewReportModalProps> = ({
  isOpen,
  onClose,
  onAddReport,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterRole, setReporterRole] = useState('Warga Dusun');
  const [reporterPhone, setReporterPhone] = useState('');
  const [category, setCategory] = useState<ReportCategory>('jalan');
  const [location, setLocation] = useState('');
  const [dusun, setDusun] = useState<string>(VILLAGE_DUSUNS[0]);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<ReportPriority>('Sedang');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !reporterName.trim() || !description.trim()) return;

    setIsSubmitting(true);
    const catMeta = CATEGORY_OPTIONS.find((c) => c.key === category) || CATEGORY_OPTIONS[0];
    const randomNum = Math.floor(400 + Math.random() * 500);

    const newTicket: ReportItem = {
      id: `#LAP-0${randomNum}`,
      title: title.trim(),
      reporterName: reporterName.trim(),
      reporterRole: reporterRole.trim(),
      reporterPhone: reporterPhone.trim() || undefined,
      category,
      categoryLabel: catMeta.label,
      categoryIcon: catMeta.icon,
      location: location.trim() ? `${dusun}, ${location.trim()}` : `${dusun}, Wilayah Desa Mandiri`,
      dusun,
      description: description.trim(),
      timeAgo: 'Baru saja',
      createdAt: 'Hari ini, baru saja',
      status: 'Diajukan',
      priority,
      officerBadge: `Prioritas: ${priority}`,
      officerBadgeType: 'priority',
      isAnonymous: false,
      upvotes: 1,
      coordinates: {
        lat: -2.5740 + (Math.random() - 0.5) * 0.005,
        lng: 121.2020 + (Math.random() - 0.5) * 0.005,
        xPercent: 30 + Math.floor(Math.random() * 45),
        yPercent: 30 + Math.floor(Math.random() * 45),
      },
      timeline: [
        {
          title: 'Laporan Diterima Petugas Desa',
          time: 'Baru saja',
          description: 'Dicatat langsung melalui loket pelayanan / telepon kantor desa.',
          actor: 'Petugas Loket Desa',
          isCompleted: true,
        },
      ],
      comments: [],
    };

    onAddReport(newTicket);
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Header */}
        <div className="p-4 sm:px-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
            </span>
            <div>
              <h3 className="font-headline text-base font-bold leading-tight">Input Aduan Warga Baru</h3>
              <p className="text-xs text-slate-300">Pencatatan langsung via loket pelayanan / telepon desa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Judul Kerusakan / Keluhan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Aspal Amblas di Depan Pos RT 02"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Kategori Fasilitas <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ReportCategory)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Tingkat Urgensi / Prioritas
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as ReportPriority)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
              >
                <option value="Rendah">Rendah (Dapat dijadwalkan)</option>
                <option value="Sedang">Sedang (Standar penanganan)</option>
                <option value="Tinggi">Tinggi (Mengganggu aktivitas)</option>
                <option value="Mendesak">Mendesak (Bahaya keselamatan)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Wilayah Dusun <span className="text-red-500">*</span>
              </label>
              <select
                value={dusun}
                onChange={(e) => setDusun(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
              >
                {VILLAGE_DUSUNS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Detail Patokan Lokasi</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Depan warung Bu Sri RT 03"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nama Pelapor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="Nama warga / ketua RT"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">No. WhatsApp / HP</label>
              <input
                type="text"
                value={reporterPhone}
                onChange={(e) => setReporterPhone(e.target.value)}
                placeholder="0812-xxxx-xxxx"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Deskripsi Masalah <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan kondisi kerusakan secara rinci agar regu lapangan dapat mempersiapkan alat yang tepat..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan & Daftarkan Aduan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
