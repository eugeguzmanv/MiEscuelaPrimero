import React from 'react';
import styles from './EscuelasAliado.module.css';

const EscuelasAliado = () => {
  return (
    <div className={styles.escuelasContainer}>
      <div className={styles.escuelasGrid}>
        <div className={styles.escuelaCard}>
          <h2>Escuela Primaria Juan Escutia</h2>
          <div className={styles.infoGroup}>
            <label>CCT:</label>
            <p>14DPR3856K</p>
          </div>
          <div className={styles.infoGroup}>
            <label>Nivel Educativo:</label>
            <p>Primaria</p>
          </div>
          <div className={styles.direccionGroup}>
            <label>Dirección:</label>
            <div className={styles.direccionDetails}>
              <p>Calle: Revolución</p>
              <p>Número: 234</p>
              <p>Colonia: Centro</p>
              <p>Municipio: Guadalajara</p>
            </div>
          </div>
          <div className={styles.infoGroup}>
            <label>Número de estudiantes:</label>
            <p>450</p>
          </div>
          <div className={styles.descripcionGroup}>
            <label>Descripción:</label>
            <p>Escuela primaria pública con programas especiales de arte y deporte. Participante activa en programas de mejora educativa.</p>
          </div>
          <button className={styles.contactarBtn}>Ofrecer Apoyo</button>
        </div>

        <div className={styles.escuelaCard}>
          <h2>Primaria y Preescolar Miguel Hidalgo</h2>
          <div className={styles.infoGroup}>
            <label>CCT:</label>
            <p>14DST0015Z</p>
          </div>
          <div className={styles.infoGroup}>
            <label>Nivel Educativo:</label>
            <p>Preescolar y Primaria</p>
          </div>
          <div className={styles.direccionGroup}>
            <label>Dirección:</label>
            <div className={styles.direccionDetails}>
              <p>Calle: López Mateos</p>
              <p>Número: 1250</p>
              <p>Colonia: Chapalita</p>
              <p>Municipio: Zapopan</p>
            </div>
          </div>
          <div className={styles.infoGroup}>
            <label>Número de estudiantes:</label>
            <p>680</p>
          </div>
          <div className={styles.descripcionGroup}>
            <label>Descripción:</label>
            <p>Escuela preescolar y primaria con más de 50 años de experiencia en la educación.</p>
          </div>
          <button className={styles.contactarBtn}>Ofrecer Apoyo</button>
        </div>

        <div className={styles.escuelaCard}>
          <h2>Primaria Benito Juárez</h2>
          <div className={styles.infoGroup}>
            <label>CCT:</label>
            <p>14DPR3242Y</p>
          </div>
          <div className={styles.infoGroup}>
            <label>Nivel Educativo:</label>
            <p>Primaria</p>
          </div>
          <div className={styles.direccionGroup}>
            <label>Dirección:</label>
            <div className={styles.direccionDetails}>
              <p>Calle: Hidalgo</p>
              <p>Número: 789</p>
              <p>Colonia: Santa Teresita</p>
              <p>Municipio: Guadalajara</p>
            </div>
          </div>
          <div className={styles.infoGroup}>
            <label>Número de estudiantes:</label>
            <p>380</p>
          </div>
          <div className={styles.descripcionGroup}>
            <label>Descripción:</label>
            <p>Escuela con enfoque en desarrollo integral y programas de inclusión educativa.</p>
          </div>
          <button className={styles.contactarBtn}>Ofrecer Apoyo</button>
        </div>

        <div className={styles.escuelaCard}>
          <h2>Jardín de Niños México</h2>
          <div className={styles.infoGroup}>
            <label>CCT:</label>
            <p>14DES0089X</p>
          </div>
          <div className={styles.infoGroup}>
            <label>Nivel Educativo:</label>
            <p>Preescolar</p>
          </div>
          <div className={styles.direccionGroup}>
            <label>Dirección:</label>
            <div className={styles.direccionDetails}>
              <p>Calle: Federalismo</p>
              <p>Número: 456</p>
              <p>Colonia: Moderna</p>
              <p>Municipio: Guadalajara</p>
            </div>
          </div>
          <div className={styles.infoGroup}>
            <label>Número de estudiantes:</label>
            <p>520</p>
          </div>
          <div className={styles.descripcionGroup}>
            <label>Descripción:</label>
            <p>Jardín de Niños México es un jardín de niños con programas de arte y deporte.</p>
          </div>
          <button className={styles.contactarBtn}>Ofrecer Apoyo</button>
        </div>
      </div>
    </div>
  );
};

export default EscuelasAliado; 