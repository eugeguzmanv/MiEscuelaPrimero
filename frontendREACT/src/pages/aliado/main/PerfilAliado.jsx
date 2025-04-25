import React, { useState, useEffect } from 'react';
import styles from './PerfilAliado.module.css';

const PerfilAliado = () => {
  const [aliadoData, setAliadoData] = useState(null);
  const [personaMoralData, setPersonaMoralData] = useState(null);
  const [escrituraPublicaData, setEscrituraPublicaData] = useState(null);
  const [constanciaFiscalData, setConstanciaFiscalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPersonaMoral, setIsPersonaMoral] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // First check if we have freshly registered data in sessionStorage
        const storedAliadoData = sessionStorage.getItem('aliadoData');
        const storedPersonaMoralData = sessionStorage.getItem('personaMoralData');
        const storedCompleteData = sessionStorage.getItem('aliadoCompleteData');
        
        // Case 1: Fresh registration of persona moral with all data
        if (storedCompleteData) {
          try {
            const completeData = JSON.parse(storedCompleteData);
            console.log("Found complete aliado data in session storage", completeData);
            
            // This means we have a newly registered persona moral with all documentation
            setAliadoData(completeData);
            setPersonaMoralData(completeData);
            setEscrituraPublicaData({
              numero_escritura: completeData.numero_escritura,
              fecha_escritura: completeData.fecha_escritura,
              notario: completeData.notario,
              ciudad: completeData.ciudad
            });
            setConstanciaFiscalData({
              RFC: completeData.rfc,
              razon_social: completeData.razon_social,
              domicilio: completeData.domicilio,
              regimen: completeData.regimen
            });
            setIsPersonaMoral(true);
            setLoading(false);
            return;
          } catch (error) {
            console.error("Error parsing stored complete data", error);
            // Continue with regular data loading
          }
        }
        
        // Case 2: Fresh registration of persona fisica OR started persona moral registration
        if (storedAliadoData) {
          const parsedAliadoData = JSON.parse(storedAliadoData);
          console.log("Found aliado data in session storage", parsedAliadoData);
          
          // If we also have personaMoralData, we're in the middle of a persona moral registration
          if (storedPersonaMoralData) {
            const parsedPersonaMoralData = JSON.parse(storedPersonaMoralData);
            console.log("Found persona moral data in session storage", parsedPersonaMoralData);
            setPersonaMoralData(parsedPersonaMoralData);
            setIsPersonaMoral(true);
            
            // Note: At this stage, we wouldn't have escritura publica or constancia fiscal yet
            // Those are added in the final registration step
          } else {
            // If we only have aliadoData and no personaMoralData, this is a persona fisica
            setIsPersonaMoral(false);
          }
          
          setAliadoData(parsedAliadoData);
          setLoading(false);
          return;
        }
        
        // Case 3: User is returning (not freshly registered) - fetch from API
        const userEmail = sessionStorage.getItem('userEmail');
        
        if (!userEmail) {
          setError('No se encontró información del usuario');
          setLoading(false);
          return;
        }

        // Fetch aliado data from API
        const aliadoResponse = await fetch(`http://localhost:1000/api/aliadoCor/${userEmail}`);
        
        if (!aliadoResponse.ok) {
          throw new Error('Error al obtener datos del aliado');
        }
        
        const aliadoResult = await aliadoResponse.json();
        setAliadoData(aliadoResult);
        
        // Try to fetch persona moral data
        try {
          // Check if this aliado has persona moral data by querying the database
          const personaMoralResponse = await fetch(`http://localhost:1000/api/personaMoral/idAliado/${aliadoResult.idAliado}`);
          
          if (personaMoralResponse.ok) {
            const personaMoralResult = await personaMoralResponse.json();
            
            // If we get valid persona moral data, this is a persona moral
            if (personaMoralResult && personaMoralResult.idPersonaMoral) {
              setPersonaMoralData(personaMoralResult);
              setIsPersonaMoral(true);
              
              // Now fetch related escritura publica and constancia fiscal
              try {
                const escrituraResponse = await fetch(`http://localhost:1000/api/escrituraPublica/idPersonaMoral/${personaMoralResult.idPersonaMoral}`);
                if (escrituraResponse.ok) {
                  const escrituraResult = await escrituraResponse.json();
                  setEscrituraPublicaData(escrituraResult);
                }
              } catch (escrituraErr) {
                console.error('Error fetching escritura publica:', escrituraErr);
              }
              
              try {
                const constanciaResponse = await fetch(`http://localhost:1000/api/constanciaFiscal/idPersonaMoral/${personaMoralResult.idPersonaMoral}`);
                if (constanciaResponse.ok) {
                  const constanciaResult = await constanciaResponse.json();
                  setConstanciaFiscalData(constanciaResult);
                }
              } catch (constanciaErr) {
                console.error('Error fetching constancia fiscal:', constanciaErr);
              }
            }
          } else {
            // If we don't get persona moral data, this is a persona fisica
            setIsPersonaMoral(false);
          }
        } catch (personaMoralErr) {
          // Error fetching persona moral data, assume it's persona fisica
          console.error('Error checking persona moral status:', personaMoralErr);
          setIsPersonaMoral(false);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Error al cargar datos del perfil');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Cargando datos del perfil...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!aliadoData) {
    return <div className={styles.error}>No se encontraron datos del aliado</div>;
  }

  return (
    <div className={styles.perfilContainer}>
      <h2>Perfil del Aliado</h2>
      
      {/* Información Básica */}
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <label>Institución:</label>
          <p>{aliadoData.institucion}</p>
        </div>
        <div className={styles.infoItem}>
          <label>Sector:</label>
          <p>{aliadoData.sector}</p>
        </div>
        <div className={styles.infoItem}>
          <label>CURP:</label>
          <p>{aliadoData.CURP}</p>
        </div>
        <div className={styles.direccionContainer}>
          <label>Dirección:</label>
          <div className={styles.direccionDetails}>
            <p>Calle: {aliadoData.calle}</p>
            <p>Número: {aliadoData.numero}</p>
            <p>Colonia: {aliadoData.colonia}</p>
            <p>Municipio: {aliadoData.municipio}</p>
          </div>
        </div>
        <div className={styles.descripcionContainer}>
          <label>Descripción:</label>
          <p>{aliadoData.descripcion}</p>
        </div>
      </div>

      {/* Mostrar datos de persona moral solo si este aliado es una persona moral */}
      {isPersonaMoral && personaMoralData && (
        <>
          <h3>Datos de Persona Moral</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>Nombre de la organización:</label>
              <p>{personaMoralData.nombre_organizacion}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Giro:</label>
              <p>{personaMoralData.giro}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Propósito:</label>
              <p>{personaMoralData.proposito}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Página web:</label>
              <p>{personaMoralData.pagina_web}</p>
            </div>
          </div>
        </>
      )}

      {/* Mostrar datos de escritura publica solo si este aliado es una persona moral */}
      {isPersonaMoral && escrituraPublicaData && (
        <>
          <h3>Escritura Pública</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>Número de escritura:</label>
              <p>{escrituraPublicaData.numero_escritura}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Fecha de escritura:</label>
              <p>{escrituraPublicaData.fecha_escritura}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Notario:</label>
              <p>{escrituraPublicaData.notario}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Ciudad:</label>
              <p>{escrituraPublicaData.ciudad}</p>
            </div>
          </div>
        </>
      )}

      {/* Mostrar datos de constancia fiscal solo si este aliado es una persona moral */}
      {isPersonaMoral && constanciaFiscalData && (
        <>
          <h3>Constancia Fiscal</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>Domicilio fiscal:</label>
              <p>{constanciaFiscalData.domicilio}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Régimen:</label>
              <p>{constanciaFiscalData.regimen}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Razón social:</label>
              <p>{constanciaFiscalData.razon_social}</p>
            </div>
            <div className={styles.infoItem}>
              <label>RFC:</label>
              <p>{constanciaFiscalData.RFC}</p>
            </div>
          </div>
        </>
      )}

      <button className={styles.editButton}>Editar información</button>
    </div>
  );
};

export default PerfilAliado; 