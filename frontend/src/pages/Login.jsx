import { useState } from "react";
import { loginUser } from "../services/api";
import "./login.css";

export default function Login({ onSuccess, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async () => {
    setErr("");
    try {
      await loginUser(email, password); // token kaydedildi
      onSuccess?.(); // 👈 App'e "giriş yaptım" de
    } catch (e) {
      setErr("Login failed");
    }
  };

  return (
    <div className="login-container">
      <button
        onClick={onClose}
        className="login-close-button"
      >
        ✕
      </button>
      <h2 className="login-title">Login</h2>
      {err && <p>{err}</p>}

      <input
        className="login-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="login-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />
      <button
        className="login-btn"
        onClick={submit}
      >
        Login
      </button>
    </div>
  );
}
