import { useState, useRef } from "react";

/* ─── DATOS DEMO ─── */
const SUCURSALES = ['Todos', 'Tienda 1b 133', 'Tienda 1A 119', 'Almacen 2B 167'];
const SUCURSALES_DEST = ['Tienda 1A 119 >> Av. Inca Garcilaso De La Vega 1348 Int 1A119 > Lima',
                         'Almacen 2B 167 >> Av. Inca Garcilaso De La Vega 1348 Int 2B 167 > Lima'];
const TIPOS_BUSQ = ['Articulo','Marca','Categoria','Codigo','C.Barra','Nro Guia'];
const ORIGEN_BUSQ = ['Origen','Destino'];

const TRASLADOS_INI = [
  { id:1, guia:'TI01-000001', fechaEnt:'2026-02-10', fechaTra:'2026-02-10',
    res:'Iturri, Quispe, Smith', de:'Tienda 1b 133', a:'Tienda 1A 119',
    articulo:'Laptop HP 15s', cantidad:2 },
  { id:2, guia:'TI01-000002', fechaEnt:'2026-02-15', fechaTra:'2026-02-16',
    res:'Merino, Cahuna', de:'Tienda 1b 133', a:'Almacen 2B 167',
    articulo:'Mouse Logitech MX', cantidad:5 },
  { id:3, guia:'TI01-000003', fechaEnt:'2026-02-22', fechaTra:'2026-02-22',
    res:'Romero, Merino', de:'Almacen 2B 167', a:'Tienda 1b 133',
    articulo:'Teclado Mecánico Redragon', cantidad:3 },
  { id:4, guia:'TI01-000004', fechaEnt:'2026-03-01', fechaTra:'2026-03-01',
    res:'Iturri, Quispe, Smith', de:'Tienda 1A 119', a:'Almacen 2B 167',
    articulo:'Monitor Samsung 24"', cantidad:1 },
];

const ARTS_DB_ALM = [
  { codigo:'ART-001', articulo:'Laptop HP 15s',            stock:10, med:'UND' },
  { codigo:'ART-002', articulo:'Mouse Logitech MX',         stock:25, med:'UND' },
  { codigo:'ART-003', articulo:'Teclado Mecánico Redragon', stock:15, med:'UND' },
  { codigo:'ART-004', articulo:'Monitor Samsung 24"',       stock:8,  med:'UND' },
  { codigo:'ART-005', articulo:'Silla Ergonómica',          stock:5,  med:'UND' },
  { codigo:'ART-006', articulo:'Cable HDMI 2m',             stock:50, med:'UND' },
  { codigo:'ART-007', articulo:'Auriculares Sony WH',       stock:12, med:'UND' },
];

const hoy = new Date().toISOString().slice(0,10);
const fmtFecha = f => f ? f.split('-').reverse().join('/') : '';
const padNum = n => String(n).padStart(6,'0');
let seq = 5;

/* ─── ÍCONO CALENDARIO ─── */
const IcoCal = () => (
  <svg width="18" height="18" viewBox="0 0 36 36" fill="none">
    <rect x="1" y="4" width="34" height="30" rx="3" fill="#fff" stroke="#bbb" strokeWidth="1.5"/>
    <rect x="1" y="4" width="34" height="9" rx="3" fill="#e74c3c"/>
    <rect x="1" y="9" width="34" height="4" fill="#e74c3c"/>
    <rect x="10" y="1" width="3" height="7" rx="1.5" fill="#888"/>
    <rect x="23" y="1" width="3" height="7" rx="1.5" fill="#888"/>
  </svg>
);

/* ─── DATE PICKER ─── */
const DP = ({ id, value, onChange, verde }) => {
  const ref = useRef();
  return (
    <div style={{display:'inline-flex',alignItems:'center',gap:4,
      border: verde ? '2px solid #28a745' : '1px solid #ced4da',
      background: verde ? '#ccff99' : '#fff',
      borderRadius:4, padding:'4px 8px', cursor:'pointer', minWidth:140}}
      onClick={() => ref.current.showPicker?.() ?? ref.current.click()}>
      <span style={{fontSize:13,color:'#212529',flex:1}}>
        {value ? value.split('-').reverse().join('/') : ''}
      </span>
      <IcoCal/>
      <input ref={ref} id={id} type="date" value={value}
        onChange={e => onChange(e.target.value)}
        style={{opacity:0,width:1,height:1,position:'absolute',pointerEvents:'none'}}/>
    </div>
  );
};

/* ─── BUSCADOR ARTÍCULOS ALMACÉN ─── */
function BuscadorArticulosAlm({ onAgregar }) {
  const RADIOS = ['Nombre /','Marca /','Linea /','Cat. /','Codigo /','C.Barra /','Serie'];
  const [tipo, setTipo]   = useState('Nombre /');
  const [q,    setQ]      = useState('');
  const [fila, setFila]   = useState({ codigo:'', articulo:'', stock:'', med:'Und.', cant:'1' });

  const resultados = q
    ? ARTS_DB_ALM.filter(a => a.articulo.toLowerCase().includes(q.toLowerCase()) ||
        a.codigo.toLowerCase().includes(q.toLowerCase()))
    : [];

  const sel = a => {
    setFila(f => ({...f, codigo:a.codigo, articulo:a.articulo,
      stock:String(a.stock), med:a.med}));
    setQ('');
  };

  const limpiar = () => setFila({ codigo:'', articulo:'', stock:'', med:'Und.', cant:'1' });

  return (
    <div style={{marginTop:16}}>
      <div style={{fontWeight:'bold',fontSize:13,marginBottom:8}}>BUSQUEDA DE ARTICULOS x</div>
      {/* radios */}
      <div style={{display:'flex',gap:12,flexWrap:'wrap',alignItems:'center',marginBottom:8}}>
        {RADIOS.map(r => (
          <label key={r} style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:13,cursor:'pointer'}}>
            <input type="radio" name="almTipo" value={r}
              checked={tipo===r} onChange={() => setTipo(r)}
              style={{accentColor:'#003d6b'}}/>
            {r}
          </label>
        ))}
        <input value={q} onChange={e => setQ(e.target.value)}
          style={{padding:'6px 10px',border:'2px solid #28a745',borderRadius:4,
            background:'#ccff99',fontSize:13,color:'#212529',width:260, marginLeft:4}}
          placeholder="Buscar artículo..."/>
        <button style={{background:'#17a2b8',border:'none',color:'#fff',padding:'6px 14px',
          borderRadius:4,cursor:'pointer',fontSize:12,fontWeight:'bold',
          display:'inline-flex',alignItems:'center',gap:4}}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2"/>
          </svg> Buscar
        </button>
        <button onClick={limpiar} style={{background:'#17a2b8',border:'none',color:'#fff',
          padding:'6px 10px',borderRadius:4,cursor:'pointer',fontSize:13}}>↺</button>
      </div>

      {/* dropdown */}
      {resultados.length > 0 && (
        <div style={{background:'#fff',border:'1px solid #dee2e6',borderRadius:4,
          marginBottom:8,maxHeight:130,overflowY:'auto'}}>
          {resultados.map(a => (
            <div key={a.codigo} onClick={() => sel(a)}
              style={{padding:'6px 10px',cursor:'pointer',fontSize:12,
                borderBottom:'1px solid #f0f0f0',display:'flex',gap:10}}
              onMouseEnter={e => e.currentTarget.style.background='#e8f4f8'}
              onMouseLeave={e => e.currentTarget.style.background='#fff'}>
              <span style={{color:'#003d6b',fontWeight:'bold',minWidth:80}}>{a.codigo}</span>
              <span>{a.articulo}</span>
              <span style={{marginLeft:'auto',color:'#555'}}>Stock: {a.stock}</span>
            </div>
          ))}
        </div>
      )}

      {/* tabla fila */}
      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
          <thead>
            <tr style={{background:'#003d6b',color:'#fff'}}>
              {['CODIGO','ARTICULOS/DETALLE','STOCK','MED.','CANT.','AGRE'].map(h => (
                <th key={h} style={{padding:'8px 10px',textAlign:'center',
                  border:'1px solid #0056a0',fontSize:11,letterSpacing:1}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{background:'#fff'}}>
              <td style={{padding:4,border:'1px solid #dee2e6'}}>
                <input value={fila.codigo} onChange={e=>setFila(f=>({...f,codigo:e.target.value}))}
                  style={{width:'100%',padding:'4px 6px',border:'1px solid #ced4da',
                    borderRadius:3,fontSize:12,background:'#fff',color:'#212529'}}/>
              </td>
              <td style={{padding:4,border:'1px solid #dee2e6'}}>
                <textarea value={fila.articulo} onChange={e=>setFila(f=>({...f,articulo:e.target.value}))}
                  style={{width:'100%',padding:'4px 6px',border:'1px solid #ced4da',
                    borderRadius:3,fontSize:12,resize:'none',height:34,
                    background:'#fff',color:'#212529'}}
                  placeholder="Articulo/descripcion"/>
              </td>
              <td style={{padding:4,border:'1px solid #dee2e6',textAlign:'center',
                fontSize:12,color:'#555'}}>{fila.stock}</td>
              <td style={{padding:4,border:'1px solid #dee2e6'}}>
                <select value={fila.med} onChange={e=>setFila(f=>({...f,med:e.target.value}))}
                  style={{width:'100%',padding:'3px',fontSize:12,border:'1px solid #ced4da',
                    borderRadius:3,background:'#fff',color:'#212529'}}>
                  {['Und.','Kg.','Lt.','Mt.','Cja.','Par','Doc.'].map(m=><option key={m}>{m}</option>)}
                </select>
              </td>
              <td style={{padding:4,border:'1px solid #dee2e6'}}>
                <input value={fila.cant} onChange={e=>setFila(f=>({...f,cant:e.target.value}))}
                  style={{width:'100%',padding:'4px 6px',border:'1px solid #ced4da',
                    borderRadius:3,fontSize:12,background:'#fff',color:'#212529'}}
                  type="number" min="1"/>
              </td>
              <td style={{padding:4,border:'1px solid #dee2e6',textAlign:'center'}}>
                <button onClick={() => {
                  if (!fila.articulo) return;
                  onAgregar({...fila});
                  limpiar();
                }}
                  style={{background:'#17a2b8',border:'2px solid #138496',color:'#fff',
                    borderRadius:4,padding:'4px 10px',cursor:'pointer',fontSize:16}}>
                  ✔
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*                   COMPONENTE PRINCIPAL                     */
/* ══════════════════════════════════════════════════════════ */
const css = `
.at-wrap { font-family: 'Segoe UI', Arial, sans-serif; font-size:13px; color:#212529; }
.at-inp  { width:100%; padding:5px 8px; border:1px solid #ced4da; border-radius:4px;
           font-size:13px; background:#fff; color:#212529; box-sizing:border-box; }
.at-sel  { width:100%; padding:5px 6px; border:1px solid #ced4da; border-radius:4px;
           font-size:13px; background:#fff; color:#212529; }
.at-lbl  { font-size:12px; color:#555; margin-bottom:3px; display:block; }
.at-btn  { border:none; color:#fff; padding:7px 18px; border-radius:4px; cursor:pointer;
           font-size:13px; font-weight:bold; display:inline-flex; align-items:center; gap:6px; }
.at-sec  { border:1px solid #dee2e6; border-radius:6px; padding:14px 16px; margin-bottom:14px; }
.at-stit { font-weight:bold; font-size:13px; color:#212529; margin-bottom:10px; }
.at-tbl  { width:100%; border-collapse:collapse; font-size:13px; }
.at-tbl th { background:#003d6b; color:#fff; padding:8px 10px; text-align:center;
             border:1px solid #0056a0; font-size:11px; letter-spacing:1px; }
.at-tbl td { padding:7px 10px; border:1px solid #dee2e6; vertical-align:middle; }
.at-tbl tr:hover td { background:#f0f7ff; }
.at-tbl .total-row td { background:#e9ecef; font-weight:bold; font-size:12px; color:#555; }
.at-alert-ok  { position:fixed; top:70px; right:20px; z-index:9999;
  background:#d4edda; border:1px solid #c3e6cb; color:#155724;
  padding:10px 18px; border-radius:6px; font-size:13px; font-weight:bold; }
.at-alert-err { position:fixed; top:70px; right:20px; z-index:9999;
  background:#f8d7da; border:1px solid #f5c6cb; color:#721c24;
  padding:10px 18px; border-radius:6px; font-size:13px; font-weight:bold; }
.at-overlay { position:fixed; inset:0; background:rgba(0,0,0,.45); z-index:1050;
  display:flex; align-items:center; justify-content:center; }
.at-modal  { background:#fff; border-radius:8px; width:520px; max-width:95vw;
  max-height:90vh; overflow-y:auto; box-shadow:0 8px 32px rgba(0,0,0,.25); }
.at-mhead  { padding:14px 18px; color:#fff; font-weight:bold; font-size:15px;
  border-radius:8px 8px 0 0; display:flex; justify-content:space-between; align-items:center; }
.at-mbody  { padding:18px; }
.at-mfoot  { padding:12px 18px; border-top:1px solid #dee2e6;
  display:flex; gap:8px; justify-content:flex-end; flex-wrap:wrap; }
.at-mrow   { display:flex; align-items:center; gap:8px; margin-bottom:10px; font-size:13px; }
.at-mlbl   { min-width:110px; font-weight:bold; color:#555; font-size:12px; }
.at-minp   { flex:1; padding:5px 8px; border:1px solid #ced4da; border-radius:4px;
  font-size:13px; background:#fff; color:#212529; }
.at-verde  { background:#ccff99 !important; border:2px solid #28a745 !important; }
@media print { .no-print { display:none !important; } }
`;

export default function AlmacenTraslado() {
  const [vista,      setVista]     = useState('lista');
  const [traslados,  setTraslados] = useState(TRASLADOS_INI);
  const [alert,      setAlert]     = useState('');
  const [modal,      setModal]     = useState(null);

  /* filtros lista */
  const [bOrigen, setBOrigen] = useState('Origen');
  const [bSuc,    setBSuc]    = useState('Todos');
  const [bTipo,   setBTipo]   = useState('Articulo');
  const [bq,      setBq]      = useState('');
  const [bfi,     setBfi]     = useState('');
  const [bff,     setBff]     = useState('');

  /* form nuevo */
  const [fGuiaSel,  setFGuiaSel]  = useState('');
  const [fGuiaNro,  setFGuiaNro]  = useState('');
  const [fFechaE,   setFFechaE]   = useState(hoy);
  const [fFechaT,   setFFechaT]   = useState(hoy);
  const [fDestino,  setFDestino]  = useState('');
  const [fVehiculo, setFVehiculo] = useState('');
  const [fCertif,   setFCertif]   = useState('');
  const [fLicencia, setFLicencia] = useState('');
  const [fNombret,  setFNombret]  = useState('');
  const [fRuct,     setFRuct]     = useState('');
  const [fCosto,    setFCosto]    = useState('');
  const [artItems,  setArtItems]  = useState([]);

  /* modal editar */
  const [mEst,  setMEst]  = useState('');
  const [mObs,  setMObs]  = useState('');

  const showAlert = msg => { setAlert(msg); setTimeout(() => setAlert(''), 3500); };

  const resetForm = () => {
    setFGuiaSel(''); setFGuiaNro(''); setFFechaE(hoy); setFFechaT(hoy);
    setFDestino(''); setFVehiculo(''); setFCertif(''); setFLicencia('');
    setFNombret(''); setFRuct(''); setFCosto(''); setArtItems([]);
  };

  /* filtrado lista */
  const lista = traslados.filter(t => {
    if (bSuc !== 'Todos') {
      if (bOrigen === 'Origen' && !t.de.includes(bSuc.split(' ')[0])) return false;
      if (bOrigen === 'Destino' && !t.a.includes(bSuc.split(' ')[0])) return false;
    }
    if (bq) {
      const q = bq.toLowerCase();
      if (!t.articulo.toLowerCase().includes(q) && !t.guia.toLowerCase().includes(q)) return false;
    }
    if (bfi && t.fechaEnt < bfi) return false;
    if (bff && t.fechaEnt > bff) return false;
    return true;
  });

  const totalCant = lista.reduce((s, t) => s + Number(t.cantidad), 0);

  const guardar = () => {
    if (!fDestino) { showAlert('err:Seleccione el Destino'); return; }
    const nro = `TI01-${padNum(seq++)}`;
    const dest = fDestino.split('>>')[0].trim();
    const artTexto = artItems.length
      ? artItems.map(a => `${a.articulo} (x${a.cant})`).join(', ')
      : '—';
    setTraslados(prev => [{
      id: Date.now(), guia: nro, fechaEnt: fFechaE, fechaTra: fFechaT,
      res: 'Iturri, Quispe, Smith', de: 'Tienda 1b 133', a: dest,
      articulo: artTexto, cantidad: artItems.reduce((s,a) => s + Number(a.cant), 0) || 1,
    }, ...prev]);
    showAlert('ok:Traslado registrado correctamente.');
    setVista('lista');
    resetForm();
  };

  /* ── RENDER MODAL ── */
  const renderModal = () => {
    if (!modal) return null;
    const t = modal.traslado;
    return (
      <div className="at-overlay no-print" onClick={() => setModal(null)}>
        <div className="at-modal" onClick={e => e.stopPropagation()}>
          <div className="at-mhead" style={{background:'#e67e22'}}>
            ✏ Actualizar / Eliminar — {t.guia}
            <span style={{cursor:'pointer',fontSize:18}} onClick={() => setModal(null)}>✕</span>
          </div>
          <div className="at-mbody">
            {[['Guía',t.guia],['Fecha Ent.',fmtFecha(t.fechaEnt)],
              ['Origen',t.de],['Destino',t.a],['Artículo',t.articulo],
              ['Cantidad',t.cantidad]
            ].map(([l,v]) => (
              <div key={l} className="at-mrow">
                <span className="at-mlbl">{l}:</span>
                <span style={{fontSize:13}}>{v}</span>
              </div>
            ))}
            <div className="at-mrow">
              <span className="at-mlbl">Observación:</span>
              <textarea className="at-minp" rows={2} value={mObs}
                onChange={e => setMObs(e.target.value)} style={{resize:'none'}}/>
            </div>
          </div>
          <div className="at-mfoot">
            <button className="at-btn" style={{background:'#e67e22'}}
              onClick={() => { setModal(null); showAlert('ok:Traslado actualizado.'); }}>
              💾 Actualizar</button>
            <button className="at-btn" style={{background:'#dc3545'}}
              onClick={() => {
                if (!window.confirm(`¿Eliminar ${t.guia}?`)) return;
                setTraslados(p => p.filter(x => x.id !== t.id));
                setModal(null); showAlert('ok:Traslado eliminado.');
              }}>🗑 Eliminar</button>
            <button className="at-btn" style={{background:'#6c757d'}}
              onClick={() => setModal(null)}>✕ Cancelar</button>
          </div>
        </div>
      </div>
    );
  };

  /* ══════════════ RENDER PRINCIPAL ══════════════ */
  return (
    <div className="at-wrap">
      <style>{css}</style>

      {alert && (
        <div className={alert.startsWith('ok:') ? 'at-alert-ok' : 'at-alert-err'}>
          {alert.startsWith('ok:') ? '✅ ' : '⚠️ '}{alert.slice(3)}
        </div>
      )}

      {/* ── TÍTULO ── */}
      <h4 style={{display:'flex',alignItems:'center',gap:8,marginBottom:16,fontSize:16}}>
        <span style={{background:'#17a2b8',color:'#fff',borderRadius:'50%',
          width:22,height:22,display:'inline-flex',alignItems:'center',
          justifyContent:'center',fontSize:13,cursor:'pointer'}}>?</span>
        Almacén: traslado de artículos
      </h4>

      {/* ══ VISTA LISTA ══ */}
      {vista === 'lista' && (
        <>
          {/* BUSCAR */}
          <div className="no-print" style={{background:'#f8f9fa',border:'1px solid #dee2e6',
            borderRadius:6,padding:'12px 16px',marginBottom:16}}>
            <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'flex-end'}}>
              <div>
                <span style={{fontWeight:'bold',fontSize:13,marginRight:6}}>BUSCAR X</span>
                <select className="at-sel" style={{width:90,display:'inline-block'}}
                  value={bOrigen} onChange={e => setBOrigen(e.target.value)}>
                  {ORIGEN_BUSQ.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <select className="at-sel" style={{width:140}}
                  value={bSuc} onChange={e => setBSuc(e.target.value)}>
                  {SUCURSALES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <span style={{fontSize:13,marginRight:4}}>y/o</span>
                <select className="at-sel" style={{width:110,display:'inline-block'}}
                  value={bTipo} onChange={e => setBTipo(e.target.value)}>
                  {TIPOS_BUSQ.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={{flex:'1 1 180px'}}>
                <input className="at-inp" value={bq} onChange={e => setBq(e.target.value)}
                  placeholder="Buscar..." style={{marginBottom:0}}/>
              </div>
              <span style={{fontSize:13,fontWeight:'bold'}}>y/o</span>
              <div>
                <label className="at-lbl">Fecha Inicio</label>
                <DP id="almFi" value={bfi} onChange={setBfi}/>
              </div>
              <div>
                <label className="at-lbl">Fecha Fin</label>
                <DP id="almFf" value={bff} onChange={setBff}/>
              </div>
              <button className="at-btn" style={{background:'#17a2b8'}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2"/>
                  <path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2"/>
                </svg> Buscar
              </button>
              <button className="at-btn" style={{background:'#17a2b8'}}
                onClick={() => { resetForm(); setVista('nuevo'); }}>
                + 1
              </button>
            </div>
          </div>

          {/* TABLA */}
          <div style={{textAlign:'center',fontWeight:'bold',fontSize:14,marginBottom:10}}>
            TRASLADOS DE ARTICULOS ENTRA ALMACENES
          </div>
          <div style={{overflowX:'auto'}}>
            <table className="at-tbl">
              <thead>
                <tr>
                  {['GUIA','FECHA ENT','FECHA TRA.','RES.','DE','A','ARTICULO','CANTIDAD',''].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* fila total */}
                <tr className="total-row">
                  <td><b>Total</b></td>
                  <td/><td/><td/><td/><td/><td/>
                  <td style={{textAlign:'center'}}><b>{totalCant}</b></td>
                  <td/>
                </tr>
                {lista.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{textAlign:'center',color:'#888',padding:20}}>
                      No hay registros
                    </td>
                  </tr>
                ) : lista.map(t => (
                  <tr key={t.id}>
                    <td style={{whiteSpace:'nowrap'}}><b>{t.guia}</b></td>
                    <td style={{whiteSpace:'nowrap'}}>{fmtFecha(t.fechaEnt)}</td>
                    <td style={{whiteSpace:'nowrap'}}>{fmtFecha(t.fechaTra)}</td>
                    <td style={{fontSize:12}}>{t.res}</td>
                    <td style={{fontSize:12,color:'#003d6b'}}>{t.de}</td>
                    <td style={{fontSize:12,color:'#28a745'}}>{t.a}</td>
                    <td style={{fontSize:12}}>{t.articulo}</td>
                    <td style={{textAlign:'center'}}><b>{t.cantidad}</b></td>
                    <td style={{textAlign:'center',whiteSpace:'nowrap'}}>
                      <button onClick={() => { setMObs(''); setModal({traslado:t}); }}
                        style={{background:'#e67e22',border:'none',color:'#fff',
                          borderRadius:4,padding:'3px 10px',cursor:'pointer',fontSize:12}}>
                        ✏
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* imprimir / excel / pdf */}
          <div style={{display:'flex',justifyContent:'center',marginTop:20}} className="no-print">
            <fieldset style={{border:'1px solid #ced4da',borderRadius:6,padding:'10px 24px',
              textAlign:'center',fontSize:13}}>
              <legend style={{fontSize:12,color:'#555',padding:'0 6px'}}>
                Visualizar y/o Imprimir en
              </legend>
              <div style={{display:'flex',gap:18,alignItems:'center',justifyContent:'center'}}>
                {[['🖨 Imprimir','#17a2b8',() => window.print()],
                  ['📊 Excel','#28a745',() => showAlert('ok:Exportando a Excel...')],
                  ['📄 PDF','#dc3545',() => showAlert('ok:Exportando a PDF...')],
                ].map(([lbl,bg,fn]) => (
                  <button key={lbl} onClick={fn}
                    style={{background:bg,border:'none',color:'#fff',padding:'5px 14px',
                      borderRadius:4,cursor:'pointer',fontSize:12,fontWeight:'bold'}}>
                    {lbl}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        </>
      )}

      {/* ══ VISTA NUEVO ══ */}
      {vista === 'nuevo' && (
        <div>
          <div style={{fontWeight:'bold',fontSize:15,marginBottom:14,color:'#212529'}}>
            TRASLADO ENTRE ALMACEN : CON GUIA DE REMISION
          </div>

          {/* ── DOCUMENTO DE SALIDA ── */}
          <div className="at-sec">
            <div className="at-stit">Documento de salida</div>
            <hr style={{border:'none',borderTop:'1px solid #dee2e6',marginBottom:12}}/>
            <div style={{display:'flex',gap:12,flexWrap:'wrap',alignItems:'flex-end'}}>
              <div>
                <label className="at-lbl">Nro Guia</label>
                <div style={{display:'flex',gap:6}}>
                  <select className="at-sel" style={{width:200}}
                    value={fGuiaSel} onChange={e => setFGuiaSel(e.target.value)}>
                    <option value=""></option>
                    <option value="4-TI01">Guia de Remision TI01</option>
                  </select>
                  <input className="at-inp" style={{width:100}} value={fGuiaNro}
                    onChange={e => setFGuiaNro(e.target.value)} placeholder="Nro"/>
                </div>
              </div>
              <div>
                <label className="at-lbl">Fecha Ent. :(*)</label>
                <DP id="almNFE" value={fFechaE} onChange={setFFechaE} verde={true}/>
              </div>
              <div>
                <label className="at-lbl">Fecha tra. :(*)</label>
                <DP id="almNFT" value={fFechaT} onChange={setFFechaT} verde={true}/>
              </div>
            </div>
          </div>

          {/* ── ORIGEN / DESTINO ── */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
            {/* Origen */}
            <div style={{background:'#e8e8e8',border:'1px solid #dee2e6',borderRadius:6,padding:14}}>
              <div style={{fontWeight:'bold',fontSize:13,marginBottom:8}}>
                Origen (de) :{' '}
                <span style={{color:'#0099ff'}}>Tienda 1b 133</span>
              </div>
              <hr style={{border:'none',borderTop:'1px solid #ccc',marginBottom:10}}/>
              <div style={{marginBottom:8}}>
                <label className="at-lbl">Direccion :(*)</label>
                <input className="at-inp at-verde"
                  value="Av. Inca Garcilaso De La Vega 1348 Int 133" readOnly
                  style={{background:'#ccff99',border:'2px solid #28a745',color:'#212529'}}/>
              </div>
              <div>
                <label className="at-lbl">Distrito :(*)</label>
                <input className="at-inp at-verde" value="Lima" readOnly
                  style={{background:'#ccff99',border:'2px solid #28a745',color:'#212529',width:180}}/>
              </div>
            </div>
            {/* Destino */}
            <div style={{border:'1px solid #dee2e6',borderRadius:6,padding:14}}>
              <div style={{fontWeight:'bold',fontSize:13,marginBottom:8}}>
                Destino (a)(*)
              </div>
              <select className="at-sel" value={fDestino}
                onChange={e => setFDestino(e.target.value)} required>
                <option value=""></option>
                {SUCURSALES_DEST.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* ── VEHÍCULO / TRANSPORTISTA ── */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
            {/* Vehículo */}
            <div className="at-sec">
              <div className="at-stit">Vehiculo</div>
              <hr style={{border:'none',borderTop:'1px solid #dee2e6',marginBottom:10}}/>
              <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                {[['Vehiculo :', fVehiculo, setFVehiculo, 100],
                  ['Certificado :', fCertif, setFCertif, 110],
                  ['Licencia :', fLicencia, setFLicencia, 100]
                ].map(([lbl, val, set, w]) => (
                  <div key={lbl}>
                    <label className="at-lbl">{lbl}</label>
                    <input className="at-inp" style={{width:w}} value={val}
                      onChange={e => set(e.target.value)}/>
                  </div>
                ))}
              </div>
            </div>
            {/* Transportista */}
            <div className="at-sec" style={{background:'#e8e8e8'}}>
              <div className="at-stit">Transportista / Costo</div>
              <hr style={{border:'none',borderTop:'1px solid #ccc',marginBottom:10}}/>
              <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                <div style={{flex:'2 1 180px'}}>
                  <label className="at-lbl">Nombre :</label>
                  <input className="at-inp" value={fNombret}
                    onChange={e => setFNombret(e.target.value)}/>
                </div>
                <div>
                  <label className="at-lbl">Ruc :</label>
                  <input className="at-inp" style={{width:110}} value={fRuct}
                    onChange={e => setFRuct(e.target.value)}/>
                </div>
                <div>
                  <label className="at-lbl">Costo Minimo :</label>
                  <input className="at-inp" style={{width:100}} value={fCosto}
                    onChange={e => setFCosto(e.target.value)} type="number" placeholder="0.00"/>
                </div>
              </div>
            </div>
          </div>

          {/* ── BUSCADOR ARTÍCULOS ── */}
          <BuscadorArticulosAlm onAgregar={art => setArtItems(prev => [...prev, art])}/>

          {/* artículos agregados */}
          {artItems.length > 0 && (
            <table className="at-tbl" style={{marginTop:10}}>
              <thead>
                <tr>
                  <th>Codigo</th><th>Articulo/Detalle</th>
                  <th>Stock</th><th>Med.</th><th>Cant.</th><th>Quitar</th>
                </tr>
              </thead>
              <tbody>
                {artItems.map((a, i) => (
                  <tr key={i}>
                    <td>{a.codigo}</td><td>{a.articulo}</td>
                    <td align="center">{a.stock}</td>
                    <td align="center">{a.med}</td>
                    <td align="center"><b>{a.cant}</b></td>
                    <td align="center">
                      <button onClick={() => setArtItems(p => p.filter((_,j) => j!==i))}
                        style={{background:'#dc3545',border:'none',color:'#fff',
                          borderRadius:4,padding:'2px 8px',cursor:'pointer',fontSize:12}}>
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* botones */}
          <div style={{display:'flex',gap:10,justifyContent:'center',marginTop:20}}>
            {[['💾 Guardar','#17a2b8', guardar],
              ['🗋 Limpiar','#17a2b8', resetForm],
              ['↩ Regresar','#17a2b8', () => setVista('lista')]
            ].map(([lbl, bg, fn]) => (
              <button key={lbl} className="at-btn" style={{background:bg}} onClick={fn}>
                {lbl}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ══ MODALES ══ */}
      {renderModal()}
    </div>
  );
}