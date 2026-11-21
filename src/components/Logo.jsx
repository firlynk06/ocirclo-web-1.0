import { useState } from "react";

// Logo: pakai /assets/logo.png bila ada (export dari Figma). Kalau belum ada, tampil logo sementara (teks + ikon panah).
// Ikon di bawah hanya pengganti sementara, bukan logo asli.
export function LogoMark({ size = 30 }) {
  const arc = (c, r0) => <circle cx="20" cy="20" r="14" fill="none" stroke={c} strokeWidth="6" strokeLinecap="round" strokeDasharray="17 71" transform={`rotate(${r0} 20 20)`} />;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      {arc("#2f8f5b", -80)}{arc("#c5d84a", 10)}{arc("#d8c23a", 100)}{arc("#a21942", 190)}
    </svg>
  );
}

export default function Logo({ className = "", size = 30 }) {
  const [failed, setFailed] = useState(false);
  if (!failed) return <img className={`logo-img ${className}`} src="/assets/logo.png" alt="Ocirclo" onError={() => setFailed(true)} />;
  return (
    <span className={`logo-fallback ${className}`}>
      <LogoMark size={size} />
      <span className="logo-text">circlo<span className="logo-dot">.</span></span>
    </span>
  );
}
