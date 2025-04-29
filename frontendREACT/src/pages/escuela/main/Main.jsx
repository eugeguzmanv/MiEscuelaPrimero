import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import PerfilSection from './PerfilSection';
import AliadosSection from './AliadosSection';
import ProyectosSection from './ProyectosSection';
import NecesidadesSection from './NecesidadesSection';
import styles from './Main.module.css';

const Main = () => {
  const [activeTab, setActiveTab] = useState('perfil');
  const [escuelaData, setEscuelaData] = useState(null);

  useEffect(() => {
    const fetchEscuelaData = async () => {
      try {
        const userEmail = sessionStorage.getItem('userEmail');
        console.log('User email from session:', userEmail);
        
        if (!userEmail) {
          console.log('No user email found in session');
          return;
        }

        // First, get the representante data to get the CCT
        const repreResponse = await fetch(`http://localhost:1000/api/representante/mail/${userEmail}`);
        if (!repreResponse.ok) {
          console.error('Error fetching representante:', repreResponse);
          return;
        }

        const repreData = await repreResponse.json();
        console.log('Representante data:', repreData);

        if (!repreData.CCT) {
          console.log('No CCT found in representante data');
          return;
        }

        console.log('Fetching escuela data for CCT:', repreData.CCT);
        const response = await fetch(`http://localhost:1000/api/escuela/${repreData.CCT}`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          console.error('Error response:', response);
          throw new Error('Error al obtener datos de la escuela');
        }
        
        const data = await response.json();
        console.log('Escuela data received:', data);
        setEscuelaData(data);
      } catch (error) {
        console.error('Error fetching escuela data:', error);
      }
    };

    fetchEscuelaData();
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
              <AliadosSection escuelaData={escuelaData} />
            </div>
          )}
          {activeTab === 'proyectos' && (
            <div id="proyectos-section" className={styles.contentSection}>
              <ProyectosSection escuelaData={escuelaData} />
            </div>
          )}
          {activeTab === 'necesidades' && (
            <div id="necesidades-section" className={styles.contentSection}>
              <NecesidadesSection />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Main; 