import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './PerfilSection.module.css';

const PerfilSection = () => {
  const [escuelaData, setEscuelaData] = useState(null);
  const [representantes, setRepresentantes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Try to get the CCT from URL parameters (from registration flow)
        const params = new URLSearchParams(location.search);
        let cct = params.get('cct');
        
        console.log("CCT from URL:", cct); // Debug log
        
        // If no CCT in URL, try to get the user email from session storage (from login flow)
        if (!cct) {
          const userEmail = sessionStorage.getItem('userEmail');
          const userProfile = sessionStorage.getItem('userProfile');
          
          console.log("Email from session:", userEmail); // Debug log
          
          if (!userEmail || userProfile !== 'escuela') {
            throw new Error('No se encontró información de la escuela. Por favor inicie sesión nuevamente.');
          }
          
          // First fetch the representante data using the email
          const representanteResponse = await fetch(`http://localhost:1000/api/representante/mail/${encodeURIComponent(userEmail)}`);
          
          if (!representanteResponse.ok) {
            throw new Error('No se pudo obtener información del representante');
          }
          
          const representanteData = await representanteResponse.json();
          
          // Get the CCT from the representante data
          cct = representanteData.CCT;
          
          console.log("CCT from representante:", cct); // Debug log
          
          if (!cct) {
            throw new Error('No se encontró el CCT de la escuela asociada');
          }
        }
        
        // Now fetch the school data using the CCT
        console.log("Fetching school data with CCT:", cct); // Debug log
        
        const escuelaResponse = await fetch(`http://localhost:1000/api/escuela/${encodeURIComponent(cct)}`);
        
        if (!escuelaResponse.ok) {
          throw new Error('No se pudo obtener información de la escuela');
        }
        
        const escuelaData = await escuelaResponse.json();
        console.log("Escuela data received:", escuelaData); // Debug log
        
        setEscuelaData(escuelaData);
        
        // Fetch all representantes for this school
        try {
          console.log("Fetching representantes with CCT:", cct); // Debug log
          
          const representantesResponse = await fetch(`http://localhost:1000/api/representantes/escuela/${encodeURIComponent(cct)}`);
          
          if (representantesResponse.ok) {
            const representantesData = await representantesResponse.json();
            console.log("Representantes data received:", representantesData); // Debug log
            
            setRepresentantes(representantesData);
          } else {
            console.log('No se encontraron representantes para esta escuela');
            setRepresentantes([]);
          }
        } catch (repError) {
          console.error('Error al obtener representantes:', repError);
          setRepresentantes([]);
          // Not setting the main error here as we still have the school data
        }
      } catch (error) {
        console.error('Error fetching school data:', error);
        setError(error.message || 'Error al cargar los datos de la escuela');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [location.search, navigate]);
  
  if (isLoading) {
    return <div className={styles.loadingContainer}>Cargando información de la escuela...</div>;
  }
  
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <button 
          className={styles.editButton} 
          onClick={() => navigate('/login')}
        >
          Volver al inicio de sesión
        </button>
      </div>
    );
  }
  
  if (!escuelaData) {
    return <div className={styles.errorContainer}>No se encontró información de la escuela</div>;
  }

  // Function to render representante role with appropriate article
  const getRolWithArticle = (rol) => {
    if (!rol) return 'No disponible';
    const rolLower = rol.toLowerCase();
    if (rolLower === 'director' || rolLower === 'subdirector') {
      return `${rol}`;
    } else if (rolLower.startsWith('a') || rolLower.startsWith('e') || 
              rolLower.startsWith('i') || rolLower.startsWith('o') || 
              rolLower.startsWith('u')) {
      return `${rol}`;
    } else {
      return `${rol}`;
    }
  };

  return (
    <div className={styles.perfilContainer}>
      <h2>Perfil de Escuela</h2>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <label>Nombre de la Escuela:</label>
          <p>{escuelaData.nombre || 'No disponible'}</p>
        </div>
        <div className={styles.infoItem}>
          <label>Clave (CCT):</label>
          <p>{escuelaData.CCT || 'No disponible'}</p>
        </div>
        <div className={styles.infoItem}>
          <label>Nivel Educativo:</label>
          <p>{escuelaData.nivel_educativo || 'No disponible'}</p>
        </div>
        <div className={styles.infoItem}>
          <label>Modalidad:</label>
          <p>{escuelaData.modalidad || 'No disponible'}</p>
        </div>
        <div className={styles.infoItem}>
          <label>Control administrativo:</label>
          <p>{escuelaData.control_administrativo || 'No disponible'}</p>
        </div>
        <div className={styles.infoItem}>
          <label>Sostenimiento:</label>
          <p>{escuelaData.sostenimiento || 'No disponible'}</p>
        </div>
        <div className={styles.infoItem}>
          <label>Zona escolar:</label>
          <p>{escuelaData.zona_escolar || 'No disponible'}</p>
        </div>
        <div className={styles.infoItem}>
          <label>Número de estudiantes:</label>
          <p>{escuelaData.numero_estudiantes ? escuelaData.numero_estudiantes.toString() : 'No disponible'}</p>
        </div>
      </div>
      
      <div className={styles.sectionSubtitle}>Dirección</div>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <label>Calle:</label>
          <p>{escuelaData.calle || 'No disponible'}</p>
        </div>
        <div className={styles.infoItem}>
          <label>Número:</label>
          <p>{escuelaData.numero || 'No disponible'}</p>
        </div>
        <div className={styles.infoItem}>
          <label>Colonia:</label>
          <p>{escuelaData.colonia || 'No disponible'}</p>
        </div>
        <div className={styles.infoItem}>
          <label>Municipio:</label>
          <p>{escuelaData.municipio || 'No disponible'}</p>
        </div>
      </div>
      
      <div className={styles.descripcionContainer}>
        <label>Descripción:</label>
        <p>{escuelaData.descripcion || 'No disponible'}</p>
      </div>

      <h3>Representantes de la Escuela</h3>
      
      {representantes.length > 0 ? (
        representantes.map((representante, index) => (
          <div key={representante.idRepresentante || index} className={styles.representanteCard}>
            <h4>{representante.nombre} - {getRolWithArticle(representante.rol)}</h4>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>Correo electrónico:</label>
                <p>{representante.correo_electronico || 'No disponible'}</p>
              </div>
              <div className={styles.infoItem}>
                <label>Teléfono:</label>
                <p>{representante.numero_telefonico || 'No disponible'}</p>
              </div>
              <div className={styles.infoItem}>
                <label>Años de servicio:</label>
                <p>{representante.anios_experiencia ? `${representante.anios_experiencia} años` : 'No disponible'}</p>
              </div>
              <div className={styles.infoItem}>
                <label>Cambio de zona escolar:</label>
                <p>{representante.cambio_zona ? 'Sí' : 'No'}</p>
              </div>
              <div className={styles.infoItem}>
                <label>Próximo a jubilarse:</label>
                <p>{representante.proximo_a_jubilarse ? 'Sí' : 'No'}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className={styles.emptyState}>
          <p>No hay representantes registrados para esta escuela.</p>
        </div>
      )}

      <button className={styles.editButton}>Editar información</button>
    </div>
  );
};

export default PerfilSection;