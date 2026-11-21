export const rp = (n) => "Rp" + Math.round(Number(n)).toLocaleString("id-ID");

// Label kategori mengikuti bahasa UI di Figma (Inggris).
const CATEGORY_EN = {
  "Dairy & Minuman": "Dairy & Beverage",
  "Makanan Kemasan": "Packaged Food",
  "Bahan Pokok": "Staples",
  "Segar & Bakery": "Fresh & Bakery",
  "Skincare & Kecantikan": "Skincare & Beauty",
  "Perawatan Diri": "Personal Care",
};
export const categoryLabel = (k) => CATEGORY_EN[k] ?? k;

export function expiryText(daysLeft, stock) {
  const d = daysLeft < 0 ? "Expired" : daysLeft === 0 ? "Expires today" : daysLeft === 1 ? "Expires in 1 day" : `Expires in ${daysLeft} days`;
  return `${d} · ${stock} pcs left`;
}

export const fmtDate = (iso) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

// ---- Tambahan untuk Dashboard & Inventory (format mengikuti Figma) ----
export const rpFull = (n) => "Rp. " + Number(n).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); // Rp. 12.900,00
export const rpShortM = (n) => "Rp" + (n / 1e6).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + "jt";                       // Rp2,4jt
export const daysLeftLabel = (d) => (d < 0 ? "Expired" : d === 0 ? "Expires today" : d === 1 ? "1 day left" : `${d} days left`);
export const nameWithPack = (p) => (p.kemasan ? `${p.nama}, ${p.kemasan.replace(/^(\d+) L$/, "$1L")}` : p.nama);           // Frisian Flag Full Cream, 1L
