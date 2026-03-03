import React, { useState } from 'react';
// Importamos los dos nuevos componentes de formulario
// Fíjate en los puntos: ../ sube un nivel de carpeta
import FormularioLogin from '../components/auth/FormularioLogin';
import FormularioConsultaFactura from '../components/facturas/FormularioConsultaFactura';
import './Login.css';

const Login = () => {
  // Estado para rastrear la pestaña activa: 'login' o 'consulta'
  const [pestañaActiva, setPestañaActiva] = useState('login');

  return (
    <div className="login-page-container">
      <div className="login-main-box">
        
        {/* === SECCIÓN DE PESTAÑAS (TABS) === */}
        <div className="login-tabs-header">
          {/* Pestaña: Acceso al software (Imagen 0) */}
          <button 
            type="button"
            className={`tab-btn ${pestañaActiva === 'login' ? 'active-tab' : 'inactive-tab'}`}
            onClick={() => setPestañaActiva('login')}
          >
            Acceso al software
          </button>
          
          {/* Pestaña: Factura Electronica (Imagen 1) */}
          <button 
            type="button"
            className={`tab-btn ${pestañaActiva === 'consulta' ? 'active-tab' : 'inactive-tab'}`}
            onClick={() => setPestañaActiva('consulta')}
          >
            Factura Electronica
          </button>
        </div>

        {/* === SECCIÓN DE CONTENIDO DINÁMICO === */}
        <div className="login-content-body">
          {pestañaActiva === 'login' ? (
            // Formulario de Inicio de Sesión (Replicando Imagen 0)
            <div className="form-wrapper">
              <FormularioLogin />
            </div>
          ) : (
            // Formulario de Consulta de Factura (Replicando Imagen 1)
            <div className="form-wrapper">
              <FormularioConsultaFactura />
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default Login;