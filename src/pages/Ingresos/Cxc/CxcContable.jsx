import React, { useState } from 'react';

const styles = `
  .page-container { padding:10px 14px; font-family:Arial,Helvetica,sans-serif; font-size:13px; background:#fff; }
  .page-container * { color:#212529; box-sizing:border-box; }
  .page-title { font-size:16px; font-weight:bold; margin-bottom:10px; border-bottom:2px solid #00A3E1; padding-bottom:4px; color:#333; }
  .page-title .info-dot { background:#00A3E1; color:#fff !important; border-radius:50%; width:18px; height:18px; text-align:center; line-height:18px; font-size:11px; display:inline-block; vertical-align:middle; margin-right:6px; }

  .reporte-titulo { font:18px Arial; text-align:center; margin-bottom:12px; color:#212529; }
  .tabla-contable { width:100%; border-collapse:collapse; font-size:11px; }
  .tabla-contable thead tr { background-color:#00A3E1; }
  .tabla-contable thead th { padding:5px 4px; text-align:center; font-weight:bold; color:#fff !important; white-space:nowrap; }
  .tabla-contable tbody tr { background:#fff; }
  .tabla-contable tbody td { padding:4px 5px; border-bottom:1px solid #dee2e6; color:#212529; }

  .pie-reporte { margin-top:12px; text-align:right; }
  .btn-excel { background:none; border:none; cursor:pointer; padding:4px; display:inline-block; color:#39B636; transition:transform 0.15s; }
  .btn-excel:hover { transform:scale(1.15); }

  .alert-success { background:#d4edda; border:1px solid #c3e6cb; color:#155724 !important; padding:6px 10px; border-radius:4px; margin-bottom:6px; font-size:12px; display:inline-block; }
  .alert-danger { background:#f8d7da; border:1px solid #f5c6cb; color:#721c24 !important; padding:6px 10px; border-radius:4px; margin-bottom:6px; font-size:12px; display:inline-block; }
`;

const IconExcel = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="20" height="20" rx="3" fill="#39B636"/>
    <text x="5" y="17" fontSize="12" fontWeight="bold" fill="#fff" fontFamily="Arial">XLS</text>
  </svg>
);

const COLUMNAS = ['CAMPO', 'S.D.', 'NRO C.', 'FECHA C.', 'C.MONEDA', 'GLOSA', 'T.C.', 'T.CV', 'F.C.', 'F.T.C.', 'C.CONT.', 'C.ANEX', 'C.C.C.', 'D/H', 'IMP.O.', 'S/.', 'US$', 'T.DOC', 'N.DOC', 'F.DOC', 'F.D.V.', 'C.A.', 'G.DETALLE'];

const CxcContable = () => {
  const [datos] = useState([]);
  const [msg, setMsg] = useState({ tipo: '', texto: '' });

  const showMsg = (tipo, texto) => {
    setMsg({ tipo, texto });
    setTimeout(() => setMsg({ tipo: '', texto: '' }), 2500);
  };

  const handleExcel = () => {
    const csv = [COLUMNAS.join(',')].join('\r\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cuenta_por_cobrar_contable_${new Date().toISOString().slice(0, 10)}.csv`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showMsg('success', 'Reporte descargado en Excel correctamente.');
  };

  return (
    <>
      <style>{styles}</style>
      <div className="page-container">
        <div className="page-title">
          <span className="info-dot">?</span>
          Cuenta por Cobrar - Contable
        </div>

        {msg.texto && (
          <div className={msg.tipo === 'success' ? 'alert-success' : 'alert-danger'}>
            {msg.tipo === 'success' ? '?' : '??'} {msg.texto}
          </div>
        )}

        <div className="reporte-titulo">CUENTA POR COBRAR - CONTABLE</div>

        <table className="tabla-contable">
          <thead>
            <tr>
              <th>CAMPO</th>
              <th>S.D.</th>
              <th>NRO C.</th>
              <th>FECHA C.</th>
              <th>C.MONEDA</th>
              <th>GLOSA</th>
              <th>T.C.</th>
              <th>T.CV</th>
              <th>F.C.</th>
              <th>F.T.C.</th>
              <th>C.CONT.</th>
              <th>C.ANEX</th>
              <th>C.C.C.</th>
              <th>D/H</th>
              <th>IMP.O.</th>
              <th>S/.</th>
              <th>US$</th>
              <th>T.DOC</th>
              <th>N.DOC</th>
              <th>F.DOC</th>
              <th>F.D.V.</th>
              <th>C.A.</th>
              <th>G.DETALLE</th>
            </tr>
          </thead>
          <tbody>
            {datos.length === 0 ? (
              <tr>
                <td colSpan="23" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                  No hay registros para mostrar.
                </td>
              </tr>
            ) : (
              datos.map((d, i) => (
                <tr key={i}>
                  {COLUMNAS.map((col) => (
                    <td key={col}>{d[col] ?? ''}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="pie-reporte">
          <button type="button" className="btn-excel" title="Exportar a Excel" onClick={handleExcel}>
            <IconExcel />
          </button>
        </div>
      </div>
    </>
  );
};

export default CxcContable;
