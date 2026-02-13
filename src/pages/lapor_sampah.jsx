import React, { useState, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { Camera, Save, Loader2, Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const LaporSampah = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null); 
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({ berat: '', jenis: 'organik', keterangan: '' });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) { alert("Sesi habis!"); navigate('/login'); return; }
    if (!imageFile) { alert("Upload foto dulu!"); return; }

    setLoading(true);
    try {
      const dataKirim = new FormData();
      dataKirim.append('berat', formData.berat);
      dataKirim.append('jenis', formData.jenis);
      dataKirim.append('keterangan', formData.keterangan || "-");
      dataKirim.append('foto', imageFile); 

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/waste`, dataKirim, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      alert('Laporan berhasil!');
      navigate('/riwayat');
    } catch (error) {
      alert('Gagal lapor bos. Cek koneksi!');
    } finally { setLoading(false); }
  };

  return (
    <div className="flex bg-[#F8F9FD] min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <form onSubmit={handleSubmit} className="max-w-4xl bg-white p-8 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-8 shadow-sm">
          <div>
            <label className="block text-sm font-medium mb-2">Foto Bukti Sampah *</label>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
            <div className="border-2 border-dashed h-80 bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center cursor-pointer" onClick={() => fileInputRef.current.click()}>
              {preview ? <img src={preview} className="w-full h-full object-cover" /> : <Camera size={48} className="text-gray-300" />}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <input type="number" step="0.1" placeholder="Berat (kg)" value={formData.berat} onChange={(e) => setFormData({...formData, berat: e.target.value})} className="p-4 bg-gray-50 rounded-xl" required />
            <select value={formData.jenis} onChange={(e) => setFormData({...formData, jenis: e.target.value})} className="p-4 bg-gray-50 rounded-xl">
              <option value="organik">Organik</option>
              <option value="anorganik">Anorganik</option>
            </select>
            <button type="submit" disabled={loading} className="mt-auto bg-[#1C1C24] text-white p-4 rounded-xl font-bold">
              {loading ? "Menyimpan..." : "Simpan Laporan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LaporSampah;