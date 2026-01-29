import React from 'react';
import { LayoutDashboard, Trash2, History, Settings, LogOut } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path) => location.pathname === path;

  // Fungsi Logout (Udah update: Hapus Token)
  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar aplikasi?")) {
      localStorage.removeItem('token'); // Hapus kunci akses biar beneran keluar
      navigate('/login');
    }
  };

  const NavItem = ({ to, icon, label }) => (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all no-underline ${
      isActive(to) ? 'bg-white text-[#1C1C24] shadow-sm' : 'text-gray-400 hover:bg-white/5 hover:text-white'
    }`}>
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );

  return (
    <div className="w-64 bg-[#1C1C24] flex flex-col h-screen fixed left-0 top-0 z-50">
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3 text-white mb-2">
        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center font-bold text-black">M</div>
        <span className="text-xl font-bold tracking-wide">Maggot Cycle</span>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 space-y-2">
        <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Overview" />
        <NavItem to="/lapor" icon={<Trash2 size={20} />} label="Lapor Sampah" />
        <NavItem to="/riwayat" icon={<History size={20} />} label="Riwayat" />
        <NavItem to="/pengaturan" icon={<Settings size={20} />} label="Pengaturan" />
      </nav>

      {/* Logout Button */}
      <div className="p-4 mb-4">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-400 hover:text-red-300 w-full px-4 py-3 hover:bg-white/5 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;