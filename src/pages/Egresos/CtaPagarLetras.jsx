import React, { useState, useRef } from 'react';

const styles = `
  .page-container { padding:20px; font-family:Arial,Helvetica,sans-serif; font-size:13px; }
  .page-container * { color:#212529; box-sizing:border-box; }
  .page-title { font-size:16px; font-weight:bold; margin-bottom:14px; display:flex; align-items:center; gap:8px; }

  .filtro-wrap { margin-bottom:18px; }
  .filtro-row1 { display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-bottom:6px; }
  .filtro-row2 { display:flex; align-items:flex-end; gap:10px; flex-wrap:wrap; }
  .filtro-label { font-weight:bold; font-size:13px; white-space:nowrap; }
  .radio-group { display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
  .radio-group label { display:flex; align-items:center; gap:4px; cursor:pointer; font-size:13px; white-space:nowrap; }
  .radio-group input[type="radio"] { cursor:pointer; accent-color:#17a2b8; }

  .filtro-texto-wrap { display:flex; align-items:center; gap:6px; flex:1; min-width:200px; }
  .filtro-texto-wrap input[type="text"] { flex:1; padding:6px 10px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; }
  .filtro-texto-wrap input::placeholder { color:#adb5bd; }
  .yo-label { font-weight:bold; font-size:13px; }

  .filtro-fecha { display:flex; flex-direction:column; gap:3px; }
  .filtro-fecha label { font-size:12px; font-weight:bold; color:#212529; }
  .date-group { display:flex; align-items:center; border:1px solid #ced4da; border-radius:4px; background:#fff; overflow:hidden; width:165px; }
  .date-group .date-text { flex:1; border:none; outline:none; padding:6px 8px; font-size:13px; color:#212529; background:transparent; cursor:pointer; }
  .date-group input[type="date"] { position:absolute; opacity:0; width:0; height:0; pointer-events:none; }
  .date-group .cal-btn { background:#fff; border:none; border-left:1px solid #ced4da; padding:0 7px; height:34px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

  .botonBuscar { background-color:#17a2b8; border:1px solid #17a2b8; color:#fff !important; padding:6px 16px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:6px; height:34px; white-space:nowrap; }
  .botonBuscar:hover { background-color:#138496; }

  .tabla-titulo { text-align:center; font-weight:bold; font-size:14px; margin-bottom:0; padding:6px 0; }
  table { width:100%; border-collapse:collapse; font-size:13px; }
  table thead tr { background-color:#17a2b8; }
  table thead th { padding:9px 8px; text-align:center; font-weight:bold; color:#fff !important; white-space:nowrap; }
  table tbody tr { background-color:#fff; border-bottom:1px solid #dee2e6; }
  table tbody tr:hover { background-color:#f8f9fa; }
  table tbody td { padding:7px 8px; color:#212529; }
  .empty-msg { text-align:center; color:#888; padding:20px; font-size:13px; }
  .total-row td { background:#f0f0f0; font-weight:bold; padding:9px 8px; }

  .badge-credito   { background:#17a2b8; color:#fff !important; padding:2px 7px; border-radius:10px; font-size:11px; font-weight:bold; }
  .badge-cancelado { background:#28a745; color:#fff !important; padding:2px 7px; border-radius:10px; font-size:11px; font-weight:bold; }
  .badge-vencido   { background:#dc3545; color:#fff !important; padding:2px 7px; border-radius:10px; font-size:11px; font-weight:bold; }
  .badge-parcial   { background:#ffc107; color:#212529 !important; padding:2px 7px; border-radius:10px; font-size:11px; font-weight:bold; }

  .acciones { display:flex; gap:5px; justify-content:center; }
  .btn-accion { background:none; border:none; cursor:pointer; font-size:15px; padding:2px 4px; border-radius:3px; transition:background 0.15s; }
  .btn-accion:hover { background:#e0e0e0; }

  .reporte-bar { display:flex; align-items:center; justify-content:flex-end; gap:6px; margin-top:6px; font-size:13px; }
  .reporte-bar span { font-weight:bold; color:#212529; }
  .btn-reporte { background:none; border:none; cursor:pointer; padding:2px 3px; display:flex; align-items:center; transition:transform 0.15s; }
  .btn-reporte:hover { transform:scale(1.2); }

  .alert-success { background:#d4edda; border:1px solid #c3e6cb; color:#155724 !important; padding:8px 14px; border-radius:4px; margin-bottom:10px; font-size:13px; display:inline-block; }
  .alert-danger  { background:#f8d7da; border:1px solid #f5c6cb; color:#721c24 !important; padding:8px 14px; border-radius:4px; margin-bottom:10px; font-size:13px; display:inline-block; }
`;

const CalIcon = () => (
  <svg width="22" height="22" viewBox="0 0 36 36" fill="none">
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
    {[14,19,25].map(y => [3,12,21,30].map(x => (
      <rect key={`${x}-${y}`} x={x} y={y} width={x===30?4:5} height="3" rx="0.5" fill="#27ae60"/>
    )))}
  </svg>
);

const IconImprimir = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="2" width="16" height="20" rx="2" fill="#fff" stroke="#555" strokeWidth="1.5"/>
    <line x1="7" y1="7"  x2="17" y2="7"  stroke="#555" strokeWidth="1.2"/>
    <line x1="7" y1="10" x2="17" y2="10" stroke="#555" strokeWidth="1.2"/>
    <line x1="7" y1="13" x2="14" y2="13" stroke="#555" strokeWidth="1.2"/>
    <line x1="7" y1="16" x2="12" y2="16" stroke="#555" strokeWidth="1.2"/>
  </svg>
);

const IconExcel = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="20" height="20" rx="3" fill="#1D6F42"/>
    <text x="4" y="16" fontSize="11" fontWeight="bold" fill="#fff" fontFamily="Arial">XLS</text>
  </svg>
);

const DatePicker = ({ label, value, onChange }) => {
  const ref = useRef(null);
  const fmt = (iso) => {
    if (!iso) return '';
    const [y,m,d] = iso.split('-');
    return `${d}/${m}/${y}`;
  };
  const open = () => { try { ref.current?.showPicker(); } catch { ref.current?.click(); } };
  return (
    <div className="filtro-fecha">
      <label>{label}</label>
      <div className="date-group">
        <span className="date-text" onClick={open}>
          {fmt(value) || <span style={{color:'#adb5bd'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>}
        </span>
        <input ref={ref} type="date" value={value} onChange={e=>onChange(e.target.value)} tabIndex={-1}/>
        <button type="button" className="cal-btn" onClick={open}><CalIcon/></button>
      </div>
    </div>
  );
};

const RADIO_OPTS = ['Credito','Cancelado Y','Nro doc.','proveedor','RUC'];

const DATOS_INICIALES = [
  { id:1, doccomp:'L001-00011', proveedor:'Distribuidora Lima SAC',   fecha:'2026-03-05', credito:600.00,  dolares:600.00, soles:0.00,    fechap:'2026-04-05', estado:'Credito'   },
  { id:2, doccomp:'L001-00022', proveedor:'Importaciones Norte EIRL', fecha:'2026-03-12', credito:1500.00, dolares:0.00,   soles:1500.00, fechap:'2026-04-12', estado:'Cancelado' },
  { id:3, doccomp:'L002-00033', proveedor:'Comercial Sur SRL',         fecha:'2026-03-25', credito:900.00,  dolares:0.00,   soles:450.00,  fechap:'2026-04-25', estado:'Parcial'   },
  { id:4, doccomp:'L001-00044', proveedor:'Proveedor Nacional SA',     fecha:'2026-02-20', credito:750.00,  dolares:750.00, soles:0.00,    fechap:'2026-03-20', estado:'Vencido'   },
];

const CtaPagarLetras = () => {
  const [radioSel, setRadioSel]       = useState('Credito');
  const [busqueda, setBusqueda]       = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin]       = useState('');
  const [datos]                       = useState(DATOS_INICIALES);
  const [filtrados, setFiltrados]     = useState(DATOS_INICIALES);
  const [msg, setMsg]                 = useState({tipo:'',texto:''});

  const showMsg = (tipo,texto) => { setMsg({tipo,texto}); setTimeout(()=>setMsg({tipo:'',texto:''}),2500); };

  const buscar = () => {
    let res = [...datos];
    if (fechaInicio) res = res.filter(d => d.fecha >= fechaInicio);
    if (fechaFin)    res = res.filter(d => d.fecha <= fechaFin);
    if (busqueda) {
      const txt = busqueda.toLowerCase();
      if (radioSel==='Cancelado Y') res = res.filter(d => d.estado==='Cancelado');
      else if (radioSel==='Nro doc.') res = res.filter(d => d.doccomp.toLowerCase().includes(txt));
      else if (radioSel==='proveedor') res = res.filter(d => d.proveedor.toLowerCase().includes(txt));
      else if (radioSel==='RUC') res = res.filter(d => d.doccomp.toLowerCase().includes(txt));
      else res = res.filter(d => d.estado.toLowerCase().includes(txt));
    }
    setFiltrados(res);
    showMsg('success', `Se encontraron ${res.length} registro(s).`);
  };

  const totalDolares = filtrados.reduce((a,d) => a + d.dolares, 0).toFixed(2);
  const totalSoles   = filtrados.reduce((a,d) => a + d.soles,   0).toFixed(2);

  const getBadge = (estado) => {
    if (estado==='Cancelado') return <span className="badge-cancelado">{estado}</span>;
    if (estado==='Vencido')   return <span className="badge-vencido">{estado}</span>;
    if (estado==='Parcial')   return <span className="badge-parcial">{estado}</span>;
    return <span className="badge-credito">{estado}</span>;
  };

  const handleImprimir = () => {
    const filas = filtrados.map((d,i) => `
      <tr><td>${i+1}</td><td>${d.doccomp}</td><td>${d.proveedor}</td><td>${d.fecha}</td>
      <td align="right">${d.credito.toFixed(2)}</td>
      <td align="right">US$ ${d.dolares.toFixed(2)}</td>
      <td align="right">S/. ${d.soles.toFixed(2)}</td>
      <td>${d.fechap}</td><td>${d.estado}</td></tr>`).join('');
    const win = window.open('','_blank');
    win.document.write(`<html><head><title>Cta x Pagar Letras</title>
      <style>body{font-family:Arial,sans-serif;font-size:12px;}
      h2{color:#17a2b8;border-bottom:2px solid #17a2b8;padding-bottom:5px;}
      table{border-collapse:collapse;width:100%;}
      th{background:#17a2b8;color:#fff;padding:7px;text-align:center;}
      td{padding:5px 7px;border-bottom:1px solid #dee2e6;text-align:center;}
      tr:nth-child(even){background:#f8f9fa;}
      .total td{background:#f0f0f0;font-weight:bold;}</style></head>
      <body><h2>CUENTA POR PAGAR : LETRAS — LISTADO</h2>
      <table><thead><tr><th>ITEM</th><th>DOC.COMP.</th><th>PROVEEDOR</th><th>FECHA</th>
      <th>CREDITO</th><th>M.DOLARES</th><th>M.SOLES</th><th>FECHAP.</th><th>ESTADO</th></tr></thead>
      <tbody>${filas}
      <tr class="total">
        <td colspan="5"></td>
        <td>US$ ${totalDolares}</td>
        <td>S/. ${totalSoles}</td>
        <td colspan="2"></td>
      </tr></tbody></table>
      <p style="font-size:11px;color:#888;margin-top:10px;">Total: ${filtrados.length} registro(s)</p>
      </body></html>`);
    win.document.close(); win.print();
  };

  const handleExcel = () => {
    const enc = ['ITEM','DOC.COMP.','PROVEEDOR','FECHA','CREDITO','M.DOLARES','M.SOLES','FECHA PAGO','ESTADO'];
    const filas = filtrados.map((d,i) =>
      [i+1, d.doccomp, `"${d.proveedor}"`, d.fecha,
       d.credito.toFixed(2), d.dolares.toFixed(2), d.soles.toFixed(2),
       d.fechap, d.estado].join(',')
    );
    const pie = [`,,,,,"US$ ${totalDolares}","S/. ${totalSoles}",,TOTAL`];
    const csv = [enc.join(','), ...filas, ...pie].join('\n');
    const blob = new Blob(['\uFEFF'+csv], {type:'text/csv;charset=utf-8;'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='cta_pagar_letras.csv'; a.click();
    URL.revokeObjectURL(a.href);
    showMsg('success','Archivo Excel descargado correctamente.');
  };

  return (
    <>
      <style>{styles}</style>
      <div className="page-container">

        <div className="page-title">
          <span style={{background:'#17a2b8',color:'#fff',borderRadius:'50%',width:22,height:22,display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:13}}>i</span>
          Cuenta por Pagar : Letras
        </div>

        {msg.texto && (
          <div className={msg.tipo==='success'?'alert-success':'alert-danger'}>
            {msg.tipo==='success'?'✅':'⚠️'} {msg.texto}
          </div>
        )}

        {/* FILTROS */}
        <div className="filtro-wrap">
          <div className="filtro-row1">
            <span className="filtro-label">BUSCAR X</span>
            <div className="radio-group">
              {RADIO_OPTS.map(opt => (
                <label key={opt}>
                  <input type="radio" name="buscarx" value={opt}
                    checked={radioSel===opt} onChange={()=>setRadioSel(opt)}/>
                  {opt}
                </label>
              ))}
            </div>
          </div>
          <div className="filtro-row2">
            <div className="filtro-texto-wrap">
              <input type="text" value={busqueda}
                onChange={e=>setBusqueda(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&buscar()}/>
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
              <th width="5%">ITEM</th>
              <th width="11%">DOC.COMP.</th>
              <th>PROVEEDOR</th>
              <th width="9%">FECHA</th>
              <th width="9%">CREDITO</th>
              <th width="10%">M.DOLAES</th>
              <th width="9%">M.SOLES</th>
              <th width="9%">FECHAP.</th>
              <th width="9%">ESTADO</th>
              <th width="8%">OPCIONES</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length===0 ? (
              <>
                <tr><td colSpan="10" className="empty-msg">No hay registros para mostrar.</td></tr>
                <tr className="total-row">
                  <td colSpan="5"></td>
                  <td align="center">US$ 0.00</td>
                  <td align="center">S/. 0.00</td>
                  <td colSpan="3"></td>
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
                    <td align="right">{d.credito.toFixed(2)}</td>
                    <td align="right">US$ {d.dolares.toFixed(2)}</td>
                    <td align="right">S/. {d.soles.toFixed(2)}</td>
                    <td align="center">{d.fechap}</td>
                    <td align="center">{getBadge(d.estado)}</td>
                    <td>
                      <div className="acciones">
                        <button className="btn-accion" title="Ver detalle">📄</button>
                        <button className="btn-accion" title="Registrar pago">💰</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {/* Fila total — igual al screenshot */}
                <tr className="total-row">
                  <td colSpan="5"></td>
                  <td align="center">US$ {totalDolares}</td>
                  <td align="center">S/. {totalSoles}</td>
                  <td colSpan="3"></td>
                </tr>
              </>
            )}
          </tbody>
        </table>

        {/* REPORTE — igual al screenshot */}
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

export default CtaPagarLetras;