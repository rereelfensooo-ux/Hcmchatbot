import { supabase } from "./supabaseClient.js";

// Ambil semua FAQ + data kontak. Dipanggil dari ChatPage (semua) dan
// AdminPage (semua, termasuk yang non-aktif).
export async function getFaqs() {
  const { data, error } = await supabase.from("faqs").select("*").order("id");
  if (error) throw error;
  return data;
}

export async function getContact() {
  const { data, error } = await supabase.from("contact").select("*").eq("id", 1).single();
  if (error) throw error;
  return data;
}

// Fungsi-fungsi di bawah ini cuma bisa sukses kalau user sudah login
// (dicek lewat Supabase Auth) — diatur oleh Row Level Security policy
// di database, bukan cuma di kode frontend. Lihat README bagian setup SQL.
export async function upsertFaq(faq) {
  const { error } = await supabase.from("faqs").upsert(faq);
  if (error) throw error;
}

export async function deleteFaq(id) {
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleFaqActive(id, active) {
  const { error } = await supabase.from("faqs").update({ active }).eq("id", id);
  if (error) throw error;
}

export async function updateContact(contact) {
  const { error } = await supabase.from("contact").update(contact).eq("id", 1);
  if (error) throw error;
}
