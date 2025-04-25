import React, { useState, useEffect } from 'react';
import styles from './AliadosSection.module.css';

const AliadosSection = () => {
  const [aliados, setAliados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

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
              
              <button className={styles.contactarBtn}>Solicitar Apoyo</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AliadosSection; 