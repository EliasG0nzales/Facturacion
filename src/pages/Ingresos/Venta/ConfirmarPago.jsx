import { useState, useRef } from "react";

/* ─── DATOS DEMO — 5 ventas por confirmar pago ─── */
const PAGOS_INI = [
  { id:1, docventa:'BI01-000023', fecha:'2026-03-01', cliente:'García López, María',
    vendedor:'Iturri, Quispe, Smith', tpago:'Yape', dolares:'', soles:'250.00' },
  { id:2, docventa:'FI01-000041', fecha:'2026-03-03', cliente:'Empresa SAC',
    vendedor:'Merino, Cahuna, Wilver Enmanuel', tpago:'Deposito Interbank', dolares:'120.00', soles:'540.00' },
  { id:3, docventa:'BI01-000024', fecha:'2026-03-05', cliente:'Luis Alexander, Quispe Ayala',
    vendedor:'Yupanqui, Barboza, Raysa', tpago:'Efectivo', dolares:'', soles:'89.00' },
  { id:4, docventa:'001-000018', fecha:'2026-03-06', cliente:'Alexander Paul, Moran Alburqueque',
    vendedor:'Romero, Merino, Alexander Renson', tpago:'Deposito BBVA', dolares:'', soles:'1200.00' },
  { id:5, docventa:'FI01-000042', fecha:'2026-03-07', cliente:'Empresa SAC',
    vendedor:'Iturri, Quispe, Smith', tpago:'Mixto', dolares:'50.00', soles:'320.00' },
];

const VENDEDORES = ['fac-tura.com','Iturri, Quispe, Smith','Merino, Cahuna, Wilver Enmanuel',
                    'Romero, Merino, Alexander Renson','Yupanqui, Barboza, Raysa'];

const hoy = new Date().toISOString().split('T')[0];
const fmtFecha = iso => { if(!iso) return ''; const [y,m,d]=iso.split('-'); return `${d}/${m}/${y}`; };
const sumSoles   = list => list.reduce((s,p)=>s+parseFloat(p.soles||0),0).toFixed(2);
const sumDolares = list => list.reduce((s,p)=>s+parseFloat(p.dolares||0),0).toFixed(2);

const css = `
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#212529;}
  .cp-bar{display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end;margin-bottom:18px;}
  .cp-bar label{font-size:12px;font-weight:bold;display:block;margin-bottom:3px;color:#555;}
  .cp-bar input[type=text]{padding:5px 10px;border:1px solid #ced4da;border-radius:4px;
    font-size:13px;color:#212529;background:#fff;}
  .cp-radio-group{display:flex;gap:14px;align-items:center;flex-wrap:wrap;font-size:13px;color:#212529;}
  .cp-radio-group label{display:flex;align-items:center;gap:4px;cursor:pointer;font-weight:bold;}
  .cp-radio-group input[type=radio]{accent-color:#17a2b8;width:14px;height:14px;}
  .cp-date-wrap{display:flex;align-items:center;gap:5px;border:1px solid #ced4da;
    border-radius:4px;padding:4px 8px;background:#fff;height:32px;min-width:130px;}
  .cp-date-wrap span.cp-dt{font-size:13px;color:#212529;min-width:85px;}
  .btn-buscar{background:#17a2b8;border:1px solid #138496;color:#fff;padding:7px 18px;
    border-radius:4px;cursor:pointer;font-size:13px;font-weight:bold;
    display:inline-flex;align-items:center;gap:5px;}
  .btn-buscar:hover{background:#138496;}
  .alerta-pend{background:#fffbcc;border:1px solid #C8C40F;border-radius:4px;
    padding:8px 14px;font-size:13px;color:#5a5200;display:flex;align-items:center;
    gap:8px;margin-bottom:12px;}
  .cp-titulo{text-align:center;font-weight:bold;font-size:14px;margin-bottom:10px;letter-spacing:.5px;}
  table.tcp{width:100%;border-collapse:collapse;font-size:13px;}
  table.tcp thead tr{background:#003d6b;}
  table.tcp thead th{padding:10px 10px;text-align:center;color:#fff;font-weight:bold;font-size:12px;letter-spacing:.3px;}
  table.tcp tbody tr{border-bottom:1px solid #dee2e6;background:#fff;}
  table.tcp tbody tr:hover{background:#e8f4f8;}
  table.tcp tbody td{padding:9px 10px;vertical-align:middle;color:#212529;}
  table.tcp tfoot tr{background:#cccccc;}
  table.tcp tfoot td{padding:8px 10px;font-weight:bold;color:#212529;font-size:13px;}
  .btn-confirmar{background:none;border:none;cursor:pointer;padding:2px;
    display:inline-flex;align-items:center;justify-content:center;}
  .btn-confirmar:hover{transform:scale(1.2);}
  .leyenda-cp{font-size:12px;color:#444;margin-top:14px;display:flex;flex-wrap:wrap;gap:10px;align-items:center;}
  .mcp-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:3000;display:flex;align-items:center;justify-content:center;}
  .mcp-box{background:#fff;border-radius:8px;min-width:480px;max-width:620px;width:90%;
    box-shadow:0 8px 32px rgba(0,0,0,.25);overflow:hidden;}
  .mcp-head{padding:13px 20px;display:flex;justify-content:space-between;align-items:center;
    color:#fff;font-weight:bold;font-size:15px;background:#28a745;}
  .mcp-body{padding:20px;}
  .mcp-footer{padding:12px 20px;display:flex;gap:10px;justify-content:flex-end;
    border-top:1px solid #dee2e6;background:#f8f9fa;}
  .mcp-btn{padding:7px 20px;border:none;border-radius:4px;cursor:pointer;font-size:13px;font-weight:bold;color:#fff;}
  .mcp-row{display:flex;gap:10px;margin-bottom:10px;align-items:center;}
  .mcp-label{font-weight:bold;font-size:13px;min-width:130px;color:#555;}
  .mcp-val{font-size:13px;color:#212529;}
  .mcp-inp{padding:6px 10px;border:1px solid #ced4da;border-radius:4px;font-size:13px;
    color:#212529;background:#fff;width:100%;}
  .alert-ok{background:#d4edda;border:1px solid #c3e6cb;color:#155724;padding:8px 14px;border-radius:4px;margin-bottom:12px;font-size:13px;}
  .alert-err{background:#f8d7da;border:1px solid #f5c6cb;color:#721c24;padding:8px 14px;border-radius:4px;margin-bottom:12px;font-size:13px;}
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

const DP = ({ id, value, onChange }) => {
  const ref = useRef();
  return (
    <div className="cp-date-wrap">
      <span className="cp-dt">{value ? value.split('-').reverse().join('/') : ''}</span>
      <span style={{cursor:'pointer'}} onClick={()=>ref.current.showPicker?.()??ref.current.click()}>
        <IcoCal/>
      </span>
      <input ref={ref} id={id} type="date" value={value} onChange={e=>onChange(e.target.value)}
        style={{opacity:0,width:1,height:1,position:'absolute',pointerEvents:'none'}}/>
    </div>
  );
};

export default function ConfirmarPago() {
  const [pagos,       setPagos]       = useState(PAGOS_INI);
  const [alert,       setAlert]       = useState('');
  const [bTipo,       setBTipo]       = useState('1');
  const [bq,          setBq]          = useState('');
  const [bfi,         setBfi]         = useState('');
  const [bff,         setBff]         = useState('');
  const [mPago,       setMPago]       = useState(null);
  const [mFechaPago,  setMFechaPago]  = useState(hoy);
  const [mTipoPago,   setMTipoPago]   = useState('Efectivo');
  const [mNroOper,    setMNroOper]    = useState('');
  const [mBanco,      setMBanco]      = useState('');
  const [mMontoDol,   setMMontoDol]   = useState('');
  const [mMontoSol,   setMMontoSol]   = useState('');
  const [mObserv,     setMObserv]     = useState('');

  const listaFilt = pagos.filter(p => {
    if (bq) {
      const q = bq.toLowerCase();
      if (bTipo==='1' && !p.docventa.toLowerCase().includes(q)) return false;
      if (bTipo==='2' && !p.cliente.toLowerCase().includes(q))  return false;
      if (bTipo==='3' && !p.vendedor.toLowerCase().includes(q)) return false;
      if (bTipo==='4' && !p.tpago.toLowerCase().includes(q))    return false;
    }
    if (bfi && p.fecha < bfi) return false;
    if (bff && p.fecha > bff) return false;
    return true;
  });

  const abrirConfirmar = p => {
    setMPago(p);
    setMFechaPago(hoy);
    setMTipoPago(p.tpago);
    setMNroOper('');
    setMBanco('');
    setMMontoDol(p.dolares||'');
    setMMontoSol(p.soles||'');
    setMObserv('');
  };

  const confirmarPago = () => {
    if (!mMontoSol && !mMontoDol) {
      setAlert('err:Ingrese al menos un monto (Soles o Dólares)');
      return;
    }
    setPagos(prev => prev.filter(p => p.id !== mPago.id));
    setMPago(null);
    setAlert('ok:Pago confirmado correctamente.');
    setTimeout(()=>setAlert(''), 4000);
  };

  return (
    <>
      <style>{css}</style>

      {alert && (
        <div className={alert.startsWith('ok:') ? 'alert-ok' : 'alert-err'}>
          {alert.startsWith('ok:') ? '✅ ' : '⚠️ '}{alert.slice(3)}
        </div>
      )}

      {/* título */}
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
        <span style={{background:'#0099ff',color:'#fff',borderRadius:'50%',width:22,height:22,
          display:'inline-flex',alignItems:'center',justifyContent:'center',
          fontSize:13,fontWeight:'bold',cursor:'pointer'}} title="Ayuda">?</span>
        <span style={{fontSize:16,fontWeight:'bold'}}>VENTA (pagos por confirmar)</span>
      </div>

      {/* barra búsqueda */}
      <div className="cp-bar">
        <div>
          <label>BUSCAR X</label>
          <div className="cp-radio-group" style={{marginBottom:6}}>
            {[['1','Nro doc.'],['2','clientes'],['3','Vendedor'],['4','T.Pago']].map(([v,l])=>(
              <label key={v}>
                <input type="radio" name="cpTipo" value={v}
                  checked={bTipo===v} onChange={()=>setBTipo(v)}/> {l} /
              </label>
            ))}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <input type="text" value={bq} onChange={e=>setBq(e.target.value)}
              placeholder="Ingrese texto a buscar" style={{width:300}}/>
            <span style={{fontWeight:'bold',fontSize:13}}>y/o</span>
          </div>
        </div>
        <div>
          <label>Fecha Inicio</label>
          <DP id="cpFI" value={bfi} onChange={setBfi}/>
        </div>
        <div>
          <label>Fecha Fin</label>
          <DP id="cpFF" value={bff} onChange={setBff}/>
        </div>
        <button className="btn-buscar">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2"/>
          </svg>
          Buscar
        </button>
      </div>

      {/* aviso pendientes */}
      {listaFilt.length > 0 && (
        <div className="alerta-pend">
          <span style={{fontSize:18}}>⚠</span>
          Tiene <b>{listaFilt.length}</b> Venta{listaFilt.length!==1?'s':''} por Confirma pago...
        </div>
      )}
      {listaFilt.length === 0 && !alert && (
        <div className="alerta-pend" style={{background:'#d4edda',borderColor:'#c3e6cb',color:'#155724'}}>
          <span style={{fontSize:18}}>✅</span>
          No hay ventas pendientes de confirmación de pago.
        </div>
      )}

      {/* tabla */}
      <div className="cp-titulo">LISTADO VENTAS DE PAGOS POR CONFIRMAR</div>
      <table className="tcp">
        <thead>
          <tr>
            <th>DocVenta.</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Vendedor</th>
            <th>T.Pago</th>
            <th style={{textAlign:'right'}}>Dolares</th>
            <th style={{textAlign:'right'}}>Soles</th>
            <th width="5%">Op</th>
          </tr>
        </thead>
        <tbody>
          {listaFilt.length === 0
            ? <tr><td colSpan={8} align="center" style={{padding:20,color:'#888'}}>Sin registros pendientes</td></tr>
            : listaFilt.map(p=>(
              <tr key={p.id}>
                <td><b>{p.docventa}</b></td>
                <td align="center">{fmtFecha(p.fecha)}</td>
                <td>{p.cliente}</td>
                <td>{p.vendedor}</td>
                <td align="center">{p.tpago}</td>
                <td align="right">{p.dolares ? `US$ ${p.dolares}` : ''}</td>
                <td align="right">S/ {p.soles}</td>
                <td align="center">
                  <button className="btn-confirmar" onClick={()=>abrirConfirmar(p)} title="Confirmar Pago">
                    <span style={{fontSize:20}}>👍</span>
                  </button>
                </td>
              </tr>
            ))
          }
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={5}></td>
            <td align="right"><b>US$ {sumDolares(listaFilt)}</b></td>
            <td align="right"><b>S/. {sumSoles(listaFilt)}</b></td>
            <td></td>
          </tr>
        </tfoot>
      </table>

      {/* leyenda */}
      <hr style={{border:'none',borderTop:'1px solid #dee2e6',margin:'14px 0 8px'}}/>
      <div className="leyenda-cp">
        <b>Leyenda de OPCIONES :</b>
        <span style={{display:'flex',alignItems:'center',gap:4}}>
          <span style={{fontSize:18,color:'#28a745'}}>👍</span>
          <span style={{color:'#28a745',fontWeight:'bold'}}>Confirmar Pago</span>
        </span>
      </div>

      {/* ════ MODAL CONFIRMAR PAGO ════ */}
      {mPago && (
        <div className="mcp-overlay" onClick={()=>setMPago(null)}>
          <div className="mcp-box" onClick={e=>e.stopPropagation()}>
            <div className="mcp-head">
              👍 Confirmar Pago — {mPago.docventa}
              <span style={{cursor:'pointer',fontSize:18}} onClick={()=>setMPago(null)}>✕</span>
            </div>
            <div className="mcp-body">
              {/* resumen venta */}
              <div style={{background:'#f8f9fa',border:'1px solid #dee2e6',borderRadius:6,
                padding:'10px 14px',marginBottom:16,fontSize:13}}>
                <div className="mcp-row" style={{marginBottom:4}}>
                  <span className="mcp-label">Documento:</span>
                  <span className="mcp-val"><b>{mPago.docventa}</b></span>
                </div>
                <div className="mcp-row" style={{marginBottom:4}}>
                  <span className="mcp-label">Cliente:</span>
                  <span className="mcp-val">{mPago.cliente}</span>
                </div>
                <div className="mcp-row" style={{marginBottom:4}}>
                  <span className="mcp-label">Vendedor:</span>
                  <span className="mcp-val">{mPago.vendedor}</span>
                </div>
                <div className="mcp-row" style={{marginBottom:0,gap:24}}>
                  <span className="mcp-label">Fecha Venta:</span>
                  <span className="mcp-val">{fmtFecha(mPago.fecha)}</span>
                  {mPago.dolares && <><span className="mcp-label">US$:</span><span className="mcp-val">{mPago.dolares}</span></>}
                  <span className="mcp-label">S/:</span>
                  <span className="mcp-val" style={{fontWeight:'bold',color:'#28a745'}}>{mPago.soles}</span>
                </div>
              </div>

              <div className="mcp-row">
                <span className="mcp-label">Fecha de Pago:</span>
                <DP id="mFP" value={mFechaPago} onChange={setMFechaPago}/>
              </div>
              <div className="mcp-row">
                <span className="mcp-label">Tipo de Pago:</span>
                <select className="mcp-inp" value={mTipoPago} onChange={e=>setMTipoPago(e.target.value)}>
                  {['Efectivo','C.Entrega','Yape','Deposito Interbank','Deposito BBVA','Deposito BCP','Mixto']
                    .map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="mcp-row">
                <span className="mcp-label">Nro. Operación:</span>
                <input className="mcp-inp" placeholder="Nro de operación / referencia"
                  value={mNroOper} onChange={e=>setMNroOper(e.target.value)}/>
              </div>
              <div className="mcp-row">
                <span className="mcp-label">Banco:</span>
                <input className="mcp-inp" placeholder="Banco o entidad financiera"
                  value={mBanco} onChange={e=>setMBanco(e.target.value)}/>
              </div>
              <div style={{display:'flex',gap:12,marginBottom:10}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:'bold',marginBottom:3,color:'#555'}}>Monto Dólares (US$)</div>
                  <input className="mcp-inp" type="number" placeholder="0.00"
                    value={mMontoDol} onChange={e=>setMMontoDol(e.target.value)}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:'bold',marginBottom:3,color:'#555'}}>Monto Soles (S/)</div>
                  <input className="mcp-inp" type="number" placeholder="0.00"
                    value={mMontoSol} onChange={e=>setMMontoSol(e.target.value)}/>
                </div>
              </div>
              <div className="mcp-row">
                <span className="mcp-label">Observación:</span>
                <textarea className="mcp-inp" rows={2} placeholder="Observaciones adicionales..."
                  value={mObserv} onChange={e=>setMObserv(e.target.value)} style={{resize:'none'}}/>
              </div>
            </div>
            <div className="mcp-footer">
              <button className="mcp-btn" style={{background:'#28a745'}} onClick={confirmarPago}>
                👍 Confirmar Pago
              </button>
              <button className="mcp-btn" style={{background:'#6c757d'}} onClick={()=>setMPago(null)}>
                ✕ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}