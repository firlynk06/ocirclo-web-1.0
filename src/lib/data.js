// Memuat data hasil notebook Colab (public/data/*.json).
export async function loadData() {
  const get = (f) => fetch(`/data/${f}`).then((r) => r.json());
  const [cfg, products, stores, orders] = await Promise.all([
    get("config.json"), get("products.json"), get("stores.json"), get("orders.json"),
  ]);
  return { cfg, products, stores, orders };
}
