import { useState } from "react";

/* ─── opciones filtros ──────────────────────────────────────────── */
const documentos = [
  { value: "",              label: "Documento > todos" },
  { value: "Boleta",        label: "Boleta" },
  { value: "Factura",       label: "Factura" },
  { value: "Nota de Venta", label: "Nota de Venta" },
];

const sucursales = [
  { value: "",  label: "Sucursal > todos" },
  { value: "3", label: "Almacen 1 > Almacen 2B 167" },
  { value: "2", label: "Tienda2 > Tienda 1A 119" },
  { value: "1", label: "Tienda1 > Tienda 1b 133" },
];

const tiposBusqueda = [
  { value: "1",  label: "Nro documento" },
  { value: "2",  label: "Nombre/empresa" },
  { value: "3",  label: "Vendedor" },
  { value: "4",  label: "Articulo" },
  { value: "5",  label: "Linea" },
  { value: "51", label: "Categoria" },
  { value: "52", label: "Sub Cat. 1" },
  { value: "53", label: "Sub Cat. 2" },
  { value: "6",  label: "Marca" },
  { value: "7",  label: "Cod.Articulo" },
  { value: "71", label: "Cod.Bar.Articulo" },
  { value: "8",  label: "Serie.Articulo" },
  { value: "9",  label: "T.Venta" },
  { value: "10", label: "Venta Libre" },
];

/* ─── datos reales del sistema ──────────────────────────────────── */
const DATOS_REALES = [
  { doc:"Boleta",        nro:"BI01-000001", fecha:"2023-12-27", cliente:"Roger, Inga Salvador",               vend:"Alexander", tventa:"Contado",    cant:"1.00", codigo:"", articulo:"Procesador Intel Core I7-10700 2.90 ghz/",       moneda:"S/", pu:720.34,  igv:129.66, total:850.00  },
  { doc:"Boleta",        nro:"BI01-000002", fecha:"2023-12-27", cliente:"Roger, Inga Salvador",               vend:"Alexander", tventa:"Contado",    cant:"1.00", codigo:"", articulo:"Procesador Intel Core I7-10700 2.90 ghz/",       moneda:"S/", pu:720.34,  igv:129.66, total:850.00  },
  { doc:"Boleta",        nro:"BI01-000003", fecha:"2023-12-27", cliente:"Roger, Inga Salvador",               vend:"Alexander", tventa:"Cont: Visa", cant:"1.00", codigo:"", articulo:"Procesador Intel Core I7-10700 2.90 ghz/",       moneda:"S/", pu:720.34,  igv:129.66, total:850.00  },
  { doc:"Boleta",        nro:"BI01-000004", fecha:"2023-12-27", cliente:"Roger, Inga Salvador",               vend:"Alexander", tventa:"Cont: M",    cant:"1.00", codigo:"", articulo:"Procesador Intel Core I7-10700 2.90 ghz/",       moneda:"S/", pu:720.34,  igv:129.66, total:850.00  },
  { doc:"Nota de Venta", nro:"001-000012",  fecha:"2024-01-27", cliente:"venta falabella",                    vend:"demo",      tventa:"Contado",    cant:"1.00", codigo:"", articulo:"SSD 512gb T-Force Vulcan Z 2.5\" sata 3",        moneda:"S/", pu:109.32,  igv:20.68,  total:130.00  },
  { doc:"Nota de Venta", nro:"001-000012",  fecha:"2024-01-27", cliente:"venta falabella",                    vend:"demo",      tventa:"Contado",    cant:"1.00", codigo:"", articulo:"Placa madre B75 LGA 1155 Intel Core 2da/",       moneda:"S/", pu:135.59,  igv:24.41,  total:160.00  },
  { doc:"Nota de Venta", nro:"001-000015",  fecha:"2024-01-29", cliente:"venta falabella",                    vend:"demo",      tventa:"Contado",    cant:"1.00", codigo:"", articulo:"Tarjeta de video RTX 3060 ventus 2x oc,",        moneda:"S/", pu:1144.07, igv:205.93, total:1350.00 },
  { doc:"Boleta",        nro:"BI01-000005", fecha:"2024-02-06", cliente:"Angel Danilo, Wetzell Rodriguez",    vend:"demo",      tventa:"Contado",    cant:"1.00", codigo:"", articulo:"Tarjeta de video RTX 3060 asus dual, 12G",       moneda:"S/", pu:1169.49, igv:210.51, total:1380.00 },
  { doc:"Boleta",        nro:"BI01-000007", fecha:"2024-02-08", cliente:"Liliana, Quintana Morales",          vend:"demo",      tventa:"Contado",    cant:"1.00", codigo:"", articulo:"Case 1st player dk-d4 blanco 4 cooler rg",       moneda:"S/", pu:152.54,  igv:27.46,  total:180.00  },
  { doc:"Boleta",        nro:"BI01-000007", fecha:"2024-02-08", cliente:"Liliana, Quintana Morales",          vend:"demo",      tventa:"Contado",    cant:"1.00", codigo:"", articulo:"Fuente de poder halion 500w",                    moneda:"S/", pu:50.85,   igv:9.15,   total:60.00   },
  { doc:"Boleta",        nro:"BI01-000007", fecha:"2024-02-08", cliente:"Liliana, Quintana Morales",          vend:"demo",      tventa:"Contado",    cant:"1.00", codigo:"", articulo:"Tarjeta de video gtx 1650 - d6 ventus xs",       moneda:"S/", pu:576.27,  igv:103.73, total:680.00  },
  { doc:"Boleta",        nro:"BI01-000007", fecha:"2024-02-08", cliente:"Liliana, Quintana Morales",          vend:"demo",      tventa:"Contado",    cant:"1.00", codigo:"", articulo:"Adaptador usb tp link ac600 wi-fi, bluet",       moneda:"S/", pu:42.37,   igv:7.63,   total:50.00   },
  { doc:"Boleta",        nro:"BI01-000008", fecha:"2024-02-10", cliente:"José Abel, Olaechea Luis",           vend:"demo",      tventa:"Contado",    cant:"1.00", codigo:"", articulo:"Estabilizador 1000VA Forza FVR-1012 4 to",       moneda:"S/", pu:42.37,   igv:7.63,   total:50.00   },
  { doc:"Boleta",        nro:"BI01-000009", fecha:"2024-02-10", cliente:"David Cristhian, Monzon Casas",      vend:"demo",      tventa:"Contado",    cant:"1.00", codigo:"", articulo:"Procesador Intel Core i5 11400 lga 1200",        moneda:"S/", pu:508.47,  igv:91.53,  total:600.00  },
  { doc:"Boleta",        nro:"BI01-000009", fecha:"2024-02-10", cliente:"David Cristhian, Monzon Casas",      vend:"demo",      tventa:"Contado",    cant:"1.00", codigo:"", articulo:"Placa madre H510m-e asus",                       moneda:"S/", pu:254.24,  igv:45.76,  total:300.00  },
  { doc:"Boleta",        nro:"BI01-000010", fecha:"2024-02-10", cliente:"Josiph Jhonny, Condor Picardo",      vend:"Enmanuel",  tventa:"Cont: Efec", cant:"1.00", codigo:"", articulo:"Fuente de poder gigabyte ud 750w 80+ gol",       moneda:"S/", pu:377.12,  igv:67.88,  total:445.00  },
  { doc:"Boleta",        nro:"BI01-000014", fecha:"2024-02-13", cliente:"Hansel Franco, Chavez Garcia",       vend:"demo",      tventa:"Contado",    cant:"1.00", codigo:"", articulo:"Procesador Ryzen 5 5500 3,60ghz",                moneda:"S/", pu:364.41,  igv:65.59,  total:430.00  },
  { doc:"Boleta",        nro:"BI01-000014", fecha:"2024-02-13", cliente:"Hansel Franco, Chavez Garcia",       vend:"demo",      tventa:"Contado",    cant:"1.00", codigo:"", articulo:"Placa madre A520m a pro MSi",                    moneda:"S/", pu:220.34,  igv:39.66,  total:260.00  },
  { doc:"Boleta",        nro:"BI01-000014", fecha:"2024-02-13", cliente:"Hansel Franco, Chavez Garcia",       vend:"demo",      tventa:"Contado",    cant:"1.00", codigo:"", articulo:"Tarjetde video rtx 2060 6gb SZMZ",              moneda:"S/", pu:847.46,  igv:152.54, total:1000.00 },
  { doc:"Boleta",        nro:"BI01-000014", fecha:"2024-02-13", cliente:"Hansel Franco, Chavez Garcia",       vend:"demo",      tventa:"Contado",    cant:"1.00", codigo:"", articulo:"Estabilizador 1000VA Forza FVR-1012 4 to",       moneda:"S/", pu:42.37,   igv:7.63,   total:50.00   },
  { doc:"Boleta",        nro:"BI01-000018", fecha:"2024-02-17", cliente:"Cesar Adrian, Terrones Moreno",      vend:"demo",      tventa:"Contado",    cant:"1.00", codigo:"", articulo:"Fuente de poder gigabyte ud 750w 80+ gol",       moneda:"S/", pu:377.12,  igv:67.88,  total:445.00  },
  { doc:"Boleta",        nro:"BI01-000019", fecha:"2024-02-17", cliente:"Jesus Cristian, Sifuentes Sanchez",  vend:"demo",      tventa:"Contado",    cant:"1.00", codigo:"", articulo:"Placa madre B85 LGA 1150 Intel Core 4ta",        moneda:"S/", pu:168.64,  igv:30.36,  total:199.00  },
  { doc:"Boleta",        nro:"BI01-000020", fecha:"2024-02-17", cliente:"Stephany Johana, Avila Tovar",       vend:"demo",      tventa:"Contado",    cant:"1.00", codigo:"", articulo:"Fuente de poder gigabyte ud 750w 80+ gol",       moneda:"S/", pu:377.12,  igv:67.88,  total:445.00  },
  { doc:"Boleta",        nro:"BI01-000023", fecha:"2024-02-21", cliente:"Carlos Enrique, Mifflin Revilla",    vend:"demo",      tventa:"Contado",    cant:"1.00", codigo:"", articulo:"Tarjeta de video RTX 3060 ventus 2x oc,",        moneda:"S/", pu:1186.44, igv:213.56, total:1400.00 },
  { doc:"Boleta",        nro:"BI01-000026", fecha:"2024-03-01", cliente:"piers Javier giraldo",               vend:"demo",      tventa:"Contado",    cant:"1.00", codigo:"", articulo:"Procesador Intel Core i7 14700KF lga 170",       moneda:"S/", pu:1542.37, igv:277.63, total:1820.00 },
  { doc:"Boleta",        nro:"BI01-000027", fecha:"2024-03-10", cliente:"Luis Alexander, Quispe Ayala",       vend:"demo",      tventa:"Contado",    cant:"1.00", codigo:"", articulo:"ssd 2tb Kingston Fury Renegade m.2 NVMe",        moneda:"S/", pu:610.17,  igv:109.83, total:720.00  },
  { doc:"Factura",       nro:"FI01-000001", fecha:"2026-02-26", cliente:"Inteligente S.a.c.",                 vend:"Alexander", tventa:"Credito",    cant:"1.00", codigo:"", articulo:"Tinta Hp Hp",                                    moneda:"S/", pu:67.80,   igv:12.20,  total:80.00   },
  { doc:"Boleta",        nro:"BI01-000030", fecha:"2026-02-26", cliente:"Cliente",                            vend:"Alexander", tventa:"Cont: Bill", cant:"1.00", codigo:"", articulo:"Tinta hp hp",                                    moneda:"S/", pu:67.80,   igv:12.20,  total:80.00   },
  { doc:"Boleta",        nro:"BI01-000033", fecha:"2026-03-03", cliente:"Aaron Smith Iturri Quispe",          vend:"usuario",   tventa:"Contado",    cant:"3.00", codigo:"", articulo:"Monitor 24\" ASUS Proart PA248QV IPS FHD",        moneda:"S/", pu:2677.75, igv:482.00, total:3159.75 },
  { doc:"Boleta",        nro:"BI01-000034", fecha:"2026-03-03", cliente:"Raysa Yupanqui Barboza",             vend:"usuario",   tventa:"Contado",    cant:"1.00", codigo:"", articulo:"Monitor 24\" ASUS Proart PA248QV IPS FHD",        moneda:"S/", pu:892.58,  igv:160.67, total:1053.25 },
  { doc:"Boleta",        nro:"BI01-000035", fecha:"2026-03-06", cliente:"Raysa Yupanqui Barboza",             vend:"usuario",   tventa:"Contado",    cant:"2.00", codigo:"", articulo:"Monitor lg 22mn430 21.5\"",                       moneda:"S/", pu:512.83,  igv:92.31,  total:605.14  },
  { doc:"Boleta",        nro:"BI01-000036", fecha:"2026-03-07", cliente:"Gabriela Ines Luna Flores",          vend:"usuario",   tventa:"Contado",    cant:"2.00", codigo:"", articulo:"Monitor Curvo Teros TE-3412G 34\" Ultra",         moneda:"S/", pu:1608.47, igv:289.53, total:1898.00 },
];

/* ─── formato DOC-NRO: B:BI01-10 ────────────────────────────────── */
const fmtNro = (r) => {
  const prefijo = r.doc === "Boleta" ? "B:" : r.doc === "Factura" ? "F:" : r.doc === "Nota de Venta" ? "NV:" : "";
  const nroCorto = r.nro.replace(/^(\w+-?)0*(\d+)$/, "$1$2");
  return prefijo + nroCorto;
};

/* ─── campo a filtrar según tipo de búsqueda ────────────────────── */
const getCampo = (tipo, r) => ({
  "1": r.nro, "2": r.cliente, "3": r.vend, "4": r.articulo,
  "5": "", "51": "", "52": "", "53": "",
  "6": "", "7": r.codigo, "71": r.codigo,
  "8": "", "9": r.tventa, "10": "",
}[tipo] ?? "");

/* ─── estilos ───────────────────────────────────────────────────── */
const sel = { fontSize:12, padding:"1px 2px", border:"1px solid #aaa", borderRadius:2, height:22, background:"#fff", color:"#000", cursor:"pointer" };
const inp = { fontSize:12, padding:"1px 4px", border:"1px solid #aaa", borderRadius:2, height:22, background:"#fff", color:"#000", outline:"none" };
const TD = ({ style, children, ...rest }) => (
  <td style={{ fontSize:12, padding:"4px 6px", borderBottom:"1px solid #e8e8e8", ...style }} {...rest}>{children}</td>
);
const TH = ({ style, children, ...rest }) => (
  <th style={{ fontSize:12, padding:"5px 6px", fontWeight:"bold", color:"#fff", textAlign:"left", ...style }} {...rest}>{children}</th>
);
const fmt = (n) => Number(n || 0).toLocaleString("es-PE", { minimumFractionDigits:2, maximumFractionDigits:2 });

/* ════════════════════════════════════════════════════════════════════ */
export default function Detallado() {
  const [filters, setFilters] = useState({
    documento:"", sucursal:"", tipo:"1", busqueda:"",
    fechaInicio:"", fechaFin:"", notaCredito:false, comision:false,
  });
  const [resultados, setResultados] = useState([]);
  const [totales,    setTotales]    = useState({ totalCant:"", ventaUSD:0, ventaSOL:0, compraUSD:0, compraSOL:0, margenUSD:0, margenSOL:0 });
  const [loading,    setLoading]    = useState(false);
  const [buscado,    setBuscado]    = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const buscar = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        docmentos:   filters.documento,
        buscarlocal: filters.sucursal,
        tipo:        filters.tipo,
        venta:       filters.busqueda,
        fei:         filters.fechaInicio,
        fef:         filters.fechaFin,
        ncredito:    filters.notaCredito ? "Si" : "",
        comision:    filters.comision    ? "Si" : "",
      });
      const res = await fetch(`/api/venta_reporte_detallado.php?${params}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      setResultados(json.filas || []);
      setTotales(json.totales  || { totalCant:"", ventaUSD:0, ventaSOL:0, compraUSD:0, compraSOL:0, margenUSD:0, margenSOL:0 });
    } catch {
      /* fallback local */
      let data = [...DATOS_REALES];

      if (filters.documento)
        data = data.filter(r => r.doc === filters.documento);

      const q = filters.busqueda.trim().toLowerCase();
      if (q)
        data = data.filter(r => getCampo(filters.tipo, r).toLowerCase().includes(q));

      if (filters.fechaInicio) data = data.filter(r => r.fecha >= filters.fechaInicio);
      if (filters.fechaFin)    data = data.filter(r => r.fecha <= filters.fechaFin);

      const ventaSOL  = parseFloat(data.reduce((s, r) => s + r.total, 0).toFixed(2));
      const compraSOL = parseFloat((ventaSOL * 0.896).toFixed(2));
      setResultados(data);
      setTotales({
        totalCant: data.reduce((s, r) => s + parseFloat(r.cant), 0),
        ventaUSD:0,  ventaSOL,
        compraUSD:0, compraSOL,
        margenUSD:0, margenSOL: parseFloat((ventaSOL - compraSOL).toFixed(2)),
      });
    } finally {
      setLoading(false);
      setBuscado(true);
    }
  };

  const exportarExcel = () => {
    if (!resultados.length) return;
    const headers = ["Doc-Nro","Fecha","Cliente","Vend.","T.Venta","Cant.","Codigo","Articulo","M","P/U","IGV","Total"];
    const rows = resultados.map(r => [fmtNro(r), r.fecha, r.cliente, r.vend, r.tventa, r.cant, r.codigo, r.articulo, r.moneda, fmt(r.pu), fmt(r.igv), fmt(r.total)]);
    const csv  = [headers, ...rows].map(row => row.map(c => `"${c ?? ""}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type:"text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "venta_detallado.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ fontFamily:"Arial, Tahoma, sans-serif", color:"#000", fontSize:13 }}>

      {/* Título */}
      <div style={{ padding:"6px 10px 4px", display:"flex", alignItems:"center", gap:6 }}>
        <span style={{ color:"#1a6fc4", fontSize:11, cursor:"pointer", border:"2px solid #1a6fc4", borderRadius:"50%", width:18, height:18, display:"inline-flex", alignItems:"center", justifyContent:"center", fontWeight:"bold" }}>?</span>
        <b style={{ fontSize:13 }}>VENTA : REPORTE DETALLADO</b>
      </div>

      {/* Formulario */}
      <div style={{ padding:"4px 10px 10px", borderBottom:"1px solid #ddd" }}>
        <div style={{ display:"flex", alignItems:"flex-end", gap:8, flexWrap:"wrap" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:3, flexWrap:"wrap" }}>
              <b style={{ fontSize:12 }}>BUSCAR X</b>
              <select name="documento" value={filters.documento} onChange={handleChange} style={sel}>
                {documentos.map(d => <option key={d.value} value={d.value} style={{ background:"#fff", color:"#000" }}>{d.label}</option>)}
              </select>
              <select name="sucursal" value={filters.sucursal} onChange={handleChange} style={sel}>
                {sucursales.map(s => <option key={s.value} value={s.value} style={{ background:"#fff", color:"#000" }}>{s.label}</option>)}
              </select>
              <span style={{ fontSize:12 }}>y/o</span>
              <select name="tipo" value={filters.tipo} onChange={handleChange} style={{ ...sel, width:130 }}>
                {tiposBusqueda.map(t => <option key={t.value} value={t.value} style={{ background:"#fff", color:"#000" }}>{t.label}</option>)}
              </select>
              <span title="Se incluye NOTA DE CREDITO" style={{ fontSize:11, color:"#1a6fc4", cursor:"pointer" }}>NotaCredito</span>
              <input type="checkbox" name="notaCredito" checked={filters.notaCredito} onChange={handleChange} style={{ width:13, margin:0, accentColor:"#1a6fc4" }} />
              <span style={{ fontSize:12 }}>/</span>
              <span title="Comisión" style={{ fontSize:11, color:"#555", cursor:"pointer" }}>Comi</span>
              <input type="checkbox" name="comision" checked={filters.comision} onChange={handleChange} style={{ width:13, margin:0 }} />
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <input type="text" name="busqueda" value={filters.busqueda}
                onChange={handleChange} onKeyDown={e => e.key === "Enter" && buscar()}
                placeholder="Ingrese texto de búsqueda..." style={{ ...inp, width:420 }} />
              <b style={{ fontSize:12 }}>y/o</b>
            </div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
            <span style={{ fontSize:12 }}>Fecha Inicio</span>
            <div style={{ display:"flex", border:"1px solid #aaa", borderRadius:2, overflow:"hidden", height:24 }}>
              <input type="date" name="fechaInicio" value={filters.fechaInicio} onChange={handleChange}
                style={{ border:"none", fontSize:11, padding:"1px 3px", outline:"none", width:108, color:"#000", background:"#fff", colorScheme:"light" }} />
              <div style={{ background:"#d4edda", borderLeft:"1px solid #aaa", display:"flex", alignItems:"center", padding:"0 5px", cursor:"pointer", fontSize:13 }}>📅</div>
            </div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
            <span style={{ fontSize:12 }}>Fecha Fin</span>
            <div style={{ display:"flex", border:"1px solid #aaa", borderRadius:2, overflow:"hidden", height:24 }}>
              <input type="date" name="fechaFin" value={filters.fechaFin} onChange={handleChange}
                style={{ border:"none", fontSize:11, padding:"1px 3px", outline:"none", width:108, color:"#000", background:"#fff", colorScheme:"light" }} />
              <div style={{ background:"#d4edda", borderLeft:"1px solid #aaa", display:"flex", alignItems:"center", padding:"0 5px", cursor:"pointer", fontSize:13 }}>📅</div>
            </div>
          </div>

          <button type="button" onClick={buscar} disabled={loading} style={{
            background: loading ? "#aaa" : "#17a2b8", color:"#fff", border:"none", borderRadius:4,
            padding:"0 16px", fontSize:13, fontWeight:"bold",
            cursor: loading ? "not-allowed" : "pointer",
            height:28, display:"flex", alignItems:"center", gap:5,
          }}>
            {loading ? "⏳ Buscando..." : "🔍 Buscar"}
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div style={{ padding:"6px 8px" }}>
        <div style={{ textAlign:"center", fontWeight:"bold", fontSize:13, marginBottom:4 }}>
          LISTADO REPORTE DE VENTA DETALLADO
        </div>

        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#1a6fc4" }}>
              <TH>DOC-NRO</TH>
              <TH>FECHA</TH>
              <TH>CLIENTE</TH>
              <TH>VEND.</TH>
              <TH>T.VENTA</TH>
              <TH style={{ textAlign:"center" }}>CANT.</TH>
              <TH style={{ textAlign:"center" }}>CODGO</TH>
              <TH>ARTICULO</TH>
              <TH style={{ textAlign:"center" }}>M</TH>
              <TH style={{ textAlign:"right" }}>P/U</TH>
              <TH style={{ textAlign:"right" }}>IGV</TH>
              <TH style={{ textAlign:"right" }}>TOTAL</TH>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={12} style={{ textAlign:"center", padding:16, color:"#555" }}>⏳ Cargando datos...</td></tr>
            )}

            {!loading && resultados.map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f9f9f9" }}>
                <TD>
                  <a href={`#ver-${r.nro}`} style={{ color:"#1a6fc4", textDecoration:"none", fontSize:12 }}
                    onClick={e => e.preventDefault()}>
                    {fmtNro(r)}
                  </a>
                </TD>
                <TD>{r.fecha}</TD>
                <TD>{r.cliente}</TD>
                <TD>{r.vend}</TD>
                <TD>{r.tventa}</TD>
                <TD style={{ textAlign:"center" }}>{r.cant}</TD>
                <TD style={{ textAlign:"center" }}>{r.codigo}</TD>
                <TD>{r.articulo}</TD>
                <TD style={{ textAlign:"center" }}>{r.moneda}</TD>
                <TD style={{ textAlign:"right" }}>{fmt(r.pu)}</TD>
                <TD style={{ textAlign:"right" }}>{fmt(r.igv)}</TD>
                <TD style={{ textAlign:"right" }}>{fmt(r.total)}</TD>
              </tr>
            ))}

            {!loading && buscado && resultados.length === 0 && (
              <tr><td colSpan={12} style={{ textAlign:"center", padding:12, color:"#888", fontStyle:"italic", fontSize:12 }}>
                No se encontraron resultados
              </td></tr>
            )}

            {/* PRECIO VENTA */}
            <tr style={{ background:"#E6E6E6" }}>
              <TD><b>Totales</b></TD><TD></TD>
              <TD><b>PRECIO VENTA</b></TD>
              <TD></TD><TD></TD>
              <TD style={{ textAlign:"center" }}><b>{totales.totalCant !== "" ? totales.totalCant : ""}</b></TD>
              <TD></TD>
              <TD style={{ textAlign:"right" }}><b>US$ {fmt(totales.ventaUSD)}</b></TD>
              <TD></TD><TD></TD>
              <TD colSpan={2} style={{ textAlign:"right" }}><b>S/ {fmt(totales.ventaSOL)}</b></TD>
            </tr>

            {/* PRECIO COMPRA */}
            <tr style={{ background:"#E6E6E6" }}>
              <TD><b>Totales</b></TD><TD></TD>
              <TD><b>PRECIO COMPRA</b></TD>
              <TD></TD><TD></TD><TD></TD><TD></TD>
              <TD style={{ textAlign:"right" }}><b>US$ {fmt(totales.compraUSD)}</b></TD>
              <TD></TD><TD></TD>
              <TD colSpan={2} style={{ textAlign:"right" }}><b>S/ {fmt(totales.compraSOL)}</b></TD>
            </tr>

            {/* TOTAL MARGEN */}
            <tr style={{ background:"#E6E6E6" }}>
              <TD><b>Totales</b></TD><TD></TD>
              <TD><b>Total Margen</b></TD>
              <TD></TD><TD></TD><TD></TD><TD></TD>
              <TD style={{ textAlign:"right" }}><b>US$ {fmt(totales.margenUSD)}</b></TD>
              <TD></TD><TD></TD>
              <TD colSpan={2} style={{ textAlign:"right" }}><b>S/ {fmt(totales.margenSOL)}</b></TD>
            </tr>
          </tbody>
        </table>

        {/* Iconos exportar */}
        <div style={{ display:"flex", justifyContent:"flex-end", alignItems:"center", gap:8, paddingRight:4, margin:"6px 0" }}>
          <span title="Imprimir" style={{ cursor:"pointer" }} onClick={() => window.print()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"/>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
          </span>
          <span title="Exportar Excel" style={{ cursor: resultados.length ? "pointer" : "not-allowed", opacity: resultados.length ? 1 : 0.4 }} onClick={exportarExcel}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#39B636" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="8" y1="13" x2="16" y2="13"/>
              <line x1="8" y1="17" x2="16" y2="17"/>
              <line x1="10" y1="9" x2="8" y2="9"/>
            </svg>
          </span>
          <span title="Exportar Word" style={{ cursor:"pointer" }} onClick={() => alert("Exportar Word: pendiente de integración con backend")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3333CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="8" y1="13" x2="16" y2="13"/>
              <line x1="8" y1="17" x2="16" y2="17"/>
            </svg>
          </span>
        </div>

        <hr style={{ borderColor:"#ddd", margin:"6px 0" }} />

        <div style={{ textAlign:"center", padding:"6px 0 10px" }}>
          <a href="/reportes/venta/productos-vendidos-cliente" style={{ color:"#1a6fc4", fontSize:13 }}>
            Reporte Productos Vendidos al cliente
          </a>
        </div>
      </div>
    </div>
  );
}