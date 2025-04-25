import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import styles from '../../styles/Registro.module.css';

const Registro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contrasena: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@mpj\.org\.mx$/;
    if (!emailRegex.test(formData.correo)) {
      setError('El correo electrónico debe tener formato usuario@mpj.org.mx');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:1000/api/registroAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          correo_electronico: formData.correo,
          contrasena: formData.contrasena
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar administrador');
      }

      console.log('Registro exitoso:', data);
      
      // Store admin data in session storage if needed
      sessionStorage.setItem('adminData', JSON.stringify({
        nombre: formData.nombre,
        correo: formData.correo
      }));
      
      // Navigate to admin main page
      navigate('/admin/main');
    } catch (error) {
      console.error('Error en registro:', error);
      setError(error.message || 'Error al registrar, intente nuevamente');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.registroContainer}>
      <Header />
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Registro de Administrador</h2>
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
            Nombre:
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

          <label className={styles.label} htmlFor="correo">
            Correo electrónico:
          </label>
          <input
            className={styles.input}
            type="email"
            id="correo"
            name="correo"
            placeholder="ejemplo@mpj.org.mx"
            value={formData.correo}
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

export default Registro; 