import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import styles from '../../styles/Registro.module.css';

const Registro = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/admin/main');
  };

  return (
    <div className={styles.registroContainer}>
      <Header />
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Registro de Administrador</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="nombre">
            Nombre:
          </label>
          <input
            className={styles.input}
            type="text"
            id="nombre"
            name="nombre"
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

export default Registro; 