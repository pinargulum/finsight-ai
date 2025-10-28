import { useState } from "react";
//import { login } from "../services/auth";
import "../pages/Login.css";

function Login({ showForm, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      {showForm && (
        <div className="login-container">
          <button
            onClick={onClose}
            className="login-close-button"
          >
            ✕
          </button>
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
          <button className="login-btn">Login</button>
        </div>
      )}
    </>
  );
}
export default Login;
