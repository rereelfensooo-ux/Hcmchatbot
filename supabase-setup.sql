-- Jalanin script ini di Supabase Dashboard > SQL Editor > New query > Run.

-- 1. Tabel FAQ
create table faqs (
  id bigint generated always as identity primary key,
  category text not null,
  question text not null,
  answer text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2. Tabel kontak fallback (cuma 1 baris, id selalu 1)
create table contact (
  id int primary key default 1,
  name text not null,
  phone text not null,
  constraint single_row check (id = 1)
);

-- 3. Data awal
insert into faqs (category, question, answer) values
  ('Cuti', 'Gimana cara cek sisa cuti saya?', 'Sisa cuti tahunan bisa dicek di sistem HRIS menu ''Cuti Saya''. Pengajuan cuti minimal H-3 dan perlu approval atasan langsung ya.'),
  ('Tunjangan Kesehatan', 'Gimana cara klaim BPJS Kesehatan?', 'BPJS Kesehatan aktif otomatis sejak hari pertama kerja. Untuk klaim rawat jalan di luar faskes BPJS, ajukan reimbursement lewat form Tunjangan Kesehatan maks. 30 hari sejak tanggal berobat.'),
  ('THR', 'Kapan THR cair?', 'THR dibayarkan H-7 sebelum Hari Raya sesuai agama masing-masing, dan besarannya proporsional dengan masa kerja untuk karyawan di bawah 1 tahun.'),
  ('Jam Kerja', 'Jam kerja & aturan lembur gimana?', 'Jam kerja normal Senin-Jumat 08.00-17.00. Lembur harus ada approval atasan & diinput di sistem sebelum H+2 agar bisa diproses tunjangan lemburnya.');

insert into contact (id, name, phone) values (1, 'Tim HCM (Rere)', '0812-xxxx-xxxx');

-- 4. Row Level Security — INTI dari keamanannya.
-- Tanpa ini, siapapun yang tau URL Supabase kamu bisa baca/tulis bebas.
alter table faqs enable row level security;
alter table contact enable row level security;

-- Semua orang (termasuk yang belum login) boleh BACA faq yang aktif —
-- ini yang dipakai halaman chat publik.
create policy "public can read active faqs"
  on faqs for select
  to anon
  using (active = true);

create policy "public can read contact"
  on contact for select
  to anon
  using (true);

-- Cuma user yang SUDAH LOGIN (admin) yang boleh baca semua data
-- (termasuk yang non-aktif) dan boleh tambah/edit/hapus.
create policy "logged in users can do everything on faqs"
  on faqs for all
  to authenticated
  using (true)
  with check (true);

create policy "logged in users can update contact"
  on contact for all
  to authenticated
  using (true)
  with check (true);
