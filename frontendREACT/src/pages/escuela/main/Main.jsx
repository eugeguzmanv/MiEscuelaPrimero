import React, { useState } from 'react';
import Header from '../../../components/Header';
import PerfilSection from './PerfilSection';
import AliadosSection from './AliadosSection';
import ProyectosSection from './ProyectosSection';
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
            <a 
              href="#" 
              className={`${styles.menuItem} ${activeTab === 'necesidades' ? styles.active : ''}`} 
              onClick={(e) => {
                e.preventDefault();
                handleTabChange('necesidades');
              }}
            >
              Necesidades
            </a>
          </nav>
        </div>
        <main className={styles.mainContent}>
          {activeTab === 'perfil' && (
            <div id="perfil-section" className={styles.contentSection}>
              <PerfilSection />
            </div>
          )}
          {activeTab === 'aliados' && (
            <div id="aliados-section" className={styles.contentSection}>
              <AliadosSection />
            </div>
          )}
          {activeTab === 'proyectos' && (
            <div id="proyectos-section" className={styles.contentSection}>
              <ProyectosSection />
            </div>
          )}
          {activeTab === 'necesidades' && (
            <div id="necesidades-section" className={styles.contentSection}>
              <h2>Necesidades Content Coming Soon</h2>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Main; 