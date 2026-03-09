import { useState, useRef } from "react";

/* ─── DATOS DEMO ─── */
const CA_INI = [
  { id:1, documento:'FI01-000041', fecha:'2026-02-10', cliente:'Empresa SAC',
    ruc:'20512345678', direccion:'Av. Lima 123, Lima',
    vendedor:'Iturri, Quispe, Smith', tvta:'Crédito', sunat:'OK', estado:'Pendiente',
    sucursal:'1', soles:'1200.00', dolares:'' },
  { id:2, documento:'BI01-000023', fecha:'2026-02-18', cliente:'García López, María',
    ruc:'10456789012', direccion:'Jr. Cusco 456, Arequipa',
    vendedor:'Merino, Cahuna, Wilver Enmanuel', tvta:'Crédito', sunat:'BETA', estado:'Pendiente',
    sucursal:'2', soles:'450.00', dolares:'' },
  { id:3, documento:'FI01-000042', fecha:'2026-03-01', cliente:'Empresa SAC',
    ruc:'20512345678', direccion:'Av. Lima 123, Lima',
    vendedor:'Iturri, Quispe, Smith', tvta:'Crédito', sunat:'OK', estado:'Pagado',
    sucursal:'1', soles:'2300.00', dolares:'120.00' },
  { id:4, documento:'001-000018', fecha:'2026-03-05', cliente:'Alexander Paul, Moran Alburqueque',
    ruc:'10234567890', direccion:'Calle Real 789, Trujillo',
    vendedor:'Romero, Merino, Alexander Renson', tvta:'Crédito', sunat:'ERROR', estado:'Pendiente',
    sucursal:'3', soles:'870.00', dolares:'' },
];

const VENDEDORES   = ['fac-tura.com','Iturri, Quispe, Smith','Merino, Cahuna, Wilver Enmanuel',
                      'Romero, Merino, Alexander Renson','Yupanqui, Barboza, Raysa'];
const ESTADOS_CA   = ['Pendiente','Pagado','Anulado','Borrador'];
const SUNAT_COLOR  = { OK:'#28a745', ERROR:'#dc3545', BETA:'#6c757d', Enviado:'#17a2b8' };
const ESTADO_COLOR = { Pendiente:'#e67e22', Pagado:'#28a745', Anulado:'#dc3545', Borrador:'#6c757d' };
const MOTIVOS_ND   = ['01 - Intereses por mora','02 - Aumento en el valor',
  '03 - Penalidades/ otros conceptos','04 - Consolidación','05 - Errores/ omisiones',
  '06 - Diferencia de cambio','07 - Gastos de cobranza','08 - Otros'];
const MOTIVOS_NC   = ['Anulación de la operación','Anulación por error en el RUC',
  'Corrección por error en la descripción','Descuento global','Devolución total',
  'Bonificación','Disminución en el valor','Otros Conceptos'];

const hoy      = new Date().toISOString().split('T')[0];
const fmtFecha = iso => { if(!iso)return''; const[y,m,d]=iso.split('-'); return`${d}/${m}/${y}`; };
const padNum   = n => String(n).padStart(6,'0');
let   ndSeq    = 1, ncSeq = 1, cotSeq = 1;

/* ── Generador HTML imprimible ── */
const htmlDoc = (titulo, colorHead, contenido) => `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8">
<title>${titulo}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#212529;padding:24px;}
  .head{background:${colorHead};color:#fff;padding:14px 20px;border-radius:6px 6px 0 0;
    display:flex;justify-content:space-between;align-items:center;}
  .head h2{font-size:17px;font-weight:bold;}
  .head .num{font-size:13px;opacity:.9;}
  .box{border:1px solid #dee2e6;border-radius:6px;overflow:hidden;margin-bottom:16px;}
  .section{padding:14px 18px;}
  .row{display:flex;gap:10px;margin-bottom:8px;}
  .lbl{font-weight:bold;min-width:130px;color:#555;font-size:12px;}
  .val{font-size:13px;}
  table{width:100%;border-collapse:collapse;font-size:13px;margin-top:8px;}
  th{background:#003d6b;color:#fff;padding:8px;text-align:center;font-size:12px;}
  td{padding:7px 8px;border-bottom:1px solid #dee2e6;}
  .total-row td{background:#f0f0f0;font-weight:bold;}
  .badge{padding:3px 10px;border-radius:12px;font-size:11px;font-weight:bold;color:#fff;display:inline-block;}
  .firma{margin-top:40px;display:flex;justify-content:space-between;}
  .firma-box{text-align:center;border-top:1px solid #333;padding-top:6px;width:200px;font-size:12px;}
  .pie{text-align:center;font-size:11px;color:#888;margin-top:24px;padding-top:12px;
    border-top:1px solid #dee2e6;}
  @media print{body{padding:10px;} button{display:none!important;}}
</style></head><body>
${contenido}
<div class="pie">© 2009-2026 INTELIGENTE — Documento generado el ${new Date().toLocaleString('es-PE')}</div>
<br><button onclick="window.print()" style="background:#003d6b;color:#fff;border:none;
  padding:8px 20px;border-radius:4px;cursor:pointer;font-size:13px;margin-right:8px;">🖨 Imprimir</button>
<button onclick="window.close()" style="background:#6c757d;color:#fff;border:none;
  padding:8px 20px;border-radius:4px;cursor:pointer;font-size:13px;">✕ Cerrar</button>
</body></html>`;

const abrirVentana = html => {
  const w = window.open('','_blank','width=900,height=700,scrollbars=1');
  w.document.write(html); w.document.close();
};

/* ── Documentos HTML por tipo ── */
const docND = (v, motivo, monto, obs) => {
  const num = `ND01-${padNum(ndSeq++)}`;
  return htmlDoc(`Nota de Débito ${num}`, '#28a745', `
  <div class="box">
    <div class="head" style="background:#28a745">
      <h2>📄 NOTA DE DÉBITO</h2><span class="num">${num}</span>
    </div>
    <div class="section">
      <div class="row"><span class="lbl">N° Nota Débito:</span><span class="val"><b>${num}</b></span></div>
      <div class="row"><span class="lbl">Doc. Referencia:</span><span class="val">${v.documento}</span></div>
      <div class="row"><span class="lbl">Fecha Emisión:</span><span class="val">${fmtFecha(hoy)}</span></div>
      <div class="row"><span class="lbl">Cliente:</span><span class="val">${v.cliente}</span></div>
      <div class="row"><span class="lbl">RUC/DNI:</span><span class="val">${v.ruc}</span></div>
      <div class="row"><span class="lbl">Dirección:</span><span class="val">${v.direccion}</span></div>
      <div class="row"><span class="lbl">Motivo:</span><span class="val">${motivo}</span></div>
      ${obs?`<div class="row"><span class="lbl">Observación:</span><span class="val">${obs}</span></div>`:''}
    </div>
  </div>
  <div class="box">
    <table>
      <thead><tr><th>Descripción</th><th>Monto S/.</th></tr></thead>
      <tbody><tr><td>${motivo}</td><td style="text-align:right">${parseFloat(monto).toFixed(2)}</td></tr></tbody>
      <tfoot><tr class="total-row"><td><b>TOTAL</b></td><td style="text-align:right"><b>S/ ${parseFloat(monto).toFixed(2)}</b></td></tr></tfoot>
    </table>
  </div>
  <div class="firma">
    <div class="firma-box">Firma Emisor</div>
    <div class="firma-box">Firma Cliente</div>
  </div>`);
};

const docNC = (v, motivo, monto, obs) => {
  const num = `NC01-${padNum(ncSeq++)}`;
  return htmlDoc(`Nota de Crédito ${num}`, '#dc3545', `
  <div class="box">
    <div class="head" style="background:#dc3545">
      <h2>📄 NOTA DE CRÉDITO</h2><span class="num">${num}</span>
    </div>
    <div class="section">
      <div class="row"><span class="lbl">N° Nota Crédito:</span><span class="val"><b>${num}</b></span></div>
      <div class="row"><span class="lbl">Doc. Referencia:</span><span class="val">${v.documento}</span></div>
      <div class="row"><span class="lbl">Fecha Emisión:</span><span class="val">${fmtFecha(hoy)}</span></div>
      <div class="row"><span class="lbl">Cliente:</span><span class="val">${v.cliente}</span></div>
      <div class="row"><span class="lbl">RUC/DNI:</span><span class="val">${v.ruc}</span></div>
      <div class="row"><span class="lbl">Dirección:</span><span class="val">${v.direccion}</span></div>
      <div class="row"><span class="lbl">Motivo:</span><span class="val">${motivo}</span></div>
      ${obs?`<div class="row"><span class="lbl">Observación:</span><span class="val">${obs}</span></div>`:''}
    </div>
  </div>
  <div class="box">
    <table>
      <thead><tr><th>Descripción</th><th>Monto S/.</th></tr></thead>
      <tbody><tr><td>${motivo}</td><td style="text-align:right">- ${parseFloat(monto).toFixed(2)}</td></tr></tbody>
      <tfoot><tr class="total-row"><td><b>TOTAL A ACREDITAR</b></td><td style="text-align:right"><b>S/ ${parseFloat(monto).toFixed(2)}</b></td></tr></tfoot>
    </table>
  </div>
  <div class="firma">
    <div class="firma-box">Firma Emisor</div>
    <div class="firma-box">Firma Cliente</div>
  </div>`);
};

const docTicket = v => htmlDoc(`Ticket ${v.documento}`, '#17a2b8', `
  <div style="max-width:320px;margin:0 auto;font-family:monospace;font-size:13px;
    border:1px dashed #999;padding:18px;line-height:1.9;">
    <div style="text-align:center;font-weight:bold;font-size:15px;margin-bottom:8px;">INTELIGENTE</div>
    <div style="text-align:center;font-size:11px;margin-bottom:12px;">RUC: 20512345678<br>Av. Principal 123, Lima</div>
    <div style="border-top:1px dashed #999;border-bottom:1px dashed #999;padding:6px 0;margin-bottom:10px;text-align:center;">
      <b>${v.documento}</b>
    </div>
    <div>Fecha   : ${fmtFecha(v.fecha)}</div>
    <div>Cliente : ${v.cliente}</div>
    <div>RUC/DNI : ${v.ruc}</div>
    <div>Vendedor: ${v.vendedor}</div>
    <div style="border-top:1px dashed #999;margin:10px 0;"></div>
    <div style="display:flex;justify-content:space-between;"><span>TOTAL S/.</span><b>${v.soles}</b></div>
    ${v.dolares?`<div style="display:flex;justify-content:space-between;"><span>TOTAL US$</span><b>${v.dolares}</b></div>`:''}
    <div style="border-top:1px dashed #999;margin:10px 0;"></div>
    <div style="text-align:center;font-size:11px;">Estado SUNAT: <b>${v.sunat}</b></div>
    <div style="text-align:center;font-size:11px;margin-top:6px;">¡Gracias por su preferencia!</div>
  </div>`);

const docCotizacion = (v, dias, obs) => {
  const num = `COT-${padNum(cotSeq++)}`;
  return htmlDoc(`Cotización ${num}`, '#6c9bd1', `
  <div class="box">
    <div class="head" style="background:#6c9bd1">
      <h2>📋 COTIZACIÓN</h2><span class="num">${num}</span>
    </div>
    <div class="section">
      <div class="row"><span class="lbl">N° Cotización:</span><span class="val"><b>${num}</b></span></div>
      <div class="row"><span class="lbl">Doc. Origen:</span><span class="val">${v.documento}</span></div>
      <div class="row"><span class="lbl">Fecha:</span><span class="val">${fmtFecha(hoy)}</span></div>
      <div class="row"><span class="lbl">Validez:</span><span class="val">${dias} días</span></div>
      <div class="row"><span class="lbl">Cliente:</span><span class="val">${v.cliente}</span></div>
      <div class="row"><span class="lbl">RUC/DNI:</span><span class="val">${v.ruc}</span></div>
      <div class="row"><span class="lbl">Vendedor:</span><span class="val">${v.vendedor}</span></div>
      ${obs?`<div class="row"><span class="lbl">Observación:</span><span class="val">${obs}</span></div>`:''}
    </div>
  </div>
  <div class="box">
    <table>
      <thead><tr><th>#</th><th>Descripción</th><th>T. Vta</th><th>Monto S/.</th></tr></thead>
      <tbody><tr><td>1</td><td>Crédito acumulado — ${v.tvta}</td><td>${v.tvta}</td><td style="text-align:right">${v.soles}</td></tr></tbody>
      <tfoot><tr class="total-row"><td colspan="3"><b>TOTAL</b></td><td style="text-align:right"><b>S/ ${v.soles}</b></td></tr></tfoot>
    </table>
  </div>`);
};

const docCliente = v => htmlDoc(`Ficha Cliente — ${v.cliente}`, '#17a2b8', `
  <div class="box">
    <div class="head" style="background:#17a2b8"><h2>👤 FICHA DE CLIENTE</h2></div>
    <div class="section">
      ${[['Razón Social',v.cliente],['RUC/DNI',v.ruc],['Dirección',v.direccion],
         ['Doc. Venta',v.documento],['Vendedor',v.vendedor],
         ['Tipo Venta',v.tvta],['Monto S/.',v.soles],
         ['Estado',v.estado],['SUNAT',v.sunat]
        ].map(([l,val])=>`<div class="row"><span class="lbl">${l}:</span><span class="val">${val}</span></div>`).join('')}
    </div>
  </div>`);

const docVenta = v => htmlDoc(`Nueva Venta — ${v.cliente}`, '#003d6b', `
  <div class="box">
    <div class="head" style="background:#003d6b"><h2>🛒 PEDIDO / NUEVA VENTA</h2><span class="num">${fmtFecha(hoy)}</span></div>
    <div class="section">
      <div class="row"><span class="lbl">Cliente:</span><span class="val"><b>${v.cliente}</b></span></div>
      <div class="row"><span class="lbl">RUC/DNI:</span><span class="val">${v.ruc}</span></div>
      <div class="row"><span class="lbl">Dirección:</span><span class="val">${v.direccion}</span></div>
      <div class="row"><span class="lbl">Vendedor:</span><span class="val">${v.vendedor}</span></div>
      <div class="row"><span class="lbl">Referencia:</span><span class="val">${v.documento}</span></div>
    </div>
  </div>
  <div class="box">
    <table>
      <thead><tr><th>#</th><th>Artículo / Servicio</th><th>Cant.</th><th>P. Unit.</th><th>Total S/.</th></tr></thead>
      <tbody>
        <tr><td>1</td><td>—</td><td>1</td><td>—</td><td style="text-align:right">—</td></tr>
      </tbody>
      <tfoot><tr class="total-row"><td colspan="4"><b>TOTAL</b></td><td style="text-align:right"><b>S/ 0.00</b></td></tr></tfoot>
    </table>
  </div>
  <p style="font-size:12px;color:#888;margin-top:8px;">* Complete los artículos en el módulo de Ventas.</p>`);

const docPDF = v => htmlDoc(`${v.documento.startsWith('F')?'FACTURA':'BOLETA'} ${v.documento}`, '#dc3545', `
  <div class="box">
    <div class="head" style="background:#dc3545">
      <h2>${v.documento.startsWith('F')?'⚡ FACTURA ELECTRÓNICA':'⚡ BOLETA ELECTRÓNICA'}</h2>
      <span class="num">${v.documento}</span>
    </div>
    <div class="section">
      <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:20px;">
        <div>
          <div class="row"><span class="lbl">Emisor:</span><span class="val"><b>EMPRESA INTELIGENTE SAC</b></span></div>
          <div class="row"><span class="lbl">RUC Emisor:</span><span class="val">20512345678</span></div>
          <div class="row"><span class="lbl">Dirección:</span><span class="val">Av. Principal 123, Lima</span></div>
        </div>
        <div>
          <div class="row"><span class="lbl">Cliente:</span><span class="val"><b>${v.cliente}</b></span></div>
          <div class="row"><span class="lbl">RUC/DNI:</span><span class="val">${v.ruc}</span></div>
          <div class="row"><span class="lbl">Dirección:</span><span class="val">${v.direccion}</span></div>
        </div>
      </div>
      <div class="row" style="margin-top:8px;"><span class="lbl">Fecha:</span><span class="val">${fmtFecha(v.fecha)}</span></div>
      <div class="row"><span class="lbl">Vendedor:</span><span class="val">${v.vendedor}</span></div>
      <div class="row"><span class="lbl">Estado SUNAT:</span>
        <span class="val"><span class="badge" style="background:${SUNAT_COLOR[v.sunat]||'#6c757d'}">${v.sunat}</span></span>
      </div>
    </div>
  </div>
  <div class="box">
    <table>
      <thead><tr><th>#</th><th>Descripción</th><th>T. Vta</th><th>Sub Total</th><th>IGV 18%</th><th>Total S/.</th></tr></thead>
      <tbody>
        <tr><td>1</td><td>Venta — Crédito acumulado</td><td>${v.tvta}</td>
          <td style="text-align:right">${(parseFloat(v.soles)/1.18).toFixed(2)}</td>
          <td style="text-align:right">${(parseFloat(v.soles)-parseFloat(v.soles)/1.18).toFixed(2)}</td>
          <td style="text-align:right">${v.soles}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="total-row"><td colspan="5"><b>TOTAL A PAGAR</b></td><td style="text-align:right"><b>S/ ${v.soles}</b></td></tr>
        ${v.dolares?`<tr class="total-row"><td colspan="5"><b>TOTAL US$</b></td><td style="text-align:right"><b>$ ${v.dolares}</b></td></tr>`:''}
      </tfoot>
    </table>
  </div>
  <div class="firma">
    <div class="firma-box">Firma Emisor</div>
    <div class="firma-box">Firma Receptor</div>
  </div>`);

const docXML = v => `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2">
  <cbc:ID>${v.documento}</cbc:ID>
  <cbc:IssueDate>${v.fecha}</cbc:IssueDate>
  <cbc:InvoiceTypeCode>${v.documento.startsWith('F')?'01':'03'}</cbc:InvoiceTypeCode>
  <cbc:DocumentCurrencyCode>PEN</cbc:DocumentCurrencyCode>
  <cac:AccountingSupplierParty>
    <cac:Party>
      <cac:PartyName><cbc:Name>EMPRESA INTELIGENTE SAC</cbc:Name></cac:PartyName>
      <cac:PartyTaxScheme><cbc:CompanyID>20512345678</cbc:CompanyID></cac:PartyTaxScheme>
    </cac:Party>
  </cac:AccountingSupplierParty>
  <cac:AccountingCustomerParty>
    <cac:Party>
      <cac:PartyName><cbc:Name>${v.cliente}</cbc:Name></cac:PartyName>
      <cac:PartyTaxScheme><cbc:CompanyID>${v.ruc}</cbc:CompanyID></cac:PartyTaxScheme>
    </cac:Party>
  </cac:AccountingCustomerParty>
  <cac:LegalMonetaryTotal>
    <cbc:TaxInclusiveAmount currencyID="PEN">${v.soles}</cbc:TaxInclusiveAmount>
    <cbc:PayableAmount currencyID="PEN">${v.soles}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>
  <cac:TaxTotal>
    <cbc:TaxAmount currencyID="PEN">${(parseFloat(v.soles)-parseFloat(v.soles)/1.18).toFixed(2)}</cbc:TaxAmount>
  </cac:TaxTotal>
</Invoice>`;

const docSunat = v => htmlDoc(`Consulta SUNAT — ${v.documento}`, '#e67e22', `
  <div class="box">
    <div class="head" style="background:#e67e22"><h2>📖 TICKET SUNAT</h2><span class="num">${v.documento}</span></div>
    <div class="section">
      <div class="row"><span class="lbl">Comprobante:</span><span class="val"><b>${v.documento}</b></span></div>
      <div class="row"><span class="lbl">Fecha:</span><span class="val">${fmtFecha(v.fecha)}</span></div>
      <div class="row"><span class="lbl">Cliente:</span><span class="val">${v.cliente}</span></div>
      <div class="row"><span class="lbl">RUC/DNI:</span><span class="val">${v.ruc}</span></div>
      <div class="row"><span class="lbl">Total S/:</span><span class="val"><b>${v.soles}</b></span></div>
      <div class="row"><span class="lbl">Estado SUNAT:</span>
        <span class="val"><span class="badge" style="background:${SUNAT_COLOR[v.sunat]||'#6c757d'};font-size:13px;padding:4px 14px">${v.sunat}</span></span>
      </div>
      <div class="row" style="margin-top:12px;">
        <span class="lbl">Código Hash:</span>
        <span class="val" style="font-family:monospace;font-size:11px;word-break:break-all;">
          ${btoa(v.documento+v.ruc+v.soles).substring(0,40)}...
        </span>
      </div>
    </div>
  </div>
  <div style="background:#fff3cd;border:1px solid #ffc107;border-radius:6px;padding:12px 16px;font-size:13px;color:#856404;">
    <b>Portal SUNAT:</b> 
    <a href="https://e-consulta.sunat.gob.pe/ol-ti-itconsvalicpe/ConsValiCpe.htm" 
       target="_blank" style="color:#17a2b8;">Consultar validez del comprobante →</a>
  </div>`);

/* ════════════════ CSS ════════════════ */
const css = `
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#212529;}
  .ca-bar{display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;margin-bottom:18px;}
  .ca-bar label{font-size:12px;font-weight:bold;display:block;margin-bottom:3px;color:#555;}
  .ca-bar input[type=text]{padding:5px 10px;border:1px solid #ced4da;border-radius:4px;font-size:13px;color:#212529;background:#fff;}
  .ca-bar select{padding:4px 6px;border:1px solid #ced4da;border-radius:4px;font-size:12px;color:#212529;background:#fff;height:28px;}
  .ca-radio{display:flex;gap:10px;align-items:center;font-size:13px;}
  .ca-radio label{display:flex;align-items:center;gap:4px;cursor:pointer;font-weight:bold;color:#212529;}
  .ca-radio input[type=radio]{accent-color:#17a2b8;width:14px;height:14px;}
  .ca-dw{display:flex;align-items:center;gap:5px;border:1px solid #ced4da;border-radius:4px;
    padding:4px 8px;background:#fff;height:32px;min-width:130px;}
  .ca-dw span.ca-dt{font-size:13px;color:#212529;min-width:85px;}
  .btn-ca{border:none;color:#fff;padding:7px 14px;border-radius:4px;cursor:pointer;
    font-size:13px;font-weight:bold;display:inline-flex;align-items:center;gap:5px;}
  .btn-ca:hover{opacity:.88;}
  .ca-titulo{text-align:center;font-weight:bold;font-size:14px;margin-bottom:8px;letter-spacing:.5px;}
  table.tca{width:100%;border-collapse:collapse;font-size:13px;}
  table.tca thead tr{background:#003d6b;}
  table.tca thead th{padding:10px 8px;text-align:center;color:#fff;font-weight:bold;font-size:12px;letter-spacing:.3px;}
  table.tca tbody tr{border-bottom:1px solid #dee2e6;background:#fff;}
  table.tca tbody tr:hover{background:#e8f4f8;}
  table.tca tbody td{padding:8px 8px;vertical-align:middle;color:#212529;}
  .badge{padding:3px 9px;border-radius:12px;font-size:11px;font-weight:bold;color:#fff;display:inline-block;}
  .ic{background:none;border:none;cursor:pointer;padding:1px 3px;display:inline-flex;align-items:center;}
  .ic:hover{opacity:.8;transform:scale(1.18);}
  .ic-span{display:inline-flex;align-items:center;justify-content:center;border-radius:4px;
    padding:3px 6px;font-size:11px;font-weight:bold;color:#fff;min-width:26px;}
  .leyenda-ca{font-size:12px;color:#444;margin-top:14px;display:flex;flex-wrap:wrap;gap:10px;
    align-items:center;row-gap:6px;}
  /* modal */
  .mca-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:3000;
    display:flex;align-items:center;justify-content:center;}
  .mca-box{background:#fff;border-radius:8px;min-width:420px;max-width:580px;width:92%;
    box-shadow:0 8px 32px rgba(0,0,0,.25);overflow:hidden;}
  .mca-head{padding:13px 20px;display:flex;justify-content:space-between;align-items:center;
    color:#fff;font-weight:bold;font-size:15px;}
  .mca-body{padding:20px;max-height:62vh;overflow-y:auto;}
  .mca-footer{padding:12px 20px;display:flex;gap:8px;justify-content:flex-end;
    border-top:1px solid #dee2e6;background:#f8f9fa;flex-wrap:wrap;}
  .mca-btn{padding:7px 16px;border:none;border-radius:4px;cursor:pointer;
    font-size:13px;font-weight:bold;color:#fff;}
  .mca-row{display:flex;gap:10px;margin-bottom:10px;align-items:center;}
  .mca-label{font-weight:bold;font-size:12px;min-width:120px;color:#555;flex-shrink:0;}
  .mca-inp{padding:6px 10px;border:1px solid #ced4da;border-radius:4px;
    font-size:13px;color:#212529;background:#fff;width:100%;}
  .resumen-box{background:#f8f9fa;border:1px solid #dee2e6;border-radius:6px;
    padding:10px 14px;margin-bottom:14px;font-size:13px;}
  .xml-pre{font-family:monospace;font-size:11px;background:#1e1e1e;color:#d4d4d4;border-radius:6px;
    padding:14px;white-space:pre;overflow-x:auto;max-height:300px;overflow-y:auto;line-height:1.5;}
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

const DP = ({ id, value, onChange }) => {
  const ref = useRef();
  return (
    <div className="ca-dw">
      <span className="ca-dt">{value ? value.split('-').reverse().join('/') : ''}</span>
      <span style={{cursor:'pointer'}} onClick={()=>ref.current.showPicker?.()??ref.current.click()}><IcoCal/></span>
      <input ref={ref} id={id} type="date" value={value} onChange={e=>onChange(e.target.value)}
        style={{opacity:0,width:1,height:1,position:'absolute',pointerEvents:'none'}}/>
    </div>
  );
};

/* ═══════════════════════ COMPONENTE ═══════════════════════ */
export default function CreditoAcumulado() {
  const [ventas,  setVentas]  = useState(CA_INI);
  const [alert,   setAlert]   = useState('');
  const [bSucur,  setBSucur]  = useState('');
  const [bTipo,   setBTipo]   = useState('1');
  const [bq,      setBq]      = useState('');
  const [bfi,     setBfi]     = useState('');
  const [bff,     setBff]     = useState('');
  const [modal,   setModal]   = useState(null);

  /* form estado */
  const [mEstado, setMEstado] = useState('');
  const [mVend,   setMVend]   = useState('');
  const [mMotivo, setMMotivo] = useState('');
  const [mMonto,  setMMonto]  = useState('');
  const [mObs,    setMObs]    = useState('');
  const [mDias,   setMDias]   = useState('7');

  const showAlert = msg => { setAlert(msg); setTimeout(()=>setAlert(''),3500); };

  const abrir = (tipo, venta) => {
    setModal({tipo,venta});
    setMEstado(venta.estado); setMVend(venta.vendedor);
    setMMotivo(tipo==='nd'?MOTIVOS_ND[0]:MOTIVOS_NC[0]);
    setMMonto(''); setMObs(''); setMDias('7');
  };

  const listaFilt = ventas.filter(v => {
    if (bSucur && v.sucursal!==bSucur) return false;
    if (bq) {
      const q=bq.toLowerCase();
      if (bTipo==='1'&&!v.documento.toLowerCase().includes(q)) return false;
      if (bTipo==='2'&&!v.cliente.toLowerCase().includes(q))   return false;
      if (bTipo==='3'&&!v.vendedor.toLowerCase().includes(q))  return false;
    }
    if (bfi&&v.fecha<bfi) return false;
    if (bff&&v.fecha>bff) return false;
    return true;
  });

  /* descarga XML */
  const descargarXML = v => {
    const blob=new Blob([docXML(v)],{type:'application/xml'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url; a.download=`${v.documento}.xml`; a.click();
    URL.revokeObjectURL(url);
  };

  /* ─── fila de íconos ─── */
  const Opciones = ({ v }) => (
    <td align="center" style={{whiteSpace:'nowrap',padding:'6px 4px'}}>
      {[
        ['editar', '#e67e22', '✏',   'Actualizar / Eliminar'],
        ['nd',     '#28a745', 'ND',  'Generar Nota de Débito'],
        ['nc',     '#dc3545', 'NC',  'Generar Nota de Crédito'],
        ['ticket', '#17a2b8', '🖨',  'Imprimir Ticket'],
        ['cotizar','#6c9bd1', '↺',   'Cotizar'],
        ['cliente','#17a2b8', '👤',  'Ver Cliente'],
        ['vender', '#6c757d', 'VTA', 'Vender'],
        ['pdf',    '#dc3545', 'PDF', 'Imprimir Factura/Boleta'],
        ['xml',    '#555',    '</>','Exportar XML'],
        ['sunat',  '#e67e22', '📖', 'Leer Ticket SUNAT'],
      ].map(([tipo,bg,ico,title])=>(
        <button key={tipo} className="ic no-print" title={title} onClick={()=>abrir(tipo,v)}>
          <span className="ic-span" style={{background:bg}}>{ico}</span>
        </button>
      ))}
    </td>
  );

  /* ─── modal activo ─── */
  const Modal = () => {
    if (!modal) return null;
    const v = modal.venta;

    const Resumen = () => (
      <div className="resumen-box">
        {[['Documento',<b>{v.documento}</b>],['Fecha',fmtFecha(v.fecha)],
          ['Cliente',v.cliente],['RUC/DNI',v.ruc],
          ['Vendedor',v.vendedor],
          ['Monto',`S/ ${v.soles}${v.dolares?` / US$ ${v.dolares}`:''}`]
        ].map(([l,val])=>(
          <div key={l} className="mca-row" style={{marginBottom:4}}>
            <span className="mca-label">{l}:</span><span style={{fontSize:13}}>{val}</span>
          </div>
        ))}
      </div>
    );

    const Wrap = ({color,titulo,children,footer}) => (
      <div className="mca-overlay no-print" onClick={()=>setModal(null)}>
        <div className="mca-box" onClick={e=>e.stopPropagation()}>
          <div className="mca-head" style={{background:color}}>
            {titulo}
            <span style={{cursor:'pointer',fontSize:18}} onClick={()=>setModal(null)}>✕</span>
          </div>
          <div className="mca-body">{children}</div>
          <div className="mca-footer">{footer}</div>
        </div>
      </div>
    );

    /* EDITAR */
    if (modal.tipo==='editar') return (
      <Wrap color="#e67e22" titulo={`✏ Actualizar / Eliminar — ${v.documento}`}
        footer={<>
          <button className="mca-btn" style={{background:'#e67e22'}}
            onClick={()=>{ setVentas(p=>p.map(x=>x.id===v.id?{...x,estado:mEstado,vendedor:mVend}:x));
              setModal(null); showAlert('ok:Registro actualizado.'); }}>💾 Actualizar</button>
          <button className="mca-btn" style={{background:'#dc3545'}}
            onClick={()=>{ if(!window.confirm(`¿Eliminar ${v.documento}?`))return;
              setVentas(p=>p.filter(x=>x.id!==v.id)); setModal(null); showAlert('ok:Registro eliminado.'); }}>🗑 Eliminar</button>
          <button className="mca-btn" style={{background:'#6c757d'}} onClick={()=>setModal(null)}>✕ Cancelar</button>
        </>}>
        <Resumen/>
        <div className="mca-row"><span className="mca-label">Vendedor:</span>
          <select className="mca-inp" value={mVend} onChange={e=>setMVend(e.target.value)}>
            {VENDEDORES.map(x=><option key={x}>{x}</option>)}</select></div>
        <div className="mca-row"><span className="mca-label">Estado:</span>
          <select className="mca-inp" value={mEstado} onChange={e=>setMEstado(e.target.value)}>
            {ESTADOS_CA.map(x=><option key={x}>{x}</option>)}</select></div>
        <div className="mca-row"><span className="mca-label">Observación:</span>
          <textarea className="mca-inp" rows={2} value={mObs}
            onChange={e=>setMObs(e.target.value)} style={{resize:'none'}}/></div>
      </Wrap>
    );

    /* NOTA DÉBITO */
    if (modal.tipo==='nd') return (
      <Wrap color="#28a745" titulo={`ND Nota de Débito — ${v.documento}`}
        footer={<>
          <button className="mca-btn" style={{background:'#28a745'}}
            onClick={()=>{ if(!mMonto){showAlert('err:Ingrese el monto');return;}
              abrirVentana(docND(v,mMotivo,mMonto,mObs));
              setModal(null); showAlert('ok:Nota de Débito generada y lista para imprimir.'); }}>
            🖨 Generar e Imprimir</button>
          <button className="mca-btn" style={{background:'#6c757d'}} onClick={()=>setModal(null)}>✕ Cancelar</button>
        </>}>
        <Resumen/>
        <div className="mca-row"><span className="mca-label">Motivo ND:</span>
          <select className="mca-inp" value={mMotivo} onChange={e=>setMMotivo(e.target.value)}>
            {MOTIVOS_ND.map(x=><option key={x}>{x}</option>)}</select></div>
        <div className="mca-row"><span className="mca-label">Monto S/:</span>
          <input className="mca-inp" type="number" placeholder="0.00"
            value={mMonto} onChange={e=>setMMonto(e.target.value)}/></div>
        <div className="mca-row"><span className="mca-label">Observación:</span>
          <textarea className="mca-inp" rows={2} value={mObs}
            onChange={e=>setMObs(e.target.value)} style={{resize:'none'}}/></div>
      </Wrap>
    );

    /* NOTA CRÉDITO */
    if (modal.tipo==='nc') return (
      <Wrap color="#dc3545" titulo={`NC Nota de Crédito — ${v.documento}`}
        footer={<>
          <button className="mca-btn" style={{background:'#dc3545'}}
            onClick={()=>{ if(!mMonto){showAlert('err:Ingrese el monto');return;}
              abrirVentana(docNC(v,mMotivo,mMonto,mObs));
              setModal(null); showAlert('ok:Nota de Crédito generada y lista para imprimir.'); }}>
            🖨 Generar e Imprimir</button>
          <button className="mca-btn" style={{background:'#6c757d'}} onClick={()=>setModal(null)}>✕ Cancelar</button>
        </>}>
        <Resumen/>
        <div className="mca-row"><span className="mca-label">Motivo NC:</span>
          <select className="mca-inp" value={mMotivo} onChange={e=>setMMotivo(e.target.value)}>
            {MOTIVOS_NC.map(x=><option key={x}>{x}</option>)}</select></div>
        <div className="mca-row"><span className="mca-label">Monto S/:</span>
          <input className="mca-inp" type="number" placeholder="0.00"
            value={mMonto} onChange={e=>setMMonto(e.target.value)}/></div>
        <div className="mca-row"><span className="mca-label">Observación:</span>
          <textarea className="mca-inp" rows={2} value={mObs}
            onChange={e=>setMObs(e.target.value)} style={{resize:'none'}}/></div>
      </Wrap>
    );

    /* TICKET */
    if (modal.tipo==='ticket') return (
      <Wrap color="#17a2b8" titulo={`🖨 Ticket — ${v.documento}`}
        footer={<>
          <button className="mca-btn" style={{background:'#17a2b8'}}
            onClick={()=>{ abrirVentana(docTicket(v)); setModal(null); }}>
            🖨 Ver e Imprimir</button>
          <button className="mca-btn" style={{background:'#6c757d'}} onClick={()=>setModal(null)}>✕ Cerrar</button>
        </>}>
        <Resumen/>
        <div style={{fontFamily:'monospace',fontSize:12,background:'#f8f9fa',
          border:'1px dashed #999',borderRadius:4,padding:12,lineHeight:1.8}}>
          ================================<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;COMPROBANTE DE PAGO<br/>
          ================================<br/>
          Doc&nbsp;&nbsp;: {v.documento}<br/>
          Fecha: {fmtFecha(v.fecha)}<br/>
          --------------------------------<br/>
          Cliente : {v.cliente}<br/>
          Vendedor: {v.vendedor}<br/>
          --------------------------------<br/>
          TOTAL S/ : <b>{v.soles}</b><br/>
          {v.dolares&&<>TOTAL US$: <b>{v.dolares}</b><br/></>}
          ================================<br/>
          SUNAT: <b>{v.sunat}</b><br/>
          ================================
        </div>
      </Wrap>
    );

    /* COTIZAR */
    if (modal.tipo==='cotizar') return (
      <Wrap color="#6c9bd1" titulo={`↺ Cotizar — ${v.documento}`}
        footer={<>
          <button className="mca-btn" style={{background:'#6c9bd1'}}
            onClick={()=>{ abrirVentana(docCotizacion(v,mDias,mObs));
              setModal(null); showAlert('ok:Cotización generada y lista para imprimir.'); }}>
            🖨 Generar e Imprimir</button>
          <button className="mca-btn" style={{background:'#6c757d'}} onClick={()=>setModal(null)}>✕ Cancelar</button>
        </>}>
        <Resumen/>
        <div className="mca-row"><span className="mca-label">Validez (días):</span>
          <input className="mca-inp" type="number" value={mDias}
            onChange={e=>setMDias(e.target.value)} style={{maxWidth:100}}/></div>
        <div className="mca-row"><span className="mca-label">Observación:</span>
          <textarea className="mca-inp" rows={2} value={mObs}
            onChange={e=>setMObs(e.target.value)} style={{resize:'none'}}/></div>
      </Wrap>
    );

    /* CLIENTE */
    if (modal.tipo==='cliente') return (
      <Wrap color="#17a2b8" titulo="👤 Ficha del Cliente"
        footer={<>
          <button className="mca-btn" style={{background:'#17a2b8'}}
            onClick={()=>{ abrirVentana(docCliente(v)); setModal(null); }}>
            🖨 Imprimir Ficha</button>
          <button className="mca-btn" style={{background:'#6c757d'}} onClick={()=>setModal(null)}>✕ Cerrar</button>
        </>}>
        <Resumen/>
        <div className="mca-row"><span className="mca-label">Dirección:</span>
          <span style={{fontSize:13}}>{v.direccion}</span></div>
      </Wrap>
    );

    /* VENDER */
    if (modal.tipo==='vender') return (
      <Wrap color="#003d6b" titulo={`VTA Nueva Venta — ${v.cliente}`}
        footer={<>
          <button className="mca-btn" style={{background:'#003d6b'}}
            onClick={()=>{ abrirVentana(docVenta(v)); setModal(null); showAlert('ok:Pedido generado.'); }}>
            📄 Generar Pedido</button>
          <button className="mca-btn" style={{background:'#6c757d'}} onClick={()=>setModal(null)}>✕ Cancelar</button>
        </>}>
        <Resumen/>
        <div style={{background:'#fff3cd',border:'1px solid #ffc107',borderRadius:6,
          padding:'10px 14px',fontSize:13,color:'#856404'}}>
          Se generará un pedido con los datos del cliente <b>{v.cliente}</b> prellenados.
        </div>
      </Wrap>
    );

    /* PDF */
    if (modal.tipo==='pdf') return (
      <Wrap color="#dc3545" titulo={`PDF — ${v.documento}`}
        footer={<>
          <button className="mca-btn" style={{background:'#dc3545'}}
            onClick={()=>{ abrirVentana(docPDF(v)); setModal(null); }}>
            🖨 Ver e Imprimir PDF</button>
          <button className="mca-btn" style={{background:'#6c757d'}} onClick={()=>setModal(null)}>✕ Cerrar</button>
        </>}>
        <Resumen/>
        <div className="mca-row">
          <span className="mca-label">Estado SUNAT:</span>
          <span className="badge" style={{background:SUNAT_COLOR[v.sunat]||'#6c757d',fontSize:13,padding:'4px 12px'}}>{v.sunat}</span>
        </div>
      </Wrap>
    );

    /* XML */
    if (modal.tipo==='xml') return (
      <Wrap color="#555" titulo={`</> XML — ${v.documento}`}
        footer={<>
          <button className="mca-btn" style={{background:'#555'}}
            onClick={()=>{ descargarXML(v); setModal(null); showAlert('ok:XML descargado.'); }}>
            ⬇ Descargar XML</button>
          <button className="mca-btn" style={{background:'#6c757d'}} onClick={()=>setModal(null)}>✕ Cerrar</button>
        </>}>
        <Resumen/>
        <div className="xml-pre">{docXML(v)}</div>
      </Wrap>
    );

    /* SUNAT */
    if (modal.tipo==='sunat') return (
      <Wrap color="#e67e22" titulo={`📖 Ticket SUNAT — ${v.documento}`}
        footer={<>
          <button className="mca-btn" style={{background:'#e67e22'}}
            onClick={()=>{ abrirVentana(docSunat(v)); setModal(null); }}>
            🖨 Ver Ticket SUNAT</button>
          <button className="mca-btn" style={{background:'#17a2b8'}}
            onClick={()=>window.open('https://e-consulta.sunat.gob.pe/ol-ti-itconsvalicpe/ConsValiCpe.htm','_blank')}>
            🌐 Portal SUNAT</button>
          <button className="mca-btn" style={{background:'#6c757d'}} onClick={()=>setModal(null)}>✕ Cerrar</button>
        </>}>
        <Resumen/>
        <div className="mca-row">
          <span className="mca-label">Estado SUNAT:</span>
          <span className="badge" style={{background:SUNAT_COLOR[v.sunat]||'#6c757d',fontSize:13,padding:'4px 12px'}}>{v.sunat}</span>
        </div>
        <div style={{background:'#fff3cd',border:'1px solid #ffc107',borderRadius:6,
          padding:'10px 14px',fontSize:13,color:'#856404',marginTop:8}}>
          Este documento puede consultarse en el portal de SUNAT usando el botón <b>Portal SUNAT</b>.
        </div>
      </Wrap>
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

      {/* título */}
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}} className="no-print">
        <span style={{background:'#0099ff',color:'#fff',borderRadius:'50%',width:22,height:22,
          display:'inline-flex',alignItems:'center',justifyContent:'center',
          fontSize:13,fontWeight:'bold',cursor:'pointer'}}>?</span>
        <span style={{fontSize:16,fontWeight:'bold'}}>Credito acumulado</span>
      </div>

      {/* barra */}
      <div className="ca-bar no-print">
        <div>
          <div style={{fontWeight:'bold',fontSize:13,marginBottom:4}}>BUSCAR X</div>
          <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap',marginBottom:6}}>
            <select value={bSucur} onChange={e=>setBSucur(e.target.value)}>
              <option value="">Sucursal ▾</option>
              <option value="3">Almacen 1</option>
              <option value="2">Tienda2</option>
              <option value="1">Tienda1</option>
            </select>
            <span style={{fontWeight:'bold',fontSize:13}}>y/o</span>
            <div className="ca-radio">
              {[['1','Nro'],['2','clientes'],['3','Vendedor']].map(([val,lbl])=>(
                <label key={val}><input type="radio" name="caTipo" value={val}
                  checked={bTipo===val} onChange={()=>setBTipo(val)}/> {lbl} /</label>
              ))}
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <input type="text" value={bq} onChange={e=>setBq(e.target.value)} style={{width:280}}/>
            <span style={{fontWeight:'bold',fontSize:13}}>y/o</span>
          </div>
        </div>
        <div><label>Fecha Inicio</label><DP id="caFI" value={bfi} onChange={setBfi}/></div>
        <div><label>Fecha Fin</label><DP id="caFF" value={bff} onChange={setBff}/></div>
        <button className="btn-ca" style={{background:'#17a2b8'}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2"/>
          </svg> Buscar
        </button>
        <button className="btn-ca" style={{background:'#17a2b8'}}>
          <span style={{fontSize:16,fontWeight:'bold'}}>+</span> Agregar Nuevo
        </button>
      </div>

      {/* tabla */}
      <div className="ca-titulo">LISTADO GENERAL</div>
      <table className="tca">
        <thead>
          <tr>
            <th>Documento</th><th>Fecha</th><th>Cliente</th>
            <th>Vendedor</th><th>T.vta</th><th>SUNAT</th>
            <th>Estado</th><th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {listaFilt.length===0
            ? <tr><td colSpan={8} align="center" style={{padding:20,color:'#888'}}>Sin registros</td></tr>
            : listaFilt.map(v=>(
              <tr key={v.id}>
                <td><b>{v.documento}</b></td>
                <td align="center">{fmtFecha(v.fecha)}</td>
                <td>{v.cliente}</td>
                <td>{v.vendedor}</td>
                <td align="center">{v.tvta}</td>
                <td align="center">
                  <span className="badge" style={{background:SUNAT_COLOR[v.sunat]||'#6c757d'}}>{v.sunat}</span>
                </td>
                <td align="center">
                  <span className="badge" style={{background:ESTADO_COLOR[v.estado]||'#6c757d'}}>{v.estado}</span>
                </td>
                <Opciones v={v}/>
              </tr>
            ))
          }
        </tbody>
      </table>

      {/* leyenda */}
      <hr style={{border:'none',borderTop:'1px solid #dee2e6',margin:'14px 0 8px'}} className="no-print"/>
      <div className="leyenda-ca no-print">
        <b>Leyenda de OPCIONES :</b>
        {[['#e67e22','✏','Actualizar, Eliminar'],['#28a745','ND','Generar Nota de Debito'],
          ['#dc3545','NC','Generar Nota de Credito'],['#17a2b8','🖨','Imprimir Ticket'],
          ['#6c9bd1','↺','Cotizar'],['#17a2b8','👤','cliente'],['#6c757d','VTA','Vender'],
          ['#dc3545','PDF','Imprimir Factura y boleta lectronica'],
          ['#555','</>','Exportar XML'],['#e67e22','📖','Leer Ticket(sunat)'],
        ].map(([bg,ico,txt])=>(
          <span key={txt} style={{display:'flex',alignItems:'center',gap:4}}>
            <span style={{background:bg,color:'#fff',borderRadius:4,padding:'2px 6px',
              fontSize:11,fontWeight:'bold',minWidth:22,display:'inline-flex',
              alignItems:'center',justifyContent:'center'}}>{ico}</span>
            <span>{txt}</span>
          </span>
        ))}
      </div>

      <Modal/>
    </>
  );
}