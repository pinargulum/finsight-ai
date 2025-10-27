import { useState } from "react";
//import { login } from "../services/auth";
import "../pages/Login.css"; 

function Login({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async () => {
    setErr("");
    try { await login(email, password); onSuccess?.(); }
    catch (e) { setErr("Login failed"); }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <input
        className="login-input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="login-input"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="login-btn" onClick={submit}>
        Login
      </button>
      {err && <p className="login-error">{err}</p>}
    </div>
  );
}
export default Login