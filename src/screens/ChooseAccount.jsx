import Logo from "../components/Logo.jsx";
import { Store, ShoppingCart } from "../components/icons.jsx";

// "How Will You Use Ocirclo?" (Figma 37:108). Seller -> sisi B2B, Consumer -> sisi B2C.
const Arrow = () => (
  <svg width="46" height="12" viewBox="0 0 46 12" fill="none" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 6h43" /><path d="M39 1l5 5-5 5" />
  </svg>
);

export default function ChooseAccount({ onChoose }) {
  const Card = ({ role, tone, title, icon, text }) => (
    <div className={`cwrap c-${tone}`}>
      <div className="ccard" role="button" tabIndex={0} onClick={() => onChoose(role)} onKeyDown={(e) => e.key === "Enter" && onChoose(role)}>
        <h3>{title}</h3>
        <span className="cicon">{icon}</span>
        <p>{text}</p>
      </div>
      <button className="cgo" aria-label={`Continue as ${title}`} onClick={() => onChoose(role)}><Arrow /></button>
    </div>
  );
  return (
    <div className="gate choose">
      <h1>
        <div>How Will You</div>
        <div className="l2"><span>Use</span><Logo /><span>?</span></div>
      </h1>
      <p className="choose-sub">Choose the experience that suits your needs.</p>
      <div className="choose-grid">
        <Card role="seller" tone="green" title="Business / Seller" icon={<Store size={44} color="#fff" sw={1.6} />} text="Manage inventory, optimize pricing, and track your business." />
        <Card role="consumer" tone="maroon" title="Consumer / Buyer" icon={<ShoppingCart size={44} color="#fff" sw={1.6} />} text="Discover products at better prices." />
      </div>
    </div>
  );
}
