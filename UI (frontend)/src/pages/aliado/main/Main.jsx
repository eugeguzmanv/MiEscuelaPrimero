import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import PerfilAliado from './PerfilAliado';
import EscuelasAliado from './EscuelasAliado';
import ProyectosAliado from './ProyectosAliado';
import ApoyosSection from './ApoyosSection';
import MapaAliados from './MapaAliados';
import styles from './Main.module.css';

const Main = () => {
  const [activeTab, setActiveTab] = useState('perfil');
  const [aliadoData, setAliadoData] = useState(null);

  useEffect(() => {
    const fetchAliadoData = async () => {
      try {
        const userEmail = sessionStorage.getItem('userEmail');
        console.log('User email from session:', userEmail);
        
        if (!userEmail) {
          console.log('No user email found in session');
          return;
        }

        const response = await fetch(`http://localhost:1000/api/aliadoCor/${userEmail}`);
        if (!response.ok) {
          console.error('Error fetching aliado:', response);
          return;
        }

        const data = await response.json();
        console.log('Aliado data received:', data);
        setAliadoData(data);
      } catch (error) {
        console.error('Error fetching aliado data:', error);
      }
    };

    fetchAliadoData();
  }, []);

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
              Escuelas
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
              className={`${styles.menuItem} ${activeTab === 'apoyos' ? styles.active : ''}`} 
              onClick={(e) => {
                e.preventDefault();
                handleTabChange('apoyos');
              }}
            >
              Apoyos
            </a>
            <a 
              href="#" 
              className={`${styles.menuItem} ${activeTab === 'mapa' ? styles.active : ''}`} 
              onClick={(e) => {
                e.preventDefault();
                handleTabChange('mapa');
              }}
            >
              Mapa
            </a>
          </nav>
        </div>
        <main className={styles.mainContent}>
          {activeTab === 'perfil' && (
            <div id="perfil-section" className={styles.contentSection}>
              <PerfilAliado />
            </div>
          )}
          {activeTab === 'aliados' && (
            <div id="aliados-section" className={styles.contentSection}>
              <EscuelasAliado aliadoData={aliadoData} />
            </div>
          )}
          {activeTab === 'proyectos' && (
            <div id="proyectos-section" className={styles.contentSection}>
              <ProyectosAliado aliadoData={aliadoData} />
            </div>
          )}
          {activeTab === 'apoyos' && (
            <div id="apoyos-section" className={styles.contentSection}>
              <ApoyosSection />
            </div>
          )}
          {activeTab === 'mapa' && (
            <div id="mapa-section" className={styles.contentSection}>
              <MapaAliados />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Main; 