import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import LaporSampah from "./pages/lapor_sampah";
import Riwayat from "./pages/riwayat";
import Pengaturan from "./pages/pengaturan";
import Login from "./pages/login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route Login */}
        <Route path="/login" element={<Login />} />

        {/* Route Aplikasi Utama */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/lapor" element={<LaporSampah />} />
        <Route path="/riwayat" element={<Riwayat />} />
        <Route path="/pengaturan" element={<Pengaturan />} />
      </Routes>
    </BrowserRouter>
  );
}