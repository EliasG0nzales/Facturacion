import React, { useState, useRef } from 'react';

const styles = `
  .page-container { padding:20px; font-family:Arial,Helvetica,sans-serif; font-size:13px; }
  .page-container * { color:#212529; box-sizing:border-box; }
  .page-title { font-size:16px; font-weight:bold; margin-bottom:14px; display:flex; align-items:center; gap:8px; }

  /* FILTROS */
  .filtro-wrap { margin-bottom:18px; }
  .filtro-row1 { display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-bottom:6px; }
  .filtro-row2 { display:flex; align-items:flex-end; gap:10px; flex-wrap:wrap; }
  .filtro-label { font-weight:bold; font-size:13px; white-space:nowrap; }
  .radio-group  { display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
  .radio-group label { display:flex; align-items:center; gap:4px; cursor:pointer; font-size:13px; white-space:nowrap; }
  .radio-group input[type="radio"] { cursor:pointer; accent-color:#17a2b8; }

  .filtro-texto-wrap { display:flex; align-items:center; gap:6px; flex:1; min-width:200px; }
  .filtro-texto-wrap input[type="text"] { flex:1; padding:6px 10px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; }
  .filtro-texto-wrap input::placeholder { color:#adb5bd; }
  .yo-label { font-weight:bold; font-size:13px; }

  /* DATE PICKER */
  .filtro-fecha { display:flex; flex-direction:column; gap:3px; }
  .filtro-fecha label { font-size:12px; font-weight:bold; color:#212529; }
  .date-group { display:flex; align-items:center; border:1px solid #ced4da; border-radius:4px; background:#fff; overflow:hidden; width:165px; }
  .date-group .date-text { flex:1; border:none; outline:none; padding:6px 8px; font-size:13px; color:#212529; background:transparent; cursor:pointer; }
  .date-group input[type="date"] { position:absolute; opacity:0; width:0; height:0; pointer-events:none; }
  .date-group .cal-btn { background:#fff; border:none; border-left:1px solid #ced4da; padding:0 7px; height:34px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

  .botonBuscar { background-color:#17a2b8; border:1px solid #17a2b8; color:#fff !important; padding:6px 16px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:6px; height:34px; white-space:nowrap; }
  .botonBuscar:hover { background-color:#138496; }

  /* TABLA */
  .tabla-titulo { text-align:center; font-weight:bold; font-size:14px; margin-bottom:0; padding:6px 0; }
  table { width:100%; border-collapse:collapse; font-size:13px; }
  table thead tr { background-color:#17a2b8; }
  table thead th { padding:9px 8px; text-align:center; font-weight:bold; color:#fff !important; white-space:nowrap; }
  table tbody tr { background-color:#fff; border-bottom:1px solid #dee2e6; }
  table tbody tr:hover { background-color:#f8f9fa; }
  table tbody td { padding:7px 8px; color:#212529; }
  .empty-msg { text-align:center; color:#888; padding:20px; font-size:13px; }

  .total-row td { background:#f0f0f0; font-weight:bold; padding:9px 8px; }

  /* ESTADO badges */
  .badge-credito   { background:#17a2b8; color:#fff !important; padding:2px 7px; border-radius:10px; font-size:11px; font-weight:bold; }
  .badge-cancelado { background:#28a745; color:#fff !important; padding:2px 7px; border-radius:10px; font-size:11px; font-weight:bold; }
  .badge-vencido   { background:#dc3545; color:#fff !important; padding:2px 7px; border-radius:10px; font-size:11px; font-weight:bold; }
  .badge-parcial   { background:#ffc107; color:#212529 !important; padding:2px 7px; border-radius:10px; font-size:11px; font-weight:bold; }

  /* REPORTE botones abajo derecha — igual al screenshot */
  .reporte-bar { display:flex; align-items:center; justify-content:flex-end; gap:6px; margin-top:6px; font-size:13px; }
  .reporte-bar span { font-weight:bold; color:#212529; }
  .btn-reporte { background:none; border:none; cursor:pointer; padding:2px 3px; display:flex; align-items:center; transition:transform 0.15s; }
  .btn-reporte:hover { transform:scale(1.2); }

  .alert-success { background:#d4edda; border:1px solid #c3e6cb; color:#155724 !important; padding:8px 14px; border-radius:4px; margin-bottom:10px; font-size:13px; display:inline-block; }
  .alert-danger  { background:#f8d7da; border:1px solid #f5c6cb; color:#721c24 !important; padding:8px 14px; border-radius:4px; margin-bottom:10px; font-size:13px; display:inline-block; }
`;

// Ícono calendario (cabecera roja, días verdes)
const CalIcon = () => (
  <svg width="22" height="22" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="4" width="34" height="30" rx="3" fill="#fff" stroke="#bbb" strokeWidth="1.5"/>
    <rect x="1" y="4" width="34" height="9"  rx="3" fill="#e74c3c"/>
    <rect x="1" y="9" width="34" height="4"  fill="#e74c3c"/>
    <rect x="10" y="1" width="3" height="7" rx="1.5" fill="#888"/>
    <rect x="23" y="1" width="3" height="7" rx="1.5" fill="#888"/>
    <line x1="1"  y1="18" x2="35" y2="18" stroke="#ddd" strokeWidth="0.8"/>
    <line x1="1"  y1="24" x2="35" y2="24" stroke="#ddd" strokeWidth="0.8"/>
    <line x1="10" y1="13" x2="10" y2="34" stroke="#ddd" strokeWidth="0.8"/>
    <line x1="19" y1="13" x2="19" y2="34" stroke="#ddd" strokeWidth="0.8"/>
    <line x1="28" y1="13" x2="28" y2="34" stroke="#ddd" strokeWidth="0.8"/>
    <rect x="3"  y="14" width="5" height="3" rx="0.5" fill="#27ae60"/>
    <rect x="12" y="14" width="5" height="3" rx="0.5" fill="#27ae60"/>
    <rect x="21" y="14" width="5" height="3" rx="0.5" fill="#27ae60"/>
    <rect x="30" y="14" width="4" height="3" rx="0.5" fill="#27ae60"/>
    <rect x="3"  y="19" width="5" height="3" rx="0.5" fill="#27ae60"/>
    <rect x="12" y="19" width="5" height="3" rx="0.5" fill="#27ae60"/>
    <rect x="21" y="19" width="5" height="3" rx="0.5" fill="#27ae60"/>
    <rect x="30" y="19" width="4" height="3" rx="0.5" fill="#27ae60"/>
    <rect x="3"  y="25" width="5" height="3" rx="0.5" fill="#27ae60"/>
    <rect x="12" y="25" width="5" height="3" rx="0.5" fill="#27ae60"/>
    <rect x="21" y="25" width="5" height="3" rx="0.5" fill="#27ae60"/>
    <rect x="30" y="25" width="4" height="3" rx="0.5" fill="#27ae60"/>
  </svg>
);

// Ícono imprimir (página)
const IconImprimir = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="2" width="16" height="20" rx="2" fill="#fff" stroke="#555" strokeWidth="1.5"/>
    <line x1="7" y1="7"  x2="17" y2="7"  stroke="#555" strokeWidth="1.2"/>
    <line x1="7" y1="10" x2="17" y2="10" stroke="#555" strokeWidth="1.2"/>
    <line x1="7" y1="13" x2="14" y2="13" stroke="#555" strokeWidth="1.2"/>
    <line x1="7" y1="16" x2="12" y2="16" stroke="#555" strokeWidth="1.2"/>
  </svg>
);

// Ícono Excel (verde)
const IconExcel = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="3" fill="#1D6F42"/>
    <text x="4" y="16" fontSize="11" fontWeight="bold" fill="#fff" fontFamily="Arial">XLS</text>
  </svg>
);

const DatePicker = ({ label, value, onChange }) => {
  const hiddenRef = useRef(null);
  const fmt = (iso) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  };
  const open = () => {
    try { hiddenRef.current?.showPicker(); }
    catch { hiddenRef.current?.click(); }
  };
  return (
    <div className="filtro-fecha">
      <label>{label}</label>
      <div className="date-group">
        <span className="date-text" onClick={open}>
          {fmt(value) || <span style={{color:'#adb5bd'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>}
        </span>
        <input ref={hiddenRef} type="date" value={value} onChange={e=>onChange(e.target.value)} tabIndex={-1}/>
        <button type="button" className="cal-btn" onClick={open}><CalIcon/></button>
      </div>
    </div>
  );
};

const RADIO_OPTS = ['Credito','Cancelado Y','Nro','proveedor','RUC','Usuario'];

const DATOS_INICIALES = [
  { id:1, doccomp:'F001-00123', proveedor:'Distribuidora Lima SAC',  fecha:'2024-03-10', credito:500.00,  moneda:'US$', deuda:500.00,  fechap:'2024-04-10', estado:'Credito'   },
  { id:2, doccomp:'F002-00045', proveedor:'Importaciones Norte EIRL',fecha:'2024-03-15', credito:1200.00, moneda:'S/.',  deuda:0.00,   fechap:'2024-04-15', estado:'Cancelado' },
  { id:3, doccomp:'B001-00321', proveedor:'Comercial Sur SRL',        fecha:'2024-03-20', credito:350.00,  moneda:'S/.',  deuda:175.00, fechap:'2024-04-20', estado:'Parcial'   },
  { id:4, doccomp:'F001-00198', proveedor:'Proveedor Nacional SA',    fecha:'2024-02-28', credito:800.00,  moneda:'US$', deuda:800.00,  fechap:'2024-03-28', estado:'Vencido'   },
];

const CtaPagar = () => {
  const [radioSel, setRadioSel]         = useState('Credito');
  const [busqueda, setBusqueda]         = useState('');
  const [fechaInicio, setFechaInicio]   = useState('');
  const [fechaFin, setFechaFin]         = useState('');
  const [datos, setDatos]               = useState(DATOS_INICIALES);
  const [filtrados, setFiltrados]       = useState(DATOS_INICIALES);
  const [msg, setMsg]                   = useState({tipo:'',texto:''});

  const showMsg = (tipo,texto) => { setMsg({tipo,texto}); setTimeout(()=>setMsg({tipo:'',texto:''}),2500); };

  const buscar = () => {
    let res = [...datos];
    if (fechaInicio) res = res.filter(d => d.fecha >= fechaInicio);
    if (fechaFin)    res = res.filter(d => d.fecha <= fechaFin);
    if (busqueda) {
      const txt = busqueda.toLowerCase();
      if (radioSel==='Credito')     res = res.filter(d => d.estado.toLowerCase().includes(txt));
      if (radioSel==='Cancelado Y') res = res.filter(d => d.estado==='Cancelado');
      if (radioSel==='Nro')         res = res.filter(d => d.doccomp.toLowerCase().includes(txt));
      if (radioSel==='proveedor')   res = res.filter(d => d.proveedor.toLowerCase().includes(txt));
      if (radioSel==='RUC')         res = res.filter(d => d.doccomp.toLowerCase().includes(txt));
      if (radioSel==='Usuario')     res = res.filter(d => d.proveedor.toLowerCase().includes(txt));
    }
    setFiltrados(res);
    showMsg('success', `Se encontraron ${res.length} registro(s).`);
  };

  // Totales
  const totalUS = filtrados.filter(d=>d.moneda==='US$').reduce((a,d)=>a+d.deuda,0).toFixed(2);
  const totalSL = filtrados.filter(d=>d.moneda==='S/.').reduce((a,d)=>a+d.deuda,0).toFixed(2);

  const getBadge = (estado) => {
    if (estado==='Cancelado') return <span className="badge-cancelado">{estado}</span>;
    if (estado==='Vencido')   return <span className="badge-vencido">{estado}</span>;
    if (estado==='Parcial')   return <span className="badge-parcial">{estado}</span>;
    return <span className="badge-credito">{estado}</span>;
  };

  // ---- REPORTES ----
  const handleImprimir = () => {
    const filas = filtrados.map((d,i) => `
      <tr><td>${i+1}</td><td>${d.doccomp}</td><td>${d.proveedor}</td><td>${d.fecha}</td>
      <td>${d.moneda} ${d.credito.toFixed(2)}</td><td>${d.moneda}</td>
      <td>${d.moneda} ${d.deuda.toFixed(2)}</td><td>${d.fechap}</td><td>${d.estado}</td></tr>`).join('');
    const win = window.open('','_blank');
    win.document.write(`<html><head><title>Cta x Pagar</title>
      <style>body{font-family:Arial,sans-serif;font-size:12px;}h2{color:#17a2b8;border-bottom:2px solid #17a2b8;padding-bottom:5px;}
      table{border-collapse:collapse;width:100%;}th{background:#17a2b8;color:#fff;padding:7px;text-align:center;}
      td{padding:5px 7px;border-bottom:1px solid #dee2e6;text-align:center;}tr:nth-child(even){background:#f8f9fa;}
      .total{background:#f0f0f0;font-weight:bold;}</style></head>
      <body><h2>CUENTA POR PAGAR — LISTADO</h2>
      <table><thead><tr><th>NRO</th><th>DOC.COMP.</th><th>PROVEEDOR</th><th>FECHA</th>
      <th>CREDITO</th><th>M.</th><th>DEUDA</th><th>FECHA P.</th><th>ESTADO</th></tr></thead>
      <tbody>${filas}
      <tr class="total">
        <td colspan="4" align="right">Deuda</td>
        <td>US$ ${totalUS}</td><td></td>
        <td>S/. ${totalSL}</td><td colspan="2"></td>
      </tr></tbody></table>
      <p style="font-size:11px;color:#888;margin-top:10px;">Total: ${filtrados.length} registro(s)</p>
      </body></html>`);
    win.document.close(); win.print();
  };

  const handleExcel = () => {
    const enc = ['NRO','DOC.COMP.','PROVEEDOR','FECHA','CREDITO','MONEDA','DEUDA','FECHA PAGO','ESTADO'];
    const filas = filtrados.map((d,i) =>
      [i+1, d.doccomp, `"${d.proveedor}"`, d.fecha, d.credito.toFixed(2), d.moneda, d.deuda.toFixed(2), d.fechap, d.estado].join(',')
    );
    const pie = [`,,,,US$ ${totalUS},,S/. ${totalSL},,TOTAL DEUDA`];
    const csv = [enc.join(','), ...filas, ...pie].join('\n');
    const blob = new Blob(['\uFEFF'+csv], {type:'text/csv;charset=utf-8;'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='cta_pagar.csv'; a.click();
    URL.revokeObjectURL(a.href);
    showMsg('success','Archivo Excel descargado correctamente.');
  };

  return (
    <>
      <style>{styles}</style>
      <div className="page-container">

        <div className="page-title">
          <span style={{background:'#17a2b8',color:'#fff',borderRadius:'50%',width:22,height:22,display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:13}}>i</span>
          CUENTA POR PAGAR
        </div>

        {msg.texto && (
          <div className={msg.tipo==='success'?'alert-success':'alert-danger'}>
            {msg.tipo==='success'?'✅':'⚠️'} {msg.texto}
          </div>
        )}

        {/* FILTROS */}
        <div className="filtro-wrap">
          {/* Fila 1: radio buttons */}
          <div className="filtro-row1">
            <span className="filtro-label">BUSCAR X</span>
            <div className="radio-group">
              {RADIO_OPTS.map(opt => (
                <label key={opt}>
                  <input
                    type="radio"
                    name="buscarx"
                    value={opt}
                    checked={radioSel===opt}
                    onChange={()=>setRadioSel(opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* Fila 2: texto + fechas + buscar */}
          <div className="filtro-row2">
            <div className="filtro-texto-wrap">
              <input
                type="text"
                placeholder=""
                value={busqueda}
                onChange={e=>setBusqueda(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&buscar()}
              />
              <span className="yo-label">y/o</span>
            </div>
            <DatePicker label="Fecha Inicio" value={fechaInicio} onChange={setFechaInicio}/>
            <DatePicker label="Fecha Fin"    value={fechaFin}    onChange={setFechaFin}/>
            <button className="botonBuscar" onClick={buscar}>🔍 Buscar</button>
          </div>
        </div>

        {/* TABLA */}
        <div className="tabla-titulo">LISTADO</div>
        <table>
          <thead>
            <tr>
              <th width="4%">NRO</th>
              <th width="11%">DOC.COMP.</th>
              <th>PROVEEDOR</th>
              <th width="9%">FECHA</th>
              <th width="10%">CREDITO</th>
              <th width="5%">M.</th>
              <th width="9%">DEUDA</th>
              <th width="9%">FECHAP.</th>
              <th width="9%">ESTADO</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length===0 ? (
              <>
                <tr><td colSpan="9" className="empty-msg">No hay registros para mostrar.</td></tr>
                <tr className="total-row">
                  <td colSpan="4" align="right">Deuda</td>
                  <td align="center">US$ 0.00</td>
                  <td></td>
                  <td align="center">S/. 0.00</td>
                  <td colSpan="2"></td>
                </tr>
              </>
            ) : (
              <>
                {filtrados.map((d,i) => (
                  <tr key={d.id}>
                    <td align="center">{i+1}</td>
                    <td align="center">{d.doccomp}</td>
                    <td>{d.proveedor}</td>
                    <td align="center">{d.fecha}</td>
                    <td align="right">{d.moneda} {d.credito.toFixed(2)}</td>
                    <td align="center">{d.moneda}</td>
                    <td align="right">{d.moneda} {d.deuda.toFixed(2)}</td>
                    <td align="center">{d.fechap}</td>
                    <td align="center">{getBadge(d.estado)}</td>
                  </tr>
                ))}
                {/* Fila total — igual al screenshot */}
                <tr className="total-row">
                  <td colSpan="4" align="right" style={{paddingRight:12}}>Deuda</td>
                  <td align="center">US$ {totalUS}</td>
                  <td></td>
                  <td align="center">S/. {totalSL}</td>
                  <td colSpan="2"></td>
                </tr>
              </>
            )}
          </tbody>
        </table>

        {/* REPORTE: ícono imprimir + excel — alineado derecha igual al screenshot */}
        <div className="reporte-bar">
          <span>Reporte:</span>
          <button className="btn-reporte" title="Imprimir" onClick={handleImprimir}>
            <IconImprimir/>
          </button>
          <button className="btn-reporte" title="Exportar Excel" onClick={handleExcel}>
            <IconExcel/>
          </button>
        </div>

      </div>
    </>
  );
};

export default CtaPagar;