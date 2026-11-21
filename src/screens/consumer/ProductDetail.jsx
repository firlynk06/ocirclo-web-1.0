import { useState } from "react";
import ConsumerHeader from "../../components/consumer/ConsumerHeader.jsx";
import Thumb from "../../components/Thumb.jsx";
import { Send, Heart, Star, MapPin, ChevronLeft } from "../../components/icons.jsx";
import { useNav } from "../../lib/nav.js";
import { useConsumer } from "../../lib/consumerCtx.js";
import { rpFull, fmtDate } from "../../lib/format.js";
import { addDays } from "../../lib/pricing.js";
import { pctOff, descriptionOf, cityOf, shortDate } from "../../lib/consumer.js";

export default function ProductDetail() {
  const { go } = useNav();
  const { bySku, productId, addToCart, buyNow, today } = useConsumer();
  const [fav, setFav] = useState(false);
  const [follow, setFollow] = useState(false);
  const [more, setMore] = useState(false);
  const [added, setAdded] = useState(false);
  const r = bySku[productId];

  if (!r) return (
    <div className="cscreen"><ConsumerHeader onBack={() => go("explore")} />
      <div className="cbody"><p className="cempty">This product is no longer available.</p><button className="pbtn-green wide" onClick={() => go("explore")}>Back to Explore</button></div>
    </div>
  );

  const p = r.p, off = pctOff(r);
  const expIso = addDays(today, r.days);
  return (
    <div className="cscreen detail">
      <ConsumerHeader avatar={false} />
      <div className="dhero">
        <button className="dback" aria-label="Back" onClick={() => go("explore")}><ChevronLeft size={30} color="#a21942" sw={2.2} /></button>
        <Thumb className="dimg" id={p.product_id} nama={p.nama} />
        <button className="dshare" aria-label="Share" onClick={() => navigator.clipboard?.writeText(window.location.href).catch(() => {})}><Send size={26} color="#a21942" /></button>
      </div>
      <div className="dbody">
        <div className="dtitle"><h1>{p.nama}</h1>
          <button aria-label="Favorite" aria-pressed={fav} onClick={() => setFav((v) => !v)}><Heart size={28} color="#a21942" fill={fav ? "#a21942" : "none"} /></button>
        </div>
        <div className="dpack">{p.kemasan}</div>
        <div className="dprice">
          <b>{rpFull(r.current)}</b>
          {off > 0 && <><s>{rpFull(p.harga_normal)}</s><span className="offtag lg">-{off}% OFF</span></>}
        </div>
        <div className="dexp">{r.days <= 0 ? "Expires Today" : `Expires in ${r.days} days`} - {shortDate(expIso)}</div>

        <h3>Product Description</h3>
        <p className={"ddesc" + (more ? " open" : "")}>{descriptionOf(p)}</p>
        <button className="dmore" onClick={() => setMore((v) => !v)}>{more ? "See less" : "See more"}</button>

        <div className="dstore">
          <span className="dlogo">{p.toko.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span>
          <div className="dstore-mid">
            <b>{p.toko}</b>
            <button className={follow ? "on" : ""} onClick={() => setFollow((v) => !v)}>{follow ? "Following" : "Follow"}</button>
          </div>
          <div className="dstore-r">
            <span><Star size={13} color="#f5b301" fill="#f5b301" /> 4.9 (2 rb)</span>
            <span className="dship"><MapPin size={12} color="#555" /> Dikirim dari</span>
            <b>{cityOf(p)}</b>
          </div>
        </div>
      </div>
      <div className="dbar">
        <button className="pbtn-light" onClick={() => { addToCart(p.product_id); setAdded(true); setTimeout(() => setAdded(false), 1400); }}>{added ? "Added ✓" : "Add to Cart"}</button>
        <button className="pbtn-green" onClick={() => buyNow(p.product_id)}>Buy Now</button>
      </div>
    </div>
  );
}
