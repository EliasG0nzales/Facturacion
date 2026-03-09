import { useState, useRef } from "react";

/* ─── DATOS DEMO ─── */
const ND_INI = [
  { id:1, ndebito:'ND01-000001', docvta:'FI01-000041', fecha:'2026-02-10',
    cliente:'Empresa SAC', vendedor:'Iturri, Quispe, Smith', estado:'Borrador',
    motivo:'Intereses por mora', monto:'45.00' },
  { id:2, ndebito:'ND01-000002', docvta:'BI01-000023', fecha:'2026-02-18',
    cliente:'García López, María', vendedor:'Merino, Cahuna, Wilver Enmanuel',
    estado:'Aceptado', motivo:'Penalidad por incumplimiento', monto:'120.00' },
  { id:3, ndebito:'ND01-000003', docvta:'001-000018', fecha:'2026-03-01',
    cliente:'Alexander Paul, Moran Alburqueque', vendedor:'Romero, Merino, Alexander Renson',
    estado:'Borrador', motivo:'Gastos de cobranza', monto:'30.00' },
];

const MOTIVOS_ND = [
  '01 - Intereses por mora','02 - Aumento en el valor',
  '03 - Penalidades/ otros conceptos','04 - Consolidación',
  '05 - Errores/ omisiones','06 - Diferencia de cambio',
  '07 - Gastos de cobranza','08 - Otros',
];

const ESTADOS_ND = ['Borrador','Aceptado','Anulado','Enviado SUNAT'];
const VENDEDORES  = ['fac-tura.com','Iturri, Quispe, Smith',
  'Merino, Cahuna, Wilver Enmanuel','Romero, Merino, Alexander Renson',
  'Yupanqui, Barboza, Raysa'];

const hoy      = new Date().toISOString().split('T')[0];
const fmtFecha = iso => { if(!iso) return ''; const [y,m,d]=iso.split('-'); return `${d}/${m}/${y}`; };

const ESTADO_COLOR = { Borrador:'#6c757d', Aceptado:'#28a745', Anulado:'#dc3545', 'Enviado SUNAT':'#17a2b8' };

/* ─── CSS ─── */
const css = `
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#212529;}
  .nd-bar{display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end;margin-bottom:18px;}
  .nd-bar label{font-size:12px;font-weight:bold;display:block;margin-bottom:3px;color:#555;}
  .nd-bar input[type=text]{padding:5px 10px;border:1px solid #ced4da;border-radius:4px;
    font-size:13px;color:#212529;background:#fff;}
  .nd-radio-group{display:flex;gap:14px;align-items:center;flex-wrap:wrap;font-size:13px;}
  .nd-radio-group label{display:flex;align-items:center;gap:4px;cursor:pointer;font-weight:bold;color:#212529;}
  .nd-radio-group input[type=radio]{accent-color:#17a2b8;width:14px;height:14px;}
  .nd-date-wrap{display:flex;align-items:center;gap:5px;border:1px solid #ced4da;
    border-radius:4px;padding:4px 8px;background:#fff;height:32px;min-width:130px;}
  .nd-date-wrap span.nd-dt{font-size:13px;color:#212529;min-width:85px;}
  .btn-buscar{background:#17a2b8;border:1px solid #138496;color:#fff;padding:7px 18px;
    border-radius:4px;cursor:pointer;font-size:13px;font-weight:bold;
    display:inline-flex;align-items:center;gap:5px;}
  .btn-buscar:hover{background:#138496;}
  .btn-ventas{background:#17a2b8;border:1px solid #138496;color:#fff;padding:7px 18px;
    border-radius:4px;cursor:pointer;font-size:13px;font-weight:bold;
    display:inline-flex;align-items:center;gap:5px;}
  .btn-ventas:hover{background:#138496;}
  .nd-titulo{text-align:center;font-weight:bold;font-size:14px;margin-bottom:10px;letter-spacing:.5px;}
  table.tnd{width:100%;border-collapse:collapse;font-size:13px;}
  table.tnd thead tr{background:#003d6b;}
  table.tnd thead th{padding:10px 10px;text-align:center;color:#fff;font-weight:bold;
    font-size:12px;letter-spacing:.3px;}
  table.tnd tbody tr{border-bottom:1px solid #dee2e6;background:#fff;}
  table.tnd tbody tr:hover{background:#e8f4f8;}
  table.tnd tbody td{padding:9px 10px;vertical-align:middle;color:#212529;}
  .badge-estado{padding:3px 10px;border-radius:12px;font-size:11px;
    font-weight:bold;color:#fff;display:inline-block;}
  .ic-nd{background:none;border:none;cursor:pointer;padding:2px 4px;
    display:inline-flex;align-items:center;justify-content:center;border-radius:4px;}
  .ic-nd:hover{opacity:.8;transform:scale(1.15);}
  .leyenda-nd{font-size:12px;color:#444;margin-top:14px;display:flex;flex-wrap:wrap;gap:14px;align-items:center;}
  .mnd-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:3000;
    display:flex;align-items:center;justify-content:center;}
  .mnd-box{background:#fff;border-radius:8px;min-width:500px;max-width:640px;
    width:92%;box-shadow:0 8px 32px rgba(0,0,0,.25);overflow:hidden;}
  .mnd-head{padding:13px 20px;display:flex;justify-content:space-between;align-items:center;
    color:#fff;font-weight:bold;font-size:15px;}
  .mnd-body{padding:20px;max-height:72vh;overflow-y:auto;}
  .mnd-footer{padding:12px 20px;display:flex;gap:10px;justify-content:flex-end;
    border-top:1px solid #dee2e6;background:#f8f9fa;}
  .mnd-btn{padding:7px 20px;border:none;border-radius:4px;cursor:pointer;
    font-size:13px;font-weight:bold;color:#fff;}
  .mnd-row{display:flex;gap:10px;margin-bottom:12px;align-items:center;}
  .mnd-label{font-weight:bold;font-size:13px;min-width:130px;color:#555;}
  .mnd-val{font-size:13px;color:#212529;}
  .mnd-inp{padding:6px 10px;border:1px solid #ced4da;border-radius:4px;
    font-size:13px;color:#212529;background:#fff;width:100%;}
  .alert-ok{background:#d4edda;border:1px solid #c3e6cb;color:#155724;
    padding:8px 14px;border-radius:4px;margin-bottom:12px;font-size:13px;}
  .alert-err{background:#f8d7da;border:1px solid #f5c6cb;color:#721c24;
    padding:8px 14px;border-radius:4px;margin-bottom:12px;font-size:13px;}
  .print-area{display:none;}
  @media print{ .no-print{display:none!important;} .print-area{display:block;} }
`;

/* ─── Ícono calendario ─── */
const IcoCal = () => (
  <svg width="18" height="18" viewBox="0 0 36 36" fill="none">
    <rect x="1" y="4" width="34" height="30" rx="3" fill="#fff" stroke="#bbb" strokeWidth="1.5"/>
    <rect x="1" y="4" width="34" height="9" rx="3" fill="#e74c3c"/>
    <rect x="1" y="9" width="34" height="4" fill="#e74c3c"/>
    <rect x="10" y="1" width="3" height="7" rx="1.5" fill="#888"/>
    <rect x="23" y="1" width="3" height="7" rx="1.5" fill="#888"/>
  </svg>
);

/* ─── DatePicker ─── */
const DP = ({ id, value, onChange }) => {
  const ref = useRef();
  return (
    <div className="nd-date-wrap">
      <span className="nd-dt">{value ? value.split('-').reverse().join('/') : ''}</span>
      <span style={{cursor:'pointer'}} onClick={()=>ref.current.showPicker?.()??ref.current.click()}>
        <IcoCal/>
      </span>
      <input ref={ref} id={id} type="date" value={value} onChange={e=>onChange(e.target.value)}
        style={{opacity:0,width:1,height:1,position:'absolute',pointerEvents:'none'}}/>
    </div>
  );
};

/* ══════════════════════════════════════════════ */
export default function NotaDebito() {
  const [nds,     setNds]     = useState(ND_INI);
  const [alert,   setAlert]   = useState('');
  const [bTipo,   setBTipo]   = useState('1');
  const [bq,      setBq]      = useState('');
  const [bfi,     setBfi]     = useState('');
  const [bff,     setBff]     = useState('');
  const [modal,   setModal]   = useState(null); // { tipo:'editar'|'imprimir', nd }
  /* campos modal editar */
  const [mMotivo, setMMotivo] = useState('');
  const [mMonto,  setMMonto]  = useState('');
  const [mEstado, setMEstado] = useState('');
  const [mFecha,  setMFecha]  = useState(hoy);
  const [mObs,    setMObs]    = useState('');

  /* ── filtrado ── */
  const listaFilt = nds.filter(n => {
    if (bq) {
      const q = bq.toLowerCase();
      if (bTipo==='1' && !n.docvta.toLowerCase().includes(q))   return false;
      if (bTipo==='2' && !n.cliente.toLowerCase().includes(q))  return false;
      if (bTipo==='3' && !n.ndebito.toLowerCase().includes(q))  return false;
    }
    if (bfi && n.fecha < bfi) return false;
    if (bff && n.fecha > bff) return false;
    return true;
  });

  /* ── abrir modal ── */
  const abrirEditar = nd => {
    setModal({ tipo:'editar', nd });
    setMMotivo(nd.motivo);
    setMMonto(nd.monto);
    setMEstado(nd.estado);
    setMFecha(nd.fecha);
    setMObs('');
  };
  const abrirImprimir = nd => setModal({ tipo:'imprimir', nd });

  /* ── guardar edición ── */
  const guardarEditar = () => {
    setNds(prev => prev.map(n =>
      n.id === modal.nd.id
        ? {...n, motivo:mMotivo, monto:mMonto, estado:mEstado, fecha:mFecha}
        : n
    ));
    setModal(null);
    setAlert('ok:Nota de Débito actualizada correctamente.');
    setTimeout(()=>setAlert(''), 3500);
  };

  /* ── eliminar ── */
  const eliminar = nd => {
    if (!window.confirm(`¿Eliminar la Nota de Débito ${nd.ndebito}?`)) return;
    setNds(prev => prev.filter(n => n.id !== nd.id));
    setModal(null);
    setAlert('ok:Nota de Débito eliminada.');
    setTimeout(()=>setAlert(''), 3000);
  };

  /* ── imprimir ── */
  const imprimir = () => window.print();

  return (
    <>
      <style>{css}</style>

      {alert && (
        <div className={alert.startsWith('ok:') ? 'alert-ok' : 'alert-err'}>
          {alert.startsWith('ok:') ? '✅ ' : '⚠️ '}{alert.slice(3)}
        </div>
      )}

      {/* ── título ── */}
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}} className="no-print">
        <span style={{background:'#0099ff',color:'#fff',borderRadius:'50%',width:22,height:22,
          display:'inline-flex',alignItems:'center',justifyContent:'center',
          fontSize:13,fontWeight:'bold',cursor:'pointer'}} title="Ayuda">?</span>
        <span style={{fontSize:16,fontWeight:'bold'}}>Nota de Debito</span>
      </div>

      {/* ── barra búsqueda ── */}
      <div className="nd-bar no-print">
        <div>
          <div style={{fontWeight:'bold',fontSize:13,marginBottom:4}}>BUSCAR X</div>
          <div className="nd-radio-group" style={{marginBottom:6}}>
            {[['1','Nro doc.'],['2','clientes'],['3','Nº N.de Debito']].map(([v,l])=>(
              <label key={v}>
                <input type="radio" name="ndTipo" value={v}
                  checked={bTipo===v} onChange={()=>setBTipo(v)}/> {l} /
              </label>
            ))}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <input type="text" value={bq} onChange={e=>setBq(e.target.value)}
              placeholder="" style={{width:300}}/>
            <span style={{fontWeight:'bold',fontSize:13}}>y/o</span>
          </div>
        </div>

        <div>
          <label>Fecha Inicio</label>
          <DP id="ndFI" value={bfi} onChange={setBfi}/>
        </div>
        <div>
          <label>Fecha Fin</label>
          <DP id="ndFF" value={bff} onChange={setBff}/>
        </div>

        <button className="btn-buscar">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2"/>
          </svg>
          Buscar
        </button>

        <button className="btn-ventas" onClick={()=>window.location.href='/venta'}>
          <span style={{fontSize:15,fontWeight:'bold'}}>+</span> Ir a Ventas
        </button>
      </div>

      {/* ── tabla ── */}
      <div className="nd-titulo">LISTADO GENERAL &nbsp; NOTA DE DEBITO</div>
      <table className="tnd">
        <thead>
          <tr>
            <th>N.Debito</th>
            <th>Doc.Vta.</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Vendedor</th>
            <th>Estado</th>
            <th width="8%">Opciones</th>
          </tr>
        </thead>
        <tbody>
          {listaFilt.length === 0
            ? <tr><td colSpan={7} align="center" style={{padding:20,color:'#888'}}>Sin registros</td></tr>
            : listaFilt.map(n=>(
              <tr key={n.id}>
                <td><b>{n.ndebito}</b></td>
                <td>{n.docvta}</td>
                <td align="center">{fmtFecha(n.fecha)}</td>
                <td>{n.cliente}</td>
                <td>{n.vendedor}</td>
                <td align="center">
                  <span className="badge-estado"
                    style={{background: ESTADO_COLOR[n.estado]||'#6c757d'}}>
                    {n.estado}
                  </span>
                </td>
                <td align="center" style={{whiteSpace:'nowrap'}}>
                  {/* ✏ Actualizar/Eliminar */}
                  <button className="ic-nd no-print" title="Actualizar, Eliminar"
                    onClick={()=>abrirEditar(n)}>
                    <span style={{background:'#e67e22',color:'#fff',borderRadius:4,
                      padding:'3px 7px',fontSize:13,fontWeight:'bold'}}>✏</span>
                  </button>
                  {/* 🖨 Imprimir */}
                  <button className="ic-nd no-print" title="Imprimir"
                    onClick={()=>abrirImprimir(n)} style={{marginLeft:4}}>
                    <span style={{background:'#555',color:'#fff',borderRadius:4,
                      padding:'3px 7px',fontSize:13}}>🖨</span>
                  </button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>

      {/* ── leyenda ── */}
      <hr style={{border:'none',borderTop:'1px solid #dee2e6',margin:'14px 0 8px'}} className="no-print"/>
      <div className="leyenda-nd no-print">
        <b>Leyenda de OPCIONES :</b>
        <span style={{display:'flex',alignItems:'center',gap:4}}>
          <span style={{background:'#e67e22',color:'#fff',borderRadius:4,
            padding:'2px 7px',fontSize:13,fontWeight:'bold'}}>✏</span>
          <span>Actualizar, Eliminar</span>
        </span>
        <span style={{display:'flex',alignItems:'center',gap:4}}>
          <span style={{background:'#555',color:'#fff',borderRadius:4,
            padding:'2px 7px',fontSize:13}}>🖨</span>
          <span>Imprimir</span>
        </span>
      </div>

      {/* ════ MODAL EDITAR ════ */}
      {modal?.tipo==='editar' && (
        <div className="mnd-overlay no-print" onClick={()=>setModal(null)}>
          <div className="mnd-box" onClick={e=>e.stopPropagation()}>
            <div className="mnd-head" style={{background:'#e67e22'}}>
              ✏ Actualizar / Eliminar — {modal.nd.ndebito}
              <span style={{cursor:'pointer',fontSize:18}} onClick={()=>setModal(null)}>✕</span>
            </div>
            <div className="mnd-body">
              {/* resumen */}
              <div style={{background:'#f8f9fa',border:'1px solid #dee2e6',borderRadius:6,
                padding:'10px 14px',marginBottom:16,fontSize:13}}>
                <div className="mnd-row" style={{marginBottom:4}}>
                  <span className="mnd-label">N.Débito:</span>
                  <span className="mnd-val"><b>{modal.nd.ndebito}</b></span>
                </div>
                <div className="mnd-row" style={{marginBottom:4}}>
                  <span className="mnd-label">Doc. Venta:</span>
                  <span className="mnd-val">{modal.nd.docvta}</span>
                </div>
                <div className="mnd-row" style={{marginBottom:0}}>
                  <span className="mnd-label">Cliente:</span>
                  <span className="mnd-val">{modal.nd.cliente}</span>
                </div>
              </div>

              <div className="mnd-row">
                <span className="mnd-label">Fecha:</span>
                <DP id="mndF" value={mFecha} onChange={setMFecha}/>
              </div>
              <div className="mnd-row">
                <span className="mnd-label">Motivo ND:</span>
                <select className="mnd-inp" value={mMotivo} onChange={e=>setMMotivo(e.target.value)}>
                  {MOTIVOS_ND.map(m=><option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="mnd-row">
                <span className="mnd-label">Monto (S/):</span>
                <input className="mnd-inp" type="number" placeholder="0.00"
                  value={mMonto} onChange={e=>setMMonto(e.target.value)}/>
              </div>
              <div className="mnd-row">
                <span className="mnd-label">Estado:</span>
                <select className="mnd-inp" value={mEstado} onChange={e=>setMEstado(e.target.value)}>
                  {ESTADOS_ND.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="mnd-row">
                <span className="mnd-label">Observación:</span>
                <textarea className="mnd-inp" rows={2} placeholder="Observaciones..."
                  value={mObs} onChange={e=>setMObs(e.target.value)} style={{resize:'none'}}/>
              </div>
            </div>
            <div className="mnd-footer">
              <button className="mnd-btn" style={{background:'#e67e22'}} onClick={guardarEditar}>
                💾 Actualizar
              </button>
              <button className="mnd-btn" style={{background:'#dc3545'}}
                onClick={()=>eliminar(modal.nd)}>
                🗑 Eliminar
              </button>
              <button className="mnd-btn" style={{background:'#6c757d'}} onClick={()=>setModal(null)}>
                ✕ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════ MODAL IMPRIMIR ════ */}
      {modal?.tipo==='imprimir' && (
        <div className="mnd-overlay no-print" onClick={()=>setModal(null)}>
          <div className="mnd-box" onClick={e=>e.stopPropagation()}>
            <div className="mnd-head" style={{background:'#555'}}>
              🖨 Imprimir — {modal.nd.ndebito}
              <span style={{cursor:'pointer',fontSize:18}} onClick={()=>setModal(null)}>✕</span>
            </div>
            <div className="mnd-body">
              <div style={{border:'1px solid #dee2e6',borderRadius:6,padding:'18px 20px',
                fontSize:13,lineHeight:1.8}}>
                <div style={{textAlign:'center',fontWeight:'bold',fontSize:16,marginBottom:12,
                  borderBottom:'2px solid #003d6b',paddingBottom:8}}>
                  NOTA DE DÉBITO<br/>
                  <span style={{fontSize:13,fontWeight:'normal'}}>{modal.nd.ndebito}</span>
                </div>
                <div className="mnd-row" style={{marginBottom:6}}>
                  <span className="mnd-label">Doc. Venta:</span>
                  <span className="mnd-val">{modal.nd.docvta}</span>
                </div>
                <div className="mnd-row" style={{marginBottom:6}}>
                  <span className="mnd-label">Fecha:</span>
                  <span className="mnd-val">{fmtFecha(modal.nd.fecha)}</span>
                </div>
                <div className="mnd-row" style={{marginBottom:6}}>
                  <span className="mnd-label">Cliente:</span>
                  <span className="mnd-val">{modal.nd.cliente}</span>
                </div>
                <div className="mnd-row" style={{marginBottom:6}}>
                  <span className="mnd-label">Vendedor:</span>
                  <span className="mnd-val">{modal.nd.vendedor}</span>
                </div>
                <div className="mnd-row" style={{marginBottom:6}}>
                  <span className="mnd-label">Motivo:</span>
                  <span className="mnd-val">{modal.nd.motivo}</span>
                </div>
                <div className="mnd-row" style={{marginBottom:6}}>
                  <span className="mnd-label">Estado:</span>
                  <span className="mnd-val">
                    <span className="badge-estado"
                      style={{background:ESTADO_COLOR[modal.nd.estado]||'#6c757d'}}>
                      {modal.nd.estado}
                    </span>
                  </span>
                </div>
                <div style={{borderTop:'1px solid #dee2e6',marginTop:12,paddingTop:10,
                  textAlign:'right',fontWeight:'bold',fontSize:15}}>
                  Monto: S/ {modal.nd.monto}
                </div>
              </div>
            </div>
            <div className="mnd-footer">
              <button className="mnd-btn" style={{background:'#555'}} onClick={imprimir}>
                🖨 Imprimir
              </button>
              <button className="mnd-btn" style={{background:'#6c757d'}} onClick={()=>setModal(null)}>
                ✕ Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}