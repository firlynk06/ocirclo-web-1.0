import AppHeader from "../components/AppHeader.jsx";
import { useNav } from "../lib/nav.js";

// Recent Orders (Figma 218:2): daftar semua pesanan masuk.
export default function SellerOrders({ orders, onOpen }) {
  const { go } = useNav();
  return (
    <div className="screen">
      <AppHeader title="Recent Orders" />
      <div className="orders full">
        {orders.map((o) => (
          <button key={o.id} className="orow" onClick={() => { onOpen(o.id); go("orderdetail"); }}>
            <span className="otag">{o.id}</span>
            <div className="omid"><b>{o.who} - {o.items.length} {o.items.length === 1 ? "Product" : "Products"}</b><span>Total orders</span></div>
            <div className="oright"><i className={o.status === "new" ? "new" : "conf"}>{o.status === "new" ? "New Order" : "Confirmed"}</i><span>detail →</span></div>
          </button>
        ))}
      </div>
    </div>
  );
}
