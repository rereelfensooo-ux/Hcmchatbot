# HCM FAQ Bot

## Pembagian tugas 3 layanan ini

- **GitHub** — nyimpen source code, tempat kamu `git push`
- **Netlify** — hosting & publish website (connect ke GitHub, auto-deploy
  tiap push). Sekarang murni static hosting, gak ada function lagi.
- **Supabase** — database (tabel FAQ & kontak) + login admin. React app
  nembak langsung ke Supabase, gak lewat Netlify sama sekali.

Struktur file:

```
hcm-faq-bot/
├── package.json
├── vite.config.js
├── netlify.toml
├── index.html
├── .env.example           # contoh isi .env, copy jadi .env buat lokal
├── .gitignore              # .env gak ikut ke-commit ke GitHub
├── supabase-setup.sql      # jalanin ini di Supabase SQL Editor
└── src/
    ├── main.jsx
    ├── App.jsx              # router: "/" vs "/admin"
    ├── supabaseClient.js    # koneksi ke Supabase
    ├── faqData.js            # semua fungsi baca/tulis data
    ├── styles.css
    └── pages/
        ├── ChatPage.jsx      # halaman PUBLIK
        └── AdminPage.jsx     # halaman admin, login pakai Supabase Auth
```

## Setup Supabase (sekali di awal)

1. Daftar/login di supabase.com → "New project"
2. Buka menu **SQL Editor** → New query → copy-paste seluruh isi
   `supabase-setup.sql` → Run. Ini bakal bikin tabel `faqs`, `contact`,
   isi data awal, dan pasang security rules-nya sekalian.
3. Buka menu **Authentication** → Users → "Add user" → bikin akun buat
   kamu sendiri (email + password), ini yang dipakai buat login ke
   `/admin` nantinya.
4. Buka menu **Project Settings** → API → copy dua value ini:
   - `Project URL`
   - `anon public` key

## Setup lokal (sebelum push)

```
npm install
cp .env.example .env
```

Buka `.env`, isi dengan URL & anon key dari Supabase tadi. Lalu:

```
npm run dev
```

Halaman publik di `/`, admin di `/admin` — login pakai email/password
yang kamu bikin di step Authentication tadi.

## Panduan Release (GitHub → Netlify)

1. **Push ke GitHub** (`.env` otomatis gak ikut ke-push, aman)
   ```
   git init
   git add .
   git commit -m "Initial commit - HCM FAQ Bot"
   git branch -M main
   git remote add origin <url-repo-github-kamu>
   git push -u origin main
   ```

2. **Connect ke Netlify**
   - Login ke app.netlify.com → "Add new site" → "Import an existing
     project" → pilih repo ini
   - Build command: `npm run build`, publish directory: `dist`
     (otomatis kedetect dari `netlify.toml`)

3. **Set environment variables di Netlify** — ini WAJIB, kalau kelewat
   halaman bakal blank/error:
   - Site settings → Environment variables → tambahin `VITE_SUPABASE_URL`
     dan `VITE_SUPABASE_ANON_KEY`, isi sama persis kayak di `.env` lokal

4. Klik **Deploy**

5. **Cek hasil**
   - Halaman utama site kamu → harus muncul chat FAQ
   - `/admin` → login pakai akun Supabase yang tadi dibikin, coba
     tambah/edit FAQ, refresh halaman utama → perubahan kelihatan

6. Selanjutnya, tiap `git push` ke `main` = Netlify auto build & deploy
   ulang. Kalau nanti nambah admin lain, tinggal tambah user baru di
   Supabase Authentication — gak perlu ubah kode atau redeploy.

## Kenapa ini lebih hemat kredit Netlify

Gak ada Netlify Function yang jalan tiap kali orang buka chat atau admin
nyimpen data — itu semua sekarang langsung ke Supabase (kuota terpisah,
gratis sendiri). Netlify cuma kepake buat nge-serve file statis, jadi
kredit yang kepake cuma dari deploy & bandwidth.
