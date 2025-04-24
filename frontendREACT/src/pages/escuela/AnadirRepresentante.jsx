import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import styles from '../../styles/Registro.module.css';

const AnadirRepresentante = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/escuela/main');
  };

  return (
    <div className={styles.registroContainer}>
      <Header />
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Vinculación de representante de Escuela</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="cct">
            Ingresa el CCT de la escuela a la que representas:
          </label>
          <input
            className={styles.input}
            type="text"
            id="cct"
            name="cct"
            placeholder="Clave CCT"
          />

          <label className={styles.label} htmlFor="rol">
            Rol en la escuela:
          </label>
          <input
            className={styles.input}
            type="text"
            id="rol"
            name="rol"
          />

          <label className={styles.label} htmlFor="telefono_representante">
            Número de teléfono:
          </label>
          <input
            className={styles.input}
            type="tel"
            id="telefono_representante"
            name="telefono_representante"
            placeholder="Ejemplo: 3312345678"
          />

          <label className={styles.label} htmlFor="anios_servicio">
            Años de servicio:
          </label>
          <input
            className={styles.input}
            type="number"
            id="anios_servicio"
            name="anios_servicio"
            min="0"
            placeholder="Ejemplo: 10"
          />

          <label className={styles.label} htmlFor="cambio_zona">
            ¿Ha pasado por algún cambio de zona escolar?
          </label>
          <select className={styles.select} id="cambio_zona" name="cambio_zona">
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>

          <label className={styles.label} htmlFor="proceso_jubilacion">
            ¿Actualmente se encuentra en proceso, o está pensando en comenzar el proceso de jubilación?
          </label>
          <select className={styles.select} id="proceso_jubilacion" name="proceso_jubilacion">
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>

          <button className={styles.button} type="submit">
            Vincular
          </button>
        </form>
      </div>
    </div>
  );
};

export default AnadirRepresentante; 