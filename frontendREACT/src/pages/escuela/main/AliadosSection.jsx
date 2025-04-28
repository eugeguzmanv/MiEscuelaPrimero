import React, { useState, useEffect } from 'react';
import styles from './AliadosSection.module.css';

const AliadosSection = () => {
  const [aliados, setAliados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [selectedAliado, setSelectedAliado] = useState(null);
  const [showApoyosModal, setShowApoyosModal] = useState(false);
  const [apoyos, setApoyos] = useState([]);
  const [loadingApoyos, setLoadingApoyos] = useState(false);
  const [apoyosError, setApoyosError] = useState(null);

  useEffect(() => {
    const fetchAliados = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('http://localhost:1000/api/aliados');
        
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
        
        if (data.aliados && Array.isArray(data.aliados)) {
          setAliados(data.aliados);
        } else {
          setDebugInfo({ invalidData: data });
          throw new Error('Invalid data format');
        }
      } catch (error) {
        setError('No se pudieron cargar los aliados. Por favor, intente nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchAliados();
  }, []);

  // Function to fetch apoyos for a specific aliado
  const fetchApoyosForAliado = async (aliado) => {
    try {
      setLoadingApoyos(true);
      setApoyosError(null);
      setSelectedAliado(aliado);
      
      if (!aliado.idAliado) {
        throw new Error('ID del aliado no disponible');
      }
      
      const response = await fetch(`http://localhost:1000/api/apoyos/aliado/${aliado.idAliado}`);
      
      if (!response.ok) {
        // If 404, just means no apoyos found
        if (response.status === 404) {
          setApoyos([]);
          return;
        }
        throw new Error(`Error al obtener apoyos: ${response.status}`);
      }
      
      const data = await response.json();
      setApoyos(Array.isArray(data) ? data : []);
    } catch (error) {
      setApoyosError(error.message || 'Error al cargar los apoyos');
    } finally {
      setLoadingApoyos(false);
      setShowApoyosModal(true);
    }
  };

  // Function to format date as DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX');
  };

  // Close the modal
  const closeApoyosModal = () => {
    setShowApoyosModal(false);
    setSelectedAliado(null);
    setApoyos([]);
    setApoyosError(null);
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Cargando aliados...</div>;
  }

  return (
    <div className={styles.aliadosContainer}>
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
      
      {!error && aliados.length === 0 ? (
        <div className={styles.noAliados}>No hay aliados disponibles</div>
      ) : (
        <div className={styles.aliadosGrid}>
          {aliados.map((aliado, index) => (
            <div key={aliado.idAliado || `aliado-${index}`} className={styles.aliadoCard}>
              <h2>{aliado.nombre || 'Aliado sin nombre'}</h2>
              
              {aliado.institucion && (
                <div className={styles.infoGroup}>
                  <label>Institución:</label>
                  <p>{aliado.institucion}</p>
                </div>
              )}
              
              {aliado.sector && (
                <div className={styles.infoGroup}>
                  <label>Sector:</label>
                  <p>{aliado.sector}</p>
                </div>
              )}
              
              {aliado.direccion && (
                <div className={styles.direccionGroup}>
                  <label>Dirección:</label>
                  <div className={styles.direccionDetails}>
                    {aliado.direccion.calle && <p>Calle: {aliado.direccion.calle}</p>}
                    {aliado.direccion.numero && <p>Número: {aliado.direccion.numero}</p>}
                    {aliado.direccion.colonia && <p>Colonia: {aliado.direccion.colonia}</p>}
                    {aliado.direccion.municipio && <p>Municipio: {aliado.direccion.municipio}</p>}
                  </div>
                </div>
              )}
              
              {aliado.descripcion && (
                <div className={styles.descripcionGroup}>
                  <label>Descripción:</label>
                  <p>{aliado.descripcion}</p>
                </div>
              )}
              
              {aliado.correo && (
                <div className={styles.infoGroup}>
                  <label>Correo:</label>
                  <p>{aliado.correo}</p>
                </div>
              )}
              
              <div className={styles.buttonContainer}>
                <button className={styles.verApoyosBtn} onClick={() => fetchApoyosForAliado(aliado)}>
                  Ver Apoyos
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for displaying apoyos */}
      {showApoyosModal && selectedAliado && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Apoyos de {selectedAliado.nombre}</h3>
              <button className={styles.closeButton} onClick={closeApoyosModal}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              {loadingApoyos ? (
                <div className={styles.loadingApoyos}>Cargando apoyos...</div>
              ) : apoyosError ? (
                <div className={styles.apoyosError}>{apoyosError}</div>
              ) : apoyos.length === 0 ? (
                <div className={styles.noApoyos}>
                  Este aliado no tiene apoyos registrados.
                </div>
              ) : (
                <div className={styles.apoyosGrid}>
                  {apoyos.map((apoyo) => (
                    <div key={apoyo.idApoyo} className={styles.apoyoCard}>
                      <div className={styles.apoyoHeader}>
                        <h4>{apoyo.Categoria}</h4>
                      </div>
                      <div className={styles.apoyoBody}>
                        <p><strong>Subcategoría:</strong> {apoyo.Sub_categoria}</p>
                        <p><strong>Fecha:</strong> {formatDate(apoyo.Fecha)}</p>
                        <div className={styles.descripcionApoyo}>
                          <p><strong>Descripción:</strong></p>
                          <p>{apoyo.Descripcion}</p>
                        </div>
                        <p className={styles.validacionStatus}>
                          <strong>Estado:</strong> 
                          <span className={apoyo.Estado_validacion ? styles.validado : styles.pendiente}>
                            {apoyo.Estado_validacion ? 'Validado' : 'Pendiente de validación'}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.closeModalButton} onClick={closeApoyosModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AliadosSection; 