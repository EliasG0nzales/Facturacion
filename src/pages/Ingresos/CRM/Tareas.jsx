import React, { useState, useRef } from 'react';

const styles = `
  .page-container { padding:20px; font-family:Arial,Helvetica,sans-serif; font-size:13px; }
  .page-container * { color:#212529; box-sizing:border-box; }

  .page-title  { font-size:15px; font-weight:bold; margin-bottom:16px; display:flex; align-items:center; gap:8px; }
  .form-title  { font-size:17px; font-weight:normal; margin-bottom:18px; }
  .form-title-center { text-align:center; }

  /* FILTROS */
  .filtro-row { display:flex; align-items:center; justify-content:center; gap:10px; margin-bottom:20px; flex-wrap:wrap; }
  .filtro-row input[type="text"] { width:380px; padding:7px 12px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; }
  .filtro-row input::placeholder { color:#adb5bd; font-style:italic; }
  .filtro-label { font-weight:bold; font-size:13px; white-space:nowrap; margin-right:4px; }
  .radio-group-inline { display:flex; align-items:center; gap:10px; }
  .radio-group-inline label { display:flex; align-items:center; gap:3px; cursor:pointer; font-size:13px; }
  .radio-group-inline input[type="radio"] { accent-color:#17a2b8; cursor:pointer; }

  .botonBuscar  { background:#17a2b8; border:1px solid #17a2b8; color:#fff !important; padding:7px 16px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:5px; height:36px; }
  .botonBuscar:hover  { background:#138496; }
  .botonAgregar { background:#17a2b8; border:1px solid #17a2b8; color:#fff !important; padding:7px 16px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:5px; height:36px; }
  .botonAgregar:hover { background:#138496; }

  /* TABLA */
  .tabla-titulo { text-align:center; font-weight:bold; font-size:14px; padding:6px 0; }
  table { width:100%; border-collapse:collapse; font-size:13px; }
  table thead tr { background:#17a2b8; }
  table thead th { padding:10px 8px; text-align:center; font-weight:bold; color:#fff !important; white-space:nowrap; }
  table tbody tr { background:#f2f2ec; border-bottom:1px solid #dee2e6; }
  table tbody tr:hover { background:#ccff66 !important; }
  table tbody td { padding:8px 10px; color:#212529; }
  .empty-msg { text-align:center; color:#888; padding:20px; }

  .estado-cell { display:flex; align-items:center; gap:5px; white-space:nowrap; }
  .dot-abierto { color:#28a745; font-size:14px; }
  .dot-cerrado { color:#dc3545; font-size:14px; }
  .dot-proceso { color:#ffc107; font-size:14px; }

  .btn-ver { background:none; border:none; cursor:pointer; padding:2px 5px; border-radius:3px; transition:background 0.15s; }
  .btn-ver:hover { background:#e0f7fa; }
  .btn-ac { background:none; border:none; cursor:pointer; font-size:14px; padding:2px 4px; border-radius:3px; }
  .btn-ac:hover { background:#e0e0e0; }

  /* FORMULARIO TAREAS */
  hr.sep { border:none; border-top:1px solid #dee2e6; margin:8px 0 16px; }
  .fila-top { display:flex; align-items:flex-start; gap:16px; flex-wrap:wrap; margin-bottom:14px; }
  .fg { display:flex; flex-direction:column; gap:4px; }
  .fg label { font-size:12px; font-weight:bold; }
  .fg select, .fg input[type="text"], .fg input[type="time"] {
    padding:6px 10px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; }
  .fg-de   { min-width:180px; }
  .fg-para { min-width:200px; flex:1; }
  .fg-imp  { min-width:130px; }
  .fg-fecha{ min-width:175px; }
  .fg-hora { min-width:110px; }
  .radio-inline { display:flex; align-items:center; gap:10px; margin-bottom:4px; font-size:13px; }
  .radio-inline label { display:flex; align-items:center; gap:3px; cursor:pointer; }
  .radio-inline input[type="radio"] { accent-color:#17a2b8; cursor:pointer; }

  .date-group { display:flex; align-items:center; border:1px solid #ced4da; border-radius:4px; background:#fff; overflow:hidden; width:175px; }
  .date-group .date-text { flex:1; border:none; outline:none; padding:6px 8px; font-size:13px; color:#212529; background:transparent; cursor:pointer; }
  .date-group input[type="date"] { position:absolute; opacity:0; width:0; height:0; pointer-events:none; }
  .date-group .cal-btn { background:#fff; border:none; border-left:1px solid #ced4da; padding:0 7px; height:34px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

  .fila-mid { display:flex; gap:16px; flex-wrap:wrap; margin-bottom:14px; }
  .fg-motivo   { flex:2; min-width:220px; display:flex; flex-direction:column; gap:4px; }
  .fg-encuesta { flex:1; min-width:180px; display:flex; flex-direction:column; gap:4px; }
  .fg-motivo label, .fg-encuesta label { font-size:12px; font-weight:bold; }
  .fg-motivo input[type="text"] { padding:6px 10px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; width:100%; }
  .fg-encuesta select { padding:6px 10px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; width:100%; }

  .fg-detalle { display:flex; flex-direction:column; gap:4px; margin-bottom:16px; }
  .fg-detalle label { font-size:12px; font-weight:bold; display:flex; align-items:center; gap:6px; }
  .fg-detalle textarea { padding:8px 10px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; resize:vertical; min-height:120px; width:100%; }
  .fg-detalle textarea:focus { border-color:#80bdff; outline:none; box-shadow:0 0 0 0.2rem rgba(0,123,255,.25); }

  /* ícono imagen clickable */
  .btn-imagen-ico { background:none; border:1px solid #ced4da; border-radius:4px; cursor:pointer; padding:3px 7px; font-size:15px; line-height:1; color:#17a2b8 !important; }
  .btn-imagen-ico:hover { background:#e0f7fa; }

  /* FORMULARIO IMAGEN */
  .form-row-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; margin-bottom:16px; }
  .form-row-img { display:flex; gap:20px; flex-wrap:wrap; margin-bottom:16px; }
  .fg-img { display:flex; flex-direction:column; gap:4px; }
  .fg-img label { font-size:12px; font-weight:bold; }
  .fg-img input[type="text"] { padding:6px 10px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; width:100%; }
  .fg-img input[type="text"]:focus { border-color:#80bdff; outline:none; box-shadow:0 0 0 0.2rem rgba(0,123,255,.25); }
  .img-hint { font-size:11px; color:#e74c3c; font-weight:bold; }
  .img-preview { width:80px; height:60px; object-fit:cover; border:1px solid #ced4da; border-radius:4px; margin-top:4px; }
  .badge-act { background:#28a745; color:#fff !important; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:bold; }
  .badge-ina { background:#6c757d; color:#fff !important; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:bold; }

  .btns-row { display:flex; justify-content:center; gap:10px; margin-top:20px; }
  .btn-guardar  { background:#17a2b8; border:1px solid #17a2b8; color:#fff !important; padding:8px 22px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:6px; }
  .btn-guardar:hover  { background:#138496; }
  .btn-limpiar  { background:#17a2b8; border:1px solid #17a2b8; color:#fff !important; padding:8px 22px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:6px; }
  .btn-limpiar:hover  { background:#138496; }
  .btn-regresar { background:#17a2b8; border:1px solid #17a2b8; color:#fff !important; padding:8px 22px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:6px; }
  .btn-regresar:hover { background:#138496; }

  /* MODAL */
  .modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:1000; display:flex; align-items:center; justify-content:center; }
  .modal-box { background:#fff; border-radius:6px; padding:24px; width:520px; max-width:95vw; box-shadow:0 4px 24px rgba(0,0,0,0.18); }
  .modal-title { font-size:15px; font-weight:bold; margin-bottom:14px; border-bottom:2px solid #17a2b8; padding-bottom:8px; }
  .modal-field { margin-bottom:9px; font-size:13px; }
  .modal-field strong { display:inline-block; min-width:100px; color:#555; }
  .modal-btns { display:flex; gap:8px; margin-top:14px; flex-wrap:wrap; }
  .btn-modal { background:#17a2b8; border:1px solid #17a2b8; color:#fff !important; padding:6px 16px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; }
  .btn-modal:hover { background:#138496; }
  .btn-modal-red  { background:#dc3545; border-color:#dc3545; }
  .btn-modal-red:hover  { background:#c82333; }
  .btn-modal-grey { background:#6c757d; border-color:#6c757d; }
  .btn-modal-grey:hover { background:#5a6268; }

  .alert-success { background:#d4edda; border:1px solid #c3e6cb; color:#155724 !important; padding:8px 14px; border-radius:4px; margin-bottom:10px; font-size:13px; display:inline-block; }
  .alert-danger  { background:#f8d7da; border:1px solid #f5c6cb; color:#721c24 !important; padding:8px 14px; border-radius:4px; margin-bottom:10px; font-size:13px; display:inline-block; }
`;

/* ============================================================
   SUB-COMPONENTE: IMAGEN
   ============================================================ */
const IMAGEN_INIT = { nombre:'', rubro:'', categoria:'', archivo:null, archivoNombre:'', nombreImagen:'' };
const IMAGENES_INICIALES = [
  { id:1, rubro:'Marketing', categoria:'Banners', nombre:'banner-principal', url:'/img/banner1.jpg', activo:true },
  { id:2, rubro:'Productos', categoria:'Electrónica', nombre:'laptop-hp',    url:'/img/laptop.jpg',  activo:true },
];

const ModuloImagen = ({ onRegresar }) => {
  const [vista, setVista]         = useState('lista');
  const [esNuevo, setEsNuevo]     = useState(true);
  const [imagenes, setImagenes]   = useState(IMAGENES_INICIALES);
  const [filtrados, setFiltrados] = useState(IMAGENES_INICIALES);
  const [radioSel, setRadioSel]   = useState('Nombre');
  const [busqueda, setBusqueda]   = useState('');
  const [form, setForm]           = useState(IMAGEN_INIT);
  const [preview, setPreview]     = useState(null);
  const [msg, setMsg]             = useState({tipo:'',texto:''});
  const fileRef = useRef(null);

  const showMsg = (tipo,texto) => { setMsg({tipo,texto}); setTimeout(()=>setMsg({tipo:'',texto:''}),2500); };
  const setF = (k,v) => setForm(p=>({...p,[k]:v}));

  const buscar = () => {
    const txt = busqueda.toLowerCase();
    if (!txt) { setFiltrados([...imagenes]); return; }
    setFiltrados(imagenes.filter(i => {
      if (radioSel==='Nombre')    return i.nombre.toLowerCase().includes(txt);
      if (radioSel==='Rubro')     return i.rubro.toLowerCase().includes(txt);
      if (radioSel==='Categoria') return i.categoria.toLowerCase().includes(txt);
      return true;
    }));
  };

  const abrirNuevo  = () => { setForm(IMAGEN_INIT); setPreview(null); setEsNuevo(true);  setVista('form'); };
  const abrirEditar = (img) => {
    setForm({ nombre:img.nombre, rubro:img.rubro, categoria:img.categoria,
      archivo:null, archivoNombre:'', nombreImagen:img.url, id:img.id });
    setPreview(null); setEsNuevo(false); setVista('form');
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setF('archivoNombre', f.name);
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(f);
  };

  const guardar = () => {
    if (!form.nombre) { showMsg('danger','El Nombre es obligatorio.'); return; }
    const nueva = { id: form.id||Date.now(), nombre:form.nombre, rubro:form.rubro,
      categoria:form.categoria, url: form.nombreImagen||form.archivoNombre||'/img/nueva.jpg', activo:true };
    if (esNuevo) {
      const nd=[...imagenes,nueva]; setImagenes(nd); setFiltrados(nd);
      showMsg('success','Imagen registrada correctamente.');
    } else {
      const nd=imagenes.map(i=>i.id===nueva.id?nueva:i); setImagenes(nd); setFiltrados(nd);
      showMsg('success','Imagen actualizada correctamente.');
    }
    setVista('lista');
  };

  const eliminar = (id) => {
    if (!window.confirm('¿Eliminar esta imagen?')) return;
    const nd=imagenes.filter(i=>i.id!==id); setImagenes(nd); setFiltrados(nd);
  };

  if (vista==='form') return (
    <div className="page-container">
      <div className="form-title">IMAGEN : {esNuevo?'NUEVO':'EDITAR'}</div>
      <hr className="sep"/>
      {msg.texto && <div className={msg.tipo==='success'?'alert-success':'alert-danger'}>{msg.tipo==='success'?'✅':'⚠️'} {msg.texto}</div>}

      {/* Fila: Nombre | Rubro | Categoria */}
      <div className="form-row-3">
        <div className="fg-img">
          <label>Nombre(*)</label>
          <input type="text" value={form.nombre} onChange={e=>setF('nombre',e.target.value)}/>
        </div>
        <div className="fg-img">
          <label>Rubro</label>
          <input type="text" value={form.rubro} onChange={e=>setF('rubro',e.target.value)}/>
        </div>
        <div className="fg-img">
          <label>Categoria</label>
          <input type="text" value={form.categoria} onChange={e=>setF('categoria',e.target.value)}/>
        </div>
      </div>

      {/* Fila: Imagen file | Nombre del imagen */}
      <div className="form-row-img">
        <div className="fg-img" style={{minWidth:260}}>
          <label>Imagen (jpg/gif/png)<span className="img-hint">600px</span></label>
          <input ref={fileRef} type="file" accept=".jpg,.jpeg,.gif,.png"
            onChange={handleFile} style={{fontSize:13}}/>
          <input type="text" placeholder="optimizar(1-100%)" style={{marginTop:4,width:180,fontSize:12,color:'#adb5bd'}}/>
          {preview && <img src={preview} alt="preview" className="img-preview"/>}
        </div>
        <div className="fg-img" style={{flex:1,minWidth:200}}>
          <label>Nombre del imagen</label>
          <textarea value={form.nombreImagen} onChange={e=>setF('nombreImagen',e.target.value)}
            rows={3} style={{padding:'6px 10px',border:'1px solid #ced4da',borderRadius:4,fontSize:13,resize:'vertical'}}/>
        </div>
      </div>

      <hr className="sep"/>
      <div className="btns-row">
        <button className="btn-guardar"  onClick={guardar}>💾 Guardar</button>
        <button className="btn-regresar" onClick={()=>setVista('lista')}>↩ Regresar</button>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <div className="page-title">
        <span style={{background:'#17a2b8',color:'#fff',borderRadius:'50%',width:22,height:22,
          display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:'bold'}}>?</span>
        IMAGEN
      </div>
      {msg.texto && <div className={msg.tipo==='success'?'alert-success':'alert-danger'}>{msg.tipo==='success'?'✅':'⚠️'} {msg.texto}</div>}

      {/* Filtros */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,marginBottom:18,flexWrap:'wrap'}}>
        <span className="filtro-label">BUSCAR X</span>
        <div className="radio-group-inline">
          {['Nombre','Rubro','Categoria'].map(o=>(
            <label key={o}><input type="radio" name="imgbx" value={o}
              checked={radioSel===o} onChange={()=>setRadioSel(o)}/> {o}</label>
          ))}
        </div>
        <input type="text" placeholder="Ingrese el texto a buscar" value={busqueda}
          onChange={e=>setBusqueda(e.target.value)} onKeyDown={e=>e.key==='Enter'&&buscar()}
          style={{width:280,padding:'7px 12px',border:'1px solid #ced4da',borderRadius:4,fontSize:13}}/>
        <button className="botonBuscar"  onClick={buscar}>🔍 Buscar</button>
        <button className="botonAgregar" onClick={abrirNuevo}>+ Agregar Nuevo</button>
      </div>

      <div className="tabla-titulo">LISTADO GENERAL</div>
      <table>
        <thead>
          <tr>
            <th>RUBRO</th>
            <th>CATEGORIA</th>
            <th>NOMBRE</th>
            <th>URL</th>
            <th width="8%">ACT.</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.length===0 ? (
            <tr><td colSpan="5" className="empty-msg">No hay imágenes registradas.</td></tr>
          ) : filtrados.map(img=>(
            <tr key={img.id}>
              <td>{img.rubro}</td>
              <td>{img.categoria}</td>
              <td>{img.nombre}</td>
              <td style={{fontSize:12,color:'#666'}}>{img.url}</td>
              <td align="center">
                <span className={img.activo?'badge-act':'badge-ina'}>{img.activo?'Activo':'Inactivo'}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="btns-row" style={{justifyContent:'flex-start',marginTop:16}}>
        <button className="btn-regresar" onClick={onRegresar}>↩ Regresar a Tareas</button>
      </div>
    </div>
  );
};

/* ============================================================
   COMPONENTE PRINCIPAL: TAREAS
   ============================================================ */
const CalIcon = () => (
  <svg width="22" height="22" viewBox="0 0 36 36" fill="none">
    <rect x="1" y="4" width="34" height="30" rx="3" fill="#fff" stroke="#bbb" strokeWidth="1.5"/>
    <rect x="1" y="4" width="34" height="9"  rx="3" fill="#e74c3c"/>
    <rect x="1" y="9" width="34" height="4"  fill="#e74c3c"/>
    <rect x="10" y="1" width="3" height="7" rx="1.5" fill="#888"/>
    <rect x="23" y="1" width="3" height="7" rx="1.5" fill="#888"/>
    <line x1="1"  y1="18" x2="35" y2="18" stroke="#ddd" strokeWidth="0.8"/>
    <line x1="1"  y1="24" x2="35" y2="24" stroke="#ddd" strokeWidth="0.8"/>
    <line x1="10" y1="13" x2="10" y2="34" stroke="#ddd" strokeWidth="0.8"/>
    <line x1="19" y1="13" x2="19" y2="34" stroke="#ddd" strokeWidth="0.8"/>
    <line x1="28" y1="13" x2="28" y2="34" stroke="#ddd" strokeWidth="0.8"/>
    {[14,19,25].map(y=>[3,12,21,30].map(x=>(
      <rect key={`${x}-${y}`} x={x} y={y} width={x===30?4:5} height="3" rx="0.5" fill="#27ae60"/>
    )))}
  </svg>
);

const DatePicker = ({ value, onChange }) => {
  const ref = useRef(null);
  const fmt = iso => { if (!iso) return ''; const [y,m,d]=iso.split('-'); return `${d}/${m}/${y}`; };
  const open = () => { try { ref.current?.showPicker(); } catch { ref.current?.click(); } };
  return (
    <div className="date-group">
      <span className="date-text" onClick={open}>
        {fmt(value)||<span style={{color:'#adb5bd'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>}
      </span>
      <input ref={ref} type="date" value={value} onChange={e=>onChange(e.target.value)} tabIndex={-1}/>
      <button type="button" className="cal-btn" onClick={open}><CalIcon/></button>
    </div>
  );
};

const USUARIOS    = ['','fac-tura.com','Iturri, Quispe, Smith','Merino, Cahuna, Wilver Enmanuel','Romero, Merino, Alexander Renson','Yupanqui, Barboza, Raysa'];
const IMPORTANCIA = ['Normal','Intermedio','Alto'];
const ESTADOS     = ['Abierto','En Proceso','Cerrado'];
const ENCUESTAS   = ['','Encuesta satisfacción cliente','Evaluación de servicio','Seguimiento comercial'];

const DATOS_INICIALES = [
  { id:1, fecha:'15/03/2026(17:43)', fechaRaw:'2026-03-15', hora:'17:43',
    tipoDE:'Usuario', de:'Iturri, Quispe, Smith', deOtro:'',
    para:'Iturri, Quispe, Smith', importancia:'Normal',
    motivo:'asegurar todo el sistema de facturacion',
    encuesta:'', detalle:'Revisar módulos de venta, compra y reportes.', estado:'Abierto' },
];

const nowStr = () => {
  const d = new Date();
  return { fechaRaw: d.toISOString().slice(0,10),
    hora: `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}` };
};
const FORM_INIT = { tipoDE:'Usuario', de:'', deOtro:'', para:'', importancia:'Normal',
  ...nowStr(), motivo:'', encuesta:'', detalle:'', estado:'Abierto' };

const fmtFecha = (r,h) => { if (!r) return ''; const [y,m,d]=r.split('-'); return `${d}/${m}/${y}(${h})`; };

const getDot = (e) => {
  if (e==='Abierto') return <span className="dot-abierto">⬤</span>;
  if (e==='Cerrado') return <span className="dot-cerrado">⬤</span>;
  return <span className="dot-proceso">⬤</span>;
};

const Tareas = () => {
  const [vista, setVista]         = useState('lista'); // 'lista' | 'form' | 'imagen'
  const [esNuevo, setEsNuevo]     = useState(true);
  const [datos, setDatos]         = useState(DATOS_INICIALES);
  const [filtrados, setFiltrados] = useState(DATOS_INICIALES);
  const [busqueda, setBusqueda]   = useState('');
  const [form, setForm]           = useState(FORM_INIT);
  const [modal, setModal]         = useState(null);
  const [msg, setMsg]             = useState({tipo:'',texto:''});

  const showMsg = (tipo,texto) => { setMsg({tipo,texto}); setTimeout(()=>setMsg({tipo:'',texto:''}),2500); };
  const setF = (k,v) => setForm(p=>({...p,[k]:v}));

  const buscar = () => {
    const txt = busqueda.toLowerCase();
    setFiltrados(txt ? datos.filter(d=>
      d.motivo.toLowerCase().includes(txt)||d.de.toLowerCase().includes(txt)||d.para.toLowerCase().includes(txt)
    ) : [...datos]);
  };

  const abrirNuevo  = () => { setForm(FORM_INIT); setEsNuevo(true);  setVista('form'); };
  const abrirEditar = (d) => { setForm({...d}); setEsNuevo(false); setVista('form'); };

  const guardar = () => {
    const deVal = form.tipoDE==='Usuario' ? form.de : form.deOtro;
    if (!form.fechaRaw||!deVal||!form.para||!form.motivo) {
      showMsg('danger','Complete todos los campos obligatorios.'); return;
    }
    const nuevo = { ...form, id:form.id||Date.now(), fecha:fmtFecha(form.fechaRaw,form.hora), de:deVal };
    if (esNuevo) {
      const nd=[...datos,nuevo]; setDatos(nd); setFiltrados(nd);
      showMsg('success','Tarea registrada correctamente.');
    } else {
      const nd=datos.map(d=>d.id===nuevo.id?nuevo:d); setDatos(nd); setFiltrados(nd);
      showMsg('success','Tarea actualizada correctamente.');
    }
    setVista('lista');
  };

  const eliminar = (id) => {
    if (!window.confirm('¿Eliminar esta tarea?')) return;
    const nd=datos.filter(d=>d.id!==id); setDatos(nd); setFiltrados(nd);
    showMsg('success','Tarea eliminada.');
  };

  /* ---- IMAGEN sub-módulo ---- */
  if (vista==='imagen') return (
    <><style>{styles}</style>
      <ModuloImagen onRegresar={()=>setVista('form')}/>
    </>
  );

  /* ---- LISTA ---- */
  if (vista==='lista') return (
    <><style>{styles}</style>
      <div className="page-container">
        <div className="page-title">
          <span style={{background:'#17a2b8',color:'#fff',borderRadius:'50%',width:22,height:22,
            display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:'bold'}}>?</span>
          TAREAS
        </div>
        {msg.texto && <div style={{textAlign:'center'}}><div className={msg.tipo==='success'?'alert-success':'alert-danger'}>{msg.tipo==='success'?'✅':'⚠️'} {msg.texto}</div></div>}
        <div className="filtro-row">
          <input type="text" placeholder="Ingrese nombre a buscar" value={busqueda}
            onChange={e=>setBusqueda(e.target.value)} onKeyDown={e=>e.key==='Enter'&&buscar()}/>
          <button className="botonBuscar"  onClick={buscar}>🔍 Buscar</button>
          <button className="botonAgregar" onClick={abrirNuevo}>+ Agregar Nuevo</button>
        </div>
        <div className="tabla-titulo">LISTADO GENERAL DE TAREAS</div>
        <table>
          <thead>
            <tr>
              <th width="14%">FECHA</th><th width="17%">DE</th><th width="15%">PARA</th>
              <th>MOTIVO</th><th width="10%">ESTADO</th><th width="5%"></th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length===0
              ? <tr><td colSpan="6" className="empty-msg">No hay tareas registradas.</td></tr>
              : filtrados.map(d=>(
                <tr key={d.id}>
                  <td align="center">{d.fecha}</td>
                  <td>(Usu){d.de}</td>
                  <td align="center">{d.para}</td>
                  <td>{d.motivo}</td>
                  <td><div className="estado-cell">{getDot(d.estado)} {d.estado}</div></td>
                  <td align="center">
                    <button className="btn-ver" title="Ver detalle" onClick={()=>setModal(d)}>
                      <svg width="18" height="13" viewBox="0 0 22 15" fill="none">
                        <path d="M11 1C6 1 2 7.5 2 7.5S6 14 11 14s9-6.5 9-6.5S16 1 11 1z" stroke="#17a2b8" strokeWidth="1.6" fill="none"/>
                        <circle cx="11" cy="7.5" r="3" fill="#17a2b8"/>
                        <line x1="3" y1="13" x2="19" y2="2" stroke="#17a2b8" strokeWidth="1.5"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {modal && (
          <div className="modal-backdrop" onClick={()=>setModal(null)}>
            <div className="modal-box" onClick={e=>e.stopPropagation()}>
              <div className="modal-title">📋 DETALLE DE TAREA</div>
              <div className="modal-field"><strong>Fecha:</strong> {modal.fecha}</div>
              <div className="modal-field"><strong>De:</strong> {modal.de}</div>
              <div className="modal-field"><strong>Para:</strong> {modal.para}</div>
              <div className="modal-field"><strong>Importancia:</strong> {modal.importancia}</div>
              <div className="modal-field"><strong>Motivo:</strong> {modal.motivo}</div>
              <div className="modal-field"><strong>Detalle:</strong> {modal.detalle}</div>
              <div className="modal-field"><strong>Estado:</strong> <span style={{marginLeft:4}}>{getDot(modal.estado)} {modal.estado}</span></div>
              <div className="modal-btns">
                <button className="btn-modal" onClick={()=>{abrirEditar(modal);setModal(null);}}>✏️ Editar</button>
                <button className="btn-modal btn-modal-red" onClick={()=>{eliminar(modal.id);setModal(null);}}>🗑️ Eliminar</button>
                <button className="btn-modal btn-modal-grey" onClick={()=>setModal(null)}>✖ Cerrar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );

  /* ---- FORMULARIO ---- */
  return (
    <><style>{styles}</style>
      <div className="page-container">
        <div className="form-title form-title-center">AGREGAR NUEVO TAREA</div>
        <hr className="sep"/>
        {msg.texto && <div className={msg.tipo==='success'?'alert-success':'alert-danger'}>{msg.tipo==='success'?'✅':'⚠️'} {msg.texto}</div>}

        <div className="fila-top">
          {/* De */}
          <div className="fg fg-de">
            <div className="radio-inline">
              <b>De</b>
              <label><input type="radio" name="tipoDE" value="Usuario"
                checked={form.tipoDE==='Usuario'} onChange={()=>setF('tipoDE','Usuario')}/> Usuario</label>
              <label><input type="radio" name="tipoDE" value="Otros"
                checked={form.tipoDE==='Otros'} onChange={()=>setF('tipoDE','Otros')}/> Otros</label>
            </div>
            {form.tipoDE==='Usuario'
              ? <select value={form.de} onChange={e=>setF('de',e.target.value)} style={{width:'100%'}}>
                  {USUARIOS.map(u=><option key={u} value={u}>{u}</option>)}
                </select>
              : <input type="text" placeholder="Nombre" value={form.deOtro}
                  onChange={e=>setF('deOtro',e.target.value)} style={{width:'100%'}}/>
            }
          </div>
          {/* Para */}
          <div className="fg fg-para">
            <label><b>Para</b></label>
            <select value={form.para} onChange={e=>setF('para',e.target.value)} style={{width:'100%'}}>
              {USUARIOS.map(u=><option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          {/* Importancia */}
          <div className="fg fg-imp">
            <label>Importancia</label>
            <select value={form.importancia} onChange={e=>setF('importancia',e.target.value)}>
              {IMPORTANCIA.map(i=><option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          {/* Fecha */}
          <div className="fg fg-fecha">
            <label>Fecha</label>
            <DatePicker value={form.fechaRaw} onChange={v=>setF('fechaRaw',v)}/>
          </div>
          {/* Hora */}
          <div className="fg fg-hora">
            <label>Hora</label>
            <input type="time" value={form.hora} onChange={e=>setF('hora',e.target.value)}
              style={{width:'100%',padding:'6px 8px',border:'1px solid #ced4da',borderRadius:4,fontSize:13}}/>
          </div>
        </div>

        {/* Motivo + Encuesta */}
        <div className="fila-mid">
          <div className="fg-motivo">
            <label>Motivo</label>
            <input type="text" value={form.motivo} onChange={e=>setF('motivo',e.target.value)}/>
          </div>
          <div className="fg-encuesta">
            <label>Encuesta/Calificar</label>
            <select value={form.encuesta} onChange={e=>setF('encuesta',e.target.value)}>
              {ENCUESTAS.map(e=><option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>

        {/* Detalle con ícono imagen */}
        <div className="fg-detalle">
          <label>
            Detalle
            <button type="button" className="btn-imagen-ico" title="Gestionar imágenes"
              onClick={()=>setVista('imagen')}>🖼️</button>
          </label>
          <textarea value={form.detalle} onChange={e=>setF('detalle',e.target.value)} rows={6}/>
        </div>

        <div className="btns-row">
          <button className="btn-guardar"  onClick={guardar}>💾 Guardar</button>
          <button className="btn-regresar" onClick={()=>setVista('lista')}>↩ Regresar</button>
        </div>
      </div>
    </>
  );
};

export default Tareas;