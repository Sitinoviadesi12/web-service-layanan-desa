import React, { useState, useEffect } from 'react';
import { CitizenUser } from '../../types';
import { api } from '../../services/api';
import { VILLAGE_DUSUNS } from '../../data/mockData';

interface CitizenLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: CitizenUser) => void;
  initialTab?: 'login' | 'register' | 'demo';
  promptMessage?: string;
}

export const CitizenLoginModal: React.FC<CitizenLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialTab = 'login',
  promptMessage,
}) => {
  const [tab, setTab] = useState<'login' | 'register' | 'demo'>(initialTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDusun, setRegDusun] = useState(VILLAGE_DUSUNS[0] || 'Dusun Krajan');
  const [regRtRw, setRegRtRw] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Demo accounts
  const [demoAccounts, setDemoAccounts] = useState<CitizenUser[]>([]);

  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      setError(null);
      // Fetch demo accounts
      api.getCitizenDemoAccounts()
        .then((accounts) => setDemoAccounts(accounts))
        .catch(() => {
          // Fallback static demo accounts
          setDemoAccounts([
            { id: 'cit-001', name: 'Siti Rahmawati', phone: '0812-3456-7890', dusun: 'Dusun Krajan', rtRw: 'RT 03 / RW 02', role: 'Pelapor Tiket #LAP-0419' },
            { id: 'cit-002', name: 'Ahmad Fauzi', phone: '0821-9876-5432', dusun: 'Dusun Sukamaju', rtRw: 'RT 05 / RW 02', role: 'Pelapor Tiket #LAP-0418' },
            { id: 'cit-003', name: 'Wayan Subagyo', phone: '0857-1122-3344', dusun: 'Blok Sawah Kidul', rtRw: 'RT 01 / RW 03', role: 'Pelapor Tiket #LAP-0417' },
            { id: 'cit-004', name: 'Rina Anggraini', phone: '0813-8899-7700', dusun: 'Pusat Pasar Desa', rtRw: 'RT 02 / RW 01', role: 'Pelapor Tiket #LAP-0416' },
            { id: 'cit-005', name: 'Budi Santoso', phone: '0812-1111-2222', dusun: 'Dusun Krajan', rtRw: 'RT 01 / RW 01', role: 'Warga Dusun Krajan' }
          ]);
        });
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone.trim()) {
      setError('Masukkan nomor WhatsApp atau HP');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.citizenLogin(loginPhone.trim(), loginPassword.trim() || '123456');
      if (res.success && res.user) {
        localStorage.setItem('desa_mandiri_citizen', JSON.stringify(res.user));
        onLoginSuccess(res.user);
        onClose();
      } else {
        setError(res.message || 'Gagal masuk akun');
      }
    } catch (err: any) {
      setError(err?.message || 'Nomor HP tidak terdaftar atau kata sandi keliru.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) {
      setError('Mohon lengkapi Nama Lengkap dan Nomor WhatsApp');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.citizenRegister({
        name: regName.trim(),
        phone: regPhone.trim(),
        dusun: regDusun,
        rtRw: regRtRw.trim() || undefined,
        password: regPassword.trim() || '123456',
      });

      if (res.success && res.user) {
        localStorage.setItem('desa_mandiri_citizen', JSON.stringify(res.user));
        onLoginSuccess(res.user);
        onClose();
      } else {
        setError(res.message || 'Pendaftaran gagal');
      }
    } catch (err: any) {
      setError(err?.message || 'Nomor HP sudah terdaftar. Silakan gunakan tab Masuk.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (account: CitizenUser) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.citizenLogin(account.phone, '123456');
      if (res.success && res.user) {
        localStorage.setItem('desa_mandiri_citizen', JSON.stringify(res.user));
        onLoginSuccess(res.user);
        onClose();
      } else {
        // Fallback to direct account
        localStorage.setItem('desa_mandiri_citizen', JSON.stringify(account));
        onLoginSuccess(account);
        onClose();
      }
    } catch (_) {
      localStorage.setItem('desa_mandiri_citizen', JSON.stringify(account));
      onLoginSuccess(account);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[65] overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
            <span className="material-symbols-outlined text-[24px]">verified_user</span>
          </div>
          <div>
            <h3 className="font-headline text-lg sm:text-xl font-bold text-slate-900 leading-tight">
              Akun Warga Desa
            </h3>
            <p className="text-xs text-slate-500">
              Hak kelola dan hapus laporan hanya untuk pemilik akun.
            </p>
          </div>
        </div>

        {/* Notice Banner if triggered by prompt */}
        {promptMessage && (
          <div className="mb-4 p-3 bg-amber-50 text-amber-900 text-xs rounded-xl border border-amber-200 flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] text-amber-600 shrink-0 mt-0.5">info</span>
            <div className="leading-relaxed">
              {promptMessage}
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-rose-600 shrink-0">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
          <button
            type="button"
            onClick={() => { setTab('login'); setError(null); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setError(null); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              tab === 'register'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daftar Baru
          </button>
          <button
            type="button"
            onClick={() => { setTab('demo'); setError(null); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              tab === 'demo'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            ⚡ Akun Demo
          </button>
        </div>

        {/* TAB 1: LOGIN */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Nomor WhatsApp / HP
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                  smartphone
                </span>
                <input
                  type="tel"
                  required
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  placeholder="Contoh: 0812-3456-7890"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                  PIN / Kata Sandi
                </label>
                <span className="text-[11px] text-slate-400">Default: 123456</span>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                  key
                </span>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Masukkan PIN / Sandi (default: 123456)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  <span>Masuk Akun Warga</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-500">
                Belum terdaftar?{' '}
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className="text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  Daftar Warga Baru
                </button>
                {' '}atau gunakan{' '}
                <button
                  type="button"
                  onClick={() => setTab('demo')}
                  className="text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  Akun Demo
                </button>
              </span>
            </div>
          </form>
        )}

        {/* TAB 2: REGISTER */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Contoh: Siti Rahmawati"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                Nomor WhatsApp / HP
              </label>
              <input
                type="tel"
                required
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                placeholder="Contoh: 0812-3456-7890"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Wilayah Dusun
                </label>
                <select
                  value={regDusun}
                  onChange={(e) => setRegDusun(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                >
                  {VILLAGE_DUSUNS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  RT / RW
                </label>
                <input
                  type="text"
                  value={regRtRw}
                  onChange={(e) => setRegRtRw(e.target.value)}
                  placeholder="RT 03 / RW 02"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                PIN / Sandi Pengaman (Opsional)
              </label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Buat 6 digit PIN (default: 123456)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                  <span>Mendaftarkan...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                  <span>Daftar Akun Warga</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 3: DEMO ACCOUNTS (1-CLICK TEST) */}
        {tab === 'demo' && (
          <div className="space-y-2.5">
            <p className="text-xs text-slate-600 mb-2">
              Pilih akun warga di bawah untuk menguji hak akses edit dan hapus laporan:
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {demoAccounts.map((account) => (
                <div
                  key={account.id || account.phone}
                  onClick={() => handleQuickDemoLogin(account)}
                  className="p-3 bg-slate-50 hover:bg-emerald-50 rounded-xl border border-slate-200 hover:border-emerald-400 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-slate-900 group-hover:text-emerald-800">
                        {account.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">
                        {account.phone}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      📍 {account.dusun} {account.rtRw ? `(${account.rtRw})` : ''}
                    </p>
                    {account.role && (
                      <p className="text-[10px] text-emerald-700 font-medium">
                        {account.role}
                      </p>
                    )}
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-700 text-white text-[11px] font-bold shadow-2xs group-hover:bg-emerald-800 transition-colors shrink-0">
                    <span>Pilih</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
