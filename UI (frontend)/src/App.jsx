import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ChooseProfile from './pages/ChooseProfile';
import OpcionesRegistro from './pages/escuela/OpcionesRegistro';
import Registro from './pages/escuela/Registro';
import AnadirRepresentante from './pages/escuela/AnadirRepresentante';
import AnadirNuevoRepresentante from './pages/escuela/AnadirNuevoRepresentante';
import OpcionesRegistroAliado from './pages/aliado/OpcionesRegistro';
import { default as RegistroAliado } from './pages/aliado/Registro';
import RegistroPersonaMoral from './pages/aliado/RegistroPersonaMoral';
import RegistroDocumentos from './pages/aliado/RegistroDocumentos';
import RegistroAdmin from './pages/admin/Registro';
import EscuelaMain from './pages/escuela/main/Main';
import AliadoMain from './pages/aliado/main/Main';
import AdminMain from './pages/admin/main/Main';
import './App.css';

function App() {
  console.log("App component rendered - checking routes");
  return (
    <Router>
      <Routes>
        {/* Home and Login Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/iniciar-sesion" element={<Login />} />
        <Route path="/registro" element={<ChooseProfile />} />
        
        {/* Escuela Routes */}
        <Route path="/escuela/opciones-registro" element={<OpcionesRegistro />} />
        <Route path="/escuela/registro" element={<Registro />} />
        <Route path="/escuela/anadir-representante" element={<AnadirRepresentante />} />
        <Route path="/escuela/anadir-nuevo-representante" element={<AnadirNuevoRepresentante />} />
        <Route path="/escuela/main" element={<EscuelaMain />} />
        
        {/* Aliado Routes */}
        <Route path="/aliado/opciones-registro" element={<OpcionesRegistroAliado />} />
        <Route path="/aliado/registro" element={<RegistroAliado />} />
        <Route path="/aliado/registro-persona-moral" element={<RegistroPersonaMoral />} />
        <Route path="/aliado/registro-documentos" element={<RegistroDocumentos />} />
        <Route path="/aliado/main" element={<AliadoMain />} />
        
        {/* Admin Routes */}
        <Route path="/admin/registro" element={<RegistroAdmin />} />
        <Route path="/admin/main" element={<AdminMain />} />
      </Routes>
    </Router>
  );
}

export default App;
