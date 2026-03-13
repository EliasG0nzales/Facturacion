import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Keyframes ────────────────────────────────────────────────────
if (!document.getElementById("estadistica-styles")) {
  const s = document.createElement("style");
  s.id = "estadistica-styles";
  s.innerHTML = `
    @keyframes moveFromBottom {
      from { transform: translateY(40%); opacity: 0.4; }
      to   { transform: translateY(0%);  opacity: 1;   }
    }
    @keyframes smallToBig {
      from { transform: scale(0.1); }
      to   { transform: scale(1);   }
    }
    @keyframes zoomCard {
      0%   { transform: scale(1);    }
      60%  { transform: scale(1.15); }
      100% { transform: scale(1);    }
    }
  `;
  document.head.appendChild(s);
}

// ── Constantes ───────────────────────────────────────────────────
const CARDS = [
  { icon: "fa-chart-line",     titulo: "MARGEN",   subtitulo: "Margen ganancia x sucursal", pagina: "margen"           },
  { icon: "fa-concierge-bell", titulo: "SERVICIO", subtitulo: "Mas Vendido Anual",           pagina: "servicio"         },
  { icon: "fa-boxes",          titulo: "ARTICULO", subtitulo: "Mas Vendido Anual",           pagina: "articulo-anual"   },
  { icon: "fa-chart-pie",      titulo: "ARTICULO", subtitulo: "Mas Vendido x criterio",      pagina: "articulo-crit"    },
  { icon: "fa-user-check",     titulo: "CLIENTE",  subtitulo: "Mas Vendido",                 pagina: "cliente-vendido"  },
  { icon: "fa-user-clock",     titulo: "CLIENTE",  subtitulo: "Mas Adeudado",                pagina: "cliente-deuda"    },
  { icon: "fa-store",          titulo: "CLIENTE",  subtitulo: "por sucursal",                pagina: "cliente-sucursal" },
  { icon: "fa-calendar-week",  titulo: "Ventas",   subtitulo: "x semana",                    pagina: "ventas-semana"    },
  { icon: "fa-building",       titulo: "Ventas",   subtitulo: "x sucursal",                  pagina: "ventas-sucursal"  },
];

const MESES_NOMBRE = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Setiembre","Octubre","Noviembre","Diciembre"];
const MESES_CORTO  = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const ANIOS = Array.from({ length: 15 }, (_, i) => 2012 + i);
const fmt = (n) => n === 0 ? "0.00" : n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ── Estilos tabla ─────────────────────────────────────────────────
const thTop = (bg) => ({ background: bg, color: "#fff", padding: "8px 6px", fontSize: 12, fontWeight: "bold", textAlign: "center", border: "1px solid #ccc" });
const thSub = { background: "#1a6e8e", color: "#fff", padding: "6px 4px", fontSize: 11, fontWeight: "bold", textAlign: "center", border: "1px solid #ccc" };
const tdNum = (color) => ({ padding: "5px 6px", fontSize: 11, textAlign: "right", border: "1px solid #e0e0e0", color: color || "#333" });
const tdDia = (bg) => ({ padding: "5px 8px", fontSize: 11, textAlign: "center", border: "1px solid #e0e0e0", fontWeight: "bold", background: bg || "transparent", color: bg ? "#fff" : "#333", minWidth: 40 });

// ── Datos simulados ───────────────────────────────────────────────
function generarDatosMensual(anio, mes) {
  const diasEnMes = new Date(anio, mes, 0).getDate();
  return Array.from({ length: diasEnMes }, (_, i) => {
    const dia = i + 1;
    const diaSemana = new Date(anio, mes - 1, dia).getDay();
    const tienda1pv = [3,6,7].includes(dia) ? [4213, 605.14, 1898][([3,6,7].indexOf(dia))] : 0;
    const tienda1pc = [3,6,7].includes(dia) ? [3705.91, 530.91, 200][([3,6,7].indexOf(dia))] : 0;
    return {
      dia, diaSemana,
      almacen: { pv: 0, pc: 0, marg: 0 },
      tienda1: { pv: tienda1pv, pc: tienda1pc, marg: tienda1pv - tienda1pc },
      tienda2: { pv: 0, pc: 0, marg: 0 },
    };
  });
}

function generarDatosAnual(anio) {
  return MESES_NOMBRE.map((mes, i) => ({
    mes,
    almacen: { pv: 0, pc: 0, marg: 0 },
    tienda1: i === 1 ? { pv: 800,     pc: 500,     marg: 300     }
           : i === 2 ? { pv: 6716.14, pc: 4436.82, marg: 2279.32 }
           : { pv: 0, pc: 0, marg: 0 },
    tienda2: { pv: 0, pc: 0, marg: 0 },
  }));
}

// ════════════════════════════════════════════════════════════════
// COMPONENTE TARJETA
// ════════════════════════════════════════════════════════════════
function Card({ card, onClick }) {
  const [hovered,  setHovered]  = useState(false);
  const [clicking, setClicking] = useState(false);

  const handleClick = () => {
    setClicking(true);
    setTimeout(() => { setClicking(false); onClick(); }, 450);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 200, height: 300, overflow: "hidden", position: "relative",
        background: hovered || clicking ? "#1B3647" : "#fff",
        boxShadow: "1px 1px 2px rgba(0,0,0,0.2)",
        cursor: "pointer", flexShrink: 0,
        transition: "background 300ms linear",
        animation: clicking ? "zoomCard 400ms ease" : "none",
        zIndex: hovered ? 2 : 1,
      }}
    >
      {/* Ícono */}
      <div style={{
        position: "absolute", width: "100%", height: "50%", top: 0, left: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: hovered || clicking ? "#fff" : "#333",
        transition: "color 300ms linear",
        animation: hovered ? "moveFromBottom 300ms ease forwards" : "none",
      }}>
        <i className={`fas ${card.icon}`} style={{ fontSize: 60 }} />
      </div>

      {/* Título */}
      <div style={{
        position: "absolute", left: 0, width: "100%", height: "50%", top: "50%",
      }}>
        <div style={{
          fontSize: 26, fontWeight: "bold", textAlign: "center",
          color: hovered || clicking ? "#fff" : "#333",
          opacity: 0.85, padding: "16px 0 8px",
          animation: hovered ? "smallToBig 300ms ease forwards" : "none",
          transition: "color 200ms linear",
        }}>
          {card.titulo}
        </div>

        {/* Subtítulo */}
        <div style={{
          textAlign: "center", fontSize: 13,
          color: hovered || clicking ? "#fff" : "#666",
          background: hovered || clicking ? "#01578E" : "transparent",
          position: "absolute", bottom: 0, width: "100%", height: 50,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "0 8px", boxSizing: "border-box",
          animation: hovered ? "moveFromBottom 500ms ease forwards" : "none",
          transition: "background 300ms linear, color 200ms linear",
        }}>
          {card.subtitulo}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// PÁGINA INICIO — tarjetas
// ════════════════════════════════════════════════════════════════
function PaginaInicio({ onNavegar }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", padding: "10px 0 40px" }}>
      {CARDS.map((card, i) => (
        <Card key={i} card={card} onClick={() => onNavegar(card.pagina)} />
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// PÁGINA MARGEN
// ════════════════════════════════════════════════════════════════
function PaginaMargen({ onVolver }) {
  const hoy = new Date();
  const [vista, setVista] = useState("mensual");
  const [anio,  setAnio]  = useState(hoy.getFullYear());
  const [mes,   setMes]   = useState(hoy.getMonth() + 1);

  const [filaHover, setFilaHover] = useState(null);
  const datosMensual = generarDatosMensual(anio, mes);
  const datosAnual   = generarDatosAnual(anio);

  const totalMensual = datosMensual.reduce((acc, d) => {
    acc.almacenPV  += d.almacen.pv;  acc.almacenPC  += d.almacen.pc;
    acc.tienda1PV  += d.tienda1.pv;  acc.tienda1PC  += d.tienda1.pc;
    acc.tienda2PV  += d.tienda2.pv;  acc.tienda2PC  += d.tienda2.pc;
    acc.totalVenta += d.almacen.pv + d.tienda1.pv + d.tienda2.pv;
    acc.totalMarg  += d.almacen.marg + d.tienda1.marg + d.tienda2.marg;
    return acc;
  }, { almacenPV:0, almacenPC:0, tienda1PV:0, tienda1PC:0, tienda2PV:0, tienda2PC:0, totalVenta:0, totalMarg:0 });

  const totalAnual = datosAnual.reduce((acc, d) => {
    acc.totalVenta += d.almacen.pv + d.tienda1.pv + d.tienda2.pv;
    acc.totalMarg  += d.almacen.marg + d.tienda1.marg + d.tienda2.marg;
    return acc;
  }, { totalVenta: 0, totalMarg: 0 });

  return (
    <div style={{ fontFamily: "Tahoma, Arial, sans-serif", fontSize: 13 }}>

      {/* Controles */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 12, flexWrap: "wrap" }}>
        {["mensual","anual"].map((v) => (
          <label key={v} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", color: "#333", fontWeight: vista === v ? "bold" : "normal" }}>
            <input type="radio" name="vista-margen" value={v}
              checked={vista === v} onChange={() => setVista(v)}
              style={{ accentColor: "#17a2b8" }} />
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </label>
        ))}
        <select value={anio} onChange={e => setAnio(Number(e.target.value))}
          style={{ border:"1px solid #ccc", borderRadius:3, padding:"3px 8px", fontSize:13, background:"#fff", color:"#333" }}>
          {ANIOS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        {vista === "mensual" && (
          <select value={mes} onChange={e => setMes(Number(e.target.value))}
            style={{ border:"1px solid #ccc", borderRadius:3, padding:"3px 8px", fontSize:13, background:"#fff", color:"#333" }}>
            {MESES_NOMBRE.map((m, i) => (
              <option key={i+1} value={i+1}>{String(i+1).padStart(2,"0")} {m}</option>
            ))}
          </select>
        )}
      </div>

      {/* Título */}
      <div style={{ marginBottom: 10, fontSize: 14, color: "#333" }}>
        <strong>CONVERTIDO A Soles (S/) (VENTA - COMPRA = MARGEN)
          {vista === "mensual"
            ? ` DE ${MESES_CORTO[mes-1].toUpperCase()} DEL ${anio}`
            : ` DEL ${anio}`}
        </strong>
      </div>

      {/* Tabla */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 900 }}>
          <thead>
            <tr>
              <th style={thTop("#1a6e8e")}>{vista === "mensual" ? MESES_CORTO[mes-1].toUpperCase() : "MES"}</th>
              <th colSpan={3} style={thTop("#1a6e8e")}>ALMACEN</th>
              <th colSpan={3} style={thTop("#1a6e8e")}>TIENDA1</th>
              <th colSpan={3} style={thTop("#1a6e8e")}>TIENDA2</th>
              <th style={thTop("#1a6e8e")}>TOTAL</th>
              <th style={thTop("#28a745")}>TOTAL</th>
            </tr>
            <tr>
              <th style={thSub}>{vista === "mensual" ? "DIA" : ""}</th>
              {["ALMACEN","TIENDA1","TIENDA2"].map(s => (
                [<th key={s+"pv"} style={thSub}>P.V</th>,
                 <th key={s+"pc"} style={thSub}>P.C.</th>,
                 <th key={s+"mg"} style={thSub}>MARG.</th>]
              ))}
              <th style={thSub}>VENTA</th>
              <th style={{ ...thSub, background: "#28a745" }}>MARGEN</th>
            </tr>
          </thead>
          <tbody>
            {vista === "mensual" ? (
              <>
                {datosMensual.map((d, i) => {
                  const esDom = d.diaSemana === 0;
                  const bgDia = esDom ? "#e00" : null;
                  const isHover = filaHover === `m-${d.dia}`;
                  const bgRow = isHover ? "#c8f000" : i % 2 === 0 ? "#fff" : "#f5f5f5";
                  const tv = d.almacen.pv + d.tienda1.pv + d.tienda2.pv;
                  const tm = d.almacen.marg + d.tienda1.marg + d.tienda2.marg;
                  return (
                    <tr key={d.dia} style={{ background: bgRow, cursor: "default" }}
                      onMouseEnter={() => setFilaHover(`m-${d.dia}`)}
                      onMouseLeave={() => setFilaHover(null)}>
                      <td style={tdDia(bgDia)}>{d.dia}</td>
                      <td style={tdNum("#17a2b8")}>{fmt(d.almacen.pv)}</td>
                      <td style={tdNum()}>{fmt(d.almacen.pc)}</td>
                      <td style={tdNum()}>{fmt(d.almacen.marg)}</td>
                      <td style={tdNum(d.tienda1.pv > 0 ? "#17a2b8" : null)}>{fmt(d.tienda1.pv)}</td>
                      <td style={tdNum()}>{fmt(d.tienda1.pc)}</td>
                      <td style={tdNum()}>{fmt(d.tienda1.marg)}</td>
                      <td style={tdNum("#17a2b8")}>{fmt(d.tienda2.pv)}</td>
                      <td style={tdNum()}>{fmt(d.tienda2.pc)}</td>
                      <td style={tdNum()}>{fmt(d.tienda2.marg)}</td>
                      <td style={tdNum(tv > 0 ? "#17a2b8" : null)}>{fmt(tv)}</td>
                      <td style={tdNum()}>{fmt(tm)}</td>
                    </tr>
                  );
                })}
                <tr style={{ background: "#b8d4e8", fontWeight: "bold" }}>
                  <td style={{ ...tdDia(), fontWeight: "bold" }}>Total</td>
                  <td style={tdNum()}>{fmt(totalMensual.almacenPV)}</td>
                  <td style={tdNum()}>{fmt(totalMensual.almacenPC)}</td>
                  <td style={tdNum()}>{fmt(totalMensual.almacenPV - totalMensual.almacenPC)}</td>
                  <td style={tdNum()}>{fmt(totalMensual.tienda1PV)}</td>
                  <td style={tdNum()}>{fmt(totalMensual.tienda1PC)}</td>
                  <td style={tdNum()}>{fmt(totalMensual.tienda1PV - totalMensual.tienda1PC)}</td>
                  <td style={tdNum()}>{fmt(totalMensual.tienda2PV)}</td>
                  <td style={tdNum()}>{fmt(totalMensual.tienda2PC)}</td>
                  <td style={tdNum()}>{fmt(totalMensual.tienda2PV - totalMensual.tienda2PC)}</td>
                  <td style={tdNum()}>{fmt(totalMensual.totalVenta)}</td>
                  <td style={tdNum()}>{fmt(totalMensual.totalMarg)}</td>
                </tr>
              </>
            ) : (
              <>
                {datosAnual.map((d, i) => {
                  const tv = d.almacen.pv + d.tienda1.pv + d.tienda2.pv;
                  const tm = d.almacen.marg + d.tienda1.marg + d.tienda2.marg;
                  const isHover = filaHover === `a-${i}`;
                  const bgRow = isHover ? "#c8f000" : i % 2 === 0 ? "#fff" : "#f5f5f5";
                  return (
                    <tr key={d.mes} style={{ background: bgRow, cursor: "default" }}
                      onMouseEnter={() => setFilaHover(`a-${i}`)}
                      onMouseLeave={() => setFilaHover(null)}>
                      <td style={{ ...tdDia(), color: "#17a2b8", fontWeight: "normal" }}>{d.mes}</td>
                      <td style={tdNum("#17a2b8")}>{fmt(d.almacen.pv)}</td>
                      <td style={tdNum()}>{fmt(d.almacen.pc)}</td>
                      <td style={tdNum()}>{fmt(d.almacen.marg)}</td>
                      <td style={tdNum(d.tienda1.pv > 0 ? "#17a2b8" : null)}>{fmt(d.tienda1.pv)}</td>
                      <td style={tdNum()}>{fmt(d.tienda1.pc)}</td>
                      <td style={tdNum()}>{fmt(d.tienda1.marg)}</td>
                      <td style={tdNum("#17a2b8")}>{fmt(d.tienda2.pv)}</td>
                      <td style={tdNum()}>{fmt(d.tienda2.pc)}</td>
                      <td style={tdNum()}>{fmt(d.tienda2.marg)}</td>
                      <td style={tdNum(tv > 0 ? "#17a2b8" : null)}>{fmt(tv)}</td>
                      <td style={tdNum()}>{fmt(tm)}</td>
                    </tr>
                  );
                })}
                <tr style={{ background: "#b8d4e8", fontWeight: "bold" }}>
                  <td style={{ ...tdDia(), fontWeight: "bold" }}>Total</td>
                  <td colSpan={9} style={tdNum()}></td>
                  <td style={tdNum()}>{fmt(totalAnual.totalVenta)}</td>
                  <td style={tdNum()}>{fmt(totalAnual.totalMarg)}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Regresar */}
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <button onClick={onVolver} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "#5a4fcf", fontSize: 16,
        }}>↩ Regresar</button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// PÁGINA SERVICIO
// ════════════════════════════════════════════════════════════════
function PaginaServicio({ onVolver }) {
  const [filtro,     setFiltro]     = useState("t"); // t=Todos, v=Vendidos, n=No Vendidos
  const [anio,       setAnio]       = useState(new Date().getFullYear());
  const [consultado, setConsultado] = useState(false);
  const [filaHover,  setFilaHover]  = useState(null);

  // Datos simulados — reemplazar con API real
  const SERVICIOS = [
    { cod: "SRV001", nombre: "Consulta médica",       vendido: true,  cantidad: 45, total: 2250.00 },
    { cod: "SRV002", nombre: "Análisis de laboratorio",vendido: true,  cantidad: 30, total: 1500.00 },
    { cod: "SRV003", nombre: "Radiografía",            vendido: false, cantidad: 0,  total: 0       },
    { cod: "SRV004", nombre: "Ecografía",              vendido: true,  cantidad: 12, total: 960.00  },
    { cod: "SRV005", nombre: "Servicio de enfermería", vendido: false, cantidad: 0,  total: 0       },
  ];

  const datosFiltrados = !consultado ? [] : SERVICIOS.filter(s => {
    if (filtro === "v") return s.vendido;
    if (filtro === "n") return !s.vendido;
    return true;
  });

  const thS = { background: "#1a6e8e", color: "#fff", padding: "8px 10px", fontSize: 12, fontWeight: "bold", textAlign: "center", border: "1px solid #ccc" };
  const tdS = (align) => ({ padding: "6px 10px", fontSize: 12, textAlign: align || "left", border: "1px solid #e0e0e0", color: "#333" });

  return (
    <div style={{ fontFamily: "Tahoma, Arial, sans-serif", fontSize: 13 }}>

      {/* Filtros */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
        {[["t","Todos"],["v","Vendidos"],["n","No Vendidos"]].map(([val, label]) => (
          <label key={val} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", color: "#333" }}>
            <input type="radio" name="filtro-servicio" value={val}
              checked={filtro === val} onChange={() => setFiltro(val)}
              style={{ accentColor: "#17a2b8" }} />
            {label}
          </label>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <label style={{ color: "#333" }}>Seleccione el año</label>
        <select value={anio} onChange={e => setAnio(Number(e.target.value))}
          style={{ border: "1px solid #ccc", borderRadius: 3, padding: "4px 8px", fontSize: 13, background: "#fff", color: "#333" }}>
          <option value="">Seleccione</option>
          {ANIOS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <button onClick={() => setConsultado(true)} style={{
          background: "#17a2b8", color: "#fff", border: "none", borderRadius: 4,
          padding: "7px 18px", fontSize: 13, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          🔍 Consulta
        </button>
      </div>

      {/* Tabla resultados */}
      {consultado && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thS}>#</th>
                <th style={thS}>Código</th>
                <th style={thS}>Servicio</th>
                <th style={thS}>Cantidad</th>
                <th style={thS}>Total S/</th>
              </tr>
            </thead>
            <tbody>
              {datosFiltrados.length > 0 ? (
                datosFiltrados.map((s, i) => {
                  const isHover = filaHover === i;
                  return (
                    <tr key={s.cod}
                      style={{ background: isHover ? "#c8f000" : i % 2 === 0 ? "#fff" : "#f5f5f5", cursor: "default" }}
                      onMouseEnter={() => setFilaHover(i)}
                      onMouseLeave={() => setFilaHover(null)}>
                      <td style={tdS("center")}>{i + 1}</td>
                      <td style={tdS("center")}>{s.cod}</td>
                      <td style={tdS()}>{s.nombre}</td>
                      <td style={tdS("right")}>{s.cantidad}</td>
                      <td style={tdS("right")}>{s.total.toFixed(2)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} style={{ ...tdS("center"), color: "#999", padding: "20px" }}>
                    Sin resultados para {anio}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Regresar */}
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <button onClick={onVolver} style={{ background: "none", border: "none", cursor: "pointer", color: "#5a4fcf", fontSize: 16 }}>
          ↩ Regresar
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// ARTICULO — MAS VENDIDO ANUAL
// ════════════════════════════════════════════════════════════════

// Datos reales 2026 — los demás años se generan hasta conectar con API
const ARTICULOS_DATA = {
  2026: [
    { id:137, nombre: "Tinta Hp Hp",                                                        vendido: true,  cantidad: 10, compra: 500.00,   venta: 800.00,   margen: 300.00   },
    { id:131, nombre: 'Monitor 24" ASUS Proart PA248QV IPS FHD sRGB 100%',                  vendido: true,  cantidad: 4,  compra: 3705.91,  venta: 4213.00,  margen: 507.09   },
    { id:138, nombre: "Monitor Curvo Teros TE-3412G 34″ UltraWide WQHD 165Hz 1ms FreeSync", vendido: true,  cantidad: 2,  compra: 200.00,   venta: 1898.00,  margen: 1698.00  },
    { id:100, nombre: 'Monitor LG 22mn430 21.5"',                                            vendido: true,  cantidad: 2,  compra: 530.91,   venta: 605.14,   margen: 74.23    },
    { id:168, nombre: "RTX 5070 PRIME OC 12GB ASUS",                                         vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:236, nombre: "ASUS PRIME B860-PLUS WIFI",                                           vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:134, nombre: "Mouse Logitech G703 ligthspeed wireless black",                        vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:27,  nombre: "Placa madre H510m-b msi",                                             vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:195, nombre: "Rayzen7 5800xt",                                                       vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:63,  nombre: "Procesador Intel Core i5 13400F lga 1700",                            vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:180, nombre: "Core I5 13600k",                                                       vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:221, nombre: "MSI PRO Z790-P DDR4",                                                  vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:158, nombre: "RTX 5060 SHADOW 2X OC 8GB MSI",                                       vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:126, nombre: "Procesador Ryzen 7 5700g",                                             vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:60,  nombre: "Procesador Intel Core i3 12100 lga 1700",                             vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:163, nombre: "RTX 5060 TI GAMING OC 8GB MSI",                                       vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:119, nombre: "Procesador Ryzen 5 5600 3,70ghz",                                     vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:196, nombre: "Rayzen5 7600x",                                                        vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:208, nombre: "ASUS ROG STRIX Z590-E GAMING WIFI",                                   vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:59,  nombre: "Procesador Intel Core i3 12100F lga 1700",                            vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:144, nombre: "MONITOR TEROS TE-2714S",                                               vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:191, nombre: "Rayzen5 5500",                                                          vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:198, nombre: "Rayzen5 8500g",                                                         vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:141, nombre: "MONITOR TEROS TE-2128S",                                               vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:223, nombre: "MSI MAG Z 690 TOMAHAWK WIF DDR4",                                     vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:140, nombre: "MONITOR TEROS TE-2130CS",                                              vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:224, nombre: "NZXT N7 Z790",                                                          vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:159, nombre: "RTX 5060 TWIN EDGE 8GB ZOTAC",                                         vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:170, nombre: "RTX 5070 TI WINGFORCE OC SFF 16GB GIGABYTE",                          vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:69,  nombre: "Procesador Intel Core i7 11700F lga 1200",                            vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:212, nombre: "GIGA BIT B760 M D3HP DDR4",                                            vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:43,  nombre: "Procesador Ryzen 5 4600g 3,70ghz",                                    vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:33,  nombre: 'SSD 512gb T-Force Vulcan Z 2.5" sata 3',                              vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:36,  nombre: "Placa madre B550m pro-vdh wifi msi",                                  vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:35,  nombre: "Placa madre B550m-k gigabyte",                                         vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:156, nombre: "RTX 3070 XC3 ULTRA 8GB EVGA",                                         vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:154, nombre: "RTX 3050 DUAL OC 6GB ASUS",                                            vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:19,  nombre: "Monitor Teros TE- 3194N 27",                                           vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:24,  nombre: "Placa madre H310m pro vdh MSi",                                       vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:172, nombre: "RX 9060 XT SWIFT OC WHITE 16GB XFX",                                  vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:123, nombre: "Monitor teros TE- 2440s",                                              vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:96,  nombre: "Placa madre Asus prime B760-plus ddr5, lga 1700",                     vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:109, nombre: "Switch hdmi 3 a 1 uh-301",                                             vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:204, nombre: "MSI H510M-plus",                                                        vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:51,  nombre: "Fuente de poder gigabyte 650w 80+ bronce",                            vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:234, nombre: "GIGA BIT X 870 EAGLE WIFI 7",                                          vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:77,  nombre: "Memoria USB Kingston DataTraveler Exodia Onyx, 64GB, USB 3.2",        vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:88,  nombre: "Tarjetde video rtx 2060 6gb SZMZ",                                    vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:155, nombre: "RTX 3060 VENTUS 3X 12GB MSI",                                         vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:145, nombre: "MONITOR TEROS TE-2732S",                                               vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:115, nombre: "Memoria flash Micro SDXC Kingston Canvas Go Plus 128gb",              vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:187, nombre: "Core Ulttra5 245k",                                                     vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:66,  nombre: "Procesador Intel Core i5 13600K lga 1700",                            vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:72,  nombre: "Procesador Intel Core i7 12700KF lga 1700",                           vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:28,  nombre: "Placa madre B560m-a Asus",                                             vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:41,  nombre: "Tarjeta de video RTX 3060 gaming oc, 12GB GDDR6",                     vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:30,  nombre: "Placa madre H510m-e asus",                                             vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:78,  nombre: "SSD Kingston 1tb nv2 m.2",                                             vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:169, nombre: "RTX 4070 TI SUPER EAGLE OC ICE 16GB GIGABYTE",                        vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:200, nombre: "Rayzen7 8700g",                                                         vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:23,  nombre: "Placa madre A520m a pro MSi",                                          vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:152, nombre: "RTX 3050 WINDOFORCE OC 6GB GIGABYTE",                                 vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:176, nombre: "Core I5 12600kf",                                                       vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:101, nombre: 'Monitor Teros te-2731s 27" curvo VA, 100hz, fhd',                     vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:215, nombre: "B760M AOURUS ELITE AX",                                                 vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:21,  nombre: 'Monitor Teros TE- 2411S 24" ips, 1920*1080, 100hz, 1ms',             vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:125, nombre: "Placa madre A520M-AII / CSM Asus Prime",                               vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:85,  nombre: "Fuente de poder gigabyte ud 750w 80+ gold",                           vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:136, nombre: "Mouse Logitech G PRO X Superlight 2 wireless lightspeed black",       vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:81,  nombre: "adaptador usb tp link ac600 wi-fi, bluetooth 4.2",                    vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:62,  nombre: "Procesador Intel Core i5 12400F lga 1700",                            vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:216, nombre: "GIGA BIT B760M GAMING WIFI PLUS",                                      vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:148, nombre: "MONITOR XIAOMI G27I",                                                   vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:121, nombre: "Tarjeta de video RTX 3050 gaming x 6gb gddr6",                        vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:182, nombre: "Core I7 13700f",                                                        vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:91,  nombre: "Placa madre B85 LGA 1150 Intel Core 4ta Gen, ddr3",                   vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:235, nombre: "MSI MAG Z890 TOMAHAWK WIFI",                                           vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:229, nombre: "B550 ASUS TUF GAMING B550-PLUS WIFI II",                               vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:167, nombre: "RTX 5070 WINDFORCE OC SFF12GB GIGABYTE",                               vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:192, nombre: "Rayzen5 5600gt",                                                        vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:118, nombre: "SSD WD 480gb green sata 2.5",                                          vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:110, nombre: "Placa madre A620M E socket AM5, ddr5",                                 vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:114, nombre: "Placa madre H610m-g MSI ddr4, lga 1700",                              vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:32,  nombre: "Memoria ram T-Create 16gb kit (2x8gb) ddr4 3200mhz",                  vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:217, nombre: "GIGA BIT B760M BS3 H",                                                  vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:48,  nombre: "Mouse Logitech G203 lightsync rgb 8000 dpi black usb",                vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:105, nombre: "Tarjeta de video RTX 3050 ventus 2x oc, 6GB GDDR6",                  vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:132, nombre: "Estabilizador 1200VA Forza FVR-1222USB 8 tomas",                      vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:58,  nombre: 'Monitor gigabyte 27" G27FC A 165hz curvo',                            vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:47,  nombre: "Memoria ram T-Create 32gb kit (2x16gb) ddr4 3200mhz",                 vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:84,  nombre: "Procesador Intel Core i5 11400 lga 1200",                             vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:103, nombre: "Procesador AMD Ryzen 5 8500g am5",                                    vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:111, nombre: "Tarjeta de video GT 1030 lp ddr4 2gb",                                vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:207, nombre: "B560 M AOURUS ELITE",                                                   vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:157, nombre: "RTX 5060 EAGLE OC 8GB GIGABYTE",                                       vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:45,  nombre: "Procesador Ryzen 5 5500 3,60ghz",                                     vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:184, nombre: "Core I5 14400f",                                                        vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:230, nombre: "ASUS PRIME A620 M-K",                                                   vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:29,  nombre: "Placa madre pro B760m-p ddr4 msi",                                    vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:210, nombre: "MSI PRO H610M-S BBR4",                                                  vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:18,  nombre: 'Monitor Teros TE- 2121S 21.5" ips, 1920*1080, 100hz, 1ms',          vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:227, nombre: "MSI B 550 M PRO VDH WIFI",                                             vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:17,  nombre: 'Monitor Teros TE- 3131 24" ips, 1920*1080, 75hz, curvo',             vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:57,  nombre: 'Monitor gigabyte 27" G27F2 165hz 1ms',                               vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:113, nombre: "Memoria USB Kingston DataTraveler Exodia M, 64GB, USB 3.2",           vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:67,  nombre: "Procesador Intel Core i5 14600KF lga 1700",                           vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:228, nombre: "MSI MAG B550 TOMAHAWK",                                                 vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:201, nombre: "Rayzen9 9950x",                                                         vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:89,  nombre: "Fuente de pode 650w IT Visiou",                                        vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:128, nombre: "Parlante 2.0 gamer usb Halion HA-S261 RGB",                           vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:70,  nombre: "Procesador Intel Core i7 12700F lga 1700",                            vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:166, nombre: "RTX 5070 SHADOW 2X OC 12GB MSI",                                       vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:206, nombre: "MSI MAG B560 M MORAR WIFI",                                            vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:150, nombre: "MONITOR MSI MAG 254F",                                                  vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:135, nombre: "Mouse Logitech G502 HERO 16000 DPI RGB black",                         vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:61,  nombre: "Procesador Intel Core i3 13100 lga 1700",                             vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:112, nombre: "Micro SD kingston canvas 64gb",                                         vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:95,  nombre: "Placa madre Z790-p wifi ddr5, lga 1700",                              vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:175, nombre: "Core I5 12400f",                                                        vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:162, nombre: "RTX 5060 TI VENTUS 2X 8GB MSI",                                        vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:199, nombre: "Rayzen5 8600g",                                                         vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:202, nombre: "PRIME-H510M-R R2.0",                                                    vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:197, nombre: "Rayzen5 8400f",                                                         vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:90,  nombre: "ssd micro fron 240gb sataiii",                                         vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:147, nombre: "MONITOR XIAOMI G27I",                                                   vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:25,  nombre: "Placa madre H410m s2h v2 gigabyte",                                   vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:179, nombre: "Core I3 13100",                                                         vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:178, nombre: "Core I7 12700k",                                                        vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:143, nombre: "MONITOR TEROS TE-2417S",                                                vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:92,  nombre: "Placa madre gigabyte Z790 gaming x ax, lga 1700 ddr5 wi-fi",          vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:86,  nombre: 'Monitor Teros TE- 3130 2 24" ips, 1920*1080, 75hz',                  vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:177, nombre: "Core I7 12700kf",                                                       vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:165, nombre: "RTX 5060 TI VENTUS 2X 16GB MSI",                                       vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:82,  nombre: "Fuente de poder halion 500w",                                           vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:213, nombre: "MSI PRO B760M-P",                                                        vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:186, nombre: "Core I7 14700f",                                                         vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:93,  nombre: "Placa madre gigabyte Z790 UD AC, ddr5, lga 1700 wi-fi",               vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:20,  nombre: "Monitor Teros TE- 3199 27",                                            vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:52,  nombre: "Mouse Logitech G305 inalambrico lightspeed negro",                     vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:231, nombre: "MSI PRO B650 M-P",                                                      vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:130, nombre: 'Monitor 27" ASUS Proart PA278QV 2K WQHD sRGB 100%',                  vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:15,  nombre: 'Monitor Teros TE- 2470G 24" ips, 1920*1080, 165hz, curvo',           vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:226, nombre: "MSI A 520M-A PRO",                                                      vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:188, nombre: "Core Ulttra7 265k",                                                     vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:56,  nombre: 'Monitor Samsung led 27" Odyssey G3 ls27ag320nlxpe 165hz 1ms',        vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:133, nombre: "SSD 512GB M.2 PCIE MP33 TEAM GROUP",                                   vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:122, nombre: "Procesador Ryzen 7 5700x",                                             vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:42,  nombre: "Tarjeta de video RTX 3060 ventus 3x oc, 12GB GDDR6",                 vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:189, nombre: "Rayzen5 4500",                                                           vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:108, nombre: "Cable hdmi 15 metros",                                                  vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:68,  nombre: "Procesador Intel Core i5 14600K lga 1700",                            vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:171, nombre: "RX 580S 16GB BOETEC",                                                   vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:38,  nombre: "Placa madre B75 LGA 1155 Intel Core 2da/3ra Gen, ddr3",               vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:194, nombre: "Rayzen7 5700x",                                                         vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:37,  nombre: "Placa madre H311 LGA 1151 Intel Core 6/7/8/9 Gen, ddr4",             vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:146, nombre: "MONITOR TEROS TE-3215G",                                                vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:54,  nombre: "Mouse Logitech G305 inalambrico lightspeed blanco",                    vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:142, nombre: "MONITOR TEROS TE-2415S",                                                vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:151, nombre: "MONITOR MSI G275L E14",                                                  vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:107, nombre: "Proyector Epson PowerLite E20, 3400 Lúmenes, 1024x768, XGA",          vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:99,  nombre: "ssd 2tb Kingston Fury Renegade m.2 NVMe PcIe",                        vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:74,  nombre: "Procesador Intel Core i7 13700 lga 1700",                             vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:209, nombre: "B660 GAMING X AX DDR4",                                                 vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:153, nombre: "RTX 3050 GAMING X 6GB MSI",                                            vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:55,  nombre: "SSD MSI Spatium M450 500gb m.2 nvme",                                 vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:22,  nombre: "Placa madre A320M-K Asus",                                             vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:160, nombre: "RTX 5060 EAGLE MAX OC 8GB GIGABYTE",                                   vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:222, nombre: "PRO Z790-P WIFE DDR4",                                                  vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:161, nombre: "RTX 5060 GAMING OC 8GB GIGABYTE",                                      vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:193, nombre: "Rayzen7 5700g",                                                         vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:232, nombre: "MSI B650 M GAMING PLUS WIFI",                                           vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:174, nombre: "core I3 121007f",                                                        vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:50,  nombre: "Fuente de poder gigabyte 550w 80+ bronce",                            vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:219, nombre: "GIGA BIT B760 GAMING X AX",                                             vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:31,  nombre: "Tarjeta de video RTX 3060 ventus 2x oc, 12GB GDDR6",                 vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:116, nombre: "Micro SD kingston canvas 128gb",                                        vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:16,  nombre: 'Monitor Teros TE- 2711s 27" ips, 1920*1080, 100hz, 1ms',             vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:87,  nombre: "tarjeta de video radeon rx580 8gb Jie Shou",                          vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:2,   nombre: "Procesador Intel Core I7-10700 2.90 ghz/16mb lga 1200",              vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:124, nombre: "Monitor Teros TE-2401s",                                               vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:104, nombre: 'Monitor Lg 24mq400-b 23.8" ips fhd',                                 vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:214, nombre: "ASUS PRIME B760M-A",                                                    vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:183, nombre: "Core I3 14100f",                                                        vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:190, nombre: "Rayzen3 5300g",                                                         vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:75,  nombre: "Procesador Intel Core i7 14700KF lga 1700",                           vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:225, nombre: "NZXT N7 Z790",                                                          vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:129, nombre: "Mouse gamer + pad Halion Alaska HA-920p",                              vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:79,  nombre: "Case 1st player dk-d4 blanco 4 cooler rgb vidrio templado",           vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:73,  nombre: "Procesador Intel Core i7 13700F lga 1700",                            vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:40,  nombre: "Tarjeta de video RTX 3060 asus dual, 12GB GDDR6",                    vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:39,  nombre: "Procesador Intel Core i5 10400F 2,9ghz",                             vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:46,  nombre: "Placa madre B450m ds3h gigabyte",                                     vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:120, nombre: 'Monitor LG 24gq50f 24" va 165hz FHD',                                vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:139, nombre: "Monitor Curvo Gaming TEROS TE-3412G",                                  vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:233, nombre: "GIGA BIT B840 M EAGLE WIFI 6",                                         vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:203, nombre: "MSI H510M-BII",                                                         vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:71,  nombre: "Procesador Intel Core i7 12700 lga 1700",                             vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:97,  nombre: 'Monitor Teros TE- 2765g 27" curvo va, 2560x1440 qhd, 165hz, 1ms',   vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:34,  nombre: "Case micro atx Teros Te-1028s, mini tower 250w",                      vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:218, nombre: "GIGA BIT B760M B3 HP",                                                  vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:64,  nombre: "Procesador Intel Core i5 13400 lga 1700",                             vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:205, nombre: "PRIME B560m-A",                                                         vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:117, nombre: "SSD MSI Spatium M450 1tb PCIe 4.0 nvme m.2",                          vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:211, nombre: "B760M-F MAXSUM",                                                        vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:127, nombre: "Fuente de poder P650G Gigabyte 650w 80+ gold",                         vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:102, nombre: 'Monitor Teros te-2123s 21.45" ips, fhd, 100hz, speakers',            vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:220, nombre: "B760 AOURUS ELITE AX",                                                  vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:98,  nombre: 'Monitor Teros TE- 2766g 27" curvo fhd 180hz',                        vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:185, nombre: "Core I7 14700",                                                         vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:80,  nombre: "Tarjeta de video gtx 1650 - d6 ventus xs msi",                        vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:106, nombre: "Combo gamer 4 en 1 mack ha-875c rgb halion",                           vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:149, nombre: "MONITOR XIAOMI G27QI",                                                  vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:49,  nombre: "Kit teclado + mouse Logitech MK120 usb",                              vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:94,  nombre: "Placa madre Z790 Aorus elite ax",                                     vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:44,  nombre: "Procesador Ryzen 5 5600g 3,90ghz",                                   vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:173, nombre: "RX 9070 XT PRIME OC 16GB ASUS",                                        vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:164, nombre: "RTX 5060 TI TWIN EDGE 16GB ZOTAC",                                     vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:76,  nombre: "Procesador Intel Core i7 14700K lga 1700",                            vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:181, nombre: "Core I7 13700",                                                         vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:65,  nombre: "Procesador Intel Core i5 12600K lga 1700",                            vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
    { id:83,  nombre: "Estabilizador 1000VA Forza FVR-1012 4 tomas",                         vendido: false, cantidad: 0,  compra: 0,        venta: 0,        margen: 0        },
  ],
};

// Para años sin datos específicos, reutiliza los del 2026 con cantidades en 0
function getArticulosAnio(anio) {
  return ARTICULOS_DATA[anio] || ARTICULOS_DATA[2026].map(a => ({ ...a, vendido: false, cantidad: 0, compra: 0, venta: 0, margen: 0 }));
}

// Datos mensuales del artículo id=137 (Tinta Hp) año 2026 como ejemplo real
// Los demás artículos mostrarán todo en 0 hasta conectar con API
const ARTICULO_MENSUAL_DATA = {
  "2026-137": [
    { mes: "Enero",      cantidad: 10, monto: 800.00, t1: { cant: 6, monto: 480.00 }, t2: { cant: 2, monto: 160.00 }, alm: { cant: 2, monto: 160.00 } },
    { mes: "Febrero",    cantidad: 0,  monto: 0,      t1: { cant: 0, monto: 0 },      t2: { cant: 0, monto: 0 },      alm: { cant: 0, monto: 0 } },
    { mes: "Marzo",      cantidad: 0,  monto: 0,      t1: { cant: 0, monto: 0 },      t2: { cant: 0, monto: 0 },      alm: { cant: 0, monto: 0 } },
    { mes: "Abril",      cantidad: 0,  monto: 0,      t1: { cant: 0, monto: 0 },      t2: { cant: 0, monto: 0 },      alm: { cant: 0, monto: 0 } },
    { mes: "Mayo",       cantidad: 0,  monto: 0,      t1: { cant: 0, monto: 0 },      t2: { cant: 0, monto: 0 },      alm: { cant: 0, monto: 0 } },
    { mes: "Junio",      cantidad: 0,  monto: 0,      t1: { cant: 0, monto: 0 },      t2: { cant: 0, monto: 0 },      alm: { cant: 0, monto: 0 } },
    { mes: "Julio",      cantidad: 0,  monto: 0,      t1: { cant: 0, monto: 0 },      t2: { cant: 0, monto: 0 },      alm: { cant: 0, monto: 0 } },
    { mes: "Agosto",     cantidad: 0,  monto: 0,      t1: { cant: 0, monto: 0 },      t2: { cant: 0, monto: 0 },      alm: { cant: 0, monto: 0 } },
    { mes: "Setiembre",  cantidad: 0,  monto: 0,      t1: { cant: 0, monto: 0 },      t2: { cant: 0, monto: 0 },      alm: { cant: 0, monto: 0 } },
    { mes: "Octubre",    cantidad: 0,  monto: 0,      t1: { cant: 0, monto: 0 },      t2: { cant: 0, monto: 0 },      alm: { cant: 0, monto: 0 } },
    { mes: "Noviembre",  cantidad: 0,  monto: 0,      t1: { cant: 0, monto: 0 },      t2: { cant: 0, monto: 0 },      alm: { cant: 0, monto: 0 } },
    { mes: "Diciembre",  cantidad: 0,  monto: 0,      t1: { cant: 0, monto: 0 },      t2: { cant: 0, monto: 0 },      alm: { cant: 0, monto: 0 } },
  ],
};

function getMensualArticulo(anio, id) {
  const key = `${anio}-${id}`;
  if (ARTICULO_MENSUAL_DATA[key]) return ARTICULO_MENSUAL_DATA[key];
  return ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Setiembre","Octubre","Noviembre","Diciembre"].map(mes => ({
    mes, cantidad: 0, monto: 0,
    t1: { cant: 0, monto: 0 }, t2: { cant: 0, monto: 0 }, alm: { cant: 0, monto: 0 },
  }));
}

function PaginaArticuloMensual({ articulo, onVolver }) {
  const datos = getMensualArticulo(articulo.anio, articulo.id);
  const totCant  = datos.reduce((s, d) => s + d.cantidad, 0);
  const totMonto = datos.reduce((s, d) => s + d.monto,    0);

  const thS  = { background: "#1a6e8e", color: "#fff", padding: "8px 10px", fontSize: 12, fontWeight: "bold", textAlign: "center", border: "1px solid #ccc" };
  const tdS  = (align) => ({ padding: "6px 10px", fontSize: 12, textAlign: align || "left", border: "1px solid #e0e0e0", color: "#333" });

  return (
    <div style={{ fontFamily: "Tahoma, Arial, sans-serif", fontSize: 13 }}>
      {/* Título */}
      <div style={{ textAlign: "center", marginBottom: 6 }}>
        <div style={{ fontSize: 18, fontWeight: "bold", color: "#222" }}>
          REPORTE MENSUAL DE VENTAS DEL AÑO {articulo.anio}
        </div>
        <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>{articulo.nombre}</div>
        <hr style={{ margin: "10px 0", borderColor: "#ccc" }} />
      </div>

      {/* Tabla */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thS}>Mes</th>
              <th style={thS}>Cantidad</th>
              <th style={thS}>S/.</th>
              <th style={thS}>Tienda1</th>
              <th style={thS}>Tienda2</th>
              <th style={thS}>Almacen 1</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((d, i) => (
              <tr key={d.mes} style={{ background: i % 2 === 0 ? "#fff" : "#f5f5f5" }}>
                <td style={tdS()}>{d.mes}</td>
                <td style={tdS("center")}>{d.cantidad}</td>
                <td style={tdS("right")}>{fmt(d.monto)}</td>
                <td style={tdS("center")}>({d.t1.cant}) S/.{fmt(d.t1.monto)}</td>
                <td style={tdS("center")}>({d.t2.cant}) S/.{fmt(d.t2.monto)}</td>
                <td style={tdS("center")}>({d.alm.cant}) S/.{fmt(d.alm.monto)}</td>
              </tr>
            ))}
            {/* Total */}
            <tr style={{ background: "#b8d4e8", fontWeight: "bold" }}>
              <td style={{ ...tdS(), fontWeight: "bold" }}>Total General : {totCant}</td>
              <td style={tdS("center")}></td>
              <td style={{ ...tdS("right"), fontWeight: "bold" }}>{fmt(totMonto)}</td>
              <td colSpan={3}></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Imprimir + Regresar */}
      <div style={{ textAlign: "center", marginTop: 24, display: "flex", justifyContent: "center", gap: 20 }}>
        <button onClick={() => window.print()} style={{
          background: "#17a2b8", color: "#fff", border: "none", borderRadius: 4,
          padding: "7px 18px", fontSize: 13, cursor: "pointer",
        }}>🖨️ Imprimir</button>
        <button onClick={onVolver} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "#5a4fcf", fontSize: 15,
          display: "inline-flex", alignItems: "center", gap: 6,
        }}>↩ Regresar</button>
      </div>
    </div>
  );
}

function PaginaArticuloAnual({ onVolver }) {
  const [filtro,          setFiltro]          = useState("t");
  const [anio,            setAnio]            = useState(new Date().getFullYear());
  const [consultado,      setConsultado]      = useState(false);
  const [filaHover,       setFilaHover]       = useState(null);
  const [articuloDetalle, setArticuloDetalle] = useState(null); // { id, nombre, anio }

  const thS  = { background: "#1a6e8e", color: "#fff", padding: "8px 10px", fontSize: 12, fontWeight: "bold", textAlign: "center", border: "1px solid #ccc" };
  const tdS  = (align) => ({ padding: "6px 10px", fontSize: 12, textAlign: align || "left", border: "1px solid #e0e0e0", color: "#333" });
  const tdSR = { padding: "6px 10px", fontSize: 12, textAlign: "right", border: "1px solid #e0e0e0", color: "#333" };

  const todos = getArticulosAnio(anio);
  const datos = !consultado ? [] : todos.filter(a => {
    if (filtro === "v") return a.vendido;
    if (filtro === "n") return !a.vendido;
    return true;
  });

  // Totales
  const totCantidad = datos.reduce((s, a) => s + a.cantidad, 0);
  const totCompra   = datos.reduce((s, a) => s + a.compra,   0);
  const totVenta    = datos.reduce((s, a) => s + a.venta,    0);
  const totMargen   = datos.reduce((s, a) => s + a.margen,   0);

  if (articuloDetalle) {
    return <PaginaArticuloMensual articulo={articuloDetalle} onVolver={() => setArticuloDetalle(null)} />;
  }

  return (
    <div style={{ fontFamily: "Tahoma, Arial, sans-serif", fontSize: 13 }}>

      {/* Filtros radio */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", marginBottom: 14 }}>
        {[["t","Todos"],["v","Vendidos"],["n","No Vendidos"]].map(([val, label]) => (
          <label key={val} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", color: "#333" }}>
            <input type="radio" name="filtro-art-anual" value={val}
              checked={filtro === val} onChange={() => { setFiltro(val); setConsultado(false); }}
              style={{ accentColor: "#17a2b8" }} />
            {label}
          </label>
        ))}
      </div>

      {/* Selector año + Consulta */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <label style={{ color: "#333" }}>Seleccione el año</label>
        <select value={anio} onChange={e => { setAnio(Number(e.target.value)); setConsultado(false); }}
          style={{ border: "1px solid #ccc", borderRadius: 3, padding: "4px 8px", fontSize: 13, background: "#fff", color: "#333" }}>
          {ANIOS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <button onClick={() => setConsultado(true)} style={{
          background: "#17a2b8", color: "#fff", border: "none", borderRadius: 4,
          padding: "7px 18px", fontSize: 13, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          🔍 Consulta
        </button>
      </div>

      {/* Tabla */}
      {consultado && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thS}>NRO</th>
                <th style={thS}>CANTIDAD</th>
                <th style={thS}>ARTICULOS</th>
                <th style={thS}>COMPRA S/</th>
                <th style={thS}>VENTA S/</th>
                <th style={thS}>MARGEN S/</th>
              </tr>
            </thead>
            <tbody>
              {datos.length > 0 ? (
                <>
                  {datos.map((a, i) => {
                    const isHover = filaHover === i;
                    return (
                      <tr key={a.id || i}
                        style={{ background: isHover ? "#c8f000" : i % 2 === 0 ? "#fff" : "#f5f5f5", cursor: "default" }}
                        onMouseEnter={() => setFilaHover(i)}
                        onMouseLeave={() => setFilaHover(null)}>
                        <td style={tdS("center")}>{i + 1}</td>
                        <td style={{ ...tdSR, cursor: "pointer" }}>
                          <span
                            onClick={() => setArticuloDetalle({ id: a.id, nombre: a.nombre, anio })}
                            style={{ color: "#1a6e8e", textDecoration: "underline", cursor: "pointer" }}>
                            {a.cantidad}
                          </span>
                        </td>
                        <td style={tdS()}>{a.nombre}</td>
                        <td style={tdSR}>{a.compra  > 0 ? fmt(a.compra)  : "0.00"}</td>
                        <td style={tdSR}>{a.venta   > 0 ? fmt(a.venta)   : "0.00"}</td>
                        <td style={tdSR}>{a.margen  > 0 ? fmt(a.margen)  : "0.00"}</td>
                      </tr>
                    );
                  })}
                  {/* Fila totales */}
                  <tr style={{ background: "#b8d4e8", fontWeight: "bold" }}>
                    <td colSpan={2} style={{ ...tdS("center"), fontWeight: "bold" }}>TOTAL</td>
                    <td style={tdS()}></td>
                    <td style={{ ...tdSR, fontWeight: "bold" }}>{fmt(totCompra)}</td>
                    <td style={{ ...tdSR, fontWeight: "bold" }}>{fmt(totVenta)}</td>
                    <td style={{ ...tdSR, fontWeight: "bold" }}>{fmt(totMargen)}</td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 20, color: "#999" }}>
                    Sin resultados para el año {anio}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Regresar */}
      <div style={{ textAlign: "center", marginTop: 30 }}>
        <button onClick={onVolver} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "#5a4fcf", fontSize: 15,
          display: "inline-flex", alignItems: "center", gap: 6,
        }}>↩ Regresar</button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// PÁGINAS PENDIENTES (placeholder)
// ════════════════════════════════════════════════════════════════
function PaginaPendiente({ titulo, onVolver }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 0", fontFamily: "Tahoma, Arial, sans-serif" }}>
      <p style={{ fontSize: 15, color: "#999" }}>{titulo} — pendiente de configuración.</p>
      <button onClick={onVolver} style={{
        background: "none", border: "none", cursor: "pointer",
        color: "#5a4fcf", fontSize: 16, marginTop: 16,
      }}>↩ Regresar</button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ════════════════════════════════════════════════════════════════
export default function Estadistica() {
  const [pagina, setPagina] = useState("inicio");

  const paginaActual = CARDS.find(c => c.pagina === pagina);

  return (
    <div style={{ fontFamily: "Tahoma, Arial, sans-serif" }}>

      {/* Encabezado */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 18, height: 18, borderRadius: "50%", background: "#17a2b8",
          color: "#fff", fontSize: 11, fontWeight: "bold",
        }}>?</span>
        <strong style={{ fontSize: 14, color: "#333" }}>ESTADISTICAS</strong>
        {pagina !== "inicio" && (
          <button onClick={() => setPagina("inicio")} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#5a4fcf", fontSize: 15, marginLeft: 8,
          }}>↩</button>
        )}
        {paginaActual && (
          <span style={{ color: "#999", fontSize: 13 }}>
            &gt;&gt; {paginaActual.titulo} — {paginaActual.subtitulo}
          </span>
        )}
      </div>

      {/* Contenido */}
      {pagina === "inicio"          && <PaginaInicio onNavegar={setPagina} />}
      {pagina === "margen"          && <PaginaMargen onVolver={() => setPagina("inicio")} />}
      {pagina === "servicio"        && <PaginaServicio onVolver={() => setPagina("inicio")} />}
      {pagina === "articulo-anual"  && <PaginaArticuloAnual onVolver={() => setPagina("inicio")} />}
      {pagina === "articulo-crit"   && <PaginaPendiente titulo="ARTICULO - Mas Vendido x criterio"  onVolver={() => setPagina("inicio")} />}
      {pagina === "cliente-vendido" && <PaginaPendiente titulo="CLIENTE - Mas Vendido"              onVolver={() => setPagina("inicio")} />}
      {pagina === "cliente-deuda"   && <PaginaPendiente titulo="CLIENTE - Mas Adeudado"             onVolver={() => setPagina("inicio")} />}
      {pagina === "cliente-sucursal"&& <PaginaPendiente titulo="CLIENTE - por sucursal"             onVolver={() => setPagina("inicio")} />}
      {pagina === "ventas-semana"   && <PaginaPendiente titulo="Ventas - x semana"                  onVolver={() => setPagina("inicio")} />}
      {pagina === "ventas-sucursal" && <PaginaPendiente titulo="Ventas - x sucursal"                onVolver={() => setPagina("inicio")} />}

    </div>
  );
}