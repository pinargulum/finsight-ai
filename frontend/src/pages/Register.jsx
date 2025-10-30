import { useState } from "react";
import "../pages/Register.css";
import { registerUser } from "../services/api";
function Register({ showRegisterForm, onClose, handleRegister }) {
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
      const data = await registerUser(email, password);
      // data: { id: "...", email: "..." }
      setSuccess("Account created ✅");
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
      {showRegisterForm && (
        <div className="register-container">
          <button
            onClick={onClose}
            className="register-close-button"
          >
            ✕
          </button>
          <h2 className="register-title">Register</h2>
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
              value={email}
              className="register-input"
              placeholder="Email"
              required
              type="password"
              onChange={(e) => setEmail(e.target.value) || ""}
            />
            <input
              value={password}
              className="register-input"
              placeholder="Password"
              type="password"
              required
              onChange={(e) => setPassword(e.target.value) || ""}
            />
            <button
              type="summit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Creating..." : "Register"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
export default Register;
