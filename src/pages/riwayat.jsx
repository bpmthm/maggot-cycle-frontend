import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Trash2, Loader2, CheckCircle } from 'lucide-react'; 
import axios from 'axios';

const Riwayat = () => {
  const [laporanList, setLaporanList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
    
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/waste`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setLaporanList(response.data.data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSelesai = async (id) => {
    if (!window.confirm("Selesai?")) return;
    try {
      const token = localStorage.getItem('token');
      // 👇 BACKTICK!
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/waste/${id}/status`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (error) { alert("Gagal update"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus?")) return;
    try {
      const token = localStorage.getItem('token');
      // 👇 BACKTICK!
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/waste/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setLaporanList(laporanList.filter(item => item.id !== id));
    } catch (error) { alert("Gagal hapus"); }
  };

  return (
    <div className="flex bg-[#F8F9FD] min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          {loading ? <p className="p-12 text-center">Loading...</p> : (
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr><th className="p-4">Tanggal</th><th className="p-4">Foto</th><th className="p-4">Berat</th><th className="p-4">Aksi</th></tr>
              </thead>
              <tbody>
                {laporanList.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-4">{new Date(item.created_at).toLocaleDateString()}</td>
                    <td className="p-4"><img src={item.foto_url} className="w-12 h-12 object-cover rounded" /></td>
                    <td className="p-4 font-bold">{item.berat} kg</td>
                    <td className="p-4 flex gap-2">
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500"><Trash2 size={18}/></button>
                      {item.status !== 'selesai' && <button onClick={() => handleSelesai(item.id)} className="text-blue-600 text-xs font-bold">Selesai</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Riwayat;