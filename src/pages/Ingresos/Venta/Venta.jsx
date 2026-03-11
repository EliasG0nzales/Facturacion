import { useState, useRef } from "react";

/* ─── CONSTANTES ─── */
const DOCUMENTOS   = ['Boleta BI01','Factura FI01','Nota de Venta 001'];
const MONEDAS      = ['Soles','Dolares'];
const CONIGV       = ['Inc.IGV','+ IGV'];
const TIPO_OPER    = ['Venta Interna','Exportación','No Gravada'];
const PRE_ANTICIPO = ['No','Si'];
const VENDEDORES   = ['fac-tura.com','Iturri, Quispe, Smith','Merino, Cahuna, Wilver Enmanuel',
                      'Romero, Merino, Alexander Renson','Yupanqui, Barboza, Raysa'];
const TIPO_VTA     = ['Contado','Credito'];
const PAGO_TIPO    = ['Efectivo','C.Entrega','Yape','Deposito Interbank','Deposito BBVA','Deposito BCP','Mixto'];
const TAIGV_OPTS   = [
  'Gravado - Operación Onerosa','Gravado - Retiro por premio','Gravado - Retiro por donación',
  'Gravado - Retiro','Gravado - Retiro por publicidad','Gravado - Bonificaciones',
  'Gravado - Retiro por entrega a trabajadores','Gravado - IVAP',
  'Exonerado - Operación Onerosa','Exonerado - Transferencia Gratuita',
  'Inafecto - Operación Onerosa','Inafecto - Retiro por Bonificación',
  'Inafecto - Retiro','Inafecto - Retiro por Muestras Médicas',
  'Inafecto - Retiro por Convenio Colectivo','Inafecto - Retiro por premio',
  'Inafecto - Retiro por publicidad','Exportación',
];
const MED_OPTS   = ['Und.','Kg','Lt','Cj','Pq','Doc','Par'];
const SUJETO_OPTS= ['','Detraccion > (001)Azúcar y melaza de caña - 10%',
  'Detraccion > (012)Intermediación laboral - 10%','Detraccion > (014)Carnes y despojos - 4%',
  'Detraccion > (030)Contratos de construcción - 4%',
  'Retencion > (01)Tasa 3% - 3%','Retencion > (02)Tasa 6% - 6%',
  'Percepcion > (01)Percepción Venta Interna - 2%'];
const GUIAS = ['Sin Guia de remision','Guia de Remision Electronica TI01'];

/* ─── ARTÍCULOS ─── */
const ARTICULOS_DB = [
  { id:1,  codigo:'ADPT-001', nombre:'Adaptador USB TP Link AC600 Wi-Fi Bluetooth 4.2', stock:9,  pmc:45.00, precio:50.00,  grupo:'Redes' },
  { id:13, codigo:'CASE-001', nombre:'Case 1st Player DK-D4 Blanco 4 Cooler RGB',       stock:9,  pmc:175.50,precio:205.83, grupo:'Cases' },
  { id:15, codigo:'COMB-001', nombre:'Combo Gamer 4 en 1 Mack HA-875C RGB Halion',      stock:30, pmc:138.60,precio:151.20, grupo:'Perifericos' },
  { id:18, codigo:'EST-001',  nombre:'Estabilizador 1000VA Forza FVR-1012 4 Tomas',     stock:8,  pmc:57.83, precio:63.45,  grupo:'Estabilizadores' },
  { id:20, codigo:'FP-001',   nombre:'Fuente de Poder Gigabyte 550W 80+ Bronce',        stock:19, pmc:268.70,precio:293.13, grupo:'Fuentes de Poder' },
  { id:32, codigo:'KIT-001',  nombre:'Kit Teclado + Mouse Logitech MK120 USB',          stock:17, pmc:54.00, precio:60.75,  grupo:'Perifericos' },
  { id:34, codigo:'MEM-002',  nombre:'Memoria RAM T-Create 16GB Kit DDR4 3200MHz',      stock:12, pmc:186.75,precio:208.40, grupo:'Memorias' },
  { id:36, codigo:'USB-001',  nombre:'Memoria USB Kingston DataTraveler Exodia M 64GB', stock:41, pmc:20.70, precio:23.22,  grupo:'Memorias' },
  { id:40, codigo:'MON-001',  nombre:'Monitor 24" ASUS Proart PA248QV IPS FHD',         stock:1,  pmc:1197.00,precio:1237.50,grupo:'Monitores' },
  { id:54, codigo:'MOU-001',  nombre:'Mouse Gamer + Pad Halion Alaska HA920P',          stock:21, pmc:33.30, precio:40.50,  grupo:'Perifericos' },
  { id:56, codigo:'MOU-003',  nombre:'Mouse Logitech G203 Lightsync RGB 8000 DPI',      stock:19, pmc:130.50,precio:135.00, grupo:'Perifericos' },
  { id:67, codigo:'PAR-001',  nombre:'Parlante 2.0 Gamer USB Halion HA-S261 RGB',       stock:20, pmc:54.00, precio:58.50,  grupo:'Audio' },
  { id:68, codigo:'MB-024',   nombre:'Placa Madre A320M-K ASUS',                        stock:7,  pmc:309.60,precio:337.50, grupo:'Placas Madre' },
  { id:91, codigo:'CPU-003',  nombre:'Procesador AMD Ryzen 5 8500G AM5',                stock:3,  pmc:1027.80,precio:1033.88,grupo:'Procesadores' },
  { id:92, codigo:'CPU-004',  nombre:'Procesador Intel Core i3-12100 LGA1700',          stock:7,  pmc:500.00,precio:520.00, grupo:'Procesadores' },
  { id:150,codigo:'SSD-001',  nombre:'SSD 2TB Kingston Fury Renegade M.2 NVMe',         stock:1,  pmc:700.00,precio:720.00, grupo:'Almacenamiento' },
  { id:161,codigo:'GPU-021',  nombre:'Tarjeta de Video RTX 3050 Gaming X 6GB MSI',     stock:15, pmc:1042.61,precio:1089.99,grupo:'Tarjetas de Video' },
  { id:168,codigo:'TINTA-001',nombre:'Tinta HP',                                        stock:70, pmc:70.00, precio:80.00,  grupo:'Suministros' },
];
const GRUPOS = [...new Set(ARTICULOS_DB.map(a=>a.grupo))].sort();
const buscarArticulos = q => {
  if(!q) return [];
  const s=q.toLowerCase();
  return ARTICULOS_DB.filter(a=>a.nombre.toLowerCase().includes(s)||a.codigo.toLowerCase().includes(s)||a.grupo.toLowerCase().includes(s));
};

/* ─── CLIENTES ─── */
const CLIENTES_DB = [
  { id:1,  nombre:'Aaron Smith Iturri Quispe',        ruc:'75845811',   dir:'Punkari 276 Mangomarca' },
  { id:5,  nombre:'Carlos Enrique, Mifflin Revilla',  ruc:'07628166',   dir:'Calle Domingo Cueto 120' },
  { id:8,  nombre:'Edilma, Cabrera Caruajulca',       ruc:'43773675',   dir:'Cal Quetzal 171 Sta Anita' },
  { id:12, nombre:'Inteligente S.a.c.',               ruc:'20523520025',dir:'Av. La Merced 1089 Int 302' },
  { id:15, nombre:'Josiph Jhonny, Condor Picardo',    ruc:'74917914',   dir:'Av. Paseo De La Republica S/n' },
  { id:19, nombre:'Raysa Yupanqui Barboza',           ruc:'75845911',   dir:'Cesar Vallejo 314' },
  { id:20, nombre:'Roger, Inga Salvador',             ruc:'40414051',   dir:'Jr. Varayoc 328 SJL' },
  { id:22, nombre:'Stephany Johana, Avila Tovar',     ruc:'74994310',   dir:'' },
  { id:23, nombre:'venta falabella',                  ruc:'',           dir:'' },
];

/* ─── VENTAS DEMO ─── */
const VENTAS_INI = [
  { id:50, doc:'BOL', serie:'BI01-000010', fecha:'2024-02-10', hora:'17:00:48', cliente:'Josiph Jhonny, Condor Picardo', vendedor:'Enmanuel',  tvta:'Contado', sunat:'ERROR', estado:'Activo', hasSunat:true },
  { id:71, doc:'BOL', serie:'BI01-000020', fecha:'2024-02-17', hora:'19:06:26', cliente:'Stephany Johana, Avila Tovar',  vendedor:'demo',       tvta:'Contado', sunat:'OK',    estado:'Activo', hasSunat:true },
  { id:98, doc:'BOL', serie:'BI01-000030', fecha:'2026-02-26', hora:'15:38:38', cliente:'Cliente',                       vendedor:'Alexander',  tvta:'Contado', sunat:'OK',    estado:'Activo', hasSunat:true },
  { id:14, doc:'NV',  serie:'001-000010',  fecha:'2024-01-26', hora:'19:27:23', cliente:'Cliente',                       vendedor:'demo',       tvta:'Contado', sunat:'',      estado:'Activo', hasSunat:false },
  { id:24, doc:'NV',  serie:'001-000020',  fecha:'2024-01-30', hora:'15:08:36', cliente:'venta falabella',               vendedor:'demo',       tvta:'Contado', sunat:'',      estado:'Activo', hasSunat:false },
  { id:34, doc:'NV',  serie:'001-000030',  fecha:'2024-02-03', hora:'14:18:39', cliente:'Cliente',                       vendedor:'demo',       tvta:'Contado', sunat:'',      estado:'Activo', hasSunat:false },
  { id:47, doc:'NV',  serie:'001-000040',  fecha:'2024-02-09', hora:'11:36:38', cliente:'venta falabella',               vendedor:'demo',       tvta:'Contado', sunat:'',      estado:'Activo', hasSunat:false },
  { id:64, doc:'NV',  serie:'001-000050',  fecha:'2024-02-08', hora:'19:32:36', cliente:'Cliente',                       vendedor:'demo',       tvta:'Contado', sunat:'',      estado:'Activo', hasSunat:false },
  { id:87, doc:'NV',  serie:'001-000060',  fecha:'2024-04-05', hora:'19:28:16', cliente:'Cliente',                       vendedor:'demo',       tvta:'Contado', sunat:'',      estado:'Activo', hasSunat:false },
];

const hoy = new Date().toISOString().split('T')[0];
const fmtFecha = iso => { if(!iso) return ''; const [y,m,d]=iso.split('-'); return `${d}/${m}/${y}`; };

/* ════════════════════════ CSS ════════════════════════ */
const css = `
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:Tahoma,Arial,sans-serif;font-size:13px;color:#212529;}

/* ── tabla listado ── */
table.tlista{width:100%;border-collapse:collapse;font-size:12px;}
table.tlista thead tr{background:#1a8a8a;}
table.tlista thead th{padding:10px 10px;text-align:left;color:#fff;font-weight:700;font-size:12px;border-right:1px solid #1aa0a0;}
table.tlista tbody tr{border-bottom:1px solid #e0e0e0;}
table.tlista tbody td{padding:8px 10px;vertical-align:middle;color:#212529;}
table.tlista tbody tr:nth-child(odd)  td{background:#fff;}
table.tlista tbody tr:nth-child(even) td{background:#f5f5f5;}

/* ── badges SUNAT ── */
.s-ok  {background:#28a745;color:#fff;padding:2px 8px;border-radius:3px;font-size:11px;font-weight:700;}
.s-err {background:#dc3545;color:#fff;padding:2px 8px;border-radius:3px;font-size:11px;font-weight:700;}
.s-beta{background:#C433FF;color:#fff;padding:2px 8px;border-radius:3px;font-size:11px;font-weight:700;}

/* ── botón "Seleccionar" dropdown ── */
.sel-wrap{position:relative;display:inline-block;}
.sel-btn{background:#32c766;color:#fff;border:none;border-radius:4px;padding:5px 13px;
  cursor:pointer;font-size:12px;font-weight:700;}
.sel-btn:hover,.sel-btn.open{background:#28a547;}
.sel-drop{display:none;position:absolute;right:0;top:110%;background:#f9f9f9;
  border:1px solid #ccc;border-radius:4px;min-width:200px;z-index:999;
  box-shadow:0 8px 16px rgba(0,0,0,.18);}
.sel-wrap:hover .sel-drop,.sel-drop.show{display:block;}
.sel-row{display:flex;align-items:center;gap:10px;padding:9px 14px;border-bottom:1px solid #eee;}
.sel-row:last-child{border-bottom:none;}
.sel-row:hover{background:#f0f0f0;}
.ic-svg{cursor:pointer;display:inline-flex;align-items:center;justify-content:center;}
.ic-svg:hover{opacity:.75;transform:scale(1.15);}

/* ── iconos NV (lápiz + documento) ── */
.nv-ops{display:flex;gap:6px;align-items:center;justify-content:center;}

/* ── filtros ── */
.vta-bar{display:flex;align-items:flex-end;gap:7px;flex-wrap:wrap;margin-bottom:14px;}
.vta-bar select,.vta-bar input[type=text]{
  padding:3px 6px;border:1px solid #aaa;border-radius:3px;font-size:12px;color:#212529;background:#fff;height:24px;}
.btn-buscar{background:#2196f3;border:1px solid #1976d2;color:#fff;padding:3px 13px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:700;height:26px;}
.btn-nuevo {background:#2196f3;border:1px solid #1976d2;color:#fff;padding:3px 13px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:700;height:26px;}
.btn-rapido{background:#f5a623;border:1px solid #e6951a;color:#fff;padding:3px 13px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:700;height:26px;}

/* ── formulario ── */
.form-titulo{font-size:15px;font-weight:700;margin-bottom:12px;padding:5px 0;border-bottom:2px solid #dee2e6;}
.nv-wrap{background:#fff;padding:12px 14px;border:1px solid #dee2e6;border-radius:4px;}
.nv-row{display:flex;flex-wrap:wrap;gap:0;align-items:flex-end;border-bottom:1px solid #eee;padding:7px 0;}
.nv-row:last-child{border-bottom:none;}
.nv-cell{display:flex;flex-direction:column;gap:2px;padding:0 8px 0 0;}
.nv-cell label{font-size:11px;font-weight:700;color:#444;white-space:nowrap;}
.nv-cell input,.nv-cell select{padding:4px 7px;border:1px solid #ced4da;border-radius:3px;font-size:12px;color:#212529;background:#fff;height:26px;}
.nv-div{width:1px;background:#dee2e6;margin:0 5px;align-self:stretch;}
.inp-verde{background:#ccff99!important;border:1px solid #8bc34a!important;font-weight:700!important;}
.cli-section{background:#f8f9fa;border:1px solid #dee2e6;border-radius:4px;padding:9px 12px;margin:10px 0;}
.cli-section-title{font-size:11px;font-weight:700;color:#555;text-transform:uppercase;letter-spacing:.5px;margin-bottom:7px;}
.cli-row{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-end;}
.cli-cell{display:flex;flex-direction:column;gap:2px;}
.cli-cell label{font-size:11px;font-weight:700;color:#444;}
.cli-cell input{padding:4px 7px;border:1px solid #ced4da;border-radius:3px;font-size:12px;color:#212529;background:#fff;height:26px;}
.inp-with-icon{display:flex;align-items:center;gap:4px;}
.btn-lupa{background:none;border:none;cursor:pointer;padding:2px;color:#17a2b8;display:inline-flex;align-items:center;}
.btn-bino{background:none;border:none;cursor:pointer;font-size:17px;color:#17a2b8;padding:2px;}
.req{color:#dc3545;font-size:11px;}
.lnk{color:#0099ff;font-size:11px;text-decoration:none;margin-left:4px;}
hr.sep{border:none;border-top:1px solid #dee2e6;margin:10px 0;}

/* art search */
.art-bar{background:#d9d9d9;padding:7px 12px;display:flex;align-items:center;gap:7px;flex-wrap:wrap;}
.art-bar label{font-size:12px;font-weight:700;color:#333;}
.art-bar select{padding:3px 6px;border:1px solid #ced4da;border-radius:3px;font-size:12px;background:#fff;color:#212529;height:26px;}
.art-bar input{padding:3px 8px;border:1px solid #ced4da;border-radius:3px;font-size:12px;background:#ccff99;color:#212529;font-weight:700;height:26px;}
.btn-art-buscar{background:#17a2b8;border:1px solid #17a2b8;color:#fff;padding:3px 10px;border-radius:3px;cursor:pointer;font-size:12px;font-weight:700;height:26px;}
.btn-art-reset{background:#fff;border:1px solid #ced4da;color:#555;padding:3px 8px;border-radius:3px;cursor:pointer;font-size:14px;height:26px;}
.art-resultados{border:1px solid #dee2e6;border-top:none;max-height:250px;overflow-y:auto;background:#fff;}
table.tart-res{width:100%;border-collapse:collapse;font-size:12px;}
table.tart-res thead tr{background:#17a2b8;position:sticky;top:0;}
table.tart-res thead th{padding:7px 6px;text-align:center;color:#fff;font-weight:700;font-size:11px;}
table.tart-res tbody tr{border-bottom:1px solid #f0f0f0;}
table.tart-res tbody tr:hover{background:#e8f4f8;}
table.tart-res tbody td{padding:5px 6px;vertical-align:middle;color:#212529;font-size:12px;}
.bst-ok{background:#28a745;color:#fff;padding:1px 5px;border-radius:3px;font-size:10px;}
.bst-no{background:#dc3545;color:#fff;padding:1px 5px;border-radius:3px;font-size:10px;}
.btn-add-art{background:#28a745;border:none;color:#fff;border-radius:3px;padding:3px 9px;cursor:pointer;font-size:12px;font-weight:700;}
table.tart{width:100%;border-collapse:collapse;font-size:12px;}
table.tart thead tr{background:#1a8a8a;}
table.tart thead th{padding:8px 6px;text-align:center;color:#fff;font-weight:700;font-size:11px;}
table.tart tbody tr{border-bottom:1px solid #dee2e6;}
table.tart tbody td{padding:5px 4px;vertical-align:middle;}
table.tart input[type=text],table.tart input[type=number],table.tart textarea{
  padding:3px 5px;border:1px solid #ced4da;border-radius:3px;font-size:12px;width:100%;}
table.tart textarea{resize:none;height:46px;}
table.tart select{padding:3px;border:1px solid #ced4da;border-radius:3px;font-size:12px;width:100%;}
.chk-agregar{width:18px;height:18px;accent-color:#17a2b8;cursor:pointer;}
.form-footer{display:flex;justify-content:center;gap:10px;margin-top:14px;padding-bottom:8px;}
.btn-gd{background:#17a2b8;border:1px solid #17a2b8;color:#fff;padding:8px 22px;cursor:pointer;font-size:13px;font-weight:700;border-radius:4px;}
.btn-reg{background:#6c757d;border:1px solid #6c757d;color:#fff;padding:8px 22px;cursor:pointer;font-size:13px;font-weight:700;border-radius:4px;}

/* ventas rápidas */
.vr-input{background:#fff!important;color:#212529!important;border:1px solid #ced4da!important;}
table.vr-table{width:100%;border-spacing:0;font-size:13px;}
.vr-thead-dark{background:#1a8a8a;}
.vr-thead-teal{background:#17a2b8;}

/* modales */
.mopc-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:3000;display:flex;align-items:center;justify-content:center;}
.mopc-box{background:#fff;border-radius:6px;min-width:420px;max-width:640px;width:92%;box-shadow:0 8px 32px rgba(0,0,0,.3);overflow:hidden;}
.mopc-head{padding:12px 18px;display:flex;justify-content:space-between;align-items:center;color:#fff;font-weight:700;font-size:14px;}
.mopc-body{padding:18px;max-height:65vh;overflow-y:auto;}
.mopc-footer{padding:10px 18px;display:flex;gap:8px;justify-content:flex-end;border-top:1px solid #dee2e6;background:#f8f9fa;}
.mopc-btn{padding:6px 18px;border:none;border-radius:4px;cursor:pointer;font-size:13px;font-weight:700;color:#fff;}
.mopc-row{display:flex;gap:10px;margin-bottom:10px;align-items:center;}
.mopc-label{font-weight:700;font-size:13px;min-width:110px;color:#555;}
.mopc-val{font-size:13px;color:#212529;}
.mopc-inp{padding:5px 9px;border:1px solid #ced4da;border-radius:4px;font-size:13px;color:#212529;background:#fff;width:100%;}
.mopc-inp:focus{border-color:#80bdff;outline:none;}
.mopc-table{width:100%;border-collapse:collapse;font-size:13px;margin-top:8px;}
.mopc-table th{background:#1a8a8a;color:#fff;padding:7px 10px;text-align:left;}
.mopc-table td{padding:6px 10px;border-bottom:1px solid #dee2e6;color:#212529;}
.mopc-table tr:nth-child(even) td{background:#f5f5f5;}
.xml-pre{background:#1e1e1e;color:#9cdcfe;font-family:monospace;font-size:11px;padding:12px;border-radius:5px;overflow-x:auto;line-height:1.6;margin-top:8px;}
.alert-box{padding:8px 14px;border-radius:4px;margin-bottom:10px;font-size:13px;}
.alert-ok {background:#d4edda;border:1px solid #c3e6cb;color:#155724;}
.alert-err{background:#f8d7da;border:1px solid #f5c6cb;color:#721c24;}

/* leyenda */
.leyenda-ops{font-size:11px;color:#444;margin:10px 0 6px;display:flex;flex-wrap:wrap;gap:10px;align-items:center;line-height:1.8;}
.leyenda-ops span{display:flex;align-items:center;gap:4px;}
`;

/* ── DatePicker ── */
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
    <div style={{display:'flex',alignItems:'center',gap:5,height:26,border:'1px solid #aaa',
      borderRadius:3,padding:'0 7px',background:'#fff',cursor:'pointer'}}
      onClick={()=>ref.current.showPicker?.()??ref.current.click()}>
      <span style={{fontSize:12,color:value?'#212529':'#aaa',minWidth:76}}>
        {value?value.split('-').reverse().join('/'):''}
      </span>
      <IcoCal/>
      <input ref={ref} type="date" value={value} onChange={e=>onChange(e.target.value)}
        style={{opacity:0,width:1,height:1,position:'absolute',pointerEvents:'none'}}/>
    </div>
  );
};

/* ════════ SVG ICONS ════════ */
/* Fila BOL – dropdown "Seleccionar" */
const SvgPrint   = ({c='#17a2b8'}) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 9V2h12v7" stroke={c} strokeWidth="2" strokeLinecap="round"/><rect x="2" y="9" width="20" height="9" rx="2" stroke={c} strokeWidth="2"/><path d="M6 14h12M6 18h12" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>;
const SvgEdit    = ({c='#17a2b8'}) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke={c} strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>;
const SvgPlus    = ({c='#28a745'}) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={c} strokeWidth="2"/><path d="M12 8v8M8 12h8" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>;
const SvgMinus   = ({c='#dc3545'}) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={c} strokeWidth="2"/><path d="M8 12h8" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>;
const SvgPdfR    = () => <svg width="20" height="22" viewBox="0 0 24 26" fill="none"><rect x="2" y="1" width="16" height="21" rx="2" fill="#fff" stroke="#dc3545" strokeWidth="1.5"/><path d="M6 1v6h6" stroke="#dc3545" strokeWidth="1.5"/><text x="4" y="20" fontSize="6" fill="#dc3545" fontWeight="bold">PDF</text></svg>;
const SvgPdfB    = () => <svg width="20" height="22" viewBox="0 0 24 26" fill="none"><rect x="2" y="1" width="16" height="21" rx="2" fill="#fff" stroke="#1a6aad" strokeWidth="1.5"/><path d="M6 1v6h6" stroke="#1a6aad" strokeWidth="1.5"/><text x="4" y="20" fontSize="6" fill="#1a6aad" fontWeight="bold">PDF</text></svg>;
const SvgPdfP    = () => <svg width="20" height="22" viewBox="0 0 24 26" fill="none"><rect x="2" y="1" width="16" height="21" rx="2" fill="#fff" stroke="#a855f7" strokeWidth="1.5"/><path d="M6 1v6h6" stroke="#a855f7" strokeWidth="1.5"/><text x="4" y="20" fontSize="6" fill="#a855f7" fontWeight="bold">PDF</text></svg>;
const SvgMailK   = ({c='#000'})    => <svg width="20" height="16" viewBox="0 0 24 18" fill="none"><rect x="1" y="1" width="22" height="16" rx="2" stroke={c} strokeWidth="1.8"/><path d="M1 4l11 7 11-7" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>;
const SvgMailO   = ()              => <SvgMailK c="#f97316"/>;
const SvgMailP   = ()              => <SvgMailK c="#a855f7"/>;
const SvgXml     = ()              => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" stroke="#555" strokeWidth="1.8"/><path d="M13 2v7h7" stroke="#555" strokeWidth="1.8"/><path d="M8 13l-2 2 2 2M16 13l2 2-2 2M13 13l-2 6" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const SvgCdr     = ()              => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="18" rx="2" stroke="#795548" strokeWidth="1.8"/><path d="M7 8h10M7 12h10M7 16h6" stroke="#795548" strokeWidth="1.5" strokeLinecap="round"/></svg>;

/* Fila NV – dos iconos pequeños */
const SvgPencilSm = ({c='#6c757d'}) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke={c} strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>;
const SvgDocSm    = ({c='#1a6aad'}) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke={c} strokeWidth="2" strokeLinecap="round"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>;

/* ── Dropdown "Seleccionar" para BOL ── */
function SelDropdown({ v, onAction }) {
  const [open, setOpen] = useState(false);
  const hasSunatOK = v.sunat === 'OK';
  return (
    <div className="sel-wrap" onMouseLeave={()=>setOpen(false)}>
      <button className={`sel-btn${open?' open':''}`} onClick={()=>setOpen(o=>!o)}>
        Seleccionar
      </button>
      {open && (
        <div className="sel-drop show" style={{display:'block'}}>
          {/* Fila 1: imprimir + editar + ND + NC */}
          <div className="sel-row">
            <span className="ic-svg" title="Imprimir Ticket" onClick={()=>{onAction('ticket',v);setOpen(false);}}><SvgPrint/></span>
            <span className="ic-svg" title="Ver/Modificar"   onClick={()=>{onAction('editar',v);setOpen(false);}}><SvgEdit/></span>
            {hasSunatOK && <>
              <span className="ic-svg" title="Nota de Débito"  onClick={()=>{onAction('nd',v);setOpen(false);}}><SvgPlus/></span>
              <span className="ic-svg" title="Nota de Crédito" onClick={()=>{onAction('nc',v);setOpen(false);}}><SvgMinus/></span>
            </>}
          </div>
          {/* Fila 2: 3 PDF */}
          <div className="sel-row">
            <span className="ic-svg" title="PDF Modelo 1" onClick={()=>{onAction('pdf',v);setOpen(false);}}><SvgPdfR/></span>
            <span className="ic-svg" title="PDF Modelo 2" onClick={()=>{onAction('pdf',v);setOpen(false);}}><SvgPdfB/></span>
            <span className="ic-svg" title="PDF Modelo 3" onClick={()=>{onAction('pdf',v);setOpen(false);}}><SvgPdfP/></span>
          </div>
          {/* Fila 3: 3 Mail */}
          <div className="sel-row">
            <span className="ic-svg" title="Email Modelo 1" onClick={()=>{onAction('mail',v);setOpen(false);}}><SvgMailK/></span>
            <span className="ic-svg" title="Email Modelo 2" onClick={()=>{onAction('mail',v);setOpen(false);}}><SvgMailO/></span>
            <span className="ic-svg" title="Email Modelo 3" onClick={()=>{onAction('mail',v);setOpen(false);}}><SvgMailP/></span>
          </div>
          {/* Fila 4: XML + CDR (solo si enviado) */}
          {hasSunatOK && (
            <div className="sel-row">
              <span className="ic-svg" title="Descargar XML" onClick={()=>{onAction('xml',v);setOpen(false);}}><SvgXml/></span>
              <span className="ic-svg" title="Descargar CDR" onClick={()=>{onAction('cdr',v);setOpen(false);}}><SvgCdr/></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Iconos NV: lápiz + documento ── */
function NvOps({ v, onAction }) {
  return (
    <div className="nv-ops">
      <span className="ic-svg" title="Ver + detalle y Modificar" onClick={()=>onAction('editar',v)}><SvgPencilSm c="#6c757d"/></span>
      <span className="ic-svg" title="Imprimir" onClick={()=>onAction('ticket',v)}><SvgDocSm c="#1a6aad"/></span>
    </div>
  );
}

const filaVacia = () => ({
  id:Date.now()+Math.random(), codigo:'',articulo:'',stock:'',
  med:'Und.',pmc:'0.00',pventa:'',cant:'',
  taigv:'Gravado - Operación Onerosa',sel:false
});

/* ════════════════════════════════════════════════════════════ */
export default function Venta() {
  const [vista,  setVista]  = useState('lista');
  const [ventas, setVentas] = useState(VENTAS_INI);
  const [alert,  setAlert]  = useState('');

  /* filtros */
  const [bDocmto,   setBDocmto]   = useState('');
  const [bSucursal, setBSucursal] = useState('');
  const [bTipo,     setBTipo]     = useState('1');
  const [bq,        setBq]        = useState('');
  const [bfi,       setBfi]       = useState('');
  const [bff,       setBff]       = useState('');

  /* form */
  const formIni = () => ({
    documento:'Boleta BI01', fecha:hoy, nroorden:'', moneda:'Soles', conigv:'Inc.IGV',
    tipooper:'Venta Interna', preanticipo:'No', guia:'Sin Guia de remision', nroguia:'',
    vendedor:'Iturri, Quispe, Smith', tipovta:'Contado', pagomod:'Efectivo', sujeto:'',
    pagocon:'', diasdias:'', letra:false,
    cliRuc:'', cliNombre:'Cliente', cliDir:'', cliEmail:'',
    artRows:[filaVacia()], artBusqTipo:'Nombre', artBusqQ:'',
  });
  const [form, setForm] = useState(formIni());
  const sf = (k,v) => setForm(p=>({...p,[k]:v}));
  const [artRes,       setArtRes]       = useState([]);
  const [artBusqActiva,setArtBusqActiva]= useState(false);

  /* ventas rápidas */
  const [rDoc,       setRDoc]       = useState('Boleta BI01');
  const [rTipoVta,   setRTipoVta]   = useState('Contado');
  const [rPago,      setRPago]      = useState('Efectivo');
  const [rCliente,   setRCliente]   = useState('Cliente');
  const [rBusqQ,     setRBusqQ]     = useState('');
  const [rCategoria, setRCategoria] = useState('');
  const [rCarrito,   setRCarrito]   = useState([]);
  const [rResultados,setRResultados]= useState([]);
  const [cantInput,  setCantInput]  = useState({});

  /* modales */
  const [mOpc, setMOpc] = useState(null);
  const [mCli, setMCli] = useState(false);
  const [cliFilt, setCliFilt] = useState('Nombre');
  const [cliQ,    setCliQ]    = useState('');
  const [cliRes,  setCLiRes]  = useState(CLIENTES_DB);
  const [mRCli,   setMRCli]   = useState(null);
  const [rCliBusqQ,setRCliBusqQ]=useState('');
  const cliIni = ()=>({nombre:'',tipodoc:'RUC',nro:'',direccion:'',email:'',responsable:'Iturri, Quispe, Smith',modopago:'Contado',estado:'Pagador'});
  const [cliForm, setCliForm] = useState(cliIni());
  const cf = (k,v) => setCliForm(p=>({...p,[k]:v}));
  const [cliDB, setCLiDB]     = useState(CLIENTES_DB);

  const showAlert = msg => { setAlert(msg); setTimeout(()=>setAlert(''),3500); };

  const buscarCliente = () => {
    const q=cliQ.toLowerCase();
    if(!q){setCLiRes(CLIENTES_DB);return;}
    setCLiRes(CLIENTES_DB.filter(c=>cliFilt==='Nombre'?c.nombre.toLowerCase().includes(q):c.ruc.includes(q)));
  };
  const selCliente = c => { sf('cliNombre',c.nombre); sf('cliRuc',c.ruc); sf('cliDir',c.dir); setMCli(false); };

  const guardarNuevoCli = () => {
    if(!cliForm.nombre){alert('Ingrese nombre');return;}
    const n={id:Date.now(),nombre:cliForm.nombre,ruc:cliForm.nro,dir:cliForm.direccion};
    setCLiDB(p=>[...p,n]); setRCliente(n.nombre); setMRCli(null);
  };
  const cliListaFilt = cliDB.filter(c=>!rCliBusqQ||c.nombre.toLowerCase().includes(rCliBusqQ.toLowerCase())||c.ruc.includes(rCliBusqQ));

  const updRow = (id,k,v)=>sf('artRows',form.artRows.map(r=>r.id===id?{...r,[k]:v}:r));
  const addRow = ()=>sf('artRows',[...form.artRows,filaVacia()]);
  const delRow = id=>sf('artRows',form.artRows.filter(r=>r.id!==id));

  const ejecutarBusqueda=()=>{setArtRes(buscarArticulos(form.artBusqQ));setArtBusqActiva(true);};
  const agregarArt = art => {
    sf('artRows',[...form.artRows.filter(r=>r.articulo!==''),{
      id:Date.now()+Math.random(),codigo:art.codigo,articulo:art.nombre,
      stock:String(art.stock),med:'Und.',pmc:art.pmc.toFixed(2),
      pventa:art.precio.toFixed(2),cant:'1',taigv:'Gravado - Operación Onerosa',sel:true,
    }]);
    setArtRes([]); setArtBusqActiva(false); sf('artBusqQ','');
  };

  const guardar = () => {
    if(!form.cliNombre||form.cliNombre==='Cliente'){showAlert('err:Ingrese el nombre del cliente');return;}
    const nva={
      id:Date.now(), doc:form.documento.includes('Boleta')?'BOL':form.documento.includes('Factura')?'FAC':'NV',
      serie:form.documento.includes('Boleta')?`BI01-${String(ventas.length+1).padStart(6,'0')}`:
            form.documento.includes('Factura')?`FI01-${String(ventas.length+1).padStart(6,'0')}`:
            `001-${String(ventas.length+1).padStart(6,'0')}`,
      fecha:form.fecha, hora:'', cliente:form.cliNombre,
      vendedor:form.vendedor, tvta:form.tipovta,
      sunat:form.documento.includes('Venta')?'':'BETA',
      estado:'Activo',
      hasSunat:!form.documento.includes('Venta'),
    };
    setVentas(p=>[nva,...p]);
    showAlert(`ok:Se generó su ${nva.doc==='BOL'?'Boleta Electrónica':nva.doc==='FAC'?'Factura Electrónica':'Nota de Venta'} con éxito...`);
    setVista('lista'); setForm(formIni());
  };

  const buscarRapido=(tipo,val)=>{
    let res=[];
    if(tipo==='Todos') res=ARTICULOS_DB;
    else if(tipo==='grupo') res=ARTICULOS_DB.filter(a=>a.grupo===val);
    else res=buscarArticulos(val);
    setRResultados(res);
  };

  const listaFilt=ventas.filter(v=>{
    if(bDocmto){
      if(bDocmto==='Boleta'&&v.doc!=='BOL') return false;
      if(bDocmto==='Factura'&&v.doc!=='FAC') return false;
      if(bDocmto==='Nota de Venta'&&v.doc!=='NV') return false;
    }
    if(bq){
      const q=bq.toLowerCase();
      if(bTipo==='1'||bTipo==='9'){if(!v.serie.toLowerCase().includes(q)) return false;}
      else if(bTipo==='2'||bTipo==='10'){if(!v.cliente.toLowerCase().includes(q)) return false;}
      else if(bTipo==='3'){if(!v.vendedor.toLowerCase().includes(q)) return false;}
    }
    if(bfi&&v.fecha<bfi) return false;
    if(bff&&v.fecha>bff) return false;
    return true;
  });

  const docBg = v => {
    if(v.doc==='NV') return '#C433FF';
    if(v.sunat==='ERROR') return 'red';
    if(v.sunat==='BETA')  return '#C433FF';
    return '#1a8a8a'; // OK → teal
  };

  const SunatCell = ({v}) => {
    if(v.sunat==='ERROR') return (
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
        <span style={{border:'1px solid #ccc',borderRadius:3,padding:'1px 7px',fontSize:11,background:'#fff'}}>Pendiente</span>
        <span
          style={{background:'red',color:'#fff',borderRadius:3,padding:'1px 6px',fontSize:10,fontWeight:700,cursor:'pointer'}}
          onClick={()=>{
            setVentas(p=>p.map(x=>x.id===v.id?{...x,sunat:'OK',estado:'Activo'}:x));
            showAlert('ok:Se generó su Boleta Electrónica con éxito...');
          }}>
          Volver a enviar
        </span>
      </div>
    );
    if(v.sunat==='OK')   return <span className="s-ok">Enviado</span>;
    if(v.sunat==='BETA') return <span className="s-beta">BETA</span>;
    return null;
  };

  const BtnCerrar = ({bg='#6c757d'}) => (
    <button className="mopc-btn" style={{background:bg}} onClick={()=>setMOpc(null)}>✕ Cerrar</button>
  );

  const onAction = (tipo, v) => setMOpc({tipo, venta:v});

  /* ══════════ RENDER ══════════ */
  return (
    <>
      <style>{css}</style>

      {alert && (
        <div className={`alert-box ${alert.startsWith('ok:')?'alert-ok':'alert-err'}`}>
          {alert.startsWith('ok:')?'✅ ':'⚠️ '}{alert.slice(3)}
        </div>
      )}

      {/* ════════ LISTA ════════ */}
      {vista==='lista' && (<>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
          <span style={{background:'#0099ff',color:'#fff',borderRadius:'50%',width:22,height:22,
            display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:'bold'}}>?</span>
          <span style={{fontSize:17,fontWeight:'bold'}}>Venta</span>
        </div>

        {/* Filtros */}
        <div className="vta-bar">
          <b style={{fontSize:12}}>BUSCAR X</b>
          <select value={bDocmto} onChange={e=>setBDocmto(e.target.value)} style={{width:120}}>
            <option value="">Documento &gt; todos</option>
            <option value="Boleta">Boleta</option>
            <option value="Factura">Factura</option>
            <option value="Nota de Venta">Nota de Venta</option>
          </select>
          <select value={bSucursal} onChange={e=>setBSucursal(e.target.value)} style={{width:120}}>
            <option value="">Sucursal &gt; todos</option>
            <option value="1">Tienda1</option>
            <option value="2">Tienda2</option>
            <option value="3">Almacen 1</option>
          </select>
          <b style={{fontSize:12}}>y/o</b>
          <select value={bTipo} onChange={e=>setBTipo(e.target.value)} style={{width:120}}>
            <option value="1">Nro documento</option>
            <option value="9">Serie del documento</option>
            <option value="2">Nombre/empresa</option>
            <option value="10">DNI/RUC</option>
            <option value="3">Vendedor</option>
          </select>
          <input type="text" value={bq} onChange={e=>setBq(e.target.value)} placeholder="Buscar..." style={{width:200}}/>
          <b style={{fontSize:12}}>y/o</b>
          <span style={{fontSize:12}}>Fecha Inicio</span><DP value={bfi} onChange={setBfi}/>
          <span style={{fontSize:12}}>Fecha Fin</span><DP value={bff} onChange={setBff}/>
          <button className="btn-buscar">🔍 Buscar</button>
          <button className="btn-nuevo" onClick={()=>{setForm(formIni());setVista('form');}}>＋ Nuevo</button>
          <button className="btn-rapido" onClick={()=>setVista('rapido')}>⚡ Rapido</button>
        </div>

        <div style={{textAlign:'center',fontWeight:'bold',fontSize:13,marginBottom:6}}>LISTADO GENERAL</div>
        <div style={{overflowX:'auto'}}>
          <table className="tlista">
            <thead>
              <tr>
                <th>DOCUMENTO</th><th>FECHA</th><th>CLIENTE</th><th>VENDEDOR</th>
                <th>T.VTA</th><th>SUNAT</th><th>ESTADO</th><th>OPCIONES</th>
              </tr>
            </thead>
            <tbody>
              {listaFilt.length===0
                ? <tr><td colSpan={8} style={{textAlign:'center',padding:20,color:'#888'}}>Sin registros</td></tr>
                : listaFilt.map((v,i)=>{
                  const rowBg=i%2===0?'#fff':'#f5f5f5';
                  return (
                    <tr key={v.id}
                      onMouseEnter={e=>Array.from(e.currentTarget.cells).forEach((c,ci)=>{if(ci!==0)c.style.background='#CCFF66';})}
                      onMouseLeave={e=>Array.from(e.currentTarget.cells).forEach((c,ci)=>{if(ci!==0)c.style.background=rowBg;})}>
                      {/* Doc */}
                      <td style={{background:docBg(v),padding:'8px 10px'}}>
                        <b style={{color:'#fff'}}>{v.doc}:</b>
                        <span style={{color:'#fff',fontWeight:700,marginLeft:2}}>{v.serie}</span>
                      </td>
                      <td>{fmtFecha(v.fecha)}{v.hora?`(${v.hora})`:''}</td>
                      <td>{v.cliente}</td>
                      <td>{v.vendedor}</td>
                      <td>{v.tvta}</td>
                      <td style={{textAlign:'center'}}><SunatCell v={v}/></td>
                      <td>{v.estado}</td>
                      <td style={{textAlign:'center',whiteSpace:'nowrap'}}>
                        {v.hasSunat
                          ? <SelDropdown v={v} onAction={onAction}/>
                          : <NvOps v={v} onAction={onAction}/>
                        }
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>

        <div style={{textAlign:'center',margin:'8px 0',fontSize:13}}>Total Item: {listaFilt.length}</div>
        <hr style={{border:'none',borderTop:'1px solid #dee2e6',margin:'10px 0'}}/>

        {/* Leyenda opciones */}
        <div className="leyenda-ops">
          <b>Leyenda de OPCIONES :</b>
          <span><SvgEdit/> Actualizar, Eliminar</span>
          <span><SvgPlus/> Generar Nota de Debito</span>
          <span><SvgMinus/> Generar Nota de Credito</span>
          <span><SvgPrint/> Imprimir Ticket</span>
          <span><SvgPdfR/> Imprimir PDF</span>
          <span><SvgXml/> Exportar XML</span>
          <span><SvgPencilSm c="#6c757d"/> Modificar (NV)</span>
          <span><SvgDocSm c="#1a6aad"/> Imprimir (NV)</span>
        </div>
        <hr style={{border:'none',borderTop:'1px solid #dee2e6',margin:'10px 0'}}/>
        <div style={{textAlign:'center',fontSize:12,lineHeight:2.2}}>
          <b>Leyenda de COLORES :</b><br/>
          <span style={{background:'#C433FF',color:'#fff',padding:'2px 9px',borderRadius:3,fontWeight:700}}>BETA</span>
          {' '}: COMPROBANTE DE PRUEBA NO SIRVE PARA DECLARAR ANTE <b>SUNAT</b><br/>
          <span style={{background:'red',color:'#fff',padding:'2px 9px',borderRadius:3,fontWeight:700}}>ERROR</span>
          {' '}: DOCUMENTO NO LLEGO A SUNAT TIENE 24 HORAS PARA SOLUCIONAR
        </div>
      </>)}

      {/* ════════ FORMULARIO ════════ */}
      {vista==='form' && (<>
        <div className="form-titulo">VENTA : NUEVA</div>
        <div className="nv-wrap">
          <div className="nv-row">
            <div className="nv-cell" style={{minWidth:155}}>
              <label>Docmto-Serie : <span className="req">(*)</span><a href="#" className="lnk">..+</a></label>
              <select value={form.documento} onChange={e=>sf('documento',e.target.value)} style={{width:152}}>
                {DOCUMENTOS.map(d=><option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="nv-div"/>
            <div className="nv-cell">
              <label>Fecha : <span className="req">(*)</span></label>
              <DP value={form.fecha} onChange={v=>sf('fecha',v)}/>
            </div>
            <div className="nv-div"/>
            <div className="nv-cell">
              <label>Nº de Orden</label>
              <input type="text" value={form.nroorden} onChange={e=>sf('nroorden',e.target.value)} style={{width:75}}/>
            </div>
            <div className="nv-div"/>
            <div className="nv-cell">
              <label>Moneda : <span className="req">(*)</span></label>
              <select value={form.moneda} onChange={e=>sf('moneda',e.target.value)} style={{width:85}}>
                {MONEDAS.map(m=><option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="nv-cell" style={{paddingTop:14}}>
              <label>&nbsp;</label>
              <select value={form.conigv} onChange={e=>sf('conigv',e.target.value)} style={{width:78}}>
                {CONIGV.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="nv-div"/>
            <div className="nv-cell">
              <label>Tipo Operacion: <span className="req">(*)</span></label>
              <select value={form.tipooper} onChange={e=>sf('tipooper',e.target.value)} style={{width:128}}>
                {TIPO_OPER.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="nv-div"/>
            <div className="nv-cell">
              <label>Pre Anticipo: <span className="req">(*)</span></label>
              <select value={form.preanticipo} onChange={e=>sf('preanticipo',e.target.value)} style={{width:65}}>
                {PRE_ANTICIPO.map(p=><option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="nv-row" style={{marginTop:3}}>
            <div className="nv-cell">
              <label>&nbsp;</label>
              <select value={form.guia} onChange={e=>sf('guia',e.target.value)} style={{width:175}}>
                {GUIAS.map(g=><option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="nv-cell">
              <label>&nbsp;</label>
              <input type="text" value={form.nroguia} onChange={e=>sf('nroguia',e.target.value)} style={{width:52}}/>
            </div>
            <div className="nv-div"/>
            <div className="nv-cell">
              <label>Vendedor</label>
              <select value={form.vendedor} onChange={e=>sf('vendedor',e.target.value)} style={{width:152}}>
                {VENDEDORES.map(v=><option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="nv-div"/>
            <div className="nv-cell">
              <label>Tipo de venta <span className="req">(*)</span></label>
              <div style={{display:'flex',alignItems:'center',gap:5}}>
                <select value={form.tipovta} onChange={e=>sf('tipovta',e.target.value)} style={{width:85}}>
                  {TIPO_VTA.map(t=><option key={t}>{t}</option>)}
                </select>
                {form.tipovta==='Contado'&&(
                  <select value={form.pagomod} onChange={e=>sf('pagomod',e.target.value)} style={{width:195}}>
                    {PAGO_TIPO.map(p=><option key={p}>{p}</option>)}
                  </select>
                )}
                {form.tipovta==='Credito'&&(
                  <span style={{display:'flex',alignItems:'center',gap:4}}>
                    <input type="text" value={form.diasdias} onChange={e=>sf('diasdias',e.target.value)} style={{width:40}} placeholder="Dias"/>
                    <span style={{fontSize:12}}>Dias</span>
                    <label style={{display:'flex',alignItems:'center',gap:3,fontSize:12,whiteSpace:'nowrap'}}>
                      <input type="checkbox" checked={form.letra} onChange={e=>sf('letra',e.target.checked)} style={{width:12}}/> C.Letra
                    </label>
                  </span>
                )}
              </div>
            </div>
            <div className="nv-div"/>
            <div className="nv-cell" style={{flex:1,minWidth:155}}>
              <label>Sujeto a</label>
              <select value={form.sujeto} onChange={e=>sf('sujeto',e.target.value)} style={{width:'100%',minWidth:165}}>
                {SUJETO_OPTS.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            {form.tipovta==='Contado'&&(<>
              <div className="nv-div"/>
              <div className="nv-cell">
                <label>Pago con</label>
                <input type="text" value={form.pagocon} onChange={e=>sf('pagocon',e.target.value)} style={{width:110}} placeholder="moneda indicada"/>
              </div>
            </>)}
          </div>
        </div>

        <hr className="sep"/>

        {/* Cliente */}
        <div className="cli-section">
          <div className="cli-section-title">Datos del Cliente</div>
          <div className="cli-row">
            <div className="cli-cell">
              <label>RUC/DNI</label>
              <div className="inp-with-icon">
                <input type="text" value={form.cliRuc} onChange={e=>sf('cliRuc',e.target.value)} style={{width:155}} placeholder="Busca data/sunat"/>
                <button className="btn-lupa" title="Consultar SUNAT">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#17a2b8" strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke="#17a2b8" strokeWidth="2"/></svg>
                </button>
              </div>
            </div>
            <div className="cli-cell">
              <label>Razon Social / Nombre <span className="req">(*)</span></label>
              <div className="inp-with-icon">
                <input type="text" className="inp-verde" value={form.cliNombre} onChange={e=>sf('cliNombre',e.target.value)} style={{width:265,height:26}}/>
                <button className="btn-bino" title="Buscar cliente" onClick={()=>{setCliQ('');setCLiRes(CLIENTES_DB);setMCli(true);}}>📖</button>
              </div>
            </div>
            <div className="cli-cell" style={{flex:1,minWidth:170}}>
              <label>Dirección</label>
              <input type="text" value={form.cliDir} onChange={e=>sf('cliDir',e.target.value)} style={{width:'100%',minWidth:175}}/>
            </div>
            <div className="cli-cell">
              <label>E-mail</label>
              <input type="text" value={form.cliEmail} onChange={e=>sf('cliEmail',e.target.value)} style={{width:180}}/>
            </div>
          </div>
        </div>

        <hr className="sep"/>

        {/* Búsqueda artículos */}
        <div className="art-bar">
          <label>BUSQUEDA DE ARTICULOS ×</label>
          <select value={form.artBusqTipo} onChange={e=>sf('artBusqTipo',e.target.value)} style={{width:115}}>
            {['Nombre','Marca','Linea','Categoria','Codigo','C.Barra','Serie','Detalle'].map(o=><option key={o}>{o}</option>)}
          </select>
          <input type="text" value={form.artBusqQ}
            onChange={e=>{sf('artBusqQ',e.target.value);if(!e.target.value){setArtRes([]);setArtBusqActiva(false);}}}
            onKeyDown={e=>e.key==='Enter'&&ejecutarBusqueda()}
            placeholder="Buscar artículo..." style={{minWidth:200}}/>
          <button className="btn-art-buscar" onClick={ejecutarBusqueda}>🔍 Buscar</button>
          <button className="btn-art-reset" onClick={()=>{sf('artBusqQ','');setArtRes([]);setArtBusqActiva(false);}}>↺</button>
          {artRes.length>0&&<span style={{fontSize:12,color:'#555'}}>{artRes.length} resultado(s)</span>}
        </div>

        {artBusqActiva&&(
          <div className="art-resultados">
            {artRes.length===0
              ? <div style={{padding:'12px',textAlign:'center',color:'#888',fontSize:13}}>Sin resultados</div>
              : <table className="tart-res">
                  <thead><tr><th width="9%">CÓDIGO</th><th width="40%">ARTÍCULO</th><th width="10%">GRUPO</th><th width="7%">STOCK</th><th width="9%">PMC</th><th width="9%">P.VENTA</th><th width="10%">AGREGAR</th></tr></thead>
                  <tbody>
                    {artRes.map(art=>(
                      <tr key={art.id}>
                        <td style={{fontFamily:'monospace',fontSize:11}}>{art.codigo}</td>
                        <td>{art.nombre}</td>
                        <td style={{fontSize:11,color:'#666'}}>{art.grupo}</td>
                        <td align="center"><span className={art.stock>0?'bst-ok':'bst-no'}>{art.stock}</span></td>
                        <td align="right" style={{color:'#1a6aad',fontWeight:'bold'}}>S/ {art.pmc.toFixed(2)}</td>
                        <td align="right" style={{fontWeight:'bold'}}>S/ {art.precio.toFixed(2)}</td>
                        <td align="center"><button className="btn-add-art" onClick={()=>agregarArt(art)}>+ Agregar</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            }
          </div>
        )}

        <table className="tart">
          <thead>
            <tr>
              <th width="7%">CODIGO</th><th width="26%">ARTICULOS/DETALLE</th><th width="6%">STOCK</th>
              <th width="7%">MED.</th><th width="8%">P-M/C</th><th width="9%">P.VENTA</th>
              <th width="6%">CANT.</th><th width="16%">T.A.IGV</th><th width="5%">AGRE.</th><th width="4%"></th>
            </tr>
          </thead>
          <tbody>
            {form.artRows.map(row=>(
              <tr key={row.id}>
                <td><input type="text" value={row.codigo} onChange={e=>updRow(row.id,'codigo',e.target.value)}/></td>
                <td><textarea value={row.articulo} onChange={e=>updRow(row.id,'articulo',e.target.value)} placeholder="Articulo/descripcion"/></td>
                <td><input type="text" value={row.stock} onChange={e=>updRow(row.id,'stock',e.target.value)} style={{background:'#f8f9fa',textAlign:'center'}}/></td>
                <td><select value={row.med} onChange={e=>updRow(row.id,'med',e.target.value)}>{MED_OPTS.map(m=><option key={m}>{m}</option>)}</select></td>
                <td><input type="text" value={row.pmc} onChange={e=>updRow(row.id,'pmc',e.target.value)} style={{color:'#1a6aad',fontWeight:'bold',textAlign:'right'}}/></td>
                <td><input type="text" value={row.pventa} onChange={e=>updRow(row.id,'pventa',e.target.value)} style={{textAlign:'right'}}/></td>
                <td><input type="number" value={row.cant} onChange={e=>updRow(row.id,'cant',e.target.value)} min="0" style={{textAlign:'center'}}/></td>
                <td><select value={row.taigv} onChange={e=>updRow(row.id,'taigv',e.target.value)}>{TAIGV_OPTS.map(t=><option key={t}>{t}</option>)}</select></td>
                <td align="center"><input type="checkbox" className="chk-agregar" checked={row.sel} onChange={e=>updRow(row.id,'sel',e.target.checked)}/></td>
                <td align="center">
                  {form.artRows.length>1&&(
                    <button onClick={()=>delRow(row.id)} style={{background:'#dc3545',border:'none',color:'#fff',borderRadius:3,padding:'2px 6px',cursor:'pointer',fontSize:11}}>✕</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{marginTop:6}}>
          <button className="btn-art-buscar" style={{fontSize:12,padding:'4px 11px'}} onClick={addRow}>+ Agregar fila</button>
        </div>
        <div className="form-footer">
          <button className="btn-gd" onClick={guardar}>💾 Guardar</button>
          <button className="btn-reg" onClick={()=>setVista('lista')}>⬅ Regresar</button>
        </div>
      </>)}

      {/* ════════ VENTAS RÁPIDAS ════════ */}
      {vista==='rapido'&&(<>
        <div style={{fontSize:15,fontWeight:'bold',marginBottom:12}}>VENTAS RAPIDAS</div>
        <div style={{display:'flex',gap:14,flexWrap:'wrap',alignItems:'flex-end',marginBottom:10}}>
          <div>
            <div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Doc-Serie :<span style={{color:'red'}}>(*)</span></div>
            <select value={rDoc} onChange={e=>setRDoc(e.target.value)}
              style={{padding:'4px 8px',border:'1px solid #ced4da',borderRadius:3,fontSize:13,color:'#212529',background:'#fff',width:160}}>
              <option>Boleta BI01</option><option>Nota de Venta 001</option>
            </select>
          </div>
          <div>
            <div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Tipo de venta<span style={{color:'red'}}>(*)</span></div>
            <div style={{display:'flex',gap:5,alignItems:'center'}}>
              <select value={rTipoVta} onChange={e=>setRTipoVta(e.target.value)}
                style={{padding:'4px 7px',border:'1px solid #ced4da',borderRadius:3,fontSize:13,color:'#212529',background:'#fff',width:95}}>
                <option>Contado</option>
              </select>
              <select value={rPago} onChange={e=>setRPago(e.target.value)}
                style={{padding:'4px 7px',border:'1px solid #ced4da',borderRadius:3,fontSize:13,color:'#212529',background:'#fff',width:195}}>
                <option>Efectivo</option><option>C.Entrega</option><option>Yape</option>
                <option>Deposito Interbank</option><option>Deposito BBVA</option><option>Deposito BCP</option><option>Mixto</option>
              </select>
            </div>
          </div>
          <div style={{flex:1,minWidth:180}}>
            <div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>CLIENTE</div>
            <div style={{display:'flex',gap:5,alignItems:'center'}}>
              <input type="text" value={rCliente} readOnly
                style={{flex:1,maxWidth:255,padding:'4px 9px',border:'1px solid #ced4da',borderRadius:3,fontSize:13,color:'#212529',background:'#fff'}}/>
              <button onClick={()=>setMRCli('nuevo')}
                style={{background:'#17a2b8',border:'none',color:'#fff',padding:'4px 11px',borderRadius:3,cursor:'pointer',fontSize:12,fontWeight:'bold',whiteSpace:'nowrap'}}>
                + Agregar Nuevo
              </button>
              <button onClick={()=>setMRCli('lista')}
                style={{background:'#17a2b8',border:'none',color:'#fff',padding:'4px 11px',borderRadius:3,cursor:'pointer',fontSize:12,fontWeight:'bold'}}>
                Siguiente
              </button>
            </div>
          </div>
        </div>
        <hr style={{borderColor:'#dee2e6',margin:'10px 0 12px'}}/>

        {rCarrito.length>0&&(
          <div style={{marginBottom:14}}>
            <table className="vr-table">
              <thead>
                <tr className="vr-thead-dark">
                  {['CÓDIGO','ARTÍCULO','PRECIO','CANT.','TOTAL',''].map(h=>(
                    <th key={h} style={{color:'#fff',fontWeight:'bold',textTransform:'uppercase',padding:'8px 7px',fontSize:12,textAlign:'center'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rCarrito.map((item,i)=>(
                  <tr key={item.id} style={{background:i%2===0?'#eee':'#fff'}}>
                    <td style={{padding:'4px 7px',fontSize:12,fontFamily:'monospace'}}>{item.codigo}</td>
                    <td style={{padding:'4px 7px',fontSize:13}}>{item.nombre}</td>
                    <td style={{padding:'4px 7px',textAlign:'center'}}>
                      <input type="number" value={item.precio} min="0" step="0.01"
                        onChange={e=>setRCarrito(p=>p.map(r=>r.id===item.id?{...r,precio:e.target.value}:r))}
                        className="vr-input" style={{width:78,padding:'2px 5px',borderRadius:3,textAlign:'right',fontSize:13}}/>
                    </td>
                    <td style={{padding:'4px 7px',textAlign:'center'}}>
                      <input type="number" value={item.cant} min="1"
                        onChange={e=>setRCarrito(p=>p.map(r=>r.id===item.id?{...r,cant:e.target.value}:r))}
                        className="vr-input" style={{width:52,padding:'2px 5px',borderRadius:3,textAlign:'center',fontSize:13}}/>
                    </td>
                    <td style={{padding:'4px 7px',fontSize:14,textAlign:'right',fontWeight:'bold'}}>
                      S/ {(parseFloat(item.precio||0)*parseFloat(item.cant||0)).toFixed(2)}
                    </td>
                    <td style={{padding:'4px 7px',textAlign:'center'}}>
                      <button onClick={()=>setRCarrito(p=>p.filter(r=>r.id!==item.id))}
                        style={{background:'#dc3545',border:'none',color:'#fff',borderRadius:3,padding:'2px 7px',cursor:'pointer',fontSize:12}}>✕</button>
                    </td>
                  </tr>
                ))}
                <tr style={{background:'skyblue'}}>
                  <td colSpan={4} style={{padding:'6px 8px',fontWeight:'bold',textAlign:'right',fontSize:14,color:'#fff',textTransform:'uppercase'}}>TOTAL</td>
                  <td style={{padding:'6px 8px',fontWeight:'bold',fontSize:15,textAlign:'right',color:'#fff'}}>
                    S/ {rCarrito.reduce((s,r)=>s+parseFloat(r.precio||0)*parseFloat(r.cant||0),0).toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <div style={{textAlign:'center',marginBottom:12}}>
          <b style={{fontSize:13,marginRight:6}}>BUSCAR X</b>
          <input type="text" value={rBusqQ} onChange={e=>setRBusqQ(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&buscarRapido('nomart',rBusqQ)}
            placeholder="Ingrese el texto a buscar"
            style={{width:230,padding:'3px 9px',border:'1px solid #ced4da',borderRadius:3,fontSize:13,
              color:'#212529',background:'#ccff99',fontWeight:'bold',marginRight:5}}/>
          <button onClick={()=>buscarRapido('nomart',rBusqQ)}
            style={{background:'#17a2b8',border:'none',borderRadius:3,padding:'4px 11px',color:'#fff',cursor:'pointer',fontSize:13,marginRight:8}}>
            🔍
          </button>
          —&nbsp;
          <button onClick={()=>{setRCategoria('T');buscarRapido('Todos','T');}}
            style={{background:rCategoria==='T'?'#0d8ea4':'#17a2b8',border:'none',borderRadius:3,padding:'3px 8px',color:'#fff',cursor:'pointer',fontSize:11,fontWeight:'bold',marginRight:3}}>T</button>
          {GRUPOS.map((g,i)=>(
            <button key={i} onClick={()=>{setRCategoria(g);buscarRapido('grupo',g);}}
              style={{background:rCategoria===g?'#0d8ea4':'#17a2b8',border:'none',borderRadius:3,padding:'3px 8px',color:'#fff',cursor:'pointer',fontSize:11,fontWeight:'bold',marginRight:3,marginBottom:3}}
              title={g}>{g.substring(0,6)}</button>
          ))}
        </div>

        {rResultados.length>0&&(
          <table className="vr-table">
            <thead>
              <tr className="vr-thead-teal">
                {['CÓDIGO','ARTÍCULO','GRUPO','STOCK','P.VENTA','CANT.','AGREGAR'].map(h=>(
                  <th key={h} style={{color:'#fff',fontWeight:'bold',textTransform:'uppercase',padding:'8px 7px',fontSize:12,textAlign:'center'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rResultados.map((art,i)=>(
                <tr key={art.id} style={{background:i%2===0?'#eee':'#fff'}}>
                  <td style={{padding:'4px 8px',fontSize:12,fontFamily:'monospace'}}>{art.codigo}</td>
                  <td style={{padding:'4px 8px',fontSize:13}}>{art.nombre}</td>
                  <td style={{padding:'4px 8px',fontSize:11,color:'#666'}}>{art.grupo}</td>
                  <td style={{padding:'4px 8px',textAlign:'center'}}><span className={art.stock>0?'bst-ok':'bst-no'}>{art.stock}</span></td>
                  <td style={{padding:'4px 8px',textAlign:'center',fontWeight:'bold'}}>S/ {art.precio.toFixed(2)}</td>
                  <td style={{padding:'4px 8px',textAlign:'center'}}>
                    <input type="number" defaultValue="1" min="1"
                      value={cantInput[art.id]??1}
                      onChange={e=>setCantInput(p=>({...p,[art.id]:e.target.value}))}
                      className="vr-input" style={{width:52,padding:'2px 5px',borderRadius:3,textAlign:'center',fontSize:13}}/>
                  </td>
                  <td style={{padding:'4px 8px',textAlign:'center'}}>
                    <button onClick={()=>{
                      const cant=cantInput[art.id]??1;
                      setRCarrito(p=>[...p,{...art,cant,precio:art.precio.toFixed(2),id:Date.now()+Math.random()}]);
                      setCantInput(p=>({...p,[art.id]:1}));
                    }} style={{background:'#28a745',border:'none',color:'#fff',borderRadius:3,padding:'3px 11px',cursor:'pointer',fontSize:13,fontWeight:'bold'}}>+</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{textAlign:'center',marginTop:14,display:'flex',justifyContent:'center',gap:10}}>
          {rCarrito.length>0&&(
            <button onClick={()=>{
              const nva={id:Date.now(),
                doc:rDoc.includes('Boleta')?'BOL':'NV',
                serie:rDoc.includes('Boleta')?`BI01-${String(ventas.length+1).padStart(6,'0')}`:`001-${String(ventas.length+1).padStart(6,'0')}`,
                fecha:hoy,hora:'',cliente:rCliente,vendedor:'fac-tura.com',
                tvta:rTipoVta,sunat:rDoc.includes('Boleta')?'BETA':'',
                estado:'Activo',hasSunat:rDoc.includes('Boleta'),
              };
              setVentas(p=>[nva,...p]);
              showAlert('ok:Venta rápida guardada correctamente.');
              setRCarrito([]);setRResultados([]);setVista('lista');
            }} style={{background:'#28a745',border:'none',color:'#fff',padding:'8px 24px',borderRadius:4,cursor:'pointer',fontSize:13,fontWeight:'bold'}}>
              💾 Guardar
            </button>
          )}
          <button onClick={()=>{setRCarrito([]);setRResultados([]);setVista('lista');}}
            style={{background:'#17a2b8',border:'none',color:'#fff',padding:'8px 24px',borderRadius:4,cursor:'pointer',fontSize:13,fontWeight:'bold'}}>
            ↩ Regresar
          </button>
        </div>
      </>)}

      {/* ════════ MODAL BUSCAR CLIENTE (form) ════════ */}
      {mCli&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:9999,display:'flex',alignItems:'flex-start',justifyContent:'center',paddingTop:50}}
          onClick={()=>setMCli(false)}>
          <div onClick={e=>e.stopPropagation()}
            style={{background:'#fff',borderRadius:6,width:'90vw',maxWidth:800,boxShadow:'0 8px 32px rgba(0,0,0,0.3)',overflow:'hidden',maxHeight:'85vh',display:'flex',flexDirection:'column'}}>
            <div style={{background:'#1a1a2e',padding:'9px 16px',flexShrink:0,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{color:'#fff',fontSize:13,fontWeight:'bold'}}>Buscar Cliente</div>
                <div style={{fontSize:11,color:'#6cb4e4'}}>clientes_buscar.php</div>
              </div>
              <button onClick={()=>setMCli(false)} style={{background:'none',border:'none',color:'#fff',fontSize:22,cursor:'pointer'}}>×</button>
            </div>
            <div style={{background:'#fff',padding:'12px 16px',overflowY:'auto',flex:1}}>
              <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:11,flexWrap:'wrap'}}>
                <b style={{fontSize:13}}>BUSCAR CLIENTES X</b>
                {['Nombre','Ruc'].map(f=>(
                  <label key={f} style={{cursor:'pointer',display:'inline-flex',alignItems:'center',gap:3,fontSize:13}}>
                    <input type="radio" name="cf2" checked={cliFilt===f} onChange={()=>setCliFilt(f)} style={{accentColor:'#17a2b8'}}/> {f}
                  </label>
                ))}
                <input type="text" value={cliQ} onChange={e=>setCliQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&buscarCliente()}
                  style={{padding:'4px 9px',border:'1px solid #ced4da',borderRadius:3,fontSize:13,background:'#b8f5b0',color:'#212529',fontWeight:'bold',width:155}}/>
                <button onClick={buscarCliente}
                  style={{background:'#17a2b8',border:'1px solid #17a2b8',color:'#fff',padding:'4px 13px',borderRadius:3,cursor:'pointer',fontSize:13,fontWeight:'bold'}}>
                  🔍 Buscar
                </button>
              </div>
              <div style={{textAlign:'center',fontWeight:'bold',fontSize:14,marginBottom:9}}>LISTADO GENERAL DE CLIENTES</div>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
                <thead>
                  <tr style={{background:'#1a8a8a'}}>
                    {[['Nro','5%'],['Nombre',''],['RUC / DNI','14%'],['Direccion','28%'],['Agregar','7%']].map(([h,w])=>(
                      <th key={h} style={{padding:'8px 10px',color:'#fff',fontWeight:'bold',fontSize:13,textAlign:'left',width:w||'auto'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cliRes.length===0
                    ? <tr><td colSpan={5} style={{textAlign:'center',padding:20,color:'#888',fontSize:13}}>Sin resultados</td></tr>
                    : cliRes.map((c,i)=>(
                      <tr key={c.id} style={{background:i%2===0?'#f2f2f2':'#fff',borderBottom:'1px solid #e0e0e0'}}
                        onMouseEnter={e=>e.currentTarget.style.background='#CCFF66'}
                        onMouseLeave={e=>e.currentTarget.style.background=i%2===0?'#f2f2f2':'#fff'}>
                        <td style={{padding:'7px 10px'}}>{i+1}</td>
                        <td style={{padding:'7px 10px'}}>{c.nombre}</td>
                        <td style={{padding:'7px 10px'}}>{c.ruc||''}</td>
                        <td style={{padding:'7px 10px'}}>{c.dir||''}</td>
                        <td style={{padding:'7px 10px',textAlign:'center'}}>
                          <button onClick={()=>selCliente(c)}
                            style={{background:'none',border:'none',cursor:'pointer',color:'#6f42c1',fontSize:26,fontWeight:'bold',lineHeight:1,padding:'0 5px'}}>+</button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ════════ MODALES CLIENTES RÁPIDO ════════ */}
      {mRCli==='lista'&&(
        <div className="mopc-overlay" onClick={()=>setMRCli(null)}>
          <div className="mopc-box" onClick={e=>e.stopPropagation()} style={{maxWidth:650}}>
            <div className="mopc-head" style={{background:'#1a8a8a'}}>👤 CLIENTE</div>
            <div className="mopc-body">
              <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:12,flexWrap:'wrap'}}>
                <b style={{fontSize:13}}>BUSCAR X</b>
                <input type="text" value={rCliBusqQ} onChange={e=>setRCliBusqQ(e.target.value)} placeholder="Nombre o RUC..."
                  style={{flex:1,minWidth:160,padding:'4px 9px',border:'1px solid #ced4da',borderRadius:3,fontSize:13}}/>
                <button onClick={()=>setMRCli('nuevo')}
                  style={{background:'#17a2b8',border:'none',color:'#fff',padding:'5px 13px',borderRadius:3,cursor:'pointer',fontSize:13,fontWeight:'bold'}}>
                  + Agregar Nuevo
                </button>
              </div>
              <table className="mopc-table">
                <thead><tr><th width="5%">NRO</th><th>NOMBRE</th><th width="14%">RUC</th><th width="26%">DIRECCIÓN</th><th width="9%">SELEC.</th></tr></thead>
                <tbody>
                  {cliListaFilt.map((c,i)=>(
                    <tr key={c.id}>
                      <td align="center">{i+1}</td><td>{c.nombre}</td><td>{c.ruc||'—'}</td><td>{c.dir||'—'}</td>
                      <td align="center">
                        <button onClick={()=>{setRCliente(c.nombre);setMRCli(null);}}
                          style={{background:'#17a2b8',border:'none',color:'#fff',padding:'2px 11px',borderRadius:3,cursor:'pointer',fontSize:13,fontWeight:'bold'}}>✔</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mopc-footer"><BtnCerrar/></div>
          </div>
        </div>
      )}

      {mRCli==='nuevo'&&(
        <div className="mopc-overlay" onClick={()=>setMRCli(null)}>
          <div className="mopc-box" onClick={e=>e.stopPropagation()} style={{maxWidth:640,width:'95%'}}>
            <div className="mopc-head" style={{background:'#1a8a8a'}}>➕ AGREGAR NUEVO CLIENTE</div>
            <div className="mopc-body">
              <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:10,marginBottom:10}}>
                <div><div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Empresa/nombre (*)</div>
                  <input className="mopc-inp" placeholder="Empresa/nombre" value={cliForm.nombre} onChange={e=>cf('nombre',e.target.value)}/></div>
                <div><div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Tipo Doc.</div>
                  <select className="mopc-inp" value={cliForm.tipodoc} onChange={e=>cf('tipodoc',e.target.value)}>
                    <option>RUC</option><option>DNI</option><option>CE</option><option>Pasaporte</option>
                  </select></div>
                <div><div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Nro</div>
                  <input className="mopc-inp" value={cliForm.nro} onChange={e=>cf('nro',e.target.value)}/></div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:10,marginBottom:10}}>
                <div><div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Dirección</div>
                  <input className="mopc-inp" value={cliForm.direccion} onChange={e=>cf('direccion',e.target.value)}/></div>
                <div><div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>E-mail</div>
                  <input className="mopc-inp" type="email" value={cliForm.email} onChange={e=>cf('email',e.target.value)}/></div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
                <div><div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Responsable</div>
                  <select className="mopc-inp" value={cliForm.responsable} onChange={e=>cf('responsable',e.target.value)}>
                    {VENDEDORES.map(v=><option key={v}>{v}</option>)}
                  </select></div>
                <div><div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Modo de pago</div>
                  <select className="mopc-inp" value={cliForm.modopago} onChange={e=>cf('modopago',e.target.value)}>
                    <option>Contado</option><option>Credito</option><option>Mixto</option>
                  </select></div>
                <div><div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Estado del cliente</div>
                  <select className="mopc-inp" value={cliForm.estado} onChange={e=>cf('estado',e.target.value)}>
                    <option>Pagador</option><option>Moroso</option><option>VIP</option>
                  </select></div>
              </div>
            </div>
            <div className="mopc-footer">
              <button className="mopc-btn" style={{background:'#17a2b8'}} onClick={guardarNuevoCli}>💾 Guardar</button>
              <button className="mopc-btn" style={{background:'#6c757d'}} onClick={()=>{setCliForm(cliIni());setMRCli('lista');}}>← Regresar</button>
            </div>
          </div>
        </div>
      )}

      {/* ════════ MODALES OPCIONES ════════ */}
      {mOpc&&(()=>{
        const v=mOpc.venta;
        const C=({bg='#6c757d'})=><button className="mopc-btn" style={{background:bg}} onClick={()=>setMOpc(null)}>✕ Cerrar</button>;

        if(mOpc.tipo==='editar') return (
          <div className="mopc-overlay" onClick={()=>setMOpc(null)}>
            <div className="mopc-box" onClick={e=>e.stopPropagation()}>
              <div className="mopc-head" style={{background:'#e67e22'}}>✏ Editar / Eliminar — {v.serie}</div>
              <div className="mopc-body">
                <div className="mopc-row"><span className="mopc-label">Serie:</span><span className="mopc-val">{v.serie}</span></div>
                <div className="mopc-row"><span className="mopc-label">Fecha:</span><span className="mopc-val">{fmtFecha(v.fecha)}</span></div>
                <div className="mopc-row"><span className="mopc-label">Cliente:</span>
                  <input className="mopc-inp" defaultValue={v.cliente} onChange={e=>setVentas(p=>p.map(x=>x.id===v.id?{...x,cliente:e.target.value}:x))}/></div>
                <div className="mopc-row"><span className="mopc-label">Vendedor:</span>
                  <select className="mopc-inp" defaultValue={v.vendedor} onChange={e=>setVentas(p=>p.map(x=>x.id===v.id?{...x,vendedor:e.target.value}:x))}>
                    {VENDEDORES.map(vd=><option key={vd}>{vd}</option>)}
                  </select></div>
              </div>
              <div className="mopc-footer">
                <button className="mopc-btn" style={{background:'#28a745'}} onClick={()=>{showAlert('ok:Actualizado.');setMOpc(null);}}>💾 Guardar</button>
                <button className="mopc-btn" style={{background:'#dc3545'}} onClick={()=>{if(window.confirm(`¿Eliminar ${v.serie}?`)){setVentas(p=>p.filter(x=>x.id!==v.id));setMOpc(null);}}}>🗑 Eliminar</button>
                <C/>
              </div>
            </div>
          </div>
        );

        if(mOpc.tipo==='nd') return (
          <div className="mopc-overlay" onClick={()=>setMOpc(null)}>
            <div className="mopc-box" onClick={e=>e.stopPropagation()}>
              <div className="mopc-head" style={{background:'#28a745'}}>ND Nota de Débito — {v.serie}</div>
              <div className="mopc-body">
                <div className="mopc-row"><span className="mopc-label">Doc. Origen:</span><span className="mopc-val">{v.serie}</span></div>
                <div className="mopc-row"><span className="mopc-label">Cliente:</span><span className="mopc-val">{v.cliente}</span></div>
                <div className="mopc-row"><span className="mopc-label">Motivo:</span>
                  <select className="mopc-inp"><option>02 - Aumento en el valor</option><option>03 - Penalidades</option><option>11 - Ajustes exportación</option></select></div>
                <div className="mopc-row"><span className="mopc-label">Monto:</span><input className="mopc-inp" type="number" placeholder="0.00" style={{width:120}}/></div>
              </div>
              <div className="mopc-footer">
                <button className="mopc-btn" style={{background:'#28a745'}} onClick={()=>{showAlert('ok:Nota de Débito generada.');setMOpc(null);}}>✔ Generar ND</button>
                <C/>
              </div>
            </div>
          </div>
        );

        if(mOpc.tipo==='nc') return (
          <div className="mopc-overlay" onClick={()=>setMOpc(null)}>
            <div className="mopc-box" onClick={e=>e.stopPropagation()}>
              <div className="mopc-head" style={{background:'#dc3545'}}>NC Nota de Crédito — {v.serie}</div>
              <div className="mopc-body">
                <div className="mopc-row"><span className="mopc-label">Doc. Origen:</span><span className="mopc-val">{v.serie}</span></div>
                <div className="mopc-row"><span className="mopc-label">Cliente:</span><span className="mopc-val">{v.cliente}</span></div>
                <div className="mopc-row"><span className="mopc-label">Motivo:</span>
                  <select className="mopc-inp"><option>01 - Anulación</option><option>03 - Corrección descripción</option><option>04 - Descuento global</option><option>06 - Devolución total</option></select></div>
                <div className="mopc-row"><span className="mopc-label">Monto:</span><input className="mopc-inp" type="number" placeholder="0.00" style={{width:120}}/></div>
              </div>
              <div className="mopc-footer">
                <button className="mopc-btn" style={{background:'#dc3545'}} onClick={()=>{showAlert('ok:Nota de Crédito generada.');setMOpc(null);}}>✔ Generar NC</button>
                <C/>
              </div>
            </div>
          </div>
        );

        if(mOpc.tipo==='ticket'||mOpc.tipo==='mail') return (
          <div className="mopc-overlay" onClick={()=>setMOpc(null)}>
            <div className="mopc-box" onClick={e=>e.stopPropagation()} style={{maxWidth:340}}>
              <div className="mopc-head" style={{background:'#17a2b8'}}>{mOpc.tipo==='ticket'?'🖨 Ticket':'📧 Email'} — {v.serie}</div>
              <div className="mopc-body" style={{fontFamily:'monospace',fontSize:12,lineHeight:1.8}}>
                <div style={{textAlign:'center',borderBottom:'1px dashed #aaa',paddingBottom:8,marginBottom:8}}>
                  <div style={{fontWeight:'bold',fontSize:14}}>EMPRESA S.A.C.</div>
                  <div style={{fontSize:11,color:'#666'}}>RUC: 20123456789</div>
                </div>
                <div><b>{v.doc}:</b> {v.serie}</div>
                <div>Fecha: {fmtFecha(v.fecha)}</div>
                <div>Cliente: {v.cliente}</div>
                <div>Vendedor: {v.vendedor}</div>
                <div style={{textAlign:'right',marginTop:8,borderTop:'1px dashed #aaa',paddingTop:8}}>
                  <div>SubTotal: S/ 84.75</div><div>IGV (18%): S/ 15.25</div>
                  <div style={{fontWeight:'bold',fontSize:14}}>TOTAL: S/ 100.00</div>
                </div>
              </div>
              <div className="mopc-footer">
                <button className="mopc-btn" style={{background:'#17a2b8'}} onClick={()=>window.print()}>
                  {mOpc.tipo==='ticket'?'🖨 Imprimir':'📧 Enviar'}
                </button>
                <C/>
              </div>
            </div>
          </div>
        );

        if(mOpc.tipo==='pdf') return (
          <div className="mopc-overlay" onClick={()=>setMOpc(null)}>
            <div className="mopc-box" onClick={e=>e.stopPropagation()}>
              <div className="mopc-head" style={{background:'#dc3545'}}>📄 PDF — {v.serie}</div>
              <div className="mopc-body">
                <div className="mopc-row"><span className="mopc-label">Documento:</span><span className="mopc-val">{v.serie}</span></div>
                <div className="mopc-row"><span className="mopc-label">Cliente:</span><span className="mopc-val">{v.cliente}</span></div>
                <div className="mopc-row"><span className="mopc-label">SUNAT:</span>
                  <span className={v.sunat==='OK'?'s-ok':v.sunat==='ERROR'?'s-err':'s-beta'}>{v.sunat||'—'}</span></div>
                <div style={{display:'flex',gap:12,justifyContent:'center',marginTop:14}}>
                  <div style={{textAlign:'center',padding:'12px 18px',border:'1px solid #dee2e6',borderRadius:5,cursor:'pointer'}} onClick={()=>window.print()}>
                    <div style={{fontSize:26}}>📄</div><div style={{fontSize:12,marginTop:4}}>A4</div>
                  </div>
                  <div style={{textAlign:'center',padding:'12px 18px',border:'1px solid #dee2e6',borderRadius:5,cursor:'pointer'}} onClick={()=>window.print()}>
                    <div style={{fontSize:26}}>🧾</div><div style={{fontSize:12,marginTop:4}}>Ticket</div>
                  </div>
                </div>
              </div>
              <div className="mopc-footer">
                <button className="mopc-btn" style={{background:'#dc3545'}} onClick={()=>window.print()}>🖨 Imprimir PDF</button>
                <C/>
              </div>
            </div>
          </div>
        );

        if(mOpc.tipo==='xml'||mOpc.tipo==='cdr') {
          const xmlContent=`<?xml version="1.0" encoding="UTF-8"?>\n<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">\n  <ID>${v.serie}</ID>\n  <IssueDate>${v.fecha}</IssueDate>\n  <InvoiceTypeCode>${v.doc==='FAC'?'01':'03'}</InvoiceTypeCode>\n  <DocumentCurrencyCode>PEN</DocumentCurrencyCode>\n  <AccountingCustomerParty>\n    <Party><PartyName><Name>${v.cliente}</Name></PartyName></Party>\n  </AccountingCustomerParty>\n  <PayableAmount currencyID="PEN">100.00</PayableAmount>\n</Invoice>`;
          return (
            <div className="mopc-overlay" onClick={()=>setMOpc(null)}>
              <div className="mopc-box" onClick={e=>e.stopPropagation()} style={{maxWidth:600}}>
                <div className="mopc-head" style={{background:'#555'}}>📦 {mOpc.tipo==='xml'?'Exportar XML':'Descargar CDR'} — {v.serie}</div>
                <div className="mopc-body">
                  <div className="mopc-row"><span className="mopc-label">Documento:</span><span className="mopc-val">{v.serie}</span></div>
                  <pre className="xml-pre">{xmlContent}</pre>
                </div>
                <div className="mopc-footer">
                  <button className="mopc-btn" style={{background:'#555'}}
                    onClick={()=>{const blob=new Blob([xmlContent],{type:'application/xml'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${v.serie}.xml`;a.click();}}>⬇ Descargar</button>
                  <C/>
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