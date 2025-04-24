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
        <h2 className={styles.formTitle}>Registro de Aliado</h2>
        <div className={styles.buttonContainer}>
          <button
            className={styles.button}
            onClick={() => navigate('/aliado/registro?tipo=fisica')}
          >
            Registrarme como Persona Física
          </button>
          <button
            className={styles.button}
            onClick={() => navigate('/aliado/registro?tipo=moral')}
          >
            Registrarme como Persona Moral
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpcionesRegistro; 