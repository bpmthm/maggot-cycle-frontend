import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import LaporSampah from "./pages/lapor_sampah";
import Riwayat from "./pages/riwayat";
import Pengaturan from "./pages/pengaturan";
import Login from "./pages/login";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// HAPUS BARIS INI: import Register ...

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- ROUTE PUBLIK --- */}
        <Route path="/login" element={<Login />} />
        
        {/* HAPUS BARIS INI: <Route path="/register" ... /> */}

        {/* --- ROUTE TERPROTEKSI --- */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/lapor" element={<ProtectedRoute><LaporSampah /></ProtectedRoute>} />
        <Route path="/riwayat" element={<ProtectedRoute><Riwayat /></ProtectedRoute>} />
        <Route path="/pengaturan" element={<ProtectedRoute><Pengaturan /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}