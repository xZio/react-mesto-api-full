import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../images/header-logo.svg";

function Header({ userEmail, loggedIn, handleLogout }) {
  const location = useLocation();

  return (
    <header className="header">
      <img src={logo} alt="Логотип Место" className="header__logo" />
      <div className="header__container">
        {loggedIn && <p className="header__email">{userEmail}</p>}

        {location.pathname === "/sign-in" && (
          <Link to="sign-up" className="header__link">
            Регистрация
          </Link>
        )}
        {location.pathname === "/sign-up" && (
          <Link to="sign-in" className="header__link">
            Войти
          </Link>
        )}
        {location.pathname === "/" && (
          <Link to="/" className="header__link" onClick={handleLogout}>
            Выйти
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
