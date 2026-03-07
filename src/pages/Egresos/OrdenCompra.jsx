import React, { useMemo, useRef, useState } from "react";

const styles = `
.content{
background-color:#ffffff;
padding:20px;
color:#212529;
font-family:Arial, Helvetica, sans-serif;
font-size:13px;
}

.t7{
font-size:18px;
font-weight:bold;
border-bottom:2px solid #00A3E1;
padding-bottom:5px;
display:flex;
align-items:center;
gap:10px;
color:#333;
margin-bottom:20px;
}

.t7::before{
content:"";
width:10px;
height:10px;
border-radius:50%;
background-color:#00A3E1;
display:inline-block;
}

.busqueda{
display:grid;
grid-template-columns:1fr auto auto;
gap:12px;
align-items:end;
margin-bottom:12px;
}

.busqueda-grupo{
display:flex;
flex-wrap:wrap;
gap:10px;
align-items:center;
}

.busqueda-grupo b{
margin-right:6px;
}

.busqueda-grupo label{
display:inline-flex;
gap:6px;
align-items:center;
cursor:pointer;
}

.radio{
position:relative;
}

.radio input[type="radio"]{
position:absolute;
opacity:0;
pointer-events:none;
}

.radio span{
display:inline-flex;
align-items:center;
gap:6px;
}

.radio span::before{
content:"";
width:10px;
height:10px;
border-radius:50%;
border:1px solid #6c757d;
background:#6c757d;
visibility:hidden;
}

.radio input[type="radio"]:checked + span::before{
visibility:visible;
}

.fecha-grupo{
display:flex;
flex-direction:column;
gap:4px;
}

.date-wrap{
position:relative;
display:block;
}

.date-wrap input[type="date"]{
padding-right:34px;
}

.date-btn{
position:absolute;
right:6px;
top:50%;
transform:translateY(-50%);
width:24px;
height:24px;
display:flex;
align-items:center;
justify-content:center;
padding:0;
border:0;
background:transparent;
cursor:pointer;
}

.date-btn svg{
display:block;
}

input[type="date"]::-webkit-calendar-picker-indicator{
opacity:0;
}

input[type="text"],input[type="date"],input[type="number"]{
padding:6px 8px;
border:1px solid #ced4da;
border-radius:4px;
font-size:13px;
background-color:#ffffff;
color:#212529;
outline:none;
transition:border-color .2s, box-shadow .2s;
}

input[type="text"]:focus,input[type="date"]:focus,input[type="number"]:focus{
border-color:#80bdff;
box-shadow:0 0 0 .2rem rgba(0,123,255,.25);
}

.botones{
display:flex;
gap:8px;
justify-content:flex-end;
margin-bottom:8px;
}

.botonNuevo{
background-color:#28a745;
border:1px solid #28a745;
color:#ffffff;
padding:6px 14px;
cursor:pointer;
font-size:13px;
font-weight:bold;
border-radius:4px;
display:inline-flex;
align-items:center;
gap:6px;
}

.botonBuscar{
background-color:#00A3E1;
border:1px solid #00A3E1;
color:#ffffff;
padding:6px 14px;
cursor:pointer;
font-size:13px;
font-weight:bold;
border-radius:4px;
display:inline-flex;
align-items:center;
gap:6px;
}

.tabla-titulo{
text-align:center;
font-weight:bold;
margin:10px 0 6px;
}

table{
width:100%;
border-collapse:collapse;
font-size:13px;
}

.headTitle{
background-color:#17a2b8;
color:#ffffff;
}

.headTitle td{
color:#ffffff !important;
font-weight:bold;
padding:10px 8px;
}

table tbody tr{
background-color:#ffffff;
border-bottom:1px solid #dee2e6;
}

table tbody tr:hover{
background-color:#f8f9fa;
}

table tbody td{
padding:8px;
color:#212529;
}

.empty-row td{
text-align:center;
color:#888;
padding:28px 10px;
}

.leyenda{
margin-top:10px;
font-size:12px;
color:#555;
border-top:1px solid #dee2e6;
padding-top:10px;
}

.leyenda-row{
display:flex;
align-items:center;
gap:10px;
flex-wrap:wrap;
}

.leyenda-items{
display:flex;
align-items:center;
gap:16px;
flex-wrap:wrap;
}

.leyenda-item{
display:inline-flex;
align-items:center;
gap:6px;
color:#333;
}

.leyenda-item svg{
display:block;
}

/* Formulario ORDEN DE COMPRA: NUEVO */
.form-nuevo-titulo{
font-size:18px;
font-weight:bold;
border-bottom:2px solid #00A3E1;
padding-bottom:8px;
margin-bottom:16px;
color:#333;
}
.form-nuevo{ overflow:visible; }
.form-nuevo .form-row{
display:flex;
flex-wrap:wrap;
gap:12px 20px;
align-items:flex-end;
margin-bottom:12px;
}
.form-nuevo .form-field{
display:flex;
flex-direction:column;
gap:4px;
min-width:0;
}
.form-nuevo .form-field label{
font-weight:bold;
font-size:12px;
color:#333;
}
.form-nuevo input[type="text"],
.form-nuevo input[type="number"],
.form-nuevo select{
padding:6px 8px;
border:1px solid #ced4da;
border-radius:4px;
font-size:13px;
background:#fff;
color:#212529;
min-width:80px;
}
.form-nuevo select{
cursor:pointer;
height:34px;
min-height:34px;
}
.form-nuevo select option{
color:#212529;
background:#fff;
}
.form-nuevo .num-spin{
height:34px;
padding-right:26px;
}
.form-nuevo .num-spin::-webkit-outer-spin-button,
.form-nuevo .num-spin::-webkit-inner-spin-button{
width:18px;
height:100%;
margin:0;
background:#e9f7ef;
border-left:1px solid #b7dfb7;
border-radius:0 4px 4px 0;
cursor:pointer;
}
.form-nuevo .form-field.condicion-wrap{ overflow:visible; }
.condicion-line{
display:flex;
align-items:center;
gap:8px;
flex-wrap:wrap;
}
.condicion-line .dias-input{
width:70px;
}
.condicion-line .dias-label{
font-size:12px;
color:#333;
}
.form-nuevo .input-required{
background-color:#d4edda !important;
}
.form-nuevo .date-wrap input{ background-color:#d4edda; }
.form-nuevo .checkbox-row{ display:flex; align-items:center; gap:8px; }
.form-nuevo .checkbox-row input[type="checkbox"]{ width:18px; height:18px; }
.busqueda-articulos{
margin-top:20px;
margin-bottom:12px;
}
.busqueda-articulos .titulo{
font-weight:bold;
margin-bottom:8px;
display:flex;
align-items:center;
gap:8px;
}
.busqueda-articulos .filtros{
display:flex;
flex-wrap:wrap;
align-items:center;
gap:10px;
margin-bottom:8px;
}
.busqueda-articulos .filtros label{ display:inline-flex; align-items:center; gap:4px; cursor:pointer; }
.busqueda-articulos .input-buscar{ max-width:280px; }
.busqueda-articulos .btn-buscar-art{
background:#00A3E1;
color:#fff;
border:1px solid #00A3E1;
padding:6px 12px;
border-radius:4px;
cursor:pointer;
font-size:13px;
display:inline-flex;
align-items:center;
gap:6px;
}
.tabla-articulos{ margin-top:12px; margin-bottom:16px; }
.tabla-articulos .headTitle td{ padding:8px 6px; font-size:12px; }
.form-nuevo .botones-form{
display:flex;
gap:10px;
margin-top:16px;
}
.form-nuevo .botones-form .btn-guardar{ background:#00A3E1; color:#fff; border:1px solid #00A3E1; padding:8px 16px; border-radius:4px; cursor:pointer; font-weight:bold; display:inline-flex; align-items:center; gap:6px; }
.form-nuevo .botones-form .btn-regresar{ background:#6c757d; color:#fff; border:1px solid #6c757d; padding:8px 16px; border-radius:4px; cursor:pointer; font-weight:bold; display:inline-flex; align-items:center; gap:6px; }

/* Proveedor dropdown */
.proveedor-wrap{
position:relative;
}
.proveedor-list{
position:absolute;
top:100%;
left:0;
right:0;
margin-top:2px;
border:1px solid #ced4da;
border-radius:4px;
background:#fff;
box-shadow:0 4px 12px rgba(0,0,0,0.2);
z-index:9999;
list-style:none;
padding:0;
margin-left:0;
}
.proveedor-list li{
padding:8px 12px;
cursor:pointer;
font-size:13px;
border-bottom:1px solid #f0f0f0;
}
.proveedor-list li:last-child{ border-bottom:none; }
.proveedor-list li:hover{ background:#e9ecef; }
.proveedor-list li.selected{ background:#00A3E1; color:#fff; }

/* Toast */
.toast{
position:fixed;
bottom:24px;
right:24px;
background:#28a745;
color:#fff;
padding:12px 20px;
border-radius:6px;
font-size:14px;
font-weight:bold;
box-shadow:0 4px 12px rgba(0,0,0,0.2);
z-index:99999;
animation:fadeInOut 3s forwards;
}
@keyframes fadeInOut{
0%{opacity:0;transform:translateY(10px)}
10%{opacity:1;transform:translateY(0)}
80%{opacity:1}
100%{opacity:0}
}

/* Accion iconos */
.accion-btns{ display:flex; gap:6px; justify-content:center; align-items:center; }
.accion-btns button{ background:none; border:none; cursor:pointer; padding:2px; display:inline-flex; align-items:center; }

/* Error */
.error-field input,.error-field select{ border-color:#dc3545 !important; }
.error-msg{ color:#dc3545; font-size:11px; margin-top:2px; }

/* Estado badge */
.badge-confirmado{ display:inline-block; background:#28a745; color:#fff; font-size:10px; font-weight:bold; padding:2px 7px; border-radius:10px; margin-left:6px; vertical-align:middle; }
.badge-pendiente{ display:inline-block; background:#ffc107; color:#333; font-size:10px; font-weight:bold; padding:2px 7px; border-radius:10px; margin-left:6px; vertical-align:middle; }

/* Modal overlay */
.modal-overlay{
position:fixed; top:0; left:0; right:0; bottom:0;
background:rgba(0,0,0,0.5);
z-index:99998;
display:flex; align-items:center; justify-content:center;
}
.modal-box{
background:#fff;
border-radius:8px;
padding:24px;
min-width:320px;
max-width:420px;
width:90%;
box-shadow:0 8px 32px rgba(0,0,0,0.25);
}
.modal-titulo{
font-size:16px;
font-weight:bold;
color:#333;
border-bottom:2px solid #00A3E1;
padding-bottom:8px;
margin-bottom:16px;
}
.modal-body{ font-size:13px; color:#555; margin-bottom:20px; line-height:1.6; }
.modal-body b{ color:#212529; }
.modal-btns{ display:flex; gap:10px; justify-content:flex-end; }
.modal-btns .btn-confirmar{ background:#28a745; color:#fff; border:1px solid #28a745; padding:7px 16px; border-radius:4px; cursor:pointer; font-weight:bold; font-size:13px; }
.modal-btns .btn-cancelar{ background:#6c757d; color:#fff; border:1px solid #6c757d; padding:7px 16px; border-radius:4px; cursor:pointer; font-weight:bold; font-size:13px; }
.modal-btns .btn-danger{ background:#dc3545; color:#fff; border:1px solid #dc3545; padding:7px 16px; border-radius:4px; cursor:pointer; font-weight:bold; font-size:13px; }

/* PDF modal */
.pdf-modal-overlay{
position:fixed; top:0; left:0; right:0; bottom:0;
background:rgba(0,0,0,0.65);
z-index:99999;
display:flex; align-items:flex-start; justify-content:center;
padding-top:30px;
overflow-y:auto;
}
.pdf-modal-box{
background:#fff;
width:700px;
max-width:95%;
border-radius:6px;
overflow:hidden;
box-shadow:0 8px 32px rgba(0,0,0,0.35);
margin-bottom:30px;
}
.pdf-toolbar{
background:#333;
color:#fff;
padding:10px 16px;
display:flex;
align-items:center;
justify-content:space-between;
font-size:13px;
font-weight:bold;
}
.pdf-toolbar button{
background:#dc3545;
color:#fff;
border:none;
padding:5px 12px;
border-radius:4px;
cursor:pointer;
font-size:13px;
font-weight:bold;
}
.pdf-content{
padding:32px 40px;
font-family:Arial,Helvetica,sans-serif;
font-size:12px;
color:#212529;
}
.pdf-header{ display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; }
.pdf-empresa{ font-size:16px; font-weight:bold; color:#17a2b8; }
.pdf-subtitulo{ font-size:11px; color:#777; }
.pdf-doc-info{ text-align:right; }
.pdf-doc-info .doc-nro{ font-size:20px; font-weight:bold; color:#333; }
.pdf-doc-info .doc-estado{ font-size:11px; color:#28a745; font-weight:bold; }
.pdf-divider{ border:none; border-top:2px solid #17a2b8; margin:12px 0; }
.pdf-info-grid{ display:grid; grid-template-columns:1fr 1fr; gap:8px 20px; margin-bottom:16px; }
.pdf-info-item label{ font-weight:bold; color:#555; font-size:11px; display:block; }
.pdf-info-item span{ color:#212529; font-size:12px; }
.pdf-table{ width:100%; border-collapse:collapse; margin-top:12px; }
.pdf-table th{ background:#17a2b8; color:#fff; padding:7px 8px; text-align:left; font-size:11px; }
.pdf-table td{ padding:6px 8px; border-bottom:1px solid #dee2e6; font-size:11px; }
.pdf-table .total-row td{ font-weight:bold; background:#f8f9fa; }
.pdf-footer{ margin-top:24px; font-size:10px; color:#aaa; text-align:center; border-top:1px solid #dee2e6; padding-top:10px; }
.pdf-firmas{ display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:24px; }
.pdf-firma{ border-top:1px solid #333; padding-top:6px; text-align:center; font-size:11px; color:#555; }
`;

const PROVEEDORES = [
  "Compudiskett S R L",
  "Exportadora Importadora Igarashi Ascencio S.r.ltda",
  "Grupo Deltron S.A.",
  "Maxima Internacional S.A.",
  "Soy Proveedor SA",
];

const IconEdit = ({ size = 16, color = "#000" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <rect x="2.5" y="2.5" width="19" height="19" rx="2" fill="none" stroke={color} strokeWidth="1.5" />
    <path d="M8 16l1.2-4.1L16.8 4.3a1.2 1.2 0 0 1 1.7 0l1.2 1.2a1.2 1.2 0 0 1 0 1.7l-7.6 7.6L8 16z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M14.7 6.4l2.9 2.9" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconPdf = ({ size = 16, color = "#d10000" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 2.75h7.5L20.25 8.5V21.25A1.75 1.75 0 0 1 18.5 23H7A1.75 1.75 0 0 1 5.25 21.25V4.5A1.75 1.75 0 0 1 7 2.75z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M14.5 2.75V8.5h5.75" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    <text x="7.4" y="17" fontSize="7.5" fontFamily="Arial, Helvetica, sans-serif" fill={color}>pdf</text>
  </svg>
);

const IconThumb = ({ size = 16, color = "#0a8a0a" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M10.5 10.2V6.3c0-1.7 1.3-3.3 3-3.8l.2-.1c.6-.2 1.2.2 1.3.8l.4 2.8c.1.6.1 1.1-.1 1.7l-.5 1.5h4.5c1.6 0 2.8 1.4 2.6 3l-.8 6.2c-.2 1.3-1.3 2.3-2.6 2.3H11c-.9 0-1.7-.4-2.2-1.1l-2.4-3.3V10.2h4.1z" fill={color} opacity="0.95" />
    <path d="M2.5 10.2h3.2V22H2.5z" fill={color} opacity="0.95" />
  </svg>
);

const IconReturn = ({ size = 16, color = "#8b1a1a" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.5 6.5h-8.8a5.7 5.7 0 0 0-5.7 5.7v.9" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M8.2 11.2L5 13.9l3.2 2.7" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="16.5" y="13.5" width="4" height="7.5" rx="1" fill="none" stroke={color} strokeWidth="1.8" />
  </svg>
);

const IconSearchCircle = ({ size = 16, color = "#ffffff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="11" cy="11" r="7" fill="none" stroke={color} strokeWidth="1.8" />
    <path d="M14.8 14.8L19 19" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="11" cy="11" r="3.2" fill="none" stroke={color} strokeWidth="1.6" />
  </svg>
);

const IconPlus = ({ size = 16, color = "#ffffff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 4v16M4 12h16" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconCalendar = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="4.5" width="18" height="17" rx="2" fill="#ffffff" stroke="#6c757d" strokeWidth="1.2" />
    <rect x="3" y="4.5" width="18" height="5" rx="2" fill="#1aa38a" />
    <rect x="6" y="2.5" width="2.2" height="4.2" rx="1" fill="#6c757d" />
    <rect x="15.8" y="2.5" width="2.2" height="4.2" rx="1" fill="#6c757d" />
    <rect x="6" y="11" width="3" height="3" fill="#d9534f" />
    <rect x="10.5" y="11" width="3" height="3" fill="#dee2e6" />
    <rect x="15" y="11" width="3" height="3" fill="#dee2e6" />
    <rect x="6" y="15.2" width="3" height="3" fill="#dee2e6" />
    <rect x="10.5" y="15.2" width="3" height="3" fill="#dee2e6" />
    <rect x="15" y="15.2" width="3" height="3" fill="#dee2e6" />
  </svg>
);

const IconFloppy = ({ size = 16, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4zm-5 16a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm5-10H7V7h10v2z" fill={color} />
  </svg>
);

const IconArrowLeft = ({ size = 16, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill={color} />
  </svg>
);

const IconTrash = ({ size = 15, color = "#dc3545" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const formatDateDisplay = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

const IconCheckCircle = ({ size = 16, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeWidth="1.8"/>
    <path d="M7.5 12l3 3 6-6" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconPrint = ({ size = 16, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 9V4h12v5" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    <rect x="3" y="9" width="18" height="9" rx="2" fill="none" stroke={color} strokeWidth="1.8"/>
    <path d="M6 18v2h12v-2" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="18" cy="13.5" r="1" fill={color}/>
  </svg>
);

const OrdenCompra = () => {
  const [showFormNuevo, setShowFormNuevo] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [modalConfirm, setModalConfirm] = useState(null);
  const [modalEliminar, setModalEliminar] = useState(null);
  const [modalPdf, setModalPdf] = useState(null);

  // Lista
  const [tipoBusqueda, setTipoBusqueda] = useState("nrodoc");
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const fechaInicioRef = useRef(null);
  const fechaFinRef = useRef(null);

  const [registros, setRegistros] = useState([]);

  // Formulario
  const hoy = "2026-03-06";
  const [nroOrden, setNroOrden] = useState("1");
  const [fecha, setFecha] = useState(hoy);
  const [fechaEnt, setFechaEnt] = useState(hoy);
  const [moneda, setMoneda] = useState("Soles");
  const [cambio, setCambio] = useState("3.830");
  const [incluidoIgv, setIncluidoIgv] = useState(false);
  const [garantia, setGarantia] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [showProveedorList, setShowProveedorList] = useState(false);
  const [proveedorFiltro, setProveedorFiltro] = useState("");
  const [direccionEntrega, setDireccionEntrega] = useState("Av. Inca Garcilaso De La Vega 134");
  const [condicionCompra, setCondicionCompra] = useState("Contado");
  const [diasCredito, setDiasCredito] = useState("");
  const [textoBusquedaArt, setTextoBusquedaArt] = useState("");
  const [tipoBusquedaArt, setTipoBusquedaArt] = useState("nombre");
  const [errores, setErrores] = useState({});

  const fechaNuevoRef = useRef(null);
  const fechaEntNuevoRef = useRef(null);
  const proveedorRef = useRef(null);

  const openPicker = (ref) => {
    const el = ref?.current;
    if (!el) return;
    if (typeof el.showPicker === "function") el.showPicker();
    el.focus();
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const resetForm = () => {
    const siguiente = registros.length + 1;
    setNroOrden(String(siguiente));
    setFecha(hoy);
    setFechaEnt(hoy);
    setMoneda("Soles");
    setCambio("3.830");
    setIncluidoIgv(false);
    setGarantia("");
    setProveedor("");
    setProveedorFiltro("");
    setDireccionEntrega("Av. Inca Garcilaso De La Vega 134");
    setCondicionCompra("Contado");
    setDiasCredito("");
    setTextoBusquedaArt("");
    setTipoBusquedaArt("nombre");
    setErrores({});
    setEditingId(null);
  };

  const handleAbrirNuevo = () => {
    resetForm();
    setShowFormNuevo(true);
  };

  const handleEditar = (r) => {
    setNroOrden(r.nro);
    setFecha(r.fecha);
    setFechaEnt(r.fechaEntrega);
    setMoneda(r.moneda);
    setCambio(r.cambio);
    setIncluidoIgv(r.incluidoIgv);
    setGarantia(r.garantia);
    setProveedor(r.proveedor);
    setProveedorFiltro(r.proveedor);
    setDireccionEntrega(r.direccionEntrega);
    setCondicionCompra(r.condicionCompra);
    setDiasCredito(r.diasCredito || "");
    setErrores({});
    setEditingId(r.id);
    setShowFormNuevo(true);
  };

  const handleEliminar = (id) => {
    setRegistros(prev => prev.filter(r => r.id !== id));
    setModalEliminar(null);
    showToast("Registro eliminado.");
  };

  const handleConfirmarCompra = (r) => {
    setModalConfirm(r);
  };

  const confirmarCompra = () => {
    setRegistros(prev => prev.map(r =>
      r.id === modalConfirm.id ? { ...r, confirmado: true } : r
    ));
    setModalConfirm(null);
    showToast("¡Compra confirmada correctamente!");
  };

  const handleVolverComprar = (r) => {
    setNroOrden(String(registros.length + 1));
    setFecha(hoy);
    setFechaEnt(hoy);
    setMoneda(r.moneda);
    setCambio(r.cambio);
    setIncluidoIgv(r.incluidoIgv);
    setGarantia(r.garantia);
    setProveedor(r.proveedor);
    setProveedorFiltro(r.proveedor);
    setDireccionEntrega(r.direccionEntrega);
    setCondicionCompra(r.condicionCompra);
    setDiasCredito(r.diasCredito || "");
    setErrores({});
    setEditingId(null);
    setShowFormNuevo(true);
    showToast("Datos copiados. Complete y guarde la nueva orden.");
  };

  const validar = () => {
    const e = {};
    if (!nroOrden) e.nroOrden = "Requerido";
    if (!fecha) e.fecha = "Requerido";
    if (!fechaEnt) e.fechaEnt = "Requerido";
    if (!proveedor) e.proveedor = "Seleccione un proveedor";
    if (!direccionEntrega) e.direccionEntrega = "Requerido";
    if (condicionCompra === "Crédito" && !diasCredito) e.diasCredito = "Requerido";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleGuardar = () => {
    if (!validar()) return;

    if (editingId !== null) {
      setRegistros(prev => prev.map(r =>
        r.id === editingId
          ? { ...r, nro: nroOrden, fecha, fechaEntrega: fechaEnt, moneda, cambio, incluidoIgv, garantia, proveedor, direccionEntrega, condicionCompra, diasCredito }
          : r
      ));
      showToast("Orden actualizada correctamente.");
    } else {
      const nuevo = {
        id: Date.now(),
        nro: nroOrden,
        fecha,
        fechaEntrega: fechaEnt,
        moneda,
        cambio,
        incluidoIgv,
        garantia,
        proveedor,
        direccionEntrega,
        condicionCompra,
        diasCredito,
        ruc: "",
      };
      setRegistros(prev => [...prev, nuevo]);
      showToast("Orden guardada correctamente.");
    }

    setShowFormNuevo(false);
    resetForm();
  };

  const proveedoresFiltrados = PROVEEDORES.filter(p =>
    p.toLowerCase().includes(proveedorFiltro.toLowerCase())
  );

  const registrosFiltrados = useMemo(() => {
    if (!textoBusqueda && !fechaInicio && !fechaFin) return registros;
    return registros.filter(r => {
      const matchTexto = textoBusqueda
        ? (() => {
            const t = textoBusqueda.toLowerCase();
            if (tipoBusqueda === "nrodoc") return `${r.nro ?? ""}`.toLowerCase().includes(t);
            if (tipoBusqueda === "proveedor") return `${r.proveedor ?? ""}`.toLowerCase().includes(t);
            if (tipoBusqueda === "ruc") return `${r.ruc ?? ""}`.toLowerCase().includes(t);
            return true;
          })()
        : true;
      const matchInicio = fechaInicio ? r.fecha >= fechaInicio : true;
      const matchFin = fechaFin ? r.fecha <= fechaFin : true;
      return matchTexto && matchInicio && matchFin;
    });
  }, [registros, textoBusqueda, tipoBusqueda, fechaInicio, fechaFin]);

  const handleBuscar = (e) => { e.preventDefault(); };

  return (
    <>
      <style>{styles}</style>
      {toast && <div className="toast">{toast}</div>}

      <div className="content">
        {showFormNuevo ? (
          <div className="form-nuevo">
            <div className="form-nuevo-titulo">ORDEN DE COMPRA: {editingId ? "EDITAR" : "NUEVO"}</div>

            <div className="form-row">
              <div className={`form-field${errores.nroOrden ? " error-field" : ""}`}>
                <label>Nro orden (*)</label>
                <input type="number" className="input-required num-spin" value={nroOrden} onChange={(e) => setNroOrden(e.target.value)} />
                {errores.nroOrden && <span className="error-msg">{errores.nroOrden}</span>}
              </div>
              <div className={`form-field${errores.fecha ? " error-field" : ""}`}>
                <label>Fecha (*)</label>
                <div className="date-wrap">
                  <input ref={fechaNuevoRef} type="date" className="input-required" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                  <button type="button" className="date-btn" onClick={() => openPicker(fechaNuevoRef)}><IconCalendar /></button>
                </div>
                {errores.fecha && <span className="error-msg">{errores.fecha}</span>}
              </div>
              <div className={`form-field${errores.fechaEnt ? " error-field" : ""}`}>
                <label>Fecha Ent(*)</label>
                <div className="date-wrap">
                  <input ref={fechaEntNuevoRef} type="date" className="input-required" value={fechaEnt} onChange={(e) => setFechaEnt(e.target.value)} />
                  <button type="button" className="date-btn" onClick={() => openPicker(fechaEntNuevoRef)}><IconCalendar /></button>
                </div>
                {errores.fechaEnt && <span className="error-msg">{errores.fechaEnt}</span>}
              </div>
              <div className="form-field">
                <label>Moneda(*)</label>
                <select value={moneda} onChange={(e) => setMoneda(e.target.value)}>
                  <option>Soles</option>
                  <option>Dólares</option>
                </select>
              </div>
              <div className="form-field">
                <label>Cambio : (*)</label>
                <input type="text" value={cambio} onChange={(e) => setCambio(e.target.value)} />
              </div>
              <div className="form-field checkbox-row">
                <label><input type="checkbox" checked={incluidoIgv} onChange={(e) => setIncluidoIgv(e.target.checked)} /> Incluido IGV</label>
              </div>
              <div className="form-field">
                <label>Garantia (*)</label>
                <input type="text" value={garantia} onChange={(e) => setGarantia(e.target.value)} placeholder="Meses" />
              </div>
            </div>

            <div className="form-row">
              <div className={`form-field proveedor-wrap${errores.proveedor ? " error-field" : ""}`} style={{ minWidth: "200px" }} ref={proveedorRef}>
                <label>PROVEEDOR (*)..+</label>
                <input
                  type="text"
                  className="input-required"
                  value={proveedorFiltro}
                  placeholder="Seleccionar..."
                  onChange={(e) => {
                    setProveedorFiltro(e.target.value);
                    setProveedor("");
                    setShowProveedorList(true);
                  }}
                  onFocus={() => setShowProveedorList(true)}
                  onBlur={() => setTimeout(() => setShowProveedorList(false), 200)}
                />
                {errores.proveedor && <span className="error-msg">{errores.proveedor}</span>}
                {showProveedorList && proveedoresFiltrados.length > 0 && (
                  <ul className="proveedor-list">
                    {proveedoresFiltrados.map(p => (
                      <li
                        key={p}
                        className={proveedor === p ? "selected" : ""}
                        onMouseDown={() => {
                          setProveedor(p);
                          setProveedorFiltro(p);
                          setShowProveedorList(false);
                          setErrores(e => ({ ...e, proveedor: undefined }));
                        }}
                      >
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className={`form-field${errores.direccionEntrega ? " error-field" : ""}`} style={{ flex: 1, minWidth: "200px" }}>
                <label>Direccion de entrega(*)</label>
                <input type="text" className="input-required" value={direccionEntrega} onChange={(e) => setDireccionEntrega(e.target.value)} />
                {errores.direccionEntrega && <span className="error-msg">{errores.direccionEntrega}</span>}
              </div>
              <div className="form-field condicion-wrap">
                <label>Condicion de Compra :</label>
                <div className="condicion-line">
                  <select value={condicionCompra} onChange={(e) => setCondicionCompra(e.target.value)}>
                    <option value="Contado">Contado</option>
                    <option value="Crédito">Crédito</option>
                  </select>
                  {condicionCompra === "Crédito" && (
                    <>
                      <input
                        type="text"
                        className={`dias-input${errores.diasCredito ? " error-field" : ""}`}
                        value={diasCredito}
                        onChange={(e) => setDiasCredito(e.target.value)}
                        placeholder="0"
                      />
                      <span className="dias-label">Dias</span>
                    </>
                  )}
                </div>
                {errores.diasCredito && <span className="error-msg">{errores.diasCredito}</span>}
              </div>
            </div>

            <div className="busqueda-articulos">
              <div className="titulo">BUSQUEDA DE ARTICULOS <span style={{ cursor: "pointer" }}>✕</span></div>
              <div className="filtros">
                <label className="radio"><input type="radio" name="tipoArt" checked={tipoBusquedaArt === "nombre"} onChange={() => setTipoBusquedaArt("nombre")} /><span>Nombre</span></label>
                <label className="radio"><input type="radio" name="tipoArt" checked={tipoBusquedaArt === "marca"} onChange={() => setTipoBusquedaArt("marca")} /><span>Marca</span></label>
                <label className="radio"><input type="radio" name="tipoArt" checked={tipoBusquedaArt === "categoria"} onChange={() => setTipoBusquedaArt("categoria")} /><span>Categoria</span></label>
                <label className="radio"><input type="radio" name="tipoArt" checked={tipoBusquedaArt === "codigo"} onChange={() => setTipoBusquedaArt("codigo")} /><span>Codigo</span></label>
                <input type="text" className="input-buscar" placeholder="Buscar..." value={textoBusquedaArt} onChange={(e) => setTextoBusquedaArt(e.target.value)} />
                <button type="button" className="btn-buscar-art"><IconSearchCircle size={14} color="#fff" /> BUSCAR</button>
                <span style={{ cursor: "pointer", fontSize: "18px" }} title="Actualizar">↻</span>
              </div>
            </div>

            <table className="tabla-articulos">
              <thead>
                <tr className="headTitle">
                  <td>CODIGO</td>
                  <td>ARTICULOS</td>
                  <td>STOCK</td>
                  <td>P.COMPRA</td>
                  <td>COMENTARIO</td>
                  <td>CANT.</td>
                  <td>AGRE.</td>
                  <td>T.A.IGV</td>
                </tr>
              </thead>
              <tbody>
                <tr className="empty-row"><td colSpan="8">No hay artículos agregados.</td></tr>
              </tbody>
            </table>

            <div className="botones-form">
              <button type="button" className="btn-guardar" onClick={handleGuardar}><IconFloppy /> Guardar</button>
              <button type="button" className="btn-regresar" onClick={() => { setShowFormNuevo(false); resetForm(); }}><IconArrowLeft /> Regresar</button>
            </div>
          </div>
        ) : (
          <>
            <div className="t7">ORDEN DE COMPRA / detallado</div>

            <form onSubmit={handleBuscar}>
              <div className="busqueda">
                <div className="busqueda-grupo">
                  <b>BUSCAR X</b>
                  {["nrodoc", "proveedor", "ruc"].map(v => (
                    <label key={v} className="radio">
                      <input type="radio" name="tipo" value={v} checked={tipoBusqueda === v} onChange={() => setTipoBusqueda(v)} />
                      <span>{v === "nrodoc" ? "Nro doc" : v.charAt(0).toUpperCase() + v.slice(1)}</span>
                    </label>
                  ))}
                  <input type="text" placeholder="Ingrese el texto a buscar" value={textoBusqueda} onChange={(e) => setTextoBusqueda(e.target.value)} />
                </div>

                <div className="fecha-grupo">
                  <b>Fecha Inicio</b>
                  <div className="date-wrap">
                    <input ref={fechaInicioRef} type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
                    <button className="date-btn" type="button" onClick={() => openPicker(fechaInicioRef)}><IconCalendar /></button>
                  </div>
                </div>

                <div className="fecha-grupo">
                  <b>Fecha Fin</b>
                  <div className="date-wrap">
                    <input ref={fechaFinRef} type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
                    <button className="date-btn" type="button" onClick={() => openPicker(fechaFinRef)}><IconCalendar /></button>
                  </div>
                </div>
              </div>

              <div className="botones">
                <button className="botonBuscar" type="submit"><IconSearchCircle /> BUSCAR</button>
                <button className="botonNuevo" type="button" onClick={handleAbrirNuevo}><IconPlus /> Agregar Nuevo</button>
              </div>
            </form>

            <div className="tabla-titulo">LISTADO GENERAL</div>

            <table>
              <thead>
                <tr height="40px" className="headTitle">
                  <td width="12%" align="center">FECHA</td>
                  <td width="12%">NRO DOC</td>
                  <td width="12%">FECHA ENT.</td>
                  <td>PROVEEDOR</td>
                  <td width="14%" align="center">ACCION</td>
                </tr>
              </thead>
              <tbody>
                {registrosFiltrados.length === 0 ? (
                  <tr className="empty-row"><td colSpan="5">No hay registros para mostrar.</td></tr>
                ) : (
                  registrosFiltrados.map((r) => (
                    <tr key={r.id}>
                      <td align="center">{formatDateDisplay(r.fecha)}</td>
                      <td>{r.nro}</td>
                      <td align="center">{formatDateDisplay(r.fechaEntrega)}</td>
                      <td>{r.proveedor} {r.confirmado && <span className="badge-confirmado">CONFIRMADO</span>}</td>
                      <td align="center">
                        <div className="accion-btns">
                          <button title="Editar" onClick={() => handleEditar(r)}><IconEdit size={15} color="#333" /></button>
                          <button title="Exportar PDF" onClick={() => setModalPdf(r)}><IconPdf size={15} /></button>
                          <button title="Confirmar compra" onClick={() => handleConfirmarCompra(r)} style={{ opacity: r.confirmado ? 0.4 : 1 }}><IconThumb size={15} /></button>
                          <button title="Volver comprar" onClick={() => handleVolverComprar(r)}><IconReturn size={15} /></button>
                          <button title="Eliminar" onClick={() => setModalEliminar(r.id)}><IconTrash size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="leyenda">
              <div className="leyenda-row">
                <b>Leyenda de OPCIONES:</b>
                <div className="leyenda-items">
                  <span className="leyenda-item"><IconEdit /> Actualizar, Eliminar</span>
                  <span className="leyenda-item"><IconPdf /> Exportar a pdf</span>
                  <span className="leyenda-item"><IconThumb /> Confirme compra</span>
                  <span className="leyenda-item"><IconReturn /> Volver comprar</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal Eliminar */}
      {modalEliminar && (
        <div className="modal-overlay" onClick={() => setModalEliminar(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-titulo">⚠️ Confirmar eliminación</div>
            <div className="modal-body">¿Está seguro de que desea <b>eliminar</b> esta orden de compra? Esta acción no se puede deshacer.</div>
            <div className="modal-btns">
              <button className="btn-cancelar" onClick={() => setModalEliminar(null)}>Cancelar</button>
              <button className="btn-danger" onClick={() => handleEliminar(modalEliminar)}>Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Compra */}
      {modalConfirm && (
        <div className="modal-overlay" onClick={() => setModalConfirm(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-titulo">✅ Confirmar compra</div>
            <div className="modal-body">
              ¿Confirmar la orden <b>Nro {modalConfirm.nro}</b> del proveedor <b>{modalConfirm.proveedor}</b>?<br/>
              Una vez confirmada, quedará marcada como <b>CONFIRMADO</b>.
            </div>
            <div className="modal-btns">
              <button className="btn-cancelar" onClick={() => setModalConfirm(null)}>Cancelar</button>
              <button className="btn-confirmar" onClick={confirmarCompra}>Sí, confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal PDF */}
      {modalPdf && (
        <div className="pdf-modal-overlay" onClick={() => setModalPdf(null)}>
          <div className="pdf-modal-box" onClick={e => e.stopPropagation()}>
            <div className="pdf-toolbar">
              <span>📄 ORDEN DE COMPRA — Vista previa</span>
              <button onClick={() => { window.print(); }}>🖨️ Imprimir</button>
            </div>
            <div className="pdf-content">
              <div className="pdf-header">
                <div>
                  <div className="pdf-empresa">MI EMPRESA S.A.C.</div>
                  <div className="pdf-subtitulo">RUC: 20123456789</div>
                  <div className="pdf-subtitulo">{modalPdf.direccionEntrega}</div>
                </div>
                <div className="pdf-doc-info">
                  <div style={{fontSize:"11px",color:"#777",marginBottom:"2px"}}>ORDEN DE COMPRA</div>
                  <div className="doc-nro">N° {String(modalPdf.nro).padStart(6,"0")}</div>
                  <div className="doc-estado">{modalPdf.confirmado ? "✔ CONFIRMADO" : "● PENDIENTE"}</div>
                </div>
              </div>
              <hr className="pdf-divider"/>
              <div className="pdf-info-grid">
                <div className="pdf-info-item"><label>PROVEEDOR</label><span>{modalPdf.proveedor}</span></div>
                <div className="pdf-info-item"><label>FECHA</label><span>{formatDateDisplay(modalPdf.fecha)}</span></div>
                <div className="pdf-info-item"><label>DIRECCIÓN DE ENTREGA</label><span>{modalPdf.direccionEntrega}</span></div>
                <div className="pdf-info-item"><label>FECHA DE ENTREGA</label><span>{formatDateDisplay(modalPdf.fechaEntrega)}</span></div>
                <div className="pdf-info-item"><label>MONEDA</label><span>{modalPdf.moneda} {modalPdf.moneda === "Dólares" ? `(T.C. ${modalPdf.cambio})` : ""}</span></div>
                <div className="pdf-info-item"><label>CONDICIÓN</label><span>{modalPdf.condicionCompra}{modalPdf.diasCredito ? ` — ${modalPdf.diasCredito} días` : ""}</span></div>
                {modalPdf.garantia && <div className="pdf-info-item"><label>GARANTÍA</label><span>{modalPdf.garantia} meses</span></div>}
                <div className="pdf-info-item"><label>INCLUIDO IGV</label><span>{modalPdf.incluidoIgv ? "Sí" : "No"}</span></div>
              </div>
              <hr className="pdf-divider"/>
              <table className="pdf-table">
                <thead>
                  <tr>
                    <th>#</th><th>CÓDIGO</th><th>ARTÍCULO</th><th>CANT.</th><th>P.UNIT.</th><th>TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>1</td><td>—</td><td style={{color:"#888",fontStyle:"italic"}}>Sin artículos registrados</td><td>—</td><td>—</td><td>—</td></tr>
                  <tr className="total-row"><td colSpan="5" style={{textAlign:"right"}}>TOTAL:</td><td>S/ 0.00</td></tr>
                </tbody>
              </table>
              <div className="pdf-firmas">
                <div className="pdf-firma">SOLICITADO POR</div>
                <div className="pdf-firma">APROBADO POR</div>
              </div>
              <div className="pdf-footer">Documento generado el {formatDateDisplay(modalPdf.fecha)} — Sistema de Órdenes de Compra</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrdenCompra;