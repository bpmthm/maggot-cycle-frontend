import React, { useState, useRef } from 'react';
import Sidebar from '../components/Sidebar'; // <--- UDAH BENER (S Besar)
import { Camera, Save, Loader2, Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const LaporSampah = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  
  // State buat nyimpen file aslinya
  const [imageFile, setImageFile] = useState(null); 
  
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    berat: '',
    jenis: 'organik',
    keterangan: ''
  });

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

  const triggerFileInput = () => fileInputRef.current.click();

  // FUNGSI SUBMIT (Versi Fix)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validasi Token Login
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Waduh, sesi habis. Login ulang dulu ya!");
        navigate('/login');
        return;
    }

    if (!imageFile) {
        alert("Mohon upload foto bukti sampah terlebih dahulu!");
        return;
    }

    setLoading(true);

    try {
      const dataKirim = new FormData();
      dataKirim.append('berat', formData.berat);
      dataKirim.append('jenis', formData.jenis);
      dataKirim.append('keterangan', formData.keterangan || "-");
      dataKirim.append('foto', imageFile); 

      // 2. TEMBAK API (Port 3000 Load Balancer)
      const response = await axios.post('http://localhost:3000/api/waste', dataKirim, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Bawa tiket masuk
        }
      });

      console.log("Response:", response.data);
      alert('Laporan berhasil dikirim & Notif WA OTW!');
      navigate('/riwayat');

    } catch (error) {
      console.error("Error lapor:", error);
      if (error.response && error.response.status === 401) {
          alert("Token expired, silakan login lagi.");
          localStorage.removeItem('token');
          navigate('/login');
      } else {
          alert('Gagal lapor bos. Cek koneksi backend/Docker.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[#F8F9FD] min-h-screen font-sans">
      <Sidebar /> {/* Komponen Sidebar */}
      
      <div className="flex-1 ml-64 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Input Laporan Baru</h1>
          <p className="text-gray-500">Masukkan data sampah dapur sebelum dijemput.</p>
        </header>

        <div className="max-w-4xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Kolom Kiri: Upload Foto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Foto Bukti Sampah *</label>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
              <div className="relative border-2 border-dashed border-gray-300 rounded-2xl h-80 bg-gray-50 overflow-hidden group transition-all hover:border-green-400">
                {preview ? (
                  <div className="relative w-full h-full">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                      <button type="button" onClick={triggerFileInput} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"><Edit size={18} /> Ubah</button>
                      <button type="button" onClick={handleRemoveImage} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"><Trash2 size={18} /> Hapus</button>
                    </div>
                  </div>
                ) : (
                  <div onClick={triggerFileInput} className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-gray-100 transition-colors">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Camera size={32} /></div>
                    <p className="text-gray-900 font-medium">Klik untuk ambil foto</p>
                  </div>
                )}
              </div>
            </div>

            {/* Kolom Kanan: Form Input */}
            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Berat Total (kg) *</label>
                <div className="relative">
                  <input type="number" step="0.1" placeholder="0.0" value={formData.berat} onChange={(e) => setFormData({...formData, berat: e.target.value})} className="w-full pl-4 pr-12 py-4 text-3xl font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all" required />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">Kg</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Sampah</label>
                <div className="grid grid-cols-2 gap-4">
                  <button type="button" onClick={() => setFormData({...formData, jenis: 'organik'})} className={`p-4 rounded-xl border text-center transition-all ${formData.jenis === 'organik' ? 'border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}><span className="block font-bold">🍃 Organik</span></button>
                  <button type="button" onClick={() => setFormData({...formData, jenis: 'anorganik'})} className={`p-4 rounded-xl border text-center transition-all ${formData.jenis === 'anorganik' ? 'border-orange-500 bg-orange-50 text-orange-700 ring-1 ring-orange-500' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}><span className="block font-bold">🥡 Anorganik</span></button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
                <textarea rows="3" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-sm" placeholder="Opsional..." value={formData.keterangan} onChange={(e) => setFormData({...formData, keterangan: e.target.value})}></textarea>
              </div>

              <div className="mt-auto">
                <button type="submit" disabled={loading} className="w-full bg-[#1C1C24] text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                  {loading ? <><Loader2 className="animate-spin" /> Menyimpan...</> : <><Save size={20} /> Simpan Laporan</>}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LaporSampah;