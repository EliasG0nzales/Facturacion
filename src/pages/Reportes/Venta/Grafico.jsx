import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line, ReferenceLine,
} from "recharts";

// ── Constantes ────────────────────────────────────────────────────
const SUCURSALES = [
  { id: "1", nombre: "Tienda1 >> Tienda 1b 133" },
  { id: "2", nombre: "Tienda2 >> Tienda 1A 119" },
  { id: "3", nombre: "Almacen 1 >> Almacen 2B 167" },
];
const ANIOS = Array.from({ length: 15 }, (_, i) => 2012 + i);
const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

const generarDatos = () =>
  MESES.map((mes) => ({
    mes,
    Venta:  Math.round(Math.random() * 50000 + 10000),
    Compra: Math.round(Math.random() * 30000 + 5000),
    Gastos: Math.round(Math.random() * 10000 + 1000),
  }));

// ── Selector de sucursales con checkboxes ─────────────────────────
function SucursalSelector({ seleccionadas, onChange }) {
  const [open, setOpen] = useState(false);

  const toggle = (id) =>
    onChange(
      seleccionadas.includes(id)
        ? seleccionadas.filter((s) => s !== id)
        : [...seleccionadas, id]
    );

  const label =
    seleccionadas.length === 0
      ? "Seleccionar Sucursal"
      : `${seleccionadas.length} sucursal(es) seleccionada(s)`;

  return (
    <div style={{ position: "relative", display: "inline-block", minWidth: 220 }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          border: "1px solid #ccc", borderRadius: 4, padding: "4px 10px",
          cursor: "pointer", background: "#fff", color: "#333", fontSize: 14,
          userSelect: "none", display: "flex", justifyContent: "space-between",
          alignItems: "center", gap: 8,
        }}
      >
        <span>{label}</span>
        <span style={{ fontSize: 10 }}>▼</span>
      </div>
      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          border: "2px solid #ccc", background: "#fff", color: "#333", zIndex: 100,
        }}>
          {SUCURSALES.map((s) => (
            <label
              key={s.id}
              style={{
                display: "block", padding: "6px 10px",
                borderBottom: "1px dotted #ccc", cursor: "pointer", fontSize: 13,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#4F615E"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#000"; }}
            >
              <input
                type="checkbox"
                value={s.id}
                checked={seleccionadas.includes(s.id)}
                onChange={() => toggle(s.id)}
                style={{ marginRight: 6 }}
              />
              {s.nombre}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Botón volver ──────────────────────────────────────────────────
function BtnVolver({ onClick }) {
  return (
    <div style={{ textAlign: "center", marginTop: 24 }}>
      <button
        onClick={onClick}
        style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 14, color: "#666",
        }}
      >
        ↩ Regresar
      </button>
    </div>
  );
}

// ── PÁGINA: Inicio (3 botones) ────────────────────────────────────
function PaginaInicio({ onNavegar }) {
  const botones = [
    { key: "anual",   emoji: "📅", label: "Anual" },
    { key: "mensual", emoji: "🕐", label: "Mensual" },
    { key: "depto",   emoji: "🌍", label: "Por departamentos" },
  ];

  return (
    <div style={{ padding: "24px 0" }}>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
        {botones.map((b) => (
          <button
            key={b.key}
            onClick={() => onNavegar(b.key)}
            style={{
              display: "inline-block",
              font: "18px Tahoma, Arial, Helvetica, sans-serif",
              color: "#000",
              textDecoration: "none",
              padding: "12px",
              cursor: "pointer",
              border: "1px double #ccc",
              borderRadius: "6px",
              background: "#fff",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#40a2c5", e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fff", e.currentTarget.style.color = "#000")}
          >
            <span style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "22px 36px",
              border: "1px solid orange",
              borderRadius: "6px",
              pointerEvents: "none",
              minWidth: 160,
              gap: 12,
            }}>
              <span style={{ fontSize: 42 }}>{b.emoji}</span>
              <span style={{ fontSize: 16 }}>{b.label}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Estilos tabla ────────────────────────────────────────────────
const thStyle = {
  background: "#1a5276", color: "#fff", padding: "10px 6px",
  fontSize: 13, fontWeight: "bold", textAlign: "center",
  whiteSpace: "nowrap", border: "1px solid #154360",
};
const tdStyle = {
  padding: "7px 6px", fontSize: 13, textAlign: "center",
  borderBottom: "1px solid #ddd", borderRight: "1px solid #eee",
  color: "#333",
};

// ── PÁGINA: Anual ─────────────────────────────────────────────────
function PaginaAnual({ onVolver }) {
  const [anio, setAnio] = useState("");
  const [sucursales, setSucursales] = useState([]);
  const [verCompra, setVerCompra] = useState(false);
  const [verGasto,  setVerGasto]  = useState(false);
  const [resultado, setResultado] = useState(null);

  const handleConsulta = () => {
    if (!anio) { alert("Seleccione un año"); return; }
    if (sucursales.length === 0) { alert("Seleccione al menos una sucursal"); return; }
    const datos = generarDatos();
    const localNombre = SUCURSALES.find((s) => s.id === sucursales[0])?.nombre || "";
    setResultado({ datos, localNombre });
  };

  const totalGeneral = resultado ? resultado.datos.reduce((a, d) => a + d.Venta, 0) : 0;
  const totalCompra  = resultado ? resultado.datos.reduce((a, d) => a + d.Compra, 0) : 0;
  const totalGasto   = resultado ? resultado.datos.reduce((a, d) => a + d.Gastos, 0) : 0;

  // Datos para gráfico de pie (un slice por mes)
  const pieData = resultado
    ? resultado.datos.map((d) => ({ name: d.mes, value: d.Venta }))
    : [];

  const PIE_COLORS = [
    "#17a2b8","#e74c3c","#2ecc71","#f39c12","#9b59b6",
    "#1abc9c","#e67e22","#3498db","#e91e63","#00bcd4","#8bc34a","#ff5722",
  ];

  return (
    <div>
      {/* Filtros */}
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 16 }}>
        <strong style={{ fontSize: 14, color: "#333" }}>ANUALES</strong>
        <select value={anio} onChange={(e) => setAnio(e.target.value)}
          style={{ border: "1px solid #ccc", borderRadius: 4, padding: "4px 8px", fontSize: 14, background: "#fff", color: "#333" }}>
          <option value="">Seleccione</option>
          {ANIOS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <SucursalSelector seleccionadas={sucursales} onChange={setSucursales} />
        <label style={{ fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "#333" }}>
          <input type="checkbox" checked={verCompra} onChange={(e) => setVerCompra(e.target.checked)}
            style={{ width: 14, height: 14, accentColor: "#17a2b8", cursor: "pointer" }} /> Compra
        </label>
        <label style={{ fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "#333" }}>
          <input type="checkbox" checked={verGasto} onChange={(e) => setVerGasto(e.target.checked)}
            style={{ width: 14, height: 14, accentColor: "#17a2b8", cursor: "pointer" }} /> Gastos
        </label>
        <button onClick={handleConsulta} style={{
          background: "#17a2b8", color: "#fff", border: "none", borderRadius: 4,
          padding: "6px 16px", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
        }}>🔍 Consulta</button>
      </div>

      {resultado ? (
        <div id="area-imprimible">
          {/* Local */}
          <div style={{ textAlign: "center", marginBottom: 8, fontSize: 14 }}>
            Local : <strong>{resultado.localNombre}</strong>
          </div>
          <hr style={{ marginBottom: 16, borderColor: "#ddd" }} />

          {/* Gráfico de PIE igual al original */}
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                innerRadius={45}
                label={({ name, value }) => `${name}: S/${value.toLocaleString()}`}
                labelLine={true}
                startAngle={90}
                endAngle={-270}
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `S/ ${v.toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          {/* Tabla de meses - igual al original */}
          <div style={{ overflowX: "auto", marginTop: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  {["Enero","Febrero","Marzo","Abril","Mayo","Junio",
                    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"].map((m) => (
                    <th key={m} style={thStyle}><b>{m}</b></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {resultado.datos.map((d, i) => (
                    <td key={i} style={tdStyle}>{d.Venta.toFixed(2)}</td>
                  ))}
                </tr>
                {verCompra && (
                  <tr style={{ background: "#fffbea" }}>
                    {resultado.datos.map((d, i) => (
                      <td key={i} style={{ ...tdStyle, color: "#b07800" }}>{d.Compra.toFixed(2)}</td>
                    ))}
                  </tr>
                )}
                {verGasto && (
                  <tr style={{ background: "#fff5f5" }}>
                    {resultado.datos.map((d, i) => (
                      <td key={i} style={{ ...tdStyle, color: "#c0392b" }}>{d.Gastos.toFixed(2)}</td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Total General */}
          <div style={{ textAlign: "center", marginTop: 10, fontSize: 14 }}>
            <strong>Total General : {totalGeneral.toFixed(2)}</strong>
            {verCompra && <span style={{ marginLeft: 20, color: "#b07800" }}>Compra : {totalCompra.toFixed(2)}</span>}
            {verGasto  && <span style={{ marginLeft: 20, color: "#c0392b" }}>Gastos : {totalGasto.toFixed(2)}</span>}
          </div>

          {/* Botón Imprimir */}
          <div style={{ textAlign: "center", marginTop: 20, marginBottom: 10 }}>
            <button
              onClick={() => window.print()}
              style={{
                background: "#17a2b8", color: "#fff", border: "none", borderRadius: 4,
                padding: "8px 24px", fontSize: 14, cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 6,
              }}
            >
              🖨️ Imprimir
            </button>
          </div>
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "#aaa", fontSize: 14, marginTop: 32 }}>
          Seleccione un año y sucursal, luego presione Consulta.
        </p>
      )}

      <BtnVolver onClick={onVolver} />
    </div>
  );
}

// ── PÁGINA: Mensual ───────────────────────────────────────────────
function PaginaMensual({ onVolver }) {
  const [anio,       setAnio]       = useState("");
  const [mes,        setMes]        = useState("");
  const [sucursales, setSucursales] = useState([]);
  const [verCompra,  setVerCompra]  = useState(false);
  const [verGasto,   setVerGasto]   = useState(false);
  const [resultado,  setResultado]  = useState(null);

  const MESES_OPTS = [
    { val: "01", label: "Enero" },   { val: "02", label: "Febrero" },
    { val: "03", label: "Marzo" },   { val: "04", label: "Abril" },
    { val: "05", label: "Mayo" },    { val: "06", label: "Junio" },
    { val: "07", label: "Julio" },   { val: "08", label: "Agosto" },
    { val: "09", label: "Setiembre"},{ val: "10", label: "Octubre" },
    { val: "11", label: "Noviembre"},{ val: "12", label: "Diciembre" },
  ];

  // Genera datos por día según mes/año
  const diasEnMes = (a, m) => new Date(parseInt(a), parseInt(m), 0).getDate();

  const generarDatosDiarios = (a, m) => {
    const dias = diasEnMes(a, m);
    return Array.from({ length: dias }, (_, i) => ({
      dia: String(i + 1).padStart(2, "0"),
      Venta:  Math.round(Math.random() * 8000),
      Compra: Math.round(Math.random() * 5000),
      Gastos: Math.round(Math.random() * 2000),
    }));
  };

  const handleConsulta = () => {
    if (!anio)  { alert("Seleccione un año");  return; }
    if (!mes)   { alert("Seleccione un mes");   return; }
    if (sucursales.length === 0) { alert("Seleccione al menos una sucursal"); return; }
    const datos = generarDatosDiarios(anio, mes);
    const localNombre = SUCURSALES.find((s) => s.id === sucursales[0])?.nombre || "";
    const mesLabel = MESES_OPTS.find((m) => m.val === mes)?.label || "";
    setResultado({ datos, localNombre, mesLabel });
  };

  const totalVenta  = resultado ? resultado.datos.reduce((a, d) => a + d.Venta,  0) : 0;
  const totalCompra = resultado ? resultado.datos.reduce((a, d) => a + d.Compra, 0) : 0;
  const totalGasto  = resultado ? resultado.datos.reduce((a, d) => a + d.Gastos, 0) : 0;

  const thD = { background: "#006699", color: "#fff", padding: "5px 4px", fontSize: 11, textAlign: "center", border: "1px solid #005580", whiteSpace: "nowrap" };
  const tdD = { padding: "4px", fontSize: 11, textAlign: "right", border: "1px solid #ccc", whiteSpace: "nowrap" };

  return (
    <div>
      {/* Filtros */}
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 16 }}>
        <strong style={{ fontSize: 14, color: "#333" }}>MENSUAL</strong>

        {/* Año */}
        <select value={anio} onChange={(e) => setAnio(e.target.value)}
          style={{ border: "1px solid #ccc", borderRadius: 4, padding: "4px 8px", fontSize: 14, background: "#fff", color: "#333" }}>
          <option value="">Año</option>
          {ANIOS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>

        {/* Mes */}
        <select value={mes} onChange={(e) => setMes(e.target.value)}
          style={{ border: "1px solid #ccc", borderRadius: 4, padding: "4px 8px", fontSize: 14, background: "#fff", color: "#333" }}>
          <option value="">Mes</option>
          {MESES_OPTS.map((m) => <option key={m.val} value={m.val}>{m.label}</option>)}
        </select>

        {/* Sucursal */}
        <SucursalSelector seleccionadas={sucursales} onChange={setSucursales} />

        {/* Compra / Gastos */}
        <label style={{ fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "#333" }}>
          <input type="checkbox" checked={verCompra} onChange={(e) => setVerCompra(e.target.checked)}
            style={{ width: 14, height: 14, accentColor: "#17a2b8", cursor: "pointer" }} /> Compra
        </label>
        <label style={{ fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "#333" }}>
          <input type="checkbox" checked={verGasto} onChange={(e) => setVerGasto(e.target.checked)}
            style={{ width: 14, height: 14, accentColor: "#17a2b8", cursor: "pointer" }} /> Gastos
        </label>

        {/* Botón */}
        <button onClick={handleConsulta} style={{
          background: "#17a2b8", color: "#fff", border: "none", borderRadius: 4,
          padding: "6px 16px", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
        }}>🔍 Consulta</button>
      </div>

      {resultado ? (
        <div>
          {/* Local */}
          <div style={{ textAlign: "center", marginBottom: 8, fontSize: 14, color: "#333" }}>
            Local : <strong>{resultado.localNombre}</strong>
          </div>
          <hr style={{ marginBottom: 12, borderColor: "#ddd" }} />

          {/* Gráfico de línea por día */}
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={resultado.datos} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#eee" />
              <XAxis
                dataKey="dia"
                tick={{ fontSize: 11, fill: "#333" }}
                tickLine={false}
                axisLine={false}
                label={{ value: resultado.mesLabel + " " + anio, position: "insideBottom", offset: -10, fontSize: 12, fill: "#666" }}
              />
              <YAxis hide={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v, name) => [`S/ ${v.toLocaleString()}`, name]}
                labelFormatter={(l) => `Día ${l}`}
              />
              <Legend verticalAlign="top" />
              <Line type="monotone" dataKey="Venta"  stroke="#D8E63C" strokeWidth={2} dot={{ r: 3, fill: "#D8E63C" }} name="Venta" />
              {verCompra && <Line type="monotone" dataKey="Compra" stroke="#ffc107" strokeWidth={2} dot={{ r: 3 }} name="Compra" />}
              {verGasto  && <Line type="monotone" dataKey="Gastos" stroke="#dc3545" strokeWidth={2} dot={{ r: 3 }} name="Gastos" />}
            </LineChart>
          </ResponsiveContainer>

          <hr style={{ margin: "12px 0", borderColor: "#ddd" }} />

          {/* Tabla días */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", fontSize: 11, width: "100%" }}>
              <thead>
                <tr>
                  <td style={{ ...thD, fontWeight: "bold" }}>Día</td>
                  {resultado.datos.map((d) => (
                    <td key={d.dia} style={thD}>{d.dia}</td>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdD, background: "#f5f5f5", fontWeight: "bold", textAlign: "left" }}>Monto</td>
                  {resultado.datos.map((d, i) => (
                    <td key={i} style={tdD}>{d.Venta.toFixed(2)}</td>
                  ))}
                </tr>
                {verCompra && (
                  <tr>
                    <td style={{ ...tdD, background: "#fffbea", fontWeight: "bold", textAlign: "left", color: "#b07800" }}>Compra</td>
                    {resultado.datos.map((d, i) => (
                      <td key={i} style={{ ...tdD, color: "#b07800" }}>{d.Compra.toFixed(2)}</td>
                    ))}
                  </tr>
                )}
                {verGasto && (
                  <tr>
                    <td style={{ ...tdD, background: "#fff5f5", fontWeight: "bold", textAlign: "left", color: "#c0392b" }}>Gastos</td>
                    {resultado.datos.map((d, i) => (
                      <td key={i} style={{ ...tdD, color: "#c0392b" }}>{d.Gastos.toFixed(2)}</td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totales */}
          <div style={{ textAlign: "center", marginTop: 10, fontSize: 14, color: "#333" }}>
            <strong>Total {totalVenta.toFixed(2)}</strong>
            {verCompra && <span style={{ marginLeft: 20, color: "#b07800" }}>Compra : {totalCompra.toFixed(2)}</span>}
            {verGasto  && <span style={{ marginLeft: 20, color: "#c0392b" }}>Gastos : {totalGasto.toFixed(2)}</span>}
          </div>

          {/* Imprimir */}
          <div style={{ textAlign: "center", marginTop: 20, marginBottom: 10 }}>
            <button onClick={() => window.print()} style={{
              background: "#17a2b8", color: "#fff", border: "none", borderRadius: 4,
              padding: "8px 24px", fontSize: 14, cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 6,
            }}>🖨️ Imprimir</button>
          </div>
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "#aaa", fontSize: 14, marginTop: 32 }}>
          Seleccione año, mes y sucursal, luego presione Consulta.
        </p>
      )}

      <BtnVolver onClick={onVolver} />
    </div>
  );
}

// ── PÁGINA: Por Departamentos ─────────────────────────────────────
const DEPARTAMENTOS = [
  "Amazonas","Ancash","Apurimac","Arequipa","Ayacucho","Cajamarca",
  "Callao","Cusco","Huancavelica","Huánuco","Ica","Junin",
  "La Libertad","Lambayeque","Lima","Loreto","Madre de Dios","Moquegua",
  "Pasco","Piura","Puno","San Martin","Tacna","Tumbes","Ucayali",
];

function PaginaDepartamentos({ onVolver }) {
  const [anio, setAnio] = useState(new Date().getFullYear().toString());
  const navigate = useNavigate();

  // Datos simulados — en producción vendrían de la API
  const [datos] = useState(() => {
    const d = {};
    DEPARTAMENTOS.forEach((dep) => {
      d[dep] = Math.random() > 0.7 ? Math.round(Math.random() * 50000 + 1000) : 0;
    });
    return d;
  });

  const maxVal = Math.max(...Object.values(datos), 1);

  return (
    <div style={{ fontFamily: "Tahoma, Arial, sans-serif" }}>

      {/* Título + selector año */}
      <h2 style={{ textAlign: "center", fontSize: 16, fontWeight: "normal", marginBottom: 16, color: "#333" }}>
        Ventas por Departamentos del{" "}
        <select
          value={anio}
          onChange={(e) => setAnio(e.target.value)}
          style={{ border: "1px solid #ccc", borderRadius: 4, padding: "3px 8px", fontSize: 15, background: "#fff", color: "#333" }}
        >
          {ANIOS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </h2>

      {/* Tabla departamentos */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <tbody>
          {DEPARTAMENTOS.map((dep, i) => {
            const monto = datos[dep] || 0;
            const pct   = maxVal > 0 ? (monto / maxVal) * 100 : 0;
            const bgRow = i % 2 === 0 ? "#f0f0f0" : "#e8e8e8";

            return (
              <tr key={dep}>
                {/* Nombre departamento */}
                <th style={{
                  background: "#1a6e8e", color: "#fff", padding: "10px 14px",
                  fontSize: 12, fontWeight: "bold", textAlign: "center",
                  width: "20%", border: "1px solid #155f7a", letterSpacing: 0.5,
                }}>
                  {dep.toUpperCase()}
                </th>

                {/* Monto + icono flecha */}
                <td style={{
                  background: bgRow, padding: "10px 12px", textAlign: "right",
                  width: "20%", border: "1px solid #ddd", whiteSpace: "nowrap",
                }}>
                  {monto > 0 && (
                    <span style={{ marginRight: 6, color: "#333" }}>
                      S/ {monto.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                    </span>
                  )}
                  <button
                    onClick={() => navigate(`/rep-venta-gen?tipo=31&venta=${encodeURIComponent(dep)}&annnn=${anio}`)}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "#17a2b8", fontSize: 18, padding: 0, lineHeight: 1,
                    }}
                    title={`Ver reporte de ${dep}`}
                  >
                    ↘
                  </button>
                </td>

                {/* Barra de porcentaje */}
                <td style={{
                  background: bgRow, padding: "10px 8px",
                  border: "1px solid #ddd",
                }}>
                  {monto > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        background: "green",
                        width: `${Math.min(pct, 100)}%`,
                        minWidth: 4,
                        height: 20,
                        float: "left",
                      }} />
                      <span style={{ fontSize: 12, color: "#333", whiteSpace: "nowrap" }}>
                        {pct.toFixed(2)}%
                      </span>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <BtnVolver onClick={onVolver} />
    </div>
  );
}

// ── Componente principal con "router" interno ─────────────────────
export default function Grafico() {
  const [pagina, setPagina] = useState("inicio");

  return (
    <div style={{ fontFamily: "Tahoma, Arial, sans-serif", maxWidth: 900, margin: "0", padding: 16 }}>

      {/* Título con ícono de ayuda */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 18, height: 18, borderRadius: "50%", background: "#17a2b8",
          color: "#fff", fontSize: 11, fontWeight: "bold", cursor: "default", flexShrink: 0,
        }}>?</span>
        <span style={{ fontSize: 15, color: "#333" }}>Reporte gráfico</span>
        {pagina !== "inicio" && (
          <button
            onClick={() => setPagina("inicio")}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 15, color: "#888", marginLeft: 4 }}
            title="Regresar"
          >↩</button>
        )}
      </div>

      {pagina === "inicio"  && <PaginaInicio       onNavegar={setPagina} />}
      {pagina === "anual"   && <PaginaAnual         onVolver={() => setPagina("inicio")} />}
      {pagina === "mensual" && <PaginaMensual       onVolver={() => setPagina("inicio")} />}
      {pagina === "depto"   && <PaginaDepartamentos onVolver={() => setPagina("inicio")} />}
    </div>
  );
}