import { quoteLot, addDays } from "./pricing.js";
import { fmtDate } from "./format.js";

export const NEAR_EXPIRY_DAYS = 7;   // "Near Expiry" = sisa <= 7 hari
export const LOW_STOCK_QTY = 5;      // "Low stock" = stok tersedia <= 5

export const suggestedOf = (q, p) =>
  q.status === "ok" ? q.options.find((o) => o.opsi === "seimbang").harga : p.harga_normal;

/** Harga awal yang sudah diterapkan penjual (anggap rekomendasi hari itu sudah diterapkan). */
export function seedApplied(products, cfg, day) {
  const today = addDays(cfg.tanggal_dasar, day);
  const out = {};
  for (const p of products) {
    const q = quoteLot(p, today, cfg);
    if (q.status === "ok") out[p.product_id] = suggestedOf(q, p);
  }
  return out;
}

/** Satu baris per produk: hasil engine, harga rekomendasi, harga yang sedang dipakai, dan diskonnya. */
export function buildRows(products, cfg, day, mode, applied) {
  const today = addDays(cfg.tanggal_dasar, day);
  return products.map((p) => {
    const q = quoteLot(p, today, cfg);
    const suggested = suggestedOf(q, p);
    const current = mode === "auto" && q.status === "ok" ? suggested : applied[p.product_id] ?? p.harga_normal;
    return { p, q, suggested, current, discount: 1 - current / p.harga_normal, days: q.daysLeft };
  });
}

export function buildStats(rows) {
  const live = rows.filter((r) => r.q.status !== "expired");
  const discounted = live.filter((r) => r.discount > 0.0005);
  const avg = discounted.length ? discounted.reduce((s, r) => s + r.discount, 0) / discounted.length : 0;
  return {
    total: rows.length,
    discounted: discounted.length,
    avgDiscount: avg,
    nearExpiry: live.filter((r) => r.days <= NEAR_EXPIRY_DAYS).length,
    lowStock: live.filter((r) => r.p.stok_tersedia <= LOW_STOCK_QTY).length,
  };
}

const dayLabel = (d, now, base) => (d === now ? "Today" : d === now - 1 ? "Yesterday" : fmtDate(addDays(base, d)));

/** Aktivitas harga terbaru. Mode otomatis: dari perubahan rekomendasi engine. Mode lain: dari harga yang diterapkan. */
export function buildActivity(products, cfg, day, mode, log) {
  const base = cfg.tanggal_dasar;
  if (mode === "auto") {
    const ev = [];
    for (let d = day; d > day - 3; d--) {
      for (const p of products) {
        const a = quoteLot(p, addDays(base, d), cfg), b = quoteLot(p, addDays(base, d - 1), cfg);
        if (a.status !== "ok" || b.status !== "ok") continue;
        const sa = suggestedOf(a, p), sb = suggestedOf(b, p);
        if (sa !== sb) ev.push({ p, day: d, pct: Math.round((1 - sa / p.harga_normal) * 100), label: dayLabel(d, day, base), verb: "Discount updated" });
      }
    }
    return ev.sort((x, y) => y.day - x.day || y.pct - x.pct).slice(0, 3);
  }
  const byId = Object.fromEntries(products.map((p) => [p.product_id, p]));
  return [...log].sort((x, y) => y.day - x.day || y.seq - x.seq).slice(0, 3)
    .map((e) => ({ p: byId[e.sku], day: e.day, pct: e.pct, label: dayLabel(e.day, day, base), verb: "Price applied" }));
}
