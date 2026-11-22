import { useState } from "react";
import ConsumerHeader from "../../components/consumer/ConsumerHeader.jsx";
import ProductCard from "../../components/consumer/ProductCard.jsx";
import BottomNav from "../../components/consumer/BottomNav.jsx";
import { Search } from "../../components/icons.jsx";
import { useConsumer } from "../../lib/consumerCtx.js";
import { CONSUMER_NAME, greeting } from "../../lib/consumer.js";

const CATS = [["Groceries", "groceries", "other"], ["Food", "food", "food"], ["Personal Care", "personal-care", "skin"]];

export default function Home() {
  const { shop, exploreWith } = useConsumer();
  const [q, setQ] = useState("");
  // "Deals You'll Love": produk berdiskon yang paling dekat kedaluwarsa
  const deals = shop.filter((r) => r.discount > 0.0005).sort((a, b) => a.days - b.days || b.discount - a.discount).slice(0, 2);

  return (
    <div className="cscreen">
      <ConsumerHeader />
      <div className="cbody">
        <p className="greet">{greeting()}</p>
        <h1 className="hello">Hello, {CONSUMER_NAME}!</h1>

        <form className="csearch" onSubmit={(e) => { e.preventDefault(); exploreWith("all", q); }}>
          <Search size={26} color="#555" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find products at better prices. . ." aria-label="Search products" />
        </form>

        <div className="hero">
          <h2>Good Deals, Less Waste</h2>
          <p>Discover everyday essentials at better prices while giving products a second chance.</p>
          <button onClick={() => exploreWith("all")}>Explore Deals</button>
        </div>

        <h3 className="ctitle">Shop by Category</h3>
        <div className="cats">
          {CATS.map(([label, img, cat]) => (
            <button key={label} onClick={() => exploreWith(cat)}>
              <img src={`/assets/categories/${img}.png`} alt="" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <h3 className="ctitle">Deals You’ll Love</h3>
        {deals.length === 0 && <p className="cempty">No deals right now. Check back soon.</p>}
        <div className="pgrid">{deals.map((r) => <ProductCard key={r.p.product_id} r={r} />)}</div>
      </div>
      <BottomNav />
    </div>
  );
}
