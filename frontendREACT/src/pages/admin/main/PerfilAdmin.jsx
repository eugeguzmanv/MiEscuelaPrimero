import React from 'react';
import styles from './PerfilAdmin.module.css';

const PerfilAdmin = () => {
  return (
    <div className={styles.perfilContainer}>
      <h2>Perfil del Administrador</h2>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <label>Nombre:</label>
          <p>Juan Pérez González</p>
        </div>
        <div className={styles.infoItem}>
          <label>Correo:</label>
          <p>juan.perez@mexicanosprimero.org</p>
        </div>
        <div className={styles.infoItem}>
          <label>Contraseña:</label>
          <p>••••••••••</p>
        </div>
      </div>
      <button className={styles.editButton}>Editar información</button>
    </div>
  );
};

export default PerfilAdmin; 