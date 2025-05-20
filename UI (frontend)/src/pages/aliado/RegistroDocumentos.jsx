import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import styles from '../../styles/Registro.module.css';

const RegistroDocumentos = () => {
  const navigate = useNavigate();
  const [personaMoralData, setPersonaMoralData] = useState(null);
  const [aliadoData, setAliadoData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    // Escritura Pública
    numero_escritura: '',
    fecha_escritura: '',
    notario: '',
    ciudad: '',
    // Constancia Fiscal
    domicilio: '',
    regimen: '',
    razon_social: '',
    rfc: ''
  });
  const [idPersonaMoral, setIdPersonaMoral] = useState(null);

  useEffect(() => {
    console.log("Loading data from sessionStorage in RegistroDocumentos");
    
    // Retrieve Persona Moral data
    const storedPersonaMoralData = sessionStorage.getItem('personaMoralData');
    if (storedPersonaMoralData) {
      try {
        const parsedData = JSON.parse(storedPersonaMoralData);
        console.log("Retrieved personaMoralData:", parsedData);
        setPersonaMoralData(parsedData);
        
        // Check if we have the idPersonaMoral using consistent property name
        if (parsedData.idPersonaMoral) {
          console.log("Found idPersonaMoral in stored data:", parsedData.idPersonaMoral);
          setIdPersonaMoral(parsedData.idPersonaMoral);
        } else if (parsedData.id) {
          // Fallback for backward compatibility
          const extractedId = typeof parsedData.id === 'object' && parsedData.id.idPersonaMoral 
            ? parsedData.id.idPersonaMoral 
            : parsedData.id;
            
          if (extractedId) {
            console.log("Found idPersonaMoral in legacy id field:", extractedId);
            setIdPersonaMoral(extractedId);
          }
        }
      } catch (error) {
        console.error("Error parsing personaMoralData:", error);
        setError("Error al leer datos de Persona Moral");
        setTimeout(() => navigate('/aliado/registro-persona-moral'), 3000);
      }
    } else {
      console.error("No personaMoralData found in sessionStorage");
      setError("No se encontraron datos de Persona Moral");
      setTimeout(() => navigate('/aliado/registro-persona-moral'), 3000);
    }
    
    // Retrieve Aliado data
    const storedAliadoData = sessionStorage.getItem('aliadoData');
    if (storedAliadoData) {
      try {
        const parsedData = JSON.parse(storedAliadoData);
        console.log("Retrieved aliadoData:", parsedData);
        setAliadoData(parsedData);
      } catch (error) {
        console.error("Error parsing aliadoData:", error);
      }
    } else {
      console.warn("No aliadoData found in sessionStorage");
    }
  }, [navigate]);

  // New useEffect to fetch the Persona Moral ID if we don't have it yet
  useEffect(() => {
    const fetchPersonaMoralId = async () => {
      if (!idPersonaMoral && personaMoralData) {
        // Get idAliado using consistent property name
        const idAliado = getIdAliado();
        if (!idAliado) {
          console.error("Cannot fetch persona moral ID without aliado ID");
          return;
        }

        try {
          console.log(`Fetching persona moral with nombre_organizacion: ${personaMoralData.nombre_organizacion}, idAliado: ${idAliado}`);
          // Use the nombre_organizacion to find the PersonaMoral
          const response = await fetch(`http://localhost:1000/api/personaMoral/nombre_organizacion/${encodeURIComponent(personaMoralData.nombre_organizacion)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          const data = await response.json();
          console.log("Fetched personaMoral data by nombre_organizacion:", data);
          
          if (response.ok && data) {
            // If the API returns an array, find the one matching our aliadoId
            const personaMoral = Array.isArray(data) 
              ? data.find(pm => pm.idAliado === idAliado)
              : data;
              
            if (personaMoral && personaMoral.idPersonaMoral) {
              console.log("Found idPersonaMoral:", personaMoral.idPersonaMoral);
              // Update both state and session storage with consistent idPersonaMoral property
              setIdPersonaMoral(personaMoral.idPersonaMoral);
              
              // Update personaMoralData in session storage with the correct ID
              const updatedPersonaMoralData = {
                ...personaMoralData,
                idPersonaMoral: personaMoral.idPersonaMoral
              };
              sessionStorage.setItem('personaMoralData', JSON.stringify(updatedPersonaMoralData));
              setPersonaMoralData(updatedPersonaMoralData);
              
              console.log("Updated personaMoralData in session storage with idPersonaMoral");
            } else {
              console.error("Could not find matching Persona Moral record");
              setError("No se pudo encontrar el ID de la Persona Moral");
            }
          } else {
            console.error("Error fetching Persona Moral:", data.error);
            setError(data.error || "Error al buscar Persona Moral");
          }
        } catch (error) {
          console.error("Error fetching PersonaMoral data:", error);
          setError("Error de conexión al buscar Persona Moral");
        }
      }
    };
    
    fetchPersonaMoralId();
  }, [personaMoralData, idPersonaMoral]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that we have both IDs
    const idAliado = getIdAliado();
    
    if (!idAliado || !idPersonaMoral) {
      setError("Faltan datos requeridos (ID de Aliado o Persona Moral)");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // First register Escritura Pública
      console.log("Registering Escritura Pública with:", {
        idAliado,
        idPersonaMoral,
        fecha_escritura: formData.fecha_escritura,
        notario: formData.notario,
        numero_escritura: formData.numero_escritura,
        ciudad: formData.ciudad
      });
      
      const escrituraResponse = await fetch('http://localhost:1000/api/registroEscrituraPublica', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idAliado,
          idPersonaMoral,
          fecha_escritura: formData.fecha_escritura,
          notario: formData.notario,
          numero_escritura: formData.numero_escritura,
          ciudad: formData.ciudad
        }),
      });
      
      const escrituraData = await escrituraResponse.json();
      
      if (!escrituraResponse.ok) {
        throw new Error(escrituraData.error || 'Error al registrar Escritura Pública');
      }
      
      console.log("Escritura Pública registered successfully:", escrituraData);
      
      // Get the escritura ID using consistent property naming
      const idEscrituraPublica = typeof escrituraData.id === 'object' && escrituraData.id.idEscrituraPublica
        ? escrituraData.id.idEscrituraPublica
        : escrituraData.id;
      
      // Then register Constancia Fiscal
      console.log("Registering Constancia Fiscal with:", {
        idPersonaMoral,
        RFC: formData.rfc,
        razon_social: formData.razon_social,
        domicilio: formData.domicilio,
        regimen: formData.regimen
      });
      
      const constanciaResponse = await fetch('http://localhost:1000/api/registroConstanciaFiscal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idPersonaMoral,
          RFC: formData.rfc,
          razon_social: formData.razon_social,
          domicilio: formData.domicilio,
          regimen: formData.regimen
        }),
      });
      
      const constanciaData = await constanciaResponse.json();
      
      if (!constanciaResponse.ok) {
        throw new Error(constanciaData.error || 'Error al registrar Constancia Fiscal');
      }
      
      console.log("Constancia Fiscal registered successfully:", constanciaData);
      
      // Get the constancia ID using consistent property naming
      const idConstanciaFiscal = typeof constanciaData.id === 'object' && constanciaData.id.idConstanciaFiscal
        ? constanciaData.id.idConstanciaFiscal
        : constanciaData.id;
      
      // Now we're done with registration.
      // We'll clear all existing session storage to prevent stale data
      sessionStorage.clear();
      
      // Set user email in session storage for profile access
      const userEmail = aliadoData?.correo_electronico || personaMoralData?.correo_electronico;
      if (userEmail) {
        console.log("Setting user email in session storage:", userEmail);
        sessionStorage.setItem('userEmail', userEmail);
      } else {
        console.warn("No user email found in either aliado or persona moral data");
      }
      
      // Set user profile type
      sessionStorage.setItem('userProfile', 'aliado');
      
      console.log("Registration complete, navigating to main page");
      // Navigate to the main page
      navigate('/aliado/main');
    } catch (error) {
      console.error('Error registering documents:', error);
      setError(error.message || 'Error al registrar documentos');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to extract idAliado with consistent property naming
  const getIdAliado = () => {
    if (personaMoralData && personaMoralData.idAliado) {
      return personaMoralData.idAliado;
    }
    
    if (aliadoData) {
      if (aliadoData.idAliado) {
        return aliadoData.idAliado;
      }
      
      // Fallback for backward compatibility
      if (aliadoData.id) {
        return typeof aliadoData.id === 'object' && aliadoData.id.idAliado 
          ? aliadoData.id.idAliado 
          : aliadoData.id;
      }
    }
    
    return null;
  };

  return (
    <div className={styles.registroContainer}>
      <Header />
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Documentos Legales</h2>
        {personaMoralData && (
          <p style={{ textAlign: 'center', marginBottom: '20px' }}>
            <strong>{personaMoralData.nombre_organizacion}</strong>
          </p>
        )}
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
        {!idPersonaMoral && !error && (
          <div style={{ 
            color: 'white', 
            backgroundColor: '#f0ad4e', 
            padding: '10px', 
            borderRadius: '5px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            Buscando ID de Persona Moral...
          </div>
        )}
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2 className={styles.representanteTitle}>Escritura Pública</h2>
          
          <label className={styles.label} htmlFor="numero_escritura">
            Número de escritura:
          </label>
          <input
            className={styles.input}
            type="text"
            id="numero_escritura"
            name="numero_escritura"
            value={formData.numero_escritura}
            onChange={handleChange}
            required
          />

          <label className={styles.label} htmlFor="fecha_escritura">
            Fecha de escritura:
          </label>
          <input
            className={styles.input}
            type="date"
            id="fecha_escritura"
            name="fecha_escritura"
            value={formData.fecha_escritura}
            onChange={handleChange}
            required
          />

          <label className={styles.label} htmlFor="notario">
            Notario:
          </label>
          <input
            className={styles.input}
            type="text"
            id="notario"
            name="notario"
            value={formData.notario}
            onChange={handleChange}
            required
          />

          <label className={styles.label} htmlFor="ciudad">
            Ciudad:
          </label>
          <input
            className={styles.input}
            type="text"
            id="ciudad"
            name="ciudad"
            value={formData.ciudad}
            onChange={handleChange}
            required
          />

          <h2 className={styles.representanteTitle}>Constancia Fiscal</h2>
          
          <label className={styles.label} htmlFor="domicilio">
            Domicilio:
          </label>
          <input
            className={styles.input}
            type="text"
            id="domicilio"
            name="domicilio"
            value={formData.domicilio}
            onChange={handleChange}
            required
          />

          <label className={styles.label} htmlFor="regimen">
            Régimen:
          </label>
          <input
            className={styles.input}
            type="text"
            id="regimen"
            name="regimen"
            value={formData.regimen}
            onChange={handleChange}
            required
          />

          <label className={styles.label} htmlFor="razon_social">
            Razón Social:
          </label>
          <input
            className={styles.input}
            type="text"
            id="razon_social"
            name="razon_social"
            value={formData.razon_social}
            onChange={handleChange}
            required
          />

          <label className={styles.label} htmlFor="rfc">
            RFC:
          </label>
          <input
            className={styles.input}
            type="text"
            id="rfc"
            name="rfc"
            value={formData.rfc}
            onChange={handleChange}
            required
          />

          <button 
            className={styles.button} 
            type="submit"
            disabled={isLoading || !idPersonaMoral}
          >
            {isLoading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistroDocumentos; 