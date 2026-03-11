import React, { useMemo, useState } from 'react';
import { STOCK_DATA } from './StockGeneral';

const styles = `
  .dg-page { padding:20px; font-family:Arial,Helvetica,sans-serif; font-size:13px; }
  .dg-page * { box-sizing:border-box; color:#212529; }
  .dg-title { text-align:center; font-size:15px; font-weight:bold; margin-bottom:10px; }
  .dg-acciones {
    display:flex; flex-wrap:wrap; gap:8px; justify-content:center; align-items:center;
    margin-bottom:10px;
  }
  .botonNuevo {
    background:#17a2b8; border:1px solid #17a2b8; color:#fff !important;
    padding:6px 12px; border-radius:4px; font-weight:bold; cursor:pointer; text-decoration:none;
    display:inline-flex; align-items:center; justify-content:center;
  }
  .botonNuevo:hover { background:#138496; text-decoration:none; }
  .botonOscuro {
    background:#1f2430; border:1px solid #1f2430; color:#fff !important;
    padding:6px 12px; border-radius:4px; font-weight:bold; cursor:pointer;
  }
  .botonOscuro:hover { background:#131722; }
  .dg-table-wrap { overflow:auto; margin-top:6px; }
  .dg-table { width:100%; border-collapse:collapse; font-size:12px; }
  .dg-table thead tr { background:#C2D1D0; }
  .dg-table th, .dg-table td { padding:6px; border-bottom:1px solid #e1e5ea; }
  .dg-table tbody tr:nth-child(odd) { background:#F2F2EC; }
  .dg-table tbody tr:nth-child(even) { background:#ffffff; }
  .dg-table tbody tr:hover { background:#CCFF66; }
  .dg-right { text-align:right; }
  .dg-opc { text-align:center; width:46px; }
  .dg-del {
    border:none; background:none; cursor:pointer; color:red; font-size:16px; line-height:1; padding:0;
  }
  .dg-caja-top {
    display:flex; flex-wrap:wrap; gap:8px; justify-content:center; align-items:center; margin-bottom:8px;
  }
  .dg-select {
    border:1px solid #ced4da; border-radius:4px; padding:6px 8px; min-width:120px; background:#fff;
  }
`;

const toMoney = (n) => Number(n || 0).toFixed(2);

const inferLab = (text = '') => {
  const t = text.toLowerCase();
  if (t.includes('logitech')) return 'Logitech';
  if (t.includes('gigabyte')) return 'Gigabyte';
  if (t.includes('msi')) return 'MSI';
  if (t.includes('asus')) return 'Asus';
  if (t.includes('kingston')) return 'Kingston';
  if (t.includes('amd') || t.includes('ryzen')) return 'AMD';
  if (t.includes('intel') || t.includes('core i')) return 'Intel';
  if (t.includes('teros')) return 'Teros';
  if (t.includes('lg')) return 'LG';
  if (t.includes('team')) return 'Team Group';
  return '';
};

const inferPrice = (item) => {
  const txt = `${item.nombre} ${item.categoria}`.toLowerCase();
  if (txt.includes('monitor')) return 79 + ((item.codigo?.charCodeAt(6) || 0) % 280);
  if (txt.includes('procesador') || txt.includes('core i') || txt.includes('ryzen')) return 110 + ((item.codigo?.charCodeAt(6) || 0) % 1800);
  if (txt.includes('placa')) return 70 + ((item.codigo?.charCodeAt(6) || 0) % 1100);
  if (txt.includes('tarjeta')) return 220 + ((item.codigo?.charCodeAt(6) || 0) % 1600);
  if (txt.includes('ssd') || txt.includes('disco')) return 36 + ((item.codigo?.charCodeAt(6) || 0) % 700);
  return 1 + ((item.codigo?.charCodeAt(6) || 0) % 130);
};

const inferRubro = (text = '') => {
  const t = text.toLowerCase();
  if (t.includes('monitor')) return 'monitores';
  if (t.includes('memoria') || t.includes('ssd') || t.includes('disco')) return 'memorias';
  if (t.includes('mouse') || t.includes('teclado') || t.includes('parlante') || t.includes('pad')) return 'perifericos';
  if (t.includes('cable') || t.includes('adaptador') || t.includes('switch') || t.includes('estabilizador')) return 'suministros';
  if (t.includes('proyector') || t.includes('tinta')) return 'computo';
  return 'componentes-pc';
};

const normalizar = (s = '') =>
  String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const coincideFiltroCaja = (row, filtro) => {
  if (filtro === 'todos') return true;
  const t = normalizar(`${row.descripcion} ${row.laboratorio}`);

  const byKeywords = (keywords) => keywords.some((k) => t.includes(k));

  if (filtro === 'componentes-pc') {
    return byKeywords(['procesador', 'placa', 'tarjeta', 'case', 'fuente']);
  }
  if (filtro === 'computo') {
    return byKeywords(['procesador', 'placa', 'tarjeta', 'case', 'fuente', 'memoria', 'ssd', 'disco', 'pc']);
  }
  if (filtro === 'memorias') {
    return byKeywords(['memoria', 'ssd', 'disco', 'micro sd', 'usb']);
  }
  if (filtro === 'monitores') {
    return byKeywords(['monitor']);
  }
  if (filtro === 'perifericos') {
    return byKeywords(['mouse', 'teclado', 'parlante', 'pad']);
  }
  if (filtro === 'suministros') {
    return byKeywords(['cable', 'adaptador', 'switch', 'tinta', 'estabilizador']);
  }
  return row.rubro === filtro;
};

const BASE_DATA = STOCK_DATA.map((item, idx) => ({
  id: idx + 1,
  descripcion: item.nombre,
  laboratorio: inferLab(item.nombre),
  precio: inferPrice(item),
  rubro: inferRubro(item.nombre),
}));

const Digemid = () => {
  const [rows, setRows] = useState(BASE_DATA);
  const [vista, setVista] = useState('general');
  const [filtroCaja, setFiltroCaja] = useState('todos');

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const iniciarListado = () => {
    setRows(BASE_DATA);
  };

  const eliminar = (id) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const exportarExcel = () => {
    if (!rows.length) return;
    const header = ['Nro', 'Descripcion', 'Laboratorio', 'Precio Unitario'];
    const body = rows.map((r, i) => [
      i + 1,
      `"${String(r.descripcion || '').replaceAll('"', '""')}"`,
      `"${String(r.laboratorio || '').replaceAll('"', '""')}"`,
      toMoney(r.precio),
    ].join(','));
    const csv = [header.join(','), ...body].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'articulos_digemid.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const rowsCaja = useMemo(() => {
    if (filtroCaja === 'todos') return rows;
    return rows.filter((r) => coincideFiltroCaja(r, filtroCaja));
  }, [rows, filtroCaja]);

  const exportarCajaExcel = () => {
    if (!rowsCaja.length) return;
    const header = ['Nro', 'Descripcion', 'Laboratorio', 'Precio Pag', 'Precio Unitario'];
    const body = rowsCaja.map((r, i) => [
      i + 1,
      `"${String(r.descripcion || '').replaceAll('"', '""')}"`,
      `"${String(r.laboratorio || '').replaceAll('"', '""')}"`,
      '',
      toMoney(r.precio),
    ].join(','));
    const csv = [header.join(','), ...body].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'articulos_digemid_caja.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const exportarDrogeriaExcel = () => {
    const header = ['Nro', 'Descripcion', 'Laboratorio', 'Precio Minimo', 'Precio Max', 'Precio Prom'];
    const csv = [header.join(',')].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'articulos_digemid_drogeria.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <style>{styles}</style>
      <main className="dg-page notranslate" translate="no">
        {vista === 'general' ? (
          <>
            <div className="dg-title">LISTADO GENERAL</div>

            <div className="dg-acciones">
              <button type="button" className="botonNuevo" onClick={iniciarListado}>
                Iniciar nuevo listado
              </button>
              <button type="button" className="botonNuevo" onClick={exportarExcel}>
                Exportar a Excel
              </button>
              <button type="button" className="botonNuevo" onClick={() => setVista('caja')}>Caja</button>
              <button type="button" className="botonNuevo" onClick={() => setVista('drogeria')}>Drogeria ({today})</button>
            </div>

            <div className="dg-table-wrap">
              <table className="dg-table">
                <thead>
                  <tr>
                    <th><b>Nro</b></th>
                    <th><b>Descripcion</b></th>
                    <th><b>Laboratorio</b></th>
                    <th><b>Precio Unitario</b></th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => (
                    <tr key={r.id}>
                      <td className="dg-right">{idx + 1}</td>
                      <td>{r.descripcion}</td>
                      <td>{r.laboratorio}</td>
                      <td className="dg-right">{toMoney(r.precio)}</td>
                      <td className="dg-opc">
                        <button type="button" className="dg-del" title="Eliminar" onClick={() => eliminar(r.id)}>
                          &#9932;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : vista === 'caja' ? (
          <>
            <div className="dg-title">LISTADO GENERAL</div>
            <div className="dg-caja-top">
              <button type="button" className="botonNuevo" onClick={() => setVista('general')}>Regresar</button>
              <select className="dg-select" value={filtroCaja} onChange={(e) => setFiltroCaja(e.target.value)}>
                <option value="todos">Todos</option>
                <option value="componentes-pc">Componentes PC</option>
                <option value="computo">Computo</option>
                <option value="memorias">Memorias</option>
                <option value="monitores">Monitores</option>
                <option value="perifericos">Perifericos</option>
                <option value="suministros">Suministros</option>
              </select>
              <button type="button" className="botonNuevo" onClick={exportarCajaExcel}>exportar a Exel</button>
            </div>

            <div className="dg-table-wrap">
              <table className="dg-table">
                <thead>
                  <tr>
                    <th><b>Nro</b></th>
                    <th><b>Descripcion</b></th>
                    <th><b>Laboratorio</b></th>
                    <th><b>Precio Pag</b></th>
                    <th><b>Precio Unitario</b></th>
                  </tr>
                </thead>
                <tbody>
                  {rowsCaja.map((r, idx) => (
                    <tr key={`caja-${r.id}`}>
                      <td className="dg-right">{idx + 1}</td>
                      <td>{r.descripcion}</td>
                      <td>{r.laboratorio}</td>
                      <td className="dg-right" />
                      <td className="dg-right">{toMoney(r.precio)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <div className="dg-title">LISTADO GENERAL - DROGERIA</div>
            <div className="dg-caja-top">
              <button type="button" className="botonNuevo" onClick={() => setVista('general')}>Regresar</button>
              <button type="button" className="botonNuevo" onClick={iniciarListado}>Iniciar nuevo listado</button>
              <button type="button" className="botonNuevo" onClick={exportarDrogeriaExcel}>exportar a Excel</button>
            </div>

            <div className="dg-table-wrap">
              <table className="dg-table">
                <thead>
                  <tr>
                    <th><b>Nro</b></th>
                    <th><b>Descripcion</b></th>
                    <th><b>Laboratorio</b></th>
                    <th><b>Precio Minimo</b></th>
                    <th><b>Precio Max</b></th>
                    <th><b>Precio Prom</b></th>
                  </tr>
                </thead>
                <tbody />
              </table>
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default Digemid;
