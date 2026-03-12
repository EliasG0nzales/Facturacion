import { useState } from "react";

/* ─── datos estáticos ─────────────────────────────────────────── */
const documentos = [
  { value: "", label: "Documento > todos" },
  { value: "Boleta", label: "Boleta" },
  { value: "Factura", label: "Factura" },
  { value: "Nota de Venta", label: "Nota de Venta" },
  { value: "FacturaBoleta", label: "Factura/Boleta" },
  { value: "GUIA", label: "Guia" },
];

const sucursales = [
  { value: "", label: "Sucursal > todos" },
  { value: "3", label: "Almacen 1 > Almacen 2B 167" },
  { value: "2", label: "Tienda2 > Tienda 1A 119" },
  { value: "1", label: "Tienda1 > Tienda 1b 133" },
];

const tiposBusqueda = [
  { value: "1", label: "Nro documento" },
  { value: "2", label: "Nombre/empresa" },
  { value: "21", label: "DNI/RUC" },
  { value: "3", label: "Distrito cliente" },
  { value: "31", label: "Dpto cliente" },
  { value: "4", label: "Vendedor" },
  { value: "5", label: "T.Venta" },
  { value: "6", label: "T.Pago" },
  { value: "7", label: "Nro Op.Banco" },
  { value: "8", label: "Nro Op.Banco-Avanzado" },
  { value: "11", label: "Nombre Tarjeta/banco" },
  { value: "9", label: "Serie del documento" },
];

/* ─── estilos base ────────────────────────────────────────────── */
const sel = {
  fontSize: 12,
  padding: "1px 2px",
  border: "1px solid #aaa",
  borderRadius: 2,
  height: 22,
  background: "#ffffff",
  color: "#000000",
  cursor: "pointer",
};

const inp = {
  fontSize: 12,
  padding: "1px 4px",
  border: "1px solid #aaa",
  borderRadius: 2,
  height: 22,
  background: "#ffffff",
  color: "#000000",
  outline: "none",
};

/* ─── helpers ─────────────────────────────────────────────────── */
const TD = ({ style, children, ...rest }) => (
  <td style={{ fontSize: 12, padding: "3px 8px", color: "inherit", ...style }} {...rest}>
    {children}
  </td>
);

const TH = ({ style, children, ...rest }) => (
  <th style={{ fontSize: 12, padding: "4px 8px", fontWeight: "bold", color: "inherit", ...style }} {...rest}>
    {children}
  </th>
);

/* ─── colores de filas ────────────────────────────────────────── */
const RED   = { background: "#9B0000", color: "#fff" };
const GRAY  = { background: "#999999", color: "#fff" };
const GREEN = { background: "#326400", color: "#fff" };
const LGRAY = { background: "#cccccc", color: "#000" };

/* ═══════════════════════════════════════════════════════════════ */
export default function General() {
  const [filters, setFilters] = useState({
    documento: "",
    sucursal: "",
    tipo: "1",
    busqueda: "",
    fechaInicio: "",
    fechaFin: "",
    conAnticipo: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  return (
    <div style={{ fontFamily: "Arial, Tahoma, sans-serif", color: "#000", fontSize: 13 }}>

      {/* ── Título ── */}
      <div style={{ padding: "6px 10px", display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{
          color: "#1a6fc4", fontSize: 11, cursor: "pointer",
          border: "2px solid #1a6fc4", borderRadius: "50%",
          width: 18, height: 18, display: "inline-flex",
          alignItems: "center", justifyContent: "center", fontWeight: "bold",
        }}>?</span>
        <b style={{ fontSize: 13 }}>VENTA : REPORTE</b>
        <span style={{ color: "#555", fontSize: 12 }}>&gt;&gt;</span>
        <label style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, cursor: "pointer" }}>
          <input
            type="checkbox" name="conAnticipo"
            checked={filters.conAnticipo} onChange={handleChange}
            style={{ margin: 0, accentColor: "#1a6fc4" }}
          />
          Con Anticipo
        </label>
        <a href="#" style={{ color: "#1a6fc4", fontSize: 12, textDecoration: "none" }}
          onClick={(e) => e.preventDefault()}>V.A.</a>
      </div>

      {/* ── Formulario de búsqueda ── */}
      <div style={{ padding: "4px 10px 10px", borderBottom: "1px solid #ddd" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, flexWrap: "wrap" }}>

          {/* selects + texto */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
              <b style={{ fontSize: 12 }}>BUSCAR X</b>

              <select name="documento" value={filters.documento} onChange={handleChange}
                style={sel}>
                {documentos.map((d) => (
                  <option key={d.value} value={d.value} style={{ background: "#fff", color: "#000" }}>
                    {d.label}
                  </option>
                ))}
              </select>

              <select name="sucursal" value={filters.sucursal} onChange={handleChange}
                style={sel}>
                {sucursales.map((s) => (
                  <option key={s.value} value={s.value} style={{ background: "#fff", color: "#000" }}>
                    {s.label}
                  </option>
                ))}
              </select>

              <span style={{ fontSize: 12 }}>y/o</span>

              <select name="tipo" value={filters.tipo} onChange={handleChange}
                style={{ ...sel, width: 130 }}>
                {tiposBusqueda.map((t) => (
                  <option key={t.value} value={t.value} style={{ background: "#fff", color: "#000" }}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="text" name="busqueda" value={filters.busqueda}
                onChange={handleChange}
                style={{ ...inp, width: 420 }}
              />
              <b style={{ fontSize: 12 }}>y/o</b>
            </div>
          </div>

          {/* Fecha Inicio */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: 12 }}>Fecha Inicio</span>
            <div style={{ display: "flex", border: "1px solid #aaa", borderRadius: 2, overflow: "hidden", height: 24 }}>
              <input type="date" name="fechaInicio" value={filters.fechaInicio}
                onChange={handleChange}
                style={{ border: "none", fontSize: 11, padding: "1px 3px", outline: "none", width: 108, color: "#000", background: "#fff", colorScheme: "light" }}
              />
              <div style={{ background: "#d4edda", borderLeft: "1px solid #aaa", display: "flex", alignItems: "center", padding: "0 5px", cursor: "pointer", fontSize: 13 }}>📅</div>
            </div>
          </div>

          {/* Fecha Fin */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: 12 }}>Fecha Fin</span>
            <div style={{ display: "flex", border: "1px solid #aaa", borderRadius: 2, overflow: "hidden", height: 24 }}>
              <input type="date" name="fechaFin" value={filters.fechaFin}
                onChange={handleChange}
                style={{ border: "none", fontSize: 11, padding: "1px 3px", outline: "none", width: 108, color: "#000", background: "#fff", colorScheme: "light" }}
              />
              <div style={{ background: "#d4edda", borderLeft: "1px solid #aaa", display: "flex", alignItems: "center", padding: "0 5px", cursor: "pointer", fontSize: 13 }}>📅</div>
            </div>
          </div>

          {/* Buscar */}
          <button type="button" style={{
            background: "#17a2b8", color: "#fff", border: "none", borderRadius: 4,
            padding: "0 16px", fontSize: 13, fontWeight: "bold", cursor: "pointer",
            height: 28, display: "flex", alignItems: "center", gap: 5,
          }}>
            🔍 Buscar
          </button>
        </div>
      </div>

      {/* ── Cuerpo ── */}
      <div style={{ padding: "6px 8px" }}>

        {/* LISTADO REPORTE GENERAL */}
        <div style={{ fontWeight: "bold", fontSize: 13, marginBottom: 4 }}>
          <b>LISTADO REPORTE GENERAL</b>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
          <thead>
            <tr style={{ background: "#1a6fc4", color: "#fff" }}>
              <TH>Doc-Nro</TH>
              <TH>Fecha</TH>
              <TH>Cliente</TH>
              <TH>RUC/DNI</TH>
              <TH>Vendedor</TH>
              <TH>T.Venta</TH>
              <TH style={{ textAlign: "right" }}>Dolares</TH>
              <TH style={{ textAlign: "right" }}>Soles</TH>
            </tr>
          </thead>
          <tbody>
            <tr style={LGRAY}>
              <TD><b>Contado</b></TD>
              <TD><b>#0</b></TD>
              <TD></TD><TD></TD><TD></TD><TD></TD>
              <TD style={{ textAlign: "right" }}><b>US$ 0.00</b></TD>
              <TD style={{ textAlign: "right" }}><b>S/ 0.00</b></TD>
            </tr>
          </tbody>
        </table>

        {/* LISTADO GENERAL DE GASTOS */}
        <b style={{ fontSize: 13 }}>LISTADO GENERAL DE GASTOS</b>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 4, marginBottom: 0 }}>
          <thead>
            <tr style={RED}>
              <TH style={{ textAlign: "left" }}>&nbsp;&nbsp;Fecha</TH>
              <TH>Respo.</TH>
              <TH>A</TH>
              <TH>Motivo</TH>
              <TH style={{ textAlign: "right", width: "10%" }}>Dolares</TH>
              <TH style={{ textAlign: "right", width: "10%" }}>Soles</TH>
            </tr>
          </thead>
          <tbody>
            <tr style={{ ...GRAY, height: 25 }}>
              <TD></TD><TD></TD>
              <TD><b>Total Gastos</b></TD>
              <TD></TD>
              <TD style={{ textAlign: "right", width: "20%" }}><b>0.00</b></TD>
              <TD style={{ textAlign: "right", width: "20%" }}><b>0.00</b></TD>
            </tr>
            <tr style={{ ...GREEN, height: 25 }}>
              <TD></TD><TD></TD>
              <TD><b>Ingreso - Gastos =</b></TD>
              <TD></TD>
              <TD style={{ textAlign: "right", width: "20%" }}><b>0.00</b></TD>
              <TD style={{ textAlign: "right", width: "20%" }}><b>0.00</b></TD>
            </tr>

            {/* COMPRA — título */}
            <tr style={{ height: 25 }}>
              <td colSpan={6} style={{ textAlign: "center", fontWeight: "bold", fontSize: 12, padding: "4px 0" }}>
                <b>COMPRA</b>
              </td>
            </tr>
          </tbody>

          {/* COMPRA — cabecera */}
          <thead>
            <tr style={{ ...RED, height: 25 }}>
              <TH>&nbsp;&nbsp;Fecha</TH>
              <TH></TH>
              <TH>Tipo Compra --&nbsp;&nbsp;&nbsp;&nbsp;<b>Doc/nro</b></TH>
              <TH>Proveedor</TH>
              <TH style={{ textAlign: "right" }}>Dolares</TH>
              <TH style={{ textAlign: "right" }}>Soles</TH>
            </tr>
          </thead>

          <tbody>
            {/* AMORTIZACION — título */}
            <tr style={{ height: 25 }}>
              <td colSpan={6} style={{ textAlign: "center", fontWeight: "bold", fontSize: 12, padding: "4px 0" }}>
                <b>AMORTIZACION DE CREDITO(cta x pagar)</b>
              </td>
            </tr>
          </tbody>

          {/* AMORTIZACION — cabecera */}
          <thead>
            <tr style={{ ...RED, height: 25 }}>
              <TH>&nbsp;&nbsp;Fecha</TH>
              <TH></TH>
              <TH>Proveedor</TH>
              <TH>Responsable</TH>
              <TH style={{ textAlign: "right" }}>Dolares</TH>
              <TH style={{ textAlign: "right" }}>Soles</TH>
            </tr>
          </thead>

          <tbody>
            <tr style={{ ...RED, height: 25 }}>
              <TD></TD><TD></TD>
              <TD><b>Total Egreso</b></TD>
              <TD></TD>
              <TD style={{ textAlign: "right", width: "20%" }}><b>0.00</b></TD>
              <TD style={{ textAlign: "right", width: "20%" }}><b>0.00</b></TD>
            </tr>
            <tr style={{ ...GREEN, height: 25 }}>
              <TD></TD><TD></TD>
              <TD><b>TOTAL CAJA</b></TD>
              <TD></TD>
              <TD style={{ textAlign: "right", width: "20%" }}><b>0.00</b></TD>
              <TD style={{ textAlign: "right", width: "20%" }}><b>0.00</b></TD>
            </tr>
          </tbody>
        </table>

        {/* ── Pagos ── */}
        <div style={{ display: "flex", justifyContent: "center", margin: "8px 0 4px" }}>
          <table style={{ borderCollapse: "collapse", width: "50%" }}>
            <thead>
              <tr style={{ background: "#ccc", textAlign: "center", height: 25 }}>
                {["Efectivo S/", "Tarjeta S/", "Billetera S/", "Deposito S/"].map((h) => (
                  <TH key={h} style={{ border: "1px solid #bbb", background: "#ccc" }}>{h}</TH>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ textAlign: "center", height: 25 }}>
                {["0.00", "0.00", "0.00", "0.00"].map((v, i) => (
                  <TD key={i} style={{ border: "1px solid #bbb", textAlign: "center" }}>{v}</TD>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── Iconos exportar ── */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 6, paddingRight: 4, marginBottom: 8 }}>
          {/* Imprimir */}
          <span
            title="Imprimir"
            style={{ cursor: "pointer", display: "inline-flex" }}
            onClick={() => window.print()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"/>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
          </span>

          {/* Exportar Excel */}
          <span
            title="Exportar Excel"
            style={{ cursor: "pointer", display: "inline-flex" }}
            onClick={() => {
              // Construir CSV con los datos de la tabla
              const rows = [
                ["Doc-Nro","Fecha","Cliente","RUC/DNI","Vendedor","T.Venta","Dolares","Soles"],
                ["Contado","#0","","","","","US$ 0.00","S/ 0.00"],
                [],
                ["LISTADO GENERAL DE GASTOS"],
                ["Fecha","Respo.","A","Motivo","Dolares","Soles"],
                ["","","Total Gastos","","0.00","0.00"],
                ["","","Ingreso - Gastos =","","0.00","0.00"],
                [],
                ["COMPRA"],
                ["Fecha","","Tipo Compra -- Doc/nro","Proveedor","Dolares","Soles"],
                [],
                ["AMORTIZACION DE CREDITO (cta x pagar)"],
                ["Fecha","","Proveedor","Responsable","Dolares","Soles"],
                ["","","Total Egreso","","0.00","0.00"],
                ["","","TOTAL CAJA","","0.00","0.00"],
                [],
                ["Efectivo S/","Tarjeta S/","Billetera S/","Deposito S/"],
                ["0.00","0.00","0.00","0.00"],
              ];
              const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
              const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "venta_reporte_general.csv";
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#39B636" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="8" y1="13" x2="16" y2="13"/>
              <line x1="8" y1="17" x2="16" y2="17"/>
              <line x1="10" y1="9" x2="8" y2="9"/>
            </svg>
          </span>
        </div>

      </div>



    </div>
  );
}