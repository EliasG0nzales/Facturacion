import React, { useMemo, useState } from "react";
import { CalendarDays, Save, Search, SquarePen, Undo2 } from "lucide-react";

const cuentas = [
  {
    id: 4,
    banco: "Interbank",
    nro: "4423115267400",
    cci: "",
    tipoCuenta: "Ahorros",
    moneda: "Soles",
    titular: "Chinchay Calle Cynthia",
    importeTotal: 290.0,
  },
  {
    id: 3,
    banco: "Bancos Continental BBVA",
    nro: "001101750200836572",
    cci: "",
    tipoCuenta: "Ahorros",
    moneda: "Soles",
    titular: "Cuenta Principal BBVA",
    importeTotal: 0.0,
  },
  {
    id: 2,
    banco: "Banco de Crédito del Perú -  BCP",
    nro: "19117637628084",
    cci: "",
    tipoCuenta: "Ahorros",
    moneda: "Soles",
    titular: "Cuenta Principal BCP",
    importeTotal: 0.0,
  },
  {
    id: 1,
    banco: "Yape",
    nro: "986638034",
    cci: "",
    tipoCuenta: "Ahorros",
    moneda: "Soles",
    titular: "Yape Demo",
    importeTotal: 1758.0,
  },
  {
    id: 5,
    banco: "Cuenta Dólares Demo",
    nro: "002550019923001",
    cci: "",
    tipoCuenta: "Ahorros",
    moneda: "Dolares",
    titular: "Demo Dólares",
    importeTotal: 325.5,
  },
];

const movimientosPorCuenta = {
  4: [
    {
      id: 88,
      fecha: "2024-04-07",
      ingreso: 290.0,
      egreso: 0.0,
      concepto: "Boleta:BI01-28",
      responsable: "demo",
    },
  ],
  3: [],
  2: [],
  1: [],
  5: [],
};

const ventaDemo = {
  id: 88,
  serie: "BI01",
  numero: "28",
  fecha: "2024-04-07",
  fechaVencimiento: "2024-04-07",
  nroOrden: "",
  moneda: "Soles",
  conIgvTexto: "Incluido IGV",
  tipoOperacion: "Venta Interna",
  preAnticipo: "No",
  nroGuia: "",
  cambio: "3.72",
  sucursal: "Tienda1:Tienda 1b 133",
  tipoVenta: "Contado",
  depositoTexto: "Deposito,Interbank,,demo,2024-04-07",
  comentario: ".",
  clienteLabel: "Cliente",
  vendedor: "fac-tura.cor",
  items: [
    {
      nro: 1,
      articulo: 'Monitor Teros te-2123s 21.45" ips, fhd,',
      cantidad: "1.00",
      unidadMedida: "Und.",
      tipoAfectacion: "Gravado - Operación Onerosa",
      precio: "290",
      subtotal: "290",
    },
  ],
  resumen: {
    gravada: "245.76",
    igv: "44.24",
    total: "290.00",
  },
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "transparent",
    padding: "10px 14px 28px",
    fontFamily: '"Arial Narrow", Arial, Helvetica, sans-serif',
    color: "#111",
    boxSizing: "border-box",
  },
  wrapper: {
    width: "100%",
    maxWidth: "1680px",
    margin: "0 auto",
  },
  formCenter: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
  },
  filterRow: {
    width: "50%",
    minWidth: "720px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  labelWrap: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "19px",
    color: "#111",
  },
  helpCircle: {
    width: "13px",
    height: "13px",
    borderRadius: "50%",
    background: "#0b8ef2",
    color: "#fff",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    fontWeight: 700,
    lineHeight: 1,
  },
  select: {
    width: "122px",
    height: "52px",
    border: "1px solid #cfcfcf",
    borderRadius: "4px",
    background: "#fff",
    padding: "0 10px",
    fontSize: "18px",
    color: "#111",
    outline: "none",
    boxSizing: "border-box",
  },
  searchBtn: {
    height: "48px",
    border: "none",
    borderRadius: "8px",
    background: "#35a8d6",
    color: "#fff",
    padding: "0 18px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "17px",
    cursor: "pointer",
  },
  titleWrap: {
    textAlign: "center",
    marginTop: "86px",
    marginBottom: "6px",
  },
  title: {
    fontSize: "18px",
    fontWeight: 700,
  },
  tableWrap: {
    width: "100%",
    border: "1px solid #d3d3d3",
    background: "#fff",
    overflowX: "auto",
  },
  listHeader: {
    display: "grid",
    gridTemplateColumns: "2.35fr 1.7fr 1.1fr 1.15fr 1fr 0.75fr",
    minWidth: "1320px",
    minHeight: "48px",
    alignItems: "center",
    textAlign: "center",
    background: "#045f89",
    color: "#fff",
    fontSize: "18px",
    letterSpacing: "2px",
    textTransform: "uppercase",
  },
  listRow: {
    display: "grid",
    gridTemplateColumns: "2.35fr 1.7fr 1.1fr 1.15fr 1fr 0.75fr",
    minWidth: "1320px",
    minHeight: "50px",
    alignItems: "center",
    textAlign: "center",
    borderTop: "1px solid #d7d7d7",
    fontSize: "17px",
    color: "#111",
    background: "#fff",
  },
  cell: {
    padding: "12px 10px",
    boxSizing: "border-box",
  },
  optionBtn: {
    border: "none",
    background: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    cursor: "pointer",
  },
  hr: {
    border: 0,
    borderTop: "1px solid #d6d6d6",
    margin: "0 0 20px",
  },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr",
    gap: "90px",
    alignItems: "start",
    marginTop: "22px",
    marginBottom: "32px",
  },
  leftTitle: {
    fontSize: "18px",
    marginBottom: "6px",
  },
  infoRow: {
    fontSize: "17px",
    marginBottom: "8px",
    lineHeight: 1.35,
  },
  formTitle: {
    fontSize: "18px",
    marginBottom: "18px",
    marginTop: "2px",
  },
  formBlock: {
    maxWidth: "420px",
  },
  field: {
    marginBottom: "14px",
  },
  label: {
    display: "block",
    marginBottom: "4px",
    fontSize: "16px",
  },
  required: {
    color: "#cc0000",
  },
  input: {
    width: "100%",
    height: "48px",
    border: "1px solid #cfcfcf",
    borderRadius: "4px",
    background: "#fff",
    padding: "0 12px",
    fontSize: "17px",
    color: "#111",
    outline: "none",
    boxSizing: "border-box",
  },
  wideInput: {
    width: "100%",
    height: "50px",
    border: "1px solid #cfcfcf",
    borderRadius: "4px",
    background: "#fff",
    padding: "0 12px",
    fontSize: "17px",
    color: "#111",
    outline: "none",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    minHeight: "56px",
    border: "1px solid #cfcfcf",
    borderRadius: "4px",
    background: "#fff",
    padding: "10px 12px",
    fontSize: "17px",
    color: "#111",
    outline: "none",
    boxSizing: "border-box",
    resize: "vertical",
  },
  dateWrap: {
    position: "relative",
  },
  dateInput: {
    width: "100%",
    height: "52px",
    border: "1px solid #17b317",
    boxShadow: "0 0 0 1px #17b317 inset, 0 1px 4px rgba(0,0,0,0.18)",
    borderRadius: "4px",
    background: "#a7e4a2",
    padding: "0 50px 0 12px",
    fontSize: "18px",
    color: "#111",
    outline: "none",
    boxSizing: "border-box",
  },
  calBtn: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    color: "#2aa1d3",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  btnRow: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "18px",
  },
  actionBtn: {
    height: "46px",
    border: "none",
    borderRadius: "8px",
    background: "#35a8d6",
    color: "#fff",
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },
  sectionTitle: {
    textAlign: "center",
    fontSize: "18px",
    margin: "28px 0 18px",
  },
  detailHeader: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 1fr 1.45fr 0.95fr 0.7fr",
    minWidth: "1200px",
    minHeight: "48px",
    alignItems: "center",
    textAlign: "center",
    background: "#045f89",
    color: "#fff",
    fontSize: "18px",
    letterSpacing: "2px",
    textTransform: "uppercase",
  },
  detailRow: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 1fr 1.45fr 0.95fr 0.7fr",
    minWidth: "1200px",
    minHeight: "44px",
    alignItems: "center",
    textAlign: "center",
    borderTop: "1px solid #d7d7d7",
    fontSize: "17px",
    color: "#111",
    background: "#fff",
  },
  totalRow: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 1fr 1.45fr 0.95fr 0.7fr",
    minWidth: "1200px",
    minHeight: "42px",
    alignItems: "center",
    textAlign: "center",
    borderTop: "1px solid #d7d7d7",
    fontSize: "17px",
    color: "#111",
    background: "#cfcfcf",
    fontWeight: 700,
  },
  ventaTitle: {
    fontSize: "20px",
    marginBottom: "10px",
  },
  ventaGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.1fr 1.1fr 1.1fr 0.9fr 1.1fr 1.1fr 0.9fr 0.9fr",
    gap: "8px",
    alignItems: "end",
  },
  ventaGrid2: {
    display: "grid",
    gridTemplateColumns: "1.8fr 0.9fr 1.6fr 1.2fr 0.8fr 1fr",
    gap: "10px",
    alignItems: "start",
    marginTop: "18px",
  },
  fieldSmall: {
    minWidth: 0,
  },
  inlineText: {
    fontSize: "16px",
    paddingTop: "28px",
  },
  ventaSectionTitle: {
    textAlign: "center",
    fontSize: "18px",
    margin: "28px 0 14px",
  },
  ventaTable: {
    width: "100%",
    overflowX: "auto",
  },
  ventaHeader: {
    display: "grid",
    gridTemplateColumns: "0.45fr 4.1fr 1fr 1.1fr 1.5fr 1fr 1fr",
    minWidth: "1300px",
    background: "#cfcfcf",
    minHeight: "22px",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: 700,
  },
  ventaRow: {
    display: "grid",
    gridTemplateColumns: "0.45fr 4.1fr 1fr 1.1fr 1.5fr 1fr 1fr",
    minWidth: "1300px",
    minHeight: "54px",
    alignItems: "center",
    fontSize: "16px",
  },
  ventaSummaryRow: {
    display: "grid",
    gridTemplateColumns: "0.45fr 4.1fr 1fr 1.1fr 1.5fr 1fr 1fr",
    minWidth: "1300px",
    minHeight: "22px",
    alignItems: "center",
    fontSize: "16px",
    background: "#cfcfcf",
  },
  printWrap: {
    display: "flex",
    justifyContent: "center",
    marginTop: "28px",
  },
};

function formatMoney(value) {
  return Number(value || 0).toFixed(2);
}

export default function MovBancariosIntegrado() {
  const [vista, setVista] = useState("lista");
  const [moneda, setMoneda] = useState("");
  const [appliedMoneda, setAppliedMoneda] = useState("");
  const [hoverRow, setHoverRow] = useState(null);
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState(cuentas[0]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(ventaDemo);
  const [movimientos, setMovimientos] = useState(movimientosPorCuenta[4]);
  const [formDetalle, setFormDetalle] = useState({
    modo: "Ingreso",
    fecha: "2026-03-13",
    importe: "",
    concepto: "",
  });

  const rows = useMemo(() => {
    if (!appliedMoneda) return cuentas.filter((item) => item.moneda === "Soles");
    return cuentas.filter((item) => item.moneda === appliedMoneda);
  }, [appliedMoneda]);

  const totalIngreso = useMemo(
    () => movimientos.reduce((acc, item) => acc + Number(item.ingreso || 0), 0),
    [movimientos],
  );

  const totalEgreso = useMemo(
    () => movimientos.reduce((acc, item) => acc + Number(item.egreso || 0), 0),
    [movimientos],
  );

  const handleBuscar = () => {
    setAppliedMoneda(moneda);
  };

  const irADetalleBanco = (cuenta) => {
    setCuentaSeleccionada(cuenta);
    setMovimientos(movimientosPorCuenta[cuenta.id] || []);
    setFormDetalle({ modo: "Ingreso", fecha: "2026-03-13", importe: "", concepto: "" });
    setVista("detalleBanco");
  };

  const guardarMovimiento = () => {
    if (!formDetalle.importe || !formDetalle.concepto || !formDetalle.fecha) return;
    const importe = Number(formDetalle.importe || 0);
    const nuevo = {
      id: Date.now(),
      fecha: formDetalle.fecha,
      ingreso: formDetalle.modo === "Ingreso" ? importe : 0,
      egreso: formDetalle.modo === "Egreso" ? importe : 0,
      concepto: formDetalle.concepto,
      responsable: "demo",
    };
    setMovimientos((prev) => [...prev, nuevo]);
    setFormDetalle((prev) => ({ ...prev, importe: "", concepto: "" }));
  };

  const irAVenta = () => {
    setVista("detalleVenta");
  };

  const regresarDesdeVenta = () => {
    setVista("detalleBanco");
  };

  const regresarAlListado = () => {
    setVista("lista");
  };

  if (vista === "detalleVenta") {
    return (
      <div style={styles.page}>
        <div style={styles.wrapper}>
          <div style={styles.ventaTitle}>VENTA : MODIFICAR</div>

          <div style={styles.ventaGrid}>
            <div style={styles.fieldSmall}>
              <label style={styles.label}>Boleta</label>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 18 }}>BI01-</span>
                <input style={styles.input} value={ventaSeleccionada.numero} readOnly />
              </div>
            </div>
            <div style={styles.fieldSmall}>
              <label style={styles.label}>Fecha : (<span style={styles.required}>*</span>)</label>
              <input style={styles.input} value={ventaSeleccionada.fecha} readOnly />
            </div>
            <div style={styles.fieldSmall}>
              <label style={styles.label}>F.Vencim. :</label>
              <input style={styles.input} value={ventaSeleccionada.fechaVencimiento} readOnly />
            </div>
            <div style={styles.fieldSmall}>
              <label style={styles.label}>Nro Orden :</label>
              <input style={styles.input} value={ventaSeleccionada.nroOrden} readOnly />
            </div>
            <div style={styles.fieldSmall}>
              <label style={styles.label}>Moneda : (<span style={styles.required}>*</span>)</label>
              <select style={styles.select} value={ventaSeleccionada.moneda} readOnly>
                <option>{ventaSeleccionada.moneda}</option>
              </select>
            </div>
            <div style={styles.fieldSmall}>
              <label style={styles.label}>(<span style={styles.required}>*</span>)</label>
              <input style={styles.input} value={ventaSeleccionada.conIgvTexto} readOnly />
            </div>
            <div style={styles.fieldSmall}>
              <label style={styles.label}>Tipo Operacion: (<span style={styles.required}>*</span>)</label>
              <select style={styles.select} value={ventaSeleccionada.tipoOperacion} readOnly>
                <option>{ventaSeleccionada.tipoOperacion}</option>
              </select>
            </div>
            <div style={styles.fieldSmall}>
              <label style={styles.label}>Pre Anticipo: (<span style={styles.required}>*</span>)</label>
              <select style={styles.select} value={ventaSeleccionada.preAnticipo} readOnly>
                <option>{ventaSeleccionada.preAnticipo}</option>
              </select>
            </div>
            <div style={styles.fieldSmall}>
              <label style={styles.label}>Nro Guia :</label>
              <input style={styles.input} value={ventaSeleccionada.nroGuia} readOnly />
            </div>
            <div style={styles.fieldSmall}>
              <label style={styles.label}>Cambio :</label>
              <input style={styles.input} value={ventaSeleccionada.cambio} readOnly />
            </div>
          </div>

          <div style={styles.ventaGrid2}>
            <div>
              <label style={styles.label}>Sucursal :</label>
              <input style={styles.wideInput} value={ventaSeleccionada.sucursal} readOnly />
            </div>
            <div>
              <label style={styles.label}>Tipo de venta(<span style={styles.required}>*</span>)</label>
              <select style={styles.select} value={ventaSeleccionada.tipoVenta} readOnly>
                <option>{ventaSeleccionada.tipoVenta}</option>
              </select>
            </div>
            <div style={styles.inlineText}>{ventaSeleccionada.depositoTexto}</div>
            <div>
              <label style={styles.label}>Comentario:</label>
              <textarea style={styles.textarea} value={ventaSeleccionada.comentario} readOnly />
            </div>
            <div>
              <label style={styles.label}>CLIENTE</label>
              <div style={{ fontSize: 17 }}>{ventaSeleccionada.clienteLabel}</div>
            </div>
            <div>
              <label style={styles.label}>VENDEDOR &gt;&gt;</label>
              <select style={styles.select} value={ventaSeleccionada.vendedor} readOnly>
                <option>{ventaSeleccionada.vendedor}</option>
              </select>
            </div>
          </div>

          <div style={styles.bottomWrap}>
            <button type="button" style={styles.actionBtn} onClick={regresarDesdeVenta}>
              <Undo2 size={20} /> Regresar
            </button>
          </div>

          <hr style={{ ...styles.hr, marginTop: 28 }} />
          <div style={styles.ventaSectionTitle}>Detalle de Venta</div>

          <div style={styles.ventaTable}>
            <div style={styles.ventaHeader}>
              <div style={styles.cell}>Nro</div>
              <div style={styles.cell}>Articulos</div>
              <div style={styles.cell}>Cant.</div>
              <div style={styles.cell}>U.M</div>
              <div style={styles.cell}>T.A.IGV</div>
              <div style={styles.cell}>Precio(<span style={styles.required}>*</span>)</div>
              <div style={styles.cell}>Sub total</div>
            </div>

            {ventaSeleccionada.items.map((item) => (
              <div key={item.nro} style={styles.ventaRow}>
                <div style={styles.cell}><b>{item.nro}</b></div>
                <div style={{ ...styles.cell, textAlign: "left" }}>
                  <span style={{ color: "#0b8ef2", marginRight: 8 }}>✎</span>
                  {item.articulo}
                </div>
                <div style={styles.cell}>{item.cantidad}</div>
                <div style={styles.cell}>
                  <select style={styles.select} value={item.unidadMedida} readOnly>
                    <option>{item.unidadMedida}</option>
                  </select>
                </div>
                <div style={styles.cell}>
                  <select style={styles.select} value={item.tipoAfectacion} readOnly>
                    <option>{item.tipoAfectacion}</option>
                  </select>
                </div>
                <div style={styles.cell}>{item.precio}</div>
                <div style={styles.cell}>{item.subtotal}</div>
              </div>
            ))}

            <div style={styles.ventaSummaryRow}>
              <div></div><div></div><div></div><div></div><div></div>
              <div style={{ ...styles.cell, textAlign: "right" }}>GRAVADA</div>
              <div style={{ ...styles.cell, textAlign: "right" }}>{ventaSeleccionada.resumen.gravada}</div>
            </div>
            <div style={styles.ventaSummaryRow}>
              <div></div><div></div><div></div><div></div><div></div>
              <div style={{ ...styles.cell, textAlign: "right" }}>IGV 18%</div>
              <div style={{ ...styles.cell, textAlign: "right" }}>{ventaSeleccionada.resumen.igv}</div>
            </div>
            <div style={{ ...styles.ventaSummaryRow, background: "#eaeaea" }}>
              <div></div><div></div><div></div><div></div><div></div>
              <div style={{ ...styles.cell, textAlign: "right" }}>TOTAL</div>
              <div style={{ ...styles.cell, textAlign: "right" }}>{ventaSeleccionada.resumen.total}</div>
            </div>
          </div>

          <div style={styles.printWrap}>
            <button type="button" style={styles.actionBtn}>
              🖨 Imprimir Boleta
            </button>
          </div>

          <hr style={{ ...styles.hr, marginTop: 28 }} />
        </div>
      </div>
    );
  }

  if (vista === "detalleBanco") {
    return (
      <div style={styles.page}>
        <div style={styles.wrapper}>
          <hr style={styles.hr} />
          <hr style={styles.hr} />

          <div style={styles.detailGrid}>
            <div>
              <div style={styles.leftTitle}>DETALLE DE CUENTA DEL BANCO</div>
              <div style={styles.infoRow}><b>Banco :</b> {cuentaSeleccionada.banco}</div>
              <div style={styles.infoRow}><b>Nro :</b> {cuentaSeleccionada.nro}</div>
              <div style={styles.infoRow}><b>CCI :</b> {cuentaSeleccionada.cci || ""}</div>
              <div style={styles.infoRow}><b>Tipo de Cuenta :</b> {cuentaSeleccionada.tipoCuenta}</div>
              <div style={styles.infoRow}><b>Moneda :</b> {cuentaSeleccionada.moneda}</div>
              <div style={styles.infoRow}><b>Titular :</b> {cuentaSeleccionada.titular}</div>
              <div style={styles.infoRow}><b>Importe Total :</b> {formatMoney(cuentaSeleccionada.importeTotal)}</div>
            </div>

            <div style={styles.formBlock}>
              <div style={styles.formTitle}>INGRESO Y EGRESO : NUEVO</div>

              <div style={styles.field}>
                <label style={styles.label}>Modo Movimiento :(<span style={styles.required}>*</span>)</label>
                <select
                  style={styles.select}
                  value={formDetalle.modo}
                  onChange={(e) => setFormDetalle({ ...formDetalle, modo: e.target.value })}
                >
                  <option value="Ingreso">Ingreso</option>
                  <option value="Egreso">Egreso</option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Fecha :(<span style={styles.required}>*</span>)</label>
                <div style={styles.dateWrap}>
                  <input
                    type="text"
                    value={formDetalle.fecha}
                    onChange={(e) => setFormDetalle({ ...formDetalle, fecha: e.target.value })}
                    style={styles.dateInput}
                  />
                  <button type="button" style={styles.calBtn}>
                    <CalendarDays size={28} strokeWidth={2} />
                  </button>
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Importe :(<span style={styles.required}>*</span>)</label>
                <input
                  type="text"
                  value={formDetalle.importe}
                  onChange={(e) => setFormDetalle({ ...formDetalle, importe: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Concepto :(<span style={styles.required}>*</span>)</label>
                <input
                  type="text"
                  value={formDetalle.concepto}
                  onChange={(e) => setFormDetalle({ ...formDetalle, concepto: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.btnRow}>
                <button type="button" style={styles.actionBtn} onClick={guardarMovimiento}>
                  <Save size={20} /> Guardar
                </button>
                <button type="button" style={styles.actionBtn} onClick={regresarAlListado}>
                  <Undo2 size={20} /> Regresar
                </button>
              </div>
            </div>
          </div>

          <hr style={styles.hr} />

          <div style={styles.sectionTitle}>Detalle de Ingreso y Retiros</div>

          <div style={styles.tableWrap}>
            <div style={styles.detailHeader}>
              <div style={styles.cell}>Fecha</div>
              <div style={styles.cell}>Ingreso</div>
              <div style={styles.cell}>Egreso</div>
              <div style={styles.cell}>Concepto</div>
              <div style={styles.cell}>Resp.</div>
              <div style={styles.cell}>Opcion</div>
            </div>

            {movimientos.map((row, index) => (
              <div key={`${row.id || row.fecha}-${index}`} style={styles.detailRow}>
                <div style={styles.cell}><b>{row.fecha}</b></div>
                <div style={{ ...styles.cell, textAlign: "right" }}>{formatMoney(row.ingreso)}</div>
                <div style={{ ...styles.cell, textAlign: "right" }}>{formatMoney(row.egreso)}</div>
                <div style={styles.cell}><b>{row.concepto}</b></div>
                <div style={styles.cell}>{row.responsable}</div>
                <div style={styles.cell}>
                  <button type="button" style={styles.optionBtn} title="Ver detalle" onClick={irAVenta}>
                    <Search size={20} color="#0b8ef2" />
                  </button>
                </div>
              </div>
            ))}

            <div style={styles.totalRow}>
              <div style={styles.cell}>Total</div>
              <div style={{ ...styles.cell, textAlign: "right" }}>{formatMoney(totalIngreso)}</div>
              <div style={{ ...styles.cell, textAlign: "right" }}>{formatMoney(totalEgreso)}</div>
              <div style={styles.cell}></div>
              <div style={styles.cell}></div>
              <div style={styles.cell}></div>
            </div>
          </div>

          <div style={styles.bottomWrap}>
            <button type="button" style={styles.actionBtn} onClick={regresarAlListado}>
              <Undo2 size={20} /> Regresar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleBuscar();
          }}
        >
          <div style={styles.formCenter}>
            <div style={styles.filterRow}>
              <div style={styles.labelWrap}>
                <span style={styles.helpCircle}>?</span>
                <b>Seleccione Moneda a listar</b>
              </div>

              <select value={moneda} onChange={(e) => setMoneda(e.target.value)} style={styles.select}>
                <option value=""></option>
                <option value="Soles">Soles</option>
                <option value="Dolares">Dolares</option>
              </select>

              <button type="submit" style={styles.searchBtn}>
                <Search size={22} /> Buscar
              </button>
            </div>
          </div>
        </form>

        <div style={styles.titleWrap}>
          <span style={styles.title}>LISTADO GENERAL DE CUENTA DEL BANCO</span>
        </div>

        <div style={styles.tableWrap}>
          <div style={styles.listHeader}>
            <div style={styles.cell}>Banco</div>
            <div style={styles.cell}>Nro</div>
            <div style={styles.cell}>Tipo</div>
            <div style={styles.cell}>Moneda</div>
            <div style={styles.cell}>Importe</div>
            <div style={styles.cell}>Opcion</div>
          </div>

          {rows.map((row, index) => (
            <div
              key={row.id}
              style={{
                ...styles.listRow,
                background: hoverRow === index ? "#eef7ff" : "#fff",
              }}
              onMouseEnter={() => setHoverRow(index)}
              onMouseLeave={() => setHoverRow(null)}
            >
              <div style={styles.cell}><b>{row.banco}</b></div>
              <div style={styles.cell}>{row.nro}</div>
              <div style={styles.cell}>{row.tipoCuenta}</div>
              <div style={styles.cell}>{row.moneda}</div>
              <div style={styles.cell}><b>{formatMoney(row.importeTotal)}</b></div>
              <div style={styles.cell}>
                <button type="button" style={styles.optionBtn} title="Ver + detalle y Modificar" onClick={() => irADetalleBanco(row)}>
                  <SquarePen size={21} color={index === 0 ? "#6a16b8" : "#0b8ef2"} strokeWidth={2} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
  