import ConsumerHeader from "../../components/consumer/ConsumerHeader.jsx";
import ProductCard from "../../components/consumer/ProductCard.jsx";
import BottomNav from "../../components/consumer/BottomNav.jsx";
import { Search } from "../../components/icons.jsx";
import { useConsumer } from "../../lib/consumerCtx.js";
import { CATEGORY_CHIPS, groupOf } from "../../lib/consumer.js";

export default function Explore() {
  const { shop, query, setQuery, category, setCategory } = useConsumer();
  const q = query.trim().toLowerCase();
  const list = shop
    .filter((r) => category === "all" || groupOf(r.p) === category)
    .filter((r) => !q || [r.p.nama, r.p.brand ?? "", r.p.toko, r.p.kategori].some((t) => t.toLowerCase().includes(q)))
    .sort((a, b) => a.days - b.days);

  return (
    <div className="cscreen">
      <ConsumerHeader />
      <div className="cbody">
        <label className="csearch">
          <Search size={26} color="#555" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." aria-label="Search products" />
        </label>
        <div className="cchips">
          {CATEGORY_CHIPS.map(([id, label]) => (
            <button key={id} className={category === id ? "on" : ""} onClick={() => setCategory(id)}>{label}</button>
          ))}
        </div>
        {list.length === 0 && <p className="cempty">No products match your search.</p>}
        <div className="pgrid">{list.map((r) => <ProductCard key={r.p.product_id} r={r} />)}</div>
      </div>
      <BottomNav />
    </div>
  );
}
