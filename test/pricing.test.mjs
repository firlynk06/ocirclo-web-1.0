import fs from "node:fs";
import { quoteLot, addDays } from "../src/lib/pricing.js";
const load = (f) => JSON.parse(fs.readFileSync(new URL(`../public/data/${f}`, import.meta.url)));
const cfg = load("config.json"), products = load("products.json"), ref = load("reference.json");

let n = 0; const bad = [];
for (const p of products) {
  for (const g of Object.keys(ref[p.product_id])) {
    const q = quoteLot(p, addDays(cfg.tanggal_dasar, Number(g)), cfg);
    const r = ref[p.product_id][g];
    n++;
    if (q.status !== r.status || JSON.stringify(q.options.map((o) => o.harga)) !== JSON.stringify(r.harga))
      bad.push({ id: p.product_id, g, js: q.options.map((o) => o.harga), py: r.harga, st: [q.status, r.status] });
  }
}
console.log(`Dicek ${n} kombinasi produk x hari. Beda: ${bad.length}`);
if (bad.length) { console.log(bad.slice(0, 5)); process.exit(1); }
