import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import { Search, Bell, MoreHorizontal, ArrowUpRight } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBerat: 0,
    laporanBaru: 0,
    menungguJemput: 0,
    terolah: 0
  });

  useEffect(() => {
     const data = JSON.parse(localStorage.getItem('waste_data') || '[]');
     
     const total = data.reduce((acc, curr) => acc + (curr.berat || 0), 0);
     const menunggu = data.filter(item => item.status === 'Menunggu').length;
     let persentase = 0;
     if (data.length > 0) {
        persentase = 100 - ((menunggu / data.length) * 100);
     }

     setStats({
        totalBerat: total.toFixed(1),
        laporanBaru: data.length,
        menungguJemput: menunggu,
        terolah: persentase.toFixed(0)
     });
  }, []);

  const StatCard = ({ title, value, unit, trend, colorClass }) => (
    <div className={`p-6 rounded-2xl ${colorClass} relative overflow-hidden transition-transform hover:scale-[1.02]`}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-gray-600 font-medium text-sm">{title}</span>
        <button className="p-1 hover:bg-black/5 rounded-full"><MoreHorizontal size={16} className="text-gray-500" /></button>
      </div>
      <div className="flex items-end gap-2">
        <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
        <span className="text-sm text-gray-600 mb-1">{unit}</span>
      </div>
      <div className="mt-4 flex items-center gap-1 text-xs font-bold bg-white/40 w-fit px-2 py-1 rounded-lg">
        <ArrowUpRight size={14} />
        {trend} vs kemarin
      </div>
    </div>
  );

  return (
    <div className="flex bg-[#F8F9FD] min-h-screen font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4 bg-white p-3 rounded-xl shadow-sm border border-gray-100 w-96">
            <Search size={20} className="text-gray-400" />
            <input type="text" placeholder="Cari data laporan..." className="bg-transparent outline-none w-full text-sm text-gray-600" />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-500 hover:text-green-600 relative">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-3 bg-white pl-2 pr-4 py-1.5 rounded-xl shadow-sm border border-gray-100 cursor-pointer">
              <div className="w-9 h-9 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">A</div>
              <div className="text-sm">
                <p className="font-bold text-gray-700">Admin Dapur</p>
                <p className="text-xs text-gray-400">Frontend Dev</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Berat Sampah" value={stats.totalBerat} unit="kg" trend="+12%" colorClass="bg-[#E3DFFD]" />
          <StatCard title="Laporan Masuk" value={stats.laporanBaru} unit="items" trend="+5%" colorClass="bg-[#E0F2FE]" />
          <StatCard title="Menunggu Jemput" value={stats.menungguJemput} unit="pending" trend="Waspada" colorClass="bg-[#FEF9C3]" />
          <StatCard title="Berhasil Diolah" value={stats.terolah} unit="%" trend="Good" colorClass="bg-[#DCFCE7]" />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800 text-lg">Statistik Harian</h3>
              <div className="flex gap-2 text-xs">
                 <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">Organik</span>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-4 px-2">
               {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                 <div key={i} className="w-full bg-blue-50 rounded-t-lg relative group">
                    <div style={{ height: `${h}%` }} className="absolute bottom-0 w-full bg-gradient-to-t from-green-400 to-green-300 rounded-t-lg transition-all group-hover:from-green-500 group-hover:to-green-400"></div>
                 </div>
               ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-gray-400">
               <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Min</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg mb-6">Sumber Sampah</h3>
            <div className="space-y-6">
              {[{ name: "Dapur Sayur", val: "45%", color: "bg-green-500" }, { name: "Sisa Makanan", val: "30%", color: "bg-yellow-400" }].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">{item.name}</span>
                    <span className="text-gray-500">{item.val}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className={`${item.color} h-2.5 rounded-full`} style={{ width: item.val }}></div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/lapor" className="block w-full mt-8 py-3 bg-[#1C1C24] text-white rounded-xl font-medium hover:bg-gray-800 transition-colors text-center no-underline">
              + Input Data Baru
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;