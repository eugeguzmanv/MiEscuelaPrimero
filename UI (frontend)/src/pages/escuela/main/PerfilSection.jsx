import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './PerfilSection.module.css';

const PerfilSection = () => {
  const [escuelaData, setEscuelaData] = useState(null);
  const [representantes, setRepresentantes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedEscuela, setEditedEscuela] = useState(null);
  const [editedRepresentantes, setEditedRepresentantes] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState({ type: '', text: '' });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Try to get the CCT from URL parameters (from registration flow)
        const params = new URLSearchParams(location.search);
        let cct = params.get('cct');
        
        console.log("CCT from URL:", cct); // Debug log
        
        // If no CCT in URL, try to get the user email from session storage (from login flow)
        if (!cct) {
          const userEmail = sessionStorage.getItem('userEmail');
          const userProfile = sessionStorage.getItem('userProfile');
          
          console.log("Email from session:", userEmail); // Debug log
          
          if (!userEmail || userProfile !== 'escuela') {
            throw new Error('No se encontró información de la escuela. Por favor inicie sesión nuevamente.');
          }
          
          // First fetch the representante data using the email
          const representanteResponse = await fetch(`http://localhost:1000/api/representante/mail/${encodeURIComponent(userEmail)}`);
          
          if (!representanteResponse.ok) {
            throw new Error('No se pudo obtener información del representante');
          }
          
          const representanteData = await representanteResponse.json();
          
          // Get the CCT from the representante data
          cct = representanteData.CCT;
          
          console.log("CCT from representante:", cct); // Debug log
          
          if (!cct) {
            throw new Error('No se encontró el CCT de la escuela asociada');
          }
        }
        
        // Now fetch the school data using the CCT
        console.log("Fetching school data with CCT:", cct); // Debug log
        
        const escuelaResponse = await fetch(`http://localhost:1000/api/escuela/${encodeURIComponent(cct)}`);
        
        if (!escuelaResponse.ok) {
          throw new Error('No se pudo obtener información de la escuela');
        }
        
        const escuelaData = await escuelaResponse.json();
        console.log("Escuela data received:", escuelaData); // Debug log
        
        setEscuelaData(escuelaData);
        
        // Fetch all representantes for this school
        try {
          console.log("Fetching representantes with CCT:", cct); // Debug log
          
          const representantesResponse = await fetch(`http://localhost:1000/api/representantes/escuela/${encodeURIComponent(cct)}`);
          
          if (representantesResponse.ok) {
            const representantesData = await representantesResponse.json();
            console.log("Representantes data received:", representantesData); // Debug log
            
            setRepresentantes(representantesData);
          } else {
            console.log('No se encontraron representantes para esta escuela');
            setRepresentantes([]);
          }
        } catch (repError) {
          console.error('Error al obtener representantes:', repError);
          setRepresentantes([]);
          // Not setting the main error here as we still have the school data
        }
      } catch (error) {
        console.error('Error fetching school data:', error);
        setError(error.message || 'Error al cargar los datos de la escuela');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [location.search, navigate]);

  const handleOpenEditModal = () => {
    // Create deep copies of the data for editing
    setEditedEscuela({...escuelaData});
    setEditedRepresentantes(representantes.map(rep => ({...rep})));
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setUpdateMessage({ type: '', text: '' });
  };

  const handleEscuelaInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle number inputs specifically
    if (name === 'numero_estudiantes') {
      setEditedEscuela({
        ...editedEscuela,
        [name]: parseInt(value) || 0
      });
    } else {
      setEditedEscuela({
        ...editedEscuela,
        [name]: value
      });
    }
  };

  const handleRepresentanteInputChange = (e, index) => {
    const { name, value, type, checked } = e.target;
    
    // Create a new array to avoid mutating state directly
    const updatedRepresentantes = [...editedRepresentantes];
    
    // Handle different input types
    if (type === 'checkbox') {
      updatedRepresentantes[index] = {
        ...updatedRepresentantes[index],
        [name]: checked
      };
    } else if (name === 'anios_experiencia') {
      updatedRepresentantes[index] = {
        ...updatedRepresentantes[index],
        [name]: parseInt(value) || 0
      };
    } else {
      updatedRepresentantes[index] = {
        ...updatedRepresentantes[index],
        [name]: value
      };
    }
    
    setEditedRepresentantes(updatedRepresentantes);
  };

  const updateEscuela = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`http://localhost:1000/api/escuela/actualizarCompleto/${editedEscuela.CCT}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          escuelaData: editedEscuela
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar la escuela');
      }

      // Update the local state with the updated data
      setEscuelaData(editedEscuela);
      setUpdateMessage({ 
        type: 'success', 
        text: 'Información de la escuela actualizada correctamente' 
      });
      
      // Auto-clear message after 3 seconds
      setTimeout(() => {
        if (updateMessage.text.includes('escuela')) {
          setUpdateMessage({ type: '', text: '' });
        }
      }, 3000);

    } catch (error) {
      console.error('Error updating school:', error);
      setUpdateMessage({ 
        type: 'error', 
        text: error.message || 'Error al actualizar la escuela' 
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const updateRepresentantes = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`http://localhost:1000/api/escuela/${editedEscuela.CCT}/representantes/batch`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          representantes: editedRepresentantes
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar los representantes');
      }

      // Update the local state with the updated data
      setRepresentantes(editedRepresentantes);
      setUpdateMessage({ 
        type: 'success', 
        text: 'Información de los representantes actualizada correctamente' 
      });
      
      // Auto-clear message after 3 seconds
      setTimeout(() => {
        if (updateMessage.text.includes('representantes')) {
          setUpdateMessage({ type: '', text: '' });
        }
      }, 3000);

    } catch (error) {
      console.error('Error updating representatives:', error);
      setUpdateMessage({ 
        type: 'error', 
        text: error.message || 'Error al actualizar los representantes' 
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  if (isLoading) {
    return <div className={styles.loadingContainer}>Cargando información de la escuela...</div>;
  }
  
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <button 
          className={styles.editButton} 
          onClick={() => navigate('/login')}
        >
          Volver al inicio de sesión
        </button>
      </div>
    );
  }
  
  if (!escuelaData) {
    return <div className={styles.errorContainer}>No se encontró información de la escuela</div>;
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
    <div className={styles.perfilContainer}>
      <h2>Perfil de Escuela</h2>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <label>Nombre de la Escuela:</label>
          <p>{escuelaData.nombre || 'No disponible'}</p>
        </div>
        <div className={styles.infoItem}>
          <label>Clave (CCT):</label>
          <p>{escuelaData.CCT || 'No disponible'}</p>
        </div>
        <div className={styles.infoItem}>
          <label>Nivel Educativo:</label>
          <p>{escuelaData.nivel_educativo || 'No disponible'}</p>
        </div>
        <div className={styles.infoItem}>
          <label>Modalidad:</label>
          <p>{escuelaData.modalidad || 'No disponible'}</p>
        </div>
        <div className={styles.infoItem}>
          <label>Control administrativo:</label>
          <p>{escuelaData.control_administrativo || 'No disponible'}</p>
        </div>
        <div className={styles.infoItem}>
          <label>Sostenimiento:</label>
          <p>{escuelaData.sostenimiento || 'No disponible'}</p>
        </div>
        <div className={styles.infoItem}>
          <label>Zona escolar:</label>
          <p>{escuelaData.zona_escolar || 'No disponible'}</p>
        </div>
        <div className={styles.infoItem}>
          <label>Número de estudiantes:</label>
          <p>{escuelaData.numero_estudiantes ? escuelaData.numero_estudiantes.toString() : 'No disponible'}</p>
        </div>
      </div>
      
      <div className={styles.sectionSubtitle}>Dirección</div>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <label>Calle:</label>
          <p>{escuelaData.calle || 'No disponible'}</p>
        </div>
        <div className={styles.infoItem}>
          <label>Número:</label>
          <p>{escuelaData.numero || 'No disponible'}</p>
        </div>
        <div className={styles.infoItem}>
          <label>Colonia:</label>
          <p>{escuelaData.colonia || 'No disponible'}</p>
        </div>
        <div className={styles.infoItem}>
          <label>Municipio:</label>
          <p>{escuelaData.municipio || 'No disponible'}</p>
        </div>
      </div>
      
      <div className={styles.descripcionContainer}>
        <label>Descripción:</label>
        <p>{escuelaData.descripcion || 'No disponible'}</p>
      </div>

      <h3>Representantes de la Escuela</h3>
      
      {representantes.length > 0 ? (
        representantes.map((representante, index) => (
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

      <button 
        className={styles.editButton}
        onClick={handleOpenEditModal}
      >
        Editar información
      </button>

      {/* Edit Modal */}
      {showEditModal && editedEscuela && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Editar Información</h2>

            {updateMessage.text && (
              <div className={`${styles.messageBox} ${styles[updateMessage.type]}`}>
                {updateMessage.text}
              </div>
            )}

            <div className={styles.editSection}>
              <h3>Información de la Escuela</h3>
              <div className={styles.editForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="nombre">Nombre</label>
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      value={editedEscuela.nombre || ''}
                      onChange={handleEscuelaInputChange}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="nivel_educativo">Nivel Educativo</label>
                    <select
                      id="nivel_educativo"
                      name="nivel_educativo"
                      value={editedEscuela.nivel_educativo || ''}
                      onChange={handleEscuelaInputChange}
                    >
                      <option value="">Selecciona un nivel</option>
                      <option value="Preescolar">Preescolar</option>
                      <option value="Primaria">Primaria</option>
                      <option value="Secundaria">Secundaria</option>
                      <option value="Preescolar y Primaria">Preescolar y Primaria</option>
                      <option value="Primaria y Secundaria">Primaria y Secundaria</option>
                      <option value="Preescolar, Primaria y Secundaria">Preescolar, Primaria y Secundaria</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="modalidad">Modalidad</label>
                    <select
                      id="modalidad"
                      name="modalidad"
                      value={editedEscuela.modalidad || ''}
                      onChange={handleEscuelaInputChange}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="General">General</option>
                      <option value="Técnica">Técnica</option>
                      <option value="Telesecundaria">Telesecundaria</option>
                      <option value="Para trabajadores">Para trabajadores</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="control_administrativo">Control Administrativo</label>
                    <input
                      id="control_administrativo"
                      name="control_administrativo"
                      type="text"
                      value="Público"
                      disabled
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="sostenimiento">Sostenimiento</label>
                    <select
                      id="sostenimiento"
                      name="sostenimiento"
                      value={editedEscuela.sostenimiento || ''}
                      onChange={handleEscuelaInputChange}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Federal">Federal</option>
                      <option value="Estatal">Estatal</option>
                      <option value="Municipal">Municipal</option>
                      <option value="Particular">Particular</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="zona_escolar">Zona Escolar</label>
                    <input
                      id="zona_escolar"
                      name="zona_escolar"
                      type="text"
                      value={editedEscuela.zona_escolar || ''}
                      onChange={handleEscuelaInputChange}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="sector_escolar">Sector Escolar</label>
                    <input
                      id="sector_escolar"
                      name="sector_escolar"
                      type="text"
                      value={editedEscuela.sector_escolar || ''}
                      onChange={handleEscuelaInputChange}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="numero_estudiantes">Número de Estudiantes</label>
                    <input
                      id="numero_estudiantes"
                      name="numero_estudiantes"
                      type="number"
                      min="0"
                      value={editedEscuela.numero_estudiantes || ''}
                      onChange={handleEscuelaInputChange}
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
                      value={editedEscuela.calle || ''}
                      onChange={handleEscuelaInputChange}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="numero">Número</label>
                    <input
                      id="numero"
                      name="numero"
                      type="text"
                      value={editedEscuela.numero || ''}
                      onChange={handleEscuelaInputChange}
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
                      value={editedEscuela.colonia || ''}
                      onChange={handleEscuelaInputChange}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="municipio">Municipio</label>
                    <input
                      id="municipio"
                      name="municipio"
                      type="text"
                      value={editedEscuela.municipio || ''}
                      onChange={handleEscuelaInputChange}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    rows="4"
                    value={editedEscuela.descripcion || ''}
                    onChange={handleEscuelaInputChange}
                  />
                </div>

                <div className={styles.buttonContainer}>
                  <button 
                    className={styles.updateButton}
                    onClick={updateEscuela}
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Actualizando...' : 'Actualizar Escuela'}
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.editSection}>
              <h3>Representantes de la Escuela</h3>
              
              {editedRepresentantes.length > 0 ? (
                editedRepresentantes.map((representante, index) => (
                  <div key={representante.idRepresentante || index} className={styles.editRepresentanteCard}>
                    <h4>Representante {index + 1}</h4>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor={`nombre-${index}`}>Nombre</label>
                        <input
                          id={`nombre-${index}`}
                          name="nombre"
                          type="text"
                          value={representante.nombre || ''}
                          onChange={(e) => handleRepresentanteInputChange(e, index)}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor={`rol-${index}`}>Rol</label>
                        <input
                          id={`rol-${index}`}
                          name="rol"
                          type="text"
                          value={representante.rol || ''}
                          onChange={(e) => handleRepresentanteInputChange(e, index)}
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor={`correo-${index}`}>Correo Electrónico</label>
                        <input
                          id={`correo-${index}`}
                          name="correo_electronico"
                          type="email"
                          value={representante.correo_electronico || ''}
                          onChange={(e) => handleRepresentanteInputChange(e, index)}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor={`telefono-${index}`}>Teléfono</label>
                        <input
                          id={`telefono-${index}`}
                          name="numero_telefonico"
                          type="tel"
                          value={representante.numero_telefonico || ''}
                          onChange={(e) => handleRepresentanteInputChange(e, index)}
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor={`anios-${index}`}>Años de Servicio</label>
                        <input
                          id={`anios-${index}`}
                          name="anios_experiencia"
                          type="number"
                          min="0"
                          value={representante.anios_experiencia || ''}
                          onChange={(e) => handleRepresentanteInputChange(e, index)}
                        />
                      </div>
                      <div className={styles.formGroup} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className={styles.checkboxGroup}>
                          <input
                            id={`jubilacion-${index}`}
                            name="proximo_a_jubilarse"
                            type="checkbox"
                            checked={representante.proximo_a_jubilarse || false}
                            onChange={(e) => handleRepresentanteInputChange(e, index)}
                          />
                          <label htmlFor={`jubilacion-${index}`}>Próximo a jubilarse</label>
                        </div>
                        <div className={styles.checkboxGroup}>
                          <input
                            id={`cambio-${index}`}
                            name="cambio_zona"
                            type="checkbox"
                            checked={representante.cambio_zona || false}
                            onChange={(e) => handleRepresentanteInputChange(e, index)}
                          />
                          <label htmlFor={`cambio-${index}`}>Cambio de zona escolar</label>
                        </div>
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor={`contrasena-${index}`}>Nueva Contraseña (opcional)</label>
                        <input
                          id={`contrasena-${index}`}
                          name="contrasena"
                          type="password"
                          placeholder="Dejar en blanco para mantener contraseña actual"
                          value={representante.newPassword || ''}
                          onChange={(e) => handleRepresentanteInputChange(e, index)}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <p>No hay representantes registrados para esta escuela.</p>
                </div>
              )}

              {editedRepresentantes.length > 0 && (
                <div className={styles.buttonContainer}>
                  <button 
                    className={styles.updateButton}
                    onClick={updateRepresentantes}
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Actualizando...' : 'Actualizar Representantes'}
                  </button>
                </div>
              )}
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

export default PerfilSection;