import React, { useState } from 'react';

const styles = `
  .page-container { padding:10px 14px; font-family:Arial,Helvetica,sans-serif; font-size:13px; background:#fff; }
  .page-container * { color:#212529; box-sizing:border-box; }
  .page-title { font-size:16px; font-weight:bold; margin-bottom:10px; border-bottom:2px solid #00A3E1; padding-bottom:4px; color:#333; }
  .page-title .info-dot { background:#00A3E1; color:#fff !important; border-radius:50%; width:18px; height:18px; text-align:center; line-height:18px; font-size:11px; display:inline-block; vertical-align:middle; margin-right:6px; }

  .reporte-titulo { font:18px Arial; text-align:center; margin-bottom:12px; color:#212529; }
  .tabla-cxc { width:100%; border-collapse:collapse; font-size:12px; }
  .tabla-cxc thead tr { background-color:#00A3E1; }
  .tabla-cxc thead th { padding:6px 8px; text-align:center; font-weight:bold; color:#fff !important; white-space:nowrap; }
  .tabla-cxc tbody tr { background:#fff; }
  .tabla-cxc tbody tr:hover { background:#CCFF66 !important; }
  .tabla-cxc tbody td { padding:5px 8px; border-bottom:1px solid #dee2e6; color:#212529; }
  .tabla-cxc .fila-anexo td { font-size:11px; }

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

const DATOS_INICIALES = [
  { ruc: '20523520025', cliente: 'Inteligente S.a.c.', docventa: 'F:FI01-000001', fecdoc: '26/02/2026', fecven: '28/02/2026', ref: '', mo: 'MN', m: 'S/.', saldo: 80.00, responsable: 'demo' },
  { ruc: '', cliente: 'venta falabella', docventa: 'NV:001-000004', fecdoc: '23/01/2024', fecven: '24/01/2024', ref: '', mo: 'MN', m: 'S/.', saldo: 320.00, responsable: 'demo' },
];

const CxcCobranza = () => {
  const [datos] = useState(DATOS_INICIALES);
  const [msg, setMsg] = useState({ tipo: '', texto: '' });

  const showMsg = (tipo, texto) => {
    setMsg({ tipo, texto });
    setTimeout(() => setMsg({ tipo: '', texto: '' }), 2500);
  };

  const handleExcel = () => {
    const enc = ['RUC', 'CLIENTE', 'DOC.VENTA', 'FEC.DOC.', 'FEC.VEN.', 'REFERENCIA', 'MO', 'M.', 'SALDO', 'OT', 'RESPONSABLE'];
    const filas = datos.map((d) =>
      [d.ruc, `"${(d.cliente || '').replace(/"/g, '""')}"`, d.docventa, d.fecdoc, d.fecven, d.ref, d.mo, d.m, d.saldo.toFixed(2), '', d.responsable].join(',')
    );
    const csv = [enc.join(','), ...filas].join('\r\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cuenta_por_cobrar_cobranza_${new Date().toISOString().slice(0, 10)}.csv`;
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
          Cuenta por Cobrar - Cobranza
        </div>

        {msg.texto && (
          <div className={msg.tipo === 'success' ? 'alert-success' : 'alert-danger'}>
            {msg.tipo === 'success' ? '?' : '??'} {msg.texto}
          </div>
        )}

        <div className="reporte-titulo">CUENTA POR COBRAR - COBRANZA</div>

        <table className="tabla-cxc">
          <thead>
            <tr>
              <th><b>RUC</b></th>
              <th><b>Cliente</b></th>
              <th><b>Doc.Venta</b></th>
              <th><b>FEC.DOC.</b></th>
              <th><b>FEC.VEN.</b></th>
              <th><b>REFERENCIA</b></th>
              <th><b>MO</b></th>
              <th><b>M.</b></th>
              <th><b>Saldo</b></th>
              <th><b>OT</b></th>
              <th><b>RESPONSABLE</b></th>
            </tr>
          </thead>
          <tbody>
            {datos.length === 0 ? (
              <tr>
                <td colSpan="11" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                  No hay registros para mostrar.
                </td>
              </tr>
            ) : (
              <>
                {datos.map((d, i) => (
                  <React.Fragment key={i}>
                    <tr>
                      <td>{d.ruc}</td>
                      <td>{d.cliente}</td>
                      <td>{d.docventa}</td>
                      <td align="center">{d.fecdoc}</td>
                      <td align="center">{d.fecven}</td>
                      <td>{d.ref}</td>
                      <td>{d.mo}</td>
                      <td align="right">{d.m}</td>
                      <td align="right">{d.saldo.toFixed(2)}</td>
                      <td></td>
                      <td>{d.responsable}</td>
                    </tr>
                    <tr className="fila-anexo">
                      <td colSpan="7">SALDO DEL DOCUMENTO : {d.ruc || ''}</td>
                      <td>{d.m}</td>
                      <td>{d.saldo.toFixed(2)}</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr className="fila-anexo">
                      <td colSpan="7"><b>SALDO DE CLIENTE : {d.ruc || ''}</b></td>
                      <td><b>{d.m}</b></td>
                      <td><b>{d.saldo.toFixed(2)}</b></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td colSpan="11"></td>
                    </tr>
                  </React.Fragment>
                ))}
              </>
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

export default CxcCobranza;
