// src/pages/Reportes/Contable/Venta.jsx
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
  // ─── HEADER ────────────────────────────────────────────
  titulo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '10px',
  },
  tituloH2: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  tituloLink: {
    fontSize: '16px',
    color: '#17a2b8',
    cursor: 'pointer',
    marginLeft: '5px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  iconoAyuda: {
    fontSize: '18px',
    cursor: 'pointer',
    color: '#17a2b8',
  },
  // ─── NOTA ──────────────────────────────────────────────
  nota: {
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    padding: '12px 15px',
    marginBottom: '15px',
    fontSize: '13px',
    color: '#555',
    lineHeight: '1.6',
  },
  notaTitulo: {
    fontWeight: 'bold',
    color: '#333',
  },
  // ─── FILTROS ───────────────────────────────────────────
  filtros: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '15px',
  },
  label: {
    fontSize: '13px',
    color: '#333',
    whiteSpace: 'nowrap',
    fontWeight: '600',
  },
  select: {
    padding: '6px 10px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    fontSize: '13px',
    backgroundColor: '#fff',
    color: '#333',
    outline: 'none',
    cursor: 'pointer',
  },
  inputNumero: {
    padding: '6px 10px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    fontSize: '13px',
    backgroundColor: '#fff',
    color: '#333',
    width: '80px',
    outline: 'none',
  },
  btnBuscar: {
    backgroundColor: '#17a2b8',
    color: '#fff',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  // ─── BARRA DE PROGRESO ─────────────────────────────────
  progressBar: {
    width: '100%',
    height: '22px',
    backgroundColor: '#e0e0e0',
    borderRadius: '3px',
    marginBottom: '15px',
    overflow: 'hidden',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#28a745',
    borderRadius: '3px',
    transition: 'width 0.5s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: '11px',
    color: '#fff',
    fontWeight: 'bold',
    position: 'absolute',
    left: '5px',
    top: '50%',
    transform: 'translateY(-50%)',
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
    minWidth: '1100px',
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
  tdNumero: {
    padding: '8px',
    textAlign: 'right',
    borderBottom: '1px solid #e0e0e0',
    color: '#333',
    whiteSpace: 'nowrap',
    fontFamily: "'Consolas', 'Courier New', monospace",
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
  // ─── NO COINCIDE ───────────────────────────────────────
  noCoincideTitulo: {
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    margin: '25px 0 10px 0',
  },
  tablaNoCoincide: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
    marginBottom: '20px',
  },
  // ─── RESUMEN TOTALES ──────────────────────────────────
  resumen: {
    textAlign: 'right',
    padding: '10px 0',
    fontSize: '14px',
    color: '#333',
  },
  resumenLinea: {
    padding: '3px 0',
    fontWeight: '500',
  },
  resumenTotal: {
    padding: '3px 0',
    fontWeight: 'bold',
    fontSize: '15px',
  },
  // ─── BOTONES VERIFICAR / CONFORME ─────────────────────
  botonesVerificar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    margin: '25px 0',
  },
  btnVerificar: {
    backgroundColor: '#17a2b8',
    color: '#fff',
    border: 'none',
    padding: '10px 25px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnConforme: {
    backgroundColor: '#2c7a8e',
    color: '#fff',
    border: 'none',
    padding: '10px 25px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  // ─── SEPARADOR ─────────────────────────────────────────
  separador: {
    border: 'none',
    borderTop: '1px solid #ccc',
    margin: '15px 0',
  },
  // ─── EXPORTACIONES ─────────────────────────────────────
  acciones: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '10px',
  },
  accionesPanel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '6px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  accionLinea: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  btnAccion: {
    width: '28px',
    height: '28px',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
  },
  btnPrint: { backgroundColor: '#6c757d', color: '#fff' },
  btnExcel: { backgroundColor: '#217346', color: '#fff' },
  btnPle: { backgroundColor: '#812027', color: '#fff' },
  iconoExcel: { fontWeight: 'bold', fontSize: '12px' },
  iconoPle: { fontWeight: 'bold', fontSize: '9px' },
};

// ═══════════════════════════════════════════════════════════
// ESTILOS DEL CALENDARIO
// ═══════════════════════════════════════════════════════════
const calStyles = {
  wrapper: { position: 'relative', display: 'inline-block' },
  inputContainer: {
    display: 'flex', alignItems: 'center', border: '2px solid #7bc67e',
    borderRadius: '4px', overflow: 'hidden', backgroundColor: '#fff',
  },
  input: {
    width: '130px', padding: '6px 10px', border: 'none', outline: 'none',
    fontSize: '14px', color: '#333', backgroundColor: 'transparent',
  },
  calendarBtn: {
    padding: '4px 8px', backgroundColor: '#fff', border: 'none',
    borderLeft: '1px solid #ccc', cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontSize: '20px',
  },
  dropdown: {
    position: 'absolute', top: '100%', left: '0', zIndex: 1000,
    backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)', marginTop: '2px', width: '260px',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '8px', borderBottom: '1px solid #eee', backgroundColor: '#f9f9f9',
  },
  navBtn: {
    width: '26px', height: '26px', border: '1px solid #ccc', borderRadius: '3px',
    backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '12px', color: '#17a2b8', fontWeight: 'bold',
  },
  selectGroup: { display: 'flex', alignItems: 'center', gap: '5px' },
  select: {
    padding: '3px 5px', border: '1px solid #ccc', borderRadius: '3px',
    fontSize: '13px', cursor: 'pointer', backgroundColor: '#fff', outline: 'none', color: '#333',
  },
  weekRow: {
    display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
    padding: '5px 8px 0 8px', borderBottom: '1px solid #eee',
  },
  weekDay: { textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: '#333', padding: '4px 0' },
  daysGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '5px 8px 8px 8px', gap: '2px' },
  dayCell: {
    textAlign: 'center', padding: '5px 2px', fontSize: '13px', cursor: 'pointer',
    borderRadius: '3px', color: '#333', fontWeight: '500', border: '1px solid #e0e0e0', backgroundColor: '#fff',
  },
  dayCellHover: { backgroundColor: '#d4eef5', border: '1px solid #17a2b8' },
  dayCellToday: { backgroundColor: '#fff3cd', fontWeight: 'bold', color: '#333', border: '2px solid #ffc107' },
  dayCellSelected: { backgroundColor: '#17a2b8', color: '#fff', fontWeight: 'bold', border: '1px solid #138496' },
  dayCellOtherMonth: { color: '#aaa', backgroundColor: '#f8f8f8', border: '1px solid #eee', cursor: 'default' },
};

// ═══════════════════════════════════════════════════════════
// COMPONENTE CALENDARIO
// ═══════════════════════════════════════════════════════════
const CalendarioPersonalizado = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredDay, setHoveredDay] = useState(null);
  const calRef = useRef(null);

  const parseValue = () => {
    if (value) {
      const [anio, mes] = value.split('-');
      return { mes: parseInt(mes) - 1, anio: parseInt(anio) };
    }
    const now = new Date();
    return { mes: now.getMonth(), anio: now.getFullYear() };
  };

  const [viewMonth, setViewMonth] = useState(parseValue().mes);
  const [viewYear, setViewYear] = useState(parseValue().anio);
  const [selectedDay, setSelectedDay] = useState(null);

  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const diasSemana = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calRef.current && !calRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const generateDays = () => {
    const daysInMonth = getDaysInMonth(viewMonth, viewYear);
    const firstDay = getFirstDayOfMonth(viewMonth, viewYear);
    const daysInPrevMonth = viewMonth === 0 ? getDaysInMonth(11, viewYear - 1) : getDaysInMonth(viewMonth - 1, viewYear);
    const days = [];
    for (let i = firstDay - 1; i >= 0; i--) days.push({ day: daysInPrevMonth - i, currentMonth: false });
    for (let i = 1; i <= daysInMonth; i++) days.push({ day: i, currentMonth: true });
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) days.push({ day: i, currentMonth: false });
    return days;
  };

  const isToday = (day) => {
    const now = new Date();
    return day === now.getDate() && viewMonth === now.getMonth() && viewYear === now.getFullYear();
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const handleSelectDay = (day, isCurrentMonth) => {
    if (!isCurrentMonth) return;
    setSelectedDay(day);
    const mesStr = String(viewMonth + 1).padStart(2, '0');
    onChange(viewYear + '-' + mesStr);
    setIsOpen(false);
  };

  const displayValue = () => {
    if (!value) return '';
    const [anio, mes] = value.split('-');
    return mes + '/' + anio;
  };

  const years = [];
  for (let y = 2020; y <= 2035; y++) years.push(y);

  return (
    <div style={calStyles.wrapper} ref={calRef}>
      <div style={calStyles.inputContainer}>
        <input type="text" style={calStyles.input} value={displayValue()} placeholder="MM/YYYY" readOnly onClick={() => setIsOpen(!isOpen)} />
        <button style={calStyles.calendarBtn} onClick={() => setIsOpen(!isOpen)}>📅</button>
      </div>
      {isOpen && (
        <div style={calStyles.dropdown}>
          <div style={calStyles.header}>
            <button style={calStyles.navBtn} onClick={prevMonth}>◀</button>
            <div style={calStyles.selectGroup}>
              <select style={calStyles.select} value={viewMonth} onChange={(e) => setViewMonth(parseInt(e.target.value))}>
                {meses.map((mes, i) => (<option key={i} value={i}>{mes}</option>))}
              </select>
              <select style={calStyles.select} value={viewYear} onChange={(e) => setViewYear(parseInt(e.target.value))}>
                {years.map((y) => (<option key={y} value={y}>{y}</option>))}
              </select>
            </div>
            <button style={calStyles.navBtn} onClick={nextMonth}>▶</button>
          </div>
          <div style={calStyles.weekRow}>
            {diasSemana.map((dia) => (<div key={dia} style={calStyles.weekDay}>{dia}</div>))}
          </div>
          <div style={calStyles.daysGrid}>
            {generateDays().map((item, index) => {
              const isSelected = item.currentMonth && item.day === selectedDay &&
                value === (viewYear + '-' + String(viewMonth + 1).padStart(2, '0'));
              let cellStyle = { ...calStyles.dayCell };
              if (!item.currentMonth) cellStyle = { ...cellStyle, ...calStyles.dayCellOtherMonth };
              else if (isSelected) cellStyle = { ...cellStyle, ...calStyles.dayCellSelected };
              else if (isToday(item.day)) cellStyle = { ...cellStyle, ...calStyles.dayCellToday };
              if (hoveredDay === index && item.currentMonth && !isSelected)
                cellStyle = { ...cellStyle, ...calStyles.dayCellHover };
              return (
                <div key={index} style={cellStyle}
                  onClick={() => handleSelectDay(item.day, item.currentMonth)}
                  onMouseEnter={() => setHoveredDay(index)}
                  onMouseLeave={() => setHoveredDay(null)}>
                  {item.day}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// FUNCIONES DE EXPORTACIÓN
// ═══════════════════════════════════════════════════════════
const exportToExcel = (ventas, totales, notaCredito, periodo, nombreArchivo) => {
  const formatNum = (num) => num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">';
  html += '<head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>';
  html += '<x:ExcelWorksheet><x:Name>Ventas</x:Name><x:WorksheetOptions><x:DisplayGridlines/>';
  html += '</x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>';
  html += '<body><table border="1" cellpadding="5" cellspacing="0" style="border-collapse:collapse;">';

  html += '<tr><td colspan="12" style="text-align:center;font-size:16px;font-weight:bold;background:#2c7a8e;color:#fff;padding:10px;">';
  html += 'LISTADO REPORTE GENERAL DE VENTAS - ' + periodo + '</td></tr>';
  html += '<tr><td colspan="12"></td></tr>';

  var headers = ['FECHA EM.', 'FECHA V.', 'TIPO', 'SERIE', 'NRO', 'T.IDENT', 'RUC', 'CLIENTE', 'BASE.IMPO', 'IGV', 'IMPORTE', 'T.CAMBIO'];
  html += '<tr>';
  headers.forEach(function (h) {
    html += '<td style="background:#2c7a8e;color:#fff;font-weight:bold;text-align:center;padding:8px;font-size:11px;">' + h + '</td>';
  });
  html += '</tr>';

  ventas.forEach(function (v, i) {
    var bg = i % 2 === 0 ? '#fff' : '#f5f5f5';
    html += '<tr>';
    html += '<td style="background:' + bg + ';text-align:center;">' + v.fechaEm + '</td>';
    html += '<td style="background:' + bg + ';text-align:center;">' + v.fechaV + '</td>';
    html += '<td style="background:' + bg + ';text-align:center;">' + v.tipo + '</td>';
    html += '<td style="background:' + bg + ';text-align:center;">' + v.serie + '</td>';
    html += '<td style="background:' + bg + ';text-align:center;">' + v.nro + '</td>';
    html += '<td style="background:' + bg + ';text-align:center;">' + v.tIdent + '</td>';
    html += '<td style="background:' + bg + ';text-align:center;">' + v.ruc + '</td>';
    html += '<td style="background:' + bg + ';">' + v.cliente + '</td>';
    html += '<td style="background:' + bg + ';text-align:right;">' + formatNum(v.baseImpo) + '</td>';
    html += '<td style="background:' + bg + ';text-align:right;">' + formatNum(v.igv) + '</td>';
    html += '<td style="background:' + bg + ';text-align:right;">' + formatNum(v.importe) + '</td>';
    html += '<td style="background:' + bg + ';text-align:right;">' + formatNum(v.tCambio) + '</td>';
    html += '</tr>';
  });

  html += '<tr><td colspan="12"></td></tr>';
  html += '<tr><td colspan="12" style="text-align:right;font-weight:bold;">( Item:' + ventas.length + ') VENTA TOTAL + ' + formatNum(totales.importe) + '</td></tr>';
  html += '<tr><td colspan="12" style="text-align:right;font-weight:bold;">(Item:) NOTA DE CREDITO TOTAL - ' + formatNum(notaCredito) + '</td></tr>';
  html += '<tr><td colspan="12" style="text-align:right;font-weight:bold;font-size:14px;">VENTA - NC = ' + formatNum(totales.importe - notaCredito) + '</td></tr>';

  html += '</table></body></html>';

  var blob = new Blob(['\ufeff' + html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  var link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = nombreArchivo;
  link.click();
  URL.revokeObjectURL(link.href);
};

const printTable = (ventas, totales, notaCredito, periodo, formatNumber) => {
  var printWindow = window.open('', '_blank');
  if (!printWindow) { alert('Permite las ventanas emergentes'); return; }

  var headers = ['FECHA EM.', 'FECHA V.', 'TIPO', 'SERIE', 'NRO', 'T.IDENT', 'RUC', 'CLIENTE', 'BASE.IMPO', 'IGV', 'IMPORTE', 'T.CAMBIO'];
  var htmlContent = '<!DOCTYPE html><html><head><title>Reporte de Venta - ' + periodo + '</title>';
  htmlContent += '<style>';
  htmlContent += 'body{font-family:Segoe UI,Arial,sans-serif;padding:20px;color:#333;}';
  htmlContent += 'h2{text-align:center;margin-bottom:5px;}h4{text-align:center;color:#666;margin-top:0;}';
  htmlContent += 'table{width:100%;border-collapse:collapse;font-size:11px;margin-top:15px;}';
  htmlContent += 'th{background-color:#2c7a8e;color:#fff;padding:8px 5px;text-align:center;border:1px solid #2c7a8e;}';
  htmlContent += 'td{padding:6px 5px;text-align:center;border:1px solid #ddd;}';
  htmlContent += '.numero{text-align:right;font-family:Consolas,monospace;}';
  htmlContent += '.resumen{text-align:right;margin-top:15px;font-size:13px;}';
  htmlContent += '.resumen div{padding:3px 0;}.total{font-weight:bold;font-size:14px;}';
  htmlContent += '</style></head><body>';
  htmlContent += '<h2>LISTADO REPORTE GENERAL DE VENTAS</h2><h4>Periodo: ' + periodo + '</h4>';
  htmlContent += '<table><thead><tr>';
  headers.forEach(function (h) { htmlContent += '<th>' + h + '</th>'; });
  htmlContent += '</tr></thead><tbody>';

  ventas.forEach(function (v) {
    htmlContent += '<tr>';
    htmlContent += '<td>' + v.fechaEm + '</td><td>' + v.fechaV + '</td><td>' + v.tipo + '</td>';
    htmlContent += '<td>' + v.serie + '</td><td>' + v.nro + '</td><td>' + v.tIdent + '</td>';
    htmlContent += '<td>' + v.ruc + '</td><td>' + v.cliente + '</td>';
    htmlContent += '<td class="numero">' + formatNumber(v.baseImpo) + '</td>';
    htmlContent += '<td class="numero">' + formatNumber(v.igv) + '</td>';
    htmlContent += '<td class="numero">' + formatNumber(v.importe) + '</td>';
    htmlContent += '<td class="numero">' + formatNumber(v.tCambio) + '</td>';
    htmlContent += '</tr>';
  });

  htmlContent += '</tbody></table>';
  htmlContent += '<div class="resumen">';
  htmlContent += '<div>( Item:' + ventas.length + ') VENTA TOTAL + ' + formatNumber(totales.importe) + '</div>';
  htmlContent += '<div>(Item:) NOTA DE CREDITO TOTAL - ' + formatNumber(notaCredito) + '</div>';
  htmlContent += '<div class="total">VENTA - NC = ' + formatNumber(totales.importe - notaCredito) + '</div>';
  htmlContent += '</div></body></html>';

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(function () { printWindow.print(); }, 500);
};

const exportCSV = (ventas, totales, notaCredito, periodo, nombreArchivo, tipo) => {
  var csv = '';

  if (tipo === 'PLE') {
    csv = 'REGISTRO DE VENTAS - PLE 5.0 - ' + periodo + '\n\n';
    csv += 'PERIODO,CUO,CORRELATIVO,F.EMISION,F.VENC,TIPO,SERIE,NRO,TIPO DOC,RUC,RAZON SOCIAL,BASE IMP,IGV,IMPORTE,T.CAMBIO\n';
    var partes = periodo.split(' ');
    ventas.forEach(function (v, i) {
      csv += [periodo, 'M' + String(i + 1).padStart(4, '0'), String(i + 1).padStart(4, '0'),
        v.fechaEm, v.fechaV, v.tipo, v.serie, v.nro, v.tIdent, v.ruc,
        '"' + v.cliente + '"', v.baseImpo.toFixed(2), v.igv.toFixed(2),
        v.importe.toFixed(2), v.tCambio.toFixed(2)].join(',') + '\n';
    });
  } else if (tipo === 'CONCAR') {
    csv = 'REGISTRO DE VENTAS - CONCAR - ' + periodo + '\n\n';
    csv += 'SUBDIARIO,NRO COMPROBANTE,F.EMISION,MONEDA,TIPO DOC,SERIE,NRO,RUC,RAZON SOCIAL,BASE IMP,IGV,IMPORTE\n';
    ventas.forEach(function (v, i) {
      csv += ['14', String(i + 1).padStart(4, '0'), v.fechaEm, 'MN', v.tipo, v.serie,
        v.nro, v.ruc, '"' + v.cliente + '"', v.baseImpo.toFixed(2),
        v.igv.toFixed(2), v.importe.toFixed(2)].join(',') + '\n';
    });
  } else if (tipo === 'SISCON') {
    csv = 'REGISTRO DE VENTAS - SISCON - ' + periodo + '\n\n';
    csv += 'TIPO,SERIE,NRO,F.EMISION,RUC,RAZON SOCIAL,BASE IMP,IGV,IMPORTE,MONEDA,T.CAMBIO\n';
    ventas.forEach(function (v) {
      csv += [v.tipo, v.serie, v.nro, v.fechaEm, v.ruc, '"' + v.cliente + '"',
        v.baseImpo.toFixed(2), v.igv.toFixed(2), v.importe.toFixed(2),
        'PEN', v.tCambio.toFixed(2)].join(',') + '\n';
    });
  } else if (tipo === 'CALCUN') {
    csv = 'REGISTRO DE VENTAS - CALCUN - ' + periodo + '\n\n';
    csv += 'PERIODO,CUO,F.EMISION,F.VENC,TIPO,SERIE,NRO,TIPO DOC,RUC,RAZON SOCIAL,BASE IMP,IGV,IMPORTE,T.CAMBIO\n';
    ventas.forEach(function (v, i) {
      csv += [periodo, 'M' + String(i + 1).padStart(4, '0'), v.fechaEm, v.fechaV,
        v.tipo, v.serie, v.nro, v.tIdent, v.ruc, '"' + v.cliente + '"',
        v.baseImpo.toFixed(2), v.igv.toFixed(2), v.importe.toFixed(2),
        v.tCambio.toFixed(2)].join(',') + '\n';
    });
  }

  csv += '\n';
  csv += 'VENTA TOTAL,' + totales.importe.toFixed(2) + '\n';
  csv += 'NOTA DE CREDITO TOTAL,' + notaCredito.toFixed(2) + '\n';
  csv += 'VENTA - NC,' + (totales.importe - notaCredito).toFixed(2) + '\n';

  var blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  var link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = nombreArchivo;
  link.click();
  URL.revokeObjectURL(link.href);
};

// ═══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL - VENTA
// ═══════════════════════════════════════════════════════════
const Venta = () => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [sucursal, setSucursal] = useState('1');
  const [documento, setDocumento] = useState('');
  const [ventas, setVentas] = useState([]);
  const [noCoincide, setNoCoincide] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buscado, setBuscado] = useState(false);
  const [vista, setVista] = useState('verificar'); // 'verificar' o 'exportar'
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [progreso, setProgreso] = useState(0);
  const [notaCredito, setNotaCredito] = useState(0);

  // ─── Datos de sucursales ───────────────────────────────
  const sucursales = [
    { value: '', label: 'Todos' },
    { value: '3', label: 'Almacen 2B 167' },
    { value: '1', label: 'Tienda 1b 133' },
    { value: '2', label: 'Tienda 1A 119' },
  ];

  // ─── Datos de ejemplo ──────────────────────────────────
  const datosEjemplo = {
    '2026-03': [
      {
        fechaEm: '03/03/2026', fechaV: '03/03/2026', tipo: 'Boleta', serie: 'BI01',
        nro: '33', tIdent: '1', ruc: '75845811', cliente: 'AARON SMITH ITURRI QUISPE',
        baseImpo: 2677.75, igv: 482.00, importe: 3159.75, tCambio: 3.83,
      },
      {
        fechaEm: '03/03/2026', fechaV: '03/03/2026', tipo: 'Boleta', serie: 'BI01',
        nro: '34', tIdent: '1', ruc: '75845911', cliente: 'RAYSA YUPANQUI BARBOZA',
        baseImpo: 892.58, igv: 160.67, importe: 1053.25, tCambio: 3.83,
      },
      {
        fechaEm: '06/03/2026', fechaV: '06/03/2026', tipo: 'Boleta', serie: 'BI01',
        nro: '35', tIdent: '1', ruc: '75845911', cliente: 'RAYSA YUPANQUI BARBOZA',
        baseImpo: 512.83, igv: 92.31, importe: 605.14, tCambio: 3.83,
      },
      {
        fechaEm: '07/03/2026', fechaV: '07/03/2026', tipo: 'Boleta', serie: 'BI01',
        nro: '36', tIdent: '1', ruc: '60869824', cliente: 'GABRIELA INES LUNA FLORES',
        baseImpo: 1608.47, igv: 289.53, importe: 1898.00, tCambio: 3.83,
      },
    ],
    '2026-02': [],
  };

  const mesesNombre = [
    '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];

  const getPeriodoTexto = () => {
    if (!fechaSeleccionada) return '';
    var partes = fechaSeleccionada.split('-');
    return mesesNombre[parseInt(partes[1])] + ' ' + partes[0];
  };

  const handleBuscar = () => {
    if (!fechaSeleccionada) { alert('Por favor seleccione una fecha'); return; }
    setLoading(true);
    setBuscado(true);
    setVista('verificar');
    setProgreso(0);

    // Simular progreso
    var interval = setInterval(function () {
      setProgreso(function (prev) {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + 20;
      });
    }, 100);

    setTimeout(function () {
      clearInterval(interval);
      setProgreso(100);
      var resultados = datosEjemplo[fechaSeleccionada] || [];
      setVentas(resultados);
      setNoCoincide([]);
      setNotaCredito(0);
      setLoading(false);
    }, 700);
  };

  const formatNumber = (num) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const calcularTotales = () => {
    return ventas.reduce(function (acc, v) {
      return {
        baseImpo: acc.baseImpo + v.baseImpo,
        igv: acc.igv + v.igv,
        importe: acc.importe + v.importe,
      };
    }, { baseImpo: 0, igv: 0, importe: 0 });
  };

  var totales = calcularTotales();

  // ─── Headers según vista ───────────────────────────────
  var headersVerificar = ['F.EM', 'F.V.', 'DOC', 'SERIE', 'NRO', 'T.IDE.', 'RUC/DNI', 'CLIENTE', 'B.IMP.', 'IGV', 'IMP.', 'T.C.'];
  var headersExportar = ['FECHA EM.', 'FECHA V.', 'TIPO', 'SERIE', 'NRO', 'T.IDENT', 'RUC', 'CLIENTE', 'BASE.IMPO', 'IGV', 'IMPORTE', 'T.CAMBIO'];
  var headersNoCoincide = ['DOCUMENTO', 'SERIE', 'NRO SALIDA', 'FECHA SALIDA', 'IMPORTE'];

  // ─── Handlers ──────────────────────────────────────────
  var handleSeguirVerificando = function () {
    handleBuscar();
  };

  var handleConforme = function () {
    if (ventas.length === 0) { alert('No hay datos para exportar'); return; }
    setVista('exportar');
  };

  var handleVolverVerificar = function () {
    setVista('verificar');
  };

  // ─── Exportaciones ─────────────────────────────────────
  var handlePrint = function () {
    if (ventas.length === 0) { alert('No hay datos'); return; }
    printTable(ventas, totales, notaCredito, getPeriodoTexto(), formatNumber);
  };

  var handleExportExcel = function () {
    if (ventas.length === 0) { alert('No hay datos'); return; }
    var partes = fechaSeleccionada.split('-');
    exportToExcel(ventas, totales, notaCredito, getPeriodoTexto(), 'Reporte_Ventas_' + partes[1] + '_' + partes[0] + '.xls');
  };

  var handleExportPLE = function () {
    if (ventas.length === 0) { alert('No hay datos'); return; }
    var partes = fechaSeleccionada.split('-');
    exportCSV(ventas, totales, notaCredito, getPeriodoTexto(), 'PLE_Ventas_' + partes[1] + '_' + partes[0] + '.csv', 'PLE');
  };

  var handleExportCONCAR = function () {
    if (ventas.length === 0) { alert('No hay datos'); return; }
    var partes = fechaSeleccionada.split('-');
    exportCSV(ventas, totales, notaCredito, getPeriodoTexto(), 'CONCAR_Ventas_' + partes[1] + '_' + partes[0] + '.csv', 'CONCAR');
  };

  var handleExportSISCON = function () {
    if (ventas.length === 0) { alert('No hay datos'); return; }
    var partes = fechaSeleccionada.split('-');
    exportCSV(ventas, totales, notaCredito, getPeriodoTexto(), 'SISCON_Ventas_' + partes[1] + '_' + partes[0] + '.csv', 'SISCON');
  };

  var handleExportSISCONPle = function () {
    if (ventas.length === 0) { alert('No hay datos'); return; }
    var partes = fechaSeleccionada.split('-');
    exportCSV(ventas, totales, notaCredito, getPeriodoTexto(), 'SISCON_PLE_Ventas_' + partes[1] + '_' + partes[0] + '.csv', 'SISCON');
  };

  var handleExportCALCUN = function () {
    if (ventas.length === 0) { alert('No hay datos'); return; }
    var partes = fechaSeleccionada.split('-');
    exportCSV(ventas, totales, notaCredito, getPeriodoTexto(), 'CALCUN_Ventas_' + partes[1] + '_' + partes[0] + '.csv', 'CALCUN');
  };

  // ═══════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════
  return (
    <div style={styles.wrapper}>

      {/* ═══════ HEADER ═══════ */}
      <div style={styles.titulo}>
        <span style={styles.iconoAyuda}>❓</span>
        <h2 style={styles.tituloH2}>
          {vista === 'verificar' ? 'Reporte de Venta - contable (verificar error)' : 'Reporte de Venta'}
        </h2>
        {vista === 'exportar' && (
          <span style={styles.tituloLink} onClick={handleVolverVerificar}>1</span>
        )}
      </div>

      {/* ═══════ NOTA (solo en verificar) ═══════ */}
      {vista === 'verificar' && (
        <div style={styles.nota}>
          <span style={styles.notaTitulo}>Nota.-</span> Al final saldra la conformidad y aprobar para exportar a cualquiere formato de su preferencia
          <br />para corregir solo hacer click en el monto individualmente
          <br />para ver si se corregio solo vuelve a buscar
        </div>
      )}

      {/* ═══════ FILTROS ═══════ */}
      <div style={styles.filtros}>
        <label style={styles.label}>Sucursal</label>
        <select style={styles.select} value={sucursal} onChange={(e) => setSucursal(e.target.value)}>
          {sucursales.map(function (s) {
            return <option key={s.value} value={s.value}>{s.label}</option>;
          })}
        </select>

        <label style={styles.label}>Seleccione Fecha</label>
        <CalendarioPersonalizado value={fechaSeleccionada} onChange={setFechaSeleccionada} />

        <select style={styles.select} value={documento} onChange={(e) => setDocumento(e.target.value)}>
          <option value="">Documento {'>'} todos</option>
          <option value="Boleta">Boleta</option>
          <option value="Factura">Factura</option>
        </select>

        {vista === 'verificar' && (
          <input type="text" style={styles.inputNumero} placeholder="300" readOnly value="300" />
        )}

        <button
          style={{ ...styles.btnBuscar, ...(hoveredBtn === 'buscar' ? { backgroundColor: '#138496' } : {}) }}
          onClick={handleBuscar}
          onMouseEnter={() => setHoveredBtn('buscar')}
          onMouseLeave={() => setHoveredBtn(null)}
        >🔍 Buscar</button>
      </div>

      {/* ═══════ BARRA PROGRESO (solo verificar) ═══════ */}
      {vista === 'verificar' && buscado && (
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: progreso + '%' }}></div>
          <span style={styles.progressText}>{progreso}%</span>
        </div>
      )}

      {/* ═══════ TABLA PRINCIPAL ═══════ */}
      <div style={styles.tablaTitulo}>
        <h3 style={styles.tablaTituloH3}>LISTADO REPORTE GENERAL</h3>
      </div>

      <div style={styles.tablaContainer}>
        <table style={styles.tabla}>
          <thead>
            <tr>
              {(vista === 'verificar' ? headersVerificar : headersExportar).map(function (h) {
                return <th key={h} style={styles.th}>{h}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="12" style={styles.loading}>Cargando...</td></tr>
            ) : ventas.length > 0 ? (
              ventas.map(function (v, index) {
                return (
                  <tr key={index}
                    style={{ backgroundColor: hoveredRow === index ? '#e8f4f8' : 'transparent' }}
                    onMouseEnter={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}>
                    <td style={styles.td}>{v.fechaEm}</td>
                    <td style={styles.td}>{v.fechaV}</td>
                    <td style={styles.td}>{v.tipo}</td>
                    <td style={styles.td}>{v.serie}</td>
                    <td style={styles.td}>{v.nro}</td>
                    <td style={styles.td}>{v.tIdent}</td>
                    <td style={styles.td}>{v.ruc}</td>
                    <td style={styles.td}>{v.cliente}</td>
                    <td style={styles.tdNumero}>{formatNumber(v.baseImpo)}</td>
                    <td style={styles.tdNumero}>{formatNumber(v.igv)}</td>
                    <td style={styles.tdNumero}>{formatNumber(v.importe)}</td>
                    <td style={styles.tdNumero}>{formatNumber(v.tCambio)}</td>
                  </tr>
                );
              })
            ) : buscado ? (
              <tr><td colSpan="12" style={styles.sinDatos}>No se encontraron registros</td></tr>
            ) : (
              <tr><td colSpan="12" style={styles.sinDatos}>Seleccione una fecha y presione Buscar</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ═══════ RESUMEN DE TOTALES (solo exportar) ═══════ */}
      {vista === 'exportar' && ventas.length > 0 && (
        <div style={styles.resumen}>
          <div style={styles.resumenLinea}>( Item:{ventas.length}) VENTA TOTAL + {formatNumber(totales.importe)}</div>
          <div style={styles.resumenLinea}>(Item:) NOTA DE CREDITO TOTAL - {formatNumber(notaCredito)}</div>
          <br />
          <div style={styles.resumenTotal}>VENTA - NC = {formatNumber(totales.importe - notaCredito)}</div>
        </div>
      )}

      {/* ═══════ SECCIÓN NO COINCIDE (solo verificar) ═══════ */}
      {vista === 'verificar' && buscado && (
        <>
          <div style={styles.noCoincideTitulo}>NO COINCIDE</div>
          <div style={styles.tablaContainer}>
            <table style={styles.tablaNoCoincide}>
              <thead>
                <tr>
                  {headersNoCoincide.map(function (h) {
                    return <th key={h} style={styles.th}>{h}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {noCoincide.length > 0 ? (
                  noCoincide.map(function (item, i) {
                    return (
                      <tr key={i}>
                        <td style={styles.td}>{item.documento}</td>
                        <td style={styles.td}>{item.serie}</td>
                        <td style={styles.td}>{item.nroSalida}</td>
                        <td style={styles.td}>{item.fechaSalida}</td>
                        <td style={styles.tdNumero}>{formatNumber(item.importe)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan="5" style={styles.sinDatos}>Sin registros que no coincidan</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* BOTONES VERIFICAR / CONFORME */}
          <div style={styles.botonesVerificar}>
            <button
              style={{ ...styles.btnVerificar, ...(hoveredBtn === 'verificar' ? { backgroundColor: '#138496' } : {}) }}
              onClick={handleSeguirVerificando}
              onMouseEnter={() => setHoveredBtn('verificar')}
              onMouseLeave={() => setHoveredBtn(null)}
            >Segir verificado</button>
            <button
              style={{ ...styles.btnConforme, ...(hoveredBtn === 'conforme' ? { backgroundColor: '#1a5c6b' } : {}) }}
              onClick={handleConforme}
              onMouseEnter={() => setHoveredBtn('conforme')}
              onMouseLeave={() => setHoveredBtn(null)}
            >conforme ahora quiero exportar</button>
          </div>
        </>
      )}

      {/* ═══════ SEPARADOR ═══════ */}
      {vista === 'exportar' && ventas.length > 0 && (
        <>
          <hr style={styles.separador} />
          <hr style={styles.separador} />

          {/* ═══════ PANEL DE EXPORTACIONES ═══════ */}
          <div style={styles.acciones}>
            <div style={styles.accionesPanel}>

              {/* Reporte */}
              <div style={styles.accionLinea}>
                <span>Reporte:</span>
                <button style={{ ...styles.btnAccion, ...styles.btnPrint }} onClick={handlePrint} title="Imprimir">🖨️</button>
                <button style={{ ...styles.btnAccion, ...styles.btnExcel }} onClick={handleExportExcel} title="Exportar Excel">
                  <span style={styles.iconoExcel}>X</span>
                </button>
              </div>

              {/* PLE */}
              <div style={styles.accionLinea}>
                <span>Exportar PLE:</span>
                <button style={{ ...styles.btnAccion, ...styles.btnPle }} onClick={handleExportPLE} title="Exportar PLE 5.0">
                  <span style={styles.iconoPle}>PLE</span>
                </button>
              </div>

              {/* CONCAR */}
              <div style={styles.accionLinea}>
                <span>Exportar CONCAR:</span>
                <button style={{ ...styles.btnAccion, ...styles.btnExcel }} onClick={handleExportCONCAR} title="Exportar CONCAR">
                  <span style={styles.iconoExcel}>X</span>
                </button>
              </div>

              {/* SISCON */}
              <div style={styles.accionLinea}>
                <span>Exportar SISCON:</span>
                <button style={{ ...styles.btnAccion, ...styles.btnExcel }} onClick={handleExportSISCON} title="Exportar SISCON Excel">
                  <span style={styles.iconoExcel}>X</span>
                </button>
                <button style={{ ...styles.btnAccion, ...styles.btnPle }} onClick={handleExportSISCONPle} title="Exportar SISCON PLE">
                  <span style={styles.iconoPle}>TXT</span>
                </button>
              </div>

              {/* CALCUN */}
              <div style={styles.accionLinea}>
                <span>Exportar CALCUN:</span>
                <button style={{ ...styles.btnAccion, ...styles.btnExcel }} onClick={handleExportCALCUN} title="Exportar CALCUN">
                  <span style={styles.iconoExcel}>X</span>
                </button>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Venta;