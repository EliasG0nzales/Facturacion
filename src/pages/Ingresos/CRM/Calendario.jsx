import { useState } from "react";

const USUARIOS = ['','fac-tura.com','Iturri, Quispe, Smith','Merino, Cahuna, Wilver Enmanuel',
  'Romero, Merino, Alexander Renson','Yupanqui, Barboza, Raysa'];
const IMPORTANCIA = ['Normal','Intermedio','Alto'];
const HORAS_DIA = ['Todo el dia','08:00','08:30','09:00','09:30','10:00','10:30',
  '11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30',
  '15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00'];
const ENCUESTAS = ['','Encuesta satisfacción cliente','Evaluación de servicio','Seguimiento comercial'];
const MESES_ES  = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const DIAS_ES   = ['Lun','Mar','Mie','Jue','Vie','Sab','Dom'];

const horaActual = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
};

const TAREAS_INI = [
  { id:1, tipo:'tarea', fecha:'2026-03-15',
    motivo:'asegurar todo el sistema de facturacion',
    tipoDE:'Usuario', de:'Yupanqui, Barboza, Raysa', para:'Iturri, Quispe, Smith',
    importancia:'Normal', hora:'17:43', encuesta:'', detalle:'se tiene que enviar una captura',
    estado:'Abierto', respuestas:[] },
  { id:2, tipo:'evento', fecha:'2026-03-08',
    titulo:'Reunión de ventas', hora:'09:00', hasta:'10:00',
    invitado:'Merino, Cahuna, Wilver Enmanuel', importancia:'Alto',
    ubicacion:'Sala principal', conferencia:'', detalle:'', estado:'Abierto', respuestas:[] },
];

const diasEnMes = (y,m) => new Date(y,m+1,0).getDate();
const primerDia = (y,m) => { const d=new Date(y,m,1).getDay(); return d===0?6:d-1; };
const fmtFecha  = iso => { if(!iso) return ''; const [y,mo,d]=iso.split('-'); return `${d}/${mo}/${y}`; };

const css = `
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:Arial,Helvetica,sans-serif;font-size:13px;}

  .cal-wrap{width:100%;border:1px solid #ccc;border-radius:4px;overflow:hidden;}
  .cal-head{background:#888;display:flex;align-items:center;justify-content:space-between;padding:8px 18px;}
  .cal-head button{background:none;border:none;color:#fff;font-size:20px;font-weight:bold;cursor:pointer;padding:0 8px;line-height:1;}
  .cal-head button:hover{color:#ddd;}
  .cal-head span{color:#fff;font-size:15px;font-weight:bold;}

  .cal-dns{display:grid;grid-template-columns:repeat(7,1fr);border-bottom:1px solid #ccc;background:#fff;}
  .cal-dns div{padding:10px 0;text-align:center;font-size:13px;color:#555;border-right:1px solid #e0e0e0;}
  .cal-dns div:last-child{border-right:none;}

  .cal-grid{display:grid;grid-template-columns:repeat(7,1fr);}
  .cal-cell{min-height:100px;background:#e8e8e8;border-right:1px solid #ccc;border-bottom:1px solid #ccc;
    padding:6px 4px;position:relative;display:flex;flex-direction:column;align-items:center;}
  .cal-cell:nth-child(7n){border-right:none;}
  .cal-cell.vacio{background:#e8e8e8;}

  .dn{font-size:14px;font-weight:bold;color:#333;display:block;text-align:center;margin-bottom:2px;}
  .dn.verde{color:#28a745;}

  .btn-plus{display:block;color:#17a2b8;font-size:17px;font-weight:bold;
    cursor:pointer;background:none;border:none;padding:0;line-height:1;text-align:center;}
  .btn-plus:hover{color:#0d7a8a;}

  .evt-lines{margin-top:4px;display:flex;flex-direction:column;gap:3px;align-items:center;width:100%;}
  .evt-line{display:flex;align-items:center;justify-content:center;gap:3px;cursor:pointer;width:100%;}
  .evt-line .igual{color:#e67e22;font-size:15px;line-height:1;}
  .evt-line .etit{font-size:11px;color:#e67e22;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:90px;}
  .evt-line:hover .etit{text-decoration:underline;}
  .evt-mas{font-size:10px;color:#e67e22;text-align:center;}

  /* MODALES */
  .m-bd{position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9999;
    display:flex;align-items:center;justify-content:center;}
  .m-box{background:#fff;border-radius:8px;padding:32px 36px 26px;width:860px;max-width:97vw;
    box-shadow:0 6px 32px rgba(0,0,0,0.22);position:relative;max-height:92vh;overflow-y:auto;}
  .m-box-det{background:#fff;border-radius:8px;padding:30px 36px 26px;width:820px;max-width:97vw;
    box-shadow:0 6px 32px rgba(0,0,0,0.22);position:relative;max-height:92vh;overflow-y:auto;}
  .m-close{position:absolute;top:14px;right:18px;background:none;border:none;
    font-size:24px;cursor:pointer;color:#555;line-height:1;}
  .m-close:hover{color:#000;}
  .m-title{text-align:center;font-size:20px;font-weight:bold;margin-bottom:18px;}

  .tabs{display:flex;margin-bottom:20px;}
  .tab{padding:8px 22px;border:1px solid #dee2e6;background:#fff;cursor:pointer;font-size:13px;color:#212529;}
  .tab:first-child{border-radius:6px 0 0 6px;}
  .tab:last-child{border-radius:0 6px 6px 0;}
  .tab.on{background:#17a2b8;border-color:#17a2b8;color:#fff;font-weight:bold;}
  .tab:not(.on):hover{background:#f0f9fb;}

  .mf-row{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:14px;align-items:flex-end;}
  .mf{display:flex;flex-direction:column;gap:4px;}
  .mf label{font-size:12px;font-weight:bold;color:#444;}
  .mf input,.mf select{padding:7px 10px;border:1px solid #ced4da;border-radius:4px;font-size:13px;color:#212529;background:#fff;}
  .mf input:focus,.mf select:focus{border-color:#80bdff;outline:none;}
  .mf textarea{padding:7px 10px;border:1px solid #ced4da;border-radius:4px;font-size:13px;color:#212529;background:#fff;resize:vertical;min-height:80px;width:100%;}
  .mf.flex1{flex:1;min-width:160px;}
  .ri{display:flex;align-items:center;gap:10px;font-size:13px;margin-top:2px;}
  .ri label{display:flex;align-items:center;gap:3px;cursor:pointer;}

  .btn-gd{background:#17a2b8;border:1px solid #17a2b8;color:#fff;
    padding:9px 22px;cursor:pointer;font-size:14px;font-weight:bold;border-radius:6px;
    display:inline-flex;align-items:center;gap:6px;}
  .btn-gd:hover{background:#138496;}
  .btn-gd.rojo{background:#dc3545;border-color:#dc3545;}
  .btn-gd.rojo:hover{background:#c82333;}
  .btn-gd.gris{background:#6c757d;border-color:#6c757d;}
  .btn-gd.gris:hover{background:#5a6268;}
  .m-footer{display:flex;justify-content:center;gap:10px;margin-top:16px;flex-wrap:wrap;}

  /* tabla día */
  .md-title{text-align:center;font-size:22px;font-weight:bold;margin-bottom:20px;}
  table.tdia{width:100%;border-collapse:collapse;font-size:13px;}
  table.tdia thead tr{background:#17a2b8;}
  table.tdia thead th{padding:12px 10px;text-align:center;color:#fff;font-weight:bold;font-size:13px;}
  table.tdia tbody tr{border-bottom:1px solid #dee2e6;background:#fff;}
  table.tdia tbody tr:hover{background:#ccff66;}
  table.tdia tbody td{padding:12px 10px;vertical-align:middle;color:#212529;}
  /* dot SIEMPRE verde, fuerza sobre hover */
  .dot-ab{color:#28a745 !important;font-size:14px;flex-shrink:0;}
  .dot-ce{color:#dc3545 !important;font-size:14px;flex-shrink:0;}
  .btn-ic{background:none;border:none;cursor:pointer;padding:3px 5px;border-radius:4px;
    display:inline-flex;align-items:center;justify-content:center;}
  .btn-ic:hover{background:#dbeafe;transform:scale(1.12);}
  .btn-ic-ojo{background:#fff;border:2px solid #17a2b8;border-radius:6px;
    padding:5px 7px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;margin-left:4px;}
  .btn-ic-ojo:hover{background:#e0f9fb;transform:scale(1.08);}

  /* detalle tarea */
  .det-titulo{font-size:20px;font-weight:bold;margin-bottom:18px;}
  .det-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px 0;margin-bottom:10px;}
  .det-col{display:flex;flex-direction:column;gap:2px;padding:4px 8px;}
  .det-lbl{font-size:11px;font-weight:bold;color:#666;text-transform:uppercase;margin-bottom:2px;}
  .det-val{font-size:13px;color:#212529;}
  .det-sep{border:none;border-top:1px solid #dee2e6;margin:14px 0;}
  .resp-label{font-size:13px;font-weight:bold;margin-bottom:6px;display:flex;align-items:center;gap:7px;}
  .resp-img-icon{display:inline-flex;align-items:center;justify-content:center;
    width:24px;height:20px;background:#e0f0ff;border:1px solid #17a2b8;border-radius:3px;cursor:pointer;}
  .resp-area{border:1px solid #ced4da;border-radius:4px;width:100%;min-height:110px;
    padding:8px 10px;font-size:13px;resize:vertical;font-family:inherit;}
  .hist-item{background:#f8f9fa;border:1px solid #dee2e6;border-radius:4px;padding:8px 12px;margin-bottom:8px;}
  .hist-meta{font-size:11px;color:#888;margin-bottom:3px;}

  .err-msg{background:#f8d7da;border:1px solid #f5c6cb;color:#721c24;
    padding:7px 14px;border-radius:4px;margin-bottom:10px;font-size:13px;}
`;

const IcoLapiz = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="#3b82f6"/>
    <path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#1d4ed8"/>
  </svg>
);
const IcoOjo = () => (
  <svg width="20" height="14" viewBox="0 0 24 16" fill="none">
    <path d="M12 1C6.5 1 2 8 2 8s4.5 7 10 7 10-7 10-7S17.5 1 12 1z" stroke="#17a2b8" strokeWidth="1.8" fill="none"/>
    <circle cx="12" cy="8" r="3.2" fill="#17a2b8"/>
    <circle cx="12" cy="8" r="1.4" fill="#fff"/>
  </svg>
);

export default function Calendario() {
  const hoy = new Date();
  const [anio, setAnio]       = useState(2026);
  const [mes,  setMes]        = useState(2);
  const [evts, setEvts]       = useState(TAREAS_INI);

  const [mNuevo,   setMNuevo]   = useState(null);
  const [mDia,     setMDia]     = useState(null);
  const [mDetalle, setMDetalle] = useState(null);
  const [mEditar,  setMEditar]  = useState(null);

  const [tab,     setTab]     = useState('evento');
  const [errMsg,  setErrMsg]  = useState('');
  const [respTxt, setRespTxt] = useState('');
  const [errEdit, setErrEdit] = useState('');

  const [fe, setFe] = useState({});
  const [fr, setFr] = useState({});
  const [ft, setFt] = useState({});
  const [fEdit, setFEdit] = useState({});

  const fechaStr = d => `${anio}-${String(mes+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

  const abrirNuevo = (dia) => {
    const f = fechaStr(dia);
    setFe({ titulo:'', fecha:f, hora:'Todo el dia', hasta:'08:00', invitado:'', importancia:'Normal', ubicacion:'', conferencia:'', detalle:'' });
    setFr({ titulo:'', fecha:f, hora:'Todo los dias' });
    setFt({ motivo:'', tipoDE:'Usuario', de:'', deOtro:'', para:'', importancia:'Normal', fecha:f, hora:horaActual(), encuesta:'', detalle:'' });
    setTab('evento'); setErrMsg(''); setMNuevo({ fecha:f });
  };

  const abrirDia = (dia) => {
    const f = fechaStr(dia);
    const items = evts.filter(e => e.fecha === f);
    if (items.length) setMDia({ fecha:f });
  };

  const guardar = () => {
    if (tab==='evento') {
      if (!fe.titulo) { setErrMsg('El Título es obligatorio.'); return; }
      setEvts(p=>[...p,{ id:Date.now(), tipo:'evento', fecha:fe.fecha, titulo:fe.titulo,
        hora:fe.hora, hasta:fe.hasta, invitado:fe.invitado, importancia:fe.importancia,
        ubicacion:fe.ubicacion, conferencia:fe.conferencia, detalle:fe.detalle,
        estado:'Abierto', respuestas:[] }]);
    } else if (tab==='recordatorio') {
      if (!fr.titulo) { setErrMsg('El Título es obligatorio.'); return; }
      setEvts(p=>[...p,{ id:Date.now(), tipo:'recordatorio', fecha:fr.fecha,
        titulo:fr.titulo, hora:fr.hora, estado:'Abierto', respuestas:[] }]);
    } else {
      if (!ft.motivo) { setErrMsg('El Motivo es obligatorio.'); return; }
      const deVal = ft.tipoDE==='Usuario' ? ft.de : ft.deOtro;
      setEvts(p=>[...p,{ id:Date.now(), tipo:'tarea', fecha:ft.fecha, motivo:ft.motivo,
        tipoDE:ft.tipoDE, de:deVal, para:ft.para, importancia:ft.importancia,
        hora:ft.hora, encuesta:ft.encuesta, detalle:ft.detalle,
        estado:'Abierto', respuestas:[] }]);
    }
    setErrMsg(''); setMNuevo(null);
  };

  const abrirDetalle = (ev) => {
    setRespTxt('');
    setMDetalle({ ...evts.find(e=>e.id===ev.id) });
    setMDia(null);
  };

  const guardarRespuesta = () => {
    if (!respTxt.trim()) return;
    const nueva = { txt: respTxt, fecha: new Date().toLocaleString('es-PE') };
    setEvts(p => p.map(e => e.id===mDetalle.id
      ? { ...e, respuestas:[...(e.respuestas||[]), nueva] } : e));
    setMDetalle(prev => ({ ...prev, respuestas:[...(prev.respuestas||[]), nueva] }));
    setRespTxt('');
  };

  const finalizarTarea = () => {
    setEvts(p => p.map(e => e.id===mDetalle.id ? { ...e, estado:'Cerrado' } : e));
    setMDetalle(null);
  };

  const abrirEditar = (ev) => {
    setFEdit({ ...ev });
    setErrEdit('');
    setMEditar(ev.id);
    setMDia(null);
  };

  const guardarEdicion = () => {
    if (fEdit.tipo==='tarea' && !fEdit.motivo) { setErrEdit('El Motivo es obligatorio.'); return; }
    if ((fEdit.tipo==='evento'||fEdit.tipo==='recordatorio') && !fEdit.titulo) { setErrEdit('El Título es obligatorio.'); return; }
    setEvts(p => p.map(e => e.id===mEditar ? { ...fEdit } : e));
    setMEditar(null);
  };

  const prevMes = () => { if(mes===0){setMes(11);setAnio(a=>a-1);}else setMes(m=>m-1); };
  const nextMes = () => { if(mes===11){setMes(0);setAnio(a=>a+1);}else setMes(m=>m+1); };

  const total  = diasEnMes(anio, mes);
  const offset = primerDia(anio, mes);
  const celdas = [];
  for(let i=0;i<offset;i++) celdas.push(null);
  for(let d=1;d<=total;d++) celdas.push(d);
  while(celdas.length%7!==0) celdas.push(null);

  const evtsDia  = d => !d ? [] : evts.filter(e=>e.fecha===fechaStr(d));
  const esHoy    = d => d && anio===hoy.getFullYear() && mes===hoy.getMonth() && d===hoy.getDate();
  const esDom    = i => i%7===6;
  const tituloEv = ev => ev.titulo || ev.motivo || '(sin título)';
  const itemsDia = mDia ? evts.filter(e=>e.fecha===mDia.fecha) : [];

  const DotEstado = ({ estado }) => estado==='Abierto'
    ? <span className="dot-ab" style={{color:'#28a745'}}>⬤</span>
    : <span className="dot-ce" style={{color:'#dc3545'}}>⬤</span>;

  /* ── campos de form editar tarea ── */
  const CamposTarea = ({ f, sf }) => (<>
    <div className="mf-row">
      <div className="mf flex1"><label>Motivo *</label>
        <input value={f.motivo||''} onChange={e=>sf(p=>({...p,motivo:e.target.value}))}/>
      </div>
      <div className="mf"><label>Importancia</label>
        <select value={f.importancia||'Normal'} onChange={e=>sf(p=>({...p,importancia:e.target.value}))} style={{width:110}}>
          {IMPORTANCIA.map(i=><option key={i}>{i}</option>)}
        </select>
      </div>
    </div>
    <div className="mf-row">
      <div className="mf"><label>De</label>
        <div className="ri">
          <label><input type="radio" checked={f.tipoDE==='Usuario'} onChange={()=>sf(p=>({...p,tipoDE:'Usuario'}))}/> Usuario</label>
          <label><input type="radio" checked={f.tipoDE==='Otros'}   onChange={()=>sf(p=>({...p,tipoDE:'Otros'}))}/> Otros</label>
        </div>
        {f.tipoDE==='Usuario'
          ? <select value={f.de||''} onChange={e=>sf(p=>({...p,de:e.target.value}))} style={{width:190}}>
              {USUARIOS.map(u=><option key={u} value={u}>{u}</option>)}
            </select>
          : <input value={f.de||''} onChange={e=>sf(p=>({...p,de:e.target.value}))} style={{width:190}}/>}
      </div>
      <div className="mf"><label>Para</label>
        <select value={f.para||''} onChange={e=>sf(p=>({...p,para:e.target.value}))} style={{width:190}}>
          {USUARIOS.map(u=><option key={u} value={u}>{u}</option>)}
        </select>
      </div>
      <div className="mf"><label>Fecha</label>
        <input type="date" value={f.fecha||''} onChange={e=>sf(p=>({...p,fecha:e.target.value}))} style={{width:145}}/>
      </div>
      <div className="mf"><label>Hora</label>
        <input type="time" value={f.hora||''} onChange={e=>sf(p=>({...p,hora:e.target.value}))} style={{width:110}}/>
      </div>
    </div>
    <div className="mf-row">
      <div className="mf flex1"><label>Encuesta/Calificar</label>
        <select value={f.encuesta||''} onChange={e=>sf(p=>({...p,encuesta:e.target.value}))} style={{width:'100%'}}>
          {ENCUESTAS.map(e=><option key={e} value={e}>{e}</option>)}
        </select>
      </div>
    </div>
    <div className="mf-row">
      <div className="mf" style={{width:'100%'}}><label>Detalle</label>
        <textarea value={f.detalle||''} onChange={e=>sf(p=>({...p,detalle:e.target.value}))}/>
      </div>
    </div>
  </>);

  return (
    <>
      <style>{css}</style>

      {/* ══ CALENDARIO ══ */}
      <div className="cal-wrap">
        <div className="cal-head">
          <button onClick={prevMes}>&lt;</button>
          <span>{anio} {MESES_ES[mes]}</span>
          <button onClick={nextMes}>&gt;</button>
        </div>
        <div className="cal-dns">
          {DIAS_ES.map(d=><div key={d}>{d}</div>)}
        </div>
        <div className="cal-grid">
          {celdas.map((dia, idx) => {
            const evs   = evtsDia(dia);
            const verde = esHoy(dia) || esDom(idx);
            return (
              <div key={idx} className={`cal-cell${!dia?' vacio':''}`}>
                {dia && <>
                  <span className={`dn${verde?' verde':''}`}>{dia}</span>
                  <button className="btn-plus" onClick={()=>abrirNuevo(dia)} title="Agregar Nuevo">+</button>
                  {evs.length > 0 && (
                    <div className="evt-lines">
                      {evs.slice(0,2).map(ev=>(
                        <div key={ev.id} className="evt-line" onClick={()=>abrirDia(dia)}>
                          <span className="igual">≡</span>
                          <span className="etit">{tituloEv(ev)}</span>
                        </div>
                      ))}
                      {evs.length>2 &&
                        <span className="evt-mas" style={{cursor:'pointer'}} onClick={()=>abrirDia(dia)}>
                          +{evs.length-2} más
                        </span>}
                    </div>
                  )}
                </>}
              </div>
            );
          })}
        </div>
      </div>

      {/* ══ MODAL AGREGAR NUEVO ══ */}
      {mNuevo && (
        <div className="m-bd" onClick={()=>setMNuevo(null)}>
          <div className="m-box" onClick={e=>e.stopPropagation()}>
            <button className="m-close" onClick={()=>setMNuevo(null)}>×</button>
            <div className="m-title">Agregar Nuevo</div>
            <div className="tabs">
              {['evento','recordatorio','tarea'].map(t=>(
                <button key={t} className={`tab${tab===t?' on':''}`}
                  onClick={()=>{ setTab(t); setErrMsg(''); }}>
                  {t.charAt(0).toUpperCase()+t.slice(1)}
                </button>
              ))}
            </div>
            {errMsg && <div className="err-msg">⚠️ {errMsg}</div>}

            {tab==='evento' && <>
              <div className="mf-row">
                <div className="mf flex1"><label>Titulo</label>
                  <input placeholder="Añadir un titulo" value={fe.titulo} onChange={e=>setFe(p=>({...p,titulo:e.target.value}))}/>
                </div>
                <div className="mf"><label>Fecha</label>
                  <input type="date" value={fe.fecha} onChange={e=>setFe(p=>({...p,fecha:e.target.value}))} style={{width:145}}/>
                </div>
                <div className="mf"><label>Hora</label>
                  <select value={fe.hora} onChange={e=>setFe(p=>({...p,hora:e.target.value}))} style={{width:120}}>
                    {HORAS_DIA.map(h=><option key={h}>{h}</option>)}
                  </select>
                </div>
                <div className="mf"><label>Hasta</label>
                  <select value={fe.hasta} onChange={e=>setFe(p=>({...p,hasta:e.target.value}))} style={{width:100}}>
                    {HORAS_DIA.filter(h=>h!=='Todo el dia').map(h=><option key={h}>{h}</option>)}
                  </select>
                </div>
              </div>
              <div className="mf-row">
                <div className="mf" style={{minWidth:190}}><label>Invitado</label>
                  <select value={fe.invitado} onChange={e=>setFe(p=>({...p,invitado:e.target.value}))} style={{width:190}}>
                    {USUARIOS.map(u=><option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div className="mf"><label>Importancia</label>
                  <select value={fe.importancia} onChange={e=>setFe(p=>({...p,importancia:e.target.value}))} style={{width:120}}>
                    {IMPORTANCIA.map(i=><option key={i}>{i}</option>)}
                  </select>
                </div>
                <div className="mf flex1"><label>Ubicacion</label>
                  <input placeholder="Añadir Ubicacion" value={fe.ubicacion} onChange={e=>setFe(p=>({...p,ubicacion:e.target.value}))}/>
                </div>
                <div className="mf" style={{minWidth:120}}><label>Conferencia</label>
                  <input placeholder="Conf." value={fe.conferencia} onChange={e=>setFe(p=>({...p,conferencia:e.target.value}))} style={{width:120}}/>
                </div>
              </div>
              <div className="mf-row">
                <div className="mf" style={{width:'100%'}}><label>Detalle</label>
                  <textarea value={fe.detalle} onChange={e=>setFe(p=>({...p,detalle:e.target.value}))}/>
                </div>
              </div>
            </>}

            {tab==='recordatorio' && <>
              <div className="mf-row">
                <div className="mf flex1"><label>Titulo</label>
                  <input placeholder="Añadir un titulo" value={fr.titulo} onChange={e=>setFr(p=>({...p,titulo:e.target.value}))}/>
                </div>
                <div className="mf"><label>Fecha</label>
                  <input type="date" value={fr.fecha} onChange={e=>setFr(p=>({...p,fecha:e.target.value}))} style={{width:145}}/>
                </div>
                <div className="mf"><label>Hora</label>
                  <select value={fr.hora} onChange={e=>setFr(p=>({...p,hora:e.target.value}))} style={{width:150}}>
                    {['Todo los dias','Una vez','Cada semana','Cada mes'].map(h=><option key={h}>{h}</option>)}
                  </select>
                </div>
              </div>
            </>}

            {tab==='tarea' && <CamposTarea f={ft} sf={setFt}/>}

            <div className="m-footer">
              <button className="btn-gd" onClick={guardar}>💾 Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL TABLA DÍA ══ */}
      {mDia && (
        <div className="m-bd" onClick={()=>setMDia(null)}>
          <div className="m-box" onClick={e=>e.stopPropagation()}>
            <button className="m-close" onClick={()=>setMDia(null)}>×</button>
            <div className="md-title">Calendario - {fmtFecha(mDia.fecha)}</div>
            <table className="tdia">
              <thead>
                <tr>
                  <th width="20%">FECHA</th>
                  <th width="19%">DE</th>
                  <th width="16%">PARA</th>
                  <th>MOTIVO</th>
                  <th width="13%">ESTADO</th>
                  <th width="9%"></th>
                </tr>
              </thead>
              <tbody>
                {itemsDia.map(ev=>(
                  <tr key={ev.id}>
                    <td align="center">
                      {fmtFecha(ev.fecha)}{ev.hora&&ev.hora!=='Todo el dia'?` (${ev.hora})`:''}
                    </td>
                    <td>{ev.tipo==='tarea'?`(Usu) ${ev.de||''}`:ev.invitado||'—'}</td>
                    <td align="center">{ev.para||'—'}</td>
                    <td>{ev.motivo||ev.titulo||'—'}</td>
                    <td>
                      <span style={{display:'flex',alignItems:'center',gap:5}}>
                        <DotEstado estado={ev.estado}/>
                        <span style={{color:'#212529'}}>{ev.estado}</span>
                      </span>
                    </td>
                    <td align="center" style={{whiteSpace:'nowrap'}}>
                      <button className="btn-ic" title="Editar" onClick={()=>abrirEditar(ev)}>
                        <IcoLapiz/>
                      </button>
                      <button className="btn-ic-ojo" title="Ver detalle" onClick={()=>abrirDetalle(ev)}>
                        <IcoOjo/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══ MODAL DETALLE ══ */}
      {mDetalle && (
        <div className="m-bd" onClick={()=>setMDetalle(null)}>
          <div className="m-box-det" onClick={e=>e.stopPropagation()}>
            <button className="m-close" onClick={()=>setMDetalle(null)}>×</button>

            <div className="det-titulo">
              {mDetalle.tipo==='tarea'        ? `Tarea Nº ${mDetalle.id}` :
               mDetalle.tipo==='evento'       ? `Evento: ${mDetalle.titulo}` :
                                                `Recordatorio: ${mDetalle.titulo}`}
            </div>

            {mDetalle.tipo==='tarea' && (
              <div className="det-grid">
                <div className="det-col"><span className="det-lbl">De</span><span className="det-val">{mDetalle.de||'—'}</span></div>
                <div className="det-col"><span className="det-lbl">Para</span><span className="det-val">{mDetalle.para||'—'}</span></div>
                <div className="det-col">
                  <span className="det-lbl">Importancia</span>
                  <span className="det-val" style={{display:'flex',alignItems:'center',gap:4}}>
                    <span style={{color:'#28a745'}}>⬤</span> {mDetalle.importancia}
                  </span>
                </div>
                <div className="det-col"><span className="det-lbl">Motivo</span><span className="det-val">{mDetalle.motivo||'—'}</span></div>
                <div className="det-col">
                  <span className="det-lbl">Fecha</span>
                  <span className="det-val">{fmtFecha(mDetalle.fecha)} ({mDetalle.hora})</span>
                </div>
                <div className="det-col"><span className="det-lbl">Estado</span><span className="det-val">{mDetalle.estado}</span></div>
              </div>
            )}
            {mDetalle.tipo==='evento' && (
              <div className="det-grid">
                <div className="det-col"><span className="det-lbl">Invitado</span><span className="det-val">{mDetalle.invitado||'—'}</span></div>
                <div className="det-col"><span className="det-lbl">Importancia</span><span className="det-val">{mDetalle.importancia}</span></div>
                <div className="det-col"><span className="det-lbl">Hora</span><span className="det-val">{mDetalle.hora} – {mDetalle.hasta}</span></div>
                <div className="det-col"><span className="det-lbl">Ubicacion</span><span className="det-val">{mDetalle.ubicacion||'—'}</span></div>
                <div className="det-col"><span className="det-lbl">Fecha</span><span className="det-val">{fmtFecha(mDetalle.fecha)}</span></div>
                <div className="det-col"><span className="det-lbl">Estado</span><span className="det-val">{mDetalle.estado}</span></div>
              </div>
            )}

            {mDetalle.detalle && <>
              <hr className="det-sep"/>
              <div style={{marginBottom:14}}>
                <div className="det-lbl" style={{marginBottom:4}}>Detalle</div>
                <div className="det-val">{mDetalle.detalle}</div>
              </div>
            </>}

            {(mDetalle.respuestas||[]).length > 0 && <>
              <hr className="det-sep"/>
              <div style={{marginBottom:10}}>
                {mDetalle.respuestas.map((r,i)=>(
                  <div key={i} className="hist-item">
                    <div className="hist-meta">{r.fecha}</div>
                    <div>{r.txt}</div>
                  </div>
                ))}
              </div>
            </>}

            <hr className="det-sep"/>

            <div className="resp-label">
              Responder
              <span className="resp-img-icon" title="Adjuntar imagen">
                <svg width="14" height="12" viewBox="0 0 18 15" fill="none">
                  <rect x="1" y="1" width="16" height="13" rx="2" stroke="#17a2b8" strokeWidth="1.5" fill="none"/>
                  <circle cx="5.5" cy="5.5" r="1.5" fill="#17a2b8"/>
                  <path d="M1 11l4-4 3 3 3-4 5 5" stroke="#17a2b8" strokeWidth="1.3" fill="none"/>
                </svg>
              </span>
            </div>
            <textarea className="resp-area" placeholder="Escribe tu respuesta..."
              value={respTxt} onChange={e=>setRespTxt(e.target.value)}/>

            <div className="m-footer">
              <button className="btn-gd" onClick={guardarRespuesta}>✉ Responder</button>
              <button className="btn-gd gris" onClick={()=>setMDetalle(null)}>↩ Regresar</button>
              {mDetalle.tipo==='tarea' && mDetalle.estado==='Abierto' && (
                <button className="btn-gd rojo" onClick={finalizarTarea}>🚫 Finalizar Tarea</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL EDITAR ══ */}
      {mEditar && fEdit && (
        <div className="m-bd" onClick={()=>setMEditar(null)}>
          <div className="m-box" onClick={e=>e.stopPropagation()}>
            <button className="m-close" onClick={()=>setMEditar(null)}>×</button>
            <div className="m-title">
              {fEdit.tipo==='tarea' ? 'Editar Tarea' :
               fEdit.tipo==='evento' ? 'Editar Evento' : 'Editar Recordatorio'}
            </div>
            {errEdit && <div className="err-msg">⚠️ {errEdit}</div>}

            {fEdit.tipo==='tarea' && <CamposTarea f={fEdit} sf={setFEdit}/>}

            {fEdit.tipo==='evento' && <>
              <div className="mf-row">
                <div className="mf flex1"><label>Titulo *</label>
                  <input value={fEdit.titulo||''} onChange={e=>setFEdit(p=>({...p,titulo:e.target.value}))}/>
                </div>
                <div className="mf"><label>Fecha</label>
                  <input type="date" value={fEdit.fecha||''} onChange={e=>setFEdit(p=>({...p,fecha:e.target.value}))} style={{width:145}}/>
                </div>
                <div className="mf"><label>Hora</label>
                  <select value={fEdit.hora||''} onChange={e=>setFEdit(p=>({...p,hora:e.target.value}))} style={{width:120}}>
                    {HORAS_DIA.map(h=><option key={h}>{h}</option>)}
                  </select>
                </div>
                <div className="mf"><label>Hasta</label>
                  <select value={fEdit.hasta||''} onChange={e=>setFEdit(p=>({...p,hasta:e.target.value}))} style={{width:100}}>
                    {HORAS_DIA.filter(h=>h!=='Todo el dia').map(h=><option key={h}>{h}</option>)}
                  </select>
                </div>
              </div>
              <div className="mf-row">
                <div className="mf" style={{minWidth:190}}><label>Invitado</label>
                  <select value={fEdit.invitado||''} onChange={e=>setFEdit(p=>({...p,invitado:e.target.value}))} style={{width:190}}>
                    {USUARIOS.map(u=><option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div className="mf"><label>Importancia</label>
                  <select value={fEdit.importancia||'Normal'} onChange={e=>setFEdit(p=>({...p,importancia:e.target.value}))} style={{width:120}}>
                    {IMPORTANCIA.map(i=><option key={i}>{i}</option>)}
                  </select>
                </div>
                <div className="mf flex1"><label>Ubicacion</label>
                  <input value={fEdit.ubicacion||''} onChange={e=>setFEdit(p=>({...p,ubicacion:e.target.value}))}/>
                </div>
              </div>
              <div className="mf-row">
                <div className="mf" style={{width:'100%'}}><label>Detalle</label>
                  <textarea value={fEdit.detalle||''} onChange={e=>setFEdit(p=>({...p,detalle:e.target.value}))}/>
                </div>
              </div>
            </>}

            {fEdit.tipo==='recordatorio' && <>
              <div className="mf-row">
                <div className="mf flex1"><label>Titulo *</label>
                  <input value={fEdit.titulo||''} onChange={e=>setFEdit(p=>({...p,titulo:e.target.value}))}/>
                </div>
                <div className="mf"><label>Fecha</label>
                  <input type="date" value={fEdit.fecha||''} onChange={e=>setFEdit(p=>({...p,fecha:e.target.value}))} style={{width:145}}/>
                </div>
                <div className="mf"><label>Hora</label>
                  <select value={fEdit.hora||''} onChange={e=>setFEdit(p=>({...p,hora:e.target.value}))} style={{width:150}}>
                    {['Todo los dias','Una vez','Cada semana','Cada mes'].map(h=><option key={h}>{h}</option>)}
                  </select>
                </div>
              </div>
            </>}

            <div className="m-footer">
              <button className="btn-gd" onClick={guardarEdicion}>💾 Guardar</button>
              <button className="btn-gd gris" onClick={()=>setMEditar(null)}>↩ Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}