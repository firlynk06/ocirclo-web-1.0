import AppHeader from "../components/AppHeader.jsx";
import { useNav } from "../lib/nav.js";

const CATS = [
  ["A", "Fresh & Bakery", "Vegetables, daily bread, cakes"],
  ["B", "Dairy & chilled", "Milk, sliced bread, eggs"],
  ["C", "Packaged food & drinks", "Noodles, snacks, drinks"],
  ["D", "Skincare & cosmetics", "Moisturizer, sunscreen, powder"],
];

export default function PricingRules({ cfg }) {
  const { mode, setMode } = useNav();
  const pct = (x) => `${Math.round(x * 100)}%`;
  return (
    <div className="screen">
      <AppHeader />
      <div className="dash">
        <h1 className="h-title">Pricing Rules</h1>
        <p className="h-sub2">How Ocirclo sets your discounts</p>

        <div className="rules-card">
          <h3>Pricing mode</h3>
          <p className="muted">Choose who decides when a price changes.</p>
          <div className="seg">
            <button className={mode === "recommendation" ? "on" : ""} onClick={() => setMode("recommendation")}>
              <b>Recommendation</b><span>You approve each suggested price</span>
            </button>
            <button className={mode === "auto" ? "on" : ""} onClick={() => setMode("auto")}>
              <b>Automatic</b><span>Prices follow the engine (Premium)</span>
            </button>
          </div>
        </div>

        <div className="rules-card">
          <h3>Discount windows</h3>
          <p className="muted">The discount starts when remaining shelf life enters the window and grows linearly.</p>
          <table className="rt">
            <thead><tr><th>Category</th><th>Starts</th><th>Max at</th></tr></thead>
            <tbody>
              {CATS.map(([k, n, ex]) => (
                <tr key={k}><td><b>{k} · {n}</b><br /><span className="muted">{ex}</span></td><td>{cfg.window[k][0]} days</td><td>{cfg.window[k][1]} days</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rules-card">
          <h3>Safeguards</h3>
          <div className="kv"><span>Maximum discount</span><b>{pct(cfg.d_max)}</b></div>
          <div className="kv"><span>Minimum price</span><b>{pct(cfg.min_price_pct)} of normal price</b></div>
          <div className="kv"><span>Demand adjustment</span><b>{cfg.factor[0]}x to {cfg.factor[1]}x</b></div>
          <p className="muted">Slow-selling stock gets a deeper discount, fast-selling stock a lighter one. The price never goes below your minimum.</p>
        </div>
      </div>
    </div>
  );
}
