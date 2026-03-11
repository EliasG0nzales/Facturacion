import React, { useMemo, useState } from 'react';
import { STOCK_DATA } from './StockGeneral';

const styles = `
  .vz-page { padding:20px; font-family:Arial,Helvetica,sans-serif; font-size:13px; }
  .vz-page * { box-sizing:border-box; color:#212529; }
  .vz-title { font-size:18px; font-weight:bold; margin-bottom:10px; }
  .vz-filtros { margin:10px 0 14px 0; }
  .vz-filtros ol { list-style:none; padding:0; margin:0; display:flex; gap:12px; flex-wrap:wrap; align-items:flex-end; }
  .vz-filtros li { display:flex; flex-direction:column; gap:5px; }
  .vz-select, .vz-input {
    border:1px solid #ced4da; border-radius:4px; padding:5px 8px; background:#fff; font-size:13px;
  }
  .vz-input { min-width:230px; }
  .vz-radio-row { display:flex; gap:6px; align-items:center; flex-wrap:wrap; }
  .botonNuevo {
    background:#17a2b8; border:1px solid #17a2b8; color:#fff !important;
    padding:6px 14px; border-radius:4px; font-weight:bold; cursor:pointer;
  }
  .botonNuevo:hover { background:#138496; }
  .vz-table-wrap { margin-top:10px; overflow:auto; }
  .vz-table { width:100%; border-collapse:collapse; font-size:12px; }
  .vz-table thead tr { background:#C2D1D0; }
  .vz-table td, .vz-table th { padding:6px; border-bottom:1px solid #e1e5ea; }
  .vz-table tbody tr:nth-child(even) { background:#f9f9f9; }
  .vz-right { text-align:right; }
  .vz-total { background:#E6E6E6 !important; font-weight:bold; }
  .vz-paginacion { margin-top:10px; text-align:center; font-size:12px; }
  .vz-page-link { color:#007bff; cursor:pointer; margin:0 2px; }
  .vz-page-link.disabled { color:#999; cursor:default; }
  .vz-page-link.current { color:#000; font-weight:bold; }
  .vz-export { text-align:right; margin-top:8px; }
  .vz-export button { background:none; border:none; cursor:pointer; margin-left:8px; padding:0; }
`;

const SUCURSALES = [
  { value: '', label: 'Todos', campo: '' },
  { value: '3', label: 'Almacen 2B 167', campo: 'almacen' },
  { value: '1', label: 'Tienda 1b 133', campo: 'tienda1' },
  { value: '2', label: 'Tienda 1A 119', campo: 'tienda2' },
];

const calcCosto = (nombre) => {
  const seed = Array.from(nombre).reduce((n, c) => n + c.charCodeAt(0), 0);
  return (seed % 230) + 1;
};

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

const Valorizado = () => {
  const [suco, setSuco] = useState('');
  const [tipo, setTipo] = useState('1');
  const [texto, setTexto] = useState('');
  const [npaginar, setNpaginar] = useState(false);
  const [pagina, setPagina] = useState(1);

  const rows = useMemo(() => {
    const suc = SUCURSALES.find(s => s.value === suco);
    const campo = suc?.campo;
    let base = STOCK_DATA.map((r) => {
      const stock = campo ? (r[campo] || 0) : ((r.almacen || 0) + (r.tienda1 || 0) + (r.tienda2 || 0));
      const costo = calcCosto(r.nombre);
      const pv = +(costo * 1.2).toFixed(2);
      const valorCosto = +(stock * costo).toFixed(2);
      const pvValor = +(stock * pv).toFixed(2);
      const ganancia = +(pvValor - valorCosto).toFixed(2);
      return {
        codigo: r.codigo,
        familia: r.categoria || '',
        detalle: r.nombre,
        stock,
        costo,
        valorCosto,
        pv,
        pvValor,
        ganancia,
      };
    });

    const term = texto.trim().toLowerCase();
    if (term) {
      base = base.filter((x) => {
        if (tipo === '1') return x.detalle.toLowerCase().includes(term);
        if (tipo === '2') return x.detalle.toLowerCase().includes(term);
        if (tipo === '3') return x.familia.toLowerCase().includes(term);
        if (tipo === '4') return x.codigo.toLowerCase().includes(term);
        return true;
      });
    }
    return base;
  }, [suco, tipo, texto]);

  const pageSize = 50;
  const totalPaginas = Math.max(1, Math.ceil(rows.length / pageSize));
  const pActual = Math.min(pagina, totalPaginas);
  const pageRows = npaginar ? rows : rows.slice((pActual - 1) * pageSize, pActual * pageSize);

  const totCosto = pageRows.reduce((s, r) => s + r.valorCosto, 0);
  const totPv = pageRows.reduce((s, r) => s + r.pvValor, 0);
  const totGan = pageRows.reduce((s, r) => s + r.ganancia, 0);
  const tipoCambio = 3.8;
  const totCostoSoles = totCosto * tipoCambio;
  const totPvSoles = totPv * tipoCambio;
  const totGanSoles = totGan * tipoCambio;

  const imprimir = () => {
    const table = document.getElementById('tabla-valorizado');
    if (!table) return;
    const win = window.open('', '_blank');
    win.document.write(`<html><head><meta charset="UTF-8"><title>Valorizado</title></head><body>${table.outerHTML}</body></html>`);
    win.document.close();
    win.print();
  };
  const exportar = (ext) => {
    const table = document.getElementById('tabla-valorizado');
    if (!table) return;
    const type = ext === 'xls' ? 'application/vnd.ms-excel' : 'application/msword';
    const blob = new Blob([`<html><meta charset="UTF-8"><body>${table.outerHTML}</body></html>`], { type });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `stock_valorizado.${ext}`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="vz-page notranslate" translate="no">
        <div className="vz-title">STOCK GENERAL - STOCK VALORIZADO</div>

        <div className="vz-filtros">
          <ol>
            <li>
              <b>BUSCAR DE</b>
              <select className="vz-select" value={suco} onChange={(e) => { setSuco(e.target.value); setPagina(1); }}>
                {SUCURSALES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </li>
            <li>
              <b>y/o</b>
              <div className="vz-radio-row">
                <label><input type="radio" name="tipo" value="1" checked={tipo === '1'} onChange={(e) => setTipo(e.target.value)} /> Nombre</label>
                <label><input type="radio" name="tipo" value="2" checked={tipo === '2'} onChange={(e) => setTipo(e.target.value)} /> Marca</label>
                <label><input type="radio" name="tipo" value="3" checked={tipo === '3'} onChange={(e) => setTipo(e.target.value)} /> Familia</label>
                <label><input type="radio" name="tipo" value="4" checked={tipo === '4'} onChange={(e) => setTipo(e.target.value)} /> Codigo</label>
              </div>
              <input className="vz-input" value={texto} onChange={(e) => { setTexto(e.target.value); setPagina(1); }} />
            </li>
            <li>
              <button type="button" className="botonNuevo">Buscar</button>
              <label style={{ marginTop: 4 }}>
                (Sin Paginacion <input type="checkbox" checked={npaginar} onChange={(e) => setNpaginar(e.target.checked)} style={{ width: 15 }} />)
              </label>
            </li>
          </ol>
        </div>

        <center><b>LISTADO GENERAL</b></center>
        <div className="vz-table-wrap">
          <table className="vz-table" id="tabla-valorizado">
            <thead>
              <tr>
                <th>Codigo</th><th>Familia</th><th>Detalle</th><th>Stock</th>
                <th className="vz-right">Costo</th><th className="vz-right">Valor.Costo</th>
                <th className="vz-right">P.V.</th><th className="vz-right">P.V. Valor.</th><th className="vz-right">Ganacia</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r, i) => (
                <tr key={r.codigo + i}>
                  <td>{r.codigo}</td>
                  <td>{r.familia}</td>
                  <td>{r.detalle}</td>
                  <td>{r.stock.toFixed(2)} und</td>
                  <td className="vz-right">{r.costo.toFixed(2)}</td>
                  <td className="vz-right">{r.valorCosto.toFixed(2)}</td>
                  <td className="vz-right">{r.pv.toFixed(2)}</td>
                  <td className="vz-right">{r.pvValor.toFixed(2)}</td>
                  <td className="vz-right">US$ {r.ganancia.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="vz-total">
                <td /><td /><td /><td />
                <td className="vz-right">US$</td>
                <td className="vz-right">US$ {totCosto.toFixed(2)}</td>
                <td className="vz-right">US$</td>
                <td className="vz-right">US$ {totPv.toFixed(2)}</td>
                <td className="vz-right">US$ {totGan.toFixed(2)}</td>
              </tr>
              <tr className="vz-total">
                <td /><td /><td /><td />
                <td className="vz-right">S/.</td>
                <td className="vz-right">S/. {totCostoSoles.toFixed(2)}</td>
                <td className="vz-right">S/.</td>
                <td className="vz-right">S/. {totPvSoles.toFixed(2)}</td>
                <td className="vz-right">S/. {totGanSoles.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {!npaginar && (
          <div className="vz-paginacion">
            <span className={`vz-page-link ${pActual === 1 ? 'disabled' : ''}`} onClick={() => pActual > 1 && setPagina(pActual - 1)}>&lt;</span>
            {' | '}
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p, idx) => (
              <React.Fragment key={p}>
                {idx > 0 && ' | '}
                <span className={`vz-page-link ${p === pActual ? 'current' : ''}`} onClick={() => setPagina(p)}>
                  {p}
                </span>
              </React.Fragment>
            ))}
            {' | '}
            <span className={`vz-page-link ${pActual === totalPaginas ? 'disabled' : ''}`} onClick={() => pActual < totalPaginas && setPagina(pActual + 1)}>&gt;</span>
            {' | '}
            <span className={`vz-page-link ${pActual === totalPaginas ? 'disabled' : ''}`} onClick={() => setPagina(totalPaginas)}>ultima &raquo;&raquo;</span>
          </div>
        )}

        <div className="vz-export">
          <button type="button" title="Imprimir" onClick={imprimir}><IconPrint /></button>
          <button type="button" title="Excel" onClick={() => exportar('xls')}><IconExcel /></button>
          <button type="button" title="Word" onClick={() => exportar('doc')}><IconWord /></button>
        </div>
      </div>
    </>
  );
};

export default Valorizado;
