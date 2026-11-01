# WTM London 2026 – Information & Agent Registration

Website satu halaman:
- Tombol link (dibuka online, tanpa download) ke Google Drive:
  Fact Sheet, Video, Facilities, Package, Business card Yuni – Sales, Business card Monica – Marketing
- Form registrasi agent: Name, Position, Company Name, Email (wajib), WhatsApp Number (opsional) → otomatis masuk ke **Google Sheet**

## File
| File | Fungsi |
|---|---|
| `index.html` | Website-nya (semua HTML/CSS/JS dalam satu file) |
| `apps-script.gs` | Script Google untuk menyimpan data form ke Google Sheet |

## Setup (±10 menit)

### 1. Link Google Drive
Untuk masing-masing file (Fact Sheet, Video, Facilities, Package, kartu nama Yuni, kartu nama Monica):
klik kanan file → **Share** → General access: **Anyone with the link** (Viewer) → **Copy link**.

> Tips: supaya agent cuma bisa lihat (tanpa tombol download/print), buka file → Share → ikon gear → hilangkan centang **"Viewers and commenters can see the option to download, print, and copy"**.

### 2. Google Sheet untuk menampung data agent
1. Buat Google Sheet baru (misal: "WTM London 2026 – Agents").
2. Menu **Extensions → Apps Script**.
3. Hapus isi `Code.gs`, paste seluruh isi `apps-script.gs`, lalu **Save**.
4. Klik **Deploy → New deployment** → ikon gear → **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Klik **Deploy**, izinkan akses (Authorize), lalu **copy Web app URL** (`https://script.google.com/macros/s/.../exec`).

### 3. Isi konfigurasi di `index.html`
Cari bagian `EDIT THESE` di bagian bawah file:
```js
const CONFIG = {
  BRAND_NAME:      "Your Company Name",
  LINKS: [
    { icon: "📄", title: "Fact Sheet", desc: "...", url: "https://drive.google.com/..." },
    { icon: "🎬", title: "Video",      desc: "...", url: "https://drive.google.com/..." },
    // ...Facilities, Package, Yuni – Sales, Monica – Marketing
  ],
  SCRIPT_URL:      "https://script.google.com/macros/s/.../exec"
};
```

### 4. Online-kan dengan GitHub Pages (gratis)
1. Repo di GitHub → **Settings → Pages**.
2. Source: **Deploy from a branch**, pilih branch `main`, folder `/ (root)` → Save.
3. Setelah 1–2 menit website live di `https://<username>.github.io/<repo>/`.
4. Buat QR code dari link itu untuk dipajang di booth.

> Repo harus **public** untuk GitHub Pages gratis. Alternatif: drag & drop folder ke [Netlify Drop](https://app.netlify.com/drop).

## Tes
Buka website, isi form, submit → cek tab **Registrations** di Google Sheet. Baris baru harus muncul dengan timestamp.

> Kalau script diubah, harus **Deploy → Manage deployments → Edit → Version: New version** supaya perubahan aktif.
