import { useState } from "react";
//import { login } from "../services/auth";
import "../pages/Login.css";
import { loginUser } from "../services/api";

function Login({ showForm, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      // data: { id: "...", email: "..." }
      setSuccess("Logged in ✅");
      setEmail("");
      setPassword("");
    } catch (err) {
      // FastAPI hata gönderince buraya düşer
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
      setSuccess("");
      onClose();
    }
  };

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
          {error && (
            <p className="mb-3 text-red-600 text-sm bg-red-50 p-2 rounded">
              {error}
            </p>
          )}
          {success && (
            <p className="mb-3 text-green-600 text-sm bg-green-50 p-2 rounded">
              {success}
            </p>
          )}
          <form onSubmit={handleSubmit}>
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
            <button
            type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? "loading..." : "Login"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
export default Login;
