import React, { useState, useEffect } from 'react';
import styles from './EscuelasAdmin.module.css';

const EscuelasAdmin = () => {
  const [escuelas, setEscuelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [selectedEscuela, setSelectedEscuela] = useState(null);
  const [selectedRepresentantes, setSelectedRepresentantes] = useState([]);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showNecesidadesModal, setShowNecesidadesModal] = useState(false);
  const [necesidades, setNecesidades] = useState([]);
  const [loadingNecesidades, setLoadingNecesidades] = useState(false);
  const [necesidadesError, setNecesidadesError] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchNombre, setSearchNombre] = useState('');
  const [searchCCT, setSearchCCT] = useState('');
  const [searchMunicipio, setSearchMunicipio] = useState('');
  const [searchNivel, setSearchNivel] = useState('');
  const [searchCategoria, setSearchCategoria] = useState('');

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

  const handleViewInfo = async (escuela) => {
    setShowInfoModal(true);
    setModalLoading(true);
    setModalError(null);
    setSelectedEscuela(null);
    setSelectedRepresentantes([]);
    try {
      // Fetch full escuela info
      const escuelaResponse = await fetch(`http://localhost:1000/api/escuela/${encodeURIComponent(escuela.CCT)}`);
      if (!escuelaResponse.ok) {
        throw new Error('No se pudo obtener información de la escuela');
      }
      const escuelaData = await escuelaResponse.json();
      setSelectedEscuela(escuelaData);
      // Fetch representantes
      const repsResponse = await fetch(`http://localhost:1000/api/representantes/escuela/${encodeURIComponent(escuela.CCT)}`);
      if (repsResponse.ok) {
        const repsData = await repsResponse.json();
        setSelectedRepresentantes(repsData);
      } else {
        setSelectedRepresentantes([]);
      }
    } catch (err) {
      setModalError(err.message || 'Error al cargar la información completa');
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowInfoModal(false);
    setSelectedEscuela(null);
    setSelectedRepresentantes([]);
    setModalError(null);
  };

  // Function to format date as DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX');
  };

  const handleViewNecesidades = async (escuela) => {
    setShowNecesidadesModal(true);
    setLoadingNecesidades(true);
    setNecesidadesError(null);
    setSelectedEscuela(escuela);
    
    try {
      const response = await fetch(`http://localhost:1000/api/necesidades/escuela/${encodeURIComponent(escuela.CCT)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setNecesidades([]);
          return;
        }
        throw new Error('No se pudieron obtener las necesidades de la escuela');
      }
      
      const data = await response.json();
      setNecesidades(data);
    } catch (error) {
      setNecesidadesError(error.message);
    } finally {
      setLoadingNecesidades(false);
    }
  };

  const handleValidateNecesidad = async (necesidad) => {
    try {
      const response = await fetch(`http://localhost:1000/api/necesidades/validar/${necesidad.idNecesidad}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Estado_validacion: true }),
      });

      if (!response.ok) {
        throw new Error('Error al validar la necesidad');
      }

      // Update the necesidades list locally
      setNecesidades(prevNecesidades =>
        prevNecesidades.map(n =>
          n.idNecesidad === necesidad.idNecesidad
            ? { ...n, Estado_validacion: true }
            : n
        )
      );

      setSuccessMessage('Necesidad validada exitosamente');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setNecesidadesError(error.message);
    }
  };

  const closeNecesidadesModal = () => {
    setShowNecesidadesModal(false);
    setSelectedEscuela(null);
    setNecesidades([]);
    setNecesidadesError(null);
  };

  const handleSearchNombre = async () => {
    if (!searchNombre) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:1000/api/escuela/nombre/${encodeURIComponent(searchNombre)}`);
      const data = await response.json();
      if (!response.ok) throw new Error('No se encontraron escuelas con ese nombre');
      // Ensure data is always an array
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
      // Single school result should be wrapped in array
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
      // Ensure data is always an array
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
      // Ensure data is always an array
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
      // Ensure data is always an array
      setEscuelas(Array.isArray(data) ? data : [data]);
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

  // Function to render representante role with appropriate article
  const getRolWithArticle = (rol) => {
    if (!rol) return 'No disponible';
    const rolLower = rol.toLowerCase();
    if (rolLower === 'director' || rolLower === 'subdirector') {
      return `${rol}`;
    } else if (rolLower.startsWith('a') || rolLower.startsWith('e') || 
              rolLower.startsWith('i') || rolLower.startsWith('o') || 
              rolLower.startsWith('u')) {
      return `${rol}`;
    } else {
      return `${rol}`;
    }
  };

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
                <button className={styles.infoBtn} onClick={() => handleViewInfo(escuela)}>
                  Ver información completa
                </button>
                <button className={styles.necesidadesBtn} onClick={() => handleViewNecesidades(escuela)}>
                  Ver necesidades
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for full escuela info */}
      {showInfoModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Perfil de Escuela</h2>
              <button className={styles.closeButton} onClick={handleCloseModal}>&times;</button>
            </div>
            <div className={styles.modalBody}>
              {modalLoading ? (
                <div className={styles.loadingContainer}>Cargando información...</div>
              ) : modalError ? (
                <div className={styles.errorContainer}>{modalError}</div>
              ) : selectedEscuela ? (
                <div className={styles.perfilContainer}>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <label>Nombre de la Escuela:</label>
                      <p>{selectedEscuela.nombre || 'No disponible'}</p>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Clave (CCT):</label>
                      <p>{selectedEscuela.CCT || 'No disponible'}</p>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Nivel Educativo:</label>
                      <p>{selectedEscuela.nivel_educativo || 'No disponible'}</p>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Modalidad:</label>
                      <p>{selectedEscuela.modalidad || 'No disponible'}</p>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Control administrativo:</label>
                      <p>{selectedEscuela.control_administrativo || 'No disponible'}</p>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Sostenimiento:</label>
                      <p>{selectedEscuela.sostenimiento || 'No disponible'}</p>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Zona escolar:</label>
                      <p>{selectedEscuela.zona_escolar || 'No disponible'}</p>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Número de estudiantes:</label>
                      <p>{selectedEscuela.numero_estudiantes ? selectedEscuela.numero_estudiantes.toString() : 'No disponible'}</p>
                    </div>
                  </div>

                  <h3>Dirección</h3>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <label>Calle:</label>
                      <p>{selectedEscuela.calle || 'No disponible'}</p>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Número:</label>
                      <p>{selectedEscuela.numero || 'No disponible'}</p>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Colonia:</label>
                      <p>{selectedEscuela.colonia || 'No disponible'}</p>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Municipio:</label>
                      <p>{selectedEscuela.municipio || 'No disponible'}</p>
                    </div>
                  </div>

                  <div className={styles.descripcionContainer}>
                    <h3>Descripción</h3>
                    <p>{selectedEscuela.descripcion || 'No disponible'}</p>
                  </div>

                  <h3>Representantes de la Escuela</h3>
                  {selectedRepresentantes.length > 0 ? (
                    selectedRepresentantes.map((representante, index) => (
                      <div key={representante.idRepresentante || index} className={styles.representanteCard}>
                        <h4>{representante.nombre} - {getRolWithArticle(representante.rol)}</h4>
                        <div className={styles.infoGrid}>
                          <div className={styles.infoItem}>
                            <label>Correo electrónico:</label>
                            <p>{representante.correo_electronico || 'No disponible'}</p>
                          </div>
                          <div className={styles.infoItem}>
                            <label>Teléfono:</label>
                            <p>{representante.numero_telefonico || 'No disponible'}</p>
                          </div>
                          <div className={styles.infoItem}>
                            <label>Años de servicio:</label>
                            <p>{representante.anios_experiencia ? `${representante.anios_experiencia} años` : 'No disponible'}</p>
                          </div>
                          <div className={styles.infoItem}>
                            <label>Cambio de zona escolar:</label>
                            <p>{representante.cambio_zona ? 'Sí' : 'No'}</p>
                          </div>
                          <div className={styles.infoItem}>
                            <label>Próximo a jubilarse:</label>
                            <p>{representante.proximo_a_jubilarse ? 'Sí' : 'No'}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.emptyState}>
                      <p>No hay representantes registrados para esta escuela.</p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Modal for displaying necesidades */}
      {showNecesidadesModal && selectedEscuela && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Necesidades de {selectedEscuela.nombre}</h2>
              <button className={styles.closeButton} onClick={closeNecesidadesModal}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              {loadingNecesidades ? (
                <div className={styles.loadingContainer}>Cargando necesidades...</div>
              ) : necesidadesError ? (
                <div className={styles.errorContainer}>{necesidadesError}</div>
              ) : necesidades.length === 0 ? (
                <div className={styles.emptyState}>
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
                        <div className={styles.validacionContainer}>
                          <p className={styles.validacionStatus}>
                            <strong>Estado:</strong> 
                            <span className={necesidad.Estado_validacion ? styles.validado : styles.pendiente}>
                              {necesidad.Estado_validacion ? 'Validado' : 'Pendiente de validación'}
                            </span>
                          </p>
                          {!necesidad.Estado_validacion && (
                            <button 
                              className={styles.validarBtn}
                              onClick={() => handleValidateNecesidad(necesidad)}
                            >
                              Validar necesidad
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

export default EscuelasAdmin; 