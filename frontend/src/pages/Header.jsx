import "./Header.css"
function Header() {
  return (
    <header className="header-container">
      <h1 className="site-title">FinSight AI</h1>
      <nav>
        <button className="register-button">Register</button>
        <button className="login-button">Login</button>
      </nav>
    </header>
  );
}

export default Header;
