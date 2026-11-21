import { useState } from "react";
import Logo from "../components/Logo.jsx";

const Google = () => (
  <svg width="31" height="31" viewBox="0 0 24 24" aria-label="Google">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);
const Apple = () => (
  <svg width="31" height="31" viewBox="0 0 24 24" aria-label="Apple">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
  </svg>
);
const Facebook = () => (
  <svg width="31" height="31" viewBox="0 0 24 24" aria-label="Facebook">
    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

// Sign In mengikuti Figma 22:3. Sign Up belum ada di Figma: memakai tata letak yang sama (ditambah kolom nama).
// Login hanya SIMULASI untuk demo: isian apa pun diterima.
export default function Auth({ mode, go, onSignedIn }) {
  const up = mode === "signup";
  const [via, setVia] = useState("email"); // "email" | "phone"
  const submit = (e) => { e.preventDefault(); onSignedIn(); };

  return (
    <div className="gate auth">
      <Logo />
      <p className="auth-lead">{up ? "Create your account to get started" : "Enter your registered account to sign in"}</p>

      <div className="tabs" role="tablist">
        <button type="button" role="tab" aria-selected={via === "email"} className={via === "email" ? "on" : ""} onClick={() => setVia("email")}>Email</button>
        <button type="button" role="tab" aria-selected={via === "phone"} className={via === "phone" ? "on" : ""} onClick={() => setVia("phone")}>Phone Number</button>
      </div>

      <form onSubmit={submit}>
        {up && (
          <div className="field"><label htmlFor="f-name">Full Name</label><input id="f-name" autoComplete="name" /></div>
        )}
        <div className="field">
          <label htmlFor="f-id">{via === "email" ? "Email" : "Phone Number"}</label>
          <input id="f-id" key={via} type={via === "email" ? "email" : "tel"} inputMode={via === "email" ? "email" : "tel"} autoComplete={via === "email" ? "email" : "tel"} />
        </div>
        <div className="field">
          <label htmlFor="f-pw">Password</label>
          <input id="f-pw" type="password" autoComplete={up ? "new-password" : "current-password"} />
        </div>
        {!up && <button type="button" className="forgot">Forgot Password?</button>}
        {up && <div style={{ height: 22 }} />}
        <button type="submit" className="btn-green">{up ? "Sign Up" : "Sign In"}</button>
      </form>

      <p className="or">Or continue with</p>
      <div className="social">
        <button type="button" onClick={onSignedIn}><Google /></button>
        <button type="button" onClick={onSignedIn}><Apple /></button>
        <button type="button" onClick={onSignedIn}><Facebook /></button>
      </div>

      <p className="switch">
        {up ? "Already have an account? " : "Don't have an account? "}
        <button type="button" onClick={() => go(up ? "signin" : "signup")}>{up ? "Sign In" : "Sign Up"}</button>
      </p>
    </div>
  );
}
