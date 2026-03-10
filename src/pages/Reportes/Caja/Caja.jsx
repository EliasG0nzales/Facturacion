import { useState, useRef } from "react";

// ─── Constantes ────────────────────────────────────────────────────────────────
const TURNOS   = [{ v:"", l:"Turno > todos" }, { v:"Mañana", l:"Mañana" }, { v:"Tarde", l:"Tarde" }];
const EMPRESAS = [
  { v:"", l:"Empresa > todos" }, { v:"Configuracion", l:"Configuracion" },
  { v:"Linea", l:"Linea" }, { v:"Marca", l:"Marca" }, { v:"Servicio", l:"Servicio" },
  { v:"Sexo", l:"Sexo" }, { v:"Tipo de articulo", l:"Tipo de articulo" },
];
const EMPRESAS_FORM = EMPRESAS.filter(e => e.v !== "");
const TIPOS_MOV = [{ v:"", l:"Tipo > todos" }, { v:"I", l:"Ingreso - Caja" }, { v:"E", l:"Gastos" }];
const X_DIA_MES = [{ v:"", l:"Seleccionar" }, { v:"Dia", l:"Dia" }, { v:"Mes", l:"Mes" }];
const BANCOS    = ["Interbank Soles","BBVA Soles","BCP Soles","Scotiabank Soles","Banbif Soles"];
const AUTORIZADOS  = [{ v:"demo",l:"fac-tura.com" },{ v:"Smith",l:"Iturri, Quispe, Smith" },{ v:"Alexander",l:"Romero, Merino, Alexander" }];
const RESPONSABLES = [{ v:"demo",l:"fac-tura.com" },{ v:"Smith",l:"Iturri, Quispe, Smith" },{ v:"Enmanuel",l:"Merino, Cahuna, Enmanuel" },{ v:"Alexander",l:"Romero, Merino, Alexander" },{ v:"usuario",l:"Yupanqui, Barboza, Raysa" }];
const MODOS_VISTA  = [
  { key:"Individual", label:"Caja Individual", headerBg:"#005F8C" },
  { key:"General",    label:"Caja General",    headerBg:"green"   },
];

// ─── Datos demo ────────────────────────────────────────────────────────────────
function generarMovs(tipo) {
  const motivosI = ["Venta Factura","Venta Boleta","Venta Ticket","Cobro Crédito","Depósito bancario","Billetera digital"];
  const motivosE = ["Pago proveedor","Gastos operativos","Luz/Agua","Alquiler local","Mantenimiento","Planilla"];
  const usuarios = ["Smith","Enmanuel","Alexander","usuario","demo"];
  const n = 5 + Math.floor(Math.random() * 5);
  return Array.from({ length: n }, (_, i) => ({
    id:       i + 1,
    fecha:    "10/03/2026",
    turno:    Math.random() > 0.5 ? "Mañana" : "Tarde",
    motivo:   tipo === "E"
      ? motivosE[Math.floor(Math.random()*motivosE.length)]
      : motivosI[Math.floor(Math.random()*motivosI.length)],
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

// ─── Estilos compartidos ───────────────────────────────────────────────────────
const inp = { padding:"4px 8px", fontSize:13, border:"1px solid #ced4da",
  borderRadius:4, background:"#fff", color:"#212529", width:"100%" };
const sel = { ...inp, width:"auto", minWidth:160 };
const lbl = { fontWeight:"bold", fontSize:13, display:"block", marginBottom:3 };
const req = { color:"red" };
const fieldBox = { display:"inline-block", verticalAlign:"top",
  margin:"0 8px 12px 0", minWidth:140 };

// ─── Vista NUEVO (caja-nuevo.php) ─────────────────────────────────────────────
function CajaNuevo({ onRegresar, onGuardar }) {
  const hoy = new Date().toISOString().slice(0,10);
  const [form, setForm] = useState({
    modo:       "I",   // I=Ingreso E=Egreso
    cajaf:      hoy,
    turno:      "",
    empresa:    "",
    sucursal:   "",
    moneda:     "Soles",
    planilla:   "E",
    esunat:     "",    // Bancarizado B+F
    elibre:     "",    // Efectivo
    visa:       "",
    mastercard: "",
    ae:         "",    // American Express
    depo:       "",    // Depósito/Transf
    banco:      "",
    gastose:    "",    // Gastos Efectivo
    gotros:     "",    // Otros Gastos
    auto:       "Smith",
    res:        "Smith",
    des:        "",    // Detalle
  });
  const up = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const esEgreso  = form.modo === "E";
  const esIngreso = form.modo === "I";

  // Subcategorías dinámicas según empresa — simuladas
  const SUBCATS = {
    Configuracion: ["Config A","Config B"],
    Linea:         ["Línea 1","Línea 2","Línea 3"],
    Marca:         ["Nike","Adidas","Puma","Reebok"],
    Servicio:      ["Servicio A","Servicio B"],
    Sexo:          ["Masculino","Femenino","Unisex"],
    "Tipo de articulo": ["Electrónico","Textil","Alimento"],
  };
  const subcats = form.empresa ? (SUBCATS[form.empresa] || []) : [];

  return (
    <div style={{ fontFamily:"Arial, sans-serif", fontSize:13, color:"#212529", padding:16 }}>

      {/* Título fiel al PHP */}
      <h2 style={{ fontSize:18, marginBottom:16 }}>
        <span style={{ color:"#17a2b8", marginRight:8 }}>ℹ</span>
        Caja : nuevo
      </h2>

      <div style={{ maxWidth:860 }}>

        {/* ── Tipo ── */}
        <div style={fieldBox}>
          <label style={lbl}>Tipo <span style={req}>*</span></label>
          <select value={form.modo} onChange={e => up("modo", e.target.value)} style={sel}>
            <option value="I">Ingreso</option>
            <option value="E">Egreso</option>
          </select>
        </div>

        {/* ── Fecha Caja ── */}
        <div style={fieldBox}>
          <label style={lbl}>Fecha Caja <span style={req}>*</span></label>
          <DP value={form.cajaf} onChange={v => up("cajaf", v)} />
        </div>

        {/* ── Turno ── */}
        <div style={fieldBox}>
          <label style={lbl}>Turno</label>
          <select value={form.turno} onChange={e => up("turno", e.target.value)} style={sel}>
            <option value=""></option>
            <option value="Mañana">Mañana</option>
            <option value="Tarde">Tarde</option>
          </select>
        </div>

        {/* ── Empresa ── */}
        <div style={fieldBox}>
          <label style={lbl}>
            Empresa <span style={req}>*</span>
            <span style={{ color:"#0099FF", marginLeft:6, cursor:"pointer", fontWeight:"normal" }}>..+</span>
          </label>
          <select value={form.empresa} onChange={e => { up("empresa", e.target.value); up("sucursal",""); }} style={sel}>
            <option value=""></option>
            {EMPRESAS_FORM.map(e => <option key={e.v} value={e.v}>{e.l}</option>)}
          </select>
        </div>

        {/* ── Sucursal (carga dinámica simulada) ── */}
        <div style={fieldBox}>
          <label style={lbl}>Sucursal</label>
          <select value={form.sucursal} onChange={e => up("sucursal", e.target.value)} style={sel}>
            <option value=""></option>
            {subcats.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* ── Moneda ── */}
        <div style={fieldBox}>
          <label style={lbl}>Moneda <span style={req}>*</span></label>
          <select value={form.moneda} onChange={e => up("moneda", e.target.value)} style={sel}>
            <option value="Soles">Soles</option>
            <option value="Dolares">Dolares</option>
          </select>
        </div>

        {/* ── T.Gastos — solo Egreso ── */}
        {esEgreso && (
          <div style={fieldBox}>
            <label style={lbl}>T.Gastos</label>
            <select value={form.planilla} onChange={e => up("planilla", e.target.value)} style={sel}>
              <option value="E">Otros</option>
              <option value="1">Planilla</option>
            </select>
          </div>
        )}

        {/* ── Bancarizado B+F — solo Ingreso ── */}
        {esIngreso && (
          <div style={fieldBox}>
            <label style={lbl}>Bancarizado B+F <span style={req}>*</span></label>
            <input value={form.esunat} onChange={e => up("esunat", e.target.value)}
              placeholder="Bancarizado B+F" style={{ ...inp, width:140 }} />
          </div>
        )}

        {/* ── Efectivo — siempre ── */}
        <div style={fieldBox}>
          <label style={lbl}>Efectivo <span style={req}>*</span></label>
          <input value={form.elibre} onChange={e => up("elibre", e.target.value)}
            placeholder="Efectivo" type="number" min="0" step="0.01"
            style={{ ...inp, width:120 }} />
        </div>

        {/* ── Visa / Master / AE — solo Ingreso ── */}
        {esIngreso && (<>
          <div style={fieldBox}>
            <label style={lbl}>Visa</label>
            <input value={form.visa} onChange={e => up("visa", e.target.value)}
              placeholder="Visa" type="number" min="0" step="0.01"
              style={{ ...inp, width:110 }} />
          </div>
          <div style={fieldBox}>
            <label style={lbl}>Master Card</label>
            <input value={form.mastercard} onChange={e => up("mastercard", e.target.value)}
              placeholder="Master Card" type="number" min="0" step="0.01"
              style={{ ...inp, width:110 }} />
          </div>
          <div style={fieldBox}>
            <label style={lbl}>Am.Express</label>
            <input value={form.ae} onChange={e => up("ae", e.target.value)}
              placeholder="American Express" type="number" min="0" step="0.01"
              style={{ ...inp, width:110 }} />
          </div>
        </>)}

        {/* ── Depósito/Transf — siempre ── */}
        <div style={fieldBox}>
          <label style={lbl}>Deposito / Tranf.</label>
          <input value={form.depo} onChange={e => up("depo", e.target.value)}
            placeholder="Deposito" type="number" min="0" step="0.01"
            style={{ ...inp, width:120 }} />
        </div>

        {/* ── Banco — solo Egreso ── */}
        {esEgreso && (
          <div style={fieldBox}>
            <label style={lbl}>Banco</label>
            <select value={form.banco} onChange={e => up("banco", e.target.value)} style={sel}>
              <option value="">Banco &gt;&gt;</option>
              {BANCOS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        )}

        {/* ── Gastos Efectivo / Otros Gastos — solo Ingreso ── */}
        {esIngreso && (<>
          <div style={fieldBox}>
            <label style={{ ...lbl, color:"red" }}>Gastos Efectivo</label>
            <input value={form.gastose} onChange={e => up("gastose", e.target.value)}
              placeholder="Gastos Efectivo" type="number" min="0" step="0.01"
              style={{ ...inp, width:130, borderColor:"#dc3545" }} />
          </div>
          <div style={fieldBox}>
            <label style={{ ...lbl, color:"red" }}>Otros Gastos</label>
            <input value={form.gotros} onChange={e => up("gotros", e.target.value)}
              placeholder="Otros Gastos" type="number" min="0" step="0.01"
              style={{ ...inp, width:120, borderColor:"#dc3545" }} />
          </div>
        </>)}

        {/* ── Autorizado — solo Egreso ── */}
        {esEgreso && (
          <div style={fieldBox}>
            <label style={lbl}>Autorizado</label>
            <select value={form.auto} onChange={e => up("auto", e.target.value)} style={sel}>
              {AUTORIZADOS.map(a => <option key={a.v} value={a.v}>{a.l}</option>)}
            </select>
          </div>
        )}

        {/* ── Responsable — solo Egreso ── */}
        {esEgreso && (
          <div style={fieldBox}>
            <label style={lbl}>Responsable</label>
            <select value={form.res} onChange={e => up("res", e.target.value)} style={sel}>
              {RESPONSABLES.map(r => <option key={r.v} value={r.v}>{r.l}</option>)}
            </select>
          </div>
        )}

        {/* ── Detalle — siempre ── */}
        <div style={{ ...fieldBox, minWidth:280, width:"100%" }}>
          <label style={lbl}>Detalle</label>
          <input value={form.des} onChange={e => up("des", e.target.value)}
            placeholder="Detalle del movimiento"
            style={{ ...inp, width:"100%", maxWidth:400 }} />
        </div>

        {/* ── Archivo — siempre visible ── */}
        <div style={{ ...fieldBox, minWidth:200 }}>
          <label style={lbl}>Archivo</label>
          <input type="file" style={{ fontSize:13 }} />
        </div>

        <div style={{ clear:"both" }} />

        {/* ── Botones — fiel al PHP ── */}
        <div style={{ display:"flex", gap:10, marginTop:16, justifyContent:"center" }}>
          <button onClick={onRegresar}
            style={{ background:"#17a2b8", color:"#fff", border:"none",
              borderRadius:4, padding:"7px 20px", cursor:"pointer", fontSize:13 }}>
            ↩ Regresar
          </button>
          <button onClick={() => onGuardar(form)}
            style={{ background:"#17a2b8", color:"#fff", border:"none",
              borderRadius:4, padding:"7px 20px", cursor:"pointer", fontSize:13 }}>
            💾 Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tabla de movimientos ──────────────────────────────────────────────────────
function TablaMovs({ movs, headerBg }) {
  const totalIngS = movs.filter(m=>m.tipo==="I"&&m.moneda!=="US$").reduce((s,m)=>s+parseFloat(m.monto),0).toFixed(2);
  const totalIngU = movs.filter(m=>m.tipo==="I"&&m.moneda==="US$").reduce((s,m)=>s+parseFloat(m.monto),0).toFixed(2);
  const totalEgS  = movs.filter(m=>m.tipo==="E"&&m.moneda!=="US$").reduce((s,m)=>s+parseFloat(m.monto),0).toFixed(2);
  const cajaNeto  = (parseFloat(totalIngS) - parseFloat(totalEgS)).toFixed(2);

  return (
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%", borderSpacing:0, fontFamily:"verdana, sans-serif" }}>
        <thead>
          <tr style={{ background: headerBg }}>
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
                <span style={{ background: m.tipo==="I" ? "#28a745" : "#dc3545",
                  color:"#fff", borderRadius:3, padding:"2px 7px", fontSize:11 }}>
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
        <tfoot>
          <tr style={{ background:"#e9ecef", fontWeight:"bold" }}>
            <td colSpan={5} style={{ padding:"6px 8px", fontSize:13 }}>
              Ingresos S/: {totalIngS} &nbsp;|&nbsp; US$: {totalIngU} &nbsp;|&nbsp; Gastos S/: {totalEgS}
            </td>
            <td></td>
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
  const [vista,       setVista]       = useState("lista");   // "lista" | "nuevo"
  const [vistaMode,   setVistaMode]   = useState("Individual");
  const [turno,       setTurno]       = useState("");
  const [empresa,     setEmpresa]     = useState("");
  const [tipoMov,     setTipoMov]     = useState("");
  const [busqueda,    setBusqueda]    = useState("");
  const [xDiaMes,    setXDiaMes]     = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [movs,        setMovs]        = useState(generarMovs(""));
  const [loading,     setLoading]     = useState(false);
  const [alert,       setAlert]       = useState("");

  const vistaActual = MODOS_VISTA.find(v => v.key === vistaMode);

  const showAlert = (msg) => { setAlert(msg); setTimeout(() => setAlert(""), 3500); };

  const buscar = () => {
    setLoading(true);
    setTimeout(() => { setMovs(generarMovs(tipoMov)); setLoading(false); }, 350);
  };

  const guardarNuevo = (form) => {
    if (!form.empresa) { showAlert("err:Seleccione la Empresa"); return; }
    if (!form.elibre && !form.depo) { showAlert("err:Ingrese al menos un monto"); return; }
    const monto = parseFloat(form.elibre || form.depo || 0).toFixed(2);
    const nuevo = {
      id:       movs.length + 1,
      fecha:    form.cajaf ? form.cajaf.split("-").reverse().join("/") : "10/03/2026",
      turno:    form.turno || "Mañana",
      motivo:   form.des || (form.modo==="I" ? "Ingreso Caja" : "Egreso Caja"),
      tipo:     form.modo,
      moneda:   form.moneda === "Dolares" ? "US$" : "S/",
      monto,
      usuario:  form.auto || "Smith",
      sucursal: form.sucursal || "Tienda 1b 133",
    };
    setMovs(prev => [nuevo, ...prev]);
    setVista("lista");
    showAlert("ok:Movimiento registrado correctamente");
  };

  const movsFiltrados = movs.filter(m => {
    if (turno   && m.turno !== turno)   return false;
    if (tipoMov && m.tipo  !== tipoMov) return false;
    if (busqueda && !m.motivo.toLowerCase().includes(busqueda.toLowerCase())) return false;
    return true;
  });

  // ── Vista NUEVO ──
  if (vista === "nuevo") {
    return (
      <CajaNuevo
        onRegresar={() => setVista("lista")}
        onGuardar={guardarNuevo}
      />
    );
  }

  // ── Vista LISTA ──
  return (
    <div style={{ fontFamily:"Arial, sans-serif", fontSize:13, padding:16, color:"#212529" }}>

      {/* Alerta */}
      {alert && (
        <div style={{ position:"fixed", top:70, right:20, zIndex:9999,
          background: alert.startsWith("ok:") ? "#28a745" : "#dc3545",
          color:"#fff", padding:"10px 18px", borderRadius:6,
          boxShadow:"0 4px 12px rgba(0,0,0,.2)" }}>
          {alert.startsWith("ok:") ? "✅ " : "⚠️ "}{alert.slice(3)}
        </div>
      )}

      {/* Título con navegación fiel al PHP */}
      <div style={{ fontSize:14, marginBottom:14 }}>
        <b>CAJA: ESTADO</b>
        {" / "}
        {MODOS_VISTA.map(v => (
          <span key={v.key}>
            <span onClick={() => setVistaMode(v.key)}
              style={{ color: vistaMode===v.key ? "#000" : "#17a2b8",
                cursor:"pointer", textDecoration: vistaMode===v.key ? "none" : "underline",
                fontWeight: vistaMode===v.key ? "bold" : "normal" }}>
              {v.label}
            </span>
            {" / "}
          </span>
        ))}
      </div>

      {/* Formulario filtros */}
      <div style={{ background:"#f8f9fa", border:"1px solid #dee2e6", borderRadius:6,
        padding:"10px 14px", marginBottom:18, display:"flex", flexWrap:"wrap",
        alignItems:"center", gap:8 }}>

        <select value={turno} onChange={e=>setTurno(e.target.value)}
          style={{ padding:"4px 8px", fontSize:13, border:"1px solid #ced4da",
            borderRadius:4, background:"#fff", color:"#212529" }}>
          {TURNOS.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}
        </select>

        <select value={empresa} onChange={e=>setEmpresa(e.target.value)}
          style={{ padding:"4px 8px", fontSize:13, border:"1px solid #ced4da",
            borderRadius:4, background:"#fff", color:"#212529" }}>
          {EMPRESAS.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}
        </select>

        <select value={tipoMov} onChange={e=>setTipoMov(e.target.value)}
          style={{ padding:"4px 8px", fontSize:13, border:"1px solid #ced4da",
            borderRadius:4, background:"#fff", color:"#212529" }}>
          {TIPOS_MOV.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}
        </select>

        <input value={busqueda} onChange={e=>setBusqueda(e.target.value)}
          placeholder="Ingrese texto a buscar"
          style={{ padding:"4px 8px", fontSize:13, border:"1px solid #ced4da",
            borderRadius:4, background:"#fff", color:"#212529", minWidth:180 }} />

        <b style={{ fontSize:12 }}>Y/O</b>

        <select value={xDiaMes} onChange={e=>setXDiaMes(e.target.value)}
          style={{ padding:"4px 8px", fontSize:13, border:"1px solid #ced4da",
            borderRadius:4, background:"#fff", color:"#212529" }}>
          {X_DIA_MES.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}
        </select>

        <DP value={fechaFiltro} onChange={setFechaFiltro} placeholder="(Año/Mes)" />

        <button onClick={buscar}
          style={{ background:"#17a2b8", color:"#fff", border:"none",
            borderRadius:4, padding:"5px 14px", cursor:"pointer", fontSize:13 }}>
          🔍
        </button>

        {/* Botón ➕ — navega a vista "nuevo" (caja-nuevo.php) */}
        <button onClick={() => setVista("nuevo")}
          style={{ background:"#17a2b8", color:"#fff", border:"none",
            borderRadius:4, padding:"5px 14px", cursor:"pointer", fontSize:16, fontWeight:"bold" }}>
          ➕
        </button>
      </div>

      {/* Tabla */}
      {loading ? (
        <div style={{ textAlign:"center", padding:40, color:"#888" }}>Cargando...</div>
      ) : (
        <TablaMovs movs={movsFiltrados} headerBg={vistaActual.headerBg} />
      )}
    </div>
  );
}