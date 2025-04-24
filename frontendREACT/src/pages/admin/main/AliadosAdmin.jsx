import React from 'react';
import styles from './AliadosAdmin.module.css';

const AliadosAdmin = () => {
  return (
    <div className={styles.aliadosContainer}>
      <div className={styles.aliadosGrid}>
        <div className={styles.aliadoCard}>
          <h2>Fundación Educar Uno</h2>
          <div className={styles.infoGroup}>
            <label>Sector:</label>
            <p>Educación</p>
          </div>
          <div className={styles.direccionGroup}>
            <label>Dirección:</label>
            <div className={styles.direccionDetails}>
              <p>Calle: Av. Vallarta</p>
              <p>Número: 1458</p>
              <p>Colonia: Americana</p>
              <p>Municipio: Guadalajara</p>
            </div>
          </div>
          <div className={styles.infoGroup}>
            <label>Categoría de Apoyo:</label>
            <p>Infraestructura Educativa</p>
          </div>
          <button className={styles.editBtn}>Editar</button>
        </div>

        <div className={styles.aliadoCard}>
          <h2>Instituto Tecnológico Superior</h2>
          <div className={styles.infoGroup}>
            <label>Sector:</label>
            <p>Tecnología</p>
          </div>
          <div className={styles.direccionGroup}>
            <label>Dirección:</label>
            <div className={styles.direccionDetails}>
              <p>Calle: López Mateos Sur</p>
              <p>Número: 2435</p>
              <p>Colonia: Ciudad del Sol</p>
              <p>Municipio: Zapopan</p>
            </div>
          </div>
          <div className={styles.infoGroup}>
            <label>Categoría de Apoyo:</label>
            <p>Equipamiento Tecnológico</p>
          </div>
          <button className={styles.editBtn}>Editar</button>
        </div>

        <div className={styles.aliadoCard}>
          <h2>Fundación Cultural de Occidente</h2>
          <div className={styles.infoGroup}>
            <label>Sector:</label>
            <p>Arte y Cultura</p>
          </div>
          <div className={styles.direccionGroup}>
            <label>Dirección:</label>
            <div className={styles.direccionDetails}>
              <p>Calle: Juárez</p>
              <p>Número: 876</p>
              <p>Colonia: Centro</p>
              <p>Municipio: Tlaquepaque</p>
            </div>
          </div>
          <div className={styles.infoGroup}>
            <label>Categoría de Apoyo:</label>
            <p>Programas Culturales</p>
          </div>
          <button className={styles.editBtn}>Editar</button>
        </div>

        <div className={styles.aliadoCard}>
          <h2>Asociación Deportiva Jalisco</h2>
          <div className={styles.infoGroup}>
            <label>Sector:</label>
            <p>Deporte</p>
          </div>
          <div className={styles.direccionGroup}>
            <label>Dirección:</label>
            <div className={styles.direccionDetails}>
              <p>Calle: Revolución</p>
              <p>Número: 543</p>
              <p>Colonia: Jardines del Sol</p>
              <p>Municipio: Zapopan</p>
            </div>
          </div>
          <div className={styles.infoGroup}>
            <label>Categoría de Apoyo:</label>
            <p>Infraestructura Deportiva</p>
          </div>
          <button className={styles.editBtn}>Editar</button>
        </div>
      </div>
    </div>
  );
};

export default AliadosAdmin; 