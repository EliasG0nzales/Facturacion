import { useState, useRef } from "react";

// ─── DATOS DEMO ──────────────────────────────────────────────────────────────
const SUCURSALES = [
  { id: 1, nombre: "Tienda 1b 133" },
  { id: 2, nombre: "Tienda 1A 119" },
  { id: 3, nombre: "Almacen 2B 167" },
];

const CONCEPTOS = [
  "Apertura cuenta en S/",
  "Apertura cuenta en US$",
  "Ventas (Entrada) en S/",
  "Ventas (Entrada) en US$",
  "Compra (Salida) en S/",
  "Compra (Salida) en US$",
];

function generarMovimientos(sucId) {
  // Datos demo con algunos valores distintos de cero para que se vea más real
  const base = [
    { concepto: "Apertura cuenta en S/",     moneda: "S/",  entrada: sucId === 1 ? 500   : sucId === 2 ? 300   : 200,   salida: 0,      saldoSol: sucId === 1 ? 500   : sucId === 2 ? 300   : 200,   saldoDol: 0      },
    { concepto: "Apertura cuenta en US$",    moneda: "US$", entrada: sucId === 1 ? 100   : sucId === 2 ? 50    : 0,     salida: 0,      saldoSol: 0,                                                   saldoDol: sucId === 1 ? 100 : sucId === 2 ? 50 : 0 },
    { concepto: "Ventas (Entrada) en S/",    moneda: "S/",  entrada: sucId === 1 ? 3500  : sucId === 2 ? 1800  : 900,   salida: 0,      saldoSol: sucId === 1 ? 4000  : sucId === 2 ? 2100  : 1100,  saldoDol: 0      },
    { concepto: "Ventas (Entrada) en US$",   moneda: "US$", entrada: sucId === 1 ? 250   : 0,                           salida: 0,      saldoSol: 0,                                                   saldoDol: sucId === 1 ? 350 : sucId === 2 ? 50 : 0 },
    { concepto: "Compra (Salida) en S/",     moneda: "S/",  entrada: 0,                                                 salida: sucId === 1 ? 1200 : sucId === 2 ? 600 : 400,   saldoSol: sucId === 1 ? 2800 : sucId === 2 ? 1500 : 700,  saldoDol: 0 },
    { concepto: "Compra (Salida) en US$",    moneda: "US$", entrada: 0,                                                 salida: sucId === 1 ? 80   : 0,                         saldoSol: 0,           saldoDol: sucId === 1 ? 270 : sucId === 2 ? 50 : 0 },
  ];
  return base;
}

// ─── SVG PRINT ───────────────────────────────────────────────────────────────
const IcoPrint = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="2" width="14" height="7" rx="1" stroke="#888" strokeWidth="1.5"/>
    <path d="M5 17H3a1 1 0 01-1-1V9a1 1 0 011-1h18a1 1 0 011 1v7a1 1 0 01-1 1h-2" stroke="#888" strokeWidth="1.5"/>
    <rect x="5" y="14" width="14" height="8" rx="1" stroke="#888" strokeWidth="1.5"/>
    <circle cx="18" cy="11.5" r="1" fill="#888"/>
  </svg>
);

// ─── FECHA HOY ────────────────────────────────────────────────────────────────
function fechaHoy() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
}

// ─── TABLA POR SUCURSAL ───────────────────────────────────────────────────────
function TablaSucursal({ sucursal }) {
  const movs = generarMovimientos(sucursal.id);
  const totalSol = movs.reduce((a, m) => a + (m.moneda === "S/"  ? m.saldoSol : 0), 0);
  const totalDol = movs.reduce((a, m) => a + (m.moneda === "US$" ? m.saldoDol : 0), 0);

  const fmt = (v) => parseFloat(v).toFixed(2);

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Cabecera sucursal */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 6 }}>
        <thead>
          <tr style={{ background: "#284F57", color: "#fff", height: 30 }}>
            <td style={{ padding: "4px 10px", fontWeight: "bold", fontSize: 14 }}>
              {sucursal.nombre}
            </td>
          </tr>
        </thead>
      </table>

      {/* Tabla de movimientos */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            {["Concepto","Moneda","Entrada","Salida","Saldo S/","Saldo US$"].map(h => (
              <th key={h} style={{ border: "1px solid #dee2e6", padding: "6px 10px",
                textAlign: h === "Concepto" ? "left" : "right", background: "#e9ecef",
                fontSize: 12, color: "#333" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {movs.map((m, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8f9fa" }}>
              <td style={{ border: "1px solid #dee2e6", padding: "5px 10px" }}>{m.concepto}</td>
              <td style={{ border: "1px solid #dee2e6", padding: "5px 10px", textAlign: "right" }}>{m.moneda}</td>
              <td style={{ border: "1px solid #dee2e6", padding: "5px 10px", textAlign: "right",
                color: m.entrada > 0 ? "#155724" : "#555" }}>
                {fmt(m.entrada)}
              </td>
              <td style={{ border: "1px solid #dee2e6", padding: "5px 10px", textAlign: "right",
                color: m.salida > 0 ? "#721c24" : "#555" }}>
                {fmt(m.salida)}
              </td>
              <td style={{ border: "1px solid #dee2e6", padding: "5px 10px", textAlign: "right",
                fontWeight: m.saldoSol > 0 ? "bold" : "normal" }}>
                {fmt(m.saldoSol)}
              </td>
              <td style={{ border: "1px solid #dee2e6", padding: "5px 10px", textAlign: "right",
                fontWeight: m.saldoDol > 0 ? "bold" : "normal" }}>
                {fmt(m.saldoDol)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totales tipo PHP — tabla verde-teal */}
      <table style={{ marginTop: 8, borderCollapse: "collapse", width: 320 }}>
        <tbody>
          <tr style={{ background: "#669999" }}>
            <td style={{ padding: "6px 14px" }}>
              <span style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}>S/</span>
            </td>
            <td style={{ padding: "6px 14px" }}>
              <span style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}>
                : {fmt(totalSol)}
              </span>
            </td>
          </tr>
          <tr style={{ background: "#DDEEFF" }}>
            <td style={{ padding: "6px 14px" }}>
              <span style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>US$</span>
            </td>
            <td style={{ padding: "6px 14px" }}>
              <span style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>
                : {fmt(totalDol)}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function MovCaja() {
  const [fecha] = useState(fechaHoy());

  // ── Imprimir ──
  const imprimir = () => {
    const filas = SUCURSALES.map(suc => {
      const movs = generarMovimientos(suc.id);
      const fmt  = v => parseFloat(v).toFixed(2);
      const totalSol = movs.reduce((a, m) => a + (m.moneda === "S/"  ? m.saldoSol : 0), 0);
      const totalDol = movs.reduce((a, m) => a + (m.moneda === "US$" ? m.saldoDol : 0), 0);

      return `
        <table border="1" cellpadding="4" cellspacing="0" width="100%"
          style="border-collapse:collapse;margin-bottom:4px;font-size:12px">
          <tr style="background:#284F57;color:#fff;height:28px">
            <td colspan="6" style="padding:4px 10px;font-weight:bold">${suc.nombre}</td>
          </tr>
          <tr style="background:#e9ecef;font-weight:bold;font-size:11px">
            <th align="left"  style="padding:4px 8px;border:1px solid #ccc">Concepto</th>
            <th align="right" style="padding:4px 8px;border:1px solid #ccc">Moneda</th>
            <th align="right" style="padding:4px 8px;border:1px solid #ccc">Entrada</th>
            <th align="right" style="padding:4px 8px;border:1px solid #ccc">Salida</th>
            <th align="right" style="padding:4px 8px;border:1px solid #ccc">Saldo S/</th>
            <th align="right" style="padding:4px 8px;border:1px solid #ccc">Saldo US$</th>
          </tr>
          ${movs.map((m, i) => `
            <tr style="background:${i%2===0?"#fff":"#f8f9fa"}">
              <td style="padding:4px 8px;border:1px solid #ddd">${m.concepto}</td>
              <td align="right" style="padding:4px 8px;border:1px solid #ddd">${m.moneda}</td>
              <td align="right" style="padding:4px 8px;border:1px solid #ddd;color:${m.entrada>0?"#155724":"#555"}">${fmt(m.entrada)}</td>
              <td align="right" style="padding:4px 8px;border:1px solid #ddd;color:${m.salida>0?"#721c24":"#555"}">${fmt(m.salida)}</td>
              <td align="right" style="padding:4px 8px;border:1px solid #ddd">${fmt(m.saldoSol)}</td>
              <td align="right" style="padding:4px 8px;border:1px solid #ddd">${fmt(m.saldoDol)}</td>
            </tr>`).join("")}
        </table>
        <table cellpadding="4" cellspacing="0" width="300" style="margin:6px 0 20px;border-collapse:collapse">
          <tr style="background:#669999">
            <td style="padding:4px 12px;font-size:16px;font-weight:bold;color:#fff">S/</td>
            <td style="padding:4px 12px;font-size:16px;font-weight:bold;color:#fff">: ${fmt(totalSol)}</td>
          </tr>
          <tr style="background:#DDEEFF">
            <td style="padding:4px 12px;font-size:16px;font-weight:bold">US$</td>
            <td style="padding:4px 12px;font-size:16px;font-weight:bold">: ${fmt(totalDol)}</td>
          </tr>
        </table>`;
    }).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
      <title>Movimiento de Caja ${fecha}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 13px; margin: 20px; }
        .no-print { display: flex; gap: 10px; margin-bottom: 16px; }
        @media print { .no-print { display: none !important; } }
      </style>
      </head><body>
      <div class="no-print">
        <button onclick="window.print()" style="background:#284F57;color:#fff;border:none;
          padding:7px 18px;border-radius:4px;cursor:pointer;font-size:13px">🖨 Imprimir</button>
        <button onclick="window.close()" style="background:#6c757d;color:#fff;border:none;
          padding:7px 18px;border-radius:4px;cursor:pointer;font-size:13px">✕ Cerrar</button>
      </div>
      <center><b style="font-size:15px">MOVIMIENTO DE CAJA ${fecha}</b></center><br>
      ${filas}
    </body></html>`;

    const w = window.open("", "_blank", "width=900,height=700,scrollbars=yes");
    w.document.write(html);
    w.document.close();
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: "18px 24px", fontFamily: "Arial, sans-serif", maxWidth: 1100 }}>

      {/* Barra superior */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 18, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 15, fontWeight: "bold", color: "#333" }}>
            MOVIMIENTO DE CAJA &nbsp;{fecha}
          </span>
        </div>
        <button
          onClick={imprimir}
          title="Imprimir"
          style={{ background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 5, color: "#888",
            fontSize: 13, padding: "4px 8px", borderRadius: 4 }}
          onMouseEnter={e => e.currentTarget.style.background = "#f0f0f0"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}>
          <IcoPrint /> Imprimir
        </button>
      </div>

      {/* Tablas por sucursal */}
      {SUCURSALES.map(suc => (
        <TablaSucursal key={suc.id} sucursal={suc} />
      ))}
    </div>
  );
}