import { useRef, useState } from "react";

const dateStyles = `
.date-wrap{
  position:relative;
  display:inline-block;
}
.date-wrap input[type="date"]{
  padding-right:34px;
}
.date-btn{
  position:absolute;
  right:6px;
  top:50%;
  transform:translateY(-50%);
  width:24px;
  height:24px;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:0;
  border:0;
  background:transparent;
  cursor:pointer;
}
.date-btn svg{
  display:block;
}
input[type="date"]::-webkit-calendar-picker-indicator{
  opacity:0;
}
`;

const IconCalendar = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="4.5" width="18" height="17" rx="2" fill="#ffffff" stroke="#6c757d" strokeWidth="1.2" />
    <rect x="3" y="4.5" width="18" height="5" rx="2" fill="#1aa38a" />
    <rect x="6" y="2.5" width="2.2" height="4.2" rx="1" fill="#6c757d" />
    <rect x="15.8" y="2.5" width="2.2" height="4.2" rx="1" fill="#6c757d" />
    <rect x="6" y="11" width="3" height="3" fill="#d9534f" />
    <rect x="10.5" y="11" width="3" height="3" fill="#dee2e6" />
    <rect x="15" y="11" width="3" height="3" fill="#dee2e6" />
    <rect x="6" y="15.2" width="3" height="3" fill="#dee2e6" />
    <rect x="10.5" y="15.2" width="3" height="3" fill="#dee2e6" />
    <rect x="15" y="15.2" width="3" height="3" fill="#dee2e6" />
  </svg>
);

export default function Compra() {
  const fechaInicioRef = useRef(null);
  const fechaFinRef = useRef(null);
  const fechaEmiRef = useRef(null);
  const fechaVenRef = useRef(null);
  const initialForm = {
    documento: "Factura",
    serie: "",
    numero: "",
    fechaEmi: "",
    fechaVen: "",
    moneda: "Soles",
    cambio: "3.830",
    igv: "Incluido IGV",
    orden: "",
    dua: "",
    proveedor: "Compudiskett S R L",
    condicion: "Contado",
    medioPago: "Efectivo",
    sujetoPorcentaje: "",
    sujetoTipo: "",
    usuario: "Juan Quiroz Q.",
    estado: "Registrado"
  };
  const [formData, setFormData] = useState(initialForm);
  const [compras, setCompras] = useState([]);
  const [showFormNuevo, setShowFormNuevo] = useState(false);

  const openPicker = (ref) => {
    const el = ref?.current;
    if (!el) return;
    if (typeof el.showPicker === "function") el.showPicker();
    el.focus();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const normalizedValue = name === "moneda" && value === "Suelas" ? "Soles" : value;
    setFormData((prev) => ({ ...prev, [name]: normalizedValue }));
  };

  const handleGuardar = () => {
    const numeroCompleto = formData.serie && formData.numero
      ? `${formData.serie}-${formData.numero}`
      : `${formData.serie}${formData.numero}`;
    const compra = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      documento: formData.documento,
      numero: numeroCompleto,
      fecha: formData.fechaEmi || formData.fechaVen,
      proveedor: formData.proveedor,
      usuario: formData.usuario,
      tipo: formData.moneda,
      estado: formData.estado
    };
    setCompras((prev) => [compra, ...prev]);
    setFormData(initialForm);
    setShowFormNuevo(false);
  };

  const handleLimpiar = () => {
    setFormData(initialForm);
  };

  const compraStyles = `
  .compra-nuevo{
    font-family:Arial, sans-serif;
    color:#212529;
  }
  .compra-nuevo-title{
    font-size:18px;
    font-weight:bold;
    margin-bottom:14px;
  }
  .compra-form{
    display:flex;
    flex-direction:column;
    gap:16px;
  }
  .compra-row{
    display:flex;
    flex-wrap:wrap;
    gap:14px 18px;
    align-items:flex-end;
  }
  .compra-field{
    display:flex;
    flex-direction:column;
    gap:4px;
    min-width:120px;
  }
  .compra-label{
    font-size:12px;
    font-weight:bold;
    color:#212529;
  }
  .compra-input,
  .compra-select{
    padding:6px 8px;
    border:1px solid #ced4da;
    border-radius:4px;
    font-size:13px;
    background:#fff;
    color:#212529;
    height:34px;
  }
  .compra-input[type="date"]{
    padding-right:34px;
  }
  .compra-input.small{
    width:110px;
  }
  .compra-input.xsmall{
    width:90px;
  }
  .compra-input.mid{
    width:140px;
  }
  .compra-input.long{
    width:260px;
  }
  .compra-group{
    display:flex;
    gap:8px;
    align-items:center;
  }
  .compra-divider{
    border-top:1px solid #e1e6ef;
    margin:8px 0 2px;
  }
  .compra-section-title{
    font-size:13px;
    font-weight:bold;
  }
  .compra-radio-group{
    display:flex;
    align-items:center;
    gap:10px;
    flex-wrap:wrap;
    font-size:12px;
  }
  .compra-radio-group input{
    margin-right:4px;
  }
  .compra-search{
    display:flex;
    align-items:center;
    gap:8px;
    flex-wrap:wrap;
  }
  .compra-search input{
    width:260px;
  }
  .compra-btn{
    background:#3a99c6;
    color:#fff;
    border:none;
    padding:6px 12px;
    border-radius:6px;
    cursor:pointer;
    font-size:13px;
    display:inline-flex;
    align-items:center;
    gap:6px;
    height:34px;
  }
  .compra-btn.secondary{
    background:#4aa3c5;
  }
  .compra-table{
    width:100%;
    border-collapse:collapse;
    font-size:13px;
  }
  .compra-table thead th{
    background:#0f5f87;
    color:#fff;
    padding:10px 8px;
  }
  .compra-table tbody td{
    border:1px solid #ddd;
    padding:10px 8px;
    text-align:center;
    background:#f2f2f2;
  }
  .compra-actions{
    display:flex;
    gap:10px;
    justify-content:center;
    margin-top:12px;
  }
  `;

  const styles = {
    content: {
      backgroundColor: "#ffffff",
      padding: "25px 30px 40px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
      fontFamily: "Arial, sans-serif"
    },

    compraToggle: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "20px",
      color: "#0f5f87",
      fontWeight: "bold"
    },

    toggleCircle: {
      width: "18px",
      height: "18px",
      borderRadius: "50%",
      backgroundColor: "#0f5f87"
    },

    filtros: {
      display: "flex",
      flexDirection: "column",
      gap: "15px"
    },

    fila: {
      display: "flex",
      gap: "10px",
      alignItems: "center",
      flexWrap: "wrap"
    },

    input: {
      padding: "6px",
      border: "1px solid #ccc",
      borderRadius: "4px"
    },

    select: {
      padding: "6px"
    },

    botonBuscar: {
      backgroundColor: "#4aa3c5",
      color: "white",
      border: "none",
      padding: "8px 14px",
      borderRadius: "6px",
      cursor: "pointer"
    },

    botonNuevo: {
      backgroundColor: "#4aa3c5",
      color: "white",
      border: "none",
      padding: "8px 14px",
      borderRadius: "6px",
      cursor: "pointer"
    },

    tablaContainer: {
      marginTop: "30px"
    },

    tablaTitulo: {
      backgroundColor: "#0f5f87",
      color: "#ffffff",
      padding: "8px 10px",
      fontSize: "14px",
      fontWeight: "bold",
      marginBottom: "0"
    },

    tabla: {
      width: "100%",
      borderCollapse: "collapse"
    },

    th: {
      background: "#0f5f87",
      color: "white",
      padding: "10px",
      fontSize: "13px"
    },

    td: {
      border: "1px solid #ddd",
      padding: "10px",
      textAlign: "center",
      fontSize: "13px"
    }
  };

  return (
    <>
      <style>{dateStyles + compraStyles}</style>
      <main style={styles.content}>
        {showFormNuevo ? (
          <div className="compra-nuevo">
            <div className="compra-nuevo-title">COMPRA : NUEVO</div>
            <div className="compra-form">
              <div className="compra-row">
                <div className="compra-field">
                  <span className="compra-label">Documento(*)</span>
                  <select className="compra-select" name="documento" value={formData.documento} onChange={handleChange}>
                    <option>Factura</option>
                    <option>Boleta</option>
                    <option>Guía</option>
                    <option>Nota</option>
                  </select>
                </div>
                <div className="compra-field">
                  <span className="compra-label">Serie + Nro (*)</span>
                  <div className="compra-group">
                    <input className="compra-input xsmall" type="text" name="serie" value={formData.serie} onChange={handleChange} />
                    <input className="compra-input mid" type="text" name="numero" value={formData.numero} onChange={handleChange} />
                  </div>
                </div>
                <div className="compra-field">
                  <span className="compra-label">Fecha Emi. (*)</span>
                  <div className="date-wrap">
                    <input ref={fechaEmiRef} type="date" className="compra-input" name="fechaEmi" value={formData.fechaEmi} onChange={handleChange} />
                    <button
                      type="button"
                      className="date-btn"
                      aria-label="Seleccionar Fecha Emision"
                      onClick={() => openPicker(fechaEmiRef)}
                    >
                      <IconCalendar />
                    </button>
                  </div>
                </div>
                <div className="compra-field">
                  <span className="compra-label">Fecha Ven. (*)</span>
                  <div className="date-wrap">
                    <input ref={fechaVenRef} type="date" className="compra-input" name="fechaVen" value={formData.fechaVen} onChange={handleChange} />
                    <button
                      type="button"
                      className="date-btn"
                      aria-label="Seleccionar Fecha Vencimiento"
                      onClick={() => openPicker(fechaVenRef)}
                    >
                      <IconCalendar />
                    </button>
                  </div>
                </div>
                <div className="compra-field">
                  <span className="compra-label">Moneda (*)</span>
                  <select className="compra-select" name="moneda" value={formData.moneda} onChange={handleChange}>
                    <option value="Soles">Soles</option>
                    <option value="Dólares">Dólares</option>
                  </select>
                </div>
                {formData.moneda === "Dólares" ? (
                  <div className="compra-field">
                    <span className="compra-label">Cambio</span>
                    <input className="compra-input small" type="text" name="cambio" value={formData.cambio} onChange={handleChange} />
                  </div>
                ) : null}
                <div className="compra-field">
                  <span className="compra-label">Incluido IGV</span>
                  <select className="compra-select" name="igv" value={formData.igv} onChange={handleChange}>
                    <option>Incluido IGV</option>
                    <option>Sin IGV</option>
                  </select>
                </div>
                <div className="compra-field">
                  <span className="compra-label">Orden</span>
                  <input className="compra-input small" type="text" name="orden" value={formData.orden} onChange={handleChange} />
                </div>
                <div className="compra-field">
                  <span className="compra-label">Dua</span>
                  <input className="compra-input small" type="text" name="dua" value={formData.dua} onChange={handleChange} />
                </div>
              </div>

              <div className="compra-divider"></div>

              <div className="compra-row">
                <div className="compra-field" style={{ minWidth: "320px" }}>
                  <span className="compra-label">Proveedor (*)..+</span>
                  <select className="compra-select" name="proveedor" value={formData.proveedor} onChange={handleChange}>
                    <option>Compudiskett S R L</option>
                    <option>Exportadora Importadora Igarashi Ascencio S.r.ltda</option>
                    <option>Grupo Deltron S.A.</option>
                    <option>Maxima Internacional S.A.</option>
                    <option>Soy Proveedor SA</option>
                  </select>
                </div>
                <div className="compra-field">
                  <span className="compra-label">Condicion de Compra</span>
                  <div className="compra-group">
                    <select className="compra-select" name="condicion" value={formData.condicion} onChange={handleChange}>
                      <option>Contado</option>
                      <option>Crédito</option>
                    </select>
                    <select className="compra-select" name="medioPago" value={formData.medioPago} onChange={handleChange}>
                      <option>Efectivo</option>
                      <option>Transferencia</option>
                      <option>Tarjeta</option>
                    </select>
                  </div>
                </div>
                <div className="compra-field" style={{ minWidth: "220px" }}>
                  <span className="compra-label">Adjuntar (pdf/doc/jpg/png/gif)</span>
                  <input className="compra-input long" type="file" />
                </div>
                <div className="compra-field">
                  <span className="compra-label">Sujeto a</span>
                  <div className="compra-group">
                    <input className="compra-input xsmall" type="text" name="sujetoPorcentaje" value={formData.sujetoPorcentaje} onChange={handleChange} />
                    <span>%</span>
                    <select className="compra-select" name="sujetoTipo" value={formData.sujetoTipo} onChange={handleChange}>
                      <option></option>
                      <option>Detracción</option>
                      <option>Percepción</option>
                      <option>Retención</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="compra-divider"></div>

              <div className="compra-row" style={{ alignItems: "center" }}>
                <div className="compra-section-title">BUSQUEDA DE ARTICULOS x</div>
                <div className="compra-radio-group">
                  <label><input type="radio" name="busqueda" defaultChecked />Nombre</label>
                  <label><input type="radio" name="busqueda" />Marca</label>
                  <label><input type="radio" name="busqueda" />Categoria</label>
                  <label><input type="radio" name="busqueda" />Codigo</label>
                  <label><input type="radio" name="busqueda" />C.Barra</label>
                </div>
                <div className="compra-search">
                  <input className="compra-input long" type="text" />
                  <button type="button" className="compra-btn">Buscar</button>
                  <span style={{ fontSize: "20px", color: "#2a7bb0" }}>↻</span>
                </div>
              </div>

              <table className="compra-table">
                <thead>
                  <tr>
                    <th>CODIGO</th>
                    <th>ARTICULOS</th>
                    <th>STOCK</th>
                    <th>MEDIDA</th>
                    <th>P.COMPRA</th>
                    <th>CANT.</th>
                    <th>T.A.IGV</th>
                    <th>AGRE.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td></td>
                    <td>
                      <input className="compra-input long" type="text" />
                    </td>
                    <td>1.00</td>
                    <td>
                      <select className="compra-select">
                        <option>Und.</option>
                        <option>Caja</option>
                      </select>
                    </td>
                    <td>
                      <input className="compra-input small" type="text" defaultValue="0.00" />
                    </td>
                    <td>
                      <input className="compra-input small" type="text" />
                    </td>
                    <td>
                      <select className="compra-select">
                        <option>Gravado - Oper.</option>
                        <option>Exonerado</option>
                      </select>
                    </td>
                    <td>
                      <input type="checkbox" defaultChecked />
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="compra-actions">
                <button type="button" className="compra-btn" onClick={handleGuardar}>Guardar</button>
                <button type="button" className="compra-btn secondary" onClick={handleLimpiar}>Limpiar</button>
                <button type="button" className="compra-btn secondary" onClick={() => setShowFormNuevo(false)}>Regresar</button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div style={styles.compraToggle}>
              <div style={styles.toggleCircle} />
              <span>COMPRA</span>
            </div>

            <form style={styles.filtros}>
              <div style={styles.fila}>
                <label>
                  <b>BUSCAR X</b>
                </label>

                <select
                  style={styles.select}
                  defaultValue="Tienda1 > Tienda 1b 133"
                >
                  <option value="Sucursal > todos">Sucursal &gt; todos</option>
                  <option value="Almacen 1 > Almacen 2B 167">
                    Almacen 1 &gt; Almacen 2B 167
                  </option>
                  <option value="Tienda2 > Tienda 1A 119">
                    Tienda2 &gt; Tienda 1A 119
                  </option>
                  <option value="Tienda1 > Tienda 1b 133">
                    Tienda1 &gt; Tienda 1b 133
                  </option>
                </select>

                <span>y/o</span>

                <select style={styles.select} defaultValue="RUC/dni">
                  <option value="Nro documento">Nro documento</option>
                  <option value="Nombre/empresa">Nombre/empresa</option>
                  <option value="RUC/dni">RUC/dni</option>
                  <option value="Usuario">Usuario</option>
                  <option value="Tipo">Tipo</option>
                </select>

                <input
                  type="text"
                  placeholder="Buscar..."
                  style={styles.input}
                />
              </div>

              <div style={styles.fila}>
                <div>
                  <label>Fecha Inicio</label>
                  <br />
                  <div className="date-wrap">
                    <input
                      ref={fechaInicioRef}
                      type="date"
                      style={styles.input}
                    />
                    <button
                      type="button"
                      className="date-btn"
                      aria-label="Seleccionar Fecha Inicio"
                      onClick={() => openPicker(fechaInicioRef)}
                    >
                      <IconCalendar />
                    </button>
                  </div>
                </div>

                <div>
                  <label>Fecha Fin</label>
                  <br />
                  <div className="date-wrap">
                    <input ref={fechaFinRef} type="date" style={styles.input} />
                    <button
                      type="button"
                      className="date-btn"
                      aria-label="Seleccionar Fecha Fin"
                      onClick={() => openPicker(fechaFinRef)}
                    >
                      <IconCalendar />
                    </button>
                  </div>
                </div>

                <button style={styles.botonBuscar}>🔍 Buscar</button>

                <button type="button" style={styles.botonNuevo} onClick={() => setShowFormNuevo(true)}>
                  ➕ Agregar Nuevo
                </button>
              </div>
            </form>

            <div style={styles.tablaContainer}>
              <div style={styles.tablaTitulo}>LISTADO GENERAL</div>

              <table style={styles.tabla}>
                <thead>
                  <tr>
                    <th style={styles.th}>DOCUM.</th>
                    <th style={styles.th}>NRO DOC</th>
                    <th style={styles.th}>FECHA</th>
                    <th style={styles.th}>PROVEEDOR</th>
                    <th style={styles.th}>USUARIO</th>
                    <th style={styles.th}>TIPO</th>
                    <th style={styles.th}>ESTADO</th>
                  </tr>
                </thead>

                <tbody>
                  {compras.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={styles.td}>
                        No hay registros
                      </td>
                    </tr>
                  ) : (
                    compras.map((compra) => (
                      <tr key={compra.id}>
                        <td style={styles.td}>{compra.documento}</td>
                        <td style={styles.td}>{compra.numero}</td>
                        <td style={styles.td}>{compra.fecha}</td>
                        <td style={styles.td}>{compra.proveedor}</td>
                        <td style={styles.td}>{compra.usuario}</td>
                        <td style={styles.td}>{compra.tipo}</td>
                        <td style={styles.td}>{compra.estado}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </>
  );
}
