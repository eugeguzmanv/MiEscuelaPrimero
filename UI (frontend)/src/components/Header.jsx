import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="menu">
      <img id="logo" alt="Logo" src="/images/logo.png" width="70px" />
      <h1>Mexicanos Primero Jalisco</h1>
      {isHomePage && (
        <ul>
          <li><a href="#sobre-nosotros">Nosotros</a></li>
          <li><a href="#contacto">Contacto</a></li>
          <li><Link to="/registro">Registro</Link></li>
          <li><Link to="/iniciar-sesion">Iniciar sesión</Link></li>
        </ul>
      )}
    </div>
  );
};

export default Header; 