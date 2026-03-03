import React from 'react';

const FormularioConsultaFactura = () => {
  const labelStyle = { color: '#ffffff', display: 'block', marginBottom: '5px', fontSize: '14px' };
  const inputStyle = { color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid #ffffff', width: '100%', padding: '10px' };

  return (
    <form>
      <h3 style={{ color: '#ffffff', textAlign: 'center', marginBottom: '20px' }}>
        Consulta de documento electrónico
      </h3>
      
      <div className="input-group" style={{ marginBottom: '15px' }}>
        <label style={labelStyle}>RUC del Cliente:</label>
        <input type="text" className="form-input" style={inputStyle} placeholder="Ingrese RUC" />
      </div>
      
      <div className="form-row" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Tipo de documento:</label>
          <select className="form-input" style={inputStyle}>
            <option value="" style={{color: '#000'}}>Seleccione...</option>
            <option value="factura" style={{color: '#000'}}>Factura</option>
            <option value="boleta" style={{color: '#000'}}>Boleta</option>
            <option value="Nota de Credito" style={{color: '#000'}}>Nota de Credito</option>
            <option value="nota de Debito" style={{color: '#000'}}>Nota de Debito</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Nro doc.(xxxx-xxxxxxxx):</label>
          <input type="text" className="form-input" style={inputStyle} placeholder="F001-000001" />
        </div>
      </div>
      
      <div className="input-group" style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Fecha de emisión (yyyy-mm-dd):</label>
        <input type="date" className="form-input" style={inputStyle} />
      </div>
      
      <button type="submit" className="submit-btn">VER DOCUMENTO</button>
    </form>
  );
};

export default FormularioConsultaFactura;