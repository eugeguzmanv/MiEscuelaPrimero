import React, { useState, useEffect } from 'react';
import styles from './AliadosAdmin.module.css';

const AliadosAdmin = () => {
  const [aliados, setAliados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedAliado, setSelectedAliado] = useState(null);
  const [personaMoralData, setPersonaMoralData] = useState(null);
  const [escrituraPublicaData, setEscrituraPublicaData] = useState(null);
  const [constanciaFiscalData, setConstanciaFiscalData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [showApoyosModal, setShowApoyosModal] = useState(false);
  const [apoyos, setApoyos] = useState([]);
  const [loadingApoyos, setLoadingApoyos] = useState(false);
  const [apoyosError, setApoyosError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchInstitucion, setSearchInstitucion] = useState('');
  const [searchSector, setSearchSector] = useState('');
  const [searchMunicipio, setSearchMunicipio] = useState('');
  const [searchCategoria, setSearchCategoria] = useState('');

  useEffect(() => {
    const fetchAliados = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:1000/api/aliados');
        const responseText = await response.text();
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          setDebugInfo({ status: response.status, text: responseText });
          throw new Error(`Failed to parse response: ${parseError.message}`);
        }
        if (!response.ok) {
          setDebugInfo({ status: response.status, data });
          throw new Error(`Error: ${response.status}`);
        }
        if (data.aliados && Array.isArray(data.aliados)) {
          setAliados(data.aliados);
        } else {
          setDebugInfo({ invalidData: data });
          throw new Error('Invalid data format');
        }
      } catch (error) {
        setError('No se pudieron cargar los aliados. Por favor, intente nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchAliados();
  }, []);

  const handleViewInfo = async (aliado) => {
    setShowInfoModal(true);
    setModalLoading(true);
    setModalError(null);
    setSelectedAliado(null);
    setPersonaMoralData(null);
    setEscrituraPublicaData(null);
    setConstanciaFiscalData(null);

    try {
      // Use correo_electronico if available, otherwise fall back to correo
      const emailToUse = aliado.correo_electronico || aliado.correo;
      
      if (!emailToUse) {
        throw new Error('No se encontró el correo del aliado');
      }

      const aliadoResponse = await fetch(`http://localhost:1000/api/aliadoCor/${encodeURIComponent(emailToUse)}`);
      if (!aliadoResponse.ok) {
        throw new Error('No se pudo obtener información del aliado');
      }
      const aliadoData = await aliadoResponse.json();
      setSelectedAliado(aliadoData);

      // Try to fetch persona moral data
      try {
        const personaMoralResponse = await fetch(`http://localhost:1000/api/personaMoral/idAliado/${aliadoData.idAliado}`);
        if (personaMoralResponse.ok) {
          const personaMoralResult = await personaMoralResponse.json();
          if (personaMoralResult && personaMoralResult.idPersonaMoral) {
            setPersonaMoralData(personaMoralResult);

            // Fetch escritura publica
            try {
              const escrituraResponse = await fetch(`http://localhost:1000/api/escrituraPublica/idPersonaMoral/${personaMoralResult.idPersonaMoral}`);
              if (escrituraResponse.ok) {
                const escrituraResult = await escrituraResponse.json();
                setEscrituraPublicaData(escrituraResult);
              }
            } catch (escrituraErr) {
              console.error('Error fetching escritura publica:', escrituraErr);
            }

            // Fetch constancia fiscal
            try {
              const constanciaResponse = await fetch(`http://localhost:1000/api/constanciaFiscal/idPersonaMoral/${personaMoralResult.idPersonaMoral}`);
              if (constanciaResponse.ok) {
                const constanciaResult = await constanciaResponse.json();
                setConstanciaFiscalData(constanciaResult);
              }
            } catch (constanciaErr) {
              console.error('Error fetching constancia fiscal:', constanciaErr);
            }
          }
        }
      } catch (personaMoralErr) {
        console.error('Error checking persona moral status:', personaMoralErr);
      }
    } catch (err) {
      setModalError(err.message || 'Error al cargar la información completa');
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowInfoModal(false);
    setSelectedAliado(null);
    setPersonaMoralData(null);
    setEscrituraPublicaData(null);
    setConstanciaFiscalData(null);
    setModalError(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX');
  };

  const handleViewApoyos = async (aliado) => {
    setShowApoyosModal(true);
    setLoadingApoyos(true);
    setApoyosError(null);
    setSelectedAliado(aliado);
    setApoyos([]);
    
    try {
      const response = await fetch(`http://localhost:1000/api/apoyos/aliado/${encodeURIComponent(aliado.idAliado)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setApoyos([]);
          return;
        }
        throw new Error('No se pudieron obtener los apoyos del aliado');
      }
      
      const data = await response.json();
      setApoyos(data);
    } catch (error) {
      setApoyosError(error.message);
    } finally {
      setLoadingApoyos(false);
    }
  };

  const closeApoyosModal = () => {
    setShowApoyosModal(false);
    setSelectedAliado(null);
    setApoyos([]);
    setApoyosError(null);
  };

  const handleValidateApoyo = async (apoyo) => {
    try {
      const response = await fetch(`http://localhost:1000/api/apoyos/validar/${apoyo.idApoyo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Estado_validacion: true }),
      });

      if (!response.ok) {
        throw new Error('Error al validar el apoyo');
      }

      // Update the apoyos list locally
      setApoyos(prevApoyos =>
        prevApoyos.map(a =>
          a.idApoyo === apoyo.idApoyo
            ? { ...a, Estado_validacion: true }
            : a
        )
      );

      setSuccessMessage('Apoyo validado exitosamente');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setApoyosError(error.message);
    }
  };

  const handleSearchInstitucion = async () => {
    if (!searchInstitucion) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:1000/api/aliado/institucion/${encodeURIComponent(searchInstitucion)}`);
      const data = await response.json();
      if (!response.ok) throw new Error('No se encontraron aliados con esa institución');
      setAliados(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(err.message);
      setAliados([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSector = async () => {
    if (!searchSector) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:1000/api/aliado/sector/${encodeURIComponent(searchSector)}`);
      const data = await response.json();
      if (!response.ok) throw new Error('No se encontraron aliados en ese sector');
      setAliados(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(err.message);
      setAliados([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchMunicipio = async () => {
    if (!searchMunicipio) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:1000/api/aliado/municipio/${encodeURIComponent(searchMunicipio)}`);
      const data = await response.json();
      if (!response.ok) throw new Error('No se encontraron aliados en ese municipio');
      setAliados(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(err.message);
      setAliados([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchCategoria = async () => {
    if (!searchCategoria) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:1000/api/aliado/categoria-apoyo/${encodeURIComponent(searchCategoria)}`);
      const data = await response.json();
      if (!response.ok) throw new Error('No se encontraron aliados con apoyos en esa categoría');
      setAliados(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(err.message);
      setAliados([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = async () => {
    setSearchInstitucion('');
    setSearchSector('');
    setSearchMunicipio('');
    setSearchCategoria('');
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:1000/api/aliados');
      const data = await response.json();
      setAliados(data.aliados || []);
    } catch (err) {
      setAliados([]);
      setError('No se pudieron cargar los aliados.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Cargando aliados...</div>;
  }

  return (
    <div className={styles.aliadosContainer}>
      <div className={styles.searchMenu}>
        <div className={styles.searchGroup}>
          <input
            type="text"
            placeholder="Buscar por institución"
            value={searchInstitucion}
            onChange={e => setSearchInstitucion(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSearchInstitucion()}
          />
          <button type="button" onClick={handleSearchInstitucion}>Buscar</button>
        </div>
        <div className={styles.searchGroup}>
          <input
            type="text"
            placeholder="Buscar por sector"
            value={searchSector}
            onChange={e => setSearchSector(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSearchSector()}
          />
          <button type="button" onClick={handleSearchSector}>Buscar</button>
        </div>
        <div className={styles.searchGroup}>
          <input
            type="text"
            placeholder="Buscar por municipio"
            value={searchMunicipio}
            onChange={e => setSearchMunicipio(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSearchMunicipio()}
          />
          <button type="button" onClick={handleSearchMunicipio}>Buscar</button>
        </div>
        <div className={styles.searchGroup}>
          <input
            type="text"
            placeholder="Buscar por categoría de apoyo"
            value={searchCategoria}
            onChange={e => setSearchCategoria(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSearchCategoria()}
          />
          <button type="button" onClick={handleSearchCategoria}>Buscar</button>
        </div>
        <button type="button" onClick={handleClearSearch} className={styles.clearBtn}>Limpiar filtros</button>
      </div>
      {successMessage && (
        <div className={styles.successMessage}>
          {successMessage}
        </div>
      )}
      {error && (
        <div className={styles.errorContainer}>
          <p>{error}</p>
          {debugInfo && (
            <details>
              <summary>Información de depuración</summary>
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </details>
          )}
        </div>
      )}
      {!error && aliados.length === 0 ? (
        <div className={styles.noAliados}>No hay aliados disponibles</div>
      ) : (
        <div className={styles.aliadosGrid}>
          {aliados.map((aliado, index) => (
            <div key={aliado.idAliado || `aliado-${index}`} className={styles.aliadoCard}>
              <h2>{aliado.nombre || 'Aliado sin nombre'}</h2>
              {aliado.institucion && (
                <div className={styles.infoGroup}>
                  <label>Institución:</label>
                  <p>{aliado.institucion}</p>
                </div>
              )}
              {aliado.sector && (
                <div className={styles.infoGroup}>
                  <label>Sector:</label>
                  <p>{aliado.sector}</p>
                </div>
              )}
              {aliado.direccion && (
                <div className={styles.direccionGroup}>
                  <label>Dirección:</label>
                  <div className={styles.direccionDetails}>
                    {aliado.direccion.calle && <p>Calle: {aliado.direccion.calle}</p>}
                    {aliado.direccion.numero && <p>Número: {aliado.direccion.numero}</p>}
                    {aliado.direccion.colonia && <p>Colonia: {aliado.direccion.colonia}</p>}
                    {aliado.direccion.municipio && <p>Municipio: {aliado.direccion.municipio}</p>}
                  </div>
                </div>
              )}
              {aliado.descripcion && (
                <div className={styles.descripcionGroup}>
                  <label>Descripción:</label>
                  <p>{aliado.descripcion}</p>
                </div>
              )}
              {aliado.correo && (
                <div className={styles.infoGroup}>
                  <label>Correo:</label>
                  <p>{aliado.correo}</p>
                </div>
              )}
              <div className={styles.buttonContainer}>
                <button 
                  className={styles.infoBtn} 
                  onClick={() => handleViewInfo(aliado)}
                >
                  Ver información completa
                </button>
                <button 
                  className={styles.apoyosBtn} 
                  onClick={() => handleViewApoyos(aliado)}
                >
                  Ver apoyos
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for full aliado info */}
      {showInfoModal && (
        <div className={`${styles.modalOverlay} ${styles.modalFixed}`}>
          <div className={`${styles.modalContent} ${styles.modalCentered}`}>
            <div className={styles.modalHeader}>
              <h2>Perfil del Aliado</h2>
              <button className={styles.closeButton} onClick={handleCloseModal}>&times;</button>
            </div>
            <div className={styles.modalBody}>
              {modalLoading ? (
                <div className={styles.loadingContainer}>Cargando información...</div>
              ) : modalError ? (
                <div className={styles.errorContainer}>{modalError}</div>
              ) : selectedAliado ? (
                <div className={styles.perfilContainer}>
                  <div className={styles.infoGroup}>
                    <label>Nombre:</label>
                    <p>{selectedAliado.nombre || 'No disponible'}</p>
                  </div>
                  <div className={styles.infoGroup}>
                    <label>Institución:</label>
                    <p>{selectedAliado.institucion || 'No disponible'}</p>
                  </div>
                  <div className={styles.infoGroup}>
                    <label>Sector:</label>
                    <p>{selectedAliado.sector || 'No disponible'}</p>
                  </div>
                  <div className={styles.infoGroup}>
                    <label>CURP:</label>
                    <p>{selectedAliado.CURP || 'No disponible'}</p>
                  </div>
                  <div className={styles.infoGroup}>
                    <label>Correo electrónico:</label>
                    <p>{selectedAliado.correo_electronico || 'No disponible'}</p>
                  </div>

                  <h3>Dirección</h3>
                  <div className={styles.direccionGroup}>
                    <div className={styles.direccionDetails}>
                      <p>Calle: {selectedAliado.calle || 'No disponible'}</p>
                      <p>Número: {selectedAliado.numero || 'No disponible'}</p>
                      <p>Colonia: {selectedAliado.colonia || 'No disponible'}</p>
                      <p>Municipio: {selectedAliado.municipio || 'No disponible'}</p>
                    </div>
                  </div>

                  <div className={styles.descripcionGroup}>
                    <label>Descripción:</label>
                    <p>{selectedAliado.descripcion || 'No disponible'}</p>
                  </div>

                  {/* Persona Moral Section */}
                  {personaMoralData && (
                    <>
                      <h3>Datos de Persona Moral</h3>
                      <div className={styles.infoGroup}>
                        <label>Nombre de la organización:</label>
                        <p>{personaMoralData.nombre_organizacion || 'No disponible'}</p>
                      </div>
                      <div className={styles.infoGroup}>
                        <label>Giro:</label>
                        <p>{personaMoralData.giro || 'No disponible'}</p>
                      </div>
                      <div className={styles.infoGroup}>
                        <label>Propósito:</label>
                        <p>{personaMoralData.proposito || 'No disponible'}</p>
                      </div>
                      <div className={styles.infoGroup}>
                        <label>Página web:</label>
                        <p>{personaMoralData.pagina_web || 'No disponible'}</p>
                      </div>
                    </>
                  )}

                  {/* Escritura Publica Section */}
                  {escrituraPublicaData && (
                    <>
                      <h3>Escritura Pública</h3>
                      <div className={styles.infoGroup}>
                        <label>Número de escritura:</label>
                        <p>{escrituraPublicaData.numero_escritura || 'No disponible'}</p>
                      </div>
                      <div className={styles.infoGroup}>
                        <label>Fecha de escritura:</label>
                        <p>{escrituraPublicaData.fecha_escritura || 'No disponible'}</p>
                      </div>
                      <div className={styles.infoGroup}>
                        <label>Notario:</label>
                        <p>{escrituraPublicaData.notario || 'No disponible'}</p>
                      </div>
                      <div className={styles.infoGroup}>
                        <label>Ciudad:</label>
                        <p>{escrituraPublicaData.ciudad || 'No disponible'}</p>
                      </div>
                    </>
                  )}

                  {/* Constancia Fiscal Section */}
                  {constanciaFiscalData && (
                    <>
                      <h3>Constancia Fiscal</h3>
                      <div className={styles.infoGroup}>
                        <label>RFC:</label>
                        <p>{constanciaFiscalData.RFC || 'No disponible'}</p>
                      </div>
                      <div className={styles.infoGroup}>
                        <label>Razón social:</label>
                        <p>{constanciaFiscalData.razon_social || 'No disponible'}</p>
                      </div>
                      <div className={styles.infoGroup}>
                        <label>Régimen:</label>
                        <p>{constanciaFiscalData.regimen || 'No disponible'}</p>
                      </div>
                      <div className={styles.infoGroup}>
                        <label>Domicilio fiscal:</label>
                        <p>{constanciaFiscalData.domicilio || 'No disponible'}</p>
                      </div>
                    </>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* New Modal for displaying apoyos */}
      {showApoyosModal && selectedAliado && (
        <div className={`${styles.modalOverlay} ${styles.modalFixed}`}>
          <div className={`${styles.modalContent} ${styles.modalCentered}`}>
            <div className={styles.modalHeader}>
              <h2>Apoyos de {selectedAliado.nombre}</h2>
              <button className={styles.closeButton} onClick={closeApoyosModal}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              {loadingApoyos ? (
                <div className={styles.loadingContainer}>Cargando apoyos...</div>
              ) : apoyosError ? (
                <div className={styles.errorContainer}>{apoyosError}</div>
              ) : apoyos.length === 0 ? (
                <div className={styles.emptyState}>
                  Este aliado no tiene apoyos registrados.
                </div>
              ) : (
                <div className={styles.apoyosGrid}>
                  {apoyos.map((apoyo) => (
                    <div key={apoyo.idApoyo} className={styles.apoyoCard}>
                      <div className={styles.apoyoHeader}>
                        <h4>{apoyo.Categoria}</h4>
                      </div>
                      <div className={styles.apoyoBody}>
                        <p><strong>Subcategoría:</strong> {apoyo.Sub_categoria}</p>
                        <p><strong>Fecha:</strong> {formatDate(apoyo.Fecha)}</p>
                        <div className={styles.descripcionApoyo}>
                          <p><strong>Descripción:</strong></p>
                          <p>{apoyo.Descripcion}</p>
                        </div>
                        <div className={styles.validacionContainer}>
                          <p className={styles.validacionStatus}>
                            <strong>Estado:</strong> 
                            <span className={apoyo.Estado_validacion ? styles.validado : styles.pendiente}>
                              {apoyo.Estado_validacion ? 'Validado' : 'Pendiente de validación'}
                            </span>
                          </p>
                          {!apoyo.Estado_validacion && (
                            <button 
                              className={styles.validarBtn}
                              onClick={() => handleValidateApoyo(apoyo)}
                            >
                              Validar apoyo
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AliadosAdmin; 