import React from 'react';
import styles from './PerfilSection.module.css';

const PerfilSection = () => {
  return (
    <div className={styles.perfilContainer}>
      <h2>Perfil de Escuela</h2>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <label>Nombre de la Escuela:</label>
          <p>Escuela Primaria Juan Escutia</p>
        </div>
        <div className={styles.infoItem}>
          <label>Clave (CCT):</label>
          <p>14DPR3856K</p>
        </div>
        <div className={styles.infoItem}>
          <label>Nivel Educativo:</label>
          <p>Primaria</p>
        </div>
        <div className={styles.infoItem}>
          <label>Modalidad:</label>
          <p>General</p>
        </div>
        <div className={styles.infoItem}>
          <label>Control administrativo:</label>
          <p>Público</p>
        </div>
        <div className={styles.infoItem}>
          <label>Sostenimiento:</label>
          <p>Federal</p>
        </div>
        <div className={styles.infoItem}>
          <label>Zona escolar:</label>
          <p>Zona 142</p>
        </div>
        <div className={styles.infoItem}>
          <label>Número de estudiantes:</label>
          <p>450</p>
        </div>
        <div className={styles.direccionContainer}>
          <label>Dirección:</label>
          <p>Calle Revolución #234, Col. Centro, Guadalajara, Jalisco</p>
        </div>
        <div className={styles.descripcionContainer}>
          <label>Descripción:</label>
          <p>Escuela primaria pública comprometida con la educación integral de nuestros estudiantes desde 1985. Contamos con programas especiales de arte y deporte.</p>
        </div>
      </div>

      <h3>Información del Representante</h3>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <label>Nombre del representante:</label>
          <p>María González Ramírez</p>
        </div>
        <div className={styles.infoItem}>
          <label>Rol del representante:</label>
          <p>Directora</p>
        </div>
        <div className={styles.infoItem}>
          <label>Años de servicio:</label>
          <p>15 años</p>
        </div>
        <div className={styles.infoItem}>
          <label>Cambio de zona escolar:</label>
          <p>No</p>
        </div>
        <div className={styles.infoItem}>
          <label>Próximo a jubilarse:</label>
          <p>No</p>
        </div>
      </div>

      <button className={styles.editButton}>Editar información</button>
    </div>
  );
};

export default PerfilSection; 