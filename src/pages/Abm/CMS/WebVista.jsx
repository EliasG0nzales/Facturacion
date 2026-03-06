import React, { useState, useRef } from 'react';

const styles = `
  .page-container { padding:20px; font-family:Arial,Helvetica,sans-serif; font-size:13px; }
  .page-container * { color:#212529; box-sizing:border-box; }
  .page-title { font-size:16px; font-weight:normal; margin-bottom:15px; color:#333; }

  .filtro-section { display:flex; align-items:flex-end; gap:10px; flex-wrap:wrap; margin-bottom:20px; }
  .filtro-group { display:flex; flex-direction:column; gap:3px; }
  .filtro-group label { font-weight:bold; font-size:12px; color:#212529; }
  .filtro-group select { padding:6px 8px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; width:130px; }
  .filtro-group input[type="text"] { padding:6px 10px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; width:280px; }
  .filtro-group input[type="text"]::placeholder { color:#adb5bd; }
  .filtro-group input:focus, .filtro-group select:focus { border-color:#80bdff; outline:none; box-shadow:0 0 0 0.2rem rgba(0,123,255,0.25); }

  .date-group { display:flex; align-items:center; border:1px solid #ced4da; border-radius:4px; background:#fff; overflow:hidden; width:170px; }
  .date-group .date-text { flex:1; border:none; outline:none; padding:6px 8px; font-size:13px; color:#212529; background:transparent; cursor:pointer; min-width:0; }
  .date-group input[type="date"] { position:absolute; opacity:0; width:0; height:0; pointer-events:none; }
  .date-group .cal-btn { background:#fff; border:none; border-left:1px solid #ced4da; padding:0 7px; height:34px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

  .botonBuscar { background-color:#17a2b8; border:1px solid #17a2b8; color:#fff !important; padding:6px 16px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:6px; height:34px; }
  .botonBuscar:hover { background-color:#138496; }

  .tabla-titulo { text-align:center; font-weight:bold; font-size:14px; margin-bottom:0; padding:6px 0; }

  table { width:100%; border-collapse:collapse; font-size:13px; }
  table thead tr { background-color:#17a2b8; }
  table thead th { padding:10px 8px; text-align:center; font-weight:bold; color:#fff !important; }
  table tbody tr { background-color:#fff; border-bottom:1px solid #dee2e6; }
  table tbody tr:hover { background-color:#f8f9fa; }
  table tbody td { padding:8px; color:#212529; text-align:center; }
  .empty-msg { text-align:center; color:#888; padding:20px; font-size:13px; }

  .total-row { background-color:#17a2b8 !important; }
  .total-row td { color:#fff !important; font-weight:bold; padding:10px 8px; text-align:center; }

  .exportar-section { display:flex; gap:18px; justify-content:flex-end; margin-top:10px; font-size:20px; }
  .exportar-btn { display:flex; flex-direction:column; align-items:center; gap:2px; cursor:pointer; transition:transform 0.15s; background:none; border:none; padding:0; }
  .exportar-btn:hover { transform:scale(1.15); }
  .exportar-label { font-size:10px; font-weight:bold; }

  .alert-success { background:#d4edda; border:1px solid #c3e6cb; color:#155724 !important; padding:8px 14px; border-radius:4px; margin-bottom:10px; font-size:13px; display:inline-block; }
`;

// Ícono calendario con cabecera roja y días verdes — igual al screenshot
const CalIcon = () => (
  <svg width="22" height="22" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="4" width="34" height="30" rx="3" fill="#fff" stroke="#bbb" strokeWidth="1.5"/>
    <rect x="1" y="4" width="34" height="9" rx="3" fill="#e74c3c"/>
    <rect x="1" y="9"  width="34" height="4"  fill="#e74c3c"/>
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

const DatePicker = ({ label, value, onChange }) => {
  const hiddenRef = useRef(null);
  const formatDisplay = (iso) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  };
  const openPicker = () => {
    if (hiddenRef.current) {
      try { hiddenRef.current.showPicker(); }
      catch { hiddenRef.current.click(); }
    }
  };
  return (
    <div className="filtro-group">
      <label>{label}</label>
      <div className="date-group">
        <span className="date-text" onClick={openPicker}>
          {formatDisplay(value) || <span style={{color:'#adb5bd'}}>&nbsp;</span>}
        </span>
        <input ref={hiddenRef} type="date" value={value} onChange={e=>onChange(e.target.value)} tabIndex={-1} />
        <button type="button" className="cal-btn" onClick={openPicker} title="Seleccionar fecha">
          <CalIcon />
        </button>
      </div>
    </div>
  );
};

const BUSCAR_OPTS = ['Ninguno','Origen','Destino'];

const VISITAS_INICIALES = [
  { id:1, fecha:'2026-03-01', hora:'08:32', origen:'192.168.1.10',  destino:'/inicio'    },
  { id:2, fecha:'2026-03-01', hora:'09:15', origen:'190.230.45.12', destino:'/productos' },
  { id:3, fecha:'2026-03-02', hora:'11:04', origen:'200.14.22.98',  destino:'/nosotros'  },
  { id:4, fecha:'2026-03-02', hora:'14:50', origen:'201.75.33.55',  destino:'/contacto'  },
  { id:5, fecha:'2026-03-03', hora:'10:20', origen:'192.168.1.15',  destino:'/productos' },
  { id:6, fecha:'2026-03-03', hora:'16:45', origen:'190.130.88.21', destino:'/inicio'    },
];

const WebVisita = () => {
  const [visitas]                         = useState(VISITAS_INICIALES);
  const [tipoBusqueda, setTipoBusqueda]   = useState('Ninguno');
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [fechaInicio, setFechaInicio]     = useState('');
  const [fechaFin, setFechaFin]           = useState('');
  const [filtradas, setFiltradas]         = useState(VISITAS_INICIALES);
  const [msg, setMsg]                     = useState({ tipo:'', texto:'' });

  const showMsg = (tipo, texto) => { setMsg({tipo,texto}); setTimeout(()=>setMsg({tipo:'',texto:''}),2500); };

  const buscar = () => {
    let resultado = [...visitas];
    if (fechaInicio) resultado = resultado.filter(v => v.fecha >= fechaInicio);
    if (fechaFin)    resultado = resultado.filter(v => v.fecha <= fechaFin);
    if (textoBusqueda && tipoBusqueda !== 'Ninguno') {
      const txt = textoBusqueda.toLowerCase();
      if (tipoBusqueda === 'Origen')  resultado = resultado.filter(v => v.origen.toLowerCase().includes(txt));
      if (tipoBusqueda === 'Destino') resultado = resultado.filter(v => v.destino.toLowerCase().includes(txt));
    }
    setFiltradas(resultado);
    showMsg('success', `Se encontraron ${resultado.length} visita(s).`);
  };

  const handleImprimir = () => {
    const filas = filtradas.map((v,i) => `
      <tr><td>${i+1}</td><td>${v.fecha}</td><td>${v.hora}</td><td>${v.origen}</td><td>${v.destino}</td></tr>`).join('');
    const win = window.open('','_blank');
    win.document.write(`<html><head><title>Visitas Web</title>
      <style>body{font-family:Arial,sans-serif;font-size:12px;}h2{color:#17a2b8;border-bottom:2px solid #17a2b8;padding-bottom:5px;}
      table{border-collapse:collapse;width:100%;}th{background:#17a2b8;color:#fff;padding:8px;text-align:center;}
      td{padding:6px 8px;border-bottom:1px solid #dee2e6;text-align:center;}tr:nth-child(even){background:#f8f9fa;}
      .total td{background:#17a2b8;color:#fff;font-weight:bold;}</style></head>
      <body><h2>LISTADO GENERAL VISITAS WEB</h2>
      <table><thead><tr><th>Nro</th><th>Fecha</th><th>Hora</th><th>Origen</th><th>Destino</th></tr></thead>
      <tbody>${filas}
      <tr class="total"><td colspan="4"><b>TOTAL VISITA</b></td><td><b>${filtradas.length}</b></td></tr>
      </tbody></table></body></html>`);
    win.document.close(); win.print();
  };

  const handleExcel = () => {
    const enc = ['Nro','Fecha','Hora','Origen','Destino'];
    const filas = filtradas.map((v,i) => [i+1, v.fecha, v.hora, v.origen, v.destino].join(','));
    const csv = [enc.join(','), ...filas, `,,,,TOTAL: ${filtradas.length}`].join('\n');
    const blob = new Blob(['\uFEFF'+csv], {type:'text/csv;charset=utf-8;'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='web_visitas.csv'; a.click();
    URL.revokeObjectURL(a.href);
    showMsg('success','Archivo Excel descargado correctamente.');
  };

  const handleWord = () => {
    const filas = filtradas.map((v,i) => `
      <tr><td>${i+1}</td><td>${v.fecha}</td><td>${v.hora}</td><td>${v.origen}</td><td>${v.destino}</td></tr>`).join('');
    const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
      <head><meta charset='utf-8'><title>Visitas Web</title>
      <style>body{font-family:Arial;font-size:12pt;}h2{color:#17a2b8;}
      table{width:100%;border-collapse:collapse;}th{background:#17a2b8;color:white;padding:6px;border:1px solid #ccc;text-align:center;}
      td{padding:5px 6px;border:1px solid #ccc;text-align:center;}.total td{background:#17a2b8;color:white;font-weight:bold;}</style></head>
      <body><h2>LISTADO GENERAL VISITAS WEB</h2>
      <table><thead><tr><th>Nro</th><th>Fecha</th><th>Hora</th><th>Origen</th><th>Destino</th></tr></thead>
      <tbody>${filas}
      <tr class="total"><td colspan="4">TOTAL VISITA</td><td>${filtradas.length}</td></tr>
      </tbody></table></body></html>`;
    const blob = new Blob([html], {type:'application/msword'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='web_visitas.doc'; a.click();
    URL.revokeObjectURL(a.href);
    showMsg('success','Archivo Word descargado correctamente.');
  };

  return (
    <>
      <style>{styles}</style>
      <div className="page-container">

        <div className="page-title">Visita web entrante</div>

        {msg.texto && <div className="alert-success">✅ {msg.texto}</div>}

        {/* FILTROS */}
        <div className="filtro-section">
          <div className="filtro-group">
            <label>BUSCAR X</label>
            <select value={tipoBusqueda} onChange={e=>setTipoBusqueda(e.target.value)}>
              {BUSCAR_OPTS.map(o=><option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="filtro-group" style={{flex:1}}>
            <label>&nbsp;</label>
            <input
              type="text"
              placeholder="Ingrese el texto a buscar"
              value={textoBusqueda}
              onChange={e=>setTextoBusqueda(e.target.value)}
              onKeyDown={e=>e.key==='Enter' && buscar()}
            />
          </div>
          <DatePicker label="Fecha Inicio" value={fechaInicio} onChange={setFechaInicio} />
          <DatePicker label="Fecha Fin"    value={fechaFin}    onChange={setFechaFin}    />
          <div className="filtro-group">
            <label>&nbsp;</label>
            <button className="botonBuscar" onClick={buscar}>🔍 Buscar</button>
          </div>
        </div>

        {/* TABLA */}
        <div className="tabla-titulo">LISTADO GENERAL</div>
        <table>
          <thead>
            <tr>
              <th width="12%">FECHA</th>
              <th width="10%">HORA</th>
              <th>ORIGEN</th>
              <th>DESTINO</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.length === 0 ? (
              <>
                <tr><td colSpan="4" className="empty-msg">No hay visitas en el rango seleccionado.</td></tr>
                <tr className="total-row">
                  <td colSpan="3">TOTAL VISITA</td>
                  <td>0</td>
                </tr>
              </>
            ) : (
              <>
                {filtradas.map(v => (
                  <tr key={v.id}>
                    <td>{v.fecha}</td>
                    <td>{v.hora}</td>
                    <td>{v.origen}</td>
                    <td>{v.destino}</td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td colSpan="3">TOTAL VISITA</td>
                  <td>{filtradas.length}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>

        <div className="exportar-section">
          <button className="exportar-btn" onClick={handleImprimir}>
            🖨️<span className="exportar-label" style={{color:'#555'}}>Imprimir</span>
          </button>
          <button className="exportar-btn" onClick={handleExcel}>
            📗<span className="exportar-label" style={{color:'#39B636'}}>Excel</span>
          </button>
          <button className="exportar-btn" onClick={handleWord}>
            📘<span className="exportar-label" style={{color:'#3333CC'}}>Word</span>
          </button>
        </div>

      </div>
    </>
  );
};

export default WebVisita;