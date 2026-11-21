import { useState } from "react";
import AppHeader from "../components/AppHeader.jsx";
import { Leaf, Recycle, Box, Layers, ImagePlus, Calendar, Info } from "../components/icons.jsx";
import { PARTNERS, CATEGORIES } from "../lib/waste.js";
import { useNav } from "../lib/nav.js";

const ICON = { food: Leaf, organic: Recycle, packaging: Box, other: Layers };
const METHODS = ["Drop-off at partner location", "Pick-up by partner"];

// Submit Waste Recovery Request (Figma 37:231)
export default function WasteSubmit({ onSubmit }) {
  const { go } = useNav();
  const [cat, setCat] = useState("food");
  const [name, setName] = useState(""); const [qty, setQty] = useState(""); const [unit, setUnit] = useState("kg");
  const [cond, setCond] = useState(""); const [photo, setPhoto] = useState("");
  const [partner, setPartner] = useState("A"); const [method, setMethod] = useState(METHODS[0]); const [date, setDate] = useState("");
  const [err, setErr] = useState("");
  const partners = PARTNERS.filter((p) => p.accepts.includes(cat));
  const pick = (id) => { setCat(id); const ok = PARTNERS.filter((p) => p.accepts.includes(id)); if (!ok.some((p) => p.id === partner)) setPartner(ok[0].id); };
  const submit = () => {
    if (!name.trim() || !(Number(qty) > 0) || !cond) { setErr("Isi nama, jumlah, dan kondisi limbah dulu."); return; }
    const kg = unit === "g" ? Number(qty) / 1000 : Number(qty);
    onSubmit({ what: CATEGORIES.find((c) => c.id === cat).label, kg: Math.round(kg * 100) / 100, partner: PARTNERS.find((p) => p.id === partner).name, date });
    go("waste");
  };
  return (
    <div className="screen">
      <AppHeader title="Submit Waste Recovery" />
      <div className="wsf">
        <h2 className="wsf-h">Waste Information</h2>
        <p className="wst-s">Tell us about the waste materials you want to recover.</p>
        <h3>1. Waste Category</h3><p className="wst-s">Select the type of waste material.</p>
        <div className="wsf-cats">
          {CATEGORIES.map((c) => { const I = ICON[c.id]; return (
            <button key={c.id} className={cat === c.id ? "on" : ""} onClick={() => pick(c.id)}><I size={16} color="#1a5c3a" /><b>{c.name}</b><span>{c.sub}</span></button>
          ); })}
        </div>
        <hr />
        <h3>2. Waste Details</h3>
        <label>Waste / Product Name</label>
        <input className="wsf-in" placeholder="e.g. Unsold Fresh Milk" value={name} onChange={(e) => setName(e.target.value)} />
        <label>Quantity</label>
        <div className="wsf-q"><input className="wsf-in" inputMode="decimal" placeholder="Enter quantity" value={qty} onChange={(e) => setQty(e.target.value.replace(/[^\d.]/g, ""))} />
          <select className="wsf-in" value={unit} onChange={(e) => setUnit(e.target.value)}><option>kg</option><option>g</option></select></div>
        <label>Waste Condition</label>
        <select className="wsf-in" value={cond} onChange={(e) => setCond(e.target.value)}><option value="" disabled>Select condition</option><option>Expired</option><option>Damaged packaging</option><option>Spoiled</option><option>Surplus</option></select>
        <label>Upload Waste Photos</label>
        <label className="wsf-up"><ImagePlus size={20} color="#1a5c3a" /><b>{photo || "Upload Photos"}</b><span>Add photos to help partners assess the materials.</span>
          <input type="file" accept="image/*" hidden onChange={(e) => setPhoto(e.target.files?.[0]?.name ?? "")} /></label>
        <h3>3. Select Recovery Partner</h3><p className="wst-s">Choose a partner that accepts your waste category.</p>
        <select className="wsf-in sel" value={partner} onChange={(e) => setPartner(e.target.value)}>{partners.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
        <h3>4. Handover Preferences</h3>
        <div className="wsf-2">
          <div><label>Preferred Handover Method</label><select className="wsf-in" value={method} onChange={(e) => setMethod(e.target.value)}>{METHODS.map((m) => <option key={m}>{m}</option>)}</select></div>
          <div><label>Preferred Handover Date</label><div className="wsf-date"><input className="wsf-in" type="date" value={date} onChange={(e) => setDate(e.target.value)} /><Calendar size={14} /></div></div>
        </div>
        <div className="wsf-info"><Info size={14} color="#1a5c3a" /><div><b>Important Information</b><span>Your request will be reviewed by the selected partner. Handover arrangements are subject to partner confirmation.</span></div></div>
        {err && <p className="err">{err}</p>}
        <div className="wsf-act"><button className="btn-primary wsf-go" onClick={submit}>Submit Recovery Request</button><button className="wsf-cancel" onClick={() => go("waste")}>Cancel</button></div>
      </div>
    </div>
  );
}
