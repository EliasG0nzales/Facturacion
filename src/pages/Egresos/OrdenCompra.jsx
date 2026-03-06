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
visibility:hidden; /* solo se muestra cuando está seleccionado */
}

.radio input[type="radio"]:checked + span::before{
visibility:visible;
}

.fecha-grupo{
display:flex;
flex-direction:column;
gap:4px;
}

/* Date input con ícono a la derecha (como la referencia) */
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

/* Oculta el icono nativo (Chrome/Edge) para no duplicar */
input[type="date"]::-webkit-calendar-picker-indicator{
opacity:0;
}

input[type="text"],input[type="date"]{
padding:6px 8px;
border:1px solid #ced4da;
border-radius:4px;
font-size:13px;
background-color:#ffffff;
color:#212529;
outline:none;
transition:border-color .2s, box-shadow .2s;
}

input[type="text"]:focus,input[type="date"]:focus{
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
`;

const IconEdit = ({ size = 16, color = "#000" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <rect x="2.5" y="2.5" width="19" height="19" rx="2" fill="none" stroke={color} strokeWidth="1.5" />
    <path
      d="M8 16l1.2-4.1L16.8 4.3a1.2 1.2 0 0 1 1.7 0l1.2 1.2a1.2 1.2 0 0 1 0 1.7l-7.6 7.6L8 16z"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M14.7 6.4l2.9 2.9" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconPdf = ({ size = 16, color = "#d10000" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M7 2.75h7.5L20.25 8.5V21.25A1.75 1.75 0 0 1 18.5 23H7A1.75 1.75 0 0 1 5.25 21.25V4.5A1.75 1.75 0 0 1 7 2.75z"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M14.5 2.75V8.5h5.75" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    <text x="7.4" y="17" fontSize="7.5" fontFamily="Arial, Helvetica, sans-serif" fill={color}>
      pdf
    </text>
  </svg>
);

const IconThumb = ({ size = 16, color = "#0a8a0a" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M10.5 10.2V6.3c0-1.7 1.3-3.3 3-3.8l.2-.1c.6-.2 1.2.2 1.3.8l.4 2.8c.1.6.1 1.1-.1 1.7l-.5 1.5h4.5c1.6 0 2.8 1.4 2.6 3l-.8 6.2c-.2 1.3-1.3 2.3-2.6 2.3H11c-.9 0-1.7-.4-2.2-1.1l-2.4-3.3V10.2h4.1z"
      fill={color}
      opacity="0.95"
    />
    <path d="M2.5 10.2h3.2V22H2.5z" fill={color} opacity="0.95" />
  </svg>
);

const IconReturn = ({ size = 16, color = "#8b1a1a" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M20.5 6.5h-8.8a5.7 5.7 0 0 0-5.7 5.7v.9"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M8.2 11.2L5 13.9l3.2 2.7"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="16.5" y="13.5" width="4" height="7.5" rx="1" fill="none" stroke={color} strokeWidth="1.8" />
  </svg>
);

const IconSearchCircle = ({ size = 16, color = "#ffffff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="11" cy="11" r="7" fill="none" stroke={color} strokeWidth="1.8" />
    <path
      d="M14.8 14.8L19 19"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle cx="11" cy="11" r="3.2" fill="none" stroke={color} strokeWidth="1.6" />
  </svg>
);

const IconPlus = ({ size = 16, color = "#ffffff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 4v16M4 12h16"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
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

const OrdenCompra = () => {

const [tipoBusqueda,setTipoBusqueda] = useState("nrodoc");
const [textoBusqueda,setTextoBusqueda] = useState("");
const [fechaInicio,setFechaInicio] = useState("");
const [fechaFin,setFechaFin] = useState("");

const fechaInicioRef = useRef(null);
const fechaFinRef = useRef(null);

const [registros] = useState([]);

const registrosFiltrados = useMemo(()=>{

if(!textoBusqueda && !fechaInicio && !fechaFin) return registros;

return registros.filter(r=>{

const matchTexto = textoBusqueda
?(()=>{
const t = textoBusqueda.toLowerCase();

if(tipoBusqueda === "nrodoc")
return `${r.nro ?? ""}`.toLowerCase().includes(t);

if(tipoBusqueda === "proveedor")
return `${r.proveedor ?? ""}`.toLowerCase().includes(t);

if(tipoBusqueda === "ruc")
return `${r.ruc ?? ""}`.toLowerCase().includes(t);

return true;

})()
:true;

const matchInicio = fechaInicio ? r.fecha >= fechaInicio : true;
const matchFin = fechaFin ? r.fecha <= fechaFin : true;

return matchTexto && matchInicio && matchFin;

});

},[registros,textoBusqueda,tipoBusqueda,fechaInicio,fechaFin]);

const handleBuscar = (e)=>{
e.preventDefault();
};

const openPicker = (ref) => {
  const el = ref?.current;
  if (!el) return;
  if (typeof el.showPicker === "function") el.showPicker();
  el.focus();
};

return(
<>
<style>{styles}</style>

<div className="content">

<div className="t7">
ORDEN DE COMPRA / detallado
</div>

<form onSubmit={handleBuscar}>

<div className="busqueda">

<div className="busqueda-grupo">

<b>BUSCAR X</b>

<label className="radio">
<input
type="radio"
name="tipo"
value="nrodoc"
checked={tipoBusqueda==="nrodoc"}
onChange={()=>setTipoBusqueda("nrodoc")}
/>
<span>Nro doc</span>
</label>

<label className="radio">
<input
type="radio"
name="tipo"
value="proveedor"
checked={tipoBusqueda==="proveedor"}
onChange={()=>setTipoBusqueda("proveedor")}
/>
<span>Proveedor</span>
</label>

<label className="radio">
<input
type="radio"
name="tipo"
value="ruc"
checked={tipoBusqueda==="ruc"}
onChange={()=>setTipoBusqueda("ruc")}
/>
<span>RUC</span>
</label>

<input
 type="text"
 placeholder="Ingrese el texto a buscar"
 value={textoBusqueda}
 onChange={(e)=>setTextoBusqueda(e.target.value)}
/>

</div>

<div className="fecha-grupo">
<b>Fecha Inicio</b>
<div className="date-wrap">
  <input
    ref={fechaInicioRef}
    type="date"
    value={fechaInicio}
    onChange={(e)=>setFechaInicio(e.target.value)}
  />
  <button
    className="date-btn"
    type="button"
    aria-label="Seleccionar Fecha Inicio"
    onClick={() => openPicker(fechaInicioRef)}
  >
    <IconCalendar />
  </button>
</div>
</div>

<div className="fecha-grupo">
<b>Fecha Fin</b>
<div className="date-wrap">
  <input
    ref={fechaFinRef}
    type="date"
    value={fechaFin}
    onChange={(e)=>setFechaFin(e.target.value)}
  />
  <button
    className="date-btn"
    type="button"
    aria-label="Seleccionar Fecha Fin"
    onClick={() => openPicker(fechaFinRef)}
  >
    <IconCalendar />
  </button>
</div>
</div>

</div>

<div className="botones">

<button className="botonBuscar" type="submit">
<IconSearchCircle />
Buscar
</button>

<button className="botonNuevo" type="button">
<IconPlus />
Agregar Nuevo
</button>

</div>

</form>

<div className="tabla-titulo">
LISTADO GENERAL
</div>

<table>

<thead>

<tr height="40px" className="headTitle">

<td width="12%" align="center">FECHA</td>
<td width="15%">NRO DOC</td>
<td width="15%">FECHA ENT.</td>
<td>PROVEEDOR</td>
<td width="12%" align="center">ACCION</td>

</tr>

</thead>

<tbody>

{registrosFiltrados.length === 0 ? (

<tr className="empty-row">
<td colSpan="5">
No hay registros para mostrar.
</td>
</tr>

) : (

registrosFiltrados.map((r)=>(
<tr key={r.id}>
<td align="center">{r.fecha}</td>
<td>{r.nro}</td>
<td>{r.fechaEntrega}</td>
<td>{r.proveedor}</td>
<td align="center">{r.accion}</td>
</tr>
))

)}

</tbody>

</table>

<div className="leyenda">
<div className="leyenda-row">
  <b>Leyenda de OPCIONES:</b>
  <div className="leyenda-items">
    <span className="leyenda-item">
      <IconEdit />
      Actualizar, Eliminar
    </span>
    <span className="leyenda-item">
      <IconPdf />
      Exportar a pdf
    </span>
    <span className="leyenda-item">
      <IconThumb />
      Confirme compra
    </span>
    <span className="leyenda-item">
      <IconReturn />
      Volver comprar
    </span>
  </div>
</div>

</div>

</div>

</>
);

};

export default OrdenCompra;