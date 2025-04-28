import React, { useState, useEffect } from 'react';
import styles from './EscuelasAliado.module.css';

const EscuelasAliado = () => {
  const [escuelas, setEscuelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [selectedEscuela, setSelectedEscuela] = useState(null);
  const [showNecesidadesModal, setShowNecesidadesModal] = useState(false);
  const [necesidades, setNecesidades] = useState([]);
  const [loadingNecesidades, setLoadingNecesidades] = useState(false);
  const [necesidadesError, setNecesidadesError] = useState(null);

  useEffect(() => {
    const fetchEscuelas = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('http://localhost:1000/api/escuelas/');
        
        const responseText = await response.text();
        
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          setDebugInfo({ status: response.status, text: responseText });
          throw new Error(`Failed to parse response: ${parseError.message}`);
        }
        
        if (!response.ok) {
          setDebugInfo({ status: response.status, data });
          throw new Error(`Error: ${response.status}`);
        }
        
        setEscuelas(data.escuelas || []);
      } catch (error) {
        setError('No se pudieron cargar las escuelas. Por favor, intente nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchEscuelas();
  }, []);

  // Function to fetch necesidades for a specific escuela
  const fetchNecesidadesForEscuela = async (escuela) => {
    try {
      setLoadingNecesidades(true);
      setNecesidadesError(null);
      setSelectedEscuela(escuela);
      
      if (!escuela.CCT) {
        throw new Error('CCT de la escuela no disponible');
      }
      
      const response = await fetch(`http://localhost:1000/api/necesidades/escuela/${escuela.CCT}`);
      
      if (!response.ok) {
        // If 404, just means no necesidades found
        if (response.status === 404) {
          setNecesidades([]);
          return;
        }
        throw new Error(`Error al obtener necesidades: ${response.status}`);
      }
      
      const data = await response.json();
      setNecesidades(Array.isArray(data) ? data : []);
    } catch (error) {
      setNecesidadesError(error.message || 'Error al cargar las necesidades');
    } finally {
      setLoadingNecesidades(false);
      setShowNecesidadesModal(true);
    }
  };

  // Function to format date as DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX');
  };

  // Close the modal
  const closeNecesidadesModal = () => {
    setShowNecesidadesModal(false);
    setSelectedEscuela(null);
    setNecesidades([]);
    setNecesidadesError(null);
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Cargando escuelas...</div>;
  }

  return (
    <div className={styles.escuelasContainer}>
      {error && (
        <div className={styles.errorContainer}>
          <p>{error}</p>
          {debugInfo && (
            <details>
              <summary>Información de depuración</summary>
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </details>
          )}
        </div>
      )}
      
      {!error && escuelas.length === 0 ? (
        <div className={styles.noEscuelas}>No hay escuelas disponibles</div>
      ) : (
        <div className={styles.escuelasGrid}>
          {escuelas.map((escuela) => (
            <div key={escuela.CCT} className={styles.escuelaCard}>
              <h2>{escuela.nombre}</h2>
              <div className={styles.infoGroup}>
                <label>CCT:</label>
                <p>{escuela.CCT}</p>
              </div>
              <div className={styles.infoGroup}>
                <label>Nivel Educativo:</label>
                <p>{escuela.nivel_educativo}</p>
              </div>
              <div className={styles.direccionGroup}>
                <label>Dirección:</label>
                <div className={styles.direccionDetails}>
                  <p>Calle: {escuela.direccion.calle}</p>
                  <p>Número: {escuela.direccion.numero}</p>
                  <p>Colonia: {escuela.direccion.colonia}</p>
                  <p>Municipio: {escuela.direccion.municipio}</p>
                </div>
              </div>
              <div className={styles.infoGroup}>
                <label>Número de estudiantes:</label>
                <p>{escuela.numero_alumnos}</p>
              </div>
              {escuela.descripcion && (
                <div className={styles.descripcionGroup}>
                  <label>Descripción:</label>
                  <p>{escuela.descripcion}</p>
                </div>
              )}
              
              {/* Representantes section */}
              {escuela.representantes && escuela.representantes.length > 0 && (
                <div className={styles.representantesGroup}>
                  <label>Representantes:</label>
                  <div className={styles.representantesList}>
                    {escuela.representantes.map((representante, index) => (
                      <div key={`${escuela.CCT}-rep-${index}`} className={styles.representanteItem}>
                        <p><strong>Nombre:</strong> {representante.nombre}</p>
                        <p><strong>Correo:</strong> {representante.correo_electronico}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className={styles.buttonContainer}>
                <button className={styles.verNecesidadesBtn} onClick={() => fetchNecesidadesForEscuela(escuela)}>
                  Ver Necesidades
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for displaying necesidades */}
      {showNecesidadesModal && selectedEscuela && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Necesidades de {selectedEscuela.nombre}</h3>
              <button className={styles.closeButton} onClick={closeNecesidadesModal}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              {loadingNecesidades ? (
                <div className={styles.loadingNecesidades}>Cargando necesidades...</div>
              ) : necesidadesError ? (
                <div className={styles.necesidadesError}>{necesidadesError}</div>
              ) : necesidades.length === 0 ? (
                <div className={styles.noNecesidades}>
                  Esta escuela no tiene necesidades registradas.
                </div>
              ) : (
                <div className={styles.necesidadesGrid}>
                  {necesidades.map((necesidad) => (
                    <div key={necesidad.idNecesidad} className={styles.necesidadCard}>
                      <div className={styles.necesidadHeader}>
                        <h4>{necesidad.Categoria}</h4>
                      </div>
                      <div className={styles.necesidadBody}>
                        <p><strong>Subcategoría:</strong> {necesidad.Sub_categoria}</p>
                        <p><strong>Fecha:</strong> {formatDate(necesidad.Fecha)}</p>
                        <div className={styles.descripcionNecesidad}>
                          <p><strong>Descripción:</strong></p>
                          <p>{necesidad.Descripcion}</p>
                        </div>
                        {necesidad.Prioridad && (
                          <p><strong>Prioridad:</strong> {necesidad.Prioridad}</p>
                        )}
                        <p className={styles.validacionStatus}>
                          <strong>Estado:</strong> 
                          <span className={necesidad.Estado_validacion ? styles.validado : styles.pendiente}>
                            {necesidad.Estado_validacion ? 'Validado' : 'Pendiente de validación'}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.closeModalButton} onClick={closeNecesidadesModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EscuelasAliado; 