// src/pages/Reportes/Asistencia.jsx
import React, { useState, useRef, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════
// ESTILOS
// ═══════════════════════════════════════════════════════════
const styles = {
  wrapper: {
    margin: '-20px',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    minHeight: '100%',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxShadow: 'none',
    border: 'none',
    borderRadius: '0',
  },
  titulo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
  },
  tituloH2: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  iconoAyuda: {
    fontSize: '18px',
    cursor: 'pointer',
    color: '#17a2b8',
  },
  // ─── FILTROS ───────────────────────────────────────────
  filtrosContainer: {
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    padding: '15px',
    marginBottom: '20px',
  },
  filtrosRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '15px',
    flexWrap: 'wrap',
  },
  filtroGrupo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  filtroGrupoWide: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    flex: '1',
    minWidth: '200px',
  },
  label: {
    fontSize: '13px',
    color: '#333',
    fontWeight: '600',
  },
  radioGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#333',
    marginBottom: '5px',
  },
  radioInput: {
    width: '15px',
    height: '15px',
    cursor: 'pointer',
  },
  inputText: {
    padding: '6px 10px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    fontSize: '14px',
    backgroundColor: '#fff',
    color: '#333',
    outline: 'none',
    width: '100%',
  },
  inputDate: {
    padding: '6px 10px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    fontSize: '14px',
    backgroundColor: '#fff',
    color: '#333',
    outline: 'none',
    width: '140px',
  },
  yoLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#333',
    alignSelf: 'flex-end',
    paddingBottom: '8px',
  },
  btnBuscar: {
    backgroundColor: '#17a2b8',
    color: '#fff',
    border: 'none',
    padding: '8px 18px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    height: '34px',
  },
  btnNuevo: {
    backgroundColor: '#17a2b8',
    color: '#fff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    height: '34px',
  },
  // ─── TABLA ─────────────────────────────────────────────
  tablaTitulo: {
    textAlign: 'center',
    margin: '15px 0 10px 0',
  },
  tablaTituloH3: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  tablaContainer: {
    overflowX: 'auto',
    marginBottom: '15px',
  },
  tabla: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
    minWidth: '800px',
  },
  th: {
    background: 'linear-gradient(to bottom, #3a8a9e, #2c7a8e)',
    color: '#fff',
    padding: '10px 8px',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: '12px',
    letterSpacing: '0.3px',
    whiteSpace: 'nowrap',
    border: '1px solid #2c7a8e',
  },
  td: {
    padding: '8px',
    textAlign: 'center',
    borderBottom: '1px solid #e0e0e0',
    color: '#333',
    whiteSpace: 'nowrap',
  },
  tdLeft: {
    padding: '8px',
    textAlign: 'left',
    borderBottom: '1px solid #e0e0e0',
    color: '#333',
    whiteSpace: 'nowrap',
  },
  sinDatos: {
    textAlign: 'center',
    padding: '40px 8px',
    color: '#888',
    fontStyle: 'italic',
    fontSize: '14px',
  },
  loading: {
    textAlign: 'center',
    padding: '30px 8px',
    color: '#17a2b8',
    fontSize: '14px',
  },
  btnConfirmar: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    color: '#17a2b8',
    padding: '2px 6px',
    borderRadius: '3px',
    title: 'Confirmar mi salida',
  },
  // ─── MODAL NUEVO REGISTRO ──────────────────────────────
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '6px',
    padding: '25px',
    width: '450px',
    maxWidth: '90%',
    boxShadow: '0 5px 20px rgba(0,0,0,0.3)',
  },
  modalTitulo: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px',
    borderBottom: '2px solid #17a2b8',
    paddingBottom: '8px',
  },
  modalRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    marginBottom: '12px',
  },
  modalBotones: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '15px',
  },
  btnGuardar: {
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnCancelar: {
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  // ─── CONTADOR ──────────────────────────────────────────
  contador: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#666',
    marginTop: '5px',
  },
};

// ═══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL - ASISTENCIA
// ═══════════════════════════════════════════════════════════
const Asistencia = () => {
  const [tipoBusqueda, setTipoBusqueda] = useState('1');
  const [busqueda, setBusqueda] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [asistencias, setAsistencias] = useState([]);
  const [asistenciasFiltradas, setAsistenciasFiltradas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buscado, setBuscado] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ─── Datos de ejemplo extraídos del HTML ───────────────
  const datosEjemplo = [
    { id: 130, usuario: 'fac-tura.com', ip: '190.239.69.145', fecha: '26/02/2026', horaI: '15:15', refSal: '', refEnt: '', horaS: '' },
    { id: 133, usuario: 'Yupanqui, Barboza, Raysa', ip: '179.6.169.39', fecha: '28/02/2026', horaI: '01:34', refSal: '', refEnt: '', horaS: '' },
    { id: 135, usuario: 'Yupanqui, Barboza, Raysa', ip: '38.43.130.189', fecha: '03/03/2026', horaI: '16:34', refSal: '', refEnt: '', horaS: '' },
    { id: 137, usuario: 'Yupanqui, Barboza, Raysa', ip: '38.43.130.189', fecha: '04/03/2026', horaI: '17:36', refSal: '', refEnt: '', horaS: '' },
    { id: 140, usuario: 'Yupanqui, Barboza, Raysa', ip: '38.43.130.189', fecha: '06/03/2026', horaI: '13:49', refSal: '', refEnt: '', horaS: '' },
    { id: 141, usuario: 'Yupanqui, Barboza, Raysa', ip: '38.43.130.189', fecha: '07/03/2026', horaI: '11:11', refSal: '', refEnt: '', horaS: '' },
    { id: 143, usuario: 'fac-tura.com', ip: '38.25.60.95', fecha: '07/03/2026', horaI: '15:01', refSal: '', refEnt: '', horaS: '' },
    { id: 129, usuario: 'fac-tura.com', ip: '38.253.145.161', fecha: '26/12/2024', horaI: '11:57', refSal: '', refEnt: '', horaS: '' },
    { id: 128, usuario: 'fac-tura.com', ip: '170.246.58.51', fecha: '06/08/2024', horaI: '11:34', refSal: '', refEnt: '', horaS: '' },
    { id: 127, usuario: 'fac-tura.com', ip: '170.246.58.51', fecha: '04/08/2024', horaI: '11:50', refSal: '', refEnt: '', horaS: '' },
    { id: 126, usuario: 'fac-tura.com', ip: '170.246.58.51', fecha: '30/07/2024', horaI: '13:55', refSal: '', refEnt: '', horaS: '' },
    { id: 125, usuario: 'fac-tura.com', ip: '170.246.58.51', fecha: '26/07/2024', horaI: '19:02', refSal: '', refEnt: '', horaS: '' },
    { id: 38, usuario: 'Merino, Cahuna, Wilver Enmanuel', ip: '38.43.130.119', fecha: '06/02/2024', horaI: '19:20', refSal: '', refEnt: '', horaS: '' },
    { id: 25, usuario: 'Merino, Cahuna, Wilver Enmanuel', ip: '38.43.130.187', fecha: '26/01/2024', horaI: '18:15', refSal: '', refEnt: '', horaS: '' },
    { id: 16, usuario: 'Romero, Merino, Alexander Renson', ip: '200.121.132.145', fecha: '27/12/2023', horaI: '18:05', refSal: '', refEnt: '', horaS: '' },
    { id: 28, usuario: 'Romero, Merino, Alexander Renson', ip: '38.43.130.187', fecha: '29/01/2024', horaI: '18:02', refSal: '', refEnt: '', horaS: '' },
    { id: 30, usuario: 'Romero, Merino, Alexander Renson', ip: '170.246.58.51', fecha: '30/01/2024', horaI: '19:01', refSal: '', refEnt: '', horaS: '' },
    { id: 1, usuario: 'fac-tura.com', ip: '::1', fecha: '16/09/2019', horaI: '20:27', refSal: '', refEnt: '', horaS: '' },
    { id: 2, usuario: 'fac-tura.com', ip: '::1', fecha: '20/01/2021', horaI: '12:56', refSal: '', refEnt: '', horaS: '' },
    { id: 8, usuario: 'fac-tura.com', ip: '::1', fecha: '14/06/2021', horaI: '11:33', refSal: '', refEnt: '', horaS: '' },
    { id: 12, usuario: 'fac-tura.com', ip: '190.233.58.89', fecha: '15/12/2023', horaI: '22:25', refSal: '', refEnt: '', horaS: '' },
  ];

  // Cargar datos iniciales
  useEffect(function () {
    setAsistencias(datosEjemplo);
    setAsistenciasFiltradas(datosEjemplo);
  }, []);

  // ─── Parsear fecha dd/mm/yyyy a Date ───────────────────
  var parseFecha = function (fechaStr) {
    var partes = fechaStr.split('/');
    return new Date(parseInt(partes[2]), parseInt(partes[1]) - 1, parseInt(partes[0]));
  };

  // ─── Buscar ────────────────────────────────────────────
  var handleBuscar = function () {
    setLoading(true);
    setBuscado(true);

    setTimeout(function () {
      var resultados = asistencias.filter(function (a) {
        var coincideBusqueda = true;
        var coincideFechaInicio = true;
        var coincideFechaFin = true;

        // Filtro por texto
        if (busqueda.trim() !== '') {
          var texto = busqueda.toLowerCase();
          if (tipoBusqueda === '1') {
            coincideBusqueda = a.usuario.toLowerCase().indexOf(texto) !== -1;
          } else {
            coincideBusqueda = a.ip.toLowerCase().indexOf(texto) !== -1;
          }
        }

        // Filtro por fecha inicio
        if (fechaInicio) {
          var fechaReg = parseFecha(a.fecha);
          var fechaIni = new Date(fechaInicio);
          coincideFechaInicio = fechaReg >= fechaIni;
        }

        // Filtro por fecha fin
        if (fechaFin) {
          var fechaReg2 = parseFecha(a.fecha);
          var fechaFinDate = new Date(fechaFin);
          coincideFechaFin = fechaReg2 <= fechaFinDate;
        }

        return coincideBusqueda && coincideFechaInicio && coincideFechaFin;
      });

      setAsistenciasFiltradas(resultados);
      setLoading(false);
    }, 400);
  };

  // ─── Confirmar salida ──────────────────────────────────
  var handleConfirmarSalida = function (id) {
    var ahora = new Date();
    var hora = ahora.getHours().toString().padStart(2, '0') + ':' + ahora.getMinutes().toString().padStart(2, '0');

    setAsistencias(function (prev) {
      return prev.map(function (a) {
        if (a.id === id) {
          return { ...a, horaS: hora };
        }
        return a;
      });
    });

    setAsistenciasFiltradas(function (prev) {
      return prev.map(function (a) {
        if (a.id === id) {
          return { ...a, horaS: hora };
        }
        return a;
      });
    });

    alert('Salida confirmada a las ' + hora);
  };

  // ─── Nuevo registro ────────────────────────────────────
  var handleNuevoRegistro = function () {
    var ahora = new Date();
    var dia = ahora.getDate().toString().padStart(2, '0');
    var mes = (ahora.getMonth() + 1).toString().padStart(2, '0');
    var anio = ahora.getFullYear();
    var hora = ahora.getHours().toString().padStart(2, '0') + ':' + ahora.getMinutes().toString().padStart(2, '0');

    var nuevo = {
      id: Date.now(),
      usuario: 'Usuario Actual',
      ip: '192.168.1.1',
      fecha: dia + '/' + mes + '/' + anio,
      horaI: hora,
      refSal: '',
      refEnt: '',
      horaS: '',
    };

    setAsistencias(function (prev) { return [nuevo, ...prev]; });
    setAsistenciasFiltradas(function (prev) { return [nuevo, ...prev]; });
    setShowModal(false);
    alert('Asistencia registrada: ' + nuevo.fecha + ' a las ' + nuevo.horaI);
  };

  // ─── Headers tabla ─────────────────────────────────────
  var headers = ['Usuario', 'IP', 'Fecha', 'Hora I', 'Ref.Sal.', 'Ref.Ent.', 'Hora S.', ''];

  return (
    <div style={styles.wrapper}>

      {/* ═══════ HEADER ═══════ */}
      <div style={styles.titulo}>
        <span style={styles.iconoAyuda}>❓</span>
        <h2 style={styles.tituloH2}>ASISTENCIA PERSONAL</h2>
      </div>

      {/* ═══════ FILTROS ═══════ */}
      <div style={styles.filtrosContainer}>
        <div style={styles.filtrosRow}>

          {/* Buscar por */}
          <div style={styles.filtroGrupoWide}>
            <label style={styles.label}>BUSCAR X</label>
            <div style={styles.radioGroup}>
              <input
                type="radio"
                name="tipo"
                value="1"
                checked={tipoBusqueda === '1'}
                onChange={function (e) { setTipoBusqueda(e.target.value); }}
                style={styles.radioInput}
              />
              <span>Usuario /</span>
              <input
                type="radio"
                name="tipo"
                value="2"
                checked={tipoBusqueda === '2'}
                onChange={function (e) { setTipoBusqueda(e.target.value); }}
                style={styles.radioInput}
              />
              <span>Usuario ruc</span>
            </div>
            <input
              type="text"
              style={styles.inputText}
              value={busqueda}
              onChange={function (e) { setBusqueda(e.target.value); }}
              placeholder="Buscar usuario..."
              onKeyDown={function (e) { if (e.key === 'Enter') handleBuscar(); }}
            />
          </div>

          <span style={styles.yoLabel}>y/o</span>

          {/* Fecha Inicio */}
          <div style={styles.filtroGrupo}>
            <label style={styles.label}>Fecha Inicio</label>
            <input
              type="date"
              style={styles.inputDate}
              value={fechaInicio}
              onChange={function (e) { setFechaInicio(e.target.value); }}
            />
          </div>

          {/* Fecha Fin */}
          <div style={styles.filtroGrupo}>
            <label style={styles.label}>Fecha Fin</label>
            <input
              type="date"
              style={styles.inputDate}
              value={fechaFin}
              onChange={function (e) { setFechaFin(e.target.value); }}
            />
          </div>

          {/* Botones */}
          <button
            style={{ ...styles.btnBuscar, ...(hoveredBtn === 'buscar' ? { backgroundColor: '#138496' } : {}) }}
            onClick={handleBuscar}
            onMouseEnter={function () { setHoveredBtn('buscar'); }}
            onMouseLeave={function () { setHoveredBtn(null); }}
          >🔍 Buscar</button>

          <button
            style={{ ...styles.btnNuevo, ...(hoveredBtn === 'nuevo' ? { backgroundColor: '#138496' } : {}) }}
            onClick={function () { setShowModal(true); }}
            onMouseEnter={function () { setHoveredBtn('nuevo'); }}
            onMouseLeave={function () { setHoveredBtn(null); }}
            title="Registrar asistencia"
          >➕</button>
        </div>
      </div>

      {/* ═══════ TÍTULO TABLA ═══════ */}
      <div style={styles.tablaTitulo}>
        <h3 style={styles.tablaTituloH3}>LISTADO DE ASISTENCIA</h3>
      </div>

      {/* ═══════ TABLA ═══════ */}
      <div style={styles.tablaContainer}>
        <table style={styles.tabla}>
          <thead>
            <tr>
              {headers.map(function (h, i) {
                return <th key={i} style={{ ...styles.th, ...(i === 7 ? { width: '5%' } : {}) }}>{h}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" style={styles.loading}>Cargando...</td></tr>
            ) : asistenciasFiltradas.length > 0 ? (
              asistenciasFiltradas.map(function (a, index) {
                return (
                  <tr
                    key={a.id}
                    style={{ backgroundColor: hoveredRow === index ? '#CCFF66' : 'transparent' }}
                    onMouseEnter={function () { setHoveredRow(index); }}
                    onMouseLeave={function () { setHoveredRow(null); }}
                  >
                    <td style={styles.tdLeft}>{a.usuario}</td>
                    <td style={styles.td}>{a.ip}</td>
                    <td style={styles.td}>{a.fecha}</td>
                    <td style={styles.td}>{a.horaI}</td>
                    <td style={styles.td}>{a.refSal}</td>
                    <td style={styles.td}>{a.refEnt}</td>
                    <td style={styles.td}>{a.horaS}</td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>
                      {!a.horaS && (
                        <button
                          style={{
                            ...styles.btnConfirmar,
                            ...(hoveredBtn === 'confirmar-' + a.id ? { color: '#28a745' } : {}),
                          }}
                          onClick={function () { handleConfirmarSalida(a.id); }}
                          onMouseEnter={function () { setHoveredBtn('confirmar-' + a.id); }}
                          onMouseLeave={function () { setHoveredBtn(null); }}
                          title="Confirmar mi salida"
                        >👍</button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : buscado ? (
              <tr><td colSpan="8" style={styles.sinDatos}>No se encontraron registros</td></tr>
            ) : (
              <tr><td colSpan="8" style={styles.sinDatos}>Cargando registros...</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ═══════ CONTADOR ═══════ */}
      <div style={styles.contador}>
        Total registros: {asistenciasFiltradas.length}
      </div>

      {/* ═══════ MODAL NUEVO REGISTRO ═══════ */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={function () { setShowModal(false); }}>
          <div style={styles.modal} onClick={function (e) { e.stopPropagation(); }}>
            <div style={styles.modalTitulo}>Registrar Nueva Asistencia</div>

            <div style={styles.modalRow}>
              <label style={styles.label}>Usuario</label>
              <input type="text" style={styles.inputText} value="Usuario Actual" readOnly />
            </div>

            <div style={styles.modalRow}>
              <label style={styles.label}>Fecha</label>
              <input
                type="text"
                style={styles.inputText}
                value={new Date().toLocaleDateString('es-PE')}
                readOnly
              />
            </div>

            <div style={styles.modalRow}>
              <label style={styles.label}>Hora de Ingreso</label>
              <input
                type="text"
                style={styles.inputText}
                value={new Date().getHours().toString().padStart(2, '0') + ':' + new Date().getMinutes().toString().padStart(2, '0')}
                readOnly
              />
            </div>

            <div style={styles.modalBotones}>
              <button
                style={styles.btnCancelar}
                onClick={function () { setShowModal(false); }}
              >Cancelar</button>
              <button
                style={styles.btnGuardar}
                onClick={handleNuevoRegistro}
              >✅ Registrar Asistencia</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Asistencia;