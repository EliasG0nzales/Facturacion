import React, { useState, useRef, useEffect } from 'react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .content {
    background-color: #ffffff;
    padding: 20px;
    color: #212529;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 13px;
  }

  .t7 {
    font-size: 18px;
    font-weight: bold;
    border-bottom: 2px solid #00A3E1;
    padding-bottom: 5px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #333;
    margin-bottom: 20px;
  }

  .icon-help::before { content: "❓"; font-size: 16px; }
  .icon-disk::before { content: "💾"; font-size: 13px; }

  #idimput {
    list-style: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: center;
    gap: 10px;
  }

  #idimput li { margin: 5px; }

  #idimput b {
    display: block;
    margin-bottom: 4px;
    color: #212529;
    font-size: 13px;
  }

  input[type="text"] {
    padding: 6px 8px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 13px;
    background-color: #ffffff;
    color: #212529;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    width: 100px;
  }

  input[type="text"]:focus {
    background-color: #ffffff !important;
    color: #212529 !important;
    border-color: #80bdff !important;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25) !important;
    outline: none !important;
  }

  .botonNuevo {
    background-color: #17a2b8;
    border: 1px solid #17a2b8;
    color: #ffffff;
    padding: 6px 16px;
    cursor: pointer;
    font-size: 13px;
    font-weight: bold;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: background-color 0.2s;
    margin-top: 4px;
  }

  .botonNuevo:hover { background-color: #138496; border-color: #117a8b; }

  .botonLink {
    background-color: #17a2b8;
    color: #ffffff !important;
    text-decoration: none !important;
    cursor: pointer;
    font-weight: bold;
    display: inline-block;
    margin: 15px 0;
    padding: 8px 24px;
    border-radius: 4px;
    font-size: 13px;
    transition: background-color 0.2s;
    border: none;
  }

  .botonLink:hover { background-color: #138496; }

  select {
    padding: 5px 10px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 13px;
    background-color: #ffffff;
    color: #212529;
    cursor: pointer;
  }

  select:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }

  .headTitle { background-color: #17a2b8; color: #ffffff; }

  .headTitle td {
    color: #ffffff !important;
    font-weight: bold;
    padding: 10px 8px;
  }

  table { width: 100%; border-collapse: collapse; margin-top: 10px; }

  table tbody tr { background-color: #ffffff; color: #212529; }
  table tbody tr:hover { background-color: #f8f9fa; }

  table tbody td {
    padding: 8px;
    font-size: 13px;
    color: #212529;
    border-bottom: 1px solid #dee2e6;
    text-align: left;
  }

  hr { border: none; border-top: 1px solid #dee2e6; margin: 15px 0; }

  b { color: #212529; font-size: 13px; }

  .btn-icon {
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px 5px;
    font-size: 15px;
    border-radius: 3px;
    transition: background 0.15s;
  }
  .btn-icon:hover { background-color: #e0e0e0; }

  .btn-delete { color: #dc3545; }
  .btn-edit   { color: #17a2b8; }

  .alert-success {
    background-color: #d4edda;
    border: 1px solid #c3e6cb;
    color: #155724;
    padding: 8px 14px;
    border-radius: 4px;
    margin-bottom: 10px;
    font-size: 13px;
    display: inline-block;
  }

  .modal-backdrop {
    position: fixed; top:0; left:0; width:100%; height:100%;
    background: rgba(0,0,0,0.4);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000;
  }

  .modal-box {
    background: #fff;
    border-radius: 6px;
    padding: 24px 28px;
    min-width: 320px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  }

  .modal-title {
    font-size: 15px;
    font-weight: bold;
    color: #212529;
    margin-bottom: 16px;
    border-bottom: 2px solid #00A3E1;
    padding-bottom: 6px;
  }

  .modal-field { margin-bottom: 12px; }
  .modal-field label { display: block; font-weight: bold; margin-bottom: 4px; font-size: 13px; }
  .modal-field input {
    width: 100%;
    padding: 6px 8px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 13px;
  }
  .modal-field input:focus {
    border-color: #80bdff !important;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25) !important;
    outline: none !important;
    background-color: #ffffff !important;
  }

  .modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }

  .btn-cancel {
    background-color: #6c757d;
    border: 1px solid #6c757d;
    color: #fff;
    padding: 6px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    font-weight: bold;
  }
  .btn-cancel:hover { background-color: #5a6268; }

  .empty-row td { text-align: center; color: #888; padding: 16px; }

  /* ===== DATEPICKER CALENDAR ===== */
  .datepicker-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .datepicker-wrapper input[type="text"] {
    width: 110px;
    background-color: #d4edda;
    border-color: #28a745;
    color: #212529;
  }

  .datepicker-wrapper input[type="text"]:focus {
    background-color: #d4edda !important;
    border-color: #28a745 !important;
    box-shadow: 0 0 0 0.2rem rgba(40,167,69,0.25) !important;
  }

  .btn-calendar {
    background-color: #17a2b8;
    border: 1px solid #17a2b8;
    color: #fff;
    border-radius: 4px;
    padding: 5px 8px;
    cursor: pointer;
    font-size: 15px;
    line-height: 1;
    display: inline-flex;
    align-items: center;
  }

  .btn-calendar:hover { background-color: #138496; }

  .calendar-popup {
    position: absolute;
    top: 110%;
    left: 0;
    z-index: 999;
    background: #fff;
    border: 1px solid #ced4da;
    border-radius: 6px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    padding: 10px;
    min-width: 240px;
    user-select: none;
  }

  .cal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    gap: 4px;
  }

  .cal-header select {
    padding: 2px 4px;
    font-size: 12px;
    border: 1px solid #ced4da;
    border-radius: 3px;
    background: #fff;
    color: #212529;
    cursor: pointer;
  }

  .cal-nav {
    background: #17a2b8;
    border: none;
    color: #fff;
    border-radius: 3px;
    width: 22px;
    height: 22px;
    cursor: pointer;
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .cal-nav:hover { background: #138496; }

  .cal-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
  }

  .cal-day-name {
    text-align: center;
    font-weight: bold;
    font-size: 11px;
    color: #555;
    padding: 3px 0;
  }

  .cal-day {
    text-align: center;
    padding: 5px 2px;
    font-size: 12px;
    border-radius: 3px;
    cursor: pointer;
    color: #212529;
    transition: background 0.15s;
  }

  .cal-day:hover { background-color: #e0f5f8; }

  .cal-day.today {
    background-color: #fff3cd;
    font-weight: bold;
  }

  .cal-day.selected {
    background-color: #17a2b8;
    color: #fff;
    font-weight: bold;
  }

  .cal-day.empty { cursor: default; }
`;


const MESES_SHORT = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Set','Oct','Nov','Dic'];
const DIAS_NAMES = ['Lu','Ma','Mi','Ju','Vi','Sá','Do'];

const DatePicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const parseDate = (str) => {
    const [y, m, d] = (str || '').split('-').map(Number);
    if (y && m && d) return new Date(y, m - 1, d);
    return new Date();
  };

  const selected = parseDate(value);
  const [viewYear, setViewYear] = useState(selected.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected.getMonth());

  const todayDate = new Date();

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => {
    let d = new Date(y, m, 1).getDay();
    return d === 0 ? 6 : d - 1; // Monday = 0
  };

  const handleSelectDay = (day) => {
    const mm = String(viewMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    onChange(`${viewYear}-${mm}-${dd}`);
    setOpen(false);
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const years = Array.from({ length: 10 }, (_, i) => todayDate.getFullYear() - 3 + i);
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const isSelected = (day) => {
    if (!day) return false;
    return selected.getFullYear() === viewYear && selected.getMonth() === viewMonth && selected.getDate() === day;
  };

  const isToday = (day) => {
    if (!day) return false;
    return todayDate.getFullYear() === viewYear && todayDate.getMonth() === viewMonth && todayDate.getDate() === day;
  };

  return (
    <div className="datepicker-wrapper" ref={ref}>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: 110 }}
        readOnly
      />
      <button type="button" className="btn-calendar" onClick={() => { setOpen(o => !o); setViewYear(selected.getFullYear()); setViewMonth(selected.getMonth()); }}>
        📅
      </button>
      {open && (
        <div className="calendar-popup">
          <div className="cal-header">
            <button type="button" className="cal-nav" onClick={prevMonth}>◀</button>
            <select value={viewMonth} onChange={e => setViewMonth(Number(e.target.value))}>
              {MESES_SHORT.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
            <select value={viewYear} onChange={e => setViewYear(Number(e.target.value))}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <button type="button" className="cal-nav" onClick={nextMonth}>▶</button>
          </div>
          <div className="cal-grid">
            {DIAS_NAMES.map(d => <div key={d} className="cal-day-name">{d}</div>)}
            {cells.map((day, i) => (
              <div
                key={i}
                className={`cal-day ${!day ? 'empty' : ''} ${isToday(day) ? 'today' : ''} ${isSelected(day) ? 'selected' : ''}`}
                onClick={() => day && handleSelectDay(day)}
              >
                {day || ''}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


const MESES = [
  { v: '01', l: 'Enero' }, { v: '02', l: 'Febrero' }, { v: '03', l: 'Marzo' },
  { v: '04', l: 'Abril' }, { v: '05', l: 'Mayo' }, { v: '06', l: 'Junio' },
  { v: '07', l: 'Julio' }, { v: '08', l: 'Agosto' }, { v: '09', l: 'Setiembre' },
  { v: '10', l: 'Octubre' }, { v: '11', l: 'Noviembre' }, { v: '12', l: 'Diciembre' },
];

const today = () => new Date().toISOString().slice(0, 10);

const Dashboard = () => {
  const [showSunat, setShowSunat] = useState(false);
  const [venta, setVenta] = useState('3.830');
  const [compra, setCompra] = useState('3.830');
  const [successMsg, setSuccessMsg] = useState('');

  // Tipo de cambio contable form
  const [tcCompra, setTcCompra] = useState('');
  const [tcVenta, setTcVenta] = useState('');
  const [tcFecha, setTcFecha] = useState(today());

  // Listado
  const [mesFiltro, setMesFiltro] = useState('03');
  const [registros, setRegistros] = useState([
    { id: 1, fecha: '2026-03-04', compra: '3.825', venta: '3.835' }
  ]);

  // Modal edición
  const [modal, setModal] = useState(null); // null | { id, fecha, compra, venta }

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const handleActualizarGeneral = (e) => {
    e.preventDefault();
    showSuccess('Tipo de cambio general actualizado correctamente.');
  };

  const handleActualizarContable = (e) => {
    e.preventDefault();
    if (!tcCompra || !tcVenta || !tcFecha) return;
    const nuevo = {
      id: Date.now(),
      fecha: tcFecha,
      compra: tcCompra,
      venta: tcVenta,
    };
    setRegistros(prev => [nuevo, ...prev]);
    setTcCompra('');
    setTcVenta('');
    setTcFecha(today());
    showSuccess('Registro contable agregado correctamente.');
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar este registro?')) {
      setRegistros(prev => prev.filter(r => r.id !== id));
      showSuccess('Registro eliminado.');
    }
  };

  const handleEdit = (r) => setModal({ ...r });

  const handleSaveEdit = () => {
    setRegistros(prev => prev.map(r => r.id === modal.id ? { ...modal } : r));
    setModal(null);
    showSuccess('Registro actualizado correctamente.');
  };

  const registrosFiltrados = registros.filter(r => r.fecha.slice(5, 7) === mesFiltro);

  const formatFecha = (f) => {
    const [y, m, d] = f.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <>
      <style>{styles}</style>
      <main className="content" role="main">

        {/* TÍTULO */}
        <div className="t7">
          <span className="icon-help"></span>
          <img src="https://flagcdn.com/w20/pe.png" alt="Peru Flag" />
          TIPO DE CAMBIO
        </div>

        {successMsg && <div className="alert-success">✅ {successMsg}</div>}

        <center>

          {/* FORM 1: TIPO DE CAMBIO GENERAL */}
          <form onSubmit={handleActualizarGeneral}>
            <ol id="idimput" className="texto">
              <li className="three">&nbsp;</li>
              <li>
                <b>Venta :</b>
                <input type="text" value={venta} onChange={e => setVenta(e.target.value)} />
              </li>
              <li>
                <b>Compra :</b>
                <input type="text" value={compra} onChange={e => setCompra(e.target.value)} />
              </li>
              <li>
                <br />
                <button type="submit" className="botonNuevo">
                  <span className="icon-disk"></span> Actualizar
                </button>
              </li>
            </ol>
            <div style={{ clear: 'both' }}></div>
            <hr />

            {/* CONSULTA SUNAT */}
            <button type="button" className="botonLink" onClick={() => setShowSunat(!showSunat)}>
              Consultar tipo de cambio en la sunat
            </button>

            {showSunat && (
              <div style={{
                width: '100%',
                marginTop: 10,
                marginBottom: 10,
                border: '1px solid #ced4da',
                borderRadius: 6,
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}>
                {/* Barra superior */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '6px 14px',
                  background: '#17a2b8',
                }}>
                  <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>
                    🌐 SUNAT — Tipo de Cambio Oficial
                  </span>
                  <span
                    onClick={() => setShowSunat(false)}
                    style={{
                      color: '#fff', cursor: 'pointer',
                      fontWeight: 'bold', fontSize: 13,
                      background: '#dc3545', padding: '2px 10px',
                      borderRadius: 4,
                    }}
                  >
                    ✕ Cerrar
                  </span>
                </div>

                {/* iframe expandido */}
                <iframe
                  src="https://e-consulta.sunat.gob.pe/cl-at-ittipcam/tcS01Alias"
                  width="100%"
                  height="500px"
                  title="SUNAT Tipo de Cambio"
                  frameBorder="0"
                  style={{ display: 'block' }}
                ></iframe>
              </div>
            )}
          </form>

          <hr />

          {/* FORM 2: TIPO DE CAMBIO CONTABLE */}
          <form onSubmit={handleActualizarContable}>
            <b> TIPO DE CAMBIO CONTABLE </b><br /><br />
            <ol id="idimput" className="texto">
              <li>
                <b>Compra :</b>
                <input
                  type="text" value={tcCompra}
                  onChange={e => setTcCompra(e.target.value)}
                  placeholder="0.000"
                />
              </li>
              <li>
                <b>Venta :</b>
                <input
                  type="text" value={tcVenta}
                  onChange={e => setTcVenta(e.target.value)}
                  placeholder="0.000"
                />
              </li>
              <li>
                <b>Fecha :</b>
                <DatePicker value={tcFecha} onChange={setTcFecha} />
              </li>
              <li>
                <br />
                <button type="submit" className="botonNuevo">
                  <span className="icon-disk"></span> Agregar
                </button>
              </li>
            </ol>
          </form>

          <div style={{ clear: 'both' }}></div>

          {/* LISTADO GENERAL */}
          <b>LISTADO GENERAL </b>
          <div style={{ marginTop: 6, marginBottom: 6 }}>
            <select value={mesFiltro} onChange={e => setMesFiltro(e.target.value)}>
              {MESES.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
            </select>
          </div>

          <table border="0" className="texto" cellPadding="1" cellSpacing="0">
            <thead>
              <tr height="40px" className="headTitle">
                <td width="23%" align="center"><b>Fecha</b></td>
                <td width="30%"><b>Compra</b></td>
                <td width="30%"><b>Venta</b></td>
                <td width="17%" align="center"><b>Opc.</b></td>
              </tr>
            </thead>
            <tbody>
              {registrosFiltrados.length === 0 ? (
                <tr className="empty-row">
                  <td colSpan="4">No hay registros para este mes.</td>
                </tr>
              ) : (
                registrosFiltrados.map(r => (
                  <tr key={r.id} height="35px">
                    <td align="center">{formatFecha(r.fecha)}</td>
                    <td>{r.compra}</td>
                    <td>{r.venta}</td>
                    <td align="center">
                      <button className="btn-icon btn-edit" title="Editar" onClick={() => handleEdit(r)}>✏️</button>
                      <button className="btn-icon btn-delete" title="Eliminar" onClick={() => handleDelete(r.id)}>🗑️</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

        </center>

        {/* MODAL EDICIÓN */}
        {modal && (
          <div className="modal-backdrop" onClick={() => setModal(null)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <div className="modal-title">✏️ Editar Registro</div>
              <div className="modal-field">
                <label>Fecha:</label>
                <DatePicker value={modal.fecha} onChange={v => setModal({ ...modal, fecha: v })} />
              </div>
              <div className="modal-field">
                <label>Compra:</label>
                <input type="text" value={modal.compra} onChange={e => setModal({ ...modal, compra: e.target.value })} />
              </div>
              <div className="modal-field">
                <label>Venta:</label>
                <input type="text" value={modal.venta} onChange={e => setModal({ ...modal, venta: e.target.value })} />
              </div>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setModal(null)}>Cancelar</button>
                <button className="botonNuevo" onClick={handleSaveEdit}>
                  <span className="icon-disk"></span> Guardar
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </>
  );
};

export default Dashboard;