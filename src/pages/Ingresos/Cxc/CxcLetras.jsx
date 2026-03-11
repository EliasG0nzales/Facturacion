import React, { useState, useRef } from 'react';

const styles = `
  .page-container { padding:10px 14px; font-family:Arial,Helvetica,sans-serif; font-size:13px; background:#fff; }
  .page-container * { color:#212529; box-sizing:border-box; }
  .page-title { font-size:16px; font-weight:bold; margin-bottom:10px; border-bottom:2px solid #00A3E1; padding-bottom:4px; color:#333; }
  .page-title .info-dot { background:#00A3E1; color:#fff !important; border-radius:50%; width:18px; height:18px; text-align:center; line-height:18px; font-size:11px; display:inline-block; vertical-align:middle; margin-right:6px; }

  .filtros { margin-bottom:10px; }
  .buscar-radios { margin-bottom:6px; }
  .buscar-radios .fila-radios { margin-bottom:4px; }
  .buscar-radios .fila-radios .label-buscar-x { font-weight:bold; font-size:13px; margin-right:6px; }
  .buscar-radios .fila-radios .radio-letras { margin-right:2px; margin-left:1px; }
  .buscar-radios .fila-radios > span { display:inline; }
  .buscar-radios .fila-input-yo { margin-top:4px; display:flex; align-items:center; gap:6px; }
  .buscar-radios .fila-input-yo .input-buscar-x {
    width:90%;
    max-width:400px;
    padding:4px 8px;
    border:1px solid #ced4da;
    border-radius:4px;
    font-size:13px;
    color:#212529 !important;
    background:#ffffff !important;
    background-color:#ffffff !important;
    margin-right:6px;
    -webkit-appearance:none;
    -moz-appearance:none;
    appearance:none;
  }
  .buscar-radios .fila-input-yo b { font-size:13px; color:#212529; white-space:nowrap; }
  .buscar-radios .label-buscar-x { font-weight:bold; font-size:13px; white-space:nowrap; color:#212529; display:inline-block; margin-right:8px; vertical-align:middle; }
  .buscar-radios .input-buscar-x {
    width:200px;
    padding:6px 10px;
    border:1px solid #ced4da;
    border-radius:4px;
    font-size:13px;
    color:#212529 !important;
    background:#ffffff !important;
    background-color:#ffffff !important;
    display:inline-block;
    margin-right:12px;
    vertical-align:middle;
    -webkit-appearance:none;
    -moz-appearance:none;
    appearance:none;
  }
  .buscar-radios .input-buscar-x::placeholder { color:#adb5bd; }
  .buscar-radios .fila-input-yo .input-buscar-x::placeholder { color:#adb5bd; }
  .buscar-radios .radio-group { display:inline-block; vertical-align:middle; }
  .buscar-radios .radio-group label { cursor:pointer; font-size:13px; white-space:nowrap; display:inline-block; margin-right:14px; vertical-align:middle; }
  .buscar-radios .radio-group label.radio-letras { position:relative; }
  .buscar-radios .radio-group label.radio-letras input[type="radio"] { position:absolute; opacity:0; pointer-events:none; }
  .buscar-radios .radio-group label.radio-letras span { display:inline-block; }
  .buscar-radios .radio-group label.radio-letras span::before { content:""; width:10px; height:10px; border-radius:50%; border:1px solid #6c757d; background:#6c757d; visibility:hidden; display:inline-block; vertical-align:middle; margin-right:4px; }
  .buscar-radios .radio-group label.radio-letras input[type="radio"]:checked + span::before { visibility:visible; }

  .fechas { display:flex; align-items:flex-end; gap:8px; }
  .fechas .filtro-fecha { display:flex; flex-direction:column; margin-right:8px; vertical-align:middle; }
  .fechas .filtro-fecha label { font-size:12px; font-weight:bold; color:#212529; display:block; margin-bottom:2px; }
  .fechas .date-group,
  .filtro-fecha .date-group {
    display:inline-flex;
    align-items:center;
    border:1px solid #ced4da;
    border-radius:4px;
    background:#ffffff !important;
    background-color:#ffffff !important;
    overflow:hidden;
    width:165px;
    vertical-align:middle;
    height:30px;
  }
  .fechas .date-group .date-text,
  .filtro-fecha .date-group .date-text {
    display:inline-block;
    flex:1;
    border:none;
    outline:none;
    padding:4px 6px;
    font-size:12px;
    color:#212529 !important;
    background:#ffffff !important;
    background-color:#ffffff !important;
    cursor:pointer;
    vertical-align:middle;
    min-width:0;
    -webkit-appearance:none;
  }
  .fechas .date-group input[type="date"],
  .filtro-fecha .date-group input[type="date"] {
    position:absolute;
    opacity:0;
    width:0;
    height:0;
    min-width:0;
    min-height:0;
    border:none;
    background:transparent;
    pointer-events:none;
    clip:rect(0,0,0,0);
  }
  .fechas .date-group .cal-btn,
  .filtro-fecha .date-group .cal-btn {
    background:#ffffff !important;
    background-color:#ffffff !important;
    border:none;
    border-left:1px solid #ced4da;
    padding:0 6px;
    height:28px;
    cursor:pointer;
    display:inline-flex;
    align-items:center;
    justify-content:center;
    vertical-align:middle;
    flex-shrink:0;
  }
  .fechas .botonBuscar { display:inline-block; vertical-align:middle; margin-left:4px; }

  /* Forzar fondo blanco en todos los inputs del componente */
  .page-container input[type="text"],
  .page-container input[type="search"],
  .page-container input {
    background:#ffffff !important;
    background-color:#ffffff !important;
    color:#212529 !important;
    -webkit-text-fill-color:#212529 !important;
  }
  .page-container input:-webkit-autofill,
  .page-container input:-webkit-autofill:hover,
  .page-container input:-webkit-autofill:focus {
    -webkit-box-shadow:0 0 0px 1000px #ffffff inset !important;
    -webkit-text-fill-color:#212529 !important;
    background-color:#ffffff !important;
  }

  .botonBuscar { background-color:#00A3E1; border:1px solid #00A3E1; color:#fff !important; padding:4px 12px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; height:30px; white-space:nowrap; }
  .botonBuscar:hover { background-color:#0092c9; }

  .tabla-titulo { text-align:center; font-weight:bold; font-size:13px; margin:6px 0 0 0; padding:5px 0; background-color:#00A3E1; color:#fff !important; }
  table { width:100%; border-collapse:collapse; font-size:12px; }
  table thead tr { background-color:#00A3E1; }
  table thead th { padding:5px 6px; text-align:center; font-weight:bold; color:#fff !important; white-space:nowrap; }
  table tbody tr { background-color:#fff; border-bottom:1px solid #dee2e6; }
  table tbody tr:hover { background-color:#f8f9fa; }
  table tbody td { padding:4px 6px; color:#212529; }
  .empty-msg { text-align:center; color:#888; padding:12px; font-size:13px; }
  .total-row td { background:#f0f0f0; font-weight:bold; padding:5px 6px; }
  .mail-row td { background:#fff; padding:6px 8px; }
  .mail-icon { display:block; width:28px; height:20px; margin:0 auto; text-align:center; }

  .badge-credito   { background:#17a2b8; color:#fff !important; padding:2px 7px; border-radius:10px; font-size:11px; font-weight:bold; }
  .badge-cancelado { background:#28a745; color:#fff !important; padding:2px 7px; border-radius:10px; font-size:11px; font-weight:bold; }
  .badge-vencido   { background:#dc3545; color:#fff !important; padding:2px 7px; border-radius:10px; font-size:11px; font-weight:bold; }
  .badge-parcial   { background:#ffc107; color:#212529 !important; padding:2px 7px; border-radius:10px; font-size:11px; font-weight:bold; }

  .acciones { text-align:center; }
  .btn-accion { background:none; border:none; cursor:pointer; font-size:15px; padding:2px 4px; border-radius:3px; transition:background 0.15s; display:inline-block; margin:0 2px; }
  .btn-accion:hover { background:#e0e0e0; }

  .pie-tabla { margin-top:8px; overflow:hidden; }
  .leyenda { font-size:11px; color:#333; float:left; }
  .leyenda b { color:#212529; margin-right:6px; }
  .leyenda-item { display:inline-block; margin-right:6px; vertical-align:middle; }
  .reporte-bar { font-size:12px; float:right; }
  .reporte-bar span { font-weight:bold; color:#212529; margin-right:4px; }
  .btn-reporte { background:none; border:none; cursor:pointer; padding:2px 3px; display:inline-block; vertical-align:middle; transition:transform 0.15s; }
  .btn-reporte:hover { transform:scale(1.2); }

  .alert-success { background:#d4edda; border:1px solid #c3e6cb; color:#155724 !important; padding:6px 10px; border-radius:4px; margin-bottom:6px; font-size:12px; display:inline-block; }
  .alert-danger  { background:#f8d7da; border:1px solid #f5c6cb; color:#721c24 !important; padding:6px 10px; border-radius:4px; margin-bottom:6px; font-size:12px; display:inline-block; }
`;

const IconBarChart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M4 18v-6h4v6H4zM10 18V8h4v10h-4zM16 18v-3h4v3h-4z" fill="currentColor"/>
    <rect x="3" y="4" width="18" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  </svg>
);

const CalIcon = () => (
  <svg width="22" height="22" viewBox="0 0 36 36" fill="none">
    <rect x="1" y="4" width="34" height="30" rx="3" fill="#fff" stroke="#ced4da" strokeWidth="1.5"/>
    <rect x="1" y="4" width="34" height="9"  rx="3" fill="#e74c3c"/>
    <rect x="1" y="9" width="34" height="4"  fill="#e74c3c"/>
    <rect x="10" y="1" width="3" height="7" rx="1.5" fill="#adb5bd"/>
    <rect x="23" y="1" width="3" height="7" rx="1.5" fill="#adb5bd"/>
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
    <rect x="4" y="2" width="16" height="20" rx="2" fill="#fff" stroke="#6c757d" strokeWidth="1.5"/>
    <line x1="7" y1="7"  x2="17" y2="7"  stroke="#6c757d" strokeWidth="1.2"/>
    <line x1="7" y1="10" x2="17" y2="10" stroke="#6c757d" strokeWidth="1.2"/>
    <line x1="7" y1="13" x2="14" y2="13" stroke="#6c757d" strokeWidth="1.2"/>
    <line x1="7" y1="16" x2="12" y2="16" stroke="#6c757d" strokeWidth="1.2"/>
  </svg>
);

const IconExcel = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="20" height="20" rx="3" fill="#1D6F42"/>
    <text x="4" y="16" fontSize="11" fontWeight="bold" fill="#fff" fontFamily="Arial">XLS</text>
  </svg>
);

const IconMail = ({ color = "#17a2b8" }) => (
  <svg width="28" height="18" viewBox="0 0 28 18" fill="none">
    <rect x="1" y="1" width="26" height="16" rx="2" fill={color} stroke={color}/>
    <path d="M2 3l12 8 12-8" stroke="#fff" strokeWidth="1.6" fill="none"/>
  </svg>
);

const IconMailBlack = () => (
  <svg width="18" height="12" viewBox="0 0 28 18" fill="none">
    <rect x="1" y="1" width="26" height="16" rx="2" fill="#495057" stroke="#495057"/>
    <path d="M2 3l12 8 12-8" stroke="#fff" strokeWidth="1.4" fill="none"/>
  </svg>
);

const IconMailGreen = () => (
  <svg width="18" height="12" viewBox="0 0 28 18" fill="none">
    <rect x="1" y="1" width="26" height="16" rx="2" fill="#20b54b" stroke="#20b54b"/>
    <path d="M2 3l12 8 12-8" stroke="#fff" strokeWidth="1.4" fill="none"/>
  </svg>
);

const IconTicket = () => (
  <svg width="18" height="12" viewBox="0 0 28 18" fill="none">
    <rect x="1" y="1" width="26" height="16" rx="2" fill="#7db3ff" stroke="#7db3ff"/>
    <rect x="5" y="5" width="18" height="2" fill="#fff"/>
    <rect x="5" y="9" width="10" height="2" fill="#fff"/>
  </svg>
);

const IconNota = () => (
  <svg width="18" height="12" viewBox="0 0 24 24" fill="none">
    <path d="M3 6h12l6 6v6H3z" fill="#0a7f2e"/>
    <path d="M7 8h6M7 12h8M7 16h5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
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
        <span
          className="date-text"
          onClick={open}
          style={{ backgroundColor:'#ffffff', color: value ? '#212529' : '#adb5bd' }}
        >
          {fmt(value) || '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'}
        </span>
        <input
          ref={ref}
          type="date"
          value={value}
          onChange={e=>onChange(e.target.value)}
          tabIndex={-1}
          style={{
            position:'absolute', opacity:0, width:0, height:0,
            border:'none', background:'transparent', pointerEvents:'none',
            clip:'rect(0,0,0,0)'
          }}
        />
        <button type="button" className="cal-btn" onClick={open} style={{ backgroundColor:'#ffffff' }}>
          <CalIcon/>
        </button>
      </div>
    </div>
  );
};

const RADIO_OPTS = [
  { value: 'Credito',   label: 'Credito' },
  { value: 'Cancelado', label: 'Cancelado' },
  { value: 'Nro doc.',  label: 'Nro doc. /' },
  { value: 'Cliente',   label: 'Cliente /' },
  { value: 'RUC',       label: 'RUC' },
];

const DATOS_INICIALES = [
  { id:1, docvent:'L001-00011', cliente:'Distribuidora Lima SAC',   ruc:'20111111111', fecha:'2026-03-05', credito:600.00,  dolares:600.00, soles:0.00,    fechap:'2026-04-05', estado:'Credito'   },
  { id:2, docvent:'L001-00022', cliente:'Importaciones Norte EIRL', ruc:'20122222222', fecha:'2026-03-12', credito:1500.00, dolares:0.00,   soles:1500.00, fechap:'2026-04-12', estado:'Cancelado' },
  { id:3, docvent:'L002-00033', cliente:'Comercial Sur SRL',        ruc:'20133333333', fecha:'2026-03-25', credito:900.00,  dolares:0.00,   soles:450.00,  fechap:'2026-04-25', estado:'Parcial'   },
  { id:4, docvent:'L001-00044', cliente:'Proveedor Nacional SA',    ruc:'20144444444', fecha:'2026-02-20', credito:750.00,  dolares:750.00, soles:0.00,    fechap:'2026-03-20', estado:'Vencido'   },
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
      if (radioSel === 'Cancelado') res = res.filter(d => d.estado === 'Cancelado');
      else if (radioSel === 'Nro doc.') res = res.filter(d => d.docvent.toLowerCase().includes(txt));
      else if (radioSel === 'Cliente') res = res.filter(d => d.cliente.toLowerCase().includes(txt));
      else if (radioSel === 'RUC') res = res.filter(d => d.ruc.toLowerCase().includes(txt));
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
      <tr><td>${i+1}</td><td>${d.docvent}</td><td>${d.cliente}</td><td>${d.fecha}</td>
      <td align="right">${d.credito.toFixed(2)}</td>
      <td align="right">US$ ${d.dolares.toFixed(2)}</td>
      <td align="right">S/. ${d.soles.toFixed(2)}</td>
      <td>${d.fechap}</td><td>${d.estado}</td></tr>`).join('');
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Cuentas por Cobrar - Letras</title>
      <style>body{font-family:Arial,sans-serif;font-size:12px;margin:20px;}
      .reporte-titulo{text-align:center;font-weight:bold;font-size:16px;text-transform:uppercase;margin-bottom:16px;color:#212529;}
      table{border-collapse:collapse;width:100%;}
      th{background:#333;color:#fff;padding:8px 6px;text-align:center;font-weight:bold;font-size:12px;}
      td{padding:6px 8px;border:1px solid #dee2e6;text-align:center;font-size:12px;}
      td.num{text-align:right;}
      .total td{background:#f0f0f0;font-weight:bold;}
      @media print{body{margin:0;} .no-print{display:none;}}</style></head>
      <body>
      <div class="reporte-titulo">CUENTAS POR COBRAR - LETRAS</div>
      <table><thead><tr><th>Item</th><th>Doc.Vent.</th><th>Cliente</th><th>Fecha</th>
      <th>Credito</th><th>M.Dolaes</th><th>M.Soles</th><th>FechaP.</th><th>Estado</th></tr></thead>
      <tbody>${filas}
      <tr class="total">
        <td colspan="5"></td>
        <td class="num">US$ ${totalDolares}</td>
        <td class="num">S/. ${totalSoles}</td>
        <td colspan="2"></td>
      </tr></tbody></table>
      <p style="font-size:11px;color:#888;margin-top:12px;">Total: ${filtrados.length} registro(s)</p>
      </body></html>`;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) {
      showMsg('danger', 'Permite ventanas emergentes para imprimir.');
      URL.revokeObjectURL(url);
      return;
    }
    win.onload = () => {
      URL.revokeObjectURL(url);
      win.focus();
      win.print();
    };
  };

  const handleExcel = () => {
    const enc = ['ITEM','DOC.VENT.','CLIENTE','FECHA','CREDITO','M.DOLAES','M.SOLES','FECHAP.','ESTADO'];
    const filas = filtrados.map((d,i) =>
      [i+1, d.docvent, `"${(d.cliente||'').replace(/"/g,'""')}"`, d.fecha,
       d.credito.toFixed(2), d.dolares.toFixed(2), d.soles.toFixed(2),
       d.fechap, d.estado].join(',')
    );
    const pie = [`,,,,,"US$ ${totalDolares}","S/. ${totalSoles}",,TOTAL`];
    const csv = [enc.join(','), ...filas, ...pie].join('\r\n');
    const blob = new Blob(['\uFEFF'+csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_cta_pagar_letras_${new Date().toISOString().slice(0,10)}.csv`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showMsg('success', 'Reporte descargado en Excel correctamente.');
  };

  return (
    <>
      <style>{styles}</style>
      <div className="page-container">

        <div className="page-title">
          <span className="info-dot">?</span>
          Cuenta por Pagar : Letras
        </div>

        {msg.texto && (
          <div className={msg.tipo==='success'?'alert-success':'alert-danger'}>
            {msg.tipo==='success'?'✅':'⚠️'} {msg.texto}
          </div>
        )}

        <form className="filtros" onSubmit={(e)=>{ e.preventDefault(); buscar(); }}>
          <div className="buscar-radios">
            <div className="fila-radios">
              <b className="label-buscar-x">BUSCAR X</b>
              {RADIO_OPTS.map((opt, i) => (
                <span key={opt.value}>
                  {i === 2 && ' Y '}
                  <label className="radio-letras">
                    <input
                      type="radio"
                      name="buscarx"
                      value={opt.value}
                      checked={radioSel===opt.value}
                      onChange={()=>setRadioSel(opt.value)}
                    />
                    <span><b>{opt.label}</b></span>
                  </label>
                </span>
              ))}
            </div>
            <div className="fila-input-yo">
              <input
                type="text"
                className="input-buscar-x"
                placeholder=""
                value={busqueda}
                onChange={e=>setBusqueda(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&(e.preventDefault(), buscar())}
                style={{
                  backgroundColor:'#ffffff',
                  color:'#212529',
                  WebkitTextFillColor:'#212529',
                }}
              />
              <b>y/o</b>
            </div>
          </div>
          <div className="fechas">
            <DatePicker label="Fecha Inicio" value={fechaInicio} onChange={setFechaInicio}/>
            <DatePicker label="Fecha Fin" value={fechaFin} onChange={setFechaFin}/>
            <button type="submit" className="botonBuscar">🔍&nbsp;Buscar</button>
          </div>
        </form>

        <div className="tabla-titulo">LISTADO</div>
        <table>
          <thead>
            <tr>
              <th width="5%">ITEM</th>
              <th width="11%">DOC.VENT.</th>
              <th>CLIENTE</th>
              <th width="9%">FECHA</th>
              <th width="9%">CREDITO</th>
              <th width="10%">M.DOLAES</th>
              <th width="9%">M.SOLES</th>
              <th width="9%">FECHAP.</th>
              <th width="9%">ESTADO</th>
              <th width="8%">OPCIONES.</th>
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
                    <td align="center">{d.docvent}</td>
                    <td>{d.cliente}</td>
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
                <tr className="total-row">
                  <td colSpan="5"></td>
                  <td align="center">US$ {totalDolares}</td>
                  <td align="center">S/. {totalSoles}</td>
                  <td colSpan="3"></td>
                </tr>
                <tr className="mail-row">
                  <td colSpan="10" align="center"><span className="mail-icon"><IconMail/></span></td>
                </tr>
              </>
            )}
          </tbody>
        </table>

        <div className="pie-tabla">
          <div className="leyenda">
            <b>Leyenda de OPCIONES:</b>
            <span className="leyenda-item"><IconMailBlack/> Notificar Grupal</span>
            <span className="leyenda-item"><IconMailGreen/> notificacion Individual</span>
            <span className="leyenda-item"><IconTicket/> Imprimir Ticket</span>
            <span className="leyenda-item"><IconNota/> Generar Nota de Credito</span>
          </div>
          <div className="reporte-bar">
            <span>Reporte:</span>
            <button type="button" className="btn-reporte" title="Imprimir" onClick={handleImprimir}>
              <IconImprimir/>
            </button>
            <button type="button" className="btn-reporte" title="Exportar Excel" onClick={handleExcel}>
              <IconExcel/>
            </button>
          </div>
        </div>

      </div>
    </>
  );
};

export default CtaPagarLetras;