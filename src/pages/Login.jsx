// src/pages/Login.jsx
import React, { useState } from 'react';
import './Login.css';
import FormularioLogin from '../components/auth/FormularioLogin';
import FormularioConsultaFactura from '../components/facturas/FormularioConsultaFactura';

const Login = () => {
  const [pestañaActiva, setPestañaActiva] = useState('login');

  return (
    <div className="login-page-container">
      <div className="login-main-box">
        <div className="login-tabs-header">
          <button 
            className={`tab-btn ${pestañaActiva === 'login' ? 'active-tab' : 'inactive-tab'}`}
            onClick={() => setPestañaActiva('login')}
          >
            Acceso al software
          </button>
          <button 
            className={`tab-btn ${pestañaActiva === 'consulta' ? 'active-tab' : 'inactive-tab'}`}
            onClick={() => setPestañaActiva('consulta')}
          >
            Factura Electrónica
          </button>
        </div>

        <div className="login-content-body">
          {pestañaActiva === 'login' ? <FormularioLogin /> : <FormularioConsultaFactura />}
        </div>
      </div>
    </div>
  );
};

export default Login;