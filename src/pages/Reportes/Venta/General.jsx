import { useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.20.0/package/xlsx.mjs";
import { VENTAS_DATA, normalizarDepto } from "./ventasPorDepartamento";

const DOCUMENTOS = ["Boleta","Factura","Nota de Venta","FacturaBoleta","GUIA"];
const SUCURSALES = [
  { id: "3", nombre: "Almacen 1 > Almacen 2B 167" },
  { id: "2", nombre: "Tienda2 > Tienda 1A 119" },
  { id: "1", nombre: "Tienda1 > Tienda 1b 133" },
];
const TIPOS = [
  { val: "1",  label: "Nro documento" },
  { val: "2",  label: "Nombre/empresa" },
  { val: "21", label: "DNI/RUC" },
  { val: "3",  label: "Distrito cliente" },
  { val: "31", label: "Dpto cliente" },
  { val: "4",  label: "Vendedor" },
  { val: "5",  label: "T.Venta" },
  { val: "6",  label: "T.Pago" },
  { val: "7",  label: "Nro Op.Banco" },
  { val: "8",  label: "Nro Op.Banco-Avanzado" },
  { val: "11", label: "Nombre Tarjeta/banco" },
  { val: "9",  label: "Serie del documento" },
];

const thBase    = { padding: "8px 10px", fontSize: 12, fontWeight: "bold", textAlign: "center", color: "#fff" };
const tdBase    = { padding: "6px 10px", fontSize: 12, borderBottom: "1px solid #ddd" };
const selectSt  = { border: "1px solid #ccc", borderRadius: 3, padding: "3px 6px", fontSize: 12, background: "#fff", color: "#333" };
const inputSt   = { border: "1px solid #ccc", borderRadius: 3, padding: "4px 8px", fontSize: 12, background: "#fff", color: "#333" };

export default function General() {
  const [searchParams] = useSearchParams();
  const tipoParam  = searchParams.get("tipo")  || "1";
  const ventaParam = searchParams.get("venta") || "";
  const anioParam  = searchParams.get("annnn") || "";

  const [documento,   setDocumento]   = useState("");
  const [sucursal,    setSucursal]    = useState("");
  const [tipo,        setTipo]        = useState(tipoParam);
  const [buscar,      setBuscar]      = useState(ventaParam);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin,    setFechaFin]    = useState("");
  const [conAnticipo, setConAnticipo] = useState(false);
  const [consultado,  setConsultado]  = useState(!!ventaParam);
  const tableRef = useRef(null);

  // Filtrar por departamento cuando viene del reporte gráfico (tipo=31, venta=nombreDepto)
  const ventas = consultado
    ? (ventaParam && tipoParam === "31"
        ? VENTAS_DATA.filter(
            (v) =>
              v.departamento &&
              normalizarDepto(v.departamento) === normalizarDepto(ventaParam)
          )
        : VENTAS_DATA)
    : [];

  const contado  = ventas.filter(v => v.tipo === "Contado");
  const credito  = ventas.filter(v => v.tipo === "Credito");
  const totalContSoles   = contado.reduce((a,v) => a + v.soles, 0);
  const totalContDolares = contado.reduce((a,v) => a + v.dolares, 0);
  const totalCredSoles   = credito.reduce((a,v) => a + v.soles, 0);
  const totalCredDolares = credito.reduce((a,v) => a + v.dolares, 0);
  const totalSoles       = totalContSoles + totalCredSoles;
  const totalDolares     = totalContDolares + totalCredDolares;

  // Exportar Excel usando SheetJS desde CDN via script dinámico
  const exportarExcel = () => {
    const rows = [
      ["Doc-Nro","Fecha","Cliente","RUC/DNI","Vendedor","T.Venta","Dólares","Soles"],
      ...ventas.map(v => [v.doc, v.fecha, v.cliente, v.ruc, v.vendedor, v.tventa, v.dolares, v.soles]),
      ["Contado", `#${contado.length}`, "","","","", totalContDolares, totalContSoles],
      ["Credito",  "",                  "","","","", totalCredDolares, totalCredSoles],
      ["Contado + Credito","",          "","","","", totalDolares,     totalSoles],
    ];

    // Usar SheetJS si está disponible, si no exportar CSV
    if (window.XLSX) {
      const ws = window.XLSX.utils.aoa_to_sheet(rows);
      const wb = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(wb, ws, "Reporte");
      window.XLSX.writeFile(wb, "reporte_venta.xlsx");
    } else {
      // Fallback: exportar como CSV
      const csv = rows.map(r => r.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url; a.download = "reporte_venta.csv"; a.click();
      URL.revokeObjectURL(url);
    }
  };

  const rowLink = (doc) => (
    <span style={{ color: "#17a2b8", cursor: "pointer", textDecoration: "underline" }}>{doc}</span>
  );

  return (
    <div style={{ fontFamily: "Tahoma, Arial, sans-serif", fontSize: 13, color: "#333" }}>

      {/* Encabezado */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <span style={{ display:"inline-flex", alignItems:"center", justifyContent:"center",
          width:18, height:18, borderRadius:"50%", background:"#17a2b8",
          color:"#fff", fontSize:11, fontWeight:"bold" }}>?</span>
        <strong style={{ fontSize: 14 }}>VENTA : REPORTE</strong>
        <span style={{ color: "#999" }}>&gt;&gt;</span>
        <label style={{ display:"flex", alignItems:"center", gap:4 }}>
          <input type="checkbox" checked={conAnticipo}
            onChange={e => setConAnticipo(e.target.checked)}
            style={{ accentColor:"#17a2b8" }} /> Con Anticipo
        </label>
        <a href="#" style={{ color:"#17a2b8" }}>V.A.</a>
      </div>

      {/* Filtros */}
      <div style={{ display:"flex", alignItems:"flex-end", flexWrap:"wrap", gap:8, marginBottom:16 }}>
        <div>
          <div style={{ fontSize:11, color:"#666", marginBottom:3 }}><strong>BUSCAR X</strong></div>
          <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
            <select value={documento} onChange={e => setDocumento(e.target.value)} style={{ ...selectSt, width:110 }}>
              <option value="">Documento &gt; todos</option>
              {DOCUMENTOS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={sucursal} onChange={e => setSucursal(e.target.value)} style={{ ...selectSt, width:120 }}>
              <option value="">Sucursal &gt; todos</option>
              {SUCURSALES.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
            <span style={{ fontSize:12 }}>y/o</span>
            <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ ...selectSt, width:135 }}>
              {TIPOS.map(t => <option key={t.val} value={t.val}>{t.label}</option>)}
            </select>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:6 }}>
            <input type="text" value={buscar} onChange={e => setBuscar(e.target.value)}
              style={{ ...inputSt, width:340 }} placeholder="Buscar..." />
            <strong style={{ fontSize:12 }}>y/o</strong>
          </div>
        </div>

        <div style={{ display:"flex", gap:12, alignItems:"flex-end" }}>
          <div>
            <div style={{ fontSize:11, color:"#666", marginBottom:3 }}>Fecha Inicio</div>
            <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} style={inputSt} />
          </div>
          <div>
            <div style={{ fontSize:11, color:"#666", marginBottom:3 }}>Fecha Fin</div>
            <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} style={inputSt} />
          </div>
          <button onClick={() => setConsultado(true)} style={{
            background:"#17a2b8", color:"#fff", border:"none", borderRadius:4,
            padding:"7px 18px", fontSize:13, cursor:"pointer",
          }}>🔍 Buscar</button>
        </div>
      </div>

      {/* Info si viene de Departamentos */}
      {ventaParam && tipoParam === "31" && (
        <div style={{ marginBottom:8, fontSize:12, color:"#555", display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
          <span>
            Departamento: <strong>{ventaParam}</strong>
            {anioParam && <> — Año: <strong>{anioParam}</strong></>}
          </span>
          <Link
            to="/rep-venta-graf?vista=depto"
            style={{ color:"#17a2b8", textDecoration:"underline", fontSize:12 }}
          >
            ↩ Volver al reporte gráfico (Departamentos)
          </Link>
        </div>
      )}

      {/* ── LISTADO REPORTE GENERAL ── */}
      <div style={{ marginBottom:4 }}><strong>LISTADO REPORTE GENERAL</strong></div>
      <div style={{ overflowX:"auto", marginBottom:20 }} ref={tableRef}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#1a6e8e" }}>
              {["Doc-Nro","Fecha","Cliente","RUC/DNI","Vendedor","T.Venta","Dólares","Soles"].map(h => (
                <th key={h} style={thBase}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ventas.map((v, i) => (
              <tr key={i} style={{ background: i%2===0 ? "#fff" : "#f5f5f5" }}>
                <td style={{ ...tdBase, textAlign:"center" }}>{rowLink(v.doc)}</td>
                <td style={{ ...tdBase, textAlign:"center" }}>{v.fecha}</td>
                <td style={{ ...tdBase }}>{v.cliente}</td>
                <td style={{ ...tdBase, textAlign:"center" }}>{v.ruc}</td>
                <td style={{ ...tdBase, textAlign:"center" }}>{v.vendedor}</td>
                <td style={{ ...tdBase, textAlign:"center" }}>{v.tventa}</td>
                <td style={{ ...tdBase, textAlign:"right" }}>{v.dolares.toFixed(2)}</td>
                <td style={{ ...tdBase, textAlign:"right" }}>{v.soles.toLocaleString("es-PE",{minimumFractionDigits:2})}</td>
              </tr>
            ))}

            {/* Fila Contado */}
            <tr style={{ background:"#ccc" }}>
              <td style={{ ...tdBase, fontWeight:"bold" }}>Contado</td>
              <td style={{ ...tdBase, fontWeight:"bold" }}>#{contado.length}</td>
              <td colSpan={4} style={tdBase}></td>
              <td style={{ ...tdBase, textAlign:"right", fontWeight:"bold" }}>US$ {totalContDolares.toFixed(2)}</td>
              <td style={{ ...tdBase, textAlign:"right", fontWeight:"bold" }}>S/ {totalContSoles.toLocaleString("es-PE",{minimumFractionDigits:2})}</td>
            </tr>
            {/* Fila Credito */}
            <tr style={{ background:"#ddd" }}>
              <td style={{ ...tdBase, fontWeight:"bold" }}>Credito</td>
              <td colSpan={5} style={tdBase}></td>
              <td style={{ ...tdBase, textAlign:"right", fontWeight:"bold" }}>US$ {totalCredDolares.toFixed(2)}</td>
              <td style={{ ...tdBase, textAlign:"right", fontWeight:"bold" }}>S/ {totalCredSoles.toLocaleString("es-PE",{minimumFractionDigits:2})}</td>
            </tr>
            {/* Fila Contado + Credito */}
            <tr style={{ background:"#c8c8c8" }}>
              <td style={{ ...tdBase, fontWeight:"bold" }}>Contado + Credito</td>
              <td colSpan={5} style={tdBase}></td>
              <td style={{ ...tdBase, textAlign:"right", fontWeight:"bold" }}>US$ {totalDolares.toFixed(2)}</td>
              <td style={{ ...tdBase, textAlign:"right", fontWeight:"bold" }}>S/ {totalSoles.toLocaleString("es-PE",{minimumFractionDigits:2})}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── LISTADO GENERAL DE GASTOS ── */}
      <div style={{ textAlign:"center", fontWeight:"bold", marginBottom:6 }}>LISTADO GENERAL DE GASTOS</div>
      <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:16 }}>
        <thead>
          <tr style={{ background:"#9B0000" }}>
            {["Fecha","Respo.","A","Motivo","Dólares","Soles"].map(h => (
              <th key={h} style={thBase}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr style={{ background:"#999" }}>
            <td colSpan={2} style={{ ...tdBase, color:"#fff" }}></td>
            <td style={{ ...tdBase, fontWeight:"bold", color:"#fff" }}>Total Gastos</td>
            <td style={{ ...tdBase, color:"#fff" }}></td>
            <td style={{ ...tdBase, textAlign:"right", fontWeight:"bold", color:"#fff" }}>0.00</td>
            <td style={{ ...tdBase, textAlign:"right", fontWeight:"bold", color:"#fff" }}>0.00</td>
          </tr>
          <tr style={{ background:"#326400" }}>
            <td colSpan={2} style={{ ...tdBase, color:"#fff" }}></td>
            <td style={{ ...tdBase, fontWeight:"bold", color:"#fff" }}>Ingreso - Gastos =</td>
            <td style={{ ...tdBase, color:"#fff" }}></td>
            <td style={{ ...tdBase, textAlign:"right", fontWeight:"bold", color:"#fff" }}>0.00</td>
            <td style={{ ...tdBase, textAlign:"right", fontWeight:"bold", color:"#fff" }}>{totalSoles.toLocaleString("es-PE",{minimumFractionDigits:2})}</td>
          </tr>
        </tbody>
      </table>

      {/* ── COMPRA ── */}
      <div style={{ textAlign:"center", fontWeight:"bold", marginBottom:4 }}>COMPRA</div>
      <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:0 }}>
        <thead>
          <tr style={{ background:"#9B0000" }}>
            {["Fecha","","Tipo Compra --  Doc/nro","Proveedor","Dólares","Soles"].map((h,i) => (
              <th key={i} style={thBase}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr><td colSpan={6} style={{ ...tdBase, textAlign:"center", fontWeight:"bold" }}>AMORTIZACION DE CREDITO (cta x pagar)</td></tr>
          <tr style={{ background:"#9B0000" }}>
            {["Fecha","","Proveedor","Responsable","Dólares","Soles"].map((h,i) => (
              <th key={i} style={thBase}>{h}</th>
            ))}
          </tr>
          <tr style={{ background:"#9B0000" }}>
            <td colSpan={2} style={{ ...tdBase, color:"#fff" }}></td>
            <td style={{ ...tdBase, fontWeight:"bold", color:"#fff" }}>Total Egreso</td>
            <td style={{ ...tdBase, color:"#fff" }}></td>
            <td style={{ ...tdBase, textAlign:"right", fontWeight:"bold", color:"#fff" }}>0.00</td>
            <td style={{ ...tdBase, textAlign:"right", fontWeight:"bold", color:"#fff" }}>0.00</td>
          </tr>
          <tr style={{ background:"#326400" }}>
            <td colSpan={2} style={{ ...tdBase, color:"#fff" }}></td>
            <td style={{ ...tdBase, fontWeight:"bold", color:"#fff" }}>TOTAL CAJA</td>
            <td style={{ ...tdBase, color:"#fff" }}></td>
            <td style={{ ...tdBase, textAlign:"right", fontWeight:"bold", color:"#fff" }}>0.00</td>
            <td style={{ ...tdBase, textAlign:"right", fontWeight:"bold", color:"#fff" }}>{totalSoles.toLocaleString("es-PE",{minimumFractionDigits:2})}</td>
          </tr>
        </tbody>
      </table>

      {/* ── Tipo de pago ── */}
      <div style={{ overflowX:"auto", margin:"16px auto", width:"60%" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#ccc", textAlign:"center" }}>
              {["Efectivo S/","","Tarjeta S/","Billetera S/","Depósito S/"].map((h,i) => (
                <th key={i} style={{ ...thBase, color:"#333", padding:"6px 10px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ textAlign:"center" }}>
              <td style={tdBase}>{totalSoles.toLocaleString("es-PE",{minimumFractionDigits:2})}</td>
              <td style={tdBase}></td>
              <td style={tdBase}>0.00</td>
              <td style={tdBase}>0.00</td>
              <td style={tdBase}>0.00</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Botones Imprimir / Excel ── */}
      <div style={{ display:"flex", justifyContent:"flex-end", gap:14, marginTop:12, paddingRight:8 }}>
        <button onClick={() => window.print()}
          title="Imprimir"
          style={{ background:"none", border:"none", cursor:"pointer", fontSize:22, color:"#888" }}>
          🖨️
        </button>
        <button onClick={exportarExcel}
          title="Exportar Excel"
          style={{ background:"none", border:"none", cursor:"pointer", fontSize:22, color:"#39B636" }}>
          📊
        </button>
      </div>

    </div>
  );
}