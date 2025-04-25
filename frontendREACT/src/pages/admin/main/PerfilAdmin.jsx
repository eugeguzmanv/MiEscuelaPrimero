import React, { useState, useEffect } from 'react';
import styles from './PerfilAdmin.module.css';

const PerfilAdmin = () => {
  const [adminData, setAdminData] = useState({
    nombre: '',
    correo: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        // First check session storage
        const storedAdminData = sessionStorage.getItem('adminData');
        const userEmail = sessionStorage.getItem('userEmail');
        
        console.log("Session storage data:", { storedAdminData, userEmail });
        
        if (storedAdminData) {
          // If we have the full admin data object stored during registration
          try {
            const parsedData = JSON.parse(storedAdminData);
            setAdminData({
              nombre: parsedData.nombre || '',
              correo: parsedData.correo || parsedData.correo_electronico || ''
            });
            console.log("Using stored admin data:", parsedData);
          } catch (parseError) {
            console.error("Error parsing stored admin data:", parseError);
            setError("Error al leer datos almacenados");
            
            // If we have the email, we can still display that
            if (userEmail) {
              setAdminData(prevData => ({
                ...prevData,
                correo: userEmail
              }));
            }
          }
          setIsLoading(false);
        } else if (userEmail) {
          console.log("Fetching admin data for email:", userEmail);
          
          // Set email from session storage immediately so we have something to display
          setAdminData(prevData => ({
            ...prevData,
            correo: userEmail
          }));
          
          // Try to fetch additional data from API, but don't block UI on it
          try {
            const response = await fetch(`http://localhost:1000/api/admin/perfil?email=${userEmail}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              }
            });

            console.log("API response status:", response.status);
            
            if (!response.ok) {
              throw new Error(`Error al obtener datos: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("API response data:", data);
            
            // Update state with fetched data
            setAdminData({
              nombre: data.nombre || '',
              correo: data.correo_electronico || userEmail
            });
            
            // Store data in session storage for future reference
            sessionStorage.setItem('adminData', JSON.stringify({
              nombre: data.nombre,
              correo: data.correo_electronico
            }));
            
          } catch (fetchError) {
            console.error('Error fetching admin data:', fetchError);
            // Show error but don't interrupt display of basic information
            setError('No se pudieron cargar todos los datos desde el servidor.');
          }
          setIsLoading(false);
        } else {
          // No data available
          console.log("No user data found in session storage");
          setError('No se encontraron datos de sesión. Por favor, inicie sesión nuevamente.');
          setIsLoading(false);
        }
      } catch (e) {
        console.error('Error loading admin data:', e);
        setError('Ocurrió un error al cargar los datos');
        setIsLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const handleEditClick = () => {
    // Future implementation for editing admin information
    alert('Funcionalidad en desarrollo');
  };

  if (isLoading) {
    return <div className={styles.perfilContainer}>Cargando datos...</div>;
  }

  return (
    <div className={styles.perfilContainer}>
      <h2>Perfil del Administrador</h2>
      
      {error && (
        <div style={{ 
          color: 'white', 
          backgroundColor: '#d9534f', 
          padding: '10px', 
          borderRadius: '5px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}
      
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <label>Nombre:</label>
          <p>{adminData.nombre || 'No disponible'}</p>
        </div>
        <div className={styles.infoItem}>
          <label>Correo:</label>
          <p>{adminData.correo || 'No disponible'}</p>
        </div>
        <div className={styles.infoItem}>
          
        </div>
      </div>
      <button className={styles.editButton} onClick={handleEditClick}>Editar información</button>
    </div>
  );
};

export default PerfilAdmin;