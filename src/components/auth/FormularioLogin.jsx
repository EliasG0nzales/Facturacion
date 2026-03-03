import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FormularioLogin = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Aquí podrías validar contra una base de datos. 
    // Por ahora, si hay datos, entramos:
    if (usuario !== '' && password !== '') {
      console.log("Iniciando sesión...");
      navigate('/dashboard'); // <--- Esto te lleva a la página principal
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ color: '#ffffff', textAlign: 'center', marginBottom: '20px' }}>Login</h2>
      
      <div className="input-group">
        <label style={{ color: '#ffffff', display: 'block', marginBottom: '8px' }}>Usuario</label>
        <input 
          type="text" 
          className="form-input" 
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          style={{ color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid #ffffff', width: '100%', padding: '12px', borderRadius: '6px' }}
        />
      </div>
      
      <div className="input-group" style={{ marginTop: '15px' }}>
        <label style={{ color: '#ffffff', display: 'block', marginBottom: '8px' }}>Contraseña</label>
        <input 
          type="password" 
          className="form-input" 
          placeholder="•••••" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid #ffffff', width: '100%', padding: '12px', borderRadius: '6px' }}
        />
      </div>
      
      <button 
        type="submit" 
        className="submit-btn" 
        style={{ width: '100%', padding: '15px', marginTop: '25px', backgroundColor: '#00a8e8', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
      >
        INGRESAR
      </button>
    </form>
  );
};

export default FormularioLogin;