// src/pages/Reportes/Contable/Compra.jsx
import React, { useState, useRef, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════
// ESTILOS PRINCIPALES
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
    marginBottom: '15px',
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
  filtros: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '20px',
  },
  label: {
    fontSize: '13px',
    color: '#333',
    whiteSpace: 'nowrap',
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
  tablaTitulo: {
    textAlign: 'center',
    margin: '25px 0 10px 0',
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
  tdTotal: {
    padding: '10px 8px',
    textAlign: 'right',
    borderTop: '2px solid #2c7a8e',
    borderBottom: '2px solid #2c7a8e',
    color: '#333',
    whiteSpace: 'nowrap',
    fontFamily: "'Consolas', 'Courier New', monospace",
    fontWeight: 'bold',
    backgroundColor: '#e8f4f8',
  },
  tdTotalLabel: {
    padding: '10px 8px',
    textAlign: 'right',
    borderTop: '2px solid #2c7a8e',
    borderBottom: '2px solid #2c7a8e',
    color: '#333',
    fontWeight: 'bold',
    backgroundColor: '#e8f4f8',
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
  acciones: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '20px',
    marginTop: '10px',
    flexWrap: 'wrap',
  },
  accionesDer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '8px',
  },
  exportarGrupo: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  exportarCalcun: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  btnAccion: {
    width: '30px',
    height: '30px',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
  },
  btnPrint: { backgroundColor: '#6c757d', color: '#fff' },
  btnExcel: { backgroundColor: '#217346', color: '#fff' },
  btnPdf: { backgroundColor: '#dc3545', color: '#fff' },
  iconoExcel: { fontWeight: 'bold', fontSize: '13px' },
  iconoPdf: { fontWeight: 'bold', fontSize: '9px' },
};

// ═══════════════════════════════════════════════════════════
// ESTILOS DEL CALENDARIO
// ═══════════════════════════════════════════════════════════
const calStyles = {
  wrapper: {
    position: 'relative',
    display: 'inline-block',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    border: '2px solid #7bc67e',
    borderRadius: '4px',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  input: {
    width: '130px',
    padding: '6px 10px',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    color: '#333',
    backgroundColor: 'transparent',
  },
  calendarBtn: {
    padding: '4px 8px',
    backgroundColor: '#fff',
    border: 'none',
    borderLeft: '1px solid #ccc',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: '0',
    zIndex: 1000,
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    marginTop: '2px',
    width: '260px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px',
    borderBottom: '1px solid #eee',
    backgroundColor: '#f9f9f9',
  },
  navBtn: {
    width: '26px',
    height: '26px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    color: '#17a2b8',
    fontWeight: 'bold',
  },
  selectGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  select: {
    padding: '3px 5px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    fontSize: '13px',
    cursor: 'pointer',
    backgroundColor: '#fff',
    outline: 'none',
    color: '#333',
  },
  weekRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    padding: '5px 8px 0 8px',
    borderBottom: '1px solid #eee',
  },
  weekDay: {
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#333',
    padding: '4px 0',
  },
  daysGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    padding: '5px 8px 8px 8px',
    gap: '2px',
  },
  dayCell: {
    textAlign: 'center',
    padding: '5px 2px',
    fontSize: '13px',
    cursor: 'pointer',
    borderRadius: '3px',
    color: '#333',
    fontWeight: '500',
    border: '1px solid #e0e0e0',
    backgroundColor: '#fff',
  },
  dayCellHover: {
    backgroundColor: '#d4eef5',
    border: '1px solid #17a2b8',
  },
  dayCellToday: {
    backgroundColor: '#fff3cd',
    fontWeight: 'bold',
    color: '#333',
    border: '2px solid #ffc107',
  },
  dayCellSelected: {
    backgroundColor: '#17a2b8',
    color: '#fff',
    fontWeight: 'bold',
    border: '1px solid #138496',
  },
  dayCellOtherMonth: {
    color: '#aaa',
    backgroundColor: '#f8f8f8',
    border: '1px solid #eee',
    cursor: 'default',
  },
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
      if (calRef.current && !calRef.current.contains(e.target)) {
        setIsOpen(false);
      }
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
    const daysInPrevMonth = viewMonth === 0
      ? getDaysInMonth(11, viewYear - 1)
      : getDaysInMonth(viewMonth - 1, viewYear);
    const days = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, currentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, currentMonth: true });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, currentMonth: false });
    }
    return days;
  };

  const isToday = (day) => {
    const now = new Date();
    return day === now.getDate() && viewMonth === now.getMonth() && viewYear === now.getFullYear();
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
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
  for (let y = 2020; y <= 2035; y++) {
    years.push(y);
  }

  return (
    <div style={calStyles.wrapper} ref={calRef}>
      <div style={calStyles.inputContainer}>
        <input
          type="text"
          style={calStyles.input}
          value={displayValue()}
          placeholder="MM/YYYY"
          readOnly
          onClick={() => setIsOpen(!isOpen)}
        />
        <button style={calStyles.calendarBtn} onClick={() => setIsOpen(!isOpen)}>
          📅
        </button>
      </div>

      {isOpen && (
        <div style={calStyles.dropdown}>
          <div style={calStyles.header}>
            <button style={calStyles.navBtn} onClick={prevMonth}>◀</button>
            <div style={calStyles.selectGroup}>
              <select
                style={calStyles.select}
                value={viewMonth}
                onChange={(e) => setViewMonth(parseInt(e.target.value))}
              >
                {meses.map((mes, i) => (
                  <option key={i} value={i}>{mes}</option>
                ))}
              </select>
              <select
                style={calStyles.select}
                value={viewYear}
                onChange={(e) => setViewYear(parseInt(e.target.value))}
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <button style={calStyles.navBtn} onClick={nextMonth}>▶</button>
          </div>

          <div style={calStyles.weekRow}>
            {diasSemana.map((dia) => (
              <div key={dia} style={calStyles.weekDay}>{dia}</div>
            ))}
          </div>

          <div style={calStyles.daysGrid}>
            {generateDays().map((item, index) => {
              const isSelected = item.currentMonth && item.day === selectedDay &&
                value === (viewYear + '-' + String(viewMonth + 1).padStart(2, '0'));

              let cellStyle = { ...calStyles.dayCell };

              if (!item.currentMonth) {
                cellStyle = { ...cellStyle, ...calStyles.dayCellOtherMonth };
              } else if (isSelected) {
                cellStyle = { ...cellStyle, ...calStyles.dayCellSelected };
              } else if (isToday(item.day)) {
                cellStyle = { ...cellStyle, ...calStyles.dayCellToday };
              }

              if (hoveredDay === index && item.currentMonth && !isSelected) {
                cellStyle = { ...cellStyle, ...calStyles.dayCellHover };
              }

              return (
                <div
                  key={index}
                  style={cellStyle}
                  onClick={() => handleSelectDay(item.day, item.currentMonth)}
                  onMouseEnter={() => setHoveredDay(index)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
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
// FUNCIONES DE EXPORTACIÓN (SIN DEPENDENCIAS EXTERNAS)
// ═══════════════════════════════════════════════════════════

// ★ Exportar a CSV (compatible con Excel)
const exportToCSV = (compras, totales, periodo, nombreArchivo) => {
  const headers = ['F.EMISION', 'F.VENC.', 'TIPO', 'SERIE', 'AÑO', 'NRO',
    'TIPO IDEN.', 'RUC', 'PROVEEDOR', 'BASE IMP.', 'IGV',
    'VALOR ADQ.', 'IMP.TOTAL', 'CAMBIO'];

  let csv = 'LISTADO GENERAL DE COMPRAS - ' + periodo + '\n\n';
  csv += headers.join(',') + '\n';

  compras.forEach((c) => {
    csv += [
      c.fEmision, c.fVenc, c.tipo, c.serie, c.anio, c.nro,
      c.tipoIden, c.ruc, '"' + c.proveedor + '"',
      c.baseImp.toFixed(2), c.igv.toFixed(2), c.valorAdq.toFixed(2),
      c.impTotal.toFixed(2), c.cambio.toFixed(2)
    ].join(',') + '\n';
  });

  csv += ['', '', '', '', '', '', '', '', 'TOTALES:',
    totales.baseImp.toFixed(2), totales.igv.toFixed(2),
    totales.valorAdq.toFixed(2), totales.impTotal.toFixed(2), ''
  ].join(',') + '\n';

  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = nombreArchivo;
  link.click();
  URL.revokeObjectURL(link.href);
};

// ★ Exportar a HTML/Excel real (.xls)
const exportToExcel = (compras, totales, periodo, nombreArchivo) => {
  const formatNum = (num) => num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">';
  html += '<head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>';
  html += '<x:ExcelWorksheet><x:Name>Compras</x:Name><x:WorksheetOptions><x:DisplayGridlines/>';
  html += '</x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>';
  html += '<body><table border="1" cellpadding="5" cellspacing="0" style="border-collapse:collapse;">';

  // Título
  html += '<tr><td colspan="14" style="text-align:center;font-size:16px;font-weight:bold;background:#2c7a8e;color:#fff;padding:10px;">';
  html += 'LISTADO GENERAL DE COMPRAS - ' + periodo + '</td></tr>';
  html += '<tr><td colspan="14"></td></tr>';

  // Headers
  html += '<tr>';
  ['F.EMISION', 'F.VENC.', 'TIPO', 'SERIE', 'AÑO', 'NRO', 'TIPO IDEN.', 'RUC',
    'PROVEEDOR', 'BASE IMP.', 'IGV', 'VALOR ADQ.', 'IMP.TOTAL', 'CAMBIO'].forEach((h) => {
      html += '<td style="background:#2c7a8e;color:#fff;font-weight:bold;text-align:center;padding:8px;font-size:11px;">' + h + '</td>';
    });
  html += '</tr>';

  // Datos
  compras.forEach((c, i) => {
    const bg = i % 2 === 0 ? '#fff' : '#f5f5f5';
    html += '<tr>';
    html += '<td style="background:' + bg + ';text-align:center;">' + c.fEmision + '</td>';
    html += '<td style="background:' + bg + ';text-align:center;">' + c.fVenc + '</td>';
    html += '<td style="background:' + bg + ';text-align:center;">' + c.tipo + '</td>';
    html += '<td style="background:' + bg + ';text-align:center;">' + c.serie + '</td>';
    html += '<td style="background:' + bg + ';text-align:center;">' + c.anio + '</td>';
    html += '<td style="background:' + bg + ';text-align:center;">' + c.nro + '</td>';
    html += '<td style="background:' + bg + ';text-align:center;">' + c.tipoIden + '</td>';
    html += '<td style="background:' + bg + ';text-align:center;">' + c.ruc + '</td>';
    html += '<td style="background:' + bg + ';">' + c.proveedor + '</td>';
    html += '<td style="background:' + bg + ';text-align:right;">' + formatNum(c.baseImp) + '</td>';
    html += '<td style="background:' + bg + ';text-align:right;">' + formatNum(c.igv) + '</td>';
    html += '<td style="background:' + bg + ';text-align:right;">' + formatNum(c.valorAdq) + '</td>';
    html += '<td style="background:' + bg + ';text-align:right;">' + formatNum(c.impTotal) + '</td>';
    html += '<td style="background:' + bg + ';text-align:right;">' + formatNum(c.cambio) + '</td>';
    html += '</tr>';
  });

  // Totales
  html += '<tr>';
  html += '<td colspan="9" style="text-align:right;font-weight:bold;background:#e8f4f8;border-top:2px solid #2c7a8e;">TOTALES:</td>';
  html += '<td style="text-align:right;font-weight:bold;background:#e8f4f8;border-top:2px solid #2c7a8e;">' + formatNum(totales.baseImp) + '</td>';
  html += '<td style="text-align:right;font-weight:bold;background:#e8f4f8;border-top:2px solid #2c7a8e;">' + formatNum(totales.igv) + '</td>';
  html += '<td style="text-align:right;font-weight:bold;background:#e8f4f8;border-top:2px solid #2c7a8e;">' + formatNum(totales.valorAdq) + '</td>';
  html += '<td style="text-align:right;font-weight:bold;background:#e8f4f8;border-top:2px solid #2c7a8e;">' + formatNum(totales.impTotal) + '</td>';
  html += '<td style="background:#e8f4f8;border-top:2px solid #2c7a8e;"></td>';
  html += '</tr>';

  // Info
  html += '<tr><td colspan="14"></td></tr>';
  html += '<tr><td colspan="14" style="font-size:10px;color:#888;">Generado: ' + new Date().toLocaleString('es-PE') + ' | Registros: ' + compras.length + '</td></tr>';

  html += '</table></body></html>';

  const blob = new Blob(['\ufeff' + html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = nombreArchivo;
  link.click();
  URL.revokeObjectURL(link.href);
};

// ★ Imprimir tabla completa
const printTable = (compras, totales, periodo, formatNumber) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor permite las ventanas emergentes para imprimir');
    return;
  }

  let htmlContent = '<!DOCTYPE html><html><head><title>Reporte de Compra - ' + periodo + '</title>';
  htmlContent += '<style>';
  htmlContent += 'body{font-family:Segoe UI,Arial,sans-serif;padding:20px;color:#333;}';
  htmlContent += 'h2{text-align:center;margin-bottom:5px;}';
  htmlContent += 'h4{text-align:center;color:#666;margin-top:0;}';
  htmlContent += 'table{width:100%;border-collapse:collapse;font-size:11px;margin-top:15px;}';
  htmlContent += 'th{background-color:#2c7a8e;color:#fff;padding:8px 5px;text-align:center;border:1px solid #2c7a8e;font-size:10px;}';
  htmlContent += 'td{padding:6px 5px;text-align:center;border:1px solid #ddd;}';
  htmlContent += '.numero{text-align:right;font-family:Consolas,monospace;}';
  htmlContent += '.total-row td{font-weight:bold;border-top:2px solid #2c7a8e;background-color:#e8f4f8;}';
  htmlContent += '.footer{margin-top:20px;font-size:11px;color:#888;text-align:center;}';
  htmlContent += '@media print{body{padding:0;}}';
  htmlContent += '</style></head><body>';
  htmlContent += '<h2>LISTADO GENERAL DE COMPRAS</h2>';
  htmlContent += '<h4>Periodo: ' + periodo + '</h4>';
  htmlContent += '<table><thead><tr>';

  var headers = ['F.EMISION', 'F.VENC.', 'TIPO', 'SERIE', 'AÑO', 'NRO',
    'TIPO IDEN.', 'RUC', 'PROVEEDOR', 'BASE IMP.', 'IGV',
    'VALOR ADQ.', 'IMP.TOTAL', 'CAMBIO'];

  headers.forEach(function (h) {
    htmlContent += '<th>' + h + '</th>';
  });
  htmlContent += '</tr></thead><tbody>';

  compras.forEach(function (c) {
    htmlContent += '<tr>';
    htmlContent += '<td>' + c.fEmision + '</td>';
    htmlContent += '<td>' + c.fVenc + '</td>';
    htmlContent += '<td>' + c.tipo + '</td>';
    htmlContent += '<td>' + c.serie + '</td>';
    htmlContent += '<td>' + c.anio + '</td>';
    htmlContent += '<td>' + c.nro + '</td>';
    htmlContent += '<td>' + c.tipoIden + '</td>';
    htmlContent += '<td>' + c.ruc + '</td>';
    htmlContent += '<td>' + c.proveedor + '</td>';
    htmlContent += '<td class="numero">' + formatNumber(c.baseImp) + '</td>';
    htmlContent += '<td class="numero">' + formatNumber(c.igv) + '</td>';
    htmlContent += '<td class="numero">' + formatNumber(c.valorAdq) + '</td>';
    htmlContent += '<td class="numero">' + formatNumber(c.impTotal) + '</td>';
    htmlContent += '<td class="numero">' + formatNumber(c.cambio) + '</td>';
    htmlContent += '</tr>';
  });

  htmlContent += '<tr class="total-row">';
  htmlContent += '<td colspan="9" style="text-align:right;">TOTALES:</td>';
  htmlContent += '<td class="numero">' + formatNumber(totales.baseImp) + '</td>';
  htmlContent += '<td class="numero">' + formatNumber(totales.igv) + '</td>';
  htmlContent += '<td class="numero">' + formatNumber(totales.valorAdq) + '</td>';
  htmlContent += '<td class="numero">' + formatNumber(totales.impTotal) + '</td>';
  htmlContent += '<td></td>';
  htmlContent += '</tr></tbody></table>';
  htmlContent += '<div class="footer">Generado: ' + new Date().toLocaleString('es-PE') + ' | Registros: ' + compras.length + '</div>';
  htmlContent += '</body></html>';

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(function () { printWindow.print(); }, 500);
};

// ★ Exportar PDF (HTML que se descarga como PDF)
const exportToPDF = (compras, totales, periodo, nombreArchivo, formatNumber) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor permite las ventanas emergentes');
    return;
  }

  let htmlContent = '<!DOCTYPE html><html><head><title>' + nombreArchivo + '</title>';
  htmlContent += '<style>';
  htmlContent += '@page{size:landscape;margin:10mm;}';
  htmlContent += 'body{font-family:Segoe UI,Arial,sans-serif;padding:15px;color:#333;font-size:10px;}';
  htmlContent += 'h2{text-align:center;margin-bottom:5px;font-size:16px;}';
  htmlContent += 'h4{text-align:center;color:#666;margin-top:0;font-size:12px;}';
  htmlContent += 'table{width:100%;border-collapse:collapse;font-size:10px;margin-top:10px;}';
  htmlContent += 'th{background-color:#2c7a8e;color:#fff;padding:6px 4px;text-align:center;border:1px solid #2c7a8e;font-size:9px;}';
  htmlContent += 'td{padding:5px 4px;text-align:center;border:1px solid #ddd;}';
  htmlContent += '.numero{text-align:right;font-family:Consolas,monospace;}';
  htmlContent += '.total-row td{font-weight:bold;border-top:2px solid #2c7a8e;background-color:#e8f4f8;}';
  htmlContent += '.footer{margin-top:15px;font-size:9px;color:#888;text-align:center;}';
  htmlContent += '.info{text-align:center;margin-top:10px;font-size:11px;color:#555;}';
  htmlContent += '</style></head><body>';
  htmlContent += '<h2>LISTADO GENERAL DE COMPRAS</h2>';
  htmlContent += '<h4>Periodo: ' + periodo + '</h4>';
  htmlContent += '<table><thead><tr>';

  var headers = ['F.EMISION', 'F.VENC.', 'TIPO', 'SERIE', 'AÑO', 'NRO',
    'TIPO IDEN.', 'RUC', 'PROVEEDOR', 'BASE IMP.', 'IGV',
    'VALOR ADQ.', 'IMP.TOTAL', 'CAMBIO'];

  headers.forEach(function (h) {
    htmlContent += '<th>' + h + '</th>';
  });
  htmlContent += '</tr></thead><tbody>';

  compras.forEach(function (c) {
    htmlContent += '<tr>';
    htmlContent += '<td>' + c.fEmision + '</td>';
    htmlContent += '<td>' + c.fVenc + '</td>';
    htmlContent += '<td>' + c.tipo + '</td>';
    htmlContent += '<td>' + c.serie + '</td>';
    htmlContent += '<td>' + c.anio + '</td>';
    htmlContent += '<td>' + c.nro + '</td>';
    htmlContent += '<td>' + c.tipoIden + '</td>';
    htmlContent += '<td>' + c.ruc + '</td>';
    htmlContent += '<td>' + c.proveedor + '</td>';
    htmlContent += '<td class="numero">' + formatNumber(c.baseImp) + '</td>';
    htmlContent += '<td class="numero">' + formatNumber(c.igv) + '</td>';
    htmlContent += '<td class="numero">' + formatNumber(c.valorAdq) + '</td>';
    htmlContent += '<td class="numero">' + formatNumber(c.impTotal) + '</td>';
    htmlContent += '<td class="numero">' + formatNumber(c.cambio) + '</td>';
    htmlContent += '</tr>';
  });

  htmlContent += '<tr class="total-row">';
  htmlContent += '<td colspan="9" style="text-align:right;">TOTALES:</td>';
  htmlContent += '<td class="numero">' + formatNumber(totales.baseImp) + '</td>';
  htmlContent += '<td class="numero">' + formatNumber(totales.igv) + '</td>';
  htmlContent += '<td class="numero">' + formatNumber(totales.valorAdq) + '</td>';
  htmlContent += '<td class="numero">' + formatNumber(totales.impTotal) + '</td>';
  htmlContent += '<td></td>';
  htmlContent += '</tr></tbody></table>';
  htmlContent += '<div class="footer">Generado: ' + new Date().toLocaleString('es-PE') + ' | Registros: ' + compras.length + '</div>';
  htmlContent += '<div class="info">Use Ctrl+P para guardar como PDF (seleccione "Guardar como PDF" en destino)</div>';
  htmlContent += '</body></html>';

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.focus();
};

// ═══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL - COMPRA
// ═══════════════════════════════════════════════════════════
const Compra = () => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buscado, setBuscado] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const datosEjemplo = {
    '2026-02': [
      {
        fEmision: '26/02/2026', fVenc: '26/02/2026', tipo: '03', serie: '03',
        anio: '2026', nro: '4444', tipoIden: '', ruc: '20123053037',
        proveedor: 'Compudiskett S R L', baseImp: 2118.64, igv: 381.36,
        valorAdq: 2500.00, impTotal: 2500.00, cambio: 3.83,
      },
      {
        fEmision: '28/02/2026', fVenc: '28/02/2026', tipo: '03', serie: 'ero',
        anio: '2026', nro: '234234232', tipoIden: '', ruc: '20123053037',
        proveedor: 'Compudiskett S R L', baseImp: 593.22, igv: 106.78,
        valorAdq: 700.00, impTotal: 700.00, cambio: 3.83,
      },
      {
        fEmision: '28/02/2026', fVenc: '28/02/2026', tipo: '03', serie: 'er',
        anio: '2026', nro: '3425', tipoIden: '', ruc: '20123053037',
        proveedor: 'Compudiskett S R L', baseImp: 423.73, igv: 76.27,
        valorAdq: 500.00, impTotal: 500.00, cambio: 3.83,
      },
      {
        fEmision: '28/02/2026', fVenc: '28/02/2026', tipo: '03', serie: 'awe',
        anio: '2026', nro: '1234325123', tipoIden: '', ruc: '20123053037',
        proveedor: 'Compudiskett S R L', baseImp: 847.46, igv: 152.54,
        valorAdq: 1000.00, impTotal: 1000.00, cambio: 3.83,
      },
    ],
    '2026-03': [],
  };

  const mesesNombre = [
    '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];

  const getPeriodoTexto = () => {
    if (!fechaSeleccionada) return '';
    const [anio, mes] = fechaSeleccionada.split('-');
    return mesesNombre[parseInt(mes)] + ' ' + anio;
  };

  const handleBuscar = () => {
    if (!fechaSeleccionada) {
      alert('Por favor seleccione una fecha');
      return;
    }
    setLoading(true);
    setBuscado(true);
    setTimeout(() => {
      var resultados = datosEjemplo[fechaSeleccionada] || [];
      setCompras(resultados);
      setLoading(false);
    }, 500);
  };

  const formatNumber = (num) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const calcularTotales = () => {
    return compras.reduce(
      (acc, c) => ({
        baseImp: acc.baseImp + c.baseImp,
        igv: acc.igv + c.igv,
        valorAdq: acc.valorAdq + c.valorAdq,
        impTotal: acc.impTotal + c.impTotal,
      }),
      { baseImp: 0, igv: 0, valorAdq: 0, impTotal: 0 }
    );
  };

  const headersTabla = [
    'F.EMISION', 'F.VENC.', 'TIPO', 'SERIE', 'AÑO', 'NRO',
    'TIPO IDEN.', 'RUC', 'PROVEEDOR', 'BASE IMP.',
    'IGV', 'VALOR ADQ.', 'IMP.TOTAL', 'CAMBIO',
  ];

  // ─── Handlers de exportación ───────────────────────────
  const handlePrint = () => {
    if (compras.length === 0) { alert('No hay datos para imprimir'); return; }
    printTable(compras, calcularTotales(), getPeriodoTexto(), formatNumber);
  };

  const handleExportExcel = () => {
    if (compras.length === 0) { alert('No hay datos para exportar'); return; }
    var partes = fechaSeleccionada.split('-');
    exportToExcel(compras, calcularTotales(), getPeriodoTexto(), 'Reporte_Compras_' + partes[1] + '_' + partes[0] + '.xls');
  };

  const handleExportPDF = () => {
    if (compras.length === 0) { alert('No hay datos para exportar'); return; }
    var partes = fechaSeleccionada.split('-');
    exportToPDF(compras, calcularTotales(), getPeriodoTexto(), 'Reporte_Compras_' + partes[1] + '_' + partes[0] + '.pdf', formatNumber);
  };

  const handleExportCalcun = () => {
    if (compras.length === 0) { alert('No hay datos para exportar'); return; }
    var partes = fechaSeleccionada.split('-');
    var totales = calcularTotales();
    var periodo = getPeriodoTexto();

    var csv = 'REGISTRO DE COMPRAS - CALCUN - ' + periodo + '\n\n';
    csv += 'PERIODO,CUO,F.EMISION,F.VENC.,TIPO,SERIE,NRO,TIPO DOC.,RUC,RAZON SOCIAL,BASE IMP.,IGV,VALOR ADQ.,IMP.TOTAL,T.CAMBIO\n';

    compras.forEach(function (c, index) {
      csv += [
        partes[1] + '/' + partes[0],
        'M' + String(index + 1).padStart(4, '0'),
        c.fEmision, c.fVenc, c.tipo, c.serie, c.nro,
        c.tipoIden || '6', c.ruc, '"' + c.proveedor + '"',
        c.baseImp.toFixed(2), c.igv.toFixed(2), c.valorAdq.toFixed(2),
        c.impTotal.toFixed(2), c.cambio.toFixed(2)
      ].join(',') + '\n';
    });

    csv += ['', '', '', '', '', '', '', '', '', 'TOTALES:',
      totales.baseImp.toFixed(2), totales.igv.toFixed(2),
      totales.valorAdq.toFixed(2), totales.impTotal.toFixed(2), ''
    ].join(',') + '\n';

    var blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'CALCUN_Compras_' + partes[1] + '_' + partes[0] + '.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  var totales = calcularTotales();

  return (
    <div style={styles.wrapper}>

      <div style={styles.titulo}>
        <span style={styles.iconoAyuda}>❓</span>
        <h2 style={styles.tituloH2}>REPORTE DE COMPRA</h2>
      </div>

      <div style={styles.filtros}>
        <label style={styles.label}>Seleccione Fecha</label>
        <CalendarioPersonalizado
          value={fechaSeleccionada}
          onChange={setFechaSeleccionada}
        />
        <button
          style={{
            ...styles.btnBuscar,
            ...(hoveredBtn === 'buscar' ? { backgroundColor: '#138496' } : {}),
          }}
          onClick={handleBuscar}
          onMouseEnter={() => setHoveredBtn('buscar')}
          onMouseLeave={() => setHoveredBtn(null)}
        >
          🔍 Buscar
        </button>
      </div>

      <div style={styles.tablaTitulo}>
        <h3 style={styles.tablaTituloH3}>LISTADO GENERAL DE COMPRAS</h3>
        {buscado && fechaSeleccionada && (
          <p style={{ fontSize: '13px', color: '#666', margin: '5px 0 0 0' }}>
            Periodo: {getPeriodoTexto()} | Registros: {compras.length}
          </p>
        )}
      </div>

      <div style={styles.tablaContainer}>
        <table style={styles.tabla}>
          <thead>
            <tr>
              {headersTabla.map((header) => (
                <th key={header} style={styles.th}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="14" style={styles.loading}>Cargando...</td>
              </tr>
            ) : compras.length > 0 ? (
              <>
                {compras.map((compra, index) => (
                  <tr
                    key={index}
                    style={{ backgroundColor: hoveredRow === index ? '#e8f4f8' : 'transparent' }}
                    onMouseEnter={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td style={styles.td}>{compra.fEmision}</td>
                    <td style={styles.td}>{compra.fVenc}</td>
                    <td style={styles.td}>{compra.tipo}</td>
                    <td style={styles.td}>{compra.serie}</td>
                    <td style={styles.td}>{compra.anio}</td>
                    <td style={styles.td}>{compra.nro}</td>
                    <td style={styles.td}>{compra.tipoIden}</td>
                    <td style={styles.td}>{compra.ruc}</td>
                    <td style={styles.td}>{compra.proveedor}</td>
                    <td style={styles.tdNumero}>{formatNumber(compra.baseImp)}</td>
                    <td style={styles.tdNumero}>{formatNumber(compra.igv)}</td>
                    <td style={styles.tdNumero}>{formatNumber(compra.valorAdq)}</td>
                    <td style={styles.tdNumero}>{formatNumber(compra.impTotal)}</td>
                    <td style={styles.tdNumero}>{formatNumber(compra.cambio)}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="9" style={styles.tdTotalLabel}>TOTALES:</td>
                  <td style={styles.tdTotal}>{formatNumber(totales.baseImp)}</td>
                  <td style={styles.tdTotal}>{formatNumber(totales.igv)}</td>
                  <td style={styles.tdTotal}>{formatNumber(totales.valorAdq)}</td>
                  <td style={styles.tdTotal}>{formatNumber(totales.impTotal)}</td>
                  <td style={styles.tdTotal}></td>
                </tr>
              </>
            ) : buscado ? (
              <tr>
                <td colSpan="14" style={styles.sinDatos}>
                  No se encontraron registros para la fecha seleccionada
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan="14" style={styles.sinDatos}>
                  Seleccione una fecha y presione Buscar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={styles.acciones}>
        <div style={styles.accionesDer}>
          <div style={styles.exportarGrupo}>
            <button style={{ ...styles.btnAccion, ...styles.btnPrint }}
              onClick={handlePrint} title="Imprimir">🖨️</button>
            <button style={{ ...styles.btnAccion, ...styles.btnExcel }}
              onClick={handleExportExcel} title="Exportar Excel">
              <span style={styles.iconoExcel}>X</span></button>
            <button style={{ ...styles.btnAccion, ...styles.btnPdf }}
              onClick={handleExportPDF} title="Exportar PDF">
              <span style={styles.iconoPdf}>PDF</span></button>
          </div>
          <div style={styles.exportarCalcun}>
            <span>Exportar CALCUN:</span>
            <button style={{ ...styles.btnAccion, ...styles.btnExcel }}
              onClick={handleExportCalcun} title="Exportar CALCUN">
              <span style={styles.iconoExcel}>X</span></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compra;