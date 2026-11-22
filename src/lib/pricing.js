// Pricing engine Ocirclo (port dari Python, mengacu ke Lampiran 13 proposal).
// Semua parameter dibaca dari config.json, tidak ada angka yang tertulis mati di sini.

const DAY_MS = 86400000;

/** Selisih hari kalender antara dua tanggal 'YYYY-MM-DD' (dihitung lewat UTC agar bebas zona waktu). */
export function diffDays(isoA, isoB) {
  const [ya, ma, da] = isoA.split("-").map(Number);
  const [yb, mb, db] = isoB.split("-").map(Number);
  return Math.round((Date.UTC(ya, ma - 1, da) - Date.UTC(yb, mb - 1, db)) / DAY_MS);
}

export function addDays(iso, n) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d) + n * DAY_MS).toISOString().slice(0, 10);
}

/** Diskon dasar linear: 0 di luar jendela, Dmax di titik saturasi. */
export function baseDiscount(daysLeft, category, cfg) {
  const [T, ds] = cfg.window[category];
  if (daysLeft >= T) return 0;
  if (daysLeft <= ds) return cfg.d_max;
  return (cfg.d_max * (T - daysLeft)) / (T - ds);
}

/** Pengali 0,8-1,3. risk = stok / (laju jual x sisa hari); risk = 1 -> netral. */
export function demandFactor(stock, dailyRate, daysLeft, cfg) {
  const [fMin, fMax, coef] = cfg.factor;
  if (dailyRate <= 0 || daysLeft <= 0) return fMax;
  const risk = stock / (dailyRate * daysLeft);
  return Math.max(fMin, Math.min(fMax, fMin + coef * risk));
}

/** Bulatkan ke atas per Rp100 (toleransi 1e-6 agar tidak terpengaruh floating point). */
const ceil100 = (x) => Math.ceil(Math.round(x * 1e6) / 1e6 / 100) * 100;

/**
 * Hitung 3 opsi harga untuk satu produk pada tanggal tertentu.
 * p = objek produk dari products.json, today = 'YYYY-MM-DD'.
 */
export function quoteLot(p, today, cfg) {
  const daysLeft = diffDays(p.exp_date, today);
  if (cfg.non_dp.includes(p.product_id)) return { status: "no_dp", daysLeft, options: [] };
  if (daysLeft < 0) return { status: "expired", daysLeft, options: [] };

  const rate = p.stok_awal / cfg.rate_divisor;
  const d0 = baseDiscount(daysLeft, p.kategori_pricing, cfg) * demandFactor(p.stok_tersedia, rate, daysLeft, cfg);

  const options = Object.entries(cfg.option_mult).map(([name, mult]) => {
    const d = Math.min(cfg.d_max, d0 * mult);
    const raw = p.harga_normal * (1 - d);
    const price = raw <= p.harga_minimum + 1e-9 ? p.harga_minimum : ceil100(raw); // di lantai: tepat harga minimum
    return {
      opsi: name,
      harga: price,
      diskon: Math.round((1 - price / p.harga_normal) * 1000) / 1000,
      kenaBatasMin: raw < p.harga_minimum,
    };
  });
  return { status: "ok", daysLeft, options };
}
