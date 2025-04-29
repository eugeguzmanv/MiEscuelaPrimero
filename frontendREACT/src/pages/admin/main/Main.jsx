import React, { useState } from 'react';
import Header from '../../../components/Header';
import PerfilAdmin from './PerfilAdmin';
import EscuelasAdmin from './EscuelasAdmin';
import AliadosAdmin from './AliadosAdmin';
import ProyectosAdmin from './ProyectosAdmin';
import styles from './Main.module.css';

const Main = () => {
  const [activeTab, setActiveTab] = useState('perfil');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.dashboardContainer}>
      <Header />
      <div className={styles.dashboardContent}>
        <div className={styles.sideMenu}>
          <nav>
            <a 
              href="#" 
              className={`${styles.menuItem} ${activeTab === 'perfil' ? styles.active : ''}`} 
              onClick={(e) => {
                e.preventDefault();
                handleTabChange('perfil');
              }}
            >
              Perfil
            </a>
            <a 
              href="#" 
              className={`${styles.menuItem} ${activeTab === 'escuelas' ? styles.active : ''}`} 
              onClick={(e) => {
                e.preventDefault();
                handleTabChange('escuelas');
              }}
            >
              Escuelas
            </a>
            <a 
              href="#" 
              className={`${styles.menuItem} ${activeTab === 'aliados' ? styles.active : ''}`} 
              onClick={(e) => {
                e.preventDefault();
                handleTabChange('aliados');
              }}
            >
              Aliados
            </a>
            <a 
              href="#" 
              className={`${styles.menuItem} ${activeTab === 'proyectos' ? styles.active : ''}`} 
              onClick={(e) => {
                e.preventDefault();
                handleTabChange('proyectos');
              }}
            >
              Proyectos
            </a>
          </nav>
        </div>
        <main className={styles.mainContent}>
          {activeTab === 'perfil' && (
            <div id="perfil-section" className={styles.contentSection}>
              <PerfilAdmin />
            </div>
          )}
          {activeTab === 'escuelas' && (
            <div id="escuelas-section" className={styles.contentSection}>
              <EscuelasAdmin />
            </div>
          )}
          {activeTab === 'aliados' && (
            <div id="aliados-section" className={styles.contentSection}>
              <AliadosAdmin />
            </div>
          )}
          {activeTab === 'proyectos' && (
            <div id="proyectos-section" className={styles.contentSection}>
              <ProyectosAdmin />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Main; 