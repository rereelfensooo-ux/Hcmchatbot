import React from "react";
import ChatPage from "./pages/ChatPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";

// Routing sederhana tanpa library tambahan.
// - "/"        -> halaman publik, buat karyawan tanya FAQ
// - "/admin"   -> halaman terproteksi, buat tim HCM atur pertanyaan & jawaban
export default function App() {
  const path = window.location.pathname;

  if (path.startsWith("/admin")) {
    return <AdminPage />;
  }
  return <ChatPage />;
}
