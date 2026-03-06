import React, { useState } from 'react';

const styles = `
  .page-container { padding:20px; font-family:Arial,Helvetica,sans-serif; font-size:13px; }
  .page-container * { color:#212529; box-sizing:border-box; }
  .page-title { font-size:18px; font-weight:bold; border-bottom:2px solid #00A3E1; padding-bottom:5px; margin-bottom:15px; display:flex; align-items:center; gap:10px; }
  .buscar-section { display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:15px; }
  .buscar-section select, .buscar-section input[type="text"] { padding:5px 8px; border:1px solid #ced4da; border-radius:4px; font-size:13px; background:#fff; color:#212529; }
  .buscar-section input[type="text"] { width:220px; }
  .botonNuevo { background-color:#17a2b8; border:1px solid #17a2b8; color:#fff !important; padding:6px 14px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:5px; }
  .botonNuevo:hover { background-color:#138496; }
  .botonVerde { background-color:#28a745; border:1px solid #28a745; color:#fff !important; padding:6px 14px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:5px; }
  .botonVerde:hover { background-color:#218838; }
  .botonGris { background-color:#6c757d; border:1px solid #6c757d; color:#fff !important; padding:6px 14px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:5px; }
  .botonRojo { background-color:#dc3545; border:1px solid #dc3545; color:#fff !important; padding:6px 14px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:5px; }
  .botonRojo:hover { background-color:#c82333; }
  .paginacion { display:flex; justify-content:space-between; margin-bottom:6px; font-size:13px; }
  .tabla-titulo { text-align:center; font-weight:bold; font-size:14px; margin-bottom:8px; }
  table { width:100%; border-collapse:collapse; font-size:13px; }
  table thead tr { background-color:#17a2b8; }
  table thead th { padding:10px 8px; text-align:left; font-weight:bold; color:#fff !important; }
  table tbody tr { background-color:#fff; border-bottom:1px solid #dee2e6; }
  table tbody tr:hover { background-color:#f2f2ec; }
  table tbody td { padding:8px; color:#212529; }
  .empty-msg { text-align:center; color:#888; padding:30px; }
  .acciones { display:flex; gap:5px; justify-content:center; }
  .btn-accion { background:none; border:none; cursor:pointer; font-size:15px; padding:2px 5px; border-radius:3px; }
  .btn-accion:hover { background-color:#e0e0e0; }
  .badge-web { background-color:#17a2b8; color:#fff !important; padding:2px 6px; border-radius:10px; font-size:11px; }
  .alert-success { background:#d4edda; border:1px solid #c3e6cb; color:#155724 !important; padding:8px 14px; border-radius:4px; margin-bottom:10px; font-size:13px; display:inline-block; }
  .alert-danger { background:#f8d7da; border:1px solid #f5c6cb; color:#721c24 !important; padding:8px 14px; border-radius:4px; margin-bottom:10px; font-size:13px; display:inline-block; }
  .exportar-section { display:flex; gap:12px; justify-content:flex-end; margin-top:10px; font-size:20px; }
  .exportar-section span { cursor:pointer; }
  .exportar-section span:hover { transform:scale(1.2); }

  /* FORMULARIO */
  .form-container { background:#fff; border:1px solid #dee2e6; border-radius:6px; padding:20px; }
  .form-title { font-size:16px; font-weight:bold; border-bottom:2px solid #00A3E1; padding-bottom:8px; margin-bottom:16px; }
  .form-row { display:flex; flex-wrap:wrap; gap:12px; margin-bottom:12px; }
  .form-field { display:flex; flex-direction:column; gap:4px; }
  .form-field.w-sm { width:120px; }
  .form-field.w-md { width:180px; }
  .form-field.w-lg { width:240px; }
  .form-field.w-full { width:100%; }
  .form-field label { font-weight:bold; font-size:13px; color:#212529; }
  .form-field input, .form-field select, .form-field textarea { padding:5px 8px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; width:100%; }
  .form-field input:focus, .form-field select:focus, .form-field textarea:focus { border-color:#80bdff; outline:none; box-shadow:0 0 0 0.2rem rgba(0,123,255,0.25); }
  .form-field textarea { height:80px; resize:vertical; }
  .form-actions { display:flex; gap:8px; margin-top:16px; }
  .requerido { color:#dc3545; }
`;

const TIPOS_BUSQUEDA = [
  {value:'1',label:'Nombre'},{value:'2',label:'Tipo'},{value:'3',label:'Categoria'},
  {value:'4',label:'Sub Cat. 1'},{value:'5',label:'Sub Cat. 2'},{value:'6',label:'Codigo'},
];

const TIPOS_SERVICIO = ['Mantenimiento','Instalación','Consultoría','Soporte','Diseño','Otros'];
const CATEGORIAS = ['Tecnología','Infraestructura','Software','Hardware','Redes','Otros'];

const SERVICIOS_INICIALES = [
  {id:1, codigo:'SRV-001', tipo:'Mantenimiento', categoria:'Tecnología', subcat1:'PC', subcat2:'', detalle:'Mantenimiento preventivo de PC', pventa:'150.00', web:'Si', estado:'Activo'},
  {id:2, codigo:'SRV-002', tipo:'Instalación',   categoria:'Redes',       subcat1:'LAN', subcat2:'', detalle:'Instalación de red LAN', pventa:'300.00', web:'No', estado:'Activo'},
];

const FORM_VACIO = {codigo:'', tipo:'', categoria:'', subcat1:'', subcat2:'', detalle:'', pventa:'', web:'No', estado:'Activo', moneda:'S', igv:'10', comision:''};

const Servicios = () => {
  const [vista, setVista] = useState('lista');
  const [tipoBusqueda, setTipoBusqueda] = useState('1');
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [servicios, setServicios] = useState(SERVICIOS_INICIALES);
  const [msg, setMsg] = useState({tipo:'',texto:''});
  const [form, setForm] = useState(FORM_VACIO);
  const [esNuevo, setEsNuevo] = useState(false);

  const showMsg = (tipo,texto) => { setMsg({tipo,texto}); setTimeout(()=>setMsg({tipo:'',texto:''}),2500); };

  const serviciosFiltrados = servicios.filter(s => {
    if (!textoBusqueda) return true;
    if (tipoBusqueda==='1') return s.detalle.toLowerCase().includes(textoBusqueda.toLowerCase());
    if (tipoBusqueda==='2') return s.tipo.toLowerCase().includes(textoBusqueda.toLowerCase());
    if (tipoBusqueda==='3') return s.categoria.toLowerCase().includes(textoBusqueda.toLowerCase());
    if (tipoBusqueda==='4') return s.subcat1.toLowerCase().includes(textoBusqueda.toLowerCase());
    if (tipoBusqueda==='5') return s.subcat2.toLowerCase().includes(textoBusqueda.toLowerCase());
    if (tipoBusqueda==='6') return s.codigo.toLowerCase().includes(textoBusqueda.toLowerCase());
    return true;
  });

  const abrirNuevo = () => { setForm({...FORM_VACIO}); setEsNuevo(true); setVista('editar'); };
  const abrirEditar = (s) => { setForm({...s}); setEsNuevo(false); setVista('editar'); };

  const guardar = () => {
    if (!form.detalle) return showMsg('danger','El nombre/detalle del servicio es obligatorio.');
    if (!form.pventa) return showMsg('danger','El precio de venta es obligatorio.');
    if (esNuevo) { setServicios(prev=>[...prev,{...form,id:Date.now()}]); showMsg('success','Servicio agregado correctamente.'); }
    else { setServicios(prev=>prev.map(s=>s.id===form.id?{...form}:s)); showMsg('success','Servicio actualizado correctamente.'); }
    setVista('lista');
  };

  const eliminar = (id) => {
    if (window.confirm('¿Eliminar este servicio?')) { setServicios(prev=>prev.filter(s=>s.id!==id)); showMsg('success','Servicio eliminado.'); setVista('lista'); }
  };

  const f = (key,val) => setForm(prev=>({...prev,[key]:val}));

  // ====== VISTA LISTA ======
  if (vista==='lista') return (
    <>
      <style>{styles}</style>
      <div className="page-container">
        <div className="page-title">🔧 SERVICIOS</div>

        {msg.texto && <div className={msg.tipo==='success'?'alert-success':'alert-danger'}>{msg.tipo==='success'?'✅':'⚠️'} {msg.texto}</div>}

        <div className="buscar-section">
          <b>BUSCAR X</b>
          <select value={tipoBusqueda} onChange={e=>setTipoBusqueda(e.target.value)}>
            {TIPOS_BUSQUEDA.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <input type="text" placeholder="Ingrese el texto a buscar" value={textoBusqueda} onChange={e=>setTextoBusqueda(e.target.value)} />
          <button className="botonNuevo">⚙ Buscar</button>
          <button className="botonVerde" onClick={abrirNuevo}>✚ Agregar Nuevo</button>
        </div>

        <div className="paginacion">
          <b>Página 1 de {Math.ceil(serviciosFiltrados.length/10)||0}</b>
          <span style={{fontSize:12,color:'#888'}}>{serviciosFiltrados.length} registro(s)</span>
        </div>

        <div className="tabla-titulo">LISTADO GENERAL SERVICIOS</div>
        <table>
          <thead>
            <tr>
              <th width="8%">Código</th>
              <th width="12%">Tipo</th>
              <th width="12%">Categoría</th>
              <th>Detalle</th>
              <th width="10%" align="right">P.Vta.</th>
              <th width="6%" align="center">Web</th>
              <th width="8%" align="center">Act.</th>
            </tr>
          </thead>
          <tbody>
            {serviciosFiltrados.length===0
              ? <tr><td colSpan="7" className="empty-msg">No hay servicios registrados.</td></tr>
              : serviciosFiltrados.map(s=>(
                <tr key={s.id}>
                  <td><b>{s.codigo}</b></td>
                  <td>{s.tipo}</td>
                  <td>{s.categoria}</td>
                  <td>{s.detalle}</td>
                  <td align="right">S/{parseFloat(s.pventa||0).toFixed(2)}</td>
                  <td align="center">{s.web==='Si'&&<span className="badge-web">Web</span>}</td>
                  <td>
                    <div className="acciones">
                      <button className="btn-accion" style={{color:'#17a2b8'}} title="Editar" onClick={()=>abrirEditar(s)}>✏️</button>
                      <button className="btn-accion" style={{color:'#dc3545'}} title="Eliminar" onClick={()=>eliminar(s.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>

        <div className="exportar-section">
          <span title="Imprimir">🖨️</span>
          <span title="Excel" style={{color:'#39B636'}}>📗</span>
          <span title="Word"  style={{color:'#3333CC'}}>📘</span>
        </div>
        <hr style={{margin:'15px 0',borderColor:'#dee2e6'}} />
      </div>
    </>
  );

  // ====== VISTA EDITAR ======
  return (
    <>
      <style>{styles}</style>
      <div className="page-container">
        {msg.texto && <div className={msg.tipo==='success'?'alert-success':'alert-danger'}>{msg.tipo==='success'?'✅':'⚠️'} {msg.texto}</div>}
        <div className="form-container">
          <div className="form-title">🔧 SERVICIO : {esNuevo?'Nuevo':'Actualización'}</div>

          <div className="form-row">
            <div className="form-field w-md">
              <label>Código</label>
              <input type="text" value={form.codigo} onChange={e=>f('codigo',e.target.value)} placeholder="Ej: SRV-001" />
            </div>
            <div className="form-field w-md">
              <label>Tipo</label>
              <select value={form.tipo} onChange={e=>f('tipo',e.target.value)}>
                <option value="">Seleccione</option>
                {TIPOS_SERVICIO.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-field w-md">
              <label>Categoría</label>
              <select value={form.categoria} onChange={e=>f('categoria',e.target.value)}>
                <option value="">Seleccione</option>
                {CATEGORIAS.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-field w-md">
              <label>Sub Cat. 1</label>
              <input type="text" value={form.subcat1} onChange={e=>f('subcat1',e.target.value)} />
            </div>
            <div className="form-field w-md">
              <label>Sub Cat. 2</label>
              <input type="text" value={form.subcat2} onChange={e=>f('subcat2',e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field w-full">
              <label>Detalle / Nombre del Servicio <span className="requerido">(*)</span></label>
              <input type="text" value={form.detalle} onChange={e=>f('detalle',e.target.value)} placeholder="Descripción del servicio" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field w-sm">
              <label>Moneda</label>
              <select value={form.moneda} onChange={e=>f('moneda',e.target.value)}>
                <option value="S">Soles</option>
                <option value="D">Dólares</option>
              </select>
            </div>
            <div className="form-field w-sm">
              <label>Precio Venta <span className="requerido">(*)</span></label>
              <input type="number" value={form.pventa} onChange={e=>f('pventa',e.target.value)} placeholder="0.00" />
            </div>
            <div className="form-field w-sm">
              <label>Tipo IGV</label>
              <select value={form.igv} onChange={e=>f('igv',e.target.value)}>
                <option value="10">Gravado (IGV)</option>
                <option value="20">Exonerado</option>
                <option value="30">Inafecto</option>
              </select>
            </div>
            <div className="form-field w-sm">
              <label>Comisión %</label>
              <input type="text" value={form.comision} onChange={e=>f('comision',e.target.value)} placeholder="0.00" />
            </div>
            <div className="form-field w-sm">
              <label>Estado</label>
              <select value={form.estado} onChange={e=>f('estado',e.target.value)}>
                <option value="Activo">Activo</option>
                <option value="Historial">Historial</option>
              </select>
            </div>
            <div className="form-field w-sm">
              <label>Mostrar en Web</label>
              <select value={form.web} onChange={e=>f('web',e.target.value)}>
                <option value="No">No</option>
                <option value="Si">Sí</option>
              </select>
            </div>
          </div>

          <hr style={{borderColor:'#dee2e6',margin:'12px 0'}} />
          <div className="form-actions">
            <button className="botonNuevo" onClick={guardar}>💾 Guardar</button>
            {!esNuevo && <button className="botonRojo" onClick={()=>eliminar(form.id)}>✗ Eliminar</button>}
            <button className="botonGris" onClick={()=>setVista('lista')}>← Regresar</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Servicios;