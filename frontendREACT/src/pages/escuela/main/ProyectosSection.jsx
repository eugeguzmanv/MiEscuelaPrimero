import React, { useState, useEffect } from 'react';
import styles from '../../aliado/main/ProyectosAliado.module.css';

const ProyectosSection = ({ escuelaData }) => {
  const [convenios, setConvenios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [firmasEscuela, setFirmasEscuela] = useState({});

  useEffect(() => {
    const fetchConvenios = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!escuelaData?.CCT) {
          throw new Error('CCT de la escuela no disponible');
        }
        const response = await fetch(`http://localhost:1000/api/convenio/escuela/${escuelaData.CCT}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          if (response.status === 404) {
            setConvenios([]);
            return;
          }
          throw new Error(errorData.error || `Error: ${response.status}`);
        }
        const data = await response.json();
        setConvenios(data);
        // Initialize firmas state for convenios without firma_escuela
        const initialFirmas = {};
        data.forEach(convenio => {
          if (!convenio.firma_escuela) {
            initialFirmas[convenio.idConvenio] = false;
          }
        });
        setFirmasEscuela(initialFirmas);
      } catch (error) {
        setError(error.message || 'No se pudieron cargar los convenios. Por favor, intente nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };
    if (escuelaData?.CCT) {
      fetchConvenios();
    }
  }, [escuelaData]);

  const handleFirmaChange = (idConvenio) => {
    setFirmasEscuela(prev => ({
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
      const response = await fetch('http://localhost:1000/api/convenios/firma-escuela', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          CCT: convenio.CCT,
          idAliado: convenio.idAliado,
          idConvenio: convenio.idConvenio
        }),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar el convenio');
      }
      setConvenios(prevConvenios =>
        prevConvenios.map(convenio =>
          convenio.idConvenio === idConvenio
            ? { ...convenio, firma_escuela: true }
            : convenio
        )
      );
      setFirmasEscuela(prev => {
        const newState = { ...prev };
        delete newState[idConvenio];
        return newState;
      });
      setMessage({ type: 'success', text: 'Convenio actualizado exitosamente' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al actualizar el convenio' });
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
                <h3>Aliado: {convenio.institucion}</h3>
                <div className={styles.proyectoInfo}>
                  <p><strong>Escuela:</strong> {convenio.nombre_escuela}</p>
                  <p><strong>Categoría:</strong> {convenio.categoria}</p>
                  <div className={styles.statusGroup}>
                    <p>
                      <strong>Firma Escuela:</strong>
                      {convenio.firma_escuela ? (
                        <span className={styles.statusCompleted}>Completado</span>
                      ) : (
                        <label className={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            checked={firmasEscuela[convenio.idConvenio] || false}
                            onChange={() => handleFirmaChange(convenio.idConvenio)}
                          />
                          Pendiente
                        </label>
                      )}
                    </p>
                    <p>
                      <strong>Firma Aliado:</strong>
                      <span className={convenio.firma_aliado ? styles.statusCompleted : styles.statusPending}>
                        {convenio.firma_aliado ? 'Completado' : 'Pendiente'}
                      </span>
                    </p>
                    <p>
                      <strong>Validación Admin:</strong>
                      <span className={convenio.validacion_admin ? styles.statusCompleted : styles.statusPending}>
                        {convenio.validacion_admin ? 'Completado' : 'Pendiente'}
                      </span>
                    </p>
                  </div>
                  {!convenio.firma_escuela && (
                    <button
                      className={styles.actualizarBtn}
                      onClick={() => handleActualizarConvenio(convenio.idConvenio)}
                      disabled={!firmasEscuela[convenio.idConvenio]}
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

export default ProyectosSection; 