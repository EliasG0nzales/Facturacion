import { useState, useRef } from "react";

// ─── Datos demo ────────────────────────────────────────────────────────────────
const TURNOS    = [{ v:"", l:"Turno > todos" }, { v:"Mañana", l:"Mañana" }, { v:"Tarde", l:"Tarde" }];
const EMPRESAS  = [
  { v:"", l:"Empresa > todos" }, { v:"Configuracion", l:"Configuracion" },
  { v:"Linea", l:"Linea" }, { v:"Marca", l:"Marca" }, { v:"Servicio", l:"Servicio" },
  { v:"Sexo", l:"Sexo" }, { v:"Tipo de articulo", l:"Tipo de articulo" },
];
const TIPOS_MOV = [{ v:"", l:"Tipo > todos" }, { v:"I", l:"Ingreso - Caja" }, { v:"E", l:"Gastos" }];
const X_DIA_MES = [{ v:"", l:"Seleccionar" }, { v:"Dia", l:"Dia" }, { v:"Mes", l:"Mes" }];

// Colores cabecera .tablaN según "modo" de la vista — fiel al PHP
const MODOS_VISTA = [
  { key:"Individual", label:"Caja Individual", headerBg:"#005F8C" },
  { key:"General",    label:"Caja General",    headerBg:"green"   },
];

function generarMovs(tipo) {
  const motivos = tipo === "E"
    ? ["Pago proveedor","Gastos operativos","Luz/Agua","Alquiler local","Mantenimiento"]
    : ["Venta Factura","Venta Boleta","Venta Ticket","Cobro Crédito","Depósito bancario"];
  const usuarios = ["Smith","Enmanuel","Alexander","usuario","demo"];
  const n = 5 + Math.floor(Math.random() * 5);
  return Array.from({ length: n }, (_, i) => ({
    id:       i + 1,
    fecha:    "10/03/2026",
    turno:    Math.random() > 0.5 ? "Mañana" : "Tarde",
    motivo:   motivos[Math.floor(Math.random() * motivos.length)],
    tipo:     tipo || (Math.random() > 0.3 ? "I" : "E"),
    moneda:   Math.random() > 0.85 ? "US$" : "S/",
    monto:    (50 + Math.random() * 1450).toFixed(2),
    usuario:  usuarios[Math.floor(Math.random() * usuarios.length)],
    sucursal: ["Tienda 1b 133","Tienda 1A 119","Almacen 2B 167"][Math.floor(Math.random()*3)],
  }));
}

// ─── DatePicker ────────────────────────────────────────────────────────────────
const IcoCal = () => (
  <svg width="16" height="16" viewBox="0 0 36 36" fill="none">
    <rect x="1" y="4"  width="34" height="30" rx="3" fill="#fff" stroke="#bbb" strokeWidth="1.5"/>
    <rect x="1" y="4"  width="34" height="9"  rx="3" fill="#e74c3c"/>
    <rect x="1" y="9"  width="34" height="4"  fill="#e74c3c"/>
    <rect x="10" y="1" width="3"  height="7"  rx="1.5" fill="#888"/>
    <rect x="23" y="1" width="3"  height="7"  rx="1.5" fill="#888"/>
  </svg>
);

const DP = ({ value, onChange, placeholder = "Año/Mes" }) => {
  const ref = useRef();
  const display = value ? value.split("-").reverse().join("/") : "";
  return (
    <div style={{ position:"relative", display:"inline-flex", alignItems:"center",
      border:"1px solid #ced4da", borderRadius:4, background:"#fff",
      padding:"3px 8px", gap:4, cursor:"pointer", minWidth:110 }}
      onClick={() => ref.current.showPicker?.() ?? ref.current.click()}>
      <span style={{ fontSize:13, color: value ? "#212529" : "#aaa", minWidth:80 }}>
        {display || placeholder}
      </span>
      <IcoCal />
      <input ref={ref} type="date" value={value} onChange={e => onChange(e.target.value)}
        style={{ opacity:0, width:1, height:1, position:"absolute" }} />
    </div>
  );
};

// ─── Modal nuevo movimiento ────────────────────────────────────────────────────
function ModalNuevo({ onClose, onGuardar }) {
  const hoy = new Date().toISOString().slice(0,10);
  const [form, setForm] = useState({
    fecha: hoy, turno:"Mañana", motivo:"", tipo:"I",
    moneda:"S/", monto:"", usuario:"Smith", observacion:""
  });
  const up = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.45)",
      zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"#fff", borderRadius:8, width:480, maxWidth:"95vw",
        boxShadow:"0 8px 32px rgba(0,0,0,.25)", overflow:"hidden" }}>
        {/* Header */}
        <div style={{ background:"#005F8C", color:"#fff", padding:"12px 18px",
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <b style={{ fontSize:15 }}>➕ Nuevo Movimiento de Caja</b>
          <span style={{ cursor:"pointer", fontSize:18 }} onClick={onClose}>✕</span>
        </div>
        {/* Body */}
        <div style={{ padding:"18px 20px", display:"flex", flexDirection:"column", gap:11 }}>

          {[
            { label:"Fecha",  node: <DP value={form.fecha} onChange={v=>up("fecha",v)} /> },
            { label:"Turno",  node:
              <select value={form.turno} onChange={e=>up("turno",e.target.value)}
                style={{ padding:"4px 8px", border:"1px solid #ced4da", borderRadius:4,
                  background:"#fff", color:"#212529", fontSize:13 }}>
                {["Mañana","Tarde"].map(t=><option key={t}>{t}</option>)}
              </select>
            },
            { label:"Tipo",   node:
              <select value={form.tipo} onChange={e=>up("tipo",e.target.value)}
                style={{ padding:"4px 8px", border:"1px solid #ced4da", borderRadius:4,
                  background:"#fff", color:"#212529", fontSize:13 }}>
                <option value="I">Ingreso - Caja</option>
                <option value="E">Gastos</option>
              </select>
            },
            { label:"Motivo", node:
              <input value={form.motivo} onChange={e=>up("motivo",e.target.value)}
                placeholder="Descripción del movimiento"
                style={{ padding:"4px 8px", border:"1px solid #ced4da", borderRadius:4,
                  background:"#fff", color:"#212529", fontSize:13, width:"100%" }} />
            },
            { label:"Moneda", node:
              <select value={form.moneda} onChange={e=>up("moneda",e.target.value)}
                style={{ padding:"4px 8px", border:"1px solid #ced4da", borderRadius:4,
                  background:"#fff", color:"#212529", fontSize:13 }}>
                <option>S/</option><option>US$</option>
              </select>
            },
            { label:"Monto",  node:
              <input type="number" value={form.monto} onChange={e=>up("monto",e.target.value)}
                placeholder="0.00" min="0" step="0.01"
                style={{ padding:"4px 8px", border:"1px solid #ced4da", borderRadius:4,
                  background:"#fff", color:"#212529", fontSize:13, width:120 }} />
            },
            { label:"Observación", node:
              <input value={form.observacion} onChange={e=>up("observacion",e.target.value)}
                placeholder="Opcional"
                style={{ padding:"4px 8px", border:"1px solid #ced4da", borderRadius:4,
                  background:"#fff", color:"#212529", fontSize:13, width:"100%" }} />
            },
          ].map(({ label, node }) => (
            <div key={label} style={{ display:"flex", alignItems:"center", gap:10 }}>
              <label style={{ width:90, fontWeight:600, fontSize:13, flexShrink:0 }}>{label}</label>
              {node}
            </div>
          ))}
        </div>
        {/* Footer */}
        <div style={{ padding:"12px 20px", background:"#f8f9fa",
          display:"flex", gap:8, justifyContent:"flex-end",
          borderTop:"1px solid #dee2e6" }}>
          <button onClick={() => onGuardar(form)}
            style={{ background:"#28a745", color:"#fff", border:"none",
              borderRadius:4, padding:"6px 20px", cursor:"pointer", fontSize:13 }}>
            💾 Guardar
          </button>
          <button onClick={onClose}
            style={{ background:"#6c757d", color:"#fff", border:"none",
              borderRadius:4, padding:"6px 16px", cursor:"pointer", fontSize:13 }}>
            ✕ Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tabla de movimientos ──────────────────────────────────────────────────────
function TablaMovs({ movs, headerBg, titulo }) {
  const totalIngS = movs.filter(m=>m.tipo==="I"&&m.moneda!=="US$").reduce((s,m)=>s+parseFloat(m.monto),0).toFixed(2);
  const totalIngU = movs.filter(m=>m.tipo==="I"&&m.moneda==="US$").reduce((s,m)=>s+parseFloat(m.monto),0).toFixed(2);
  const totalEgS  = movs.filter(m=>m.tipo==="E"&&m.moneda!=="US$").reduce((s,m)=>s+parseFloat(m.monto),0).toFixed(2);
  const cajaNeto  = (parseFloat(totalIngS) - parseFloat(totalEgS)).toFixed(2);

  return (
    <div style={{ marginBottom:24 }}>
      <table style={{ width:"100%", borderSpacing:0, fontFamily:"verdana, sans-serif" }}>
        <thead>
          <tr className="azul" style={{ background: headerBg }}>
            {["#","Fecha","Turno","Motivo / Detalle","Tipo","Moneda","Monto","Usuario","Sucursal"].map(h => (
              <th key={h} style={{ color:"#fff", fontWeight:"bold", textTransform:"uppercase",
                letterSpacing:1, padding:"10px 8px", fontSize:13,
                textAlign: h==="Monto" ? "right" : "left" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {movs.length === 0 ? (
            <tr><td colSpan={9} style={{ textAlign:"center", padding:20, color:"#888" }}>
              Sin registros
            </td></tr>
          ) : movs.map((m, i) => (
            <tr key={m.id} style={{ background: i%2===0 ? "#eee" : "#fff", fontSize:15 }}>
              <td style={{ padding:"3px 8px" }}>{m.id}</td>
              <td style={{ padding:"3px 8px" }}>{m.fecha}</td>
              <td style={{ padding:"3px 8px" }}>{m.turno}</td>
              <td style={{ padding:"3px 8px" }}>{m.motivo}</td>
              <td style={{ padding:"3px 8px" }}>
                <span style={{
                  background: m.tipo==="I" ? "#28a745" : "#dc3545",
                  color:"#fff", borderRadius:3, padding:"2px 7px", fontSize:11
                }}>
                  {m.tipo==="I" ? "Ingreso" : "Gasto"}
                </span>
              </td>
              <td style={{ padding:"3px 8px" }}>{m.moneda}</td>
              <td style={{ padding:"3px 8px", textAlign:"right" }}>{m.monto}</td>
              <td style={{ padding:"3px 8px" }}>{m.usuario}</td>
              <td style={{ padding:"3px 8px" }}>{m.sucursal}</td>
            </tr>
          ))}
        </tbody>
        {/* Fila totales */}
        <tfoot>
          <tr style={{ background:"#e9ecef", fontWeight:"bold" }}>
            <td colSpan={5} style={{ padding:"6px 8px", fontSize:13 }}>
              Ingresos S/: {totalIngS} &nbsp;|&nbsp; US$: {totalIngU} &nbsp;|&nbsp;
              Gastos S/: {totalEgS}
            </td>
            <td style={{ padding:"6px 8px" }}></td>
            <td colSpan={3} style={{ padding:"6px 8px", textAlign:"right",
              background:"#C3FEAD", fontSize:13 }}>
              CAJA NETO S/: {cajaNeto}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────────
export default function Caja() {
  const [vistaMode, setVistaMode]   = useState("Individual"); // Individual | General
  const [turno,     setTurno]       = useState("");
  const [empresa,   setEmpresa]     = useState("");
  const [tipoMov,   setTipoMov]     = useState("");
  const [busqueda,  setBusqueda]    = useState("");
  const [xDiaMes,  setXDiaMes]     = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [movs,      setMovs]        = useState(generarMovs(""));
  const [loading,   setLoading]     = useState(false);
  const [modalNuevo, setModalNuevo] = useState(false);
  const [alert,     setAlert]       = useState("");

  const vistaActual = MODOS_VISTA.find(v => v.key === vistaMode);

  const showAlert = (msg) => { setAlert(msg); setTimeout(() => setAlert(""), 3500); };

  const buscar = () => {
    setLoading(true);
    setTimeout(() => { setMovs(generarMovs(tipoMov)); setLoading(false); }, 350);
  };

  const guardarNuevo = (form) => {
    if (!form.motivo || !form.monto) { showAlert("err:Complete los campos requeridos"); return; }
    const nuevo = {
      id:       movs.length + 1,
      fecha:    form.fecha ? form.fecha.split("-").reverse().join("/") : "10/03/2026",
      turno:    form.turno,
      motivo:   form.motivo,
      tipo:     form.tipo,
      moneda:   form.moneda,
      monto:    parseFloat(form.monto).toFixed(2),
      usuario:  form.usuario,
      sucursal: "Tienda 1b 133",
    };
    setMovs(prev => [nuevo, ...prev]);
    setModalNuevo(false);
    showAlert("ok:Movimiento registrado correctamente");
  };

  // Filtrado local
  const movsFiltrados = movs.filter(m => {
    if (turno   && m.turno !== turno)     return false;
    if (tipoMov && m.tipo  !== tipoMov)   return false;
    if (busqueda && !m.motivo.toLowerCase().includes(busqueda.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ fontFamily:"Arial, sans-serif", fontSize:13, padding:16, color:"#212529" }}>

      {/* ── Alerta flotante ── */}
      {alert && (
        <div style={{ position:"fixed", top:70, right:20, zIndex:9999,
          background: alert.startsWith("ok:") ? "#28a745" : "#dc3545",
          color:"#fff", padding:"10px 18px", borderRadius:6,
          boxShadow:"0 4px 12px rgba(0,0,0,.2)" }}>
          {alert.startsWith("ok:") ? "✅ " : "⚠️ "}{alert.slice(3)}
        </div>
      )}

      {/* ── Título con vínculos — fiel al PHP ── */}
      <div style={{ fontSize:14, marginBottom:14 }}>
        <b>CAJA: ESTADO</b>
        {" / "}
        {MODOS_VISTA.map(v => (
          <span key={v.key}>
            <span
              onClick={() => setVistaMode(v.key)}
              style={{ color: vistaMode===v.key ? "#000" : "#17a2b8",
                cursor:"pointer", textDecoration: vistaMode===v.key ? "none" : "underline",
                fontWeight: vistaMode===v.key ? "bold" : "normal" }}>
              {v.label}
            </span>
            {" / "}
          </span>
        ))}
      </div>

      {/* ── Formulario filtros — fiel al PHP (idimput) ── */}
      <div style={{ background:"#f8f9fa", border:"1px solid #dee2e6", borderRadius:6,
        padding:"10px 14px", marginBottom:18, display:"flex", flexWrap:"wrap",
        alignItems:"center", gap:8 }}>

        {/* Turno */}
        <select value={turno} onChange={e=>setTurno(e.target.value)}
          style={{ padding:"4px 8px", fontSize:13, border:"1px solid #ced4da",
            borderRadius:4, background:"#fff", color:"#212529" }}>
          {TURNOS.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}
        </select>

        {/* Empresa */}
        <select value={empresa} onChange={e=>setEmpresa(e.target.value)}
          style={{ padding:"4px 8px", fontSize:13, border:"1px solid #ced4da",
            borderRadius:4, background:"#fff", color:"#212529" }}>
          {EMPRESAS.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}
        </select>

        {/* Tipo Ingreso/Gasto */}
        <select value={tipoMov} onChange={e=>setTipoMov(e.target.value)}
          style={{ padding:"4px 8px", fontSize:13, border:"1px solid #ced4da",
            borderRadius:4, background:"#fff", color:"#212529" }}>
          {TIPOS_MOV.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}
        </select>

        {/* Texto búsqueda */}
        <input value={busqueda} onChange={e=>setBusqueda(e.target.value)}
          placeholder="Ingrese texto a buscar"
          style={{ padding:"4px 8px", fontSize:13, border:"1px solid #ced4da",
            borderRadius:4, background:"#fff", color:"#212529", minWidth:180 }} />

        <b style={{ fontSize:12 }}>Y/O</b>

        {/* Día/Mes */}
        <select value={xDiaMes} onChange={e=>setXDiaMes(e.target.value)}
          style={{ padding:"4px 8px", fontSize:13, border:"1px solid #ced4da",
            borderRadius:4, background:"#fff", color:"#212529" }}>
          {X_DIA_MES.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}
        </select>

        {/* Fecha */}
        <DP value={fechaFiltro} onChange={setFechaFiltro} placeholder="(Año/Mes)" />

        {/* Botón buscar */}
        <button onClick={buscar}
          style={{ background:"#17a2b8", color:"#fff", border:"none",
            borderRadius:4, padding:"5px 14px", cursor:"pointer",
            fontSize:13, display:"flex", alignItems:"center", gap:4 }}>
          🔍
        </button>

        {/* Botón +  nuevo — fiel al PHP (caja-nuevo.php) */}
        <button onClick={() => setModalNuevo(true)}
          style={{ background:"#17a2b8", color:"#fff", border:"none",
            borderRadius:4, padding:"5px 14px", cursor:"pointer",
            fontSize:16, fontWeight:"bold" }}>
          ➕
        </button>
      </div>

      {/* ── Tabla movimientos ── */}
      {loading ? (
        <div style={{ textAlign:"center", padding:40, color:"#888" }}>Cargando...</div>
      ) : (
        <TablaMovs
          movs={movsFiltrados}
          headerBg={vistaActual.headerBg}
          titulo={vistaActual.label}
        />
      )}

      {/* ── Modal nuevo ── */}
      {modalNuevo && (
        <ModalNuevo
          onClose={() => setModalNuevo(false)}
          onGuardar={guardarNuevo}
        />
      )}
    </div>
  );
}