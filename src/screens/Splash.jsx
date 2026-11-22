import { useEffect } from "react";

// Layar "Buka web" (Figma 15:4): kartu putih berisi logo + tagline (gambar dari Figma). Lanjut sendiri ~1,8 detik, atau klik untuk melewati.
export default function Splash({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="gate splash" onClick={onDone} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onDone()}>
      <img className="splash-card" src="/assets/splash-card.png" alt="Ocirclo - Keep Value in Motion" width="243" height="82" />
    </div>
  );
}
