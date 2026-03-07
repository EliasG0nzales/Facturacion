import React, { useState, useRef } from 'react';

const styles = `
  .page-container { padding:20px; font-family:Arial,Helvetica,sans-serif; font-size:13px; }
  .page-container * { color:#212529; box-sizing:border-box; }

  .page-title { font-size:16px; font-weight:bold; margin-bottom:16px; display:flex; align-items:center; gap:8px; }

  /* FILTROS */
  .filtro-wrap { margin-bottom:20px; }
  .filtro-row1 { display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:6px; }
  .filtro-row2 { display:flex; align-items:flex-end; gap:10px; flex-wrap:wrap; }
  .filtro-label { font-weight:bold; font-size:13px; white-space:nowrap; }
  .radio-group  { display:flex; align-items:center; gap:10px; }
  .radio-group label { display:flex; align-items:center; gap:3px; cursor:pointer; font-size:13px; white-space:nowrap; }
  .radio-group input[type="radio"] { accent-color:#17a2b8; cursor:pointer; }

  .filtro-texto-wrap { display:flex; align-items:center; gap:6px; flex:1; min-width:220px; }
  .filtro-texto-wrap input[type="text"] { flex:1; padding:6px 10px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; }
  .filtro-texto-wrap input::placeholder { color:#adb5bd; }
  .yo-label { font-weight:bold; font-size:13px; }

  /* DATE PICKER */
  .filtro-fecha { display:flex; flex-direction:column; gap:3px; }
  .filtro-fecha label { font-size:12px; font-weight:bold; }
  .date-group { display:flex; align-items:center; border:1px solid #ced4da; border-radius:4px; background:#fff; overflow:hidden; width:165px; }
  .date-group .date-text { flex:1; border:none; outline:none; padding:6px 8px; font-size:13px; color:#212529; background:transparent; cursor:pointer; }
  .date-group input[type="date"] { position:absolute; opacity:0; width:0; height:0; pointer-events:none; }
  .date-group .cal-btn { background:#fff; border:none; border-left:1px solid #ced4da; padding:0 7px; height:34px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

  .botonBuscar { background:#17a2b8; border:1px solid #17a2b8; color:#fff !important; padding:6px 16px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:5px; height:34px; white-space:nowrap; }
  .botonBuscar:hover { background:#138496; }

  /* TABLA */
  .tabla-titulo { text-align:center; font-weight:bold; font-size:14px; padding:6px 0; }
  table { width:100%; border-collapse:collapse; font-size:13px; }
  table thead tr { background:#17a2b8; }
  table thead th { padding:10px 8px; text-align:center; font-weight:bold; color:#fff !important; white-space:nowrap; }
  table tbody tr { background:#fff; border-bottom:1px solid #dee2e6; }
  table tbody tr:hover { background:#f8f9fa; }
  table tbody td { padding:8px 10px; color:#212529; }
  .empty-msg { text-align:center; color:#888; padding:20px; }

  /* badges envio */
  .badge-pendiente { background:#ffc107; color:#212529 !important; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:bold; }
  .badge-enviado   { background:#28a745; color:#fff !important;    padding:2px 8px; border-radius:10px; font-size:11px; font-weight:bold; }
  .badge-anulado   { background:#dc3545; color:#fff !important;    padding:2px 8px; border-radius:10px; font-size:11px; font-weight:bold; }

  /* OPCION botones */
  .acciones { display:flex; gap:5px; justify-content:center; }
  .btn-ac { background:none; border:none; cursor:pointer; font-size:14px; padding:2px 5px; border-radius:3px; transition:background .15s; }
  .btn-ac:hover { background:#e0e0e0; }

  /* MODAL detalle pedido */
  .modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:1000; display:flex; align-items:center; justify-content:center; }
  .modal-box { background:#fff; border-radius:6px; padding:24px; width:620px; max-width:96vw; box-shadow:0 4px 24px rgba(0,0,0,0.18); }
  .modal-title { font-size:15px; font-weight:bold; margin-bottom:14px; border-bottom:2px solid #17a2b8; padding-bottom:8px; color:#17a2b8 !important; }
  .modal-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px 20px; margin-bottom:14px; }
  .modal-field { font-size:13px; }
  .modal-field strong { display:block; font-size:11px; color:#888; margin-bottom:2px; }
  .modal-items { width:100%; border-collapse:collapse; font-size:12px; margin-bottom:12px; }
  .modal-items th { background:#17a2b8; color:#fff !important; padding:6px 8px; text-align:center; }
  .modal-items td { padding:5px 8px; border-bottom:1px solid #dee2e6; text-align:center; }
  .modal-btns { display:flex; gap:8px; flex-wrap:wrap; }
  .btn-modal       { background:#17a2b8; border:1px solid #17a2b8; color:#fff !important; padding:6px 16px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; }
  .btn-modal:hover { background:#138496; }
  .btn-modal-grey  { background:#6c757d; border-color:#6c757d; }
  .btn-modal-grey:hover { background:#5a6268; }
  .btn-modal-grn   { background:#28a745; border-color:#28a745; }
  .btn-modal-grn:hover  { background:#218838; }

  .alert-success { background:#d4edda; border:1px solid #c3e6cb; color:#155724 !important; padding:8px 14px; border-radius:4px; margin-bottom:10px; font-size:13px; display:inline-block; }
  .alert-danger  { background:#f8d7da; border:1px solid #f5c6cb; color:#721c24 !important; padding:8px 14px; border-radius:4px; margin-bottom:10px; font-size:13px; display:inline-block; }
`;

/* ---- íconos ---- */
const CalIcon = () => (
  <svg width="22" height="22" viewBox="0 0 36 36" fill="none">
    <rect x="1" y="4" width="34" height="30" rx="3" fill="#fff" stroke="#bbb" strokeWidth="1.5"/>
    <rect x="1" y="4" width="34" height="9"  rx="3" fill="#e74c3c"/>
    <rect x="1" y="9" width="34" height="4"  fill="#e74c3c"/>
    <rect x="10" y="1" width="3" height="7" rx="1.5" fill="#888"/>
    <rect x="23" y="1" width="3" height="7" rx="1.5" fill="#888"/>
    <line x1="1"  y1="18" x2="35" y2="18" stroke="#ddd" strokeWidth="0.8"/>
    <line x1="1"  y1="24" x2="35" y2="24" stroke="#ddd" strokeWidth="0.8"/>
    <line x1="10" y1="13" x2="10" y2="34" stroke="#ddd" strokeWidth="0.8"/>
    <line x1="19" y1="13" x2="19" y2="34" stroke="#ddd" strokeWidth="0.8"/>
    <line x1="28" y1="13" x2="28" y2="34" stroke="#ddd" strokeWidth="0.8"/>
    {[14,19,25].map(y=>[3,12,21,30].map(x=>(
      <rect key={`${x}-${y}`} x={x} y={y} width={x===30?4:5} height="3" rx="0.5" fill="#27ae60"/>
    )))}
  </svg>
);

/* ---- DatePicker ---- */
const DatePicker = ({ label, value, onChange }) => {
  const ref = useRef(null);
  const fmt = iso => { if (!iso) return ''; const [y,m,d]=iso.split('-'); return `${d}/${m}/${y}`; };
  const open = () => { try { ref.current?.showPicker(); } catch { ref.current?.click(); } };
  return (
    <div className="filtro-fecha">
      <label>{label}</label>
      <div className="date-group">
        <span className="date-text" onClick={open}>
          {fmt(value)||<span style={{color:'#adb5bd'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>}
        </span>
        <input ref={ref} type="date" value={value} onChange={e=>onChange(e.target.value)} tabIndex={-1}/>
        <button type="button" className="cal-btn" onClick={open}><CalIcon/></button>
      </div>
    </div>
  );
};

/* ---- datos de ejemplo ---- */
const DATOS_INICIALES = [
  { id:1, nro:'PW-0001', fecha:'2026-03-10', cliente:'García López, María',     ruc:'10456789012', envio:'Pendiente', total:320.00,
    items:[{cod:'A001',desc:'Laptop HP 14"',cant:1,precio:320.00}], direccion:'Av. Lima 123, Miraflores', telefono:'987654321' },
  { id:2, nro:'PW-0002', fecha:'2026-03-12', cliente:'Comercial Norte SAC',     ruc:'20512345678', envio:'Enviado',   total:850.50,
    items:[{cod:'A002',desc:'Monitor 24"',cant:2,precio:350.00},{cod:'A003',desc:'Teclado USB',cant:3,precio:50.17}], direccion:'Jr. Tacna 456, Lima', telefono:'01-2345678' },
  { id:3, nro:'PW-0003', fecha:'2026-03-14', cliente:'Iturri, Quispe, Smith',   ruc:'10123456789', envio:'Anulado',  total:0.00,
    items:[], direccion:'Calle Real 789', telefono:'965432100' },
  { id:4, nro:'PW-0004', fecha:'2026-03-15', cliente:'Distribuidora Sur EIRL',  ruc:'20698765432', envio:'Pendiente',total:1200.00,
    items:[{cod:'B001',desc:'Impresora Laser',cant:1,precio:1200.00}], direccion:'Av. Arequipa 321', telefono:'054-987654' },
];

const RADIO_OPTS = ['Nro','clientes','Ruc/DNI'];

const getBadge = (envio) => {
  if (envio==='Enviado')   return <span className="badge-enviado">Enviado</span>;
  if (envio==='Anulado')   return <span className="badge-anulado">Anulado</span>;
  return <span className="badge-pendiente">Pendiente</span>;
};

const PedidoWeb = () => {
  const [radioSel, setRadioSel]       = useState('Nro');
  const [busqueda, setBusqueda]       = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin]       = useState('');
  const [datos]                       = useState(DATOS_INICIALES);
  const [filtrados, setFiltrados]     = useState(DATOS_INICIALES);
  const [modal, setModal]             = useState(null);
  const [msg, setMsg]                 = useState({tipo:'',texto:''});

  const showMsg = (tipo,texto) => { setMsg({tipo,texto}); setTimeout(()=>setMsg({tipo:'',texto:''}),2500); };

  const buscar = () => {
    let res = [...datos];
    if (fechaInicio) res = res.filter(d=>d.fecha >= fechaInicio);
    if (fechaFin)    res = res.filter(d=>d.fecha <= fechaFin);
    if (busqueda) {
      const txt = busqueda.toLowerCase();
      if (radioSel==='Nro')      res = res.filter(d=>d.nro.toLowerCase().includes(txt));
      if (radioSel==='clientes') res = res.filter(d=>d.cliente.toLowerCase().includes(txt));
      if (radioSel==='Ruc/DNI')  res = res.filter(d=>d.ruc.includes(txt));
    }
    setFiltrados(res);
    showMsg('success', `Se encontraron ${res.length} pedido(s).`);
  };

  const marcarEnviado = (id) => {
    // en producción haría PUT a la API
    showMsg('success','Pedido marcado como Enviado.');
    setModal(null);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="page-container">

        {/* TÍTULO */}
        <div className="page-title">
          <span style={{background:'#17a2b8',color:'#fff',borderRadius:'50%',width:22,height:22,
            display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:'bold'}}>?</span>
          ORDEN DE COMPRA DESDE LA WEB
        </div>

        {msg.texto && <div className={msg.tipo==='success'?'alert-success':'alert-danger'}>{msg.tipo==='success'?'✅':'⚠️'} {msg.texto}</div>}

        {/* FILTROS */}
        <div className="filtro-wrap">
          <div className="filtro-row1">
            <span className="filtro-label">BUSCAR X</span>
            <div className="radio-group">
              {RADIO_OPTS.map(opt=>(
                <label key={opt}>
                  <input type="radio" name="bxp" value={opt}
                    checked={radioSel===opt} onChange={()=>setRadioSel(opt)}/> {opt} /
                </label>
              ))}
            </div>
          </div>
          <div className="filtro-row2">
            <div className="filtro-texto-wrap">
              <input type="text" value={busqueda}
                onChange={e=>setBusqueda(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&buscar()}/>
              <span className="yo-label">y/o</span>
            </div>
            <DatePicker label="Fecha Inicio" value={fechaInicio} onChange={setFechaInicio}/>
            <DatePicker label="Fecha Fin"    value={fechaFin}    onChange={setFechaFin}/>
            <button className="botonBuscar" onClick={buscar}>🔍Buscar</button>
          </div>
        </div>

        {/* TABLA */}
        <div className="tabla-titulo">LISTADO GENERAL</div>
        <table>
          <thead>
            <tr>
              <th width="5%"></th>
              <th width="10%">NRO</th>
              <th width="10%">FECHA</th>
              <th>CLIENTE</th>
              <th width="11%">ENVIO</th>
              <th width="9%">S/.</th>
              <th width="9%">OPCION</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length===0 ? (
              <tr><td colSpan="7" className="empty-msg">No hay pedidos web registrados.</td></tr>
            ) : (
              filtrados.map((d,i)=>(
                <tr key={d.id}>
                  <td align="center" style={{color:'#999',fontSize:12}}>{i+1}</td>
                  <td align="center">{d.nro}</td>
                  <td align="center">{d.fecha}</td>
                  <td>{d.cliente}</td>
                  <td align="center">{getBadge(d.envio)}</td>
                  <td align="right">{d.total.toFixed(2)}</td>
                  <td align="center">
                    <div className="acciones">
                      <button className="btn-ac" title="Ver detalle" onClick={()=>setModal(d)}>👁️</button>
                      <button className="btn-ac" title="Imprimir pedido" onClick={()=>window.print()}>🖨️</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* MODAL DETALLE PEDIDO */}
        {modal && (
          <div className="modal-backdrop" onClick={()=>setModal(null)}>
            <div className="modal-box" onClick={e=>e.stopPropagation()}>
              <div className="modal-title">📦 DETALLE DEL PEDIDO WEB</div>

              <div className="modal-grid">
                <div className="modal-field"><strong>Nro. Pedido</strong>{modal.nro}</div>
                <div className="modal-field"><strong>Fecha</strong>{modal.fecha}</div>
                <div className="modal-field"><strong>Cliente</strong>{modal.cliente}</div>
                <div className="modal-field"><strong>RUC / DNI</strong>{modal.ruc}</div>
                <div className="modal-field"><strong>Dirección</strong>{modal.direccion}</div>
                <div className="modal-field"><strong>Teléfono</strong>{modal.telefono}</div>
                <div className="modal-field"><strong>Estado Envío</strong>{getBadge(modal.envio)}</div>
                <div className="modal-field"><strong>Total S/.</strong><b>{modal.total.toFixed(2)}</b></div>
              </div>

              {modal.items.length > 0 && (
                <table className="modal-items">
                  <thead>
                    <tr><th>Código</th><th>Descripción</th><th>Cant.</th><th>Precio</th><th>Subtotal</th></tr>
                  </thead>
                  <tbody>
                    {modal.items.map((it,idx)=>(
                      <tr key={idx}>
                        <td>{it.cod}</td>
                        <td style={{textAlign:'left'}}>{it.desc}</td>
                        <td>{it.cant}</td>
                        <td>{it.precio.toFixed(2)}</td>
                        <td>{(it.cant*it.precio).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div className="modal-btns">
                {modal.envio==='Pendiente' && (
                  <button className="btn-modal btn-modal-grn" onClick={()=>marcarEnviado(modal.id)}>
                    🚚 Marcar Enviado
                  </button>
                )}
                <button className="btn-modal" onClick={()=>window.print()}>🖨️ Imprimir</button>
                <button className="btn-modal btn-modal-grey" onClick={()=>setModal(null)}>✖ Cerrar</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default PedidoWeb;
