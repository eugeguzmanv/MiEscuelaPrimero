import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/Login.css';

const Login = () => {
  const [profileType, setProfileType] = useState('admin');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Clear session storage when component mounts
  useEffect(() => {
    const prevProfile = sessionStorage.getItem('userProfile');
    // If user was previously logged in as aliado, clear all session data
    if (prevProfile === 'aliado') {
      console.log('Previous aliado session detected, clearing session storage');
      // Clear all session data to prevent issues with stale data
      sessionStorage.clear();
    }
  }, []);
  
  const handleProfileChange = (e) => {
    setProfileType(e.target.value);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Clear session storage before logging in to prevent stale data issues
      sessionStorage.clear();
      console.log('Session storage cleared for new login');
      
      let endpoint = '';
      let redirectPath = '';
      
      // Determine which endpoint to use based on profile type
      switch (profileType) {
        case 'admin':
          endpoint = '/api/loginAdmin';
          redirectPath = '/admin/main';
          break;
        case 'escuela':
          endpoint = '/api/loginRepre'; // The backend endpoint is still 'loginRepre'
          redirectPath = '/escuela/main';
          break;
        case 'aliado':
          endpoint = '/api/loginAliado';
          redirectPath = '/aliado/main';
          break;
        default:
          setError('Tipo de perfil no válido');
          setIsLoading(false);
          return;
      }

      // Create the request body with appropriate field names based on profile type
      let requestBody = {
        correo_electronico: formData.email
      };
      
      // Use the correct password field name based on profile type
      if (profileType === 'aliado') {
        requestBody.contraseña = formData.password; // Using ñ for aliado
      } else {
        requestBody.contrasena = formData.password; // Without ñ for admin and escuela
      }

      console.log(`Sending login request to ${endpoint} with:`, requestBody);
      
      const response = await fetch(`http://localhost:1000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en inicio de sesión');
      }

      // Store user data in session storage
      console.log('Login successful, storing data in session storage');
      sessionStorage.setItem('userProfile', profileType);
      sessionStorage.setItem('userEmail', formData.email);
      
      if (data.rol) {
        sessionStorage.setItem('userRole', data.rol);
      }
      
      // Store the user ID consistently with the same key name for all profiles
      if (profileType === 'aliado' && data.id) {
        // Store the aliado ID with multiple keys for backward compatibility
        sessionStorage.setItem('idAliado', data.id);
        sessionStorage.setItem('aliadoId', data.id);
        sessionStorage.setItem('userId', data.id);
        console.log('Stored aliado ID in session storage:', data.id);
      }

      console.log('Stored in session storage:', {
        userProfile: profileType,
        userEmail: formData.email,
        userRole: data.rol || null,
        userId: data.id || null
      });

      // Redirect to appropriate dashboard
      navigate(redirectPath);

    } catch (error) {
      console.error('Error en inicio de sesión:', error);
      setError(error.message || 'Error de conexión. Por favor intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="register-content">
        <div className="form-container">
          <div className="form-fields">
            <h2>Iniciar Sesión</h2>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="profile-dropdown">
                <label htmlFor="profileSelect">Tipo de Perfil:</label>
                <select 
                  id="profileSelect" 
                  value={profileType} 
                  onChange={handleProfileChange}
                  className="profile-select"
                >
                  <option value="admin">Administrador</option>
                  <option value="escuela">Escuela</option>
                  <option value="aliado">Aliado</option>
                </select>
              </div>
              
              <label htmlFor="email">Correo:</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder={
                  profileType === 'admin' 
                    ? 'ejemplo@mpj.org.mx' 
                    : 'correo@ejemplo.com'
                }
                value={formData.email}
                onChange={handleChange}
                required 
              />
              
              <label htmlFor="password">Contraseña:</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
              
              <button 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
              </button>
              <p>
                <Link to="/recuperar-contrasena" style={{ color: '#009933' }}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </p>
            </form>
          </div>
          <div className="form-image">
            <img src="/images/cuenta_administrador.png" alt="Iniciar Sesión" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login; 