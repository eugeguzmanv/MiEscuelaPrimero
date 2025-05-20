import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import styles from '../../styles/Registro.module.css';

const RegistroPersonaMoral = () => {
  console.log("RegistroPersonaMoral component rendered");
  const navigate = useNavigate();
  const location = useLocation();
  console.log("Location object:", location);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombre_organizacion: '',
    giro: '',
    proposito: '',
    pagina_web: ''
  });
  const [aliadoId, setAliadoId] = useState(null);

  useEffect(() => {
    console.log("useEffect running in RegistroPersonaMoral");
    console.log("Current location state:", location.state);
    
    // Check if the Aliado ID is in the location state (from previous page)
    if (location.state && location.state.aliadoId) {
      const id = location.state.aliadoId;
      console.log("Aliado ID found in location state:", id);
      
      // Make sure we extract a primitive value if it's an object
      const extractedId = typeof id === 'object' && id.idAliado 
        ? id.idAliado 
        : id;
        
      console.log("Extracted ID value:", extractedId);
      setAliadoId(extractedId);
    } else {
      console.log("No Aliado ID in location state, checking sessionStorage");
      // Try to retrieve from sessionStorage as fallback
      const storedAliadoData = sessionStorage.getItem('aliadoData');
      console.log("StoredAliadoData from sessionStorage:", storedAliadoData);
      
      if (storedAliadoData) {
        try {
          const parsedData = JSON.parse(storedAliadoData);
          console.log("Parsed aliado data:", parsedData);
          
          // Look for aliado ID using consistent property name
          if (parsedData.idAliado) {
            console.log("Aliado ID found using consistent property name:", parsedData.idAliado);
            setAliadoId(parsedData.idAliado);
          } else if (parsedData.id) {
            // Fallback for backward compatibility
            console.log("Aliado ID found in legacy id field:", parsedData.id);
            
            // Make sure we extract a primitive value if it's an object
            const extractedId = typeof parsedData.id === 'object' && parsedData.id.idAliado 
              ? parsedData.id.idAliado 
              : parsedData.id;
              
            console.log("Extracted ID value from sessionStorage:", extractedId);
            setAliadoId(extractedId);
          } else {
            console.error("No ID found in parsed data");
            setError('No se encontró ID del aliado en los datos almacenados.');
            setTimeout(() => {
              console.log("Redirecting to registration due to missing ID");
              navigate('/aliado/registro');
            }, 3000);
          }
        } catch (e) {
          console.error("Error parsing stored aliado data:", e);
          setError('Error al leer los datos del aliado.');
          setTimeout(() => {
            console.log("Redirecting to registration due to parse error");
            navigate('/aliado/registro');
          }, 3000);
        }
      } else {
        console.error("No aliado data found in sessionStorage");
        setError('No se encontraron datos del aliado. Por favor, registre el aliado primero.');
        setTimeout(() => {
          console.log("Redirecting to registration due to missing storage data");
          navigate('/aliado/registro');
        }, 3000);
      }
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!aliadoId) {
      setError('No se encontró ID del aliado. Por favor, registre el aliado primero.');
      return;
    }
    
    // Ensure we have a primitive ID value, not an object
    const idToSend = typeof aliadoId === 'object' && aliadoId.idAliado 
      ? aliadoId.idAliado 
      : aliadoId;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Sending persona moral data with aliadoId:", idToSend);
      const response = await fetch('http://localhost:1000/api/registroPersonaMoral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          idAliado: idToSend
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log("Persona moral registration successful, response data:", data);
        
        // Get the persona moral ID using consistent property naming
        const idPersonaMoral = typeof data.id === 'object' && data.id.idPersonaMoral 
          ? data.id.idPersonaMoral 
          : data.id;
          
        console.log("Extracted persona moral ID:", idPersonaMoral);
        
        // Store the form data in session storage for the next form with consistent property naming
        const personaMoralData = {
          ...formData,
          idAliado: idToSend,
          idPersonaMoral: idPersonaMoral // Store with consistent property name
        };
        
        console.log("Storing persona moral data with consistent property names:", personaMoralData);
        sessionStorage.setItem('personaMoralData', JSON.stringify(personaMoralData));
        
        // Ensure user session data is maintained
        const storedAliadoData = sessionStorage.getItem('aliadoData');
        if (storedAliadoData) {
          try {
            const aliadoData = JSON.parse(storedAliadoData);
            if (aliadoData.correo_electronico) {
              sessionStorage.setItem('userEmail', aliadoData.correo_electronico);
            }
          } catch (error) {
            console.error('Error parsing aliado data', error);
          }
        }
        sessionStorage.setItem('userProfile', 'aliado');
        
        console.log("Persona moral registration complete, navigating to documents page");
        // Navigate to the next form
        navigate('/aliado/registro-documentos');
      } else {
        console.error("API error:", data);
        // Handle error from API
        setError(data.error || 'Error al registrar persona moral');
      }
    } catch (error) {
      console.error('Error al registrar persona moral:', error);
      setError('Error de conexión. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.registroContainer}>
      <Header />
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Datos de la Persona Moral</h2>
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
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="nombre_organizacion">
            Nombre de la organización:
          </label>
          <input
            className={styles.input}
            type="text"
            id="nombre_organizacion"
            name="nombre_organizacion"
            value={formData.nombre_organizacion}
            onChange={handleChange}
            required
          />

          <label className={styles.label} htmlFor="giro">
            Giro:
          </label>
          <input
            className={styles.input}
            type="text"
            id="giro"
            name="giro"
            value={formData.giro}
            onChange={handleChange}
            required
          />

          <label className={styles.label} htmlFor="proposito">
            Propósito:
          </label>
          <textarea
            className={styles.textarea}
            id="proposito"
            name="proposito"
            rows="4"
            placeholder="Describe el propósito de la organización..."
            value={formData.proposito}
            onChange={handleChange}
            required
          />

          <label className={styles.label} htmlFor="pagina_web">
            Página web:
          </label>
          <input
            className={styles.input}
            type="text"
            id="pagina_web"
            name="pagina_web"
            placeholder="https://ejemplo.com"
            value={formData.pagina_web}
            onChange={handleChange}
            required
          />

          <button 
            className={styles.button} 
            type="submit"
            disabled={isLoading || !aliadoId}
          >
            {isLoading ? 'Registrando...' : 'Continuar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistroPersonaMoral; 