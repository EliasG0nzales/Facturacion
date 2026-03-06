import React, { useMemo, useState } from 'react';

const styles = `
  .content {
    background-color: #ffffff;
    padding: 20px;
    color: #212529;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 13px;
  }

  .t7 {
    font-size: 18px;
    font-weight: bold;
    border-bottom: 2px solid #00A3E1;
    padding-bottom: 5px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #333;
    margin-bottom: 20px;
  }

  .icon-help::before { content: "❓"; font-size: 16px; }

  .busqueda {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 12px;
    align-items: end;
    margin-bottom: 12px;
  }

  .busqueda-grupo {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
  }

  .fecha-grupo {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  input[type="text"], input[type="date"], select {
    padding: 6px 8px;
    border: 1px solid #ffffff;
    border-radius: 4px;
    font-size: 13px;
    background-color: #ffffff;
    color: #212529;
    outline: none;
  }

  .botones {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    margin-bottom: 8px;
  }

  .botonNuevo {
    background-color: #17a2b8;
    border: 1px solid #17a2b8;
    color: #ffffff;
    padding: 6px 14px;
    cursor: pointer;
    font-size: 13px;
    font-weight: bold;
    border-radius: 4px;
  }

  .botonVerde {
    background-color: #28a745;
    border: 1px solid #28a745;
    color: #fff;
    padding: 6px 14px;
    cursor: pointer;
    font-size: 13px;
    font-weight: bold;
    border-radius: 4px;
  }

  .tabla-titulo {
    text-align: center;
    font-weight: bold;
    margin: 10px 0 6px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #ffffff;
  }

  .headTitle { background-color: #17a2b8; color: #ffffff; }

  .headTitle td {
    color: #ffffff !important;
    font-weight: bold;
    padding: 10px 8px;
  }

  table tbody tr {
    background-color: #ffffff;
    border-bottom: 1px solid #ffffff;
  }

  table tbody td {
    padding: 8px;
    color: #212529;
  }

  .empty-row td {
    text-align: center;
    color: #888;
    padding: 28px 10px;
  }

  .form-grid{
    display:grid;
    grid-template-columns: repeat(6,1fr);
    gap:10px;
  }

  .form-grid div{
    display:flex;
    flex-direction:column;
  }

  .botones-form{
    margin-top:20px;
    display:flex;
    gap:10px;
  }
`;

const OrdenCompra = () => {

  const [tipoBusqueda, setTipoBusqueda] = useState('ruc');
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [registros] = useState([]);

  const registrosFiltrados = useMemo(() => {
    if (!textoBusqueda && !fechaInicio && !fechaFin) return registros;

    return registros.filter(r => {
      const matchTexto = textoBusqueda ? (() => {
        const t = textoBusqueda.toLowerCase();
        if (tipoBusqueda === 'dni') return `${r.dni ?? ''}`.toLowerCase().includes(t);
        if (tipoBusqueda === 'ruc') return `${r.ruc ?? ''}`.toLowerCase().includes(t);
        return `${r.proveedor ?? ''}`.toLowerCase().includes(t);
      })() : true;

      const matchInicio = fechaInicio ? r.fecha >= fechaInicio : true;
      const matchFin = fechaFin ? r.fecha <= fechaFin : true;

      return matchTexto && matchInicio && matchFin;
    });

  }, [registros, textoBusqueda, tipoBusqueda, fechaInicio, fechaFin]);

  const handleBuscar = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <style>{styles}</style>

      {mostrarNuevo ? (

        <div className="content">

          <h2>ORDEN DE COMPRA : NUEVO</h2>

          <div className="form-grid">

            <div>
              <label>Nro orden</label>
              <input type="text" defaultValue="1"/>
            </div>

            <div>
              <label>Fecha</label>
              <input type="date"/>
            </div>

            <div>
              <label>Fecha Ent</label>
              <input type="date"/>
            </div>

            <div>
              <label>Moneda</label>
              <select>
                <option>Soles</option>
                <option>Dolares</option>
              </select>
            </div>

            <div>
              <label>Cambio</label>
              <input type="text" defaultValue="3.830"/>
            </div>

            <div>
              <label>Garantia</label>
              <input type="text"/>
            </div>

          </div>

          <br/>

          <div>
            <label>Proveedor</label>
            <input type="text"/>
          </div>

          <br/>

          <div>
            <label>Direccion de entrega</label>
            <input type="text"/>
          </div>

          <br/>

          <div>
            <label>Condicion de compra</label>
            <select>
              <option>Contado</option>
              <option>Credito</option>
            </select>
          </div>

          <div className="botones-form">

            <button className="botonNuevo">
              Guardar
            </button>

            <button
              className="botonVerde"
              onClick={()=>setMostrarNuevo(false)}
            >
              Regresar
            </button>

          </div>

        </div>

      ) : (

        <div className="content">

          <div className="t7">
            <span className="icon-help"></span>
            <img src="https://flagcdn.com/w20/pe.png" alt="Peru Flag"/>
            ORDEN DE COMPRA / detallado
          </div>

          <form onSubmit={handleBuscar}>

            <div className="busqueda">

              <div className="busqueda-grupo">

                <b>BUSCAR</b>

                <label>
                  <input
                    type="radio"
                    name="tipo"
                    value="ruc"
                    checked={tipoBusqueda === 'ruc'}
                    onChange={()=>setTipoBusqueda('ruc')}
                  />
                  RUC
                </label>

                <label>
                  <input
                    type="radio"
                    name="tipo"
                    value="razon"
                    checked={tipoBusqueda === 'razon'}
                    onChange={()=>setTipoBusqueda('razon')}
                  />
                  RAZ
                </label>

                <label>
                  <input
                    type="radio"
                    name="tipo"
                    value="dni"
                    checked={tipoBusqueda === 'dni'}
                    onChange={()=>setTipoBusqueda('dni')}
                  />
                  DNI
                </label>

                <input
                  type="text"
                  placeholder="Ingresar el texto a buscar"
                  value={textoBusqueda}
                  onChange={(e)=>setTextoBusqueda(e.target.value)}
                />

              </div>

              <div className="fecha-grupo">
                <b>Fecha inicio</b>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e)=>setFechaInicio(e.target.value)}
                />
              </div>

              <div className="fecha-grupo">
                <b>Fecha fin</b>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e)=>setFechaFin(e.target.value)}
                />
              </div>

            </div>

            <div className="botones">

              <button className="botonNuevo" type="submit">
                Buscar
              </button>

              <button
                className="botonVerde"
                type="button"
                onClick={()=>setMostrarNuevo(true)}
              >
                Agregar Nuevo
              </button>

            </div>

          </form>

          <div className="tabla-titulo">
            LISTADO GENERAL
          </div>

          <table>

            <thead>

              <tr className="headTitle">

                <td width="12%" align="center">
                  FECHA
                </td>

                <td width="15%">
                  NRO DOC
                </td>

                <td width="15%">
                  FECHA ENT.
                </td>

                <td>
                  PROVEEDOR
                </td>

                <td width="12%" align="center">
                  ACCION
                </td>

              </tr>

            </thead>

            <tbody>

              {registrosFiltrados.length === 0 ? (

                <tr className="empty-row">
                  <td colSpan="5">
                    No hay registros para mostrar.
                  </td>
                </tr>

              ) : (

                registrosFiltrados.map((r)=>(
                  <tr key={r.id}>
                    <td align="center">{r.fecha}</td>
                    <td>{r.nro}</td>
                    <td>{r.fechaEntrega}</td>
                    <td>{r.proveedor}</td>
                    <td align="center">{r.accion}</td>
                  </tr>
                ))

              )}

            </tbody>

          </table>

        </div>

      )}

    </>
  );
};

export default OrdenCompra;