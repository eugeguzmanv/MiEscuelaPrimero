import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import styles from '../../styles/Registro.module.css';

const Registro = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tipoRegistro, setTipoRegistro] = useState('fisica');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tipo = params.get('tipo');
    if (tipo === 'moral') {
      setTipoRegistro('moral');
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tipoRegistro === 'moral') {
      navigate('/aliado/registro-persona-moral');
    } else {
      navigate('/aliado/main');
    }
  };

  return (
    <div className={styles.registroContainer}>
      <Header />
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Registro de Aliado</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="institucion">
            Institución:
          </label>
          <input
            className={styles.input}
            type="text"
            id="institucion"
            name="institucion"
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
            required
          />
          <input
            className={styles.input}
            type="text"
            id="numero"
            name="numero"
            placeholder="Número"
            required
          />
          <input
            className={styles.input}
            type="text"
            id="colonia"
            name="colonia"
            placeholder="Colonia"
            required
          />
          <input
            className={styles.input}
            type="text"
            id="municipio"
            name="municipio"
            placeholder="Municipio"
            required
          />

          <label className={styles.label} htmlFor="curp">
            CURP:
          </label>
          <input
            className={styles.input}
            type="text"
            id="curp"
            name="curp"
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
            required
          />

          <button className={styles.button} type="submit">
            {tipoRegistro === 'moral' ? 'Continuar' : 'Registrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registro; 