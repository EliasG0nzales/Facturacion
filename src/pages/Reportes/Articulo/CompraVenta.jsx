import React, { useMemo, useState } from 'react';
import { STOCK_DATA } from './StockGeneral';

const styles = `
  .cv-page { padding:20px; font-family:Arial,Helvetica,sans-serif; font-size:13px; }
  .cv-page * { box-sizing:border-box; color:#212529; }
  .cv-title { font-size:18px; font-weight:bold; margin-bottom:10px; }
  .cv-filtros { margin:12px 0 16px 0; }
  .cv-filtros ol { list-style:none; padding:0; margin:0; display:flex; gap:12px; flex-wrap:wrap; align-items:flex-end; }
  .cv-filtros li { display:flex; align-items:center; gap:6px; }
  .cv-select, .cv-input {
    padding:5px 8px; border:1px solid #ced4da; border-radius:4px; background:#fff; font-size:13px;
  }
  .cv-input { min-width:220px; }
  .cv-radios { display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
  .botonNuevo {
    background:#17a2b8; border:1px solid #17a2b8; color:#fff !important;
    padding:6px 14px; border-radius:4px; font-weight:bold; cursor:pointer;
  }
  .botonNuevo:hover { background:#138496; }
  .cv-table-wrap { margin-top:10px; overflow-x:auto; }
  .cv-table { width:100%; border-collapse:collapse; font-size:12px; }
  .cv-table thead tr { background:#C2D1D0; }
  .cv-table thead td { padding:8px 6px; font-weight:bold; }
  .cv-table tbody tr:nth-child(even) { background:#f9f9f9; }
  .cv-table tbody td { padding:6px 6px; border-bottom:1px solid #e1e5ea; }
  .cv-empty { text-align:center; color:#888; padding:12px 6px; }
  .cv-total { background:#E6E6E6 !important; }
  .cv-paginacion { margin-top:10px; text-align:center; font-size:12px; }
  .cv-page-link { color:#007bff; cursor:pointer; margin:0 2px; text-decoration:none; }
  .cv-page-link.disabled { color:#999; cursor:default; }
  .cv-page-link.current { color:#000; font-weight:bold; cursor:default; }
  .cv-export { margin-top:8px; text-align:right; }
  .cv-export button { background:none; border:none; cursor:pointer; margin-left:8px; padding:0; }
`;

const SUCURSALES = [
  { value: '', label: 'Todos', campo: '' },
  { value: '3', label: 'Almacen 2B 167', campo: 'almacen' },
  { value: '1', label: 'Tienda 1b 133', campo: 'tienda1' },
  { value: '2', label: 'Tienda 1A 119', campo: 'tienda2' },
];

const IconPrint = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <rect x="6" y="3" width="12" height="5" rx="1" fill="none" stroke="#666" strokeWidth="1.4" />
    <rect x="4" y="8" width="16" height="8" rx="1.5" fill="none" stroke="#666" strokeWidth="1.4" />
    <rect x="7" y="13" width="10" height="6" rx="1" fill="none" stroke="#666" strokeWidth="1.4" />
  </svg>
);
const IconExcel = () => (
  <svg width="26" height="20" viewBox="0 0 26 20">
    <rect x="4" y="3" width="18" height="14" rx="2" fill="#217346" />
    <rect x="7" y="5" width="12" height="10" fill="#2E7F4F" />
    <text x="13" y="13" textAnchor="middle" fontSize="8" fill="#fff">X</text>
  </svg>
);
const IconWord = () => (
  <svg width="22" height="22" viewBox="0 0 24 24">
    <rect x="4" y="3" width="16" height="18" rx="2" fill="#21439C" />
    <rect x="6" y="5" width="12" height="14" fill="#3162D4" />
    <text x="12" y="15" textAnchor="middle" fontSize="9" fill="#fff">W</text>
  </svg>
);

const imprimirTabla = (tableId, titulo) => {
  const table = document.getElementById(tableId);
  if (!table) return;
  const win = window.open('', '_blank');
  win.document.write(`<html><head><meta charset="UTF-8"><title>${titulo}</title></head><body>${table.outerHTML}</body></html>`);
  win.document.close();
  win.print();
};

const exportarTabla = (tableId, tipo, nombre) => {
  const table = document.getElementById(tableId);
  if (!table) return;
  const mime = tipo === 'xls' ? 'application/vnd.ms-excel' : 'application/msword';
  const blob = new Blob([`<html><meta charset="UTF-8"><body>${table.outerHTML}</body></html>`], { type: mime });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${nombre}.${tipo}`;
  a.click();
  URL.revokeObjectURL(a.href);
};

const CompraVenta = () => {
  const [suco, setSuco] = useState('');
  const [tipo, setTipo] = useState('1');
  const [texto, setTexto] = useState('');
  const [pagina, setPagina] = useState(1);

  const filas = useMemo(() => {
    const suc = SUCURSALES.find(s => s.value === suco);
    const campo = suc?.campo;
    let base = STOCK_DATA.map((r, i) => {
      const stockSel = campo ? (r[campo] || 0) : ((r.almacen || 0) + (r.tienda1 || 0) + (r.tienda2 || 0));
      const venta = Math.min(stockSel, i % 7 === 0 ? 1 : i % 5 === 0 ? 2 : i % 4 === 0 ? 3 : 0);
      const compra = stockSel + venta;
      const saldo = compra - venta;
      return {
        codigo: r.codigo || '',
        familia: r.categoria || '',
        nombre: r.nombre || '',
        compra,
        venta,
        saldo,
      };
    });

    const term = texto.trim().toLowerCase();
    if (term) {
      base = base.filter((x) => {
        if (tipo === '1') return x.nombre.toLowerCase().includes(term);
        if (tipo === '2') return x.nombre.toLowerCase().includes(term);
        if (tipo === '3') return x.familia.toLowerCase().includes(term);
        if (tipo === '4') return x.codigo.toLowerCase().includes(term);
        return true;
      });
    }
    return base;
  }, [suco, tipo, texto]);

  const pageSize = 50;
  const totalPaginas = Math.max(1, Math.ceil(filas.length / pageSize));
  const pActual = Math.min(pagina, totalPaginas);
  const pageRows = filas.slice((pActual - 1) * pageSize, pActual * pageSize);

  return (
    <>
      <style>{styles}</style>
      <div className="cv-page notranslate" translate="no">
        <div className="cv-title">REPORTE DE COMPRADOS - VENDIDIDOS</div>

        <div className="cv-filtros">
          <ol>
            <li>
              <b>BUSCAR DE</b>
              <select className="cv-select" value={suco} onChange={(e) => { setSuco(e.target.value); setPagina(1); }}>
                {SUCURSALES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              X
            </li>
            <li>
              <div className="cv-radios">
                <label><input type="radio" name="tipo_cv" value="1" checked={tipo === '1'} onChange={(e) => setTipo(e.target.value)} /> Nombre</label>
                <label><input type="radio" name="tipo_cv" value="2" checked={tipo === '2'} onChange={(e) => setTipo(e.target.value)} /> Marca</label>
                <label><input type="radio" name="tipo_cv" value="3" checked={tipo === '3'} onChange={(e) => setTipo(e.target.value)} /> Categoria</label>
                <label><input type="radio" name="tipo_cv" value="4" checked={tipo === '4'} onChange={(e) => setTipo(e.target.value)} /> Codigo</label>
              </div>
              <input className="cv-input" value={texto} onChange={(e) => { setTexto(e.target.value); setPagina(1); }} />
            </li>
            <li><button type="button" className="botonNuevo">Buscar</button></li>
          </ol>
        </div>

        <center><b>Lista General</b></center>
        <div className="cv-table-wrap">
          <table className="cv-table" id="tabla-compra-venta">
            <thead>
              <tr>
                <td><b>Codigo</b></td>
                <td><b>Familia</b></td>
                <td><b>Nombre</b></td>
                <td><b>Compra</b></td>
                <td><b>Venta</b></td>
                <td><b>Saldo</b></td>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr><td colSpan={6} className="cv-empty">No hay registros.</td></tr>
              ) : (
                pageRows.map((r, i) => (
                  <tr key={r.codigo + '-' + i}>
                    <td>{r.codigo}</td>
                    <td>{r.familia}</td>
                    <td style={{ textAlign: 'left' }}>{r.nombre}</td>
                    <td>{r.compra.toFixed(2)}</td>
                    <td>{r.venta ? r.venta.toFixed(2) : ''}</td>
                    <td>{r.saldo.toFixed(0)}</td>
                  </tr>
                ))
              )}
              <tr className="cv-total">
                <td /><td /><td /><td /><td /><td />
              </tr>
            </tbody>
          </table>
        </div>

        <div className="cv-paginacion">
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p, idx) => (
            <React.Fragment key={p}>
              {idx > 0 && ' | '}
              <span className={`cv-page-link ${p === pActual ? 'current' : ''}`} onClick={() => setPagina(p)}>
                {p}
              </span>
            </React.Fragment>
          ))}
          {' | '}
          <span className={`cv-page-link ${pActual === totalPaginas ? 'disabled' : ''}`} onClick={() => pActual < totalPaginas && setPagina(pActual + 1)}>&gt;</span>
          {' | '}
          <span className={`cv-page-link ${pActual === totalPaginas ? 'disabled' : ''}`} onClick={() => setPagina(totalPaginas)}>ultima &raquo;&raquo;</span>
        </div>

        <div className="cv-export">
          <button type="button" title="Imprimir" onClick={() => imprimirTabla('tabla-compra-venta', 'Reporte comprados-vendidos')}><IconPrint /></button>
          <button type="button" title="Excel" onClick={() => exportarTabla('tabla-compra-venta', 'xls', 'reporte_compra_venta')}><IconExcel /></button>
          <button type="button" title="Word" onClick={() => exportarTabla('tabla-compra-venta', 'doc', 'reporte_compra_venta')}><IconWord /></button>
        </div>
      </div>
    </>
  );
};

export default CompraVenta;
