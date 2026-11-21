import { useState } from "react";
import ConsumerHeader from "../../components/consumer/ConsumerHeader.jsx";
import Thumb from "../../components/Thumb.jsx";
import { useNav } from "../../lib/nav.js";
import { useConsumer } from "../../lib/consumerCtx.js";
import { rpFull, nameWithPack } from "../../lib/format.js";
import { longDate } from "../../lib/consumer.js";

const Sparkle = ({ x, y, s, o = 1 }) => <path d="M0-1 .28-.28 1 0 .28.28 0 1-.28.28-1 0-.28-.28Z" transform={`translate(${x} ${y}) scale(${s})`} fill="#d4a62a" opacity={o} />;

export default function Success() {
  const { go } = useNav();
  const { orders, lastOrderId } = useConsumer();
  const [all, setAll] = useState(false);
  const o = orders.find((x) => x.id === lastOrderId);
  if (!o) { return <div className="cscreen"><ConsumerHeader /><div className="cbody"><p className="cempty">No recent order.</p><button className="pbtn-green wide" onClick={() => go("consumer")}>Back to Home</button></div></div>; }
  const sellers = [...new Set(o.items.map((i) => i.toko))].join(", ");
  const shown = all ? o.items : o.items.slice(0, 1);
  const Row = ({ k, v }) => <div className="inforow"><span>{k}</span><span className="v">{v}</span></div>;

  return (
    <div className="cscreen">
      <ConsumerHeader avatar={false} />
      <div className="cbody tight center-col">
        <svg className="okmark" viewBox="0 0 220 190" role="img" aria-label="Success">
          <Sparkle x="30" y="60" s="14" /><Sparkle x="58" y="30" s="6" /><Sparkle x="180" y="125" s="16" /><Sparkle x="200" y="165" s="8" /><Sparkle x="165" y="150" s="5" o=".7" />
          <circle cx="112" cy="90" r="76" fill="#a21942" />
          <path d="M75 92l26 26 48-52" fill="none" stroke="#fff" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h1 className="okh">Order Placed Successfully!</h1>
        <p className="okp">Your order has been successfully placed! The seller is now processing your order. We'll keep you updated as it moves forward.</p>

        <div className="left-col">
          <h3 className="ctitle sm">Order Information</h3>
          <div className="infobox">
            <Row k="Order ID" v={o.id} /><Row k="Order Date" v={longDate(o.date)} /><Row k="Payment Status" v="Success" /><Row k="Seller" v={sellers} />
          </div>
          <h3 className="ctitle sm">Order Summary</h3>
          <div className="infobox">
            {shown.map((i) => (
              <div key={i.sku} className="oline">
                <Thumb className="oline-img" id={i.sku} nama={i.nama} />
                <div className="oline-mid"><b>{nameWithPack(i)}</b><span className="x">x {i.qty}</span>
                  <div className="cline-price"><b>{rpFull(i.price)}</b>{i.normal > i.price && <s>{rpFull(i.normal)}</s>}</div></div>
              </div>
            ))}
            {o.items.length > 1 && <button className="seeall" onClick={() => setAll((v) => !v)}>{all ? "Show less" : `See all (${o.items.length})`}</button>}
            <div className="inforow total"><span>Total paid</span><span className="v">{rpFull(o.total)}</span></div>
          </div>
        </div>
        <div className="okbtns">
          <button className="pbtn-light" onClick={() => go("consumer")}>Back to Home</button>
          <button className="pbtn-green" onClick={() => go("orders")}>View My Orders</button>
        </div>
      </div>
    </div>
  );
}
