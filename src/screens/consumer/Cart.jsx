import ConsumerHeader from "../../components/consumer/ConsumerHeader.jsx";
import Thumb from "../../components/Thumb.jsx";
import BottomNav from "../../components/consumer/BottomNav.jsx";
import { Plus, Minus, Trash } from "../../components/icons.jsx";
import { useNav } from "../../lib/nav.js";
import { useConsumer } from "../../lib/consumerCtx.js";
import { rpFull, nameWithPack } from "../../lib/format.js";
import { pctOff } from "../../lib/consumer.js";

export default function Cart() {
  const { go } = useNav();
  const { cartLines, cartCount, setQty, startCheckout } = useConsumer();
  const total = cartLines.reduce((s, l) => s + l.price * l.qty, 0);

  return (
    <div className="cscreen">
      <ConsumerHeader />
      <div className="cbody">
        <h1 className="ptitle">My Cart</h1>
        <p className="psub">{cartCount} {cartCount === 1 ? "item" : "items"}</p>
        {cartLines.length === 0 && (
          <div className="cempty-box"><p>Your cart is empty.</p><button className="pbtn-green wide" onClick={() => go("explore")}>Explore Deals</button></div>
        )}
        {cartLines.map((l) => {
          const off = pctOff(l.r);
          return (
            <div key={l.sku} className="cline">
              <Thumb className="cline-img" id={l.sku} nama={l.p.nama} />
              <div className="cline-mid">
                <b>{nameWithPack(l.p)}</b>
                <span className="cline-store">{l.p.toko}</span>
                <div className="cline-price"><b>{rpFull(l.price)}</b>{off > 0 && <><s>{rpFull(l.normal)}</s><span className="offtag">-{off}% OFF</span></>}</div>
              </div>
              <div className="qty">
                <button aria-label={l.qty === 1 ? "Remove" : "Decrease"} onClick={() => setQty(l.sku, l.qty - 1)}>{l.qty === 1 ? <Trash size={12} color="#a21942" /> : <Minus size={12} />}</button>
                <span>{l.qty}</span>
                <button aria-label="Increase" disabled={l.qty >= l.p.stok_tersedia} onClick={() => setQty(l.sku, l.qty + 1)}><Plus size={12} /></button>
              </div>
            </div>
          );
        })}
      </div>
      {cartLines.length > 0 && (
        <div className="cbar">
          <div><span>Total price</span><b>{rpFull(total)}</b></div>
          <button className="pbtn-green" onClick={() => startCheckout(cartLines.map((l) => ({ sku: l.sku, qty: l.qty })), "cart")}>Proceed to Checkout</button>
        </div>
      )}
      <BottomNav />
    </div>
  );
}
