import { useEffect, useState } from "react";
import AppHeader from "../components/AppHeader.jsx";
import Thumb from "../components/Thumb.jsx";
import { useNav } from "../lib/nav.js";
import { rp, categoryLabel, expiryText } from "../lib/format.js";

const TrendingUp = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
  </svg>
);
const PackageIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" /><path d="m3.3 7.5 8.7 5 8.7-5" /><path d="M12 22V12.5" />
  </svg>
);

const pct = (d) => Math.round(d * 100);

export default function PricingRecommendation({ product: p, quote, currentPrice, onApplyPrice }) {
  const { mode } = useNav();
  const [manualOpen, setManualOpen] = useState(false);
  const [manualVal, setManualVal] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [dismissedKey, setDismissedKey] = useState(null);

  const key = `${p.product_id}:${quote.daysLeft}`;
  // reset keadaan lokal bila produk atau hari berubah
  useEffect(() => { setManualOpen(false); setError(""); setNotice(""); }, [key]);

  const d = quote.daysLeft;
  const tone = d <= 3 ? "red" : d <= 14 ? "amber" : "green";
  const pill = { red: "Near Expiry", amber: "Expiring Soon", green: "Good Shelf Life" }[tone];

  const header = (
    <>
      <div className="sec">
        <h3>Product Overview</h3>
        <div className="po">
          <Thumb className="pimg" id={p.product_id} nama={p.nama} />
          <div className="po-info">
            <div className="po-name">{p.nama}</div>
            <div className="po-sub">{categoryLabel(p.kategori)} · {p.product_id}</div>
            {quote.status !== "expired" && <span className={`pill pill-${tone}`}>{pill}</span>}
            <div className={`po-exp po-exp-${quote.status === "expired" ? "red" : tone}`}>{expiryText(d, p.stok_tersedia)}</div>
          </div>
        </div>
      </div>
      <hr />
    </>
  );

  // Produk tanpa rekomendasi: kedaluwarsa atau tidak ikut dynamic pricing
  if (quote.status !== "ok") {
    return (
      <div className="screen">
        <AppHeader title="Pricing Recommendation" />
        <div className="content">
          {header}
          <div className="sec">
            <h3>Pricing Recommendation</h3>
            <div className="pricebox">
              <p className="muted">
                {quote.status === "expired"
                  ? "This product has expired and can no longer be sold. Send it to the Waste Recovery Network."
                  : "This product is not using dynamic pricing, so no recommendation is shown. It keeps its normal price."}
              </p>
              <div className="row"><span className="muted">Normal Price</span><b>{rp(p.harga_normal)}</b></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const o = Object.fromEntries(quote.options.map((x) => [x.opsi, x]));
  const rec = o.seimbang;
  const suggested = rec.harga;
  const inSync = currentPrice === suggested;

  // Opsi alternatif. Saat harga sudah di lantai (diskon maks / harga minimum) opsi bisa sama -> dibuang.
  const alts = [];
  if (o.konservatif.harga !== rec.harga) alts.push({ role: "lower", label: "Lower discount", ...o.konservatif });
  alts.push({ role: "rec", label: "Recommended", ...rec });
  if (o.agresif.harga !== rec.harga) alts.push({ role: "higher", label: "Higher discount", ...o.agresif });

  const impact = rec.diskon >= 0.5 ? "Higher" : rec.diskon >= 0.2 ? "Moderate" : rec.diskon > 0 ? "Slight" : "None yet";
  const floorReached = rec.diskon >= 0.75 - 1e-9 || rec.harga <= p.harga_minimum;

  const apply = (price) => { onApplyPrice(price); setNotice(`Price updated to ${rp(price)}`); setManualOpen(false); setError(""); };
  const saveManual = () => {
    const v = Number(manualVal);
    if (!Number.isFinite(v) || v <= 0) return setError("Enter a valid price.");
    if (v < p.harga_minimum) return setError(`Minimum price is ${rp(p.harga_minimum)} (25% of normal price).`);
    if (v > p.harga_normal) return setError(`Price cannot exceed the normal price (${rp(p.harga_normal)}).`);
    apply(Math.round(v));
  };

  return (
    <div className="screen">
      <AppHeader title="Pricing Recommendation" />
      <div className="content">
        {header}

        <div className="sec">
          <h3>Pricing Recommendation</h3>
          <p className="muted">Suggested price based on remaining shelf life.</p>
          <div className="pricebox">
            <div className="row"><span className="muted">Current Selling Price</span><b className="cur">{rp(currentPrice)}</b></div>
            <div className="row"><span className="muted">Suggested Selling Price</span><b className="sug">{rp(suggested)}</b></div>
            <div className="sep" />
            <div className="row">
              <b className="t10">Recommended Discount</b>
              {rec.diskon > 0 ? <span className="pill pill-green lg">{pct(rec.diskon)}% OFF</span> : <span className="pill pill-gray lg">No discount yet</span>}
            </div>
            <div className="row t10">
              <span className="muted">Normal Price: {rp(p.harga_normal)}</span>
              <b className={inSync ? "ok" : "warn"}>{inSync ? "Harga saat ini sudah sesuai" : "Harga perlu diperbarui"}</b>
            </div>
          </div>
          {mode === "auto" && <p className="note">Automatic mode is on: this product's price follows the recommendation by itself.</p>}
        </div>
        <hr />

        <div className="sec">
          <h3>Expected Impact</h3>
          <p className="muted">Illustrative estimates if the recommendation is applied.</p>
          <div className="impact">
            <div className="ibox"><span className="iico"><TrendingUp /></span><div className="ititle">{impact}</div><div className="idesc">Potential purchase attractiveness</div></div>
            <div className="ibox"><span className="iico"><PackageIcon /></span><div className="ititle">{p.stok_tersedia} pcs</div><div className="idesc">Stock available for sale</div></div>
          </div>
        </div>
        <hr />

        <div className="sec">
          <h3>Alternative Pricing</h3>
          <p className="muted">Compare other available discount options.</p>
          {alts.map((a) => (
            <button key={a.role} className={"alt" + (a.role === "rec" ? " alt-rec" : "")} onClick={() => apply(a.harga)}>
              <div className="alt-l">
                <div className="alt-top">
                  <b>{a.diskon > 0 ? `${pct(a.diskon)}% OFF` : "No discount"}</b>
                  {a.role === "rec" && <span className="pill pill-green sm">Recommended</span>}
                </div>
                <span className="muted">{a.label}</span>
              </div>
              <b className="alt-p">{rp(a.harga)}</b>
            </button>
          ))}
          {alts.length === 1 && (
            <p className="note">{floorReached ? "Maximum discount (75%) / minimum price reached, so there are no other options." : "No discount needed yet. This product is outside its discount window."}</p>
          )}
        </div>

        <div className="actions">
          {dismissedKey === key ? (
            <button className="link" onClick={() => setDismissedKey(null)}>Recommendation dismissed · Show again</button>
          ) : (
            <>
              <button className="btn btn-primary" onClick={() => apply(suggested)}>Apply Recommendation</button>
              <button className="btn btn-outline" onClick={() => { setManualOpen((v) => !v); setManualVal(String(currentPrice)); setError(""); }}>Adjust Price Manually</button>
              {manualOpen && (
                <div className="manual">
                  <input type="number" step="100" inputMode="numeric" value={manualVal} onChange={(e) => setManualVal(e.target.value)} />
                  <button className="btn-save" onClick={saveManual}>Save</button>
                </div>
              )}
              {error && <p className="err">{error}</p>}
              {notice && <p className="okmsg">{notice}</p>}
              <button className="link" onClick={() => setDismissedKey(key)}>Dismiss Recommendation</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
