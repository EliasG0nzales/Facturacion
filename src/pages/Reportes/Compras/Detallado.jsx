import { useState, useRef } from "react";
import * as XLSX from "xlsx";

/* ─── DATOS DEMO (compras con detalle de artículos) ─── */
const COMPRAS_DET_DEMO = [
  { id:1,  doc:'Factura', nrodoc:'F001-003421', fecha:'2026-03-01', proveedor:'Kingston Technology',        usuario:'Iturri, Qu',  tvta:'Contado', articulo:'SSD 2TB Kingston Fury Renegade M.2 NVMe',          serieArt:'KF-SSD-2026-001', cant:2,  pu:580.00,  dolares:0,       soles:1160.00 },
  { id:2,  doc:'Factura', nrodoc:'F001-003421', fecha:'2026-03-01', proveedor:'Kingston Technology',        usuario:'Iturri, Qu',  tvta:'Contado', articulo:'Memoria USB Kingston DataTraveler Exodia 64GB',     serieArt:'',                cant:10, pu:58.50,   dolares:0,       soles:585.00  },
  { id:3,  doc:'Factura', nrodoc:'F001-003421', fecha:'2026-03-01', proveedor:'Kingston Technology',        usuario:'Iturri, Qu',  tvta:'Contado', articulo:'Memoria RAM Kingston FURY Beast 16GB DDR5',         serieArt:'KF-RAM-2026-045', cant:5,  pu:119.10,  dolares:0,       soles:595.50  },
  { id:4,  doc:'Factura', nrodoc:'F001-003422', fecha:'2026-03-02', proveedor:'Intel Perú S.A.C.',          usuario:'Merino, Ca',  tvta:'Credito', articulo:'Procesador Intel Core i9-14900K 3.2GHz LGA1700',    serieArt:'INT-CPU-2026-012',cant:2,  pu:212.50,  dolares:425.00,  soles:0       },
  { id:5,  doc:'Factura', nrodoc:'F001-003422', fecha:'2026-03-02', proveedor:'Intel Perú S.A.C.',          usuario:'Merino, Ca',  tvta:'Credito', articulo:'Procesador Intel Core i7-14700K 3.4GHz LGA1700',   serieArt:'INT-CPU-2026-013',cant:3,  pu:141.67,  dolares:425.00,  soles:0       },
  { id:6,  doc:'Factura', nrodoc:'F001-003423', fecha:'2026-03-03', proveedor:'MSI Computer Perú',          usuario:'Iturri, Qu',  tvta:'Contado', articulo:'Placa Madre MSI MAG Z790 Tomahawk WiFi DDR5',       serieArt:'MSI-MB-2026-001', cant:3,  pu:890.00,  dolares:0,       soles:2670.00 },
  { id:7,  doc:'Factura', nrodoc:'F001-003423', fecha:'2026-03-03', proveedor:'MSI Computer Perú',          usuario:'Iturri, Qu',  tvta:'Contado', articulo:'Placa Madre MSI PRO B760M-A WiFi DDR4',             serieArt:'MSI-MB-2026-002', cant:4,  pu:750.00,  dolares:0,       soles:3000.00 },
  { id:8,  doc:'Boleta',  nrodoc:'B001-000567', fecha:'2026-03-04', proveedor:'ASUS Technology Peru S.A.',  usuario:'Yupanqui',    tvta:'Contado', articulo:'Monitor ASUS TUF Gaming VG27AQ 27" QHD 165Hz IPS',  serieArt:'ASUS-M-2026-003', cant:3,  pu:630.25,  dolares:0,       soles:1890.75 },
  { id:9,  doc:'Factura', nrodoc:'F001-003424', fecha:'2026-03-05', proveedor:'Gigabyte Technology Co.',    usuario:'Merino, Ca',  tvta:'Credito', articulo:'Tarjeta de Video Gigabyte RTX 4070 SUPER GAMING OC',serieArt:'GIG-GPU-2026-007',cant:2,  pu:600.00,  dolares:1200.00, soles:0       },
  { id:10, doc:'Factura', nrodoc:'F001-003425', fecha:'2026-03-06', proveedor:'Logitech del Perú S.A.',     usuario:'Iturri, Qu',  tvta:'Contado', articulo:'Mouse Logitech G502 X PLUS Lightspeed',             serieArt:'',                cant:10, pu:195.00,  dolares:0,       soles:1950.00 },
  { id:11, doc:'Factura', nrodoc:'F001-003425', fecha:'2026-03-06', proveedor:'Logitech del Perú S.A.',     usuario:'Iturri, Qu',  tvta:'Contado', articulo:'Teclado Logitech MX Keys S Inalámbrico',            serieArt:'',                cant:5,  pu:300.00,  dolares:0,       soles:1500.00 },
  { id:12, doc:'Factura', nrodoc:'F001-003426', fecha:'2026-03-07', proveedor:'Western Digital Andina',     usuario:'Yupanqui',    tvta:'Contado', articulo:'Disco Duro Externo WD My Passport 4TB USB 3.0',     serieArt:'WD-HDD-2026-021', cant:4,  pu:347.70,  dolares:0,       soles:1390.80 },
  { id:13, doc:'Factura', nrodoc:'F001-003426', fecha:'2026-03-07', proveedor:'Western Digital Andina',     usuario:'Yupanqui',    tvta:'Contado', articulo:'SSD WD Blue SN580 1TB M.2 NVMe',                   serieArt:'WD-SSD-2026-011', cant:6,  pu:473.00,  dolares:0,       soles:2840.00 },
  { id:14, doc:'Boleta',  nrodoc:'B001-000568', fecha:'2026-03-08', proveedor:'Halion Electronics S.A.C.',  usuario:'Iturri, Qu',  tvta:'Contado', articulo:'Estabilizador Halion 1200VA Digital LCD',           serieArt:'',                cant:4,  pu:245.00,  dolares:0,       soles:980.00  },
  { id:15, doc:'Factura', nrodoc:'F001-003427', fecha:'2026-03-09', proveedor:'Team Group Perú',            usuario:'Merino, Ca',  tvta:'Credito', articulo:'Memoria RAM T-Create Classic DDR4 16GB 3200MHz',    serieArt:'',                cant:8,  pu:75.00,   dolares:600.00,  soles:0       },
  { id:16, doc:'Factura', nrodoc:'F001-003428', fecha:'2026-03-10', proveedor:'Teros S.A.C.',               usuario:'Iturri, Qu',  tvta:'Contado', articulo:'Fuente de Poder Teros TE-1850BL 850W 80+ Bronze',   serieArt:'TER-FP-2026-003', cant:5,  pu:310.00,  dolares:0,       soles:1550.00 },
  { id:17, doc:'Factura', nrodoc:'F001-003428', fecha:'2026-03-10', proveedor:'Teros S.A.C.',               usuario:'Iturri, Qu',  tvta:'Contado', articulo:'Case Teros TE-1169N Mid Tower ATX con vidrio',      serieArt:'',                cant:10, pu:199.00,  dolares:0,       soles:1990.00 },
  { id:18, doc:'Factura', nrodoc:'F001-003428', fecha:'2026-03-10', proveedor:'Teros S.A.C.',               usuario:'Iturri, Qu',  tvta:'Contado', articulo:'Fuente de Poder Teros TE-1650GD 650W 80+ Gold',     serieArt:'TER-FP-2026-004', cant:6,  pu:725.00,  dolares:0,       soles:4350.00 },
];

const fmtFecha = iso => { if(!iso) return ''; const [y,m,d]=iso.split('-'); return `${d}/${m}/${y}`; };
const fmt = n => Number(n).toFixed(2);

/* ─── Calendario ─── */
const IcoCal = () => (
  <svg width="16" height="16" viewBox="0 0 36 36" fill="none">
    <rect x="1" y="4" width="34" height="30" rx="3" fill="#fff" stroke="#bbb" strokeWidth="1.5"/>
    <rect x="1" y="4" width="34" height="9" rx="3" fill="#e74c3c"/>
    <rect x="1" y="9" width="34" height="4" fill="#e74c3c"/>
    <rect x="10" y="1" width="3" height="7" rx="1.5" fill="#888"/>
    <rect x="23" y="1" width="3" height="7" rx="1.5" fill="#888"/>
  </svg>
);

const DP = ({ value, onChange }) => {
  const ref = useRef();
  return (
    <div style={{display:'inline-flex',alignItems:'center',gap:5,height:26,
      border:'1px solid #ced4da',borderRadius:3,padding:'0 8px',background:'#fff',
      cursor:'pointer',verticalAlign:'middle',minWidth:110}}
      onClick={()=>ref.current.showPicker?.()??ref.current.click()}>
      <span style={{fontSize:12,color:value?'#212529':'#aaa',minWidth:76,userSelect:'none'}}>
        {value ? fmtFecha(value) : 'dd/mm/aaaa'}
      </span>
      <IcoCal/>
      <input ref={ref} type="date" value={value} onChange={e=>onChange(e.target.value)}
        style={{opacity:0,width:0,height:0,position:'absolute',pointerEvents:'none'}}/>
    </div>
  );
};

/* ─── CSS ─── */
const css = `
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#212529;}

  /* título */
  .cd-titulo{display:flex;align-items:center;gap:8px;margin-bottom:10px;}
  .cd-titulo .ico-help{background:#0d9fd8;color:#fff;border-radius:50%;
    width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;
    font-size:13px;font-weight:bold;cursor:pointer;flex-shrink:0;text-decoration:none;}
  .cd-titulo .tit{font-size:14px;font-weight:bold;color:#212529;letter-spacing:.3px;}

  /* barra búsqueda */
  .cd-bar{margin-bottom:12px;}
  .cd-bar-fila1{display:flex;align-items:center;gap:6px;margin-bottom:5px;flex-wrap:wrap;}
  .cd-bar-fila2{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
  .cd-lbl{font-size:12px;font-weight:bold;color:#333;white-space:nowrap;}
  .cd-bar select{height:26px;padding:0 6px;border:1px solid #ced4da;border-radius:3px;
    font-size:12px;color:#212529;background:#fff;}
  .cd-bar input[type=text]{height:26px;padding:0 8px;border:1px solid #ced4da;
    border-radius:3px;font-size:12px;color:#212529;background:#fff;flex:1;min-width:200px;max-width:480px;}
  .cd-ylo{font-size:12px;font-weight:bold;color:#333;white-space:nowrap;margin:0 4px;}

  .btn-buscar{background:#0d9fd8;border:1px solid #0d9fd8;color:#fff;
    height:30px;padding:0 18px;border-radius:4px;cursor:pointer;font-size:13px;
    font-weight:bold;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;}
  .btn-buscar:hover{background:#0b88ba;}
  .btn-buscar svg{flex-shrink:0;}

  /* tabla */
  .tbl-titulo{text-align:center;font-weight:bold;font-size:13px;
    margin:8px 0 0;letter-spacing:.5px;color:#212529;padding:5px 0;}

  table.tdet{width:100%;border-collapse:collapse;font-size:12px;}
  table.tdet thead tr{background:#1a6b8a;}
  table.tdet thead th{padding:10px 8px;font-weight:bold;font-size:11px;color:#fff;
    text-transform:uppercase;letter-spacing:.4px;text-align:left;
    border-right:1px solid rgba(255,255,255,.12);}
  table.tdet thead th:last-child{border-right:none;}
  table.tdet thead th.r{text-align:right;}
  table.tdet thead th.c{text-align:center;}

  table.tdet tbody tr{border-bottom:1px solid #e4e4e4;}
  table.tdet tbody tr:nth-child(even){background:#f5f5f5;}
  table.tdet tbody tr:hover{background:#e3f2f8;}
  table.tdet tbody td{padding:8px 8px;vertical-align:middle;color:#212529;}
  table.tdet tbody td.r{text-align:right;font-family:monospace;}
  table.tdet tbody td.c{text-align:center;}
  table.tdet tbody td.mono{font-family:monospace;font-size:11px;}

  table.tdet tfoot tr{background:#e8e8e8;}
  table.tdet tfoot td{padding:8px 8px;font-weight:bold;font-size:12px;
    color:#212529;text-align:right;font-family:monospace;}
  table.tdet tfoot td.lbl{text-align:left;font-family:'Segoe UI',sans-serif;}

  /* badge tvta */
  .badge-cont{background:#17a2b8;color:#fff;padding:1px 7px;border-radius:3px;
    font-size:10px;font-weight:bold;display:inline-block;}
  .badge-cred{background:#fd7e14;color:#fff;padding:1px 7px;border-radius:3px;
    font-size:10px;font-weight:bold;display:inline-block;}

  /* exportar */
  .export-bar{display:flex;justify-content:flex-end;align-items:center;gap:6px;
    margin:8px 0 4px;}
  .btn-exp{border:none;background:none;cursor:pointer;padding:2px;
    display:inline-flex;align-items:center;transition:opacity .15s,transform .15s;}
  .btn-exp:hover{opacity:.75;transform:scale(1.12);}

  /* alerta */
  .alerta{padding:8px 14px;border-radius:4px;margin-bottom:10px;font-size:13px;}
  .alerta-ok{background:#d4edda;border:1px solid #c3e6cb;color:#155724;}
  .alerta-err{background:#f8d7da;border:1px solid #f5c6cb;color:#721c24;}
`;

const IcoBuscar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2.2"/>
    <path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
  </svg>
);

const IcoPrint = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="8" width="18" height="12" rx="2" stroke="#888" strokeWidth="1.5" fill="#f5f5f5"/>
    <path d="M7 8V4h10v4" stroke="#888" strokeWidth="1.5"/>
    <rect x="7" y="14" width="10" height="5" rx="1" fill="#fff" stroke="#bbb" strokeWidth="1"/>
    <circle cx="18" cy="11" r="1" fill="#888"/>
  </svg>
);

const IcoXls = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="3" fill="#1D6F42"/>
    <text x="2" y="17" fontFamily="Arial" fontSize="10" fontWeight="bold" fill="#fff">XLS</text>
  </svg>
);

const IcoDoc = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="3" fill="#2B579A"/>
    <text x="1" y="17" fontFamily="Arial" fontSize="9" fontWeight="bold" fill="#fff">DOC</text>
  </svg>
);

const hoy = new Date().toISOString().split('T')[0];

export default function ComprasDetallado() {
  const [fDocmto,  setFDocmto]  = useState('');
  const [fSucursal,setFSucursal]= useState('');
  const [fTipo,    setFTipo]    = useState('');
  const [fQ,       setFQ]       = useState('');
  const [fFei,     setFFei]     = useState('');
  const [fFef,     setFFef]     = useState('');
  const [buscado,  setBuscado]  = useState(false);
  const [alerta,   setAlerta]   = useState('');

  const showAlerta = msg => { setAlerta(msg); setTimeout(()=>setAlerta(''),3000); };

  /* ── filtrar ── */
  const filasFilt = COMPRAS_DET_DEMO.filter(r => {
    if (fDocmto && r.doc !== fDocmto) return false;
    if (fQ && fTipo) {
      const q = fQ.toLowerCase();
      if (fTipo==='1') return r.nrodoc.toLowerCase().includes(q);
      if (fTipo==='2') return r.proveedor.toLowerCase().includes(q);
      if (fTipo==='3') return (r.ruc||'').includes(q);
      if (fTipo==='4') return r.usuario.toLowerCase().includes(q);
      if (fTipo==='5') return r.tvta.toLowerCase().includes(q);
      if (fTipo==='6') return r.articulo.toLowerCase().includes(q);
      if (fTipo==='7') return (r.serieArt||'').toLowerCase().includes(q);
    }
    if (fFei && r.fecha < fFei) return false;
    if (fFef && r.fecha > fFef) return false;
    return true;
  });

  const totDol = filasFilt.reduce((s,r) => s + r.dolares, 0);
  const totSol = filasFilt.reduce((s,r) => s + r.soles,   0);

  const filasMostradas = buscado ? filasFilt : [];
  const totDolM = filasMostradas.reduce((s,r) => s + r.dolares, 0);
  const totSolM = filasMostradas.reduce((s,r) => s + r.soles,   0);

  const ejecutarBusqueda = () => setBuscado(true);

  /* ══ EXPORTAR EXCEL ══ */
  const exportarExcel = () => {
    if (!buscado) { showAlerta('err:Primero haga una búsqueda.'); return; }
    const wb = XLSX.utils.book_new();
    const headers = ['Documento','Nro Doc','Fecha','Proveedor','Usuario','T.Venta',
                     'Artículo','Serie Art.','Cant.','P.Unit.','Dolares (US$)','Soles (S/)'];
    const rows = filasMostradas.map(r => ([
      r.doc, r.nrodoc, fmtFecha(r.fecha), r.proveedor, r.usuario, r.tvta,
      r.articulo, r.serieArt||'', r.cant, r.pu,
      r.dolares > 0 ? r.dolares : 0,
      r.soles   > 0 ? r.soles   : 0,
    ]));
    rows.push(['','','','','','','','','','TOTALES', totDolM, totSolM]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    ws['!cols'] = [
      {wch:10},{wch:16},{wch:11},{wch:30},{wch:14},{wch:10},
      {wch:44},{wch:18},{wch:7},{wch:10},{wch:13},{wch:13},
    ];
    XLSX.utils.book_append_sheet(wb, ws, 'Compras Detallado');
    XLSX.writeFile(wb, `Reporte_Compras_Detallado_${hoy}.xlsx`);
    showAlerta('ok:Archivo Excel generado correctamente.');
  };

  /* ══ EXPORTAR WORD ══ */
  const exportarWord = () => {
    if (!buscado) { showAlerta('err:Primero haga una búsqueda.'); return; }
    const filas = filasMostradas.map((r,i) => `
      <tr style="background:${i%2===0?'#f5f5f5':'#fff'}">
        <td>${r.doc}</td>
        <td style="font-family:monospace">${r.nrodoc}</td>
        <td align="center">${fmtFecha(r.fecha)}</td>
        <td>${r.proveedor}</td>
        <td>${r.usuario}</td>
        <td align="center">${r.tvta}</td>
        <td>${r.articulo}</td>
        <td align="center">${r.cant}</td>
        <td align="right" style="font-family:monospace">${fmt(r.pu)}</td>
        <td align="right" style="font-family:monospace">${r.dolares>0?'US$ '+fmt(r.dolares):'—'}</td>
        <td align="right" style="font-family:monospace">${r.soles>0?'S/ '+fmt(r.soles):'—'}</td>
      </tr>`).join('');

    const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office'
      xmlns:w='urn:schemas-microsoft-com:office:word'
      xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset="UTF-8">
    <style>
      body{font-family:Arial,sans-serif;font-size:10pt;margin:1.5cm;}
      h1{font-size:13pt;text-align:center;color:#1a6b8a;margin-bottom:4px;}
      .sub{text-align:center;font-size:9pt;color:#666;margin-bottom:14px;}
      table{width:100%;border-collapse:collapse;font-size:9pt;}
      th{background:#1a6b8a;color:#fff;padding:6px 5px;text-align:left;font-weight:bold;border:1px solid #145570;}
      td{padding:4px 5px;border:1px solid #ddd;}
      .tot{background:#e8e8e8;font-weight:bold;}
      .footer{margin-top:20px;font-size:8pt;color:#999;text-align:center;border-top:1px solid #eee;padding-top:5px;}
    </style></head><body>
      <h1>REPORTE DE COMPRA DETALLADO</h1>
      <p class="sub">Generado el ${fmtFecha(hoy)} &nbsp;|&nbsp; Usuario: Iturri, Qu(Tiend) &nbsp;|&nbsp; INTELIGENTE</p>
      <table>
        <thead><tr>
          <th>Documento</th><th>Nro Doc</th><th>Fecha</th><th>Proveedor</th>
          <th>Usuario</th><th>T.Venta</th><th>Artículo</th>
          <th>Cant.</th><th>P.Unit.</th><th>Dolares</th><th>Soles</th>
        </tr></thead>
        <tbody>${filas}</tbody>
        <tfoot><tr class="tot">
          <td colspan="9" align="right"><b>TOTAL</b></td>
          <td align="right"><b>${totDolM>0?'US$ '+fmt(totDolM):'US$ 0.00'}</b></td>
          <td align="right"><b>S/ ${fmt(totSolM)}</b></td>
        </tr></tfoot>
      </table>
      <p class="footer">© 2009 - 2026 INTELIGENTE — Todos los derechos reservados</p>
    </body></html>`;

    const blob = new Blob(['\ufeff', html], { type:'application/msword;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `Reporte_Compras_Detallado_${hoy}.doc`; a.click();
    URL.revokeObjectURL(url);
    showAlerta('ok:Archivo Word generado correctamente.');
  };

  /* ══ IMPRIMIR ══ */
  const imprimir = () => {
    if (!buscado) { showAlerta('err:Primero haga una búsqueda.'); return; }
    const filas = filasMostradas.map((r,i) => `
      <tr style="background:${i%2===0?'#f5f5f5':'#fff'}">
        <td>${r.doc}</td><td>${r.nrodoc}</td><td>${fmtFecha(r.fecha)}</td>
        <td>${r.proveedor}</td><td>${r.usuario}</td><td>${r.tvta}</td>
        <td>${r.articulo}</td>
        <td align="center">${r.cant}</td>
        <td align="right">${fmt(r.pu)}</td>
        <td align="right">${r.dolares>0?'US$ '+fmt(r.dolares):'—'}</td>
        <td align="right">${r.soles>0?'S/ '+fmt(r.soles):'—'}</td>
      </tr>`).join('');

    const w = window.open('','_blank','width=1050,height=700');
    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
      <title>Reporte Compras Detallado</title>
      <style>
        body{font-family:Arial,sans-serif;font-size:9pt;margin:1cm;color:#111;}
        h1{font-size:12pt;text-align:center;color:#1a6b8a;margin:0 0 3px;}
        .sub{text-align:center;font-size:8pt;color:#666;margin-bottom:12px;}
        table{width:100%;border-collapse:collapse;font-size:8.5pt;}
        th{background:#1a6b8a;color:#fff;padding:6px 5px;text-align:left;font-weight:bold;}
        td{padding:4px 5px;border-bottom:1px solid #e0e0e0;}
        .tot{background:#e8e8e8;font-weight:bold;}
        .footer{margin-top:18px;font-size:7.5pt;color:#999;text-align:center;border-top:1px solid #eee;padding-top:5px;}
        @media print{body{margin:.8cm;}}
      </style></head><body>
      <h1>REPORTE DE COMPRA DETALLADO</h1>
      <p class="sub">Fecha: ${fmtFecha(hoy)} &nbsp;|&nbsp; Usuario: Iturri, Qu(Tiend) &nbsp;|&nbsp; INTELIGENTE</p>
      <table>
        <thead><tr>
          <th>Documento</th><th>Nro Doc</th><th>Fecha</th><th>Proveedor</th>
          <th>Usuario</th><th>T.Venta</th><th>Artículo</th>
          <th>Cant.</th><th>P.Unit.</th><th>Dolares</th><th>Soles</th>
        </tr></thead>
        <tbody>${filas}</tbody>
        <tfoot><tr class="tot">
          <td colspan="9" align="right"><b>TOTAL</b></td>
          <td align="right"><b>${totDolM>0?'US$ '+fmt(totDolM):'US$ 0.00'}</b></td>
          <td align="right"><b>S/ ${fmt(totSolM)}</b></td>
        </tr></tfoot>
      </table>
      <p class="footer">© 2009 - 2026 INTELIGENTE — Todos los derechos reservados</p>
      <script>window.onload=()=>window.print()<\/script>
    </body></html>`);
    w.document.close();
  };

  return (
    <>
      <style>{css}</style>

      {alerta && (
        <div className={`alerta ${alerta.startsWith('ok:')? 'alerta-ok':'alerta-err'}`}>
          {alerta.startsWith('ok:')? '✅ ':'⚠️ '}{alerta.slice(3)}
        </div>
      )}

      {/* ── Título ── */}
      <div className="cd-titulo">
        <a className="ico-help" title="Ayuda">?</a>
        <span className="tit">REPORTE DE COMPRA DETALLADO</span>
      </div>

      {/* ── Barra de búsqueda ── */}
      <div className="cd-bar">
        {/* Fila 1: selectores + campo texto */}
        <div className="cd-bar-fila1">
          <span className="cd-lbl">BUSCAR X</span>

          <select value={fDocmto} onChange={e=>setFDocmto(e.target.value)}>
            <option value="">Documento &gt; todos</option>
            <option value="Boleta">Boleta</option>
            <option value="Factura">Factura</option>
            <option value="Guia">Guia</option>
          </select>

          <select value={fSucursal} onChange={e=>setFSucursal(e.target.value)}>
            <option value="">Sucursal &gt; todos</option>
            <option value="3">Almacen 1</option>
            <option value="2">Tienda2</option>
            <option value="1">Tienda1</option>
          </select>

          <select value={fTipo} onChange={e=>setFTipo(e.target.value)} style={{width:130}}>
            <option value="">Ninguno</option>
            <option value="1">Nro documento</option>
            <option value="2">Proveedor</option>
            <option value="3">RUC</option>
            <option value="4">Usuario</option>
            <option value="5">T.Compra</option>
            <option value="6">Articulo</option>
            <option value="7">Serie.Articulo</option>
          </select>
        </div>

        {/* Fila 2: texto + fechas + buscar */}
        <div className="cd-bar-fila2">
          <input type="text" value={fQ} onChange={e=>setFQ(e.target.value)}
            placeholder="" onKeyDown={e=>e.key==='Enter'&&ejecutarBusqueda()}/>
          <span className="cd-ylo">y/o</span>

          <div style={{display:'flex',flexDirection:'column',gap:2}}>
            <span style={{fontSize:11,color:'#555'}}>Fecha Inicio</span>
            <DP value={fFei} onChange={setFFei}/>
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:2}}>
            <span style={{fontSize:11,color:'#555'}}>Fecha Fin</span>
            <DP value={fFef} onChange={setFFef}/>
          </div>

          <button className="btn-buscar" onClick={ejecutarBusqueda} style={{marginTop:14}}>
            <IcoBuscar/> Buscar
          </button>
        </div>
      </div>

      {/* ── Tabla ── */}
      <div className="tbl-titulo">LISTADO GENERAL DE COMPRAS</div>
      <table className="tdet">
        <thead>
          <tr>
            <th>Documento</th>
            <th>Nro Doc</th>
            <th>Fecha</th>
            <th>Proveedor</th>
            <th>Usuario</th>
            <th>T.Venta</th>
            <th>Articulo</th>
            <th className="c">Cant.</th>
            <th className="c">PU</th>
            <th className="r">Dolares</th>
            <th className="r">Soles</th>
          </tr>
        </thead>
        <tbody>
          {!buscado ? (
            /* estado inicial: solo fila de totales vacía (igual al original) */
            <tr style={{background:'#e6e6e6'}}>
              <td colSpan={9}></td>
              <td className="r" style={{fontWeight:'bold'}}>US$ 0.00</td>
              <td className="r" style={{fontWeight:'bold'}}>S/ 0.00</td>
            </tr>
          ) : filasMostradas.length === 0 ? (
            <tr>
              <td colSpan={11} style={{textAlign:'center',padding:18,color:'#888'}}>
                Sin resultados para los filtros aplicados.
              </td>
            </tr>
          ) : (
            <>
              {filasMostradas.map(r => (
                <tr key={r.id}>
                  <td>{r.doc}</td>
                  <td className="mono">{r.nrodoc}</td>
                  <td className="c">{fmtFecha(r.fecha)}</td>
                  <td>{r.proveedor}</td>
                  <td>{r.usuario}</td>
                  <td className="c">
                    <span className={r.tvta==='Contado'?'badge-cont':'badge-cred'}>{r.tvta}</span>
                  </td>
                  <td>{r.articulo}
                    {r.serieArt && (
                      <div style={{fontSize:10,color:'#888',marginTop:1}}>
                        Serie: {r.serieArt}
                      </div>
                    )}
                  </td>
                  <td className="c">{r.cant}</td>
                  <td className="r">{fmt(r.pu)}</td>
                  <td className="r">
                    {r.dolares>0
                      ? <span style={{color:'#155724',fontWeight:'bold'}}>US$ {fmt(r.dolares)}</span>
                      : <span style={{color:'#aaa'}}>—</span>}
                  </td>
                  <td className="r">
                    {r.soles>0
                      ? <span style={{color:'#004085',fontWeight:'bold'}}>S/ {fmt(r.soles)}</span>
                      : <span style={{color:'#aaa'}}>—</span>}
                  </td>
                </tr>
              ))}
              {/* fila totales */}
              <tr style={{background:'#e6e6e6'}}>
                <td colSpan={9} style={{textAlign:'right',fontWeight:'bold',paddingRight:12}}>TOTAL</td>
                <td className="r" style={{fontWeight:'bold',color:'#155724'}}>
                  {totDolM>0 ? `US$ ${fmt(totDolM)}` : 'US$ 0.00'}
                </td>
                <td className="r" style={{fontWeight:'bold',color:'#004085'}}>
                  S/ {fmt(totSolM)}
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>

      {/* ── Exportar ── */}
      <div className="export-bar">
        <button className="btn-exp" title="Imprimir" onClick={imprimir}>
          <IcoPrint/>
        </button>
        <button className="btn-exp" title="Exportar Excel (.xlsx)" onClick={exportarExcel}>
          <IcoXls/>
        </button>
        <button className="btn-exp" title="Exportar Word (.doc)" onClick={exportarWord}>
          <IcoDoc/>
        </button>
      </div>
    </>
  );
}