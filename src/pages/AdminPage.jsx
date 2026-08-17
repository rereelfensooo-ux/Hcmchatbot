import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";
import { getFaqs, getContact, upsertFaq, deleteFaq, toggleFaqActive, updateContact } from "../faqData.js";

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [contact, setContact] = useState({ name: "", phone: "" });
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ category: "", question: "", answer: "", active: true });

  // Cek status login begitu halaman dibuka, dan dengerin perubahan
  // (misal kalau logout dari tab lain).
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      getFaqs().then(setFaqs).catch(console.error);
      getContact().then(setContact).catch(console.error);
    }
  }, [session]);

  async function login() {
    setLoginError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setLoginError(error.message);
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  function resetForm() {
    setForm({ category: "", question: "", answer: "", active: true });
    setEditing(null);
  }

  async function saveFaq() {
    if (!form.category.trim() || !form.question.trim() || !form.answer.trim()) return;
    const payload = editing ? { ...form, id: editing } : form;
    await upsertFaq(payload);
    setFaqs(await getFaqs());
    resetForm();
  }

  function editFaq(item) {
    setEditing(item.id);
    setForm({ category: item.category, question: item.question, answer: item.answer, active: item.active });
  }

  async function removeFaq(id) {
    await deleteFaq(id);
    setFaqs(await getFaqs());
    if (editing === id) resetForm();
  }

  async function toggleActive(item) {
    await toggleFaqActive(item.id, !item.active);
    setFaqs(await getFaqs());
  }

  async function saveContact() {
    await updateContact(contact);
  }

  if (!session) {
    return (
      <div className="admin-lock">
        <h2>Admin HCM</h2>
        <p>Login pakai akun Supabase yang sudah didaftarkan tim HCM.</p>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()}
          placeholder="Password"
        />
        {loginError && <p style={{ color: "#E15A2B", fontSize: 13 }}>{loginError}</p>}
        <button onClick={login}>Masuk</button>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Atur FAQ</h2>
        <button onClick={logout} style={{ background: "transparent", color: "#516470", border: "1px solid #CBD5D9" }}>
          Logout
        </button>
      </div>

      <section className="panel">
        <h3>Kontak fallback</h3>
        <input
          value={contact.name || ""}
          onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
          placeholder="Nama"
        />
        <input
          value={contact.phone || ""}
          onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
          placeholder="No. WA"
        />
        <button onClick={saveContact}>Simpan kontak</button>
      </section>

      <section className="panel">
        <h3>Pesan chat</h3>
        <label className="field-label">Pesan pembuka (muncul pertama kali chat dibuka)</label>
        <textarea
          value={contact.welcome_message || ""}
          onChange={(e) => setContact((c) => ({ ...c, welcome_message: e.target.value }))}
          placeholder="Halo! Aku HCM Assistant Tatalogam..."
          rows={2}
        />
        <label className="field-label">Pesan penutup (muncul saat karyawan klik Akhiri chat)</label>
        <textarea
          value={contact.closing_message || ""}
          onChange={(e) => setContact((c) => ({ ...c, closing_message: e.target.value }))}
          placeholder="Terima kasih sudah menghubungi..."
          rows={2}
        />
        <button onClick={saveContact}>Simpan pesan</button>
      </section>

      <section className="panel">
        <h3>{editing ? "Edit FAQ" : "Tambah FAQ baru"}</h3>
        <input
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          placeholder="Kategori"
        />
        <input
          value={form.question}
          onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
          placeholder="Pertanyaan"
        />
        <textarea
          value={form.answer}
          onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
          placeholder="Jawaban"
          rows={3}
        />
        <div className="form-actions">
          <button onClick={saveFaq}>{editing ? "Simpan perubahan" : "Tambah FAQ"}</button>
          {editing && <button onClick={resetForm}>Batal</button>}
        </div>
      </section>

      <section className="panel">
        <h3>Daftar FAQ</h3>
        {faqs.map((item) => (
          <div key={item.id} className={`faq-row ${item.active ? "" : "inactive"}`}>
            <div>
              <div className="faq-category">{item.category}</div>
              <div className="faq-question">{item.question}</div>
              <div className="faq-answer">{item.answer}</div>
            </div>
            <div className="faq-actions">
              <button onClick={() => toggleActive(item)}>{item.active ? "Nonaktifkan" : "Aktifkan"}</button>
              <button onClick={() => editFaq(item)}>Edit</button>
              <button onClick={() => removeFaq(item.id)}>Hapus</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
