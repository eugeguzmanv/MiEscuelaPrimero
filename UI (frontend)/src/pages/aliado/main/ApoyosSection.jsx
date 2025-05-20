import React, { useState, useEffect } from 'react';
import styles from './ApoyosSection.module.css';

const ApoyosSection = () => {
  const [apoyos, setApoyos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    Categoria: '',
    Sub_categoria: '',
    Fecha: '',
    Descripcion: ''
  });
  const [idAliado, setIdAliado] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Same categories and subcategories as in NecesidadesSection
  const categorias = {
    'Formación docente': [
      'Alimentación saludable',
      'Atención de estudiantes con BAP (Barreras para el aprendizaje y la participación)',
      'Comunidades de aprendizaje',
      'Comunicación efectiva con comunidad escolar',
      'Convivencia escolar/ Cultura de paz / Valores',
      'Disciplina positiva',
      'Educación inclusiva',
      'Enseñanza de lectura y matemáticas',
      'Evaluación',
      'Herramientas digitales para la educación / Innovación tecnológica',
      'Inteligencia emocional',
      'Lectoescritura',
      'Liderazgo y habilidades directivas',
      'Metodologías activas',
      'Neuroeducación',
      'Nueva Escuela Mexicana',
      'Participación infantil',
      'Proyecto de vida /Expectativas a futuro/ Orientación vocacional',
      'Sexualidad'
    ],
    'Formación a familias': [
      'Alimentación saludable',
      'Atención para hijos con BAP (Barreras para el aprendizaje y la participación)',
      'Comunicación efectiva con escuela',
      'Cultura de paz / Valores en el hogar',
      'Crianza positiva',
      'Derechos y obligaciones de los padres',
      'Enseñanza de lectura y matemáticas',
      'Inteligencia emocional',
      'Nueva Escuela Mexicana',
      'Proyecto de vida /Expectativas a futuro/ Orientación vocacional',
      'Sexualidad'
    ],
    'Formación niñas y niños': [
      'Alimentación saludable',
      'Arte',
      'Convivencia escolar/ Cultura de paz / Valores',
      'Computación',
      'Educación física',
      'Enseñanza de lectura y matemáticas',
      'Inteligencia emocional',
      'Lectoescritura',
      'Música',
      'Proyecto de vida /Expectativas a futuro/ Orientación vocacional',
      'Sexualidad',
      'Visitas fuera de la escuela (a empresas o lugares recreativos)'
    ],
    'Personal de apoyo': [
      'Maestro para clases de arte',
      'Maestro para clases de educación física',
      'Maestro para clases de idiomas',
      'Persona para apoyo administrativo',
      'Persona para apoyo en limpieza',
      'Psicólogo',
      'Psicopedagogo o especialista en BAP',
      'Suplentes de docentes frente a grupo',
      'Terapeuta de lenguaje o comunicación'
    ],
    'Infraestructura': [
      'Adecuaciones para personas con discapacidad (rampas, etc.)',
      'Agua (falla de agua, filtros de agua, bomba de agua nueva, tinaco o cisterna nueva, bebederos, etc.)',
      'Árboles (plantar nuevos, poda de árboles, arreglo de o nuevas jardineras)',
      'Baños (arreglo de baños, cambio de sanitarios o lavamanos, construcción de baños, plomería, etc.)',
      'Cocina (construcción, remodelación de cocina)',
      'Conectividad (routers, instalación de internet, etc.)',
      'Domos y patios (estructura para domo, lonaria y/o malla sombra, nivelación de patio, plancha de concreto, etc.)',
      'Luz (fallo eléctrico, conexión de luz, focos y cableado nuevo, paneles solares, etc.)',
      'Muros, techos o pisos (reconstrucción de muros cuarteados, tablaroca, plafón, cambio de pisos levantados, impermeabilización etc.)',
      'Pintura',
      'Seguridad (construcción o arreglo de barda perimetral, cámaras de seguridad, alambrado, cambio de barandales en mal estado, etc.)',
      'Ventanas y puertas (ventanas y puertas nuevas, protección para ventanas, candados para puertas)'
    ],
    'Materiales': [
      'Didácticos (plastilina, cartulinas, hojas, marcadores, crayolas, lápices, colores, etc.)',
      'De educación física (sogas, pelotas, aros, tinas, balones, porterías, redes para canastas o para voleibol, etc.)',
      'Tecnológico (computadoras, impresoras, proyectores, pantallas, bocinas, extensiones, cables HDMI, etc.)',
      'Literarios (libros infantiles, manuales, libros de texto, libros en braille, libros macrotipo, etc.)'
    ],
    'Mobiliario': [
      'Mesas para niños/ mesabancos',
      'Mesas para docentes',
      'Comedores',
      'Sillas (para niños o para maestros)',
      'Estantes, libreros o cajoneras',
      'Pizarrones'
    ],
    'Alimentación': [
      'Desayunos',
      'Fórmula'
    ],
    'Transporte': [
      'Transporte (nuevas rutas de camiones, transporte escolar, entrega de bicis, etc.)',
      'Arreglo de camino (puentes en arroyos, aplanadora de camino, luminaria, etc.)'
    ],
    'Jurídico': [
      'Apoyo en gestión de escrituras'
    ]
  };

  // Function to format date as DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX');
  };

  // Function to find aliado ID from session storage or API
  useEffect(() => {
    const fetchAliadoId = async () => {
      try {
        // Get the user email from session storage
        const userEmail = sessionStorage.getItem('userEmail');
        const userProfile = sessionStorage.getItem('userProfile');
        
        if (!userEmail || userProfile !== 'aliado') {
          throw new Error('No se encontró información del aliado. Por favor inicie sesión nuevamente.');
        }
        
        // Try to fetch the aliado data directly from the API using email
        console.log('Fetching aliado data for email:', userEmail);
        const aliadoResponse = await fetch(`http://localhost:1000/api/aliadoCor/${userEmail}`);
        
        if (!aliadoResponse.ok) {
          throw new Error('Error al obtener datos del aliado');
        }
        
        const aliadoResult = await aliadoResponse.json();
        console.log('Aliado data received:', aliadoResult);
        
        if (!aliadoResult.idAliado) {
          throw new Error('No se encontró ID del aliado');
        }
        
        // Use the ID from the aliado record
        const aliadoId = aliadoResult.idAliado;
        
        // Store it in all possible locations for future use
        sessionStorage.setItem('idAliado', aliadoId);
        sessionStorage.setItem('aliadoId', aliadoId);
        sessionStorage.setItem('userId', aliadoId);
        
        console.log('Using aliado ID from API:', aliadoId);
        setIdAliado(aliadoId);
        fetchApoyos(aliadoId);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message || 'Error al cargar datos del aliado');
        setIsLoading(false);
      }
    };
    
    fetchAliadoId();
  }, []);

  // Fetch apoyos from the API
  const fetchApoyos = async (allyId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:1000/api/apoyos/aliado/${encodeURIComponent(allyId)}`);
      
      if (!response.ok) {
        // If we get a 404 (no apoyos found), just set empty array
        if (response.status === 404) {
          setApoyos([]);
          setIsLoading(false);
          return;
        }
        throw new Error('No se pudieron obtener los apoyos del aliado');
      }
      
      const data = await response.json();
      setApoyos(data);
    } catch (error) {
      setError(error.message || 'Error al cargar los apoyos');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // If category changes, reset subcategory
    if (name === 'Categoria') {
      setFormData(prev => ({
        ...prev,
        Sub_categoria: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!idAliado) {
      setError('No se encontró el ID del aliado');
      return;
    }
    
    try {
      // Format date to YYYY-MM-DD string format to match database expectations
      const formattedDate = formData.Fecha;
      
      // Ensure idAliado is handled correctly (model expects idAliado as is)
      // If it's a string but should be a number, convert it
      const processedIdAliado = !isNaN(idAliado) && typeof idAliado === 'string' 
        ? parseInt(idAliado, 10) 
        : idAliado;
        
      console.log('Sending apoyo with idAliado:', processedIdAliado, 'Type:', typeof processedIdAliado);
      
      // Create a payload with all required fields
      const payload = {
        Categoria: formData.Categoria,
        Sub_categoria: formData.Sub_categoria,
        Fecha: formattedDate,
        Descripcion: formData.Descripcion,
        idAliado: processedIdAliado,
        Estado_validacion: false // Explicitly setting validation status to false
      };
      
      // Submit the apoyo data
      const response = await fetch('http://localhost:1000/api/registroApoyo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          // Silently handle parse error
        }
        
        throw new Error(errorData?.error || 'Error al registrar el apoyo');
      } else {
        // Parse the successful response
        await response.json();
      }
      
      // Reset form and hide modal
      setFormData({
        Categoria: '',
        Sub_categoria: '',
        Fecha: '',
        Descripcion: ''
      });
      setShowModal(false);
      
      // Show success message and refresh apoyos
      setSuccessMessage('Apoyo registrado exitosamente');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Fetch updated list of apoyos
      fetchApoyos(idAliado);
    } catch (error) {
      setError(error.message || 'Error al registrar el apoyo');
    }
  };

  // Render subcategory options based on selected category
  const renderSubcategoriaOptions = () => {
    if (!formData.Categoria || !categorias[formData.Categoria]) {
      return <option value="">Selecciona primero una categoría</option>;
    }
    
    return categorias[formData.Categoria].map(subcategoria => (
      <option key={subcategoria} value={subcategoria}>
        {subcategoria}
      </option>
    ));
  };

  return (
    <div className={styles.apoyosContainer}>
      <div className={styles.headerSection}>
        <h2 className={styles.sectionTitle}>Apoyos Ofrecidos</h2>
        <button 
          className={styles.registerButton}
          onClick={() => setShowModal(true)}
        >
          Registrar Nuevo Apoyo
        </button>
      </div>

      {successMessage && (
        <div className={styles.successMessage}>
          {successMessage}
        </div>
      )}

      {error && (
        <div className={styles.errorMessage}>
          {error}
          <div style={{marginTop: '15px', fontSize: '14px'}}>
            <button 
              onClick={() => {
                const testId = prompt("Ingrese el ID del aliado:", "1");
                if (testId) {
                  setIdAliado(testId);
                  fetchApoyos(testId);
                  setSuccessMessage('ID configurado manualmente: ' + testId);
                  setTimeout(() => setSuccessMessage(''), 3000);
                }
              }}
              style={{
                padding: '8px 12px', 
                backgroundColor: '#2C8B3F', 
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Usar ID temporal
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className={styles.loadingContainer}>Cargando apoyos...</div>
      ) : (
        <div className={styles.apoyosGrid}>
          {apoyos.length === 0 ? (
            <div className={styles.emptyMessage}>
              No hay apoyos registrados. Haz clic en "Registrar Nuevo Apoyo" para comenzar.
            </div>
          ) : (
            apoyos.map((apoyo) => (
              <div key={apoyo.idApoyo} className={styles.apoyoCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{apoyo.Categoria}</h3>
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.subcategoria}><strong>Subcategoría:</strong> {apoyo.Sub_categoria}</p>
                  <p className={styles.fecha}><strong>Fecha:</strong> {formatDate(apoyo.Fecha)}</p>
                  <div className={styles.descripcionContainer}>
                    <p className={styles.descripcion}><strong>Descripción:</strong></p>
                    <p className={styles.descripcionText}>{apoyo.Descripcion}</p>
                  </div>
                  <p className={styles.validacion}><strong>Validación de la Asociación:</strong> {apoyo.Estado_validacion ? 'Validado' : 'Pendiente'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal for registering new apoyo */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Registrar Nuevo Apoyo</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label htmlFor="Categoria">Categoría:</label>
                <select
                  id="Categoria"
                  name="Categoria"
                  value={formData.Categoria}
                  onChange={handleInputChange}
                  required
                  className={styles.formControl}
                >
                  <option value="">Selecciona una categoría</option>
                  {Object.keys(categorias).map(categoria => (
                    <option key={categoria} value={categoria}>
                      {categoria}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="Sub_categoria">Subcategoría:</label>
                <select
                  id="Sub_categoria"
                  name="Sub_categoria"
                  value={formData.Sub_categoria}
                  onChange={handleInputChange}
                  required
                  className={styles.formControl}
                  disabled={!formData.Categoria}
                >
                  {renderSubcategoriaOptions()}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="Fecha">Fecha:</label>
                <input
                  type="date"
                  id="Fecha"
                  name="Fecha"
                  value={formData.Fecha}
                  onChange={handleInputChange}
                  required
                  className={styles.formControl}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="Descripcion">Descripción:</label>
                <textarea
                  id="Descripcion"
                  name="Descripcion"
                  value={formData.Descripcion}
                  onChange={handleInputChange}
                  required
                  className={styles.formControl}
                  rows="4"
                  placeholder="Describe el apoyo de manera detallada..."
                />
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                >
                  Registrar Apoyo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApoyosSection; 