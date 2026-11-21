import { useMemo, useState } from "react";
import AppHeader from "../components/AppHeader.jsx";
import Thumb from "../components/Thumb.jsx";
import { Search } from "../components/icons.jsx";
import { rpFull, daysLeftLabel, nameWithPack } from "../lib/format.js";
import { NEAR_EXPIRY_DAYS, LOW_STOCK_QTY } from "../lib/derive.js";
import { useNav } from "../lib/nav.js";

const FILTERS = [
  { id: "all", label: "All Product" },
  { id: "near", label: "Near Expiry" },
  { id: "low", label: "Low stock" },
];

export default function Inventory({ rows, stats, filter, onFilter, onOpenProduct }) {
  const { go } = useNav();
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows
      .filter((r) => {
        if (filter === "near" && !(r.q.status !== "expired" && r.days <= NEAR_EXPIRY_DAYS)) return false;
        if (filter === "low" && !(r.q.status !== "expired" && r.p.stok_tersedia <= LOW_STOCK_QTY)) return false;
        if (!q) return true;
        return [r.p.nama, r.p.brand ?? "", r.p.product_id, r.p.toko].some((t) => t.toLowerCase().includes(q));
      })
      .sort((a, b) => (a.q.status === "expired") - (b.q.status === "expired") || a.days - b.days);
  }, [rows, filter, query]);

  const fmt = (n) => n.toLocaleString("id-ID");

  return (
    <div className="screen">
      <AppHeader />
      <div className="inv">
        <h1 className="h-title">Inventory Management</h1>
        <p className="h-sub">Manage your products and stock.</p>

        <div className="stat3">
          <div className="stat s-maroon"><b>{fmt(stats.total)}</b><span>Products</span></div>
          <div className="stat s-lime"><b>{fmt(stats.lowStock)}</b><span>Low stock</span></div>
          <div className="stat s-green"><b>{fmt(stats.nearExpiry)}</b><span>Near Expiry</span></div>
        </div>

        <label className="search">
          <Search size={16} color="#444" />
          <input placeholder="Search products..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>

        <div className="chips">
          {FILTERS.map((f) => (
            <button key={f.id} className={"chip" + (filter === f.id ? " on" : "")} onClick={() => onFilter(f.id)}>{f.label}</button>
          ))}
        </div>

        <div className="list-head">
          <h2>Your Products</h2>
          <button className="add" onClick={() => go("pricing")}>+ Add product</button>
        </div>

        <div className="plist">
          {list.length === 0 && <p className="empty">No products match.</p>}
          {list.map((r) => {
            const off = Math.round(r.discount * 100);
            const expired = r.q.status === "expired";
            return (
              <div key={r.p.product_id} className="prow" onClick={() => onOpenProduct(r.p.product_id)} role="button" tabIndex={0}
                   onKeyDown={(e) => e.key === "Enter" && onOpenProduct(r.p.product_id)}>
                <Thumb className="prow-img" id={r.p.product_id} nama={r.p.nama} />
                <div className="prow-mid">
                  <div className="prow-name">{nameWithPack(r.p)}</div>
                  <div className="prow-price">{rpFull(r.current)}</div>
                  <span className="stok">Stok : {r.p.stok_tersedia} Pcs</span>
                </div>
                <div className="prow-right">
                  <span className={"days" + (expired ? " days-exp" : "")}>{daysLeftLabel(r.days)}</span>
                  <b className="off">{off > 0 ? `${off}% Off` : "No discount"}</b>
                  <span className="edit">Edit product</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
