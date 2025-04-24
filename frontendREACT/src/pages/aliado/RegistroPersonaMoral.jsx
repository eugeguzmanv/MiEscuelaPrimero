import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import styles from '../../styles/Registro.module.css';

const RegistroPersonaMoral = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/aliado/main');
  };

  return (
    <div className={styles.registroContainer}>
      <Header />
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Datos de la Persona Moral</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="nombre_organizacion">
            Nombre de la organización:
          </label>
          <input
            className={styles.input}
            type="text"
            id="nombre_organizacion"
            name="nombre_organizacion"
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
            required
          />

          <label className={styles.label} htmlFor="pagina_web">
            Página web:
          </label>
          <input
            className={styles.input}
            type="url"
            id="pagina_web"
            name="pagina_web"
            placeholder="https://ejemplo.com"
          />

          <h2 className={styles.representanteTitle}>Escritura Pública</h2>
          
          <label className={styles.label} htmlFor="numero_escritura">
            Número de escritura:
          </label>
          <input
            className={styles.input}
            type="text"
            id="numero_escritura"
            name="numero_escritura"
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
            required
          />

          <button className={styles.button} type="submit">
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistroPersonaMoral; 