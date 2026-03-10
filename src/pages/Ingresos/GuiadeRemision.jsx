import { useState, useRef } from "react";

/* ─── DATOS DEMO ─── */
const GR_INI = [
  { id:1, sucursal:'Tienda1', guia:'T001-000001', fecha:'2026-02-10',
    docVenta:'FI01-000041', tipTras:'Traslado entre establecimientos',
    cliente:'Empresa SAC', ruc:'20512345678', direccionOrigen:'Av. Lima 123, Lima',
    direccionDestino:'Jr. Cusco 456, Arequipa', vendedor:'Iturri, Quispe, Smith',
    transportista:'Trans Veloz SAC', placa:'ABC-123', estado:'Emitida', sunat:'OK' },
  { id:2, sucursal:'Tienda2', guia:'T002-000002', fecha:'2026-02-18',
    docVenta:'BI01-000023', tipTras:'Traslado por venta',
    cliente:'García López, María', ruc:'10456789012', direccionOrigen:'Jr. Arequipa 789, Lima',
    direccionDestino:'Av. El Sol 321, Cusco', vendedor:'Merino, Cahuna, Wilver Enmanuel',
    transportista:'Rápido Express SRL', placa:'XYZ-456', estado:'Pendiente', sunat:'BETA' },
  { id:3, sucursal:'Almacen 1', guia:'A001-000003', fecha:'2026-03-01',
    docVenta:'FI01-000042', tipTras:'Traslado por compra',
    cliente:'Alexander Paul, Moran Alburqueque', ruc:'10234567890',
    direccionOrigen:'Av. Industrial 500, Lima', direccionDestino:'Calle Real 789, Trujillo',
    vendedor:'Romero, Merino, Alexander Renson',
    transportista:'Norte Cargo SAC', placa:'LMN-789', estado:'Anulada', sunat:'ERROR' },
  { id:4, sucursal:'Tienda1', guia:'T001-000004', fecha:'2026-03-05',
    docVenta:'001-000018', tipTras:'Traslado entre establecimientos',
    cliente:'Empresa SAC', ruc:'20512345678', direccionOrigen:'Av. Lima 123, Lima',
    direccionDestino:'Av. Tupac Amaru 999, Lima', vendedor:'Iturri, Quispe, Smith',
    transportista:'Trans Veloz SAC', placa:'ABC-123', estado:'Emitida', sunat:'Enviado' },
];

const SUCURSALES  = ['Tienda1','Tienda2','Almacen 1'];
const TIPOS_TRAS  = ['Traslado entre establecimientos','Traslado por venta',
                     'Traslado por compra','Traslado por devolución','Otros'];
const ESTADOS_GR  = ['Emitida','Pendiente','Anulada','Borrador'];
const SUNAT_COLOR = { OK:'#28a745', ERROR:'#dc3545', BETA:'#6c757d', Enviado:'#17a2b8' };
const ESTADO_COLOR= { Emitida:'#28a745', Pendiente:'#e67e22', Anulada:'#dc3545', Borrador:'#6c757d' };

const hoy      = new Date().toISOString().split('T')[0];
const fmtFecha = iso => { if(!iso)return''; const[y,m,d]=iso.split('-'); return`${d}/${m}/${y}`; };
const padNum   = n => String(n).padStart(6,'0');
let   grSeq    = 5;

/* ── Generador HTML imprimible ── */
const htmlDoc = (titulo, colorHead, contenido) => `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><title>${titulo}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#212529;padding:24px;}
  .head{background:${colorHead};color:#fff;padding:14px 20px;border-radius:6px 6px 0 0;
    display:flex;justify-content:space-between;align-items:center;}
  .head h2{font-size:17px;font-weight:bold;}
  .box{border:1px solid #dee2e6;border-radius:6px;overflow:hidden;margin-bottom:16px;}
  .section{padding:14px 18px;}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
  .row{display:flex;gap:10px;margin-bottom:8px;}
  .lbl{font-weight:bold;min-width:130px;color:#555;font-size:12px;flex-shrink:0;}
  .val{font-size:13px;}
  table{width:100%;border-collapse:collapse;font-size:13px;margin-top:8px;}
  th{background:#003d6b;color:#fff;padding:8px;text-align:center;font-size:12px;}
  td{padding:7px 8px;border-bottom:1px solid #dee2e6;}
  .total-row td{background:#f0f0f0;font-weight:bold;}
  .badge{padding:3px 10px;border-radius:12px;font-size:11px;font-weight:bold;
    color:#fff;display:inline-block;}
  .firma{margin-top:40px;display:flex;justify-content:space-between;}
  .firma-box{text-align:center;border-top:1px solid #333;padding-top:6px;
    width:180px;font-size:12px;}
  .pie{text-align:center;font-size:11px;color:#888;margin-top:24px;padding-top:12px;
    border-top:1px solid #dee2e6;}
  @media print{body{padding:10px;} .no-print{display:none!important;}}
</style></head><body>
${contenido}
<div class="pie">© 2009-2026 INTELIGENTE — Generado el ${new Date().toLocaleString('es-PE')}</div>
<br class="no-print">
<div class="no-print">
  <button onclick="window.print()" style="background:#003d6b;color:#fff;border:none;
    padding:8px 20px;border-radius:4px;cursor:pointer;font-size:13px;margin-right:8px;">🖨 Imprimir</button>
  <button onclick="window.close()" style="background:#6c757d;color:#fff;border:none;
    padding:8px 20px;border-radius:4px;cursor:pointer;font-size:13px;">✕ Cerrar</button>
</div>
</body></html>`;

const abrirVentana = html => {
  const w = window.open('','_blank','width=950,height=720,scrollbars=1');
  w.document.write(html); w.document.close();
};

/* ── Documento Guía de Remisión ── */
const docGR = g => htmlDoc(`Guía de Remisión ${g.guia}`, '#003d6b', `
  <div class="box">
    <div class="head">
      <h2>📦 GUÍA DE REMISIÓN — REMITENTE</h2>
      <span style="font-size:13px;opacity:.9;">${g.guia}</span>
    </div>
    <div class="section">
      <div class="grid2">
        <div>
          <div class="row"><span class="lbl">Guía Nro:</span><span class="val"><b>${g.guia}</b></span></div>
          <div class="row"><span class="lbl">Fecha Emisión:</span><span class="val">${fmtFecha(g.fecha)}</span></div>
          <div class="row"><span class="lbl">Doc. Venta Ref.:</span><span class="val">${g.docVenta}</span></div>
          <div class="row"><span class="lbl">Tipo Traslado:</span><span class="val">${g.tipTras}</span></div>
          <div class="row"><span class="lbl">Sucursal:</span><span class="val">${g.sucursal}</span></div>
        </div>
        <div>
          <div class="row"><span class="lbl">Cliente:</span><span class="val"><b>${g.cliente}</b></span></div>
          <div class="row"><span class="lbl">RUC/DNI:</span><span class="val">${g.ruc}</span></div>
          <div class="row"><span class="lbl">Vendedor:</span><span class="val">${g.vendedor}</span></div>
          <div class="row"><span class="lbl">Estado:</span>
            <span class="val"><span class="badge" style="background:${ESTADO_COLOR[g.estado]||'#6c757d'}">${g.estado}</span></span>
          </div>
          <div class="row"><span class="lbl">SUNAT:</span>
            <span class="val"><span class="badge" style="background:${SUNAT_COLOR[g.sunat]||'#6c757d'}">${g.sunat}</span></span>
          </div>
        </div>
      </div>
      <hr style="border:none;border-top:1px dashed #dee2e6;margin:12px 0;">
      <div class="grid2">
        <div>
          <div style="font-weight:bold;color:#003d6b;margin-bottom:6px;font-size:12px;">📍 PUNTO DE PARTIDA</div>
          <div class="row"><span class="lbl">Dirección:</span><span class="val">${g.direccionOrigen}</span></div>
        </div>
        <div>
          <div style="font-weight:bold;color:#003d6b;margin-bottom:6px;font-size:12px;">🏁 PUNTO DE LLEGADA</div>
          <div class="row"><span class="lbl">Dirección:</span><span class="val">${g.direccionDestino}</span></div>
        </div>
      </div>
      <hr style="border:none;border-top:1px dashed #dee2e6;margin:12px 0;">
      <div class="grid2">
        <div>
          <div style="font-weight:bold;color:#003d6b;margin-bottom:6px;font-size:12px;">🚛 DATOS DEL TRANSPORTISTA</div>
          <div class="row"><span class="lbl">Transportista:</span><span class="val">${g.transportista}</span></div>
          <div class="row"><span class="lbl">Placa:</span><span class="val"><b>${g.placa}</b></span></div>
        </div>
      </div>
    </div>
  </div>
  <div class="box">
    <table>
      <thead><tr><th>#</th><th>Descripción / Artículo</th><th>Unidad</th><th>Cantidad</th><th>Peso (kg)</th></tr></thead>
      <tbody>
        <tr><td>1</td><td>Mercadería referenciada en ${g.docVenta}</td><td>UND</td><td>1</td><td>—</td></tr>
      </tbody>
    </table>
  </div>
  <div class="firma">
    <div class="firma-box">Firma Remitente</div>
    <div class="firma-box">Firma Transportista</div>
    <div class="firma-box">Firma Destinatario</div>
  </div>`);

/* ── Ticket Guía ── */
const docTicket = g => htmlDoc(`Ticket Guía ${g.guia}`, '#17a2b8', `
  <div style="max-width:320px;margin:0 auto;font-family:monospace;font-size:12px;
    border:1px dashed #999;padding:16px;line-height:1.9;">
    <div style="text-align:center;font-weight:bold;font-size:14px;">INTELIGENTE</div>
    <div style="text-align:center;font-size:11px;margin-bottom:10px;">RUC: 20512345678</div>
    <div style="border-top:1px dashed #999;border-bottom:1px dashed #999;padding:5px 0;
      margin-bottom:8px;text-align:center;"><b>GUÍA DE REMISIÓN</b><br/>${g.guia}</div>
    <div>Fecha   : ${fmtFecha(g.fecha)}</div>
    <div>Sucursal: ${g.sucursal}</div>
    <div>Cliente : ${g.cliente}</div>
    <div>Doc.Vta : ${g.docVenta}</div>
    <div>Tip.Tra.: ${g.tipTras.substring(0,22)}...</div>
    <div style="border-top:1px dashed #999;margin:8px 0;"></div>
    <div>Origen  : ${g.direccionOrigen.substring(0,25)}</div>
    <div>Destino : ${g.direccionDestino.substring(0,25)}</div>
    <div style="border-top:1px dashed #999;margin:8px 0;"></div>
    <div>Transp. : ${g.transportista}</div>
    <div>Placa   : <b>${g.placa}</b></div>
    <div style="border-top:1px dashed #999;margin:8px 0;"></div>
    <div style="text-align:center;">SUNAT: <b>${g.sunat}</b></div>
  </div>`);

/* ── XML Guía ── */
const xmlGR = g => `<?xml version="1.0" encoding="UTF-8"?>
<DespatchAdvice xmlns="urn:oasis:names:specification:ubl:schema:xsd:DespatchAdvice-2"
  xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
  xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2">
  <cbc:ID>${g.guia}</cbc:ID>
  <cbc:IssueDate>${g.fecha}</cbc:IssueDate>
  <cbc:DespatchAdviceTypeCode>${g.tipTras==='Traslado por venta'?'01':'09'}</cbc:DespatchAdviceTypeCode>
  <cac:DespatchSupplierParty>
    <cac:Party>
      <cac:PartyName><cbc:Name>EMPRESA INTELIGENTE SAC</cbc:Name></cac:PartyName>
      <cac:PartyTaxScheme><cbc:CompanyID>20512345678</cbc:CompanyID></cac:PartyTaxScheme>
    </cac:Party>
  </cac:DespatchSupplierParty>
  <cac:DeliveryCustomerParty>
    <cac:Party>
      <cac:PartyName><cbc:Name>${g.cliente}</cbc:Name></cac:PartyName>
      <cac:PartyTaxScheme><cbc:CompanyID>${g.ruc}</cbc:CompanyID></cac:PartyTaxScheme>
    </cac:Party>
  </cac:DeliveryCustomerParty>
  <cac:Shipment>
    <cbc:ID>1</cbc:ID>
    <cac:TransportHandlingUnit>
      <cbc:TransportHandlingUnitTypeCode>${g.tipTras}</cbc:TransportHandlingUnitTypeCode>
    </cac:TransportHandlingUnit>
    <cac:OriginAddress>
      <cbc:StreetName>${g.direccionOrigen}</cbc:StreetName>
    </cac:OriginAddress>
    <cac:Delivery>
      <cac:DeliveryAddress>
        <cbc:StreetName>${g.direccionDestino}</cbc:StreetName>
      </cac:DeliveryAddress>
    </cac:Delivery>
    <cac:TransportMeans>
      <cac:RoadTransport><cbc:LicensePlateID>${g.placa}</cbc:LicensePlateID></cac:RoadTransport>
    </cac:TransportMeans>
    <cac:CarrierParty>
      <cac:Party><cac:PartyName><cbc:Name>${g.transportista}</cbc:Name></cac:PartyName></cac:Party>
    </cac:CarrierParty>
  </cac:Shipment>
</DespatchAdvice>`;

/* ─── CSS ─── */
const css = `
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#212529;}
  .gr-bar{display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;margin-bottom:18px;}
  .gr-bar label{font-size:12px;font-weight:bold;display:block;margin-bottom:3px;color:#555;}
  .gr-bar input[type=text]{padding:5px 10px;border:1px solid #ced4da;border-radius:4px;
    font-size:13px;color:#212529;background:#fff;}
  .gr-radio{display:flex;gap:10px;align-items:center;font-size:13px;}
  .gr-radio label{display:flex;align-items:center;gap:4px;cursor:pointer;
    font-weight:bold;color:#212529;}
  .gr-radio input[type=radio]{accent-color:#17a2b8;width:14px;height:14px;}
  .gr-dw{display:flex;align-items:center;gap:5px;border:1px solid #ced4da;
    border-radius:4px;padding:4px 8px;background:#fff;height:32px;min-width:130px;}
  .gr-dw span.gr-dt{font-size:13px;color:#212529;min-width:85px;}
  .btn-gr{border:none;color:#fff;padding:7px 14px;border-radius:4px;cursor:pointer;
    font-size:13px;font-weight:bold;display:inline-flex;align-items:center;gap:5px;}
  .btn-gr:hover{opacity:.88;}
  /* tabla */
  .gr-titulo{text-align:center;font-weight:bold;font-size:14px;margin-bottom:8px;
    letter-spacing:.5px;}
  table.tgr{width:100%;border-collapse:collapse;font-size:13px;}
  table.tgr thead tr{background:#003d6b;}
  table.tgr thead th{padding:10px 8px;text-align:center;color:#fff;font-weight:bold;
    font-size:12px;letter-spacing:.3px;}
  table.tgr thead th .sort{cursor:pointer;opacity:.7;margin-left:3px;font-size:11px;}
  table.tgr thead th .sort:hover{opacity:1;}
  table.tgr tbody tr{border-bottom:1px solid #dee2e6;background:#fff;}
  table.tgr tbody tr:hover{background:#e8f4f8;}
  table.tgr tbody td{padding:8px 8px;vertical-align:middle;color:#212529;}
  .badge{padding:3px 9px;border-radius:12px;font-size:11px;font-weight:bold;
    color:#fff;display:inline-block;}
  .ic{background:none;border:none;cursor:pointer;padding:1px 3px;
    display:inline-flex;align-items:center;}
  .ic:hover{opacity:.8;transform:scale(1.18);}
  .ic-span{display:inline-flex;align-items:center;justify-content:center;
    border-radius:4px;padding:3px 7px;font-size:12px;font-weight:bold;
    color:#fff;min-width:26px;}
  /* modal */
  .mgr-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:3000;
    display:flex;align-items:center;justify-content:center;}
  .mgr-box{background:#fff;border-radius:8px;min-width:480px;max-width:640px;
    width:94%;box-shadow:0 8px 32px rgba(0,0,0,.25);overflow:hidden;}
  .mgr-head{padding:13px 20px;display:flex;justify-content:space-between;
    align-items:center;color:#fff;font-weight:bold;font-size:15px;}
  .mgr-body{padding:20px;max-height:68vh;overflow-y:auto;}
  .mgr-footer{padding:12px 20px;display:flex;gap:8px;justify-content:flex-end;
    border-top:1px solid #dee2e6;background:#f8f9fa;flex-wrap:wrap;}
  .mgr-btn{padding:7px 16px;border:none;border-radius:4px;cursor:pointer;
    font-size:13px;font-weight:bold;color:#fff;}
  .mgr-row{display:flex;gap:10px;margin-bottom:10px;align-items:flex-start;}
  .mgr-label{font-weight:bold;font-size:12px;min-width:130px;color:#555;
    flex-shrink:0;padding-top:4px;}
  .mgr-inp{padding:6px 10px;border:1px solid #ced4da;border-radius:4px;
    font-size:13px;color:#212529;background:#fff;width:100%;}
  .resumen-box{background:#f8f9fa;border:1px solid #dee2e6;border-radius:6px;
    padding:10px 14px;margin-bottom:14px;font-size:13px;}
  .xml-pre{font-family:monospace;font-size:11px;background:#1e1e1e;color:#d4d4d4;
    border-radius:6px;padding:14px;white-space:pre;overflow-x:auto;max-height:300px;
    overflow-y:auto;line-height:1.5;}
  /* vista nuevo */
  .gr-nuevo-wrap{max-width:860px;}
  .gr-nuevo-titulo{font-size:17px;font-weight:bold;margin-bottom:16px;}
  .gr-inp{padding:6px 10px;border:1px solid #ced4da;border-radius:4px;
    font-size:13px;color:#212529;background:#fff;width:100%;}
  .gr-inp-v{padding:6px 10px;border:2px solid #28a745;border-radius:4px;
    font-size:13px;color:#212529;background:#ccff99;width:100%;}
  .gr-label{font-size:12px;font-weight:bold;margin-bottom:3px;color:#555;display:block;}
  .alert-ok{background:#d4edda;border:1px solid #c3e6cb;color:#155724;padding:8px 14px;
    border-radius:4px;margin-bottom:12px;font-size:13px;}
  .alert-err{background:#f8d7da;border:1px solid #f5c6cb;color:#721c24;padding:8px 14px;
    border-radius:4px;margin-bottom:12px;font-size:13px;}
  @media print{.no-print{display:none!important;}}
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
    <div className="gr-dw" style={verde?{border:'2px solid #28a745',background:'#ccff99'}:{}}>
      <span className="gr-dt">{value?value.split('-').reverse().join('/'):''}</span>
      <span style={{cursor:'pointer'}}
        onClick={()=>ref.current.showPicker?.()??ref.current.click()}><IcoCal/></span>
      <input ref={ref} id={id} type="date" value={value}
        onChange={e=>onChange(e.target.value)}
        style={{opacity:0,width:1,height:1,position:'absolute',pointerEvents:'none'}}/>
    </div>
  );
};

/* ─── DATOS ARTÍCULOS ─── */
const ARTS_DB = [
  { codigo:'ART-001', articulo:'Laptop HP 15s',           stock:10, med:'UND', pventa:'2500.00', igv:'Gravado - Oper' },
  { codigo:'ART-002', articulo:'Mouse Logitech MX',        stock:25, med:'UND', pventa:'120.00',  igv:'Gravado - Oper' },
  { codigo:'ART-003', articulo:'Teclado Mecánico Redragon',stock:15, med:'UND', pventa:'180.00',  igv:'Gravado - Oper' },
  { codigo:'ART-004', articulo:'Monitor Samsung 24"',      stock:8,  med:'UND', pventa:'950.00',  igv:'Gravado - Oper' },
  { codigo:'ART-005', articulo:'Silla Ergonómica',         stock:5,  med:'UND', pventa:'650.00',  igv:'Gravado - Oper' },
  { codigo:'ART-006', articulo:'Escritorio de Madera',     stock:3,  med:'UND', pventa:'450.00',  igv:'Gravado - Oper' },
  { codigo:'ART-007', articulo:'Cable HDMI 2m',            stock:50, med:'UND', pventa:'25.00',   igv:'Gravado - Oper' },
  { codigo:'ART-008', articulo:'Auriculares Sony WH',      stock:12, med:'UND', pventa:'320.00',  igv:'Gravado - Oper' },
];

/* ─── BUSCADOR ARTÍCULOS ─── */
function BuscadorArticulos({ onAgregar }) {
  const [bxTipo, setBxTipo] = useState('Nombre');
  const [bxQ,    setBxQ]    = useState('');
  const [fila,   setFila]   = useState({
    codigo:'', articulo:'', stock:'', med:'Und.',
    pventa:'', cant:'1', igv:'Gravado - Oper', pmcosto:'0.00'
  });

  const resultados = bxQ
    ? ARTS_DB.filter(a =>
        bxTipo === 'Nombre'
          ? a.articulo.toLowerCase().includes(bxQ.toLowerCase())
          : a.codigo.toLowerCase().includes(bxQ.toLowerCase()))
    : [];

  const seleccionar = a => {
    setFila(f => ({...f, codigo:a.codigo, articulo:a.articulo,
      stock:String(a.stock), pventa:a.pventa, igv:a.igv}));
    setBxQ('');
  };

  const limpiarFila = () => setFila({
    codigo:'', articulo:'', stock:'', med:'Und.',
    pventa:'', cant:'1', igv:'Gravado - Oper', pmcosto:'0.00'
  });

  return (
    <div style={{background:'#f0f0f0',borderRadius:6,padding:'10px 14px',marginTop:8}}>
      {/* barra búsqueda */}
      <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:8,flexWrap:'wrap'}}>
        <span style={{fontWeight:'bold',fontSize:12}}>BUSQUEDA DE ARTICULOS x</span>
        <select style={{padding:'4px 6px',border:'1px solid #ced4da',borderRadius:4,fontSize:12,background:'#fff'}}
          value={bxTipo} onChange={e=>setBxTipo(e.target.value)}>
          <option>Nombre</option>
          <option>Codigo</option>
        </select>
        <input value={bxQ} onChange={e=>setBxQ(e.target.value)}
          style={{padding:'5px 10px',border:'2px solid #28a745',borderRadius:4,
            background:'#ccff99',fontSize:13,color:'#212529',width:280}}
          placeholder="Buscar artículo..."/>
        <button style={{background:'#17a2b8',border:'none',color:'#fff',padding:'6px 14px',
          borderRadius:4,cursor:'pointer',fontSize:12,fontWeight:'bold',
          display:'inline-flex',alignItems:'center',gap:4}}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2"/>
          </svg> Buscar
        </button>
        <button onClick={limpiarFila}
          style={{background:'#17a2b8',border:'none',color:'#fff',padding:'6px 10px',
            borderRadius:4,cursor:'pointer',fontSize:13}}>↺</button>
      </div>
      {/* dropdown resultados */}
      {resultados.length > 0 && (
        <div style={{background:'#fff',border:'1px solid #dee2e6',borderRadius:4,
          marginBottom:8,maxHeight:140,overflowY:'auto'}}>
          {resultados.map(a => (
            <div key={a.codigo} onClick={() => seleccionar(a)}
              style={{padding:'6px 10px',cursor:'pointer',fontSize:12,
                borderBottom:'1px solid #f0f0f0',display:'flex',gap:10}}
              onMouseEnter={e => e.currentTarget.style.background='#e8f4f8'}
              onMouseLeave={e => e.currentTarget.style.background='#fff'}>
              <span style={{color:'#003d6b',fontWeight:'bold',minWidth:80}}>{a.codigo}</span>
              <span>{a.articulo}</span>
              <span style={{marginLeft:'auto',color:'#28a745'}}>S/ {a.pventa}</span>
            </div>
          ))}
        </div>
      )}
      {/* tabla fila */}
      <div style={{overflowX:'auto'}}>
        <table className="tgr">
          <thead>
            <tr>
              <th width="8%">CODIGO</th>
              <th width="25%">ARTICULOS/DETALLE</th>
              <th width="7%">STOCK</th>
              <th width="7%">MED.</th>
              <th width="9%">P-M/C</th>
              <th width="9%">P.VENTA</th>
              <th width="6%">CANT.</th>
              <th width="13%">T.A.IGV</th>
              <th width="5%">AGRE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input value={fila.codigo} onChange={e=>setFila(f=>({...f,codigo:e.target.value}))}
                  style={{width:'100%',padding:'4px 6px',border:'1px solid #ced4da',borderRadius:3,fontSize:12,background:'#fff',color:'#212529'}}/>
              </td>
              <td>
                <textarea value={fila.articulo} onChange={e=>setFila(f=>({...f,articulo:e.target.value}))}
                  style={{width:'100%',padding:'4px 6px',border:'1px solid #ced4da',
                    borderRadius:3,fontSize:12,resize:'none',height:34,background:'#fff',color:'#212529'}}
                  placeholder="Articulo/descripcion"/>
              </td>
              <td align="center" style={{fontSize:12,color:'#555'}}>{fila.stock}</td>
              <td>
                <select value={fila.med} onChange={e=>setFila(f=>({...f,med:e.target.value}))}
                  style={{width:'100%',padding:'3px',fontSize:12,border:'1px solid #ced4da',borderRadius:3,background:'#fff',color:'#212529'}}>
                  {['Und.','Kg.','Lt.','Mt.','Cja.','Par','Doc.'].map(m=><option key={m}>{m}</option>)}
                </select>
              </td>
              <td>
                <input value={fila.pmcosto} onChange={e=>setFila(f=>({...f,pmcosto:e.target.value}))}
                  style={{width:'100%',padding:'4px 6px',border:'1px solid #ced4da',borderRadius:3,fontSize:12,background:'#fff',color:'#212529'}}
                  type="number" placeholder="0.00"/>
              </td>
              <td>
                <input value={fila.pventa} onChange={e=>setFila(f=>({...f,pventa:e.target.value}))}
                  style={{width:'100%',padding:'4px 6px',border:'1px solid #ced4da',borderRadius:3,fontSize:12,background:'#fff',color:'#212529'}}
                  type="number" placeholder="0.00"/>
              </td>
              <td>
                <input value={fila.cant} onChange={e=>setFila(f=>({...f,cant:e.target.value}))}
                  style={{width:'100%',padding:'4px 6px',border:'1px solid #ced4da',borderRadius:3,fontSize:12,background:'#fff',color:'#212529'}}
                  type="number" min="1"/>
              </td>
              <td>
                <select value={fila.igv} onChange={e=>setFila(f=>({...f,igv:e.target.value}))}
                  style={{width:'100%',padding:'3px',fontSize:11,border:'1px solid #ced4da',borderRadius:3,background:'#fff',color:'#212529'}}>
                  {['Gravado - Oper','Exonerado','Inafecto','Gratuito'].map(t=><option key={t}>{t}</option>)}
                </select>
              </td>
              <td align="center">
                <button onClick={() => {
                  if (!fila.articulo) return;
                  onAgregar({...fila});
                  limpiarFila();
                }}
                  style={{background:'#17a2b8',border:'2px solid #138496',color:'#fff',
                    borderRadius:4,padding:'4px 8px',cursor:'pointer',fontSize:16}}>
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

/* ═══════════════════════ COMPONENTE ═══════════════════════ */
export default function GuiaRemision() {
  const [guias,  setGuias]  = useState(GR_INI);
  const [vista,  setVista]  = useState('lista'); // 'lista' | 'nuevo' | 'detalle'
  const [alert,  setAlert]  = useState('');
  const [modal,  setModal]  = useState(null); // {tipo, guia}

  /* filtros */
  const [bTipo, setBTipo] = useState('1');
  const [bq,    setBq]    = useState('');
  const [bfi,   setBfi]   = useState('');
  const [bff,   setBff]   = useState('');
  const [orden, setOrden] = useState({col:'',dir:'asc'});

  /* form nuevo */
  const [fSuc,    setFSuc]    = useState(SUCURSALES[0]);
  const [fFecha,  setFFecha]  = useState(hoy);
  const [fGuia,   setFGuia]   = useState('');
  const [fDocV,   setFDocV]   = useState('');
  const [fTipT,   setFTipT]   = useState(TIPOS_TRAS[0]);
  const [fCli,    setFCli]    = useState('');
  const [fRuc,    setFRuc]    = useState('');
  const [fOrig,   setFOrig]   = useState('');
  const [fDest,   setFDest]   = useState('');
  const [fTrans,  setFTrans]  = useState('');
  const [fPlaca,  setFPlaca]  = useState('');
  const [fVend,   setFVend]   = useState('');
  const [fEst,    setFEst]    = useState('Emitida');

  /* modal form */
  const [mEst,   setMEst]   = useState('');
  const [mTrans, setMTrans] = useState('');
  const [mPlaca, setMPlaca] = useState('');
  const [mObs,   setMObs]   = useState('');

  /* detalle */
  const [dTipo, setDTipo] = useState('1');
  const [dq,    setDq]    = useState('');
  const [dfi,   setDfi]   = useState('');
  const [dff,   setDff]   = useState('');

  const DET_INI = [
    { id:1, gr:'T001-000001', entre:'15/02/2026', trasl:'15/02/2026',
      partida:'Av. Lima 123, Lima', llegada:'Jr. Cusco 456, Arequipa',
      cliente:'Empresa SAC', vend:'Iturri', conductor:'Juan Pérez Quispe',
      orden:'FI01-000041', tipTras:'Traslado por venta',
      codigo:'ART-001', articulo:'Laptop HP 15s', cant:2, p:'UND' },
    { id:2, gr:'T001-000001', entre:'15/02/2026', trasl:'15/02/2026',
      partida:'Av. Lima 123, Lima', llegada:'Jr. Cusco 456, Arequipa',
      cliente:'Empresa SAC', vend:'Iturri', conductor:'Juan Pérez Quispe',
      orden:'FI01-000041', tipTras:'Traslado por venta',
      codigo:'ART-002', articulo:'Mouse Logitech MX', cant:5, p:'UND' },
    { id:3, gr:'T002-000002', entre:'20/02/2026', trasl:'20/02/2026',
      partida:'Jr. Arequipa 789, Lima', llegada:'Av. El Sol 321, Cusco',
      cliente:'García López, María', vend:'Merino', conductor:'Carlos Ramos Díaz',
      orden:'BI01-000023', tipTras:'Traslado entre establecimientos',
      codigo:'ART-005', articulo:'Silla Ergonómica', cant:3, p:'UND' },
    { id:4, gr:'A001-000003', entre:'05/03/2026', trasl:'05/03/2026',
      partida:'Av. Industrial 500, Lima', llegada:'Calle Real 789, Trujillo',
      cliente:'Alexander Paul, Moran Alburqueque', vend:'Romero',
      conductor:'Luis Torres Vega', orden:'FI01-000042',
      tipTras:'Traslado por compra', codigo:'ART-010',
      articulo:'Monitor Samsung 24"', cant:1, p:'UND' },
    { id:5, gr:'T001-000004', entre:'08/03/2026', trasl:'08/03/2026',
      partida:'Av. Lima 123, Lima', llegada:'Av. Tupac Amaru 999, Lima',
      cliente:'Empresa SAC', vend:'Iturri', conductor:'Juan Pérez Quispe',
      orden:'001-000018', tipTras:'Traslado entre establecimientos',
      codigo:'ART-003', articulo:'Teclado Mecánico Redragon', cant:4, p:'UND' },
  ];

  const detFilt = DET_INI.filter(d => {
    if (dq) {
      const q = dq.toLowerCase();
      if (dTipo==='1' && !d.gr.toLowerCase().includes(q))        return false;
      if (dTipo==='2' && !d.cliente.toLowerCase().includes(q))   return false;
      if (dTipo==='3' && !d.vend.toLowerCase().includes(q))      return false;
      if (dTipo==='4' && !d.articulo.toLowerCase().includes(q))  return false;
      if (dTipo==='5' && !d.conductor.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const [articulosNuevo, setArticulosNuevo] = useState([]);

  const showAlert = msg => { setAlert(msg); setTimeout(()=>setAlert(''),3500); };

  const exportarCSV = () => {
    const cab  = 'GR,Entre.,Trasl.,Partida,Llegada,Cliente,Vend.,Conductor,Orden,Tip.Tras.,Codigo,Articulo,Cant.,P.\n';
    const filas = detFilt.map(d=>
      `${d.gr},${d.entre},${d.trasl},"${d.partida}","${d.llegada}","${d.cliente}",${d.vend},"${d.conductor}",${d.orden},"${d.tipTras}",${d.codigo},"${d.articulo}",${d.cant},${d.p}`
    ).join('\n');
    const blob = new Blob(['\uFEFF'+cab+filas],{type:'text/csv;charset=utf-8'});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href=url; a.download='guia_remision_detalle.csv'; a.click();
    URL.revokeObjectURL(url);
  };


  const resetForm = () => {
    setFFecha(hoy); setFSuc(SUCURSALES[0]); setFGuia(''); setFDocV('');
    setFTipT(TIPOS_TRAS[0]); setFCli(''); setFRuc(''); setFOrig('');
    setFDest(''); setFTrans(''); setFPlaca(''); setFVend(''); setFEst('Emitida');
  };

  const abrir = (tipo, guia) => {
    setModal({tipo, guia});
    setMEst(guia.estado); setMTrans(guia.transportista);
    setMPlaca(guia.placa); setMObs('');
  };

  /* ordenar */
  const sortBy = col => {
    setOrden(o => o.col===col ? {...o,dir:o.dir==='asc'?'desc':'asc'} : {col,dir:'asc'});
  };

  /* filtrado + ordenado */
  let lista = guias.filter(g => {
    if (bq) {
      const q = bq.toLowerCase();
      if (bTipo==='1' && !g.guia.toLowerCase().includes(q))    return false;
      if (bTipo==='2' && !g.cliente.toLowerCase().includes(q)) return false;
      if (bTipo==='3' && !g.vendedor.toLowerCase().includes(q))return false;
    }
    if (bfi && g.fecha < bfi) return false;
    if (bff && g.fecha > bff) return false;
    return true;
  });
  if (orden.col) {
    lista = [...lista].sort((a,b) => {
      const av=a[orden.col]||'', bv=b[orden.col]||'';
      return orden.dir==='asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }

  const guardarNuevo = () => {
    if (!fCli)  { showAlert('err:Ingrese el cliente');      return; }
    if (!fOrig) { showAlert('err:Ingrese la dirección de origen');  return; }
    if (!fDest) { showAlert('err:Ingrese la dirección de destino'); return; }
    const num = `T00${grSeq++}-${padNum(guias.length+1)}`;
    setGuias(prev=>[{
      id:Date.now(), sucursal:fSuc, guia:num, fecha:fFecha,
      docVenta:fDocV, tipTras:fTipT, cliente:fCli, ruc:fRuc,
      direccionOrigen:fOrig, direccionDestino:fDest,
      vendedor:fVend, transportista:fTrans, placa:fPlaca,
      estado:fEst, sunat:'BETA',
    },...prev]);
    showAlert('ok:Guía de Remisión registrada correctamente.');
    setVista('lista');
  };

  /* descarga XML */
  const descargarXML = g => {
    const blob=new Blob([xmlGR(g)],{type:'application/xml'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url;
    a.download=`${g.guia}.xml`; a.click(); URL.revokeObjectURL(url);
  };

  const SortIco = ({col}) => (
    <span style={{cursor:'pointer',marginLeft:4,opacity:.8,fontSize:11}}
      onClick={()=>sortBy(col)}>
      {orden.col===col ? (orden.dir==='asc' ? '▲' : '▼') : '⇅'}
    </span>
  );

  /* ════════ MODALES ════════ */
  const ModalResumen = ({ g }) => (
    <div className="resumen-box">
      {[['Guía Nro', <b key="g">{g.guia}</b>], ['Fecha', fmtFecha(g.fecha)],
        ['Doc.Venta', g.docVenta], ['Cliente', g.cliente],
        ['Tipo Traslado', g.tipTras],
        ['Origen', g.direccionOrigen], ['Destino', g.direccionDestino],
        ['Transportista', g.transportista], ['Placa', g.placa],
      ].map(([l, v]) => (
        <div key={l} className="mgr-row" style={{marginBottom:4}}>
          <span className="mgr-label">{l}:</span>
          <span style={{fontSize:13}}>{v}</span>
        </div>
      ))}
    </div>
  );

  const ModalWrap = ({ color, titulo, children, footer }) => (
    <div className="mgr-overlay no-print" onClick={() => setModal(null)}>
      <div className="mgr-box" onClick={e => e.stopPropagation()}>
        <div className="mgr-head" style={{background: color}}>
          {titulo}
          <span style={{cursor:'pointer', fontSize:18}} onClick={() => setModal(null)}>✕</span>
        </div>
        <div className="mgr-body">{children}</div>
        <div className="mgr-footer">{footer}</div>
      </div>
    </div>
  );

  const renderModal = () => {
    if (!modal) return null;
    const g = modal.guia;

    if (modal.tipo === 'editar') return (
      <ModalWrap color="#e67e22" titulo={`✏ Actualizar / Eliminar — ${g.guia}`}
        footer={<>
          <button className="mgr-btn" style={{background:'#e67e22'}}
            onClick={() => {
              setGuias(p => p.map(x => x.id===g.id
                ? {...x, estado:mEst, transportista:mTrans, placa:mPlaca} : x));
              setModal(null); showAlert('ok:Guía actualizada correctamente.');
            }}>💾 Actualizar</button>
          <button className="mgr-btn" style={{background:'#003d6b'}}
            onClick={() => { abrirVentana(docGR({...g, estado:mEst})); }}>
            📦 Ver Guía</button>
          <button className="mgr-btn" style={{background:'#dc3545'}}
            onClick={() => {
              if (!window.confirm(`¿Eliminar ${g.guia}?`)) return;
              setGuias(p => p.filter(x => x.id !== g.id));
              setModal(null); showAlert('ok:Guía eliminada.');
            }}>🗑 Eliminar</button>
          <button className="mgr-btn" style={{background:'#6c757d'}}
            onClick={() => setModal(null)}>✕ Cancelar</button>
        </>}>
        <ModalResumen g={g}/>
        <div className="mgr-row">
          <span className="mgr-label">Transportista:</span>
          <input className="mgr-inp" value={mTrans} onChange={e => setMTrans(e.target.value)}/>
        </div>
        <div className="mgr-row">
          <span className="mgr-label">Placa:</span>
          <input className="mgr-inp" value={mPlaca} onChange={e => setMPlaca(e.target.value)}/>
        </div>
        <div className="mgr-row">
          <span className="mgr-label">Estado:</span>
          <select className="mgr-inp" value={mEst} onChange={e => setMEst(e.target.value)}>
            {ESTADOS_GR.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="mgr-row">
          <span className="mgr-label">Observación:</span>
          <textarea className="mgr-inp" rows={2} value={mObs}
            onChange={e => setMObs(e.target.value)} style={{resize:'none'}}/>
        </div>
      </ModalWrap>
    );

    if (modal.tipo === 'xml') return (
      <ModalWrap color="#555" titulo={`</> XML SUNAT — ${g.guia}`}
        footer={<>
          <button className="mgr-btn" style={{background:'#555'}}
            onClick={() => { descargarXML(g); setModal(null); showAlert('ok:XML descargado.'); }}>
            ⬇ Descargar XML</button>
          <button className="mgr-btn" style={{background:'#6c757d'}}
            onClick={() => setModal(null)}>✕ Cerrar</button>
        </>}>
        <ModalResumen g={g}/>
        <div className="xml-pre">{xmlGR(g)}</div>
      </ModalWrap>
    );

    if (modal.tipo === 'sunat') return (
      <ModalWrap color="#e67e22" titulo={`📖 Ticket SUNAT — ${g.guia}`}
        footer={<>
          <button className="mgr-btn" style={{background:'#003d6b'}}
            onClick={() => { abrirVentana(docGR(g)); setModal(null); }}>
            📦 Ver Guía</button>
          <button className="mgr-btn" style={{background:'#e67e22'}}
            onClick={() => { abrirVentana(docTicket(g)); setModal(null); }}>
            🖨 Ticket</button>
          <button className="mgr-btn" style={{background:'#17a2b8'}}
            onClick={() => window.open('https://e-consulta.sunat.gob.pe/ol-ti-itconsvalicpe/ConsValiCpe.htm','_blank')}>
            🌐 Portal SUNAT</button>
          <button className="mgr-btn" style={{background:'#6c757d'}}
            onClick={() => setModal(null)}>✕ Cerrar</button>
        </>}>
        <ModalResumen g={g}/>
        <div className="mgr-row">
          <span className="mgr-label">Estado SUNAT:</span>
          <span className="badge"
            style={{background: SUNAT_COLOR[g.sunat]||'#6c757d', fontSize:13, padding:'4px 12px'}}>
            {g.sunat}
          </span>
        </div>
        <div style={{background:'#fff3cd', border:'1px solid #ffc107', borderRadius:6,
          padding:'10px 14px', fontSize:13, color:'#856404', marginTop:10}}>
          Use <b>Portal SUNAT</b> para verificar el comprobante en línea.
        </div>
      </ModalWrap>
    );

    return null;
  };

  /* ════════ RENDER ════════ */
  return (
    <>
      <style>{css}</style>

      {alert && (
        <div className={alert.startsWith('ok:')?'alert-ok':'alert-err'}>
          {alert.startsWith('ok:')?'✅ ':'⚠️ '}{alert.slice(3)}
        </div>
      )}

      {/* ══ VISTA LISTA ══ */}
      {vista==='lista' && (<>

        {/* título + botón detalle */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}
          className="no-print">
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <span style={{background:'#0099ff',color:'#fff',borderRadius:'50%',width:22,height:22,
              display:'inline-flex',alignItems:'center',justifyContent:'center',
              fontSize:13,fontWeight:'bold',cursor:'pointer'}} title="Ayuda">?</span>
            <span style={{fontSize:16,fontWeight:'bold'}}>Guia de Remision</span>
          </div>
          <button className="btn-gr" style={{background:'#17a2b8',fontSize:12}}
            title="Detalle de Guía de Remisión"
            onClick={()=>setVista('detalle')}>
            ☰ Detalle de Guia de Remision
          </button>
        </div>

        {/* barra búsqueda */}
        <div className="gr-bar no-print">
          <div>
            <div style={{fontWeight:'bold',fontSize:13,marginBottom:4}}>BUSCAR X</div>
            <div className="gr-radio" style={{marginBottom:6}}>
              {[['1','Nro Guia'],['2','clientes'],['3','Vendedor']].map(([v,l])=>(
                <label key={v}>
                  <input type="radio" name="grTipo" value={v}
                    checked={bTipo===v} onChange={()=>setBTipo(v)}/> {l} /
                </label>
              ))}
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <input type="text" value={bq} onChange={e=>setBq(e.target.value)}
                placeholder="Ingrese texto a buscar" style={{width:280}}/>
              <span style={{fontWeight:'bold',fontSize:13}}>y/o</span>
            </div>
          </div>
          <div><label>Fecha Inicio</label><DP id="grFI" value={bfi} onChange={setBfi}/></div>
          <div><label>Fecha Fin</label><DP id="grFF" value={bff} onChange={setBff}/></div>
          <button className="btn-gr" style={{background:'#17a2b8'}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2"/>
            </svg> Buscar
          </button>
          <button className="btn-gr" style={{background:'#17a2b8'}}
            onClick={()=>{ resetForm(); setVista('nuevo'); }}>
            <span style={{fontSize:16,fontWeight:'bold'}}>+</span> Agregar Nuevo
          </button>
        </div>

        {/* tabla */}
        <div className="gr-titulo">LISTADO GENERAL GUIA DE REMISION</div>
        <table className="tgr">
          <thead>
            <tr>
              <th>Sucursal</th>
              <th>Guia nro <SortIco col="guia"/></th>
              <th>Fecha <SortIco col="fecha"/></th>
              <th>Doc.Venta</th>
              <th>Tip.Tras.</th>
              <th>Cliente</th>
              <th>Estado</th>
              <th>Sunat</th>
              <th width="9%">Opciones</th>
            </tr>
          </thead>
          <tbody>
            {lista.length===0
              ? <tr><td colSpan={9} align="center" style={{padding:20,color:'#888'}}>Sin registros</td></tr>
              : lista.map(g=>(
                <tr key={g.id}>
                  <td>{g.sucursal}</td>
                  <td><b>{g.guia}</b></td>
                  <td align="center">{fmtFecha(g.fecha)}</td>
                  <td>{g.docVenta}</td>
                  <td style={{maxWidth:160,fontSize:12}}>{g.tipTras}</td>
                  <td>{g.cliente}</td>
                  <td align="center">
                    <span className="badge" style={{background:ESTADO_COLOR[g.estado]||'#6c757d'}}>
                      {g.estado}
                    </span>
                  </td>
                  <td align="center">
                    <span className="badge" style={{background:SUNAT_COLOR[g.sunat]||'#6c757d'}}>
                      {g.sunat}
                    </span>
                  </td>
                  <td align="center" style={{whiteSpace:'nowrap'}}>
                    {/* ✏ Editar */}
                    <button className="ic no-print" title="Actualizar / Eliminar"
                      onClick={()=>abrir('editar',g)}>
                      <span className="ic-span" style={{background:'#e67e22'}}>✏</span>
                    </button>
                    {/* 🖨 Imprimir Guía */}
                    <button className="ic no-print" title="Imprimir Guía de Remisión"
                      onClick={()=>abrirVentana(docGR(g))}>
                      <span className="ic-span" style={{background:'#003d6b'}}>📦</span>
                    </button>
                    {/* Ticket */}
                    <button className="ic no-print" title="Imprimir Ticket"
                      onClick={()=>abrirVentana(docTicket(g))}>
                      <span className="ic-span" style={{background:'#17a2b8'}}>🖨</span>
                    </button>
                    {/* XML */}
                    <button className="ic no-print" title="Exportar XML SUNAT"
                      onClick={()=>abrir('xml',g)}>
                      <span className="ic-span" style={{background:'#555'}}>&lt;/&gt;</span>
                    </button>
                    {/* SUNAT */}
                    <button className="ic no-print" title="Leer Ticket SUNAT"
                      onClick={()=>abrir('sunat',g)}>
                      <span className="ic-span" style={{background:'#e67e22'}}>📖</span>
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>

        {/* leyenda */}
        <hr style={{border:'none',borderTop:'1px solid #dee2e6',margin:'14px 0 8px'}} className="no-print"/>
        <div style={{fontSize:12,color:'#444',display:'flex',flexWrap:'wrap',gap:12,
          alignItems:'center',rowGap:6}} className="no-print">
          <b>Leyenda de OPCIONES :</b>
          {[['#e67e22','✏','Actualizar, Eliminar'],
            ['#003d6b','📦','Imprimir Guía de Remisión'],
            ['#17a2b8','🖨','Imprimir Ticket'],
            ['#555','</>','Exportar XML SUNAT'],
            ['#e67e22','📖','Leer Ticket SUNAT'],
          ].map(([bg,ico,txt])=>(
            <span key={txt} style={{display:'flex',alignItems:'center',gap:4}}>
              <span style={{background:bg,color:'#fff',borderRadius:4,padding:'2px 6px',
                fontSize:11,fontWeight:'bold',minWidth:22,display:'inline-flex',
                alignItems:'center',justifyContent:'center'}}>{ico}</span>
              <span>{txt}</span>
            </span>
          ))}
        </div>
      </>)}

      {/* ══ VISTA NUEVO ══ */}
      {vista==='nuevo' && (
        <div style={{maxWidth:'100%'}}>
          <hr style={{border:'none',borderTop:'1px solid #dee2e6',marginBottom:14}}/>

          {/* ── DOCUMENTO DE SALIDA ── */}
          <div style={{fontWeight:'bold',fontSize:13,marginBottom:8,color:'#212529'}}>DOCUMENTO DE SALIDA</div>
          <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'flex-end',marginBottom:12}}>
            <div>
              <label className="gr-label">Nro Guia</label>
              <select className="gr-inp" style={{width:160}} value={fGuia} onChange={e=>setFGuia(e.target.value)}>
                <option value="">— seleccionar —</option>
                <option value="TI01">GR Electronica TI01</option>
              </select>
            </div>
            <div>
              <input className="gr-inp" placeholder="Nro guía" style={{width:120,marginTop:18}}
                value={fDocV} onChange={e=>setFDocV(e.target.value)}/>
            </div>
            <div>
              <label className="gr-label">Fecha Entrega (*)</label>
              <DP id="grFE" value={fFecha} onChange={setFFecha} verde={true}/>
            </div>
            <div>
              <label className="gr-label">Fecha trasla (*)</label>
              <DP id="grFT" value={fFecha} onChange={()=>{}} verde={true}/>
            </div>
            <div>
              <label className="gr-label">documento</label>
              <select className="gr-inp" style={{width:120}}>
                <option value=""></option>
                <option>Factura</option>
                <option>Boleta</option>
              </select>
            </div>
            <div>
              <label className="gr-label">Serie</label>
              <input className="gr-inp" style={{width:80}} placeholder="Serie"/>
            </div>
            <div>
              <label className="gr-label">Nro</label>
              <input className="gr-inp" style={{width:100}} placeholder="Nro"/>
            </div>
          </div>

          <hr style={{border:'none',borderTop:'1px solid #dee2e6',margin:'10px 0'}}/>

          {/* ── DOMICILIO DE PARTIDA ── */}
          <div style={{fontWeight:'bold',fontSize:13,marginBottom:8,color:'#212529'}}>DOMICILIO DE PARTIDA</div>
          <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'flex-end',marginBottom:12}}>
            <div style={{flex:'2 1 260px'}}>
              <label className="gr-label">Direccion (*)</label>
              <input className="gr-inp" style={{background:'#ccff99',border:'2px solid #28a745'}}
                placeholder="Dirección de partida" value={fOrig} onChange={e=>setFOrig(e.target.value)}/>
            </div>
            <div style={{flex:'1 1 150px'}}>
              <label className="gr-label">Dpto (*)</label>
              <select className="gr-inp">
                {['Lima','Arequipa','Cusco','La libertad','Piura','Lambayeque',
                  'Junin','Ancash','Ica','Cajamarca','Puno','Loreto','Ucayali',
                  'San martin','Tacna','Huánuco','Ayacucho','Apurimac','Moquegua',
                  'Tumbes','Pasco','Huancavelica','Amazonas','Madre de dios','Callao']
                  .map(d=><option key={d}>{d}</option>)}
              </select>
            </div>
            <div style={{flex:'1 1 150px'}}>
              <label className="gr-label">Provincia (*)</label>
              <select className="gr-inp">
                {['Lima','Barranca','Cajatambo','Cañete','Canta','Huaral',
                  'Huarochiri','Huaura','Oyon','Yauyos'].map(p=><option key={p}>{p}</option>)}
              </select>
            </div>
            <div style={{flex:'1 1 150px'}}>
              <label className="gr-label">Distrito (*)</label>
              <select className="gr-inp">
                {['Lima','Miraflores','San Isidro','San Borja','Surquillo',
                  'La Victoria','El Agustino','Ate','Los Olivos','Comas',
                  'San Martin de Porres','Independencia','Carabayllo',
                  'Villa el Salvador','Villa Maria del Triunfo','Chorrillos']
                  .map(d=><option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <hr style={{border:'none',borderTop:'1px solid #dee2e6',margin:'10px 0'}}/>

          {/* ── DOMICILIO DE LLEGADA ── */}
          <div style={{fontWeight:'bold',fontSize:13,marginBottom:8,color:'#212529'}}>DOMICILIO DE LLEGADA</div>
          <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'flex-end',marginBottom:12}}>
            <div style={{flex:'2 1 260px'}}>
              <label className="gr-label">Dirección (*)</label>
              <input className="gr-inp" placeholder="Dirección de llegada"
                value={fDest} onChange={e=>setFDest(e.target.value)}/>
            </div>
            <div style={{flex:'1 1 150px'}}>
              <label className="gr-label">Dpto (*)</label>
              <select className="gr-inp">
                {['Lima','Arequipa','Cusco','La libertad','Piura','Lambayeque',
                  'Junin','Ancash','Ica','Cajamarca','Puno','Loreto','Ucayali',
                  'San martin','Tacna','Huánuco','Ayacucho','Apurimac','Moquegua',
                  'Tumbes','Pasco','Huancavelica','Amazonas','Madre de dios','Callao']
                  .map(d=><option key={d}>{d}</option>)}
              </select>
            </div>
            <div style={{flex:'1 1 150px'}}>
              <label className="gr-label">Provincia (*)</label>
              <select className="gr-inp">
                {['Peru','Lima','Arequipa','Cusco','Trujillo'].map(p=><option key={p}>{p}</option>)}
              </select>
            </div>
            <div style={{flex:'1 1 150px'}}>
              <label className="gr-label">Distrito (*)</label>
              <select className="gr-inp">
                {['Peru','Lima','Miraflores','San Isidro','Surquillo'].map(d=><option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <hr style={{border:'none',borderTop:'1px solid #dee2e6',margin:'10px 0'}}/>

          {/* ── CLIENTE / VENDEDOR ── */}
          <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'flex-end',marginBottom:12}}>
            <div style={{flex:'3 1 300px'}}>
              <label className="gr-label">Cliente - Razon social / Nombre (*)</label>
              <select className="gr-inp" value={fCli} onChange={e=>setFCli(e.target.value)}>
                <option value=""></option>
                {['Aaron Smith Iturri Quispe','Alexander Paul, Moran Alburqueque',
                  'Angel Danilo, Wetzell Rodriguez','Carlos Enrique, Mifflin Revilla',
                  'Cesar Adrian, Terrones Moreno','Cliente','David Cristhian, Monzon Casas',
                  'Empresa SAC','García López, María','Inteligente S.a.c.',
                  'Raysa Yupanqui Barboza','Roger, Inga Salvador',
                  'Viviendas Sostenibles Segunda Etapa S.a.c.']
                  .map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{flex:'2 1 200px'}}>
              <label className="gr-label">Vendedor (*)</label>
              <select className="gr-inp" value={fVend} onChange={e=>setFVend(e.target.value)}>
                {['fac-tura.com','Iturri, Quispe, Smith','Merino, Cahuna, Wilver Enmanuel',
                  'Romero, Merino, Alexander Renson','Yupanqui, Barboza, Raysa']
                  .map(v=><option key={v}>{v}</option>)}
              </select>
            </div>
            <div style={{flex:'0 1 120px'}}>
              <label className="gr-label">Trasbordo</label>
              <select className="gr-inp">
                <option value="true">Si</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>

          <hr style={{border:'none',borderTop:'1px solid #dee2e6',margin:'10px 0'}}/>

          {/* ── INFORMACIÓN DE TRANSPORTE ── */}
          <div style={{fontWeight:'bold',fontSize:13,marginBottom:8,color:'#212529'}}>Informacion de Transporte</div>
          <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'flex-end',marginBottom:12}}>
            <div>
              <label className="gr-label">Modo Traslado</label>
              <select className="gr-inp" style={{width:110}}>
                <option value="01">Público</option>
                <option value="02">Privado</option>
              </select>
            </div>
            <div>
              <label className="gr-label">Vehículo :</label>
              <input className="gr-inp" style={{width:100}} value={fPlaca}
                onChange={e=>setFPlaca(e.target.value)} placeholder="Placa"/>
            </div>
            <div>
              <label className="gr-label">Certificado :</label>
              <input className="gr-inp" style={{width:110}} placeholder="Certificado"/>
            </div>
            <div>
              <label className="gr-label">Licencia :</label>
              <input className="gr-inp" style={{width:100}} placeholder="Licencia"/>
            </div>
            <div style={{flex:'2 1 200px'}}>
              <label className="gr-label">Nombre/Empresa del Conductor:</label>
              <input className="gr-inp" value={fTrans} onChange={e=>setFTrans(e.target.value)}
                placeholder="Nombre o empresa del conductor"/>
            </div>
            <div>
              <label className="gr-label">DNI/RUC del Conductor:</label>
              <input className="gr-inp" style={{width:130}} value={fRuc}
                onChange={e=>setFRuc(e.target.value)} placeholder="DNI o RUC"/>
            </div>
            <div>
              <label className="gr-label">Costo Minimo :</label>
              <input className="gr-inp" style={{width:100}} placeholder="0.00" type="number"/>
            </div>
          </div>

          <hr style={{border:'none',borderTop:'1px solid #dee2e6',margin:'10px 0'}}/>

          {/* ── INFORMACIÓN - OTROS ── */}
          <div style={{fontWeight:'bold',fontSize:13,marginBottom:8,color:'#212529'}}>Informacion - Otros</div>
          <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'flex-end',marginBottom:12}}>
            <div>
              <label className="gr-label">Orden :</label>
              <input className="gr-inp" style={{width:100}} placeholder="Orden"/>
            </div>
            <div>
              <label className="gr-label">Atencion :</label>
              <input className="gr-inp" style={{width:180}} placeholder="Atención"/>
            </div>
            <div>
              <label className="gr-label">Condiciones :</label>
              <select className="gr-inp" style={{width:120}}>
                <option>Contado</option>
                <option>Credito</option>
              </select>
            </div>
            <div>
              <label className="gr-label">A</label>
              <div style={{display:'flex',alignItems:'center',gap:4}}>
                <input className="gr-inp" style={{width:60}} placeholder="0" type="number"/>
                <span style={{fontSize:13}}>Dias</span>
              </div>
            </div>
            <div>
              <label className="gr-label">Tipo Traslado</label>
              <select className="gr-inp" style={{width:200}} value={fTipT}
                onChange={e=>setFTipT(e.target.value)}>
                {TIPOS_TRAS.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="gr-label">Puerto:</label>
              <input className="gr-inp" style={{width:100}} placeholder="Puerto"/>
            </div>
          </div>

          <hr style={{border:'none',borderTop:'1px solid #dee2e6',margin:'10px 0'}}/>

          {/* ── BÚSQUEDA DE ARTÍCULOS ── */}
          <BuscadorArticulos onAgregar={art=>setArticulosNuevo(prev=>[...prev,art])}/>

          {/* tabla artículos agregados */}
          {articulosNuevo.length>0 && (
            <table className="tgr" style={{marginTop:10}}>
              <thead>
                <tr>
                  <th>Codigo</th><th>Articulo/Detalle</th><th>Stock</th>
                  <th>Med.</th><th>P.Venta</th><th>Cant.</th><th>T.A.IGV</th><th>Quitar</th>
                </tr>
              </thead>
              <tbody>
                {articulosNuevo.map((a,i)=>(
                  <tr key={i}>
                    <td>{a.codigo}</td><td>{a.articulo}</td><td align="center">{a.stock}</td>
                    <td align="center">{a.med}</td><td align="right">S/ {a.pventa}</td>
                    <td align="center">{a.cant}</td><td>{a.igv}</td>
                    <td align="center">
                      <button onClick={()=>setArticulosNuevo(prev=>prev.filter((_,j)=>j!==i))}
                        style={{background:'#dc3545',border:'none',color:'#fff',borderRadius:4,
                          padding:'2px 8px',cursor:'pointer',fontSize:12}}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* botones */}
          <div style={{display:'flex',gap:10,justifyContent:'center',marginTop:20}}>
            {[['💾 Guardar','#17a2b8',guardarNuevo],
              ['🗋 Limpiar','#17a2b8',resetForm],
              ['↩ Regresar','#17a2b8',()=>setVista('lista')]
            ].map(([lbl,bg,fn])=>(
              <button key={lbl} onClick={fn}
                style={{background:bg,border:'none',color:'#fff',padding:'8px 22px',
                  borderRadius:4,cursor:'pointer',fontSize:13,fontWeight:'bold',
                  display:'inline-flex',alignItems:'center',gap:6}}>
                {lbl}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ══ VISTA DETALLE ══ */}
      {vista==='detalle' && (
        <>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}
            className="no-print">
            <h2 style={{fontSize:18,fontWeight:'bold'}}>Guia de Remision detalle</h2>
            <button className="btn-gr" style={{background:'#6c757d',fontSize:12}}
              onClick={()=>setVista('lista')}>← Volver a Lista</button>
          </div>

          <div className="gr-bar no-print" style={{marginBottom:14}}>
            <div>
              <div style={{fontWeight:'bold',fontSize:13,marginBottom:4}}>BUSCAR X</div>
              <div className="gr-radio" style={{marginBottom:6}}>
                {[['1','Nro'],['2','clientes'],['3','Vend.'],['4','Articulo'],['5','Conductor']].map(([v,l])=>(
                  <label key={v}>
                    <input type="radio" name="detTipo" value={v}
                      checked={dTipo===v} onChange={()=>setDTipo(v)}/> {l} /
                  </label>
                ))}
              </div>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <input type="text" value={dq} onChange={e=>setDq(e.target.value)}
                  placeholder="Ingrese texto a buscar" style={{width:300}}/>
                <span style={{fontWeight:'bold',fontSize:13}}>y/o</span>
              </div>
            </div>
            <div><label>Fecha Inicio (Entrega)</label><DP id="dFI" value={dfi} onChange={setDfi}/></div>
            <div><label>Fecha Fin (Entrega)</label><DP id="dFF" value={dff} onChange={setDff}/></div>
            <button className="btn-gr" style={{background:'#17a2b8'}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2"/>
              </svg> Buscar
            </button>
          </div>

          <div className="gr-titulo">LISTADO GENERAL GUIA DE REMISION</div>
          <div style={{overflowX:'auto'}}>
            <table className="tgr" style={{minWidth:1100}}>
              <thead>
                <tr>
                  <th>GR</th><th>Entre.</th><th>Trasl.</th>
                  <th>Partida</th><th>Llegada</th>
                  <th>Cliente</th><th>Vend.</th><th>Conductor</th>
                  <th>Orden</th><th>Tip.Tras.</th>
                  <th>Codigo</th><th>Articulo</th>
                  <th>Cant.</th><th>P.</th>
                </tr>
              </thead>
              <tbody>
                {detFilt.length===0
                  ? <tr><td colSpan={14} align="center" style={{padding:20,color:'#888'}}>Sin registros</td></tr>
                  : detFilt.map(d=>(
                    <tr key={d.id}>
                      <td><b style={{color:'#003d6b'}}>{d.gr}</b></td>
                      <td align="center" style={{whiteSpace:'nowrap'}}>{d.entre}</td>
                      <td align="center" style={{whiteSpace:'nowrap'}}>{d.trasl}</td>
                      <td style={{fontSize:11,maxWidth:120}}>{d.partida}</td>
                      <td style={{fontSize:11,maxWidth:120}}>{d.llegada}</td>
                      <td style={{maxWidth:130,fontSize:12}}>{d.cliente}</td>
                      <td style={{fontSize:12}}>{d.vend}</td>
                      <td style={{fontSize:12}}>{d.conductor}</td>
                      <td style={{fontSize:12}}>{d.orden}</td>
                      <td style={{fontSize:11,maxWidth:130}}>{d.tipTras}</td>
                      <td align="center" style={{fontSize:12}}>{d.codigo}</td>
                      <td style={{fontSize:12}}>{d.articulo}</td>
                      <td align="center"><b>{d.cant}</b></td>
                      <td align="center">{d.p}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>

          <div style={{textAlign:'center',marginTop:16}} className="no-print">
            <button className="btn-gr" style={{background:'#17a2b8'}} onClick={exportarCSV}>
              📥 Exportar
            </button>
          </div>
        </>
      )}

      {/* ══ MODALES ══ */}
      {renderModal()}
    </>
  );
}