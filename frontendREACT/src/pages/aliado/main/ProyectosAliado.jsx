import React from 'react';
import styles from './ProyectosAliado.module.css';

const ProyectosAliado = () => {
  return (
    <div className={styles.proyectosContainer}>
      <h2>Proyectos Activos</h2>
      <div className={styles.proyectosSection}>
        <div id="proyectos-grid" className={styles.proyectosGrid}>
          <div className={styles.proyectoCard}>
            <h3>Nombre de la Escuela: Escuela Primaria Juan Escutia</h3>
            <div className={styles.proyectoInfo}>
              <p><strong>Fecha de inicio:</strong> 01/03/2024</p>
              <p><strong>Fecha de finalización:</strong> 27/12/2024</p>
            </div>
            <button className={styles.actividadesBtn}>Actividades</button>
          </div>
        </div>
      </div>

      <h2 className={styles.matchesHeader}>Matches</h2>
      <div className={styles.matchesGrid}>
        <div className={styles.matchCard}>
          <h3>Primaria y Preescolar Miguel Hidalgo</h3>
          <div className={styles.infoGroup}>
            <label>Categoría de Necesidad:</label>
            <p>Mobiliario e infraestructura</p>
          </div>
          <div className={styles.direccionGroup}>
            <label>Dirección:</label>
            <div className={styles.direccionDetails}>
              <p>Municipio: Zapopan</p>
              <p>Colonia: Jardines del Sol</p>
              <p>Calle: Revolución</p>
              <p>Número: 543</p>
            </div>
          </div>
          <button className={styles.contactarBtn}>Ofrecer Apoyo</button>
        </div>

        <div className={styles.matchCard}>
          <h3>Escuela Primaria Benito Juárez</h3>
          <div className={styles.infoGroup}>
            <label>Categoría de Necesidad:</label>
            <p>Mobiliario e infraestructura</p>
          </div>
          <div className={styles.direccionGroup}>
            <label>Dirección:</label>
            <div className={styles.direccionDetails}>
              <p>Municipio: Zapopan</p>
              <p>Colonia: Centro</p>
              <p>Calle: Juárez</p>
              <p>Número: 876</p>
            </div>
          </div>
          <button className={styles.contactarBtn}>Ofrecer Apoyo</button>
        </div>
      </div>
    </div>
  );
};

export default ProyectosAliado; 