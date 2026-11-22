import { Home, Search, ShoppingCart, Gift, User } from "../icons.jsx";
import { useNav } from "../../lib/nav.js";
import { useConsumer } from "../../lib/consumerCtx.js";

const TABS = [["consumer", "Home", Home], ["explore", "Explore", Search], ["cart", "Cart", ShoppingCart], ["orders", "Order", Gift], ["profile", "Profile", User]];

export default function BottomNav() {
  const { route, go } = useNav();
  const { cartCount } = useConsumer();
  return (
    <nav className="bnav" aria-label="Main">
      {TABS.map(([id, label, Icon]) => (
        <button key={id} className={route === id ? "on" : ""} onClick={() => go(id)} aria-current={route === id ? "page" : undefined}>
          <span className="bico"><Icon size={30} color="currentColor" sw={1.8} />{id === "cart" && cartCount > 0 && <i className="bbadge">{cartCount}</i>}</span>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
