import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar">
      <div className="logo">INTELIGENTE</div>

      <div className="menu">

        <div className="dropdown">
          <button>Abm ▼</button>
          <div className="dropdown-content">
            <Link>Cliente</Link>
            <Link>Proveedor</Link>
            <Link>Articulos</Link>
            <Link>Servicios</Link>
            <Link>Usuarios</Link>
            <Link>Utilitario</Link>
            <Link to="/tipo-cambio">Tipo de Cambio</Link>
            <Link>Sucursal</Link>
            <Link>Sucursal Documentos</Link>
            <Link>CMS - Web Menu</Link>
          </div>
        </div>

        <div className="dropdown">
          <button>Egresos ▼</button>
          <div className="dropdown-content">
            <Link>Orden de Compra</Link>
            <Link>Compra</Link>
            <Link>Cta. x Pagar</Link>
            <Link>Gastos</Link>
          </div>
        </div>

        <div className="dropdown">
          <button>Ingreso ▼</button>
          <div className="dropdown-content">
            <Link>CRM - Tareas</Link>
            <Link>Pedido Web</Link>
            <Link>Cotización</Link>
            <Link to="/factura">Venta</Link>
          </div>
        </div>

        <div className="dropdown">
          <button>Reportes ▼</button>
          <div className="dropdown-content">
            <Link>Caja</Link>
            <Link>Compras</Link>
            <Link>Venta</Link>
            <Link>Kardex</Link>
            <Link>Contable</Link>
          </div>
        </div>

        <div className="alerta">
          Alerta (02)
        </div>

      </div>
    </div>
  );
}

export default Navbar;