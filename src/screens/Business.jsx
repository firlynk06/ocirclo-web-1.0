import { useRef, useState } from "react";
import AppHeader from "../components/AppHeader.jsx";
import Thumb from "../components/Thumb.jsx";
import { Store } from "../components/icons.jsx";
import { rp, daysLeftLabel, nameWithPack } from "../lib/format.js";
import { NEAR_EXPIRY_DAYS } from "../lib/derive.js";
import { useNav } from "../lib/nav.js";
import { SELLER_NAME } from "../lib/seller.js";

// Business Overview (Figma 44:245). Bagian bertanda "Data contoh" memang data ilustrasi (belum ada riwayat penjualan nyata).
const SALES = {
  today: { label: "Today", revenue: "Rp1.150.000", sold: "48", caption: "Pendapatan per sesi (juta Rp)", bars: [["Pagi", 0.3], ["Siang", 0.5], ["Sore", 0.25], ["Malam", 0.1]], delta: "+4,5%", vs: "vs kemarin · Rp1.100.000", note: "Pendapatan hari ini" },
  week: { label: "This Week", revenue: "Rp6.400.000", sold: "312", caption: "Pendapatan per hari (juta Rp)", bars: [["Sen", 0.7], ["Sel", 0.8], ["Rab", 0.7], ["Kam", 1.1], ["Jum", 1.0], ["Sab", 1.4], ["Min", 0.7]], delta: "+8,2%", vs: "vs minggu lalu · Rp5.920.000", note: "Pendapatan minggu ini" },
  month: { label: "This Month", revenue: "Rp24.300.000", sold: "1.240", caption: "Pendapatan per minggu (juta Rp)", bars: [["M1", 4.8], ["M2", 5.4], ["M3", 6.3], ["M4", 7.8]], delta: "+12,5%", vs: "vs bulan lalu · Rp21.600.000", note: "Pendapatan bulan ini" },
};
const TOP = [["PRD001", 32], ["PRD003", 25], ["PRD002", 18]]; // [SKU, unit terjual] (contoh)
const dec = (n) => String(n).replace(".", ",");

function SubscriptionCard() {
  const [note, setNote] = useState(false);
  return (
    <div className="subcard">
      <div className="sub-head"><div><b>Subscription Status</b><span>Current plan details</span></div><i className="sub-free">FREE</i></div>
      <div className="sub-period"><span>Subscription Period</span>
        <div><b>1 Nov 2026 - 30 Nov 2026</b><i className="sub-active"><u />Active</i></div></div>
      <hr />
      <div className="sub-cta"><span>Manage your subscription</span><button onClick={() => setNote(true)}>Update Status →</button></div>
      <button className="sub-bill" onClick={() => setNote(true)}>Billing History</button>
      {note && <p className="sub-note">Subscription pages are coming in the next step of this demo.</p>}
    </div>
  );
}

function StatCards({ stats, products, rows }) {
  const box = useRef(null), track = useRef(null);
  const drag = useRef(null);
  const [pos, setPos] = useState(0);
  const [grab, setGrab] = useState(false);
  const outOfStock = products.filter((p) => p.stok_tersedia <= 0).length;
  // "New Arrivals": belum ada data tanggal masuk barang; sementara = produk dengan sisa umur simpan >= 45 hari (stok baru).
  const fresh = rows.filter((r) => r.q.status !== "expired" && r.days >= 45).length;
  const cards = [
    ["Near Expiry", "Produk mendekati kedaluwarsa", stats.nearExpiry],
    ["Total Products", "Produk terdaftar", stats.total.toLocaleString("id-ID")],
    ["New Arrivals", "Produk terbaru masuk", fresh],
    ["Out of Stock", "Produk habis stok", outOfStock],
  ];

  const sync = () => { const el = box.current; setPos(el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth)); };
  // Geser dengan mouse (di HP/touchpad geser jari bekerja bawaan browser).
  const down = (e) => { if (e.pointerType !== "mouse") return; drag.current = { x: e.clientX, left: box.current.scrollLeft, moved: false }; setGrab(true); e.currentTarget.setPointerCapture(e.pointerId); };
  const move = (e) => { const d = drag.current; if (!d) return; const dx = e.clientX - d.x; if (Math.abs(dx) > 3) d.moved = true; box.current.scrollLeft = d.left - dx; };
  const up = () => { drag.current = null; setGrab(false); };
  // Bilah di bawah: klik atau seret untuk menggeser.
  const fromTrack = (e) => {
    const r = track.current.getBoundingClientRect(), el = box.current;
    const f = Math.min(1, Math.max(0, (e.clientX - r.left - 44) / (r.width - 88)));
    el.scrollLeft = f * (el.scrollWidth - el.clientWidth);
  };
  const tdown = (e) => { e.currentTarget.setPointerCapture(e.pointerId); fromTrack(e); drag.current = { track: true }; };
  const tmove = (e) => { if (drag.current?.track) fromTrack(e); };
  const key = (e) => { const el = box.current; if (e.key === "ArrowRight") el.scrollBy({ left: 180, behavior: "smooth" }); if (e.key === "ArrowLeft") el.scrollBy({ left: -180, behavior: "smooth" }); };

  return (
    <section className="band">
      <div ref={box} className={"cards" + (grab ? " grab" : "")} tabIndex={0} role="group" aria-label="Business statistics, scroll sideways"
           onScroll={sync} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onKeyDown={key}>
        {cards.map(([t, sub, v]) => (
          <div key={t} className="scard">
            <span className="sico"><Store size={25} color="#a21942" sw={1.7} /></span>
            <b className="st">{t}</b><span className="ss">{sub}</span>
            <b className="sv">{v}</b>
          </div>
        ))}
      </div>
      <div ref={track} className="track" onPointerDown={tdown} onPointerMove={tmove} onPointerUp={up} onPointerCancel={up}><i style={{ left: `calc(${pos} * (100% - 88px))` }} /></div>
    </section>
  );
}

function SalesCard() {
  const [tab, setTab] = useState("month");
  const d = SALES[tab];
  const max = Math.max(...d.bars.map(([, v]) => v));
  return (
    <section className="sales">
      <div className="sales-top"><b>Ringkasan Penjualan</b><span>Data contoh</span></div>
      <div className="stabs">{Object.entries(SALES).map(([id, s]) => <button key={id} className={tab === id ? "on" : ""} onClick={() => setTab(id)}>{s.label}</button>)}</div>
      <div className="skpi"><div><span>{d.note}</span><b>{d.revenue}</b></div><div><span>Produk terjual</span><b>{d.sold}</b></div></div>
      <p className="scap">{d.caption}</p>
      <div className="sbars">
        {d.bars.map(([l, v]) => (
          <div key={l} className="sbar"><em>{dec(v)}</em><i style={{ height: `${Math.max(6, (v / max) * 62.4)}px` }} /><span>{l}</span></div>
        ))}
      </div>
      <hr />
      <p className="sfoot"><b>{d.delta}</b><span>{d.vs}</span></p>
    </section>
  );
}

const Bar = ({ title, onAll }) => (
  <div className="gbar"><b>{title}</b><button onClick={onAll}>See All <i>→</i></button></div>
);

export default function Business({ rows, stats, products, orders, onOpenOrder }) {
  const { go } = useNav();
  const alerts = rows.filter((r) => r.q.status !== "expired" && r.days <= 30).sort((a, b) => a.days - b.days).slice(0, 2);
  const recent = orders.slice(0, 3);
  const bySku = Object.fromEntries(rows.map((r) => [r.p.product_id, r.p]));
  const top = TOP.filter(([k]) => bySku[k]).map(([k, u]) => ({ p: bySku[k], u }));
  const remaining = rows.reduce((s, r) => s + (r.q.status === "expired" ? 0 : r.p.stok_tersedia), 0);
  const perf = [["Products Sold", 128, "#a21942"], ["Remaining Stock", remaining, "#cd3a3a"], ["Near Expiry Products", stats.nearExpiry, "#f59e0b"]];
  const pmax = Math.max(...perf.map((x) => x[1]), 1);

  return (
    <div className="screen">
      <AppHeader />
      <div className="biz">
        <SubscriptionCard />
        <h1 className="b-title">Business Overview</h1>
        <p className="b-welcome">Welcome back, {SELLER_NAME}!</p>
        <StatCards stats={stats} products={products} rows={rows} />
        <SalesCard />

        <Bar title="Expiry Alerts" onAll={() => go("inventory")} />
        <div className="alerts">
          {alerts.length === 0 && <p className="empty">No products near expiry.</p>}
          {alerts.map((r) => {
            const off = Math.round(r.discount * 100);
            return (
              <div key={r.p.product_id} className="arow2">
                <Thumb className="arow2-img" id={r.p.product_id} nama={r.p.nama} />
                <div className="arow2-mid"><b>{nameWithPack(r.p)}</b><span className="stok">Stok : {r.p.stok_tersedia} Pcs</span></div>
                <div className="arow2-r"><span className="days">{daysLeftLabel(r.days)}</span><b>{off > 0 ? `${off}% Off` : "No discount"}</b></div>
              </div>
            );
          })}
        </div>

        <Bar title="Recent Orders" onAll={() => go("sellerorders")} />
        <div className="orders">
          {recent.map((o) => (
            <div key={o.id} className="orow" role="button" tabIndex={0} style={{ cursor: "pointer" }} onClick={() => { onOpenOrder(o.id); go("orderdetail"); }}>
              <span className="otag">{o.id}</span>
              <div className="omid"><b>{o.who} - {o.items.length} {o.items.length === 1 ? "Product" : "Products"}</b><span>Total orders</span></div>
              <div className="oright"><i className={o.status === "new" ? "new" : "conf"}>{o.status === "new" ? "New Order" : "Confirmed"}</i><span>detail →</span></div>
            </div>
          ))}
        </div>

        <div className="b-sec">
          <div className="b-sec-h"><b>Top Selling Products</b><span>Data contoh</span></div>
          <p className="b-sec-s">Produk dengan volume penjualan tertinggi</p>
          {top.map(({ p, u }, i) => (
            <div key={p.product_id} className="trow">
              <span className="rank">{i + 1}</span>
              <div className="tmid"><b>{nameWithPack(p)}</b><span>{u} unit terjual</span></div>
              <b className="trev">{rp(u * p.harga_normal)}</b>
            </div>
          ))}
        </div>

        <div className="b-sec perf">
          <b className="b-sec-t">Inventory Performance</b>
          <p className="b-sec-s">Status inventaris saat ini</p>
          {perf.map(([l, v, c]) => (
            <div key={l} className="prf"><div><span>{l}</span><b>{v}</b></div><div className="pbar"><i style={{ width: `${(v / pmax) * 100}%`, background: c }} /></div></div>
          ))}
        </div>
      </div>
    </div>
  );
}
