import React, { useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// DATOS INICIALES
// ─────────────────────────────────────────────────────────────────────────────
const PAISES_INIT = [
  {id:1, nombre:'Argentina', codigo:'54'}, {id:2, nombre:'Bolivia', codigo:'591'},
  {id:3, nombre:'Brasil', codigo:'55'}, {id:4, nombre:'Chile', codigo:'56'},
  {id:5, nombre:'Colombia', codigo:'57'}, {id:6, nombre:'Costa Rica', codigo:'506'},
  {id:7, nombre:'Cuba', codigo:'53'}, {id:8, nombre:'Ecuador', codigo:'593'},
  {id:9, nombre:'El Salvador', codigo:'503'}, {id:10, nombre:'Estados Unidos', codigo:'1.1'},
  {id:11, nombre:'Guatemala', codigo:'502'}, {id:12, nombre:'Honduras', codigo:'504'},
  {id:13, nombre:'Mexico', codigo:'52'}, {id:14, nombre:'Nicaragua', codigo:'505'},
  {id:15, nombre:'Panama', codigo:'507'}, {id:16, nombre:'Paraguay', codigo:'595'},
  {id:17, nombre:'Peru', codigo:'51'}, {id:18, nombre:'Rep. Dominicana', codigo:'1'},
  {id:19, nombre:'Uruguay', codigo:'598'}, {id:20, nombre:'Venezuela', codigo:'58'},
];

const CONTABLE_INIT = [
  {id:5,    nombre:'PlanContable'}, {id:1864, nombre:'TipoDocumentoIdentidad'},
  {id:1870, nombre:'TipoMoneda'},   {id:1891, nombre:'TipoOperación'},
  {id:1909, nombre:'TipoComprobantePagoDocumento'}, {id:1935, nombre:'TipoDEafectacionIGV'},
  {id:1955, nombre:'TipoDEnotaDeCredito'}, {id:1965, nombre:'TipoDEnotaDeDebito'},
  {id:1968, nombre:'Tipo Operacion'}, {id:1974, nombre:'UnidadMedida'},
  {id:1991, nombre:'Motivo traslado'}, {id:2001, nombre:'Detraccion'},
  {id:2036, nombre:'Retencion'}, {id:2039, nombre:'Percepcion'},
];

const TABLAS_INIT = [
  {id:1, nombre:'Linea'}, {id:2, nombre:'Marca'}, {id:3, nombre:'Servicio'},
  {id:160, nombre:'Sexo'}, {id:164, nombre:'Tipo de articulo'},
];

const BANCOS_INIT = [
  {id:1,  nombre:'Banco Central del Reserva BCR'},
  {id:2,  nombre:'Banco de Comercio'},
  {id:3,  nombre:'Banco de Crédito del Perú - BCP'},
  {id:4,  nombre:'Banco de la Nación'},
  {id:5,  nombre:'Banco del Trabajo'},
  {id:6,  nombre:'Banco Falabella Peru'},
  {id:7,  nombre:'Banco Financiero del Perú'},
  {id:8,  nombre:'Banco Interamericano de Finanzas'},
  {id:9,  nombre:'Banco Ripley'},
  {id:10, nombre:'Bancos Continental BBVA'},
  {id:11, nombre:'Caja'},
  {id:12, nombre:'Citibank'},
  {id:13, nombre:'HSBC'},
  {id:14, nombre:'Interbank'},
  {id:15, nombre:'Mi Banco'},
  {id:16, nombre:'Scotiabank'},
  {id:17, nombre:'Yape'},
];

const CUENTAS_INIT = [
  {id:4, banco:'Interbank',                       nro:'4423115267400',       tipo:'Ahorros', moneda:'Soles'},
  {id:3, banco:'Bancos Continental BBVA',         nro:'001101750200836572',  tipo:'Ahorros', moneda:'Soles'},
  {id:2, banco:'Banco de Crédito del Perú - BCP', nro:'19117637628084',      tipo:'Ahorros', moneda:'Soles'},
  {id:1, banco:'Yape',                            nro:'986638034',           tipo:'Ahorros', moneda:'Soles'},
];

const TIPOS_LETRA_INIT = [];

// ─────────────────────────────────────────────────────────────────────────────
// ESTILOS GLOBALES
// ─────────────────────────────────────────────────────────────────────────────
const S = `
  @keyframes pulse-ring {
    0%   { box-shadow:0 0 0 0 rgba(255,255,255,.55); }
    70%  { box-shadow:0 0 0 14px rgba(255,255,255,0); }
    100% { box-shadow:0 0 0 0 rgba(255,255,255,0); }
  }
  @keyframes card-pop  { 0%{transform:scale(1)} 40%{transform:scale(1.07)} 100%{transform:scale(1)} }
  @keyframes icon-spin { 0%{transform:rotate(0deg) scale(1)} 50%{transform:rotate(12deg) scale(1.18)} 100%{transform:rotate(0deg) scale(1)} }
  @keyframes fadeIn    { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

  .u-wrap  { padding:20px; font-family:Arial,Helvetica,sans-serif; font-size:13px; }
  .u-wrap * { box-sizing:border-box; }

  /* ── MENÚ CARDS ── */
  .u-title { font-size:13px; color:#666; letter-spacing:1px; text-transform:uppercase; margin-bottom:24px; }
  .u-grid  { display:flex; flex-wrap:wrap; gap:0; border-radius:6px; overflow:hidden; box-shadow:0 6px 24px rgba(0,0,0,.18); }
  .u-card  { flex:1 1 150px; min-width:130px; height:200px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:18px; cursor:pointer; position:relative; overflow:hidden; transition:filter .22s,transform .22s; user-select:none; }
  .u-card::before { content:''; position:absolute; inset:0; background:rgba(0,0,0,0); transition:background .22s; }
  .u-card:hover::before { background:rgba(0,0,0,.12); }
  .u-card.anim { animation:card-pop .38s ease forwards; }
  .u-circle { width:70px; height:70px; border-radius:50%; background:rgba(255,255,255,.18); border:2px solid rgba(255,255,255,.35); display:flex; align-items:center; justify-content:center; transition:background .22s; position:relative; z-index:1; }
  .u-card:hover .u-circle { background:rgba(255,255,255,.28); animation:pulse-ring .7s ease; }
  .u-card.anim .u-circle { animation:icon-spin .38s ease; }
  .u-clabel { font-size:14px; font-weight:bold; color:#fff; text-align:center; position:relative; z-index:1; text-shadow:0 1px 3px rgba(0,0,0,.25); }

  /* ── SUBVISTAS ── */
  .sv-wrap { animation:fadeIn .25s ease; }
  .sv-header { display:flex; align-items:center; gap:10px; border-bottom:2px solid #00A3E1; padding-bottom:8px; margin-bottom:18px; flex-wrap:wrap; }
  .sv-title  { font-size:16px; font-weight:bold; color:#212529; }
  .sv-back   { background:#6c757d; border:1px solid #6c757d; color:#fff; padding:5px 12px; cursor:pointer; font-size:12px; font-weight:bold; border-radius:4px; }
  .sv-back:hover { background:#5a6268; }

  .sv-form   { display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:18px; background:#f8f9fa; border:1px solid #dee2e6; border-radius:6px; padding:12px 16px; }
  .sv-form input[type="text"],
  .sv-form input[type="file"] { padding:5px 8px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; }
  .sv-form input[type="text"] { width:220px; }
  .sv-form label { font-weight:bold; font-size:13px; }

  .btn-teal  { background:#17a2b8; border:1px solid #17a2b8; color:#fff; padding:6px 14px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:5px; }
  .btn-teal:hover { background:#138496; }
  .btn-green { background:#28a745; border:1px solid #28a745; color:#fff; padding:6px 14px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:5px; }
  .btn-green:hover { background:#218838; }

  .sv-table-title { font-weight:bold; font-size:14px; margin-bottom:8px; }
  .sv-link        { color:#007bff; cursor:pointer; font-size:12px; text-decoration:underline; margin-bottom:12px; display:inline-block; }

  table.sv-tbl { width:100%; border-collapse:collapse; font-size:13px; }
  table.sv-tbl thead tr { background:#17a2b8; }
  table.sv-tbl thead th { padding:10px 8px; text-align:left; font-weight:bold; color:#fff; }
  table.sv-tbl tbody tr:nth-child(odd)  { background:#F2F2EC; }
  table.sv-tbl tbody tr:nth-child(even) { background:#fff; }
  table.sv-tbl tbody tr:hover           { background:#CCFF66 !important; }
  table.sv-tbl tbody td { padding:8px; color:#212529; vertical-align:middle; }
  table.sv-tbl .td-center { text-align:center; }

  .btn-del { background:none; border:none; cursor:pointer; color:#dc3545; font-size:16px; padding:2px 5px; }
  .btn-del:hover { color:#a71d2a; }
  .btn-edit { background:none; border:none; cursor:pointer; color:#17a2b8; font-size:16px; padding:2px 5px; }
  .btn-edit:hover { color:#0f6674; }

  .alert-ok  { background:#d4edda; border:1px solid #c3e6cb; color:#155724; padding:7px 14px; border-radius:4px; margin-bottom:12px; font-size:13px; display:inline-block; }
  .alert-err { background:#f8d7da; border:1px solid #f5c6cb; color:#721c24; padding:7px 14px; border-radius:4px; margin-bottom:12px; font-size:13px; display:inline-block; }

  /* modal cuenta banco */
  .mo-overlay { position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:9999; display:flex; align-items:center; justify-content:center; }
  .mo-box     { background:#fff; border-radius:8px; padding:24px; width:460px; max-width:95%; box-shadow:0 10px 40px rgba(0,0,0,.3); }
  .mo-title   { font-size:15px; font-weight:bold; border-bottom:2px solid #00A3E1; padding-bottom:8px; margin-bottom:16px; }
  .mo-field   { display:flex; flex-direction:column; gap:4px; margin-bottom:12px; }
  .mo-field label { font-weight:bold; font-size:13px; }
  .mo-field input, .mo-field select { padding:5px 8px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; }
  .mo-actions { display:flex; gap:8px; justify-content:flex-end; margin-top:16px; }
`;

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: tabla genérica con Nro / Nombre / Opciones
// ─────────────────────────────────────────────────────────────────────────────
function TablaSimple({ titulo, columnas, filas, onEliminar, extra }) {
  return (
    <>
      <div className="sv-table-title">{titulo}</div>
      {extra}
      <table className="sv-tbl">
        <thead><tr>{columnas.map(c => <th key={c.k}>{c.l}</th>)}</tr></thead>
        <tbody>
          {filas.length === 0
            ? <tr><td colSpan={columnas.length} style={{textAlign:'center',color:'#888',padding:20}}>Sin registros.</td></tr>
            : filas.map((f, i) => (
              <tr key={f.id}>
                <td className="td-center"><b>{i+1}</b></td>
                {columnas.slice(1, -1).map(c => <td key={c.k}>{f[c.k]}</td>)}
                <td className="td-center">
                  {onEliminar && (
                    <button className="btn-del" title="Eliminar"
                      onClick={() => onEliminar(f.id)}>✕</button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-VISTAS
// ─────────────────────────────────────────────────────────────────────────────

// 1 ── UBIGEO
function Ubigeo({ onBack }) {
  const [paises, setPaises] = useState(PAISES_INIT);
  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [msg, setMsg] = useState('');

  const guardar = () => {
    if (!nombre.trim() || !codigo.trim()) return setMsg('err:Complete nombre y código.');
    setPaises(p => [...p, { id: Date.now(), nombre: nombre.trim(), codigo: codigo.trim() }]);
    setNombre(''); setCodigo('');
    setMsg('ok:País guardado.');
    setTimeout(() => setMsg(''), 2000);
  };
  const eliminar = (id) => { if (window.confirm('¿Eliminar?')) setPaises(p => p.filter(x => x.id !== id)); };

  return (
    <div className="sv-wrap">
      <div className="sv-header">
        <button className="sv-back" onClick={onBack}>◀ Utilitario</button>
        <span className="sv-title">📍 Ubigeo — Listado de Países</span>
      </div>
      {msg && <div className={msg.startsWith('ok') ? 'alert-ok' : 'alert-err'}>{msg.startsWith('ok') ? '✅' : '⚠️'} {msg.slice(3)}</div>}
      <div className="sv-form">
        <label>Ingrese Nuevo País</label>
        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre del país" />
        <input type="text" value={codigo} onChange={e => setCodigo(e.target.value)} placeholder="Código" style={{width:90}} />
        <button className="btn-teal" onClick={guardar}>➕ Guardar</button>
      </div>
      <div className="sv-link">📅 Aniversario x Mes</div>
      <TablaSimple
        titulo="LISTADO GENERAL"
        columnas={[{k:'nro',l:'Nro'},{k:'nombre',l:'País'},{k:'codigo',l:'Código'},{k:'opc',l:'Opc.'}]}
        filas={paises}
        onEliminar={eliminar}
      />
    </div>
  );
}

// 2 ── CONTABLE
function Contable({ onBack }) {
  const [items, setItems] = useState(CONTABLE_INIT);
  const [nueva, setNueva] = useState('');
  const [msg, setMsg] = useState('');

  const guardar = () => {
    if (!nueva.trim()) return setMsg('err:Ingrese nombre de tabla.');
    setItems(p => [...p, { id: Date.now(), nombre: nueva.trim() }]);
    setNueva('');
    setMsg('ok:Tabla guardada.');
    setTimeout(() => setMsg(''), 2000);
  };
  const eliminar = (id) => { if (window.confirm('¿Eliminar?')) setItems(p => p.filter(x => x.id !== id)); };

  return (
    <div className="sv-wrap">
      <div className="sv-header">
        <button className="sv-back" onClick={onBack}>◀ Utilitario</button>
        <span className="sv-title">💰 Contable — Tablas</span>
      </div>
      {msg && <div className={msg.startsWith('ok') ? 'alert-ok' : 'alert-err'}>{msg.startsWith('ok') ? '✅' : '⚠️'} {msg.slice(3)}</div>}
      <div className="sv-form">
        <label>Ingrese Nuevo Tabla</label>
        <input type="text" value={nueva} onChange={e => setNueva(e.target.value)} placeholder="Nombre tabla" style={{width:300}} />
        <button className="btn-teal" onClick={guardar}>➕ Guardar</button>
      </div>
      <TablaSimple
        titulo="LISTADO GENERAL"
        columnas={[{k:'nro',l:'Nro'},{k:'nombre',l:'Tabla'},{k:'opc',l:'Opc.'}]}
        filas={items}
        onEliminar={eliminar}
      />
    </div>
  );
}

// 3 ── TABLAS
function Tablas({ onBack }) {
  const [items, setItems] = useState(TABLAS_INIT);
  const [nueva, setNueva] = useState('');
  const [msg, setMsg] = useState('');

  const guardar = () => {
    if (!nueva.trim()) return setMsg('err:Ingrese nombre de tabla.');
    setItems(p => [...p, { id: Date.now(), nombre: nueva.trim() }]);
    setNueva('');
    setMsg('ok:Tabla guardada.');
    setTimeout(() => setMsg(''), 2000);
  };
  const eliminar = (id) => { if (window.confirm('¿Eliminar?')) setItems(p => p.filter(x => x.id !== id)); };

  return (
    <div className="sv-wrap">
      <div className="sv-header">
        <button className="sv-back" onClick={onBack}>◀ Utilitario</button>
        <span className="sv-title">🗂️ Tablas</span>
      </div>
      {msg && <div className={msg.startsWith('ok') ? 'alert-ok' : 'alert-err'}>{msg.startsWith('ok') ? '✅' : '⚠️'} {msg.slice(3)}</div>}
      <div className="sv-form">
        <label>Ingrese Nuevo Tabla</label>
        <input type="text" value={nueva} onChange={e => setNueva(e.target.value)} placeholder="Nombre tabla" style={{width:300}} />
        <button className="btn-teal" onClick={guardar}>➕ Guardar</button>
      </div>
      <TablaSimple
        titulo="LISTADO GENERAL DE TABLAS"
        columnas={[{k:'nro',l:'Nro'},{k:'nombre',l:'Tabla'},{k:'opc',l:'Opc.'}]}
        filas={items}
        onEliminar={eliminar}
      />
    </div>
  );
}

// 4 ── BANCO
function Banco({ onBack }) {
  const [bancos, setBancos] = useState(BANCOS_INIT);
  const [nuevo, setNuevo] = useState('');
  const [msg, setMsg] = useState('');

  const guardar = () => {
    if (!nuevo.trim()) return setMsg('err:Ingrese nombre del banco.');
    setBancos(p => [...p, { id: Date.now(), nombre: nuevo.trim() }]);
    setNuevo('');
    setMsg('ok:Banco agregado.');
    setTimeout(() => setMsg(''), 2000);
  };
  const eliminar = (id) => { if (window.confirm('¿Eliminar?')) setBancos(p => p.filter(x => x.id !== id)); };

  return (
    <div className="sv-wrap">
      <div className="sv-header">
        <button className="sv-back" onClick={onBack}>◀ Utilitario</button>
        <span className="sv-title">🏦 Banco</span>
      </div>
      {msg && <div className={msg.startsWith('ok') ? 'alert-ok' : 'alert-err'}>{msg.startsWith('ok') ? '✅' : '⚠️'} {msg.slice(3)}</div>}
      <div className="sv-form">
        <label>Ingrese Nombre del Banco</label>
        <input type="text" value={nuevo} onChange={e => setNuevo(e.target.value)} placeholder="Nombre del banco" style={{width:280}} />
        <button className="btn-teal" onClick={guardar}>➕ Agregar</button>
      </div>
      <TablaSimple
        titulo="LISTADO GENERAL DE BANCOS"
        columnas={[{k:'nro',l:'Nro'},{k:'nombre',l:'Banco'},{k:'opc',l:'Eli.'}]}
        filas={bancos}
        onEliminar={eliminar}
      />
    </div>
  );
}

// 5 ── CUENTA BANCO
const CUENTA_VACIA = { banco:'', nro:'', tipo:'Ahorros', moneda:'Soles' };
const TIPOS_CUENTA = ['Ahorros','Corriente','CTS','Plazo Fijo'];
const MONEDAS_CUENTA = ['Soles','Dólares','Euros'];

function CuentaBanco({ onBack }) {
  const [cuentas, setCuentas] = useState(CUENTAS_INIT);
  const [buscar, setBuscar] = useState('');
  const [modal, setModal] = useState(null); // null | 'nuevo' | objeto(editar)
  const [form, setForm] = useState(CUENTA_VACIA);
  const [msg, setMsg] = useState('');

  const filtradas = cuentas.filter(c =>
    !buscar || c.banco.toLowerCase().includes(buscar.toLowerCase())
  );

  const abrirNuevo  = () => { setForm(CUENTA_VACIA); setModal('nuevo'); };
  const abrirEditar = (c) => { setForm({...c}); setModal(c); };

  const guardar = () => {
    if (!form.banco.trim() || !form.nro.trim()) return setMsg('err:Banco y número son obligatorios.');
    if (modal === 'nuevo') setCuentas(p => [...p, { ...form, id: Date.now() }]);
    else setCuentas(p => p.map(c => c.id === modal.id ? { ...form } : c));
    setModal(null);
    setMsg('ok:Cuenta guardada.');
    setTimeout(() => setMsg(''), 2000);
  };
  const eliminar = (id) => { if (window.confirm('¿Eliminar?')) setCuentas(p => p.filter(c => c.id !== id)); };
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="sv-wrap">
      <div className="sv-header">
        <button className="sv-back" onClick={onBack}>◀ Utilitario</button>
        <span className="sv-title">💳 Cuentas de los Bancos</span>
      </div>
      {msg && <div className={msg.startsWith('ok') ? 'alert-ok' : 'alert-err'}>{msg.startsWith('ok') ? '✅' : '⚠️'} {msg.slice(3)}</div>}
      <div className="sv-form">
        <label>Buscar x Nombre del Banco</label>
        <input type="text" value={buscar} onChange={e => setBuscar(e.target.value)} placeholder="Nombre del banco" />
        <button className="btn-teal">🔍 Buscar</button>
        <button className="btn-green" onClick={abrirNuevo}>➕ Agregar Nueva Cuenta</button>
      </div>
      <div className="sv-table-title">LISTADO GENERAL DE CUENTA DEL BANCO</div>
      <table className="sv-tbl">
        <thead><tr>
          <th>Banco</th><th>Nro</th><th>Tipo</th><th>Moneda</th><th style={{width:80}}>Actualizar</th>
        </tr></thead>
        <tbody>
          {filtradas.length === 0
            ? <tr><td colSpan={5} style={{textAlign:'center',color:'#888',padding:20}}>Sin cuentas.</td></tr>
            : filtradas.map(c => (
              <tr key={c.id}>
                <td><b>{c.banco}</b></td>
                <td>{c.nro}</td>
                <td>{c.tipo}</td>
                <td>{c.moneda}</td>
                <td className="td-center">
                  <button className="btn-edit" title="Editar" onClick={() => abrirEditar(c)}>✏️</button>
                  <button className="btn-del" title="Eliminar" onClick={() => eliminar(c.id)}>✕</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {modal && (
        <div className="mo-overlay" onClick={() => setModal(null)}>
          <div className="mo-box" onClick={e => e.stopPropagation()}>
            <div className="mo-title">💳 {modal === 'nuevo' ? 'Nueva Cuenta' : 'Editar Cuenta'}</div>
            <div className="mo-field"><label>Banco <span style={{color:'#dc3545'}}>(*)</span></label>
              <input type="text" value={form.banco} onChange={e => f('banco', e.target.value)} placeholder="Nombre del banco" /></div>
            <div className="mo-field"><label>Número de Cuenta <span style={{color:'#dc3545'}}>(*)</span></label>
              <input type="text" value={form.nro} onChange={e => f('nro', e.target.value)} placeholder="Nro de cuenta" /></div>
            <div className="mo-field"><label>Tipo</label>
              <select value={form.tipo} onChange={e => f('tipo', e.target.value)}>
                {TIPOS_CUENTA.map(t => <option key={t}>{t}</option>)}
              </select></div>
            <div className="mo-field"><label>Moneda</label>
              <select value={form.moneda} onChange={e => f('moneda', e.target.value)}>
                {MONEDAS_CUENTA.map(m => <option key={m}>{m}</option>)}
              </select></div>
            <div className="mo-actions">
              <button className="btn-teal" onClick={guardar}>💾 Guardar</button>
              <button className="sv-back" onClick={() => setModal(null)}>✕ Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 6 ── T.LETRA
function TipoLetra({ onBack }) {
  const [items, setItems] = useState(TIPOS_LETRA_INIT);
  const [nuevo, setNuevo] = useState('');
  const [msg, setMsg] = useState('');

  const guardar = () => {
    if (!nuevo.trim()) return setMsg('err:Ingrese el tipo de letra.');
    setItems(p => [...p, { id: Date.now(), nombre: nuevo.trim() }]);
    setNuevo('');
    setMsg('ok:Tipo de letra guardado.');
    setTimeout(() => setMsg(''), 2000);
  };
  const eliminar = (id) => { if (window.confirm('¿Eliminar?')) setItems(p => p.filter(x => x.id !== id)); };

  return (
    <div className="sv-wrap">
      <div className="sv-header">
        <button className="sv-back" onClick={onBack}>◀ Utilitario</button>
        <span className="sv-title">🔤 Tipo de Letra</span>
      </div>
      {msg && <div className={msg.startsWith('ok') ? 'alert-ok' : 'alert-err'}>{msg.startsWith('ok') ? '✅' : '⚠️'} {msg.slice(3)}</div>}
      <div className="sv-form">
        <label>Ingrese Nuevo Tipo de Letra</label>
        <input type="text" value={nuevo} onChange={e => setNuevo(e.target.value)} placeholder="Título / tipo" style={{width:280}} />
        <button className="btn-teal" onClick={guardar}>➕ Guardar</button>
      </div>
      <TablaSimple
        titulo="LISTADO GENERAL TIPO DE LETRA"
        columnas={[{k:'nro',l:'Nro'},{k:'nombre',l:'Título'},{k:'opc',l:'Opc.'}]}
        filas={items}
        onEliminar={eliminar}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CARDS del menú principal
// ─────────────────────────────────────────────────────────────────────────────
const ITEMS = [
  { key:'ubigeo',       label:'Ubigeo',       color:'#E8811A',
    svg:'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z' },
  { key:'contable',     label:'Contable',     color:'#17A2B8',
    svg:'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z' },
  { key:'tablas',       label:'Tablas',       color:'#2BBBCE',
    svg:'M3 3h8v8H3zm0 10h8v8H3zm10-10h8v8h-8zm0 10h8v8h-8z' },
  { key:'banco',        label:'Banco',        color:'#2B6CB0',
    svg:'M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zM11.5 1L2 6v2h19V6l-9.5-5z' },
  { key:'cuentabanco',  label:'Cuenta Banco', color:'#2D3F5A',
    svg:'M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z' },
  { key:'tletra',       label:'T.Letra',      color:'#3D4F60',
    svg:'M5 17v2h14v-2H5zm4.5-4.2h5l.9 2.2h2.1L12.75 4h-1.5L6.5 15h2.1l.9-2.2zM12 5.98L13.87 11h-3.74L12 5.98z' },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
export default function Utilitario() {
  const [vista, setVista]       = useState('menu');
  const [animating, setAnim]    = useState(null);

  const handleCard = (key, idx) => {
    setAnim(idx);
    setTimeout(() => { setAnim(null); setVista(key); }, 320);
  };
  const goBack = () => setVista('menu');

  const renderVista = () => {
    switch (vista) {
      case 'ubigeo':      return <Ubigeo      onBack={goBack} />;
      case 'contable':    return <Contable    onBack={goBack} />;
      case 'tablas':      return <Tablas      onBack={goBack} />;
      case 'banco':       return <Banco       onBack={goBack} />;
      case 'cuentabanco': return <CuentaBanco onBack={goBack} />;
      case 'tletra':      return <TipoLetra   onBack={goBack} />;
      default:            return null;
    }
  };

  return (
    <>
      <style>{S}</style>
      <div className="u-wrap">
        {vista === 'menu' ? (
          <>
            <div className="u-title">UTILITARIO</div>
            <div className="u-grid">
              {ITEMS.map((item, idx) => (
                <div key={item.key}
                  className={`u-card${animating === idx ? ' anim' : ''}`}
                  style={{ background: item.color }}
                  onClick={() => handleCard(item.key, idx)}
                  title={item.label}
                >
                  <div className="u-circle">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
                      <path d={item.svg} />
                    </svg>
                  </div>
                  <span className="u-clabel">{item.label}</span>
                </div>
              ))}
            </div>
          </>
        ) : renderVista()}
      </div>
    </>
  );
}