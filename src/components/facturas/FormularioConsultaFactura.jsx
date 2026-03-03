import React from 'react';

const FormularioConsultaFactura = () => {
  return (
    <form>
      <h3>Consulta de documento electrónico</h3>
      
      {/* Fila 1: RUC del Cliente (Imagen 1) */}
      <div className="input-group">
        <label className="input-label" htmlFor="rucCliente">RUC del Cliente:</label>
        <input 
          type="text" 
          id="rucCliente" 
          name="rucCliente"
          className="form-input" 
          placeholder="RUC del Cliente:" 
        />
      </div>
      
      {/* Fila 2: Tipo de documento y Nro doc (Imagen 1) */}
      <div className="form-row">
        <div className="input-group">
          <label className="input-label" htmlFor="tipoDocumento">Tipo de documento:</label>
          <select id="tipoDocumento" name="tipoDocumento" className="form-input">
            <option value="">Tipo de documento:</option>
            {/* Agrega más opciones aquí */}
          </select>
        </div>
        
        <div className="input-group">
          <label className="input-label" htmlFor="nroDocumento">Nro doc.(xxxx-xxxxxxxx):</label>
          <input 
            type="text" 
            id="nroDocumento" 
            name="nroDocumento"
            className="form-input" 
            placeholder="Nro doc.(xxxx-xxxxxxxx):" 
          />
        </div>
      </div>
      
      {/* Fila 3: Fecha de emisión (Imagen 1) */}
      <div className="input-group">
        <label className="input-label" htmlFor="fechaEmision">Fecha de emisión (yyyy-mm-dd):</label>
        <input 
          type="date" 
          id="fechaEmision" 
          name="fechaEmision"
          className="form-input" 
          placeholder="Fecha de emisión (yyyy-mm-dd):" 
        />
      </div>
      
      {/* Botón: VER DOCUMENTO (Imagen 1) */}
      <button type="submit" className="submit-btn">
        VER DOCUMENTO
      </button>
    </form>
  );
};

export default FormularioConsultaFactura;