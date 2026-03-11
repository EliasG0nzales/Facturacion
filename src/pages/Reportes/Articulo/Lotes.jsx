import React, { useMemo, useState } from 'react';

const styles = `
  .lt-page { padding:20px; font-family:Arial,Helvetica,sans-serif; font-size:13px; }
  .lt-page * { box-sizing:border-box; color:#212529; }
  .lt-title { margin-bottom:8px; font-size:14px; }
  .lt-title a { color:#007bff; text-decoration:none; }
  .lt-title a:hover { text-decoration:underline; }
  .lt-filtros { margin:8px 0 14px 0; }
  .lt-filtros ol {
    list-style:none; padding:0; margin:0;
    display:flex; gap:12px; flex-wrap:wrap; align-items:flex-end; justify-content:center;
  }
  .lt-filtros li { display:flex; flex-direction:column; gap:5px; min-width:200px; }
  .lt-input {
    border:1px solid #ced4da; border-radius:4px; padding:6px 8px; background:#fff; font-size:13px;
  }
  .botonNuevo {
    background:#17a2b8; border:1px solid #17a2b8; color:#fff !important;
    padding:6px 14px; border-radius:4px; font-weight:bold; cursor:pointer;
  }
  .botonNuevo:hover { background:#138496; }
  .lt-list-title { margin:8px 0; text-align:center; font-size:14px; font-weight:bold; }
  .lt-table-wrap { overflow-x:auto; }
  .lt-table { width:100%; border-collapse:collapse; font-size:12px; }
  .lt-table thead tr { background:#C2D1D0; }
  .lt-table th, .lt-table td { padding:7px 6px; border-bottom:1px solid #e1e5ea; }
  .lt-table tbody tr:nth-child(even) { background:#f9f9f9; }
  .lt-opciones { margin-top:14px; font-size:13px; }
  .lt-opciones hr { margin-bottom:10px; }
`;

const fmtYmd = (d) => d.toISOString().slice(0, 10);

const parseDate = (value) => {
  const dt = new Date(`${value}T00:00:00`);
  return Number.isNaN(dt.getTime()) ? null : dt;
};

const DATA_LOTES = [];

const Lotes = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [aplicarFiltro, setAplicarFiltro] = useState(false);

  const hoy = fmtYmd(new Date());

  const rows = useMemo(() => {
    if (!aplicarFiltro) return DATA_LOTES;

    const fi = fechaInicio ? parseDate(fechaInicio) : null;
    const ff = fechaFin ? parseDate(fechaFin) : null;

    return DATA_LOTES.filter((r) => {
      const fv = parseDate(r.vencimiento);
      if (!fv) return false;
      if (fi && fv < fi) return false;
      if (ff && fv > ff) return false;
      return true;
    });
  }, [aplicarFiltro, fechaInicio, fechaFin]);

  const onBuscar = () => setAplicarFiltro(true);

  return (
    <>
      <style>{styles}</style>
      <div className="lt-page notranslate" translate="no">
        <div className="lt-title">
          <b>Lotes</b> / <a href="#lotes-mas">lotes +...</a>
        </div>

        <center>
          <div className="lt-filtros">
            <ol>
              <li>
                Fecha Inicio
                <input
                  type="date"
                  className="lt-input"
                  value={fechaInicio}
                  max={hoy}
                  onChange={(e) => {
                    setFechaInicio(e.target.value);
                    setAplicarFiltro(false);
                  }}
                />
              </li>
              <li>
                Fecha Fin
                <input
                  type="date"
                  className="lt-input"
                  value={fechaFin}
                  max={hoy}
                  onChange={(e) => {
                    setFechaFin(e.target.value);
                    setAplicarFiltro(false);
                  }}
                />
              </li>
              <li style={{ minWidth: 'auto' }}>
                <button type="button" className="botonNuevo" onClick={onBuscar}>
                  Buscar
                </button>
              </li>
            </ol>
          </div>
        </center>

        <div className="lt-list-title">LISTADO GENERAL</div>
        <div className="lt-table-wrap">
          <table className="lt-table" id="tabla-lotes">
            <thead>
              <tr>
                <th>Codigo</th>
                <th>Detalle</th>
                <th>Stock</th>
                <th>Lote</th>
                <th>Fecha V.</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={`${r.codigo}-${r.lote}-${i}`}>
                  <td>{r.codigo}</td>
                  <td>{r.detalle}</td>
                  <td>{r.stock.toFixed(2)}</td>
                  <td>{r.lote}</td>
                  <td>{r.vencimiento}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lt-opciones">
          <hr />
          <b>Leyenda de OPCIONES :</b> Actualizar, Eliminar / Generar Kardex
        </div>
      </div>
    </>
  );
};

export default Lotes;
