import { useState } from "react";
import ConsumerHeader from "../../components/consumer/ConsumerHeader.jsx";
import Thumb from "../../components/Thumb.jsx";
import BottomNav from "../../components/consumer/BottomNav.jsx";
import { Check, Clock, Wallet } from "../../components/icons.jsx";
import { useNav } from "../../lib/nav.js";
import { useConsumer } from "../../lib/consumerCtx.js";
import { rpFull, nameWithPack } from "../../lib/format.js";
import { STAGES, statusPill, longDate, SHIPPING } from "../../lib/consumer.js";

const TABS = [["ongoing", "Ongoing"], ["completed", "Completed"], ["cancelled", "Cancelled"]];

function OrderCard({ o }) {
  const [all, setAll] = useState(false);
  const [details, setDetails] = useState(false);
  const [chat, setChat] = useState(false);
  const shown = all ? o.items : o.items.slice(0, 2);
  const done = o.c >= 5;
  return (
    <article className="ocard">
      <div className="ocard-top"><span className="oid">{o.id}</span><span className={"opill" + (done ? " done" : "")}>{statusPill(o.c)}</span></div>
      {shown.map((i, k) => (
        <div key={i.sku + k} className="oline">
          <Thumb className="oline-img" id={i.sku} nama={i.nama} />
          <div className="oline-mid"><b>{nameWithPack(i)}</b><span className="x">x {i.qty}</span><b className="g">{rpFull(i.price)}</b></div>
        </div>
      ))}
      {o.items.length > 2 && <button className="seeall" onClick={() => setAll((v) => !v)}>{all ? "Show less" : `See all (${o.items.length})`}</button>}
      <hr />
      <div className="eta"><div><span>{done ? "Delivered" : "Estimated arrival"}</span><b>{done ? longDate(o.date) : o.eta}</b></div><span className="etaico"><Clock size={20} color="#fff" /></span></div>
      <hr />
      <h4>Tracking Timeline</h4>
      <ol className="tl">
        {STAGES.map(([t, d], i) => {
          const on = i < o.c;
          return (
            <li key={t} className={on ? "on" : ""}>
              <span className="dot">{on ? (i === 1 ? <Wallet size={11} color="#fff" /> : <Check size={11} color="#fff" sw={3.5} />) : null}</span>
              <div><b>{t}</b><span>{d}</span></div>
            </li>
          );
        })}
      </ol>
      {details && (
        <div className="odet">
          <div className="sumrow"><span>Shipping</span><span>{SHIPPING[o.shipping].label}</span></div>
          <div className="sumrow"><span>Subtotal</span><span>{rpFull(o.subtotal)}</span></div>
          <div className="sumrow"><span>Total Discount</span><span>-{rpFull(o.savings)}</span></div>
          <div className="sumrow"><span>Shipping Fee</span><span>{rpFull(o.ship)}</span></div>
          <div className="sumrow"><span>Platform Fee</span><span>{rpFull(o.fee)}</span></div>
          <div className="sumrow tot"><span>Total</span><span>{rpFull(o.total)}</span></div>
        </div>
      )}
      {chat && <p className="note">Chat with the seller is not available in this demo.</p>}
      <div className="obtns">
        <button className="pbtn-light" onClick={() => setChat((v) => !v)}>Contact Seller</button>
        <button className="pbtn-grad" onClick={() => setDetails((v) => !v)}>{details ? "Hide Order Details" : "View Order Details"}</button>
      </div>
    </article>
  );
}

export default function Orders() {
  const { go } = useNav();
  const { orders } = useConsumer();
  const [tab, setTab] = useState("ongoing");
  const list = tab === "ongoing" ? orders.filter((o) => o.c < 5) : tab === "completed" ? orders.filter((o) => o.c >= 5) : [];

  return (
    <div className="cscreen">
      <ConsumerHeader />
      <div className="cbody tight">
        <h1 className="ptitle">My Orders</h1>
        <p className="psub">Track your purchases and view order history</p>
        <div className="otabs">{TABS.map(([id, l]) => <button key={id} className={tab === id ? "on" : ""} onClick={() => setTab(id)}>{l}</button>)}</div>
        <div className="ohead"><b>{tab === "ongoing" ? "Active Order" : tab === "completed" ? "Completed Orders" : "Cancelled Orders"}</b><span>{list.length} ORDER</span></div>
        {list.length === 0 && (
          <div className="cempty-box"><p>{tab === "ongoing" ? "No active orders yet." : tab === "completed" ? "No completed orders yet." : "No cancelled orders."}</p>
            {tab === "ongoing" && <button className="pbtn-green wide" onClick={() => go("explore")}>Explore Deals</button>}</div>
        )}
        {list.map((o) => <OrderCard key={o.id} o={o} />)}
      </div>
      <BottomNav />
    </div>
  );
}
