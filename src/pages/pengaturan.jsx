import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { User, Save, Trash2, Bell, Info, Loader2 } from 'lucide-react';

const Pengaturan = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    nama: 'Admin Dapur',
    email: 'admin@mbg-waste.com',
    notifikasi: true
  });

  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem('user_profile'));
    if (savedProfile) setProfile(savedProfile);
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('user_profile', JSON.stringify(profile));
      setLoading(false);
      alert("Profil berhasil diperbarui!");
    }, 1000);
  };

  const handleResetData = () => {
    if (window.confirm("PERINGATAN: Apakah Anda yakin ingin menghapus SEMUA riwayat laporan?")) {
      localStorage.removeItem('waste_data');
      alert("Semua data berhasil dibersihkan.");
      window.location.reload();
    }
  };

  return (
    <div className="flex bg-[#F8F9FD] min-h-screen font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Pengaturan</h1>
          <p className="text-gray-500">Kelola preferensi akun dan data aplikasi.</p>
        </header>

        <div className="max-w-4xl space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
              <User className="text-blue-500" size={24} />
              <h2 className="font-bold text-gray-800">Profil Pengguna</h2>
            </div>
            <form onSubmit={handleSaveProfile} className="p-6 grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                  <input type="text" value={profile.nama} onChange={(e) => setProfile({...profile, nama: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={loading} className="px-6 py-3 bg-[#1C1C24] text-white rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center gap-2">
                   {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Simpan Perubahan
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
              <Trash2 className="text-red-500" size={24} />
              <h2 className="font-bold text-gray-800">Manajemen Data</h2>
            </div>
            <div className="p-6">
               <p className="text-gray-600 mb-4">Jika terjadi kesalahan data atau Anda ingin memulai ulang pengujian sistem, Anda dapat menghapus seluruh riwayat laporan sampah di sini.</p>
               <button onClick={handleResetData} className="px-6 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center gap-2"><Trash2 size={18} /> Hapus Semua Data Laporan</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pengaturan;