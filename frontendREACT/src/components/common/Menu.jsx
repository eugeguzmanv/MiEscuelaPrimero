import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Menu.css';

const Menu = ({ userType }) => {
  return (
    <div className="menu">
      <img id="logo" alt="Logo" src="/images/logo.png" width="70px" />
      <h1>Mexicanos Primero Jalisco</h1>
      
      {!userType ? (
        // Public menu
        <ul>
          <li><a href="#sobre-nosotros">Nosotros</a></li>
          <li><a href="#contacto">Contacto</a></li>
          <li><Link to="/registro">Registro</Link></li>
          <li><Link to="/iniciar-sesion">Iniciar sesión</Link></li>
        </ul>
      ) : (
        // Dashboard menu - changes based on user type
        <div className="side-menu">
          <nav>
            <Link to="/perfil" className="menu-item">Perfil</Link>
            {userType === 'escuela' && (
              <Link to="/aliados" className="menu-item">Aliados</Link>
            )}
            {userType === 'aliado' && (
              <Link to="/escuelas" className="menu-item">Escuelas</Link>
            )}
            <Link to="/proyectos" className="menu-item">Proyectos</Link>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Menu; 