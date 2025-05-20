import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import styles from '../../styles/Registro.module.css';

const AnadirRepresentante = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get CCT from URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const cct = queryParams.get('cct');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    correo_electronico: '',
    contrasena: '',
    confirmar_contrasena: '',
    numero_telefonico: '',
    rol: '',
    anios_experiencia: '',
    proximo_a_jubilarse: 'no',
    cambio_zona: 'no',
    CCT: cct || '', // Use CCT from URL or empty string
  });

  // Redirect if no CCT is provided
  useEffect(() => {
    if (!cct) {
      alert('Error: No se proporcionó el CCT de la escuela');
      navigate('/escuela/registro');
    }
  }, [cct, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.contrasena !== formData.confirmar_contrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:1000/api/registroRepre', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          correo_electronico: formData.correo_electronico,
          contrasena: formData.contrasena,
          numero_telefonico: formData.numero_telefonico,
          rol: formData.rol,
          anios_experiencia: parseInt(formData.anios_experiencia),
          proximo_a_jubilarse: formData.proximo_a_jubilarse === 'si',
          cambio_zona: formData.cambio_zona === 'si',
          CCT: formData.CCT,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // If successful, navigate to the main page with CCT parameter
        navigate(`/escuela/main?cct=${formData.CCT}`);
      } else {
        // Handle error from API
        setError(data.error || 'Error al registrar representante');
      }
    } catch (error) {
      console.error('Error al registrar representante:', error);
      setError('Error de conexión. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.registroContainer}>
      <Header />
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Registro de Representante</h2>
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

          <label className={styles.label} htmlFor="contrasena">
            Contraseña:
          </label>
          <input
            className={styles.input}
            type="password"
            id="contrasena"
            name="contrasena"
            value={formData.contrasena}
            onChange={handleChange}
            required
          />

          <label className={styles.label} htmlFor="confirmar_contrasena">
            Confirmar contraseña:
          </label>
          <input
            className={styles.input}
            type="password"
            id="confirmar_contrasena"
            name="confirmar_contrasena"
            value={formData.confirmar_contrasena}
            onChange={handleChange}
            required
          />

          <label className={styles.label} htmlFor="numero_telefonico">
            Número de teléfono:
          </label>
          <input
            className={styles.input}
            type="tel"
            id="numero_telefonico"
            name="numero_telefonico"
            placeholder="Ejemplo: 3312345678"
            value={formData.numero_telefonico}
            onChange={handleChange}
            required
          />

          <label className={styles.label} htmlFor="rol">
            Rol del representante:
          </label>
          <textarea
            className={styles.textarea}
            id="rol"
            name="rol"
            rows="4"
            placeholder="Indica el rol del representante dentro de la Escuela"
            value={formData.rol}
            onChange={handleChange}
            required
          />

          <label className={styles.label} htmlFor="anios_experiencia">
            Años de experiencia:
          </label>
          <input
            className={styles.input}
            type="number"
            id="anios_experiencia"
            name="anios_experiencia"
            min="0"
            placeholder="Ejemplo: 10"
            value={formData.anios_experiencia}
            onChange={handleChange}
            required
          />

          <label className={styles.label} htmlFor="cambio_zona">
            ¿Ha pasado por algún cambio de zona escolar?
          </label>
          <select 
            className={styles.select} 
            id="cambio_zona" 
            name="cambio_zona"
            value={formData.cambio_zona}
            onChange={handleChange}
            required
          >
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>

          <label className={styles.label} htmlFor="proximo_a_jubilarse">
            ¿Actualmente se encuentra en proceso, o está pensando en comenzar el proceso de jubilación?
          </label>
          <select 
            className={styles.select} 
            id="proximo_a_jubilarse" 
            name="proximo_a_jubilarse"
            value={formData.proximo_a_jubilarse}
            onChange={handleChange}
            required
          >
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>

          <button 
            className={styles.button} 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AnadirRepresentante; 