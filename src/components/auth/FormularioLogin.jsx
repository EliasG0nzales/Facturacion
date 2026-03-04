import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FormularioLogin = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // VALIDACIÓN: Ahora permite entrar solo si ambos son "Smith"
    if (usuario === 'Smith' && password === 'Smith') {
      console.log("Iniciando sesión correctamente...");
      navigate('/dashboard'); 
    } else {
      alert("Usuario o contraseña incorrectos. Use 'Smith' para ambos.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2 style={{ color: '#ffffff', textAlign: 'center', marginBottom: '30px' }}>Login</h2>
      
      {/* Grupo Usuario con Animación */}
      <div className="floating-group">
        <input 
          type="text" 
          className="form-input" 
          placeholder=" " // El espacio es clave para el CSS
          id="usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
          autoComplete="off"
        />
        <label htmlFor="usuario" className="floating-label">Usuario</label>
      </div>
      
      {/* Grupo Contraseña con Animación */}
      <div className="floating-group" style={{ marginTop: '25px' }}>
        <input 
          type="password" 
          className="form-input" 
          placeholder=" " 
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor="password" className="floating-label">Contraseña</label>
      </div>
      
      <button 
        type="submit" 
        className="submit-btn" 
        style={{ 
          width: '100%', 
          padding: '15px', 
          marginTop: '25px', 
          backgroundColor: '#00a8e8', 
          color: 'white', 
          border: 'none', 
          borderRadius: '6px', 
          fontWeight: 'bold', 
          cursor: 'pointer' 
        }}
      >
        INGRESAR
      </button>
    </form>
  );
};

export default FormularioLogin;