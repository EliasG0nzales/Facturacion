import { useRef, useState } from "react";

const dateStyles = `
.date-wrap{
  position:relative;
  display:inline-block;
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
.date-btn svg{ display:block; }
input[type="date"]::-webkit-calendar-picker-indicator{ opacity:0; }
`;

const ctaxStyles = `
.ctax-wrap{
  font-family: Arial, sans-serif;
  color: #212529;
  background: #fff;
  padding: 20px 30px 40px;
}
.ctax-toggle{
  display:flex;
  align-items:center;
  gap:10px;
  margin-bottom:16px;
  color:#0f5f87;
  font-weight:bold;
  font-size:15px;
}
.ctax-toggle-circle{
  width:18px; height:18px;
  border-radius:50%;
  background:#0f5f87;
}
.ctax-filtros{
  display:flex;
  flex-direction:column;
  gap:10px;
  margin-bottom:18px;
}
.ctax-radio-row{
  display:flex;
  align-items:center;
  gap:6px;
  font-size:13px;
  flex-wrap:wrap;
}
.ctax-buscar-row{
  display:flex;
  align-items:flex-end;
  gap:10px;
  flex-wrap:wrap;
}
.ctax-buscar-label{
  font-size:13px;
  font-weight:bold;
  white-space:nowrap;
}
.ctax-select{
  padding:5px 8px;
  border:1px solid #ccc;
  border-radius:4px;
  font-size:13px;
  background:#fff;
  height:32px;
}
.ctax-input{
  padding:5px 8px;
  border:1px solid #ccc;
  border-radius:4px;
  font-size:13px;
  background:#fff;
  height:32px;
}
.ctax-fecha-col{
  display:flex;
  flex-direction:column;
  gap:3px;
}
.ctax-fecha-col label{
  font-size:12px;
  font-weight:bold;
}
.ctax-yo{
  font-size:13px;
  font-weight:bold;
  align-self:flex-end;
  padding-bottom:6px;
}
.ctax-btn{
  display:inline-flex;
  align-items:center;
  gap:6px;
  padding:5px 14px;
  border:none;
  border-radius:5px;
  cursor:pointer;
  font-size:13px;
  height:32px;
  background:#3a99c6;
  color:#fff;
}
.ctax-btn.outline{
  background:#fff;
  border:1px solid #ccc;
  color:#212529;
}
.ctax-listado-title{
  text-align:center;
  font-weight:bold;
  font-size:13px;
  padding:8px;
  background:#e9f4fb;
  border:1px solid #ccd;
}
.ctax-table{
  width:100%;
  border-collapse:collapse;
  font-size:13px;
}
.ctax-table thead th{
  background:#0f5f87;
  color:#fff;
  padding:9px 8px;
  text-align:center;
}
.ctax-table tbody td{
  border:1px solid #ddd;
  padding:8px;
  text-align:center;
  background:#f8f8f8;
}
.ctax-table tfoot td{
  border:1px solid #ddd;
  padding:8px;
  text-align:center;
  font-weight:bold;
  background:#e9f4fb;
}
.ctax-estado-credito{
  color:#0f5f87;
  font-weight:bold;
}
.ctax-acciones{
  display:flex;
  gap:4px;
  justify-content:center;
}
.ctax-icon-btn{
  background:none;
  border:none;
  cursor:pointer;
  padding:2px;
  font-size:15px;
}
.ctax-bottom-row{
  display:flex;
  justify-content:flex-end;
  gap:8px;
  margin-top:8px;
}
`;

const IconCalendar = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <rect x="3" y="4.5" width="18" height="17" rx="2" fill="#ffffff" stroke="#6c757d" strokeWidth="1.2"/>
    <rect x="3" y="4.5" width="18" height="5" rx="2" fill="#1aa38a"/>
    <rect x="6" y="2.5" width="2.2" height="4.2" rx="1" fill="#6c757d"/>
    <rect x="15.8" y="2.5" width="2.2" height="4.2" rx="1" fill="#6c757d"/>
  </svg>
);

const initialData = [
  {
    id:1,
    nro:1,
    docVenta:"NV-001-000004",
    cliente:"venta falabella",
    fecha:"2024-01-23",
    cred:"1 Dias",
    moneda:"S/",
    deuda:320,
    fechap:"24/01/2024",
    estado:"Credito"
  },
  {
    id:2,
    nro:2,
    docVenta:"F-F01-000001",
    cliente:"Inteligente S.a.c.",
    fecha:"2026-02-26",
    cred:"2 Dias",
    moneda:"S/",
    deuda:80,
    fechap:"28/02/2026",
    estado:"Credito"
  }
];

export default function CtaxCobrar(){

  const fechaInicioRef = useRef(null);
  const fechaFinRef = useRef(null);

  const [buscarTexto,setBuscarTexto] = useState("");
  const [fechaInicio,setFechaInicio] = useState("");
  const [fechaFin,setFechaFin] = useState("");
  const [datos] = useState(initialData);

  const openPicker = (ref)=>{
    const el = ref.current;
    if(!el) return;
    if(typeof el.showPicker === "function") el.showPicker();
    el.focus();
  };

  const totalSoles = datos.reduce((sum,d)=> d.moneda==="S/" ? sum + d.deuda : sum,0);

  return(
    <>
      <style>{dateStyles + ctaxStyles}</style>

      <div className="ctax-wrap">

        <div className="ctax-toggle">
          <div className="ctax-toggle-circle"/>
          <span>CUENTA POR COBRAR</span>
        </div>

        <div className="ctax-filtros">

          <div className="ctax-radio-row">
            <span style={{fontWeight:"bold"}}>Crédito (</span>
            <span style={{
              width:"12px",
              height:"12px",
              borderRadius:"50%",
              background:"#aaa",
              display:"inline-block"
            }}/>
            <span>Vencido</span>
            <span>Todo</span>
            <span>Cancelado</span>
            <span style={{fontWeight:"bold"}}>)</span>
          </div>

          <div className="ctax-buscar-row">

            <span className="ctax-buscar-label">BUSCAR X</span>

            <input
              type="text"
              className="ctax-input"
              placeholder="Buscar..."
              value={buscarTexto}
              onChange={(e)=>setBuscarTexto(e.target.value)}
            />

            <div className="ctax-fecha-col">
              <label>Fecha Inicio</label>
              <div className="date-wrap">
                <input
                  ref={fechaInicioRef}
                  type="date"
                  className="ctax-input"
                  value={fechaInicio}
                  onChange={(e)=>setFechaInicio(e.target.value)}
                />
                <button
                  type="button"
                  className="date-btn"
                  onClick={()=>openPicker(fechaInicioRef)}
                >
                  <IconCalendar/>
                </button>
              </div>
            </div>

            <div className="ctax-fecha-col">
              <label>Fecha Fin</label>
              <div className="date-wrap">
                <input
                  ref={fechaFinRef}
                  type="date"
                  className="ctax-input"
                  value={fechaFin}
                  onChange={(e)=>setFechaFin(e.target.value)}
                />
                <button
                  type="button"
                  className="date-btn"
                  onClick={()=>openPicker(fechaFinRef)}
                >
                  <IconCalendar/>
                </button>
              </div>
            </div>

            <button className="ctax-btn">
              🔍 Buscar
            </button>

            <button className="ctax-btn outline">
              🖨 Imprimir
            </button>

          </div>

        </div>

        <div className="ctax-listado-title">
          Listado de crédito
        </div>

        <table className="ctax-table">

          <thead>
            <tr>
              <th>NRO</th>
              <th>DOC.VENTA</th>
              <th>CLIENTE</th>
              <th>FECHA</th>
              <th>CRED.</th>
              <th>M.</th>
              <th>DEUDA</th>
              <th>FECHAP.</th>
              <th>ESTADO</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {datos.map((row)=>(
              <tr key={row.id}>
                <td>{row.nro}</td>
                <td>{row.docVenta}</td>
                <td>{row.cliente}</td>
                <td>{row.fecha}</td>
                <td>{row.cred}</td>
                <td>{row.moneda}</td>
                <td>{row.deuda.toFixed(2)}</td>
                <td>{row.fechap}</td>
                <td className="ctax-estado-credito">{row.estado}</td>
                <td>
                  <div className="ctax-acciones">
                    <button className="ctax-icon-btn">✏️</button>
                    <button className="ctax-icon-btn">👁️</button>
                    <button className="ctax-icon-btn">✅</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <td colSpan="6" style={{textAlign:"right"}}>Total</td>
              <td>S/ {totalSoles.toFixed(2)}</td>
              <td colSpan="3"></td>
            </tr>
          </tfoot>

        </table>

        <div className="ctax-bottom-row">
          <button className="ctax-icon-btn">📊</button>
          <button className="ctax-icon-btn">🖨️</button>
        </div>

      </div>
    </>
  );
}