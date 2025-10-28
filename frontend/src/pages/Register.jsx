import "../pages/Register.css";
function Register({ showRegisterForm, onClose }) {
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
          <input
            className="register-input"
            placeholder="Name"
          />
          <input
            className="register-input"
            placeholder="Email"
            type="password"
          />
          <input
            className="register-input"
            placeholder="Password"
            type="password"
          />
          <button className="login-btn">Register</button>
        </div>
      )}
    </>
  );
}
export default Register;
