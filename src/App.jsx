import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importación de tus páginas principales
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Importación de tus componentes de diseño (Navbar y Footer)
// He utilizado rutas relativas directas según tu árbol de archivos habitual
import Navbar from './components/navbar'; 
import Footer from './components/Footer';

// Importación del archivo de estilos globales
import './App.css'; 

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navbar superior: fijo en la parte de arriba de todas las vistas */}
        <Navbar /> 
        
        {/* Main: Contenedor flexible que cambia de contenido y empuja el footer */}
        <main className="main-content">
          <Routes>
            {/* Ruta por defecto redirige al Login */}
            <Route path="/" element={<Navigate to="/login" />} />
            
            {/* Rutas específicas para cada página */}
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Ruta comodín para manejar URL no encontradas, redirige a Login */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </main>

        {/* Footer: Siempre posicionado al final de la página */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;