import React, { useState, useEffect } from 'react';
import styles from './PerfilAliado.module.css';

const PerfilAliado = () => {
  const [aliadoData, setAliadoData] = useState(null);
  const [personaMoralData, setPersonaMoralData] = useState(null);
  const [escrituraPublicaData, setEscrituraPublicaData] = useState(null);
  const [constanciaFiscalData, setConstanciaFiscalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPersonaMoral, setIsPersonaMoral] = useState(false);
  
  // State variables for edit functionality
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedAliadoData, setEditedAliadoData] = useState(null);
  const [editedPersonaMoralData, setEditedPersonaMoralData] = useState(null);
  const [editedEscrituraPublicaData, setEditedEscrituraPublicaData] = useState(null);
  const [editedConstanciaFiscalData, setEditedConstanciaFiscalData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Clear any existing data first to avoid showing stale data
        setAliadoData(null);
        setPersonaMoralData(null);
        setEscrituraPublicaData(null);
        setConstanciaFiscalData(null);
        setIsPersonaMoral(false);
        
        // Get the user email from session storage
        const userEmail = sessionStorage.getItem('userEmail');
        
        if (!userEmail) {
          setError('No se encontró información del usuario');
          setLoading(false);
          return;
        }

        console.log('Fetching aliado data for email:', userEmail);
        
        // Fetch aliado data from API
        const aliadoResponse = await fetch(`http://localhost:1000/api/aliadoCor/${userEmail}`);
        
        if (!aliadoResponse.ok) {
          throw new Error('Error al obtener datos del aliado');
        }
        
        const aliadoResult = await aliadoResponse.json();
        console.log('Aliado data received:', aliadoResult);
        setAliadoData(aliadoResult);
        
        if (!aliadoResult.idAliado) {
          throw new Error('No se encontró ID del aliado');
        }
        
        // Try to fetch persona moral data
        try {
          console.log('Checking if aliado has persona moral, aliado ID:', aliadoResult.idAliado);
          const personaMoralResponse = await fetch(`http://localhost:1000/api/personaMoral/idAliado/${aliadoResult.idAliado}`);
          
          if (personaMoralResponse.ok) {
            const personaMoralResult = await personaMoralResponse.json();
            console.log('Persona moral data received:', personaMoralResult);
            
            // If we get valid persona moral data, this is a persona moral
            if (personaMoralResult && personaMoralResult.idPersonaMoral) {
              setPersonaMoralData(personaMoralResult);
              setIsPersonaMoral(true);
              
              // Now fetch related escritura publica and constancia fiscal
              try {
                console.log('Fetching escritura publica, persona moral ID:', personaMoralResult.idPersonaMoral);
                const escrituraResponse = await fetch(`http://localhost:1000/api/escrituraPublica/idPersonaMoral/${personaMoralResult.idPersonaMoral}`);
                if (escrituraResponse.ok) {
                  const escrituraResult = await escrituraResponse.json();
                  console.log('Escritura publica data received:', escrituraResult);
                  setEscrituraPublicaData(escrituraResult);
                } else {
                  console.log('No escritura publica found or error occurred');
                }
              } catch (escrituraErr) {
                console.error('Error fetching escritura publica:', escrituraErr);
              }
              
              try {
                console.log('Fetching constancia fiscal, persona moral ID:', personaMoralResult.idPersonaMoral);
                const constanciaResponse = await fetch(`http://localhost:1000/api/constanciaFiscal/idPersonaMoral/${personaMoralResult.idPersonaMoral}`);
                if (constanciaResponse.ok) {
                  const constanciaResult = await constanciaResponse.json();
                  console.log('Constancia fiscal data received:', constanciaResult);
                  setConstanciaFiscalData(constanciaResult);
                } else {
                  console.log('No constancia fiscal found or error occurred');
                }
              } catch (constanciaErr) {
                console.error('Error fetching constancia fiscal:', constanciaErr);
              }
            } else {
              console.log('No valid persona moral data found, treating as persona fisica');
              setIsPersonaMoral(false);
            }
          } else {
            // If we don't get persona moral data, this is a persona fisica
            console.log('No persona moral data found, treating as persona fisica');
            setIsPersonaMoral(false);
          }
        } catch (personaMoralErr) {
          // Error fetching persona moral data, assume it's persona fisica
          console.error('Error checking persona moral status:', personaMoralErr);
          setIsPersonaMoral(false);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Error al cargar datos del perfil: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []); // Empty dependency array ensures it only runs once on mount

  // Function to handle opening the edit modal
  const handleOpenEditModal = () => {
    // Create deep copies of the data for editing
    setEditedAliadoData({...aliadoData});
    if (isPersonaMoral && personaMoralData) {
      setEditedPersonaMoralData({...personaMoralData});
    }
    if (isPersonaMoral && escrituraPublicaData) {
      setEditedEscrituraPublicaData({...escrituraPublicaData});
    }
    if (isPersonaMoral && constanciaFiscalData) {
      setEditedConstanciaFiscalData({...constanciaFiscalData});
    }
    
    setShowEditModal(true);
  };

  // Function to handle closing the edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setUpdateMessage({ type: '', text: '' });
  };

  // Function to handle input changes for aliado data
  const handleAliadoInputChange = (e) => {
    const { name, value } = e.target;
    setEditedAliadoData({
      ...editedAliadoData,
      [name]: value
    });
  };

  // Function to handle input changes for persona moral data
  const handlePersonaMoralInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPersonaMoralData({
      ...editedPersonaMoralData,
      [name]: value
    });
  };

  // Function to handle input changes for escritura publica data
  const handleEscrituraPublicaInputChange = (e) => {
    const { name, value } = e.target;
    setEditedEscrituraPublicaData({
      ...editedEscrituraPublicaData,
      [name]: value
    });
  };

  // Function to handle input changes for constancia fiscal data
  const handleConstanciaFiscalInputChange = (e) => {
    const { name, value } = e.target;
    setEditedConstanciaFiscalData({
      ...editedConstanciaFiscalData,
      [name]: value
    });
  };

  // Function to update aliado information
  const updateAliadoInformation = async () => {
    setIsUpdating(true);
    try {
      // Prepare data for the API request
      const updateData = {
        aliadoData: {
          ...editedAliadoData,
          idAliado: aliadoData.idAliado // Ensure idAliado is included
        },
      };
      
      // Include persona moral data if applicable
      if (editedPersonaMoralData) {
        updateData.personaMoralData = {
          ...editedPersonaMoralData,
          // Ensure idPersonaMoral is included if available
          idPersonaMoral: personaMoralData?.idPersonaMoral
        };
      }
      
      // Include escritura publica data if applicable
      if (editedEscrituraPublicaData) {
        updateData.escrituraPublicaData = {
          ...editedEscrituraPublicaData,
          // Ensure idEscrituraPublica is included if available
          idEscrituraPublica: escrituraPublicaData?.idEscrituraPublica
        };
      }
      
      // Include constancia fiscal data if applicable
      if (editedConstanciaFiscalData) {
        updateData.constanciaFiscalData = {
          ...editedConstanciaFiscalData,
          // Ensure idConstanciaFiscal is included if available
          idConstanciaFiscal: constanciaFiscalData?.idConstanciaFiscal
        };
      }
      
      console.log('Sending update request with data:', updateData);
      
      // Send the update request to the API
      const response = await fetch(`http://localhost:1000/api/aliado/actualizarCompleto/${aliadoData.idAliado}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar la información del aliado');
      }

      // Update the state with the edited data
      setAliadoData(editedAliadoData);
      
      if (editedPersonaMoralData) {
        setPersonaMoralData(editedPersonaMoralData);
      }
      
      if (editedEscrituraPublicaData) {
        setEscrituraPublicaData(editedEscrituraPublicaData);
      }
      
      if (editedConstanciaFiscalData) {
        setConstanciaFiscalData(editedConstanciaFiscalData);
      }
      
      // Show success message
      setUpdateMessage({
        type: 'success',
        text: 'Información actualizada correctamente'
      });
      
      // Auto-clear message after 3 seconds
      setTimeout(() => {
        setUpdateMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      console.error('Error updating aliado information:', error);
      setUpdateMessage({
        type: 'error',
        text: error.message || 'Error al actualizar la información'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Cargando datos del perfil...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!aliadoData) {
    return <div className={styles.error}>No se encontraron datos del aliado</div>;
  }

  return (
    <div className={styles.perfilContainer}>
      <h2>Perfil del Aliado</h2>
      
      {/* Información Básica */}
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <label>Institución:</label>
          <p>{aliadoData.institucion}</p>
        </div>
        <div className={styles.infoItem}>
          <label>Sector:</label>
          <p>{aliadoData.sector}</p>
        </div>
        <div className={styles.infoItem}>
          <label>CURP:</label>
          <p>{aliadoData.CURP}</p>
        </div>
        <div className={styles.direccionContainer}>
          <label>Dirección:</label>
          <div className={styles.direccionDetails}>
            <p>Calle: {aliadoData.calle}</p>
            <p>Número: {aliadoData.numero}</p>
            <p>Colonia: {aliadoData.colonia}</p>
            <p>Municipio: {aliadoData.municipio}</p>
          </div>
        </div>
        <div className={styles.descripcionContainer}>
          <label>Descripción:</label>
          <p>{aliadoData.descripcion}</p>
        </div>
      </div>

      {/* Mostrar datos de persona moral solo si este aliado es una persona moral */}
      {isPersonaMoral && personaMoralData && (
        <>
      <h3>Datos de Persona Moral</h3>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <label>Nombre de la organización:</label>
              <p>{personaMoralData.nombre_organizacion}</p>
        </div>
        <div className={styles.infoItem}>
          <label>Giro:</label>
              <p>{personaMoralData.giro}</p>
        </div>
        <div className={styles.infoItem}>
          <label>Propósito:</label>
              <p>{personaMoralData.proposito}</p>
        </div>
        <div className={styles.infoItem}>
          <label>Página web:</label>
              <p>{personaMoralData.pagina_web}</p>
        </div>
      </div>
        </>
      )}

      {/* Mostrar datos de escritura publica solo si este aliado es una persona moral */}
      {isPersonaMoral && escrituraPublicaData && (
        <>
      <h3>Escritura Pública</h3>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <label>Número de escritura:</label>
              <p>{escrituraPublicaData.numero_escritura}</p>
        </div>
        <div className={styles.infoItem}>
          <label>Fecha de escritura:</label>
              <p>{escrituraPublicaData.fecha_escritura}</p>
        </div>
        <div className={styles.infoItem}>
          <label>Notario:</label>
              <p>{escrituraPublicaData.notario}</p>
        </div>
        <div className={styles.infoItem}>
          <label>Ciudad:</label>
              <p>{escrituraPublicaData.ciudad}</p>
        </div>
      </div>
        </>
      )}

      {/* Mostrar datos de constancia fiscal solo si este aliado es una persona moral */}
      {isPersonaMoral && constanciaFiscalData && (
        <>
      <h3>Constancia Fiscal</h3>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <label>Domicilio fiscal:</label>
              <p>{constanciaFiscalData.domicilio}</p>
        </div>
        <div className={styles.infoItem}>
          <label>Régimen:</label>
              <p>{constanciaFiscalData.regimen}</p>
        </div>
        <div className={styles.infoItem}>
          <label>Razón social:</label>
              <p>{constanciaFiscalData.razon_social}</p>
        </div>
        <div className={styles.infoItem}>
          <label>RFC:</label>
              <p>{constanciaFiscalData.RFC}</p>
            </div>
          </div>
        </>
      )}

      <button 
        className={styles.editButton}
        onClick={handleOpenEditModal}
      >
        Editar información
      </button>

      {/* Edit Modal */}
      {showEditModal && editedAliadoData && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Editar Información</h2>

            {updateMessage.text && (
              <div className={`${styles.messageBox} ${styles[updateMessage.type]}`}>
                {updateMessage.text}
              </div>
            )}

            <div className={styles.editSection}>
              <h3>Información del Aliado</h3>
              <div className={styles.editForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="nombre">Nombre</label>
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      value={editedAliadoData.nombre || ''}
                      onChange={handleAliadoInputChange}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="correo_electronico">Correo Electrónico</label>
                    <input
                      id="correo_electronico"
                      name="correo_electronico"
                      type="email"
                      value={editedAliadoData.correo_electronico || ''}
                      onChange={handleAliadoInputChange}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="CURP">CURP</label>
                    <input
                      id="CURP"
                      name="CURP"
                      type="text"
                      value={editedAliadoData.CURP || ''}
                      onChange={handleAliadoInputChange}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="institucion">Institución</label>
                    <input
                      id="institucion"
                      name="institucion"
                      type="text"
                      value={editedAliadoData.institucion || ''}
                      onChange={handleAliadoInputChange}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="sector">Sector</label>
                    <input
                      id="sector"
                      name="sector"
                      type="text"
                      value={editedAliadoData.sector || ''}
                      onChange={handleAliadoInputChange}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="contraseña">Nueva Contraseña (opcional)</label>
                    <input
                      id="contraseña"
                      name="contraseña"
                      type="password"
                      placeholder="Dejar en blanco para mantener contraseña actual"
                      onChange={handleAliadoInputChange}
                    />
                  </div>
                </div>

                <div className={styles.sectionSubtitle}>Dirección</div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="calle">Calle</label>
                    <input
                      id="calle"
                      name="calle"
                      type="text"
                      value={editedAliadoData.calle || ''}
                      onChange={handleAliadoInputChange}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="numero">Número</label>
                    <input
                      id="numero"
                      name="numero"
                      type="text"
                      value={editedAliadoData.numero || ''}
                      onChange={handleAliadoInputChange}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="colonia">Colonia</label>
                    <input
                      id="colonia"
                      name="colonia"
                      type="text"
                      value={editedAliadoData.colonia || ''}
                      onChange={handleAliadoInputChange}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="municipio">Municipio</label>
                    <input
                      id="municipio"
                      name="municipio"
                      type="text"
                      value={editedAliadoData.municipio || ''}
                      onChange={handleAliadoInputChange}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    rows="4"
                    value={editedAliadoData.descripcion || ''}
                    onChange={handleAliadoInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Persona Moral Form Section - Only show if this aliado is a persona moral */}
            {(isPersonaMoral || editedPersonaMoralData) && (
              <div className={styles.editSection}>
                <h3>Datos de Persona Moral</h3>
                <div className={styles.editForm}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="nombre_organizacion">Nombre de la Organización</label>
                      <input
                        id="nombre_organizacion"
                        name="nombre_organizacion"
                        type="text"
                        value={editedPersonaMoralData?.nombre_organizacion || ''}
                        onChange={handlePersonaMoralInputChange}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="giro">Giro</label>
                      <input
                        id="giro"
                        name="giro"
                        type="text"
                        value={editedPersonaMoralData?.giro || ''}
                        onChange={handlePersonaMoralInputChange}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="proposito">Propósito</label>
                      <input
                        id="proposito"
                        name="proposito"
                        type="text"
                        value={editedPersonaMoralData?.proposito || ''}
                        onChange={handlePersonaMoralInputChange}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="pagina_web">Página Web</label>
                      <input
                        id="pagina_web"
                        name="pagina_web"
                        type="text"
                        value={editedPersonaMoralData?.pagina_web || ''}
                        onChange={handlePersonaMoralInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Escritura Publica Form Section - Only show if this aliado is a persona moral and has escritura publica data */}
            {(isPersonaMoral && (escrituraPublicaData || editedEscrituraPublicaData)) && (
              <div className={styles.editSection}>
                <h3>Escritura Pública</h3>
                <div className={styles.editForm}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="numero_escritura">Número de Escritura</label>
                      <input
                        id="numero_escritura"
                        name="numero_escritura"
                        type="text"
                        value={editedEscrituraPublicaData?.numero_escritura || ''}
                        onChange={handleEscrituraPublicaInputChange}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="fecha_escritura">Fecha de Escritura</label>
                      <input
                        id="fecha_escritura"
                        name="fecha_escritura"
                        type="text"
                        value={editedEscrituraPublicaData?.fecha_escritura || ''}
                        onChange={handleEscrituraPublicaInputChange}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="notario">Notario</label>
                      <input
                        id="notario"
                        name="notario"
                        type="text"
                        value={editedEscrituraPublicaData?.notario || ''}
                        onChange={handleEscrituraPublicaInputChange}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="ciudad">Ciudad</label>
                      <input
                        id="ciudad"
                        name="ciudad"
                        type="text"
                        value={editedEscrituraPublicaData?.ciudad || ''}
                        onChange={handleEscrituraPublicaInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Constancia Fiscal Form Section - Only show if this aliado is a persona moral and has constancia fiscal data */}
            {(isPersonaMoral && (constanciaFiscalData || editedConstanciaFiscalData)) && (
              <div className={styles.editSection}>
                <h3>Constancia Fiscal</h3>
                <div className={styles.editForm}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="RFC">RFC</label>
                      <input
                        id="RFC"
                        name="RFC"
                        type="text"
                        value={editedConstanciaFiscalData?.RFC || ''}
                        onChange={handleConstanciaFiscalInputChange}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="razon_social">Razón Social</label>
                      <input
                        id="razon_social"
                        name="razon_social"
                        type="text"
                        value={editedConstanciaFiscalData?.razon_social || ''}
                        onChange={handleConstanciaFiscalInputChange}
                      />
        </div>
      </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="regimen">Régimen</label>
                      <input
                        id="regimen"
                        name="regimen"
                        type="text"
                        value={editedConstanciaFiscalData?.regimen || ''}
                        onChange={handleConstanciaFiscalInputChange}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="domicilio">Domicilio Fiscal</label>
                      <input
                        id="domicilio"
                        name="domicilio"
                        type="text"
                        value={editedConstanciaFiscalData?.domicilio || ''}
                        onChange={handleConstanciaFiscalInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className={styles.buttonContainer}>
              <button 
                className={styles.updateButton}
                onClick={updateAliadoInformation}
                disabled={isUpdating}
              >
                {isUpdating ? 'Actualizando...' : 'Actualizar Información'}
              </button>
            </div>

            <div className={styles.buttonContainer}>
              <button 
                className={styles.cancelButton}
                onClick={handleCloseEditModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerfilAliado; 