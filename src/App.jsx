import { useCallback, useEffect, useMemo, useState } from "react";
import { loadData } from "./lib/data.js";
import { addDays } from "./lib/pricing.js";
import { NavContext } from "./lib/nav.js";
import { seedApplied, buildRows, buildStats, buildActivity } from "./lib/derive.js";
import DemoPanel from "./components/DemoPanel.jsx";
import Splash from "./screens/Splash.jsx";
import Auth from "./screens/Auth.jsx";
import ChooseAccount from "./screens/ChooseAccount.jsx";
import Home from "./screens/consumer/Home.jsx";
import Explore from "./screens/consumer/Explore.jsx";
import ProductDetail from "./screens/consumer/ProductDetail.jsx";
import Cart from "./screens/consumer/Cart.jsx";
import Checkout from "./screens/consumer/Checkout.jsx";
import Success from "./screens/consumer/Success.jsx";
import Orders from "./screens/consumer/Orders.jsx";
import Profile from "./screens/consumer/Profile.jsx";
import { ConsumerContext } from "./lib/consumerCtx.js";
import { useConsumerState } from "./lib/useConsumer.js";
import Business from "./screens/Business.jsx";
import Dashboard from "./screens/Dashboard.jsx";
import Inventory from "./screens/Inventory.jsx";
import PricingRecommendation from "./screens/PricingRecommendation.jsx";
import PricingRules from "./screens/PricingRules.jsx";
import SellerOrders from "./screens/SellerOrders.jsx";
import OrderDetail from "./screens/OrderDetail.jsx";
import Waste from "./screens/Waste.jsx";
import WasteSubmit from "./screens/WasteSubmit.jsx";
import { buildSellerOrders } from "./lib/sellerOrders.js";
import { SEED_REQUESTS } from "./lib/waste.js";

// Alur: splash -> signin/signup -> choose -> (seller: business = Business Overview, dashboard = Pricing Overview, inventory, pricing, rules) | (consumer: consumer = Home, explore, product, cart, checkout, success, orders, profile)
const SELLER = ["business", "dashboard", "inventory", "pricing", "rules", "sellerorders", "orderdetail", "waste", "wastesubmit"];
const CONSUMER = ["consumer", "explore", "product", "cart", "checkout", "success", "orders", "profile"];
const ROUTES = ["splash", "signin", "signup", "choose", ...SELLER, ...CONSUMER];
const readRoute = () => {
  const r = window.location.hash.replace(/^#\/?/, "");
  return ROUTES.includes(r) ? r : "splash";
};

// Sesi login SIMULASI (hanya untuk demo), disimpan di sessionStorage supaya tidak hilang saat refresh.
const KEY = "ocirclo-session";
const loadAuth = () => {
  try { return JSON.parse(sessionStorage.getItem(KEY)) ?? { authed: false, role: null }; } catch { return { authed: false, role: null }; }
};

// Route yang boleh dibuka: belum login -> signin; belum pilih peran / salah peran -> choose.
function guard(route, { authed, role }) {
  if (["splash", "signin", "signup"].includes(route)) return route;
  if (!authed) return "signin";
  if (route === "choose") return route;
  if (SELLER.includes(route)) return role === "seller" ? route : "choose";
  if (CONSUMER.includes(route)) return role === "consumer" ? route : "choose";
  return "choose";
}

export default function App() {
  const [data, setData] = useState(null);
  const [auth, setAuth] = useState(loadAuth);
  const [hashRoute, setHashRoute] = useState(readRoute);
  const [mode, setMode] = useState("recommendation"); // "recommendation" | "auto"
  const [geser, setGeser] = useState(0);
  const [selectedId, setSelectedId] = useState("PRD001");
  const [applied, setApplied] = useState({});          // sku -> harga yang sedang dipakai penjual
  const [log, setLog] = useState([]);                  // riwayat harga yang diterapkan (untuk Recent Activity)
  const [invFilter, setInvFilter] = useState("all");
  const [confirmed, setConfirmed] = useState([]);    // id pesanan yang sudah dikonfirmasi seller
  const [orderId, setOrderId] = useState(null);
  const [wasteReqs, setWasteReqs] = useState(SEED_REQUESTS);
  const [sold, setSold] = useState({});                // sku -> jumlah terjual lewat sisi consumer (mengurangi stok seller)

  const route = guard(hashRoute, auth);

  useEffect(() => {
    loadData().then((d) => { setData(d); setApplied(seedApplied(d.products, d.cfg, 0)); });
  }, []);
  useEffect(() => {
    const onHash = () => setHashRoute(readRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => { try { sessionStorage.setItem(KEY, JSON.stringify(auth)); } catch { /* abaikan */ } }, [auth]);
  // samakan alamat di browser dengan layar yang benar-benar tampil
  useEffect(() => { if (route !== hashRoute) window.location.replace(`#/${route}`); }, [route, hashRoute]);

  const go = useCallback((r) => { window.location.hash = `/${r}`; window.scrollTo?.(0, 0); }, []);
  const signedIn = useCallback(() => { setAuth({ authed: true, role: null }); go("choose"); }, [go]);
  const choose = useCallback((role) => { setAuth({ authed: true, role }); go(role === "seller" ? "business" : "consumer"); }, [go]);
  const switchAccount = useCallback(() => { setAuth((a) => ({ ...a, role: null })); go("choose"); }, [go]);
  const logout = useCallback(() => { setAuth({ authed: false, role: null }); go("signin"); }, [go]);
  const splashDone = useCallback(() => go(auth.authed ? "choose" : "signin"), [go, auth.authed]);
  // tombol "Loncat ke layar" di panel demo: sekalian mengatur sesi supaya layar tujuan terbuka
  const jump = (id) => {
    if (SELLER.includes(id)) setAuth({ authed: true, role: "seller" });
    else if (id === "consumer") setAuth({ authed: true, role: "consumer" });
    else if (id === "choose") setAuth({ authed: true, role: null });
    go(id);
  };

  const nav = useMemo(() => ({ route, go, mode, setMode, role: auth.role, switchAccount, logout }), [route, go, mode, auth.role, switchAccount, logout]);

  const products = useMemo(() => data?.products.map((p) => (sold[p.product_id] ? { ...p, stok_tersedia: Math.max(0, p.stok_tersedia - sold[p.product_id]) } : p)), [data, sold]);
  const rows = useMemo(() => (data ? buildRows(products, data.cfg, geser, mode, applied) : []), [data, products, geser, mode, applied]);
  const stats = useMemo(() => buildStats(rows), [rows]);
  const activity = useMemo(() => (data ? buildActivity(products, data.cfg, geser, mode, log) : []), [data, products, geser, mode, log]);

  const addSold = useCallback((pairs) => setSold((m) => { const n = { ...m }; for (const [k, q] of pairs) n[k] = (n[k] ?? 0) + q; return n; }), []);
  const clearSold = useCallback(() => setSold({}), []);
  const consumer = useConsumerState({ rows, today: data ? addDays(data.cfg.tanggal_dasar, geser) : "2026-11-12", go, onSold: addSold, onResetSold: clearSold });

  const sellerOrders = useMemo(() => buildSellerOrders(consumer.orders, confirmed), [consumer.orders, confirmed]);
  const addWaste = (r) => setWasteReqs((l) => [{ ...r, id: `REC-${String(l.length + 1).padStart(3, "0")}`, status: "Pending", added: true, date: r.date ? new Date(r.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Today" }, ...l]);
  const isSeller = SELLER.includes(route);
  const isConsumer = CONSUMER.includes(route);
  const product = products?.find((p) => p.product_id === selectedId);
  const row = rows.find((r) => r.p.product_id === selectedId);
  const today = data ? addDays(data.cfg.tanggal_dasar, geser) : null;

  const openProduct = (id) => { setSelectedId(id); go("pricing"); };
  const applyPrice = (price) => {
    setApplied((a) => ({ ...a, [product.product_id]: price }));
    setLog((l) => [...l, { sku: product.product_id, day: geser, seq: l.length, pct: Math.round((1 - price / product.harga_normal) * 100) }]);
  };
  const reset = () => { setApplied(seedApplied(data.products, data.cfg, 0)); setLog([]); };

  let screen;
  if (route === "splash") screen = <Splash onDone={splashDone} />;
  else if (route === "signin" || route === "signup") screen = <Auth key={route} mode={route} go={go} onSignedIn={signedIn} />;
  else if (route === "choose") screen = <ChooseAccount onChoose={choose} />;
  else if (isConsumer && (!data || !rows.length)) screen = <p className="loading">Memuat data…</p>;
  else if (route === "consumer") screen = <Home />;
  else if (route === "explore") screen = <Explore />;
  else if (route === "product") screen = <ProductDetail />;
  else if (route === "cart") screen = <Cart />;
  else if (route === "checkout") screen = <Checkout />;
  else if (route === "success") screen = <Success />;
  else if (route === "orders") screen = <Orders />;
  else if (route === "profile") screen = <Profile />;
  else if (!data || !row) screen = <p className="loading">Memuat data…</p>;
  else if (route === "business") screen = <Business rows={rows} stats={stats} products={products} orders={sellerOrders} onOpenOrder={setOrderId} />;
  else if (route === "sellerorders") screen = <SellerOrders orders={sellerOrders} onOpen={setOrderId} />;
  else if (route === "orderdetail") screen = <OrderDetail order={sellerOrders.find((o) => o.id === orderId)} onConfirm={() => setConfirmed((c) => [...c, orderId])} />;
  else if (route === "waste") screen = <Waste requests={wasteReqs} />;
  else if (route === "wastesubmit") screen = <WasteSubmit onSubmit={addWaste} />;
  else if (route === "inventory") screen = <Inventory rows={rows} stats={stats} filter={invFilter} onFilter={setInvFilter} onOpenProduct={openProduct} />;
  else if (route === "pricing") screen = <PricingRecommendation product={product} quote={row.q} currentPrice={row.current} onApplyPrice={applyPrice} />;
  else if (route === "rules") screen = <PricingRules cfg={data.cfg} />;
  else screen = <Dashboard rows={rows} stats={stats} activity={activity} onOpenProduct={openProduct}
                           onShowNear={() => { setInvFilter("near"); go("inventory"); }} />;

  return (
    <NavContext.Provider value={nav}>
      <ConsumerContext.Provider value={consumer}>
        <div className="stage">
          <DemoPanel route={route} onJump={jump} showSeller={isSeller && !!data} showConsumer={isConsumer && !!data}
                     products={data?.products ?? []} selectedId={selectedId} onSelect={setSelectedId}
                     geser={geser} onGeser={setGeser} today={today} onReset={reset}
                     orders={consumer.orders} onAdvance={consumer.advanceOrder} onResetConsumer={consumer.resetConsumer} />
          <div className="phone">{screen}</div>
        </div>
      </ConsumerContext.Provider>
    </NavContext.Provider>
  );
}
