import React, { useState, useEffect } from 'react';
import styles from './ProyectosAliado.module.css';

const ProyectosAliado = ({ aliadoData }) => {
  const [convenios, setConvenios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [firmasAliado, setFirmasAliado] = useState({});

  useEffect(() => {
    const fetchConvenios = async () => {
      try {
        setLoading(true);
        setError(null); // Clear any previous errors
        
        if (!aliadoData?.idAliado) {
          console.error('Missing aliadoData or idAliado:', aliadoData);
          throw new Error('ID del aliado no disponible');
        }

        console.log('Fetching convenios for aliado ID:', aliadoData.idAliado);
        const response = await fetch(`http://localhost:1000/api/convenio/aliado/${aliadoData.idAliado}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Error response:', {
            status: response.status,
            statusText: response.statusText,
            errorData
          });
          
          if (response.status === 404) {
            // This is an expected case when the aliado has no convenios
            setConvenios([]);
            return;
          }
          
          throw new Error(errorData.error || `Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received convenios data:', data);
        
        setConvenios(data);

        // Initialize firmas state for convenios without firma_aliado
        const initialFirmas = {};
        data.forEach(convenio => {
          if (!convenio.firma_aliado) {
            initialFirmas[convenio.idConvenio] = false;
          }
        });
        setFirmasAliado(initialFirmas);
      } catch (error) {
        console.error('Error in fetchConvenios:', error);
        setError(error.message || 'No se pudieron cargar los convenios. Por favor, intente nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    if (aliadoData?.idAliado) {
      fetchConvenios();
    }
  }, [aliadoData]);

  const handleFirmaChange = (idConvenio) => {
    setFirmasAliado(prev => ({
      ...prev,
      [idConvenio]: !prev[idConvenio]
    }));
  };

  const handleActualizarConvenio = async (idConvenio) => {
    try {
      const convenio = convenios.find(c => c.idConvenio === idConvenio);
      if (!convenio) {
        throw new Error('Convenio no encontrado');
      }

      const response = await fetch('http://localhost:1000/api/convenios/firma-aliado', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          CCT: convenio.CCT,
          idAliado: aliadoData.idAliado,
          idConvenio: convenio.idConvenio
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el convenio');
      }

      // Update local state
      setConvenios(prevConvenios => 
        prevConvenios.map(convenio => 
          convenio.idConvenio === idConvenio 
            ? { ...convenio, firma_aliado: true }
            : convenio
        )
      );

      // Remove from firmasAliado state since it's now signed
      setFirmasAliado(prev => {
        const newState = { ...prev };
        delete newState[idConvenio];
        return newState;
      });

      setMessage({ type: 'success', text: 'Convenio actualizado exitosamente' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al actualizar el convenio' });
      console.error('Error updating convenio:', error);
    }
  };

  const clearMessage = () => {
    setMessage(null);
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Cargando convenios...</div>;
  }

  return (
    <div className={styles.proyectosContainer}>
      {message && (
        <div className={`${styles.messageContainer} ${styles[message.type]}`}>
          <p>{message.text}</p>
          <button className={styles.closeMessageButton} onClick={clearMessage}>
            &times;
          </button>
        </div>
      )}

      <h2>Proyectos</h2>
      
      {error ? (
        <div className={styles.errorContainer}>{error}</div>
      ) : convenios.length === 0 ? (
        <div className={styles.noProyectos}>No hay convenios disponibles</div>
      ) : (
        <div className={styles.proyectosSection}>
          <div className={styles.proyectosGrid}>
            {convenios.map((convenio) => (
              <div key={convenio.idConvenio} className={styles.proyectoCard}>
                <h3>Nombre de la Escuela: {convenio.nombre_escuela}</h3>
                <div className={styles.proyectoInfo}>
                  <p><strong>Aliado:</strong> {convenio.institucion}</p>
                  <p><strong>Categoría:</strong> {convenio.categoria}</p>
                  <div className={styles.statusGroup}>
                    <p>
                      <strong>Firma Aliado:</strong>
                      {convenio.firma_aliado ? (
                        <span className={styles.statusCompleted}>Completado</span>
                      ) : (
                        <label className={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            checked={firmasAliado[convenio.idConvenio] || false}
                            onChange={() => handleFirmaChange(convenio.idConvenio)}
                          />
                          Pendiente
                        </label>
                      )}
                    </p>
                    <p>
                      <strong>Firma Escuela:</strong>
                      <span className={convenio.firma_escuela ? styles.statusCompleted : styles.statusPending}>
                        {convenio.firma_escuela ? 'Completado' : 'Pendiente'}
                      </span>
                    </p>
                    <p>
                      <strong>Validación Admin:</strong>
                      <span className={convenio.validacion_admin ? styles.statusCompleted : styles.statusPending}>
                        {convenio.validacion_admin ? 'Completado' : 'Pendiente'}
                      </span>
                    </p>
                  </div>
                  {!convenio.firma_aliado && (
                    <button
                      className={styles.actualizarBtn}
                      onClick={() => handleActualizarConvenio(convenio.idConvenio)}
                      disabled={!firmasAliado[convenio.idConvenio]}
                    >
                      Actualizar Convenio
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProyectosAliado; 