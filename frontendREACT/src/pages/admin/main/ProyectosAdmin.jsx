import React from 'react';
import styles from './ProyectosAdmin.module.css';

const ProyectosAdmin = () => {
  return (
    <div className={styles.proyectosContainer}>
      <h2>Proyectos Activos</h2>
      <div className={styles.proyectosSection}>
        <div className={styles.proyectosGrid}>
          <div className={styles.proyectoCard}>
            <h3>Nombre del Aliado: Muebles González S.A. de C.V.</h3>
            <h3>Nombre de la Escuela: Escuela Primaria Juan Escutia</h3>
            <div className={styles.proyectoInfo}>
              <p><strong>Fecha de inicio:</strong> 01/03/2024</p>
              <p><strong>Fecha de finalización:</strong> 27/12/2024</p>
            </div>
            <button className={styles.actividadesBtn}>Actividades</button>
          </div>
        </div>
      </div>

      <div className={styles.proyectosSection}>
        <div className={styles.proyectosGrid}>
          <div className={styles.proyectoCard}>
            <h3>Nombre del Aliado: ITESO Universidad Jesuita de Guadalajara</h3>
            <h3>Nombre de la Escuela: Escuela Primaria Benito Juárez</h3>
            <div className={styles.proyectoInfo}>
              <p><strong>Fecha de inicio:</strong> 29/01/2025</p>
              <p><strong>Fecha de finalización:</strong> 27/10/2025</p>
            </div>
            <button className={styles.actividadesBtn}>Actividades</button>
          </div>
        </div>
      </div>

      <div className={styles.proyectosSection}>
        <div className={styles.proyectosGrid}>
          <div className={styles.proyectoCard}>
            <h3>Nombre del Aliado: Fundación Cultural de Occidente</h3>
            <h3>Nombre de la Escuela: Preescolar y Primaria Miguel Hidalgo</h3>
            <div className={styles.proyectoInfo}>
              <p><strong>Fecha de inicio:</strong> 13/09/2024</p>
              <p><strong>Fecha de finalización:</strong> 18/05/2025</p>
            </div>
            <button className={styles.actividadesBtn}>Actividades</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProyectosAdmin; 