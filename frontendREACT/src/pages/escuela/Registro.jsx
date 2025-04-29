import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import styles from '../../styles/Registro.module.css';

const Registro = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    clave: '',
    nivel: '',
    modalidad: 'general',
    control: 'Público',
    sostenimiento: 'estatal',
    zona: '',
    sector: '',
    calle: '',
    numero: '',
    colonia: '',
    municipio: '',
    numero_estudiantes: '',
    descripcion: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:1000/api/registroEscuela', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          CCT: formData.clave,
          nombre: formData.nombre,
          modalidad: formData.modalidad,
          nivel_educativo: formData.nivel,
          sector_escolar: formData.sector,
          sostenimiento: formData.sostenimiento,
          zona_escolar: formData.zona,
          calle: formData.calle,
          colonia: formData.colonia,
          municipio: formData.municipio,
          numero: formData.numero,
          descripcion: formData.descripcion,
          control_administrativo: formData.control,
          numero_estudiantes: parseInt(formData.numero_estudiantes),
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // If successful, navigate to the representative registration page with the school CCT
        navigate(`/escuela/anadir-representante?cct=${formData.clave}`);
      } else {
        // Handle error from API
        setError(data.error || 'Error al registrar la escuela');
      }
    } catch (error) {
      console.error('Error al registrar escuela:', error);
      setError('Error de conexión. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.registroContainer}>
      <Header />
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Registro de Escuela</h2>
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
            Nombre de la escuela:
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

          <label className={styles.label} htmlFor="clave">
            Clave (CCT):
          </label>
          <input
            className={styles.input}
            type="text"
            id="clave"
            name="clave"
            value={formData.clave}
            onChange={handleChange}
            required
          />

          <label className={styles.label} htmlFor="nivel">
            Nivel educativo:
          </label>
          <select
            className={styles.select}
            id="nivel"
            name="nivel"
            value={formData.nivel}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un nivel</option>
            <option value="Preescolar">Preescolar</option>
            <option value="Primaria">Primaria</option>
            <option value="Secundaria">Secundaria</option>
            <option value="Preescolar y Primaria">Preescolar y Primaria</option>
            <option value="Primaria y Secundaria">Primaria y Secundaria</option>
            <option value="Preescolar, Primaria y Secundaria">Preescolar, Primaria y Secundaria</option>
          </select>

          <label className={styles.label} htmlFor="modalidad">
            Modalidad:
          </label>
          <select 
            className={styles.select} 
            id="modalidad" 
            name="modalidad"
            value={formData.modalidad}
            onChange={handleChange}
            required
          >
            <option value="general">General</option>
            <option value="comunitaria">Comunitaria</option>
            <option value="indigena">Indígena</option>
            <option value="multigrado">General multigrado</option>
          </select>

          <label className={styles.label} htmlFor="control">
            Control administrativo:
          </label>
          <input
            className={styles.input}
            type="text"
            id="control"
            name="control"
            value="Público"
            readOnly
          />

          <label className={styles.label} htmlFor="sostenimiento">
            Sostenimiento:
          </label>
          <select 
            className={styles.select} 
            id="sostenimiento" 
            name="sostenimiento"
            value={formData.sostenimiento}
            onChange={handleChange}
            required
          >
            <option value="estatal">Estatal</option>
            <option value="federal">Federal</option>
          </select>

          <label className={styles.label} htmlFor="zona">
            Zona escolar:
          </label>
          <input
            className={styles.input}
            type="text"
            id="zona"
            name="zona"
            value={formData.zona}
            onChange={handleChange}
            required
          />

          <label className={styles.label} htmlFor="sector">
            Sector escolar:
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

          <label className={styles.label} htmlFor="numero_estudiantes">
            Número de estudiantes:
          </label>
          <input
            className={styles.input}
            type="number"
            id="numero_estudiantes"
            name="numero_estudiantes"
            min="0"
            placeholder="Ejemplo: 500"
            value={formData.numero_estudiantes}
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
            placeholder="Escribe una breve descripción de la escuela..."
            value={formData.descripcion}
            onChange={handleChange}
            required
          />

          <button 
            className={styles.button} 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Continuar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registro; 