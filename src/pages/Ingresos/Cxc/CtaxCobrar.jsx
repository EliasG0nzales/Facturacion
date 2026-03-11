import { useState } from "react";
import * as XLSX from "xlsx";

const EMPRESA = {
  nombre: "Eagle Gaming E.I.R.L.",
  ruc: "20607787728",
  direccion: "Av. Inca Garcilaso De La Vega 1348 Int 133 - Lima",
};

const data = [
  {
    id: 1, nro: "NV:001-000004", tipoDoc: "Nota de Venta", serie: "001", numero: "000004",
    cliente: "venta falabella", fecha: "2024-01-23", dias: "1 Dias",
    moneda: "S/", deuda: 320.0, fechaPago: "24/01/2024", estado: "Credito", pagos: [],
  },
  {
    id: 2, nro: "F:FI01-000001", tipoDoc: "Factura", serie: "FI01", numero: "000001",
    cliente: "Inteligente S.a.c.", fecha: "2026-02-26", dias: "2 Dias",
    moneda: "S/", deuda: 80.0, fechaPago: "28/02/2026", estado: "Credito", pagos: [],
  },
];

const thS = { padding: "5px 8px", border: "1px solid #999", fontWeight: 700, textAlign: "left", background: "#cccccc" };
const tdS = { padding: "5px 8px", border: "1px solid #999", background: "#cccccc" };

/* ── Export Excel con SheetJS ── */
function exportToExcel(rows) {
  const headers = ["NRO", "DOC.VENTA", "CLIENTE", "FECHA", "CRÉDITO", "MONEDA", "DEUDA", "FECHA PAGO", "ESTADO"];
  const wsData = [
    headers,
    ...rows.map((r, i) => [i + 1, r.nro, r.cliente, r.fecha, r.dias, r.moneda, r.deuda, r.fechaPago, r.estado]),
  ];
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  ws["!cols"] = [
    { wch: 6 }, { wch: 18 }, { wch: 22 }, { wch: 14 },
    { wch: 10 }, { wch: 8 }, { wch: 10 }, { wch: 14 }, { wch: 10 },
  ];
  XLSX.utils.book_append_sheet(wb, ws, "CuentaPorCobrar");
  XLSX.writeFile(wb, "CuentaPorCobrar.xlsx");
}

/* ── Modal impresión ── */
function ModalImpresion({ row, onClose }) {
  const handlePrint = () => {
    const content = document.getElementById("print-area");
    if (!content) return;
    const win = window.open("", "_blank", "width=800,height=700");
    win.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>Comprobante - ${row.cliente}</title>
  <style>
    @page { size: A4 portrait; margin: 10mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Calibri, Arial, sans-serif;
      font-size: 13px; color: #000;
      width: 100%; padding: 10px;
    }
    .print-container { width: 100%; max-width: 100%; margin: 0 auto; }
    .empresa { text-align: center; margin-bottom: 16px; line-height: 1.7; }
    .empresa .nombre { font-size: 18px; font-weight: 400; margin-bottom: 4px; }
    .cliente-info { text-align: center; margin-bottom: 14px; line-height: 1.8; }
    .section-title { text-align: center; font-weight: 700; font-size: 14px; margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; }
    th { padding: 6px 10px; background: #cccccc; border: 1px solid #999; font-weight: 700; text-align: left; }
    td { padding: 6px 10px; border: 1px solid #999; }
    tr:nth-child(odd) td  { background: #f9f9f9; }
    tr:nth-child(even) td { background: #fff; }
    td:first-child { font-weight: 600; width: 40%; }
  </style>
</head>
<body>
  <div class="print-container">
    <div class="empresa">
      <div class="nombre">${EMPRESA.nombre}</div>
      <div>RUC: ${EMPRESA.ruc}</div>
      <div>${EMPRESA.direccion}</div>
    </div>
    <div class="cliente-info">
      <div><strong>Cliente : </strong>${row.cliente}</div>
      <div>${row.tipoDoc} ${row.serie} ${row.numero} (${row.moneda} ${row.deuda.toFixed(2)})</div>
    </div>
    <div class="section-title">DETALLE DE CRÉDITO</div>
    <table>
      <thead><tr><th>Campo</th><th>Valor</th></tr></thead>
      <tbody>
        ${[
          ["Nro Documento", row.nro],
          ["Cliente",       row.cliente],
          ["Fecha",         row.fecha],
          ["Crédito",       row.dias],
          ["Moneda",        row.moneda],
          ["Deuda",         `${row.moneda} ${row.deuda.toFixed(2)}`],
          ["Fecha de Pago", row.fechaPago],
          ["Estado",        row.estado],
        ].map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("")}
      </tbody>
    </table>
  </div>
</body>
</html>`);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
      // Se cierra solo después de que el usuario termina con el diálogo de impresión
      win.onafterprint = () => win.close();
    }, 400);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }} onClick={onClose}>
      <div style={{ background: "#fff", border: "1px solid #ccc", borderRadius: 4, padding: "24px 28px", width: 540, maxWidth: "95vw", boxShadow: "0 6px 24px rgba(0,0,0,0.18)", fontFamily: "Calibri, Arial, sans-serif", fontSize: 14, color: "#222" }} onClick={e => e.stopPropagation()}>

        {/* Area que se imprimirá */}
        <div id="print-area">
          <div className="empresa">
            <h2>{EMPRESA.nombre}</h2>
            <div>{"R\u200BU\u200BC"}: {EMPRESA.ruc}</div>
            <div>{EMPRESA.direccion}</div>
          </div>
          <div className="cliente-info">
            <div><strong>Cliente : </strong>{row.cliente}</div>
            <div>{row.tipoDoc} {row.serie} {row.numero} ({row.moneda} {row.deuda.toFixed(2)})</div>
          </div>
          <div className="section-title">DETALLE DE CRÉDITO</div>
          <table>
            <thead>
              <tr>
                <th style={thS}>Campo</th>
                <th style={thS}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Nro Documento", row.nro],
                ["Cliente",       row.cliente],
                ["Fecha",         row.fecha],
                ["Crédito",       row.dias],
                ["Moneda",        row.moneda],
                ["Deuda",         `${row.moneda} ${row.deuda.toFixed(2)}`],
                ["Fecha de Pago", row.fechaPago],
                ["Estado",        row.estado],
              ].map(([campo, valor], i) => (
                <tr key={campo}>
                  <td style={{ ...tdS, background: i % 2 === 0 ? "#f9f9f9" : "#fff", fontWeight: 600 }}>{campo}</td>
                  <td style={{ ...tdS, background: i % 2 === 0 ? "#f9f9f9" : "#fff" }}>{valor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Botones */}
        <div style={{ marginTop: 18, display: "flex", gap: 8, justifyContent: "center" }}>
          <button onClick={onClose} style={{ padding: "6px 20px", background: "#f0f0f0", border: "1px solid #bbb", borderRadius: 3, cursor: "pointer", fontSize: 13, fontFamily: "Arial" }}>
            ← Regresar
          </button>
          <button onClick={handlePrint} style={{ padding: "6px 20px", background: "#1a7a9a", color: "#fff", border: "none", borderRadius: 3, cursor: "pointer", fontSize: 13, fontFamily: "Arial", display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9"/>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            Imprimir
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Modal detalle ── */
function ModalDetalle({ row, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }} onClick={onClose}>
      <div style={{ background: "#fff", border: "1px solid #bbb", borderRadius: 5, padding: "22px 26px", width: 360, maxWidth: "95vw", boxShadow: "0 6px 24px rgba(0,0,0,0.15)", fontFamily: "Arial, sans-serif" }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#1a6aaa", marginBottom: 12, paddingBottom: 8, borderBottom: "2px solid #1a8fbf" }}>Detalle de Pago</div>
        {[
          ["Documento",  row.nro],
          ["Cliente",    row.cliente],
          ["Fecha",      row.fecha],
          ["Crédito",    row.dias],
          ["Moneda",     row.moneda],
          ["Deuda",      `${row.moneda} ${row.deuda.toFixed(2)}`],
          ["Fecha Pago", row.fechaPago],
          ["Estado",     row.estado],
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #eee", fontSize: 13 }}>
            <span style={{ color: "#666" }}>{k}</span>
            <span style={{ color: "#222", fontWeight: 600 }}>{v}</span>
          </div>
        ))}
        <button onClick={onClose} style={{ marginTop: 14, width: "100%", padding: 7, background: "#f4f4f4", border: "1px solid #bbb", borderRadius: 3, color: "#444", cursor: "pointer", fontSize: 13, fontFamily: "Arial" }}>
          Cerrar
        </button>
      </div>
    </div>
  );
}

/* ── Principal ── */
export default function CuentaPorCobrar() {
  const [tab, setTab]           = useState("");
  const [viewMode, setViewMode] = useState("");
  const [searchBy, setSearchBy] = useState("");
  const [printMode, setPrintMode] = useState("");
  const [search, setSearch]     = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin]       = useState("");
  const [sortField, setSortField]     = useState(null);
  const [sortDir, setSortDir]         = useState("asc");
  const [detailModal, setDetailModal] = useState(null);
  const [printModal, setPrintModal]   = useState(null);

  const filtered = data.filter(row => {
    if (!search) return true;
    if (searchBy === "nro")      return row.nro.toLowerCase().includes(search.toLowerCase());
    if (searchBy === "clientes") return row.cliente.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;
    return sortDir === "asc" ? (a[sortField] > b[sortField] ? 1 : -1) : (a[sortField] < b[sortField] ? 1 : -1);
  });

  const toggleSort = f => {
    if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(f); setSortDir("asc"); }
  };

  const totalDeuda = data.reduce((s, r) => s + r.deuda, 0);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#fff", color: "#222", padding: "16px 20px" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .title-row { display: flex; align-items: center; gap: 8px; font-size: 18px; font-weight: 700; color: #222; margin-bottom: 10px; }
        .title-dot { width: 18px; height: 18px; border-radius: 50%; background: #1a8fbf; border: 2px solid #1575a0; flex-shrink: 0; }
        .radio-row { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #222; margin-bottom: 8px; flex-wrap: wrap; }
        .radio-row label { display: flex; align-items: center; gap: 3px; cursor: pointer; white-space: nowrap; }
        .filter-wrap { display: flex; align-items: flex-end; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; font-size: 13px; color: #222; }
        .filter-section { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .filter-section label { display: flex; align-items: center; gap: 3px; cursor: pointer; white-space: nowrap; }
        .search-input { border: 1px solid #bbb; border-radius: 3px; padding: 5px 8px; font-size: 13px; color: #222; font-family: Arial; outline: none; background: #fff; width: 200px; }
        .search-input:focus { border-color: #1a8fbf; }
        .date-field { display: flex; flex-direction: column; gap: 2px; }
        .date-label { font-size: 12px; color: #444; }
        .date-input { border: 1px solid #bbb; border-radius: 3px; padding: 5px 8px; font-size: 13px; color: #222; font-family: Arial; outline: none; background: #fff; width: 150px; }
        .btn-buscar { background: #1a8fbf; color: #fff; border: none; border-radius: 4px; padding: 7px 18px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: Arial; white-space: nowrap; align-self: flex-end; }
        .btn-buscar:hover { background: #157aa3; }
        .print-radios { display: flex; align-items: center; gap: 8px; font-size: 13px; align-self: flex-end; padding-bottom: 2px; }
        .print-radios label { display: flex; align-items: center; gap: 3px; cursor: pointer; }
        .list-title { text-align: center; font-size: 15px; color: #222; margin-bottom: 8px; }
        .table-wrap { overflow-x: auto; border: 1px solid #ccc; }
        table.main-t { width: 100%; border-collapse: collapse; font-size: 13px; }
        table.main-t thead tr { background: #1a7a9a; }
        table.main-t th { padding: 9px 12px; color: #fff; font-weight: 700; font-size: 12px; white-space: nowrap; text-align: left; user-select: none; }
        table.main-t th.sortable { cursor: pointer; }
        table.main-t th.sortable:hover { background: #155f78; }
        .right { text-align: right; }
        table.main-t td { padding: 8px 12px; border-bottom: 1px solid #e0e0e0; vertical-align: middle; color: #222; background: #fff; }
        table.main-t tbody tr:nth-child(even) td { background: #f7f7f7; }
        table.main-t tbody tr:hover td { background: #ccff66 !important; cursor: default; }
        .td-cliente { color: #1a6aaa; cursor: pointer; }
        .td-cliente:hover { text-decoration: underline; }
        .footer-row td { background: #e8e8e8 !important; font-weight: 700; border-top: 2px solid #ccc; }
        .actions { display: flex; gap: 4px; align-items: center; }
        .act-btn { background: none; border: none; cursor: pointer; padding: 3px 5px; border-radius: 3px; font-size: 15px; transition: background 0.1s; }
        .act-btn:hover { background: #f0f0f0; }
        .act-expand { color: #1a8fbf; }
        .act-print { color: #555; }
        .act-pay { color: #2a8a40; }
        .export-row { display: flex; justify-content: flex-end; gap: 6px; margin-top: 8px; }
        .exp-btn { background: none; border: none; cursor: pointer; padding: 2px 4px; border-radius: 2px; display: flex; align-items: center; }
        .exp-btn:hover { background: #f0f0f0; }

        /* ── PRINT MEDIA ── */
        @media print {
          @page { size: A4 portrait; margin: 10mm; }

          .print-header { display: block !important; text-align: center; margin-bottom: 8px; }
          /* Ocultar elementos de UI que no se imprimen */
          .nav, .radio-row, .filter-wrap, .actions,
          .export-row, .act-btn, .exp-btn, .btn-buscar,
          .print-radios, .vencido-label { display: none !important; }

          /* Mostrar y ajustar el contenido principal */
          body {
            background: #fff !important;
            margin: 0 !important;
            padding: 0 !important;
            font-family: Arial, sans-serif !important;
            font-size: 11px !important;
            color: #000 !important;
          }

          .title-row {
            display: flex !important;
            font-size: 14px !important;
            font-weight: 700 !important;
            margin-bottom: 6px !important;
            text-align: center !important;
            justify-content: center !important;
          }

          .list-title {
            display: block !important;
            text-align: center !important;
            font-size: 13px !important;
            margin-bottom: 6px !important;
          }

          .table-wrap {
            display: block !important;
            overflow: visible !important;
            border: none !important;
            width: 100% !important;
          }

          table.main-t {
            width: 100% !important;
            border-collapse: collapse !important;
            font-size: 10px !important;
          }

          table.main-t thead tr { background: #ccc !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          table.main-t th { color: #000 !important; background: #ccc !important; padding: 4px 6px !important; border: 1px solid #999 !important; font-size: 10px !important; }
          table.main-t td { padding: 4px 6px !important; border: 1px solid #ddd !important; background: #fff !important; }
          table.main-t tbody tr:nth-child(even) td { background: #f5f5f5 !important; }
          .footer-row td { background: #e0e0e0 !important; font-weight: 700 !important; border-top: 1px solid #999 !important; }

          /* Ocultar modales */
          .modal-overlay, [style*="position: fixed"] { display: none !important; }
        }
      `}</style>

      {/* Encabezado solo visible al imprimir */}
      <div style={{ display: "none" }} className="print-header">
        <div style={{ textAlign: "center", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
          {EMPRESA.nombre} — Software de Administración
        </div>
      </div>

      {/* TITLE */}
      <div className="title-row">
        <div className="title-dot"></div>
        CUENTA POR COBRAR
      </div>

      {/* RADIOS TIPO */}
      <div className="radio-row">
        <label><input type="radio" autoComplete="off" name="tab" checked={tab === "Credito"} onChange={() => setTab("Credito")} /> Credito</label>
        <span>(</span>
        <label><input type="radio" autoComplete="off" name="viewMode" checked={viewMode === "Vencido"} onChange={() => setViewMode("Vencido")} /> Vencido</label>
        <label><input type="radio" autoComplete="off" name="viewMode" checked={viewMode === "Todo"} onChange={() => setViewMode("Todo")} /> Todo</label>
        <span>)</span>
        <label><input type="radio" autoComplete="off" name="tab" checked={tab === "Cancelado"} onChange={() => setTab("Cancelado")} /> Cancelado</label>
      </div>

      {/* FILTROS */}
      <div className="filter-wrap">
        <div className="filter-section">
          <span style={{ fontWeight: 700 }}>BUSCAR X</span>
          <label><input type="radio" autoComplete="off" name="searchBy" checked={searchBy === "nro"} onChange={() => setSearchBy("nro")} /> Nro doc. /</label>
          <label><input type="radio" autoComplete="off" name="searchBy" checked={searchBy === "clientes"} onChange={() => setSearchBy("clientes")} /> clientes /</label>
          <label><input type="radio" autoComplete="off" name="searchBy" checked={searchBy === "ruc"} onChange={() => setSearchBy("ruc")} /> RUC</label>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <input className="search-input" type="search" value={search} onChange={e => setSearch(e.target.value)} />
          <span style={{ fontWeight: 700 }}>y/o</span>
        </div>
        <div className="date-field">
          <span className="date-label">Fecha Inicio</span>
          <input className="date-input" type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
        </div>
        <div className="date-field">
          <span className="date-label">Fecha Fin</span>
          <input className="date-input" type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
        </div>
        <button className="btn-buscar">📊 Buscar</button>
        <div className="print-radios">
          <label><input type="radio" autoComplete="off" name="printMode" checked={printMode === "Normal"} onChange={() => setPrintMode("Normal")} /> Normal</label>
          <label><input type="radio" autoComplete="off" name="printMode" checked={printMode === "Imprimir"} onChange={() => setPrintMode("Imprimir")} /> Imprimir</label>
        </div>
      </div>

      {/* TITULO LISTADO */}
      <div className="list-title">Listado de credito {viewMode}</div>

      {/* TABLA */}
      <div className="table-wrap">
        <table className="main-t">
          <thead>
            <tr>
              <th style={{ width: 36 }}>NRO</th>
              <th className="sortable" onClick={() => toggleSort("nro")}>DOC.VENTA {sortField === "nro" ? (sortDir === "asc" ? "↓" : "↑") : "↓"}</th>
              <th>CLIENTE</th>
              <th className="sortable" onClick={() => toggleSort("fecha")}>FECHA {sortField === "fecha" ? (sortDir === "asc" ? "↓" : "↑") : "↓"}</th>
              <th>CRED.</th>
              <th>M.</th>
              <th className="right">DEUDA</th>
              <th>FECHAP.</th>
              <th>ESTADO</th>
              <th style={{ width: 95 }}></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr key={row.id}>
                <td style={{ textAlign: "center" }}><strong>{i + 1}</strong></td>
                <td>{row.nro}</td>
                <td><span className="td-cliente" onClick={() => setSearch(row.cliente)}>{row.cliente}</span></td>
                <td>{row.fecha}</td>
                <td>{row.dias}</td>
                <td>{row.moneda}</td>
                <td className="right">{row.deuda.toFixed(2)}</td>
                <td>{row.fechaPago}</td>
                <td>{row.estado}</td>
                <td>
                  <div className="actions">
                    <button className="act-btn act-expand" title="Ver detalle" onClick={() => setDetailModal(row)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                    </button>
                    <button className="act-btn act-print" title="Imprimir" onClick={() => setPrintModal(row)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                    </button>
                    <button className="act-btn act-pay" title="Amortizar Deuda">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            <tr className="footer-row">
              <td></td><td></td><td></td>
              <td style={{ fontWeight: 700 }}>Deuda</td>
              <td style={{ fontWeight: 700 }}>US$ 0.00</td>
              <td></td>
              <td className="right" style={{ fontWeight: 700 }}>S/ {totalDeuda.toFixed(2)}</td>
              <td></td><td></td><td></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* BOTONES EXPORTAR */}
      <div className="export-row">
        <button className="exp-btn" style={{ color: "#555" }} title="Imprimir página completa" onClick={() => window.print()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
        </button>
        <button className="exp-btn" style={{ color: "#217346" }} title="Exportar a Excel" onClick={() => exportToExcel(sorted)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="18" rx="2" fill="#217346" stroke="#217346"/>
            <path d="M8 8l4 8M12 8l-4 8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            <path d="M16 8v8M14 12h4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* MODALES */}
      {detailModal && <ModalDetalle row={detailModal} onClose={() => setDetailModal(null)} />}
      {printModal  && <ModalImpresion row={printModal} onClose={() => setPrintModal(null)} />}
    </div>
  );
}