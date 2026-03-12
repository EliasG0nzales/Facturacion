import React, { useState } from "react";

const ReporteGrafico = () => {
  const [seleccionado, setSeleccionado] = useState(null);
  const [filtros, setFiltros] = useState({ anio: "2013", sucursal: [] });
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  const years = Array.from({ length: 2026 - 2012 + 1 }, (_, i) => 2012 + i);
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  // Función para manejar la selección del menú principal
  const seleccionarOpcion = (opcion) => {
    if (opcion === "Mensual") {
      // Redirección directa para el modo Mensual
      window.location.href = "https://gkmtechnology.com/eagle/inteligente/venta_reporte_grafico.php?grafico=Mensual";
    } else {
      setSeleccionado(opcion);
    }
  };

  const handleConsulta = (e) => {
    e.preventDefault();
    setMostrarTabla(true);
  };

  const reset = () => {
    setSeleccionado(null);
    setMostrarTabla(false);
    setShowCheck(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", color: "#000" }}>
      
      {/* TÍTULO - NO TOCAR */}
      <div style={{ fontSize: "18px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
        <i className="icon-help" style={{ color: "#1e90ff", cursor: "pointer" }}></i>
        <span style={{ fontWeight: "bold" }}>Reporte grafico</span>
        {seleccionado && (
          <span onClick={reset} style={{ cursor: "pointer", fontSize: "20px", marginLeft: "10px" }}>&#8617;</span>
        )}
      </div>

      {seleccionado === null ? (
        /* MENU PRINCIPAL */
        <div style={{ display: "flex", gap: "25px", justifyContent: "center", marginTop: "40px" }}>
          <div style={cardMenu} onClick={() => seleccionarOpcion("Anual")}>📅<br/>Anual</div>
          <div style={cardMenu} onClick={() => seleccionarOpcion("Mensual")}>🕒<br/>Mensual</div>
          <div style={cardMenu}>📍<br/>Por departamentos</div>
        </div>
      ) : (
        /* --- BLOQUE ANUAL (INTACTO) --- */
        <form onSubmit={handleConsulta}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
            <b style={{ color: "#000", fontSize: "13px" }}>ANUALES</b>
            
            <select 
              value={filtros.anio}
              style={selectBlanco}
              onChange={(e) => setFiltros({...filtros, anio: e.target.value})}
            >
              <option value="">Seleccione</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            <div style={{ position: "relative" }}>
              <div onClick={() => setShowCheck(!showCheck)} style={selectBlanco}>
                <span style={{ fontWeight: "bold", marginRight: "10px" }}>Seleccionar Sucursal</span>
                <i className="icon-angle-down"></i>
              </div>
              {showCheck && (
                <div style={dropdownCheck}>
                  <label style={labelCheck}><input type="checkbox" /> Tienda 1b 133</label>
                  <label style={labelCheck}><input type="checkbox" /> Tienda 1A 119</label>
                  <label style={labelCheck}><input type="checkbox" /> Almacen 2B 167</label>
                </div>
              )}
            </div>

            <label style={labelNegro}><input type="checkbox" defaultChecked /> Compra</label>
            <label style={labelNegro}><input type="checkbox" defaultChecked /> Gastos</label>
            
            <button type="submit" style={botonCeleste}>
              <i className="icon-search"></i> &nbsp;Consulta
            </button>
          </div>

          <hr style={{ border: "0.5px solid #eee", marginBottom: "20px" }} />

          {mostrarTabla && (
            <center>
              <table style={tablaEstilo}>
                <thead>
                  <tr style={{ background: "#f8f8f8" }}>
                    {meses.map(m => <th key={m} style={celdaBorde}><b>{m}</b></th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {meses.map((m, i) => <td key={i} style={celdaBorde}>0.00</td>)}
                  </tr>
                </tbody>
              </table>

              <div style={{ margin: "25px 0" }}>
                <b style={{ fontSize: "16px" }}>Total General : 0</b>
              </div>

              <div onClick={() => window.print()} style={botonImprimir}>
                <i className="icon-print"></i>&nbsp; Imprimir
              </div>

              <div style={{ marginTop: "30px" }}>
                <span onClick={reset} style={{ cursor: "pointer", fontWeight: "bold", color: "#000" }}>
                  &#8617; Regresar
                </span>
              </div>
            </center>
          )}
        </form>
      )}
    </div>
  );
};

// --- ESTILOS MANTENIDOS ---
const selectBlanco = {
  background: "#fff",
  border: "1px solid #ccc",
  padding: "5px 10px",
  borderRadius: "4px",
  cursor: "pointer",
  color: "#000",
  fontSize: "13px"
};

const labelNegro = {
  fontSize: "13px",
  fontWeight: "bold",
  color: "#000",
  display: "flex",
  alignItems: "center",
  gap: "5px"
};

const botonCeleste = {
  background: "#1e90ff",
  color: "#fff",
  border: "none",
  padding: "6px 18px",
  borderRadius: "4px",
  fontWeight: "bold",
  cursor: "pointer",
  display: "flex",
  alignItems: "center"
};

const botonImprimir = {
  display: "inline-flex",
  alignItems: "center",
  background: "#f2f2f2",
  border: "1px solid #ccc",
  padding: "8px 20px",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px",
  color: "#000"
};

const tablaEstilo = { width: "100%", borderCollapse: "collapse" };
const celdaBorde = { border: "1px solid #ccc", padding: "10px", textAlign: "center", fontSize: "12px" };

const cardMenu = {
  background: "#fff", width: "160px", height: "160px", borderRadius: "10px",
  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", cursor: "pointer", fontWeight: "bold", border: "1px solid #eee"
};

const dropdownCheck = {
  position: "absolute", background: "#fff", border: "1px solid #ccc",
  zIndex: 10, width: "220px", top: "100%", left: 0
};

const labelCheck = { display: "block", padding: "8px", fontSize: "12px", borderBottom: "1px solid #eee", textAlign: "left" };

export default ReporteGrafico;