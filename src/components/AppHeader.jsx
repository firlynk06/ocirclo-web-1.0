import { useState } from "react";
import { useNav } from "../lib/nav.js";
import Logo from "./Logo.jsx";

const SELLER_MENU = [
  ["business", "Business Overview", "Subscription, sales and orders"],
  ["dashboard", "Dynamic Pricing", "Pricing overview"],
  ["inventory", "Inventory", "Manage products and stock"],
  ["pricing", "Pricing Recommendation", "Review suggested prices"],
  ["rules", "Pricing Rules", "Mode, windows and safeguards"],
  ["sellerorders", "Recent Orders", "Incoming customer orders"],
  ["waste", "Waste Recovery", "Give unsold products a second chance"],
];
const CONSUMER_MENU = [["consumer", "Home", "Discover products at better prices"]];

export default function AppHeader({ title }) {
  const { route, go, role, switchAccount, logout } = useNav();
  const [open, setOpen] = useState(false);
  const menu = role === "consumer" ? CONSUMER_MENU : SELLER_MENU;
  const pick = (fn) => { setOpen(false); fn(); };
  return (
    <>
      <div className="topbar">
        <Logo />
        <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}><span /><span /><span /></button>
      </div>
      {title && <div className="titlebar">{title}</div>}
      {open && (
        <>
          <div className="drawer-scrim" onClick={() => setOpen(false)} />
          <nav className="drawer">
            {menu.map(([id, name, sub]) => (
              <button key={id} className={"drawer-item" + (route === id ? " on" : "")} onClick={() => pick(() => go(id))}>
                <b>{name}</b><span>{sub}</span>
              </button>
            ))}
            <hr className="drawer-sep" />
            <button className="drawer-item" onClick={() => pick(switchAccount)}><b>Switch account type</b><span>{role === "consumer" ? "Use Ocirclo as a seller" : "Use Ocirclo as a consumer"}</span></button>
            <button className="drawer-item" onClick={() => pick(logout)}><b>Log out</b><span>Back to sign in</span></button>
          </nav>
        </>
      )}
    </>
  );
}
