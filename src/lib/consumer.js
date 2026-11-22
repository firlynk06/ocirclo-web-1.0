// Logika sisi consumer (B2C): kategori, badge, total, nomor pesanan, status pelacakan.
export const CONSUMER_NAME = "Green Basket"; // nama contoh dari Figma (belum ada profil sungguhan)
export const PLATFORM_FEE = 2500;
export const SHIPPING = { regular: { label: "Regular", eta: "30 - 45 mins", fee: 3000 }, pickup: { label: "Self-Pick-Up", eta: "Ready in 30 mins", fee: 0, was: 3000 } };
export const PAYMENTS = [["bank", "Bank Transfer"], ["ewallet", "E-Wallet"], ["qris", "QRIS"]];
export const STAGES = [
  ["Order Placed", "Your order has been successfully placed"],
  ["Payment Confirmed", "You have made a payment for your order"],
  ["Processing", "The seller is preparing your order"],
  ["Shipped", "Your order is on its way to you"],
  ["Delivered", "Waiting for delivery"],
];

// Kelompok kategori untuk chip di Explore. Ubah di sini kalau pengelompokannya mau lain.
const GROUP = {
  "Dairy & Minuman": "food", "Makanan Kemasan": "food",
  "Skincare & Kecantikan": "skin",
  "Bahan Pokok": "other", "Segar & Bakery": "other", "Perawatan Diri": "other",
};
export const groupOf = (p) => GROUP[p.kategori] ?? "other";
export const CATEGORY_CHIPS = [["all", "All"], ["food", "Food & Beverage"], ["skin", "Skincare"], ["other", "Other"]];

export const pctOff = (r) => Math.round(r.discount * 100);
export function badgeOf(r) {
  if (r.days <= 0) return "Expires Today";
  if (r.days === 1) return "Last Chance";
  if (r.days <= 7) return "Near Expiry";
  return pctOff(r) > 0 ? "Hot Deals" : null;
}
export const cityOf = (p) => (p.lokasi ?? "").split(",")[0];
export const expiryLine = (r, fmt) => (r.days <= 0 ? `Expires Today - ${fmt}` : `Expires in ${r.days} days - ${fmt}`);

export const DESCRIPTIONS = {
  PRD001: "Frisian Flag Family Full Cream Susu UHT hadir dengan rasa creamy dan lezat yang cocok untuk dinikmati bersama keluarga kapan saja. Kaya nutrisi, praktis dikemas, dan siap diminum tanpa ribet, susu ini mendukung asupan gizi harian agar momen bersama keluarga semakin hangat dan bernutrisi.",
};
export const descriptionOf = (p) =>
  DESCRIPTIONS[p.product_id] ??
  `${p.nama} (${p.kemasan}) dari ${p.toko}. Produk ini mendekati tanggal kedaluwarsa, jadi dijual dengan harga lebih murah. Kualitas tetap terjaga dan paling baik dinikmati dalam waktu dekat, sehingga tidak terbuang percuma.`;

export function totals(lines, shipping) {
  const subtotal = lines.reduce((s, l) => s + l.normal * l.qty, 0);
  const savings = lines.reduce((s, l) => s + (l.normal - l.price) * l.qty, 0);
  const ship = lines.length ? SHIPPING[shipping].fee : 0;
  const fee = lines.length ? PLATFORM_FEE : 0;
  return { subtotal, savings, ship, fee, total: subtotal - savings + ship + fee };
}

const pad = (n) => String(n).padStart(2, "0");
const hhmm = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
export function etaText(shipping, now = new Date()) {
  const a = new Date(now.getTime() + 30 * 60000), b = new Date(now.getTime() + 45 * 60000);
  return shipping === "pickup" ? `Ready for pick-up at ${hhmm(a)}` : `Today, ${hhmm(a)} - ${hhmm(b)}`;
}
export function newOrderId(n) {
  let x = (n + 7) * 2654435761 >>> 0, s = "";
  for (let i = 0; i < 7; i++) { s += "ABCDEFGHJKLMNPQRSTUVWXYZ"[x % 24]; x = Math.imul(x, 1664525) + 1013904223 >>> 0; }
  return `OCR${10284 + n}${s}`;
}
export const longDate = (iso) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
export const shortDate = (iso) => iso.split("-").reverse().join("/");
export const statusPill = (c) => (c >= 5 ? "Delivered" : c === 4 ? "In Transit" : "Processing");
export const greeting = (d = new Date()) => (d.getHours() < 11 ? "Good morning," : d.getHours() < 15 ? "Good afternoon," : d.getHours() < 18 ? "Good evening," : "Good evening,");
