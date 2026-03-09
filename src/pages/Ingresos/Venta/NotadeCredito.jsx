import { useState, useRef } from "react";

/* ─── DATOS DEMO ─── */
const NC_INI = [
  { id:1, venta:'FI01-000041', ncredito:'NC01-000001', fecha:'2026-02-12',
    cliente:'Empresa SAC', vendedor:'Iturri, Quispe, Smith',
    sunat:'BETA', estado:'Borrador', docmto:'Factura NC', sucursal:'1',
    motivo:'Anulación de la operación', dolares:'', soles:'540.00' },
  { id:2, venta:'BI01-000023', ncredito:'NC01-000002', fecha:'2026-02-20',
    cliente:'García López, María', vendedor:'Merino, Cahuna, Wilver Enmanuel',
    sunat:'OK', estado:'Aceptado', docmto:'Boleta NC', sucursal:'2',
    motivo:'Anulación de la operación', dolares:'', soles:'120.00' },
  { id:3, venta:'001-000018', ncredito:'NC01-000003', fecha:'2026-03-02',
    cliente:'Alexander Paul, Moran Alburqueque', vendedor:'Romero, Merino, Alexander Renson',
    sunat:'ERROR', estado:'Borrador', docmto:'Factura NC', sucursal:'3',
    motivo:'Descuentos y bonificaciones', dolares:'30.00', soles:'250.00' },
];

const CLIENTES_DB = [
  { id:1, nombre:'Empresa SAC',                    ruc:'20512345678', dir:'Av. Lima 123', email:'empresa@sac.com' },
  { id:2, nombre:'García López, María',             ruc:'10456789012', dir:'Jr. Cusco 456', email:'maria@gmail.com' },
  { id:3, nombre:'Alexander Paul, Moran Alburqueque', ruc:'10234567890', dir:'Calle Los Pinos 789', email:'' },
  { id:4, nombre:'Luis Alexander, Quispe Ayala',   ruc:'10678901234', dir:'Av. Arequipa 321', email:'' },
];

const MOTIVOS_NC = [
  'Anulación de la operación',
  'Anulación por error en el RUC',
  'Corrección por error en la descripción',
  'Descuento global',
  'Devolución total',
  'Bonificación',
  'Disminución en el valor',
  'Otros Conceptos',
];

const SERIES_NC = ['NC01','NC02','BC01','FC01'];
const ESTADOS_NC   = ['Borrador','Aceptado','Anulado','Enviado SUNAT'];
const SUNAT_COLOR  = { OK:'#28a745', ERROR:'#dc3545', BETA:'#6c757d', Enviado:'#17a2b8' };
const ESTADO_COLOR = { Borrador:'#6c757d', Aceptado:'#28a745', Anulado:'#dc3545', 'Enviado SUNAT':'#17a2b8' };

const hoy      = new Date().toISOString().split('T')[0];
const fmtFecha = iso => { if(!iso) return ''; const [y,m,d]=iso.split('-'); return `${d}/${m}/${y}`; };
const sumSoles   = list => list.reduce((s,n)=>s+parseFloat(n.soles||0),0).toFixed(2);
const sumDolares = list => list.reduce((s,n)=>s+parseFloat(n.dolares||0),0).toFixed(2);

const css = `
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#212529;}

  /* ── barra búsqueda ── */
  .nc-bar{display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;margin-bottom:18px;}
  .nc-bar label{font-size:12px;font-weight:bold;display:block;margin-bottom:3px;color:#555;}
  .nc-bar input[type=text]{padding:5px 10px;border:1px solid #ced4da;border-radius:4px;
    font-size:13px;color:#212529;background:#fff;}
  .nc-bar select{padding:4px 6px;border:1px solid #ced4da;border-radius:4px;
    font-size:12px;color:#212529;background:#fff;height:28px;}
  .nc-radio-group{display:flex;gap:12px;align-items:center;flex-wrap:wrap;font-size:13px;}
  .nc-radio-group label{display:flex;align-items:center;gap:4px;cursor:pointer;font-weight:bold;color:#212529;}
  .nc-radio-group input[type=radio]{accent-color:#17a2b8;width:14px;height:14px;}
  .nc-date-wrap{display:flex;align-items:center;gap:5px;border:1px solid #ced4da;
    border-radius:4px;padding:4px 8px;background:#fff;height:32px;min-width:130px;}
  .nc-date-wrap span.nc-dt{font-size:13px;color:#212529;min-width:85px;}
  .btn-nc{border:none;color:#fff;padding:7px 14px;border-radius:4px;cursor:pointer;
    font-size:13px;font-weight:bold;display:inline-flex;align-items:center;gap:5px;}
  .btn-nc:hover{opacity:.88;}

  /* ── tabla ── */
  .nc-titulo{text-align:center;font-weight:bold;font-size:14px;margin-bottom:8px;letter-spacing:.5px;}
  table.tnc{width:100%;border-collapse:collapse;font-size:13px;}
  table.tnc thead tr{background:#003d6b;}
  table.tnc thead th{padding:10px 8px;text-align:center;color:#fff;font-weight:bold;
    font-size:12px;letter-spacing:.3px;}
  table.tnc tbody tr{border-bottom:1px solid #dee2e6;background:#fff;}
  table.tnc tbody tr:hover{background:#e8f4f8;}
  table.tnc tbody td{padding:8px 8px;vertical-align:middle;color:#212529;}
  table.tnc tfoot tr{background:#003d6b;}
  table.tnc tfoot td{padding:9px 8px;font-weight:bold;color:#fff;font-size:13px;}
  .badge{padding:3px 9px;border-radius:12px;font-size:11px;font-weight:bold;color:#fff;display:inline-block;}
  .ic-nc{background:none;border:none;cursor:pointer;padding:2px 3px;
    display:inline-flex;align-items:center;border-radius:4px;}
  .ic-nc:hover{opacity:.8;transform:scale(1.15);}
  .leyenda-nc{font-size:12px;color:#444;margin-top:14px;display:flex;flex-wrap:wrap;gap:14px;align-items:center;}

  /* ── vista NUEVO ── */
  .ncnuevo-wrap{max-width:900px;}
  .ncnuevo-titulo{font-size:18px;font-weight:bold;margin-bottom:18px;color:#212529;}
  .ncnuevo-row{display:grid;gap:12px;margin-bottom:14px;}
  .ncnuevo-label{font-size:12px;font-weight:bold;margin-bottom:3px;color:#555;}
  .ncnuevo-inp{padding:6px 10px;border:1px solid #ced4da;border-radius:4px;
    font-size:13px;color:#212529;background:#fff;width:100%;}
  .ncnuevo-inp-verde{padding:6px 10px;border:2px solid #28a745;border-radius:4px;
    font-size:13px;color:#212529;background:#ccff99;width:100%;}
  .ncnuevo-inp[readonly],.ncnuevo-inp[readOnly]{background:#f8f9fa;}
  .busca-cli-wrap{position:relative;display:flex;align-items:center;gap:6px;}
  .busca-cli-wrap input{flex:1;}

  /* ── modales ── */
  .mnc-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:3000;
    display:flex;align-items:center;justify-content:center;}
  .mnc-box{background:#fff;border-radius:8px;min-width:500px;max-width:650px;
    width:92%;box-shadow:0 8px 32px rgba(0,0,0,.25);overflow:hidden;}
  .mnc-head{padding:13px 20px;display:flex;justify-content:space-between;
    align-items:center;color:#fff;font-weight:bold;font-size:15px;}
  .mnc-body{padding:20px;max-height:74vh;overflow-y:auto;}
  .mnc-footer{padding:12px 20px;display:flex;gap:10px;justify-content:flex-end;
    border-top:1px solid #dee2e6;background:#f8f9fa;}
  .mnc-btn{padding:7px 20px;border:none;border-radius:4px;cursor:pointer;
    font-size:13px;font-weight:bold;color:#fff;}
  .mnc-row{display:flex;gap:10px;margin-bottom:12px;align-items:center;}
  .mnc-label{font-weight:bold;font-size:13px;min-width:130px;color:#555;}
  .mnc-val{font-size:13px;color:#212529;}
  .mnc-inp{padding:6px 10px;border:1px solid #ced4da;border-radius:4px;
    font-size:13px;color:#212529;background:#fff;width:100%;}

  /* ── alerts ── */
  .alert-ok{background:#d4edda;border:1px solid #c3e6cb;color:#155724;
    padding:8px 14px;border-radius:4px;margin-bottom:12px;font-size:13px;}
  .alert-err{background:#f8d7da;border:1px solid #f5c6cb;color:#721c24;
    padding:8px 14px;border-radius:4px;margin-bottom:12px;font-size:13px;}
  @media print{ .no-print{display:none!important;} }
`;

const IcoCal = () => (
  <svg width="18" height="18" viewBox="0 0 36 36" fill="none">
    <rect x="1" y="4" width="34" height="30" rx="3" fill="#fff" stroke="#bbb" strokeWidth="1.5"/>
    <rect x="1" y="4" width="34" height="9" rx="3" fill="#e74c3c"/>
    <rect x="1" y="9" width="34" height="4" fill="#e74c3c"/>
    <rect x="10" y="1" width="3" height="7" rx="1.5" fill="#888"/>
    <rect x="23" y="1" width="3" height="7" rx="1.5" fill="#888"/>
  </svg>
);

const DP = ({ id, value, onChange, verde }) => {
  const ref = useRef();
  return (
    <div className="nc-date-wrap" style={verde ? {border:'2px solid #28a745',background:'#ccff99'} : {}}>
      <span className="nc-dt" style={verde ? {color:'#212529',fontWeight:'bold'} : {}}>
        {value || ''}
      </span>
      <span style={{cursor:'pointer'}} onClick={()=>ref.current.showPicker?.()??ref.current.click()}>
        <IcoCal/>
      </span>
      <input ref={ref} id={id} type="date" value={value} onChange={e=>onChange(e.target.value)}
        style={{opacity:0,width:1,height:1,position:'absolute',pointerEvents:'none'}}/>
    </div>
  );
};

/* ══════════════════════════════════════════════ */
export default function NotaCredito() {
  /* ── vista: 'lista' | 'nuevo' | 'editar' ── */
  const [vista,   setVista]   = useState('lista');
  const [ncs,     setNcs]     = useState(NC_INI);
  const [alert,   setAlert]   = useState('');

  /* ── filtros lista ── */
  const [bDocmto, setBDocmto] = useState('');
  const [bSucur,  setBSucur]  = useState('');
  const [bTipo,   setBTipo]   = useState('1');
  const [bq,      setBq]      = useState('');
  const [bfi,     setBfi]     = useState('');
  const [bff,     setBff]     = useState('');

  /* ── modal editar/imprimir ── */
  const [modal,   setModal]   = useState(null);
  const [mMotivo, setMMotivo] = useState('');
  const [mEstado, setMEstado] = useState('');
  const [mFecha,  setMFecha]  = useState(hoy);
  const [mDol,    setMDol]    = useState('');
  const [mSol,    setMSol]    = useState('');
  const [mObs,    setMObs]    = useState('');

  /* ── formulario NUEVO ── */
  const [nMotivo,  setNMotivo]  = useState('Anulación de la operación');
  const [nBusqCli, setNBusqCli] = useState('');
  const [nCliNom,  setNCliNom]  = useState('');
  const [nCliDir,  setNCliDir]  = useState('');
  const [nCliEmail,setNCliEmail]= useState('');
  const [nSerie,   setNSerie]   = useState('NC01');
  const [nNro,     setNNro]     = useState('1');
  const [nFecha,   setNFecha]   = useState(hoy);
  const [nDetalle, setNDetalle] = useState('');
  const [nMonto,   setNMonto]   = useState('');
  const [nCliRes,  setNCliRes]  = useState([]);

  const resetNuevo = () => {
    setNMotivo('Anulación de la operación'); setNBusqCli(''); setNCliNom('');
    setNCliDir(''); setNCliEmail(''); setNSerie('NC01');
    setNNro(String(ncs.length+2)); setNFecha(hoy);
    setNDetalle(''); setNMonto(''); setNCliRes([]);
  };

  const abrirNuevo = () => { resetNuevo(); setVista('nuevo'); };

  const buscarCliente = () => {
    if (!nBusqCli) return;
    const q = nBusqCli.toLowerCase();
    setNCliRes(CLIENTES_DB.filter(c =>
      c.nombre.toLowerCase().includes(q) || c.ruc.includes(q)
    ));
  };

  const selCliente = c => {
    setNCliNom(c.nombre); setNCliDir(c.dir); setNCliEmail(c.email||'');
    setNCliRes([]);
  };

  const guardarNuevo = () => {
    if (!nCliNom) { setAlert('err:Ingrese el cliente'); return; }
    if (!nDetalle){ setAlert('err:Ingrese el detalle'); return; }
    const nueva = {
      id: Date.now(),
      venta: '—',
      ncredito: `${nSerie}-${String(nNro).padStart(6,'0')}`,
      fecha: nFecha,
      cliente: nCliNom,
      vendedor: 'Iturri, Quispe, Smith',
      sunat: 'BETA',
      estado: 'Borrador',
      docmto: nSerie.startsWith('BC') ? 'Boleta NC' : 'Factura NC',
      sucursal: '1',
      motivo: nMotivo,
      dolares: '',
      soles: nMonto || '0.00',
    };
    setNcs(prev => [nueva, ...prev]);
    setAlert('ok:Nota de Crédito creada correctamente.');
    setTimeout(()=>setAlert(''), 3500);
    setVista('lista');
  };

  /* ── filtrado ── */
  const listaFilt = ncs.filter(n => {
    if (bDocmto && !n.docmto.includes(bDocmto)) return false;
    if (bSucur  && n.sucursal !== bSucur)        return false;
    if (bq) {
      const q = bq.toLowerCase();
      if (bTipo==='1' && !n.venta.toLowerCase().includes(q))    return false;
      if (bTipo==='2' && !n.cliente.toLowerCase().includes(q))  return false;
      if (bTipo==='3' && !n.ncredito.toLowerCase().includes(q)) return false;
    }
    if (bfi && n.fecha < bfi) return false;
    if (bff && n.fecha > bff) return false;
    return true;
  });

  const abrirEditar = nc => {
    setModal({ tipo:'editar', nc });
    setMMotivo(nc.motivo); setMEstado(nc.estado); setMFecha(nc.fecha);
    setMDol(nc.dolares||''); setMSol(nc.soles||''); setMObs('');
  };

  const guardarEditar = () => {
    setNcs(prev => prev.map(n =>
      n.id===modal.nc.id
        ? {...n, motivo:mMotivo, estado:mEstado, fecha:mFecha, dolares:mDol, soles:mSol}
        : n
    ));
    setModal(null);
    setAlert('ok:Nota de Crédito actualizada correctamente.');
    setTimeout(()=>setAlert(''), 3500);
  };

  const eliminar = nc => {
    if (!window.confirm(`¿Eliminar la Nota de Crédito ${nc.ncredito}?`)) return;
    setNcs(prev => prev.filter(n => n.id !== nc.id));
    setModal(null);
    setAlert('ok:Nota de Crédito eliminada.');
    setTimeout(()=>setAlert(''), 3000);
  };

  /* ════════════════════════════════════════════ */
  /* RENDER                                       */
  /* ════════════════════════════════════════════ */
  return (
    <>
      <style>{css}</style>

      {alert && (
        <div className={alert.startsWith('ok:') ? 'alert-ok' : 'alert-err'}>
          {alert.startsWith('ok:') ? '✅ ' : '⚠️ '}{alert.slice(3)}
        </div>
      )}

      {/* ════ VISTA LISTA ════ */}
      {vista === 'lista' && (<>

        {/* título */}
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}} className="no-print">
          <span style={{background:'#0099ff',color:'#fff',borderRadius:'50%',width:22,height:22,
            display:'inline-flex',alignItems:'center',justifyContent:'center',
            fontSize:13,fontWeight:'bold',cursor:'pointer'}} title="Ayuda">?</span>
          <span style={{fontSize:16,fontWeight:'bold'}}>Nota de Credito</span>
        </div>

        {/* barra búsqueda */}
        <div className="nc-bar no-print">
          <div>
            <div style={{fontWeight:'bold',fontSize:13,marginBottom:4}}>BUSCAR X</div>
            <div style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap',marginBottom:6}}>
              <select value={bDocmto} onChange={e=>setBDocmto(e.target.value)}>
                <option value="">Docum ▾</option>
                <option value="Boleta NC">Boleta NC</option>
                <option value="Factura NC">Factura NC</option>
              </select>
              <select value={bSucur} onChange={e=>setBSucur(e.target.value)}>
                <option value="">Sucursal ▾</option>
                <option value="3">Almacen 1</option>
                <option value="2">Tienda2</option>
                <option value="1">Tienda1</option>
              </select>
              <div className="nc-radio-group">
                {[['1','Nro doc.'],['2','clientes'],['3','Nro Credito']].map(([v,l])=>(
                  <label key={v}>
                    <input type="radio" name="ncTipo" value={v}
                      checked={bTipo===v} onChange={()=>setBTipo(v)}/> {l} /
                  </label>
                ))}
              </div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <input type="text" value={bq} onChange={e=>setBq(e.target.value)}
                placeholder="" style={{width:280}}/>
              <span style={{fontWeight:'bold',fontSize:13}}>y/o</span>
            </div>
          </div>

          <div><label>Fecha Inicio</label><DP id="ncFI" value={bfi} onChange={setBfi}/></div>
          <div><label>Fecha Fin</label><DP id="ncFF" value={bff} onChange={setBff}/></div>

          <button className="btn-nc" style={{background:'#17a2b8',border:'1px solid #138496'}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2"/>
            </svg>
            Buscar
          </button>
          <button className="btn-nc" style={{background:'#17a2b8',border:'1px solid #138496'}}
            onClick={()=>window.location.href='/venta'} title="Ir a Ventas">
            <span style={{fontSize:16,fontWeight:'bold',lineHeight:1}}>+</span>
          </button>
          <button className="btn-nc" style={{background:'#17a2b8',border:'1px solid #138496'}}
            onClick={abrirNuevo}>
            Nuevo
          </button>
        </div>

        {/* tabla */}
        <div className="nc-titulo">LISTADO GENERAL &nbsp; NOTA DE CREDITO</div>
        <table className="tnc">
          <thead>
            <tr>
              <th>VENTA</th><th>N.Credito</th><th>Fecha</th><th>Cliente</th>
              <th>Vendedor</th><th>Sunat</th><th>Estado</th><th></th>
              <th width="8%">Opciones</th>
            </tr>
          </thead>
          <tbody>
            {listaFilt.length === 0
              ? <tr><td colSpan={9} align="center" style={{padding:20,color:'#888'}}>Sin registros</td></tr>
              : listaFilt.map(n=>(
                <tr key={n.id}>
                  <td><b>{n.venta}</b></td>
                  <td>{n.ncredito}</td>
                  <td align="center">{fmtFecha(n.fecha)}</td>
                  <td>{n.cliente}</td>
                  <td>{n.vendedor}</td>
                  <td align="center">
                    <span className="badge" style={{background:SUNAT_COLOR[n.sunat]||'#6c757d'}}>{n.sunat}</span>
                  </td>
                  <td align="center">
                    <span className="badge" style={{background:ESTADO_COLOR[n.estado]||'#6c757d'}}>{n.estado}</span>
                  </td>
                  <td></td>
                  <td align="center" style={{whiteSpace:'nowrap'}}>
                    <button className="ic-nc no-print" title="Actualizar, Eliminar" onClick={()=>abrirEditar(n)}>
                      <span style={{background:'#e67e22',color:'#fff',borderRadius:4,padding:'3px 7px',fontSize:13,fontWeight:'bold'}}>✏</span>
                    </button>
                    <button className="ic-nc no-print" title="Imprimir"
                      onClick={()=>setModal({tipo:'imprimir',nc:n})} style={{marginLeft:4}}>
                      <span style={{background:'#555',color:'#fff',borderRadius:4,padding:'3px 7px',fontSize:13}}>🖨</span>
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
          <tfoot>
            <tr>
              <td><b>Total</b></td><td></td><td></td>
              <td align="right"><b>US$ {sumDolares(listaFilt)}</b></td>
              <td></td><td></td><td></td>
              <td align="right"><b>S/ {sumSoles(listaFilt)}</b></td>
              <td></td>
            </tr>
          </tfoot>
        </table>

        {/* leyenda */}
        <hr style={{border:'none',borderTop:'1px solid #dee2e6',margin:'14px 0 8px'}} className="no-print"/>
        <div className="leyenda-nc no-print">
          <b>Leyenda de OPCIONES :</b>
          <span style={{display:'flex',alignItems:'center',gap:4}}>
            <span style={{background:'#e67e22',color:'#fff',borderRadius:4,padding:'2px 7px',fontSize:13,fontWeight:'bold'}}>✏</span>
            <span>Actualizar, Eliminar</span>
          </span>
          <span style={{display:'flex',alignItems:'center',gap:4}}>
            <span style={{background:'#555',color:'#fff',borderRadius:4,padding:'2px 7px',fontSize:13}}>🖨</span>
            <span>Imprimir</span>
          </span>
        </div>
      </>)}

      {/* ════ VISTA NUEVO ════ */}
      {vista === 'nuevo' && (
        <div className="ncnuevo-wrap">
          <div className="ncnuevo-titulo">NOTA DE CREDITO : NUEVO</div>

          {/* Motivo */}
          <div style={{marginBottom:16}}>
            <div className="ncnuevo-label">Motivo de Emision de nota de Credito</div>
            <select className="ncnuevo-inp" style={{maxWidth:400}}
              value={nMotivo} onChange={e=>setNMotivo(e.target.value)}>
              {MOTIVOS_NC.map(m=><option key={m}>{m}</option>)}
            </select>
          </div>

          {/* Fila cliente */}
          <div style={{display:'grid',gridTemplateColumns:'220px 1fr 1fr 1fr',gap:12,marginBottom:16}}>
            <div>
              <div className="ncnuevo-label">CLIENTE</div>
              <div className="busca-cli-wrap">
                <input className="ncnuevo-inp" placeholder="Busca data/sunat/reniec"
                  value={nBusqCli} onChange={e=>setNBusqCli(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&buscarCliente()}/>
                <button onClick={buscarCliente}
                  style={{background:'none',border:'none',cursor:'pointer',padding:0,
                    display:'inline-flex',alignItems:'center',flexShrink:0}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="7" stroke="#17a2b8" strokeWidth="2.2"/>
                    <path d="M21 21l-4.35-4.35" stroke="#17a2b8" strokeWidth="2.2"/>
                  </svg>
                </button>
              </div>
              {/* dropdown resultados */}
              {nCliRes.length > 0 && (
                <div style={{position:'absolute',zIndex:100,background:'#fff',
                  border:'1px solid #ced4da',borderRadius:4,boxShadow:'0 4px 12px rgba(0,0,0,.15)',
                  minWidth:280,maxHeight:180,overflowY:'auto'}}>
                  {nCliRes.map(c=>(
                    <div key={c.id} onClick={()=>selCliente(c)}
                      style={{padding:'7px 12px',cursor:'pointer',fontSize:13,
                        borderBottom:'1px solid #f0f0f0',color:'#212529'}}
                      onMouseEnter={e=>e.currentTarget.style.background='#e8f4f8'}
                      onMouseLeave={e=>e.currentTarget.style.background='#fff'}>
                      <b>{c.nombre}</b> — {c.ruc}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <div className="ncnuevo-label">CLIENTE (Razon Social / Nombre): (*)</div>
              <input className="ncnuevo-inp" value={nCliNom}
                onChange={e=>setNCliNom(e.target.value)}/>
            </div>
            <div>
              <div className="ncnuevo-label">CLIENTE (Direccion) :</div>
              <input className="ncnuevo-inp" value={nCliDir}
                onChange={e=>setNCliDir(e.target.value)}/>
            </div>
            <div>
              <div className="ncnuevo-label">CLIENTE (E-mail) :</div>
              <input className="ncnuevo-inp" type="email" value={nCliEmail}
                onChange={e=>setNCliEmail(e.target.value)}/>
            </div>
          </div>

          <hr style={{border:'none',borderTop:'1px solid #dee2e6',marginBottom:16}}/>

          {/* Fila serie/nro/fecha/detalle/monto */}
          <div style={{display:'grid',
            gridTemplateColumns:'120px 100px 200px 1fr 150px 160px',
            gap:12,marginBottom:24,alignItems:'end'}}>
            <div>
              <div className="ncnuevo-label">Serie ..+</div>
              <select className="ncnuevo-inp" value={nSerie} onChange={e=>setNSerie(e.target.value)}>
                {SERIES_NC.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <div className="ncnuevo-label">Nro (*)</div>
              <input className="ncnuevo-inp" value={nNro}
                onChange={e=>setNNro(e.target.value)}/>
            </div>
            <div>
              <div className="ncnuevo-label">Fecha (*)</div>
              <DP id="ncNF" value={nFecha} onChange={setNFecha} verde={true}/>
            </div>
            <div>
              <div className="ncnuevo-label">Detalle(*)</div>
              <textarea className="ncnuevo-inp" rows={2} value={nDetalle}
                onChange={e=>setNDetalle(e.target.value)}
                style={{resize:'none',height:36}}/>
            </div>
            <div>
              <div className="ncnuevo-label">Monto S/.</div>
              <input className="ncnuevo-inp" type="number" placeholder="0.00"
                value={nMonto} onChange={e=>setNMonto(e.target.value)}/>
            </div>
            <div>
              <div className="ncnuevo-label">Serie+Nro</div>
              <input className="ncnuevo-inp" readOnly
                value={nSerie && nNro ? `${nSerie}-${String(nNro).padStart(6,'0')}` : '####-######'}
                style={{background:'#f8f9fa',color:'#888'}}/>
            </div>
          </div>

          {/* botones */}
          <div style={{display:'flex',gap:12,justifyContent:'center'}}>
            <button onClick={()=>setVista('lista')}
              style={{background:'#17a2b8',border:'none',color:'#fff',padding:'8px 24px',
                borderRadius:4,cursor:'pointer',fontSize:14,fontWeight:'bold',
                display:'inline-flex',alignItems:'center',gap:6}}>
              ↩ Regresar
            </button>
            <button onClick={guardarNuevo}
              style={{background:'#17a2b8',border:'none',color:'#fff',padding:'8px 24px',
                borderRadius:4,cursor:'pointer',fontSize:14,fontWeight:'bold',
                display:'inline-flex',alignItems:'center',gap:6}}>
              💾 Guardar
            </button>
          </div>
        </div>
      )}

      {/* ════ MODAL EDITAR ════ */}
      {modal?.tipo==='editar' && (
        <div className="mnc-overlay no-print" onClick={()=>setModal(null)}>
          <div className="mnc-box" onClick={e=>e.stopPropagation()}>
            <div className="mnc-head" style={{background:'#e67e22'}}>
              ✏ Actualizar / Eliminar — {modal.nc.ncredito}
              <span style={{cursor:'pointer',fontSize:18}} onClick={()=>setModal(null)}>✕</span>
            </div>
            <div className="mnc-body">
              <div style={{background:'#f8f9fa',border:'1px solid #dee2e6',borderRadius:6,
                padding:'10px 14px',marginBottom:16,fontSize:13}}>
                <div className="mnc-row" style={{marginBottom:4}}>
                  <span className="mnc-label">N.Crédito:</span>
                  <span className="mnc-val"><b>{modal.nc.ncredito}</b></span>
                </div>
                <div className="mnc-row" style={{marginBottom:4}}>
                  <span className="mnc-label">Doc. Venta:</span>
                  <span className="mnc-val">{modal.nc.venta}</span>
                </div>
                <div className="mnc-row" style={{marginBottom:0}}>
                  <span className="mnc-label">Cliente:</span>
                  <span className="mnc-val">{modal.nc.cliente}</span>
                </div>
              </div>
              <div className="mnc-row">
                <span className="mnc-label">Fecha:</span>
                <DP id="mncF" value={mFecha} onChange={setMFecha}/>
              </div>
              <div className="mnc-row">
                <span className="mnc-label">Motivo NC:</span>
                <select className="mnc-inp" value={mMotivo} onChange={e=>setMMotivo(e.target.value)}>
                  {MOTIVOS_NC.map(m=><option key={m}>{m}</option>)}
                </select>
              </div>
              <div style={{display:'flex',gap:12,marginBottom:12}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:'bold',marginBottom:3,color:'#555'}}>Monto Dólares (US$)</div>
                  <input className="mnc-inp" type="number" placeholder="0.00"
                    value={mDol} onChange={e=>setMDol(e.target.value)}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:'bold',marginBottom:3,color:'#555'}}>Monto Soles (S/)</div>
                  <input className="mnc-inp" type="number" placeholder="0.00"
                    value={mSol} onChange={e=>setMSol(e.target.value)}/>
                </div>
              </div>
              <div className="mnc-row">
                <span className="mnc-label">Estado:</span>
                <select className="mnc-inp" value={mEstado} onChange={e=>setMEstado(e.target.value)}>
                  {ESTADOS_NC.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="mnc-row">
                <span className="mnc-label">Observación:</span>
                <textarea className="mnc-inp" rows={2} value={mObs}
                  onChange={e=>setMObs(e.target.value)} style={{resize:'none'}}/>
              </div>
            </div>
            <div className="mnc-footer">
              <button className="mnc-btn" style={{background:'#e67e22'}} onClick={guardarEditar}>💾 Actualizar</button>
              <button className="mnc-btn" style={{background:'#dc3545'}} onClick={()=>eliminar(modal.nc)}>🗑 Eliminar</button>
              <button className="mnc-btn" style={{background:'#6c757d'}} onClick={()=>setModal(null)}>✕ Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ════ MODAL IMPRIMIR ════ */}
      {modal?.tipo==='imprimir' && (
        <div className="mnc-overlay no-print" onClick={()=>setModal(null)}>
          <div className="mnc-box" onClick={e=>e.stopPropagation()}>
            <div className="mnc-head" style={{background:'#555'}}>
              🖨 Imprimir — {modal.nc.ncredito}
              <span style={{cursor:'pointer',fontSize:18}} onClick={()=>setModal(null)}>✕</span>
            </div>
            <div className="mnc-body">
              <div style={{border:'1px solid #dee2e6',borderRadius:6,padding:'18px 20px',fontSize:13,lineHeight:1.8}}>
                <div style={{textAlign:'center',fontWeight:'bold',fontSize:16,marginBottom:12,
                  borderBottom:'2px solid #003d6b',paddingBottom:8}}>
                  NOTA DE CRÉDITO<br/>
                  <span style={{fontSize:13,fontWeight:'normal'}}>{modal.nc.ncredito}</span>
                </div>
                {[['Doc. Venta',modal.nc.venta],['Fecha',fmtFecha(modal.nc.fecha)],
                  ['Cliente',modal.nc.cliente],['Vendedor',modal.nc.vendedor],
                  ['Motivo',modal.nc.motivo]].map(([l,v])=>(
                  <div key={l} className="mnc-row" style={{marginBottom:6}}>
                    <span className="mnc-label">{l}:</span>
                    <span className="mnc-val">{v}</span>
                  </div>
                ))}
                <div className="mnc-row" style={{marginBottom:6}}>
                  <span className="mnc-label">Estado SUNAT:</span>
                  <span className="mnc-val">
                    <span className="badge" style={{background:SUNAT_COLOR[modal.nc.sunat]||'#6c757d'}}>{modal.nc.sunat}</span>
                  </span>
                </div>
                <div style={{borderTop:'1px solid #dee2e6',marginTop:12,paddingTop:10,
                  display:'flex',justifyContent:'flex-end',gap:24,fontWeight:'bold',fontSize:14}}>
                  {modal.nc.dolares && <span>US$ {modal.nc.dolares}</span>}
                  <span>S/ {modal.nc.soles}</span>
                </div>
              </div>
            </div>
            <div className="mnc-footer">
              <button className="mnc-btn" style={{background:'#555'}} onClick={()=>window.print()}>🖨 Imprimir</button>
              <button className="mnc-btn" style={{background:'#6c757d'}} onClick={()=>setModal(null)}>✕ Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}