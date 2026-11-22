import { useState } from "react";
import ConsumerHeader from "../../components/consumer/ConsumerHeader.jsx";
import Thumb from "../../components/Thumb.jsx";
import { MapPin, Pencil, Clock, Check } from "../../components/icons.jsx";
import { useNav } from "../../lib/nav.js";
import { useConsumer } from "../../lib/consumerCtx.js";
import { rpFull, nameWithPack } from "../../lib/format.js";
import { pctOff, totals, SHIPPING, PAYMENTS } from "../../lib/consumer.js";

// Alamat contoh (belum ada manajemen alamat di demo).
const ADDRESS = { name: "Nama Penerima", phone: "(+62) 812-3456-7890", text: "Alamat lengkap alamat lengkap alamat lengkap alamat lengkap alamat lengkap alamat lengkap alamat lengkap alamat lengkap alamat lengkap alamat lengkap alamat lengkap" };

export default function Checkout() {
  const { go } = useNav();
  const { checkout, checkoutLines, shipping, setShipping, payment, setPayment, placeOrder } = useConsumer();
  const [all, setAll] = useState({});
  const back = () => go(checkout?.from === "buy" ? "product" : "cart");

  if (!checkoutLines.length) return (
    <div className="cscreen"><ConsumerHeader onBack={() => go("cart")} avatar={false} />
      <div className="cbody"><p className="cempty">Nothing to check out.</p><button className="pbtn-green wide" onClick={() => go("explore")}>Explore Deals</button></div></div>
  );

  const t = totals(checkoutLines, shipping);
  const stores = [...new Set(checkoutLines.map((l) => l.p.toko))];

  return (
    <div className="cscreen">
      <ConsumerHeader onBack={back} avatar={false} />
      <div className="cbody tight">
        <h1 className="ptitle center">Checkout</h1>

        <section className="ccard2">
          <div className="addr-top"><MapPin size={14} color="#a21942" fill="#a21942" /><b>{ADDRESS.name}</b><span>{ADDRESS.phone}</span></div>
          <p>{ADDRESS.text}</p>
          <button className="addr-edit" aria-label="Edit address"><Pencil size={16} color="#a21942" /></button>
        </section>

        {stores.map((s) => {
          const ls = checkoutLines.filter((l) => l.p.toko === s);
          const shown = all[s] ? ls : ls.slice(0, 1);
          return (
            <section key={s} className="ccard2">
              <div className="store-name">{s}</div>
              {shown.map((l) => (
                <div key={l.sku} className="oline">
                  <Thumb className="oline-img" id={l.sku} nama={l.p.nama} />
                  <div className="oline-mid">
                    <b>{nameWithPack(l.p)}</b>
                    <div className="cline-price"><b>{rpFull(l.price)}</b>{pctOff(l.r) > 0 && <><s>{rpFull(l.normal)}</s><span className="offtag">-{pctOff(l.r)}% OFF</span></>}</div>
                  </div>
                  <span className="oqty">x {l.qty}</span>
                </div>
              ))}
              {ls.length > 1 && <button className="seeall" onClick={() => setAll((a) => ({ ...a, [s]: !a[s] }))}>{all[s] ? "Show less" : `See all (${ls.length})`}</button>}
            </section>
          );
        })}

        <section className="ccard2">
          <div className="sec-head"><b>Shipping Method</b></div>
          {Object.entries(SHIPPING).map(([id, s]) => (
            <button key={id} className={"ship" + (shipping === id ? " on" : "")} onClick={() => setShipping(id)} aria-pressed={shipping === id}>
              {shipping === id && <span className="ship-check"><Check size={12} color="#fff" sw={3} /></span>}
              <div className="ship-l">
                {id === "regular" ? <b className="ship-eta"><Clock size={14} color="#a21942" /> {s.eta}</b> : <b>{s.eta}</b>}
                <span>{s.label}</span>
              </div>
              <div className="ship-r">{s.was && <s>{rpFull(s.was)}</s>} <b>{rpFull(s.fee)}</b></div>
            </button>
          ))}
        </section>

        <section className="ccard2">
          <div className="sec-head"><b>Payment Method</b></div>
          {PAYMENTS.map(([id, label]) => (
            <button key={id} className="pay" onClick={() => setPayment(id)} role="radio" aria-checked={payment === id}>
              <span>{label}</span><i className={payment === id ? "on" : ""}>{payment === id && <Check size={11} color="#fff" sw={3.5} />}</i>
            </button>
          ))}
          <p className="pay-logos"><b className="l-dana">DANA</b> <b className="l-bca">BCA</b> <b className="l-gopay">gopay</b> <em>+ Others</em></p>
        </section>

        <section className="ccard2">
          <div className="sec-head"><b>Order Summary</b></div>
          <div className="sumrow"><span>Subtotal</span><span>{rpFull(t.subtotal)}</span></div>
          <div className="sumrow"><span>Shipping Fee</span><span>{rpFull(t.ship)}</span></div>
          <div className="sumrow"><span>Total Discount</span><span>-{rpFull(t.savings)}</span></div>
          <div className="sumrow"><span>Platform Fee</span><span>{rpFull(t.fee)}</span></div>
        </section>
      </div>
      <div className="cbar">
        <div><span>Total price</span><b>{rpFull(t.total)}</b></div>
        <button className="pbtn-green" onClick={placeOrder}>Place Order</button>
      </div>
    </div>
  );
}
