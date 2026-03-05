import React, { useState, useRef } from 'react';

const styles = `
  .page-container { padding:20px; font-family:Arial,Helvetica,sans-serif; font-size:13px; }
  .page-container * { color:#212529; box-sizing:border-box; }
  .page-title { font-size:18px; font-weight:bold; border-bottom:2px solid #00A3E1; padding-bottom:5px; margin-bottom:15px; display:flex; align-items:center; gap:10px; }
  .page-title select { font-size:14px; padding:3px 6px; border:1px solid #17a2b8; border-radius:4px; background:#17a2b8; color:#fff !important; }
  .page-title select option { background:#17a2b8; color:#fff !important; }
  .buscar-section { display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:15px; }
  .buscar-section select, .buscar-section input[type="text"] { padding:5px 8px; border:1px solid #ced4da; border-radius:4px; font-size:13px; background:#fff; color:#212529; }
  .buscar-section input[type="text"] { width:200px; }
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
  .empty-msg { text-align:center; color:#888; padding:20px; }
  .acciones { display:flex; gap:5px; justify-content:center; }
  .btn-accion { background:none; border:none; cursor:pointer; font-size:15px; padding:2px 5px; border-radius:3px; }
  .btn-accion:hover { background-color:#e0e0e0; }
  .badge-web { background-color:#17a2b8; color:#fff !important; padding:2px 6px; border-radius:10px; font-size:11px; }
  .alert-success { background:#d4edda; border:1px solid #c3e6cb; color:#155724 !important; padding:8px 14px; border-radius:4px; margin-bottom:10px; font-size:13px; display:inline-block; }
  .alert-danger { background:#f8d7da; border:1px solid #f5c6cb; color:#721c24 !important; padding:8px 14px; border-radius:4px; margin-bottom:10px; font-size:13px; display:inline-block; }
  .form-edit-container { background:#fff; border:1px solid #dee2e6; border-radius:6px; padding:20px; }
  .form-edit-title { font-size:16px; font-weight:bold; border-bottom:2px solid #00A3E1; padding-bottom:8px; margin-bottom:16px; display:flex; align-items:center; gap:10px; }
  .form-edit-title select { font-size:14px; padding:3px 8px; border:1px solid #17a2b8; border-radius:4px; background:#17a2b8; color:#fff !important; }
  .form-edit-title select option { background:#17a2b8; color:#fff !important; }
  .form-row { display:flex; flex-wrap:wrap; gap:12px; margin-bottom:12px; }
  .form-field { display:flex; flex-direction:column; gap:4px; }
  .form-field.w-sm { width:120px; } .form-field.w-md { width:160px; } .form-field.w-lg { width:220px; } .form-field.w-xl { flex:1; min-width:260px; } .form-field.w-full { width:100%; }
  .form-field label { font-weight:bold; font-size:13px; color:#212529; }
  .form-field input[type="text"], .form-field input[type="number"], .form-field input[type="file"], .form-field select, .form-field textarea { padding:5px 8px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; width:100%; }
  .form-field input:focus, .form-field select:focus, .form-field textarea:focus { border-color:#80bdff; outline:none; box-shadow:0 0 0 0.2rem rgba(0,123,255,0.25); }
  .form-field textarea { height:100px; resize:vertical; }
  .form-section-title { font-weight:bold; font-size:13px; background:#f8f9fa; border:1px solid #dee2e6; padding:6px 10px; border-radius:4px; margin:16px 0 10px 0; width:100%; }
  .form-actions { display:flex; gap:8px; margin-top:16px; flex-wrap:wrap; }
  .requerido { color:#dc3545; }
  .fieldset-box { border:1px solid #ced4da; border-radius:4px; padding:14px; margin-top:16px; }
  .fieldset-legend { font-weight:bold; font-size:13px; color:#17a2b8; margin-bottom:10px; padding-bottom:6px; border-bottom:1px solid #eee; }
  .thead-gray th { background-color:#17a2b8 !important; color:#fff !important; padding:8px; font-size:12px; }
  .insumo-buscar { display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-bottom:10px; background:#17a2b8; padding:8px 12px; border-radius:4px; }
  .insumo-buscar label { color:#fff !important; font-weight:bold; font-size:12px; }
  .insumo-buscar input[type="radio"] { margin-right:2px; }
  .insumo-buscar input[type="text"] { padding:4px 8px; border:2px solid #fff !important; border-radius:4px; font-size:13px; flex:1; min-width:150px; background:#fff; color:#212529; }
  .spec-input { background:#fff !important; border:2px solid #fff !important; color:#212529 !important; padding:4px 8px; border-radius:4px; font-size:13px; }
  .stock-table { width:70%; margin:10px auto; border-collapse:collapse; }
  .stock-table td, .stock-table th { border:1px solid #ccc; padding:6px 10px; text-align:center; font-size:13px; }
  .img-preview { width:60px; height:60px; object-fit:cover; border:1px solid #dee2e6; border-radius:4px; }
  .total-row td { font-weight:bold; background:#E6E6E6 !important; color:#212529 !important; padding:8px; }
  .exportar-icons { display:flex; gap:10px; justify-content:flex-end; margin-top:8px; }
  .exportar-icons button { background:none; border:none; cursor:pointer; font-size:22px; padding:2px; }
  .exportar-icons button:hover { transform:scale(1.15); }
  .rep-select { padding:5px 8px; border:1px solid #ced4da; border-radius:4px; font-size:12px; background:#fff; color:#212529; }
  .rep-input { padding:5px 8px; border:1px solid #ced4da; border-radius:4px; font-size:12px; background:#fff; color:#212529; }
  .rep-checkbox-label { font-size:12px; color:#17a2b8 !important; cursor:pointer; text-decoration:underline; }
`;

const TIPOS_ARTICULO = ['Articulo','Insumo','Otros','Uso'];
const LINEAS = ['Componentes PC','Computo','Memorias','Monitores','Perifericos','Suministros'];
const MARCAS = ['AMD','Asus','Gigabyte','Halion','Intel','Jingsha','Kingston','LG','Logitech','MSI','Samsung','Team Group','Teros','Western Digital'];
const MEDIDAS = [{v:'02',l:'Libras'},{v:'06',l:'Gramos'},{v:'07',l:'Und.'},{v:'12',l:'Cajas'},{v:'15',l:'Metros'},{v:'99',l:'Otros'}];
const TIPOS_IGV = [{v:'10',l:'Gravado - Operación Onerosa'},{v:'20',l:'Exonerado - Operación Onerosa'},{v:'30',l:'Inafecto - Operación Onerosa'},{v:'40',l:'Exportación'}];
const TIPOS_BUSQUEDA = [{value:'1',label:'Nombre'},{value:'2',label:'Codigo'},{value:'3',label:'C.Barra'},{value:'4',label:'Marca'},{value:'5',label:'Linea'},{value:'6',label:'Categoria'},{value:'7',label:'S.Cate1'},{value:'8',label:'S.Cate2/P.Activos'},{value:'9',label:'Detalle'}];
const FORM_INICIAL = {tipo:'Articulo',codigo:'',codigob:'',linea:'',categoria:'',sub1:'',sub2:'',marca:'',nomart:'',medida:'07',moneda:'S',pcart:'',pvart:'',pvmart:'',peso:'',series:'',contable:'',tipoafectoigv:'10',codcategoria:'',estado:'Activo',comision:'',web:'No',incremento:'0.00',oferta:'',disminuir:'0.00',url:'',detalle:'',stock:0};
const ARTICULOS_INICIALES = [
  {id:1,...FORM_INICIAL,codigo:'ART-001',nomart:'Procesador Intel Core I7-10700 2.90 ghz/16mb lga 1200',stock:46,pcart:'800.00',pvart:'850.00',pvmart:'840.00',marca:'Intel',linea:'Componentes PC',web:'Si',estado:'Activo',tipo:'Articulo'},
  {id:2,...FORM_INICIAL,codigo:'ART-002',nomart:'Tinta HP',stock:70,pcart:'50.00',pvart:'80.00',pvmart:'75.00',marca:'HP',linea:'Suministros',web:'Si',estado:'Activo',tipo:'Insumo'},
];
const SUCURSALES_STOCK = [{sucursal:'Tienda 1b 133',stock:46},{sucursal:'Tienda 1A 119',stock:0},{sucursal:'Almacen 2B 167',stock:0}];

const VENTAS_DATA = [
  {doc:'B:BI01-1',fecha:'2023-12-27',cliente:'Roger, inga salvador',vendedor:'Alexander',tventa:'Cont: Efec',cant:'1.00',codigo:'',articulo:'Procesador intel core i7-10700 2.90 ghz/',m:'S/',pu:'720.34',igv:'129.66',total:'850.00'},
  {doc:'B:BI01-2',fecha:'2023-12-27',cliente:'Roger, inga salvador',vendedor:'Alexander',tventa:'Cont: Visa',cant:'1.00',codigo:'',articulo:'Procesador intel core i7-10700 2.90 ghz/',m:'S/',pu:'720.34',igv:'129.66',total:'850.00'},
  {doc:'B:BI01-3',fecha:'2023-12-27',cliente:'Roger, inga salvador',vendedor:'Alexander',tventa:'Cont: Visa',cant:'1.00',codigo:'',articulo:'Procesador intel core i7-10700 2.90 ghz/',m:'S/',pu:'720.34',igv:'129.66',total:'850.00'},
  {doc:'B:BI01-4',fecha:'2023-12-27',cliente:'Roger, inga salvador',vendedor:'Alexander',tventa:'Cont: M',cant:'1.00',codigo:'',articulo:'Procesador intel core i7-10700 2.90 ghz/',m:'S/',pu:'720.34',igv:'129.66',total:'850.00'},
];
const COMPRAS_DATA = [
  {doc:'BOLETA',nro:'01-222',fecha:'27/12/2023',proveedor:'Soy Proveedor SA',usuario:'Alexander',tipo:'Contado',articulo:'Procesador Intel Core I7-10700 2.90 ghz/16mb lga 1200',cant:'50.00',pu:'800',dolares:'',soles:'40,000.00'},
];

// ---- UTILIDAD EXPORTAR ----
const exportarExcel = (tableId, filename) => {
  const table = document.getElementById(tableId);
  if (!table) return;
  let html = `<html><head><meta charset="UTF-8"></head><body>${table.outerHTML}</body></html>`;
  const blob = new Blob([html], {type:'application/vnd.ms-excel'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename+'.xls'; a.click();
};

const exportarWord = (tableId, titulo, filename) => {
  const table = document.getElementById(tableId);
  if (!table) return;
  let html = `<html><head><meta charset="UTF-8"></head><body><h2>${titulo}</h2>${table.outerHTML}</body></html>`;
  const blob = new Blob([html], {type:'application/msword'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename+'.doc'; a.click();
};

const imprimirTabla = (tableId, titulo) => {
  const table = document.getElementById(tableId);
  if (!table) return;
  const win = window.open('','_blank');
  win.document.write(`<html><head><title>${titulo}</title><style>body{font-family:Arial,sans-serif;font-size:12px;}table{border-collapse:collapse;width:100%;}th,td{border:1px solid #ccc;padding:6px 8px;}th{background:#17a2b8;color:#fff;}</style></head><body><h2>${titulo}</h2>${table.outerHTML}</body></html>`);
  win.document.close(); win.print();
};

const Articulos = () => {
  const [vista, setVista] = useState('lista');
  const [tipoArticulo, setTipoArticulo] = useState('Articulo');
  const [estadoFiltro, setEstadoFiltro] = useState('Activo');
  const [tipoBusqueda, setTipoBusqueda] = useState('1');
  const [filtroWeb, setFiltroWeb] = useState('');
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [articulos, setArticulos] = useState(ARTICULOS_INICIALES);
  const [msg, setMsg] = useState({tipo:'',texto:''});
  const [form, setForm] = useState(FORM_INICIAL);
  const [esNuevo, setEsNuevo] = useState(false);
  const [specs, setSpecs] = useState([]);
  const [specForm, setSpecForm] = useState({nombre:'',detalle:''});
  const [imagenes, setImagenes] = useState([]);
  const [imgOrden, setImgOrden] = useState('');
  const [imgPreview, setImgPreview] = useState(null);
  const [insumos, setInsumos] = useState([]);
  const [insumoBusqueda, setInsumoBusqueda] = useState('');
  const [insumoCriteria, setInsumoCriteria] = useState('Nombre');
  const [reporteTab, setReporteTab] = useState(null);
  const [ventaFiltros, setVentaFiltros] = useState({doc:'',sucursal:'',tipo:'1',texto:'',fei:'',fef:'',ncredito:false,comision:false});
  const [compraFiltros, setCompraFiltros] = useState({doc:'',sucursal:'',tipo:'',texto:'',fei:'',fef:''});

  const showMsg = (tipo,texto) => { setMsg({tipo,texto}); setTimeout(()=>setMsg({tipo:'',texto:''}),2500); };
  const articulosFiltrados = articulos.filter(a => {
    if (a.tipo!==tipoArticulo) return false;
    if (a.estado!==estadoFiltro) return false;
    if (filtroWeb==='Si'&&a.web!=='Si') return false;
    if (!textoBusqueda) return true;
    if (tipoBusqueda==='1') return a.nomart.toLowerCase().includes(textoBusqueda.toLowerCase());
    if (tipoBusqueda==='2') return a.codigo.toLowerCase().includes(textoBusqueda.toLowerCase());
    if (tipoBusqueda==='4') return a.marca.toLowerCase().includes(textoBusqueda.toLowerCase());
    if (tipoBusqueda==='5') return a.linea.toLowerCase().includes(textoBusqueda.toLowerCase());
    return true;
  });
  const abrirNuevo = () => { setForm({...FORM_INICIAL,tipo:tipoArticulo}); setEsNuevo(true); setSpecs([]); setImagenes([]); setInsumos([]); setReporteTab(null); setVista('editar'); };
  const abrirEditar = (a) => { setForm({...a}); setEsNuevo(false); setSpecs([]); setImagenes([]); setInsumos([]); setReporteTab(null); setVista('editar'); };
  const guardar = () => {
    if (!form.nomart) return showMsg('danger','El nombre del artículo es obligatorio.');
    if (!form.pcart||!form.pvart) return showMsg('danger','Los precios de compra y venta son obligatorios.');
    if (esNuevo) { setArticulos(prev=>[...prev,{...form,id:Date.now()}]); showMsg('success','Artículo agregado.'); }
    else { setArticulos(prev=>prev.map(a=>a.id===form.id?{...form}:a)); showMsg('success','Artículo actualizado.'); }
    setVista('lista');
  };
  const eliminar = (id) => { if (window.confirm('¿Eliminar este artículo?')) { setArticulos(prev=>prev.filter(a=>a.id!==id)); showMsg('success','Artículo eliminado.'); setVista('lista'); } };
  const agregarSpec = () => { if (!specForm.nombre) return; setSpecs(prev=>[...prev,{...specForm,id:Date.now()}]); setSpecForm({nombre:'',detalle:''}); };
  const handleImagen = (e) => { const file=e.target.files[0]; if(file){const url=URL.createObjectURL(file);setImgPreview({url,nombre:file.name});} };
  const agregarImagen = () => { if(!imgPreview)return; setImagenes(prev=>[...prev,{...imgPreview,orden:imgOrden,id:Date.now()}]); setImgPreview(null); setImgOrden(''); };
  const f = (key,val) => setForm(prev=>({...prev,[key]:val}));

  // totales ventas
  const totalVentaCant = VENTAS_DATA.reduce((s,v)=>s+parseFloat(v.cant||0),0);
  const totalVentaSoles = VENTAS_DATA.reduce((s,v)=>s+parseFloat(v.total||0),0);
  const totalCompraSoles = VENTAS_DATA.reduce((s,v)=>s+parseFloat(v.pu||0)*parseFloat(v.cant||0)*0.94,0);
  const totalMargen = totalVentaSoles - totalCompraSoles;

  // totales compras
  const totalCompraCant = COMPRAS_DATA.reduce((s,c)=>s+parseFloat(c.cant||0),0);
  const totalCompraImporte = COMPRAS_DATA.reduce((s,c)=>s+parseFloat((c.soles||'0').replace(/,/g,'')),0);

  if (vista==='lista') return (
    <>
      <style>{styles}</style>
      <div className="page-container">
        <div className="page-title">
          📦
          <select value={tipoArticulo} onChange={e=>setTipoArticulo(e.target.value)}>{TIPOS_ARTICULO.map(t=><option key={t} value={t}>{t}</option>)}</select>
          <span style={{fontSize:13,fontWeight:'normal',color:'#555'}}>
            (<label style={{marginLeft:6}}><input type="radio" name="estado" value="Activo" checked={estadoFiltro==='Activo'} onChange={e=>setEstadoFiltro(e.target.value)} /> Activo</label>
            <label style={{marginLeft:10}}><input type="radio" name="estado" value="Historial" checked={estadoFiltro==='Historial'} onChange={e=>setEstadoFiltro(e.target.value)} /> Historial</label>)
          </span>
        </div>
        {msg.texto&&<div className={msg.tipo==='success'?'alert-success':'alert-danger'}>{msg.tipo==='success'?'✅':'⚠️'} {msg.texto}</div>}
        <div className="buscar-section">
          <b>BUSCAR X</b>
          <select value={tipoBusqueda} onChange={e=>setTipoBusqueda(e.target.value)}>{TIPOS_BUSQUEDA.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}</select>
          <select value={filtroWeb} onChange={e=>setFiltroWeb(e.target.value)}><option value="">Todo</option><option value="Si">Web</option></select>
          <input type="text" placeholder="Ingrese el texto a buscar" value={textoBusqueda} onChange={e=>setTextoBusqueda(e.target.value)} />
          <button className="botonNuevo">⚙ Buscar</button>
          <button className="botonVerde" onClick={abrirNuevo}>✚ Agregar Nuevo</button>
        </div>
        <div className="paginacion"><b>Página 1 de {Math.ceil(articulosFiltrados.length/10)||0}</b><span style={{fontSize:12,color:'#888'}}>{articulosFiltrados.length} registro(s)</span></div>
        <div className="tabla-titulo">LISTADO GENERAL</div>
        <table>
          <thead><tr><th width="8%">CÓDIGO</th><th>DETALLE</th><th width="8%">STOCK</th><th width="9%">P.C.</th><th width="9%">P.C.P</th><th width="9%">P.VTA.</th><th width="5%">WEB</th><th width="8%"></th></tr></thead>
          <tbody>
            {articulosFiltrados.length===0?<tr><td colSpan="8" className="empty-msg">No hay artículos.</td></tr>
              :articulosFiltrados.map(a=>(
              <tr key={a.id}>
                <td><b>{a.codigo}</b></td><td>{a.nomart}</td>
                <td align="center">{parseFloat(a.stock||0).toFixed(2)}</td>
                <td align="right">S/{parseFloat(a.pcart||0).toFixed(2)}</td><td align="right">()</td>
                <td align="right">S/{parseFloat(a.pvart||0).toFixed(2)}</td>
                <td align="center">{a.web==='Si'&&<span className="badge-web">Web</span>}</td>
                <td><div className="acciones">
                  <button className="btn-accion" style={{color:'#17a2b8'}} title="Editar" onClick={()=>abrirEditar(a)}>✏️</button>
                  <button className="btn-accion" style={{color:'#6f42c1'}} title="Kardex">📋</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{display:'flex',gap:12,justifyContent:'flex-end',marginTop:10,fontSize:20}}>
          <span title="Imprimir" style={{cursor:'pointer'}}>🖨️</span>
          <span title="Excel" style={{cursor:'pointer',color:'#39B636'}}>📗</span>
          <span title="Word" style={{cursor:'pointer',color:'#3333CC'}}>📘</span>
        </div>
        <hr style={{margin:'15px 0',borderColor:'#dee2e6'}} />
        <div style={{fontSize:12,borderTop:'1px solid #dee2e6',paddingTop:10}}><b>Leyenda: </b><span style={{color:'#17a2b8'}}>✏️</span> Actualizar, Eliminar &nbsp;&nbsp;<span style={{color:'#6f42c1'}}>📋</span> Generar Kardex</div>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="page-container">
        {msg.texto&&<div className={msg.tipo==='success'?'alert-success':'alert-danger'}>{msg.tipo==='success'?'✅':'⚠️'} {msg.texto}</div>}
        <div className="form-edit-container">
          <div className="form-edit-title">
            📦 <select value={form.tipo} onChange={e=>f('tipo',e.target.value)}>{TIPOS_ARTICULO.map(t=><option key={t} value={t}>{t}</option>)}</select>
            : {esNuevo?'Nuevo Artículo':'Actualización'}
          </div>

          <div className="form-row">
            <div className="form-field w-md"><label>Código Artículo</label><input type="text" value={form.codigo} onChange={e=>f('codigo',e.target.value)} /></div>
            <div className="form-field w-md"><label>Código Barra</label><input type="text" value={form.codigob} onChange={e=>f('codigob',e.target.value)} /></div>
            <div className="form-field w-md"><label>Línea</label><select value={form.linea} onChange={e=>f('linea',e.target.value)}><option value="">Seleccione</option>{LINEAS.map(l=><option key={l} value={l}>{l}</option>)}</select></div>
            <div className="form-field w-md"><label>Categoría</label><input type="text" value={form.categoria} onChange={e=>f('categoria',e.target.value)} /></div>
            <div className="form-field w-md"><label>Sub1</label><input type="text" value={form.sub1} onChange={e=>f('sub1',e.target.value)} /></div>
            <div className="form-field w-md"><label>Sub2</label><input type="text" value={form.sub2} onChange={e=>f('sub2',e.target.value)} /></div>
            <div className="form-field w-md"><label>Marca</label><select value={form.marca} onChange={e=>f('marca',e.target.value)}><option value="">Seleccione</option>{MARCAS.map(m=><option key={m} value={m}>{m}</option>)}</select></div>
          </div>
          <div className="form-row"><div className="form-field w-full"><label>Nombre del Artículo <span className="requerido">(*)</span></label><input type="text" value={form.nomart} onChange={e=>f('nomart',e.target.value)} placeholder="Ingrese el nombre del artículo" /></div></div>
          <div className="form-row">
            <div className="form-field w-sm"><label>Medida <span className="requerido">(*)</span></label><select value={form.medida} onChange={e=>f('medida',e.target.value)}>{MEDIDAS.map(m=><option key={m.v} value={m.v}>{m.l}</option>)}</select></div>
            <div className="form-field w-sm"><label>Moneda</label><select value={form.moneda} onChange={e=>f('moneda',e.target.value)}><option value="S">Soles</option><option value="D">Dólares</option></select></div>
            <div className="form-field w-sm"><label>Precio Compra <span className="requerido">(*)</span></label><input type="number" value={form.pcart} onChange={e=>f('pcart',e.target.value)} /></div>
            <div className="form-field w-sm"><label>Precio Venta <span className="requerido">(*)</span></label><input type="number" value={form.pvart} onChange={e=>f('pvart',e.target.value)} /></div>
            <div className="form-field w-sm"><label>P.Venta Mínimo <span className="requerido">(*)</span></label><input type="number" value={form.pvmart} onChange={e=>f('pvmart',e.target.value)} /></div>
            <div className="form-field w-sm"><label>Peso (Kg)</label><input type="text" value={form.peso} onChange={e=>f('peso',e.target.value)} /></div>
            <div className="form-field w-sm"><label>Serie</label><select value={form.series} onChange={e=>f('series',e.target.value)}><option value="">Ninguno</option><option value="Serie">Serie</option></select></div>
            <div className="form-field w-sm"><label>Nro Cta</label><input type="text" value={form.contable} onChange={e=>f('contable',e.target.value)} /></div>
            <div className="form-field w-lg"><label>Tipo IGV <span className="requerido">(*)</span></label><select value={form.tipoafectoigv} onChange={e=>f('tipoafectoigv',e.target.value)}>{TIPOS_IGV.map(t=><option key={t.v} value={t.v}>{t.l}</option>)}</select></div>
            <div className="form-field w-sm"><label>Cód. SUNAT</label><input type="text" value={form.codcategoria} onChange={e=>f('codcategoria',e.target.value)} maxLength={8} /></div>
            <div className="form-field w-sm"><label>Estado</label><select value={form.estado} onChange={e=>f('estado',e.target.value)}><option value="Activo">Activo</option><option value="Historial">Historial</option></select></div>
            <div className="form-field w-sm"><label>Comisión %</label><input type="text" value={form.comision} onChange={e=>f('comision',e.target.value)} /></div>
          </div>

          <div className="form-section-title">🌐 DETALLES PARA PÁGINA WEB</div>
          <div className="form-row">
            <div className="form-field w-sm"><label>Mostrar en Web</label><select value={form.web} onChange={e=>f('web',e.target.value)}><option value="No">No</option><option value="Si">Sí</option></select></div>
            <div className="form-field w-sm"><label>Incremento (%)</label><input type="text" value={form.incremento} onChange={e=>f('incremento',e.target.value)} /></div>
            <div className="form-field w-sm"><label>Mostrar Como</label><select value={form.oferta} onChange={e=>f('oferta',e.target.value)}><option value="">Seleccione</option><option value="Oferta">Oferta</option><option value="Nuevo">Nuevo</option><option value="Ninguno">Ninguno</option></select></div>
            <div className="form-field w-sm"><label>Disminuir (%)</label><input type="text" value={form.disminuir} onChange={e=>f('disminuir',e.target.value)} /></div>
            <div className="form-field w-lg"><label>URL</label><input type="text" value={form.url} onChange={e=>f('url',e.target.value)} /></div>
          </div>
          <div className="form-row"><div className="form-field w-full"><label>+ Detalle del artículo</label><textarea value={form.detalle} onChange={e=>f('detalle',e.target.value)} /></div></div>

          <hr style={{borderColor:'#dee2e6',margin:'12px 0'}} />
          <div className="form-actions">
            <button className="botonNuevo" onClick={guardar}>💾 Guardar</button>
            {!esNuevo&&<button className="botonRojo" onClick={()=>eliminar(form.id)}>✗ Eliminar</button>}
            <button className="botonGris" onClick={()=>setVista('lista')}>← Regresar</button>
          </div>

          {!esNuevo&&(<>
            {/* STOCK */}
            <div className="form-section-title" style={{marginTop:20}}>📦 Stock por Sucursal</div>
            <table className="stock-table">
              <thead><tr><th style={{background:'#17a2b8',color:'#fff',padding:8}}>Sucursal</th><th style={{background:'#17a2b8',color:'#fff',padding:8}}>Stock</th></tr></thead>
              <tbody>{SUCURSALES_STOCK.map((s,i)=><tr key={i}><td>{s.sucursal}</td><td align="center">{s.stock.toFixed(2)}</td></tr>)}</tbody>
            </table>

            {/* PROVEEDORES */}
            <div className="form-section-title" style={{marginTop:16}}>🏭 Precio por Proveedor</div>
            <table className="stock-table">
              <thead><tr><th style={{background:'#17a2b8',color:'#fff',padding:8}}>Proveedor</th><th style={{background:'#17a2b8',color:'#fff',padding:8}}>Precio</th></tr></thead>
              <tbody><tr><td colSpan="2" className="empty-msg">Sin proveedores registrados.</td></tr></tbody>
            </table>

            {/* IMAGENES */}
            <div className="fieldset-box" style={{marginTop:16}}>
              <div className="fieldset-legend">🖼️ ARTÍCULO &gt;&gt; Agregar N Imagen</div>
              <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap',marginBottom:12}}>
                <span>Seleccione imagen (jpg/gif/png)</span>
                <input type="file" accept="image/*" onChange={handleImagen} style={{width:'auto'}} />
                <span>Orden</span>
                <input type="text" value={imgOrden} onChange={e=>setImgOrden(e.target.value)} style={{width:60,padding:'4px 8px',border:'1px solid #ced4da',borderRadius:4,background:'#fff',color:'#212529'}} />
                <button className="botonNuevo" onClick={agregarImagen}>Agregar</button>
              </div>
              {imgPreview&&<div style={{marginBottom:8,fontSize:12}}><img src={imgPreview.url} alt="preview" className="img-preview" /></div>}
              <table>
                <thead><tr style={{background:'#343a40'}}><th style={{color:'#fff',padding:8}}>Id</th><th style={{color:'#fff',padding:8}}>Imagen</th><th style={{color:'#fff',padding:8}}>Orden</th><th style={{color:'#fff',padding:8,width:'8%'}}>Opciones</th></tr></thead>
                <tbody>
                  {imagenes.length===0?<tr><td colSpan="4" className="empty-msg">Sin imágenes.</td></tr>
                    :imagenes.map((img,i)=><tr key={img.id}><td style={{padding:8}}>{i+1}</td><td style={{padding:8}}><img src={img.url} alt={img.nombre} className="img-preview" /> {img.nombre}</td><td style={{padding:8}}>{img.orden}</td><td align="center"><button className="btn-accion" style={{color:'#dc3545'}} onClick={()=>setImagenes(p=>p.filter(x=>x.id!==img.id))}>🗑️</button></td></tr>)}
                </tbody>
              </table>
            </div>

            {/* ESPECIFICACIONES */}
            <div className="fieldset-box" style={{marginTop:16}}>
              <div className="fieldset-legend">📋 ARTÍCULO &gt;&gt; Especificaciones</div>
              <div style={{background:'#17a2b8',padding:'10px 14px',borderRadius:4,marginBottom:10,display:'flex',gap:10,flexWrap:'wrap',alignItems:'center'}}>
                <span style={{color:'#fff',fontWeight:'bold'}}>Agregar Nuevo</span>
                <span style={{color:'#fff'}}>Nombre :</span>
                <input className="spec-input" type="text" value={specForm.nombre} onChange={e=>setSpecForm(p=>({...p,nombre:e.target.value}))} style={{width:160}} />
                <span style={{color:'#fff'}}>Detalle :</span>
                <input className="spec-input" type="text" value={specForm.detalle} onChange={e=>setSpecForm(p=>({...p,detalle:e.target.value}))} style={{flex:1,minWidth:160}} />
                <button className="botonNuevo" onClick={agregarSpec}>Confirmar</button>
              </div>
              <div style={{textAlign:'center',fontWeight:'bold',marginBottom:6}}>Lista ya Ingresado</div>
              <table>
                <thead><tr><th style={{padding:8,borderBottom:'1px solid #dee2e6'}}>Nombre</th><th style={{padding:8,borderBottom:'1px solid #dee2e6'}}>Detalle</th><th width="8%"></th></tr></thead>
                <tbody>
                  {specs.length===0?<tr><td colSpan="3" className="empty-msg">Sin especificaciones.</td></tr>
                    :specs.map(s=><tr key={s.id}><td style={{padding:8}}>{s.nombre}</td><td style={{padding:8}}>{s.detalle}</td><td align="center"><button className="btn-accion" style={{color:'#dc3545'}} onClick={()=>setSpecs(p=>p.filter(x=>x.id!==s.id))}>🗑️</button></td></tr>)}
                </tbody>
              </table>
            </div>

            {/* INSUMOS */}
            <div style={{marginTop:16}}>
              <div style={{textAlign:'center',fontWeight:'bold',fontSize:14,marginBottom:6}}>ARTÍCULO &gt;&gt; Insumos y accesorios</div>
              <div style={{fontWeight:'bold',marginBottom:6}}>Lista</div>
              <table style={{marginBottom:8}}>
                <thead><tr style={{background:'#C2D1D0'}}><th style={{padding:8}}>Tipo +</th><th style={{padding:8}}>Cantidad</th><th style={{padding:8}}>Detalle</th><th style={{padding:8,width:'8%'}}>Agre.</th></tr></thead>
                <tbody>{insumos.length===0?<tr><td colSpan="4" className="empty-msg">Sin insumos.</td></tr>:insumos.map((ins,i)=><tr key={i}><td style={{padding:8}}>{ins.tipo}</td><td style={{padding:8}}>{ins.cant}</td><td style={{padding:8}}>{ins.detalle}</td><td align="center"><button className="btn-accion" style={{color:'#dc3545'}} onClick={()=>setInsumos(p=>p.filter((_,j)=>j!==i))}>🗑️</button></td></tr>)}</tbody>
              </table>
              <div className="insumo-buscar">
                <label>Buscar x</label>
                {['Nombre','Marca','Linea','Cat.','Codigo','C.Barra'].map(op=>(
                  <label key={op}><input type="radio" name="insumoCrit" value={op} checked={insumoCriteria===op} onChange={e=>setInsumoCriteria(e.target.value)} /> {op} /</label>
                ))}
                <input type="text" value={insumoBusqueda} onChange={e=>setInsumoBusqueda(e.target.value)} placeholder="Buscar artículo..." />
                <button className="botonNuevo" style={{padding:'4px 12px'}}>⚙ Buscar</button>
                <button className="botonGris" style={{padding:'4px 8px'}} title="Limpiar">🔄</button>
              </div>
              <table>
                <thead><tr style={{background:'#C2D1D0'}}><th style={{padding:8}}>Tipo</th><th style={{padding:8}}>Cant.</th><th style={{padding:8}}>Detalle</th><th style={{padding:8}}>Agre.</th></tr></thead>
                <tbody><tr><td colSpan="4" className="empty-msg">Busque un artículo para agregar.</td></tr></tbody>
              </table>
            </div>

            <hr style={{borderColor:'#dee2e6',margin:'16px 0'}} />

            {/* BOTONES REPORTES */}
            <div style={{display:'flex',gap:8,marginBottom:16}}>
              <button className="botonNuevo" onClick={()=>setReporteTab(reporteTab==='ventas'?null:'ventas')}>📊 Ver Ventas</button>
              <button className="botonNuevo" onClick={()=>setReporteTab(reporteTab==='compras'?null:'compras')}>🛒 Ver Compras</button>
            </div>

            {/* ===== REPORTE VENTAS ===== */}
            {reporteTab==='ventas'&&(
              <div style={{marginBottom:16}}>
                <div style={{fontWeight:'bold',fontSize:14,textAlign:'center',marginBottom:10}}>LISTADO REPORTE DE VENTA DETALLADO</div>
                {/* FILTROS */}
                <div style={{border:'1px solid #dee2e6',padding:'10px',borderRadius:4,marginBottom:10}}>
                  <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center',marginBottom:8}}>
                    <b style={{fontSize:13}}>BUSCAR X</b>
                    <select className="rep-select" value={ventaFiltros.doc} onChange={e=>setVentaFiltros(p=>({...p,doc:e.target.value}))}>
                      <option value="">Documento &gt; todos</option><option value="Boleta">Boleta</option><option value="Factura">Factura</option><option value="Nota de Venta">Nota de Venta</option>
                    </select>
                    <select className="rep-select" value={ventaFiltros.sucursal} onChange={e=>setVentaFiltros(p=>({...p,sucursal:e.target.value}))}>
                      <option value="">Sucursal &gt; todos</option><option value="1">Tienda 1b 133</option><option value="2">Tienda 1A 119</option><option value="3">Almacen 2B 167</option>
                    </select>
                    <select className="rep-select" value={ventaFiltros.tipo} onChange={e=>setVentaFiltros(p=>({...p,tipo:e.target.value}))}>
                      <option value="1">Nro documento</option><option value="2">Nombre/empresa</option><option value="3">Vendedor</option><option value="4">Articulo</option><option value="5">Linea</option><option value="6">Marca</option>
                    </select>
                    <label className="rep-checkbox-label"><input type="checkbox" checked={ventaFiltros.ncredito} onChange={e=>setVentaFiltros(p=>({...p,ncredito:e.target.checked}))} style={{width:13,marginRight:3}} />NotaCredito</label>
                    <span style={{fontSize:12}}>/</span>
                    <label className="rep-checkbox-label"><input type="checkbox" checked={ventaFiltros.comision} onChange={e=>setVentaFiltros(p=>({...p,comision:e.target.checked}))} style={{width:13,marginRight:3}} />Comi</label>
                  </div>
                  <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
                    <input type="text" className="rep-input" style={{flex:1,minWidth:200}} placeholder="Ingrese texto a buscar..." value={ventaFiltros.texto} onChange={e=>setVentaFiltros(p=>({...p,texto:e.target.value}))} />
                    <span style={{fontSize:12}}>Fecha Inicio</span>
                    <input type="date" className="rep-input" value={ventaFiltros.fei} onChange={e=>setVentaFiltros(p=>({...p,fei:e.target.value}))} />
                    <span style={{fontSize:12}}>Fecha Fin</span>
                    <input type="date" className="rep-input" value={ventaFiltros.fef} onChange={e=>setVentaFiltros(p=>({...p,fef:e.target.value}))} />
                    <button className="botonNuevo" style={{padding:'5px 14px'}}>🔍 Buscar</button>
                  </div>
                </div>
                {/* TABLA VENTAS */}
                <table id="tabla-ventas">
                  <thead>
                    <tr className="thead-gray">
                      <th>DOC-NRO</th><th>FECHA</th><th>CLIENTE</th><th>VEND.</th><th>T.VENTA</th><th>CANT.</th><th>CODGO</th><th>ARTICULO</th><th>M</th><th align="right">P/U</th><th align="right">IGV</th><th align="right">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {VENTAS_DATA.map((v,i)=>(
                      <tr key={i} style={{background:i%2===0?'#fff':'#f9f9f9'}}>
                        <td style={{color:'#007bff'}}>{v.doc}</td><td>{v.fecha}</td><td>{v.cliente}</td><td>{v.vendedor}</td><td>{v.tventa}</td>
                        <td align="center">{v.cant}</td><td align="center">{v.codigo}</td><td>{v.articulo}</td>
                        <td align="center">{v.m}</td><td align="right">{v.pu}</td><td align="right">{v.igv}</td><td align="right">{v.total}</td>
                      </tr>
                    ))}
                    <tr className="total-row"><td><b>Totales</b></td><td></td><td><b>PRECIO VENTA</b></td><td></td><td></td><td align="center"><b>{totalVentaCant}</b></td><td></td><td align="right">US$ 0.00</td><td></td><td></td><td colSpan="2" align="right"><b>S/ {totalVentaSoles.toFixed(2)}</b></td></tr>
                    <tr className="total-row"><td><b>Totales</b></td><td></td><td><b>PRECIO COMPRA</b></td><td></td><td></td><td></td><td></td><td align="right">US$ 0.00</td><td></td><td></td><td colSpan="2" align="right"><b>S/ {totalCompraSoles.toFixed(2)}</b></td></tr>
                    <tr className="total-row"><td><b>Totales</b></td><td></td><td><b>Total Margen</b></td><td></td><td></td><td></td><td></td><td align="right">US$ 0.00</td><td></td><td></td><td colSpan="2" align="right"><b>S/ {totalMargen.toFixed(2)}</b></td></tr>
                  </tbody>
                </table>
                <div className="exportar-icons">
                  <button title="Imprimir" onClick={()=>imprimirTabla('tabla-ventas','Reporte Venta Detallado')}>🖨️</button>
                  <button title="Exportar Excel" onClick={()=>exportarExcel('tabla-ventas','reporte_ventas')}>
                    <span style={{color:'#39B636',fontSize:22}}>📗</span>
                  </button>
                  <button title="Exportar Word" onClick={()=>exportarWord('tabla-ventas','Reporte Venta Detallado','reporte_ventas')}>
                    <span style={{color:'#3333CC',fontSize:22}}>📘</span>
                  </button>
                </div>
              </div>
            )}

            {/* ===== REPORTE COMPRAS ===== */}
            {reporteTab==='compras'&&(
              <div style={{marginBottom:16}}>
                <div style={{fontWeight:'bold',fontSize:14,textAlign:'center',marginBottom:10}}>REPORTE DE COMPRA DETALLADO</div>
                {/* FILTROS */}
                <div style={{border:'1px solid #dee2e6',padding:'10px',borderRadius:4,marginBottom:10}}>
                  <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center',marginBottom:8}}>
                    <b style={{fontSize:13}}>BUSCAR X</b>
                    <select className="rep-select" value={compraFiltros.doc} onChange={e=>setCompraFiltros(p=>({...p,doc:e.target.value}))}>
                      <option value="">Documento &gt; todos</option><option value="Boleta">Boleta</option><option value="Factura">Factura</option><option value="Guia">Guia</option>
                    </select>
                    <select className="rep-select" value={compraFiltros.sucursal} onChange={e=>setCompraFiltros(p=>({...p,sucursal:e.target.value}))}>
                      <option value="">Sucursal &gt; todos</option><option value="1">Tienda 1b 133</option><option value="2">Tienda 1A 119</option><option value="3">Almacen 2B 167</option>
                    </select>
                    <select className="rep-select" value={compraFiltros.tipo} onChange={e=>setCompraFiltros(p=>({...p,tipo:e.target.value}))}>
                      <option value="">Ninguno</option><option value="1">Nro documento</option><option value="2">Proveedor</option><option value="3">RUC</option><option value="4">Usuario</option><option value="5">T.Compra</option><option value="6">Articulo</option><option value="7">Serie.Articulo</option>
                    </select>
                  </div>
                  <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
                    <input type="text" className="rep-input" style={{flex:1,minWidth:200}} placeholder="Ingrese texto a buscar..." value={compraFiltros.texto} onChange={e=>setCompraFiltros(p=>({...p,texto:e.target.value}))} />
                    <span style={{fontSize:12}}>Fecha Inicio</span>
                    <input type="date" className="rep-input" value={compraFiltros.fei} onChange={e=>setCompraFiltros(p=>({...p,fei:e.target.value}))} />
                    <span style={{fontSize:12}}>Fecha Fin</span>
                    <input type="date" className="rep-input" value={compraFiltros.fef} onChange={e=>setCompraFiltros(p=>({...p,fef:e.target.value}))} />
                    <button className="botonNuevo" style={{padding:'5px 14px'}}>🔍 Buscar</button>
                  </div>
                </div>
                {/* TABLA COMPRAS */}
                <table id="tabla-compras">
                  <thead>
                    <tr className="thead-gray">
                      <th>Documento</th><th>Nro Doc</th><th>Fecha</th><th>Proveedor</th><th>Usuario</th><th>T.Compra</th><th>Artículo</th><th>Cant.</th><th>PU</th><th align="right">Dólares</th><th align="right">Soles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPRAS_DATA.map((c,i)=>(
                      <tr key={i} style={{background:i%2===0?'#fff':'#f9f9f9'}}>
                        <td><b>{c.doc}</b></td><td>{c.nro}</td><td>{c.fecha}</td><td>{c.proveedor}</td><td>{c.usuario}</td><td>{c.tipo}</td><td>{c.articulo}</td><td>{c.cant}</td><td>{c.pu}</td><td align="right">{c.dolares}</td><td align="right">{c.soles}</td>
                      </tr>
                    ))}
                    <tr className="total-row"><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td><b>{totalCompraCant}</b></td><td></td><td align="right"><b>US$ 0.00</b></td><td align="right"><b>S/ {totalCompraImporte.toLocaleString('es-PE',{minimumFractionDigits:2})}</b></td></tr>
                  </tbody>
                </table>
                <div className="exportar-icons">
                  <button title="Imprimir" onClick={()=>imprimirTabla('tabla-compras','Reporte Compra Detallado')}>🖨️</button>
                  <button title="Exportar Excel" onClick={()=>exportarExcel('tabla-compras','reporte_compras')}>
                    <span style={{color:'#39B636',fontSize:22}}>📗</span>
                  </button>
                  <button title="Exportar Word" onClick={()=>exportarWord('tabla-compras','Reporte Compra Detallado','reporte_compras')}>
                    <span style={{color:'#3333CC',fontSize:22}}>📘</span>
                  </button>
                </div>
              </div>
            )}
          </>)}
        </div>
      </div>
    </>
  );
};

export default Articulos;