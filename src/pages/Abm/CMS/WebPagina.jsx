import React, { useState } from 'react';

const styles = `
  .page-container { padding:20px; font-family:Arial,Helvetica,sans-serif; font-size:13px; }
  .page-container * { color:#212529; box-sizing:border-box; }
  .page-title { font-size:18px; font-weight:bold; border-bottom:2px solid #00A3E1; padding-bottom:5px; margin-bottom:15px; color:#333; display:flex; align-items:center; gap:8px; }

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
  table thead th { padding:10px 8px; text-align:center; font-weight:bold; color:#fff !important; }
  table tbody tr { background-color:#fff; border-bottom:1px solid #dee2e6; }
  table tbody tr:hover { background-color:#f8f9fa; }
  table tbody td { padding:8px; color:#212529; }
  .empty-msg { text-align:center; color:#888; padding:30px; font-size:13px; }

  .acciones { display:flex; gap:6px; justify-content:center; }
  .btn-accion { background:none; border:none; cursor:pointer; font-size:16px; padding:2px 5px; border-radius:3px; transition:background 0.15s; }
  .btn-accion:hover { background-color:#e0e0e0; }

  .exportar-section { display:flex; gap:18px; justify-content:flex-end; margin-top:10px; font-size:20px; }
  .exportar-btn { display:flex; flex-direction:column; align-items:center; gap:2px; cursor:pointer; transition:transform 0.15s; background:none; border:none; padding:0; }
  .exportar-btn:hover { transform:scale(1.15); }
  .exportar-label { font-size:10px; font-weight:bold; }

  .alert-success { background:#d4edda; border:1px solid #c3e6cb; color:#155724 !important; padding:8px 14px; border-radius:4px; margin-bottom:10px; font-size:13px; display:inline-block; }
  .alert-danger  { background:#f8d7da; border:1px solid #f5c6cb; color:#721c24 !important; padding:8px 14px; border-radius:4px; margin-bottom:10px; font-size:13px; display:inline-block; }

  /* FORMULARIO INLINE (estilo de la imagen) */
  .form-container { background:#fff; border:1px solid #dee2e6; border-radius:6px; padding:24px; margin-top:10px; }
  .form-container-title { text-align:center; font-size:16px; font-weight:bold; margin-bottom:20px; color:#212529; }
  .form-row { display:flex; gap:16px; flex-wrap:wrap; margin-bottom:14px; }
  .form-field { display:flex; flex-direction:column; gap:4px; }
  .form-field label { font-weight:bold; font-size:13px; color:#212529; }
  .form-field input[type="text"],
  .form-field input[type="number"],
  .form-field select,
  .form-field textarea { padding:6px 8px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; width:100%; }
  .form-field input:focus, .form-field select:focus, .form-field textarea:focus { border-color:#80bdff; outline:none; box-shadow:0 0 0 0.2rem rgba(0,123,255,0.25); }
  .form-field textarea { height:130px; resize:vertical; }
  .form-field.w-sm  { width:120px; }
  .form-field.w-md  { width:200px; }
  .form-field.w-lg  { width:320px; }
  .form-field.w-xl  { flex:1; min-width:200px; }
  .form-field.w-full { width:100%; }
  .form-actions { display:flex; gap:10px; justify-content:center; margin-top:20px; padding-top:16px; border-top:1px solid #dee2e6; }
  .requerido { color:#dc3545; }
  .img-preview-sm { width:60px; height:50px; object-fit:cover; border:1px solid #dee2e6; border-radius:4px; margin-top:4px; }
  .link-verweb { font-size:11px; color:#007bff; cursor:pointer; text-decoration:underline; }
`;

const MENUS_WEB    = ['Inicio','Nosotros','Productos','Servicios','Blog','Contacto','Otros'];
const POSICION_IMG = ['Ninguno','Izquierda','Derecha','Centro','Arriba','Abajo'];
const MOSTRAR_OPTS = ['Si','No'];

const FORM_INICIAL = {
  menu:'', titulo:'', subtitulo:'', autor:'', detalle:'',
  orden:'', imagen:null, imagenPreview:null, posicionimg:'Ninguno',
  mostrar:'Si', url:'', title:'', keyword:''
};

const PAGINAS_INICIALES = [
  { id:1, menu:'Inicio',   ubicacion:'Superior', titulo:'Bienvenidos',   orden:1, mostrar:'Si', subtitulo:'',        autor:'Admin',     detalle:'Contenido de inicio.',   imagen:null, imagenPreview:null, posicionimg:'Ninguno', url:'http://gkmtechnology.com/eagle/', title:'Página principal', keyword:'inicio, bienvenida' },
  { id:2, menu:'Nosotros', ubicacion:'Superior', titulo:'Quiénes Somos', orden:1, mostrar:'Si', subtitulo:'Historia',autor:'Marketing', detalle:'Información empresa.',   imagen:null, imagenPreview:null, posicionimg:'Derecha',  url:'http://gkmtechnology.com/eagle/nosotros', title:'Sobre nosotros', keyword:'empresa, historia' },
  { id:3, menu:'Productos', ubicacion:'Superior', titulo:'Catálogo',      orden:1, mostrar:'No', subtitulo:'',        autor:'Admin',     detalle:'Lista de productos.',    imagen:null, imagenPreview:null, posicionimg:'Ninguno', url:'http://gkmtechnology.com/eagle/productos', title:'Catálogo', keyword:'productos, precios' },
];

const WebPagina = () => {
  const [vista, setVista]               = useState('lista');
  const [paginas, setPaginas]           = useState(PAGINAS_INICIALES);
  const [tipoBusqueda, setTipoBusqueda] = useState('1');
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [filtroMenu, setFiltroMenu]     = useState('');
  const [msg, setMsg]                   = useState({ tipo:'', texto:'' });
  const [form, setForm]                 = useState(FORM_INICIAL);
  const [esNuevo, setEsNuevo]           = useState(true);

  const showMsg = (tipo, texto) => { setMsg({tipo,texto}); setTimeout(()=>setMsg({tipo:'',texto:''}),2500); };
  const f = (key, val) => setForm(prev => ({...prev, [key]: val}));

  const paginasFiltradas = paginas.filter(p => {
    if (filtroMenu && p.menu !== filtroMenu) return false;
    if (!textoBusqueda) return true;
    if (tipoBusqueda==='1') return p.titulo.toLowerCase().includes(textoBusqueda.toLowerCase());
    if (tipoBusqueda==='2') return p.menu.toLowerCase().includes(textoBusqueda.toLowerCase());
    if (tipoBusqueda==='3') return (p.autor||'').toLowerCase().includes(textoBusqueda.toLowerCase());
    if (tipoBusqueda==='4') return (p.keyword||'').toLowerCase().includes(textoBusqueda.toLowerCase());
    return true;
  });

  const abrirNuevo  = () => { setForm(FORM_INICIAL); setEsNuevo(true); setVista('form'); };
  const abrirEditar = (p) => { setForm({...p}); setEsNuevo(false); setVista('form'); };
  const limpiar     = () => setForm(FORM_INICIAL);

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setForm(prev => ({...prev, imagen: file.name, imagenPreview: url}));
    }
  };

  const guardar = () => {
    if (!form.titulo) return showMsg('danger', 'El Título es obligatorio.');
    if (!form.orden)  return showMsg('danger', 'El Orden es obligatorio.');
    if (esNuevo) {
      setPaginas(prev => [...prev, { ...form, id: Date.now(), ubicacion: 'Superior' }]);
      showMsg('success', 'Página web agregada correctamente.');
    } else {
      setPaginas(prev => prev.map(p => p.id===form.id ? {...form} : p));
      showMsg('success', 'Página web actualizada correctamente.');
    }
    setVista('lista');
  };

  const eliminar = (id) => {
    if (window.confirm('¿Eliminar esta página web?')) {
      setPaginas(prev => prev.filter(p => p.id!==id));
      showMsg('success', 'Página eliminada.');
      setVista('lista');
    }
  };

  // ---- EXPORTAR ----
  const handleImprimir = () => {
    const filas = paginasFiltradas.map((p,i) => `
      <tr><td>${i+1}</td><td>${p.menu||'—'}</td><td>${p.ubicacion||'—'}</td><td>${p.titulo}</td><td>${p.orden}</td><td>${p.mostrar}</td></tr>`).join('');
    const win = window.open('','_blank');
    win.document.write(`<html><head><title>Web Páginas</title>
      <style>body{font-family:Arial,sans-serif;font-size:12px;}h2{color:#17a2b8;border-bottom:2px solid #17a2b8;padding-bottom:5px;}
      table{border-collapse:collapse;width:100%;}th{background:#17a2b8;color:#fff;padding:8px;text-align:left;}
      td{padding:6px 8px;border-bottom:1px solid #dee2e6;}tr:nth-child(even){background:#f8f9fa;}</style></head>
      <body><h2>📄 LISTADO GENERAL WEB PÁGINAS</h2>
      <table><thead><tr><th>Nro</th><th>Menú</th><th>Ubicación</th><th>Título</th><th>Orden</th><th>Mostrar</th></tr></thead>
      <tbody>${filas}</tbody></table>
      <p style="font-size:11px;color:#888;margin-top:12px;">Total: ${paginasFiltradas.length} registro(s)</p>
      </body></html>`);
    win.document.close(); win.print();
  };

  const handleExcel = () => {
    const enc = ['Nro','Menú','Título','Sub.Título','Autor','Orden','URL','Mostrar','Title','Keyword'];
    const filas = paginasFiltradas.map((p,i) =>
      [i+1, p.menu, `"${p.titulo}"`, `"${p.subtitulo}"`, `"${p.autor}"`, p.orden, p.url, p.mostrar, `"${p.title}"`, `"${p.keyword}"`].join(',')
    );
    const csv = [enc.join(','), ...filas].join('\n');
    const blob = new Blob(['\uFEFF'+csv], {type:'text/csv;charset=utf-8;'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='web_paginas.csv'; a.click();
    URL.revokeObjectURL(a.href);
    showMsg('success','Archivo Excel descargado correctamente.');
  };

  const handleWord = () => {
    const filas = paginasFiltradas.map((p,i) => `
      <tr><td>${i+1}</td><td>${p.menu||'—'}</td><td>${p.titulo}</td><td>${p.orden}</td><td>${p.mostrar}</td></tr>`).join('');
    const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
      <head><meta charset='utf-8'><title>Web Páginas</title>
      <style>body{font-family:Arial;font-size:12pt;}h2{color:#17a2b8;}
      table{width:100%;border-collapse:collapse;}th{background:#17a2b8;color:white;padding:6px;border:1px solid #ccc;}
      td{padding:5px 6px;border:1px solid #ccc;}</style></head>
      <body><h2>LISTADO GENERAL WEB PÁGINAS</h2>
      <table><thead><tr><th>Nro</th><th>Menú</th><th>Título</th><th>Orden</th><th>Mostrar</th></tr></thead>
      <tbody>${filas}</tbody></table>
      <p>Total: ${paginasFiltradas.length} registro(s)</p></body></html>`;
    const blob = new Blob([html], {type:'application/msword'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='web_paginas.doc'; a.click();
    URL.revokeObjectURL(a.href);
    showMsg('success','Archivo Word descargado correctamente.');
  };

  // ========== VISTA LISTA ==========
  if (vista === 'lista') return (
    <>
      <style>{styles}</style>
      <div className="page-container">
        <div className="page-title">📄 PAGINAS</div>

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
            <option value="2">Menú</option>
            <option value="3">Autor</option>
            <option value="4">Keyword</option>
          </select>
          <select value={filtroMenu} onChange={e=>setFiltroMenu(e.target.value)}>
            <option value="">Todos los menús</option>
            {MENUS_WEB.map(m=><option key={m} value={m}>{m}</option>)}
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
          <b>Página 1 de {Math.ceil(paginasFiltradas.length/10)||0}</b>
          <span style={{fontSize:12,color:'#888'}}>{paginasFiltradas.length} registro(s)</span>
        </div>

        {/* TABLA — igual a la imagen: Menu, Ubicación, Titulo, Orden */}
        <div className="tabla-titulo">LISTADO GENERAL WEB PAGINA</div>
        <table>
          <thead>
            <tr>
              <th>MENU</th>
              <th>UBICACIÓN</th>
              <th>TITULO</th>
              <th>ORDEN #</th>
              <th width="9%">OPCIONES</th>
            </tr>
          </thead>
          <tbody>
            {paginasFiltradas.length===0 ? (
              <tr><td colSpan="5" className="empty-msg">No hay páginas web registradas.</td></tr>
            ) : (
              paginasFiltradas.map((p) => (
                <tr key={p.id}>
                  <td align="center">{p.menu||'—'}</td>
                  <td align="center">{p.ubicacion||'—'}</td>
                  <td>{p.titulo}</td>
                  <td align="center">{p.orden}</td>
                  <td>
                    <div className="acciones">
                      <button className="btn-accion" style={{color:'#17a2b8'}} title="Editar" onClick={()=>abrirEditar(p)}>✏️</button>
                      <button className="btn-accion" style={{color:'#dc3545'}} title="Eliminar" onClick={()=>eliminar(p.id)}>🗑️</button>
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
          🗑️ Eliminar
        </div>
      </div>
    </>
  );

  // ========== VISTA FORMULARIO (igual a imagen 2) ==========
  return (
    <>
      <style>{styles}</style>
      <div className="page-container">
        {msg.texto && (
          <div className={msg.tipo==='success'?'alert-success':'alert-danger'}>
            {msg.tipo==='success'?'✅':'⚠️'} {msg.texto}
          </div>
        )}

        <div className="form-container">
          <div className="form-container-title">
            {esNuevo ? 'AGREGAR NUEVO PAGINA' : 'ACTUALIZAR PAGINA'}
          </div>

          {/* Fila 1: Menu + Titulo + Sub.Titulo + Autor */}
          <div className="form-row">
            <div className="form-field w-md">
              <label>Menu..
                <span
                  style={{color:'#17a2b8',cursor:'pointer',marginLeft:4,fontSize:12}}
                  title="Agregar nuevo menú"
                >+</span>
              </label>
              <select value={form.menu} onChange={e=>f('menu',e.target.value)}>
                <option value="">— Seleccione —</option>
                {MENUS_WEB.map(m=><option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="form-field w-xl">
              <label>Titulo</label>
              <input type="text" value={form.titulo} onChange={e=>f('titulo',e.target.value)} placeholder="" />
            </div>
            <div className="form-field w-xl">
              <label>Sub.Titulo</label>
              <input type="text" value={form.subtitulo} onChange={e=>f('subtitulo',e.target.value)} placeholder="" />
            </div>
            <div className="form-field w-lg">
              <label>Autor</label>
              <input type="text" value={form.autor} onChange={e=>f('autor',e.target.value)} placeholder="" />
            </div>
          </div>

          {/* Fila 2: Detalle (área grande) */}
          <div className="form-row">
            <div className="form-field w-full">
              <label>Detalle 🖼️comienzo</label>
              <textarea
                value={form.detalle}
                onChange={e=>f('detalle',e.target.value)}
                placeholder=""
              />
            </div>
          </div>

          {/* Fila 3: Orden + Imagen + Posicion IMG + Mostrar + URL */}
          <div className="form-row" style={{alignItems:'flex-end'}}>
            <div className="form-field w-sm">
              <label>Orden</label>
              <input type="number" value={form.orden} onChange={e=>f('orden',e.target.value)} placeholder="" min="1" />
            </div>
            <div className="form-field" style={{minWidth:220}}>
              <label>Imagen (jpg/gif/png) <span style={{color:'#007bff',fontSize:11}}>600px</span></label>
              <input type="file" accept="image/jpg,image/gif,image/png" onChange={handleImagen} style={{fontSize:12}} />
              {form.imagenPreview && <img src={form.imagenPreview} alt="preview" className="img-preview-sm" />}
            </div>
            <div className="form-field w-md">
              <label>Posicion IMG</label>
              <select value={form.posicionimg} onChange={e=>f('posicionimg',e.target.value)}>
                {POSICION_IMG.map(p=><option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-field w-sm">
              <label>Mostrar</label>
              <select value={form.mostrar} onChange={e=>f('mostrar',e.target.value)}>
                {MOSTRAR_OPTS.map(o=><option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="form-field w-xl">
              <label>URL : <span style={{fontSize:11,color:'#888'}}>http://gkmtechnology.com/eagle/</span></label>
              <input type="text" value={form.url} onChange={e=>f('url',e.target.value)} placeholder="" />
              <span className="link-verweb">[Ver web]</span>
            </div>
          </div>

          {/* Fila 4: Title + Keyword */}
          <div className="form-row">
            <div className="form-field w-xl">
              <label>Title</label>
              <input type="text" value={form.title} onChange={e=>f('title',e.target.value)} placeholder="" />
            </div>
            <div className="form-field w-xl">
              <label>Keyword</label>
              <input type="text" value={form.keyword} onChange={e=>f('keyword',e.target.value)} placeholder="" />
            </div>
          </div>

          <hr style={{borderColor:'#dee2e6',margin:'10px 0'}} />

          {/* Acciones — igual a imagen 2 */}
          <div className="form-actions">
            <button className="botonNuevo" onClick={guardar}>💾 Guardar</button>
            <button className="botonNuevo" style={{background:'#17a2b8',border:'1px solid #17a2b8'}} onClick={limpiar}>🗒️ Limpiar</button>
            <button className="btn-cancel" onClick={()=>setVista('lista')}>↩ Regresar</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WebPagina;