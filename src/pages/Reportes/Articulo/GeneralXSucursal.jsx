import React, { useMemo, useState } from 'react';
import { STOCK_DATA } from './StockGeneral';

const styles = `
  .sx-page { padding:20px; font-family:Arial,Helvetica,sans-serif; font-size:13px; }
  .sx-page * { box-sizing:border-box; color:#212529; }
  .sx-title { font-size:18px; font-weight:bold; margin-bottom:10px; }
  .sx-filtros { margin:12px 0 18px 0; display:flex; flex-wrap:wrap; gap:12px; align-items:center; }
  .sx-filtros ol { list-style:none; padding:0; margin:0; display:flex; flex-wrap:wrap; gap:12px; align-items:center; }
  .sx-filtros li { display:flex; align-items:center; gap:6px; }
  .sx-select, .sx-input {
    padding:5px 8px;
    border:1px solid #ced4da;
    border-radius:4px;
    font-size:13px;
    background:#fff;
  }
  .sx-input { min-width:180px; }
  .botonNuevo {
    background-color:#17a2b8;
    border:1px solid #17a2b8;
    color:#fff !important;
    padding:6px 14px;
    cursor:pointer;
    font-size:13px;
    font-weight:bold;
    border-radius:4px;
    display:inline-flex;
    align-items:center;
    gap:5px;
  }
  .botonNuevo:hover { background-color:#138496; }
  .sx-tabla-wrapper { margin-top:10px; overflow-x:auto; }
  .sx-table {
    width:100%;
    border-collapse:collapse;
    font-size:12px;
  }
  .sx-table thead tr { background:#C2D1D0; }
  .sx-table thead td {
    padding:8px 6px;
    font-weight:bold;
  }
  .sx-table tbody tr { background:#ffffff; }
  .sx-table tbody tr:nth-child(even) { background:#f9f9f9; }
  .sx-table tbody td {
    padding:6px 6px;
    border-bottom:1px solid #e1e5ea;
  }
  .sx-empty {
    text-align:center;
    color:#888;
    padding:12px 6px;
  }
  .sx-stock-link {
    text-decoration:none;
    color:#007bff;
  }
  .sx-paginacion { margin-top:10px; font-size:12px; text-align:center; }
  .sx-export {
    margin-top:8px;
    text-align:right;
    font-size:22px;
  }
  .sx-export button {
    background:none;
    border:none;
    cursor:pointer;
    padding:2px 4px;
    margin-left:6px;
  }
  .sx-export button:hover {
    transform:scale(1.1);
  }
  .sx-export-label {
    font-size:10px;
    display:block;
    font-weight:bold;
  }
  .sx-page-link {
    cursor:pointer;
    color:#007bff;
    text-decoration:none;
    margin:0 2px;
  }
  .sx-page-link:hover { text-decoration:underline; }
  .sx-page-link.disabled { color:#999; cursor:default; text-decoration:none; }
  .sx-page-link.current { font-weight:bold; color:#000; cursor:default; text-decoration:none; }
`;

const imprimirTabla = (tableId, titulo) => {
  const table = document.getElementById(tableId);
  if (!table) return;
  const win = window.open('', '_blank');
  win.document.write(`<html><head><title>${titulo}</title>
    <style>
      body{font-family:Arial,sans-serif;font-size:12px;}
      table{border-collapse:collapse;width:100%;}
      th,td{border:1px solid #ccc;padding:6px 8px;}
      th{background:#C2D1D0;}
    </style>
  </head><body><h2>${titulo}</h2>${table.outerHTML}</body></html>`);
  win.document.close();
  win.print();
};

const exportarExcel = (tableId, filename) => {
  const table = document.getElementById(tableId);
  if (!table) return;
  const html = `<html><head><meta charset="UTF-8"></head><body>${table.outerHTML}</body></html>`;
  const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${filename}.xls`;
  a.click();
  URL.revokeObjectURL(a.href);
};

const exportarWord = (tableId, titulo, filename) => {
  const table = document.getElementById(tableId);
  if (!table) return;
  const html = `<html><head><meta charset="UTF-8"></head><body><h2>${titulo}</h2>${table.outerHTML}</body></html>`;
  const blob = new Blob([html], { type: 'application/msword' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${filename}.doc`;
  a.click();
  URL.revokeObjectURL(a.href);
};

const IconPrint = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <rect x="6" y="3" width="12" height="5" rx="1" fill="none" stroke="#666" strokeWidth="1.4" />
    <rect x="4" y="8" width="16" height="8" rx="1.5" fill="none" stroke="#666" strokeWidth="1.4" />
    <rect x="7" y="13" width="10" height="6" rx="1" fill="none" stroke="#666" strokeWidth="1.4" />
    <circle cx="7.5" cy="10.5" r="0.8" fill="#666" />
  </svg>
);

const IconExcel = () => (
  <svg width="26" height="20" viewBox="0 0 26 20">
    <rect x="4" y="3" width="18" height="14" rx="2" fill="#217346" />
    <rect x="7" y="5" width="12" height="10" fill="#2E7F4F" />
    <text x="13" y="13" textAnchor="middle" fontSize="8" fill="#fff" fontFamily="Arial,Helvetica,sans-serif">
      X
    </text>
  </svg>
);

const IconWord = () => (
  <svg width="22" height="22" viewBox="0 0 24 24">
    <rect x="4" y="3" width="16" height="18" rx="2" fill="#21439C" />
    <rect x="6" y="5" width="12" height="14" fill="#3162D4" />
    <text x="12" y="15" textAnchor="middle" fontSize="9" fill="#fff" fontFamily="Arial,Helvetica,sans-serif">
      W
    </text>
  </svg>
);

const SUCURSALES = [
  { value: '', label: 'Todos' },
  { value: '3', label: 'Almacen 2B 167', campo: 'almacen' },
  { value: '1', label: 'Tienda 1b 133', campo: 'tienda1' },
  { value: '2', label: 'Tienda 1A 119', campo: 'tienda2' },
];

const GeneralXSucursal = () => {
  const [suco, setSuco] = useState('');
  const [conStock, setConStock] = useState('');
  const [tipo, setTipo] = useState('1');
  const [texto, setTexto] = useState('');
  const [pagina, setPagina] = useState(1);
  const pageSize = 50;

  const filas = useMemo(() => {
    let data = [...STOCK_DATA];

    // Determinar sucursal
    const suc = SUCURSALES.find(s => s.value === suco);
    const campo = suc?.campo;

    // Mapeo a estructura General x Sucursal: Codigo / Familia / Nombre / Stock
    let filasBase = data.map((r, idx) => {
      const stockAlm = r.almacen || 0;
      const stockT1 = r.tienda1 || 0;
      const stockT2 = r.tienda2 || 0;
      let stockSel = stockAlm + stockT1 + stockT2;

      if (campo === 'almacen') stockSel = stockAlm;
      else if (campo === 'tienda1') stockSel = stockT1;
      else if (campo === 'tienda2') stockSel = stockT2;

      return {
        codigo: r.codigo || `ART-${idx + 1}`,
        familia: r.categoria || '',
        nombre: r.nombre,
        stock: stockSel,
      };
    });

    // Filtro CON STOCK (1 = Si, 2 = No)
    if (conStock === '1') {
      filasBase = filasBase.filter(f => f.stock > 0);
    } else if (conStock === '2') {
      filasBase = filasBase.filter(f => f.stock <= 0);
    }

    // Filtro texto
    const term = texto.trim().toLowerCase();
    if (term) {
      filasBase = filasBase.filter(f => {
        if (tipo === '1') return f.nombre.toLowerCase().includes(term);       // Nombre
        if (tipo === '2') return f.familia.toLowerCase().includes(term);      // Marca/Familia
        if (tipo === '3') return f.familia.toLowerCase().includes(term);      // Categoria (usamos familia)
        if (tipo === '4') return f.codigo.toLowerCase().includes(term);       // Codigo
        return true;
      });
    }

    return filasBase;
  }, [suco, conStock, tipo, texto]);

  const totalPaginas = Math.max(1, Math.ceil(filas.length / pageSize));
  const paginaActual = Math.min(pagina, totalPaginas);
  const inicio = (paginaActual - 1) * pageSize;
  const filasPagina = filas.slice(inicio, inicio + pageSize);

  const irAPagina = (p) => {
    if (p < 1 || p > totalPaginas) return;
    setPagina(p);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="sx-page" translate="no">
        <div className="sx-title">STOCK GENERAL X SUCURSAL</div>

        <div className="sx-filtros">
          <ol>
            <li>
              <b>BUSCAR DE</b>
              <select
                className="sx-select"
                value={suco}
                onChange={e => { setSuco(e.target.value); setPagina(1); }}
              >
                {SUCURSALES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </li>

            <li>
              CON STOCK
              <select
                className="sx-select"
                value={conStock}
                onChange={e => { setConStock(e.target.value); setPagina(1); }}
              >
                <option value=""> </option>
                <option value="1">Si</option>
                <option value="2">No</option>
              </select>
            </li>

            <li>
              X
              <select
                className="sx-select"
                value={tipo}
                onChange={e => { setTipo(e.target.value); setPagina(1); }}
              >
                <option value="1">Nombre</option>
                <option value="2">Marca</option>
                <option value="3">Categoria</option>
                <option value="4">Codigo</option>
              </select>
              <input
                type="text"
                className="sx-input"
                value={texto}
                onChange={e => { setTexto(e.target.value); setPagina(1); }}
              />
            </li>

            <li>
              <button
                type="button"
                className="botonNuevo"
                onClick={() => { /* filtros ya son reactivos; boton solo existe por diseo */ }}
              >
                ?? Buscar
              </button>
            </li>
          </ol>
        </div>

        <center>
          <b>STOCK GENERAL DE</b>
        </center>

        <div className="sx-tabla-wrapper">
          <table className="sx-table" id="tabla-general-sucursal">
            <thead>
              <tr>
                <td><b>Codigo</b></td>
                <td><b>Familia</b></td>
                <td><b>Nombre</b></td>
                <td><b>Stock</b></td>
              </tr>
            </thead>
            <tbody>
              {filas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="sx-empty">
                    No hay registros con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filasPagina.map((f, idx) => (
                  <tr key={f.codigo + '-' + (inicio + idx)}>
                    <td>{f.codigo}</td>
                    <td>{f.familia}</td>
                    <td style={{ textAlign: 'left' }}>{f.nombre}</td>
                    <td>
                      <span className="sx-stock-link">
                        {f.stock.toFixed(2)} und
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filas.length > 0 && (
          <div className="sx-paginacion">
            <span
              className={`sx-page-link ${paginaActual === 1 ? 'disabled' : ''}`}
              onClick={() => irAPagina(1)}
            >
              &laquo;&laquo; Primera
            </span>
            {' | '}
            <span
              className={`sx-page-link ${paginaActual === 1 ? 'disabled' : ''}`}
              onClick={() => irAPagina(paginaActual - 1)}
            >
              &lt;
            </span>
            {' | '}
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p, idx) => {
              const label = p === totalPaginas ? 'Última' : String(p);
              return (
                <React.Fragment key={p}>
                  {idx > 0 && ' | '}
                  <span
                    className={`sx-page-link ${p === paginaActual ? 'current' : ''}`}
                    onClick={() => irAPagina(p)}
                  >
                    {label}
                  </span>
                </React.Fragment>
              );
            })}
            {' | '}
            <span
              className={`sx-page-link ${paginaActual === totalPaginas ? 'disabled' : ''}`}
              onClick={() => irAPagina(paginaActual + 1)}
            >
              &gt;
            </span>
          </div>
        )}
        <div className="sx-export">
          <button
            type="button"
            title="Imprimir"
            onClick={() => imprimirTabla('tabla-general-sucursal', 'Stock general x sucursal')}
          >
            <IconPrint />
          </button>
          <button
            type="button"
            title="Exportar Excel"
            onClick={() => exportarExcel('tabla-general-sucursal', 'stock_general_x_sucursal')}
          >
            <IconExcel />
          </button>
          <button
            type="button"
            title="Exportar Word"
            onClick={() => exportarWord('tabla-general-sucursal', 'Stock general x sucursal', 'stock_general_x_sucursal')}
          >
            <IconWord />
          </button>
        </div>
      </div>
    </>
  );
};

export default GeneralXSucursal;
