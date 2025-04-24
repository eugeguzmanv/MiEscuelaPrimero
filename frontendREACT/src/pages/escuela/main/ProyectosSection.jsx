import React from 'react';
import styles from './ProyectosSection.module.css';

const ProyectosSection = () => {
  return (
    <div className={styles.proyectosContainer}>
      <h2>Proyectos Activos</h2>
      <div className={styles.proyectosSection}>
        <div id="proyectos-grid" className={styles.proyectosGrid}>
          <div className={styles.proyectoCard}>
            <h3>Nombre del Aliado: Muebles González S.A. de C.V.</h3>
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
          <h3>Asociación Deportiva Jalisco</h3>
          <div className={styles.infoGroup}>
            <label>Categoría de Apoyo:</label>
            <p>Infraestructura Deportiva</p>
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
          <button className={styles.contactarBtn}>Solicitar Apoyo</button>
        </div>

        <div className={styles.matchCard}>
          <h3>Fundación Cultural de Occidente</h3>
          <div className={styles.infoGroup}>
            <label>Categoría de Apoyo:</label>
            <p>Programas Culturales</p>
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
          <button className={styles.contactarBtn}>Solicitar Apoyo</button>
        </div>
      </div>
    </div>
  );
};

export default ProyectosSection; 