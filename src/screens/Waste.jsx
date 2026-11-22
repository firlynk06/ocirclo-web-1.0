import AppHeader from "../components/AppHeader.jsx";
import { RefreshCw, Clock, Scale, AlertCircle, Recycle, Box } from "../components/icons.jsx";
import { PARTNERS, BASE } from "../lib/waste.js";
import { useNav } from "../lib/nav.js";

// Waste Recovery Network (Figma 37:229)
export default function Waste({ requests }) {
  const { go } = useNav();
  const added = requests.filter((r) => r.added);
  const stats = [
    [RefreshCw, BASE.partners, "Recovery Partners"],
    [Clock, BASE.requests + added.length, "Recovery Requests"],
    [Scale, `${BASE.recovered} kg`, "Waste Recovered"],
    [AlertCircle, BASE.pending + added.length, "Pending Requests"],
  ];
  return (
    <div className="screen">
      <AppHeader />
      <div className="wst">
        <h1 className="b-title">Waste Recovery</h1>
        <p className="wst-sub">Give unsold products a second chance.</p>
        <h2 className="wst-h">Recovery Overview</h2>
        <p className="wst-s">Monitor your waste recovery activities.</p>
        <div className="wst-stats">
          {stats.map(([I, v, l]) => (
            <div key={l} className="wst-stat"><I size={20} color="#fff" /><b>{v}</b><span>{l}</span></div>
          ))}
        </div>
        <h2 className="wst-h">Available Recovery Partners</h2>
        <p className="wst-s">Explore our waste processing partners.</p>
        {PARTNERS.map((p) => (
          <div key={p.id} className="wst-partner">
            <div className="wp-top">
              <span className="wp-ic">{p.icon === "box" ? <Box size={24} color="#5e7a1c" /> : <Recycle size={24} color="#5e7a1c" />}</span>
              <div><b>{p.name}</b><span>{p.desc}</span></div>
              <i className="wp-ver">Verified Partner</i>
            </div>
            <div className="wp-bot">
              <div><span className="wp-acc">Accepted materials</span><div className="wp-tags">{p.materials.map((m) => <em key={m}>{m}</em>)}</div></div>
              <button onClick={() => {}}>View Partner Details →</button>
            </div>
          </div>
        ))}
        <div className="wst-reqh"><h2 className="wst-h">My Recovery Requests</h2><button onClick={() => {}}>View All →</button></div>
        {requests.slice(0, 4).map((r) => (
          <div key={r.id} className="wst-req">
            <div><b>{r.id}</b><i className={r.status === "Pending" ? "pend" : "done"}>{r.status}</i></div>
            <p>{r.what} · {r.kg} kg</p>
            <span>{r.partner} · {r.date}</span>
          </div>
        ))}
        <button className="wst-submit" onClick={() => go("wastesubmit")}><Clock size={14} color="#fff" /> Submit Recovery Request</button>
      </div>
    </div>
  );
}
