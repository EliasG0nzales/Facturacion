import React, { useState } from 'react';

const styles = `
  .page-container {
    padding: 20px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 13px;
  }

  .page-title {
    font-size: 18px;
    font-weight: bold;
    border-bottom: 2px solid #00A3E1;
    padding-bottom: 5px;
    margin-bottom: 15px;
    color: #333;
  }

  .filtro-section {
    margin-bottom: 10px;
    font-size: 13px;
  }

  .filtro-section label {
    margin-right: 10px;
    cursor: pointer;
  }

  .buscar-section {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 15px;
  }

  .buscar-section b {
    font-size: 13px;
    color: #212529;
  }

  .buscar-section select,
  .buscar-section input[type="text"] {
    padding: 5px 8px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 13px;
    color: #212529;
    background: #fff;
  }

  .buscar-section input[type="text"] {
    width: 220px;
  }

  .buscar-section select:focus,
  .buscar-section input:focus {
    border-color: #80bdff;
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
  }

  .botonNuevo {
    background-color: #17a2b8;
    border: 1px solid #17a2b8;
    color: #ffffff;
    padding: 6px 14px;
    cursor: pointer;
    font-size: 13px;
    font-weight: bold;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    transition: background-color 0.2s;
  }

  .botonNuevo:hover { background-color: #138496; }

  .botonVerde {
    background-color: #28a745;
    border: 1px solid #28a745;
    color: #fff;
    padding: 6px 14px;
    cursor: pointer;
    font-size: 13px;
    font-weight: bold;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    transition: background-color 0.2s;
  }

  .botonVerde:hover { background-color: #218838; }

  .paginacion {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    font-size: 13px;
  }

  .tabla-titulo {
    text-align: center;
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 8px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  table thead tr {
    background-color: #17a2b8;
    color: #fff;
  }

  table thead th {
    padding: 10px 8px;
    text-align: left;
    font-weight: bold;
  }

  table tbody tr {
    background-color: #fff;
    border-bottom: 1px solid #dee2e6;
  }

  table tbody tr:hover { background-color: #f8f9fa; }

  table tbody td {
    padding: 8px;
    color: #212529;
  }

  .empty-msg {
    text-align: center;
    color: #888;
    padding: 30px;
    font-size: 13px;
  }

  .acciones {
    display: flex;
    gap: 6px;
    justify-content: center;
  }

  .btn-accion {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    padding: 2px 5px;
    border-radius: 3px;
    transition: background 0.15s;
  }

  .btn-accion:hover { background-color: #e0e0e0; }
  .btn-editar  { color: #17a2b8; }
  .btn-cotizar { color: #8B4513; }
  .btn-vender  { color: #28a745; }

  .exportar-section {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 10px;
    font-size: 20px;
  }

  .exportar-section span {
    cursor: pointer;
    transition: transform 0.15s;
  }

  .exportar-section span:hover { transform: scale(1.2); }

  .leyenda {
    margin-top: 15px;
    font-size: 12px;
    color: #555;
    border-top: 1px solid #dee2e6;
    padding-top: 10px;
  }

  .leyenda b { color: #212529; }

  /* MODAL */
  .modal-backdrop {
    position: fixed; top:0; left:0; width:100%; height:100%;
    background: rgba(0,0,0,0.4);
    display: flex; align-items: center; justify-content: center;
    z-index: 2000;
  }

  .modal-box {
    background: #fff;
    border-radius: 6px;
    padding: 24px 28px;
    min-width: 380px;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  }

  .modal-title {
    font-size: 15px;
    font-weight: bold;
    color: #212529;
    margin-bottom: 16px;
    border-bottom: 2px solid #00A3E1;
    padding-bottom: 6px;
  }

  .modal-field { margin-bottom: 12px; }

  .modal-field label {
    display: block;
    font-weight: bold;
    margin-bottom: 4px;
    font-size: 13px;
    color: #212529;
  }

  .modal-field input,
  .modal-field select {
    width: 100%;
    padding: 6px 8px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 13px;
    color: #212529;
  }

  .modal-field input:focus,
  .modal-field select:focus {
    border-color: #80bdff;
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
  }

  .modal-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    margin-top: 16px;
  }

  .btn-cancel {
    background-color: #6c757d;
    border: 1px solid #6c757d;
    color: #fff;
    padding: 6px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    font-weight: bold;
  }

  .btn-cancel:hover { background-color: #5a6268; }

  .alert-success {
    background-color: #d4edda;
    border: 1px solid #c3e6cb;
    color: #155724;
    padding: 8px 14px;
    border-radius: 4px;
    margin-bottom: 10px;
    font-size: 13px;
    display: inline-block;
  }

  .alert-danger {
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    color: #721c24;
    padding: 8px 14px;
    border-radius: 4px;
    margin-bottom: 10px;
    font-size: 13px;
    display: inline-block;
  }
`;

const CLIENTES_INICIALES = [
  { id: 1, nombre: 'Juan Pérez García', dpto: 'Lima', ruc: '10456789012', telefono: '987654321', vendedor: 'Carlos R.' },
  { id: 2, nombre: 'Empresa SAC',       dpto: 'Arequipa', ruc: '20123456789', telefono: '054-223344', vendedor: 'María L.' },
];

const DPTOS = ['Lima', 'Arequipa', 'Cusco', 'Piura', 'La Libertad', 'Junín', 'Puno', 'Ica', 'Cajamarca'];

const Cliente = () => {
  const [filtro, setFiltro] = useState('1');
  const [tipoBusqueda, setTipoBusqueda] = useState('');
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [clientes, setClientes] = useState(CLIENTES_INICIALES);
  const [msg, setMsg] = useState({ tipo: '', texto: '' });
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ nombre: '', dpto: '', ruc: '', telefono: '', vendedor: '' });

  const showMsg = (tipo, texto) => {
    setMsg({ tipo, texto });
    setTimeout(() => setMsg({ tipo: '', texto: '' }), 2500);
  };

  const clientesFiltrados = clientes.filter(c => {
    if (!textoBusqueda) return true;
    if (tipoBusqueda === '1') return c.nombre.toLowerCase().includes(textoBusqueda.toLowerCase());
    if (tipoBusqueda === '2') return c.ruc.includes(textoBusqueda);
    if (tipoBusqueda === '3') return c.dpto.toLowerCase().includes(textoBusqueda.toLowerCase());
    if (tipoBusqueda === '4') return c.vendedor.toLowerCase().includes(textoBusqueda.toLowerCase());
    return true;
  });

  const abrirNuevo = () => {
    setForm({ nombre: '', dpto: '', ruc: '', telefono: '', vendedor: '' });
    setModal('nuevo');
  };

  const abrirEditar = (c) => {
    setForm({ ...c });
    setModal('editar');
  };

  const guardar = () => {
    if (!form.nombre || !form.ruc) return showMsg('danger', 'Nombre y RUC son obligatorios.');
    if (modal === 'nuevo') {
      setClientes(prev => [...prev, { ...form, id: Date.now() }]);
      showMsg('success', 'Cliente agregado correctamente.');
    } else {
      setClientes(prev => prev.map(c => c.id === form.id ? { ...form } : c));
      showMsg('success', 'Cliente actualizado correctamente.');
    }
    setModal(null);
  };

  const eliminar = (id) => {
    if (window.confirm('¿Eliminar este cliente?')) {
      setClientes(prev => prev.filter(c => c.id !== id));
      showMsg('success', 'Cliente eliminado.');
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="page-container">

        {/* TÍTULO */}
        <div className="page-title">👤 CLIENTE</div>

        {/* FILTRO */}
        <div className="filtro-section">
          (Filtro &nbsp;
          <label><input type="radio" value="1" name="filtro" checked={filtro==='1'} onChange={e => setFiltro(e.target.value)} /> por Criterio</label>
          <label><input type="radio" value="2" name="filtro" checked={filtro==='2'} onChange={e => setFiltro(e.target.value)} /> Total</label>
          )
        </div>

        {/* MENSAJES */}
        {msg.texto && <div className={msg.tipo === 'success' ? 'alert-success' : 'alert-danger'}>
          {msg.tipo === 'success' ? '✅' : '⚠️'} {msg.texto}
        </div>}

        {/* BUSCAR */}
        <div className="buscar-section">
          <b>BUSCAR X</b>
          <select value={tipoBusqueda} onChange={e => setTipoBusqueda(e.target.value)}>
            <option value="">SELECCIONE</option>
            <option value="1">Nombre/empresa</option>
            <option value="2">Ruc-dni</option>
            <option value="3">Dpto</option>
            <option value="4">Vendedor</option>
          </select>
          <input
            type="text"
            placeholder="Ingrese el texto a buscar"
            value={textoBusqueda}
            onChange={e => setTextoBusqueda(e.target.value)}
          />
          <button className="botonNuevo">⚙ Buscar</button>
          <button className="botonVerde" onClick={abrirNuevo}>✚ Agregar Nuevo</button>
        </div>

        {/* PAGINACIÓN */}
        <div className="paginacion">
          <b>Página 1 de {Math.ceil(clientesFiltrados.length / 10) || 0}</b>
          <span style={{ fontSize: 12, color: '#888' }}>{clientesFiltrados.length} registro(s)</span>
        </div>

        {/* TABLA */}
        <div className="tabla-titulo">LISTADO GENERAL</div>
        <table>
          <thead>
            <tr>
              <th width="5%" align="center">Nro</th>
              <th>Nombre</th>
              <th>Dpto</th>
              <th width="12%">RUC</th>
              <th width="11%">Teléfono</th>
              <th width="12%">Vendedor</th>
              <th width="12%" align="center">Opciones</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.length === 0 ? (
              <tr><td colSpan="7" className="empty-msg">No hay clientes registrados.</td></tr>
            ) : (
              clientesFiltrados.map((c, i) => (
                <tr key={c.id}>
                  <td align="center">{i + 1}</td>
                  <td>{c.nombre}</td>
                  <td>{c.dpto}</td>
                  <td>{c.ruc}</td>
                  <td>{c.telefono}</td>
                  <td>{c.vendedor}</td>
                  <td>
                    <div className="acciones">
                      <button className="btn-accion btn-editar" title="Editar / Eliminar" onClick={() => abrirEditar(c)}>✏️</button>
                      <button className="btn-accion btn-cotizar" title="Cotizar">⁂</button>
                      <button className="btn-accion btn-vender" title="Vender">💰</button>
                      <button className="btn-accion" title="Eliminar" style={{color:'#dc3545'}} onClick={() => eliminar(c.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* EXPORTAR */}
        <div className="exportar-section">
          <span title="Imprimir">🖨️</span>
          <span title="Exportar Excel" style={{color:'#39B636'}}>📗</span>
          <span title="Exportar Word"  style={{color:'#3333CC'}}>📘</span>
        </div>

        <hr />

        {/* LEYENDA */}
        <div className="leyenda">
          <b>Leyenda de OPCIONES: </b>&nbsp;
          <span style={{color:'skyblue', fontSize:16}}>✏️</span> Actualizar, Eliminar &nbsp;&nbsp;
          <span style={{color:'brown',   fontSize:16}}>⁂</span> Cotizar &nbsp;&nbsp;
          <span style={{color:'#669900', fontSize:16}}>💰</span> Vender
        </div>

      </div>

      {/* MODAL AGREGAR / EDITAR */}
      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-title">
              {modal === 'nuevo' ? '✚ Agregar Cliente' : '✏️ Editar Cliente'}
            </div>
            <div className="modal-field">
              <label>Nombre / Empresa: *</label>
              <input type="text" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} placeholder="Nombre completo o empresa" />
            </div>
            <div className="modal-field">
              <label>RUC / DNI: *</label>
              <input type="text" value={form.ruc} onChange={e => setForm({...form, ruc: e.target.value})} placeholder="Ej: 20123456789" />
            </div>
            <div className="modal-field">
              <label>Departamento:</label>
              <select value={form.dpto} onChange={e => setForm({...form, dpto: e.target.value})}>
                <option value="">Seleccione</option>
                {DPTOS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="modal-field">
              <label>Teléfono:</label>
              <input type="text" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} placeholder="Ej: 987654321" />
            </div>
            <div className="modal-field">
              <label>Vendedor:</label>
              <input type="text" value={form.vendedor} onChange={e => setForm({...form, vendedor: e.target.value})} placeholder="Nombre del vendedor" />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setModal(null)}>Cancelar</button>
              <button className="botonNuevo" onClick={guardar}>
                💾 {modal === 'nuevo' ? 'Guardar' : 'Actualizar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cliente;