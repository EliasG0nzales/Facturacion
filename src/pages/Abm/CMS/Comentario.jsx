import React, { useState, useRef } from 'react';

const styles = `
  .page-container { padding:20px; font-family:Arial,Helvetica,sans-serif; font-size:13px; }
  .page-container * { color:#212529; box-sizing:border-box; }
  .page-title { font-size:18px; font-weight:bold; border-bottom:2px solid #00A3E1; padding-bottom:5px; margin-bottom:15px; color:#333; display:flex; align-items:center; gap:8px; }

  .filtro-section { display:flex; align-items:flex-end; gap:16px; flex-wrap:wrap; margin-bottom:20px; }
  .filtro-field { display:flex; flex-direction:column; gap:4px; }
  .filtro-field label { font-weight:bold; font-size:13px; color:#212529; }

  /* input oculto + texto + botón calendario visible */
  .date-group { display:flex; align-items:center; border:1px solid #ced4da; border-radius:4px; background:#fff; overflow:hidden; width:220px; }
  .date-group input[type="text"] { flex:1; border:none; outline:none; padding:6px 8px; font-size:13px; color:#212529; background:transparent; cursor:text; }
  .date-group input[type="date"] { position:absolute; opacity:0; width:0; height:0; pointer-events:none; }
  .date-group .cal-btn { background:#17a2b8; border:none; border-left:1px solid #17a2b8; padding:0 10px; height:34px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .date-group .cal-btn img { width:18px; height:18px; filter:brightness(0) invert(1); }
  .date-group .cal-btn svg { width:18px; height:18px; fill:#fff; }

  .botonBuscar { background-color:#17a2b8; border:1px solid #17a2b8; color:#fff !important; padding:6px 14px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:6px; transition:background-color 0.2s; height:34px; }
  .botonBuscar:hover { background-color:#138496; }
  .botonNuevo { background-color:#17a2b8; border:1px solid #17a2b8; color:#fff !important; padding:6px 14px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:5px; transition:background-color 0.2s; }
  .botonNuevo:hover { background-color:#138496; }
  .btn-cancel { background-color:#6c757d; border:1px solid #6c757d; color:#fff !important; padding:6px 16px; border-radius:4px; cursor:pointer; font-size:13px; font-weight:bold; }
  .btn-cancel:hover { background-color:#5a6268; }

  .paginacion { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; font-size:13px; }
  .tabla-titulo { text-align:center; font-weight:bold; font-size:14px; margin-bottom:8px; }

  table { width:100%; border-collapse:collapse; font-size:13px; }
  table thead tr { background-color:#17a2b8; }
  table thead th { padding:10px 8px; text-align:center; font-weight:bold; color:#fff !important; }
  table tbody tr { background-color:#fff; border-bottom:1px solid #dee2e6; }
  table tbody tr:hover { background-color:#f8f9fa; }
  table tbody td { padding:8px; color:#212529; }
  .empty-msg { text-align:center; color:#888; padding:30px; font-size:13px; }

  .acciones { display:flex; gap:6px; justify-content:center; }
  .btn-accion { background:none; border:none; cursor:pointer; font-size:15px; padding:2px 5px; border-radius:3px; transition:background 0.15s; }
  .btn-accion:hover { background-color:#e0e0e0; }

  .badge-activo   { background:#28a745; color:#fff !important; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:bold; }
  .badge-inactivo { background:#dc3545; color:#fff !important; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:bold; }
  .badge-pendiente{ background:#ffc107; color:#212529 !important; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:bold; }

  .exportar-section { display:flex; gap:18px; justify-content:flex-end; margin-top:10px; font-size:20px; }
  .exportar-btn { display:flex; flex-direction:column; align-items:center; gap:2px; cursor:pointer; transition:transform 0.15s; background:none; border:none; padding:0; }
  .exportar-btn:hover { transform:scale(1.15); }
  .exportar-label { font-size:10px; font-weight:bold; }

  .alert-success { background:#d4edda; border:1px solid #c3e6cb; color:#155724 !important; padding:8px 14px; border-radius:4px; margin-bottom:10px; font-size:13px; display:inline-block; }
  .alert-danger  { background:#f8d7da; border:1px solid #f5c6cb; color:#721c24 !important; padding:8px 14px; border-radius:4px; margin-bottom:10px; font-size:13px; display:inline-block; }

  .modal-backdrop { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:2000; }
  .modal-box { background:#fff; border-radius:8px; padding:24px 28px; min-width:460px; max-width:600px; width:100%; box-shadow:0 8px 32px rgba(0,0,0,0.22); }
  .modal-title { font-size:15px; font-weight:bold; color:#212529; margin-bottom:16px; border-bottom:2px solid #00A3E1; padding-bottom:6px; }
  .modal-field { margin-bottom:12px; }
  .modal-field label { display:block; font-weight:bold; margin-bottom:4px; font-size:12px; color:#888; text-transform:uppercase; }
  .modal-field .valor { font-size:13px; color:#212529; padding:6px 8px; background:#f8f9fa; border:1px solid #dee2e6; border-radius:4px; min-height:36px; }
  .modal-field .valor-texto { font-size:13px; color:#212529; padding:8px; background:#f8f9fa; border:1px solid #dee2e6; border-radius:4px; min-height:80px; white-space:pre-wrap; }
  .modal-field select { width:100%; padding:6px 8px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; }
  .modal-actions { display:flex; gap:8px; justify-content:flex-end; margin-top:16px; }
  .modal-row { display:flex; gap:12px; }
  .modal-row .modal-field { flex:1; }
`;

// SVG ícono calendario exacto como en la imagen original
const CalIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="17" rx="2" ry="2" stroke="#fff" strokeWidth="2" fill="none"/>
    <line x1="3" y1="9" x2="21" y2="9" stroke="#fff" strokeWidth="2"/>
    <line x1="8" y1="2" x2="8" y2="6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
    <line x1="16" y1="2" x2="16" y2="6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
    <rect x="7" y="13" width="3" height="3" rx="0.5" fill="#fff"/>
    <rect x="11" y="13" width="3" height="3" rx="0.5" fill="#fff"/>
    <rect x="7" y="17" width="3" height="2" rx="0.5" fill="#fff"/>
  </svg>
);

// Componente DatePicker con botón calendario visible
const DatePicker = ({ label, value, onChange }) => {
  const hiddenRef = useRef(null);

  const formatDisplay = (iso) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  };

  const openPicker = () => {
    if (hiddenRef.current) {
      try { hiddenRef.current.showPicker(); }
      catch { hiddenRef.current.click(); }
    }
  };

  return (
    <div className="filtro-field">
      <label>{label}</label>
      <div className="date-group">
        <input
          type="text"
          readOnly
          value={formatDisplay(value)}
          placeholder="dd/mm/aaaa"
          onClick={openPicker}
        />
        {/* input date real oculto */}
        <input
          ref={hiddenRef}
          type="date"
          value={value}
          onChange={e => onChange(e.target.value)}
          tabIndex={-1}
        />
        <button type="button" className="cal-btn" onClick={openPicker} title="Seleccionar fecha">
          <CalIcon />
        </button>
      </div>
    </div>
  );
};

const ESTADOS = ['Pendiente', 'Aprobado', 'Rechazado'];

const COMENTARIOS_INICIALES = [
  { id:1, fecha:'2026-03-15', comento:'Juan Pérez',       email:'juan@email.com',    comentario:'Excelente servicio, muy recomendable.',                     estado:'Aprobado'  },
  { id:2, fecha:'2026-03-18', comento:'María García',     email:'maria@gmail.com',   comentario:'El producto llegó en perfectas condiciones.',               estado:'Aprobado'  },
  { id:3, fecha:'2026-04-02', comento:'Carlos Rodríguez', email:'carlos@hotmail.com',comentario:'Tuve un problema con el pedido pero lo resolvieron rápido.',estado:'Pendiente' },
  { id:4, fecha:'2026-04-10', comento:'Ana Torres',       email:'ana@empresa.pe',    comentario:'Muy buena atención al cliente, volveré a comprar.',         estado:'Aprobado'  },
  { id:5, fecha:'2026-04-22', comento:'Luis Mamani',      email:'luis@correo.com',   comentario:'No estoy satisfecho con la calidad del producto.',          estado:'Rechazado' },
];

const Comentario = () => {
  const [comentarios, setComentarios] = useState(COMENTARIOS_INICIALES);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin]       = useState('');
  const [msg, setMsg]                 = useState({ tipo:'', texto:'' });
  const [modal, setModal]             = useState(null);

  const showMsg = (tipo, texto) => { setMsg({tipo,texto}); setTimeout(()=>setMsg({tipo:'',texto:''}),2500); };

  const comentariosFiltrados = comentarios.filter(c => {
    if (fechaInicio && c.fecha < fechaInicio) return false;
    if (fechaFin    && c.fecha > fechaFin)    return false;
    return true;
  });

  const cambiarEstado = (id, nuevoEstado) => {
    setComentarios(prev => prev.map(c => c.id===id ? {...c, estado:nuevoEstado} : c));
    showMsg('success', `Estado actualizado a "${nuevoEstado}".`);
    setModal(null);
  };

  const eliminar = (id) => {
    if (window.confirm('¿Eliminar este comentario?')) {
      setComentarios(prev => prev.filter(c => c.id!==id));
      showMsg('success', 'Comentario eliminado.');
      setModal(null);
    }
  };

  const getBadge = (estado) => {
    if (estado==='Aprobado')  return <span className="badge-activo">{estado}</span>;
    if (estado==='Rechazado') return <span className="badge-inactivo">{estado}</span>;
    return <span className="badge-pendiente">{estado}</span>;
  };

  const handleImprimir = () => {
    const filas = comentariosFiltrados.map((c,i) => `
      <tr><td>${i+1}</td><td>${c.fecha}</td><td>${c.comento}</td><td>${c.email}</td>
      <td>${c.comentario}</td><td>${c.estado}</td></tr>`).join('');
    const win = window.open('','_blank');
    win.document.write(`<html><head><title>Comentarios</title>
      <style>body{font-family:Arial,sans-serif;font-size:12px;}h2{color:#17a2b8;border-bottom:2px solid #17a2b8;padding-bottom:5px;}
      table{border-collapse:collapse;width:100%;}th{background:#17a2b8;color:#fff;padding:8px;text-align:left;}
      td{padding:6px 8px;border-bottom:1px solid #dee2e6;}tr:nth-child(even){background:#f8f9fa;}</style></head>
      <body><h2>LISTADO GENERAL COMENTARIOS</h2>
      <table><thead><tr><th>Nro</th><th>Fecha</th><th>Comento</th><th>Email</th><th>Comentario</th><th>Estado</th></tr></thead>
      <tbody>${filas}</tbody></table>
      <p style="font-size:11px;color:#888;margin-top:12px;">Total: ${comentariosFiltrados.length} registro(s)</p>
      </body></html>`);
    win.document.close(); win.print();
  };

  const handleExcel = () => {
    const enc = ['Nro','Fecha','Comento','Email','Comentario','Estado'];
    const filas = comentariosFiltrados.map((c,i) =>
      [i+1, c.fecha, `"${c.comento}"`, c.email, `"${c.comentario}"`, c.estado].join(',')
    );
    const csv = [enc.join(','), ...filas].join('\n');
    const blob = new Blob(['\uFEFF'+csv], {type:'text/csv;charset=utf-8;'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='comentarios.csv'; a.click();
    URL.revokeObjectURL(a.href);
    showMsg('success','Archivo Excel descargado correctamente.');
  };

  const handleWord = () => {
    const filas = comentariosFiltrados.map((c,i) => `
      <tr><td>${i+1}</td><td>${c.fecha}</td><td>${c.comento}</td><td>${c.email}</td>
      <td>${c.comentario}</td><td>${c.estado}</td></tr>`).join('');
    const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
      <head><meta charset='utf-8'><title>Comentarios</title>
      <style>body{font-family:Arial;font-size:12pt;}h2{color:#17a2b8;}
      table{width:100%;border-collapse:collapse;}th{background:#17a2b8;color:white;padding:6px;border:1px solid #ccc;}
      td{padding:5px 6px;border:1px solid #ccc;}</style></head>
      <body><h2>LISTADO GENERAL COMENTARIOS</h2>
      <table><thead><tr><th>Nro</th><th>Fecha</th><th>Comento</th><th>Email</th><th>Comentario</th><th>Estado</th></tr></thead>
      <tbody>${filas}</tbody></table>
      <p>Total: ${comentariosFiltrados.length} registro(s)</p></body></html>`;
    const blob = new Blob([html], {type:'application/msword'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='comentarios.doc'; a.click();
    URL.revokeObjectURL(a.href);
    showMsg('success','Archivo Word descargado correctamente.');
  };

  return (
    <>
      <style>{styles}</style>
      <div className="page-container">

        <div className="page-title">💬 COMENTARIO</div>

        {msg.texto && (
          <div className={msg.tipo==='success'?'alert-success':'alert-danger'}>
            {msg.tipo==='success'?'✅':'⚠️'} {msg.texto}
          </div>
        )}

        {/* FILTRO — F.Inicio + F.Fin con ícono calendario + Buscar */}
        <div className="filtro-section">
          <DatePicker label="F.Inicio" value={fechaInicio} onChange={setFechaInicio} />
          <DatePicker label="F.Fin"    value={fechaFin}    onChange={setFechaFin}    />
          <button className="botonBuscar">🔍 Buscar</button>
        </div>

        <div className="paginacion">
          <b>Página 1 de {Math.ceil(comentariosFiltrados.length/10)||0}</b>
          <span style={{fontSize:12,color:'#888'}}>{comentariosFiltrados.length} registro(s)</span>
        </div>

        <div className="tabla-titulo">LISTADO GENERAL</div>
        <table>
          <thead>
            <tr>
              <th width="10%">FECHA</th>
              <th width="14%">COMENTO</th>
              <th width="16%">EMAIL</th>
              <th>COMENTARIO</th>
              <th width="10%">E.</th>
              <th width="9%">OPC.</th>
            </tr>
          </thead>
          <tbody>
            {comentariosFiltrados.length===0 ? (
              <tr><td colSpan="6" className="empty-msg">No hay comentarios en el rango de fechas seleccionado.</td></tr>
            ) : (
              comentariosFiltrados.map(c => (
                <tr key={c.id}>
                  <td align="center">{c.fecha}</td>
                  <td>{c.comento}</td>
                  <td style={{fontSize:12,color:'#007bff'}}>{c.email}</td>
                  <td style={{fontSize:12}}>{c.comentario}</td>
                  <td align="center">{getBadge(c.estado)}</td>
                  <td>
                    <div className="acciones">
                      <button className="btn-accion" style={{color:'#17a2b8'}} title="Ver detalle" onClick={()=>setModal({item:{...c}})}>✏️</button>
                      <button className="btn-accion" style={{color:'#dc3545'}} title="Eliminar" onClick={()=>eliminar(c.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="exportar-section">
          <button className="exportar-btn" onClick={handleImprimir}>
            🖨️<span className="exportar-label" style={{color:'#555'}}>Imprimir</span>
          </button>
          <button className="exportar-btn" onClick={handleExcel}>
            📗<span className="exportar-label" style={{color:'#39B636'}}>Excel</span>
          </button>
          <button className="exportar-btn" onClick={handleWord}>
            📘<span className="exportar-label" style={{color:'#3333CC'}}>Word</span>
          </button>
        </div>

        <hr style={{margin:'15px 0',borderColor:'#dee2e6'}} />
        <div style={{fontSize:12,paddingTop:6}}>
          <b>Leyenda: </b> ✏️ Ver detalle &nbsp;&nbsp; 🗑️ Eliminar &nbsp;&nbsp;
          <span className="badge-activo">Aprobado</span>&nbsp;
          <span className="badge-pendiente">Pendiente</span>&nbsp;
          <span className="badge-inactivo">Rechazado</span>
        </div>
      </div>

      {/* MODAL DETALLE */}
      {modal && (
        <div className="modal-backdrop" onClick={()=>setModal(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-title">💬 Detalle del Comentario</div>
            <div className="modal-row">
              <div className="modal-field">
                <label>Fecha</label>
                <div className="valor">{modal.item.fecha}</div>
              </div>
              <div className="modal-field">
                <label>Estado actual</label>
                <div className="valor">{getBadge(modal.item.estado)}</div>
              </div>
            </div>
            <div className="modal-row">
              <div className="modal-field">
                <label>Comento</label>
                <div className="valor">{modal.item.comento}</div>
              </div>
              <div className="modal-field">
                <label>Email</label>
                <div className="valor">{modal.item.email}</div>
              </div>
            </div>
            <div className="modal-field">
              <label>Comentario</label>
              <div className="valor-texto">{modal.item.comentario}</div>
            </div>
            <div className="modal-field">
              <label>Cambiar Estado</label>
              <select
                value={modal.item.estado}
                onChange={e=>setModal(prev=>({...prev,item:{...prev.item,estado:e.target.value}}))}
              >
                {ESTADOS.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={()=>setModal(null)}>Cancelar</button>
              <button className="botonNuevo" style={{background:'#dc3545',border:'1px solid #dc3545'}} onClick={()=>eliminar(modal.item.id)}>🗑️ Eliminar</button>
              <button className="botonNuevo" onClick={()=>cambiarEstado(modal.item.id,modal.item.estado)}>💾 Guardar Estado</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Comentario;