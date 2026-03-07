import React, { useState, useRef } from 'react';

const styles = `
  .page-container { padding:20px; font-family:Arial,Helvetica,sans-serif; font-size:13px; }
  .page-container * { color:#212529; box-sizing:border-box; }

  /* TÍTULO */
  .page-title { font-size:15px; font-weight:bold; margin-bottom:16px; display:flex; align-items:center; justify-content:center; gap:8px; }
  .form-title  { font-size:18px; font-weight:normal; margin-bottom:20px; color:#333; }

  /* FILTROS */
  .filtro-wrap  { margin-bottom:18px; }
  .filtro-row1  { display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:6px; }
  .filtro-row2  { display:flex; align-items:flex-end; gap:10px; flex-wrap:wrap; }
  .filtro-label { font-weight:bold; font-size:13px; white-space:nowrap; }
  .radio-group  { display:flex; align-items:center; gap:14px; }
  .radio-group label { display:flex; align-items:center; gap:4px; cursor:pointer; font-size:13px; white-space:nowrap; }
  .radio-group input[type="radio"] { cursor:pointer; accent-color:#17a2b8; }
  .filtro-texto-wrap { display:flex; align-items:center; gap:6px; flex:1; min-width:220px; }
  .filtro-texto-wrap input[type="text"] { flex:1; padding:6px 10px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; }
  .filtro-texto-wrap input::placeholder { color:#adb5bd; font-style:italic; }
  .yo-label { font-weight:bold; font-size:13px; }

  /* DATE PICKER */
  .filtro-fecha { display:flex; flex-direction:column; gap:3px; }
  .filtro-fecha label { font-size:12px; font-weight:bold; }
  .date-group { display:flex; align-items:center; border:1px solid #ced4da; border-radius:4px; background:#fff; overflow:hidden; width:165px; }
  .date-group .date-text { flex:1; border:none; outline:none; padding:6px 8px; font-size:13px; color:#212529; background:transparent; cursor:pointer; }
  .date-group input[type="date"] { position:absolute; opacity:0; width:0; height:0; pointer-events:none; }
  .date-group .cal-btn { background:#fff; border:none; border-left:1px solid #ced4da; padding:0 7px; height:34px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

  /* DATE PICKER verde (en formulario) */
  .date-group-form { display:flex; align-items:center; border:2px solid #28a745; border-radius:4px; background:#d4edda; overflow:hidden; width:190px; }
  .date-group-form .date-text { flex:1; border:none; outline:none; padding:6px 8px; font-size:13px; color:#212529; background:transparent; cursor:pointer; font-weight:bold; }
  .date-group-form input[type="date"] { position:absolute; opacity:0; width:0; height:0; pointer-events:none; }
  .date-group-form .cal-btn { background:#d4edda; border:none; border-left:2px solid #28a745; padding:0 7px; height:34px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

  .botonBuscar  { background:#17a2b8; border:1px solid #17a2b8; color:#fff !important; padding:6px 14px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:5px; height:34px; }
  .botonBuscar:hover  { background:#138496; }
  .botonAgregar { background:#17a2b8; border:1px solid #17a2b8; color:#fff !important; padding:6px 14px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:5px; height:34px; }
  .botonAgregar:hover { background:#138496; }

  /* TABLA */
  .tabla-titulo { text-align:center; font-weight:bold; font-size:14px; padding:8px 0 4px; }
  table { width:100%; border-collapse:collapse; font-size:13px; }
  table thead tr { background:#17a2b8; }
  table thead th { padding:10px 8px; text-align:center; font-weight:bold; color:#fff !important; white-space:nowrap; }
  table tbody tr { background:#fff; border-bottom:1px solid #dee2e6; }
  table tbody tr:hover { background:#f8f9fa; }
  table tbody td { padding:8px; color:#212529; }
  .empty-msg { text-align:center; color:#888; padding:16px; }
  .total-row td { background:#f0f0f0; font-weight:bold; padding:9px 8px; }

  .acciones { display:flex; gap:5px; justify-content:center; }
  .btn-ac { background:none; border:none; cursor:pointer; font-size:15px; padding:2px 4px; border-radius:3px; transition:background 0.15s; }
  .btn-ac:hover { background:#e0e0e0; }

  /* FORMULARIO */
  .form-wrap { max-width:900px; }
  .tipo-row { display:flex; align-items:center; justify-content:center; gap:12px; margin-bottom:24px; }
  .tipo-row label { font-weight:bold; font-size:14px; }
  .tipo-row select { padding:6px 10px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; min-width:130px; }

  hr.sep { border:none; border-top:1px solid #dee2e6; margin:10px 0 20px; }

  .detalle-titulo { text-align:center; font-weight:bold; font-size:14px; margin-bottom:16px; }

  .form-row { display:flex; align-items:flex-start; gap:12px; flex-wrap:wrap; margin-bottom:16px; }
  .form-group { display:flex; flex-direction:column; gap:4px; }
  .form-group label { font-size:12px; font-weight:bold; color:#212529; }
  .form-group input[type="text"],
  .form-group input[type="number"],
  .form-group select,
  .form-group textarea { padding:6px 10px; border:1px solid #ced4da; border-radius:4px; font-size:13px; color:#212529; background:#fff; }
  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus { border-color:#80bdff; outline:none; box-shadow:0 0 0 0.2rem rgba(0,123,255,.25); }
  .form-group textarea { resize:vertical; min-height:60px; }

  .btn-guardar  { background:#17a2b8; border:1px solid #17a2b8; color:#fff !important; padding:7px 18px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:5px; }
  .btn-guardar:hover  { background:#138496; }
  .btn-limpiar  { background:#17a2b8; border:1px solid #17a2b8; color:#fff !important; padding:7px 18px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:5px; }
  .btn-limpiar:hover  { background:#138496; }
  .btn-regresar { background:#17a2b8; border:1px solid #17a2b8; color:#fff !important; padding:7px 18px; cursor:pointer; font-size:13px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; gap:5px; }
  .btn-regresar:hover { background:#138496; }
  .btns-row { display:flex; justify-content:center; gap:10px; margin-top:20px; }

  .alert-success { background:#d4edda; border:1px solid #c3e6cb; color:#155724 !important; padding:8px 14px; border-radius:4px; margin-bottom:10px; font-size:13px; display:inline-block; }
  .alert-danger  { background:#f8d7da; border:1px solid #f5c6cb; color:#721c24 !important; padding:8px 14px; border-radius:4px; margin-bottom:10px; font-size:13px; display:inline-block; }
`;

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

const DatePicker = ({ value, onChange, verde }) => {
  const ref = useRef(null);
  const fmt = iso => { if (!iso) return ''; const [y,m,d]=iso.split('-'); return `${y}-${m}-${d}`; };
  const open = () => { try { ref.current?.showPicker(); } catch { ref.current?.click(); } };
  const cls = verde ? 'date-group-form' : 'date-group';
  return (
    <div className={cls}>
      <span className="date-text" onClick={open}>{fmt(value)||<span style={{color:'#adb5bd'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>}</span>
      <input ref={ref} type="date" value={value} onChange={e=>onChange(e.target.value)} tabIndex={-1}/>
      <button type="button" className="cal-btn" onClick={open}><CalIcon/></button>
    </div>
  );
};

const DatePickerLabel = ({ label, value, onChange }) => (
  <div className="filtro-fecha">
    <label>{label}</label>
    <DatePicker value={value} onChange={onChange}/>
  </div>
);

const RESPONSABLES = [
  '',
  'fac-tura.com',
  'Iturri, Quispe, Smith',
  'Merino, Cahuna, Wilver Enmanuel',
  'Romero, Merino, Alexander Renson',
  'Yupanqui, Barboza, Raysa',
];
const TIPO_GASTOS  = ['','Otros','Planilla'];
const MONEDAS      = ['Soles','Dolares'];

const DATOS_INICIALES = [
  { id:1, fecha:'2024-03-05', responsable:'Yupanqui, Barboza, Raysa',         a:'Planilla', motivo:'Pago de planilla mensual',    soles:3500.00, dolares:0.00   },
  { id:2, fecha:'2024-03-10', responsable:'Merino, Cahuna, Wilver Enmanuel',  a:'Otros',    motivo:'Compra de útiles de oficina', soles:150.00,  dolares:0.00   },
  { id:3, fecha:'2024-03-15', responsable:'Romero, Merino, Alexander Renson', a:'Otros',    motivo:'Mantenimiento de equipos',    soles:0.00,    dolares:200.00 },
];

const FORM_INIT = { tipo:'', fecha: new Date().toISOString().slice(0,10), a:'', detalle:'', moneda:'Soles', monto:'' };

const Gastos = () => {
  const [vista, setVista]           = useState('lista'); // 'lista' | 'form'
  const [esNuevo, setEsNuevo]       = useState(true);
  const [datos, setDatos]           = useState(DATOS_INICIALES);
  const [filtrados, setFiltrados]   = useState(DATOS_INICIALES);
  const [radioSel, setRadioSel]     = useState('A');
  const [busqueda, setBusqueda]     = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin]     = useState('');
  const [form, setForm]             = useState(FORM_INIT);
  const [msg, setMsg]               = useState({tipo:'',texto:''});

  const showMsg = (tipo,texto) => { setMsg({tipo,texto}); setTimeout(()=>setMsg({tipo:'',texto:''}),2500); };

  const setField = (k,v) => setForm(p=>({...p,[k]:v}));

  const buscar = () => {
    let res = [...datos];
    if (fechaInicio) res = res.filter(d=>d.fecha>=fechaInicio);
    if (fechaFin)    res = res.filter(d=>d.fecha<=fechaFin);
    if (busqueda) {
      const txt = busqueda.toLowerCase();
      if (radioSel==='A')      res = res.filter(d=>d.a.toLowerCase().includes(txt));
      if (radioSel==='Motivo') res = res.filter(d=>d.motivo.toLowerCase().includes(txt));
    }
    setFiltrados(res);
    showMsg('success',`Se encontraron ${res.length} registro(s).`);
  };

  const abrirNuevo = () => { setForm(FORM_INIT); setEsNuevo(true); setVista('form'); };
  const abrirEditar = (d) => {
    setForm({ tipo: d.a==='Planilla'?'Planilla':'Otros', fecha:d.fecha, a:d.a,
      detalle:d.motivo, moneda: d.dolares>0?'Dolares':'Soles',
      monto: d.dolares>0 ? d.dolares : d.soles, id:d.id });
    setEsNuevo(false); setVista('form');
  };

  const guardar = () => {
    if (!form.fecha || !form.a || !form.detalle || !form.monto) {
      showMsg('danger','Complete todos los campos obligatorios (*)'); return;
    }
    const monto = parseFloat(form.monto)||0;
    const nuevo = {
      id: form.id || Date.now(),
      fecha: form.fecha,
      responsable: form.a,
      a: form.tipo||'Otros',
      motivo: form.detalle,
      soles:   form.moneda==='Soles'   ? monto : 0,
      dolares: form.moneda==='Dolares' ? monto : 0,
    };
    if (esNuevo) {
      const nd = [...datos, nuevo];
      setDatos(nd); setFiltrados(nd);
      showMsg('success','Gasto registrado correctamente.');
    } else {
      const nd = datos.map(d=>d.id===nuevo.id?nuevo:d);
      setDatos(nd); setFiltrados(nd);
      showMsg('success','Gasto actualizado correctamente.');
    }
    setVista('lista');
  };

  const eliminar = (id) => {
    if (!window.confirm('¿Eliminar este gasto?')) return;
    const nd = datos.filter(d=>d.id!==id);
    setDatos(nd); setFiltrados(nd);
    showMsg('success','Gasto eliminado.');
  };

  const limpiar = () => setForm(FORM_INIT);

  const totalSoles   = filtrados.reduce((a,d)=>a+d.soles,0).toFixed(2);
  const totalDolares = filtrados.reduce((a,d)=>a+d.dolares,0).toFixed(2);

  /* ---- VISTA LISTA ---- */
  if (vista==='lista') return (
    <>
      <style>{styles}</style>
      <div className="page-container">

        <div className="page-title">
          <span style={{background:'#17a2b8',color:'#fff',borderRadius:'50%',width:22,height:22,display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:13}}>i</span>
          OTROS GASTOS
        </div>

        {msg.texto && <div className={msg.tipo==='success'?'alert-success':'alert-danger'}>{msg.tipo==='success'?'✅':'⚠️'} {msg.texto}</div>}

        <div className="filtro-wrap">
          <div className="filtro-row1">
            <span className="filtro-label">BUSCAR X</span>
            <div className="radio-group">
              {['A','Motivo'].map(opt=>(
                <label key={opt}>
                  <input type="radio" name="bx" value={opt} checked={radioSel===opt} onChange={()=>setRadioSel(opt)}/>{opt}
                </label>
              ))}
            </div>
          </div>
          <div className="filtro-row2">
            <div className="filtro-texto-wrap">
              <input type="text" placeholder="Ingrese el texto a buscar" value={busqueda}
                onChange={e=>setBusqueda(e.target.value)} onKeyDown={e=>e.key==='Enter'&&buscar()}/>
              <span className="yo-label">y/o</span>
            </div>
            <DatePickerLabel label="Fecha Inicio" value={fechaInicio} onChange={setFechaInicio}/>
            <DatePickerLabel label="Fecha Fin"    value={fechaFin}    onChange={setFechaFin}/>
            <button className="botonBuscar"  onClick={buscar}>🔍 Buscar</button>
            <button className="botonAgregar" onClick={abrirNuevo}>+ Agregar Nuevo</button>
          </div>
        </div>

        <div className="tabla-titulo">LISTADO GENERAL DE GASTOS</div>
        <table>
          <thead>
            <tr>
              <th width="6%">OP</th>
              <th width="9%">FECHA</th>
              <th width="12%">RESPONS.</th>
              <th width="9%">A</th>
              <th>MOTIVO</th>
              <th width="10%">S/.</th>
              <th width="10%">US$</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length===0 ? (
              <tr><td colSpan="7" className="empty-msg">No hay gastos registrados.</td></tr>
            ) : (
              filtrados.map(d=>(
                <tr key={d.id}>
                  <td align="center">
                    <div className="acciones">
                      <button className="btn-ac" title="Editar"   onClick={()=>abrirEditar(d)}>✏️</button>
                      <button className="btn-ac" title="Eliminar" onClick={()=>eliminar(d.id)}>🗑️</button>
                    </div>
                  </td>
                  <td align="center">{d.fecha}</td>
                  <td>{d.responsable}</td>
                  <td align="center">{d.a}</td>
                  <td>{d.motivo}</td>
                  <td align="right">{d.soles.toFixed(2)}</td>
                  <td align="right">{d.dolares.toFixed(2)}</td>
                </tr>
              ))
            )}
            {/* Fila Total — igual al screenshot */}
            <tr className="total-row">
              <td colSpan="2"></td>
              <td><strong>Total</strong></td>
              <td colSpan="2"></td>
              <td align="right">{totalSoles}</td>
              <td align="right">{totalDolares}</td>
            </tr>
          </tbody>
        </table>

      </div>
    </>
  );

  /* ---- VISTA FORMULARIO ---- */
  return (
    <>
      <style>{styles}</style>
      <div className="page-container">

        <div className="form-title">GASTOS GENERALES : {esNuevo?'NUEVO':'EDITAR'}</div>
        <hr className="sep"/>

        {msg.texto && <div className={msg.tipo==='success'?'alert-success':'alert-danger'}>{msg.tipo==='success'?'✅':'⚠️'} {msg.texto}</div>}

        <div className="form-wrap">

          {/* Tipo de Gastos — centrado */}
          <div className="tipo-row">
            <label>Tipo de Gastos</label>
            <select value={form.tipo} onChange={e=>setField('tipo',e.target.value)}>
              {TIPO_GASTOS.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <hr className="sep"/>

          {/* Solo muestra detalle si hay tipo seleccionado */}
          {form.tipo && (
            <>
              <div className="detalle-titulo">DETALLE DE PAGO</div>

              <div className="form-row">
                {/* Fecha */}
                <div className="form-group">
                  <label>Fecha (*)</label>
                  <DatePicker value={form.fecha} onChange={v=>setField('fecha',v)} verde={true}/>
                </div>

                {/* A */}
                <div className="form-group" style={{flex:1,minWidth:180}}>
                  <label>A : (*)</label>
                  <select value={form.a} onChange={e=>setField('a',e.target.value)}
                    style={{width:'100%',padding:'6px 10px',border:'1px solid #ced4da',borderRadius:4,fontSize:13}}>
                    {RESPONSABLES.map(r=><option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                {/* Detalle */}
                <div className="form-group" style={{flex:2,minWidth:220}}>
                  <label>Detalle(*)</label>
                  <textarea value={form.detalle} onChange={e=>setField('detalle',e.target.value)}
                    style={{width:'100%',padding:'6px 10px',border:'1px solid #ced4da',borderRadius:4,fontSize:13,minHeight:34,resize:'vertical'}}/>
                </div>

                {/* Moneda */}
                <div className="form-group" style={{minWidth:110}}>
                  <label>Moneda :(*)</label>
                  <select value={form.moneda} onChange={e=>setField('moneda',e.target.value)}
                    style={{padding:'6px 10px',border:'1px solid #ced4da',borderRadius:4,fontSize:13}}>
                    {MONEDAS.map(m=><option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                {/* Monto */}
                <div className="form-group" style={{minWidth:110}}>
                  <label>Monto (*)</label>
                  <input type="number" min="0" step="0.01" value={form.monto}
                    onChange={e=>setField('monto',e.target.value)}
                    style={{width:'100%',padding:'6px 10px',border:'1px solid #ced4da',borderRadius:4,fontSize:13}}/>
                </div>
              </div>

              {/* Botones */}
              <div className="btns-row">
                <button className="btn-guardar"  onClick={guardar}>💾 Guardar</button>
                <button className="btn-limpiar"  onClick={limpiar}>📋 Limpiar</button>
                <button className="btn-regresar" onClick={()=>setVista('lista')}>↩ Regresar</button>
              </div>
            </>
          )}

          {/* Si no hay tipo seleccionado, solo mostrar Regresar */}
          {!form.tipo && (
            <div style={{display:'flex',justifyContent:'center',marginTop:20}}>
              <button className="btn-regresar" onClick={()=>setVista('lista')}>↩ Regresar</button>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Gastos;