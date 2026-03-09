import { useState, useRef } from "react";

/* ─── DATOS DEMO ─── */
const OI_INI = [
  { id:1, fecha:'2026-02-15', responsable:'Iturri, Quispe, Smith',
    de:'García López, María', motivo:'Adelanto de pago', soles:'500.00', dolares:'' },
  { id:2, fecha:'2026-02-22', responsable:'Merino, Cahuna, Wilver Enmanuel',
    de:'Empresa SAC', motivo:'Depósito bancario', soles:'1200.00', dolares:'120.00' },
  { id:3, fecha:'2026-03-01', responsable:'Romero, Merino, Alexander Renson',
    de:'Alexander Paul, Moran Alburqueque', motivo:'Pago por servicio adicional', soles:'350.00', dolares:'' },
];

const VENDEDORES = ['fac-tura.com','Iturri, Quispe, Smith',
  'Merino, Cahuna, Wilver Enmanuel','Romero, Merino, Alexander Renson',
  'Yupanqui, Barboza, Raysa'];

const hoy      = new Date().toISOString().split('T')[0];
const fmtFecha = iso => { if(!iso) return ''; const [y,m,d]=iso.split('-'); return `${d}/${m}/${y}`; };
const sumSoles   = list => list.reduce((s,n)=>s+parseFloat(n.soles||0),0).toFixed(2);
const sumDolares = list => list.reduce((s,n)=>s+parseFloat(n.dolares||0),0).toFixed(2);

const css = `
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#212529;}

  /* barra */
  .oi-bar{display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end;margin-bottom:18px;}
  .oi-bar label{font-size:12px;font-weight:bold;display:block;margin-bottom:3px;color:#555;}
  .oi-bar input[type=text]{padding:5px 10px;border:1px solid #ced4da;border-radius:4px;
    font-size:13px;color:#212529;background:#fff;}
  .oi-radio-group{display:flex;gap:12px;align-items:center;font-size:13px;}
  .oi-radio-group label{display:flex;align-items:center;gap:4px;cursor:pointer;
    font-weight:bold;color:#212529;}
  .oi-radio-group input[type=radio]{accent-color:#17a2b8;width:14px;height:14px;}
  .oi-date-wrap{display:flex;align-items:center;gap:5px;border:1px solid #ced4da;
    border-radius:4px;padding:4px 8px;background:#fff;height:32px;min-width:130px;}
  .oi-date-wrap span.oi-dt{font-size:13px;color:#212529;min-width:85px;}
  .btn-oi{border:none;color:#fff;padding:7px 14px;border-radius:4px;cursor:pointer;
    font-size:13px;font-weight:bold;display:inline-flex;align-items:center;gap:5px;}
  .btn-oi:hover{opacity:.88;}

  /* tabla */
  .oi-titulo{text-align:center;font-weight:bold;font-size:14px;margin-bottom:8px;letter-spacing:.5px;}
  table.toi{width:100%;border-collapse:collapse;font-size:13px;}
  table.toi thead tr{background:#003d6b;}
  table.toi thead th{padding:10px 8px;text-align:center;color:#fff;font-weight:bold;
    font-size:12px;letter-spacing:.3px;}
  table.toi tbody tr{border-bottom:1px solid #dee2e6;background:#fff;}
  table.toi tbody tr:hover{background:#e8f4f8;}
  table.toi tbody td{padding:8px 8px;vertical-align:middle;color:#212529;}
  table.toi tfoot tr{background:#f0f0f0;}
  table.toi tfoot td{padding:8px 8px;font-weight:bold;color:#212529;font-size:13px;}
  .ic-oi{background:none;border:none;cursor:pointer;padding:2px 3px;
    display:inline-flex;align-items:center;border-radius:4px;}
  .ic-oi:hover{opacity:.8;transform:scale(1.15);}

  /* vista nuevo/editar */
  .oinuevo-wrap{max-width:700px;}
  .oinuevo-titulo{font-size:18px;font-weight:bold;margin-bottom:18px;color:#212529;}
  .oinuevo-label{font-size:12px;font-weight:bold;margin-bottom:3px;color:#555;}
  .oinuevo-inp{padding:6px 10px;border:1px solid #ced4da;border-radius:4px;
    font-size:13px;color:#212529;background:#fff;width:100%;}
  .oinuevo-inp-verde{padding:6px 10px;border:2px solid #28a745;border-radius:4px;
    font-size:13px;color:#212529;background:#ccff99;width:100%;}

  /* modales */
  .moi-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:3000;
    display:flex;align-items:center;justify-content:center;}
  .moi-box{background:#fff;border-radius:8px;min-width:460px;max-width:580px;
    width:92%;box-shadow:0 8px 32px rgba(0,0,0,.25);overflow:hidden;}
  .moi-head{padding:13px 20px;display:flex;justify-content:space-between;align-items:center;
    color:#fff;font-weight:bold;font-size:15px;}
  .moi-body{padding:20px;max-height:70vh;overflow-y:auto;}
  .moi-footer{padding:12px 20px;display:flex;gap:10px;justify-content:flex-end;
    border-top:1px solid #dee2e6;background:#f8f9fa;}
  .moi-btn{padding:7px 20px;border:none;border-radius:4px;cursor:pointer;
    font-size:13px;font-weight:bold;color:#fff;}
  .moi-row{display:flex;gap:10px;margin-bottom:12px;align-items:center;}
  .moi-label{font-weight:bold;font-size:13px;min-width:110px;color:#555;}
  .moi-inp{padding:6px 10px;border:1px solid #ced4da;border-radius:4px;
    font-size:13px;color:#212529;background:#fff;width:100%;}

  /* alerts */
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
    <div className="oi-date-wrap"
      style={verde ? {border:'2px solid #28a745',background:'#ccff99'} : {}}>
      <span className="oi-dt"
        style={verde ? {color:'#212529',fontWeight:'bold'} : {}}>
        {value || ''}
      </span>
      <span style={{cursor:'pointer'}}
        onClick={()=>ref.current.showPicker?.()??ref.current.click()}>
        <IcoCal/>
      </span>
      <input ref={ref} id={id} type="date" value={value}
        onChange={e=>onChange(e.target.value)}
        style={{opacity:0,width:1,height:1,position:'absolute',pointerEvents:'none'}}/>
    </div>
  );
};

/* ══════════════════════════════════════════════ */
export default function OtrosIngresos() {
  const [vista,  setVista]  = useState('lista'); // 'lista' | 'nuevo' | 'editar'
  const [ois,    setOis]    = useState(OI_INI);
  const [alert,  setAlert]  = useState('');
  const [editId, setEditId] = useState(null);

  /* filtros */
  const [bTipo, setBTipo] = useState('1');
  const [bq,    setBq]    = useState('');
  const [bfi,   setBfi]   = useState('');
  const [bff,   setBff]   = useState('');

  /* campos form nuevo/editar */
  const [fFecha,   setFFecha]   = useState(hoy);
  const [fResp,    setFResp]    = useState(VENDEDORES[1]);
  const [fDe,      setFDe]      = useState('');
  const [fMotivo,  setFMotivo]  = useState('');
  const [fSoles,   setFSoles]   = useState('');
  const [fDolares, setFDolares] = useState('');
  const [fObs,     setFObs]     = useState('');

  /* modal ver/eliminar */
  const [modal, setModal] = useState(null);

  const resetForm = () => {
    setFFecha(hoy); setFResp(VENDEDORES[1]); setFDe('');
    setFMotivo(''); setFSoles(''); setFDolares(''); setFObs('');
  };

  const abrirNuevo = () => { resetForm(); setEditId(null); setVista('nuevo'); };

  const abrirEditar = oi => {
    setEditId(oi.id);
    setFFecha(oi.fecha); setFResp(oi.responsable); setFDe(oi.de);
    setFMotivo(oi.motivo); setFSoles(oi.soles); setFDolares(oi.dolares||'');
    setFObs('');
    setVista('nuevo');
  };

  const guardar = () => {
    if (!fDe)     { setAlert('err:Ingrese el campo DE (origen del ingreso)'); return; }
    if (!fMotivo) { setAlert('err:Ingrese el motivo'); return; }
    if (!fSoles && !fDolares) { setAlert('err:Ingrese al menos un monto'); return; }

    if (editId) {
      setOis(prev => prev.map(o =>
        o.id===editId
          ? {...o, fecha:fFecha, responsable:fResp, de:fDe,
              motivo:fMotivo, soles:fSoles, dolares:fDolares}
          : o
      ));
      setAlert('ok:Ingreso actualizado correctamente.');
    } else {
      setOis(prev => [{
        id: Date.now(), fecha:fFecha, responsable:fResp,
        de:fDe, motivo:fMotivo, soles:fSoles, dolares:fDolares,
      }, ...prev]);
      setAlert('ok:Ingreso agregado correctamente.');
    }
    setTimeout(()=>setAlert(''), 3500);
    setVista('lista');
  };

  const eliminar = oi => {
    if (!window.confirm(`¿Eliminar el ingreso de "${oi.de}"?`)) return;
    setOis(prev => prev.filter(o => o.id !== oi.id));
    setModal(null);
    setAlert('ok:Ingreso eliminado.');
    setTimeout(()=>setAlert(''), 3000);
  };

  /* filtrado */
  const listaFilt = ois.filter(o => {
    if (bq) {
      const q = bq.toLowerCase();
      if (bTipo==='1' && !o.de.toLowerCase().includes(q))     return false;
      if (bTipo==='2' && !o.motivo.toLowerCase().includes(q)) return false;
    }
    if (bfi && o.fecha < bfi) return false;
    if (bff && o.fecha > bff) return false;
    return true;
  });

  /* ════════════════ RENDER ════════════════ */
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
          <span style={{fontSize:16,fontWeight:'bold'}}>OTROS INGRESOS</span>
        </div>

        {/* barra búsqueda */}
        <div className="oi-bar no-print">
          <div>
            <div style={{fontWeight:'bold',fontSize:13,marginBottom:4}}>BUSCAR X</div>
            <div className="oi-radio-group" style={{marginBottom:6}}>
              <label>
                <input type="radio" name="oiTipo" value="1"
                  checked={bTipo==='1'} onChange={()=>setBTipo('1')}/> DE /
              </label>
              <label>
                <input type="radio" name="oiTipo" value="2"
                  checked={bTipo==='2'} onChange={()=>setBTipo('2')}/> Motivo
              </label>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <input type="text" value={bq} onChange={e=>setBq(e.target.value)}
                placeholder="Ingrese el texto a buscar" style={{width:300}}/>
              <span style={{fontWeight:'bold',fontSize:13}}>y/o</span>
            </div>
          </div>

          <div><label>Fecha Inicio</label><DP id="oiFI" value={bfi} onChange={setBfi}/></div>
          <div><label>Fecha Fin</label><DP id="oiFF" value={bff} onChange={setBff}/></div>

          <button className="btn-oi" style={{background:'#17a2b8',border:'1px solid #138496'}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2"/>
            </svg>
            Buscar
          </button>
          <button className="btn-oi" style={{background:'#17a2b8',border:'1px solid #138496'}}
            onClick={abrirNuevo}>
            <span style={{fontSize:16,fontWeight:'bold',lineHeight:1}}>+</span>
            Agregar Nuevo
          </button>
        </div>

        {/* tabla */}
        <div className="oi-titulo">LISTADO GENERAL</div>
        <table className="toi">
          <thead>
            <tr>
              <th width="7%">Op</th>
              <th width="13%">Fecha</th>
              <th width="12%">Respons.</th>
              <th>DE</th>
              <th>Motivo</th>
              <th width="10%" style={{textAlign:'right'}}>S/.</th>
              <th width="10%" style={{textAlign:'right'}}>US$</th>
            </tr>
          </thead>
          <tbody>
            {listaFilt.length === 0
              ? <tr><td colSpan={7} align="center" style={{padding:20,color:'#888'}}>Sin registros</td></tr>
              : listaFilt.map(o=>(
                <tr key={o.id}>
                  <td align="center" style={{whiteSpace:'nowrap'}}>
                    <button className="ic-oi no-print" title="Editar"
                      onClick={()=>abrirEditar(o)}>
                      <span style={{background:'#e67e22',color:'#fff',borderRadius:4,
                        padding:'3px 7px',fontSize:13,fontWeight:'bold'}}>✏</span>
                    </button>
                    <button className="ic-oi no-print" title="Eliminar"
                      onClick={()=>setModal(o)} style={{marginLeft:3}}>
                      <span style={{background:'#dc3545',color:'#fff',borderRadius:4,
                        padding:'3px 7px',fontSize:13}}>🗑</span>
                    </button>
                  </td>
                  <td align="center">{fmtFecha(o.fecha)}</td>
                  <td>{o.responsable}</td>
                  <td>{o.de}</td>
                  <td>{o.motivo}</td>
                  <td align="right">S/ {o.soles}</td>
                  <td align="right">{o.dolares ? `US$ ${o.dolares}` : ''}</td>
                </tr>
              ))
            }
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              <td></td>
              <td><b>Total</b></td>
              <td></td>
              <td></td>
              <td align="right"><b>{sumSoles(listaFilt)}</b></td>
              <td align="right"><b>{sumDolares(listaFilt)}</b></td>
            </tr>
          </tfoot>
        </table>
      </>)}

      {/* ════ VISTA NUEVO / EDITAR ════ */}
      {vista === 'nuevo' && (
        <div className="oinuevo-wrap" style={{maxWidth:'100%'}}>
          <div className="oinuevo-titulo">
            {editId ? 'OTROS INGRESOS : EDITAR' : 'OTROS INGRESOS : NUEVO'}
          </div>

          <hr style={{border:'none',borderTop:'1px solid #dee2e6',marginBottom:16}}/>

          {/* Fila principal — igual al PHP */}
          <div style={{display:'grid',
            gridTemplateColumns:'180px 1fr 1fr 160px 140px 140px',
            gap:12,marginBottom:20,alignItems:'end'}}>

            <div>
              <div className="oinuevo-label">Fecha (*)</div>
              <DP id="oiNF" value={fFecha} onChange={setFFecha} verde={true}/>
            </div>

            <div>
              <div className="oinuevo-label">A : (*)</div>
              <input className="oinuevo-inp" placeholder=""
                value={fDe} onChange={e=>setFDe(e.target.value)}/>
            </div>

            <div>
              <div className="oinuevo-label">Detalle(*)</div>
              <textarea className="oinuevo-inp" rows={2}
                value={fMotivo} onChange={e=>setFMotivo(e.target.value)}
                style={{resize:'none',height:38}}/>
            </div>

            <div>
              <div className="oinuevo-label">Tipo :(*)</div>
              <select className="oinuevo-inp" value={fResp} onChange={e=>setFResp(e.target.value)}>
                <option>General</option>
                <option>Adelanto</option>
                <option>Depósito</option>
                <option>Préstamo</option>
                <option>Otros</option>
              </select>
            </div>

            <div>
              <div className="oinuevo-label">Moneda :(*)</div>
              <select className="oinuevo-inp" value={fDolares==='' ? 'Soles' : 'Dolares'}
                onChange={e=>{ if(e.target.value==='Dolares'){setFDolares(fSoles||'');setFSoles('');}
                               else{setFSoles(fDolares||'');setFDolares('');} }}>
                <option>Soles</option>
                <option>Dolares</option>
              </select>
            </div>

            <div>
              <div className="oinuevo-label">Monto (*)</div>
              <input className="oinuevo-inp" type="number" placeholder="0.00"
                value={fDolares==='' ? fSoles : fDolares}
                onChange={e=>{ fDolares==='' ? setFSoles(e.target.value) : setFDolares(e.target.value); }}/>
            </div>
          </div>

          {/* botones — igual al PHP: Guardar | Limpiar | Regresar */}
          <div style={{display:'flex',gap:10,justifyContent:'center'}}>
            <button onClick={guardar}
              style={{background:'#17a2b8',border:'none',color:'#fff',padding:'8px 20px',
                borderRadius:4,cursor:'pointer',fontSize:13,fontWeight:'bold',
                display:'inline-flex',alignItems:'center',gap:6}}>
              💾 Guardar
            </button>
            <button onClick={resetForm}
              style={{background:'#17a2b8',border:'none',color:'#fff',padding:'8px 20px',
                borderRadius:4,cursor:'pointer',fontSize:13,fontWeight:'bold',
                display:'inline-flex',alignItems:'center',gap:6}}>
              🗋 Limpiar
            </button>
            <button onClick={()=>setVista('lista')}
              style={{background:'#17a2b8',border:'none',color:'#fff',padding:'8px 20px',
                borderRadius:4,cursor:'pointer',fontSize:13,fontWeight:'bold',
                display:'inline-flex',alignItems:'center',gap:6}}>
              ↩ Regresar
            </button>
          </div>
        </div>
      )}

      {/* ════ MODAL CONFIRMAR ELIMINAR ════ */}
      {modal && (
        <div className="moi-overlay no-print" onClick={()=>setModal(null)}>
          <div className="moi-box" onClick={e=>e.stopPropagation()}>
            <div className="moi-head" style={{background:'#dc3545'}}>
              🗑 Eliminar Ingreso
              <span style={{cursor:'pointer',fontSize:18}} onClick={()=>setModal(null)}>✕</span>
            </div>
            <div className="moi-body">
              <div style={{background:'#f8f9fa',border:'1px solid #dee2e6',borderRadius:6,
                padding:'10px 14px',marginBottom:14,fontSize:13}}>
                <div className="moi-row" style={{marginBottom:4}}>
                  <span className="moi-label">Fecha:</span>
                  <span style={{fontSize:13}}>{fmtFecha(modal.fecha)}</span>
                </div>
                <div className="moi-row" style={{marginBottom:4}}>
                  <span className="moi-label">DE:</span>
                  <span style={{fontSize:13}}>{modal.de}</span>
                </div>
                <div className="moi-row" style={{marginBottom:4}}>
                  <span className="moi-label">Motivo:</span>
                  <span style={{fontSize:13}}>{modal.motivo}</span>
                </div>
                <div className="moi-row" style={{marginBottom:0}}>
                  <span className="moi-label">Monto:</span>
                  <span style={{fontSize:13,fontWeight:'bold',color:'#dc3545'}}>
                    S/ {modal.soles}{modal.dolares ? ` / US$ ${modal.dolares}` : ''}
                  </span>
                </div>
              </div>
              <p style={{fontSize:13,color:'#721c24',fontWeight:'bold'}}>
                ¿Está seguro que desea eliminar este registro?
              </p>
            </div>
            <div className="moi-footer">
              <button className="moi-btn" style={{background:'#dc3545'}}
                onClick={()=>eliminar(modal)}>
                🗑 Sí, Eliminar
              </button>
              <button className="moi-btn" style={{background:'#6c757d'}}
                onClick={()=>setModal(null)}>
                ✕ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}