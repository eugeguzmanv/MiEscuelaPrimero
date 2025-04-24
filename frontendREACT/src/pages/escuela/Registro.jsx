import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import styles from '../../styles/Registro.module.css';

const Registro = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/escuela/main');
  };

  return (
    <div className={styles.registroContainer}>
      <Header />
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Registro de Escuela</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="nombre">
            Nombre de la escuela:
          </label>
          <input
            className={styles.input}
            type="text"
            id="nombre"
            name="nombre"
          />

          <label className={styles.label} htmlFor="clave">
            Clave (CCT):
          </label>
          <input
            className={styles.input}
            type="text"
            id="clave"
            name="clave"
          />

          <label className={styles.label} htmlFor="nivel">
            Nivel educativo:
          </label>
          <input
            className={styles.input}
            type="text"
            id="nivel"
            name="nivel"
          />

          <label className={styles.label} htmlFor="modalidad">
            Modalidad:
          </label>
          <select className={styles.select} id="modalidad" name="modalidad">
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
          <select className={styles.select} id="sostenimiento" name="sostenimiento">
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
          />

          <label className={styles.label} htmlFor="sector">
            Sector escolar:
          </label>
          <input
            className={styles.input}
            type="text"
            id="sector"
            name="sector"
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
          />
          <input
            className={styles.input}
            type="text"
            id="numero"
            name="numero"
            placeholder="Número"
          />
          <input
            className={styles.input}
            type="text"
            id="colonia"
            name="colonia"
            placeholder="Colonia"
          />
          <input
            className={styles.input}
            type="text"
            id="municipio"
            name="municipio"
            placeholder="Municipio"
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
          />

          <h2 className={styles.representanteTitle}>
            Información del representante
          </h2>
          
          <label className={styles.label} htmlFor="rol_representante">
            Rol del representante:
          </label>
          <textarea
            className={styles.textarea}
            id="rol_representante"
            name="rol_representante"
            rows="4"
            placeholder="Indica el rol del representante dentro de la Escuela"
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

          <button className={styles.button} type="submit">
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registro; 