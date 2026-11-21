// Data pesanan sisi seller (Recent Orders). Pesanan dari consumer demo muncul paling atas;
// sisanya data contoh seperti di Figma (#CR-005 dst).
const FEE = 783;
const sample = (id, who, address, phone, date, items, status) => ({
  id, who, address, phone, date, items, status, payment: "Success", seller: "Toko Bahan Kue T.B.K, Skinca...",
  ref: "OCR10284CITSMND", fee: FEE, sample: true,
});
const FF = { sku: "PRD001", nama: "Frisian Flag Full Cream", kemasan: "1L", qty: 1, price: 5250 };
const EG = { sku: "TELUR", nama: "Telur Ayam Negeri", kemasan: "6 Buah", qty: 1, price: 5250 };
const SW = { sku: "PRD002", nama: "Sawi", kemasan: "500 gr", qty: 1, price: 5250 };

export const SAMPLE_ORDERS = [
  sample("#CR-005", "Mutiara", "Pondok Cina, Depok, Jawa Barat", "+6287882462087", "28 November 2026", [FF, EG], "new"),
  sample("#CR-004", "Firly", "Cipayung, Depok, Jawa Barat", "+6281234567890", "27 November 2026", [FF, EG, SW, FF, EG], "new"),
  sample("#CR-003", "Khailila", "Beji, Depok, Jawa Barat", "+6285711223344", "26 November 2026", [EG], "confirmed"),
  sample("#CR-002", "Mutiara", "Pondok Cina, Depok, Jawa Barat", "+6287882462087", "24 November 2026", [FF, EG], "confirmed"),
  sample("#CR-001", "Firly", "Cipayung, Depok, Jawa Barat", "+6281234567890", "22 November 2026", [SW, EG, FF], "confirmed"),
];

export const orderTotal = (o) => o.realTotal ?? o.items.reduce((s, i) => s + i.price * i.qty, 0) + (o.fee ?? 0);

// Gabungkan pesanan consumer (nyata) + contoh; `confirmed` = id yang sudah dikonfirmasi seller.
export function buildSellerOrders(consumerOrders, confirmed) {
  const n = SAMPLE_ORDERS.length;
  const real = consumerOrders.map((o, i) => ({
    id: `#CR-${String(n + consumerOrders.length - i).padStart(3, "0")}`, who: "Pembeli Demo", address: "Jl. Contoh No. 1, Jakarta",
    phone: "+6280000000000", date: o.date, payment: "Success", seller: "Green Basket", ref: o.id,
    items: o.items.map((x) => ({ sku: x.sku, nama: x.nama, kemasan: x.kemasan, qty: x.qty, price: x.price })), status: "new", realTotal: o.total,
  }));
  return [...real, ...SAMPLE_ORDERS].map((o) => ({ ...o, status: confirmed.includes(o.id) ? "confirmed" : o.status }));
}
