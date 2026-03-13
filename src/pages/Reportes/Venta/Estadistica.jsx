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
// Lista base de artículos (para años sin ventas, todos en 0)
function getListaBase() {
  return ARTICULOS_DATA[2026].map(a => ({ ...a, vendido: false, cantidad: 0, compra: 0, venta: 0, margen: 0 }));
}

// Datos reales 2024 — ordenados por cantidad descendente
const VENDIDOS_2024 = [
  { id:206, nombre: "Monitor Teros te-2123s 21.45\" ips, fhd, 100hz, speakers",            cantidad: 53, compra: 12863.18, venta: 14850.00, margen: 1986.82 },
  { id:38,  nombre: "Placa madre B75 LGA 1155 Intel Core 2da/3ra Gen, ddr3",               cantidad: 34, compra: 6290.00,  venta: 7440.00,  margen: 1150.00 },
  { id:37,  nombre: "Placa madre H311 LGA 1151 Intel Core 6/7/8/9 Gen, ddr4",              cantidad: 33, compra: 4125.00,  venta: 4763.19,  margen: 638.19  },
  { id:175, nombre: "Tarjeta de video RTX 3060 ventus 2x oc, 12GB GDDR6",                  cantidad: 20, compra: 24312.82, venta: 26950.00, margen: 2637.18 },
  { id:189, nombre: "Procesador Ryzen 5 4600g 3,70ghz",                                    cantidad: 17, compra: 6485.53,  venta: 7320.00,  margen: 834.47  },
  { id:86,  nombre: "Monitor Teros TE- 3131 24\" ips, 1920*1080, 75hz, curvo",             cantidad: 16, compra: 4357.03,  venta: 5199.00,  margen: 841.97  },
  { id:105, nombre: "Tarjeta de video RTX 3050 ventus 2x oc, 6GB GDDR6",                   cantidad: 13, compra: 9990.87,  venta: 11040.00, margen: 1049.13 },
  { id:27,  nombre: "Placa madre H510m-b msi",                                              cantidad: 12, compra: 2800.69,  venta: 3175.00,  margen: 374.31  },
  { id:45,  nombre: "Procesador Ryzen 5 5500 3,60ghz",                                     cantidad: 10, compra: 3589.98,  venta: 4125.20,  margen: 535.22  },
  { id:220, nombre: "Monitor Teros TE- 2711s 27\" ips, 1920*1080, 100hz, 1ms",             cantidad: 10, compra: 3599.22,  venta: 4149.00,  margen: 549.78  },
  { id:30,  nombre: "Placa madre H510m-e asus",                                             cantidad: 9,  compra: 2545.64,  venta: 2707.00,  margen: 161.36  },
  { id:120, nombre: "SSD 512gb TForce Vulcan Z 2.5\" sata 3",                              cantidad: 8,  compra: 936.66,   venta: 1070.00,  margen: 133.34  },
  { id:23,  nombre: "Placa madre A520m a pro MSi",                                          cantidad: 8,  compra: 1690.19,  venta: 1989.88,  margen: 299.69  },
  { id:21,  nombre: "Monitor Teros TE- 2411S 24\" ips, 1920*1080, 100hz, 1ms",             cantidad: 7,  compra: 2026.20,  venta: 2409.00,  margen: 382.80  },
  { id:15,  nombre: "Monitor Teros TE- 2470G 24\" ips, 1920*1080, 165hz, curvo",           cantidad: 7,  compra: 2745.13,  venta: 3186.00,  margen: 440.87  },
  { id:218, nombre: "Fuente de poder gigabyte 550w 80+ bronce",                             cantidad: 7,  compra: 1417.42,  venta: 1610.00,  margen: 192.58  },
  { id:64,  nombre: "Procesador Intel Core i7 11700F lga 1200",                             cantidad: 7,  compra: 4845.91,  venta: 6000.00,  margen: 1154.09 },
  { id:78,  nombre: "SSD Kingston 1tb nv2 m.2",                                             cantidad: 6,  compra: 1470.00,  venta: 1560.00,  margen: 90.00   },
  { id:18,  nombre: "Monitor Teros TE- 2121S 21.5\" ips, 1920*1080, 100hz, 1ms",           cantidad: 6,  compra: 1440.69,  venta: 1768.00,  margen: 327.31  },
  { id:48,  nombre: "Mouse Logitech G203 lightsync rgb 8000 dpi black usb",                 cantidad: 5,  compra: 511.62,   venta: 574.80,   margen: 63.18   },
  { id:222, nombre: "Placa madre B550m pro-vdh wifi msi",                                   cantidad: 4,  compra: 1417.02,  venta: 1680.00,  margen: 262.98  },
  { id:223, nombre: "Placa madre B550m-k gigabyte",                                         cantidad: 4,  compra: 1226.55,  venta: 1460.00,  margen: 233.45  },
  { id:91,  nombre: "Placa madre H310m pro vdh MSi",                                        cantidad: 4,  compra: 800.00,   venta: 1040.00,  margen: 240.00  },
  { id:51,  nombre: "Fuente de poder gigabyte 650w 80+ bronce",                             cantidad: 4,  compra: 923.69,   venta: 1112.34,  margen: 188.65  },
  { id:85,  nombre: "Fuente de poder gigabyte ud 750w 80+ gold",                            cantidad: 4,  compra: 1642.62,  venta: 1805.00,  margen: 162.38  },
  { id:47,  nombre: "Memoria ram T-Create 32gb kit (2x16gb) ddr4 3200mhz",                  cantidad: 4,  compra: 1023.52,  venta: 1200.00,  margen: 176.48  },
  { id:103, nombre: "Monitor Teros TE- 3194N 27",                                           cantidad: 3,  compra: 1730.88,  venta: 1859.00,  margen: 128.12  },
  { id:77,  nombre: "Memoria USB Kingston DataTraveler Exodia Onyx, 64GB, USB 3.2",         cantidad: 3,  compra: 48.00,    venta: 60.00,    margen: 12.00   },
  { id:32,  nombre: "Memoria ram T-Create 16gb kit (2x8gb) ddr4 3200mhz",                   cantidad: 3,  compra: 442.24,   venta: 500.00,   margen: 57.76   },
  { id:20,  nombre: "Monitor Teros TE- 3199 27",                                             cantidad: 3,  compra: 1206.17,  venta: 1360.00,  margen: 153.83  },
  { id:84,  nombre: "Procesador Intel Core i5 10400F 2,9ghz",                               cantidad: 3,  compra: 1331.17,  venta: 1420.00,  margen: 88.83   },
  { id:215, nombre: "Procesador Ryzen 5 5600g 3,90ghz",                                     cantidad: 3,  compra: 1560.50,  venta: 1710.00,  margen: 149.50  },
  { id:28,  nombre: "Placa madre B560m-a Asus",                                              cantidad: 2,  compra: 719.89,   venta: 840.00,   margen: 120.11  },
  { id:29,  nombre: "Placa madre pro B760m-p ddr4 msi",                                     cantidad: 2,  compra: 841.42,   venta: 930.00,   margen: 88.58   },
  { id:224, nombre: "Tarjeta de video gtx 1650 - d6 ventus xs msi",                         cantidad: 2,  compra: 1238.00,  venta: 1340.00,  margen: 102.00  },
  { id:225, nombre: "Estabilizador 1000VA Forza FVR-1012 4 tomas",                          cantidad: 2,  compra: 76.00,    venta: 100.00,   margen: 24.00   },
  { id:122, nombre: "Procesador Ryzen 5 5600 3,70ghz",                                      cantidad: 1,  compra: 508.95,   venta: 590.00,   margen: 81.05   },
  { id:109, nombre: "Switch hdmi 3 a 1 uh-301",                                             cantidad: 1,  compra: 40.00,    venta: 50.00,    margen: 10.00   },
  { id:88,  nombre: "Tarjetde video rtx 2060 6gb SZMZ",                                     cantidad: 1,  compra: 850.00,   venta: 1000.00,  margen: 150.00  },
  { id:81,  nombre: "adaptador usb tp link ac600 wi-fi, bluetooth 4.2",                     cantidad: 1,  compra: 40.00,    venta: 50.00,    margen: 10.00   },
  { id:25,  nombre: "Placa madre B85 LGA 1150 Intel Core 4ta Gen, ddr3",                    cantidad: 1,  compra: 140.00,   venta: 199.00,   margen: 59.00   },
  { id:114, nombre: "Placa madre H610m-g MSI ddr4, lga 1700",                               cantidad: 1,  compra: 280.93,   venta: 320.00,   margen: 39.07   },
  { id:84,  nombre: "Procesador Intel Core i5 11400 lga 1200",                              cantidad: 1,  compra: 550.00,   venta: 600.00,   margen: 50.00   },
  { id:89,  nombre: "Fuente de pode 650w IT Visiou",                                        cantidad: 1,  compra: 103.35,   venta: 140.00,   margen: 36.65   },
  { id:90,  nombre: "ssd micro fron 240gb sataiii",                                         cantidad: 1,  compra: 60.00,    venta: 80.00,    margen: 20.00   },
  { id:87,  nombre: "Monitor Teros TE- 3130 2 24\" ips, 1920*1080, 75hz",                  cantidad: 1,  compra: 275.00,   venta: 320.00,   margen: 45.00   },
  { id:82,  nombre: "Fuente de poder halion 500w",                                           cantidad: 1,  compra: 50.00,    venta: 60.00,    margen: 10.00   },
  { id:42,  nombre: "Tarjeta de video RTX 3060 ventus 3x oc, 12GB GDDR6",                  cantidad: 1,  compra: 1257.62,  venta: 1480.00,  margen: 222.38  },
  { id:108, nombre: "Cable hdmi 15 metros",                                                  cantidad: 1,  compra: 35.00,    venta: 45.00,    margen: 10.00   },
  { id:107, nombre: "Proyector Epson PowerLite E20, 3400 Lúmenes, 1024x768, XGA",           cantidad: 1,  compra: 1620.00,  venta: 1790.00,  margen: 170.00  },
  { id:99,  nombre: "ssd 2tb Kingston Fury Renegade m.2 NVMe PcIe",                         cantidad: 1,  compra: 600.00,   venta: 720.00,   margen: 120.00  },
  { id:153, nombre: "SSD MSI Spatium M450 500gb m.2 nvme",                                  cantidad: 1,  compra: 128.86,   venta: 150.00,   margen: 21.14   },
  { id:171, nombre: "tarjeta de video radeon rx580 8gb Jie Shou",                           cantidad: 1,  compra: 330.00,   venta: 450.00,   margen: 120.00  },
  { id:185, nombre: "Procesador Intel Core i7 14700KF lga 1700",                            cantidad: 1,  compra: 1700.00,  venta: 1820.00,  margen: 120.00  },
  { id:173, nombre: "Case 1st player dk-d4 blanco 4 cooler rgb vidrio templado",            cantidad: 1,  compra: 150.00,   venta: 180.00,   margen: 30.00   },
  { id:41,  nombre: "Tarjeta de video RTX 3060 asus dual, 12GB GDDR6",                      cantidad: 1,  compra: 1292.48,  venta: 1380.00,  margen: 87.52   },
  { id:192, nombre: "Placa madre B450m ds3h gigabyte",                                      cantidad: 1,  compra: 276.54,   venta: 310.00,   margen: 33.46   },
  { id:211, nombre: "Placa madre Z790 Aorus elite ax",                                      cantidad: 1,  compra: 1050.00,  venta: 1190.00,  margen: 140.00  },
  { id:183, nombre: "Procesador Intel Core i7 14700K lga 1700",                             cantidad: 1,  compra: 1800.00,  venta: 1850.00,  margen: 50.00   },
];

// Datos reales 2023
const VENDIDOS_2023 = [
  { id:208, nombre: "Procesador Intel Core I7-10700 2.90 ghz/16mb lga 1200", cantidad: 4, compra: 3200.00, venta: 3400.00, margen: 200.00 },
];

function getArticulosAnio(anio) {
  // Años con datos reales: ya están en ARTICULOS_DATA
  if (ARTICULOS_DATA[anio]) return ARTICULOS_DATA[anio];

  // 2024: mezclar vendidos reales + resto en 0
  if (anio === 2024) {
    const vendidosIds = new Set(VENDIDOS_2024.map(v => v.id));
    const base = getListaBase();
    // Reemplazar los que tienen ventas
    return base.map(a => {
      const v = VENDIDOS_2024.find(v => v.id === a.id);
      if (v) return { ...a, vendido: true, cantidad: v.cantidad, compra: v.compra, venta: v.venta, margen: v.margen };
      return a;
    // Agregar vendidos que no estén en la lista base (si hay nuevos)
    }).concat(VENDIDOS_2024.filter(v => !base.find(a => a.id === v.id)).map(v => ({
      ...v, vendido: true
    }))).sort((a, b) => b.cantidad - a.cantidad || a.nombre.localeCompare(b.nombre));
  }

  // 2023: mezclar vendidos reales + resto en 0
  if (anio === 2023) {
    const base = getListaBase();
    return base.map(a => {
      const v = VENDIDOS_2023.find(v => v.id === a.id);
      if (v) return { ...a, vendido: true, cantidad: v.cantidad, compra: v.compra, venta: v.venta, margen: v.margen };
      return a;
    }).sort((a, b) => b.cantidad - a.cantidad || a.nombre.localeCompare(b.nombre));
  }

  // 2025 y 2012-2022: todo en 0
  return getListaBase();
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
// ════════════════════════════════════════════════════════════════
// ARTICULO MAS VENDIDO x CRITERIO
// ════════════════════════════════════════════════════════════════

// Datos reales por sucursal (basados en el PDF - Tienda1 tiene datos, Tienda2 y Almacen1 sin resultados)
const DATOS_CRITERIO = {
  "1": [ // Tienda 1 — datos reales del PDF
    { id:206, nombre: "Monitor Teros te-2123s 21.45\" ips, fhd, 100hz, speakers",           cantidad: 53, compra: 12863.18, venta: 14850.00, margen: 1986.82 },
    { id:38,  nombre: "Placa madre H311 LGA 1151 Intel Core 6/7/8/9 Gen, ddr4",             cantidad: 34, compra: 6290.00,  venta: 7440.00,  margen: 1150.00 },
    { id:37,  nombre: "Placa madre B75 LGA 1155 Intel Core 2da/3ra Gen, ddr3",              cantidad: 33, compra: 4125.00,  venta: 4763.19,  margen: 638.19  },
    { id:175, nombre: "Tarjeta de video RTX 3060 ventus 2x oc, 12GB GDDR6",                 cantidad: 20, compra: 24312.82, venta: 26950.00, margen: 2637.18 },
    { id:189, nombre: "Procesador Ryzen 5 4600g 3,70ghz",                                   cantidad: 17, compra: 6485.53,  venta: 7320.00,  margen: 834.47  },
    { id:86,  nombre: "Monitor Teros TE- 3131 24\" ips, 1920*1080, 75hz, curvo",            cantidad: 16, compra: 4357.03,  venta: 5199.00,  margen: 841.97  },
    { id:105, nombre: "Tarjeta de video RTX 3050 ventus 2x oc, 6GB GDDR6",                  cantidad: 13, compra: 9990.87,  venta: 11040.00, margen: 1049.13 },
    { id:27,  nombre: "Placa madre H510m-b msi",                                             cantidad: 12, compra: 2800.69,  venta: 3175.00,  margen: 374.31  },
    { id:137, nombre: "Tinta Hp Hp",                                                          cantidad: 10, compra: 500.00,   venta: 800.00,   margen: 300.00  },
    { id:45,  nombre: "Procesador Ryzen 5 5500 3,60ghz",                                    cantidad: 10, compra: 3589.98,  venta: 4125.20,  margen: 535.22  },
    { id:220, nombre: "Monitor Teros TE- 2711s 27\" ips, 1920*1080, 100hz, 1ms",            cantidad: 10, compra: 3599.22,  venta: 4149.00,  margen: 549.78  },
    { id:30,  nombre: "Placa madre H510m-e asus",                                            cantidad: 9,  compra: 2545.64,  venta: 2707.00,  margen: 161.36  },
    { id:120, nombre: "SSD 512gb TForce Vulcan Z 2.5\" sata 3",                             cantidad: 8,  compra: 936.66,   venta: 1070.00,  margen: 133.34  },
    { id:23,  nombre: "Placa madre A520m a pro MSi",                                         cantidad: 8,  compra: 1377.14,  venta: 1634.00,  margen: 256.87  },
    { id:21,  nombre: "Monitor Teros TE- 2411S 24\" ips, 1920*1080, 100hz, 1ms",            cantidad: 7,  compra: 2026.20,  venta: 2409.00,  margen: 382.80  },
    { id:15,  nombre: "Monitor Teros TE- 2470G 24\" ips, 1920*1080, 165hz, curvo",          cantidad: 7,  compra: 2745.13,  venta: 3186.00,  margen: 440.87  },
    { id:218, nombre: "Fuente de poder gigabyte 550w 80+ bronce",                            cantidad: 7,  compra: 1417.42,  venta: 1610.00,  margen: 192.58  },
    { id:64,  nombre: "Procesador Intel Core i7 11700F lga 1200",                            cantidad: 6,  compra: 4845.91,  venta: 6000.00,  margen: 1154.09 },
    { id:78,  nombre: "SSD Kingston 1tb nv2 m.2",                                            cantidad: 6,  compra: 1470.00,  venta: 1560.00,  margen: 90.00   },
    { id:18,  nombre: "Monitor Teros TE- 2121S 21.5\" ips, 1920*1080, 100hz, 1ms",          cantidad: 6,  compra: 1440.69,  venta: 1768.00,  margen: 327.31  },
    { id:48,  nombre: "Mouse Logitech G203 lightsync rgb 8000 dpi black usb",                cantidad: 5,  compra: 511.62,   venta: 574.80,   margen: 63.18   },
    { id:222, nombre: "Placa madre B550m pro-vdh wifi msi",                                  cantidad: 4,  compra: 1417.02,  venta: 1680.00,  margen: 262.98  },
    { id:131, nombre: "Monitor 24\" ASUS Proart PA248QV IPS FHD sRGB 100%",                 cantidad: 4,  compra: 3705.91,  venta: 4213.00,  margen: 507.09  },
    { id:223, nombre: "Placa madre B550m-k gigabyte",                                        cantidad: 4,  compra: 1226.55,  venta: 1460.00,  margen: 233.45  },
    { id:91,  nombre: "Placa madre H310m pro vdh MSi",                                       cantidad: 4,  compra: 800.00,   venta: 1040.00,  margen: 240.00  },
    { id:51,  nombre: "Fuente de poder gigabyte 650w 80+ bronce",                            cantidad: 4,  compra: 923.69,   venta: 1112.34,  margen: 188.65  },
    { id:85,  nombre: "Fuente de poder gigabyte ud 750w 80+ gold",                           cantidad: 4,  compra: 1642.62,  venta: 1805.00,  margen: 162.38  },
    { id:47,  nombre: "Memoria ram T-Create 32gb kit (2x16gb) ddr4 3200mhz",                 cantidad: 4,  compra: 1023.52,  venta: 1200.00,  margen: 176.48  },
    { id:208, nombre: "Procesador Intel Core I7-10700 2.90 ghz/16mb lga 1200",               cantidad: 4,  compra: 3200.00,  venta: 3400.00,  margen: 200.00  },
    { id:103, nombre: "Monitor Teros TE- 3194N 27",                                          cantidad: 3,  compra: 1730.88,  venta: 1859.00,  margen: 128.12  },
    { id:77,  nombre: "Memoria USB Kingston DataTraveler Exodia Onyx, 64GB, USB 3.2",        cantidad: 3,  compra: 48.00,    venta: 60.00,    margen: 12.00   },
    { id:32,  nombre: "Memoria ram T-Create 16gb kit (2x8gb) ddr4 3200mhz",                  cantidad: 3,  compra: 442.24,   venta: 500.00,   margen: 57.76   },
    { id:20,  nombre: "Monitor Teros TE- 3199 27",                                           cantidad: 3,  compra: 1206.17,  venta: 1360.00,  margen: 153.83  },
    { id:84,  nombre: "Procesador Intel Core i5 10400F 2,9ghz",                              cantidad: 3,  compra: 1331.17,  venta: 1420.00,  margen: 88.83   },
    { id:215, nombre: "Procesador Ryzen 5 5600g 3,90ghz",                                    cantidad: 3,  compra: 1560.50,  venta: 1710.00,  margen: 149.50  },
    { id:138, nombre: "Monitor Curvo Teros TE-3412G 34\" UltraWide WQHD 165Hz 1ms FreeSync",cantidad: 2,  compra: 200.00,   venta: 1898.00,  margen: 1698.00 },
    { id:28,  nombre: "Placa madre B560m-a Asus",                                            cantidad: 2,  compra: 719.89,   venta: 840.00,   margen: 120.11  },
    { id:29,  nombre: "Placa madre pro B760m-p ddr4 msi",                                    cantidad: 2,  compra: 841.42,   venta: 930.00,   margen: 88.58   },
    { id:224, nombre: "Tarjeta de video gtx 1650 - d6 ventus xs msi",                        cantidad: 2,  compra: 1238.00,  venta: 1340.00,  margen: 102.00  },
    { id:100, nombre: "Monitor LG 22mn430 21.5\"",                                           cantidad: 2,  compra: 530.91,   venta: 605.14,   margen: 74.23   },
    { id:225, nombre: "Estabilizador 1000VA Forza FVR-1012 4 tomas",                         cantidad: 2,  compra: 76.00,    venta: 100.00,   margen: 24.00   },
    { id:122, nombre: "Procesador Ryzen 5 5600 3,70ghz",                                     cantidad: 1,  compra: 508.95,   venta: 590.00,   margen: 81.05   },
    { id:109, nombre: "Switch hdmi 3 a 1 uh-301",                                            cantidad: 1,  compra: 40.00,    venta: 50.00,    margen: 10.00   },
    { id:88,  nombre: "Tarjetde video rtx 2060 6gb SZMZ",                                    cantidad: 1,  compra: 850.00,   venta: 1000.00,  margen: 150.00  },
    { id:81,  nombre: "adaptador usb tp link ac600 wi-fi, bluetooth 4.2",                    cantidad: 1,  compra: 40.00,    venta: 50.00,    margen: 10.00   },
    { id:25,  nombre: "Placa madre B85 LGA 1150 Intel Core 4ta Gen, ddr3",                   cantidad: 1,  compra: 140.00,   venta: 199.00,   margen: 59.00   },
    { id:114, nombre: "Placa madre H610m-g MSI ddr4, lga 1700",                              cantidad: 1,  compra: 280.93,   venta: 320.00,   margen: 39.07   },
    { id:63,  nombre: "Procesador Intel Core i5 11400 lga 1200",                             cantidad: 1,  compra: 550.00,   venta: 600.00,   margen: 50.00   },
    { id:89,  nombre: "Fuente de pode 650w IT Visiou",                                       cantidad: 1,  compra: 103.35,   venta: 140.00,   margen: 36.65   },
    { id:90,  nombre: "ssd micro fron 240gb sataiii",                                        cantidad: 1,  compra: 60.00,    venta: 80.00,    margen: 20.00   },
    { id:87,  nombre: "Monitor Teros TE- 3130 2 24\" ips, 1920*1080, 75hz",                 cantidad: 1,  compra: 275.00,   venta: 320.00,   margen: 45.00   },
    { id:82,  nombre: "Fuente de poder halion 500w",                                          cantidad: 1,  compra: 50.00,    venta: 60.00,    margen: 10.00   },
    { id:42,  nombre: "Tarjeta de video RTX 3060 ventus 3x oc, 12GB GDDR6",                 cantidad: 1,  compra: 1257.62,  venta: 1480.00,  margen: 222.38  },
    { id:108, nombre: "Cable hdmi 15 metros",                                                 cantidad: 1,  compra: 35.00,    venta: 45.00,    margen: 10.00   },
    { id:107, nombre: "Proyector Epson PowerLite E20, 3400 Lúmenes, 1024x768, XGA",          cantidad: 1,  compra: 1620.00,  venta: 1790.00,  margen: 170.00  },
    { id:99,  nombre: "ssd 2tb Kingston Fury Renegade m.2 NVMe PcIe",                        cantidad: 1,  compra: 600.00,   venta: 720.00,   margen: 120.00  },
    { id:153, nombre: "SSD MSI Spatium M450 500gb m.2 nvme",                                 cantidad: 1,  compra: 128.86,   venta: 150.00,   margen: 21.14   },
    { id:171, nombre: "tarjeta de video radeon rx580 8gb Jie Shou",                          cantidad: 1,  compra: 330.00,   venta: 450.00,   margen: 120.00  },
    { id:185, nombre: "Procesador Intel Core i7 14700KF lga 1700",                           cantidad: 1,  compra: 1700.00,  venta: 1820.00,  margen: 120.00  },
    { id:173, nombre: "Case 1st player dk-d4 blanco 4 cooler rgb vidrio templado",           cantidad: 1,  compra: 150.00,   venta: 180.00,   margen: 30.00   },
    { id:41,  nombre: "Tarjeta de video RTX 3060 asus dual, 12GB GDDR6",                     cantidad: 1,  compra: 1292.48,  venta: 1380.00,  margen: 87.52   },
    { id:192, nombre: "Placa madre B450m ds3h gigabyte",                                     cantidad: 1,  compra: 276.54,   venta: 310.00,   margen: 33.46   },
    { id:211, nombre: "Placa madre Z790 Aorus elite ax",                                     cantidad: 1,  compra: 1050.00,  venta: 1190.00,  margen: 140.00  },
    { id:183, nombre: "Procesador Intel Core i7 14700K lga 1700",                            cantidad: 1,  compra: 1800.00,  venta: 1850.00,  margen: 50.00   },
  ],
  "2": [], // Tienda 2 — sin resultados
  "3": [], // Almacen 1 — sin resultados
};

const SUCURSALES_CRIT = [
  { value: "",  label: "Todo"      },
  { value: "1", label: "Tienda1"   },
  { value: "2", label: "Tienda2"   },
  { value: "3", label: "Almacen 1" },
];

function TablaCriterio({ titulo, datos }) {
  const [filaHover, setFilaHover] = useState(null);
  const thS = { background: "#1a6e8e", color: "#fff", padding: "8px 10px", fontSize: 12, fontWeight: "bold", textAlign: "center", border: "1px solid #ccc" };
  const tdS = (align) => ({ padding: "6px 10px", fontSize: 12, textAlign: align || "left", border: "1px solid #e0e0e0", color: "#333" });

  const totCompra = datos.reduce((s, d) => s + d.compra, 0);
  const totVenta  = datos.reduce((s, d) => s + d.venta,  0);
  const totMargen = datos.reduce((s, d) => s + d.margen, 0);

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 15, color: "#1a6e8e", margin: "16px 0 10px" }}>
        {titulo}
      </div>
      {datos.length === 0 ? (
        <div style={{ textAlign: "center", color: "#999", fontWeight: "bold", fontSize: 14, padding: "12px 0" }}>
          NO HAY RESULTADOS
        </div>
      ) : (
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
              {datos.map((d, i) => {
                const isHover = filaHover === i;
                return (
                  <tr key={d.id}
                    style={{ background: isHover ? "#c8f000" : i % 2 === 0 ? "#fff" : "#f5f5f5" }}
                    onMouseEnter={() => setFilaHover(i)}
                    onMouseLeave={() => setFilaHover(null)}>
                    <td style={tdS("center")}>{i + 1}</td>
                    <td style={{ ...tdS("center"), color: "#1a6e8e", fontWeight: "bold" }}>{d.cantidad}</td>
                    <td style={tdS()}>{d.nombre}</td>
                    <td style={tdS("right")}>{fmt(d.compra)}</td>
                    <td style={tdS("right")}>{fmt(d.venta)}</td>
                    <td style={tdS("right")}>{fmt(d.margen)}</td>
                  </tr>
                );
              })}
              <tr style={{ background: "#b8d4e8", fontWeight: "bold" }}>
                <td colSpan={3} style={{ ...tdS(), fontWeight: "bold" }}>Total Soles</td>
                <td style={{ ...tdS("right"), fontWeight: "bold" }}>{fmt(totCompra)}</td>
                <td style={{ ...tdS("right"), fontWeight: "bold" }}>{fmt(totVenta)}</td>
                <td style={{ ...tdS("right"), fontWeight: "bold" }}>{fmt(totMargen)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PaginaArticuloCrit({ onVolver }) {
  const [sucursal,   setSucursal]   = useState("");
  const [fechaIni,   setFechaIni]   = useState("");
  const [fechaFin,   setFechaFin]   = useState("");
  const [consultado, setConsultado] = useState(false);

  const inpStyle = { border: "1px solid #ccc", borderRadius: 3, padding: "5px 8px", fontSize: 13, color: "#333", background: "#fff", width: 140 };

  // Sucursales a mostrar según filtro
  const sucursalesToShow = sucursal === ""
    ? [{ value: "1", label: "TIENDA 1" }, { value: "2", label: "TIENDA 2" }, { value: "3", label: "ALMACEN 1" }]
    : [{ value: sucursal, label: sucursal === "1" ? "TIENDA 1" : sucursal === "2" ? "TIENDA 2" : "ALMACEN 1" }];

  return (
    <div style={{ fontFamily: "Tahoma, Arial, sans-serif", fontSize: 13 }}>

      {/* Título */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <span style={{ color: "#6f42c1", fontSize: 18 }}>➤</span>
        <strong style={{ fontSize: 16, color: "#333" }}>ESTADISTICA DE ARTICULO</strong>
      </div>

      {/* Filtros */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap", marginBottom: 6 }}>
        <div>
          <div style={{ marginBottom: 4, fontWeight: "bold", color: "#333" }}>Seleccione sucursal</div>
          <select value={sucursal} onChange={e => { setSucursal(e.target.value); setConsultado(false); }}
            style={{ ...inpStyle, width: 260 }}>
            {SUCURSALES_CRIT.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <div style={{ marginBottom: 4, color: "#333" }}>Fecha Inicio</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <input type="date" value={fechaIni} onChange={e => { setFechaIni(e.target.value); setConsultado(false); }}
              style={inpStyle} />
          </div>
        </div>
        <div>
          <div style={{ marginBottom: 4, color: "#333" }}>Fecha Fin</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <input type="date" value={fechaFin} onChange={e => { setFechaFin(e.target.value); setConsultado(false); }}
              style={inpStyle} />
          </div>
        </div>
        <button onClick={() => setConsultado(true)} style={{
          background: "#17a2b8", color: "#fff", border: "none", borderRadius: 4,
          padding: "7px 18px", fontSize: 13, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
        }}>🔍 Consulta</button>
      </div>
      <div style={{ fontWeight: "bold", color: "#333", marginBottom: 20 }}>y/o</div>

      {/* Resultado */}
      {consultado && (
        <div>
          {sucursalesToShow.map(s => (
            <TablaCriterio
              key={s.value}
              titulo={s.label}
              datos={DATOS_CRITERIO[s.value] || []}
            />
          ))}
          {/* Botón imprimir */}
          <div style={{ textAlign: "center", marginTop: 10 }}>
            <button onClick={() => window.print()} style={{
              background: "#17a2b8", color: "#fff", border: "none", borderRadius: 4,
              padding: "7px 18px", fontSize: 13, cursor: "pointer",
            }}>🖨️ Imprimir</button>
          </div>
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
// CLIENTE MAS VENDIDO
// ════════════════════════════════════════════════════════════════

const CLIENTES_VENDIDO = {
  2026: [
    { nombre: "CLIENTE",                    compras: 4, monto: 720.00    },
    { nombre: "RAYSA YUPANQUI BARBOZA",     compras: 2, monto: 1658.39   },
    { nombre: "GABRIELA INES LUNA FLORES",  compras: 1, monto: 1898.00   },
    { nombre: "INTELIGENTE S.A.C.",         compras: 1, monto: 80.00     },
    { nombre: "AARON SMITH ITURRI QUISPE",  compras: 1, monto: 3159.75   },
  ],
  2025: [],
  2024: [
    { nombre: "CLIENTE",                              compras: 52, monto: 78452.53  },
    { nombre: "VENTA FALABELLA",                      compras: 24, monto: 53806.00  },
    { nombre: "LUIS ALEXANDER, QUISPE AYALA",         compras: 1,  monto: 720.00    },
    { nombre: "HANSEL FRANCO, CHAVEZ GARCIA",         compras: 1,  monto: 1880.00   },
    { nombre: "ALEXANDER PAUL, MORAN ALBURQUEQUE",    compras: 1,  monto: 179.00    },
    { nombre: "STEPHANY JOHANA, AVILA TOVAR",         compras: 1,  monto: 445.00    },
    { nombre: "CESAR ADRIAN, TERRONES MORENO",        compras: 1,  monto: 445.00    },
    { nombre: "PIERS JAVIER GIRALDO",                 compras: 1,  monto: 1820.00   },
    { nombre: "EDILMA, CABRERA CARUAJULCA",           compras: 1,  monto: 320.00    },
    { nombre: "JOSIPH JHONNY, CONDOR PICARDO",        compras: 1,  monto: 445.00    },
    { nombre: "CARLOS ENRIQUE, MIFFLIN REVILLA",      compras: 1,  monto: 1400.00   },
    { nombre: "HERNAN ROLANDO, VALDIVIA CARDENAS",    compras: 1,  monto: 350.00    },
    { nombre: "JOSÉ ABEL, OLAECHEA LUIS",             compras: 1,  monto: 50.00     },
    { nombre: "LILIANA, QUINTANA MORALES",            compras: 1,  monto: 1750.00   },
    { nombre: "JESUS CRISTIAN, SIFUENTES SANCHEZ",    compras: 1,  monto: 378.00    },
    { nombre: "ANGEL DANILO, WETZELL RODRIGUEZ",      compras: 1,  monto: 1380.00   },
    { nombre: "DAVID CRISTHIAN, MONZON CASAS",        compras: 1,  monto: 900.00    },
  ],
  2023: [
    { nombre: "ROGER, INGA SALVADOR", compras: 4, monto: 3420.00 },
  ],
};

function PaginaClienteVendido({ onVolver }) {
  const [modo,       setModo]       = useState("c"); // c=cantidad, m=montos
  const [anio,       setAnio]       = useState(new Date().getFullYear());
  const [consultado, setConsultado] = useState(false);
  const [filaHover,  setFilaHover]  = useState(null);

  const thS  = { background: "#1a6e8e", color: "#fff", padding: "8px 12px", fontSize: 12, fontWeight: "bold", textAlign: "center", border: "1px solid #ccc" };
  const tdS  = (align) => ({ padding: "6px 12px", fontSize: 12, textAlign: align || "left", border: "1px solid #e0e0e0", color: "#333" });

  const rawDatos = CLIENTES_VENDIDO[anio] || [];

  // Ordenar según modo
  const datos = [...rawDatos].sort((a, b) =>
    modo === "c" ? b.compras - a.compras : b.monto - a.monto
  );

  const totMonto   = datos.reduce((s, d) => s + d.monto,   0);

  return (
    <div style={{ fontFamily: "Tahoma, Arial, sans-serif", fontSize: 13 }}>

      {/* Título con radios */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        <span style={{ color: "#6f42c1", fontSize: 18 }}>➤</span>
        <strong style={{ fontSize: 15, color: "#333" }}>ESTADISTICA DEL CLIENTE</strong>
        <span style={{ color: "#555" }}>{">>"}</span>
        {[["c", "+ Cantidad"], ["m", "+ Montos"]].map(([val, label]) => (
          <label key={val} style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", color: "#333" }}>
            <input type="radio" name="modo-cli-vend" value={val}
              checked={modo === val}
              onChange={() => { setModo(val); setConsultado(false); }}
              style={{ accentColor: "#17a2b8" }} />
            {label}
          </label>
        ))}
      </div>

      {/* Selector año + Consulta */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, justifyContent: "center" }}>
        <span style={{ color: "#333" }}>Seleccione el año</span>
        <select value={anio} onChange={e => { setAnio(Number(e.target.value)); setConsultado(false); }}
          style={{ border: "1px solid #ccc", borderRadius: 3, padding: "4px 8px", fontSize: 13, color: "#333", background: "#fff" }}>
          {ANIOS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <button onClick={() => setConsultado(true)} style={{
          background: "#17a2b8", color: "#fff", border: "none", borderRadius: 4,
          padding: "7px 18px", fontSize: 13, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
        }}>🔍 Consulta</button>
      </div>

      {/* Resultado */}
      {consultado && (
        datos.length === 0 ? (
          <div style={{ textAlign: "center", color: "#888", fontSize: 14, padding: "20px 0" }}>
            No hay Datos Registrados
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thS}>ITEM</th>
                  <th style={thS}>CLIENTE</th>
                  <th style={thS}>COMPRAS</th>
                  <th style={thS}>COMPRA S/</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((d, i) => {
                  const isHover = filaHover === i;
                  return (
                    <tr key={i}
                      style={{ background: isHover ? "#c8f000" : i % 2 === 0 ? "#fff" : "#f5f5f5" }}
                      onMouseEnter={() => setFilaHover(i)}
                      onMouseLeave={() => setFilaHover(null)}>
                      <td style={tdS("center")}>{i + 1}</td>
                      <td style={tdS("center")}>{d.nombre}</td>
                      <td style={tdS("center")}>{d.compras}</td>
                      <td style={tdS("right")}>{fmt(d.monto)}</td>
                    </tr>
                  );
                })}
                <tr style={{ background: "#b8d4e8", fontWeight: "bold" }}>
                  <td colSpan={3} style={{ ...tdS(), fontWeight: "bold" }}>Total Soles</td>
                  <td style={{ ...tdS("right"), fontWeight: "bold" }}>{fmt(totMonto)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )
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
// CLIENTE MAS ADEUDADO
// ════════════════════════════════════════════════════════════════

const CLIENTES_DEUDA = {
  2026: [
    { nombre: "INTELIGENTE S.A.C.", compras: 1, monto: 80.00, deuda: 80.00 },
  ],
  2025: [],
  2024: [
    { nombre: "VENTA FALABELLA", compras: 1, monto: 320.00, deuda: 320.00 },
  ],
};

function PaginaClienteDeuda({ onVolver }) {
  const [modo,       setModo]       = useState("c");
  const [anio,       setAnio]       = useState(new Date().getFullYear());
  const [consultado, setConsultado] = useState(false);
  const [filaHover,  setFilaHover]  = useState(null);

  const thS = { background: "#1a6e8e", color: "#fff", padding: "8px 12px", fontSize: 12, fontWeight: "bold", textAlign: "center", border: "1px solid #ccc" };
  const tdS = (align) => ({ padding: "6px 12px", fontSize: 12, textAlign: align || "left", border: "1px solid #e0e0e0", color: "#333" });

  const rawDatos = CLIENTES_DEUDA[anio] || [];
  const datos = [...rawDatos].sort((a, b) =>
    modo === "c" ? b.compras - a.compras : modo === "m" ? b.monto - a.monto : b.deuda - a.deuda
  );

  const totMonto = datos.reduce((s, d) => s + d.monto, 0);
  const totDeuda = datos.reduce((s, d) => s + d.deuda, 0);

  return (
    <div style={{ fontFamily: "Tahoma, Arial, sans-serif", fontSize: 13 }}>

      {/* Título con radios */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        <span style={{ color: "#6f42c1", fontSize: 18 }}>➤</span>
        <strong style={{ fontSize: 15, color: "#333" }}>ESTADISTICA DEL CLIENTE</strong>
        <span style={{ color: "#555" }}>{">>"}</span>
        {[["c", "+ Cantidad"], ["m", "+ Montos"], ["d", "+ Deuda"]].map(([val, label]) => (
          <label key={val} style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", color: "#333" }}>
            <input type="radio" name="modo-cli-deuda" value={val}
              checked={modo === val}
              onChange={() => { setModo(val); setConsultado(false); }}
              style={{ accentColor: "#17a2b8" }} />
            {label}
          </label>
        ))}
      </div>

      {/* Selector año + Consulta */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, justifyContent: "center" }}>
        <span style={{ color: "#333" }}>Seleccione el año</span>
        <select value={anio} onChange={e => { setAnio(Number(e.target.value)); setConsultado(false); }}
          style={{ border: "1px solid #ccc", borderRadius: 3, padding: "4px 8px", fontSize: 13, color: "#333", background: "#fff" }}>
          {ANIOS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <button onClick={() => setConsultado(true)} style={{
          background: "#17a2b8", color: "#fff", border: "none", borderRadius: 4,
          padding: "7px 18px", fontSize: 13, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
        }}>🔍 Consulta</button>
      </div>

      {/* Resultado */}
      {consultado && (
        datos.length === 0 ? (
          <div style={{ textAlign: "center", color: "#888", fontSize: 14, padding: "20px 0" }}>
            No hay Datos Registrados
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thS}>ITEM</th>
                  <th style={thS}>CLIENTE</th>
                  <th style={thS}>COMPRAS</th>
                  <th style={thS}>COMPRA S/</th>
                  <th style={{ ...thS, background: "#c0392b" }}>DEUDA S/</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((d, i) => {
                  const isHover = filaHover === i;
                  return (
                    <tr key={i}
                      style={{ background: isHover ? "#c8f000" : i % 2 === 0 ? "#fff" : "#f5f5f5" }}
                      onMouseEnter={() => setFilaHover(i)}
                      onMouseLeave={() => setFilaHover(null)}>
                      <td style={tdS("center")}>{i + 1}</td>
                      <td style={tdS("center")}>{d.nombre}</td>
                      <td style={tdS("center")}>{d.compras}</td>
                      <td style={tdS("right")}>{fmt(d.monto)}</td>
                      <td style={{ ...tdS("right"), color: "#c0392b", fontWeight: "bold" }}>{fmt(d.deuda)}</td>
                    </tr>
                  );
                })}
                <tr style={{ background: "#b8d4e8", fontWeight: "bold" }}>
                  <td colSpan={3} style={{ ...tdS(), fontWeight: "bold" }}>Total Soles</td>
                  <td style={{ ...tdS("right"), fontWeight: "bold" }}>{fmt(totMonto)}</td>
                  <td style={{ ...tdS("right"), fontWeight: "bold", color: "#c0392b" }}>{fmt(totDeuda)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )
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
// CLIENTE POR SUCURSAL
// ════════════════════════════════════════════════════════════════

function PaginaClienteSucursal({ onVolver }) {
  const [sucursal, setSucursal] = useState("");
  const [anio,     setAnio]     = useState(new Date().getFullYear());

  return (
    <div style={{ fontFamily: "Tahoma, Arial, sans-serif", fontSize: 13 }}>

      {/* Título */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <span style={{ color: "#6f42c1", fontSize: 18 }}>➤</span>
        <strong style={{ fontSize: 15, color: "#333" }}>ESTADISTICA DEL CLIENTE — por Sucursal</strong>
      </div>

      {/* Filtros */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <div>
          <div style={{ marginBottom: 4, fontWeight: "bold", color: "#333" }}>Seleccione sucursal</div>
          <select value={sucursal} onChange={e => setSucursal(e.target.value)}
            style={{ border: "1px solid #ccc", borderRadius: 3, padding: "5px 8px", fontSize: 13, color: "#333", background: "#fff", width: 220 }}>
            <option value="">Todo</option>
            <option value="1">Tienda 1</option>
            <option value="2">Tienda 2</option>
            <option value="3">Almacen 1</option>
          </select>
        </div>
        <div>
          <div style={{ marginBottom: 4, color: "#333" }}>Seleccione el año</div>
          <select value={anio} onChange={e => setAnio(Number(e.target.value))}
            style={{ border: "1px solid #ccc", borderRadius: 3, padding: "5px 8px", fontSize: 13, color: "#333", background: "#fff" }}>
            {ANIOS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {/* Aviso página en construcción */}
      <div style={{
        background: "#fff3cd", border: "1px solid #ffc107", borderRadius: 6,
        padding: "20px 24px", textAlign: "center", color: "#856404",
      }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>🚧</div>
        <div style={{ fontWeight: "bold", fontSize: 15, marginBottom: 6 }}>Página en construcción</div>
        <div style={{ fontSize: 13 }}>
          Esta sección no está disponible aún en el sistema original.<br />
          Se integrará cuando se conecte con la API de datos.
        </div>
      </div>

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
// VENTAS x SEMANA
// ════════════════════════════════════════════════════════════════

const DIAS_SEMANA = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];

// Datos de ejemplo para una semana (Lunes 2026-03-09 al Domingo 2026-03-15)
const VENTAS_SEMANA_EJEMPLO = {
  "2026-03-09": { // Lunes
    productos: [
      { nro: 1, descripcion: "Monitor Teros TE-2711s 27\"", cantidad: 1, total: 419.00 },
      { nro: 2, descripcion: "Tinta Hp Hp",                 cantidad: 2, total: 160.00 },
      { nro: 3, descripcion: "Placa madre H510m-b msi",     cantidad: 1, total: 264.58 },
    ],
    servicios: [],
  },
};

function PaginaVentasSemana({ onVolver }) {
  const [tipo,        setTipo]        = useState("t"); // t=todos, p=productos, s=servicio
  const [fecha,       setFecha]       = useState("");
  const [consultado,  setConsultado]  = useState(false);
  const [filaHover,   setFilaHover]   = useState(null);
  const [advertencia, setAdvertencia] = useState(false);

  const thS = { background: "#1a6e8e", color: "#fff", padding: "8px 12px", fontSize: 12, fontWeight: "bold", textAlign: "center", border: "1px solid #ccc" };
  const tdS = (align) => ({ padding: "6px 12px", fontSize: 12, textAlign: align || "left", border: "1px solid #e0e0e0", color: "#333" });

  const handleConsulta = () => {
    if (!fecha) { setAdvertencia(false); setConsultado(false); return; }
    const diaSemana = new Date(fecha + "T00:00:00").getDay(); // 0=Dom, 1=Lun
    if (diaSemana !== 0 && diaSemana !== 1) {
      setAdvertencia(true);
      setConsultado(false);
    } else {
      setAdvertencia(false);
      setConsultado(true);
    }
  };

  const semanaData  = VENTAS_SEMANA_EJEMPLO[fecha] || { productos: [], servicios: [] };
  const productos   = tipo === "s" ? [] : semanaData.productos;
  const servicios   = tipo === "p" ? [] : semanaData.servicios;
  const todosDatos  = [...productos, ...servicios];

  const totTotal    = todosDatos.reduce((s, d) => s + d.total, 0);

  // Calcular el rango de la semana (lunes a domingo) para mostrar encabezado
  const getRangoSemana = (fechaStr) => {
    const d = new Date(fechaStr + "T00:00:00");
    const dia = d.getDay(); // 0=dom, 1=lun
    const lunes = new Date(d);
    lunes.setDate(d.getDate() - (dia === 0 ? 6 : dia - 1));
    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);
    const fmt2 = (dt) => dt.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
    return `${fmt2(lunes)} — ${fmt2(domingo)}`;
  };

  return (
    <div style={{ fontFamily: "Tahoma, Arial, sans-serif", fontSize: 13 }}>

      {/* Título con radios */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        <span style={{ color: "#6f42c1", fontSize: 18 }}>➤</span>
        <strong style={{ fontSize: 15, color: "#333" }}>VENTA POR DIA DE SEMANA</strong>
        <span style={{ color: "#555" }}>{">>"}</span>
        {[["t","Todos"],["p","Productos"],["s","Servicio"]].map(([val, label]) => (
          <label key={val} style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", color: "#333" }}>
            <input type="radio" name="tipo-semana" value={val}
              checked={tipo === val}
              onChange={() => { setTipo(val); setConsultado(false); }}
              style={{ accentColor: "#17a2b8" }} />
            {label}
          </label>
        ))}
      </div>

      {/* Selector fecha + Consulta */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ marginBottom: 4, color: "#333" }}>
            Seleccione fecha <span style={{ color: "#17a2b8", fontWeight: "bold" }}>Dia Lunes o Domingo</span>
          </div>
          <input type="date" value={fecha}
            onChange={e => { setFecha(e.target.value); setConsultado(false); setAdvertencia(false); }}
            style={{ border: "1px solid #ccc", borderRadius: 3, padding: "5px 8px", fontSize: 13, color: "#333", background: "#fff" }} />
        </div>
        <button onClick={handleConsulta} style={{
          background: "#17a2b8", color: "#fff", border: "none", borderRadius: 4,
          padding: "7px 18px", fontSize: 13, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
        }}>🔍 Consulta</button>
      </div>

      {/* Advertencia fecha inválida */}
      {advertencia && (
        <div style={{
          background: "#fff3cd", border: "1px solid #ffc107", borderRadius: 4,
          padding: "10px 16px", color: "#856404", marginBottom: 16,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          ⚠️ <strong>Fecha solo se debe seleccionar Dia Lunes o Domingo...</strong>
          {fecha && <span style={{ marginLeft: 8, color: "#555" }}>
            ({new Date(fecha + "T00:00:00").toLocaleDateString("es-PE", { weekday: "long" })} no es válido)
          </span>}
        </div>
      )}

      {/* Resultado */}
      {consultado && (
        <div>
          {/* Encabezado semana */}
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: "bold", color: "#1a6e8e" }}>
              Semana: {getRangoSemana(fecha)}
            </div>
            <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
              Día consultado: <strong>{DIAS_SEMANA[new Date(fecha + "T00:00:00").getDay()]}</strong>
            </div>
          </div>

          {todosDatos.length === 0 ? (
            <div style={{ textAlign: "center", color: "#888", fontSize: 14, padding: "20px 0" }}>
              No hay Datos Registrados para esta fecha
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={thS}>NRO</th>
                    <th style={thS}>DESCRIPCIÓN</th>
                    <th style={thS}>CANTIDAD</th>
                    <th style={thS}>TOTAL S/</th>
                  </tr>
                </thead>
                <tbody>
                  {todosDatos.map((d, i) => {
                    const isHover = filaHover === i;
                    return (
                      <tr key={i}
                        style={{ background: isHover ? "#c8f000" : i % 2 === 0 ? "#fff" : "#f5f5f5" }}
                        onMouseEnter={() => setFilaHover(i)}
                        onMouseLeave={() => setFilaHover(null)}>
                        <td style={tdS("center")}>{d.nro}</td>
                        <td style={tdS()}>{d.descripcion}</td>
                        <td style={tdS("center")}>{d.cantidad}</td>
                        <td style={tdS("right")}>{fmt(d.total)}</td>
                      </tr>
                    );
                  })}
                  <tr style={{ background: "#b8d4e8", fontWeight: "bold" }}>
                    <td colSpan={3} style={{ ...tdS(), fontWeight: "bold" }}>Total Soles</td>
                    <td style={{ ...tdS("right"), fontWeight: "bold" }}>{fmt(totTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
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
// VENTAS x SUCURSAL
// ════════════════════════════════════════════════════════════════

// Datos de ejemplo — Marzo 2026 Tienda 1
const VENTAS_SUCURSAL_DATA = {
  "1": {
    2026: {
      3: { // Marzo
        6:  { venta: 3159.75 }, // viernes
        9:  { venta: 843.58  }, // lunes
        12: { venta: 419.00  }, // jueves
        13: { venta: 2094.81 }, // viernes
      },
      1: { 15: { venta: 800.00 }, 22: { venta: 1200.00 } }, // Enero
      2: { 5:  { venta: 605.14 }, 18: { venta: 1898.00 } }, // Febrero
    },
  },
  "2": {}, "3": {},
};

function getVentasDia(sucursal, anio, mes, dia) {
  return VENTAS_SUCURSAL_DATA[sucursal]?.[anio]?.[mes]?.[dia]?.venta || 0;
}
function getVentasMes(sucursal, anio, mes) {
  const diasData = VENTAS_SUCURSAL_DATA[sucursal]?.[anio]?.[mes] || {};
  return Object.values(diasData).reduce((s, d) => s + (d.venta || 0), 0);
}
function diasEnMes(anio, mes) {
  return new Date(anio, mes, 0).getDate();
}
function primerDiaMes(anio, mes) {
  return new Date(anio, mes - 1, 1).getDay(); // 0=Dom
}

function PaginaVentasSucursal({ onVolver }) {
  const [vista,      setVista]      = useState("anual");   // "anual" | "mensual"
  const [sucursal,   setSucursal]   = useState("1");
  const [anio,       setAnio]       = useState(new Date().getFullYear());
  const [mes,        setMes]        = useState(new Date().getMonth() + 1);
  const [filaHover,  setFilaHover]  = useState(null);

  const SUCURSALES_V = [{ value:"1", label:"Tienda 1" }, { value:"2", label:"Tienda 2" }, { value:"3", label:"Almacen 1" }];

  const thS  = (bg) => ({ background: bg || "#1a6e8e", color: "#fff", padding: "7px 10px", fontSize: 12, fontWeight: "bold", textAlign: "center", border: "1px solid #ccc" });
  const tdS  = (align, extra) => ({ padding: "5px 10px", fontSize: 12, textAlign: align || "left", border: "1px solid #e0e0e0", color: "#333", ...extra });

  // ── VISTA ANUAL ──────────────────────────────────────────────
  const renderAnual = () => {
    const meses = MESES_NOMBRE;
    let totAnual = 0;
    return (
      <div style={{ overflowX: "auto" }}>
        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 14, color: "#1a6e8e", marginBottom: 10 }}>
          VENTAS ANUALES {anio} — {SUCURSALES_V.find(s => s.value === sucursal)?.label}
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thS()}>#</th>
              <th style={thS()}>MES</th>
              <th style={thS("#28a745")}>VENTA S/</th>
            </tr>
          </thead>
          <tbody>
            {meses.map((m, i) => {
              const numMes = i + 1;
              const venta  = getVentasMes(sucursal, anio, numMes);
              totAnual += venta;
              const isHover = filaHover === i;
              return (
                <tr key={m}
                  style={{ background: isHover ? "#c8f000" : i % 2 === 0 ? "#fff" : "#f5f5f5", cursor: "pointer" }}
                  onMouseEnter={() => setFilaHover(i)}
                  onMouseLeave={() => setFilaHover(null)}
                  onClick={() => { setMes(numMes); setVista("mensual"); setFilaHover(null); }}>
                  <td style={tdS("center")}>{numMes}</td>
                  <td style={{ ...tdS(), color: "#17a2b8", fontWeight: "bold" }}>{m}</td>
                  <td style={tdS("right")}>{venta > 0 ? fmt(venta) : ""}</td>
                </tr>
              );
            })}
            <tr style={{ background: "#b8d4e8", fontWeight: "bold" }}>
              <td colSpan={2} style={tdS()}>TOTAL ANUAL</td>
              <td style={{ ...tdS("right"), fontWeight: "bold" }}>{fmt(totAnual)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  // ── VISTA MENSUAL ─────────────────────────────────────────────
  const renderMensual = () => {
    const totalDias  = diasEnMes(anio, mes);
    const primerDia  = primerDiaMes(anio, mes);
    const DIAS_S     = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
    let totMes = 0;

    // Generar array de días con su díaSemana
    const dias = Array.from({ length: totalDias }, (_, i) => {
      const numDia  = i + 1;
      const diaSem  = (primerDia + i) % 7; // 0=Dom
      const venta   = getVentasDia(sucursal, anio, mes, numDia);
      totMes += venta;
      return { numDia, diaSem, venta };
    });

    return (
      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <button onClick={() => setVista("anual")} style={{
            background: "#6c757d", color: "#fff", border: "none", borderRadius: 4,
            padding: "5px 12px", fontSize: 12, cursor: "pointer",
          }}>← Volver al Año</button>
          <span style={{ fontWeight: "bold", fontSize: 14, color: "#1a6e8e" }}>
            {MESES_NOMBRE[mes - 1]} {anio} — {SUCURSALES_V.find(s => s.value === sucursal)?.label}
          </span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thS()}>DÍA</th>
              <th style={thS()}>FECHA</th>
              <th style={thS("#28a745")}>VENTA S/</th>
            </tr>
          </thead>
          <tbody>
            {dias.map(({ numDia, diaSem, venta }, i) => {
              const esDomingo = diaSem === 0;
              const isHover   = filaHover === i;
              return (
                <tr key={numDia}
                  style={{ background: isHover ? "#c8f000" : i % 2 === 0 ? "#fff" : "#f5f5f5" }}
                  onMouseEnter={() => setFilaHover(i)}
                  onMouseLeave={() => setFilaHover(null)}>
                  <td style={{ ...tdS("center"), color: esDomingo ? "#e00" : "#333", fontWeight: esDomingo ? "bold" : "normal" }}>
                    {DIAS_S[diaSem]}
                  </td>
                  <td style={{ ...tdS("center"), color: esDomingo ? "#e00" : "#333", fontWeight: esDomingo ? "bold" : "normal" }}>
                    {numDia}
                  </td>
                  <td style={tdS("right")}>{venta > 0 ? fmt(venta) : ""}</td>
                </tr>
              );
            })}
            <tr style={{ background: "#b8d4e8", fontWeight: "bold" }}>
              <td colSpan={2} style={tdS()}>TOTAL MES</td>
              <td style={{ ...tdS("right"), fontWeight: "bold" }}>{fmt(totMes)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div style={{ fontFamily: "Tahoma, Arial, sans-serif", fontSize: 13 }}>

      {/* Título */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <span style={{ color: "#6f42c1", fontSize: 18 }}>➤</span>
        <strong style={{ fontSize: 15, color: "#333" }}>VENTAS X SUCURSAL</strong>
      </div>

      {/* Controles */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        {/* Sucursal */}
        <div>
          <div style={{ marginBottom: 4, fontWeight: "bold", color: "#333" }}>Sucursal</div>
          <select value={sucursal} onChange={e => setSucursal(e.target.value)}
            style={{ border: "1px solid #ccc", borderRadius: 3, padding: "5px 8px", fontSize: 13, color: "#333", background: "#fff" }}>
            {SUCURSALES_V.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        {/* Año */}
        <div>
          <div style={{ marginBottom: 4, color: "#333" }}>Año</div>
          <select value={anio} onChange={e => { setAnio(Number(e.target.value)); setVista("anual"); }}
            style={{ border: "1px solid #ccc", borderRadius: 3, padding: "5px 8px", fontSize: 13, color: "#333", background: "#fff" }}>
            {ANIOS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        {/* Vista toggle */}
        <div style={{ display: "flex", gap: 8 }}>
          {[["anual","📅 Anual"],["mensual","📆 Mensual"]].map(([v, label]) => (
            <button key={v} onClick={() => setVista(v)} style={{
              background: vista === v ? "#1a6e8e" : "#e9ecef",
              color: vista === v ? "#fff" : "#333",
              border: "none", borderRadius: 4, padding: "6px 14px", fontSize: 13, cursor: "pointer",
            }}>{label}</button>
          ))}
        </div>
        {/* Mes (solo en vista mensual) */}
        {vista === "mensual" && (
          <div>
            <div style={{ marginBottom: 4, color: "#333" }}>Mes</div>
            <select value={mes} onChange={e => setMes(Number(e.target.value))}
              style={{ border: "1px solid #ccc", borderRadius: 3, padding: "5px 8px", fontSize: 13, color: "#333", background: "#fff" }}>
              {MESES_NOMBRE.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Leyenda domingos */}
      <div style={{ marginBottom: 12, fontSize: 12, color: "#666" }}>
        <span style={{ color: "#e00", fontWeight: "bold" }}>■</span> Domingos en rojo
      </div>

      {/* Contenido */}
      {vista === "anual" ? renderAnual() : renderMensual()}

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
      {pagina === "articulo-crit"   && <PaginaArticuloCrit onVolver={() => setPagina("inicio")} />}
      {pagina === "cliente-vendido" && <PaginaClienteVendido onVolver={() => setPagina("inicio")} />}
      {pagina === "cliente-deuda"   && <PaginaClienteDeuda   onVolver={() => setPagina("inicio")} />}
      {pagina === "cliente-sucursal"&& <PaginaClienteSucursal onVolver={() => setPagina("inicio")} />}
      {pagina === "ventas-semana"   && <PaginaVentasSemana   onVolver={() => setPagina("inicio")} />}
      {pagina === "ventas-sucursal" && <PaginaVentasSucursal onVolver={() => setPagina("inicio")} />}

    </div>
  );
}