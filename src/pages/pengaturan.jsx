import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { User, Save, LogOut, Bell, Loader2, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pengaturan = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // State Profile
  const [profile, setProfile] = useState({
    nama: 'Admin Dapur',
    email: 'admin@mbg-waste.com',
    role: 'Frontend Dev',
    notifikasi: true
  });

  useEffect(() => {
    // Coba ambil data user dari localStorage (biasanya disimpen pas Login)
    const savedProfile = JSON.parse(localStorage.getItem('user_info'));
    if (savedProfile) {
        setProfile(prev => ({ ...prev, ...savedProfile }));
    }
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulasi update profile (karena belum ada API update user)
    // Kita simpan ke localStorage biar seolah-olah berubah
    setTimeout(() => {
      localStorage.setItem('user_info', JSON.stringify(profile));
      setLoading(false);
      alert("Profil berhasil diperbarui!");
      // Opsional: Reload biar sidebar update nama
      window.location.reload(); 
    }, 1000);
  };

  const handleLogout = () => {
    if (window.confirm("Yakin mau keluar dari aplikasi?")) {
      // 1. Hapus Token
      localStorage.removeItem('token');
      localStorage.removeItem('user_info');
      
      // 2. Lempar ke Halaman Login
      navigate('/login');
    }
  };

  return (
    <div className="flex bg-[#F8F9FD] min-h-screen font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Pengaturan</h1>
          <p className="text-gray-500">Kelola preferensi akun dan keamanan.</p>
        </header>

        <div className="max-w-4xl space-y-6">
          
          {/* KARTU 1: EDIT PROFIL */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
              <User className="text-blue-500" size={24} />
              <div>
                <h2 className="font-bold text-gray-800">Profil Pengguna</h2>
                <p className="text-xs text-gray-400">Informasi ini akan tampil di Dashboard</p>
              </div>
            </div>
            
            <form onSubmit={handleSaveProfile} className="p-6 grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={profile.nama} 
                    onChange={(e) => setProfile({...profile, nama: e.target.value})} 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    value={profile.email} 
                    onChange={(e) => setProfile({...profile, email: e.target.value})} 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role / Jabatan</label>
                  <input 
                    type="text" 
                    value={profile.role} 
                    disabled
                    className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed" 
                  />
                </div>
              </div>

              {/* TOGGLE NOTIFIKASI */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg text-blue-500"><Bell size={20} /></div>
                    <div>
                        <p className="font-bold text-gray-700 text-sm">Notifikasi Email</p>
                        <p className="text-xs text-gray-500">Terima email saat sampah berhasil dijemput</p>
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={profile.notifikasi} 
                    onChange={(e) => setProfile({...profile, notifikasi: e.target.checked})} 
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              <div className="flex justify-end">
                <button type="submit" disabled={loading} className="px-6 py-3 bg-[#1C1C24] text-white rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center gap-2">
                   {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Simpan Perubahan
                </button>
              </div>
            </form>
          </div>

          {/* KARTU 2: LOGOUT / DANGER ZONE */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
              <Shield className="text-red-500" size={24} />
              <h2 className="font-bold text-gray-800">Sesi & Keamanan</h2>
            </div>
            <div className="p-6 flex items-center justify-between">
               <div className="max-w-md">
                   <p className="font-bold text-gray-700">Keluar Aplikasi</p>
                   <p className="text-sm text-gray-500 mt-1">Sesi Anda akan berakhir dan Anda harus login ulang untuk mengakses dashboard.</p>
               </div>
               <button 
                onClick={handleLogout} 
                className="px-6 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
               >
                <LogOut size={18} /> Logout
               </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Pengaturan;