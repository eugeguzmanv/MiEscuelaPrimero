import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import PerfilSection from './PerfilSection';
import AliadosSection from './AliadosSection';
import ProyectosSection from './ProyectosSection';
import NecesidadesSection from './NecesidadesSection';
import MapaEscuelas from './MapaEscuelas';
import styles from './Main.module.css';

const Main = () => {
  const [activeTab, setActiveTab] = useState('perfil');
  const [escuelaData, setEscuelaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEscuelaData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to get CCT from URL first
        const urlParams = new URLSearchParams(window.location.search);
        let cct = urlParams.get('cct');
        
        // If no CCT in URL, try to get from user email
        if (!cct) {
          const userEmail = sessionStorage.getItem('userEmail');
          console.log('User email from session:', userEmail);
          
          if (!userEmail) {
            throw new Error('No se encontró información de usuario');
          }

          // Get the representante data to get the CCT
          const repreResponse = await fetch(`http://localhost:1000/api/representante/mail/${encodeURIComponent(userEmail)}`);
          if (!repreResponse.ok) {
            throw new Error('Error al obtener datos del representante');
          }

          const repreData = await repreResponse.json();
          console.log('Representante data:', repreData);

          if (!repreData.CCT) {
            throw new Error('No se encontró el CCT en los datos del representante');
          }

          cct = repreData.CCT;
        }

        console.log('Fetching escuela data for CCT:', cct);
        const response = await fetch(`http://localhost:1000/api/escuela/${encodeURIComponent(cct)}`);
        
        if (!response.ok) {
          throw new Error('Error al obtener datos de la escuela');
        }
        
        const data = await response.json();
        console.log('Escuela data received:', data);
        setEscuelaData(data);
      } catch (error) {
        console.error('Error fetching escuela data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEscuelaData();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'perfil':
        return <PerfilSection escuelaData={escuelaData} />;
      case 'aliados':
        return <AliadosSection escuelaData={escuelaData} />;
      case 'proyectos':
        return <ProyectosSection escuelaData={escuelaData} />;
      case 'necesidades':
        return <NecesidadesSection escuelaData={escuelaData} />;
      case 'mapa':
        return <MapaEscuelas />;
      default:
        return <PerfilSection />;
    }
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Cargando datos de la escuela...</div>;
  }

  if (error) {
    return <div className={styles.errorContainer}>{error}</div>;
  }

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
          <div className={styles.contentSection}>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Main; 