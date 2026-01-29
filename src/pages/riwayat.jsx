import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Search, Filter, Trash2, Loader2 } from 'lucide-react';
import axios from 'axios'; // JANGAN LUPA: npm install axios

const Riwayat = () => {
  const [laporanList, setLaporanList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi buat format tanggal dari ISO String (Backend) ke format Indo
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

      // TEMBAK KE BACKEND (Port 3000)
      const response = await axios.get('http://localhost:3000/api/waste', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Simpan data dari backend ke state
      // response.data.data sesuai sama struktur JSON di main.go
      setLaporanList(response.data.data);

    } catch (error) {
      console.error("Gagal ambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Note: Fitur delete di backend main.go belum ada endpoint-nya.
  // Jadi sementara kita apus di tampilan aja ya (atau disable dulu).
  const handleDelete = (id) => {
    alert("Fitur hapus permanen dari server belum tersedia di Backend.");
  };

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
                    {/* <th className="p-4 text-center">Aksi</th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {laporanList.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        {/* Pake formatTanggal karena data backend formatnya ISO String */}
                        <div className="font-bold text-gray-800">{formatTanggal(item.created_at)}</div>
                        <div className="text-xs text-gray-400">{formatJam(item.created_at)} WIB</div>
                      </td>
                      <td className="p-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 border border-gray-200">
                           {/* Perhatikan: Backend pake 'foto_url', bukan 'foto' */}
                           <img src={item.foto_url} alt="Sampah" className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-4">
                         <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.jenis === 'organik' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{item.jenis.toUpperCase()}</span>
                      </td>
                      <td className="p-4 font-bold text-gray-800">{item.berat} kg</td>
                      <td className="p-4"><span className="flex items-center gap-2 text-yellow-600 font-medium"><span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>{item.status}</span></td>
                      {/* Tombol Hapus gue disable dulu karena backend belum support delete */}
                      {/* <td className="p-4 text-center">
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors" title="Hapus"><Trash2 size={18} /></button>
                      </td> 
                      */}
                      <td className="p-4 text-center">
                        {item.status === 'pending' ? (
                          <button onClick={() => handleSelesai(item.id)} 
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors border border-blue-200">Tandai Selesai</button>
                        ) : (<span className="text-green-600 font-bold text-xs">✅ Beres</span>)}
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