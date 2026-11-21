import Thumb from "../Thumb.jsx";
import { rpFull } from "../../lib/format.js";
import { badgeOf, pctOff } from "../../lib/consumer.js";
import { useConsumer } from "../../lib/consumerCtx.js";
import { nameWithPack } from "../../lib/format.js";

// Kartu produk (Home & Explore). Klik kartu -> detail; tombol -> keranjang / beli sekarang.
export default function ProductCard({ r }) {
  const { openProduct, addToCart, buyNow } = useConsumer();
  const off = pctOff(r), badge = badgeOf(r);
  const stop = (fn) => (e) => { e.stopPropagation(); fn(); };
  return (
    <div className="pcard" role="button" tabIndex={0} onClick={() => openProduct(r.p.product_id)} onKeyDown={(e) => e.key === "Enter" && openProduct(r.p.product_id)}>
      <div className="pcard-img">
        <Thumb className="pcard-thumb" id={r.p.product_id} nama={r.p.nama} />
        {badge && <span className="pbadge">{badge}</span>}
      </div>
      <div className="pcard-name">{nameWithPack(r.p)}</div>
      {off > 0 && <s className="pcard-old">{rpFull(r.p.harga_normal)}</s>}
      <div className="pcard-row"><b className="pcard-price">{rpFull(r.current)}</b>{off > 0 && <span className="offtag">-{off}% OFF</span>}</div>
      <div className="pcard-btns">
        <button className="pbtn-light" onClick={stop(() => addToCart(r.p.product_id))}>Add to Cart</button>
        <button className="pbtn-green" onClick={stop(() => buyNow(r.p.product_id))}>Buy Now</button>
      </div>
    </div>
  );
}
