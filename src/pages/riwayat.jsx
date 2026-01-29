import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Search, Filter, Trash2, Loader2, CheckCircle } from 'lucide-react'; // Tambah icon CheckCircle
import axios from 'axios';

const Riwayat = () => {
  const [laporanList, setLaporanList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Format Tanggal
  const formatTanggal = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatJam = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('http://localhost:3000/api/waste', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setLaporanList(response.data.data);

    } catch (error) {
      console.error("Gagal ambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- INI FUNGSI YANG KEMAREN ILANG/MISSING ---
  const handleSelesai = async (id) => {

    console.log("Mau update ID:", id);
    // 1. Konfirmasi dulu biar ga kepencet
    if (!window.confirm("Yakin sampah ini udah diambil dan selesai?")) return;

    try {
      const token = localStorage.getItem('token');
      
      // 2. Tembak API Update Status (PUT)123qwe
      
      await axios.put(`http://localhost:3000/api/waste/${id}/status`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // 3. Refresh data biar statusnya berubah di layar
      await fetchData(); 
      alert("Mantap! Status berhasil diubah jadi Selesai.");

    } catch (error) {
      console.error("Gagal update:", error);
      alert("Gagal update status. Cek backend udah jalan belum?");
    }
  };
  // ---------------------------------------------

  return (
    <div className="flex bg-[#F8F9FD] min-h-screen font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Riwayat Penyetoran</h1>
            <p className="text-gray-500">Daftar semua laporan sampah yang masuk ke Database.</p>
          </div>
          <div className="flex gap-3">
             <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 flex items-center gap-2 hover:bg-gray-50"><Filter size={16} /> Filter Status</button>
             <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Cari..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500" />
             </div>
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
             <div className="p-12 flex justify-center text-gray-400 gap-2">
                <Loader2 className="animate-spin" /> Memuat data dari server...
             </div>
          ) : laporanList.length === 0 ? (
            <div className="p-12 text-center text-gray-400"><Trash2 size={48} className="mx-auto mb-4 opacity-20" /><p>Belum ada data laporan.</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-800 font-semibold border-b border-gray-100">
                  <tr>
                    <th className="p-4">Tanggal & Waktu</th>
                    <th className="p-4">Foto</th>
                    <th className="p-4">Jenis</th>
                    <th className="p-4">Berat</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {laporanList.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-gray-800">{formatTanggal(item.created_at)}</div>
                        <div className="text-xs text-gray-400">{formatJam(item.created_at)} WIB</div>
                      </td>
                      <td className="p-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 border border-gray-200">
                           <img src={item.foto_url} alt="Sampah" className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-4">
                         <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.jenis === 'organik' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{item.jenis.toUpperCase()}</span>
                      </td>
                      <td className="p-4 font-bold text-gray-800">{item.berat} kg</td>
                      <td className="p-4">
                        <span className={`flex items-center gap-2 font-medium ${item.status === 'selesai' ? 'text-green-600' : 'text-yellow-600'}`}>
                          <span className={`w-2 h-2 rounded-full ${item.status === 'selesai' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></span>
                          {item.status}
                        </span>
                      </td>
                      
                      {/* LOGIC TOMBOLNYA DI SINI */}
                      <td className="p-4 text-center">
                        {item.status !== 'selesai' ? (
                          <button 
                            onClick={() => handleSelesai(item.id)} 
                            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors border border-blue-200"
                          >
                            Tandai Selesai
                          </button>
                        ) : (
                          <span className="flex items-center justify-center gap-1 text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-lg">
                            <CheckCircle size={14}/> Beres
                          </span>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Riwayat;