# Ocirclo Web (demo TGB 2026)

React + Vite. Data dari notebook Colab ada di `public/data/`.

## Menjalankan di laptop
1. Pasang **Node.js LTS** (https://nodejs.org), lalu cek: `node -v` (minimal 18).
2. Buka folder ini di VS Code, buka terminal, jalankan:
   ```
   npm install
   npm run dev
   ```
3. Buka http://localhost:5173 di browser. Perubahan kode langsung tampil.
4. Coba di HP (satu Wi-Fi): `npm run dev -- --host`, lalu buka alamat Network yang muncul.

## Alur demo
Splash -> Sign In / Sign Up (SIMULASI: isian apa pun diterima) -> Pilih akun -> **Seller (B2B)** atau **Consumer (B2C)**.
Menu ☰ di ponsel: pindah layar, ganti tipe akun, keluar. Panel demo di kiri punya tombol "Loncat ke layar" untuk presentasi.
Seller (B2B) mendarat di **Business Overview** (langganan, ringkasan penjualan, expiry alerts, recent orders); menu ☰ -> Dynamic Pricing untuk layar harga.
Sisi consumer (B2C): Home, Explore, Product Detail, Cart, Checkout, Order Placed, My Orders (+ Profile sederhana).
Harga consumer mengikuti harga yang diterapkan seller; pembelian mengurangi stok seller.
Panel demo (saat di sisi consumer): geser waktu, "Majukan status pesanan", reset keranjang & pesanan.

## Layar yang sudah ada
Pindah layar lewat menu ☰ di pojok kanan atas ponsel (alamat: `#/dashboard`, `#/inventory`, `#/pricing`, `#/rules`).
- **Dashboard** (Pricing Overview): metrik, grafik penjualan (data ilustrasi), produk perlu perhatian, aktivitas terbaru.
- **Inventory**: daftar produk, pencarian, filter All / Near Expiry / Low stock. Klik produk -> Pricing Recommendation.
- **Pricing Rules**: pilih mode Recommendation / Automatic, lihat jendela diskon dan pengaman.
- **Pricing Recommendation** (Figma 116:10). Panel demo di kiri: pilih produk dan geser time machine. Coba produk PRD001 lalu tekan **+3 hari**: layar sama dengan Figma (75% OFF, Rp5.250).
- Gambar logo dan foto produk: lihat `public/assets/README.txt`.

## Uji engine harga
`npm test` -> membandingkan engine JS dengan 1.420 kombinasi produk x hari dari Python.

## Build & cadangan offline untuk hari-H
```
npm run build
npm run preview
```
`preview` jalan tanpa internet (font sudah di-bundle). Siapkan juga rekaman layar demo.

## Deploy online (opsional)
Upload folder ke GitHub, lalu import ke Vercel atau Netlify (build: `npm run build`, output: `dist`).

## Memperbarui data
Jalankan ulang notebook Colab, ganti isi `public/data/` dengan JSON barunya.
