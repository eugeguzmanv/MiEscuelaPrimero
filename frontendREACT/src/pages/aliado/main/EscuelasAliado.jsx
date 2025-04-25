import React, { useState, useEffect } from 'react';
import styles from './EscuelasAliado.module.css';

const EscuelasAliado = () => {
  const [escuelas, setEscuelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

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
              
              <button className={styles.contactarBtn}>Ofrecer Apoyo</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EscuelasAliado; 