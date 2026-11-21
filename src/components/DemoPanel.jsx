import { fmtDate } from "../lib/format.js";

const PRESETS = [[0, "Hari ini"], [3, "+3 hari"], [7, "+7 hari"], [14, "+14 hari"]];
const JUMPS = [["splash", "Splash"], ["signin", "Sign In"], ["choose", "Pilih akun"], ["business", "Seller (B2B)"], ["sellerorders", "Recent Orders"], ["waste", "Waste Recovery"], ["consumer", "Consumer (B2C)"]];

// Panel kontrol demo (BUKAN bagian desain Figma): loncat layar, pilih produk dan geser waktu.
export default function DemoPanel({ route, onJump, showSeller, showConsumer, orders = [], onAdvance, onResetConsumer, products, selectedId, onSelect, geser, onGeser, today, onReset }) {
  const active = (id) => (id === "business" ? ["business", "dashboard", "inventory", "pricing", "rules", "sellerorders", "orderdetail", "waste", "wastesubmit"].includes(route) : id === "consumer" ? ["consumer", "explore", "product", "cart", "checkout", "success", "orders", "profile"].includes(route) : id === "signin" ? ["signin", "signup"].includes(route) : route === id);
  return (
    <aside className="demo">
      <div className="demo-tag">Panel demo</div>

      <label className="demo-label">Loncat ke layar</label>
      <div className="demo-btns wrap">
        {JUMPS.map(([id, label]) => (
          <button key={id} className={active(id) ? "on" : ""} onClick={() => onJump(id)}>{label}</button>
        ))}
      </div>

      {(showSeller || showConsumer) && (
        <>
          {showSeller && (<>
          <label className="demo-label">Produk (layar Pricing Recommendation)</label>
          <select value={selectedId} onChange={(e) => onSelect(e.target.value)}>
            {products.map((p) => (
              <option key={p.product_id} value={p.product_id}>{p.product_id} · {p.nama}</option>
            ))}
          </select></>)}

          <label className="demo-label">Time machine</label>
          <div className="demo-date">{fmtDate(today)} <b>(+{geser} hari)</b></div>
          <input type="range" min="0" max="60" value={geser} onChange={(e) => onGeser(Number(e.target.value))} />
          <div className="demo-btns wrap">
            {PRESETS.map(([d, label]) => (
              <button key={d} className={geser === d ? "on" : ""} onClick={() => onGeser(d)}>{label}</button>
            ))}
            <button onClick={() => onGeser(Math.min(60, geser + 1))}>+1</button>
          </div>
          {showSeller && <button className="demo-reset" onClick={onReset}>Reset harga &amp; aktivitas</button>}
          {showConsumer && (<>
            <button className="demo-reset" onClick={onAdvance} disabled={!orders.some((o) => o.c < 5)}>Majukan status pesanan →</button>
            <button className="demo-reset" onClick={onResetConsumer}>Reset keranjang &amp; pesanan</button>
          </>)}
          <p className="demo-hint">{showSeller
            ? "Geser waktu: harga rekomendasi, dashboard dan inventory ikut berubah. Pindah layar lewat menu ☰ di pojok kanan atas ponsel."
            : "Harga di sisi consumer mengikuti harga yang diterapkan seller. Pilih mode Automatic di Pricing Rules supaya harga ikut bergeser saat waktu digeser. Pembelian mengurangi stok seller."}</p>
        </>
      )}
      {!showSeller && <p className="demo-hint">Alur: Splash → Sign In (simulasi, isian apa pun diterima) → Pilih akun → Seller (B2B) atau Consumer (B2C).</p>}
    </aside>
  );
}
