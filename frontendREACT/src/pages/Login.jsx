import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/Login.css';

const Login = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add login logic here
  };

  return (
    <>
      <Header />
      <div className="register-content">
        <div className="form-container">
          <div className="form-fields">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="email">Correo:</label>
              <input type="email" id="email" name="email" required />
              
              <label htmlFor="password">Contraseña:</label>
              <input type="password" id="password" name="password" required />
              
              <button type="submit">Ingresar</button>
              <p>
                <Link to="/recuperar-contrasena" style={{ color: '#009933' }}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </p>
            </form>
          </div>
          <div className="form-image">
            <img src="/images/cuenta_administrador.png" alt="Iniciar Sesión" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login; 