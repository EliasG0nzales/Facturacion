import React, { useState } from 'react';

const styles = `
  .page-container { padding:20px; font-family:Arial,Helvetica,sans-serif; font-size:13px; }
  .page-container * { color:#212529; box-sizing:border-box; }

  .page-title { display:flex; align-items:center; gap:8px; font-size:16px; font-weight:bold; margin-bottom:16px; }
  .info-dot { width:20px; height:20px; border-radius:50%; background:#17a2b8; color:#fff !important;
    display:inline-flex; align-items:center; justify-content:center; font-size:11px; font-weight:bold; flex-shrink:0; }

  /* FILTROS */
  .buscar-label { font-weight:bold; font-size:13px; margin-bottom:6px; display:block; }
  .radio-group  { display:flex; gap:18px; font-size:13px; margin-bottom:10px; flex-wrap:wrap; }
  .radio-group label { display:flex; align-items:center; gap:4px; cursor:pointer; }
  .radio-group input[type=radio] { accent-color:#17a2b8; cursor:pointer; }
  .buscar-row { display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:18px; }
  .buscar-row input[type=text] { width:400px; padding:7px 10px; border:1px solid #ced4da;
    border-radius:4px; font-size:13px; color:#212529; background:#fff; }
  .buscar-row input::placeholder { color:#adb5bd; font-style:italic; }

  .btn-buscar { background:#17a2b8; border:1px solid #17a2b8; color:#fff !important; padding:7px 16px;
    cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:5px; }
  .btn-buscar:hover { background:#138496; }
  .btn-nuevo  { background:#17a2b8; border:1px solid #17a2b8; color:#fff !important; padding:7px 16px;
    cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:5px; }
  .btn-nuevo:hover  { background:#138496; }

  /* TABLA */
  .tabla-titulo { text-align:center; font-weight:bold; font-size:14px; padding:6px 0; }
  table.tbl { width:100%; border-collapse:collapse; font-size:13px; }
  table.tbl thead tr { background:#17a2b8; }
  table.tbl thead th { padding:10px 8px; text-align:center; font-weight:bold; color:#fff !important; white-space:nowrap; }
  table.tbl tbody tr { background:#fff; border-bottom:1px solid #dee2e6; }
  table.tbl tbody tr:hover { background:#f0f9fb; }
  table.tbl tbody td { padding:8px 10px; }
  .empty-msg { text-align:center; color:#888; padding:20px; }

  /* estado badges */
  .badge-act { background:#28a745; color:#fff !important; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:bold; }
  .badge-ina { background:#6c757d; color:#fff !important; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:bold; }

  /* botones ACT */
  .btn-ac { background:none; border:none; cursor:pointer; font-size:15px; padding:2px 4px;
    border-radius:3px; transition:transform .12s; }
  .btn-ac:hover { transform:scale(1.2); background:#e8f4f8; }

  /* FORMULARIO */
  hr.sep { border:none; border-top:1px solid #dee2e6; margin:6px 0 16px; }
  .form-title { font-size:16px; font-weight:normal; margin-bottom:14px; }

  .form-grid-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; margin-bottom:14px; }
  .form-row-3  { display:grid; grid-template-columns:2fr 1fr 0.6fr; gap:14px; margin-bottom:14px; }
  .fg { display:flex; flex-direction:column; gap:4px; }
  .fg label { font-size:12px; font-weight:bold; }
  .fg input, .fg select, .fg textarea {
    padding:7px 10px; border:1px solid #ced4da; border-radius:4px;
    font-size:13px; color:#212529; background:#fff; width:100%; }
  .fg input:focus, .fg select:focus, .fg textarea:focus {
    border-color:#80bdff; outline:none; box-shadow:0 0 0 0.2rem rgba(0,123,255,.25); }
  .fg textarea { resize:vertical; min-height:60px; }

  .btns-row { display:flex; justify-content:center; gap:10px; margin-top:20px; }
  .btn-guardar  { background:#17a2b8; border:1px solid #17a2b8; color:#fff !important; padding:8px 20px;
    cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:6px; }
  .btn-guardar:hover  { background:#138496; }
  .btn-limpiar  { background:#6c757d; border:1px solid #6c757d; color:#fff !important; padding:8px 20px;
    cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:6px; }
  .btn-limpiar:hover  { background:#5a6268; }
  .btn-regresar { background:#17a2b8; border:1px solid #17a2b8; color:#fff !important; padding:8px 20px;
    cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:6px; }
  .btn-regresar:hover { background:#138496; }

  .alert-ok  { background:#d4edda; border:1px solid #c3e6cb; color:#155724 !important;
    padding:8px 14px; border-radius:4px; margin-bottom:12px; font-size:13px; display:inline-block; }
  .alert-err { background:#f8d7da; border:1px solid #f5c6cb; color:#721c24 !important;
    padding:8px 14px; border-radius:4px; margin-bottom:12px; font-size:13px; display:inline-block; }

  /* MODAL */
  .modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:1000;
    display:flex; align-items:center; justify-content:center; }
  .modal-box { background:#fff; border-radius:6px; padding:24px; width:500px; max-width:95vw;
    box-shadow:0 4px 24px rgba(0,0,0,0.2); }
  .modal-title { font-size:15px; font-weight:bold; margin-bottom:14px;
    border-bottom:2px solid #17a2b8; padding-bottom:8px; color:#17a2b8 !important; }
  .modal-field { margin-bottom:8px; font-size:13px; }
  .modal-field strong { display:inline-block; min-width:90px; color:#666; }
  .modal-btns { display:flex; gap:8px; margin-top:14px; }
  .btn-m      { background:#17a2b8; border:1px solid #17a2b8; color:#fff !important; padding:6px 16px;
    cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; }
  .btn-m:hover { background:#138496; }
  .btn-m-red  { background:#dc3545; border-color:#dc3545; }
  .btn-m-red:hover  { background:#c82333; }
  .btn-m-grey { background:#6c757d; border-color:#6c757d; }
  .btn-m-grey:hover { background:#5a6268; }
`;

/* ---- datos de ejemplo ---- */
const DATOS_INI = [
  { id:1, pregunta:'¿Cómo califica nuestro servicio?', destino:'Cliente', tipo:'Satisfacción', tema:'Servicio',
    fecha:'2026-03-10', respuesta:'Muy Bueno / Bueno / Regular / Malo', puntaje:'10', activo:true },
  { id:2, pregunta:'¿Recomendaría nuestros productos?', destino:'Proveedor', tipo:'Evaluación', tema:'Producto',
    fecha:'2026-03-12', respuesta:'Sí / No / Tal vez', puntaje:'5', activo:true },
  { id:3, pregunta:'¿El tiempo de entrega fue adecuado?', destino:'Cliente', tipo:'Logística', tema:'Entrega',
    fecha:'2026-03-14', respuesta:'Sí / No', puntaje:'5', activo:false },
];

const FORM_BLANK = { destino:'', tipo:'', tema:'', pregunta:'', respuesta:'', puntaje:'' };
const RADIO_OPTS = ['Pregunta','Destino','Tipo','Tema'];

const Encuesta = () => {
  const [vista, setVista]     = useState('lista');  // 'lista' | 'form'
  const [esNuevo, setEsNuevo] = useState(true);
  const [datos, setDatos]     = useState(DATOS_INI);
  const [filtrados, setFiltrados] = useState(DATOS_INI);
  const [criterio, setCriterio]   = useState('Pregunta');
  const [busqTxt, setBusqTxt]     = useState('');
  const [form, setForm]           = useState(FORM_BLANK);
  const [modal, setModal]         = useState(null);
  const [msg, setMsg]             = useState({t:'',x:''});

  const ok  = x => { setMsg({t:'ok',x}); setTimeout(()=>setMsg({t:'',x:''}),2500); };
  const err = x => { setMsg({t:'err',x}); setTimeout(()=>setMsg({t:'',x:''}),2500); };
  const sf  = (k,v) => setForm(p=>({...p,[k]:v}));

  const buscar = () => {
    const txt = busqTxt.toLowerCase();
    if (!txt) { setFiltrados([...datos]); return; }
    setFiltrados(datos.filter(d => {
      if (criterio==='Pregunta') return d.pregunta.toLowerCase().includes(txt);
      if (criterio==='Destino')  return d.destino.toLowerCase().includes(txt);
      if (criterio==='Tipo')     return d.tipo.toLowerCase().includes(txt);
      if (criterio==='Tema')     return d.tema.toLowerCase().includes(txt);
      return true;
    }));
  };

  const abrirNuevo = () => {
    setForm(FORM_BLANK); setEsNuevo(true); setVista('form');
  };

  const abrirEditar = d => {
    setForm({ id:d.id, destino:d.destino, tipo:d.tipo, tema:d.tema,
      pregunta:d.pregunta, respuesta:d.respuesta, puntaje:d.puntaje });
    setEsNuevo(false); setVista('form');
  };

  const guardar = () => {
    if (!form.pregunta) { err('El campo Pregunta(*) es obligatorio.'); return; }
    const nuevo = {
      id: form.id||Date.now(),
      pregunta:form.pregunta, destino:form.destino, tipo:form.tipo,
      tema:form.tema, respuesta:form.respuesta, puntaje:form.puntaje,
      fecha: new Date().toISOString().slice(0,10), activo:true,
    };
    if (esNuevo) {
      const nd=[...datos,nuevo]; setDatos(nd); setFiltrados(nd);
      ok('Encuesta registrada correctamente.');
    } else {
      const nd=datos.map(d=>d.id===nuevo.id?{...d,...nuevo}:d); setDatos(nd); setFiltrados(nd);
      ok('Encuesta actualizada correctamente.');
    }
    setVista('lista');
  };

  const eliminar = id => {
    if (!window.confirm('¿Eliminar esta encuesta?')) return;
    const nd=datos.filter(d=>d.id!==id); setDatos(nd); setFiltrados(nd);
    ok('Encuesta eliminada.');
  };

  const toggleActivo = id => {
    const nd=datos.map(d=>d.id===id?{...d,activo:!d.activo}:d); setDatos(nd); setFiltrados(nd);
  };

  /* ════════════════════════════════
     VISTA LISTA
  ════════════════════════════════ */
  if (vista==='lista') return (
    <><style>{styles}</style>
    <div className="page-container">

      <div className="page-title">
        <span className="info-dot">?</span>
        ENCUESTA
      </div>

      {msg.x && <div className={msg.t==='ok'?'alert-ok':'alert-err'}>{msg.t==='ok'?'✅':'⚠️'} {msg.x}</div>}

      {/* Filtros */}
      <span className="buscar-label">BUSCAR X</span>
      <div className="radio-group">
        {RADIO_OPTS.map(op=>(
          <label key={op}>
            <input type="radio" name="criterio" value={op}
              checked={criterio===op} onChange={e=>setCriterio(e.target.value)}/> {op}
          </label>
        ))}
      </div>
      <div className="buscar-row">
        <input type="text" placeholder="Ingrese el texto a buscar"
          value={busqTxt} onChange={e=>setBusqTxt(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&buscar()}/>
        <button className="btn-buscar" onClick={buscar}>🔍 Buscar</button>
        <button className="btn-nuevo"  onClick={abrirNuevo}>➕ Agregar Nuevo</button>
      </div>

      {/* Tabla */}
      <div className="tabla-titulo">LISTADO GENERAL</div>
      <table className="tbl">
        <thead>
          <tr>
            <th>PREGUNTA</th>
            <th width="10%">DESTINO</th>
            <th width="10%">TIPO</th>
            <th width="10%">TEMA</th>
            <th width="8%">PUNTAJE</th>
            <th width="9%">FECHA</th>
            <th width="9%">ESTADO</th>
            <th width="8%">ACT.</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.length===0
            ? <tr><td colSpan="8" className="empty-msg">No hay encuestas registradas.</td></tr>
            : filtrados.map(d=>(
              <tr key={d.id}>
                <td>{d.pregunta}</td>
                <td align="center">{d.destino}</td>
                <td align="center">{d.tipo}</td>
                <td align="center">{d.tema}</td>
                <td align="center">{d.puntaje}</td>
                <td align="center">{d.fecha}</td>
                <td align="center">
                  <span className={d.activo?'badge-act':'badge-ina'}>
                    {d.activo?'Activo':'Inactivo'}
                  </span>
                </td>
                <td align="center">
                  <button className="btn-ac" title="Ver detalle" onClick={()=>setModal(d)}>👁️</button>
                  <button className="btn-ac" title="Editar"      onClick={()=>abrirEditar(d)}>✏️</button>
                  <button className="btn-ac" title={d.activo?'Desactivar':'Activar'}
                    onClick={()=>toggleActivo(d.id)}>{d.activo?'🔴':'🟢'}</button>
                  <button className="btn-ac" title="Eliminar"    onClick={()=>eliminar(d.id)}>🗑️</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Modal detalle */}
      {modal && (
        <div className="modal-backdrop" onClick={()=>setModal(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-title">📋 DETALLE DE ENCUESTA</div>
            <div className="modal-field"><strong>Pregunta:</strong> {modal.pregunta}</div>
            <div className="modal-field"><strong>Destino:</strong>  {modal.destino}</div>
            <div className="modal-field"><strong>Tipo:</strong>     {modal.tipo}</div>
            <div className="modal-field"><strong>Tema:</strong>     {modal.tema}</div>
            <div className="modal-field"><strong>Respuesta:</strong>{modal.respuesta}</div>
            <div className="modal-field"><strong>Puntaje:</strong>  {modal.puntaje}</div>
            <div className="modal-field"><strong>Fecha:</strong>    {modal.fecha}</div>
            <div className="modal-field">
              <strong>Estado:</strong>
              <span className={modal.activo?'badge-act':'badge-ina'} style={{marginLeft:6}}>
                {modal.activo?'Activo':'Inactivo'}
              </span>
            </div>
            <div className="modal-btns">
              <button className="btn-m" onClick={()=>{abrirEditar(modal);setModal(null);}}>✏️ Editar</button>
              <button className="btn-m btn-m-red" onClick={()=>{eliminar(modal.id);setModal(null);}}>🗑️ Eliminar</button>
              <button className="btn-m btn-m-grey" onClick={()=>setModal(null)}>✖ Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div></>
  );

  /* ════════════════════════════════
     VISTA FORMULARIO
  ════════════════════════════════ */
  return (
    <><style>{styles}</style>
    <div className="page-container">
      <div className="form-title">ENCUESTA : {esNuevo?'NUEVO':'EDITAR'}</div>
      <hr className="sep"/>
      {msg.x && <div className={msg.t==='ok'?'alert-ok':'alert-err'}>{msg.t==='ok'?'✅':'⚠️'} {msg.x}</div>}

      {/* Fila 1: Destino | Tipo | Tema */}
      <div className="form-grid-3">
        <div className="fg">
          <label>Destino</label>
          <input value={form.destino} onChange={e=>sf('destino',e.target.value)} placeholder="Ej: Cliente, Proveedor..."/>
        </div>
        <div className="fg">
          <label>Tipo</label>
          <input value={form.tipo} onChange={e=>sf('tipo',e.target.value)} placeholder="Ej: Satisfacción, Evaluación..."/>
        </div>
        <div className="fg">
          <label>Tema</label>
          <input value={form.tema} onChange={e=>sf('tema',e.target.value)} placeholder="Ej: Servicio, Producto..."/>
        </div>
      </div>

      {/* Fila 2: Pregunta | Respuesta | Puntaje */}
      <div className="form-row-3">
        <div className="fg">
          <label>Pregunta(*)</label>
          <textarea value={form.pregunta} onChange={e=>sf('pregunta',e.target.value)}
            placeholder="Escriba la pregunta de la encuesta..." rows={2}/>
        </div>
        <div className="fg">
          <label>Respuesta</label>
          <textarea value={form.respuesta} onChange={e=>sf('respuesta',e.target.value)}
            placeholder="Ej: Sí / No / Tal vez..." rows={2}/>
        </div>
        <div className="fg">
          <label>Puntaje</label>
          <input type="number" min="0" max="100" value={form.puntaje}
            onChange={e=>sf('puntaje',e.target.value)} placeholder="0-100"/>
        </div>
      </div>

      <div className="btns-row">
        <button className="btn-guardar"  onClick={guardar}>💾 Guardar</button>
        <button className="btn-limpiar"  onClick={()=>setForm(FORM_BLANK)}>📋 Limpiar</button>
        <button className="btn-regresar" onClick={()=>setVista('lista')}>↩ Regresar</button>
      </div>
    </div></>
  );
};

export default Encuesta;