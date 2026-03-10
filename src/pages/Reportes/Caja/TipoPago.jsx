import { useState, useRef } from "react";

// ─── Datos demo ────────────────────────────────────────────────────────────────
const SUCURSALES = [
  { value: "",  label: "Sucursal > todos" },
  { value: "3", label: "Almacen 1 > Almacen 2B 167" },
  { value: "2", label: "Tienda2 > Tienda 1A 119"    },
  { value: "1", label: "Tienda1 > Tienda 1b 133"    },
];

const VENDEDORES = [
  { value: "",          label: "Vendedor > todos"           },
  { value: "demo",      label: "fac-tura.com..(demo)"       },
  { value: "Smith",     label: "Iturri, Quispe,..(Smith)"   },
  { value: "Enmanuel",  label: "Merino, Cahuna,..(Enmanuel)"},
  { value: "Alexander", label: "Romero, Merino,..(Alexander)"},
  { value: "usuario",   label: "Yupanqui, Barbo..(usuario)" },
];

// Tarjetas de tipo de pago — colores fiel al PHP
const TIPOS_PAGO = [
  { key:"Efectivo",    label:"EFECTIVO",   bg:"#3c98cd", borderColor:"#3c98cd",  monedaColor:"#3c98cd"  },
  { key:"Billetera",   label:"BILLETERA",  bg:"green",   borderColor:"green",    monedaColor:"green"    },
  { key:"Tarjeta",     label:"TARJETA",    bg:"#547A01", borderColor:"#547A01",  monedaColor:"#547A01"  },
  { key:"Deposito",    label:"DEPOSITO",   bg:"#7503BD", borderColor:"#7503BD",  monedaColor:"#7503BD"  },
  { key:"NotaCredito", label:"N.CREDITO",  bg:"#FC5694", borderColor:"#FC5694",  monedaColor:"#FC5694"  },
  { key:"Gastos",      label:"GASTOS",     bg:"red",     borderColor:"red",      monedaColor:"red"      },
];

// Resumen caja — fiel al PHP (orden y colores)
const RESUMEN_ITEMS = [
  { label:"TARJETAS + DEPOSITOS",        bg:"#fff",    color:"#000" },
  { label:"EFECTIVO NOTA VENTA",         bg:"#fff",    color:"#000" },
  { label:"EFECTIVO: FACTURA/BOLETA",    bg:"#fff",    color:"#000" },
  { label:"INGRESO TOTAL",               bg:"#D4C8FD", color:"#000" }, // cmo — morado claro
  { label:"EGRESO TRANS/DEP TOTAL",      bg:"#FDEDE1", color:"#000" }, // cro — rojo claro
  { label:"EGRESO EFECTIVO TOTAL",       bg:"#FDEDE1", color:"#000" },
  { label:"NOTA CREDITO",                bg:"#FDEDE1", color:"#000" },
  { label:"CAJA NETO",                   bg:"#e9ecef", color:"#000" }, // bgb5
  { label:"CAJA EFECTIVO",               bg:"#C3FEAD", color:"#000" }, // cve — verde claro
];

function generarTipos() {
  return TIPOS_PAGO.map(t => ({
    ...t,
    sol: (Math.random() * 5000).toFixed(2),
    usd: (Math.random() * 500).toFixed(2),
  }));
}

function generarVentas(vendedor, sucursal) {
  const docs = ["Factura","Boleta","Ticket","Nota Venta"];
  const clientes = ["García López, María","Torres Huanca, Juan","Quispe Mamani, Ana","Flores Ramos, Carlos","Vega Silva, Rosa"];
  const n = 6 + Math.floor(Math.random() * 6);
  return Array.from({ length: n }, (_, i) => {
    const doc = docs[Math.floor(Math.random() * docs.length)];
    const serie = doc === "Factura" ? "F001" : doc === "Boleta" ? "B001" : "T001";
    const nro   = String(1000 + i + 1).padStart(6, "0");
    const vend  = vendedor || VENDEDORES[1 + Math.floor(Math.random() * (VENDEDORES.length-1))].value;
    const suc   = sucursal || SUCURSALES[1 + Math.floor(Math.random() * (SUCURSALES.length-1))].value;
    const tipo  = TIPOS_PAGO[Math.floor(Math.random() * 4)].key;
    const monto = (50 + Math.random() * 950).toFixed(2);
    return {
      doc, serie, nro,
      fecha: "10/03/2026",
      cliente: clientes[Math.floor(Math.random() * clientes.length)],
      vendedor: vend,
      sucursal: suc,
      tipoPago: tipo,
      moneda: Math.random() > 0.85 ? "US$" : "S/",
      monto,
    };
  });
}

// ─── DatePicker ────────────────────────────────────────────────────────────────
const IcoCal = () => (
  <svg width="17" height="17" viewBox="0 0 36 36" fill="none">
    <rect x="1" y="4"  width="34" height="30" rx="3" fill="#fff" stroke="#bbb" strokeWidth="1.5"/>
    <rect x="1" y="4"  width="34" height="9"  rx="3" fill="#e74c3c"/>
    <rect x="1" y="9"  width="34" height="4"  fill="#e74c3c"/>
    <rect x="10" y="1" width="3"  height="7"  rx="1.5" fill="#888"/>
    <rect x="23" y="1" width="3"  height="7"  rx="1.5" fill="#888"/>
  </svg>
);

const DP = ({ value, onChange }) => {
  const ref = useRef();
  const display = value ? value.split("-").reverse().join("/") : "";
  return (
    <div style={{ position:"relative", display:"inline-flex", alignItems:"center",
      border:"1px solid #ced4da", borderRadius:4, background:"#fff",
      padding:"3px 8px", gap:4, cursor:"pointer", minWidth:115 }}
      onClick={() => ref.current.showPicker?.() ?? ref.current.click()}>
      <span style={{ fontSize:13, color: value ? "#212529" : "#aaa", minWidth:82 }}>
        {display || "dd/mm/aaaa"}
      </span>
      <IcoCal />
      <input ref={ref} type="date" value={value} onChange={e => onChange(e.target.value)}
        style={{ opacity:0, width:1, height:1, position:"absolute" }} />
    </div>
  );
};

// ─── Tarjeta tipo de pago ─────────────────────────────────────────────────────
function TarjetaTipo({ t }) {
  return (
    <div style={{ display:"flex", width:"48%", marginBottom:14, marginRight:"2%" }}>
      {/* Label color — ww29 */}
      <div style={{ background: t.bg, color:"#fff", padding:"20px",
        width:"29%", fontSize:16, fontWeight:"bold", display:"flex",
        alignItems:"center", justifyContent:"center", cursor:"pointer",
        minWidth:90 }}>
        {t.label}
      </div>
      {/* Monto — EfeMon style: border-left + border-bottom con color */}
      <div style={{ borderLeft:`5px solid ${t.borderColor}`,
        borderBottom:`5px solid ${t.borderColor}`,
        color: t.monedaColor, padding:"23px 14px",
        width:"70%", fontSize:18, fontWeight:"bold",
        display:"flex", alignItems:"center" }}>
        S/ {t.sol}
      </div>
    </div>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────────
export default function TipoPago() {
  const hoy = new Date().toISOString().slice(0, 10);
  const [sucursal, setSucursal] = useState("");
  const [vendedor, setVendedor] = useState("");
  const [fecha,    setFecha]    = useState(hoy);
  const [tipos,    setTipos]    = useState(generarTipos());
  const [ventas,   setVentas]   = useState(generarVentas("", ""));
  const [loading,  setLoading]  = useState(false);

  const fechaDisplay = fecha ? fecha.split("-").reverse().join("/") : "";

  // Totales para resumen
  const totalEfectivo   = parseFloat(tipos.find(t => t.key==="Efectivo")?.sol  || 0);
  const totalBilletera  = parseFloat(tipos.find(t => t.key==="Billetera")?.sol || 0);
  const totalTarjeta    = parseFloat(tipos.find(t => t.key==="Tarjeta")?.sol   || 0);
  const totalDeposito   = parseFloat(tipos.find(t => t.key==="Deposito")?.sol  || 0);
  const totalNcredito   = parseFloat(tipos.find(t => t.key==="NotaCredito")?.sol || 0);
  const totalGastos     = parseFloat(tipos.find(t => t.key==="Gastos")?.sol    || 0);

  const tarjDep       = (totalTarjeta + totalDeposito).toFixed(2);
  const efectNotaVta  = (totalBilletera).toFixed(2);
  const efectFactBol  = (totalEfectivo).toFixed(2);
  const ingresoTotal  = (totalEfectivo + totalBilletera + totalTarjeta + totalDeposito).toFixed(2);
  const egresoTransDep= (totalDeposito * 0.1).toFixed(2);
  const egresoEfect   = (totalGastos).toFixed(2);
  const notaCredito   = totalNcredito.toFixed(2);
  const cajaNeto      = (parseFloat(ingresoTotal) - parseFloat(egresoTransDep) - parseFloat(egresoEfect) - parseFloat(notaCredito)).toFixed(2);
  const cajaEfectivo  = (totalEfectivo - parseFloat(egresoEfect)).toFixed(2);

  const RESUMEN_VALS = [tarjDep, efectNotaVta, efectFactBol, ingresoTotal, egresoTransDep, egresoEfect, notaCredito, cajaNeto, cajaEfectivo];

  // Totales tabla ventas
  const totalUsd = ventas.filter(v=>v.moneda==="US$").reduce((s,v)=>s+parseFloat(v.monto),0).toFixed(2);
  const totalSol = ventas.filter(v=>v.moneda!=="US$").reduce((s,v)=>s+parseFloat(v.monto),0).toFixed(2);

  const buscar = () => {
    setLoading(true);
    setTimeout(() => {
      setTipos(generarTipos());
      setVentas(generarVentas(vendedor, sucursal));
      setLoading(false);
    }, 350);
  };

  return (
    <div style={{ fontFamily:"Arial, sans-serif", fontSize:13, padding:16, color:"#212529" }}>

      {/* ── Título ── */}
      <h4 style={{ margin:"0 0 12px 0", fontSize:16 }}>Venta</h4>

      {/* ── Formulario filtros — fiel al PHP ── */}
      <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center",
        gap:10, marginBottom:18, padding:"8px 12px",
        background:"#f8f9fa", border:"1px solid #dee2e6", borderRadius:6 }}>

        <select value={sucursal} onChange={e => setSucursal(e.target.value)}
          style={{ padding:"4px 8px", fontSize:13, border:"1px solid #ced4da",
            borderRadius:4, background:"#fff", color:"#212529" }}>
          {SUCURSALES.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <b>y/o</b>

        <select value={vendedor} onChange={e => setVendedor(e.target.value)}
          style={{ padding:"4px 8px", fontSize:13, border:"1px solid #ced4da",
            borderRadius:4, background:"#fff", color:"#212529" }}>
          {VENDEDORES.map(v => (
            <option key={v.value} value={v.value}>{v.label}</option>
          ))}
        </select>
        <b>y/o</b>

        <span style={{ fontSize:13 }}>Fecha</span>
        <DP value={fecha} onChange={setFecha} />

        <button onClick={buscar}
          style={{ background:"#17a2b8", color:"#fff", border:"none",
            borderRadius:4, padding:"5px 16px", cursor:"pointer",
            fontSize:13, display:"flex", alignItems:"center", gap:4 }}>
          🔍 Consultar
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign:"center", padding:40, color:"#888" }}>Cargando...</div>
      ) : (
        <>
          {/* ── Tarjetas tipo pago — 2 columnas, fiel al PHP ── */}
          <div style={{ display:"flex", flexWrap:"wrap", marginBottom:8 }}>
            {tipos.map((t, i) => <TarjetaTipo key={i} t={t} />)}
          </div>

          {/* ── Resumen caja — "five l" fiel al PHP ── */}
          <div style={{ display:"flex", justifyContent:"center", marginBottom:20 }}>
            <div style={{ width:"60%", minWidth:280 }}>
              {RESUMEN_ITEMS.map((item, i) => (
                <div key={i} style={{ display:"flex", borderBottom:"1px solid #ccc" }}>
                  <div style={{ width:"60%", padding:"10px 0",
                    background: item.bg, fontWeight:"bold", fontSize:13 }}>
                    {item.label}
                  </div>
                  <div style={{ width:"40%", padding:"10px 0",
                    background: item.bg, fontSize:13 }}>
                    : {RESUMEN_VALS[i]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Listado general de ventas ── */}
          <div style={{ textAlign:"center", marginBottom:8 }}>
            <b>LISTADO GENERAL DE VENTAS</b>
          </div>

          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ background:"#284F57", color:"#fff" }}>
                  {["Docum.","Nro Docu.","Fecha","Cliente","Vend.","Tipo","M.","Monto"].map(h => (
                    <th key={h} style={{ padding:"6px 8px", textAlign:
                      h==="Monto" ? "right" : h==="M." ? "center" : "left",
                      fontWeight:600, fontSize:12, border:"1px solid #3a6570" }}>
                      {h}
                    </th>
                  ))}
                </tr>
                {/* Fila totales cabecera — fiel al PHP */}
                <tr style={{ background:"#284F57", color:"#fff" }}>
                  <td colSpan={6} style={{ padding:"4px 8px", border:"1px solid #3a6570" }}></td>
                  <td style={{ padding:"4px 8px", textAlign:"right",
                    border:"1px solid #3a6570", fontSize:12 }}>
                    <b>US${totalUsd}</b>
                  </td>
                  <td style={{ padding:"4px 8px", textAlign:"right",
                    border:"1px solid #3a6570", fontSize:12 }}>
                    S/.<b>{totalSol}</b>
                  </td>
                </tr>
              </thead>
              <tbody>
                {ventas.map((v, i) => (
                  <tr key={i} style={{ background: i%2===0 ? "#fff" : "#f8f9fa" }}>
                    <td style={{ border:"1px solid #dee2e6", padding:"4px 8px" }}>{v.doc}</td>
                    <td style={{ border:"1px solid #dee2e6", padding:"4px 8px" }}>{v.serie}-{v.nro}</td>
                    <td style={{ border:"1px solid #dee2e6", padding:"4px 8px" }}>{v.fecha}</td>
                    <td style={{ border:"1px solid #dee2e6", padding:"4px 8px" }}>{v.cliente}</td>
                    <td style={{ border:"1px solid #dee2e6", padding:"4px 8px", width:"15%" }}>{v.vendedor}</td>
                    <td style={{ border:"1px solid #dee2e6", padding:"4px 8px" }}>
                      <span style={{
                        background: TIPOS_PAGO.find(t=>t.key===v.tipoPago)?.bg || "#ccc",
                        color:"#fff", borderRadius:3, padding:"2px 7px", fontSize:11
                      }}>
                        {v.tipoPago}
                      </span>
                    </td>
                    <td style={{ border:"1px solid #dee2e6", padding:"4px 8px",
                      textAlign:"center", width:"3%" }}>
                      {v.moneda}
                    </td>
                    <td style={{ border:"1px solid #dee2e6", padding:"4px 8px",
                      textAlign:"right", width:"9%" }}>
                      {v.monto}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Banner CAJA NETO — fiel al PHP ── */}
          <div style={{ background:"#C3FEAD", textAlign:"right", padding:"0 12px",
            height:40, lineHeight:"40px", fontSize:13, fontWeight:"bold",
            marginTop:4 }}>
            CAJA NETO : {cajaNeto}
          </div>
        </>
      )}
    </div>
  );
}