import React, { useState } from 'react';

const NOMINA_VACIA = {
  fechaNac:'', direccion:'', cargo:'', sueldo:'', banco:'', cuentaBanco:'',
  fechaIngreso:'', fechaSalida:'', afp:'', cuspp:'', essalud:'',
};

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Diciembre'];
const COMISIONES_INICIALES = MESES.map((mes, i) => ({
  mes, ingreso: i===1 ? 400.00 : 0.00, comision: 0.00
}));

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
  table tbody tr:nth-child(odd) { background-color:#F2F2EC; }
  table tbody tr:hover { background-color:#CCFF66 !important; }
  table tbody td { padding:8px; color:#212529; }
  .empty-msg { text-align:center; color:#888; padding:30px; }
  .acciones { display:flex; gap:5px; align-items:center; }
  .btn-accion { background:none; border:none; cursor:pointer; font-size:15px; padding:2px 5px; border-radius:3px; }
  .btn-accion:hover { background-color:#e0e0e0; }
  .badge-nivel { padding:2px 8px; border-radius:10px; font-size:11px; font-weight:bold; color:#fff !important; }
  .nivel-director { background:#6f42c1; }
  .nivel-gerente  { background:#fd7e14; }
  .nivel-vendedor { background:#28a745; }
  .nivel-admin    { background:#dc3545; }
  .nivel-otro     { background:#6c757d; }
  .alert-success { background:#d4edda; border:1px solid #c3e6cb; color:#155724 !important; padding:8px 14px; border-radius:4px; margin-bottom:10px; font-size:13px; display:inline-block; }
  .alert-danger  { background:#f8d7da; border:1px solid #f5c6cb; color:#721c24 !important; padding:8px 14px; border-radius:4px; margin-bottom:10px; font-size:13px; display:inline-block; }
  .form-container { background:#fff; border:1px solid #dee2e6; border-radius:6px; padding:22px; }
  .form-title { font-size:16px; font-weight:bold; border-bottom:2px solid #00A3E1; padding-bottom:8px; margin-bottom:18px; }
  .form-row { display:flex; flex-wrap:wrap; gap:12px; margin-bottom:14px; }
  .form-field { display:flex; flex-direction:column; gap:4px; }
  .form-field.w-xs   { width:100px; }
  .form-field.w-sm   { width:140px; }
  .form-field.w-md   { width:190px; }
  .form-field.w-lg   { width:260px; }
  .form-field.w-full { width:100%; }
  .form-field label { font-weight:bold; font-size:13px; color:#212529; }
  .form-field input, .form-field select, .form-field textarea { padding:5px 8px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; width:100%; }
  .form-field input:focus, .form-field select:focus, .form-field textarea:focus { border-color:#80bdff; outline:none; box-shadow:0 0 0 0.2rem rgba(0,123,255,.25); }
  .form-field textarea { height:70px; resize:vertical; }
  .form-actions { display:flex; gap:8px; margin-top:18px; flex-wrap:wrap; }
  .requerido { color:#dc3545; }
  .section-title { font-weight:bold; font-size:13px; background:#f8f9fa; border:1px solid #dee2e6; padding:7px 12px; border-radius:4px; margin:18px 0 12px; display:flex; justify-content:space-between; align-items:center; }
  .permisos-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:8px; margin-top:6px; }
  .permiso-item { display:flex; align-items:center; gap:6px; font-size:13px; }
  .permiso-item input[type="checkbox"] { width:15px; height:15px; cursor:pointer; }
  .modal-overlay { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999; display:flex; align-items:center; justify-content:center; }
  .modal-box { background:#fff; border-radius:8px; padding:24px; width:540px; max-width:95%; box-shadow:0 10px 40px rgba(0,0,0,0.3); max-height:90vh; overflow-y:auto; }
  .modal-title { font-size:15px; font-weight:bold; border-bottom:2px solid #00A3E1; padding-bottom:8px; margin-bottom:16px; }
  .comisiones-table { width:60%; margin:0 auto; }
  .comisiones-table th { background:#17a2b8; color:#fff !important; padding:8px; text-align:center; }
  .comisiones-table td { padding:8px; text-align:center; border-bottom:1px solid #dee2e6; }
  .comisiones-table tr:nth-child(odd) td { background:#F2F2EC; }
  .comisiones-table tr:hover td { background:#CCFF66 !important; }
  .total-comi-row td { background:#CEE7FF !important; font-weight:bold; }
  .exportar-row { display:flex; gap:12px; justify-content:flex-end; margin-top:8px; font-size:20px; }
  .exportar-row span { cursor:pointer; }
`;

const NIVELES    = ['Director','Gerente','Administrador','Vendedor','Vendedor Externo','Contabilidad','Almacenero'];
const SUCURSALES = ['Tienda1 > Tienda 1b 133','Tienda2 > Tienda 1A 119','Almacen 1 > Almacen 2B 167'];
const TIPOS_DOC  = ['DNI','RUC','Pasaporte','CE'];
const SEXOS      = ['Masculino','Femenino'];
const PAISES     = ['Peru','Ecuador','Colombia','Venezuela','Bolivia','Argentina','Chile','Estados Unidos','Brasil','Mexico','Panama'];
const DEPTOS     = ['Amazonas','Ancash','Apurimac','Arequipa','Ayacucho','Cajamarca','Callao','Cusco','Huancavelica','Huánuco','Ica','Junin','La Libertad','Lambayeque','Lima','Loreto','Madre de Dios','Moquegua','Pasco','Piura','Puno','San Martin','Tacna','Tumbes','Ucayali'];

const PERMISOS_MODULOS = [
  'Clientes','Proveedores','Artículos','Servicios','Usuarios',
  'Compras','Ventas','Cotizaciones','Cuentas x Cobrar','Cuentas x Pagar',
  'Reportes','Kardex','Caja','Almacén','CMS Web',
];
const NIVEL_COLOR = {
  Director:'nivel-director', Gerente:'nivel-gerente', Administrador:'nivel-admin',
  Vendedor:'nivel-vendedor', 'Vendedor Externo':'nivel-vendedor',
  Contabilidad:'nivel-otro', Almacenero:'nivel-otro',
};

const FORM_VACIO = {
  apPaterno:'', apMaterno:'', nombres:'', sexo:'Masculino', fechaNac:'',
  dni:'', tipodoc:'DNI', telefono1:'', telefono2:'', celular1:'', celular2:'',
  email:'', usuario:'', password:'', nivel:'Vendedor',
  sucursal:'Tienda1 > Tienda 1b 133', pais:'Peru', departamento:'Lima',
  provincia:'Lima', distrito:'', direccion:'', comision:'', estado:'Activo',
  observacion:'', permisos: PERMISOS_MODULOS.reduce((a,p)=>({...a,[p]:false}),{}),
};

const USUARIOS_INICIALES = [
  { id:5,  apPaterno:'Romero', apMaterno:'Merino',    nombres:'Alexander Renson', sexo:'Masculino', fechaNac:'1991-12-02', dni:'47479630', tipodoc:'DNI', telefono1:'', telefono2:'980561092', celular1:'', celular2:'', email:'', usuario:'alexander', password:'****', nivel:'Director',    sucursal:'Tienda2 > Tienda 1A 119',    pais:'Peru', departamento:'Lima', provincia:'Lima', distrito:'Lima', direccion:'', comision:'', estado:'Activo', observacion:'', permisos:PERMISOS_MODULOS.reduce((a,p)=>({...a,[p]:true}),{}),  nomina:{...NOMINA_VACIA}, comisiones:[...COMISIONES_INICIALES] },
  { id:11, apPaterno:'Merino', apMaterno:'Cahuna',    nombres:'Wilver Enmanuel',  sexo:'Masculino', fechaNac:'',          dni:'',         tipodoc:'DNI', telefono1:'', telefono2:'',          celular1:'', celular2:'', email:'', usuario:'wilver',    password:'****', nivel:'Vendedor',    sucursal:'Almacen 1 > Almacen 2B 167', pais:'Peru', departamento:'Lima', provincia:'Lima', distrito:'',   direccion:'', comision:'', estado:'Activo', observacion:'', permisos:PERMISOS_MODULOS.reduce((a,p)=>({...a,[p]:false}),{}), nomina:{...NOMINA_VACIA}, comisiones:MESES.map(m=>({mes:m,ingreso:0,comision:0})) },
  { id:29, apPaterno:'Iturri', apMaterno:'Quispe',    nombres:'Smith',            sexo:'Masculino', fechaNac:'',          dni:'',         tipodoc:'DNI', telefono1:'', telefono2:'',          celular1:'', celular2:'', email:'', usuario:'smith',     password:'****', nivel:'Gerente',     sucursal:'Tienda1 > Tienda 1b 133',    pais:'Peru', departamento:'Lima', provincia:'Lima', distrito:'',   direccion:'', comision:'', estado:'Activo', observacion:'', permisos:PERMISOS_MODULOS.reduce((a,p)=>({...a,[p]:true}),{}),  nomina:{...NOMINA_VACIA}, comisiones:MESES.map(m=>({mes:m,ingreso:0,comision:0})) },
  { id:30, apPaterno:'Yupanqui',apMaterno:'Barboza',  nombres:'Raysa',            sexo:'Femenino',  fechaNac:'',          dni:'',         tipodoc:'DNI', telefono1:'123456789',telefono2:'', celular1:'', celular2:'', email:'', usuario:'raysa',     password:'****', nivel:'Vendedor',    sucursal:'Tienda1 > Tienda 1b 133',    pais:'Peru', departamento:'Lima', provincia:'Lima', distrito:'',   direccion:'', comision:'', estado:'Activo', observacion:'', permisos:PERMISOS_MODULOS.reduce((a,p)=>({...a,[p]:false}),{}), nomina:{...NOMINA_VACIA}, comisiones:MESES.map(m=>({mes:m,ingreso:0,comision:0})) },
];

// ── NominaForm ───────────────────────────────────────────────────────────────
function NominaForm({ inicial, onGuardar, onCerrar }) {
  const [nom, setNom] = useState({ ...NOMINA_VACIA, ...inicial });
  const fn = (k, v) => setNom(p => ({ ...p, [k]: v }));
  const iS = { padding:'5px 8px', border:'1px solid #ced4da', borderRadius:4, fontSize:13, background:'#fff', color:'#212529', width:'100%' };
  const lS = { fontWeight:'bold', fontSize:13, color:'#212529', marginBottom:4, display:'block' };
  return (
    <>
      <div style={{display:'flex',flexWrap:'wrap',gap:12,marginBottom:12}}>
        {[['Fecha Nacimiento','fechaNac','date'],['Fecha Ingreso','fechaIngreso','date'],['Fecha Salida','fechaSalida','date']].map(([l,k,t])=>(
          <div key={k} style={{display:'flex',flexDirection:'column',width:145}}><label style={lS}>{l}</label><input type={t} value={nom[k]} onChange={e=>fn(k,e.target.value)} style={iS} /></div>
        ))}
      </div>
      <div style={{display:'flex',flexWrap:'wrap',gap:12,marginBottom:12}}>
        <div style={{display:'flex',flexDirection:'column',flex:1,minWidth:180}}><label style={lS}>Dirección</label><input type="text" value={nom.direccion} onChange={e=>fn('direccion',e.target.value)} style={iS} /></div>
        <div style={{display:'flex',flexDirection:'column',width:150}}><label style={lS}>Cargo</label><input type="text" value={nom.cargo} onChange={e=>fn('cargo',e.target.value)} style={iS} /></div>
      </div>
      <div style={{display:'flex',flexWrap:'wrap',gap:12,marginBottom:12}}>
        {[['Sueldo (S/)','sueldo','number',110],['Banco','banco','text',160],['Nro Cuenta','cuentaBanco','text',160]].map(([l,k,t,w])=>(
          <div key={k} style={{display:'flex',flexDirection:'column',width:w}}><label style={lS}>{l}</label><input type={t} value={nom[k]} onChange={e=>fn(k,e.target.value)} style={iS} /></div>
        ))}
      </div>
      <div style={{display:'flex',flexWrap:'wrap',gap:12,marginBottom:16}}>
        {[['AFP','afp'],['CUSPP','cuspp'],['EsSalud','essalud']].map(([l,k])=>(
          <div key={k} style={{display:'flex',flexDirection:'column',width:150}}><label style={lS}>{l}</label><input type="text" value={nom[k]} onChange={e=>fn(k,e.target.value)} style={iS} /></div>
        ))}
      </div>
      <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
        <button onClick={()=>onGuardar(nom)} style={{background:'#17a2b8',border:'1px solid #17a2b8',color:'#fff',padding:'6px 14px',cursor:'pointer',fontSize:13,fontWeight:'bold',borderRadius:4}}>💾 Guardar</button>
        <button onClick={onCerrar} style={{background:'#6c757d',border:'1px solid #6c757d',color:'#fff',padding:'6px 14px',cursor:'pointer',fontSize:13,fontWeight:'bold',borderRadius:4}}>✕ Cerrar</button>
      </div>
    </>
  );
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function Usuarios() {
  const [vista, setVista]             = useState('lista');
  const [tipoBusqueda, setTipo]       = useState('1');
  const [textoBusqueda, setTexto]     = useState('');
  const [usuarios, setUsuarios]       = useState(USUARIOS_INICIALES);
  const [msg, setMsg]                 = useState({ tipo:'', texto:'' });
  const [form, setForm]               = useState(FORM_VACIO);
  const [esNuevo, setEsNuevo]         = useState(false);
  const [nominaModal, setNominaModal] = useState(null);
  const [anioComision, setAnioComision] = useState(new Date().getFullYear());

  const showMsg = (tipo, texto) => { setMsg({tipo,texto}); setTimeout(()=>setMsg({tipo:'',texto:''}),2500); };

  const filtrados = usuarios.filter(u => {
    if (!textoBusqueda) return true;
    const t = textoBusqueda.toLowerCase();
    const nombre = `${u.apPaterno} ${u.apMaterno} ${u.nombres}`.toLowerCase();
    if (tipoBusqueda==='1') return nombre.includes(t);
    if (tipoBusqueda==='2') return u.nivel.toLowerCase().includes(t);
    if (tipoBusqueda==='3') return u.dni.toLowerCase().includes(t);
    if (tipoBusqueda==='4') return u.sucursal.toLowerCase().includes(t);
    return true;
  });

  const abrirNuevo  = () => { setForm({...FORM_VACIO, permisos:{...FORM_VACIO.permisos}}); setEsNuevo(true);  setVista('editar'); };
  const abrirEditar = (u) => { setForm({...u, permisos:{...u.permisos}});                  setEsNuevo(false); setVista('editar'); };

  const guardar = () => {
    if (!form.apPaterno) return showMsg('danger','El apellido paterno es obligatorio.');
    if (!form.nombres)   return showMsg('danger','El nombre es obligatorio.');
    if (!form.usuario)   return showMsg('danger','El nombre de usuario es obligatorio.');
    if (esNuevo && !form.password) return showMsg('danger','La contraseña es obligatoria.');
    if (esNuevo) setUsuarios(prev=>[...prev, {...form, nomina:{...NOMINA_VACIA}, comisiones:MESES.map(m=>({mes:m,ingreso:0,comision:0})), id:Date.now()}]);
    else         setUsuarios(prev=>prev.map(u=>u.id===form.id ? {...form} : u));
    showMsg('success', esNuevo ? 'Usuario creado.' : 'Usuario actualizado.');
    setVista('lista');
  };

  const eliminar = (id) => {
    if (window.confirm('¿Eliminar este usuario?')) {
      setUsuarios(prev=>prev.filter(u=>u.id!==id));
      showMsg('success','Usuario eliminado.');
      setVista('lista');
    }
  };

  const guardarNomina = (nom) => {
    setUsuarios(prev=>prev.map(u=>u.id===nominaModal.id ? {...u, nomina:nom} : u));
    setNominaModal(null);
    showMsg('success','Nómina guardada.');
  };

  const f = (key, val) => setForm(prev=>({...prev,[key]:val}));
  const togglePermiso = (p) => setForm(prev=>({...prev, permisos:{...prev.permisos,[p]:!prev.permisos[p]}}));
  const toggleTodos   = (val) => setForm(prev=>({...prev, permisos:PERMISOS_MODULOS.reduce((a,p)=>({...a,[p]:val}),{})}));

  // comisiones del usuario en edicion
  const usuarioActual = !esNuevo ? usuarios.find(u=>u.id===form.id) : null;
  const comisiones    = usuarioActual?.comisiones || MESES.map(m=>({mes:m,ingreso:0,comision:0}));
  const totalIngreso  = comisiones.reduce((s,c)=>s+parseFloat(c.ingreso||0),0);
  const totalComision = comisiones.reduce((s,c)=>s+parseFloat(c.comision||0),0);

  // ── LISTA ──────────────────────────────────────────────────────────────────
  if (vista==='lista') return (
    <>
      <style>{styles}</style>
      <div className="page-container">
        <div className="page-title">👤 USUARIOS</div>
        {msg.texto && <div className={msg.tipo==='success'?'alert-success':'alert-danger'}>{msg.tipo==='success'?'✅':'⚠️'} {msg.texto}</div>}
        <div className="buscar-section">
          <b>BUSCAR X</b>
          <select value={tipoBusqueda} onChange={e=>setTipo(e.target.value)}>
            <option value="1">Nombre</option><option value="2">Nivel</option>
            <option value="3">DNI</option><option value="4">Codigo Sucursal</option>
          </select>
          <input type="text" placeholder="Ingrese el texto a buscar" value={textoBusqueda} onChange={e=>setTexto(e.target.value)} />
          <button className="botonNuevo">⚙ Buscar</button>
          <button className="botonVerde" onClick={abrirNuevo}>✚ Agregar Nuevo</button>
        </div>
        <div className="paginacion">
          <b>Página 1 de {Math.ceil(filtrados.length/10)||0}</b>
          <span style={{fontSize:12,color:'#888'}}>{filtrados.length} registro(s)</span>
        </div>
        <div className="tabla-titulo">LISTADO GENERAL</div>
        <table>
          <thead><tr>
            <th width="6%">Act.</th>
            <th>Nombre</th>
            <th width="13%">Teléfono</th>
            <th width="25%">Sucursal</th>
            <th width="11%">Nivel</th>
          </tr></thead>
          <tbody>
            {filtrados.length===0
              ? <tr><td colSpan="5" className="empty-msg">No hay usuarios registrados.</td></tr>
              : filtrados.map(u=>(
                <tr key={u.id}>
                  <td>
                    <div className="acciones">
                      <button className="btn-accion" title="Editar" style={{color:'#17a2b8'}} onClick={()=>abrirEditar(u)}>✏️</button>
                      <button className="btn-accion" title="Nómina" onClick={()=>setNominaModal(u)}>📋</button>
                    </div>
                  </td>
                  <td style={{textAlign:'left'}}><b>{u.apPaterno} {u.apMaterno}, {u.nombres}</b></td>
                  <td>{u.telefono1||u.telefono2}</td>
                  <td>{u.sucursal}</td>
                  <td><span className={`badge-nivel ${NIVEL_COLOR[u.nivel]||'nivel-otro'}`}>{u.nivel}</span></td>
                </tr>
              ))}
          </tbody>
        </table>
        <hr style={{margin:'15px 0',borderColor:'#dee2e6'}} />
        <div style={{fontSize:12,color:'#666'}}><b>Leyenda:</b> ✏️ Editar &nbsp;&nbsp; 📋 Nómina del usuario</div>
      </div>
      {nominaModal && (
        <div className="modal-overlay" onClick={()=>setNominaModal(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-title">📋 Nómina — {nominaModal.apPaterno} {nominaModal.apMaterno}, {nominaModal.nombres}</div>
            <NominaForm inicial={nominaModal.nomina||NOMINA_VACIA} onGuardar={guardarNomina} onCerrar={()=>setNominaModal(null)} />
          </div>
        </div>
      )}
    </>
  );

  // ── FORMULARIO ─────────────────────────────────────────────────────────────
  return (
    <>
      <style>{styles}</style>
      <div className="page-container">
        {msg.texto && <div className={msg.tipo==='success'?'alert-success':'alert-danger'}>{msg.tipo==='success'?'✅':'⚠️'} {msg.texto}</div>}
        <div className="form-container">
          <div className="form-title" style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
            <span>👤 USUARIO : {esNuevo?'Nuevo':'Actualizar'}</span>
            {esNuevo && (
              <div style={{display:'flex',alignItems:'center',gap:6}}>
                <span style={{fontSize:13,fontWeight:'normal',color:'#555'}}>Buscar en RENIEC:</span>
                <input
                  type="tel"
                  placeholder="Ingrese DNI"
                  value={form.dni}
                  onChange={e=>f('dni',e.target.value)}
                  maxLength={8}
                  style={{padding:'5px 8px',border:'1px solid #ced4da',borderRadius:4,fontSize:13,width:130,color:'#212529',background:'#fff'}}
                />
                <button
                  className="botonNuevo"
                  style={{padding:'5px 10px',fontSize:13}}
                  onClick={()=>{
                    if(!form.dni||form.dni.length<8) return showMsg('danger','Ingrese un DNI de 8 dígitos.');
                    showMsg('success','Consultando RENIEC... (funcionalidad conectada al backend)');
                  }}
                  title="Consultar RENIEC"
                >🔍 Consultar</button>
              </div>
            )}
          </div>

          {/* DATOS PERSONALES */}
          <div className="section-title" style={{justifyContent:'flex-start'}}>👤 Datos Personales</div>
          <div className="form-row">
            <div className="form-field w-md"><label>Apellido Paterno <span className="requerido">(*)</span></label><input type="text" value={form.apPaterno} onChange={e=>f('apPaterno',e.target.value)} placeholder="Paterno" /></div>
            <div className="form-field w-md"><label>Apellido Materno <span className="requerido">(*)</span></label><input type="text" value={form.apMaterno} onChange={e=>f('apMaterno',e.target.value)} placeholder="Materno" /></div>
            <div className="form-field w-md"><label>Nombre(s) <span className="requerido">(*)</span></label><input type="text" value={form.nombres} onChange={e=>f('nombres',e.target.value)} placeholder="Nombre" /></div>
            <div className="form-field w-sm"><label>Sexo <span className="requerido">(*)</span></label><select value={form.sexo} onChange={e=>f('sexo',e.target.value)}>{SEXOS.map(s=><option key={s}>{s}</option>)}</select></div>
            <div className="form-field w-sm"><label>Fecha de Nacimiento <span className="requerido">(*)</span></label><input type="date" value={form.fechaNac} onChange={e=>f('fechaNac',e.target.value)} /></div>
            <div className="form-field w-sm"><label>Tipo Doc.</label><select value={form.tipodoc} onChange={e=>f('tipodoc',e.target.value)}>{TIPOS_DOC.map(t=><option key={t}>{t}</option>)}</select></div>
            <div className="form-field w-sm"><label>DNI <span className="requerido">(*)</span></label><input type="text" value={form.dni} onChange={e=>f('dni',e.target.value)} maxLength={12} /></div>
          </div>
          <div className="form-row">
            <div className="form-field w-sm"><label>Teléfono</label><input type="text" value={form.telefono1} onChange={e=>f('telefono1',e.target.value)} /></div>
            <div className="form-field w-sm"><label>Teléfono 2do</label><input type="text" value={form.telefono2} onChange={e=>f('telefono2',e.target.value)} /></div>
            <div className="form-field w-sm"><label>Celular</label><input type="text" value={form.celular1} onChange={e=>f('celular1',e.target.value)} /></div>
            <div className="form-field w-sm"><label>Celular 2do</label><input type="text" value={form.celular2} onChange={e=>f('celular2',e.target.value)} /></div>
            <div className="form-field w-lg"><label>Email</label><input type="email" value={form.email} onChange={e=>f('email',e.target.value)} placeholder="correo@ejemplo.com" /></div>
          </div>

          {/* UBICACION */}
          <div className="section-title" style={{justifyContent:'flex-start'}}>📍 Ubicación</div>
          <div className="form-row">
            <div className="form-field w-md"><label>Nacionalidad</label><select value={form.pais} onChange={e=>f('pais',e.target.value)}>{PAISES.map(p=><option key={p}>{p}</option>)}</select></div>
            <div className="form-field w-md"><label>Departamento</label><select value={form.departamento} onChange={e=>f('departamento',e.target.value)}>{DEPTOS.map(d=><option key={d}>{d}</option>)}</select></div>
            <div className="form-field w-md"><label>Provincia</label><input type="text" value={form.provincia} onChange={e=>f('provincia',e.target.value)} /></div>
            <div className="form-field w-md"><label>Distrito</label><input type="text" value={form.distrito} onChange={e=>f('distrito',e.target.value)} /></div>
            <div className="form-field w-full"><label>Dirección</label><input type="text" value={form.direccion} onChange={e=>f('direccion',e.target.value)} /></div>
          </div>

          {/* ACCESO */}
          <div className="section-title" style={{justifyContent:'flex-start'}}>🔐 Datos de Acceso</div>
          <div className="form-row">
            <div className="form-field w-md"><label>Usuario <span className="requerido">(*)</span></label><input type="text" value={form.usuario} onChange={e=>f('usuario',e.target.value)} /></div>
            <div className="form-field w-md"><label>Contraseña {esNuevo&&<span className="requerido">(*)</span>}</label><input type="password" value={form.password} onChange={e=>f('password',e.target.value)} placeholder={esNuevo?'Contraseña':'Vacío = sin cambio'} /></div>
            <div className="form-field w-md"><label>Nivel <span className="requerido">(*)</span></label><select value={form.nivel} onChange={e=>f('nivel',e.target.value)}>{NIVELES.map(n=><option key={n}>{n}</option>)}</select></div>
            <div className="form-field w-lg"><label>Sucursal <span className="requerido">(*)</span></label><select value={form.sucursal} onChange={e=>f('sucursal',e.target.value)}>{SUCURSALES.map(s=><option key={s}>{s}</option>)}</select></div>
            <div className="form-field w-xs"><label>Comisión %</label><input type="number" value={form.comision} onChange={e=>f('comision',e.target.value)} placeholder="0.00" /></div>
            <div className="form-field w-sm"><label>Estado</label><select value={form.estado} onChange={e=>f('estado',e.target.value)}><option>Activo</option><option>Inactivo</option></select></div>
          </div>
          <div className="form-row">
            <div className="form-field w-full"><label>Observación</label><textarea value={form.observacion} onChange={e=>f('observacion',e.target.value)} /></div>
          </div>

          {/* PERMISOS */}
          <div className="section-title">
            <span>🔒 Permisos por Módulo</span>
            <span style={{display:'flex',gap:6}}>
              <button className="botonVerde" style={{padding:'3px 10px',fontSize:12}} onClick={()=>toggleTodos(true)}>✓ Todos</button>
              <button className="botonRojo"  style={{padding:'3px 10px',fontSize:12}} onClick={()=>toggleTodos(false)}>✗ Ninguno</button>
            </span>
          </div>
          <div className="permisos-grid">
            {PERMISOS_MODULOS.map(p=>(
              <label key={p} className="permiso-item">
                <input type="checkbox" checked={!!form.permisos[p]} onChange={()=>togglePermiso(p)} />
                {p}
              </label>
            ))}
          </div>

          {/* ACCIONES */}
          <hr style={{borderColor:'#dee2e6',margin:'18px 0'}} />
          <div className="form-actions">
            <button className="botonNuevo" onClick={guardar}>💾 Guardar</button>
            {!esNuevo && <button className="botonRojo" onClick={()=>eliminar(form.id)}>✗ Eliminar</button>}
            {!esNuevo && (
              <button style={{background:'#6f42c1',borderColor:'#6f42c1',color:'#fff',padding:'6px 14px',cursor:'pointer',fontSize:13,fontWeight:'bold',borderRadius:4,border:'1px solid',display:'inline-flex',alignItems:'center',gap:5}}
                onClick={()=>setNominaModal(form)}>📋 Nómina</button>
            )}
            <button className="botonGris" onClick={()=>setVista('lista')}>← Regresar</button>
          </div>

          {/* COMISIONES MENSUALES - solo al editar */}
          {!esNuevo && (
            <div style={{marginTop:30}}>
              <hr style={{borderColor:'#dee2e6',margin:'0 0 16px'}} />
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
                <b style={{fontSize:14}}>COMISIONES MENSUALES DEL AÑO</b>
                <select value={anioComision} onChange={e=>setAnioComision(Number(e.target.value))}
                  style={{padding:'4px 8px',border:'1px solid #ced4da',borderRadius:4,fontSize:13,background:'#fff',color:'#212529'}}>
                  {[2024,2025,2026,2027].map(a=><option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <table className="comisiones-table">
                <thead><tr>
                  <th>Mes</th>
                  <th>Ingreso S/.</th>
                  <th>Comisión</th>
                </tr></thead>
                <tbody>
                  {comisiones.map((c,i)=>(
                    <tr key={i}>
                      <td style={{textAlign:'left',paddingLeft:12,color:'#007bff',cursor:'pointer'}}>{c.mes}</td>
                      <td align="right">{parseFloat(c.ingreso||0).toFixed(2)}</td>
                      <td align="right">{parseFloat(c.comision||0).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="total-comi-row">
                    <td style={{textAlign:'left',paddingLeft:12}}>Total</td>
                    <td align="right">{totalIngreso.toFixed(2)}</td>
                    <td align="right">{totalComision.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
              <div className="exportar-row">
                <span title="Imprimir">🖨️</span>
                <span title="Excel" style={{color:'#39B636'}}>📗</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL NOMINA */}
      {nominaModal && (
        <div className="modal-overlay" onClick={()=>setNominaModal(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-title">📋 Nómina — {nominaModal.apPaterno} {nominaModal.apMaterno}, {nominaModal.nombres}</div>
            <NominaForm inicial={nominaModal.nomina||NOMINA_VACIA} onGuardar={guardarNomina} onCerrar={()=>setNominaModal(null)} />
          </div>
        </div>
      )}
    </>
  );
}