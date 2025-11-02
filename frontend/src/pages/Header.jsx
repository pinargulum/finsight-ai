import "./Header.css";

function Header({
  logingForm,
  registerForm,
  user,
  onLogout,
}) {
  // user'dan güvenli şekilde isim çek
  const email =
    user?.email ||
    user?.username ||
    user?.name ||
    user?.user?.email ||
    "";

  const firstLetter = email ? email.charAt(0).toUpperCase() : "";

  return (
    <header className="header-container">
      <h1 className="site-title">FinSight AI</h1>

      {!user ? (
        <nav>
          <button onClick={registerForm} className="register-button">
            Register
          </button>
          <button onClick={logingForm} className="login-button">
            Login
          </button>
        </nav>
      ) : (
        <div className="user-box">
          <div className="avatar" title={email}>
            {firstLetter || "?"}
          </div>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
