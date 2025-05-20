import React, { useState, useEffect } from 'react';
import styles from './EscuelasAliado.module.css';

const EscuelasAliado = ({ aliadoData }) => {
  const [escuelas, setEscuelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [selectedEscuela, setSelectedEscuela] = useState(null);
  const [showNecesidadesModal, setShowNecesidadesModal] = useState(false);
  const [necesidades, setNecesidades] = useState([]);
  const [loadingNecesidades, setLoadingNecesidades] = useState(false);
  const [necesidadesError, setNecesidadesError] = useState(null);
  const [showConvenioModal, setShowConvenioModal] = useState(false);
  const [selectedNecesidad, setSelectedNecesidad] = useState(null);
  const [firmaAliado, setFirmaAliado] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchNombre, setSearchNombre] = useState('');
  const [searchCCT, setSearchCCT] = useState('');
  const [searchMunicipio, setSearchMunicipio] = useState('');
  const [searchNivel, setSearchNivel] = useState('');
  const [searchCategoria, setSearchCategoria] = useState('');
  const [isMatchingSearch, setIsMatchingSearch] = useState(false);

  useEffect(() => {
    const fetchEscuelas = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('http://localhost:1000/api/escuelas/');
        
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
        
        setEscuelas(data.escuelas || []);
      } catch (error) {
        setError('No se pudieron cargar las escuelas. Por favor, intente nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchEscuelas();
  }, []);

  // Function to fetch necesidades for a specific escuela
  const fetchNecesidadesForEscuela = async (escuela) => {
    try {
      setLoadingNecesidades(true);
      setNecesidadesError(null);
      setSelectedEscuela(escuela);
      
      if (!escuela.CCT) {
        throw new Error('CCT de la escuela no disponible');
      }
      
      const response = await fetch(`http://localhost:1000/api/necesidades/escuela/${escuela.CCT}`);
      
      if (!response.ok) {
        // If 404, just means no necesidades found
        if (response.status === 404) {
          setNecesidades([]);
          return;
        }
        throw new Error(`Error al obtener necesidades: ${response.status}`);
      }
      
      const data = await response.json();
      setNecesidades(Array.isArray(data) ? data : []);
    } catch (error) {
      setNecesidadesError(error.message || 'Error al cargar las necesidades');
    } finally {
      setLoadingNecesidades(false);
      setShowNecesidadesModal(true);
    }
  };

  // Function to format date as DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX');
  };

  // Close the modal
  const closeNecesidadesModal = () => {
    setShowNecesidadesModal(false);
    setSelectedEscuela(null);
    setNecesidades([]);
    setNecesidadesError(null);
  };

  // Function to handle convenio registration
  const handleConvenioRegistration = async () => {
    try {
      if (!firmaAliado) {
        setMessage({ type: 'error', text: 'Debe marcar la casilla de firma del aliado para continuar' });
        return;
      }

      console.log('Attempting to register convenio with data:', {
        aliadoData,
        selectedEscuela,
        selectedNecesidad,
        firmaAliado
      });

      if (!aliadoData?.idAliado || !selectedEscuela?.CCT || !selectedNecesidad?.Sub_categoria) {
        console.error('Missing required data:', {
          idAliado: aliadoData?.idAliado,
          CCT: selectedEscuela?.CCT,
          categoria: selectedNecesidad?.Sub_categoria
        });
        throw new Error('Faltan datos necesarios para registrar el convenio');
      }

      const convenioData = {
        CCT: selectedEscuela.CCT,
        idAliado: aliadoData.idAliado,
        categoria: selectedNecesidad.Sub_categoria,
        firma_aliado: firmaAliado
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
      setFirmaAliado(false);
      setSelectedNecesidad(null);
      setMessage({ type: 'success', text: 'Convenio registrado exitosamente' });
    } catch (error) {
      console.error('Error al registrar convenio:', error);
      setMessage({ type: 'error', text: `Error al registrar el convenio: ${error.message}` });
    }
  };

  // Function to clear message
  const clearMessage = () => {
    setMessage(null);
  };

  // Close the convenio modal
  const closeConvenioModal = () => {
    setShowConvenioModal(false);
    setSelectedNecesidad(null);
    setFirmaAliado(false);
  };

  const handleSearchNombre = async () => {
    if (!searchNombre) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:1000/api/escuela/nombre/${encodeURIComponent(searchNombre)}`);
      const data = await response.json();
      if (!response.ok) throw new Error('No se encontraron escuelas con ese nombre');
      setEscuelas(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(err.message);
      setEscuelas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchCCT = async () => {
    if (!searchCCT) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:1000/api/escuela/${encodeURIComponent(searchCCT)}`);
      const data = await response.json();
      if (!response.ok) throw new Error('No se encontró la escuela con ese CCT');
      setEscuelas(data ? [data] : []);
    } catch (err) {
      setError(err.message);
      setEscuelas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchMunicipio = async () => {
    if (!searchMunicipio) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:1000/api/escuela/municipio/${encodeURIComponent(searchMunicipio)}`);
      const data = await response.json();
      if (!response.ok) throw new Error('No se encontraron escuelas en ese municipio');
      setEscuelas(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(err.message);
      setEscuelas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchNivel = async () => {
    if (!searchNivel) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:1000/api/escuela/nivel_educativo/${encodeURIComponent(searchNivel)}`);
      const data = await response.json();
      if (!response.ok) throw new Error('No se encontraron escuelas con ese nivel educativo');
      setEscuelas(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(err.message);
      setEscuelas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchCategoria = async () => {
    if (!searchCategoria) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:1000/api/escuela/categoria-necesidad/${encodeURIComponent(searchCategoria)}`);
      const data = await response.json();
      if (!response.ok) throw new Error('No se encontraron escuelas con necesidades en esa categoría');
      setEscuelas(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(err.message);
      setEscuelas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchMatching = async () => {
    if (!aliadoData?.idAliado) {
      setError('No se pudo obtener la información del aliado');
      return;
    }

    setLoading(true);
    setError(null);
    setIsMatchingSearch(true);

    try {
      const response = await fetch(`http://localhost:1000/api/escuelas/matching-necesidades/${aliadoData.idAliado}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'No se encontraron escuelas coincidentes');
      }

      setEscuelas(data.escuelas || []);
    } catch (err) {
      setError(err.message);
      setEscuelas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = async () => {
    setSearchNombre('');
    setSearchCCT('');
    setSearchMunicipio('');
    setSearchNivel('');
    setSearchCategoria('');
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:1000/api/escuelas/');
      const data = await response.json();
      setEscuelas(data.escuelas || []);
    } catch (err) {
      setEscuelas([]);
      setError('No se pudieron cargar las escuelas.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Cargando escuelas...</div>;
  }

  return (
    <div className={styles.escuelasContainer}>
      <div className={styles.searchMenu}>
        <div className={styles.searchGroup}>
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={searchNombre}
            onChange={e => setSearchNombre(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSearchNombre()}
          />
          <button type="button" onClick={handleSearchNombre}>Buscar</button>
        </div>
        <div className={styles.searchGroup}>
          <input
            type="text"
            placeholder="Buscar por CCT"
            value={searchCCT}
            onChange={e => setSearchCCT(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSearchCCT()}
          />
          <button type="button" onClick={handleSearchCCT}>Buscar</button>
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
            placeholder="Buscar por nivel educativo"
            value={searchNivel}
            onChange={e => setSearchNivel(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSearchNivel()}
          />
          <button type="button" onClick={handleSearchNivel}>Buscar</button>
        </div>
        <div className={styles.searchGroup}>
          <input
            type="text"
            placeholder="Buscar por categoría de necesidad"
            value={searchCategoria}
            onChange={e => setSearchCategoria(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSearchCategoria()}
          />
          <button type="button" onClick={handleSearchCategoria}>Buscar</button>
        </div>
        <button 
          type="button" 
          onClick={handleSearchMatching} 
          className={`${styles.matchingBtn} ${isMatchingSearch ? styles.active : ''}`}
        >
          Mostrar escuelas con necesidades coincidentes
        </button>
        <button 
          type="button" 
          onClick={handleClearSearch} 
          className={styles.clearBtn}
        >
          Limpiar filtros
        </button>
      </div>

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
      
      {!error && escuelas.length === 0 ? (
        <div className={styles.noEscuelas}>No hay escuelas disponibles</div>
      ) : (
      <div className={styles.escuelasGrid}>
          {escuelas.map((escuela) => (
            <div key={escuela.CCT} className={styles.escuelaCard}>
              <h2>{escuela.nombre}</h2>
          <div className={styles.infoGroup}>
            <label>CCT:</label>
                <p>{escuela.CCT}</p>
          </div>
          <div className={styles.infoGroup}>
            <label>Nivel Educativo:</label>
                <p>{escuela.nivel_educativo}</p>
          </div>
          <div className={styles.direccionGroup}>
            <label>Dirección:</label>
            <div className={styles.direccionDetails}>
                  <p>Calle: {escuela.direccion?.calle || escuela.calle || 'No disponible'}</p>
                  <p>Número: {escuela.direccion?.numero || escuela.numero || 'No disponible'}</p>
                  <p>Colonia: {escuela.direccion?.colonia || escuela.colonia || 'No disponible'}</p>
                  <p>Municipio: {escuela.direccion?.municipio || escuela.municipio || 'No disponible'}</p>
            </div>
          </div>
          <div className={styles.infoGroup}>
            <label>Número de estudiantes:</label>
                <p>{escuela.numero_alumnos || escuela.numero_estudiantes || 'No disponible'}</p>
          </div>
              {escuela.descripcion && (
          <div className={styles.descripcionGroup}>
            <label>Descripción:</label>
                  <p>{escuela.descripcion}</p>
                </div>
              )}
              
              {/* Representantes section */}
              {escuela.representantes && escuela.representantes.length > 0 && (
                <div className={styles.representantesGroup}>
                  <label>Representantes:</label>
                  <div className={styles.representantesList}>
                    {escuela.representantes.map((representante, index) => (
                      <div key={`${escuela.CCT}-rep-${index}`} className={styles.representanteItem}>
                        <p><strong>Nombre:</strong> {representante.nombre}</p>
                        <p><strong>Correo:</strong> {representante.correo_electronico}</p>
                      </div>
                    ))}
          </div>
        </div>
              )}

              <div className={styles.buttonContainer}>
                <button className={styles.verNecesidadesBtn} onClick={() => fetchNecesidadesForEscuela(escuela)}>
                  Ver Necesidades
                </button>
              </div>
          </div>
          ))}
          </div>
      )}

      {/* Modal for displaying necesidades */}
      {showNecesidadesModal && selectedEscuela && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Necesidades de {selectedEscuela.nombre}</h3>
              <button className={styles.closeButton} onClick={closeNecesidadesModal}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              {loadingNecesidades ? (
                <div className={styles.loadingNecesidades}>Cargando necesidades...</div>
              ) : necesidadesError ? (
                <div className={styles.necesidadesError}>{necesidadesError}</div>
              ) : necesidades.length === 0 ? (
                <div className={styles.noNecesidades}>
                  Esta escuela no tiene necesidades registradas.
                </div>
              ) : (
                <div className={styles.necesidadesGrid}>
                  {necesidades.map((necesidad) => (
                    <div key={necesidad.idNecesidad} className={styles.necesidadCard}>
                      <div className={styles.necesidadHeader}>
                        <h4>{necesidad.Categoria}</h4>
          </div>
                      <div className={styles.necesidadBody}>
                        <p><strong>Subcategoría:</strong> {necesidad.Sub_categoria}</p>
                        <p><strong>Fecha:</strong> {formatDate(necesidad.Fecha)}</p>
                        <div className={styles.descripcionNecesidad}>
                          <p><strong>Descripción:</strong></p>
                          <p>{necesidad.Descripcion}</p>
          </div>
                        {necesidad.Prioridad && (
                          <p><strong>Prioridad:</strong> {necesidad.Prioridad}</p>
                        )}
                        <p className={styles.validacionStatus}>
                          <strong>Estado:</strong> 
                          <span className={necesidad.Estado_validacion ? styles.validado : styles.pendiente}>
                            {necesidad.Estado_validacion ? 'Validado' : 'Pendiente de validación'}
                          </span>
                        </p>
                        <button 
                          className={styles.colaborarBtn}
                          onClick={() => {
                            setSelectedNecesidad(necesidad);
                            setShowConvenioModal(true);
                          }}
                        >
                          Colaborar con esta escuela
                        </button>
          </div>
        </div>
                  ))}
          </div>
              )}
          </div>
            <div className={styles.modalFooter}>
              <button className={styles.closeModalButton} onClick={closeNecesidadesModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for convenio registration */}
      {showConvenioModal && selectedNecesidad && selectedEscuela && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Registrar Convenio</h3>
              <button className={styles.closeButton} onClick={closeConvenioModal}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              {message && (
                <div className={`${styles.messageContainer} ${styles[message.type]}`}>
                  <p>{message.text}</p>
                  <button className={styles.closeMessageButton} onClick={clearMessage}>
                    &times;
                  </button>
                </div>
              )}
              <div className={styles.convenioForm}>
                <div className={styles.formGroup}>
                  <label>Nombre de la Escuela:</label>
                  <p>{selectedEscuela.nombre}</p>
                </div>
                <div className={styles.formGroup}>
                  <label>Aliado:</label>
                  <p>{aliadoData?.institucion}</p>
                </div>
                <div className={styles.formGroup}>
                  <label>Categoría:</label>
                  <p>{selectedNecesidad.Sub_categoria}</p>
                </div>
                <div className={styles.formGroup}>
                  <label>Firma de la Escuela:</label>
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
                      checked={firmaAliado}
                      onChange={(e) => setFirmaAliado(e.target.checked)}
                      required
                    />
                    Firma del Aliado *
                  </label>
                  <p className={styles.requiredNote}>* Campo obligatorio</p>
                </div>
          </div>
          </div>
            <div className={styles.modalFooter}>
              <button 
                className={styles.registrarConvenioBtn}
                onClick={handleConvenioRegistration}
                disabled={!firmaAliado}
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

export default EscuelasAliado; 