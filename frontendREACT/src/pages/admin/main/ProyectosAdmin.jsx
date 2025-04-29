import React, { useState, useEffect } from 'react';
import styles from './ProyectosAdmin.module.css';

const ProyectosAdmin = () => {
  const [convenios, setConvenios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [showingNoValidados, setShowingNoValidados] = useState(false);

  const fetchAllConvenios = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:1000/api/convenioGetAll');
      if (!response.ok) {
        throw new Error('No se pudieron cargar los convenios.');
      }
      const data = await response.json();
      setConvenios(data);
      setShowingNoValidados(false);
    } catch (err) {
      setError(err.message || 'Error al cargar convenios.');
    } finally {
      setLoading(false);
    }
  };

  const fetchNoValidados = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:1000/api/convenios/no-validados');
      if (!response.ok) {
        throw new Error('No se pudieron cargar los convenios no validados.');
      }
      const data = await response.json();
      setConvenios(data);
      setShowingNoValidados(true);
    } catch (err) {
      setError(err.message || 'Error al cargar convenios no validados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllConvenios();
  }, []);

  const handleValidarAdmin = async (convenio) => {
    try {
      const response = await fetch('http://localhost:1000/api/convenios/validacion-admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          CCT: convenio.CCT,
          idAliado: convenio.idAliado,
          idConvenio: convenio.idConvenio
        })
      });
      if (!response.ok) {
        throw new Error('Error al validar el convenio como admin');
      }
      setConvenios(prev => prev.map(c =>
        c.idConvenio === convenio.idConvenio
          ? { ...c, validacion_admin: true }
          : c
      ));
      setMessage({ type: 'success', text: 'Convenio validado como admin exitosamente' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Error al validar el convenio' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Cargando convenios...</div>;
  }

  return (
    <div className={styles.proyectosContainer}>
      {message && (
        <div className={`${styles.messageContainer} ${styles[message.type]}`}>
          <p>{message.text}</p>
        </div>
      )}
      <h2>Proyectos entre Aliados y Escuelas</h2>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          className={styles.actividadesBtn}
          onClick={fetchNoValidados}
          disabled={showingNoValidados}
        >
          Mostrar solo convenios no validados
        </button>
        <button
          className={styles.actividadesBtn}
          onClick={fetchAllConvenios}
          disabled={!showingNoValidados}
        >
          Mostrar todos los convenios
        </button>
      </div>
      {error ? (
        <div className={styles.errorContainer}>{error}</div>
      ) : convenios.length === 0 ? (
        <div className={styles.noProyectos}>No hay convenios disponibles</div>
      ) : (
        <div className={styles.proyectosSection}>
          <div className={styles.proyectosGrid}>
            {convenios.map((convenio) => (
              <div key={convenio.idConvenio} className={styles.proyectoCard}>
                <h3 className={styles.categoriaHeader}>{convenio.categoria}</h3>
                <div className={styles.proyectoInfo}>
                  <p><strong>Escuela:</strong> {convenio.nombre_escuela}</p>
                  <p><strong>Aliado:</strong> {convenio.institucion}</p>
                  <div className={styles.statusGroup}>
                    <p>
                      <strong>Firma Aliado:</strong>
                      <span className={convenio.firma_aliado ? styles.statusCompleted : styles.statusPending}>
                        {convenio.firma_aliado ? 'Completado' : 'Pendiente'}
                      </span>
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
                  {!convenio.validacion_admin && (
                    <button
                      className={styles.validarBtn}
                      onClick={() => handleValidarAdmin(convenio)}
                    >
                      Validar Convenio
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

export default ProyectosAdmin; 