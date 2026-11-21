import AppHeader from "../components/AppHeader.jsx";
import Thumb from "../components/Thumb.jsx";
import { rpFull } from "../lib/format.js";
import { orderTotal } from "../lib/sellerOrders.js";
import { useNav } from "../lib/nav.js";

// Order Details (Figma 218:175)
export default function OrderDetail({ order, onConfirm }) {
  const { go } = useNav();
  if (!order) return <div className="screen"><AppHeader title="Order" /><p className="empty">Pilih pesanan dari Recent Orders.</p></div>;
  const pending = order.status === "new";
  const Row = ({ k, v }) => <div className="od-row"><span>{k}</span><span>{v}</span></div>;
  return (
    <div className="screen">
      <AppHeader title={order.id} />
      <h1 className="od-title">Order Details - {order.id}</h1>
      <section className="od-card">
        <div className="od-status"><span>Order Status</span><i className={pending ? "pend" : "done"}>{pending ? "Pending" : "Confirmed"}</i></div>
        <div className="od-sec">
          <h3>Customer Information</h3>
          <b className="od-name">{order.who}</b>
          <Row k="Alamat Pengiriman" v={order.address} />
          <Row k="Kontak pelanggan" v={order.phone} />
        </div>
        <div className="od-sec">
          <h3>Order Information</h3>
          <Row k="Order ID" v={order.ref} />
          <Row k="Order Date" v={order.date} />
          <Row k="Payment Status" v={order.payment} />
          <Row k="Seller" v={order.seller} />
        </div>
        <div className="od-sec">
          <h3>Order Information</h3>
          {order.items.map((it, i) => (
            <div key={i} className="od-item">
              <Thumb className="od-img" id={it.sku} nama={it.nama} />
              <div><b>{it.nama}{it.kemasan ? `, ${it.kemasan}` : ""}</b><span>x {it.qty}</span><em>{rpFull(it.price)}</em></div>
            </div>
          ))}
        </div>
        <div className="od-total"><b>Total Payment</b><b>{rpFull(orderTotal(order))}</b></div>
      </section>
      <div className="od-actions">
        <button className="btn-primary od-btn" disabled={!pending} onClick={onConfirm}>{pending ? "Confirm Order" : "Order Confirmed"}</button>
        <button className="od-btn od-out" onClick={() => go("sellerorders")}>Back to Orders</button>
      </div>
    </div>
  );
}
