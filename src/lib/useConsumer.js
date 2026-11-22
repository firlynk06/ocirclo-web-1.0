import { useCallback, useMemo, useState } from "react";
import { totals, etaText, newOrderId, groupOf } from "./consumer.js";

/**
 * State sisi consumer: keranjang, checkout, pesanan. rows = hasil buildRows (harga ikut harga yang dipakai seller).
 * onSold(items) dipanggil saat pesanan dibuat supaya stok di sisi seller berkurang.
 */
export function useConsumerState({ rows, today, go, onSold, onResetSold }) {
  const [cart, setCart] = useState([]);                 // [{sku, qty}]
  const [checkout, setCheckout] = useState(null);       // {items:[{sku,qty}], from:"cart"|"buy"}
  const [shipping, setShipping] = useState("regular");
  const [payment, setPayment] = useState("bank");
  const [orders, setOrders] = useState([]);
  const [lastOrderId, setLastOrderId] = useState(null);
  const [productId, setProductId] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  // Produk yang bisa dibeli: belum kedaluwarsa dan stok masih ada.
  const shop = useMemo(() => rows.filter((r) => r.q.status !== "expired" && r.p.stok_tersedia > 0), [rows]);
  const bySku = useMemo(() => Object.fromEntries(shop.map((r) => [r.p.product_id, r])), [shop]);

  const linesOf = useCallback((items) =>
    items.map(({ sku, qty }) => {
      const r = bySku[sku];
      return r && { sku, qty: Math.min(qty, r.p.stok_tersedia), r, p: r.p, price: r.current, normal: r.p.harga_normal, discount: r.discount };
    }).filter(Boolean), [bySku]);

  const cartLines = useMemo(() => linesOf(cart), [linesOf, cart]);
  const cartCount = cartLines.reduce((s, l) => s + l.qty, 0);

  const addToCart = (sku, n = 1) => setCart((c) => {
    const have = c.find((x) => x.sku === sku);
    return have ? c.map((x) => (x.sku === sku ? { ...x, qty: x.qty + n } : x)) : [...c, { sku, qty: n }];
  });
  const setQty = (sku, qty) => setCart((c) => (qty <= 0 ? c.filter((x) => x.sku !== sku) : c.map((x) => (x.sku === sku ? { ...x, qty } : x))));

  const startCheckout = (items, from) => { setCheckout({ items, from }); setShipping("regular"); go("checkout"); };
  const buyNow = (sku) => startCheckout([{ sku, qty: 1 }], "buy");
  const checkoutLines = useMemo(() => (checkout ? linesOf(checkout.items) : []), [linesOf, checkout]);

  const placeOrder = () => {
    if (!checkoutLines.length) return;
    const t = totals(checkoutLines, shipping);
    const id = newOrderId(orders.length);
    const order = {
      id, date: today, c: 2, shipping, payment, ...t, eta: etaText(shipping),
      items: checkoutLines.map((l) => ({ sku: l.sku, nama: l.p.nama, kemasan: l.p.kemasan, toko: l.p.toko, qty: l.qty, price: l.price, normal: l.normal })),
    };
    setOrders((o) => [order, ...o]);
    setCart((c) => c.filter((x) => !checkoutLines.some((l) => l.sku === x.sku)));
    onSold(checkoutLines.map((l) => [l.sku, l.qty]));
    setLastOrderId(id); setCheckout(null);
    go("success");
  };

  // Demo: majukan tahap pelacakan pesanan aktif terbaru (Processing -> Shipped -> Delivered).
  const advanceOrder = () => setOrders((os) => {
    const i = os.findIndex((o) => o.c < 5);
    return i < 0 ? os : os.map((o, k) => (k === i ? { ...o, c: o.c + 1 } : o));
  });
  const advanceOrderById = (id) => setOrders((os) => os.map((o) => (o.id === id && o.c < 5 ? { ...o, c: o.c + 1 } : o)));
  const resetConsumer = () => { setCart([]); setCheckout(null); setOrders([]); setLastOrderId(null); onResetSold(); };

  const openProduct = (sku) => { setProductId(sku); go("product"); };
  const exploreWith = (cat, q = "") => { setCategory(cat); setQuery(q); go("explore"); };

  return {
    today, shop, bySku, groupOf,
    cart, cartLines, cartCount, addToCart, setQty,
    checkout, checkoutLines, startCheckout, buyNow, shipping, setShipping, payment, setPayment, placeOrder,
    orders, lastOrderId, advanceOrder, advanceOrderById, resetConsumer,
    productId, openProduct, query, setQuery, category, setCategory, exploreWith,
  };
}
