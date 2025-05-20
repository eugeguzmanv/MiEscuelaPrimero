import React from 'react';
import Menu from './Menu';
import '../../styles/Layout.css';

const Layout = ({ children, userType }) => {
  return (
    <div className="layout">
      <Menu userType={userType} />
      <div className="main-content">
        {children}
      </div>
      {!userType && (
        <footer className="footer" id="contacto">
          <h3>Contacto</h3>
          <div className="footer-content">
            <img className="logotipo" src="/images/logo.png" alt="Logo" width="100px" />
            <table>
              <tbody>
                <tr>
                  <td><b>Rosalba Gascón</b></td>
                  <td><b>Ricardo Lamas</b></td>
                  <td className="social_media">
                    <img className="icons" src="/images/web.png" alt="Web" />
                    <a href="https://mexicanosprimerojalisco.org/">https://mexicanosprimerojalisco.org/</a>
                  </td>
                </tr>
                <tr>
                  <td>Mi Escuela Primero</td>
                  <td>Mi Escuela Primero</td>
                  <td className="social_media">
                    <img className="icons" src="/images/facebook.png" alt="Facebook" />
                    <a href="#">@MexPrimJal</a>
                  </td>
                </tr>
                <tr>
                  <td>rgascon@mpj.org.mx</td>
                  <td>ricardol@mpj.org.mx</td>
                  <td className="social_media">
                    <img className="icons" src="/images/instagram.png" alt="Instagram" />
                    <a href="#">@mexicanosprimjal</a>
                  </td>
                </tr>
                <tr>
                  <td>33 1177 8783</td>
                  <td>33 1177 2832</td>
                  <td className="social_media">
                    <img className="icons" src="/images/x.png" alt="X" />
                    <a href="#">@Mexicanos1oJal</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="location">
            <img className="icons" src="/images/ubicacion.png" alt="Ubicación" />
            <p>C. Prado de los Cedros 1500, Cd del Sol, 45050 Zapopan, Jal.</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout; 