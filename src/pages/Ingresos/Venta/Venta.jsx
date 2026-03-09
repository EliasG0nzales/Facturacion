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
const SUCURSALES   = ['Tienda 1','Tienda 2','Almacén Central'];
const TAIGV_OPTS   = [
  'Gravado - Operación Onerosa',
  'Gravado - Retiro por premio',
  'Gravado - Retiro por donación',
  'Gravado - Retiro',
  'Gravado - Retiro por publicidad',
  'Gravado - Bonificaciones',
  'Gravado - Retiro por entrega a trabajadores',
  'Gravado - IVAP',
  'Exonerado - Operación Onerosa',
  'Exonerado - Transferencia Gratuita',
  'Inafecto - Operación Onerosa',
  'Inafecto - Retiro por Bonificación',
  'Inafecto - Retiro',
  'Inafecto - Retiro por Muestras Médicas',
  'Inafecto - Retiro por Convenio Colectivo',
  'Inafecto - Retiro por premio',
  'Inafecto - Retiro por publicidad',
  'Exportación',
];
const MED_OPTS     = ['Und.','Kg','Lt','Cj','Pq','Doc','Par'];
const BUSCAR_X     = ['Documento','Sucursal','Cliente','Nro documento'];
const SUJETO_OPTS  = [
  '',
  'Detraccion > (001)Azúcar y melaza de caña - 10%',
  'Detraccion > (003)Alcohol etílico - 10%',
  'Detraccion > (012)Intermediación laboral - 10%',
  'Detraccion > (014)Carnes y despojos - 4%',
  'Detraccion > (022)Otros servicios empresariales - 10%',
  'Detraccion > (027)Servicio de transporte de carga - 4%',
  'Detraccion > (030)Contratos de construcción - 4%',
  'Detraccion > (037)Demás servicios gravados IGV - 10%',
  'Retencion > (01)Tasa 3% - 3%',
  'Retencion > (02)Tasa 6% - 6%',
  'Percepcion > (01)Percepción Venta Interna - 2%',
];
const GUIAS = ['Sin Guia de remision','Guia de Remision Electronica TI01'];

/* ─── CLIENTES DEMO ─── */
const CLIENTES_DB = [
  { id:1, nombre:'Alex', ruc:'', dir:'' },
  { id:2, nombre:'Alexander Paul, Moran Alburqueque', ruc:'74296172', dir:'Calle S/n' },
  { id:3, nombre:'Luis Alexander, Quispe Ayala', ruc:'70769573', dir:'' },
  { id:4, nombre:'García López, María', ruc:'20123456789', dir:'Av. Principal 123' },
  { id:5, nombre:'Empresa SAC', ruc:'20987654321', dir:'Jr. Comercio 456' },
  { id:6, nombre:'Cliente General', ruc:'', dir:'' },
];

/* ─── VENTAS DEMO ─── */
const VENTAS_INI = [
  { id:1, doc:'Boleta BI01', serie:'BI01-000001', fecha:'2026-03-01', cliente:'García López, María',
    vendedor:'Iturri, Quispe, Smith', tvta:'Contado', sunat:'OK', estado:'Emitido' },
  { id:2, doc:'Factura FI01', serie:'FI01-000042', fecha:'2026-03-05', cliente:'Empresa SAC',
    vendedor:'Merino, Cahuna, Wilver Enmanuel', tvta:'Credito', sunat:'ERROR', estado:'Error' },
  { id:3, doc:'Nota de Venta 001', serie:'001-000015', fecha:'2026-03-07', cliente:'Luis Alexander, Quispe Ayala',
    vendedor:'Yupanqui, Barboza, Raysa', tvta:'Contado', sunat:'BETA', estado:'Borrador' },
];

const hoy = new Date().toISOString().split('T')[0];

const fmtFecha = iso => { if(!iso) return ''; const [y,m,d]=iso.split('-'); return `${d}/${m}/${y}`; };

/* ─── CSS ─── */
const css = `
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#212529;}

  /* ── barra de búsqueda ── */
  .vta-bar{display:flex;align-items:flex-end;gap:10px;flex-wrap:wrap;margin-bottom:18px;}
  .vta-bar label{font-size:11px;font-weight:bold;color:#555;display:block;margin-bottom:3px;}
  .vta-bar select,.vta-bar input[type=text],.vta-bar input[type=date]{
    padding:6px 9px;border:1px solid #ced4da;border-radius:4px;font-size:13px;color:#212529;background:#fff;}
  .vta-bar input[type=text]{width:220px;}

  /* botones barra */
  .btn-buscar{background:#17a2b8;border:1px solid #17a2b8;color:#fff;padding:8px 18px;
    border-radius:4px;cursor:pointer;font-size:13px;font-weight:bold;display:inline-flex;align-items:center;gap:5px;}
  .btn-buscar:hover{background:#138496;}
  .btn-nuevo{background:#17a2b8;border:1px solid #17a2b8;color:#fff;padding:8px 18px;
    border-radius:4px;cursor:pointer;font-size:13px;font-weight:bold;display:inline-flex;align-items:center;gap:5px;}
  .btn-nuevo:hover{background:#138496;}
  .btn-rapido{background:#fd7e14;border:1px solid #e96a00;color:#fff;padding:8px 18px;
    border-radius:4px;cursor:pointer;font-size:13px;font-weight:bold;display:inline-flex;align-items:center;gap:5px;}
  .btn-rapido:hover{background:#e96a00;}

  /* ── tabla lista ── */
  .tbl-titulo{text-align:center;font-weight:bold;font-size:14px;margin-bottom:8px;letter-spacing:.5px;}
  table.tlista{width:100%;border-collapse:collapse;font-size:13px;}
  table.tlista thead tr{background:#003d6b;}
  table.tlista thead th{padding:11px 10px;text-align:center;color:#fff;font-weight:bold;font-size:12px;letter-spacing:.4px;}
  table.tlista tbody tr{border-bottom:1px solid #dee2e6;background:#fff;}
  table.tlista tbody tr:hover{background:#e8f4f8;}
  table.tlista tbody td{padding:10px 10px;vertical-align:middle;color:#212529;}
  .badge-ok{background:#28a745;color:#fff;padding:2px 8px;border-radius:3px;font-size:11px;font-weight:bold;}
  .badge-err{background:#dc3545;color:#fff;padding:2px 8px;border-radius:3px;font-size:11px;font-weight:bold;}
  .badge-beta{background:#6f42c1;color:#fff;padding:2px 8px;border-radius:3px;font-size:11px;font-weight:bold;}

  /* íconos opcion tabla */
  .ops{display:flex;gap:3px;flex-wrap:nowrap;align-items:center;}
  .ic{cursor:pointer;border:none;background:transparent !important;padding:0;display:inline-flex;align-items:center;}
  .ic:hover{opacity:.8;transform:scale(1.1);}

  /* leyendas */
  .leyenda-ops{font-size:12px;color:#444;margin:12px 0 8px;display:flex;flex-wrap:wrap;gap:12px;align-items:center;}
  .leyenda-ops span{display:flex;align-items:center;gap:4px;}
  .ley-colores{display:flex;gap:20px;align-items:center;font-size:12px;margin-top:10px;}
  .ley-colores .lc{display:flex;align-items:center;gap:6px;}

  /* ── FORMULARIO NUEVA VENTA ── */
  .form-titulo{font-size:18px;font-weight:bold;margin-bottom:16px;color:#212529;}
  .form-subtit{font-size:13px;font-weight:bold;margin-bottom:4px;color:#555;}

  .frow{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:14px;align-items:flex-end;}
  .fc{display:flex;flex-direction:column;gap:3px;}
  .fc label{font-size:11px;font-weight:bold;color:#555;}
  .fc input,.fc select,.fc textarea{padding:7px 9px;border:1px solid #ced4da;border-radius:4px;
    font-size:13px;color:#212529;background:#fff;}
  .fc input:focus,.fc select:focus{border-color:#80bdff;outline:none;box-shadow:0 0 0 2px rgba(0,123,255,.15);}
  .fc.flex1{flex:1;min-width:130px;}
  .req{color:#dc3545;font-size:11px;}

  /* input verde (cliente nombre) */
  .inp-verde{background:#ccff99 !important;border:1px solid #5cb85c !important;}

  /* buscador cliente inline */
  .cli-wrap{display:flex;gap:8px;align-items:center;}
  .btn-lupa{background:none;border:none;cursor:pointer;padding:2px;display:inline-flex;align-items:center;}
  .btn-bino{background:none;border:none;cursor:pointer;padding:2px;font-size:18px;color:#17a2b8;}
  .btn-bino:hover{color:#0d7a8a;}

  /* sección clientes */
  .sec-cli{border-top:1px solid #dee2e6;padding-top:14px;margin-top:4px;margin-bottom:14px;}
  .sec-cli .fc-label{font-size:12px;font-weight:bold;color:#333;margin-bottom:3px;}

  /* busqueda articulos */
  .art-search{background:#e8e8e8;padding:10px 16px;display:flex;align-items:center;gap:10px;margin-bottom:0;flex-wrap:wrap;}
  .art-search label{font-size:12px;font-weight:bold;color:#333;}
  .art-search input{padding:6px 10px;border:1px solid #ced4da;border-radius:4px;font-size:13px;
    background:#ccff99;min-width:200px;}
  .art-search select{padding:6px 9px;border:1px solid #ced4da;border-radius:4px;font-size:13px;background:#fff;color:#212529;}
  .btn-art-buscar{background:#17a2b8;border:1px solid #17a2b8;color:#fff;
    padding:7px 14px;border-radius:4px;cursor:pointer;font-size:13px;font-weight:bold;
    display:inline-flex;align-items:center;gap:5px;}
  .btn-art-reset{background:#fff;border:1px solid #ced4da;color:#555;
    padding:7px 10px;border-radius:4px;cursor:pointer;font-size:16px;}

  /* tabla articulos */
  table.tart{width:100%;border-collapse:collapse;font-size:12px;}
  table.tart thead tr{background:#003d6b;}
  table.tart thead th{padding:9px 7px;text-align:center;color:#fff;font-weight:bold;font-size:11px;letter-spacing:.3px;}
  table.tart tbody tr{border-bottom:1px solid #dee2e6;}
  table.tart tbody td{padding:7px 6px;vertical-align:middle;}
  table.tart input[type=text],table.tart input[type=number],table.tart textarea{
    padding:5px 7px;border:1px solid #ced4da;border-radius:3px;font-size:12px;width:100%;background:#fff !important;color:#212529 !important;}
  table.tart textarea{resize:none;height:52px;color:#212529 !important;}
  table.tart select{padding:5px 5px;border:1px solid #ced4da;border-radius:3px;font-size:12px;width:100%;background:#fff !important;color:#212529 !important;}
  .chk-agregar{width:22px;height:22px;accent-color:#17a2b8;cursor:pointer;}
  .chk-sel{width:18px;height:18px;accent-color:#17a2b8;cursor:pointer;}

  /* botones guardar/regresar */
  .form-footer{display:flex;justify-content:center;gap:10px;margin-top:20px;padding-bottom:10px;}
  .btn-gd{background:#17a2b8;border:1px solid #17a2b8;color:#fff;
    padding:10px 26px;cursor:pointer;font-size:14px;font-weight:bold;border-radius:6px;
    display:inline-flex;align-items:center;gap:6px;}
  .btn-gd:hover{background:#138496;}
  .btn-reg{background:#6c757d;border:1px solid #6c757d;color:#fff;
    padding:10px 26px;cursor:pointer;font-size:14px;font-weight:bold;border-radius:6px;
    display:inline-flex;align-items:center;gap:6px;}
  .btn-reg:hover{background:#5a6268;}

  hr.sep{border:none;border-top:1px solid #dee2e6;margin:16px 0;}

  /* ── MODAL BUSCAR CLIENTE ── */
  .m-bd{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;
    display:flex;align-items:flex-start;justify-content:center;padding-top:80px;}
  .m-box-cli{background:#1a1a2e;border-radius:6px;width:680px;max-width:96vw;
    box-shadow:0 8px 32px rgba(0,0,0,0.4);overflow:hidden;}
  .m-cli-head{background:#1a1a2e;padding:12px 18px;display:flex;justify-content:space-between;align-items:center;}
  .m-cli-head span{font-size:13px;color:#aaa;}
  .m-cli-url{font-size:11px;color:#6cb4e4;}
  .m-cli-body{background:#fff;padding:16px;}
  .m-cli-close{background:none;border:none;color:#fff;font-size:22px;cursor:pointer;line-height:1;}
  .m-cli-close:hover{color:#ddd;}

  .cli-filtros{display:flex;align-items:center;gap:12px;margin-bottom:14px;flex-wrap:wrap;}
  .cli-filtros label{font-size:12px;font-weight:bold;color:#444;display:flex;align-items:center;gap:3px;cursor:pointer;}
  .cli-filtros label input[type=radio]{accent-color:#17a2b8;width:13px;height:13px;}
  .cli-busq{display:flex;gap:8px;margin-bottom:14px;}
  .cli-busq input{flex:1;padding:8px 12px;border:1px solid #ced4da;border-radius:4px;
    font-size:13px;background:#b8f5b0;}
  .cli-busq button{background:#17a2b8;border:1px solid #17a2b8;color:#fff;
    padding:8px 16px;border-radius:4px;cursor:pointer;font-size:13px;font-weight:bold;
    display:inline-flex;align-items:center;gap:5px;}

  table.tcli{width:100%;border-collapse:collapse;font-size:13px;}
  table.tcli thead tr{background:#003d6b;}
  table.tcli thead th{padding:9px 10px;color:#fff;font-weight:bold;font-size:12px;}
  table.tcli tbody tr{border-bottom:1px solid #eee;}
  table.tcli tbody tr:hover{background:#f0f9fb;}
  table.tcli tbody td{padding:9px 10px;vertical-align:middle;}
  .btn-plus-cli{background:none;border:none;cursor:pointer;font-size:22px;
    color:#6f42c1;font-weight:bold;line-height:1;}
  .btn-plus-cli:hover{color:#4a2d8a;transform:scale(1.2);}

  .titulo-cli{text-align:center;font-size:15px;font-weight:bold;margin-bottom:14px;letter-spacing:.5px;}

  /* ── modales opciones ── */
  .mopc-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:3000;display:flex;align-items:center;justify-content:center;}
  .mopc-box{background:#fff;border-radius:8px;padding:0;min-width:480px;max-width:700px;width:90%;
    box-shadow:0 8px 32px rgba(0,0,0,.25);overflow:hidden;}
  .mopc-head{padding:14px 20px;display:flex;justify-content:space-between;align-items:center;color:#fff;font-weight:bold;font-size:15px;}
  .mopc-body{padding:20px;}
  .mopc-footer{padding:12px 20px;display:flex;gap:10px;justify-content:flex-end;border-top:1px solid #dee2e6;background:#f8f9fa;}
  .mopc-btn{padding:7px 20px;border:none;border-radius:4px;cursor:pointer;font-size:13px;font-weight:bold;color:#fff;}
  .mopc-row{display:flex;gap:10px;margin-bottom:10px;align-items:center;}
  .mopc-label{font-weight:bold;font-size:13px;min-width:110px;color:#555;}
  .mopc-val{font-size:13px;color:#212529;}
  .mopc-inp{padding:6px 10px;border:1px solid #ced4da;border-radius:4px;font-size:13px;
    color:#212529;background:#fff;width:100%;}
  .mopc-table{width:100%;border-collapse:collapse;font-size:13px;margin-top:10px;}
  .mopc-table th{background:#003d6b;color:#fff;padding:8px 10px;text-align:left;}
  .mopc-table td{padding:7px 10px;border-bottom:1px solid #dee2e6;color:#212529;}
  .mopc-table tr:nth-child(even) td{background:#f5f5f5;}
  .xml-pre{background:#1e1e1e;color:#9cdcfe;font-family:monospace;font-size:12px;
    padding:14px;border-radius:6px;overflow-x:auto;line-height:1.6;margin-top:8px;}

  .vr-input{background:#fff !important;color:#212529 !important;border:1px solid #ced4da !important;}
  .vr-input:focus{outline:none;border-color:#17a2b8 !important;}

  .alert-ok{background:#d4edda;border:1px solid #c3e6cb;color:#155724;
    padding:8px 14px;border-radius:4px;margin-bottom:12px;font-size:13px;}
  .vta-titulo{display:flex;align-items:center;gap:8px;font-size:18px;font-weight:bold;margin-bottom:16px;}
  .vta-ico{width:32px;height:32px;background:#17a2b8;border-radius:50%;display:flex;
    align-items:center;justify-content:center;}
`;

/* ─── Íconos opciones tabla — botones con color sólido ─── */
const IcoEdit  = () => <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:22,height:22,borderRadius:4,background:'#e67e22',color:'#fff',fontSize:11,fontWeight:'bold',cursor:'pointer'}} title="Actualizar/Eliminar">✏</span>;
const IcoND    = () => <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:22,height:22,borderRadius:4,background:'#28a745',color:'#fff',fontSize:9, fontWeight:'bold',cursor:'pointer'}} title="Nota de Débito">ND</span>;
const IcoNC    = () => <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:22,height:22,borderRadius:4,background:'#dc3545',color:'#fff',fontSize:9, fontWeight:'bold',cursor:'pointer'}} title="Nota de Crédito">NC</span>;
const IcoTicket= () => <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:22,height:22,borderRadius:4,background:'#17a2b8',color:'#fff',fontSize:13,cursor:'pointer'}} title="Imprimir Ticket">🖨</span>;
const IcoCoti  = () => <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:22,height:22,borderRadius:4,background:'#6c9bd1',color:'#fff',fontSize:13,cursor:'pointer'}} title="Cotizar">↺</span>;
const IcoCli   = () => <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:22,height:22,borderRadius:4,background:'#17a2b8',color:'#fff',fontSize:13,cursor:'pointer'}} title="Cliente">👤</span>;
const IcoVender= () => <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:22,height:22,borderRadius:4,background:'#6c757d',color:'#fff',fontSize:9, fontWeight:'bold',cursor:'pointer'}} title="Vender">VTA</span>;
const IcoPDF   = () => <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:22,height:22,borderRadius:4,background:'#dc3545',color:'#fff',fontSize:9, fontWeight:'bold',cursor:'pointer'}} title="PDF">PDF</span>;
const IcoXML   = () => <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:22,height:22,borderRadius:4,background:'#6c757d',color:'#fff',fontSize:9, fontWeight:'bold',cursor:'pointer'}} title="XML">XML</span>;
const IcoLeer  = () => <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:22,height:22,borderRadius:4,background:'#e67e22',color:'#fff',fontSize:13,cursor:'pointer'}} title="Leer Ticket">📖</span>;
const IcoCal   = () => <svg width="18" height="18" viewBox="0 0 36 36" fill="none"><rect x="1" y="4" width="34" height="30" rx="3" fill="#fff" stroke="#bbb" strokeWidth="1.5"/><rect x="1" y="4" width="34" height="9" rx="3" fill="#e74c3c"/><rect x="1" y="9" width="34" height="4" fill="#e74c3c"/><rect x="10" y="1" width="3" height="7" rx="1.5" fill="#888"/><rect x="23" y="1" width="3" height="7" rx="1.5" fill="#888"/></svg>;

/* ─── DatePicker ─── */
const DP = ({ value, onChange }) => {
  const ref = useRef();
  return (
    <div style={{display:'flex',alignItems:'center',gap:6}}>
      <span style={{minWidth:95,fontSize:13,color:'#212529'}}>
        {value ? value.split('-').reverse().join('/') : ''}
      </span>
      <span style={{cursor:'pointer'}} onClick={()=>ref.current.showPicker?.()??ref.current.click()}>
        <IcoCal/>
      </span>
      <input ref={ref} type="date" value={value} onChange={e=>onChange(e.target.value)}
        style={{opacity:0,width:1,height:1,position:'absolute',pointerEvents:'none'}}/>
    </div>
  );
};

/* ─── FILA ARTÍCULO vacía ─── */
const filaVacia = () => ({
  id: Date.now() + Math.random(),
  codigo:'', articulo:'', stock:'', med:'Und.', pmc:'0.00', pventa:'', cant:'', taigv:'Gravado - Oper.', sel:false
});

/* ══════════════════════════════════════════════ */
export default function Venta() {
  const [vista,  setVista]  = useState('lista'); // 'lista' | 'form' | 'rapido'
  const [ventas, setVentas] = useState(VENTAS_INI);
  const [alert,  setAlert]  = useState('');

  /* ── filtros lista ── */
  const [bDocmto,   setBDocmto]   = useState('');
  const [bSucursal, setBSucursal] = useState('');
  const [bTipo,     setBTipo]     = useState('1');
  const [bq,        setBq]        = useState('');
  const [bfi,       setBfi]       = useState('');
  const [bff,       setBff]       = useState('');

  /* ── form nueva venta ── */
  const formIni = () => ({
    documento:'Boleta BI01', fecha:hoy, nroorden:'', moneda:'Soles', conigv:'Inc.IGV',
    tipooper:'Venta Interna', preanticipo:'No', guia:'Sin Guia de remision', nroguia:'',
    vendedor:'Iturri, Quispe, Smith', tipovta:'Contado', pagomod:'Efectivo', sujeto:'',
    pagocon:'', diasdias:'', letra:false,
    cliRuc:'', cliNombre:'Cliente', cliDir:'', cliEmail:'',
    artRows:[ filaVacia() ],
    artBusqTipo:'Nombre', artBusqQ:'',
  });
  const [form, setForm] = useState(formIni());
  const sf = (k,v) => setForm(p=>({...p,[k]:v}));

  /* ── VENTAS RAPIDAS ── */
  const CATEGORIAS_RAPIDO = ['T','P','S','Compon','Comput','Memori','Monito','Perife','Sumini'];

  const ARTICULOS_DEMO = [
    {id:1, codigo:'PC-001', nombre:'Laptop HP 15" Core i5',       stock:8,  precio:'2500.00', tipo:'Producto',  grupo:'Computo'},
    {id:2, codigo:'PC-002', nombre:'Monitor LG 24" Full HD',      stock:12, precio:'650.00',  tipo:'Producto',  grupo:'Monitores'},
    {id:3, codigo:'PC-003', nombre:'Teclado Logitech Inalámbrico',stock:25, precio:'89.00',   tipo:'Producto',  grupo:'Perifericos'},
    {id:4, codigo:'PC-004', nombre:'Mouse Óptico USB',            stock:40, precio:'25.00',   tipo:'Producto',  grupo:'Perifericos'},
    {id:5, codigo:'MEM-01', nombre:'Memoria RAM DDR4 8GB',        stock:18, precio:'120.00',  tipo:'Producto',  grupo:'Memorias'},
    {id:6, codigo:'MEM-02', nombre:'SSD Kingston 256GB',          stock:10, precio:'180.00',  tipo:'Producto',  grupo:'Memorias'},
    {id:7, codigo:'COM-01', nombre:'Motherboard ASUS B450',       stock:5,  precio:'450.00',  tipo:'Producto',  grupo:'Componentes PC'},
    {id:8, codigo:'SUM-01', nombre:'Tóner HP LaserJet 85A',       stock:15, precio:'95.00',   tipo:'Producto',  grupo:'Suministros'},
    {id:9, codigo:'SRV-01', nombre:'Mantenimiento PC',            stock:99, precio:'60.00',   tipo:'Servicio',  grupo:''},
    {id:10,codigo:'SRV-02', nombre:'Instalación Windows',         stock:99, precio:'40.00',   tipo:'Servicio',  grupo:''},
  ];

  const [rDoc,       setRDoc]       = useState('Boleta BI01');
  const [rTipoVta,   setRTipoVta]   = useState('Contado');
  const [rPago,      setRPago]      = useState('Efectivo');
  const [rCliente,   setRCliente]   = useState('Cliente');
  const [rBusqTipo,  setRBusqTipo]  = useState('nomart');
  const [rBusqQ,     setRBusqQ]     = useState('');
  const [rCategoria, setRCategoria] = useState('');
  const [rCarrito,   setRCarrito]   = useState([]);
  const [rResultados,setRResultados]= useState([]);
  const [busqActiva, setBusqActiva] = useState('');

  const buscarRapido = (tipo, val) => {
    setBusqActiva(val);
    let res = ARTICULOS_DEMO;
    if (tipo==='Todos')    res = ARTICULOS_DEMO;
    else if (tipo==='Producto') res = ARTICULOS_DEMO.filter(a=>a.tipo==='Producto');
    else if (tipo==='Servicio') res = ARTICULOS_DEMO.filter(a=>a.tipo==='Servicio');
    else if (tipo==='3')   res = ARTICULOS_DEMO.filter(a=>a.grupo===val);
    else if (tipo==='nomart') res = ARTICULOS_DEMO.filter(a=>a.nombre.toLowerCase().includes(val.toLowerCase()));
    else if (tipo==='codigo') res = ARTICULOS_DEMO.filter(a=>a.codigo.toLowerCase().includes(val.toLowerCase()));
    else res = ARTICULOS_DEMO.filter(a=>a.nombre.toLowerCase().includes(val.toLowerCase()));
    setRResultados(res);
  };

  /* ── modales opciones tabla ── */
  const [mOpc,    setMOpc]    = useState(null); // { tipo, venta }
  const cerrarMOpc = () => setMOpc(null);

  /* ── modal buscar cliente ── */
  const [mCli,    setMCli]    = useState(false);
  const [cliFilt, setCliFilt] = useState('Nombre');
  const [cliQ,    setCliQ]    = useState('');
  const [cliRes,  setCliRes]  = useState(CLIENTES_DB);

  const buscarCliente = () => {
    const q = cliQ.toLowerCase();
    setCliRes(CLIENTES_DB.filter(c => {
      if (cliFilt==='Nombre')   return c.nombre.toLowerCase().includes(q);
      if (cliFilt==='Ruc')      return c.ruc.includes(q);
      if (cliFilt==='Vendedor') return true;
      return true;
    }));
  };

  const selCliente = (c) => {
    sf('cliNombre', c.nombre);
    sf('cliRuc',    c.ruc);
    sf('cliDir',    c.dir);
    setMCli(false);
  };

  /* ── VENTAS RAPIDAS: modal cliente (Siguiente / Agregar Nuevo) ── */
  const cliIni = () => ({
    nombre:'', tipodoc:'RUC', nro:'', representante:'', dni:'', pais:'Peru',
    dpto:'', provincia:'', distrito:'', direccion:'', telfijo:'',
    movistar:'', claro:'', otros:'', email:'', descuento:'',
    aniversario:hoy, responsable:'Iturri, Quispe, Smith',
    modopago:'Contado', estado:'Pagador', partida:'', representa:'',
  });
  const [mRCli,     setMRCli]     = useState(null); // null | 'lista' | 'nuevo'
  const [rCliBusqX, setRCliBusqX] = useState('');
  const [rCliBusqQ, setRCliBusqQ] = useState('');
  const [rCliFiltro,setRCliFiltro]= useState('por Criterio');
  const [cliForm,   setCliForm]   = useState(cliIni());
  const cf = (k,v) => setCliForm(p=>({...p,[k]:v}));
  const [cliDB,     setCliDB]     = useState(CLIENTES_DB);

  const guardarNuevoCli = () => {
    if (!cliForm.nombre) { alert('Ingrese Empresa/Nombre'); return; }
    const nuevo = { id:Date.now(), nombre:cliForm.nombre, ruc:cliForm.nro, dir:cliForm.direccion };
    setCliDB(p=>[...p, nuevo]);
    setRCliente(nuevo.nombre);
    setMRCli(null);
  };

  const cliListaFilt = cliDB.filter(c => {
    if (!rCliBusqQ) return true;
    const q = rCliBusqQ.toLowerCase();
    if (rCliBusqX==='Nombre/empresa') return c.nombre.toLowerCase().includes(q);
    if (rCliBusqX==='Ruc-dni')        return c.ruc.includes(q);
    return c.nombre.toLowerCase().includes(q);
  });

  /* ── artículos ── */
  const updRow = (id, k, v) => sf('artRows', form.artRows.map(r => r.id===id ? {...r,[k]:v} : r));
  const addRow = () => sf('artRows', [...form.artRows, filaVacia()]);
  const delRow = id => sf('artRows', form.artRows.filter(r=>r.id!==id));

  /* ── guardar venta ── */
  const guardar = () => {
    if (!form.cliNombre || form.cliNombre==='Cliente') {
      setAlert('err:Ingrese el nombre del cliente');
      return;
    }
    const nva = {
      id: Date.now(),
      doc: form.documento,
      serie: form.documento.includes('Boleta') ? `BI01-${String(ventas.length+1).padStart(6,'0')}` :
             form.documento.includes('Factura')? `FI01-${String(ventas.length+1).padStart(6,'0')}` :
             `001-${String(ventas.length+1).padStart(6,'0')}`,
      fecha: form.fecha, cliente: form.cliNombre,
      vendedor: form.vendedor, tvta: form.tipovta,
      sunat: 'BETA', estado: 'Borrador',
    };
    setVentas(p=>[nva,...p]);
    setAlert('ok:Venta guardada correctamente.');
    setTimeout(()=>setAlert(''),3000);
    setVista('lista');
    setForm(formIni());
  };

  /* ── lista filtrada ── */
  const listaFilt = ventas.filter(v => {
    if (bDocmto && !v.doc.toLowerCase().includes(bDocmto.toLowerCase())) return false;
    if (bq) {
      const q = bq.toLowerCase();
      if (bTipo==='1') { if (!v.serie.toLowerCase().includes(q)) return false; }
      else if (bTipo==='9') { if (!v.serie.toLowerCase().includes(q)) return false; }
      else if (bTipo==='2') { if (!v.cliente.toLowerCase().includes(q)) return false; }
      else if (bTipo==='10') { if (!v.cliente.toLowerCase().includes(q)) return false; }
      else if (bTipo==='3') { if (!v.vendedor.toLowerCase().includes(q)) return false; }
    }
    if (bfi && v.fecha < bfi) return false;
    if (bff && v.fecha > bff) return false;
    return true;
  });

  const SunatBadge = ({v}) => v==='OK' ? <span className="badge-ok">OK</span>
    : v==='ERROR' ? <span className="badge-err">ERROR</span>
    : <span className="badge-beta">BETA</span>;

  /* ══════ RENDER ══════ */
  return (
    <>
      <style>{css}</style>

      {/* ── ALERTA ── */}
      {alert && (
        <div className={alert.startsWith('ok:') ? 'alert-ok' : 'err-msg'}
          style={{marginBottom:10}}>
          {alert.startsWith('ok:') ? '✅ ' : '⚠️ '}{alert.slice(3)}
        </div>
      )}

      {/* ════════════ LISTA ════════════ */}
      {vista==='lista' && (
        <>
          {/* título con ícono ayuda */}
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
            <span style={{background:'#0099ff',color:'#fff',borderRadius:'50%',
              width:22,height:22,display:'inline-flex',alignItems:'center',
              justifyContent:'center',fontSize:13,fontWeight:'bold',cursor:'pointer'}} title="Manual del usuario">?</span>
            <span style={{fontSize:16,fontWeight:'bold'}}>Venta</span>
          </div>

          {/* ── barra filtros FIEL AL ORIGINAL ── */}
          <div className="vta-bar" style={{alignItems:'flex-end',flexWrap:'wrap',gap:8}}>
            {/* BUSCAR X — tres selects + input */}
            <div style={{display:'flex',flexDirection:'column',gap:4}}>
              <label style={{fontWeight:'bold',fontSize:13}}>BUSCAR X</label>
              <div style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap'}}>
                {/* select Documento */}
                <select value={bDocmto} onChange={e=>setBDocmto(e.target.value)}
                  style={{height:26,padding:'0 4px',fontSize:12,border:'1px solid #ced4da',borderRadius:3,width:130}}>
                  <option value="">Documento &gt; todos</option>
                  <option value="Boleta">Boleta</option>
                  <option value="Factura">Factura</option>
                  <option value="Nota de Venta">Nota de Venta</option>
                </select>
                {/* select Sucursal */}
                <select value={bSucursal} onChange={e=>setBSucursal(e.target.value)}
                  style={{height:26,padding:'0 4px',fontSize:12,border:'1px solid #ced4da',borderRadius:3,width:130}}>
                  <option value="">Sucursal &gt; todos</option>
                  <option value="3">Almacen 1 &gt; Almacen 2B 167</option>
                  <option value="2">Tienda2 &gt; Tienda 1A 119</option>
                  <option value="1">Tienda1 &gt; Tienda 1b 133</option>
                </select>
                <span style={{fontWeight:'bold',fontSize:13}}>y/o</span>
                {/* select tipo búsqueda */}
                <select value={bTipo} onChange={e=>setBTipo(e.target.value)}
                  style={{height:26,padding:'0 4px',fontSize:12,border:'1px solid #ced4da',borderRadius:3,width:120}}>
                  <option value="1">Nro documento</option>
                  <option value="9">Serie del documento</option>
                  <option value="2">Nombre/empresa</option>
                  <option value="10">DNI/RUC</option>
                  <option value="3">Vendedor</option>
                </select>
              </div>
              {/* input texto búsqueda */}
              <div style={{display:'flex',alignItems:'center',gap:6,marginTop:2}}>
                <input type="text" value={bq} onChange={e=>setBq(e.target.value)}
                  placeholder="Buscar..." style={{width:390,height:28,padding:'0 8px',
                  border:'1px solid #ced4da',borderRadius:3,fontSize:13}}/>
                <span style={{fontWeight:'bold',fontSize:13}}>y/o</span>
              </div>
            </div>

            {/* Fecha Inicio */}
            <div style={{display:'flex',flexDirection:'column',gap:3}}>
              <label style={{fontSize:13}}>Fecha Inicio</label>
              <div style={{display:'flex',alignItems:'center',gap:5,
                border:'1px solid #ced4da',borderRadius:3,padding:'3px 8px',background:'#fff',height:28}}>
                <span style={{fontSize:13,minWidth:80,color: bfi?'#212529':'#aaa'}}>
                  {bfi ? bfi.split('-').reverse().join('/') : ''}
                </span>
                <span style={{cursor:'pointer'}} onClick={()=>document.getElementById('inpFI').showPicker?.()??document.getElementById('inpFI').click()}>
                  <IcoCal/>
                </span>
                <input id="inpFI" type="date" value={bfi} onChange={e=>setBfi(e.target.value)}
                  style={{opacity:0,width:1,height:1,position:'absolute',pointerEvents:'none'}}/>
              </div>
            </div>

            {/* Fecha Fin */}
            <div style={{display:'flex',flexDirection:'column',gap:3}}>
              <label style={{fontSize:13}}>Fecha Fin</label>
              <div style={{display:'flex',alignItems:'center',gap:5,
                border:'1px solid #ced4da',borderRadius:3,padding:'3px 8px',background:'#fff',height:28}}>
                <span style={{fontSize:13,minWidth:80,color: bff?'#212529':'#aaa'}}>
                  {bff ? bff.split('-').reverse().join('/') : ''}
                </span>
                <span style={{cursor:'pointer'}} onClick={()=>document.getElementById('inpFF').showPicker?.()??document.getElementById('inpFF').click()}>
                  <IcoCal/>
                </span>
                <input id="inpFF" type="date" value={bff} onChange={e=>setBff(e.target.value)}
                  style={{opacity:0,width:1,height:1,position:'absolute',pointerEvents:'none'}}/>
              </div>
            </div>

            {/* botones */}
            <button className="btn-buscar">
              ✉ Buscar
            </button>
            <button className="btn-nuevo" onClick={()=>{ setForm(formIni()); setVista('form'); }}>
              + Nuevo
            </button>
            <button className="btn-rapido" onClick={()=> setVista('rapido')}>
              ⚡ Rapido
            </button>
          </div>

          {/* tabla */}
          <div className="tbl-titulo">LISTADO GENERAL</div>
          <table className="tlista">
            <thead>
              <tr>
                <th>DOCUMENTO</th>
                <th>FECHA</th>
                <th>CLIENTE</th>
                <th>VENDEDOR</th>
                <th>T.VTA</th>
                <th>SUNAT</th>
                <th>ESTADO</th>
                <th>OPCIONES</th>
              </tr>
            </thead>
            <tbody>
              {listaFilt.length===0
                ? <tr><td colSpan={8} align="center" style={{padding:24,color:'#888'}}>Sin registros</td></tr>
                : listaFilt.map(v=>(
                  <tr key={v.id}>
                    <td align="center">{v.serie}</td>
                    <td align="center">{fmtFecha(v.fecha)}</td>
                    <td>{v.cliente}</td>
                    <td>{v.vendedor}</td>
                    <td align="center">{v.tvta}</td>
                    <td align="center"><SunatBadge v={v.sunat}/></td>
                    <td align="center">{v.estado}</td>
                    <td>
                      <div className="ops">
                        <button className="ic" title="Editar/Eliminar"   onClick={()=>setMOpc({tipo:'editar',  venta:v})}><IcoEdit/></button>
                        <button className="ic" title="Nota de Débito"    onClick={()=>setMOpc({tipo:'nd',      venta:v})}><IcoND/></button>
                        <button className="ic" title="Nota de Crédito"   onClick={()=>setMOpc({tipo:'nc',      venta:v})}><IcoNC/></button>
                        <button className="ic" title="Imprimir Ticket"   onClick={()=>setMOpc({tipo:'ticket',  venta:v})}><IcoTicket/></button>
                        <button className="ic" title="Cotizar"           onClick={()=>setMOpc({tipo:'cotizar', venta:v})}><IcoCoti/></button>
                        <button className="ic" title="Cliente"           onClick={()=>setMOpc({tipo:'cliente', venta:v})}><IcoCli/></button>
                        <button className="ic" title="Vender"            onClick={()=>setMOpc({tipo:'vender',  venta:v})}><IcoVender/></button>
                        <button className="ic" title="Imprimir PDF"      onClick={()=>setMOpc({tipo:'pdf',     venta:v})}><IcoPDF/></button>
                        <button className="ic" title="Exportar XML"      onClick={()=>setMOpc({tipo:'xml',     venta:v})}><IcoXML/></button>
                        <button className="ic" title="Leer Ticket SUNAT" onClick={()=>setMOpc({tipo:'sunat',   venta:v})}><IcoLeer/></button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>

          {/* leyenda errores sunat */}
          {listaFilt.some(v=>v.sunat==='ERROR') && (
            <div style={{textAlign:'center',marginTop:10,fontSize:12,color:'#888',padding:'4px 0 2px'}}>
              LISTA DE VENTAS CON ERRORES DE ENVIO A SUNAT
            </div>
          )}

          {/* leyenda opciones */}
          <div className="leyenda-ops">
            <b>Leyenda de OPCIONES :</b>
            <span><IcoEdit/> Actualizar, Eliminar</span>
            <span><IcoND/> Generar Nota de Debito</span>
            <span><IcoNC/> Generar Nota de Credito</span>
            <span><IcoTicket/> Imprimir Ticket</span>
            <span><IcoCoti/> Cotizar</span>
            <span><IcoCli/> cliente</span>
            <span><IcoVender/> Vender</span>
            <span><IcoPDF/> Imprimir Factura y boleta lectrónica</span>
            <span><IcoXML/> Exportar XML</span>
            <span><IcoLeer/> Leer Ticket(sunat)</span>
          </div>

          {/* leyenda colores */}
          <hr style={{border:'none',borderTop:'1px solid #dee2e6',margin:'10px 0'}}/>
          <div style={{textAlign:'center',marginBottom:6,fontSize:12,fontWeight:'bold',color:'#555'}}>
            Leyenda de COLORES :
          </div>
          <div className="ley-colores" style={{justifyContent:'center'}}>
            <div className="lc">
              <span className="badge-beta">BETA</span>
              <span style={{fontSize:12}}>: COMPROBANTE DE PRUEBA NO SIRVE PARA DECLARAR ANTE SUNAT</span>
            </div>
            <div className="lc">
              <span className="badge-err">ERROR</span>
              <span style={{fontSize:12}}>: DOCUMENTO NO LLEGO A SUNAT TIENE 24 HORAS PARA SOLUCIONAR</span>
            </div>
          </div>
        </>
      )}

      {/* ════════════ FORMULARIO NUEVA VENTA ════════════ */}
      {vista==='form' && (
        <>
          <div className="form-titulo">VENTA : NUEVA</div>

          {/* ── fila 1: documento, fecha, nro orden, moneda, conigv, tipo oper, preanticipo ── */}
          <div className="frow">
            <div className="fc" style={{minWidth:160}}>
              <label>Docmto-Serie : <span className="req">(*)</span>
                <a href="#" style={{color:'#0099ff',fontSize:11,marginLeft:6}}>..+</a>
              </label>
              <select value={form.documento} onChange={e=>sf('documento',e.target.value)} style={{width:160}}>
                {DOCUMENTOS.map(d=><option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="fc">
              <label>Fecha : <span className="req">(*)</span></label>
              <div style={{border:'1px solid #ced4da',borderRadius:4,padding:'6px 10px',
                background:'#fff',display:'flex',alignItems:'center',gap:8}}>
                <DP value={form.fecha} onChange={v=>sf('fecha',v)}/>
              </div>
            </div>
            <div className="fc" style={{width:90}}>
              <label>Nº de Orden</label>
              <input type="text" value={form.nroorden} onChange={e=>sf('nroorden',e.target.value)} style={{width:90}}/>
            </div>
            <div className="fc">
              <label>Moneda : <span className="req">(*)</span></label>
              <select value={form.moneda} onChange={e=>sf('moneda',e.target.value)} style={{width:100}}>
                {MONEDAS.map(m=><option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="fc">
              <label>&nbsp;</label>
              <select value={form.conigv} onChange={e=>sf('conigv',e.target.value)} style={{width:90}}>
                {CONIGV.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="fc">
              <label>Tipo Operacion: <span className="req">(*)</span></label>
              <select value={form.tipooper} onChange={e=>sf('tipooper',e.target.value)} style={{width:130}}>
                {TIPO_OPER.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="fc">
              <label>Pre Anticipo: <span className="req">(*)</span></label>
              <select value={form.preanticipo} onChange={e=>sf('preanticipo',e.target.value)} style={{width:80}}>
                {PRE_ANTICIPO.map(p=><option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* ── fila 2: venta radio, guia, vendedor, tipo venta, pago, sujeto ── */}
          <div className="frow">
            <div className="fc" style={{minWidth:60}}>
              <label>&nbsp;</label>
              <div style={{display:'flex',alignItems:'center',gap:4,paddingBottom:2}}>
                <label style={{fontSize:12,color:'#17a2b8',fontWeight:'bold',display:'flex',gap:4,alignItems:'center'}}>
                  <input type="radio" defaultChecked style={{width:14,accentColor:'#17a2b8'}}/> Venta
                </label>
              </div>
            </div>
            <div className="fc">
              <label>&nbsp;</label>
              <select value={form.guia} onChange={e=>sf('guia',e.target.value)} style={{width:190}}>
                {GUIAS.map(g=><option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="fc" style={{width:50}}>
              <label>&nbsp;</label>
              <input type="text" value={form.nroguia} onChange={e=>sf('nroguia',e.target.value)} style={{width:50}}/>
            </div>
            <div className="fc">
              <label>Vendedor</label>
              <select value={form.vendedor} onChange={e=>sf('vendedor',e.target.value)} style={{width:170}}>
                {VENDEDORES.map(v=><option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="fc">
              <label>Tipo de venta <span className="req">(*)</span></label>
              <div style={{display:'flex',alignItems:'center',gap:6}}>
                <select value={form.tipovta} onChange={e=>sf('tipovta',e.target.value)} style={{width:100}}>
                  {TIPO_VTA.map(t=><option key={t}>{t}</option>)}
                </select>
                {form.tipovta==='Contado' && (
                  <select value={form.pagomod} onChange={e=>sf('pagomod',e.target.value)} style={{width:140}}>
                    {PAGO_TIPO.map(p=><option key={p}>{p}</option>)}
                  </select>
                )}
                {form.tipovta==='Credito' && (
                  <span style={{display:'flex',alignItems:'center',gap:5}}>
                    <input type="text" value={form.diasdias} onChange={e=>sf('diasdias',e.target.value)}
                      style={{width:45}} placeholder="Dias"/>
                    <span style={{fontSize:12}}>Dias</span>
                    <label style={{display:'flex',alignItems:'center',gap:3,fontSize:12}}>
                      <input type="checkbox" checked={form.letra} onChange={e=>sf('letra',e.target.checked)}
                        style={{width:12}}/> C.Letra
                    </label>
                  </span>
                )}
              </div>
            </div>
            <div className="fc flex1">
              <label>Sujeto a</label>
              <select value={form.sujeto} onChange={e=>sf('sujeto',e.target.value)} style={{width:'100%',minWidth:180}}>
                {SUJETO_OPTS.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {form.tipovta==='Contado' && (
              <div className="fc" style={{minWidth:110}}>
                <label>Pago con</label>
                <input type="text" value={form.pagocon} onChange={e=>sf('pagocon',e.target.value)}
                  placeholder="moneda indicada" style={{width:120}}/>
              </div>
            )}
          </div>

          <hr className="sep"/>

          {/* ── sección CLIENTE ── */}
          <div className="sec-cli">
            <div className="frow" style={{alignItems:'flex-end'}}>
              <div className="fc">
                <label className="fc-label">CLIENTE</label>
                <div className="cli-wrap">
                  <input type="text" value={form.cliRuc}
                    onChange={e=>sf('cliRuc',e.target.value)}
                    placeholder="Busca data/sunat/reniec" style={{width:165}}/>
                  <button className="btn-lupa" title="Consultar SUNAT">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="11" cy="11" r="7" stroke="#17a2b8" strokeWidth="2"/>
                      <path d="M21 21l-4.35-4.35" stroke="#17a2b8" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="fc" style={{minWidth:220}}>
                <label className="fc-label">CLIENTE (Razon Social / Nombre): <span className="req">(*)</span></label>
                <div style={{display:'flex',alignItems:'center',gap:6}}>
                  <input type="text" className="inp-verde" value={form.cliNombre}
                    onChange={e=>sf('cliNombre',e.target.value)}
                    style={{width:260,fontWeight:'bold'}}/>
                  <button className="btn-bino" title="Buscar cliente" onClick={()=>{ setCliQ(''); setCliRes(CLIENTES_DB); setMCli(true); }}>
                    📖
                  </button>
                </div>
              </div>
              <div className="fc flex1">
                <label className="fc-label">CLIENTE (Direccion) :</label>
                <input type="text" value={form.cliDir} onChange={e=>sf('cliDir',e.target.value)} style={{width:'100%'}}/>
              </div>
              <div className="fc" style={{minWidth:180}}>
                <label className="fc-label">CLIENTE (E-mail) :</label>
                <input type="text" value={form.cliEmail} onChange={e=>sf('cliEmail',e.target.value)} style={{width:190}}/>
              </div>
            </div>
          </div>

          <hr className="sep"/>

          {/* ── BUSQUEDA ARTICULOS ── */}
          <div className="art-search">
            <label>BUSQUEDA DE ARTICULOS ×</label>
            <select value={form.artBusqTipo} onChange={e=>sf('artBusqTipo',e.target.value)}
              style={{width:130, color:'#212529', background:'#fff'}}>
              {['Nombre','Marca','Linea','Categoria','Codigo','C.Barra','S.Cate1','S.Cate2/P.Activos','Serie','Detalle'].map(o=><option key={o}>{o}</option>)}
            </select>
            <input type="text" value={form.artBusqQ} onChange={e=>sf('artBusqQ',e.target.value)}
              placeholder="Buscar artículo..."
              style={{minWidth:220, background:'#ccff99', color:'#212529', fontWeight:'bold'}}/>
            <button className="btn-art-buscar">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2"/>
              </svg>
              Buscar
            </button>
            <button className="btn-art-reset" title="Limpiar búsqueda" onClick={()=>sf('artBusqQ','')}>↺</button>
          </div>

          {/* ── tabla artículos ── */}
          <table className="tart">
            <thead>
              <tr>
                <th width="7%">CODIGO</th>
                <th width="26%">ARTICULOS/DETALLE</th>
                <th width="6%">STOCK</th>
                <th width="7%">MED.</th>
                <th width="8%">P-M/C</th>
                <th width="10%">P.VENTA</th>
                <th width="6%">CANT.</th>
                <th width="13%">T.A.IGV</th>
                <th width="5%">AGRE.</th>
              </tr>
            </thead>
            <tbody>
              {form.artRows.map(row=>(
                <tr key={row.id}>
                  <td><input type="text" value={row.codigo} onChange={e=>updRow(row.id,'codigo',e.target.value)}/></td>
                  <td><textarea value={row.articulo} onChange={e=>updRow(row.id,'articulo',e.target.value)} placeholder="Articulo/descripcion"/></td>
                  <td align="center"><input type="text" value={row.stock} onChange={e=>updRow(row.id,'stock',e.target.value)} style={{background:'#f8f9fa',color:'#212529'}}/></td>
                  <td>
                    <select value={row.med} onChange={e=>updRow(row.id,'med',e.target.value)}>
                      {MED_OPTS.map(m=><option key={m}>{m}</option>)}
                    </select>
                  </td>
                  <td><input type="text" value={row.pmc} onChange={e=>updRow(row.id,'pmc',e.target.value)} style={{color:'#1a6aad',fontWeight:'bold'}}/></td>
                  <td><input type="text" value={row.pventa} onChange={e=>updRow(row.id,'pventa',e.target.value)}/></td>
                  <td><input type="number" value={row.cant} onChange={e=>updRow(row.id,'cant',e.target.value)} min="0"/></td>
                  <td>
                    <select value={row.taigv} onChange={e=>updRow(row.id,'taigv',e.target.value)}>
                      {TAIGV_OPTS.map(t=><option key={t}>{t}</option>)}
                    </select>
                  </td>
                  <td align="center">
                    <input type="checkbox" className="chk-agregar"
                      checked={row.sel} onChange={e=>updRow(row.id,'sel',e.target.checked)}/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{marginTop:8,display:'flex',gap:8}}>
            <button className="btn-art-buscar" style={{fontSize:12,padding:'5px 14px'}} onClick={addRow}>+ Agregar fila</button>
          </div>

          {/* ── botones guardar / regresar ── */}
          <div className="form-footer">
            <button className="btn-gd" onClick={guardar}>💾 Guardar</button>
            <button className="btn-reg" onClick={()=>setVista('lista')}>⬅ Regresar</button>
          </div>
        </>
      )}

      {/* ══════ MODAL BUSCAR CLIENTE ══════ */}
      {mCli && (
        <div className="m-bd" onClick={()=>setMCli(false)}>
          <div className="m-box-cli" onClick={e=>e.stopPropagation()}>
            {/* cabecera estilo Chrome */}
            <div className="m-cli-head">
              <div>
                <div style={{color:'#fff',fontSize:13,fontWeight:'bold'}}>🌐 Soft Inteligente - Google Chrome</div>
                <div className="m-cli-url">gkmtechnology.com/eagle/inteligente/clientes_busar.php</div>
              </div>
              <button className="m-cli-close" onClick={()=>setMCli(false)}>×</button>
            </div>
            {/* cuerpo */}
            <div className="m-cli-body">
              <div style={{fontWeight:'bold',fontSize:13,marginBottom:10,color:'#212529'}}>
                BUSCAR CLIENTES X
                <span style={{marginLeft:10}}>
                  {['Nombre','Ruc','Vendedor'].map(f=>(
                    <label key={f} style={{marginRight:10,fontWeight:'bold',color:'#212529',cursor:'pointer',display:'inline-flex',alignItems:'center',gap:4}}>
                      <input type="radio" name="clifilt" checked={cliFilt===f} onChange={()=>setCliFilt(f)}
                        style={{accentColor:'#17a2b8',width:14,height:14}}/> {f} /
                    </label>
                  ))}
                </span>
              </div>
              <div className="cli-busq">
                <input type="text" value={cliQ} onChange={e=>setCliQ(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&buscarCliente()}
                  placeholder="Buscar..." style={{background:'#b8f5b0',color:'#212529',fontWeight:'bold'}}/>
                <button onClick={buscarCliente}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2"/>
                    <path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2"/>
                  </svg>
                  Buscar
                </button>
              </div>

              <div className="titulo-cli">LISTADO GENERAL DE CLIENTES</div>
              <table className="tcli">
                <thead>
                  <tr>
                    <th width="8%">Nro</th>
                    <th>Nombre</th>
                    <th width="15%">RUC / DNI</th>
                    <th>Direccion</th>
                    <th width="10%">Agregar</th>
                  </tr>
                </thead>
                <tbody>
                  {cliRes.map((c,i)=>(
                    <tr key={c.id}>
                      <td align="center">{i+1}</td>
                      <td>{c.nombre}</td>
                      <td>{c.ruc}</td>
                      <td>{c.dir}</td>
                      <td align="center">
                        <button className="btn-plus-cli" onClick={()=>selCliente(c)}>+</button>
                      </td>
                    </tr>
                  ))}
                  {cliRes.length===0 && (
                    <tr><td colSpan={5} align="center" style={{padding:20,color:'#888'}}>Sin resultados</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* ════════════ VENTAS RAPIDAS ════════════ */}
      {vista==='rapido' && (
        <div style={{padding:'10px 0'}}>
          {/* título */}
          <div style={{fontSize:16,fontWeight:'bold',marginBottom:14,color:'#212529'}}>
            VENTAS RAPIDAS
          </div>

          {/* ── fila superior: Doc-Serie | Tipo de venta | CLIENTE ── */}
          <div style={{display:'flex',gap:18,flexWrap:'wrap',alignItems:'flex-end',marginBottom:10}}>

            {/* Doc-Serie */}
            <div style={{minWidth:160}}>
              <div style={{fontSize:13,fontWeight:'bold',marginBottom:3}}>
                Doc-Serie :(<span style={{color:'red'}}>*</span>){' '}
                <span style={{color:'#0099ff',cursor:'pointer',fontWeight:'normal',fontSize:12}}>..+</span>
              </div>
              <select value={rDoc} onChange={e=>setRDoc(e.target.value)}
                style={{width:'100%',padding:'5px 8px',border:'1px solid #ced4da',
                  borderRadius:4,fontSize:13,color:'#212529',background:'#fff'}}>
                <option>Boleta BI01</option>
                <option>Nota de Venta 001</option>
              </select>
            </div>

            {/* Tipo de venta */}
            <div>
              <div style={{fontSize:13,fontWeight:'bold',marginBottom:3}}>
                Tipo de venta(<span style={{color:'red'}}>*</span>)
              </div>
              <div style={{display:'flex',gap:6,alignItems:'center'}}>
                <select value={rTipoVta} onChange={e=>setRTipoVta(e.target.value)}
                  style={{width:100,padding:'5px 8px',border:'1px solid #ced4da',
                    borderRadius:4,fontSize:13,color:'#212529',background:'#fff'}}>
                  <option>Contado</option>
                  {/* <option>Credito</option> — comentado como en original */}
                </select>
                {/* Contado → select pago */}
                {rTipoVta==='Contado' && (
                  <select value={rPago} onChange={e=>setRPago(e.target.value)}
                    style={{width:200,padding:'5px 8px',border:'1px solid #ced4da',
                      borderRadius:4,fontSize:13,color:'#212529',background:'#fff'}}>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Contra Entrega">C.Entrega</option>
                    <option value="Yape">Yape [986638034] Billeteras móviles Soles</option>
                    <option value="Interbank">Deposito - Tranf. Interbank Soles [Ahorros][4423115267400]</option>
                    <option value="BBVA">Deposito - Tranf. Bancos Continental BBVA Soles</option>
                    <option value="BCP">Deposito - Tranf. Banco de Crédito del Perú - BCP Soles</option>
                    <option value="Mixto">Mixto</option>
                  </select>
                )}
                {/* Mixto → link Agregar */}
                {rPago==='Mixto' && (
                  <span style={{color:'#0099ff',cursor:'pointer',fontSize:13}}>Agregar</span>
                )}
              </div>
            </div>

            {/* CLIENTE */}
            <div style={{flex:1,minWidth:180}}>
              <div style={{fontSize:13,fontWeight:'bold',marginBottom:3}}>CLIENTE</div>
              <div style={{display:'flex',gap:6,alignItems:'center'}}>
                <input type="text" value={rCliente} readOnly
                  style={{flex:1,maxWidth:280,padding:'5px 10px',
                    border:'1px solid #ced4da',borderRadius:4,fontSize:13,
                    color:'#212529',background:'#fff'}}/>
                <button onClick={()=>setMRCli('nuevo')}
                  style={{background:'#17a2b8',border:'none',color:'#fff',padding:'5px 12px',
                    borderRadius:4,cursor:'pointer',fontSize:13,fontWeight:'bold',whiteSpace:'nowrap'}}>
                  + Agregar Nuevo
                </button>
                <button onClick={()=>setMRCli('lista')}
                  style={{background:'#17a2b8',border:'none',color:'#fff',padding:'5px 12px',
                    borderRadius:4,cursor:'pointer',fontSize:13,fontWeight:'bold'}}>
                  Siguiente
                </button>
              </div>
            </div>
          </div>

          <hr style={{borderColor:'#dee2e6',margin:'12px 0 14px'}}/>

          {/* ── listaSeleccionado: artículos agregados al carrito ── */}
          {rCarrito.length > 0 && (
            <div style={{marginBottom:16}}>
              <table style={{width:'100%',borderSpacing:0,fontFamily:'verdana',fontSize:14}}>
                <thead>
                  <tr style={{background:'#005F8C'}}>
                    {['CÓDIGO','ARTÍCULO','PRECIO','CANT.','TOTAL',''].map(h=>(
                      <th key={h} style={{color:'#fff',fontWeight:'bold',textTransform:'uppercase',
                        letterSpacing:1,padding:'8px 6px',fontSize:13,textAlign:'center'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rCarrito.map((item,i)=>(
                    <tr key={item.id} style={{background: i%2===0?'#eee':'#fff'}}>
                      <td style={{padding:'4px 6px',fontSize:14}}>{item.codigo}</td>
                      <td style={{padding:'4px 6px',fontSize:14}}>{item.nombre}</td>
                      <td style={{padding:'4px 6px',fontSize:14,textAlign:'center'}}>
                        <input type="number" value={item.precio} min="0" step="0.01"
                          onChange={e=>setRCarrito(p=>p.map(r=>r.id===item.id?{...r,precio:e.target.value}:r))}
                          className="vr-input"
                          style={{width:70,padding:'2px 5px',borderRadius:3,textAlign:'right',background:'#fff',color:'#212529'}}/>
                      </td>
                      <td style={{padding:'4px 6px',fontSize:14,textAlign:'center'}}>
                        <input type="number" value={item.cant} min="1"
                          onChange={e=>setRCarrito(p=>p.map(r=>r.id===item.id?{...r,cant:e.target.value}:r))}
                          className="vr-input"
                          style={{width:55,padding:'2px 5px',borderRadius:3,textAlign:'center',background:'#fff',color:'#212529'}}/>
                      </td>
                      <td style={{padding:'4px 6px',fontSize:14,textAlign:'right',fontWeight:'bold'}}>
                        S/ {(parseFloat(item.precio||0)*parseFloat(item.cant||0)).toFixed(2)}
                      </td>
                      <td style={{padding:'4px 6px',textAlign:'center'}}>
                        <button onClick={()=>setRCarrito(p=>p.filter(r=>r.id!==item.id))}
                          style={{background:'#dc3545',border:'none',color:'#fff',borderRadius:3,
                            padding:'2px 8px',cursor:'pointer',fontSize:12}}>✕</button>
                      </td>
                    </tr>
                  ))}
                  {/* total */}
                  <tr style={{background:'skyblue'}}>
                    <td colSpan={4} style={{padding:'6px 8px',fontWeight:'bold',
                      textAlign:'right',fontSize:14,color:'#fff',textTransform:'uppercase',
                      letterSpacing:1}}>TOTAL</td>
                    <td style={{padding:'6px 8px',fontWeight:'bold',fontSize:15,
                      textAlign:'right',color:'#fff'}}>
                      S/ {rCarrito.reduce((s,r)=>s+parseFloat(r.precio||0)*parseFloat(r.cant||0),0).toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* ── búsqueda de artículos (PROresultado) ── */}
          <div style={{textAlign:'center',marginBottom:14}}>
            <span style={{fontSize:13,fontWeight:'bold',marginRight:8}}>BUSCAR X</span>
            <select value={rBusqTipo} onChange={e=>setRBusqTipo(e.target.value)}
              style={{padding:'4px 8px',border:'1px solid #ced4da',borderRadius:4,
                fontSize:13,color:'#212529',background:'#fff',marginRight:6}}>
              <option value="nomart">Nombre</option>
              <option value="codigo">Codigo</option>
              <option value="codigob">Codigo Barra</option>
              <option value="linea">Linea</option>
              <option value="categoria">Categoria</option>
            </select>
            <input type="text" value={rBusqQ} onChange={e=>setRBusqQ(e.target.value)}
              placeholder="Ingrese el texto a buscar"
              style={{width:240,padding:'4px 10px',border:'1px solid #ced4da',borderRadius:4,
                fontSize:13,color:'#212529',background:'#ccff99',fontWeight:'bold',marginRight:4}}/>
            <button onClick={()=>buscarRapido(rBusqTipo, rBusqQ)}
              style={{background:'#17a2b8',border:'none',borderRadius:4,padding:'5px 12px',
                color:'#fff',cursor:'pointer',fontSize:13,marginRight:8,
                display:'inline-flex',alignItems:'center',gap:4}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2"/>
              </svg>
            </button>
            <span style={{marginRight:6,color:'#888'}}>-</span>
            {/* botones acceso rápido por categoría */}
            {[
              {label:'T',  tipo:'Todos',    val:'Todos'},
              {label:'P',  tipo:'Producto', val:'2'},
              {label:'S',  tipo:'Servicio', val:'2'},
              {label:'Compon',  tipo:'3', val:'Componentes PC'},
              {label:'Comput',  tipo:'3', val:'Computo'},
              {label:'Memori',  tipo:'3', val:'Memorias'},
              {label:'Monito',  tipo:'3', val:'Monitores'},
              {label:'Perife',  tipo:'3', val:'Perifericos'},
              {label:'Sumini',  tipo:'3', val:'Suministros'},
            ].map(btn=>(
              <button key={btn.label}
                onClick={()=>{ setRCategoria(btn.label); buscarRapido(btn.tipo, btn.val); setRBusqTipo(btn.tipo); }}
                style={{background: rCategoria===btn.label ? '#0d8ea4':'#17a2b8',
                  border:'none',borderRadius:4,padding:'5px 9px',color:'#fff',
                  cursor:'pointer',fontSize:12,fontWeight:'bold',marginRight:3}}>
                {btn.label}
              </button>
            ))}
          </div>

          {/* tabla resultados búsqueda */}
          {rResultados.length > 0 && (
            <table style={{width:'100%',borderSpacing:0,fontFamily:'verdana',marginBottom:16}}>
              <thead>
                <tr style={{background:'#17a2b8'}}>
                  {['CÓDIGO','ARTÍCULO','STOCK','P.VENTA','CANT.','AGREGAR'].map(h=>(
                    <th key={h} style={{color:'#fff',fontWeight:'bold',textTransform:'uppercase',
                      letterSpacing:1,padding:'8px 6px',fontSize:13,textAlign:'center'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rResultados.map((art,i)=>(
                  <tr key={art.id} style={{background:i%2===0?'#eee':'#fff'}}>
                    <td style={{padding:'4px 8px',fontSize:14}}>{art.codigo}</td>
                    <td style={{padding:'4px 8px',fontSize:14}}>{art.nombre}</td>
                    <td style={{padding:'4px 8px',fontSize:14,textAlign:'center'}}>{art.stock}</td>
                    <td style={{padding:'4px 8px',fontSize:14,textAlign:'center'}}>
                      S/ {parseFloat(art.precio).toFixed(2)}
                    </td>
                    <td style={{padding:'4px 8px',textAlign:'center'}}>
                      <input type="number" defaultValue="1" min="1"
                        id={`cant-rap-${art.id}`}
                        className="vr-input"
                        style={{width:55,padding:'2px 5px',borderRadius:3,textAlign:'center',background:'#fff',color:'#212529',fontSize:13}}/>
                    </td>
                    <td style={{padding:'4px 8px',textAlign:'center'}}>
                      <button
                        onClick={()=>{
                          const cantEl = document.getElementById(`cant-rap-${art.id}`);
                          const cant = cantEl ? cantEl.value : '1';
                          setRCarrito(p=>[...p, {...art, cant, id:Date.now()+Math.random()}]);
                        }}
                        style={{background:'#28a745',border:'none',color:'#fff',borderRadius:4,
                          padding:'4px 12px',cursor:'pointer',fontSize:13,fontWeight:'bold'}}>
                        +
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {rResultados.length===0 && busqActiva && (
            <div style={{textAlign:'center',padding:20,color:'#aaa',fontSize:13}}>
              Sin resultados para "{busqActiva}"
            </div>
          )}

          {/* ── botones guardar / regresar ── */}
          <div style={{textAlign:'center',marginTop:16,display:'flex',
            justifyContent:'center',gap:12,flexWrap:'wrap'}}>
            {rCarrito.length > 0 && (
              <button
                onClick={()=>{
                  const nva = {
                    id:Date.now(), doc:rDoc,
                    serie: rDoc.includes('Boleta')?`BI01-${String(ventas.length+1).padStart(6,'0')}`:`001-${String(ventas.length+1).padStart(6,'0')}`,
                    fecha:hoy, cliente:rCliente, vendedor:'fac-tura.com',
                    tvta: rTipoVta, sunat:'BETA', estado:'Borrador',
                  };
                  setVentas(p=>[nva,...p]);
                  setAlert('ok:Venta rápida guardada correctamente.');
                  setTimeout(()=>setAlert(''),3000);
                  setRCarrito([]); setRResultados([]); setBusqActiva('');
                  setVista('lista');
                }}
                style={{background:'#28a745',border:'none',color:'#fff',padding:'9px 28px',
                  borderRadius:4,cursor:'pointer',fontSize:14,fontWeight:'bold',
                  display:'inline-flex',alignItems:'center',gap:6}}>
                💾 Guardar
              </button>
            )}
            <button onClick={()=>{ setRCarrito([]); setRResultados([]); setBusqActiva(''); setVista('lista'); }}
              style={{background:'#17a2b8',border:'none',color:'#fff',padding:'9px 28px',
                borderRadius:4,cursor:'pointer',fontSize:14,fontWeight:'bold',
                display:'inline-flex',alignItems:'center',gap:6}}>
              ↩ Regresar
            </button>
          </div>
        </div>
      )}
      {/* ════════ MODAL LISTADO CLIENTES (Siguiente) ════════ */}
      {mRCli==='lista' && (
        <div className="mopc-overlay" onClick={()=>setMRCli(null)}>
          <div className="mopc-box" onClick={e=>e.stopPropagation()} style={{maxWidth:750}}>
            <div className="mopc-head" style={{background:'#003d6b'}}>
              👤 CLIENTE
              <div style={{fontSize:12,fontWeight:'normal',display:'flex',gap:16,marginLeft:16}}>
                <label style={{cursor:'pointer'}}>
                  <input type="radio" checked={rCliFiltro==='por Criterio'} onChange={()=>setRCliFiltro('por Criterio')}/> por Criterio
                </label>
                <label style={{cursor:'pointer'}}>
                  <input type="radio" checked={rCliFiltro==='Total'} onChange={()=>setRCliFiltro('Total')}/> Total
                </label>
              </div>
            </div>
            <div className="mopc-body" style={{paddingBottom:10}}>
              {/* barra búsqueda */}
              <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:14,flexWrap:'wrap'}}>
                <span style={{fontWeight:'bold',fontSize:13}}>BUSCAR X</span>
                <select value={rCliBusqX} onChange={e=>setRCliBusqX(e.target.value)}
                  style={{padding:'5px 8px',border:'1px solid #ced4da',borderRadius:4,
                    fontSize:13,color:'#212529',background:'#fff',width:160}}>
                  <option value="">SELECCIONE</option>
                  <option>Nombre/empresa</option>
                  <option>Ruc-dni</option>
                  <option>Dpto</option>
                  <option>Vendedor</option>
                  <option>Sucursal</option>
                </select>
                <input type="text" value={rCliBusqQ} onChange={e=>setRCliBusqQ(e.target.value)}
                  placeholder="Ingrese el texto a buscar"
                  style={{flex:1,minWidth:180,padding:'5px 10px',border:'1px solid #ced4da',
                    borderRadius:4,fontSize:13,color:'#212529',background:'#fff'}}/>
                <button style={{background:'#17a2b8',border:'none',color:'#fff',padding:'6px 16px',
                  borderRadius:4,cursor:'pointer',fontSize:13,fontWeight:'bold',
                  display:'inline-flex',alignItems:'center',gap:5}}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2"/>
                    <path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2"/>
                  </svg> Buscar
                </button>
                <button onClick={()=>setMRCli('nuevo')}
                  style={{background:'#17a2b8',border:'none',color:'#fff',padding:'6px 16px',
                    borderRadius:4,cursor:'pointer',fontSize:13,fontWeight:'bold'}}>
                  + Agregar Nuevo
                </button>
              </div>
              {/* paginación */}
              <div style={{fontSize:12,color:'#666',marginBottom:6}}>
                Página 1 de {Math.max(1,Math.ceil(cliListaFilt.length/10))} &nbsp;
                <b>LISTADO GENERAL {cliListaFilt.length}</b>
              </div>
              {/* tabla */}
              <table className="mopc-table">
                <thead>
                  <tr>
                    <th width="5%">NRO</th>
                    <th>NOMBRE</th>
                    <th width="12%">DPTO</th>
                    <th width="14%">RUC</th>
                    <th width="12%">TELÉFONO</th>
                    <th width="10%">ANIVER.</th>
                    <th width="12%">VENDEDOR</th>
                    <th width="8%">SELEC.</th>
                  </tr>
                </thead>
                <tbody>
                  {cliListaFilt.length===0
                    ? <tr><td colSpan={8} style={{textAlign:'center',padding:20,color:'#888'}}>Sin resultados</td></tr>
                    : cliListaFilt.map((c,i)=>(
                      <tr key={c.id}>
                        <td align="center">{i+1}</td>
                        <td>{c.nombre}</td>
                        <td>—</td>
                        <td>{c.ruc||'—'}</td>
                        <td>—</td>
                        <td>—</td>
                        <td>—</td>
                        <td align="center">
                          <button onClick={()=>{ setRCliente(c.nombre); setMRCli(null); }}
                            style={{background:'#17a2b8',border:'none',color:'#fff',
                              padding:'3px 12px',borderRadius:4,cursor:'pointer',
                              fontSize:13,fontWeight:'bold'}}>
                            ✔
                          </button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
            <div className="mopc-footer">
              <button className="mopc-btn" style={{background:'#6c757d'}} onClick={()=>setMRCli(null)}>✕ Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* ════════ MODAL AGREGAR NUEVO CLIENTE ════════ */}
      {mRCli==='nuevo' && (
        <div className="mopc-overlay" onClick={()=>setMRCli(null)}>
          <div className="mopc-box" onClick={e=>e.stopPropagation()} style={{maxWidth:820,width:'95%'}}>
            <div className="mopc-head" style={{background:'#003d6b'}}>
              ➕ AGREGAR NUEVO CLIENTE
              <div style={{display:'flex',alignItems:'center',gap:8,marginLeft:20}}>
                <input placeholder="Ingrese RUC/dni"
                  style={{padding:'4px 10px',borderRadius:4,border:'1px solid #ced4da',
                    fontSize:12,width:150,color:'#212529'}}/>
                <button style={{background:'#17a2b8',border:'none',borderRadius:4,padding:'4px 10px',
                  color:'#fff',cursor:'pointer',fontSize:13}}>🔍</button>
              </div>
            </div>
            <div className="mopc-body" style={{maxHeight:'70vh',overflowY:'auto'}}>
              {/* Fila 1 */}
              <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr 1fr',gap:10,marginBottom:12}}>
                <div>
                  <div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Empresa/nombre (*)</div>
                  <input className="mopc-inp" placeholder="Empresa/nombre" value={cliForm.nombre}
                    onChange={e=>cf('nombre',e.target.value)}/>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Tipo Doc.(*)</div>
                  <select className="mopc-inp" value={cliForm.tipodoc} onChange={e=>cf('tipodoc',e.target.value)}>
                    <option>RUC</option><option>DNI</option><option>CE</option><option>Pasaporte</option>
                  </select>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Nro (*)</div>
                  <input className="mopc-inp" value={cliForm.nro} onChange={e=>cf('nro',e.target.value)}/>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Representante</div>
                  <input className="mopc-inp" value={cliForm.representante} onChange={e=>cf('representante',e.target.value)}/>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>DNI [########]</div>
                  <input className="mopc-inp" placeholder="########" value={cliForm.dni} onChange={e=>cf('dni',e.target.value)}/>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Pais/nacional.(*)</div>
                  <select className="mopc-inp" value={cliForm.pais} onChange={e=>cf('pais',e.target.value)}>
                    <option>Peru</option><option>Colombia</option><option>Chile</option>
                    <option>Ecuador</option><option>Bolivia</option><option>Otro</option>
                  </select>
                </div>
              </div>
              {/* Fila 2 */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 2fr 1fr',gap:10,marginBottom:12}}>
                <div>
                  <div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Dpto</div>
                  <select className="mopc-inp" value={cliForm.dpto} onChange={e=>cf('dpto',e.target.value)}>
                    <option value=""></option>
                    {['Lima','Arequipa','Cusco','La Libertad','Piura','Lambayeque','Junín','Ica','Ancash','Loreto'].map(d=><option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Provincia(*)</div>
                  <select className="mopc-inp" value={cliForm.provincia} onChange={e=>cf('provincia',e.target.value)}>
                    <option value=""></option>
                    <option>Lima</option><option>Callao</option><option>Arequipa</option>
                  </select>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Distrito(*)</div>
                  <select className="mopc-inp" value={cliForm.distrito} onChange={e=>cf('distrito',e.target.value)}>
                    <option value=""></option>
                    <option>Miraflores</option><option>San Isidro</option><option>Surco</option>
                    <option>La Molina</option><option>Lince</option><option>San Borja</option>
                  </select>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Direccion (*)</div>
                  <input className="mopc-inp" value={cliForm.direccion} onChange={e=>cf('direccion',e.target.value)}/>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Tel. Fijo</div>
                  <input className="mopc-inp" value={cliForm.telfijo} onChange={e=>cf('telfijo',e.target.value)}/>
                </div>
              </div>
              {/* Fila 3 */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 2fr 1fr',gap:10,marginBottom:12}}>
                <div>
                  <div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Movistar</div>
                  <input className="mopc-inp" value={cliForm.movistar} onChange={e=>cf('movistar',e.target.value)}/>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Claro</div>
                  <input className="mopc-inp" value={cliForm.claro} onChange={e=>cf('claro',e.target.value)}/>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Otros</div>
                  <input className="mopc-inp" value={cliForm.otros} onChange={e=>cf('otros',e.target.value)}/>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>E-mail</div>
                  <input className="mopc-inp" type="email" value={cliForm.email} onChange={e=>cf('email',e.target.value)}/>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Descuento%</div>
                  <input className="mopc-inp" type="number" value={cliForm.descuento} onChange={e=>cf('descuento',e.target.value)}/>
                </div>
              </div>
              {/* Fila 4 */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr 1fr',gap:10}}>
                <div>
                  <div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Aniversario/Cump.</div>
                  <DP value={cliForm.aniversario} onChange={v=>cf('aniversario',v)}/>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Responsable</div>
                  <select className="mopc-inp" value={cliForm.responsable} onChange={e=>cf('responsable',e.target.value)}>
                    {VENDEDORES.map(v=><option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Modo de pago</div>
                  <select className="mopc-inp" value={cliForm.modopago} onChange={e=>cf('modopago',e.target.value)}>
                    <option>Contado</option><option>Credito</option><option>Mixto</option>
                  </select>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Estado del cliente</div>
                  <select className="mopc-inp" value={cliForm.estado} onChange={e=>cf('estado',e.target.value)}>
                    <option>Pagador</option><option>Moroso</option><option>Suspendido</option><option>VIP</option>
                  </select>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Partida</div>
                  <input className="mopc-inp" value={cliForm.partida} onChange={e=>cf('partida',e.target.value)}/>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:'bold',marginBottom:3}}>Representa (Nombre)</div>
                  <input className="mopc-inp" value={cliForm.representa} onChange={e=>cf('representa',e.target.value)}/>
                </div>
              </div>
            </div>
            <div className="mopc-footer">
              <button className="mopc-btn" style={{background:'#17a2b8'}} onClick={guardarNuevoCli}>
                💾 Guardar
              </button>
              <button className="mopc-btn" style={{background:'#6c757d'}} onClick={()=>{ setCliForm(cliIni()); setMRCli('lista'); }}>
                ← Regresar
              </button>
            </div>
          </div>
        </div>
      )}


      {mOpc && (()=>{
        const v = mOpc.venta;
        const BtnCerrar = ({color='#6c757d'}) => (
          <button className="mopc-btn" style={{background:color}} onClick={cerrarMOpc}>✕ Cerrar</button>
        );

        /* ── EDITAR / ELIMINAR ── */
        if(mOpc.tipo==='editar') return (
          <div className="mopc-overlay" onClick={cerrarMOpc}>
            <div className="mopc-box" onClick={e=>e.stopPropagation()}>
              <div className="mopc-head" style={{background:'#e67e22'}}>✏ Editar / Eliminar Venta — {v.serie}</div>
              <div className="mopc-body">
                <div className="mopc-row"><span className="mopc-label">Documento:</span><span className="mopc-val">{v.doc}</span></div>
                <div className="mopc-row"><span className="mopc-label">Serie:</span><span className="mopc-val">{v.serie}</span></div>
                <div className="mopc-row"><span className="mopc-label">Fecha:</span><span className="mopc-val">{fmtFecha(v.fecha)}</span></div>
                <div className="mopc-row"><span className="mopc-label">Cliente:</span>
                  <input className="mopc-inp" defaultValue={v.cliente}
                    onChange={e=>setVentas(p=>p.map(x=>x.id===v.id?{...x,cliente:e.target.value}:x))}/>
                </div>
                <div className="mopc-row"><span className="mopc-label">Vendedor:</span>
                  <select className="mopc-inp" defaultValue={v.vendedor}
                    onChange={e=>setVentas(p=>p.map(x=>x.id===v.id?{...x,vendedor:e.target.value}:x))}>
                    {VENDEDORES.map(vd=><option key={vd}>{vd}</option>)}
                  </select>
                </div>
                <div className="mopc-row"><span className="mopc-label">Estado:</span>
                  <select className="mopc-inp" defaultValue={v.estado}
                    onChange={e=>setVentas(p=>p.map(x=>x.id===v.id?{...x,estado:e.target.value}:x))}>
                    {['Emitido','Borrador','Anulado','Error'].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="mopc-footer">
                <button className="mopc-btn" style={{background:'#28a745'}}
                  onClick={()=>{ setAlert('ok:Registro actualizado.'); setTimeout(()=>setAlert(''),3000); cerrarMOpc(); }}>
                  💾 Guardar
                </button>
                <button className="mopc-btn" style={{background:'#dc3545'}}
                  onClick={()=>{ if(window.confirm(`¿Eliminar ${v.serie}?`)){ setVentas(p=>p.filter(x=>x.id!==v.id)); cerrarMOpc(); } }}>
                  🗑 Eliminar
                </button>
                <BtnCerrar/>
              </div>
            </div>
          </div>
        );

        /* ── NOTA DE DÉBITO ── */
        if(mOpc.tipo==='nd') return (
          <div className="mopc-overlay" onClick={cerrarMOpc}>
            <div className="mopc-box" onClick={e=>e.stopPropagation()}>
              <div className="mopc-head" style={{background:'#28a745'}}>ND Generar Nota de Débito — {v.serie}</div>
              <div className="mopc-body">
                <div className="mopc-row"><span className="mopc-label">Doc. Origen:</span><span className="mopc-val">{v.serie}</span></div>
                <div className="mopc-row"><span className="mopc-label">Cliente:</span><span className="mopc-val">{v.cliente}</span></div>
                <div className="mopc-row"><span className="mopc-label">Motivo:</span>
                  <select className="mopc-inp">
                    <option>02 - Aumento en el valor</option>
                    <option>03 - Penalidades / otras deducciones al acreedor</option>
                    <option>11 - Ajustes de operaciones de exportación</option>
                  </select>
                </div>
                <div className="mopc-row"><span className="mopc-label">Descripción:</span>
                  <input className="mopc-inp" placeholder="Descripción de la nota de débito..."/>
                </div>
                <div className="mopc-row"><span className="mopc-label">Monto:</span>
                  <input className="mopc-inp" type="number" placeholder="0.00" style={{width:120}}/>
                </div>
              </div>
              <div className="mopc-footer">
                <button className="mopc-btn" style={{background:'#28a745'}}
                  onClick={()=>{ setAlert('ok:Nota de Débito generada.'); setTimeout(()=>setAlert(''),3000); cerrarMOpc(); }}>
                  ✔ Generar ND
                </button>
                <BtnCerrar/>
              </div>
            </div>
          </div>
        );

        /* ── NOTA DE CRÉDITO ── */
        if(mOpc.tipo==='nc') return (
          <div className="mopc-overlay" onClick={cerrarMOpc}>
            <div className="mopc-box" onClick={e=>e.stopPropagation()}>
              <div className="mopc-head" style={{background:'#dc3545'}}>NC Generar Nota de Crédito — {v.serie}</div>
              <div className="mopc-body">
                <div className="mopc-row"><span className="mopc-label">Doc. Origen:</span><span className="mopc-val">{v.serie}</span></div>
                <div className="mopc-row"><span className="mopc-label">Cliente:</span><span className="mopc-val">{v.cliente}</span></div>
                <div className="mopc-row"><span className="mopc-label">Motivo:</span>
                  <select className="mopc-inp">
                    <option>01 - Anulación de la operación</option>
                    <option>02 - Anulación por error en el RUC</option>
                    <option>03 - Corrección por error en la descripción</option>
                    <option>04 - Descuento global</option>
                    <option>05 - Descuento por ítem</option>
                    <option>06 - Devolución total</option>
                    <option>07 - Devolución por ítem</option>
                    <option>13 - Ajustes de operaciones de exportación</option>
                  </select>
                </div>
                <div className="mopc-row"><span className="mopc-label">Descripción:</span>
                  <input className="mopc-inp" placeholder="Descripción de la nota de crédito..."/>
                </div>
                <div className="mopc-row"><span className="mopc-label">Monto:</span>
                  <input className="mopc-inp" type="number" placeholder="0.00" style={{width:120}}/>
                </div>
              </div>
              <div className="mopc-footer">
                <button className="mopc-btn" style={{background:'#dc3545'}}
                  onClick={()=>{ setAlert('ok:Nota de Crédito generada.'); setTimeout(()=>setAlert(''),3000); cerrarMOpc(); }}>
                  ✔ Generar NC
                </button>
                <BtnCerrar/>
              </div>
            </div>
          </div>
        );

        /* ── TICKET ── */
        if(mOpc.tipo==='ticket') return (
          <div className="mopc-overlay" onClick={cerrarMOpc}>
            <div className="mopc-box" onClick={e=>e.stopPropagation()} style={{maxWidth:360}}>
              <div className="mopc-head" style={{background:'#17a2b8'}}>🖨 Ticket — {v.serie}</div>
              <div className="mopc-body" style={{fontFamily:'monospace',fontSize:13,lineHeight:1.8}}>
                <div style={{textAlign:'center',borderBottom:'1px dashed #aaa',paddingBottom:8,marginBottom:8}}>
                  <div style={{fontWeight:'bold',fontSize:15}}>EMPRESA S.A.C.</div>
                  <div style={{fontSize:11,color:'#666'}}>RUC: 20123456789</div>
                  <div style={{fontSize:11,color:'#666'}}>Av. Principal 123, Lima</div>
                </div>
                <div style={{borderBottom:'1px dashed #aaa',paddingBottom:8,marginBottom:8}}>
                  <div><b>{v.doc}</b>: {v.serie}</div>
                  <div>Fecha: {fmtFecha(v.fecha)}</div>
                  <div>Cliente: {v.cliente}</div>
                  <div>Vendedor: {v.vendedor}</div>
                </div>
                <table style={{width:'100%',fontSize:12}}>
                  <thead><tr><th style={{textAlign:'left'}}>Artículo</th><th>Cant</th><th>P.U.</th><th>Total</th></tr></thead>
                  <tbody>
                    <tr><td>Producto demo</td><td style={{textAlign:'center'}}>1</td><td style={{textAlign:'right'}}>100.00</td><td style={{textAlign:'right'}}>100.00</td></tr>
                  </tbody>
                </table>
                <div style={{borderTop:'1px dashed #aaa',marginTop:8,paddingTop:8,textAlign:'right'}}>
                  <div>SubTotal: S/ 84.75</div>
                  <div>IGV (18%): S/ 15.25</div>
                  <div style={{fontWeight:'bold',fontSize:15}}>TOTAL: S/ 100.00</div>
                </div>
                <div style={{textAlign:'center',marginTop:10,fontSize:11,color:'#888'}}>
                  ¡Gracias por su compra!
                </div>
              </div>
              <div className="mopc-footer">
                <button className="mopc-btn" style={{background:'#17a2b8'}} onClick={()=>window.print()}>🖨 Imprimir</button>
                <BtnCerrar/>
              </div>
            </div>
          </div>
        );

        /* ── COTIZAR ── */
        if(mOpc.tipo==='cotizar') return (
          <div className="mopc-overlay" onClick={cerrarMOpc}>
            <div className="mopc-box" onClick={e=>e.stopPropagation()}>
              <div className="mopc-head" style={{background:'#6c9bd1'}}>↺ Cotización desde — {v.serie}</div>
              <div className="mopc-body">
                <div className="mopc-row"><span className="mopc-label">Cliente:</span><span className="mopc-val">{v.cliente}</span></div>
                <div className="mopc-row"><span className="mopc-label">Vendedor:</span><span className="mopc-val">{v.vendedor}</span></div>
                <div className="mopc-row"><span className="mopc-label">Validez:</span>
                  <select className="mopc-inp" style={{width:160}}>
                    <option>7 días</option><option>15 días</option><option>30 días</option><option>60 días</option>
                  </select>
                </div>
                <div className="mopc-row"><span className="mopc-label">Observación:</span>
                  <input className="mopc-inp" placeholder="Notas u observaciones para el cliente..."/>
                </div>
                <table className="mopc-table">
                  <thead><tr><th>Artículo</th><th>Cant.</th><th>P.Unit</th><th>Total</th></tr></thead>
                  <tbody><tr><td>Producto demo</td><td>1</td><td>S/ 100.00</td><td>S/ 100.00</td></tr></tbody>
                </table>
              </div>
              <div className="mopc-footer">
                <button className="mopc-btn" style={{background:'#6c9bd1'}}
                  onClick={()=>{ setAlert('ok:Cotización generada correctamente.'); setTimeout(()=>setAlert(''),3000); cerrarMOpc(); }}>
                  📄 Generar Cotización
                </button>
                <BtnCerrar/>
              </div>
            </div>
          </div>
        );

        /* ── CLIENTE ── */
        if(mOpc.tipo==='cliente') {
          const cli = CLIENTES_DB.find(c=>c.nombre===v.cliente) || {nombre:v.cliente,ruc:'—',dir:'—'};
          return (
            <div className="mopc-overlay" onClick={cerrarMOpc}>
              <div className="mopc-box" onClick={e=>e.stopPropagation()}>
                <div className="mopc-head" style={{background:'#17a2b8'}}>👤 Datos del Cliente</div>
                <div className="mopc-body">
                  <div className="mopc-row"><span className="mopc-label">Nombre:</span><span className="mopc-val">{cli.nombre}</span></div>
                  <div className="mopc-row"><span className="mopc-label">RUC / DNI:</span><span className="mopc-val">{cli.ruc||'—'}</span></div>
                  <div className="mopc-row"><span className="mopc-label">Dirección:</span><span className="mopc-val">{cli.dir||'—'}</span></div>
                  <div className="mopc-row"><span className="mopc-label">Vendedor:</span><span className="mopc-val">{v.vendedor}</span></div>
                  <div className="mopc-row"><span className="mopc-label">T. Venta:</span><span className="mopc-val">{v.tvta}</span></div>
                  <div className="mopc-row"><span className="mopc-label">Última venta:</span><span className="mopc-val">{fmtFecha(v.fecha)}</span></div>
                  <div className="mopc-row"><span className="mopc-label">Doc:</span><span className="mopc-val">{v.serie}</span></div>
                </div>
                <div className="mopc-footer"><BtnCerrar color="#17a2b8"/></div>
              </div>
            </div>
          );
        }

        /* ── VENDER (nueva venta desde este cliente) ── */
        if(mOpc.tipo==='vender') return (
          <div className="mopc-overlay" onClick={cerrarMOpc}>
            <div className="mopc-box" onClick={e=>e.stopPropagation()}>
              <div className="mopc-head" style={{background:'#6c757d'}}>🛒 Nueva Venta para — {v.cliente}</div>
              <div className="mopc-body">
                <div className="mopc-row"><span className="mopc-label">Cliente:</span><span className="mopc-val">{v.cliente}</span></div>
                <div className="mopc-row"><span className="mopc-label">Documento:</span>
                  <select className="mopc-inp" style={{width:180}}>
                    {DOCUMENTOS.map(d=><option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="mopc-row"><span className="mopc-label">Tipo venta:</span>
                  <select className="mopc-inp" style={{width:130}}>
                    {TIPO_VTA.map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{marginTop:12,padding:12,background:'#fff3cd',borderRadius:6,fontSize:13,color:'#856404'}}>
                  💡 Se abrirá el formulario de Nueva Venta con los datos de este cliente prellenados.
                </div>
              </div>
              <div className="mopc-footer">
                <button className="mopc-btn" style={{background:'#6c757d'}}
                  onClick={()=>{
                    setForm({...formIni(), cliNombre:v.cliente});
                    cerrarMOpc();
                    setVista('form');
                  }}>
                  ➡ Ir a Nueva Venta
                </button>
                <BtnCerrar/>
              </div>
            </div>
          </div>
        );

        /* ── PDF ── */
        if(mOpc.tipo==='pdf') return (
          <div className="mopc-overlay" onClick={cerrarMOpc}>
            <div className="mopc-box" onClick={e=>e.stopPropagation()}>
              <div className="mopc-head" style={{background:'#dc3545'}}>📄 Imprimir Factura / Boleta Electrónica</div>
              <div className="mopc-body">
                <div className="mopc-row"><span className="mopc-label">Documento:</span><span className="mopc-val">{v.serie}</span></div>
                <div className="mopc-row"><span className="mopc-label">Cliente:</span><span className="mopc-val">{v.cliente}</span></div>
                <div className="mopc-row"><span className="mopc-label">Fecha:</span><span className="mopc-val">{fmtFecha(v.fecha)}</span></div>
                <div className="mopc-row"><span className="mopc-label">SUNAT:</span>
                  <span className={v.sunat==='OK'?'badge-ok':v.sunat==='ERROR'?'badge-err':'badge-beta'}>{v.sunat}</span>
                </div>
                <div style={{marginTop:14,padding:12,background:'#f8d7da',borderRadius:6,fontSize:13,color:'#721c24'}}>
                  {v.sunat!=='OK'
                    ? '⚠ Este documento aún no fue aceptado por SUNAT. El PDF se generará como borrador.'
                    : '✅ Documento aceptado por SUNAT. El PDF es válido como comprobante electrónico.'}
                </div>
                <div style={{marginTop:12,display:'flex',gap:12,justifyContent:'center'}}>
                  <div style={{textAlign:'center',padding:'14px 20px',border:'1px solid #dee2e6',borderRadius:6,cursor:'pointer',minWidth:120}}
                    onClick={()=>window.print()}>
                    <div style={{fontSize:28}}>📄</div>
                    <div style={{fontSize:12,marginTop:4}}>A4 / Carta</div>
                  </div>
                  <div style={{textAlign:'center',padding:'14px 20px',border:'1px solid #dee2e6',borderRadius:6,cursor:'pointer',minWidth:120}}
                    onClick={()=>window.print()}>
                    <div style={{fontSize:28}}>🧾</div>
                    <div style={{fontSize:12,marginTop:4}}>Ticket 80mm</div>
                  </div>
                </div>
              </div>
              <div className="mopc-footer">
                <button className="mopc-btn" style={{background:'#dc3545'}} onClick={()=>window.print()}>
                  🖨 Imprimir PDF
                </button>
                <BtnCerrar/>
              </div>
            </div>
          </div>
        );

        /* ── XML ── */
        if(mOpc.tipo==='xml') {
          const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">
  <ID>${v.serie}</ID>
  <IssueDate>${v.fecha}</IssueDate>
  <InvoiceTypeCode>${v.doc.includes('Factura')?'01':'03'}</InvoiceTypeCode>
  <DocumentCurrencyCode>PEN</DocumentCurrencyCode>
  <AccountingCustomerParty>
    <Party>
      <PartyName>
        <Name>${v.cliente}</Name>
      </PartyName>
    </Party>
  </AccountingCustomerParty>
  <LegalMonetaryTotal>
    <TaxExclusiveAmount currencyID="PEN">84.75</TaxExclusiveAmount>
    <TaxInclusiveAmount currencyID="PEN">100.00</TaxInclusiveAmount>
    <PayableAmount currencyID="PEN">100.00</PayableAmount>
  </LegalMonetaryTotal>
</Invoice>`;
          return (
            <div className="mopc-overlay" onClick={cerrarMOpc}>
              <div className="mopc-box" onClick={e=>e.stopPropagation()} style={{maxWidth:660}}>
                <div className="mopc-head" style={{background:'#6c757d'}}>📦 Exportar XML — {v.serie}</div>
                <div className="mopc-body">
                  <div className="mopc-row"><span className="mopc-label">Documento:</span><span className="mopc-val">{v.serie}</span></div>
                  <div className="mopc-row"><span className="mopc-label">Estado SUNAT:</span>
                    <span className={v.sunat==='OK'?'badge-ok':v.sunat==='ERROR'?'badge-err':'badge-beta'}>{v.sunat}</span>
                  </div>
                  <pre className="xml-pre">{xmlContent}</pre>
                </div>
                <div className="mopc-footer">
                  <button className="mopc-btn" style={{background:'#6c757d'}}
                    onClick={()=>{
                      const blob = new Blob([xmlContent],{type:'application/xml'});
                      const a = document.createElement('a');
                      a.href = URL.createObjectURL(blob);
                      a.download = `${v.serie}.xml`;
                      a.click();
                    }}>
                    ⬇ Descargar XML
                  </button>
                  <BtnCerrar/>
                </div>
              </div>
            </div>
          );
        }

        /* ── LEER TICKET SUNAT ── */
        if(mOpc.tipo==='sunat') return (
          <div className="mopc-overlay" onClick={cerrarMOpc}>
            <div className="mopc-box" onClick={e=>e.stopPropagation()}>
              <div className="mopc-head" style={{background:'#e67e22'}}>📖 Consulta SUNAT — {v.serie}</div>
              <div className="mopc-body">
                <div className="mopc-row"><span className="mopc-label">Documento:</span><span className="mopc-val">{v.serie}</span></div>
                <div className="mopc-row"><span className="mopc-label">Tipo:</span><span className="mopc-val">{v.doc}</span></div>
                <div className="mopc-row"><span className="mopc-label">Fecha emisión:</span><span className="mopc-val">{fmtFecha(v.fecha)}</span></div>
                <div className="mopc-row"><span className="mopc-label">Estado SUNAT:</span>
                  <span className={v.sunat==='OK'?'badge-ok':v.sunat==='ERROR'?'badge-err':'badge-beta'}>{v.sunat}</span>
                </div>
                <div style={{marginTop:14,padding:14,background:'#f8f9fa',border:'1px solid #dee2e6',borderRadius:6}}>
                  <div style={{fontSize:13,fontWeight:'bold',marginBottom:8,color:'#555'}}>Respuesta SUNAT:</div>
                  {v.sunat==='OK' && <div style={{color:'#155724',fontSize:13}}>✅ <b>Aceptado</b> — El comprobante fue recibido y aceptado por SUNAT correctamente.</div>}
                  {v.sunat==='ERROR' && <div style={{color:'#721c24',fontSize:13}}>❌ <b>Rechazado</b> — El comprobante presentó errores. Tiene 24 horas para corregir y reenviar.</div>}
                  {v.sunat==='BETA' && <div style={{color:'#856404',fontSize:13}}>⚠ <b>BETA</b> — Comprobante de prueba. No válido para declarar ante SUNAT.</div>}
                </div>
                <div style={{marginTop:12,textAlign:'center'}}>
                  <a href="https://e-consulta.sunat.gob.pe/ol-ti-itconsvalicpe/ConsValiCpe.htm"
                    target="_blank" rel="noreferrer"
                    style={{color:'#17a2b8',fontSize:13,textDecoration:'underline'}}>
                    🔗 Verificar en portal SUNAT (s/clave SOL)
                  </a>
                </div>
              </div>
              <div className="mopc-footer">
                <button className="mopc-btn" style={{background:'#e67e22'}}
                  onClick={()=>{
                    setVentas(p=>p.map(x=>x.id===v.id?{...x,sunat:'OK',estado:'Emitido'}:x));
                    setAlert('ok:Estado actualizado desde SUNAT.');
                    setTimeout(()=>setAlert(''),3000);
                    cerrarMOpc();
                  }}>
                  🔄 Actualizar Estado
                </button>
                <BtnCerrar/>
              </div>
            </div>
          </div>
        );

        return null;
      })()}
    </>
  );
}