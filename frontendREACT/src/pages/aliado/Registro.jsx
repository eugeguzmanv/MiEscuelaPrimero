import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import styles from '../../styles/Registro.module.css';

const Registro = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tipoRegistro, setTipoRegistro] = useState('fisica');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    correo_electronico: '',
    contraseña: '',
    confirmar_contraseña: '',
    CURP: '',
    institucion: '',
    sector: '',
    calle: '',
    numero: '',
    colonia: '',
    municipio: '',
    descripcion: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tipo = params.get('tipo');
    if (tipo === 'moral') {
      setTipoRegistro('moral');
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // For moral person, save the form data and navigate to the next page
    if (tipoRegistro === 'moral') {
      setIsLoading(true);
      setError(null);
      console.log("Starting moral person registration...");
      
      try {
        console.log("Sending data to API:", {
          nombre: formData.nombre,
          correo_electronico: formData.correo_electronico,
          CURP: formData.CURP,
          // Omitting sensitive data in logs
        });
        
        const response = await fetch('http://localhost:1000/api/registroAliado', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: formData.nombre,
            correo_electronico: formData.correo_electronico,
            contraseña: formData.contraseña,
            CURP: formData.CURP,
            institucion: formData.institucion,
            sector: formData.sector,
            calle: formData.calle,
            colonia: formData.colonia,
            municipio: formData.municipio,
            numero: formData.numero,
            descripcion: formData.descripcion
          }),
        });

        console.log("API response status:", response.status);
        const data = await response.json();
        console.log("API response data:", data);
        
        if (response.ok) {
          console.log("Registration successful, ID received:", data.id);
          
          // Extract the actual ID value
          const idAliado = typeof data.id === 'object' && data.id.idAliado 
            ? data.id.idAliado 
            : data.id;
            
          console.log("Extracted ID value:", idAliado);
          
          // Store the aliado data including ID in session storage
          sessionStorage.setItem('aliadoData', JSON.stringify({
            ...formData,
            id: idAliado // Store the ID returned from the API
          }));
          
          console.log("About to navigate to /aliado/registro-persona-moral with ID:", idAliado);
          // Navigate to the persona moral registration with the aliado ID
          navigate('/aliado/registro-persona-moral', { 
            state: { aliadoId: idAliado } 
          });
          console.log("Navigation called");
    } else {
          console.error("API error:", data);
          setError(data.error || 'Error al registrar aliado');
        }
      } catch (error) {
        console.error('Error al registrar aliado:', error);
        setError('Error de conexión. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Validate passwords match
    if (formData.contraseña !== formData.confirmar_contraseña) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:1000/api/registroAliado', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          correo_electronico: formData.correo_electronico,
          contraseña: formData.contraseña,
          CURP: formData.CURP,
          institucion: formData.institucion,
          sector: formData.sector,
          calle: formData.calle,
          colonia: formData.colonia,
          municipio: formData.municipio,
          numero: formData.numero,
          descripcion: formData.descripcion
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // If successful, save user data in session storage
        const idAliado = typeof data.id === 'object' && data.id.idAliado 
          ? data.id.idAliado 
          : data.id;
          
        sessionStorage.setItem('userEmail', formData.correo_electronico);
        sessionStorage.setItem('userProfile', 'aliado');
        sessionStorage.setItem('aliadoData', JSON.stringify({
          ...formData,
          id: idAliado
        }));
        
        // Navigate to the main page
        navigate('/aliado/main');
      } else {
        // Handle error from API
        setError(data.error || 'Error al registrar aliado');
      }
    } catch (error) {
      console.error('Error al registrar aliado:', error);
      setError('Error de conexión. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.registroContainer}>
      <Header />
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Registro de Aliado</h2>
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
          <label className={styles.label} htmlFor="nombre">
            Nombre completo:
          </label>
          <input
            className={styles.input}
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />

          <label className={styles.label} htmlFor="correo_electronico">
            Correo electrónico:
          </label>
          <input
            className={styles.input}
            type="email"
            id="correo_electronico"
            name="correo_electronico"
            value={formData.correo_electronico}
            onChange={handleChange}
            required
          />

          <label className={styles.label} htmlFor="contraseña">
            Contraseña:
          </label>
          <input
            className={styles.input}
            type="password"
            id="contraseña"
            name="contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            required
          />

          <label className={styles.label} htmlFor="confirmar_contraseña">
            Confirmar contraseña:
          </label>
          <input
            className={styles.input}
            type="password"
            id="confirmar_contraseña"
            name="confirmar_contraseña"
            value={formData.confirmar_contraseña}
            onChange={handleChange}
            required
          />

          <label className={styles.label} htmlFor="institucion">
            Institución:
          </label>
          <input
            className={styles.input}
            type="text"
            id="institucion"
            name="institucion"
            value={formData.institucion}
            onChange={handleChange}
            required
          />

          <label className={styles.label} htmlFor="sector">
            Sector:
          </label>
          <input
            className={styles.input}
            type="text"
            id="sector"
            name="sector"
            value={formData.sector}
            onChange={handleChange}
            required
          />

          <label className={styles.label} htmlFor="direccion">
            Dirección:
          </label>
          <input
            className={styles.input}
            type="text"
            id="calle"
            name="calle"
            placeholder="Calle"
            value={formData.calle}
            onChange={handleChange}
            required
          />
          <input
            className={styles.input}
            type="text"
            id="numero"
            name="numero"
            placeholder="Número"
            value={formData.numero}
            onChange={handleChange}
            required
          />
          <input
            className={styles.input}
            type="text"
            id="colonia"
            name="colonia"
            placeholder="Colonia"
            value={formData.colonia}
            onChange={handleChange}
            required
          />
          <input
            className={styles.input}
            type="text"
            id="municipio"
            name="municipio"
            placeholder="Municipio"
            value={formData.municipio}
            onChange={handleChange}
            required
          />

          <label className={styles.label} htmlFor="CURP">
            CURP:
          </label>
          <input
            className={styles.input}
            type="text"
            id="CURP"
            name="CURP"
            value={formData.CURP}
            onChange={handleChange}
            required
          />

          <label className={styles.label} htmlFor="descripcion">
            Descripción:
          </label>
          <textarea
            className={styles.textarea}
            id="descripcion"
            name="descripcion"
            rows="4"
            placeholder="Escribe una breve descripción de la institución..."
            value={formData.descripcion}
            onChange={handleChange}
            required
          />

          <button 
            className={styles.button} 
            type="submit"
            disabled={isLoading}
          >
            {isLoading 
              ? 'Registrando...' 
              : (tipoRegistro === 'moral' ? 'Continuar' : 'Registrar')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registro; 