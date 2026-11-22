import ConsumerHeader from "../../components/consumer/ConsumerHeader.jsx";
import BottomNav from "../../components/consumer/BottomNav.jsx";
import { useNav } from "../../lib/nav.js";
import { CONSUMER_NAME } from "../../lib/consumer.js";

// Tidak ada frame Profile di Figma: layar sederhana untuk ganti tipe akun dan keluar.
export default function Profile() {
  const { switchAccount, logout } = useNav();
  return (
    <div className="cscreen">
      <ConsumerHeader avatar={false} />
      <div className="cbody center-col">
        <span className="bigavatar">{CONSUMER_NAME.split(" ").map((w) => w[0]).join("")}</span>
        <h1 className="ptitle center">{CONSUMER_NAME}</h1>
        <p className="psub">Consumer / Buyer account</p>
        <div className="pactions">
          <button className="pbtn-light wide" onClick={switchAccount}>Switch account type</button>
          <button className="pbtn-green wide" onClick={logout}>Log out</button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
