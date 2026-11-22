import { useState } from "react";
import Logo from "../components/Logo.jsx";
import { Box, Tag, Store, Recycle, ArrowRight, Phone, Mail, Instagram } from "../components/icons.jsx";

const STEPS = [
  [Box, "01. Manage Your Inventory"],
  [Tag, "02. Optimize Your Prices"],
  [Store, "03. Connect Through Marketplace"],
  [Recycle, "04. Recover and Reuse"],
];

// Homepage sebelum login (Figma 24:26). Foto hero: taruh di public/assets/hero.jpg (export dari Figma "image 1").
export default function Landing({ go }) {
  const [menu, setMenu] = useState(false);
  const start = () => go("signin");
  return (
    <div className="land">
      <div className="topbar">
        <Logo />
        <button className="burger" aria-label="Menu" aria-expanded={menu} onClick={() => setMenu((v) => !v)}><span /><span /><span /></button>
      </div>
      {menu && (<>
        <div className="drawer-scrim" onClick={() => setMenu(false)} />
        <nav className="drawer">
          <button className="drawer-item" onClick={() => go("signin")}><b>Sign In</b><span>Masuk ke akunmu</span></button>
          <button className="drawer-item" onClick={() => go("signup")}><b>Sign Up</b><span>Buat akun baru</span></button>
        </nav>
      </>)}

      <section className="l-hero">
        <img className="l-bg" src="/assets/hero.jpg" alt="" onError={(e) => { e.currentTarget.style.display = "none"; }} />
        <h1>Give Every Product a Second Chance</h1>
        <p>Make every product count. Manage your inventory, discover better deals, and keep valuable products from going to waste—all in one place.</p>
        <button className="l-cta" onClick={start}>Let’s Get Started <ArrowRight size={22} color="#fff" /></button>
      </section>
      <div className="l-quote">“Together with waste management organizations and business partners, Ocirclo builds a collaborative ecosystem to reduce waste and maximize product value.”</div>

      <section className="l-about">
        <Logo className="l-biglogo" />
        <p>Ocirclo is an integrated digital platform that optimizes inventory and pricing through automated dynamic pricing, business analytics, and a B2B2C marketplace, while connecting businesses with organic waste processors to create a more efficient and sustainable consumer goods ecosystem.</p>
      </section>

      <section className="l-steps">
        {STEPS.map(([I, t]) => <div key={t}><I size={52} color="#1a5c3a" sw={1.3} /><span>{t}</span></div>)}
      </section>

      <section className="l-cards">
        <div className="l-card green">
          <b className="l-pill">Business Hub</b>
          <h3>Manage Smarter. Grow Better.</h3>
          <p>Optimize your inventory, monitor business performance, and make smarter pricing decisions with Ocirclo.</p>
          <button onClick={start}>Explore More <ArrowRight size={18} color="#fff" /></button>
        </div>
        <div className="l-card maroon">
          <b className="l-pill">Marketplace</b>
          <h3>Discover More. Waste Less.</h3>
          <p>Explore products from businesses, discover great deals, and make more mindful shopping choices.</p>
          <button onClick={start}>Explore More <ArrowRight size={18} color="#fff" /></button>
        </div>
      </section>

      <footer className="l-foot">
        <div className="l-foot-top"><span className="l-foot-logo"><Logo /></span><b>Contact Us</b></div>
        <div className="l-foot-row">
          <span>+62 807109210839 <Phone size={20} color="#fff" /></span>
          <span className="u">Ocirclo@gmail.com <Mail size={20} color="#fff" /></span>
          <span>@Ocirclo. <Instagram size={20} color="#fff" /></span>
        </div>
      </footer>
    </div>
  );
}
