import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import axios from 'axios'; // Pastiin udah npm install axios

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // State buat nampung input user
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Buat nangkep ketikan user
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Tembak API Login (Port 3000 = Load Balancer)
      // Endpoint ini sesuai sama router di main.go: api.Post("/login", Login)
      const response = await axios.post('http://localhost:3000/api/login', {
        email: formData.email,
        password: formData.password
      });

      // 2. Ambil token dari response backend
      const token = response.data.token;

      // 3. PENTING: Simpen token di "Dompet Browser" (LocalStorage)
      // Token ini nanti dipake "LaporSampah.jsx" buat izin upload
      localStorage.setItem('token', token);

      // 4. Kasih tau user & pindah halaman
      alert("Login Berhasil! Welcome back, Lutfi.");
      navigate('/'); 

    } catch (error) {
      console.error("Login Error:", error);
      
      // Cek kalo errornya dari backend (misal password salah)
      if (error.response) {
        alert(error.response.data.error || "Email atau Password salah!");
      } else if (error.request) {
        alert("Gagal konek ke server. Cek Docker/Podman lo, nyala gak?");
      } else {
        alert("Ada error aneh. Cek Console.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-green-200 shadow-xl">
            <span className="text-3xl font-bold text-white">M</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">MBG Waste System</h1>
          <p className="text-gray-500 mt-2">Masuk untuk mengelola laporan sampah dapur.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              name="email"
              placeholder="contoh: lutfi@maggot.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              name="password"
              placeholder="••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all" 
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-[#1C1C24] text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" /> Sedang Masuk...
              </>
            ) : (
              "Masuk Dashboard"
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center text-xs text-gray-400">
          &copy; 2026 MBG Waste Management System
        </div>
      </div>
    </div>
  );
};

export default Login;