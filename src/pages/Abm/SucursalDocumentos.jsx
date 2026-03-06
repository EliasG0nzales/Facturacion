import { useState } from "react";

const SUCURSALES = [
  { value:'1', label:'Tienda1:Tienda 1b 133' },
  { value:'2', label:'Tienda2:Tienda 1A 119' },
  { value:'3', label:'Almacen 1:Almacen 2B 167' },
];

const DOCUMENTOS = ['Factura','Boleta','Nota de Venta','Guia de Remision','Nota de Debito','Nota de Credito','Retencion','Percepcion'];
const IMPRIMIR   = ['Ticket','Otros'];

const S = `
  @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  .sd{padding:20px;font-family:Arial,Helvetica,sans-serif;font-size:13px;animation:fadeIn .25s ease}
  .sd *{box-sizing:border-box}
  .sd-title{font-size:16px;font-weight:bold;color:#333;border-bottom:2px solid #00A3E1;padding-bottom:6px;margin-bottom:16px}
  .toolbar{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;align-items:center}
  .btn-new {background:#28a745;border:1px solid #28a745;color:#fff;padding:6px 14px;cursor:pointer;font-size:13px;font-weight:bold;border-radius:4px;display:inline-flex;align-items:center;gap:5px}
  .btn-new:hover{background:#218838}
  .btn-srch{background:#17a2b8;border:1px solid #17a2b8;color:#fff;padding:6px 14px;cursor:pointer;font-size:13px;font-weight:bold;border-radius:4px;display:inline-flex;align-items:center;gap:5px}
  .btn-srch:hover{background:#138496}
  .btn-save{background:#17a2b8;border:1px solid #17a2b8;color:#fff;padding:6px 14px;cursor:pointer;font-size:13px;font-weight:bold;border-radius:4px;display:inline-flex;align-items:center;gap:5px}
  .btn-save:hover{background:#138496}
  .btn-del {background:#dc3545;border:1px solid #dc3545;color:#fff;padding:6px 14px;cursor:pointer;font-size:13px;font-weight:bold;border-radius:4px;display:inline-flex;align-items:center;gap:5px}
  .btn-del:hover{background:#c82333}
  .btn-back{background:#6c757d;border:1px solid #6c757d;color:#fff;padding:6px 14px;cursor:pointer;font-size:13px;font-weight:bold;border-radius:4px;display:inline-flex;align-items:center;gap:5px}
  .btn-back:hover{background:#5a6268}
  .btn-icon{background:none;border:none;cursor:pointer;font-size:15px;padding:2px 5px;border-radius:3px}
  .btn-icon:hover{background:#e0e0e0}
  table{width:100%;border-collapse:collapse;font-size:13px;margin-top:8px}
  thead tr{background:#17a2b8}
  thead th{padding:10px 8px;text-align:left;font-weight:bold;color:#fff}
  tbody tr:nth-child(odd){background:#F2F2EC}
  tbody tr:nth-child(even){background:#fff}
  tbody tr:hover{background:#CCFF66!important}
  tbody td{padding:8px 8px;color:#212529}
  .empty{text-align:center;color:#888;padding:30px}
  .ok{background:#d4edda;border:1px solid #c3e6cb;color:#155724;padding:8px 14px;border-radius:4px;margin-bottom:12px;font-size:13px;display:inline-block}
  .er{background:#f8d7da;border:1px solid #f5c6cb;color:#721c24;padding:8px 14px;border-radius:4px;margin-bottom:12px;font-size:13px;display:inline-block}
  .srch-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;background:#f8f9fa;border:1px solid #dee2e6;padding:10px 14px;border-radius:6px;margin-bottom:14px}
  .srch-row label{font-weight:bold;font-size:13px;color:#333;white-space:nowrap}
  .srch-row select,.srch-row input{padding:5px 8px;border:1px solid #ced4da;border-radius:4px;font-size:13px;color:#212529;background:#fff}
  .fbox{background:#fff;border:1px solid #dee2e6;border-radius:6px;padding:22px}
  .ftitle{font-size:15px;font-weight:bold;border-bottom:2px solid #00A3E1;padding-bottom:8px;margin-bottom:18px;color:#333}
  .sec{font-weight:bold;font-size:12px;background:#f0f0f0;border-left:3px solid #17a2b8;padding:6px 12px;margin:18px 0 12px;color:#333}
  .frow{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:12px;align-items:flex-end}
  .ff{display:flex;flex-direction:column;gap:3px}
  .ff label{font-weight:bold;font-size:12px;color:#333}
  .ff input,.ff select{padding:5px 8px;border:1px solid #ced4da;border-radius:4px;font-size:13px;color:#212529;background:#fff;width:100%}
  .ff input:focus,.ff select:focus{border-color:#80bdff;outline:none;box-shadow:0 0 0 .15rem rgba(0,123,255,.2)}
  .ff textarea{padding:5px 8px;border:1px solid #ced4da;border-radius:4px;font-size:13px;color:#212529;background:#fff;width:100%;height:60px;resize:vertical}
  .req{color:#dc3545}
  .w100{width:100px}.w130{width:130px}.w160{width:160px}.w200{width:200px}.w280{width:280px}.w340{width:340px}.wfull{width:100%}
  .badge-si{background:#28a745;color:#fff;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:bold}
  .badge-no{background:#6c757d;color:#fff;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:bold}
  .actions{display:flex;gap:8px;margin-top:20px;flex-wrap:wrap;justify-content:center}
`;

const INIT = [
  { id:7,  sucursal:'Almacen 1:Almacen 2B 167', documento:'Guia de Remision', serie:'003',  predet:'No', imprimir:'Ticket', correlativo:1, estado:'Activo', obs:'' },
  { id:5,  sucursal:'Tienda2:Tienda 1A 119',     documento:'Factura',          serie:'FI02', predet:'No', imprimir:'Ticket', correlativo:1, estado:'Activo', obs:'' },
  { id:6,  sucursal:'Tienda2:Tienda 1A 119',     documento:'Boleta',           serie:'BI02', predet:'No', imprimir:'Ticket', correlativo:1, estado:'Activo', obs:'' },
  { id:8,  sucursal:'Tienda2:Tienda 1A 119',     documento:'Guia de Remision', serie:'002',  predet:'No', imprimir:'Ticket', correlativo:1, estado:'Activo', obs:'' },
  { id:1,  sucursal:'Tienda1:Tienda 1b 133',     documento:'Factura',          serie:'FI01', predet:'No', imprimir:'Ticket', correlativo:1, estado:'Activo', obs:'' },
  { id:2,  sucursal:'Tienda1:Tienda 1b 133',     documento:'Boleta',           serie:'BI01', predet:'Si', imprimir:'Ticket', correlativo:1, estado:'Activo', obs:'' },
  { id:3,  sucursal:'Tienda1:Tienda 1b 133',     documento:'Nota de Venta',    serie:'001',  predet:'No', imprimir:'Ticket', correlativo:1, estado:'Activo', obs:'' },
  { id:4,  sucursal:'Tienda1:Tienda 1b 133',     documento:'Guia de Remision', serie:'TI01', predet:'No', imprimir:'Ticket', correlativo:1, estado:'Activo', obs:'' },
];

const BLANK = { sucursal:'', documento:'Factura', serie:'', predet:'No', imprimir:'Ticket', correlativo:1, estado:'Activo', obs:'' };

const CRITERIOS = [
  { value:'',  label:'>>' },
  { value:'1', label:'Sucursal' },
  { value:'2', label:'Documento' },
  { value:'3', label:'Serie' },
  { value:'4', label:'Cod.Sucursal' },
];

export default function SucursalDocumentos() {
  const [vista,   setVista]   = useState('lista');
  const [rows,    setRows]    = useState(INIT);
  const [form,    setForm]    = useState(BLANK);
  const [esNuevo, setEsNuevo] = useState(false);
  const [msg,     setMsg]     = useState({ t:'', x:'' });
  const [crite,   setCrite]   = useState('');
  const [buscar,  setBuscar]  = useState('');

  const flash = (t,x) => { setMsg({t,x}); setTimeout(()=>setMsg({t:'',x:''}),2500); };
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  const abrirNuevo  = () => { setForm({...BLANK}); setEsNuevo(true);  setVista('form'); };
  const abrirEditar = (r) => { setForm({...r});    setEsNuevo(false); setVista('form'); };

  const guardar = () => {
    if (!form.sucursal)      return flash('e','Seleccione Sucursal.');
    if (!form.serie.trim())  return flash('e','El campo Serie es obligatorio.');
    if (esNuevo) setRows(p=>[...p,{...form,id:Date.now()}]);
    else         setRows(p=>p.map(r=>r.id===form.id?{...form}:r));
    flash('o', esNuevo?'Documento creado.':'Documento actualizado.');
    setVista('lista');
  };

  const eliminar = (id) => {
    if (window.confirm('¿Está seguro de eliminar?')) {
      setRows(p=>p.filter(r=>r.id!==id));
      flash('o','Registro eliminado.');
      setVista('lista');
    }
  };

  // Filtro búsqueda
  const filtradas = rows.filter(r => {
    if (!crite || !buscar.trim()) return true;
    const txt = buscar.toLowerCase();
    if (crite==='1') return r.sucursal.toLowerCase().includes(txt);
    if (crite==='2') return r.documento.toLowerCase().includes(txt);
    if (crite==='3') return r.serie.toLowerCase().includes(txt);
    if (crite==='4') return r.sucursal.split(':')[0].toLowerCase().includes(txt);
    return true;
  });

  /* ─── LISTA ────────────────────────────────────────────────────────────── */
  if (vista==='lista') return (
    <>
      <style>{S}</style>
      <div className="sd">
        <div className="sd-title">📄 SUCURSAL &gt; TIPO COMPROBANTE DE PAGO &gt; SERIE</div>
        {msg.x && <div className={msg.t==='o'?'ok':'er'}>{msg.t==='o'?'✅':'⚠️'} {msg.x}</div>}

        {/* Barra búsqueda */}
        <div className="srch-row">
          <label>BUSCAR X</label>
          <select value={crite} onChange={e=>setCrite(e.target.value)}>
            {CRITERIOS.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <input
            type="text"
            placeholder="Ingrese el texto a buscar"
            value={buscar}
            onChange={e=>setBuscar(e.target.value)}
            style={{width:220}}
          />
          <button className="btn-srch">⊛ Buscar</button>
          <button className="btn-new" onClick={abrirNuevo}>✚ Agregar Nuevo</button>
        </div>

        <b>LISTADO GENERAL DE SUCURSALES : DOCUMENTOS</b>
        <table>
          <thead><tr>
            <th>Sucursal</th>
            <th>Documento</th>
            <th>Serie</th>
            <th>Predet.</th>
            <th>Imprimir</th>
            <th style={{width:80,textAlign:'center'}}>Actualizar</th>
          </tr></thead>
          <tbody>
            {filtradas.length===0
              ? <tr><td colSpan={6} className="empty">No hay registros.</td></tr>
              : filtradas.map(r=>(
                <tr key={r.id}>
                  <td>{r.sucursal}</td>
                  <td>{r.documento}</td>
                  <td><b>{r.serie}</b></td>
                  <td>
                    <span className={r.predet==='Si'?'badge-si':'badge-no'}>{r.predet}</span>
                  </td>
                  <td>{r.imprimir}</td>
                  <td style={{textAlign:'center'}}>
                    <button className="btn-icon" title="Actualizar, Eliminar y Imprimir" onClick={()=>abrirEditar(r)}>✏️</button>
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
      <div className="sd">
        {msg.x && <div className={msg.t==='o'?'ok':'er'}>{msg.t==='o'?'✅':'⚠️'} {msg.x}</div>}
        <div className="fbox">
          <div className="ftitle">📄 SUCURSAL : DOCUMENTO — {esNuevo?'NUEVO':'ACTUALIZAR'}</div>

          <div className="sec">📋 Datos del Documento</div>
          <div className="frow">
            <div className="ff w340">
              <label>Sucursal <span className="req">(*)</span></label>
              <select value={form.sucursal} onChange={e=>f('sucursal',e.target.value)}>
                <option value="">— Seleccione —</option>
                {SUCURSALES.map(s=><option key={s.value} value={s.label}>{s.label}</option>)}
              </select>
            </div>
            <div className="ff w200">
              <label>Documento <span className="req">(*)</span></label>
              <select value={form.documento} onChange={e=>f('documento',e.target.value)}>
                {DOCUMENTOS.map(d=><option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="frow">
            <div className="ff w130">
              <label>Serie <span className="req">(*)</span></label>
              <input type="text" value={form.serie} onChange={e=>f('serie',e.target.value)} placeholder="Ej: BI01" />
            </div>
            <div className="ff w130">
              <label>Correlativo</label>
              <input type="number" value={form.correlativo} onChange={e=>f('correlativo',e.target.value)} min="1" />
            </div>
            <div className="ff w160">
              <label>Imprimir</label>
              <select value={form.imprimir} onChange={e=>f('imprimir',e.target.value)}>
                {IMPRIMIR.map(i=><option key={i}>{i}</option>)}
              </select>
            </div>
            <div className="ff w130">
              <label>Predeterminado</label>
              <select value={form.predet} onChange={e=>f('predet',e.target.value)}>
                <option>No</option>
                <option>Si</option>
              </select>
            </div>
            <div className="ff w130">
              <label>Estado</label>
              <select value={form.estado} onChange={e=>f('estado',e.target.value)}>
                <option>Activo</option>
                <option>Inactivo</option>
              </select>
            </div>
          </div>
          <div className="frow">
            <div className="ff wfull">
              <label>Observación</label>
              <textarea value={form.obs} onChange={e=>f('obs',e.target.value)} placeholder="Notas adicionales..." />
            </div>
          </div>

          <hr style={{borderColor:'#dee2e6',margin:'18px 0 0'}} />
          <div className="actions">
            <button className="btn-save" onClick={guardar}>💾 Guardar</button>
            {!esNuevo && <button className="btn-del" onClick={()=>eliminar(form.id)}>✕ Eliminar</button>}
            <button className="btn-back" onClick={()=>setVista('lista')}>↩ Regresar</button>
          </div>
        </div>

        {/* ── CUADRO INFORMATIVO DE SERIES ── */}
        <div style={{marginTop:20,background:'#fff',border:'1px solid #dee2e6',borderRadius:6,padding:'16px 20px',fontSize:13,color:'#212529'}}>
          <b>Ejemplo De Serie Por Tipo De Comprobante De Pago O Documento</b>
          <div style={{marginTop:10,lineHeight:'1.9'}}>
            <div>Factura: <b>FI01, FI02, ...</b></div>
            <div>Boleta de Venta: <b>BI01, BI02, ...</b></div>
            <div>Guia de Remision: <b>TI01, TI02, ...</b></div>
            <div>Nota de Debito: <b>BD01</b> = boleta &nbsp;/&nbsp; <b>FD01</b> = factura</div>
            <div>Nota de Credito: <b>BC01</b> = boleta &nbsp;/&nbsp; <b>FC01</b> = factura</div>
            <div>Nota de Venta: <b>0001, 0002, ...</b></div>
          </div>
          <div style={{marginTop:10,color:'#555',fontStyle:'italic'}}>
            Las series mencionadas garantizan la validez y el cumplimiento de las normativas de SUNAT.
          </div>
        </div>

      </div>
    </>
  );
}