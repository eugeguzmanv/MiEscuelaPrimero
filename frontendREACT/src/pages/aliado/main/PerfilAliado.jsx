import React from 'react';
import styles from './PerfilAliado.module.css';

const PerfilAliado = () => {
  return (
    <div className={styles.perfilContainer}>
      <h2>Perfil del Aliado</h2>
      
      {/* Información Básica */}
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <label>Institución:</label>
          <p>Muebles González S.A. de C.V.</p>
        </div>
        <div className={styles.infoItem}>
          <label>Sector:</label>
          <p>Mobiliario</p>
        </div>
        <div className={styles.infoItem}>
          <label>CURP:</label>
          <p>MELM800101HJCNNS09</p>
        </div>
        <div className={styles.direccionContainer}>
          <label>Dirección:</label>
          <div className={styles.direccionDetails}>
            <p>Calle: Av. Vallarta</p>
            <p>Número: 1458</p>
            <p>Colonia: Americana</p>
            <p>Municipio: Guadalajara</p>
          </div>
        </div>
        <div className={styles.descripcionContainer}>
          <label>Descripción:</label>
          <p>Muebles González S.A. de C.V. es una empresa dedicada a la fabricación y venta de muebles de alta calidad desde 1983.</p>
        </div>
      </div>

      <h3>Datos de Persona Moral</h3>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <label>Nombre de la organización:</label>
          <p>Muebles González S.A. de C.V.</p>
        </div>
        <div className={styles.infoItem}>
          <label>Giro:</label>
          <p>Empresa dedicada a la manufactura de mueblería</p>
        </div>
        <div className={styles.infoItem}>
          <label>Propósito:</label>
          <p>Mejoramiento de la infraestructura de escuelas públicas</p>
        </div>
        <div className={styles.infoItem}>
          <label>Página web:</label>
          <p>www.mueblesgonzalez.com.mx</p>
        </div>
      </div>

      <h3>Escritura Pública</h3>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <label>Número de escritura:</label>
          <p>24,567</p>
        </div>
        <div className={styles.infoItem}>
          <label>Fecha de escritura:</label>
          <p>15 de marzo de 2020</p>
        </div>
        <div className={styles.infoItem}>
          <label>Notario:</label>
          <p>Lic. Juan Pérez García</p>
        </div>
        <div className={styles.infoItem}>
          <label>Ciudad:</label>
          <p>Guadalajara</p>
        </div>
      </div>

      <h3>Constancia Fiscal</h3>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <label>Domicilio fiscal:</label>
          <p>Av. Vallarta 1458, Col. Americana, Guadalajara, Jalisco</p>
        </div>
        <div className={styles.infoItem}>
          <label>Régimen:</label>
          <p>Régimen de Personas Morales con Fines Lucrativos</p>
        </div>
        <div className={styles.infoItem}>
          <label>Razón social:</label>
          <p>Muebles González S.A. de C.V., Sociedad Anónima de Capital Variable</p>
        </div>
        <div className={styles.infoItem}>
          <label>RFC:</label>
          <p>FEU200315AC7</p>
        </div>
      </div>

      <button className={styles.editButton}>Editar información</button>
    </div>
  );
};

export default PerfilAliado; 