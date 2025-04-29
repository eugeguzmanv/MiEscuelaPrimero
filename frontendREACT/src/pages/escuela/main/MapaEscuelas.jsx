import React from 'react';
import Map from '../../../components/common/Map';
import styles from './MapaEscuelas.module.css';

const MapaEscuelas = () => {
  // Example markers for Jalisco schools
  const exampleMarkers = [
    {
      lat: 20.6597,
      lng: -103.3496,
      title: "Muebles González S.A. de C.V.",
      description: "Infraestrucutura",
      address: "Av. Revolución 1234, Col. Centro, Guadalajara"
    },
    {
      lat: 20.6697,
      lng: -103.3596,
      title: "ITESO Universidad Jesuita de Guadalajara",
      description: "Personal de apoyo",
      address: "Calle Reforma 567, Col. Moderna, Guadalajara"
    },
    {
      lat: 20.6757,
      lng: -103.3456,
      title: "Nestle México S.A. de C.V.",
      description: "Alimentación",
      address: "Av. Patria 890, Col. Jardines, Guadalajara"
    },
    {
      lat: 20.6527,
      lng: -103.3656,
      title: "Despacho de Abogados G & V",
      description: "Jurídico",
      address: "Calle López Mateos 123, Col. Santa Margarita, Guadalajara"
    }
  ];

  return (
    <div className={styles.mapPageContainer}>
      <div className={styles.mapHeader}>
        <h2>Mapa de Aliados en Jalisco</h2>
      </div>
      
      <div className={styles.mapWrapper}>
        <Map
          center={[20.6597, -103.3496]}
          zoom={13}
          markers={exampleMarkers}
          height="600px"
        />
      </div>
    </div>
  );
};

export default MapaEscuelas; 