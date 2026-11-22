import { useState } from "react";
// Foto produk dari /assets/products/<SKU>.png; bila belum ada tampil kotak inisial.
export default function Thumb({ id, nama, className = "" }) {
  const [failed, setFailed] = useState(false);
  if (!failed) return <img className={`thumb ${className}`} src={`/assets/products/${id}.png`} alt={nama} onError={() => setFailed(true)} />;
  return <div className={`thumb thumb-fallback ${className}`}>{nama.slice(0, 2).toUpperCase()}</div>;
}
