import React from 'react';
import Map from '../../../components/common/Map';
import styles from './MapaAliados.module.css';

const MapaAliados = () => {
  // Example markers for aliados in Jalisco
  const exampleMarkers = [
    {
      lat: 20.6597,
      lng: -103.3496,
      title: "Escuela Primaria Benito Juárez",
      description: "Primaria",
      address: "Av. Revolución 1234, Col. Centro, Guadalajara"
    },
    {
      lat: 20.6697,
      lng: -103.3596,
      title: "Jardín de Niños México",
      description: "Preescolar",
      address: "Calle Reforma 567, Col. Moderna, Guadalajara"
    },
    {
      lat: 20.6757,
      lng: -103.3456,
      title: "Escuea Normal de Guadalajara",
      description: "Preescolar, Primaria y Secundaria",
      address: "Av. Patria 890, Col. Jardines, Guadalajara"
    },
    {
      lat: 20.6527,
      lng: -103.3656,
      title: "Secundaria Técnica No. 45",
      description: "Secundaria",
      address: "Calle López Mateos 123, Col. Santa Margarita, Guadalajara"
    }
  ];

  return (
    <div className={styles.mapContainer}>
      <div className={styles.mapHeader}>
        <h2>Mapa de Escuelas en Jalisco</h2>
      </div>
      
      <div className={styles.mapWrapper}>
        <Map
          center={[20.6597, -103.3496]}
          zoom={13}
          markers={exampleMarkers}
          height="400px"
        />
      </div>
    </div>
  );
};

export default MapaAliados; 