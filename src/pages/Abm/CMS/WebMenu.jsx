import React, { useState } from 'react';

const styles = `
  .page-container { padding:20px; font-family:Arial,Helvetica,sans-serif; font-size:13px; }
  .page-container * { color:#212529; box-sizing:border-box; }
  .page-title { font-size:18px; font-weight:bold; border-bottom:2px solid #00A3E1; padding-bottom:5px; margin-bottom:15px; color:#333; }

  .buscar-section { display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:15px; }
  .buscar-section select, .buscar-section input[type="text"] { padding:5px 8px; border:1px solid #ced4da; border-radius:4px; font-size:13px; background:#fff; color:#212529; }
  .buscar-section input[type="text"] { width:220px; }

  .botonNuevo { background-color:#17a2b8; border:1px solid #17a2b8; color:#fff !important; padding:6px 14px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:5px; transition:background-color 0.2s; }
  .botonNuevo:hover { background-color:#138496; }
  .botonVerde { background-color:#28a745; border:1px solid #28a745; color:#fff !important; padding:6px 14px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:5px; }
  .botonVerde:hover { background-color:#218838; }
  .btn-cancel { background-color:#6c757d; border:1px solid #6c757d; color:#fff !important; padding:6px 16px; border-radius:4px; cursor:pointer; font-size:13px; font-weight:bold; }
  .btn-cancel:hover { background-color:#5a6268; }

  .paginacion { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; font-size:13px; }
  .tabla-titulo { text-align:center; font-weight:bold; font-size:14px; margin-bottom:8px; }

  table { width:100%; border-collapse:collapse; font-size:13px; }
  table thead tr { background-color:#17a2b8; }
  table thead th { padding:10px 8px; text-align:left; font-weight:bold; color:#fff !important; }
  table tbody tr { background-color:#fff; border-bottom:1px solid #dee2e6; }
  table tbody tr:hover { background-color:#f8f9fa; }
  table tbody td { padding:8px; color:#212529; }
  .empty-msg { text-align:center; color:#888; padding:30px; font-size:13px; }

  .acciones { display:flex; gap:6px; justify-content:center; }
  .btn-accion { background:none; border:none; cursor:pointer; font-size:16px; padding:2px 5px; border-radius:3px; transition:background 0.15s; }
  .btn-accion:hover { background-color:#e0e0e0; }

  .badge-si { background:#28a745; color:#fff !important; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:bold; cursor:pointer; }
  .badge-no { background:#6c757d; color:#fff !important; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:bold; cursor:pointer; }

  .exportar-section { display:flex; gap:18px; justify-content:flex-end; margin-top:10px; font-size:20px; }
  .exportar-btn { display:flex; flex-direction:column; align-items:center; gap:2px; cursor:pointer; transition:transform 0.15s; background:none; border:none; padding:0; }
  .exportar-btn:hover { transform:scale(1.15); }
  .exportar-label { font-size:10px; font-weight:bold; }

  .alert-success { background:#d4edda; border:1px solid #c3e6cb; color:#155724 !important; padding:8px 14px; border-radius:4px; margin-bottom:10px; font-size:13px; display:inline-block; }
  .alert-danger  { background:#f8d7da; border:1px solid #f5c6cb; color:#721c24 !important; padding:8px 14px; border-radius:4px; margin-bottom:10px; font-size:13px; display:inline-block; }

  /* MODAL */
  .modal-backdrop { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:2000; }
  .modal-box { background:#fff; border-radius:8px; padding:24px 28px; min-width:460px; max-width:580px; width:100%; box-shadow:0 8px 32px rgba(0,0,0,0.22); max-height:90vh; overflow-y:auto; }
  .modal-title { font-size:15px; font-weight:bold; color:#212529; margin-bottom:16px; border-bottom:2px solid #00A3E1; padding-bottom:6px; }
  .modal-field { margin-bottom:12px; }
  .modal-field label { display:block; font-weight:bold; margin-bottom:4px; font-size:13px; color:#212529; }
  .modal-field input[type="text"],
  .modal-field input[type="number"],
  .modal-field select,
  .modal-field textarea { width:100%; padding:6px 8px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; box-sizing:border-box; }
  .modal-field input::placeholder, .modal-field textarea::placeholder { color:#adb5bd; }
  .modal-field input:focus, .modal-field select:focus, .modal-field textarea:focus { border-color:#80bdff; outline:none; box-shadow:0 0 0 0.2rem rgba(0,123,255,0.25); }
  .modal-field textarea { height:80px; resize:vertical; }
  .modal-actions { display:flex; gap:8px; justify-content:flex-end; margin-top:16px; }
  .modal-row { display:flex; gap:12px; }
  .modal-row .modal-field { flex:1; }
  .requerido { color:#dc3545; }
  .form-section { font-weight:bold; font-size:12px; background:#f8f9fa; border:1px solid #dee2e6; padding:5px 10px; border-radius:4px; margin:14px 0 10px 0; color:#17a2b8 !important; }
`;

const UBICACIONES = ['Superior','Inferior','Otros1','Otros2','Otros3','Otros4'];
const CON_OPTS    = ['','Contactenos','Metodos de Pago'];

const FORM_INICIAL = {
  ubicacion:'Superior', titulo:'', title:'', orden:'', mostrar:'Si',
  establecer:'Personalizado', con:'', ico:'', link:'', php:'', detalle:''
};

const MENUS_INICIALES = [
  { id:1, ubicacion:'Superior', titulo:'Inicio',    title:'Página principal', orden:1, mostrar:'Si', establecer:'Personalizado', con:'', ico:'icon-home',  link:'/',          php:'index.php',    detalle:'' },
  { id:2, ubicacion:'Superior', titulo:'Nosotros',  title:'Quiénes somos',   orden:2, mostrar:'Si', establecer:'Personalizado', con:'', ico:'icon-info',  link:'/nosotros',  php:'nosotros.php', detalle:'' },
  { id:3, ubicacion:'Superior', titulo:'Productos', title:'Catálogo',        orden:3, mostrar:'Si', establecer:'Personalizado', con:'', ico:'icon-box',   link:'/productos', php:'productos.php',detalle:'' },
  { id:4, ubicacion:'Inferior', titulo:'Contacto',  title:'Contáctenos',     orden:1, mostrar:'Si', establecer:'Establecer',    con:'Contactenos', ico:'', link:'/contacto',  php:'contacto.php', detalle:'' },
  { id:5, ubicacion:'Inferior', titulo:'Pagos',     title:'Métodos de Pago', orden:2, mostrar:'No', establecer:'Establecer',    con:'Metodos de Pago', ico:'', link:'/pagos', php:'pagos.php',   detalle:'' },
];

const WebMenu = () => {
  const [menus, setMenus]                   = useState(MENUS_INICIALES);
  const [tipoBusqueda, setTipoBusqueda]     = useState('1');
  const [textoBusqueda, setTextoBusqueda]   = useState('');
  const [filtroUbicacion, setFiltroUbicacion] = useState('');
  const [filtroMostrar, setFiltroMostrar]   = useState('');
  const [msg, setMsg]     = useState({ tipo:'', texto:'' });
  const [modal, setModal] = useState(null);
  const [form, setForm]   = useState(FORM_INICIAL);

  const showMsg = (tipo, texto) => { setMsg({tipo,texto}); setTimeout(()=>setMsg({tipo:'',texto:''}),2500); };
  const f = (key, val) => setForm(prev => ({...prev, [key]: val}));

  const menusFiltrados = menus.filter(m => {
    if (filtroUbicacion && m.ubicacion !== filtroUbicacion) return false;
    if (filtroMostrar   && m.mostrar   !== filtroMostrar)   return false;
    if (!textoBusqueda) return true;
    if (tipoBusqueda==='1') return m.titulo.toLowerCase().includes(textoBusqueda.toLowerCase());
    if (tipoBusqueda==='2') return m.link.toLowerCase().includes(textoBusqueda.toLowerCase());
    if (tipoBusqueda==='3') return m.ubicacion.toLowerCase().includes(textoBusqueda.toLowerCase());
    if (tipoBusqueda==='4') return m.php.toLowerCase().includes(textoBusqueda.toLowerCase());
    return true;
  });

  const abrirNuevo  = () => { setForm(FORM_INICIAL); setModal('nuevo'); };
  const abrirEditar = (m) => { setForm({...m}); setModal('editar'); };

  const guardar = () => {
    if (!form.titulo) return showMsg('danger', 'El Título es obligatorio.');
    if (!form.orden)  return showMsg('danger', 'El Orden es obligatorio.');
    if (modal === 'nuevo') {
      setMenus(prev => [...prev, { ...form, id: Date.now() }]);
      showMsg('success', 'Ítem de menú agregado correctamente.');
    } else {
      setMenus(prev => prev.map(m => m.id===form.id ? {...form} : m));
      showMsg('success', 'Ítem de menú actualizado correctamente.');
    }
    setModal(null);
  };

  const limpiar = () => setForm(FORM_INICIAL);

  const eliminar = (id) => {
    if (window.confirm('¿Eliminar este ítem de menú?')) {
      setMenus(prev => prev.filter(m => m.id!==id));
      showMsg('success', 'Ítem eliminado.');
    }
  };

  const toggleMostrar = (id) => {
    setMenus(prev => prev.map(m => m.id===id ? {...m, mostrar: m.mostrar==='Si'?'No':'Si'} : m));
  };

  // ---- EXPORTAR ----
  const handleImprimir = () => {
    const filas = menusFiltrados.map((m,i) => `
      <tr><td>${i+1}</td><td>${m.ubicacion}</td><td>${m.titulo}</td><td>${m.orden}</td>
      <td>${m.link}</td><td>${m.php}</td><td>${m.mostrar}</td></tr>`).join('');
    const win = window.open('','_blank');
    win.document.write(`<html><head><title>Web Menu</title>
      <style>body{font-family:Arial,sans-serif;font-size:12px;}h2{color:#17a2b8;border-bottom:2px solid #17a2b8;padding-bottom:5px;}
      table{border-collapse:collapse;width:100%;}th{background:#17a2b8;color:#fff;padding:8px;text-align:left;}
      td{padding:6px 8px;border-bottom:1px solid #dee2e6;}tr:nth-child(even){background:#f8f9fa;}</style></head>
      <body><h2>🌐 LISTADO GENERAL WEB MENU</h2>
      <table><thead><tr><th>Nro</th><th>Ubicación</th><th>Título</th><th>Orden</th><th>URL</th><th>PHP</th><th>Mostrar</th></tr></thead>
      <tbody>${filas}</tbody></table>
      <p style="font-size:11px;color:#888;margin-top:12px;">Total: ${menusFiltrados.length} registro(s)</p>
      </body></html>`);
    win.document.close(); win.print();
  };

  const handleExcel = () => {
    const enc = ['Nro','Ubicación','Título','Title','Orden','URL','PHP','Mostrar','Establecer','Con','Class'];
    const filas = menusFiltrados.map((m,i) =>
      [i+1, m.ubicacion, `"${m.titulo}"`, `"${m.title}"`, m.orden, m.link, m.php, m.mostrar, m.establecer, m.con, m.ico].join(',')
    );
    const csv = [enc.join(','), ...filas].join('\n');
    const blob = new Blob(['\uFEFF'+csv], {type:'text/csv;charset=utf-8;'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='web_menu.csv'; a.click();
    URL.revokeObjectURL(a.href);
    showMsg('success','Archivo Excel descargado correctamente.');
  };

  const handleWord = () => {
    const filas = menusFiltrados.map((m,i) => `
      <tr><td>${i+1}</td><td>${m.ubicacion}</td><td>${m.titulo}</td><td>${m.orden}</td>
      <td>${m.link}</td><td>${m.php}</td><td>${m.mostrar}</td></tr>`).join('');
    const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
      <head><meta charset='utf-8'><title>Web Menu</title>
      <style>body{font-family:Arial,sans-serif;font-size:12pt;}h2{color:#17a2b8;}
      table{width:100%;border-collapse:collapse;}th{background:#17a2b8;color:white;padding:6px;border:1px solid #ccc;}
      td{padding:5px 6px;border:1px solid #ccc;}</style></head>
      <body><h2>LISTADO GENERAL WEB MENU</h2>
      <table><thead><tr><th>Nro</th><th>Ubicación</th><th>Título</th><th>Orden</th><th>URL</th><th>PHP</th><th>Mostrar</th></tr></thead>
      <tbody>${filas}</tbody></table>
      <p>Total: ${menusFiltrados.length} registro(s)</p></body></html>`;
    const blob = new Blob([html], {type:'application/msword'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='web_menu.doc'; a.click();
    URL.revokeObjectURL(a.href);
    showMsg('success','Archivo Word descargado correctamente.');
  };

  return (
    <>
      <style>{styles}</style>
      <div className="page-container">

        <div className="page-title">🌐 WEB MENU</div>

        {msg.texto && (
          <div className={msg.tipo==='success'?'alert-success':'alert-danger'}>
            {msg.tipo==='success'?'✅':'⚠️'} {msg.texto}
          </div>
        )}

        {/* BUSCAR */}
        <div className="buscar-section">
          <b>BUSCAR X</b>
          <select value={tipoBusqueda} onChange={e=>setTipoBusqueda(e.target.value)}>
            <option value="1">Título</option>
            <option value="2">URL</option>
            <option value="3">Ubicación</option>
            <option value="4">PHP</option>
          </select>
          <select value={filtroUbicacion} onChange={e=>setFiltroUbicacion(e.target.value)}>
            <option value="">Todas las ubicaciones</option>
            {UBICACIONES.map(u=><option key={u} value={u}>{u}</option>)}
          </select>
          <select value={filtroMostrar} onChange={e=>setFiltroMostrar(e.target.value)}>
            <option value="">Mostrar: todos</option>
            <option value="Si">Visible</option>
            <option value="No">Oculto</option>
          </select>
          <input
            type="text"
            placeholder="Ingrese el texto a buscar"
            value={textoBusqueda}
            onChange={e=>setTextoBusqueda(e.target.value)}
          />
          <button className="botonNuevo">⚙ Buscar</button>
          <button className="botonVerde" onClick={abrirNuevo}>✚ Agregar Nuevo</button>
        </div>

        {/* PAGINACIÓN */}
        <div className="paginacion">
          <b>Página 1 de {Math.ceil(menusFiltrados.length/10)||0}</b>
          <span style={{fontSize:12,color:'#888'}}>{menusFiltrados.length} registro(s)</span>
        </div>

        {/* TABLA */}
        <div className="tabla-titulo">LISTADO GENERAL WEB MENU</div>
        <table>
          <thead>
            <tr>
              <th width="4%" align="center">Nro</th>
              <th width="11%">Ubicación</th>
              <th>Título</th>
              <th width="6%" align="center">Orden</th>
              <th width="18%">URL / PHP</th>
              <th width="11%">Contenido</th>
              <th width="9%" align="center">Mostrar</th>
              <th width="9%" align="center">Opciones</th>
            </tr>
          </thead>
          <tbody>
            {menusFiltrados.length===0 ? (
              <tr><td colSpan="8" className="empty-msg">No hay ítems de menú registrados.</td></tr>
            ) : (
              menusFiltrados.map((m,i) => (
                <tr key={m.id}>
                  <td align="center">{i+1}</td>
                  <td>
                    <span style={{background:'#17a2b8',color:'#fff',padding:'2px 7px',borderRadius:10,fontSize:11}}>{m.ubicacion}</span>
                  </td>
                  <td>
                    <b>{m.titulo}</b>
                    {m.title && <div style={{fontSize:11,color:'#888'}}>{m.title}</div>}
                    {m.ico   && <div style={{fontSize:11,color:'#aaa'}}>Class: {m.ico}</div>}
                  </td>
                  <td align="center"><b>{m.orden}</b></td>
                  <td style={{fontSize:12}}>
                    {m.link && <div style={{color:'#007bff'}}>🔗 {m.link}</div>}
                    {m.php  && <div style={{color:'#6c757d'}}>📄 {m.php}</div>}
                  </td>
                  <td style={{fontSize:12}}>
                    {m.establecer==='Establecer'
                      ? <span style={{color:'#17a2b8'}}>{m.con||'—'}</span>
                      : <span style={{color:'#888'}}>Personalizado</span>}
                  </td>
                  <td align="center">
                    <span
                      className={m.mostrar==='Si'?'badge-si':'badge-no'}
                      title="Click para cambiar visibilidad"
                      onClick={()=>toggleMostrar(m.id)}
                    >
                      {m.mostrar==='Si'?'Visible':'Oculto'}
                    </span>
                  </td>
                  <td>
                    <div className="acciones">
                      <button className="btn-accion" style={{color:'#17a2b8'}} title="Editar" onClick={()=>abrirEditar(m)}>✏️</button>
                      <button className="btn-accion" style={{color:'#dc3545'}} title="Eliminar" onClick={()=>eliminar(m.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* EXPORTAR */}
        <div className="exportar-section">
          <button className="exportar-btn" title="Imprimir" onClick={handleImprimir}>
            🖨️<span className="exportar-label" style={{color:'#555'}}>Imprimir</span>
          </button>
          <button className="exportar-btn" title="Exportar Excel" onClick={handleExcel}>
            📗<span className="exportar-label" style={{color:'#39B636'}}>Excel</span>
          </button>
          <button className="exportar-btn" title="Exportar Word" onClick={handleWord}>
            📘<span className="exportar-label" style={{color:'#3333CC'}}>Word</span>
          </button>
        </div>

        <hr style={{margin:'15px 0',borderColor:'#dee2e6'}} />
        <div style={{fontSize:12,paddingTop:6}}>
          <b>Leyenda: </b>
          <span style={{color:'#17a2b8'}}>✏️</span> Actualizar &nbsp;&nbsp;
          🗑️ Eliminar &nbsp;&nbsp;
          Badge verde/gris → click para cambiar visibilidad
        </div>
      </div>

      {/* ===== MODAL AGREGAR / EDITAR ===== */}
      {modal && (
        <div className="modal-backdrop" onClick={()=>setModal(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-title">
              {modal==='nuevo' ? '✚ Agregar Nuevo Web Menu' : '✏️ Editar Web Menu'}
            </div>

            {/* Ubicación + Orden */}
            <div className="modal-row">
              <div className="modal-field">
                <label>Ubicación <span className="requerido">(*)</span></label>
                <select value={form.ubicacion} onChange={e=>f('ubicacion',e.target.value)}>
                  {UBICACIONES.map(u=><option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div className="modal-field" style={{maxWidth:100}}>
                <label>Orden <span className="requerido">(*)</span></label>
                <input type="number" value={form.orden} onChange={e=>f('orden',e.target.value)} placeholder="Ej: 1" min="1" />
              </div>
            </div>

            {/* Titulo + Title */}
            <div className="modal-field">
              <label>Título <span className="requerido">(*)</span></label>
              <input type="text" value={form.titulo} onChange={e=>f('titulo',e.target.value)} placeholder="Texto visible del menú" />
            </div>
            <div className="modal-field">
              <label>Title (tooltip)</label>
              <input type="text" value={form.title} onChange={e=>f('title',e.target.value)} placeholder="Descripción alternativa (atributo title)" />
            </div>

            {/* Mostrar */}
            <div className="modal-row">
              <div className="modal-field">
                <label>Mostrar</label>
                <select value={form.mostrar} onChange={e=>f('mostrar',e.target.value)}>
                  <option value="Si">Si</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="modal-field">
                <label>Definir Contenido</label>
                <select value={form.establecer} onChange={e=>f('establecer',e.target.value)}>
                  <option value="Personalizado">Personalizado</option>
                  <option value="Establecer">Establecer</option>
                </select>
              </div>
            </div>

            {/* Con — solo visible si establecer = Establecer */}
            {form.establecer==='Establecer' && (
              <div className="modal-field">
                <label>Con</label>
                <select value={form.con} onChange={e=>f('con',e.target.value)}>
                  {CON_OPTS.map(o=><option key={o} value={o}>{o||'— Seleccione —'}</option>)}
                </select>
              </div>
            )}

            <div className="form-section">🔗 ENLACES Y ARCHIVOS</div>

            {/* Class + URL */}
            <div className="modal-row">
              <div className="modal-field">
                <label>Class (ícono CSS)</label>
                <input type="text" value={form.ico} onChange={e=>f('ico',e.target.value)} placeholder="Ej: icon-home" />
              </div>
              <div className="modal-field">
                <label>URL</label>
                <input type="text" value={form.link} onChange={e=>f('link',e.target.value)} placeholder="Ej: /inicio" />
              </div>
            </div>

            {/* Contenido PHP */}
            <div className="modal-field">
              <label>Contenido (.php, .html)</label>
              <input type="text" value={form.php} onChange={e=>f('php',e.target.value)} placeholder="Ej: index.php" />
            </div>

            <hr style={{borderColor:'#dee2e6',margin:'14px 0 10px'}} />

            <div className="modal-actions">
              <button className="btn-cancel" onClick={()=>setModal(null)}>✗ Cancelar</button>
              <button className="botonNuevo" style={{background:'#6c757d',border:'1px solid #6c757d'}} onClick={limpiar}>🔄 Limpiar</button>
              <button className="botonNuevo" onClick={guardar}>
                💾 {modal==='nuevo'?'Guardar':'Actualizar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WebMenu;
