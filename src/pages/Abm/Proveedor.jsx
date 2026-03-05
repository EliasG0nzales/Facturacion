import React, { useState } from 'react';

const styles = `
  .page-container {
    padding: 20px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 13px;
  }

  .page-container * {
    color: #212529;
  }

  .page-title {
    font-size: 18px;
    font-weight: bold;
    border-bottom: 2px solid #00A3E1;
    padding-bottom: 5px;
    margin-bottom: 15px;
    color: #333;
  }

  .buscar-section {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 15px;
  }

  .buscar-section b { font-size: 13px; color: #212529; }

  .buscar-section select,
  .buscar-section input[type="text"] {
    padding: 5px 8px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 13px;
    color: #212529;
    background: #fff;
  }

  .buscar-section input[type="text"] { width: 220px; }

  .buscar-section select:focus,
  .buscar-section input:focus {
    border-color: #80bdff;
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
  }

  .botonNuevo {
    background-color: #17a2b8;
    border: 1px solid #17a2b8;
    color: #ffffff !important;
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
    color: #fff !important;
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

  .tabla-titulo {
    text-align: center;
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 8px;
    color: #212529;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  table thead tr { background-color: #17a2b8; color: #fff; }

  table thead th {
    padding: 10px 8px;
    text-align: left;
    font-weight: bold;
    color: #fff !important;
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
  .btn-delete  { color: #dc3545; }

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
    min-width: 400px;
    max-width: 520px;
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
    background: #fff;
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
    color: #fff !important;
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
    color: #155724 !important;
    padding: 8px 14px;
    border-radius: 4px;
    margin-bottom: 10px;
    font-size: 13px;
    display: inline-block;
  }

  .alert-danger {
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    color: #721c24 !important;
    padding: 8px 14px;
    border-radius: 4px;
    margin-bottom: 10px;
    font-size: 13px;
    display: inline-block;
  }

  .paginacion {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    font-size: 13px;
    color: #212529;
  }
`;

const TIPOS = ['Natural', 'Jurídica', 'Extranjera'];

const PROVEEDORES_INICIALES = [
  { id: 1, tipo: 'Jurídica',  nombre: 'Distribuidora Norte SAC', ruc: '20456789012', telefono: '044-223344', contacto: 'Luis Torres' },
  { id: 2, tipo: 'Natural',   nombre: 'Juan Quispe Mamani',       ruc: '10345678901', telefono: '987654321',  contacto: 'Juan Quispe' },
];

const Proveedor = () => {
  const [tipoBusqueda, setTipoBusqueda] = useState('1');
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [proveedores, setProveedores] = useState(PROVEEDORES_INICIALES);
  const [msg, setMsg] = useState({ tipo: '', texto: '' });
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ nombre: '', tipo: '', ruc: '', telefono: '', contacto: '' });

  const showMsg = (tipo, texto) => {
    setMsg({ tipo, texto });
    setTimeout(() => setMsg({ tipo: '', texto: '' }), 2500);
  };

  const proveedoresFiltrados = proveedores.filter(p => {
    if (!textoBusqueda) return true;
    if (tipoBusqueda === '1') return p.nombre.toLowerCase().includes(textoBusqueda.toLowerCase());
    if (tipoBusqueda === '2') return p.ruc.includes(textoBusqueda);
    if (tipoBusqueda === '3') return p.tipo.toLowerCase().includes(textoBusqueda.toLowerCase());
    if (tipoBusqueda === '4') return p.contacto.toLowerCase().includes(textoBusqueda.toLowerCase());
    if (tipoBusqueda === '5') return (
      p.nombre.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
      p.ruc.includes(textoBusqueda) ||
      p.tipo.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
      p.contacto.toLowerCase().includes(textoBusqueda.toLowerCase())
    );
    return true;
  });

  const abrirNuevo = () => {
    setForm({ nombre: '', tipo: '', ruc: '', telefono: '', contacto: '' });
    setModal('nuevo');
  };

  const abrirEditar = (p) => {
    setForm({ ...p });
    setModal('editar');
  };

  const guardar = () => {
    if (!form.nombre || !form.ruc) return showMsg('danger', 'Nombre y RUC son obligatorios.');
    if (modal === 'nuevo') {
      setProveedores(prev => [...prev, { ...form, id: Date.now() }]);
      showMsg('success', 'Proveedor agregado correctamente.');
    } else {
      setProveedores(prev => prev.map(p => p.id === form.id ? { ...form } : p));
      showMsg('success', 'Proveedor actualizado correctamente.');
    }
    setModal(null);
  };

  const eliminar = (id) => {
    if (window.confirm('¿Eliminar este proveedor?')) {
      setProveedores(prev => prev.filter(p => p.id !== id));
      showMsg('success', 'Proveedor eliminado.');
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="page-container">

        {/* TÍTULO */}
        <div className="page-title">🏭 PROVEEDORES</div>

        {/* MENSAJES */}
        {msg.texto && (
          <div className={msg.tipo === 'success' ? 'alert-success' : 'alert-danger'}>
            {msg.tipo === 'success' ? '✅' : '⚠️'} {msg.texto}
          </div>
        )}

        {/* BUSCAR */}
        <div className="buscar-section">
          <b>BUSCAR X</b>
          <select value={tipoBusqueda} onChange={e => setTipoBusqueda(e.target.value)}>
            <option value="1">Empresa/Nombre</option>
            <option value="2">Ruc/dni</option>
            <option value="3">Tipo</option>
            <option value="4">Contacto</option>
            <option value="5">Todo</option>
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
          <b>Página 1 de {Math.ceil(proveedoresFiltrados.length / 10) || 0}</b>
          <span style={{ fontSize: 12, color: '#888' }}>{proveedoresFiltrados.length} registro(s)</span>
        </div>

        {/* TABLA */}
        <div className="tabla-titulo">LISTADO GENERAL PROVEEDORES</div>
        <table>
          <thead>
            <tr>
              <th width="5%" align="center">Nro</th>
              <th width="12%">Tipo</th>
              <th>Nombre</th>
              <th width="13%">RUC</th>
              <th width="12%">Teléfono</th>
              <th width="13%">Contacto</th>
              <th width="10%" align="center">Opciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedoresFiltrados.length === 0 ? (
              <tr><td colSpan="7" className="empty-msg">No hay proveedores registrados.</td></tr>
            ) : (
              proveedoresFiltrados.map((p, i) => (
                <tr key={p.id}>
                  <td align="center">{i + 1}</td>
                  <td>{p.tipo}</td>
                  <td>{p.nombre}</td>
                  <td>{p.ruc}</td>
                  <td>{p.telefono}</td>
                  <td>{p.contacto}</td>
                  <td>
                    <div className="acciones">
                      <button className="btn-accion btn-editar" title="Editar" onClick={() => abrirEditar(p)}>✏️</button>
                      <button className="btn-accion btn-delete" title="Eliminar" onClick={() => eliminar(p.id)}>🗑️</button>
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
          <span title="Exportar Excel" style={{ color: '#39B636' }}>📗</span>
          <span title="Exportar Word"  style={{ color: '#3333CC' }}>📘</span>
        </div>

        <hr style={{ margin: '15px 0', borderColor: '#dee2e6' }} />

      </div>

      {/* MODAL */}
      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-title">
              {modal === 'nuevo' ? '✚ Agregar Proveedor' : '✏️ Editar Proveedor'}
            </div>
            <div className="modal-field">
              <label>Nombre / Empresa: *</label>
              <input type="text" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre o razón social" />
            </div>
            <div className="modal-field">
              <label>Tipo:</label>
              <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
                <option value="">Seleccione</option>
                {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="modal-field">
              <label>RUC / DNI: *</label>
              <input type="text" value={form.ruc} onChange={e => setForm({ ...form, ruc: e.target.value })} placeholder="Ej: 20123456789" />
            </div>
            <div className="modal-field">
              <label>Teléfono:</label>
              <input type="text" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} placeholder="Ej: 987654321" />
            </div>
            <div className="modal-field">
              <label>Contacto:</label>
              <input type="text" value={form.contacto} onChange={e => setForm({ ...form, contacto: e.target.value })} placeholder="Nombre del contacto" />
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

export default Proveedor;