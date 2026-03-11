import { useState, useRef } from "react";
import * as XLSX from "xlsx";

/* ─── DATOS DEMO ─── */
const PROVEEDORES_DB = [
  { id:1,  nombre:'Kingston Technology',          ruc:'20512345678', dir:'Av. Javier Prado 1234' },
  { id:2,  nombre:'Intel Perú S.A.C.',            ruc:'20523456789', dir:'Av. La Marina 567' },
  { id:3,  nombre:'MSI Computer Perú',            ruc:'20534567890', dir:'Calle Los Pinos 890' },
  { id:4,  nombre:'ASUS Technology Peru S.A.',    ruc:'20545678901', dir:'Av. Arequipa 2345' },
  { id:5,  nombre:'Gigabyte Technology Co.',      ruc:'20556789012', dir:'Jr. Union 678' },
  { id:6,  nombre:'Logitech del Perú S.A.',       ruc:'20567890123', dir:'Av. Benavides 910' },
  { id:7,  nombre:'Western Digital Andina',       ruc:'20578901234', dir:'Calle Comercio 112' },
  { id:8,  nombre:'Halion Electronics S.A.C.',    ruc:'20589012345', dir:'Av. Primavera 345' },
  { id:9,  nombre:'Team Group Perú',              ruc:'20590123456', dir:'Jr. Cusco 678' },
  { id:10, nombre:'Teros S.A.C.',                 ruc:'20601234567', dir:'Av. Colonial 901' },
];

const COMPRAS_DEMO = [
  { id:2,  doc:'Boleta',  nrodoc:'01-222',          fecha:'2023-12-27', proveedor:'Soy Proveedor SA',                                  ruc:'20602421253', usuario:'Alexander',  tvta:'Contado', dolares:0,        soles:40000.00 },
  { id:20, doc:'Boleta',  nrodoc:'03-4444',          fecha:'2026-02-26', proveedor:'Compudiskett S R L',                                ruc:'20123053037', usuario:'demo',        tvta:'Contado', dolares:0,        soles:2500.00  },
  { id:16, doc:'Factura', nrodoc:'0103-842470',      fecha:'2024-04-06', proveedor:'Grupo Deltron S.A.',                               ruc:'20212331377', usuario:'demo',        tvta:'Contado', dolares:2727.35,  soles:0        },
  { id:15, doc:'Factura', nrodoc:'0103-854185',      fecha:'2024-04-02', proveedor:'Grupo Deltron S.A.',                               ruc:'20212331377', usuario:'demo',        tvta:'Contado', dolares:5880.07,  soles:0        },
  { id:17, doc:'Factura', nrodoc:'f0009-0503275',    fecha:'2024-04-19', proveedor:'Compudiskett S R L',                               ruc:'20123053037', usuario:'demo',        tvta:'Contado', dolares:1947.00,  soles:0        },
  { id:6,  doc:'Factura', nrodoc:'F002-0124695',     fecha:'2024-01-29', proveedor:'Exportadora Importadora Igarashi Ascencio S.r.ltda',ruc:'20252011910', usuario:'demo',        tvta:'Contado', dolares:929.00,   soles:0        },
  { id:7,  doc:'Factura', nrodoc:'F009-0488436',     fecha:'2024-01-29', proveedor:'Compudiskett S R L',                               ruc:'20123053037', usuario:'demo',        tvta:'Contado', dolares:623.04,   soles:0        },
  { id:10, doc:'Factura', nrodoc:'F009-0488839',     fecha:'2024-01-31', proveedor:'Compudiskett S R L',                               ruc:'20123053037', usuario:'demo',        tvta:'Contado', dolares:332.76,   soles:0        },
  { id:11, doc:'Factura', nrodoc:'F009-0488840',     fecha:'2024-01-31', proveedor:'Compudiskett S R L',                               ruc:'20123053037', usuario:'demo',        tvta:'Contado', dolares:332.76,   soles:0        },
  { id:12, doc:'Factura', nrodoc:'F009-0488842',     fecha:'2024-01-31', proveedor:'Compudiskett S R L',                               ruc:'20123053037', usuario:'demo',        tvta:'Contado', dolares:826.78,   soles:0        },
  { id:9,  doc:'Factura', nrodoc:'F009-0489048',     fecha:'2024-02-01', proveedor:'Compudiskett S R L',                               ruc:'20123053037', usuario:'demo',        tvta:'Contado', dolares:2015.44,  soles:0        },
  { id:13, doc:'Factura', nrodoc:'F009-495507',      fecha:'2024-03-11', proveedor:'Compudiskett S R L',                               ruc:'20123053037', usuario:'demo',        tvta:'Contado', dolares:554.60,   soles:0        },
  { id:8,  doc:'Factura', nrodoc:'F016-00223624',    fecha:'2024-01-30', proveedor:'Maxima Internacional S.A.',                        ruc:'20127745910', usuario:'demo',        tvta:'Contado', dolares:610.10,   soles:0        },
  { id:19, doc:'Factura', nrodoc:'f016-229922',      fecha:'2024-04-29', proveedor:'Maxima Internacional S.A.',                        ruc:'20127745910', usuario:'demo',        tvta:'Contado', dolares:4918.24,  soles:0        },
  { id:3,  doc:'Factura', nrodoc:'F102-000435572',   fecha:'2024-01-23', proveedor:'Grupo Deltron S.A.',                               ruc:'20212331377', usuario:'demo',        tvta:'Contado', dolares:5392.60,  soles:0        },
  { id:5,  doc:'Factura', nrodoc:'F106-00445282',    fecha:'2024-01-22', proveedor:'Grupo Deltron S.A.',                               ruc:'20212331377', usuario:'demo',        tvta:'Contado', dolares:2147.60,  soles:0        },
  { id:4,  doc:'Factura', nrodoc:'F106-00445582',    fecha:'2024-01-24', proveedor:'Grupo Deltron S.A.',                               ruc:'20212331377', usuario:'demo',        tvta:'Contado', dolares:4727.82,  soles:0        },
  { id:14, doc:'Factura', nrodoc:'t018-4014',        fecha:'2024-04-04', proveedor:'Maxima Internacional S.A.',                        ruc:'20127745910', usuario:'demo',        tvta:'Contado', dolares:2003.64,  soles:0        },
];

const GASTOS_DEMO = [
  { id:1, fecha:'2026-03-02', destinado:'Tienda1',   usuario:'Iturri, Qu',  motivo:'Útiles de oficina',        dolares:0,    soles:120.00 },
  { id:2, fecha:'2026-03-04', destinado:'Almacén',   usuario:'Merino, Ca',  motivo:'Mantenimiento equipos',    dolares:0,    soles:350.00 },
  { id:3, fecha:'2026-03-06', destinado:'Tienda2',   usuario:'Yupanqui',    motivo:'Fletes y transporte',      dolares:0,    soles:80.00  },
  { id:4, fecha:'2026-03-08', destinado:'Tienda1',   usuario:'Iturri, Qu',  motivo:'Servicios básicos',        dolares:0,    soles:215.00 },
  { id:5, fecha:'2026-03-10', destinado:'Almacén',   usuario:'Merino, Ca',  motivo:'Seguridad / vigilancia',   dolares:0,    soles:450.00 },
];

const fmtFecha = iso => { if(!iso) return ''; const [y,m,d]=iso.split('-'); return `${d}/${m}/${y}`; };
const fmtMonto = (n) => n > 0 ? n.toFixed(2) : '0.00';

/* ─── IcoCal (igual que el módulo Venta) ─── */
const IcoCal = () => (
  <svg width="16" height="16" viewBox="0 0 36 36" fill="none">
    <rect x="1" y="4" width="34" height="30" rx="3" fill="#fff" stroke="#bbb" strokeWidth="1.5"/>
    <rect x="1" y="4" width="34" height="9" rx="3" fill="#e74c3c"/>
    <rect x="1" y="9" width="34" height="4" fill="#e74c3c"/>
    <rect x="10" y="1" width="3" height="7" rx="1.5" fill="#888"/>
    <rect x="23" y="1" width="3" height="7" rx="1.5" fill="#888"/>
  </svg>
);

const DP = ({ value, onChange, placeholder }) => {
  const ref = useRef();
  return (
    <div style={{display:'inline-flex',alignItems:'center',gap:5,height:24,
      border:'1px solid #ced4da',borderRadius:3,padding:'0 7px',background:'#fff',
      cursor:'pointer',verticalAlign:'middle'}}
      onClick={()=>ref.current.showPicker?.()??ref.current.click()}>
      <span style={{fontSize:12,color:value?'#212529':'#aaa',minWidth:72}}>
        {value ? fmtFecha(value) : (placeholder||'')}
      </span>
      <IcoCal/>
      <input ref={ref} type="date" value={value} onChange={e=>onChange(e.target.value)}
        style={{opacity:0,width:1,height:1,position:'absolute',pointerEvents:'none'}}/>
    </div>
  );
};

/* ─── CSS ─── */
const css = `
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#212529;}

  .cr-wrap{padding:6px 0;}
  .cr-titulo{display:flex;align-items:center;gap:8px;margin-bottom:14px;}
  .cr-titulo .ico-help{background:#0099ff;color:#fff;border-radius:50%;
    width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;
    font-size:13px;font-weight:bold;cursor:pointer;flex-shrink:0;}
  .cr-titulo .tit{font-size:15px;font-weight:bold;color:#212529;letter-spacing:.3px;}

  /* ── barra de búsqueda ── */
  .cr-bar{background:#f0f4f7;border:1px solid #dee2e6;border-radius:4px;
    padding:10px 14px;margin-bottom:14px;}
  .cr-bar-row{display:flex;align-items:flex-end;gap:8px;flex-wrap:wrap;}
  .cr-bar label{font-size:11px;font-weight:bold;color:#555;display:block;margin-bottom:3px;}
  .cr-bar select{padding:3px 6px;border:1px solid #ced4da;border-radius:3px;
    font-size:12px;color:#212529;background:#fff;height:24px;}
  .cr-bar input[type=text]{padding:3px 7px;border:1px solid #ced4da;border-radius:3px;
    font-size:12px;color:#212529;background:#fff;height:24px;}
  .cr-bar .lbl-top{font-size:12px;font-weight:bold;color:#333;margin-bottom:4px;}
  .cr-bar .campo-busq{width:360px;}

  .btn-buscar{background:#17a2b8;border:1px solid #17a2b8;color:#fff;
    padding:5px 16px;border-radius:4px;cursor:pointer;font-size:13px;font-weight:bold;
    display:inline-flex;align-items:center;gap:5px;height:28px;}
  .btn-buscar:hover{background:#138496;}
  .btn-nuevo{background:#17a2b8;border:1px solid #17a2b8;color:#fff;
    padding:5px 16px;border-radius:4px;cursor:pointer;font-size:13px;font-weight:bold;
    display:inline-flex;align-items:center;gap:5px;height:28px;}
  .btn-nuevo:hover{background:#138496;}

  /* ── tablas ── */
  .tbl-titulo{text-align:center;font-weight:bold;font-size:13px;
    margin:10px 0 0;letter-spacing:.5px;color:#212529;padding:6px 0;}

  /* Tabla Compras — cabecera azul oscuro igual al original */
  table.tcomp{width:100%;border-collapse:collapse;font-size:12px;}
  table.tcomp thead tr{background:#1a6b8a;}
  table.tcomp thead th{padding:10px 8px;text-align:left;font-weight:bold;
    font-size:11px;color:#fff;text-transform:uppercase;letter-spacing:.4px;
    border-right:1px solid rgba(255,255,255,.1);}
  table.tcomp thead th:last-child{border-right:none;}
  table.tcomp tbody tr{border-bottom:1px solid #e0e0e0;}
  table.tcomp tbody tr:nth-child(even){background:#f5f5f5;}
  table.tcomp tbody tr:hover{background:#e3f2f8;}
  table.tcomp tbody td{padding:8px 8px;vertical-align:middle;color:#212529;}
  table.tcomp tfoot tr{background:#d0e8ee;}
  table.tcomp tfoot td{padding:8px 8px;font-weight:bold;font-size:12px;color:#212529;}

  /* tabla gastos — también cabecera azul oscuro */
  table.tgasto{width:100%;border-collapse:collapse;font-size:12px;margin-top:0;}
  table.tgasto thead tr{background:#1a6b8a;}
  table.tgasto thead th{padding:10px 8px;text-align:left;font-weight:bold;
    font-size:11px;color:#fff;text-transform:uppercase;letter-spacing:.4px;
    border-right:1px solid rgba(255,255,255,.1);}
  table.tgasto thead th:last-child{border-right:none;}
  table.tgasto tbody tr{border-bottom:1px solid #e0e0e0;}
  table.tgasto tbody tr:hover{background:#f0f8fb;}
  table.tgasto tbody td{padding:7px 8px;color:#212529;}
  /* fila Total (texto centrado, sin datos en las primeras cols) */
  table.tgasto tfoot tr.fila-total td{background:#f0f0f0;font-weight:bold;font-size:12px;color:#212529;padding:7px 8px;}
  /* fila TOTAL GENERAL — azul oscuro igual al original */
  table.tgasto tfoot tr.fila-totgen td{background:#1a6b8a;font-weight:bold;font-size:12px;color:#fff;padding:9px 8px;}

  /* total general */
  .total-general{background:#c8dfe0;border-radius:4px;padding:8px 12px;
    display:flex;align-items:center;gap:16px;justify-content:flex-end;margin-top:2px;font-size:13px;}
  .total-general .tg-label{font-weight:bold;color:#212529;}
  .total-general .tg-val{font-weight:bold;font-size:14px;min-width:100px;text-align:right;}

  /* herramientas exportar */
  .export-bar{display:flex;justify-content:flex-end;gap:8px;margin:10px 0 6px;align-items:center;}
  .btn-exp{border:none;background:none;cursor:pointer;font-size:22px;line-height:1;padding:2px;}
  .btn-exp:hover{opacity:.75;transform:scale(1.1);}

  /* modal compra */
  .mopc-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:3000;
    display:flex;align-items:center;justify-content:center;}
  .mopc-box{background:#fff;border-radius:6px;min-width:520px;max-width:780px;width:92%;
    box-shadow:0 8px 32px rgba(0,0,0,.25);overflow:hidden;}
  .mopc-head{padding:12px 18px;display:flex;justify-content:space-between;align-items:center;
    color:#fff;font-weight:bold;font-size:14px;}
  .mopc-body{padding:18px 20px;max-height:70vh;overflow-y:auto;}
  .mopc-footer{padding:10px 18px;display:flex;gap:8px;justify-content:flex-end;
    border-top:1px solid #dee2e6;background:#f8f9fa;}
  .mopc-btn{padding:6px 18px;border:none;border-radius:4px;cursor:pointer;
    font-size:13px;font-weight:bold;color:#fff;}
  .mopc-row{display:flex;gap:8px;margin-bottom:9px;align-items:flex-start;}
  .mopc-label{font-weight:bold;font-size:12px;min-width:120px;color:#555;padding-top:2px;}
  .mopc-val{font-size:13px;color:#212529;}
  .mopc-inp{padding:5px 9px;border:1px solid #ced4da;border-radius:4px;font-size:13px;
    color:#212529;background:#fff;width:100%;}
  .mopc-inp:focus{border-color:#80bdff;outline:none;box-shadow:0 0 0 2px rgba(0,123,255,.12);}

  /* tabla detalle dentro del modal */
  table.tdet{width:100%;border-collapse:collapse;font-size:12px;margin-top:8px;}
  table.tdet thead tr{background:#003d6b;}
  table.tdet thead th{padding:7px 8px;color:#fff;font-weight:bold;font-size:11px;text-align:center;}
  table.tdet tbody tr{border-bottom:1px solid #eee;}
  table.tdet tbody tr:nth-child(even){background:#f8f9fa;}
  table.tdet tbody td{padding:6px 8px;font-size:12px;color:#212529;}

  /* badge tvta */
  .badge-cont{background:#17a2b8;color:#fff;padding:1px 7px;border-radius:3px;font-size:10px;font-weight:bold;}
  .badge-cred{background:#fd7e14;color:#fff;padding:1px 7px;border-radius:3px;font-size:10px;font-weight:bold;}

  /* ops íconos */
  .ops{display:flex;gap:3px;align-items:center;}
  .ic{cursor:pointer;border:none;background:transparent;padding:0;display:inline-flex;align-items:center;}
  .ic:hover{opacity:.75;transform:scale(1.1);}

  /* alert */
  .alerta{padding:8px 14px;border-radius:4px;margin-bottom:10px;font-size:13px;}
  .alerta-ok{background:#d4edda;border:1px solid #c3e6cb;color:#155724;}
  .alerta-err{background:#f8d7da;border:1px solid #f5c6cb;color:#721c24;}

  hr.sep{border:none;border-top:1px solid #dee2e6;margin:12px 0;}

  /* form nueva compra */
  .nc-wrap{background:#fff;padding:14px 16px;border:1px solid #dee2e6;border-radius:4px;}
  .nc-row{display:flex;flex-wrap:wrap;gap:0;align-items:flex-end;
    border-bottom:1px solid #eee;padding:8px 0;}
  .nc-row:last-child{border-bottom:none;}
  .nc-cell{display:flex;flex-direction:column;gap:2px;padding:0 10px 0 0;}
  .nc-cell label{font-size:11px;font-weight:bold;color:#444;white-space:nowrap;}
  .nc-cell input,.nc-cell select{padding:4px 7px;border:1px solid #ced4da;border-radius:3px;
    font-size:12px;color:#212529;background:#fff;height:27px;}
  .nc-cell input:focus,.nc-cell select:focus{border-color:#80bdff;outline:none;}
  .nc-div{width:1px;background:#dee2e6;margin:0 6px;align-self:stretch;}
  .req{color:#dc3545;font-size:11px;}
  .inp-verde{background:#ccff99 !important;border:1px solid #8bc34a !important;font-weight:bold !important;}

  /* tabla artículos compra */
  table.tart{width:100%;border-collapse:collapse;font-size:12px;}
  table.tart thead tr{background:#003d6b;}
  table.tart thead th{padding:8px 6px;text-align:center;color:#fff;font-weight:bold;font-size:11px;}
  table.tart tbody tr{border-bottom:1px solid #dee2e6;}
  table.tart tbody td{padding:5px 4px;vertical-align:middle;}
  table.tart input[type=text],table.tart input[type=number]{
    padding:3px 5px;border:1px solid #ced4da;border-radius:3px;font-size:12px;width:100%;}
  table.tart textarea{padding:3px 5px;border:1px solid #ced4da;border-radius:3px;
    font-size:12px;width:100%;resize:none;height:46px;}
  table.tart select{padding:3px 3px;border:1px solid #ced4da;border-radius:3px;font-size:12px;width:100%;}

  .form-footer{display:flex;justify-content:center;gap:10px;margin-top:14px;padding-bottom:8px;}
  .btn-gd{background:#17a2b8;border:1px solid #17a2b8;color:#fff;padding:8px 22px;
    cursor:pointer;font-size:13px;font-weight:bold;border-radius:5px;
    display:inline-flex;align-items:center;gap:6px;}
  .btn-gd:hover{background:#138496;}
  .btn-reg{background:#6c757d;border:1px solid #6c757d;color:#fff;padding:8px 22px;
    cursor:pointer;font-size:13px;font-weight:bold;border-radius:5px;
    display:inline-flex;align-items:center;gap:6px;}
  .btn-reg:hover{background:#5a6268;}
`;

/* ─── Íconos tabla ─── */
const IcoEdit = () => <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:21,height:21,borderRadius:3,background:'#e67e22',color:'#fff',fontSize:11,fontWeight:'bold',cursor:'pointer'}} title="Ver / Editar">✏</span>;
const IcoAnu  = () => <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:21,height:21,borderRadius:3,background:'#dc3545',color:'#fff',fontSize:11,fontWeight:'bold',cursor:'pointer'}} title="Anular">✕</span>;
const IcoPDF  = () => <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:21,height:21,borderRadius:3,background:'#dc3545',color:'#fff',fontSize:9, fontWeight:'bold',cursor:'pointer'}} title="PDF">PDF</span>;
const IcoXML  = () => <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:21,height:21,borderRadius:3,background:'#6c757d',color:'#fff',fontSize:9, fontWeight:'bold',cursor:'pointer'}} title="XML">XML</span>;

const MED_OPTS = ['Und.','Kg','Lt','Cj','Pq','Doc','Par'];

const hoy = new Date().toISOString().split('T')[0];
const filaVacia = () => ({
  id: Date.now() + Math.random(),
  codigo:'', articulo:'', cant:'', med:'Und.', pcosto:'', ptotal:'',
});

export default function ComprasGeneral() {
  const [vista,    setVista]    = useState('lista');
  const [compras,  setCompras]  = useState(COMPRAS_DEMO);
  const [gastos,   setGastos]   = useState(GASTOS_DEMO);
  const [alerta,   setAlerta]   = useState('');
  const [modal,    setModal]    = useState(null);

  /* ── filtros ── */
  const [fDocmto,  setFDocmto]  = useState('');
  const [fSucursal,setFSucursal]= useState('');
  const [fTipo,    setFTipo]    = useState('');
  const [fQ,       setFQ]       = useState('');
  const [fFei,     setFFei]     = useState('');
  const [fFef,     setFFef]     = useState('');

  /* ── form nueva compra ── */
  const formIni = () => ({
    documento:'Factura', serie:'F001', nrodoc:'', fecha:hoy,
    proveedor:'', ruc:'', dir:'', moneda:'Soles', tvta:'Contado',
    rows:[ filaVacia() ],
  });
  const [form, setForm] = useState(formIni());
  const sf = (k,v) => setForm(p=>({...p,[k]:v}));
  const updRow = (id,k,v) => sf('rows', form.rows.map(r=>r.id===id?{...r,[k]:v}:r));
  const addRow = () => sf('rows', [...form.rows, filaVacia()]);
  const delRow = id => sf('rows', form.rows.filter(r=>r.id!==id));

  // El filtro es reactivo (tiempo real). El botón Buscar es decorativo/compatibilidad.
  const buscar = () => {};
  /* ══ FILTRO REACTIVO ══
     - Filtra en tiempo real al escribir cada letra
     - Si Tipo = Ninguno → busca en TODOS los campos
     - Si Tipo seleccionado → busca solo en ese campo
     - Compatible con mayúsculas/minúsculas y tildes
  */
  const q = fQ.trim().toLowerCase();

  const comprasFilt = compras.filter(c => {
    // 1. Filtro por tipo de documento
    if (fDocmto && c.doc !== fDocmto) return false;

    // 2. Filtro por fecha inicio
    if (fFei && c.fecha < fFei) return false;

    // 3. Filtro por fecha fin
    if (fFef && c.fecha > fFef) return false;

    // 4. Filtro por texto
    if (q) {
      switch (fTipo) {
        case '1': return c.nrodoc.toLowerCase().includes(q);
        case '2': return c.proveedor.toLowerCase().includes(q);
        case '3': return (c.ruc||'').includes(q);
        case '4': return c.usuario.toLowerCase().includes(q);
        case '5': return c.tvta.toLowerCase().includes(q);
        default:
          // Ninguno → busca en todos los campos visibles
          return (
            c.nrodoc.toLowerCase().includes(q)    ||
            c.proveedor.toLowerCase().includes(q)  ||
            (c.ruc||'').includes(q)                ||
            c.usuario.toLowerCase().includes(q)    ||
            c.tvta.toLowerCase().includes(q)       ||
            c.doc.toLowerCase().includes(q)
          );
      }
    }

    return true;
  });

  /* totales compras */
  const totDolCompras = comprasFilt.reduce((s,c) => s + c.dolares, 0);
  const totSolCompras = comprasFilt.reduce((s,c) => s + c.soles,   0);

  /* totales gastos */
  const gastosFilt = gastos.filter(g => {
    if (fFei && g.fecha < fFei) return false;
    if (fFef && g.fecha > fFef) return false;
    if (fQ.trim() && fTipo === '') {
      const q = fQ.trim().toLowerCase();
      // en búsqueda libre, gastos no se filtran por texto (igual al original)
    }
    return true;
  });
  const totDolGastos = gastosFilt.reduce((s,g) => s + g.dolares, 0);
  const totSolGastos = gastosFilt.reduce((s,g) => s + g.soles,   0);

  /* total general */
  const totGenDol = totDolCompras + totDolGastos;
  const totGenSol = totSolCompras + totSolGastos;

  /* guardar compra */
  const guardarCompra = () => {
    if (!form.proveedor) { setAlerta('err:Ingrese el proveedor'); return; }
    const nueva = {
      id: Date.now(),
      doc: form.documento,
      nrodoc: `${form.serie}-${String(compras.length+1).padStart(6,'0')}`,
      fecha: form.fecha,
      proveedor: form.proveedor,
      ruc: form.ruc,
      usuario: 'Iturri, Qu',
      tvta: form.tvta,
      dolares: form.moneda==='Dolares' ? form.rows.reduce((s,r)=>s+parseFloat(r.ptotal||0),0) : 0,
      soles:   form.moneda==='Soles'   ? form.rows.reduce((s,r)=>s+parseFloat(r.ptotal||0),0) : 0,
    };
    setCompras(p=>[nueva,...p]);
    setAlerta('ok:Compra registrada correctamente.');
    setTimeout(()=>setAlerta(''),3500);
    setVista('lista');
    setForm(formIni());
  };

  /* detalle demo para modal */
  const detalleDemo = [
    {codigo:'SSD-001',articulo:'SSD 2TB Kingston Fury Renegade M.2 NVMe',cant:2,med:'Und.',pcosto:580.00,total:1160.00},
    {codigo:'MEM-002',articulo:'Memoria RAM T-Create 16GB DDR4 3200MHz',cant:4,med:'Und.',pcosto:150.00,total:600.00},
    {codigo:'USB-001',articulo:'Memoria USB Kingston DataTraveler Exodia 64GB',cant:10,med:'Und.',pcosto:15.00,total:150.00},
  ];

  const showAlerta = (msg) => { setAlerta(msg); setTimeout(()=>setAlerta(''),3000); };

  /* ══════ EXPORTAR EXCEL ══════ */
  const exportarExcel = () => {
    const wb = XLSX.utils.book_new();

    /* ── Hoja 1: Compras ── */
    const headersComp = ['Documento','Nro Doc','Fecha','Proveedor','RUC','Usuario','T.Venta','Dolares (US$)','Soles (S/)'];
    const rowsComp = comprasFilt.map(c => ([
      c.doc, c.nrodoc, fmtFecha(c.fecha), c.proveedor, c.ruc,
      c.usuario, c.tvta,
      c.dolares > 0 ? c.dolares : 0,
      c.soles   > 0 ? c.soles   : 0,
    ]));
    rowsComp.push(['','','','','','','TOTAL COMPRAS', totDolCompras, totSolCompras]);

    const wsComp = XLSX.utils.aoa_to_sheet([headersComp, ...rowsComp]);
    // Ancho de columnas
    wsComp['!cols'] = [
      {wch:10},{wch:16},{wch:12},{wch:32},{wch:14},
      {wch:14},{wch:10},{wch:14},{wch:14},
    ];
    // Estilo cabecera (color fondo) — básico compatible
    wsComp['A1'] = {...(wsComp['A1']||{}), s:{fill:{fgColor:{rgb:'C2D1D0'}},font:{bold:true}}};
    XLSX.utils.book_append_sheet(wb, wsComp, 'Compras');

    /* ── Hoja 2: Gastos ── */
    const headersGas = ['Fecha','Destinado','Usuario','Motivo','Dolares (US$)','Soles (S/)'];
    const rowsGas = gastosFilt.map(g => ([
      fmtFecha(g.fecha), g.destinado, g.usuario, g.motivo,
      g.dolares > 0 ? g.dolares : 0,
      g.soles   > 0 ? g.soles   : 0,
    ]));
    rowsGas.push(['','','','TOTAL GASTOS', totDolGastos, totSolGastos]);
    rowsGas.push(['','','','TOTAL GENERAL', totGenDol, totGenSol]);

    const wsGas = XLSX.utils.aoa_to_sheet([headersGas, ...rowsGas]);
    wsGas['!cols'] = [{wch:12},{wch:14},{wch:14},{wch:30},{wch:14},{wch:14}];
    XLSX.utils.book_append_sheet(wb, wsGas, 'Gastos');

    /* ── Hoja 3: Resumen ── */
    const fechaHoy = fmtFecha(hoy);
    const wsRes = XLSX.utils.aoa_to_sheet([
      ['REPORTE DE COMPRAS — RESUMEN'],
      ['Generado el:', fechaHoy],
      [''],
      ['CONCEPTO','DOLARES (US$)','SOLES (S/)'],
      ['Total Compras', totDolCompras, totSolCompras],
      ['Total Gastos',  totDolGastos,  totSolGastos],
      ['TOTAL GENERAL', totGenDol,     totGenSol],
    ]);
    wsRes['!cols'] = [{wch:22},{wch:16},{wch:16}];
    wsRes['!merges'] = [{s:{r:0,c:0},e:{r:0,c:2}}];
    XLSX.utils.book_append_sheet(wb, wsRes, 'Resumen');

    XLSX.writeFile(wb, `Reporte_Compras_${hoy}.xlsx`);
    showAlerta('ok:Archivo Excel generado correctamente.');
  };

  /* ══════ EXPORTAR WORD (HTML → .doc) ══════ */
  const exportarWord = () => {
    const fechaHoy = fmtFecha(hoy);
    const filasComp = comprasFilt.map((c,i) => `
      <tr style="background:${i%2===0?'#f2f2f2':'#fff'}">
        <td>${c.doc}</td>
        <td style="font-family:monospace">${c.nrodoc}</td>
        <td align="center">${fmtFecha(c.fecha)}</td>
        <td>${c.proveedor}</td>
        <td style="font-family:monospace">${c.ruc}</td>
        <td>${c.usuario}</td>
        <td align="center">${c.tvta}</td>
        <td align="right">${c.dolares>0?'US$ '+fmtMonto(c.dolares):'—'}</td>
        <td align="right">${c.soles>0?'S/ '+fmtMonto(c.soles):'—'}</td>
      </tr>`).join('');

    const filasGas = gastosFilt.map((g,i) => `
      <tr style="background:${i%2===0?'#f2f2f2':'#fff'}">
        <td align="center">${fmtFecha(g.fecha)}</td>
        <td>${g.destinado}</td>
        <td>${g.usuario}</td>
        <td>${g.motivo}</td>
        <td align="right">${g.dolares>0?'US$ '+fmtMonto(g.dolares):'—'}</td>
        <td align="right">${g.soles>0?'S/ '+fmtMonto(g.soles):'—'}</td>
      </tr>`).join('');

    const html = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office'
            xmlns:w='urn:schemas-microsoft-com:office:word'
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; font-size: 11pt; margin: 2cm; }
        h1   { font-size: 14pt; text-align: center; color: #003d6b; margin-bottom: 4px; }
        h2   { font-size: 12pt; margin: 14px 0 6px; color: #333; }
        .sub { font-size: 10pt; text-align: center; color: #666; margin-bottom: 18px; }
        table { width: 100%; border-collapse: collapse; font-size: 10pt; margin-bottom: 16px; }
        th   { background: #C2D1D0; padding: 6px 8px; text-align: left; font-weight: bold; border: 1px solid #aaa; }
        td   { padding: 5px 8px; border: 1px solid #ddd; }
        .tot { background: #dce9e8; font-weight: bold; }
        .totgen { background: #c8dfe0; font-weight: bold; font-size: 11pt; }
        .footer { margin-top: 30px; font-size: 9pt; color: #888; text-align: center; }
      </style>
      </head><body>
        <h1>REPORTE GENERAL DE COMPRAS</h1>
        <p class="sub">Generado el ${fechaHoy} &nbsp;|&nbsp; Usuario: Iturri, Qu(Tiend) &nbsp;|&nbsp; Sistema: INTELIGENTE</p>

        <h2>LISTADO DE COMPRAS</h2>
        <table>
          <thead><tr>
            <th>Documento</th><th>Nro Doc</th><th>Fecha</th><th>Proveedor</th>
            <th>RUC</th><th>Usuario</th><th>T.Venta</th><th>Dolares</th><th>Soles</th>
          </tr></thead>
          <tbody>${filasComp}</tbody>
          <tfoot><tr class="tot">
            <td colspan="7" align="right">TOTAL COMPRAS</td>
            <td align="right">${totDolCompras>0?'US$ '+fmtMonto(totDolCompras):'US$ 0.00'}</td>
            <td align="right">S/ ${fmtMonto(totSolCompras)}</td>
          </tr></tfoot>
        </table>

        <h2>GASTOS</h2>
        <table>
          <thead><tr>
            <th>Fecha</th><th>Destinado</th><th>Usuario</th>
            <th>Motivo</th><th>Dolares</th><th>Soles</th>
          </tr></thead>
          <tbody>${filasGas}</tbody>
          <tfoot>
            <tr class="tot">
              <td colspan="4" align="right">TOTAL GASTOS</td>
              <td align="right">${totDolGastos>0?fmtMonto(totDolGastos):'0.00'}</td>
              <td align="right">${fmtMonto(totSolGastos)}</td>
            </tr>
            <tr class="totgen">
              <td colspan="4" align="right">TOTAL GENERAL</td>
              <td align="right">${totGenDol>0?fmtMonto(totGenDol):'0.00'}</td>
              <td align="right">${fmtMonto(totGenSol)}</td>
            </tr>
          </tfoot>
        </table>

        <p class="footer">© 2009 - 2026 INTELIGENTE — Todos los derechos reservados</p>
      </body></html>`;

    const blob = new Blob(['\ufeff', html], { type: 'application/msword;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `Reporte_Compras_${hoy}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    showAlerta('ok:Archivo Word generado correctamente.');
  };

  /* ══════ IMPRIMIR ══════ */
  const imprimir = () => {
    const fechaHoy = fmtFecha(hoy);
    const filasComp = comprasFilt.map((c,i) => `
      <tr style="background:${i%2===0?'#f5f5f5':'#fff'}">
        <td>${c.doc}</td><td>${c.nrodoc}</td><td>${fmtFecha(c.fecha)}</td>
        <td>${c.proveedor}</td><td>${c.ruc}</td><td>${c.usuario}</td><td>${c.tvta}</td>
        <td align="right">${c.dolares>0?'US$ '+fmtMonto(c.dolares):'—'}</td>
        <td align="right">${c.soles>0?'S/ '+fmtMonto(c.soles):'—'}</td>
      </tr>`).join('');

    const filasGas = gastosFilt.map((g,i) => `
      <tr style="background:${i%2===0?'#f5f5f5':'#fff'}">
        <td>${fmtFecha(g.fecha)}</td><td>${g.destinado}</td><td>${g.usuario}</td>
        <td>${g.motivo}</td>
        <td align="right">${g.dolares>0?'US$ '+fmtMonto(g.dolares):'—'}</td>
        <td align="right">${g.soles>0?'S/ '+fmtMonto(g.soles):'—'}</td>
      </tr>`).join('');

    const w = window.open('', '_blank', 'width=900,height=700');
    w.document.write(`<!DOCTYPE html><html><head>
      <meta charset="UTF-8">
      <title>Reporte de Compras</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 10pt; margin: 1.5cm; color: #111; }
        h1   { font-size: 14pt; text-align:center; color:#003d6b; margin:0 0 4px; }
        .sub { text-align:center; font-size:9pt; color:#666; margin-bottom:16px; }
        h2   { font-size: 11pt; margin: 14px 0 5px; color:#333; border-bottom:1px solid #ccc; padding-bottom:3px; }
        table{ width:100%; border-collapse:collapse; font-size:9pt; margin-bottom:12px; }
        th   { background:#C2D1D0; padding:5px 6px; border:1px solid #aaa; font-weight:bold; text-align:left; }
        td   { padding:4px 6px; border:1px solid #ddd; }
        .tot { background:#dce9e8; font-weight:bold; }
        .totgen { background:#b8d4d5; font-weight:bold; font-size:10pt; }
        .footer { margin-top:24px; font-size:8pt; color:#999; text-align:center; border-top:1px solid #eee; padding-top:6px; }
        @media print { body { margin:1cm; } }
      </style>
    </head><body>
      <h1>REPORTE GENERAL DE COMPRAS</h1>
      <p class="sub">Fecha: ${fechaHoy} &nbsp;|&nbsp; Usuario: Iturri, Qu(Tiend) &nbsp;|&nbsp; Sistema: INTELIGENTE</p>

      <h2>LISTADO DE COMPRAS</h2>
      <table>
        <thead><tr>
          <th>Documento</th><th>Nro Doc</th><th>Fecha</th><th>Proveedor</th>
          <th>RUC</th><th>Usuario</th><th>T.Venta</th><th>Dolares</th><th>Soles</th>
        </tr></thead>
        <tbody>${filasComp}</tbody>
        <tfoot><tr class="tot">
          <td colspan="7" align="right"><b>TOTAL COMPRAS</b></td>
          <td align="right"><b>${totDolCompras>0?'US$ '+fmtMonto(totDolCompras):'US$ 0.00'}</b></td>
          <td align="right"><b>S/ ${fmtMonto(totSolCompras)}</b></td>
        </tr></tfoot>
      </table>

      <h2>GASTOS</h2>
      <table>
        <thead><tr>
          <th>Fecha</th><th>Destinado</th><th>Usuario</th>
          <th>Motivo</th><th>Dolares</th><th>Soles</th>
        </tr></thead>
        <tbody>${filasGas}</tbody>
        <tfoot>
          <tr class="tot">
            <td colspan="4" align="right"><b>TOTAL GASTOS</b></td>
            <td align="right"><b>${totDolGastos>0?fmtMonto(totDolGastos):'0.00'}</b></td>
            <td align="right"><b>${fmtMonto(totSolGastos)}</b></td>
          </tr>
          <tr class="totgen">
            <td colspan="4" align="right"><b>TOTAL GENERAL</b></td>
            <td align="right"><b>${totGenDol>0?fmtMonto(totGenDol):'0.00'}</b></td>
            <td align="right"><b>${fmtMonto(totGenSol)}</b></td>
          </tr>
        </tfoot>
      </table>
      <p class="footer">© 2009 - 2026 INTELIGENTE — Todos los derechos reservados</p>
      <script>window.onload=()=>{ window.print(); }<\/script>
    </body></html>`);
    w.document.close();
  };

  /* ══════ RENDER ══════ */
  return (
    <>
      <style>{css}</style>

      {/* alerta */}
      {alerta && (
        <div className={`alerta ${alerta.startsWith('ok:') ? 'alerta-ok' : 'alerta-err'}`}>
          {alerta.startsWith('ok:') ? '✅ ' : '⚠️ '}{alerta.slice(3)}
        </div>
      )}

      {/* ══════ LISTA ══════ */}
      {vista==='lista' && (
        <>
          {/* Título */}
          <div className="cr-titulo">
            <span className="ico-help" title="Manual del usuario">?</span>
            <span className="tit">REPORTE DE COMPRA</span>
          </div>

          {/* Barra de búsqueda */}
          <div className="cr-bar">
            <div className="cr-bar-row">
              <div>
                <div className="lbl-top">BUSCAR X</div>
                <div style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap'}}>
                  {/* Documento */}
                  <select value={fDocmto} onChange={e=>setFDocmto(e.target.value)}
                    style={{height:24,padding:'0 5px',fontSize:12,border:'1px solid #ced4da',borderRadius:3,width:120}}>
                    <option value="">Documento &gt; todos</option>
                    <option value="Boleta">Boleta</option>
                    <option value="Factura">Factura</option>
                    <option value="Guia">Guia</option>
                  </select>
                  {/* Sucursal */}
                  <select value={fSucursal} onChange={e=>setFSucursal(e.target.value)}
                    style={{height:24,padding:'0 5px',fontSize:12,border:'1px solid #ced4da',borderRadius:3,width:130}}>
                    <option value="">Sucursal &gt; todos</option>
                    <option value="3">Almacen 1</option>
                    <option value="2">Tienda2</option>
                    <option value="1">Tienda1</option>
                  </select>
                  {/* Tipo */}
                  <select value={fTipo} onChange={e=>setFTipo(e.target.value)}
                    style={{height:24,padding:'0 5px',fontSize:12,border:'1px solid #ced4da',borderRadius:3,width:130}}>
                    <option value="">Ninguno</option>
                    <option value="1">Nro documento</option>
                    <option value="2">Proveedor</option>
                    <option value="3">RUC</option>
                    <option value="4">Usuario</option>
                    <option value="5">T.Compra</option>
                  </select>
                </div>
                <div style={{marginTop:5,display:'flex',alignItems:'center',gap:6}}>
                  <input type="text" value={fQ} onChange={e=>setFQ(e.target.value)}
                    placeholder="Buscar..." className="campo-busq"
                    onKeyDown={e=>e.key==='Enter'&&buscar()}
                    style={{height:24,padding:'0 8px',border:'1px solid #ced4da',borderRadius:3,fontSize:12,width:360}}/>
                  <strong style={{fontSize:12}}>y/o</strong>
                </div>
              </div>

              {/* Fechas */}
              <div style={{display:'flex',flexDirection:'column',gap:3}}>
                <label style={{fontSize:12}}>Fecha Inicio</label>
                <DP value={fFei} onChange={setFFei} placeholder="dd/mm/aaaa"/>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:3}}>
                <label style={{fontSize:12}}>Fecha Fin</label>
                <DP value={fFef} onChange={setFFef} placeholder="dd/mm/aaaa"/>
              </div>

              <button className="btn-buscar" onClick={buscar}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2"/>
                  <path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2"/>
                </svg>
                Buscar
              </button>
              <button className="btn-nuevo" onClick={()=>{ setForm(formIni()); setVista('form'); }}>
                + Nueva Compra
              </button>
            </div>
          </div>

          {/* ── TABLA COMPRAS ── */}
          <div className="tbl-titulo">LISTADO GENERAL DE COMPRAS</div>
          <table className="tcomp">
            <thead>
              <tr>
                <th>Documento</th>
                <th>Nro Doc</th>
                <th>Fecha</th>
                <th>Proveedor</th>
                <th>RUC</th>
                <th>Usuario</th>
                <th>T.Venta</th>
                <th style={{textAlign:'right'}}>Dolares</th>
                <th style={{textAlign:'right'}}>Soles</th>
                <th style={{textAlign:'center'}}>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {comprasFilt.length===0 ? (
                <tr><td colSpan={10} style={{textAlign:'center',padding:20,color:'#888'}}>Sin registros</td></tr>
              ) : comprasFilt.map(c=>(
                <tr key={c.id}>
                  <td>{c.doc}</td>
                  <td style={{fontFamily:'monospace',fontSize:12}}>{c.nrodoc}</td>
                  <td align="center">{fmtFecha(c.fecha)}</td>
                  <td>{c.proveedor}</td>
                  <td style={{fontFamily:'monospace',fontSize:12}}>{c.ruc}</td>
                  <td>{c.usuario}</td>
                  <td align="center">
                    <span className={c.tvta==='Contado'?'badge-cont':'badge-cred'}>{c.tvta}</span>
                  </td>
                  <td style={{textAlign:'right',fontFamily:'monospace'}}>
                    {c.dolares>0 ? <span style={{color:'#155724',fontWeight:'bold'}}>US$ {fmtMonto(c.dolares)}</span> : <span style={{color:'#aaa'}}>—</span>}
                  </td>
                  <td style={{textAlign:'right',fontFamily:'monospace'}}>
                    {c.soles>0 ? <span style={{color:'#004085',fontWeight:'bold'}}>S/ {fmtMonto(c.soles)}</span> : <span style={{color:'#aaa'}}>—</span>}
                  </td>
                  <td>
                    <div className="ops" style={{justifyContent:'center'}}>
                      <button className="ic" onClick={()=>setModal({tipo:'ver',compra:c})}><IcoEdit/></button>
                      <button className="ic" onClick={()=>setModal({tipo:'pdf',compra:c})}><IcoPDF/></button>
                      <button className="ic" onClick={()=>setModal({tipo:'xml',compra:c})}><IcoXML/></button>
                      <button className="ic" onClick={()=>{
                        if(window.confirm(`¿Anular ${c.nrodoc}?`)){
                          setCompras(p=>p.filter(x=>x.id!==c.id));
                          showAlerta('ok:Compra anulada.');
                        }
                      }}><IcoAnu/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{background:'#f0f0f0'}}>
                <td colSpan={7} style={{textAlign:'right',paddingRight:12,fontWeight:'bold'}}>TOTAL COMPRAS</td>
                <td style={{textAlign:'right',fontFamily:'monospace',fontWeight:'bold'}}>
                  {totDolCompras>0 ? `US$ ${fmtMonto(totDolCompras)}` : 'US$ 0.00'}
                </td>
                <td style={{textAlign:'right',fontFamily:'monospace',fontWeight:'bold'}}>
                  S/ {fmtMonto(totSolCompras)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>

          {/* ── TABLA GASTOS ── */}
          <div style={{marginTop:10}}>
            <div className="tbl-titulo">GASTOS</div>
            <table className="tgasto">
              <thead>
                <tr>
                  <th width="10%">Fecha</th>
                  <th width="16%">Destinado</th>
                  <th width="16%">Usuario</th>
                  <th>Motivo</th>
                  <th width="13%" style={{textAlign:'right'}}>Dolares</th>
                  <th width="13%" style={{textAlign:'right'}}>Soles</th>
                </tr>
              </thead>
              <tbody>
                {gastosFilt.length===0 ? (
                  <tr><td colSpan={6} style={{textAlign:'center',padding:14,color:'#888'}}>Sin gastos</td></tr>
                ) : gastosFilt.map((g,i)=>(
                  <tr key={g.id}>
                    <td align="center">{fmtFecha(g.fecha)}</td>
                    <td>{g.destinado}</td>
                    <td>{g.usuario}</td>
                    <td>{g.motivo}</td>
                    <td style={{textAlign:'right',fontFamily:'monospace'}}>
                      {g.dolares>0 ? `US$ ${fmtMonto(g.dolares)}` : <span style={{color:'#aaa'}}>—</span>}
                    </td>
                    <td style={{textAlign:'right',fontFamily:'monospace'}}>
                      {g.soles>0 ? `S/ ${fmtMonto(g.soles)}` : <span style={{color:'#aaa'}}>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="fila-total">
                  <td colSpan={3} style={{textAlign:'center'}}>Total</td>
                  <td></td>
                  <td style={{textAlign:'right',fontFamily:'monospace'}}>
                    {totDolGastos>0 ? fmtMonto(totDolGastos) : '0.00'}
                  </td>
                  <td style={{textAlign:'right',fontFamily:'monospace'}}>{fmtMonto(totSolGastos)}</td>
                </tr>
                <tr className="fila-totgen">
                  <td colSpan={2} style={{fontWeight:'bold',fontSize:13,letterSpacing:'.3px'}}>TOTAL GENERAL</td>
                  <td colSpan={2}></td>
                  <td style={{textAlign:'right',fontFamily:'monospace',fontWeight:'bold',fontSize:13}}>
                    {totGenDol > 0 ? fmtMonto(totGenDol) : '0.00'}
                  </td>
                  <td style={{textAlign:'right',fontFamily:'monospace',fontWeight:'bold',fontSize:13}}>
                    {fmtMonto(totGenSol)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* ── barra exportar ── */}
          <div className="export-bar">
            <span style={{fontSize:12,color:'#666',marginRight:4}}>Exportar:</span>

            {/* IMPRIMIR */}
            <button className="btn-exp" title="Imprimir reporte" onClick={imprimir}
              style={{display:'inline-flex',alignItems:'center',justifyContent:'center',
                width:32,height:32,borderRadius:4,background:'#f0f0f0',border:'1px solid #ccc',
                cursor:'pointer',fontSize:17,transition:'all .15s'}}
              onMouseEnter={e=>e.currentTarget.style.background='#e0e0e0'}
              onMouseLeave={e=>e.currentTarget.style.background='#f0f0f0'}>
              🖨
            </button>

            {/* EXCEL */}
            <button className="btn-exp" title="Descargar Excel (.xlsx)" onClick={exportarExcel}
              style={{display:'inline-flex',alignItems:'center',justifyContent:'center',
                width:36,height:32,borderRadius:4,background:'#1D6F42',border:'none',
                cursor:'pointer',padding:'3px 6px',transition:'all .15s'}}
              onMouseEnter={e=>e.currentTarget.style.background='#155a34'}
              onMouseLeave={e=>e.currentTarget.style.background='#1D6F42'}>
              <svg width="30" height="22" viewBox="0 0 48 28" fill="none">
                <rect width="48" height="28" rx="4" fill="#1D6F42"/>
                <text x="4" y="21" fontFamily="Arial" fontSize="17" fontWeight="bold" fill="#fff">XLS</text>
              </svg>
            </button>

            {/* WORD */}
            <button className="btn-exp" title="Descargar Word (.doc)" onClick={exportarWord}
              style={{display:'inline-flex',alignItems:'center',justifyContent:'center',
                width:36,height:32,borderRadius:4,background:'#2B579A',border:'none',
                cursor:'pointer',padding:'3px 6px',transition:'all .15s'}}
              onMouseEnter={e=>e.currentTarget.style.background='#1e3f70'}
              onMouseLeave={e=>e.currentTarget.style.background='#2B579A'}>
              <svg width="30" height="22" viewBox="0 0 48 28" fill="none">
                <rect width="48" height="28" rx="4" fill="#2B579A"/>
                <text x="2" y="21" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="#fff">DOC</text>
              </svg>
            </button>
          </div>
        </>
      )}

      {/* ══════ NUEVA COMPRA ══════ */}
      {vista==='form' && (
        <>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
            <span className="ico-help" style={{background:'#0099ff',color:'#fff',borderRadius:'50%',width:22,height:22,display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:'bold'}}>?</span>
            <span style={{fontSize:15,fontWeight:'bold'}}>COMPRA : NUEVA</span>
          </div>

          <div className="nc-wrap">
            {/* FILA 1: Docmto | Fecha | Nro Doc | Moneda | T.Venta */}
            <div className="nc-row">
              {/* Documento - Serie */}
              <div className="nc-cell" style={{minWidth:170}}>
                <label>Docmto-Serie : <span className="req">(*)</span></label>
                <div style={{display:'flex',alignItems:'center',gap:4}}>
                  <select value={form.documento} onChange={e=>sf('documento',e.target.value)}
                    style={{width:110,height:27,padding:'0 5px',border:'1px solid #ced4da',borderRadius:3,fontSize:12,background:'#fff'}}>
                    <option>Factura</option><option>Boleta</option><option>Guia</option><option>Liquidacion</option>
                  </select>
                  <span style={{fontSize:13,fontWeight:'bold',color:'#555'}}>-</span>
                  <input type="text" value={form.serie} onChange={e=>sf('serie',e.target.value)}
                    style={{width:60}} placeholder="F001"/>
                </div>
              </div>
              <div className="nc-div"/>
              {/* Fecha */}
              <div className="nc-cell">
                <label>Fecha : <span className="req">(*)</span></label>
                <DP value={form.fecha} onChange={v=>sf('fecha',v)}/>
              </div>
              <div className="nc-div"/>
              {/* Nro Doc */}
              <div className="nc-cell" style={{minWidth:90}}>
                <label>Nro Documento</label>
                <input type="text" value={form.nrodoc} onChange={e=>sf('nrodoc',e.target.value)}
                  placeholder="000001" style={{width:90}}/>
              </div>
              <div className="nc-div"/>
              {/* Moneda */}
              <div className="nc-cell" style={{minWidth:90}}>
                <label>Moneda : <span className="req">(*)</span></label>
                <select value={form.moneda} onChange={e=>sf('moneda',e.target.value)}
                  style={{width:90,height:27,padding:'0 5px',border:'1px solid #ced4da',borderRadius:3,fontSize:12,background:'#fff'}}>
                  <option>Soles</option><option>Dolares</option>
                </select>
              </div>
              <div className="nc-div"/>
              {/* Tipo Compra */}
              <div className="nc-cell" style={{minWidth:100}}>
                <label>Tipo Compra : <span className="req">(*)</span></label>
                <select value={form.tvta} onChange={e=>sf('tvta',e.target.value)}
                  style={{width:100,height:27,padding:'0 5px',border:'1px solid #ced4da',borderRadius:3,fontSize:12,background:'#fff'}}>
                  <option>Contado</option><option>Credito</option>
                </select>
              </div>
            </div>

            {/* FILA 2: Proveedor */}
            <div className="nc-row" style={{marginTop:4}}>
              <div className="nc-cell" style={{minWidth:100}}>
                <label>RUC Proveedor</label>
                <div style={{display:'flex',alignItems:'center',gap:4}}>
                  <input type="text" value={form.ruc} onChange={e=>sf('ruc',e.target.value)}
                    placeholder="RUC/DNI" style={{width:120}}/>
                  <button style={{background:'#17a2b8',border:'none',borderRadius:3,color:'#fff',padding:'3px 8px',cursor:'pointer',fontSize:12,height:27}}>🔍</button>
                </div>
              </div>
              <div className="nc-div"/>
              <div className="nc-cell" style={{flex:1,minWidth:200}}>
                <label>Proveedor (Razón Social) : <span className="req">(*)</span></label>
                <input type="text" className="inp-verde" value={form.proveedor}
                  onChange={e=>sf('proveedor',e.target.value)}
                  placeholder="Razón social del proveedor" style={{width:'100%',minWidth:260}}/>
              </div>
              <div className="nc-div"/>
              <div className="nc-cell" style={{flex:1,minWidth:140}}>
                <label>Dirección</label>
                <input type="text" value={form.dir} onChange={e=>sf('dir',e.target.value)}
                  style={{width:'100%',minWidth:180}}/>
              </div>
            </div>
          </div>

          <hr style={{border:'none',borderTop:'1px solid #dee2e6',margin:'10px 0'}}/>

          {/* tabla artículos */}
          <div style={{background:'#d9d9d9',padding:'7px 12px',display:'flex',alignItems:'center',gap:8,marginBottom:0}}>
            <strong style={{fontSize:12}}>DETALLE DE ARTÍCULOS</strong>
          </div>
          <table className="tart">
            <thead>
              <tr>
                <th width="8%">CÓDIGO</th>
                <th width="34%">ARTÍCULO / DESCRIPCIÓN</th>
                <th width="7%">CANT.</th>
                <th width="7%">MED.</th>
                <th width="11%">P.COSTO</th>
                <th width="11%">TOTAL</th>
                <th width="5%"></th>
              </tr>
            </thead>
            <tbody>
              {form.rows.map(row=>(
                <tr key={row.id}>
                  <td><input type="text" value={row.codigo} onChange={e=>updRow(row.id,'codigo',e.target.value)} placeholder="Cod."/></td>
                  <td><textarea value={row.articulo} onChange={e=>updRow(row.id,'articulo',e.target.value)} placeholder="Descripción del artículo"/></td>
                  <td><input type="number" value={row.cant} onChange={e=>{
                    const c=e.target.value;
                    const t=(parseFloat(c)||0)*(parseFloat(row.pcosto)||0);
                    updRow(row.id,'cant',c);
                    updRow(row.id,'ptotal',t.toFixed(2));
                  }} min="0"/></td>
                  <td>
                    <select value={row.med} onChange={e=>updRow(row.id,'med',e.target.value)}>
                      {MED_OPTS.map(m=><option key={m}>{m}</option>)}
                    </select>
                  </td>
                  <td><input type="number" value={row.pcosto} onChange={e=>{
                    const p=e.target.value;
                    const t=(parseFloat(p)||0)*(parseFloat(row.cant)||0);
                    updRow(row.id,'pcosto',p);
                    updRow(row.id,'ptotal',t.toFixed(2));
                  }} step="0.01" min="0" style={{color:'#1a6aad',fontWeight:'bold'}}/></td>
                  <td><input type="text" value={row.ptotal} readOnly style={{background:'#f0f8ff',fontWeight:'bold',color:'#003d6b'}}/></td>
                  <td align="center">
                    {form.rows.length>1 && (
                      <button onClick={()=>delRow(row.id)}
                        style={{background:'#dc3545',border:'none',color:'#fff',borderRadius:3,padding:'2px 7px',cursor:'pointer',fontSize:12}}>✕</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* subtotales */}
          <div style={{display:'flex',justifyContent:'flex-end',marginTop:6,gap:20,fontSize:13,padding:'6px 8px',background:'#f8f9fa',borderRadius:4}}>
            <span>Sub Total: <strong>
              {form.moneda==='Soles'?'S/':'US$'} {form.rows.reduce((s,r)=>s+parseFloat(r.ptotal||0),0).toFixed(2)}
            </strong></span>
            <span>IGV (18%): <strong>
              {form.moneda==='Soles'?'S/':'US$'} {(form.rows.reduce((s,r)=>s+parseFloat(r.ptotal||0),0)*0.18).toFixed(2)}
            </strong></span>
            <span style={{color:'#003d6b',fontSize:14}}>TOTAL: <strong>
              {form.moneda==='Soles'?'S/':'US$'} {(form.rows.reduce((s,r)=>s+parseFloat(r.ptotal||0),0)*1.18).toFixed(2)}
            </strong></span>
          </div>

          <div style={{marginTop:6}}>
            <button style={{background:'#17a2b8',border:'none',color:'#fff',borderRadius:3,padding:'4px 12px',cursor:'pointer',fontSize:12,fontWeight:'bold',display:'inline-flex',alignItems:'center',gap:5}} onClick={addRow}>
              + Agregar fila
            </button>
          </div>

          <div className="form-footer">
            <button className="btn-gd" onClick={guardarCompra}>💾 Guardar</button>
            <button className="btn-reg" onClick={()=>setVista('lista')}>⬅ Regresar</button>
          </div>
        </>
      )}

      {/* ══════ MODALES ══════ */}
      {modal && (()=>{
        const c = modal.compra;
        const cerrar = () => setModal(null);
        const BtnCerrar = ({color='#6c757d'}) => (
          <button className="mopc-btn" style={{background:color}} onClick={cerrar}>✕ Cerrar</button>
        );

        /* VER / EDITAR */
        if(modal.tipo==='ver') return (
          <div className="mopc-overlay" onClick={cerrar}>
            <div className="mopc-box" onClick={e=>e.stopPropagation()} style={{maxWidth:700}}>
              <div className="mopc-head" style={{background:'#e67e22'}}>
                ✏ Detalle de Compra — {c.nrodoc}
              </div>
              <div className="mopc-body">
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
                  <div className="mopc-row"><span className="mopc-label">Documento:</span><span className="mopc-val">{c.doc}</span></div>
                  <div className="mopc-row"><span className="mopc-label">Nro Doc:</span><span className="mopc-val" style={{fontFamily:'monospace'}}>{c.nrodoc}</span></div>
                  <div className="mopc-row"><span className="mopc-label">Fecha:</span><span className="mopc-val">{fmtFecha(c.fecha)}</span></div>
                  <div className="mopc-row"><span className="mopc-label">T.Compra:</span><span className={c.tvta==='Contado'?'badge-cont':'badge-cred'}>{c.tvta}</span></div>
                  <div className="mopc-row"><span className="mopc-label">Proveedor:</span><span className="mopc-val">{c.proveedor}</span></div>
                  <div className="mopc-row"><span className="mopc-label">RUC:</span><span className="mopc-val" style={{fontFamily:'monospace'}}>{c.ruc}</span></div>
                  <div className="mopc-row"><span className="mopc-label">Usuario:</span><span className="mopc-val">{c.usuario}</span></div>
                  <div className="mopc-row"><span className="mopc-label">Total:</span>
                    <span className="mopc-val" style={{fontWeight:'bold',color:'#003d6b'}}>
                      {c.soles>0 ? `S/ ${fmtMonto(c.soles)}` : `US$ ${fmtMonto(c.dolares)}`}
                    </span>
                  </div>
                </div>

                <strong style={{fontSize:13,color:'#333'}}>Detalle de artículos:</strong>
                <table className="tdet">
                  <thead>
                    <tr>
                      <th>CÓDIGO</th><th>ARTÍCULO</th><th>CANT.</th><th>MED.</th><th>P.COSTO</th><th>TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalleDemo.map((d,i)=>(
                      <tr key={i}>
                        <td style={{fontFamily:'monospace',fontSize:11}}>{d.codigo}</td>
                        <td>{d.articulo}</td>
                        <td align="center">{d.cant}</td>
                        <td align="center">{d.med}</td>
                        <td align="right" style={{fontFamily:'monospace'}}>S/ {fmtMonto(d.pcosto)}</td>
                        <td align="right" style={{fontFamily:'monospace',fontWeight:'bold'}}>S/ {fmtMonto(d.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{textAlign:'right',marginTop:10,fontSize:13}}>
                  <span>Sub Total: <strong>S/ {fmtMonto(detalleDemo.reduce((s,d)=>s+d.total,0))}</strong></span>
                  <span style={{marginLeft:18}}>IGV: <strong>S/ {fmtMonto(detalleDemo.reduce((s,d)=>s+d.total,0)*0.18)}</strong></span>
                  <span style={{marginLeft:18,color:'#003d6b',fontSize:14}}>TOTAL: <strong>S/ {fmtMonto(detalleDemo.reduce((s,d)=>s+d.total,0)*1.18)}</strong></span>
                </div>
              </div>
              <div className="mopc-footer">
                <button className="mopc-btn" style={{background:'#28a745'}} onClick={()=>{ showAlerta('ok:Cambios guardados.'); cerrar(); }}>💾 Guardar</button>
                <button className="mopc-btn" style={{background:'#dc3545'}} onClick={()=>{ if(window.confirm(`¿Anular ${c.nrodoc}?`)){ setCompras(p=>p.filter(x=>x.id!==c.id)); showAlerta('ok:Compra anulada.'); cerrar(); } }}>🗑 Anular</button>
                <BtnCerrar/>
              </div>
            </div>
          </div>
        );

        /* PDF */
        if(modal.tipo==='pdf') return (
          <div className="mopc-overlay" onClick={cerrar}>
            <div className="mopc-box" onClick={e=>e.stopPropagation()} style={{maxWidth:400}}>
              <div className="mopc-head" style={{background:'#dc3545'}}>📄 Imprimir — {c.nrodoc}</div>
              <div className="mopc-body" style={{fontFamily:'monospace',fontSize:12,lineHeight:1.9}}>
                <div style={{textAlign:'center',borderBottom:'1px dashed #bbb',paddingBottom:8,marginBottom:8}}>
                  <div style={{fontWeight:'bold',fontSize:14}}>EMPRESA S.A.C.</div>
                  <div style={{fontSize:11,color:'#666'}}>RUC: 20123456789 — Lima, Perú</div>
                </div>
                <div style={{marginBottom:8}}>
                  <div><b>Comprobante:</b> {c.doc} {c.nrodoc}</div>
                  <div><b>Fecha:</b> {fmtFecha(c.fecha)}</div>
                  <div><b>Proveedor:</b> {c.proveedor}</div>
                  <div><b>RUC:</b> {c.ruc}</div>
                </div>
                <div style={{borderTop:'1px dashed #bbb',paddingTop:8,textAlign:'right'}}>
                  <div>Total: <b>{c.soles>0?`S/ ${fmtMonto(c.soles)}`:`US$ ${fmtMonto(c.dolares)}`}</b></div>
                </div>
              </div>
              <div className="mopc-footer">
                <button className="mopc-btn" style={{background:'#dc3545'}} onClick={()=>window.print()}>🖨 Imprimir</button>
                <BtnCerrar/>
              </div>
            </div>
          </div>
        );

        /* XML */
        if(modal.tipo==='xml') {
          const xml=`<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">
  <ID>${c.nrodoc}</ID>
  <IssueDate>${c.fecha}</IssueDate>
  <DocumentCurrencyCode>${c.soles>0?'PEN':'USD'}</DocumentCurrencyCode>
  <AccountingSupplierParty>
    <Party><PartyName><Name>${c.proveedor}</Name></PartyName>
    <PartyTaxScheme><CompanyID>${c.ruc}</CompanyID></PartyTaxScheme>
    </Party>
  </AccountingSupplierParty>
  <LegalMonetaryTotal>
    <PayableAmount currencyID="${c.soles>0?'PEN':'USD'}">${c.soles>0?fmtMonto(c.soles):fmtMonto(c.dolares)}</PayableAmount>
  </LegalMonetaryTotal>
</Invoice>`;
          return (
            <div className="mopc-overlay" onClick={cerrar}>
              <div className="mopc-box" onClick={e=>e.stopPropagation()} style={{maxWidth:640}}>
                <div className="mopc-head" style={{background:'#6c757d'}}>📦 XML — {c.nrodoc}</div>
                <div className="mopc-body">
                  <pre style={{background:'#1e1e1e',color:'#9cdcfe',fontFamily:'monospace',
                    fontSize:12,padding:12,borderRadius:6,overflowX:'auto',lineHeight:1.6}}>{xml}</pre>
                </div>
                <div className="mopc-footer">
                  <button className="mopc-btn" style={{background:'#6c757d'}} onClick={()=>{
                    const b=new Blob([xml],{type:'application/xml'});
                    const a=document.createElement('a'); a.href=URL.createObjectURL(b);
                    a.download=`${c.nrodoc}.xml`; a.click();
                  }}>⬇ Descargar XML</button>
                  <BtnCerrar/>
                </div>
              </div>
            </div>
          );
        }
        return null;
      })()}
    </>
  );
}