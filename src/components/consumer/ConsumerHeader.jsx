import Logo from "../Logo.jsx";
import { ChevronLeft } from "../icons.jsx";
import { useNav } from "../../lib/nav.js";
import { CONSUMER_NAME } from "../../lib/consumer.js";

// Header consumer (Figma): logo di tengah, avatar di kanan (-> Profile), panah kembali di kiri bila perlu.
export default function ConsumerHeader({ onBack, avatar = true }) {
  const { go } = useNav();
  return (
    <div className="chead">
      {onBack ? <button className="cback" aria-label="Back" onClick={onBack}><ChevronLeft size={30} color="#a21942" sw={2.2} /></button> : <span className="cslot" />}
      <Logo />
      {avatar ? (
        <button className="cavatar" aria-label="Profile" onClick={() => go("profile")}>{CONSUMER_NAME.split(" ").map((w) => w[0]).join("")}</button>
      ) : <span className="cslot" />}
    </div>
  );
}
