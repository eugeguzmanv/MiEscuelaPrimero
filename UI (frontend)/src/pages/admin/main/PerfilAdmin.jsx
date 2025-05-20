import React, { useState, useEffect } from 'react';
import styles from './PerfilAdmin.module.css';

const PerfilAdmin = () => {
  const [adminData, setAdminData] = useState({
    idAdmin: '',
    nombre: '',
    correo: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedAdmin, setEditedAdmin] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const storedAdminData = sessionStorage.getItem('adminData');
        const userEmail = sessionStorage.getItem('userEmail');
        
        console.log("Session storage data:", { storedAdminData, userEmail });
        
        if (storedAdminData) {
          try {
            const parsedData = JSON.parse(storedAdminData);
            setAdminData({
              idAdmin: parsedData.idAdmin || '',
              nombre: parsedData.nombre || '',
              correo: parsedData.correo || parsedData.correo_electronico || ''
            });
            console.log("Using stored admin data:", parsedData);
          } catch (parseError) {
            console.error("Error parsing stored admin data:", parseError);
            setError("Error al leer datos almacenados");
            
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
          
          setAdminData(prevData => ({
            ...prevData,
            correo: userEmail
          }));
          
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
            
            setAdminData({
              idAdmin: data.idAdmin || '',
              nombre: data.nombre || '',
              correo: data.correo_electronico || userEmail
            });
            
            sessionStorage.setItem('adminData', JSON.stringify({
              idAdmin: data.idAdmin,
              nombre: data.nombre,
              correo: data.correo_electronico
            }));
            
          } catch (fetchError) {
            console.error('Error fetching admin data:', fetchError);
            setError('No se pudieron cargar todos los datos desde el servidor.');
          }
          setIsLoading(false);
        } else {
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

  const handleOpenEditModal = () => {
    setEditedAdmin({...adminData});
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setUpdateMessage({ type: '', text: '' });
  };

  const handleAdminInputChange = (e) => {
    const { name, value } = e.target;
    setEditedAdmin({
      ...editedAdmin,
      [name]: value
    });
  };

  const updateAdmin = async () => {
    setIsUpdating(true);
    try {
      if (!adminData.idAdmin) {
        throw new Error('No se encontró el ID del administrador');
      }

      console.log('Updating admin with ID:', adminData.idAdmin);
      
      const response = await fetch(`http://localhost:1000/api/actualizarAdmin/${adminData.idAdmin}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nuevoNombre: editedAdmin.nombre,
          nuevoCorreo: editedAdmin.correo,
          nuevaContrasena: editedAdmin.contrasena
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el administrador');
      }

      // Update the local state with the updated data
      setAdminData(prevData => ({
        ...prevData,
        nombre: editedAdmin.nombre,
        correo: editedAdmin.correo
      }));

      // Update session storage
      const currentData = JSON.parse(sessionStorage.getItem('adminData') || '{}');
      sessionStorage.setItem('adminData', JSON.stringify({
        ...currentData,
        nombre: editedAdmin.nombre,
        correo: editedAdmin.correo
      }));

      // Update userEmail in session storage if email changed
      if (editedAdmin.correo !== adminData.correo) {
        sessionStorage.setItem('userEmail', editedAdmin.correo);
      }

      setUpdateMessage({ 
        type: 'success', 
        text: 'Información actualizada correctamente' 
      });
      
      setTimeout(() => {
        setUpdateMessage({ type: '', text: '' });
      }, 3000);

    } catch (error) {
      console.error('Error updating admin:', error);
      setUpdateMessage({ 
        type: 'error', 
        text: error.message || 'Error al actualizar la información' 
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <div className={styles.perfilContainer}>Cargando datos...</div>;
  }

  return (
    <div className={styles.perfilContainer}>
      <h2>Perfil del Administrador</h2>
      
      {error && (
        <div className={styles.errorMessage}>
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
      </div>

      <button 
        className={styles.editButton}
        onClick={handleOpenEditModal}
      >
        Editar información
      </button>

      {/* Edit Modal */}
      {showEditModal && editedAdmin && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Editar Información</h2>

            {updateMessage.text && (
              <div className={`${styles.messageBox} ${styles[updateMessage.type]}`}>
                {updateMessage.text}
              </div>
            )}

            <div className={styles.editSection}>
              <h3>Información del Administrador</h3>
              <div className={styles.editForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="nombre">Nombre</label>
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      value={editedAdmin.nombre || ''}
                      onChange={handleAdminInputChange}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="correo">Correo Electrónico</label>
                    <input
                      id="correo"
                      name="correo"
                      type="email"
                      value={editedAdmin.correo || ''}
                      onChange={handleAdminInputChange}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="contrasena">Nueva Contraseña (opcional)</label>
                    <input
                      id="contrasena"
                      name="contrasena"
                      type="password"
                      placeholder="Dejar en blanco para mantener contraseña actual"
                      value={editedAdmin.contrasena || ''}
                      onChange={handleAdminInputChange}
                    />
                  </div>
                </div>

                <div className={styles.buttonContainer}>
                  <button 
                    className={styles.updateButton}
                    onClick={updateAdmin}
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Actualizando...' : 'Actualizar Información'}
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.buttonContainer}>
              <button 
                className={styles.cancelButton}
                onClick={handleCloseEditModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerfilAdmin;