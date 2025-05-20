import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import styles from '../../styles/OpcionesRegistro.module.css';

const OpcionesRegistro = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.opcionesContainer}>
      <Header />
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Selecciona una opción</h2>
        <div className={styles.buttonContainer}>
          <button
            className={styles.button}
            onClick={() => navigate('/escuela/registro')}
          >
            Quiero registrar mi escuela
          </button>
          <button
            className={styles.button}
            onClick={() => navigate('/escuela/anadir-nuevo-representante')}
          >
            Mi escuela ya está registrada
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpcionesRegistro; 