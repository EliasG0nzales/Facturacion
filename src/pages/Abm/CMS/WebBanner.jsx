import React, { useState, useRef } from 'react';

const styles = `
  .page-container { padding:20px; font-family:Arial,Helvetica,sans-serif; font-size:13px; }
  .page-container * { color:#212529; box-sizing:border-box; }
  .page-title { font-size:18px; font-weight:bold; border-bottom:2px solid #00A3E1; padding-bottom:5px; margin-bottom:15px; color:#333; }

  .botonNuevo { background-color:#17a2b8; border:1px solid #17a2b8; color:#fff !important; padding:6px 14px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:5px; transition:background-color 0.2s; }
  .botonNuevo:hover { background-color:#138496; }
  .btn-cancel { background-color:#6c757d; border:1px solid #6c757d; color:#fff !important; padding:6px 16px; border-radius:4px; cursor:pointer; font-size:13px; font-weight:bold; }
  .btn-cancel:hover { background-color:#5a6268; }
  .btn-danger { background-color:#dc3545; border:1px solid #dc3545; color:#fff !important; padding:4px 10px; border-radius:4px; cursor:pointer; font-size:12px; font-weight:bold; }
  .btn-danger:hover { background-color:#c82333; }
  .btn-edit { background-color:#17a2b8; border:1px solid #17a2b8; color:#fff !important; padding:4px 10px; border-radius:4px; cursor:pointer; font-size:12px; font-weight:bold; }
  .btn-edit:hover { background-color:#138496; }

  .top-bar { display:flex; justify-content:center; margin-bottom:16px; }

  .tabla-titulo { text-align:center; font-weight:bold; font-size:14px; margin-bottom:8px; display:flex; align-items:center; justify-content:center; gap:6px; }

  table { width:100%; border-collapse:collapse; font-size:13px; }
  table thead tr { background-color:#17a2b8; }
  table thead th { padding:10px 8px; text-align:center; font-weight:bold; color:#fff !important; }
  table tbody tr { background-color:#fff; border-bottom:1px solid #dee2e6; }
  table tbody tr:hover { background-color:#f8f9fa; }
  table tbody td { padding:8px; color:#212529; }
  .empty-msg { text-align:center; color:#888; padding:30px; font-size:13px; }

  .img-thumb { width:80px; height:30px; object-fit:cover; border:1px solid #dee2e6; border-radius:3px; }
  .img-placeholder { width:80px; height:30px; background:#f0f0f0; border:1px solid #dee2e6; border-radius:3px; display:flex; align-items:center; justify-content:center; font-size:10px; color:#aaa; }

  .exportar-section { display:flex; gap:18px; justify-content:flex-end; margin-top:10px; font-size:20px; }
  .exportar-btn { display:flex; flex-direction:column; align-items:center; gap:2px; cursor:pointer; transition:transform 0.15s; background:none; border:none; padding:0; }
  .exportar-btn:hover { transform:scale(1.15); }
  .exportar-label { font-size:10px; font-weight:bold; }

  .alert-success { background:#d4edda; border:1px solid #c3e6cb; color:#155724 !important; padding:8px 14px; border-radius:4px; margin-bottom:10px; font-size:13px; display:inline-block; }
  .alert-danger  { background:#f8d7da; border:1px solid #f5c6cb; color:#721c24 !important; padding:8px 14px; border-radius:4px; margin-bottom:10px; font-size:13px; display:inline-block; }

  /* FORMULARIO */
  .form-container { background:#fff; padding:10px 20px 24px; }
  .form-title { text-align:center; font-size:15px; font-weight:bold; margin-bottom:20px; color:#212529; }
  .form-layout { display:flex; gap:24px; align-items:flex-start; }
  .form-left  { flex:1; display:flex; flex-direction:column; gap:14px; }
  .form-right { width:340px; display:flex; flex-direction:column; gap:14px; }
  .form-field { display:flex; flex-direction:column; gap:4px; }
  .form-field label { font-weight:bold; font-size:13px; color:#212529; }
  .form-field input[type="text"],
  .form-field input[type="number"],
  .form-field textarea { padding:6px 8px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; width:100%; }
  .form-field input:focus, .form-field textarea:focus { border-color:#80bdff; outline:none; box-shadow:0 0 0 0.2rem rgba(0,123,255,0.25); }
  .form-field textarea { height:140px; resize:vertical; }
  .form-top-row { display:flex; gap:16px; }
  .form-top-row .form-field { flex:1; }
  .file-row { display:flex; align-items:center; gap:8px; font-size:12px; color:#555; flex-wrap:wrap; }
  .file-row input[type="file"] { font-size:12px; }
  .file-hint { font-size:11px; color:#888; }
  .form-actions { display:flex; gap:10px; justify-content:center; margin-top:24px; padding-top:16px; border-top:1px solid #dee2e6; }
  .requerido { color:#dc3545; }
  .img-preview { max-width:200px; max-height:80px; object-fit:contain; border:1px solid #dee2e6; border-radius:4px; margin-top:6px; }
`;

const FORM_INICIAL = { titulo:'', subtitulo:'', detalle:'', orden:'', imagen:null, imagenPreview:null, imagenNombre:'' };

const BANERS_INICIALES = [
  { id:1, titulo:'Promoción de Verano',  subtitulo:'Hasta 50% de descuento', detalle:'Aprovecha nuestras ofertas de temporada.', orden:1, imagen:null, imagenPreview:null, imagenNombre:'baner1.jpg' },
  { id:2, titulo:'Nuevos Productos',     subtitulo:'Colección 2024',          detalle:'Descubre lo último en nuestro catálogo.',  orden:2, imagen:null, imagenPreview:null, imagenNombre:'baner2.png' },
  { id:3, titulo:'Envío Gratis',         subtitulo:'En compras mayores a S/100', detalle:'Solo por esta semana.',               orden:3, imagen:null, imagenPreview:null, imagenNombre:'' },
];

const WebBaner = () => {
  const [vista, setVista]     = useState('lista');
  const [baners, setBaners]   = useState(BANERS_INICIALES);
  const [form, setForm]       = useState(FORM_INICIAL);
  const [esNuevo, setEsNuevo] = useState(true);
  const [msg, setMsg]         = useState({ tipo:'', texto:'' });
  const fileRef               = useRef(null);

  const showMsg = (tipo, texto) => { setMsg({tipo,texto}); setTimeout(()=>setMsg({tipo:'',texto:''}),2500); };
  const f = (key, val) => setForm(prev => ({...prev, [key]: val}));

  const abrirNuevo  = () => { setForm(FORM_INICIAL); setEsNuevo(true);  setVista('form'); };
  const abrirEditar = (b) => { setForm({...b});       setEsNuevo(false); setVista('form'); };
  const limpiar     = () => { setForm(FORM_INICIAL); if (fileRef.current) fileRef.current.value = ''; };

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setForm(prev => ({...prev, imagenNombre: file.name, imagenPreview: url}));
    }
  };

  const guardar = () => {
    if (!form.titulo) return showMsg('danger', 'El Título es obligatorio.');
    if (!form.orden)  return showMsg('danger', 'El Orden es obligatorio.');
    if (esNuevo) {
      setBaners(prev => [...prev, { ...form, id: Date.now() }]);
      showMsg('success', 'Baner agregado correctamente.');
    } else {
      setBaners(prev => prev.map(b => b.id===form.id ? {...form} : b));
      showMsg('success', 'Baner actualizado correctamente.');
    }
    setVista('lista');
  };

  const eliminar = (id) => {
    if (window.confirm('¿Eliminar este baner?')) {
      setBaners(prev => prev.filter(b => b.id!==id));
      showMsg('success', 'Baner eliminado.');
    }
  };

  // ---- EXPORTAR ----
  const handleImprimir = () => {
    const filas = baners.map((b,i) => `
      <tr><td>${i+1}</td><td>${b.titulo}</td><td>${b.subtitulo||''}</td><td>${b.orden}</td><td>${b.imagenNombre||'—'}</td></tr>`).join('');
    const win = window.open('','_blank');
    win.document.write(`<html><head><title>Baners</title>
      <style>body{font-family:Arial,sans-serif;font-size:12px;}h2{color:#17a2b8;border-bottom:2px solid #17a2b8;padding-bottom:5px;}
      table{border-collapse:collapse;width:100%;}th{background:#17a2b8;color:#fff;padding:8px;text-align:left;}
      td{padding:6px 8px;border-bottom:1px solid #dee2e6;}tr:nth-child(even){background:#f8f9fa;}</style></head>
      <body><h2>🖼️ LISTADO GENERAL DE BANER</h2>
      <table><thead><tr><th>Nro</th><th>Título</th><th>Sub Título</th><th>Orden</th><th>Imagen</th></tr></thead>
      <tbody>${filas}</tbody></table>
      <p style="font-size:11px;color:#888;margin-top:12px;">Total: ${baners.length} registro(s)</p>
      </body></html>`);
    win.document.close(); win.print();
  };

  const handleExcel = () => {
    const enc = ['Nro','Título','Sub Título','Detalle','Orden','Imagen'];
    const filas = baners.map((b,i) =>
      [i+1, `"${b.titulo}"`, `"${b.subtitulo}"`, `"${b.detalle}"`, b.orden, b.imagenNombre||''].join(',')
    );
    const csv = [enc.join(','), ...filas].join('\n');
    const blob = new Blob(['\uFEFF'+csv], {type:'text/csv;charset=utf-8;'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='web_baners.csv'; a.click();
    URL.revokeObjectURL(a.href);
    showMsg('success','Archivo Excel descargado correctamente.');
  };

  const handleWord = () => {
    const filas = baners.map((b,i) => `
      <tr><td>${i+1}</td><td>${b.titulo}</td><td>${b.subtitulo||''}</td><td>${b.orden}</td><td>${b.imagenNombre||'—'}</td></tr>`).join('');
    const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
      <head><meta charset='utf-8'><title>Baners</title>
      <style>body{font-family:Arial;font-size:12pt;}h2{color:#17a2b8;}
      table{width:100%;border-collapse:collapse;}th{background:#17a2b8;color:white;padding:6px;border:1px solid #ccc;}
      td{padding:5px 6px;border:1px solid #ccc;}</style></head>
      <body><h2>LISTADO GENERAL DE BANER</h2>
      <table><thead><tr><th>Nro</th><th>Título</th><th>Sub Título</th><th>Orden</th><th>Imagen</th></tr></thead>
      <tbody>${filas}</tbody></table>
      <p>Total: ${baners.length} registro(s)</p></body></html>`;
    const blob = new Blob([html], {type:'application/msword'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='web_baners.doc'; a.click();
    URL.revokeObjectURL(a.href);
    showMsg('success','Archivo Word descargado correctamente.');
  };

  // ========== VISTA LISTA ==========
  if (vista === 'lista') return (
    <>
      <style>{styles}</style>
      <div className="page-container">
        <div className="page-title">🖼️ WEB : BANER</div>

        {msg.texto && (
          <div className={msg.tipo==='success'?'alert-success':'alert-danger'}>
            {msg.tipo==='success'?'✅':'⚠️'} {msg.texto}
          </div>
        )}

        {/* Botón centrado — igual al screenshot */}
        <div className="top-bar">
          <button className="botonNuevo" onClick={abrirNuevo}>✚ Agregar Nuevo</button>
        </div>

        {/* TABLA — TITULO, ORDEN, ELIMINAR, ACTUALIZAR */}
        <div className="tabla-titulo">ℹ️ LISTADO GENERAL DE BANER</div>
        <table>
          <thead>
            <tr>
              <th>TITULO</th>
              <th width="8%">IMAGEN</th>
              <th width="8%" align="center">ORDEN</th>
              <th width="10%" align="center">ELIMINAR</th>
              <th width="10%" align="center">ACTULIZAR</th>
            </tr>
          </thead>
          <tbody>
            {baners.length===0 ? (
              <tr><td colSpan="5" className="empty-msg">No hay baners registrados.</td></tr>
            ) : (
              baners.map(b => (
                <tr key={b.id}>
                  <td>
                    <b>{b.titulo}</b>
                    {b.subtitulo && <div style={{fontSize:11,color:'#888'}}>{b.subtitulo}</div>}
                  </td>
                  <td align="center">
                    {b.imagenPreview
                      ? <img src={b.imagenPreview} alt="baner" className="img-thumb" />
                      : b.imagenNombre
                        ? <div className="img-placeholder">🖼️ {b.imagenNombre.slice(0,8)}</div>
                        : <div className="img-placeholder">Sin img</div>
                    }
                  </td>
                  <td align="center"><b>{b.orden}</b></td>
                  <td align="center">
                    <button className="btn-danger" onClick={()=>eliminar(b.id)}>🗑️ Eliminar</button>
                  </td>
                  <td align="center">
                    <button className="btn-edit" onClick={()=>abrirEditar(b)}>✏️ Actualizar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* EXPORTAR */}
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
      </div>
    </>
  );

  // ========== VISTA FORMULARIO — igual al screenshot 2 ==========
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
          <div className="form-title">
            WEB : BANER &gt; {esNuevo ? 'NUEVO' : 'EDITAR'}
          </div>

          {/* Fila top: Titulo + Sub Titulo */}
          <div className="form-top-row" style={{marginBottom:14}}>
            <div className="form-field">
              <label>Titulo<span className="requerido">(*)</span></label>
              <input type="text" value={form.titulo} onChange={e=>f('titulo',e.target.value)} />
            </div>
            <div className="form-field">
              <label>Sub Titulo</label>
              <input type="text" value={form.subtitulo} onChange={e=>f('subtitulo',e.target.value)} />
            </div>
          </div>

          {/* Layout izquierda/derecha — Detalle | Imagen + Orden */}
          <div className="form-layout">
            <div className="form-left">
              <div className="form-field">
                <label>Detalle</label>
                <textarea value={form.detalle} onChange={e=>f('detalle',e.target.value)} />
              </div>
            </div>

            <div className="form-right">
              <div className="form-field">
                <label>
                  Imagen (JPG, Gif, png)&nbsp;
                  {form.imagenPreview && <img src={form.imagenPreview} alt="prev" style={{width:18,height:18,objectFit:'cover',verticalAlign:'middle',border:'1px solid #dee2e6',borderRadius:2}} />}
                </label>
                <div className="file-row">
                  <input ref={fileRef} type="file" accept=".jpg,.jpeg,.gif,.png" onChange={handleImagen} />
                </div>
                <div className="file-hint">Ancho 1000px por 300px alto</div>
                {form.imagenPreview && (
                  <img src={form.imagenPreview} alt="preview" className="img-preview" />
                )}
              </div>

              <div className="form-field">
                <label>Orden<span className="requerido">(*)</span></label>
                <input
                  type="number"
                  value={form.orden}
                  onChange={e=>f('orden',e.target.value)}
                  min="1"
                  style={{width:120}}
                />
              </div>
            </div>
          </div>

          <hr style={{borderColor:'#dee2e6',margin:'10px 0'}} />

          {/* Acciones — igual al screenshot */}
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

export default WebBaner;