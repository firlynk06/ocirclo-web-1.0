import AppHeader from "../components/AppHeader.jsx";
import Thumb from "../components/Thumb.jsx";
import { Tag, Percent, Wallet, Clock, AlertTriangle, Zap, Sliders, Box } from "../components/icons.jsx";
import { rp, rpShortM } from "../lib/format.js";
import { useNav } from "../lib/nav.js";

// Data penjualan ILUSTRASI (belum ada riwayat penjualan nyata). Jumlahnya Rp2,4 juta, sama dengan Figma.
const SALES = [["Mon", 250], ["Tue", 320], ["Wed", 280], ["Thu", 410], ["Fri", 380], ["Sat", 460], ["Sun", 300]];

function SalesChart() {
  const W = 375, H = 128, x0 = 40, step = 54.5, yTop = 22, yBase = 100, max = 500;
  const y = (v) => yBase - (v / max) * (yBase - yTop);
  const pts = SALES.map(([, v], i) => [x0 + i * step, y(v), v]);
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Discounted sales, last 7 days (illustrative)">
      {[0, 200, 400].map((g) => (
        <g key={g}>
          <line x1="30" x2="368" y1={y(g)} y2={y(g)} stroke="#e0e0e0" strokeWidth="1" />
          <text x="0" y={y(g) + 3} fontSize="7" fill="#999">{g === 0 ? "0" : `${g}k`}</text>
        </g>
      ))}
      <polyline points={pts.map(([x, yy]) => `${x},${yy}`).join(" ")} fill="none" stroke="#a21942" strokeWidth="1.6" strokeLinejoin="round" />
      {pts.map(([x, yy, v], i) => (
        <g key={i}>
          <circle cx={x} cy={yy} r="2.6" fill="#a21942" />
          <text x={x} y={yy - 7} fontSize="8" fill="#555" textAnchor="middle">{v}k</text>
          <text x={x} y={H - 6} fontSize="8" fill="#888" textAnchor="middle">{SALES[i][0]}</text>
        </g>
      ))}
    </svg>
  );
}

const Metric = ({ icon, value, label }) => (
  <div className="metric"><span className="m-ico">{icon}</span><div><b>{value}</b><span>{label}</span></div></div>
);

export default function Dashboard({ rows, stats, activity, onOpenProduct, onShowNear }) {
  const { go } = useNav();
  const salesTotal = SALES.reduce((s, [, v]) => s + v, 0) * 1000;

  const attention = rows
    .filter((r) => r.q.status !== "expired" && r.days <= 14)
    .sort((a, b) => a.days - b.days)
    .slice(0, 2);

  return (
    <div className="screen">
      <AppHeader />
      <div className="dash">
        <h1 className="h-title">Pricing Overview</h1>
        <p className="h-sub2">Your store's dynamic pricing at a glance</p>

        <div className="metrics">
          <Metric icon={<Tag size={22} color="#fff" />} value={stats.discounted} label="Discounted Products" />
          <Metric icon={<Percent size={22} color="#fff" />} value={`${Math.round(stats.avgDiscount * 100)}%`} label="Average Discount" />
          <Metric icon={<Wallet size={22} color="#fff" />} value={rpShortM(salesTotal)} label="Discounted Sales" />
          <Metric icon={<Clock size={22} color="#fff" />} value={stats.nearExpiry} label="Products Near Expiry" />
        </div>

        <div className="sp-head">
          <div><h3>Discounted Sales Performance</h3><p>Sales from discounted products</p></div>
          <span className="drop">Last 7 days ▾</span>
        </div>
        <SalesChart />
        <p className="sim">Illustrative sales data (demo). Real sales history comes after launch.</p>

        <div className="attn-bar">
          <span className="attn-t"><AlertTriangle size={10} color="#a21942" />Products Requiring Attention</span>
          <button className="lnk" onClick={onShowNear}>View All →</button>
        </div>
        <p className="attn-sub">Products approaching their expiry dates</p>
        {attention.length === 0 && <p className="empty">No products near expiry.</p>}
        {attention.map((r) => {
          const off = Math.round(r.discount * 100);
          const hot = r.days <= 3;
          return (
            <div key={r.p.product_id} className="acard" onClick={() => onOpenProduct(r.p.product_id)} role="button" tabIndex={0}>
              <Thumb className="acard-img" id={r.p.product_id} nama={r.p.nama} />
              <div className="acard-mid">
                <b>{r.p.nama}</b>
                <span>{r.p.stok_tersedia} pcs • Expires in <i className={hot ? "hot" : "warm"}>{r.days === 1 ? "1 day" : r.days === 0 ? "today" : `${r.days} days`}</i></span>
              </div>
              <div className="acard-right">
                <span className={"offpill" + (off > 0 ? "" : " none")}>{off > 0 ? `${off}% OFF` : "No discount"}</span>
                {off > 0 && <s>{rp(r.p.harga_normal)}</s>}
                <b>{rp(r.current)}</b>
              </div>
            </div>
          );
        })}

        <div className="rec-head">
          <h3>Recent Pricing Activity</h3>
          <button className="lnk" onClick={() => go("inventory")}>See All →</button>
        </div>
        <p className="attn-sub">Latest automatic price adjustments</p>
        {activity.length === 0 && <p className="empty">No price changes yet.</p>}
        {activity.map((a, i) => (
          <div key={a.p.product_id + i} className="arow">
            <Thumb className="arow-img" id={a.p.product_id} nama={a.p.nama} />
            <div className="arow-mid"><b>{a.p.nama}</b><span>{a.verb} • {a.label}</span></div>
            <span className="greenpill">{a.pct}% OFF</span>
          </div>
        ))}

        <div className="qa-head"><Zap size={16} color="#a21942" /><b>Quick Actions</b></div>
        <div className="qa">
          <button onClick={() => go("rules")}><Sliders size={16} color="#a21942" /><div><b>Pricing Rules</b><span>Manage discount rules</span></div><i>›</i></button>
          <button onClick={() => go("inventory")}><Box size={16} color="#a21942" /><div><b>Inventory</b><span>Manage products</span></div><i>›</i></button>
        </div>
      </div>
    </div>
  );
}
