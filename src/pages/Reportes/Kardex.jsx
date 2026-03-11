import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { STOCK_DATA } from './Articulo/StockGeneral';

const styles = `
  .kdx-page { padding:20px; font-family:Arial,Helvetica,sans-serif; font-size:13px; }
  .kdx-page * { box-sizing:border-box; color:#212529; }
  .kdx-head { display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:8px; flex-wrap:wrap; }
  .kdx-title { font-size:30px; font-weight:bold; display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
  .kdx-help { color:#1da4d8; font-size:16px; text-decoration:none; line-height:1; }
  .kdx-title label { font-size:27px; font-weight:normal; }
  .kdx-links { display:flex; align-items:center; gap:6px; }
  .kdx-link-btn {
    width:24px; height:24px; border:none; border-radius:2px; cursor:pointer;
    background:transparent; color:#6f2dbd; display:inline-flex; align-items:center; justify-content:center; padding:0;
  }
  .kdx-link-btn:hover { background:#eef6ff; }
  .kdx-link-btn svg { width:16px; height:16px; }
  .kdx-link-btn--sucursal { color:#1da4d8; }
  .kdx-filtros ol {
    list-style:none; padding:0; margin:6px 0 0 0; display:flex; gap:12px; flex-wrap:wrap; align-items:flex-end;
  }
  .kdx-filtros li { display:flex; flex-direction:column; gap:4px; }
  .kdx-prod { min-width:420px; }
  .kdx-prod-label { font-weight:bold; font-size:13px; }
  .kdx-prod-label span { font-weight:normal; font-size:13px; }
  .kdx-yo { justify-content:flex-end; padding-bottom:10px; font-weight:bold; min-width:28px; font-size:13px; }
  .kdx-select, .kdx-input {
    border:1px solid #ced4da; border-radius:4px; padding:6px 8px; background:#fff;
  }
  .kdx-select { min-width:420px; }
  .kdx-input { min-width:136px; width:136px; }
  .botonNuevo {
    background:#17a2b8; border:1px solid #17a2b8; color:#fff !important;
    padding:6px 14px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:24px;
  }
  .botonNuevo:hover { background:#138496; }
  .kdx-result { margin-top:6px; width:100%; min-height:120px; }
  .kdx-subtitle { text-align:center; font-size:30px; font-weight:bold; margin-top:2px; }
  .kdx-tools { margin-top:8px; text-align:right; }
  .kdx-tools button {
    border:none; background:none; cursor:pointer; margin-left:8px; padding:0;
    display:inline-flex; align-items:center; justify-content:center;
  }
  .kdx-tools button:hover { transform:scale(1.08); }
`;

const IconPrint = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="7" y="3" width="10" height="5" rx="0.8" fill="none" stroke="#7B7F85" strokeWidth="1.6" />
    <rect x="4" y="8" width="16" height="8" rx="1.2" fill="none" stroke="#7B7F85" strokeWidth="1.6" />
    <rect x="7" y="13" width="10" height="7" rx="0.8" fill="none" stroke="#7B7F85" strokeWidth="1.6" />
  </svg>
);

const IconExcel = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="4.5" y="3.5" width="15" height="17" rx="1.6" fill="#2E8F4E" />
    <text x="12" y="16" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#fff" fontFamily="Arial,Helvetica,sans-serif">
      X
    </text>
  </svg>
);

const Kardex = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tipo, setTipo] = useState('FISICO');
  const [soloAnual, setSoloAnual] = useState(false);
  const [productoId, setProductoId] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [buscado, setBuscado] = useState(false);
  const vista = searchParams.get('vista') === 'grupo-costo' ? 'grupo-costo' : 'articulo';

  const productos = useMemo(
    () => STOCK_DATA.map((p, i) => ({ id: String(i + 1), nombre: p.nombre })),
    []
  );

  const buscar = (e) => {
    e.preventDefault();
    setBuscado(true);
  };

  const irVista = (nextVista) => {
    const next = new URLSearchParams(searchParams);
    if (nextVista === 'articulo') next.delete('vista');
    else next.set('vista', 'grupo-costo');
    setSearchParams(next);
    setBuscado(false);
  };

  const imprimir = () => {
    const div = document.getElementById('printme');
    if (!div) return;
    const win = window.open('', '_blank');
    win.document.write(`<html><head><meta charset="UTF-8"><title>Kardex</title></head><body>${div.innerHTML}</body></html>`);
    win.document.close();
    win.print();
  };

  const exportarExcel = () => {
    const div = document.getElementById('printme');
    if (!div) return;
    const blob = new Blob([`<html><meta charset="UTF-8"><body>${div.innerHTML}</body></html>`], {
      type: 'application/vnd.ms-excel',
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'kardex.xls';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <style>{styles}</style>
      <main className="kdx-page notranslate" translate="no">
        <form onSubmit={buscar}>
          <div className="kdx-head">
            <div className="kdx-title">
              {vista === 'articulo' && (
                <>
                  <a className="kdx-help" href="#ayuda" title="Ayuda">?</a>
                  KARDEX
                  <label>
                    <input
                      type="radio"
                      name="cual"
                      value="FISICO"
                      checked={tipo === 'FISICO'}
                      onChange={(e) => { setTipo(e.target.value); setBuscado(false); }}
                    /> FISICO
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="cual"
                      value="KARDEX VALORIZADO"
                      checked={tipo === 'KARDEX VALORIZADO'}
                      onChange={(e) => { setTipo(e.target.value); setBuscado(false); }}
                    /> VALORIZADO
                  </label>
                </>
              )}
            </div>
            <div className="kdx-links">
              <button
                type="button"
                className="kdx-link-btn"
                title="Kardex por Articulo"
                onClick={() => irVista('articulo')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="4" y="5" width="16" height="3" rx="1" />
                  <rect x="4" y="10.5" width="16" height="3" rx="1" />
                  <rect x="4" y="16" width="16" height="3" rx="1" />
                </svg>
              </button>
              <button
                type="button"
                className="kdx-link-btn"
                title="Kardex por Grupo/Costo"
                onClick={() => irVista('grupo-costo')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <ellipse cx="12" cy="6" rx="7" ry="2.5" />
                  <path d="M5 6v4c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6" />
                  <path d="M5 10v4c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-4" />
                </svg>
              </button>
              <button
                type="button"
                className="kdx-link-btn kdx-link-btn--sucursal"
                title="Volver a Kardex por Articulo"
                onClick={() => irVista('articulo')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="5" y="4" width="14" height="16" rx="1.2" />
                  <rect x="8" y="7" width="2" height="2" fill="#fff" />
                  <rect x="12" y="7" width="2" height="2" fill="#fff" />
                  <rect x="8" y="11" width="2" height="2" fill="#fff" />
                  <rect x="12" y="11" width="2" height="2" fill="#fff" />
                  <rect x="10" y="15" width="4" height="5" fill="#fff" />
                </svg>
              </button>
            </div>
          </div>

          <div className="kdx-filtros">
            <ol>
              {vista === 'articulo' && (
                <li className="kdx-prod">
                  <div className="kdx-prod-label">
                    ARTICULO <span>(Solo del 2026
                    <input type="checkbox" checked={soloAnual} onChange={(e) => setSoloAnual(e.target.checked)} />)</span>
                  </div>
                  <select
                    required
                    className="kdx-select"
                    value={productoId}
                    onChange={(e) => setProductoId(e.target.value)}
                  >
                    <option value="" />
                    {productos.map((p) => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                  </select>
                </li>
              )}
              {vista === 'articulo' && <li className="kdx-yo"><b>y/o</b></li>}
              <li>
                Fecha Inicio
                <input type="date" className="kdx-input" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
              </li>
              <li>
                Fecha Fin
                <input type="date" className="kdx-input" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
              </li>
              <li>
                <button type="submit" className="botonNuevo">Buscar</button>
              </li>
            </ol>
          </div>
        </form>

        <div id="printme" className="kdx-result">
          {(vista === 'grupo-costo' || buscado) && (
            <div className="kdx-subtitle">{tipo === 'KARDEX VALORIZADO' ? 'KARDEX VALORIZADO' : 'KARDEX FISICO'}</div>
          )}
        </div>

        <div className="kdx-tools">
          <button type="button" title="Imprimir" onClick={imprimir}><IconPrint /></button>
          <button type="button" title="Excel" onClick={exportarExcel}><IconExcel /></button>
        </div>
      </main>
    </>
  );
};

export default Kardex;
