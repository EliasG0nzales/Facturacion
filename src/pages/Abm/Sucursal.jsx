import { useState } from "react";

const DEPTOS = ['','Amazonas','Ancash','Apurimac','Arequipa','Ayacucho','Cajamarca','Callao','Cusco','Huancavelica','Huánuco','Ica','Junin','La libertad','Lambayeque','Lima','Loreto','Madre de dios','Moquegua','Pasco','Piura','Puno','San martin','Tacna','Tumbes','Ucayali'];
const PROVINCIAS_LIMA = ['','Barranca','Cajatambo','Cañete','Canta','Huaral','Huarochiri','Huaura','Lima','Oyon','Yauyos'];
const DISTRITOS_LIMA  = ['','Ancon','Ate','Barranco','Breña','Carabayllo','Chaclacayo','Chorrillos','Cieneguilla','Comas','El Agustino','Independencia','Jesus Maria','La Molina','La Victoria','Lima','Lince','Los Olivos','Lurigancho','Lurin','Magdalena del Mar','Magdalena Vieja','Miraflores','Pachacamac','Pucusana','Pueblo Libre','Puente Piedra','Punta Hermosa','Punta Negra','Ricardo Palma','Rimac','San Bartolo','San Borja','San Isidro','San Juan de Lurigancho','San Juan de Miraflores','San Luis','San Martin de Porres','San Miguel','Santa Anita','Santa Eulalia','Santa Maria del Mar','Santa Rosa','Santiago de Surco','Surquillo','Villa el Salvador','Villa Maria del Triunfo'];
const RESPONSABLES = ['','fac-tura.com','Iturri, Quispe, Smith','Merino, Cahuna, Wilver Enmanuel','Romero, Merino, Alexander Renson','Yupanqui, Barboza, Raysa'];

const S = `
  @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  .sc{padding:20px;font-family:Arial,Helvetica,sans-serif;font-size:13px;animation:fadeIn .25s ease}
  .sc *{box-sizing:border-box}
  .sc-title{font-size:16px;font-weight:bold;color:#333;border-bottom:2px solid #00A3E1;padding-bottom:6px;margin-bottom:16px}
  .btn-new{background:#28a745;border:1px solid #28a745;color:#fff;padding:6px 14px;cursor:pointer;font-size:13px;font-weight:bold;border-radius:4px;display:inline-flex;align-items:center;gap:5px}
  .btn-new:hover{background:#218838}
  .btn-save{background:#17a2b8;border:1px solid #17a2b8;color:#fff;padding:6px 14px;cursor:pointer;font-size:13px;font-weight:bold;border-radius:4px;display:inline-flex;align-items:center;gap:5px}
  .btn-save:hover{background:#138496}
  .btn-del{background:#dc3545;border:1px solid #dc3545;color:#fff;padding:6px 14px;cursor:pointer;font-size:13px;font-weight:bold;border-radius:4px;display:inline-flex;align-items:center;gap:5px}
  .btn-del:hover{background:#c82333}
  .btn-back{background:#6c757d;border:1px solid #6c757d;color:#fff;padding:6px 14px;cursor:pointer;font-size:13px;font-weight:bold;border-radius:4px;display:inline-flex;align-items:center;gap:5px}
  .btn-back:hover{background:#5a6268}
  .btn-icon{background:none;border:none;cursor:pointer;font-size:16px;padding:2px 6px;border-radius:3px}
  .btn-icon:hover{background:#e0e0e0}
  table{width:100%;border-collapse:collapse;font-size:13px;margin-top:8px}
  thead tr{background:#17a2b8}
  thead th{padding:10px 8px;text-align:left;font-weight:bold;color:#fff}
  tbody tr:nth-child(odd){background:#F2F2EC}
  tbody tr:nth-child(even){background:#fff}
  tbody tr:hover{background:#CCFF66!important}
  tbody td{padding:9px 8px;color:#212529!important}
  .empty{text-align:center;color:#888;padding:30px}
  .ok{background:#d4edda;border:1px solid #c3e6cb;color:#155724;padding:8px 14px;border-radius:4px;margin-bottom:12px;font-size:13px;display:inline-block}
  .er{background:#f8d7da;border:1px solid #f5c6cb;color:#721c24;padding:8px 14px;border-radius:4px;margin-bottom:12px;font-size:13px;display:inline-block}
  .fbox{background:#fff;border:1px solid #dee2e6;border-radius:6px;padding:22px}
  .ftitle{font-size:15px;font-weight:bold;border-bottom:2px solid #00A3E1;padding-bottom:8px;margin-bottom:18px;color:#333}
  .sec{font-weight:bold;font-size:12px;background:#f0f0f0;border-left:3px solid #17a2b8;padding:6px 12px;margin:20px 0 12px;color:#333}
  .sec.warn{background:#fff3cd;border-left-color:#ffc107;color:#856404}
  .frow{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:12px;align-items:flex-end}
  .ff{display:flex;flex-direction:column;gap:3px}
  .ff label{font-weight:bold;font-size:12px;color:#333}
  .ff input,.ff select{padding:5px 8px;border:1px solid #ced4da;border-radius:4px;font-size:13px;color:#212529;background:#fff;width:100%}
  .ff input:focus,.ff select:focus{border-color:#80bdff;outline:none;box-shadow:0 0 0 .15rem rgba(0,123,255,.2)}
  .ff input[readonly]{background:#f5f5f5;color:#888;cursor:not-allowed}
  .ff input[type=file]{padding:3px;font-size:12px}
  .req{color:#dc3545}
  .w60{width:60px}.w80{width:80px}.w100{width:100px}.w130{width:130px}.w160{width:160px}
  .w200{width:200px}.w240{width:240px}.w300{width:300px}.w380{width:380px}.wfull{width:100%}
  .actions{display:flex;gap:8px;margin-top:20px;flex-wrap:wrap;justify-content:center}
  .img-prev{width:50px;height:auto;border:1px solid #ccc;border-radius:3px;vertical-align:middle;margin-right:6px}
  .img-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:4px}
`;

const BLANK = {
  sucursal:'',nombre:'',empresa:'',ruc:'',slogan:'',
  dpto:'Lima',provincia:'Lima',distrito:'Lima',direccion:'',
  telefono:'',celular1:'',celular2:'',web:'',email:'',responsable:'',
  mostrarWeb:'Si',mapaId:'',
  sol_usuario:'',sol_clave:'',sol_nroLocal:'',
  correo:'',correo_clave:'',correo_servidor:'',
  urlCustodia:'',sunatGrId:'',sunatGrSecret:'',
  sunatConsId:'',sunatConsClave:'',apiDni:'',
};

const INIT = [
  { id:1,sucursal:'Tienda1',nombre:'Tienda 1b 133',empresa:'Eagle Gaming E.I.R.L.',ruc:'20607787728',slogan:'',dpto:'Lima',provincia:'Lima',distrito:'Lima',direccion:'Av. Inca Garcilaso De La Vega 1348 Int 133',telefono:'',celular1:'986638034',celular2:'',web:'',email:'Eaglegamingperu@gmail.com',responsable:'Romero, Merino, Alexander Renson',mostrarWeb:'Si',mapaId:'',sol_usuario:'LENTRAPP',sol_clave:'Sfg73Sdt1',sol_nroLocal:'INT',correo:'email',correo_clave:'claveEmail',correo_servidor:'servidorMail',urlCustodia:'',sunatGrId:'',sunatGrSecret:'',sunatConsId:'',sunatConsClave:'',apiDni:'' },
  { id:2,sucursal:'Tienda2',nombre:'Tienda 1A 119',empresa:'Eagle Gaming E.I.R.L.',ruc:'20607787728',slogan:'',dpto:'Lima',provincia:'Lima',distrito:'Lima',direccion:'',telefono:'',celular1:'',celular2:'',web:'',email:'',responsable:'fac-tura.com',mostrarWeb:'Si',mapaId:'',sol_usuario:'',sol_clave:'',sol_nroLocal:'',correo:'',correo_clave:'',correo_servidor:'',urlCustodia:'',sunatGrId:'',sunatGrSecret:'',sunatConsId:'',sunatConsClave:'',apiDni:'' },
  { id:3,sucursal:'Almacen 1',nombre:'Almacen 2B 167',empresa:'Eagle Gaming E.I.R.L.',ruc:'20607787728',slogan:'',dpto:'Lima',provincia:'Lima',distrito:'Lima',direccion:'',telefono:'',celular1:'',celular2:'',web:'',email:'',responsable:'fac-tura.com',mostrarWeb:'No',mapaId:'',sol_usuario:'',sol_clave:'',sol_nroLocal:'',correo:'',correo_clave:'',correo_servidor:'',urlCustodia:'',sunatGrId:'',sunatGrSecret:'',sunatConsId:'',sunatConsClave:'',apiDni:'' },
];

export default function Sucursal() {
  const [vista,    setVista]    = useState('lista');
  const [rows,     setRows]     = useState(INIT);
  const [form,     setForm]     = useState(BLANK);
  const [esNuevo,  setEsNuevo]  = useState(false);
  const [msg,      setMsg]      = useState({t:'',x:''});

  const flash = (t,x) => { setMsg({t,x}); setTimeout(()=>setMsg({t:'',x:''}),2500); };
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  const abrirNuevo  = () => { setForm({...BLANK}); setEsNuevo(true);  setVista('form'); };
  const abrirEditar = (r) => { setForm({...r});    setEsNuevo(false); setVista('form'); };

  const guardar = () => {
    if (!form.sucursal.trim()) return flash('e','El campo Código es obligatorio.');
    if (!form.nombre.trim())   return flash('e','El campo Nombre es obligatorio.');
    if (!form.empresa.trim())  return flash('e','El campo Empresa es obligatorio.');
    if (!form.ruc.trim())      return flash('e','El campo RUC es obligatorio.');
    if (!form.dpto)            return flash('e','Seleccione Departamento.');
    if (!form.provincia)       return flash('e','Seleccione Provincia.');
    if (!form.distrito)        return flash('e','Seleccione Distrito.');
    if (esNuevo) setRows(p=>[...p,{...form,id:Date.now()}]);
    else         setRows(p=>p.map(r=>r.id===form.id?{...form}:r));
    flash('o', esNuevo?'Sucursal creada correctamente.':'Sucursal actualizada correctamente.');
    setVista('lista');
  };

  const eliminar = (id) => {
    if (window.confirm('¿Está seguro de eliminar esta sucursal?')) {
      setRows(p=>p.filter(r=>r.id!==id));
      flash('o','Sucursal eliminada.');
      setVista('lista');
    }
  };

  /* ─── LISTA ────────────────────────────────────────────────────────────── */
  if (vista==='lista') return (
    <>
      <style>{S}</style>
      <div className="sc">
        <div className="sc-title">🏪 SUCURSAL</div>
        {msg.x && <div className={msg.t==='o'?'ok':'er'}>{msg.t==='o'?'✅':'⚠️'} {msg.x}</div>}
        <div style={{marginBottom:12}}>
          <button className="btn-new" onClick={abrirNuevo}>✚ Agregar Nuevo</button>
        </div>
        <b>LISTADO GENERAL</b>
        <table>
          <thead><tr>
            <th>Sucursal</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Responsable</th>
            <th style={{width:80,textAlign:'center'}}>Actualizar</th>
          </tr></thead>
          <tbody>
            {rows.length===0
              ? <tr><td colSpan={5} className="empty">No hay sucursales registradas.</td></tr>
              : rows.map(r=>(
                <tr key={r.id}>
                  <td><b>{r.sucursal}</b></td>
                  <td>{r.nombre}</td>
                  <td>{r.celular1||r.telefono||'—'}</td>
                  <td>{r.responsable||'—'}</td>
                  <td style={{textAlign:'center'}}>
                    <button className="btn-icon" title="Actualizar, Eliminar e Imprimir" onClick={()=>abrirEditar(r)}>✏️</button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </>
  );

  /* ─── FORMULARIO ────────────────────────────────────────────────────────── */
  return (
    <>
      <style>{S}</style>
      <div className="sc">
        {msg.x && <div className={msg.t==='o'?'ok':'er'}>{msg.t==='o'?'✅':'⚠️'} {msg.x}</div>}
        <div className="fbox">
          <div className="ftitle">🏪 SUCURSAL : {esNuevo?'NUEVO':'ACTUALIZAR'}</div>

          {/* ── DATOS GENERALES ── */}
          <div className="sec">📋 Datos Generales</div>
          <div className="frow">
            <div className="ff w130">
              <label>Codigo</label>
              <input type="text" value={form.sucursal} onChange={e=>f('sucursal',e.target.value)} placeholder="Ej: Tienda1" />
            </div>
            <div className="ff w240">
              <label>Nombre <span className="req">(*)</span></label>
              <input type="text" value={form.nombre} onChange={e=>f('nombre',e.target.value)} />
            </div>
            <div className="ff w300">
              <label>Empresa <span className="req">(*)</span></label>
              <input type="text" value={form.empresa} onChange={e=>f('empresa',e.target.value)} placeholder="Razón social" />
            </div>
            <div className="ff w160">
              <label>RUC <span className="req">(*)</span></label>
              <input type="text" value={form.ruc} onChange={e=>f('ruc',e.target.value)} maxLength={11} placeholder="20XXXXXXXXX" />
            </div>
            <div className="ff w200">
              <label>Slogan</label>
              <input type="text" value={form.slogan} onChange={e=>f('slogan',e.target.value)} />
            </div>
          </div>

          {/* ── UBICACIÓN ── */}
          <div className="sec">📍 Ubicación</div>
          <div className="frow">
            <div className="ff w160">
              <label>Dpto <span className="req">(*)</span></label>
              <select value={form.dpto} onChange={e=>f('dpto',e.target.value)}>
                {DEPTOS.map(d=><option key={d} value={d}>{d||'— Seleccione —'}</option>)}
              </select>
            </div>
            <div className="ff w160">
              <label>Provincia <span className="req">(*)</span></label>
              <select value={form.provincia} onChange={e=>f('provincia',e.target.value)}>
                {PROVINCIAS_LIMA.map(p=><option key={p} value={p}>{p||'— Seleccione —'}</option>)}
              </select>
            </div>
            <div className="ff w200">
              <label>Distrito <span className="req">(*)</span></label>
              <select value={form.distrito} onChange={e=>f('distrito',e.target.value)}>
                {DISTRITOS_LIMA.map(d=><option key={d} value={d}>{d||'— Seleccione —'}</option>)}
              </select>
            </div>
          </div>
          <div className="frow">
            <div className="ff wfull">
              <label>Direccion</label>
              <input type="text" value={form.direccion} onChange={e=>f('direccion',e.target.value)} placeholder="Dirección completa" />
            </div>
          </div>

          {/* ── CONTACTO ── */}
          <div className="sec">📞 Contacto</div>
          <div className="frow">
            <div className="ff w130">
              <label>Fijo</label>
              <input type="text" value={form.telefono} onChange={e=>f('telefono',e.target.value)} />
            </div>
            <div className="ff w130">
              <label>Celular</label>
              <input type="text" value={form.celular1} onChange={e=>f('celular1',e.target.value)} />
            </div>
            <div className="ff w130">
              <label>Celular 2</label>
              <input type="text" value={form.celular2} onChange={e=>f('celular2',e.target.value)} />
            </div>
            <div className="ff w240">
              <label>Web</label>
              <input type="text" value={form.web} onChange={e=>f('web',e.target.value)} placeholder="https://..." />
            </div>
            <div className="ff w240">
              <label>E-mail</label>
              <input type="email" value={form.email} onChange={e=>f('email',e.target.value)} />
            </div>
          </div>
          <div className="frow">
            <div className="ff w240">
              <label>Responsable</label>
              <select value={form.responsable} onChange={e=>f('responsable',e.target.value)}>
                {RESPONSABLES.map(r=><option key={r} value={r}>{r||'— Seleccione —'}</option>)}
              </select>
            </div>
            <div className="ff w130">
              <label>Mostrar en Web</label>
              <select value={form.mostrarWeb} onChange={e=>f('mostrarWeb',e.target.value)}>
                <option>No</option><option>Si</option>
              </select>
            </div>
            <div className="ff w100">
              <label>Mapa ID</label>
              <input type="text" value={form.mapaId} onChange={e=>f('mapaId',e.target.value)} />
            </div>
          </div>

          {/* ── SUNAT / SOL ── */}
          <div className="sec warn">🔐 Credenciales SUNAT / SOL</div>
          <div className="frow">
            <div className="ff w160">
              <label>Usuario - SOL</label>
              <input type="password" value={form.sol_usuario} readOnly />
            </div>
            <div className="ff w160">
              <label>Clave - SOL</label>
              <input type="password" value={form.sol_clave} readOnly />
            </div>
            <div className="ff w100">
              <label>Nro Local</label>
              <input type="text" value={form.sol_nroLocal} readOnly />
            </div>
            <div className="ff w200">
              <label>Correo</label>
              <input type="text" value={form.correo} readOnly />
            </div>
            <div className="ff w160">
              <label>Correo - Clave</label>
              <input type="password" value={form.correo_clave} readOnly />
            </div>
            <div className="ff w200">
              <label>Correo - Servidor</label>
              <input type="text" value={form.correo_servidor} readOnly />
            </div>
          </div>
          <div className="frow">
            <div className="ff w300">
              <label>URL - Custodia Electrónica</label>
              <input type="text" value={form.urlCustodia} readOnly />
            </div>
            <div className="ff w200">
              <label>SUNAT - GR - api(id)</label>
              <input type="text" value={form.sunatGrId} readOnly />
            </div>
            <div className="ff w200">
              <label>SUNAT - GR - api(secret)</label>
              <input type="text" value={form.sunatGrSecret} readOnly />
            </div>
          </div>
          <div className="frow">
            <div className="ff w200">
              <label>SUNAT - CONSULTA - api(id)</label>
              <input type="text" value={form.sunatConsId} readOnly />
            </div>
            <div className="ff w200">
              <label>SUNAT - CONSULTA - api(clave)</label>
              <input type="text" value={form.sunatConsClave} readOnly />
            </div>
            <div className="ff w200">
              <label>Api DNI</label>
              <input type="text" value={form.apiDni} onChange={e=>f('apiDni',e.target.value)} placeholder="Token API DNI/RENIEC" />
            </div>
          </div>

          {/* ── IMÁGENES ── */}
          <div className="sec">🖼️ Imágenes</div>
          <div className="frow">
            <div className="ff w300">
              <label>Imagen del Local</label>
              <input type="file" accept="image/*" onChange={e=>f('imgLocal',e.target.files[0]?.name||'')} />
            </div>
          </div>
          <div className="frow" style={{alignItems:'center'}}>
            <div className="ff w380">
              <label>
                Imagen PDF top - Logo &nbsp;
                <label style={{fontWeight:'normal',fontSize:12,display:'inline-flex',alignItems:'center',gap:4,cursor:'pointer'}}>
                  <input type="checkbox" style={{width:13,height:13}} checked={form.logoBlanco||false} onChange={e=>f('logoBlanco',e.target.checked)} />
                  &nbsp;En blanco
                </label>
              </label>
              <div className="img-row">
                {form.sucursal==='Tienda1' && (
                  <a href="https://gkmtechnology.com/eagle/sucursal/logogog.png" target="_blank" rel="noreferrer">
                    <img src="https://gkmtechnology.com/eagle/sucursal/logogog.png" alt="logo" className="img-prev" />
                  </a>
                )}
                <input type="file" accept="image/*" onChange={e=>f('imgLogo',e.target.files[0]?.name||'')} />
              </div>
            </div>
          </div>
          <div className="frow" style={{alignItems:'center'}}>
            <div className="ff w380">
              <label>Imagen PDF pie</label>
              <div className="img-row">
                {form.sucursal==='Tienda1' && (
                  <a href="https://gkmtechnology.com/eagle/sucursal/pie.gif" target="_blank" rel="noreferrer">
                    <img src="https://gkmtechnology.com/eagle/sucursal/pie.gif" alt="pie" className="img-prev" />
                  </a>
                )}
                <input type="file" accept="image/*" onChange={e=>f('imgPie',e.target.files[0]?.name||'')} />
              </div>
            </div>
          </div>

          {/* ── ACCIONES ── */}
          <hr style={{borderColor:'#dee2e6',margin:'20px 0 0'}} />
          <div className="actions">
            <button className="btn-save" onClick={guardar}>💾 Guardar</button>
            {!esNuevo && <button className="btn-del" onClick={()=>eliminar(form.id)}>✕ Eliminar</button>}
            <button className="btn-back" onClick={()=>setVista('lista')}>↩ Regresar</button>
          </div>

        </div>
      </div>
    </>
  );
}