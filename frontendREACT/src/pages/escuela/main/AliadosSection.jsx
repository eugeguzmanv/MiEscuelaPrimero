import React, { useState, useEffect } from 'react';
import styles from './AliadosSection.module.css';

const AliadosSection = ({ escuelaData }) => {
  console.log('AliadosSection received escuelaData:', escuelaData);
  
  const [aliados, setAliados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [selectedAliado, setSelectedAliado] = useState(null);
  const [showApoyosModal, setShowApoyosModal] = useState(false);
  const [apoyos, setApoyos] = useState([]);
  const [loadingApoyos, setLoadingApoyos] = useState(false);
  const [apoyosError, setApoyosError] = useState(null);
  const [showConvenioModal, setShowConvenioModal] = useState(false);
  const [selectedApoyo, setSelectedApoyo] = useState(null);
  const [firmaEscuela, setFirmaEscuela] = useState(false);
  const [message, setMessage] = useState(null);
  const [isMatchingSearch, setIsMatchingSearch] = useState(false);

  // Replace the single search states with individual ones
  const [searchInstitucion, setSearchInstitucion] = useState('');
  const [searchSector, setSearchSector] = useState('');
  const [searchMunicipio, setSearchMunicipio] = useState('');
  const [searchCategoria, setSearchCategoria] = useState('');

  // Replace handleSearch with individual search handlers
  const handleSearchInstitucion = async () => {
    if (!searchInstitucion) return;
    try {
      setLoading(true);
      setError(null);
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
    try {
      setLoading(true);
      setError(null);
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
    try {
      setLoading(true);
      setError(null);
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
    try {
      setLoading(true);
      setError(null);
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

  const handleSearchMatching = async () => {
    if (!escuelaData?.CCT) {
      setError('No se pudo obtener la información de la escuela');
      return;
    }

    setLoading(true);
    setError(null);
    setIsMatchingSearch(true);

    try {
      const response = await fetch(`http://localhost:1000/api/aliados/matching-apoyos/${escuelaData.CCT}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'No se encontraron aliados coincidentes');
      }

      setAliados(data.aliados || []);
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
    fetchAliados();
  };

  const fetchAliados = async () => {
    try {
      setLoading(true);
      setError(null);
      
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

  useEffect(() => {
    fetchAliados();
  }, []);

  // Function to fetch apoyos for a specific aliado
  const fetchApoyosForAliado = async (aliado) => {
    try {
      setLoadingApoyos(true);
      setApoyosError(null);
      setSelectedAliado(aliado);
      
      // Ensure we have either idAliado or email to fetch the data
      if (!aliado.idAliado) {
        // If no idAliado, try to fetch it using the email
        const emailToUse = aliado.correo_electronico || aliado.correo;
        
        if (!emailToUse) {
          throw new Error('No se pudo identificar al aliado');
        }

        // First fetch the complete aliado data to get the idAliado
        const aliadoResponse = await fetch(`http://localhost:1000/api/aliadoCor/${encodeURIComponent(emailToUse)}`);
        if (!aliadoResponse.ok) {
          throw new Error('No se pudo obtener la información del aliado');
        }
        const aliadoData = await aliadoResponse.json();
        aliado = aliadoData; // Update the aliado object with complete data
      }
      
      const response = await fetch(`http://localhost:1000/api/apoyos/aliado/${aliado.idAliado}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setApoyos([]);
          return;
        }
        throw new Error(`Error al obtener apoyos: ${response.status}`);
      }
      
      const data = await response.json();
      setApoyos(Array.isArray(data) ? data : []);
    } catch (error) {
      setApoyosError(error.message || 'Error al cargar los apoyos');
    } finally {
      setLoadingApoyos(false);
      setShowApoyosModal(true);
    }
  };

  // Function to handle convenio registration
  const handleConvenioRegistration = async () => {
    try {
      if (!firmaEscuela) {
        setMessage({ type: 'error', text: 'Debe marcar la casilla de firma de la escuela para continuar' });
        return;
      }

      console.log('Attempting to register convenio with data:', {
        escuelaData,
        selectedAliado,
        selectedApoyo,
        firmaEscuela
      });

      if (!escuelaData?.CCT || !selectedAliado?.idAliado || !selectedApoyo?.Sub_categoria) {
        console.error('Missing required data:', {
          CCT: escuelaData?.CCT,
          idAliado: selectedAliado?.idAliado,
          categoria: selectedApoyo?.Sub_categoria
        });
        throw new Error('Faltan datos necesarios para registrar el convenio');
      }

      const convenioData = {
        CCT: escuelaData.CCT,
        idAliado: selectedAliado.idAliado,
        categoria: selectedApoyo.Sub_categoria,
        firma_escuela: firmaEscuela
      };

      console.log('Sending convenio data to server:', convenioData);

      const response = await fetch('http://localhost:1000/api/convenioRegistrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(convenioData),
      });

      console.log('Server response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from server:', errorData);
        throw new Error(`Error al registrar el convenio: ${errorData.error || 'Error desconocido'}`);
      }

      const responseData = await response.json();
      console.log('Convenio created successfully:', responseData);

      setShowConvenioModal(false);
      setFirmaEscuela(false);
      setSelectedApoyo(null);
      setMessage({ type: 'success', text: 'Convenio registrado exitosamente' });
    } catch (error) {
      console.error('Error al registrar convenio:', error);
      setMessage({ type: 'error', text: `Error al registrar el convenio: ${error.message}` });
    }
  };

  // Function to format date as DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX');
  };

  // Close the modal
  const closeApoyosModal = () => {
    setShowApoyosModal(false);
    setSelectedAliado(null);
    setApoyos([]);
    setApoyosError(null);
  };

  // Close the convenio modal
  const closeConvenioModal = () => {
    setShowConvenioModal(false);
    setSelectedApoyo(null);
    setFirmaEscuela(false);
  };

  // Function to clear message
  const clearMessage = () => {
    setMessage(null);
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
            onChange={(e) => setSearchInstitucion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchInstitucion()}
          />
          <button type="button" onClick={handleSearchInstitucion}>Buscar</button>
        </div>
        <div className={styles.searchGroup}>
          <input
            type="text"
            placeholder="Buscar por sector"
            value={searchSector}
            onChange={(e) => setSearchSector(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchSector()}
          />
          <button type="button" onClick={handleSearchSector}>Buscar</button>
        </div>
        <div className={styles.searchGroup}>
          <input
            type="text"
            placeholder="Buscar por municipio"
            value={searchMunicipio}
            onChange={(e) => setSearchMunicipio(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchMunicipio()}
          />
          <button type="button" onClick={handleSearchMunicipio}>Buscar</button>
        </div>
        <div className={styles.searchGroup}>
          <input
            type="text"
            placeholder="Buscar por categoría de apoyo"
            value={searchCategoria}
            onChange={(e) => setSearchCategoria(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchCategoria()}
          />
          <button type="button" onClick={handleSearchCategoria}>Buscar</button>
        </div>
        <button 
          type="button" 
          onClick={handleSearchMatching} 
          className={`${styles.matchingBtn} ${isMatchingSearch ? styles.active : ''}`}
        >
          Mostrar aliados con apoyos coincidentes
        </button>
        <button 
          type="button" 
          onClick={handleClearSearch} 
          className={styles.clearBtn}
        >
          Limpiar filtros
        </button>
      </div>

      {message && (
        <div className={`${styles.messageContainer} ${styles[message.type]}`}>
          <p>{message.text}</p>
          <button className={styles.closeMessageButton} onClick={clearMessage}>
            &times;
          </button>
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
        <div className={styles.noAliados}>
          {loading ? 'No se encontraron aliados para esta búsqueda' : 'No hay aliados disponibles'}
        </div>
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
                <button className={styles.verApoyosBtn} onClick={() => fetchApoyosForAliado(aliado)}>
                  Ver Apoyos
                </button>
              </div>
          </div>
          ))}
        </div>
      )}

      {/* Modal for displaying apoyos */}
      {showApoyosModal && selectedAliado && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Apoyos de {selectedAliado.nombre}</h3>
              <button className={styles.closeButton} onClick={closeApoyosModal}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              {loadingApoyos ? (
                <div className={styles.loadingApoyos}>Cargando apoyos...</div>
              ) : apoyosError ? (
                <div className={styles.apoyosError}>{apoyosError}</div>
              ) : apoyos.length === 0 ? (
                <div className={styles.noApoyos}>
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
                        <p className={styles.validacionStatus}>
                          <strong>Estado:</strong> 
                          <span className={apoyo.Estado_validacion ? styles.validado : styles.pendiente}>
                            {apoyo.Estado_validacion ? 'Validado' : 'Pendiente de validación'}
                          </span>
                        </p>
                        <button 
                          className={styles.colaborarBtn}
                          onClick={() => {
                            setSelectedApoyo(apoyo);
                            setShowConvenioModal(true);
                          }}
                        >
                          Colaborar con este aliado
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
            <div className={styles.modalFooter}>
              <button className={styles.closeModalButton} onClick={closeApoyosModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for convenio registration */}
      {showConvenioModal && selectedApoyo && selectedAliado && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Registrar Convenio</h3>
              <button className={styles.closeButton} onClick={closeConvenioModal}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.convenioForm}>
                <div className={styles.formGroup}>
                  <label>Nombre de la Escuela:</label>
                  <p>{escuelaData?.nombre || 'Cargando...'}</p>
                </div>
                <div className={styles.formGroup}>
                  <label>Institución:</label>
                  <p>{selectedAliado.institucion}</p>
                </div>
                <div className={styles.formGroup}>
                  <label>Categoría:</label>
                  <p>{selectedApoyo.Sub_categoria}</p>
                </div>
                <div className={styles.formGroup}>
                  <label>Firma del Aliado:</label>
                  <p>Pendiente</p>
                </div>
                <div className={styles.formGroup}>
                  <label>Validación de la Organización:</label>
                  <p>Pendiente</p>
          </div>
                <div className={styles.formGroup}>
                  <label>
                    <input
                      type="checkbox"
                      checked={firmaEscuela}
                      onChange={(e) => setFirmaEscuela(e.target.checked)}
                      required
                    />
                    Firma de la Escuela *
                  </label>
                  <p className={styles.requiredNote}>* Campo obligatorio</p>
          </div>
        </div>
          </div>
            <div className={styles.modalFooter}>
              <button 
                className={styles.registrarConvenioBtn}
                onClick={handleConvenioRegistration}
                disabled={!firmaEscuela}
              >
                Registrar Convenio
              </button>
              <button className={styles.closeModalButton} onClick={closeConvenioModal}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AliadosSection; 