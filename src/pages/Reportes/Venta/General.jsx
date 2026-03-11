import React, { useState } from 'react';

const GeneralReporte = () => {
  const [formData, setFormData] = useState({
    docmentos: '',
    buscarlocal: '',
    tipo: '2',
    venta: '',
    fei: '',
    fef: '',
    conticipo: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '10px', color: '#333' }}>
      {/* Encabezado Principal */}
      <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px', color: '#008ecc', marginBottom: '15px' }}>
        <span style={{ marginRight: '5px' }}>icon-help</span> 
        <strong>VENTA : REPORTE &gt;&gt;</strong>
        <label style={{ marginLeft: '10px', fontSize: '14px', color: '#333', display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" name="conticipo" checked={formData.conticipo} onChange={handleChange} /> 
          Con Anticipo
        </label>
        <a href="#" style={{ marginLeft: '10px', fontSize: '14px', color: '#008ecc', textDecoration: 'none' }}>V.A.</a>
      </div>

      {/* Barra de Búsqueda */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: '5px', fontSize: '12px' }}>
            <strong>BUSCAR X</strong> 
            <select name="docmentos" onChange={handleChange} style={{ marginLeft: '5px' }}><option>Documento</option></select>
            <select name="buscarlocal" onChange={handleChange} style={{ marginLeft: '5px' }}><option>Sucursal</option></select>
            <span style={{ margin: '0 5px' }}>y/o</span>
            <select name="tipo" onChange={handleChange}><option value="2">Nombre/empresa</option></select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input type="text" name="venta" style={{ width: '100%', height: '30px', border: '1px solid #ccc' }} />
            <strong style={{ margin: '0 10px' }}>y/o</strong>
          </div>
        </div>

        <div>
          <span style={{ fontSize: '12px' }}>Fecha Inicio</span><br />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input type="text" placeholder="dd/mm/yyyy" style={{ height: '30px', border: '1px solid #ccc', padding: '0 5px' }} />
            <button style={{ height: '32px', border: '1px solid #ccc', background: '#f0f0f0' }}>📅</button>
          </div>
        </div>

        <div>
          <span style={{ fontSize: '12px' }}>Fecha Fin</span><br />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input type="text" placeholder="dd/mm/yyyy" style={{ height: '30px', border: '1px solid #ccc', padding: '0 5px' }} />
            <button style={{ height: '32px', border: '1px solid #ccc', background: '#f0f0f0' }}>📅</button>
          </div>
        </div>

        <button style={{ 
          backgroundColor: '#46accf', color: 'white', border: 'none', 
          padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', alignSelf: 'center',
          display: 'flex', alignItems: 'center', fontWeight: 'bold'
        }}>
          🔍 Buscar
        </button>
      </div>

      <center><strong style={{ fontSize: '14px' }}>LISTADO REPORTE GENERAL</strong></center>

      {/* Tabla General */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '13px' }}>
        <thead>
          <tr style={{ backgroundColor: '#005a82', color: 'white' }}>
            <th style={cellStyle}>DOC-NRO</th>
            <th style={cellStyle}>FECHA</th>
            <th style={cellStyle}>CLIENTE</th>
            <th style={cellStyle}>RUC/DNI</th>
            <th style={cellStyle}>VENDEDOR</th>
            <th style={cellStyle}>T.VENTA</th>
            <th style={cellStyle}>DOLARES</th>
            <th style={cellStyle}>SOLES</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ backgroundColor: '#eeeeee', textAlign: 'center' }}>
            <td style={cellStyle}>Contado</td>
            <td style={cellStyle}>#0</td>
            <td style={cellStyle}></td>
            <td style={cellStyle}></td>
            <td style={cellStyle}></td>
            <td style={cellStyle}></td>
            <td style={cellStyle}>US$ 0.00</td>
            <td style={cellStyle}>S/ 0.00</td>
          </tr>
        </tbody>
      </table>

      <center><strong style={{ fontSize: '14px', display: 'block', margin: '20px 0 10px' }}>LISTADO GENERAL DE GASTOS</strong></center>

      {/* Tablas de Gastos y Egresos (Colores Rojos) */}
      <div style={{ fontSize: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tr style={{ backgroundColor: '#9b0000', color: 'white', textAlign: 'left', fontWeight: 'bold' }}>
            <td style={cellStyle}>Fecha</td>
            <td style={cellStyle}>Respo.</td>
            <td style={cellStyle}>A</td>
            <td style={cellStyle}>Motivo</td>
            <td style={{ ...cellStyle, textAlign: 'right' }}>Dolares</td>
            <td style={{ ...cellStyle, textAlign: 'right' }}>Soles</td>
          </tr>
          <tr style={{ backgroundColor: '#999', color: 'white', fontWeight: 'bold' }}>
            <td colSpan="4" style={{ ...cellStyle, textAlign: 'right' }}>Total Gastos</td>
            <td style={{ ...cellStyle, textAlign: 'right' }}>0.00</td>
            <td style={{ ...cellStyle, textAlign: 'right' }}>0.00</td>
          </tr>
          <tr style={{ backgroundColor: '#326400', color: 'white', fontWeight: 'bold' }}>
            <td colSpan="4" style={{ ...cellStyle, textAlign: 'right' }}>Ingreso - Gastos =</td>
            <td style={{ ...cellStyle, textAlign: 'right' }}>0.00</td>
            <td style={{ ...cellStyle, textAlign: 'right' }}>0.00</td>
          </tr>
          <tr style={{ textAlign: 'center', fontWeight: 'bold' }}>
            <td colSpan="6" style={cellStyle}>COMPRA</td>
          </tr>
          <tr style={{ backgroundColor: '#9b0000', color: 'white', fontWeight: 'bold' }}>
            <td style={cellStyle}>Fecha</td>
            <td colSpan="2" style={cellStyle}>Tipo Compra -- Doc/nro</td>
            <td style={cellStyle}>Proveedor</td>
            <td style={{ ...cellStyle, textAlign: 'right' }}>Dolares</td>
            <td style={{ ...cellStyle, textAlign: 'right' }}>Soles</td>
          </tr>
          <tr style={{ textAlign: 'center', fontWeight: 'bold' }}>
            <td colSpan="6" style={cellStyle}>AMORTIZACION DE CREDITO(cta x pagar)</td>
          </tr>
          <tr style={{ backgroundColor: '#9b0000', color: 'white', fontWeight: 'bold' }}>
            <td style={cellStyle}>Fecha</td>
            <td colSpan="2" style={cellStyle}>Proveedor</td>
            <td style={cellStyle}>Responsable</td>
            <td style={{ ...cellStyle, textAlign: 'right' }}>Dolares</td>
            <td style={{ ...cellStyle, textAlign: 'right' }}>Soles</td>
          </tr>
          <tr style={{ backgroundColor: '#9b0000', color: 'white', fontWeight: 'bold' }}>
            <td colSpan="4" style={{ ...cellStyle, textAlign: 'right' }}>Total Egreso</td>
            <td style={{ ...cellStyle, textAlign: 'right' }}>0.00</td>
            <td style={{ ...cellStyle, textAlign: 'right' }}>0.00</td>
          </tr>
          <tr style={{ backgroundColor: '#326400', color: 'white', fontWeight: 'bold' }}>
            <td colSpan="4" style={{ ...cellStyle, textAlign: 'right' }}>TOTAL CAJA</td>
            <td style={{ ...cellStyle, textAlign: 'right' }}>0.00</td>
            <td style={{ ...cellStyle, textAlign: 'right' }}>0.00</td>
          </tr>
        </table>
      </div>

      {/* Resumen de tipos de pago */}
      <table style={{ width: '50%', margin: '20px auto', borderCollapse: 'collapse', textAlign: 'center', fontSize: '12px' }}>
        <tr style={{ backgroundColor: '#ccc', fontWeight: 'bold' }}>
          <td style={cellStyle}>Efectivo S/</td>
          <td style={cellStyle}>Tarjeta S/</td>
          <td style={cellStyle}>Billetera S/</td>
          <td style={cellStyle}>Deposito S/</td>
        </tr>
        <tr>
          <td style={cellStyle}>0.00</td>
          <td style={cellStyle}>0.00</td>
          <td style={cellStyle}>0.00</td>
          <td style={cellStyle}>0.00</td>
        </tr>
      </table>

      {/* Iconos de exportación pie de página */}
      <div style={{ textAlign: 'right', marginTop: '10px' }}>
        <span title="Imprimir" style={{ cursor: 'pointer', marginRight: '10px' }}>🖨️</span>
        <span title="Excel" style={{ cursor: 'pointer', color: 'green', fontWeight: 'bold' }}>💹</span>
      </div>
    </div>
  );
};

const cellStyle = {
  padding: '6px',
  border: '1px solid #fff'
};

export default GeneralReporte;