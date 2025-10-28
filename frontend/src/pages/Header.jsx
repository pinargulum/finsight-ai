import "./Header.css"
import { useState } from "react";
import Login from "./Login";
function Header({ logingForm, registerForm }) {

  return (
    <header className="header-container">
      <h1 className="site-title">FinSight AI</h1>
      <nav>
        <button onClick={registerForm} className="register-button">Register</button>
        <button onClick={logingForm} className="login-button">Login</button>
      </nav>
    
    </header>
  );
}

export default Header;
