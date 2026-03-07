import React, { useState, useRef } from 'react';

const styles = `
  .page-container { padding:20px; font-family:Arial,Helvetica,sans-serif; font-size:13px; }
  .page-container * { color:#212529; box-sizing:border-box; }
  .page-title { font-size:16px; font-weight:bold; margin-bottom:16px; display:flex; align-items:center; gap:8px; }
  .form-title  { font-size:17px; font-weight:normal; margin-bottom:14px; }

  .filtro-row { display:flex; align-items:flex-end; gap:10px; flex-wrap:wrap; margin-bottom:18px; }
  .filtro-select { padding:6px 10px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; min-width:155px; }
  .filtro-txt-wrap { display:flex; align-items:center; gap:6px; flex:1; min-width:180px; }
  .filtro-txt-wrap input { flex:1; padding:6px 10px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; }
  .filtro-txt-wrap input::placeholder { color:#adb5bd; font-style:italic; }
  .yo { font-weight:bold; font-size:13px; }
  .filtro-fecha { display:flex; flex-direction:column; gap:3px; }
  .filtro-fecha label { font-size:12px; font-weight:bold; }

  .dg { display:flex; align-items:center; border:1px solid #ced4da; border-radius:4px; background:#fff; overflow:hidden; }
  .dg.verde { border:2px solid #28a745; background:#d4edda; }
  .dg .dt  { flex:1; border:none; outline:none; padding:6px 8px; font-size:13px; color:#212529; background:transparent; cursor:pointer; min-width:110px; }
  .dg.verde .dt { font-weight:bold; }
  .dg input[type=date] { position:absolute; opacity:0; width:0; height:0; pointer-events:none; }
  .dg .cb  { background:transparent; border:none; border-left:1px solid #ced4da; padding:0 7px; height:34px; cursor:pointer; display:flex; align-items:center; flex-shrink:0; }
  .dg.verde .cb { border-left:2px solid #28a745; }

  .btn-buscar { background:#17a2b8; border:1px solid #17a2b8; color:#fff !important; padding:6px 14px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:5px; height:34px; white-space:nowrap; }
  .btn-buscar:hover { background:#138496; }
  .btn-nuevo  { background:#17a2b8; border:1px solid #17a2b8; color:#fff !important; padding:6px 14px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:5px; height:34px; white-space:nowrap; }
  .btn-nuevo:hover  { background:#138496; }

  .tit-tabla { text-align:center; font-weight:bold; font-size:14px; padding:6px 0; }
  table.tbl { width:100%; border-collapse:collapse; font-size:13px; }
  table.tbl thead tr { background:#17a2b8; }
  table.tbl thead th { padding:10px 8px; text-align:center; font-weight:bold; color:#fff !important; white-space:nowrap; }
  table.tbl tbody tr { background:#fff; border-bottom:1px solid #dee2e6; }
  table.tbl tbody tr:hover { background:#f8f9fa; }
  table.tbl tbody td { padding:7px 8px; }
  .empty { text-align:center; color:#888; padding:20px; }

  .bp { background:#ffc107; color:#212529 !important; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:bold; }
  .bc { background:#28a745; color:#fff !important;    padding:2px 8px; border-radius:10px; font-size:11px; font-weight:bold; }
  .ba { background:#dc3545; color:#fff !important;    padding:2px 8px; border-radius:10px; font-size:11px; font-weight:bold; }
  .be { background:#17a2b8; color:#fff !important;    padding:2px 8px; border-radius:10px; font-size:11px; font-weight:bold; }

  .ops { display:flex; gap:3px; justify-content:center; align-items:center; }
  .ico { background:none; border:none; cursor:pointer; padding:2px 3px; border-radius:3px; transition:transform .12s; font-size:18px; line-height:1; }
  .ico:hover { transform:scale(1.25); }

  .leyenda { margin-top:10px; padding:8px 12px; font-size:12px; border-top:1px solid #dee2e6; display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
  .ley-item { display:flex; align-items:center; gap:4px; white-space:nowrap; }

  hr.sep { border:none; border-top:1px solid #dee2e6; margin:6px 0 14px; }

  .f1 { display:flex; align-items:flex-end; gap:8px; flex-wrap:wrap; margin-bottom:14px; }
  .fld { display:flex; flex-direction:column; gap:3px; }
  .fld label { font-size:11px; font-weight:bold; white-space:nowrap; }
  .fld input,.fld select { padding:5px 8px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; }
  .fld .verde-in { background:#d4edda; border:2px solid #28a745; font-weight:bold; }
  .dias-lbl { font-size:12px; padding-bottom:8px; color:#555; }

  .f2 { display:flex; align-items:flex-start; gap:12px; flex-wrap:wrap; margin-bottom:14px; }
  .fv { display:flex; flex-direction:column; gap:3px; }
  .fv label { font-size:11px; font-weight:bold; }
  .fv select,.fv textarea { padding:5px 8px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; }
  .fv textarea { resize:vertical; min-height:50px; }
  .cond { display:flex; align-items:center; gap:10px; margin-top:4px; font-size:13px; }
  .cond label { display:flex; align-items:center; gap:3px; cursor:pointer; }
  .cond input[type=radio] { accent-color:#17a2b8; }

  .f3 { display:flex; align-items:flex-end; gap:10px; flex-wrap:wrap; margin-bottom:14px; }
  .fc { display:flex; flex-direction:column; gap:3px; }
  .fc label { font-size:11px; font-weight:bold; }
  .fc input { padding:5px 8px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; width:100%; }
  .search-box { display:flex; }
  .search-box input { border-radius:4px 0 0 4px; border-right:none; width:100px; }
  .search-box button { background:#f8f9fa; border:1px solid #ced4da; border-radius:0 4px 4px 0; padding:0 8px; cursor:pointer; height:32px; font-size:13px; }
  .bino-box { display:flex; }
  .bino-box input { border-radius:4px 0 0 4px; border-right:none; flex:1; min-width:200px; }
  .bino-box button { background:#f8f9fa; border:1px solid #ced4da; border-radius:0 4px 4px 0; padding:0 8px; cursor:pointer; height:32px; font-size:13px; }

  .bart-title { font-weight:bold; font-size:13px; margin-bottom:8px; }
  .bart-radios { display:flex; align-items:center; gap:8px; flex-wrap:wrap; font-size:13px; margin-bottom:6px; }
  .bart-radios label { display:flex; align-items:center; gap:3px; cursor:pointer; }
  .bart-radios input[type=radio] { accent-color:#17a2b8; }
  .bart-row { display:flex; align-items:center; gap:8px; margin-bottom:10px; }
  .bart-row input { flex:1; padding:6px 10px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; }
  .btn-bart { background:#17a2b8; border:1px solid #17a2b8; color:#fff !important; padding:6px 14px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:5px; height:34px; }
  .btn-bart:hover { background:#138496; }
  .btn-reset { background:#6c757d; border:1px solid #6c757d; color:#fff !important; padding:0 10px; cursor:pointer; font-size:16px; border-radius:4px; height:34px; }

  table.tbl-a { width:100%; border-collapse:collapse; font-size:12px; margin-bottom:8px; }
  table.tbl-a thead tr { background:#17a2b8; }
  table.tbl-a thead th { padding:8px 5px; text-align:center; color:#fff !important; font-weight:bold; }
  table.tbl-a tbody tr { border-bottom:1px solid #dee2e6; }
  table.tbl-a tbody td { padding:4px 5px; vertical-align:middle; }
  table.tbl-a tfoot td { background:#f0f0f0; font-weight:bold; padding:6px 8px; }
  .tin { border:1px solid #ced4da; border-radius:3px; padding:3px 5px; font-size:12px; width:100%; color:#212529; background:#fff; }
  .tin:focus { border-color:#80bdff; outline:none; }
  .tsel select { width:100%; padding:3px 3px; border:1px solid #ced4da; border-radius:3px; font-size:11px; background:#fff; color:#212529; }
  .btn-chk { width:26px; height:26px; border:none; border-radius:3px; cursor:pointer; font-size:14px; color:#fff !important; display:flex; align-items:center; justify-content:center; margin:auto; }

  .btns-row { display:flex; justify-content:center; gap:10px; margin-top:20px; }
  .btn-g { background:#17a2b8; border:1px solid #17a2b8; color:#fff !important; padding:8px 20px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:6px; }
  .btn-g:hover { background:#138496; }

  .alert-ok  { background:#d4edda; border:1px solid #c3e6cb; color:#155724 !important; padding:8px 14px; border-radius:4px; margin-bottom:10px; font-size:13px; display:inline-block; }
  .alert-err { background:#f8d7da; border:1px solid #f5c6cb; color:#721c24 !important; padding:8px 14px; border-radius:4px; margin-bottom:10px; font-size:13px; display:inline-block; }

  /* ── MODAL ── */
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.45); z-index:1000; display:flex; align-items:center; justify-content:center; }
  .modal-box { background:#fff; border-radius:6px; box-shadow:0 8px 32px rgba(0,0,0,0.22); min-width:340px; max-width:520px; width:90%; padding:0; overflow:hidden; }
  .modal-header { padding:12px 18px; font-weight:bold; font-size:14px; display:flex; align-items:center; gap:8px; }
  .modal-body { padding:16px 18px; font-size:13px; }
  .modal-footer { padding:10px 18px; display:flex; justify-content:flex-end; gap:8px; border-top:1px solid #dee2e6; }
  .modal-btn { padding:6px 18px; border-radius:4px; border:none; cursor:pointer; font-size:13px; font-weight:bold; }
  .modal-btn-cancel { background:#6c757d; color:#fff; }
  .modal-btn-ok     { color:#fff; }

  /* email form */
  .email-fld { display:flex; flex-direction:column; gap:3px; margin-bottom:10px; }
  .email-fld label { font-size:11px; font-weight:bold; }
  .email-fld input, .email-fld textarea { padding:6px 9px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; }
  .email-fld textarea { resize:vertical; min-height:70px; }

  /* credito form */
  .cred-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .cred-fld { display:flex; flex-direction:column; gap:3px; }
  .cred-fld label { font-size:11px; font-weight:bold; }
  .cred-fld input, .cred-fld select { padding:6px 9px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; }

  /* guia remision */
  .guia-fld { display:flex; flex-direction:column; gap:3px; margin-bottom:10px; }
  .guia-fld label { font-size:11px; font-weight:bold; }
  .guia-fld input, .guia-fld select { padding:6px 9px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; }
`;

/* ---- CalIcon ---- */
const CalIcon = () => (
  <svg width="20" height="20" viewBox="0 0 36 36" fill="none">
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
    {[14,19,25].map(y=>[3,12,21,30].map(x=>(
      <rect key={`${x}-${y}`} x={x} y={y} width={x===30?4:5} height="3" rx="0.5" fill="#27ae60"/>
    )))}
  </svg>
);

const DP = ({ value, onChange, verde, width }) => {
  const ref = useRef(null);
  const open = () => { try { ref.current?.showPicker(); } catch { ref.current?.click(); } };
  return (
    <div className={`dg${verde?' verde':''}`} style={width?{width}:{}}>
      <span className="dt" onClick={open}>{value||<span style={{color:'#adb5bd'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>}</span>
      <input ref={ref} type="date" value={value} onChange={e=>onChange(e.target.value)} tabIndex={-1}/>
      <button type="button" className="cb" onClick={open}><CalIcon/></button>
    </div>
  );
};
const DPLabel = ({ label, value, onChange }) => {
  const ref = useRef(null);
  const fmt = iso => iso ? iso.split('-').reverse().join('/') : '';
  const open = () => { try { ref.current?.showPicker(); } catch { ref.current?.click(); } };
  return (
    <div className="filtro-fecha">
      <label>{label}</label>
      <div className="dg">
        <span className="dt" onClick={open}>{fmt(value)||<span style={{color:'#adb5bd'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>}</span>
        <input ref={ref} type="date" value={value} onChange={e=>onChange(e.target.value)} tabIndex={-1}/>
        <button type="button" className="cb" onClick={open}><CalIcon/></button>
      </div>
    </div>
  );
};

/* ---- íconos SVG ---- */
const IcoPDF = () => (
  <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
    <rect x="1" y="1" width="14" height="18" rx="2" fill="#fff" stroke="#e74c3c" strokeWidth="1.5"/>
    <rect x="1" y="1" width="9"  height="7"  rx="2" fill="#e74c3c"/>
    <line x1="4" y1="11" x2="12" y2="11" stroke="#e74c3c" strokeWidth="1"/>
    <line x1="4" y1="14" x2="12" y2="14" stroke="#e74c3c" strokeWidth="1"/>
    <line x1="4" y1="17" x2="9"  y2="17" stroke="#e74c3c" strokeWidth="1"/>
  </svg>
);
const IcoEdit = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M4 20h4l10-10-4-4L4 16v4z" fill="#f0ad4e" stroke="#f0ad4e" strokeWidth="0.5"/>
    <path d="M16 4l4 4" stroke="#c87f0a" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IcoTrash = () => (
  <svg width="16" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#9e9e9e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);
const IcoMail = () => (
  <svg width="20" height="15" viewBox="0 0 24 18" fill="none">
    <rect x="1" y="1" width="22" height="16" rx="2" fill="#fff" stroke="#aaa" strokeWidth="1.5"/>
    <path d="M1 3l11 8L23 3" stroke="#aaa" strokeWidth="1.5" fill="none"/>
  </svg>
);
const IcoClipGreen = () => (
  <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
    <rect x="1" y="3" width="14" height="17" rx="2" fill="#fff" stroke="#669900" strokeWidth="1.5"/>
    <rect x="5" y="1" width="6" height="4" rx="1" fill="#669900"/>
    <line x1="4" y1="9"  x2="13" y2="9"  stroke="#669900" strokeWidth="1.2"/>
    <line x1="4" y1="12" x2="13" y2="12" stroke="#669900" strokeWidth="1.2"/>
    <line x1="4" y1="15" x2="9"  y2="15" stroke="#669900" strokeWidth="1.2"/>
  </svg>
);
const IcoClipRed = () => (
  <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
    <rect x="1" y="3" width="14" height="17" rx="2" fill="#fff" stroke="#CC3300" strokeWidth="1.5"/>
    <rect x="5" y="1" width="6" height="4" rx="1" fill="#CC3300"/>
    <line x1="4" y1="9"  x2="13" y2="9"  stroke="#CC3300" strokeWidth="1.2"/>
    <line x1="4" y1="12" x2="11" y2="12" stroke="#CC3300" strokeWidth="1.2"/>
    <line x1="4" y1="15" x2="9"  y2="15" stroke="#CC3300" strokeWidth="1.2"/>
  </svg>
);
const IcoCard = () => (
  <svg width="22" height="16" viewBox="0 0 26 18" fill="none">
    <rect x="1" y="1" width="24" height="16" rx="3" fill="#fff" stroke="#aaa" strokeWidth="1.5"/>
    <rect x="1" y="5" width="24" height="4" fill="#9e9e9e"/>
    <rect x="3" y="12" width="8" height="3" rx="1" fill="#bbb"/>
  </svg>
);

/* ---- constantes ---- */
const BUSCAR_OPTS = ['BUSCAR X','Nro Cotizacion','clientes','Vendedor','Estado'];
const ESTADOS     = ['Pendiente','Confirmado','Anulado','Enviado'];
const VENDEDORES  = ['Iturri, Quispe, Smith','Merino, Cahuna, Wilver Enmanuel','Romero, Merino, Alexander Renson','Yupanqui, Barboza, Raysa'];
const IGV_OPTS    = ['Incluido IGV','Sin IGV','Afecto IGV'];
const MONEDA_OPTS = ['Dolares','Soles'];
const ART_RADIO   = ['Nombre','Marca','Linea','Categoria','Codigo','C.Barra'];
const TAIGV_OPTS  = ['Gravado - Oper.','Exonerado','Inafecto'];
const MED_OPTS    = ['Unidad','Caja','Kg','Litro','Metro','Par'];
const BANCO_OPTS  = ['BCP','BBVA','Interbank','Scotiabank','BanBif'];
const TRANSP_OPTS = ['OLVA Courier','Shalom','Cruz del Sur','DHL','Recojo en tienda'];

const DATOS_INI = [
  { id:1, nro:'COT-0001', fecha:'2026-03-10', cliente:'García López, María',
    resp:'Iturri, Quispe, Smith', estado:'Pendiente',
    oferta:'30', tentrega:'7', garantia:'', igv:'Incluido IGV', moneda:'Dolares', tipocambio:'4.500',
    condicion:'Contado', atencion:'', comentario:'', clienteDir:'Av. Lima 123', clienteEmail:'garcia@mail.com',
    items:[{cod:'A001',desc:'Laptop HP 14"',stock:'10',med:'Unidad',preciom:'320.00',pventa:'320.00',cant:'1',taigv:'Gravado - Oper.',sel:true}] },
  { id:2, nro:'COT-0002', fecha:'2026-03-12', cliente:'Comercial Norte SAC',
    resp:'Yupanqui, Barboza, Raysa', estado:'Confirmado',
    oferta:'15', tentrega:'3', garantia:'', igv:'Incluido IGV', moneda:'Soles', tipocambio:'4.500',
    condicion:'Credito', atencion:'', comentario:'', clienteDir:'Jr. Tacna 456', clienteEmail:'norte@mail.com',
    items:[{cod:'A002',desc:'Monitor 24"',stock:'5',med:'Unidad',preciom:'350.00',pventa:'350.00',cant:'2',taigv:'Gravado - Oper.',sel:true}] },
  { id:3, nro:'COT-0003', fecha:'2026-03-14', cliente:'Distribuidora Sur EIRL',
    resp:'Merino, Cahuna, Wilver Enmanuel', estado:'Anulado',
    oferta:'', tentrega:'', garantia:'', igv:'Sin IGV', moneda:'Soles', tipocambio:'4.500',
    condicion:'Contado', atencion:'', comentario:'', clienteDir:'', clienteEmail:'',
    items:[] },
];

const ITEM_BLANK = { cod:'', desc:'', stock:'1.00', med:'Unidad', preciom:'0', pventa:'0.00', cant:'', taigv:'Gravado - Oper.', sel:false };

const makeForm = (nroSig) => ({
  id: null, nro: String(nroSig),
  fecha: new Date().toISOString().slice(0,10),
  oferta:'', tentrega:'', garantia:'',
  igv:'Incluido IGV', moneda:'Dolares', tipocambio:'4.500',
  resp: VENDEDORES[0], condicion:'Contado',
  atencion:'', comentario:'',
  clienteId:'', clienteRazon:'', clienteDir:'', clienteEmail:'',
  estado:'Pendiente', artTipo:'Nombre', artTxt:'',
  items:[{...ITEM_BLANK}],
});

const getBadge = e => {
  if (e==='Confirmado') return <span className="bc">Confirmado</span>;
  if (e==='Anulado')    return <span className="ba">Anulado</span>;
  if (e==='Enviado')    return <span className="be">Enviado</span>;
  return <span className="bp">Pendiente</span>;
};

/* ══════════════════════════════════════════════
   MODALES
══════════════════════════════════════════════ */

/* Modal: Confirmar venta */
const ModalConfirmar = ({ cot, onConfirm, onClose }) => (
  <div className="modal-overlay">
    <div className="modal-box">
      <div className="modal-header" style={{background:'#d4edda'}}>
        <IcoClipGreen/> Confirmar Venta
      </div>
      <div className="modal-body">
        <p style={{marginBottom:8}}>¿Desea confirmar la cotización <b>{cot.nro}</b> como venta?</p>
        <p style={{color:'#555',fontSize:12}}>Cliente: <b>{cot.cliente}</b></p>
        <p style={{color:'#555',fontSize:12}}>Total ítems: <b>{cot.items.length}</b></p>
        <p style={{marginTop:12,padding:'8px 12px',background:'#fff3cd',borderRadius:4,fontSize:12,color:'#856404'}}>
          Al confirmar, el estado de la cotización cambiará a <b>Confirmado</b>.
        </p>
      </div>
      <div className="modal-footer">
        <button className="modal-btn modal-btn-cancel" onClick={onClose}>Cancelar</button>
        <button className="modal-btn modal-btn-ok" style={{background:'#28a745'}} onClick={onConfirm}>✔ Confirmar Venta</button>
      </div>
    </div>
  </div>
);

/* Modal: Enviar Email */
const ModalEmail = ({ cot, onSend, onClose }) => {
  const [email, setEmail]   = useState(cot.clienteEmail || '');
  const [asunto, setAsunto] = useState(`Cotización ${cot.nro} - ${cot.cliente}`);
  const [cuerpo, setCuerpo] = useState(`Estimado cliente,\n\nAdjuntamos la cotización ${cot.nro} para su revisión.\n\nQuedamos a su disposición.\n\nAtentamente,\n${cot.resp}`);
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header" style={{background:'#e2e3e5'}}>
          <IcoMail/> Enviar Cotización por E-mail
        </div>
        <div className="modal-body">
          <div className="email-fld">
            <label>Destinatario (E-mail) : (*)</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="correo@ejemplo.com"/>
          </div>
          <div className="email-fld">
            <label>Asunto :</label>
            <input value={asunto} onChange={e=>setAsunto(e.target.value)}/>
          </div>
          <div className="email-fld">
            <label>Mensaje :</label>
            <textarea value={cuerpo} onChange={e=>setCuerpo(e.target.value)} rows={5}/>
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-btn modal-btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="modal-btn modal-btn-ok" style={{background:'#17a2b8'}}
            onClick={()=>{ if(!email){alert('Ingrese un e-mail.'); return;} onSend(email,asunto,cuerpo); }}>
            ✉ Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

/* Modal: Generar Guía de Remisión */
const ModalGuia = ({ cot, onGenerar, onClose }) => {
  const [motivo,    setMotivo]    = useState('Venta');
  const [transp,    setTransp]    = useState(TRANSP_OPTS[0]);
  const [ruc,       setRuc]       = useState('');
  const [ftraslado, setFtraslado] = useState(new Date().toISOString().slice(0,10));
  const [destino,   setDestino]   = useState(cot.clienteDir || '');
  const dpRef = useRef(null);
  const openDP = () => { try { dpRef.current?.showPicker(); } catch { dpRef.current?.click(); } };
  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{maxWidth:480}}>
        <div className="modal-header" style={{background:'#f8d7da'}}>
          <IcoClipRed/> Generar Guía de Remisión — {cot.nro}
        </div>
        <div className="modal-body">
          <div className="guia-fld">
            <label>Motivo de traslado :</label>
            <select value={motivo} onChange={e=>setMotivo(e.target.value)}>
              {['Venta','Compra','Traslado entre establecimientos','Devolución','Consignación'].map(m=>(
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="guia-fld">
            <label>Transportista :</label>
            <select value={transp} onChange={e=>setTransp(e.target.value)}>
              {TRANSP_OPTS.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="guia-fld">
            <label>RUC Transportista :</label>
            <input value={ruc} onChange={e=>setRuc(e.target.value)} placeholder="20XXXXXXXXX"/>
          </div>
          <div className="guia-fld">
            <label>Fecha de traslado :</label>
            <div className="dg" style={{width:175}}>
              <span className="dt" onClick={openDP}>{ftraslado||<span style={{color:'#adb5bd'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>}</span>
              <input ref={dpRef} type="date" value={ftraslado} onChange={e=>setFtraslado(e.target.value)}
                style={{position:'absolute',opacity:0,width:0,height:0,pointerEvents:'none'}} tabIndex={-1}/>
              <button type="button" className="cb" onClick={openDP}><CalIcon/></button>
            </div>
          </div>
          <div className="guia-fld">
            <label>Dirección de destino :</label>
            <input value={destino} onChange={e=>setDestino(e.target.value)} placeholder="Dirección completa"/>
          </div>
          <p style={{fontSize:11,color:'#888',marginTop:4}}>Ítems a remitir: <b>{cot.items.length}</b> | Cliente: <b>{cot.cliente}</b></p>
        </div>
        <div className="modal-footer">
          <button className="modal-btn modal-btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="modal-btn modal-btn-ok" style={{background:'#CC3300'}}
            onClick={()=>onGenerar({motivo,transp,ruc,ftraslado,destino})}>
            📋 Generar Guía
          </button>
        </div>
      </div>
    </div>
  );
};

/* Modal: Crédito – Post Ingreso */
const ModalCredito = ({ cot, onRegistrar, onClose }) => {
  const subtotal = cot.items.reduce((a,it)=>a+(parseFloat(it.pventa)||0)*(parseFloat(it.cant)||0),0);
  const [banco,   setBanco]   = useState(BANCO_OPTS[0]);
  const [nOp,     setNOp]     = useState('');
  const [monto,   setMonto]   = useState(subtotal.toFixed(2));
  const [cuotas,  setCuotas]  = useState('1');
  const [vcto,    setVcto]    = useState('');
  const [obs,     setObs]     = useState('');
  const dpRef = useRef(null);
  const openDP = () => { try { dpRef.current?.showPicker(); } catch { dpRef.current?.click(); } };
  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{maxWidth:460}}>
        <div className="modal-header" style={{background:'#d6d8db'}}>
          <IcoCard/> Crédito – Post Ingreso — {cot.nro}
        </div>
        <div className="modal-body">
          <p style={{fontSize:12,color:'#555',marginBottom:12}}>
            Cliente: <b>{cot.cliente}</b> &nbsp;|&nbsp; Monto total: <b>{cot.moneda==='Dolares'?'US$':'S/'} {subtotal.toFixed(2)}</b>
          </p>
          <div className="cred-grid">
            <div className="cred-fld">
              <label>Banco :</label>
              <select value={banco} onChange={e=>setBanco(e.target.value)}>
                {BANCO_OPTS.map(b=><option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="cred-fld">
              <label>Nro Operación :</label>
              <input value={nOp} onChange={e=>setNOp(e.target.value)} placeholder="N° de operación"/>
            </div>
            <div className="cred-fld">
              <label>Monto ({cot.moneda==='Dolares'?'US$':'S/'}) :</label>
              <input value={monto} onChange={e=>setMonto(e.target.value)} style={{textAlign:'right'}}/>
            </div>
            <div className="cred-fld">
              <label>Cuotas :</label>
              <select value={cuotas} onChange={e=>setCuotas(e.target.value)}>
                {['1','2','3','6','9','12','18','24'].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="cred-fld" style={{gridColumn:'1/-1'}}>
              <label>Fecha de vencimiento :</label>
              <div className="dg" style={{width:175}}>
                <span className="dt" onClick={openDP}>{vcto||<span style={{color:'#adb5bd'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>}</span>
                <input ref={dpRef} type="date" value={vcto} onChange={e=>setVcto(e.target.value)}
                  style={{position:'absolute',opacity:0,width:0,height:0,pointerEvents:'none'}} tabIndex={-1}/>
                <button type="button" className="cb" onClick={openDP}><CalIcon/></button>
              </div>
            </div>
            <div className="cred-fld" style={{gridColumn:'1/-1'}}>
              <label>Observaciones :</label>
              <input value={obs} onChange={e=>setObs(e.target.value)} placeholder="Notas adicionales..."/>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-btn modal-btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="modal-btn modal-btn-ok" style={{background:'#6c757d'}}
            onClick={()=>{ if(!nOp){alert('Ingrese el Nro de Operación.'); return;} onRegistrar({banco,nOp,monto,cuotas,vcto,obs}); }}>
            💳 Registrar Crédito
          </button>
        </div>
      </div>
    </div>
  );
};

/* Modal: Eliminar */
const ModalEliminar = ({ cot, onConfirm, onClose }) => (
  <div className="modal-overlay">
    <div className="modal-box">
      <div className="modal-header" style={{background:'#f8d7da'}}>
        <IcoTrash/> Eliminar Cotización
      </div>
      <div className="modal-body">
        <p style={{marginBottom:8}}>¿Está seguro que desea eliminar la cotización <b>{cot.nro}</b>?</p>
        <p style={{color:'#555',fontSize:12}}>Cliente: <b>{cot.cliente}</b></p>
        <p style={{marginTop:12,padding:'8px 12px',background:'#f8d7da',borderRadius:4,fontSize:12,color:'#721c24'}}>
          Esta acción no se puede deshacer.
        </p>
      </div>
      <div className="modal-footer">
        <button className="modal-btn modal-btn-cancel" onClick={onClose}>Cancelar</button>
        <button className="modal-btn modal-btn-ok" style={{background:'#dc3545'}} onClick={onConfirm}>🗑 Eliminar</button>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════ */
export default function Cotizacion() {
  const [vista, setVista]     = useState('lista');
  const [esNuevo, setEsNuevo] = useState(true);
  const [datos, setDatos]     = useState(DATOS_INI);
  const [filtros, setFiltros] = useState(DATOS_INI);
  const [bSel, setBSel]       = useState('BUSCAR X');
  const [bTxt, setBTxt]       = useState('');
  const [fIni, setFIni]       = useState('');
  const [fFin, setFFin]       = useState('');
  const [form, setForm]       = useState(makeForm(DATOS_INI.length+1));
  const [msg, setMsg]         = useState({t:'',x:''});

  /* ── modales ── */
  const [modalConfirmar, setModalConfirmar] = useState(null); // cot object
  const [modalEmail,     setModalEmail]     = useState(null);
  const [modalGuia,      setModalGuia]      = useState(null);
  const [modalCredito,   setModalCredito]   = useState(null);
  const [modalEliminar,  setModalEliminar]  = useState(null);

  const ok  = x => { setMsg({t:'ok',x}); setTimeout(()=>setMsg({t:'',x:''}),3000); };
  const err = x => { setMsg({t:'err',x}); setTimeout(()=>setMsg({t:'',x:''}),3000); };
  const sf  = (k,v) => setForm(p=>({...p,[k]:v}));
  const si  = (i,k,v) => setForm(p=>{ const its=[...p.items]; its[i]={...its[i],[k]:v}; return {...p,items:its}; });

  const buscar = () => {
    let r=[...datos];
    if (fIni) r=r.filter(d=>d.fecha>=fIni);
    if (fFin) r=r.filter(d=>d.fecha<=fFin);
    if (bTxt && bSel!=='BUSCAR X') {
      const t=bTxt.toLowerCase();
      if (bSel==='Nro Cotizacion') r=r.filter(d=>d.nro.toLowerCase().includes(t));
      if (bSel==='clientes')       r=r.filter(d=>d.cliente.toLowerCase().includes(t));
      if (bSel==='Vendedor')       r=r.filter(d=>d.resp.toLowerCase().includes(t));
      if (bSel==='Estado')         r=r.filter(d=>d.estado.toLowerCase().includes(t));
    }
    setFiltros(r);
    ok(`Se encontraron ${r.length} cotización(es).`);
  };

  const abrirNuevo  = () => { setForm(makeForm(datos.length+1)); setEsNuevo(true); setVista('form'); };
  const abrirEditar = d => {
    setForm({
      id:d.id, nro:d.nro, fecha:d.fecha,
      oferta:d.oferta||'', tentrega:d.tentrega||'', garantia:d.garantia||'',
      igv:d.igv||'Incluido IGV', moneda:d.moneda||'Dolares', tipocambio:d.tipocambio||'4.500',
      resp:d.resp, condicion:d.condicion||'Contado',
      atencion:d.atencion||'', comentario:d.comentario||'',
      clienteId:'', clienteRazon:d.cliente, clienteDir:d.clienteDir||'', clienteEmail:d.clienteEmail||'',
      estado:d.estado, artTipo:'Nombre', artTxt:'',
      items: d.items.length ? d.items.map(x=>({...x})) : [{...ITEM_BLANK}],
    });
    setEsNuevo(false); setVista('form');
  };

  /* acciones de íconos */
  const handleConfirmarVenta = (cot) => {
    const nd = datos.map(d => d.id===cot.id ? {...d, estado:'Confirmado'} : d);
    setDatos(nd); setFiltros(nd);
    setModalConfirmar(null);
    ok(`✔ Cotización ${cot.nro} confirmada como venta.`);
  };

  const handleEnviarEmail = (cot, email, asunto, cuerpo) => {
    setModalEmail(null);
    ok(`✉ Cotización ${cot.nro} enviada a ${email}.`);
  };

  const handleGenerarGuia = (cot, datos_guia) => {
    setModalGuia(null);
    ok(`📋 Guía de Remisión generada para ${cot.nro} — Transportista: ${datos_guia.transp}.`);
  };

  const handleRegistrarCredito = (cot, datos_cred) => {
    setModalCredito(null);
    ok(`💳 Crédito registrado para ${cot.nro} — ${datos_cred.banco} · ${datos_cred.cuotas} cuota(s).`);
  };

  const handleEliminar = (cot) => {
    const nd = datos.filter(d=>d.id!==cot.id);
    setDatos(nd); setFiltros(nd);
    setModalEliminar(null);
    ok(`🗑 Cotización ${cot.nro} eliminada.`);
  };

  const guardar = () => {
    if (!form.clienteRazon || !form.fecha) { err('Complete los campos obligatorios (*).'); return; }
    const nuevo = {
      id: form.id||Date.now(), nro:form.nro, fecha:form.fecha,
      cliente:form.clienteRazon, resp:form.resp, estado:form.estado,
      oferta:form.oferta, tentrega:form.tentrega, garantia:form.garantia,
      igv:form.igv, moneda:form.moneda, tipocambio:form.tipocambio,
      condicion:form.condicion, atencion:form.atencion, comentario:form.comentario,
      clienteDir:form.clienteDir, clienteEmail:form.clienteEmail,
      items: form.items.filter(it=>it.desc||it.cod),
    };
    if (esNuevo) {
      const nd=[...datos,nuevo]; setDatos(nd); setFiltros(nd);
      ok('Cotización registrada.');
    } else {
      const nd=datos.map(d=>d.id===nuevo.id?nuevo:d); setDatos(nd); setFiltros(nd);
      ok('Cotización actualizada.');
    }
    setVista('lista');
  };

  const subtotal = form.items.reduce((a,it)=>
    a+(parseFloat(it.pventa)||0)*(parseFloat(it.cant)||0), 0);

  /* ══════════════════════════════════════════════
     VISTA LISTA
  ══════════════════════════════════════════════ */
  if (vista==='lista') return (
    <><style>{styles}</style>
    <div className="page-container">

      {/* Modales */}
      {modalConfirmar && (
        <ModalConfirmar cot={modalConfirmar}
          onConfirm={()=>handleConfirmarVenta(modalConfirmar)}
          onClose={()=>setModalConfirmar(null)}/>
      )}
      {modalEmail && (
        <ModalEmail cot={modalEmail}
          onSend={(email,asunto,cuerpo)=>handleEnviarEmail(modalEmail,email,asunto,cuerpo)}
          onClose={()=>setModalEmail(null)}/>
      )}
      {modalGuia && (
        <ModalGuia cot={modalGuia}
          onGenerar={(d)=>handleGenerarGuia(modalGuia,d)}
          onClose={()=>setModalGuia(null)}/>
      )}
      {modalCredito && (
        <ModalCredito cot={modalCredito}
          onRegistrar={(d)=>handleRegistrarCredito(modalCredito,d)}
          onClose={()=>setModalCredito(null)}/>
      )}
      {modalEliminar && (
        <ModalEliminar cot={modalEliminar}
          onConfirm={()=>handleEliminar(modalEliminar)}
          onClose={()=>setModalEliminar(null)}/>
      )}

      <div className="page-title">
        <span style={{background:'#17a2b8',color:'#fff',borderRadius:'50%',width:22,height:22,
          display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:'bold'}}>?</span>
        COTIZACION
      </div>

      {msg.x && <div className={msg.t==='ok'?'alert-ok':'alert-err'}>{msg.t==='ok'?'✅':'⚠️'} {msg.x}</div>}

      <div className="filtro-row">
        <select className="filtro-select" value={bSel} onChange={e=>setBSel(e.target.value)}>
          {BUSCAR_OPTS.map(o=><option key={o}>{o}</option>)}
        </select>
        <div className="filtro-txt-wrap">
          <input placeholder="Ingrese el texto a buscar" value={bTxt}
            onChange={e=>setBTxt(e.target.value)} onKeyDown={e=>e.key==='Enter'&&buscar()}/>
          <span className="yo">y/o</span>
        </div>
        <DPLabel label="Fecha Inicio" value={fIni} onChange={setFIni}/>
        <DPLabel label="Fecha Fin"    value={fFin} onChange={setFFin}/>
        <button className="btn-buscar" onClick={buscar} style={{marginTop:16}}>🔍 Buscar</button>
        <button className="btn-nuevo"  onClick={abrirNuevo} style={{marginTop:16}}>+ Nuevo</button>
      </div>

      <div className="tit-tabla">LISTADO GENERAL</div>
      <table className="tbl">
        <thead>
          <tr>
            <th width="5%">ITEM</th>
            <th width="13%">SUCURSAL</th>
            <th width="10%">NRO</th>
            <th width="9%">FECHA</th>
            <th>CLIENTE</th>
            <th width="14%">RESP.</th>
            <th width="10%">ESTADO</th>
            <th width="14%">OPCION</th>
          </tr>
        </thead>
        <tbody>
          {filtros.length===0
            ? <tr><td colSpan="8" className="empty">No hay cotizaciones registradas.</td></tr>
            : filtros.map((d,i)=>(
              <tr key={d.id}>
                <td align="center">{i+1}</td>
                <td>Tienda Principal</td>
                <td align="center">{d.nro}</td>
                <td align="center">{d.fecha}</td>
                <td>{d.cliente}</td>
                <td>{d.resp}</td>
                <td align="center">{getBadge(d.estado)}</td>
                <td>
                  <div className="ops">
                    {/* PDF — solo visual por ahora */}
                    <button className="ico" title="Generar PDF" onClick={()=>ok(`📄 Generando PDF de ${d.nro}...`)}>
                      <IcoPDF/>
                    </button>
                    {/* Editar */}
                    <button className="ico" title="Editar cotización" onClick={()=>abrirEditar(d)}>
                      <IcoEdit/>
                    </button>
                    {/* Eliminar — abre modal */}
                    <button className="ico" title="Eliminar cotización" onClick={()=>setModalEliminar(d)}>
                      <IcoTrash/>
                    </button>
                    {/* Enviar Email — abre modal */}
                    <button className="ico" title="Enviar al E-mail" onClick={()=>setModalEmail(d)}>
                      <IcoMail/>
                    </button>
                    {/* Confirmar Venta — abre modal (solo si no está ya confirmada/anulada) */}
                    <button className="ico" title="Confirmar venta"
                      style={{opacity: d.estado==='Anulado'?0.4:1}}
                      onClick={()=>{ if(d.estado==='Anulado'){err('No se puede confirmar una cotización anulada.'); return;} setModalConfirmar(d); }}>
                      <IcoClipGreen/>
                    </button>
                    {/* Guía de Remisión — abre modal */}
                    <button className="ico" title="Generar Guía de Remisión"
                      style={{opacity: d.estado==='Anulado'?0.4:1}}
                      onClick={()=>{ if(d.estado==='Anulado'){err('No se puede generar guía de una cotización anulada.'); return;} setModalGuia(d); }}>
                      <IcoClipRed/>
                    </button>
                    {/* Crédito Post Ingreso — abre modal */}
                    <button className="ico" title="Crédito - Post Ingreso"
                      style={{opacity: d.condicion==='Contado'?0.5:1}}
                      onClick={()=>{ if(d.condicion==='Contado'){err('Esta cotización es al contado; aplica solo para crédito.'); return;} setModalCredito(d); }}>
                      <IcoCard/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="leyenda">
        <b>Leyenda de OPCIONES :</b>
        <span className="ley-item"><IcoPDF/> PDF</span>
        <span className="ley-item"><IcoEdit/> Actualizar</span>
        <span className="ley-item"><IcoTrash/> Eliminar</span>
        <span className="ley-item"><IcoMail/> Enviar al E-mail</span>
        <span className="ley-item"><IcoClipGreen/> Confirma venta</span>
        <span className="ley-item"><IcoClipRed/> Generar Guia de Remision</span>
        <span className="ley-item"><IcoCard/> Credito - Post Ingreso</span>
      </div>
    </div></>
  );

  /* ══════════════════════════════════════════════
     VISTA FORMULARIO
  ══════════════════════════════════════════════ */
  return (
    <><style>{styles}</style>
    <div className="page-container">
      <div className="form-title">COTIZACION : {esNuevo?'NUEVO':'EDITAR'}</div>
      <hr className="sep"/>
      {msg.x && <div className={msg.t==='ok'?'alert-ok':'alert-err'}>{msg.t==='ok'?'✅':'⚠️'} {msg.x}</div>}

      {/* ── FILA 1 ── */}
      <div className="f1">
        <div className="fld">
          <label>Nro cotiz.(*) :</label>
          <input value={form.nro} onChange={e=>sf('nro',e.target.value)} className="verde-in" style={{width:90}}/>
        </div>
        <div className="fld">
          <label>Fecha : (*)</label>
          <DP value={form.fecha} onChange={v=>sf('fecha',v)} verde={true} width="175px"/>
        </div>
        <div className="fld">
          <label>Oferta Valido :</label>
          <input value={form.oferta} onChange={e=>sf('oferta',e.target.value)} style={{width:70}}/>
        </div>
        <span className="dias-lbl">Dias</span>
        <div className="fld">
          <label>tiempo entrega(*)</label>
          <input value={form.tentrega} onChange={e=>sf('tentrega',e.target.value)} style={{width:70}}/>
        </div>
        <span className="dias-lbl">Dias</span>
        <div className="fld">
          <label>Garantia :</label>
          <input value={form.garantia} onChange={e=>sf('garantia',e.target.value)} style={{width:100}}/>
        </div>
        <div className="fld">
          <label>Incluido IGV (*) :</label>
          <select value={form.igv} onChange={e=>sf('igv',e.target.value)} style={{width:140}}>
            {IGV_OPTS.map(o=><option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="fld">
          <label>Moneda (*)</label>
          <select value={form.moneda} onChange={e=>sf('moneda',e.target.value)} style={{width:120}}>
            {MONEDA_OPTS.map(o=><option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="fld">
          <label>Tipo Cambio :</label>
          <input value={form.tipocambio} onChange={e=>sf('tipocambio',e.target.value)} style={{width:80}}/>
        </div>
      </div>

      {/* ── FILA 2 ── */}
      <div className="f2">
        <div className="fv" style={{minWidth:200}}>
          <label>Vendedor(*)</label>
          <select value={form.resp} onChange={e=>sf('resp',e.target.value)} style={{width:'100%'}}>
            {VENDEDORES.map(v=><option key={v}>{v}</option>)}
          </select>
        </div>
        <div className="fv" style={{minWidth:170}}>
          <label>Condicion : (*)</label>
          <div className="cond">
            <label><input type="radio" name="cond" value="Contado"
              checked={form.condicion==='Contado'} onChange={()=>sf('condicion','Contado')}/> Contado:</label>
            <label><input type="radio" name="cond" value="Credito"
              checked={form.condicion==='Credito'} onChange={()=>sf('condicion','Credito')}/> Credito:</label>
          </div>
        </div>
        <div className="fv" style={{flex:1,minWidth:160}}>
          <label>Atencion:</label>
          <textarea value={form.atencion} onChange={e=>sf('atencion',e.target.value)} rows={2}/>
        </div>
        <div className="fv" style={{flex:1,minWidth:160}}>
          <label>Comentario:</label>
          <textarea value={form.comentario} onChange={e=>sf('comentario',e.target.value)} rows={2}/>
        </div>
      </div>

      {/* ── FILA 3 CLIENTE ── */}
      <div className="f3">
        <div className="fc">
          <label>CLIENTE</label>
          <div className="search-box">
            <input value={form.clienteId} onChange={e=>sf('clienteId',e.target.value)} style={{width:100}}/>
            <button title="Buscar">🔍</button>
          </div>
        </div>
        <div className="fc" style={{flex:2}}>
          <label><b>CLIENTE</b> (Razon Social / Nombre): (*)</label>
          <div className="bino-box">
            <input value={form.clienteRazon} onChange={e=>sf('clienteRazon',e.target.value)}/>
            <button title="Buscar cliente">🔭</button>
          </div>
        </div>
        <div className="fc" style={{flex:1}}>
          <label><b>CLIENTE</b> (Direccion) :</label>
          <input value={form.clienteDir} onChange={e=>sf('clienteDir',e.target.value)}/>
        </div>
        <div className="fc" style={{flex:1}}>
          <label><b>CLIENTE</b> (E-mail) :</label>
          <input value={form.clienteEmail} onChange={e=>sf('clienteEmail',e.target.value)}/>
        </div>
      </div>

      {/* ── BUSQUEDA ARTICULOS ── */}
      <div className="bart-title">BUSQUEDA DE ARTICULOS x</div>
      <div className="bart-radios">
        {ART_RADIO.map(r=>(
          <label key={r}>
            <input type="radio" name="artbx" value={r}
              checked={form.artTipo===r} onChange={()=>sf('artTipo',r)}/> {r} /
          </label>
        ))}
      </div>
      <div className="bart-row">
        <input value={form.artTxt} onChange={e=>sf('artTxt',e.target.value)}
          placeholder="Escriba para buscar artículo..."
          onKeyDown={e=>e.key==='Enter'&&ok('Búsqueda de artículos realizada.')}/>
        <button className="btn-bart" onClick={()=>ok('Búsqueda de artículos realizada.')}>🔍 Buscar</button>
        <button className="btn-reset" title="Limpiar" onClick={()=>sf('artTxt','')}>🔄</button>
        <span style={{fontSize:12,color:'#888'}}>/</span>
      </div>

      {/* ── TABLA ARTÍCULOS ── */}
      <table className="tbl-a">
        <thead>
          <tr>
            <th width="9%">CODIGO</th>
            <th>ARTICULOS</th>
            <th width="7%">STOCK</th>
            <th width="7%">MED.</th>
            <th width="9%">PRECIOM</th>
            <th width="9%">P.VENTA</th>
            <th width="7%">CANT.</th>
            <th width="13%">T.A.IGV</th>
            <th width="5%">SELEC.</th>
          </tr>
        </thead>
        <tbody>
          {form.items.map((it,idx)=>(
            <tr key={idx}>
              <td><input className="tin" value={it.cod}    onChange={e=>si(idx,'cod',e.target.value)}/></td>
              <td>
                <textarea className="tin" value={it.desc} onChange={e=>si(idx,'desc',e.target.value)}
                  rows={1} style={{resize:'vertical'}}/>
              </td>
              <td><input className="tin" value={it.stock} onChange={e=>si(idx,'stock',e.target.value)} style={{textAlign:'center'}}/></td>
              <td className="tsel">
                <select value={it.med} onChange={e=>si(idx,'med',e.target.value)}>
                  {MED_OPTS.map(m=><option key={m}>{m}</option>)}
                </select>
              </td>
              <td><input className="tin" value={it.preciom} onChange={e=>si(idx,'preciom',e.target.value)} style={{textAlign:'right',color:'#17a2b8'}}/></td>
              <td><input className="tin" value={it.pventa}  onChange={e=>si(idx,'pventa',e.target.value)} style={{textAlign:'right'}}/></td>
              <td><input className="tin" value={it.cant}    onChange={e=>si(idx,'cant',e.target.value)} style={{textAlign:'center'}}/></td>
              <td className="tsel">
                <select value={it.taigv} onChange={e=>si(idx,'taigv',e.target.value)}>
                  {TAIGV_OPTS.map(t=><option key={t}>{t}</option>)}
                </select>
              </td>
              <td align="center">
                <button className="btn-chk"
                  style={{background:it.sel?'#17a2b8':'#adb5bd'}}
                  onClick={()=>si(idx,'sel',!it.sel)}>✔</button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="6" style={{padding:'6px 8px'}}>
              <button onClick={()=>setForm(p=>({...p,items:[...p.items,{...ITEM_BLANK}]}))}
                style={{background:'#28a745',border:'none',color:'#fff',padding:'4px 12px',borderRadius:3,cursor:'pointer',fontSize:12,marginRight:6}}>
                + Agregar fila
              </button>
              {form.items.length>1 &&
                <button onClick={()=>setForm(p=>({...p,items:p.items.slice(0,-1)}))}
                  style={{background:'#dc3545',border:'none',color:'#fff',padding:'4px 12px',borderRadius:3,cursor:'pointer',fontSize:12}}>
                  – Quitar última
                </button>}
            </td>
            <td colSpan="3" style={{textAlign:'right',padding:'6px 8px'}}>
              <b>Total: {form.moneda==='Dolares'?'US$':'S/'} {subtotal.toFixed(2)}</b>
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="btns-row">
        <button className="btn-g" onClick={guardar}>💾 Guardar</button>
        <button className="btn-g" onClick={()=>setForm(makeForm(datos.length+1))}>📋 Limpiar</button>
        <button className="btn-g" onClick={()=>setVista('lista')}>↩ Regresar</button>
      </div>
    </div></>
  );
}