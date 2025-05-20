import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/ChooseProfile.css';

const ChooseProfile = () => {
  return (
    <>
      <Header />
      <div className="profile-header">
        <p>Elige quién eres</p>
      </div>
      
      <table>
        <tbody>
          <tr>
            <td>
              <div className="profile_selection">
                <div className="profile-option">
                  <Link to="/admin/registro" className="profile">
                    <img src="/images/administrator_profile.png" alt="Administrador" />
                    <h3>Administrador</h3>
                  </Link>
                </div>
              </div>
            </td>
            <td>
              <div className="profile_selection">
                <div className="profile-option">
                  <Link to="/escuela/opciones-registro" className="profile">
                    <img src="/images/school_profile.png" alt="Escuela" />
                    <h3>Escuela</h3>
                  </Link>
                </div>
              </div>
            </td>
            <td>
              <div className="profile_selection">
                <div className="profile-option">
                  <Link to="/aliado/opciones-registro" className="profile">
                    <img src="/images/ally_profile.png" alt="Aliado" />
                    <h3>Aliado</h3>
                  </Link>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default ChooseProfile; 