import React from 'react';

const FormularioLogin = () => {
  return (
    <form>
      <h2>Login</h2>
      
      {/* Grupo: Usuario (Imagen 0) */}
      <div className="input-group">
        <label className="input-label" htmlFor="usuario">Usuario</label>
        <input 
          type="text" 
          id="usuario" 
          name="usuario"
          className="form-input" 
          placeholder="Smith" 
        />
      </div>
      
      {/* Grupo: Contraseña (Imagen 0) */}
      <div className="input-group">
        <label className="input-label" htmlFor="contraseña">Contraseña</label>
        <input 
          type="password" 
          id="contraseña" 
          name="contraseña"
          className="form-input" 
          placeholder="•••••" 
        />
      </div>
      
      {/* Botón: INGRESAR (Imagen 0) */}
      <button type="submit" className="submit-btn">
        INGRESAR
      </button>
    </form>
  );
};

export default FormularioLogin;