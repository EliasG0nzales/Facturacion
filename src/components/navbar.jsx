import React from 'react';
import { Link } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  return (
    <nav className="nav-inteligente">
      <div className="wrapper-flush">
        {/* LOGO ADAPTADO */}
        <div className="logo-section">
           <i>INTELI<font style={{ fontFamily: 'Arial-Black' }}><b>GENTE</b></font></i>
      </div>

        {/* CONTENEDOR DE MENÚS */}
        <div className="nav-container-menu">
          
          {/* ABM */}
          <div className="dropdown">
            <button className="dropbtn">Abm ▼</button>
            <div className="dropdown-content">
              <Link to="/cliente">Cliente</Link>
              <Link to="/proveedor">Proveedor</Link>
              <Link to="/articulos">Articulos</Link>
              <Link to="/servicios">Servicios</Link>
              <Link to="/usuarios">Usuarios</Link>
              <Link to="/utilitario">Utilitario</Link>
              <Link to="/tipo-cambio">Tipo de Cambio</Link>
              <Link to="/sucursal">Sucursal</Link>
              <Link to="/sucursal-doc">Sucursal Documentos</Link>
              <div className="submenu">
                <span className="submenu-title">CMS (web) ❯</span>
                <div className="submenu-content">
                  <Link to="/cms-menu">Web: Menu</Link>
                  <Link to="/cms-pagina">Web: Pagina</Link>
                  <Link to="/cms-comentario">Comentario</Link>
                  <Link to="/cms-banner">Web Banner</Link>
                  <Link to="/cms-vista">Web: Vista</Link>
                </div>
              </div>
            </div>
          </div>

          {/* EGRESOS */}
          <div className="dropdown">
            <button className="dropbtn">Egresos ▼</button>
            <div className="dropdown-content">
              <Link to="/orden-compra">Orden de Compra</Link>
              <Link to="/compra">Compra</Link>
              <Link to="/cta-pagar">Cta. x Pagar</Link>
              <Link to="/cta-pagar-letras">Cta. x Pagar - Letras</Link>
              <Link to="/gastos">Gastos</Link>
            </div>
          </div>

          {/* INGRESO */}
          <div className="dropdown">
            <button className="dropbtn">Ingreso ▼</button>
            <div className="dropdown-content">
              <div className="submenu">
                <span className="submenu-title">CRM ❯</span>
                <div className="submenu-content">
                  <Link to="/crm-tareas">Tareas</Link>
                  <Link to="/crm-calendario">Calendario</Link>
                  <Link to="/crm-encuesta">Encuesta</Link>
                </div>
              </div>
              <Link to="/pedido-web">Pedido web</Link>
              <Link to="/cotizacion">Cotización</Link>
              <div className="submenu">
                <span className="submenu-title">Venta ❯</span>
                <div className="submenu-content">
                  <Link to="/venta">Venta</Link>
                  <Link to="/confirmar-pago">Confirmar Pago</Link>
                  <Link to="/nota-debito">Nota de Debito</Link>
                  <Link to="/nota-credito">Nota de crédito</Link>
                  <Link to="/otros-ingresos">Otros Ingresos</Link>
                  <Link to="/credito-acumulado">Credito acumulado</Link>
                </div>
              </div>
              <div className="submenu">
                <span className="submenu-title">Cta. x Cobrar ❯</span>
                <div className="submenu-content">
                  <Link to="/cxc">Cta. x Cobrar</Link>
                  <Link to="/cxc-letras">Letras</Link>
                  <Link to="/cxc-pendiente">Pendiente</Link>
                  <Link to="/cxc-total">Pendiente Total</Link>
                  <Link to="/cxc-cobranza">Cobranza</Link>
                  <Link to="/cxc-contable">Contable</Link>
                </div>
              </div>
              <Link to="/guia-remision">Guia de Remisión</Link>
              <Link to="/almacen-traslado">Almacen: Traslado</Link>
            </div>
          </div>

          {/* REPORTES */}
          <div className="dropdown">
            <button className="dropbtn">Reportes ▼</button>
            <div className="dropdown-content">
              <div className="submenu">
                <span className="submenu-title">Caja ❯</span>
                <div className="submenu-content">
                  <Link to="/apertura-caja">Apertura de Caja</Link>
                  <Link to="/mov-caja">Movimiento de Caja</Link>
                  <Link to="/tipo-pago">Tipo de Pago</Link>
                </div>
              </div>
              <div className="submenu">
                <span className="submenu-title">Compras ❯</span>
                <div className="submenu-content">
                  <Link to="/rep-compra-gen">General</Link>
                  <Link to="/rep-compra-det">Detallado</Link>
                </div>
              </div>
              <div className="submenu">
                <span className="submenu-title">Venta ❯</span>
                <div className="submenu-content">
                  <Link to="/rep-venta-gen">General</Link>
                  <Link to="/rep-venta-det">Detallado</Link>
                  <Link to="/rep-venta-graf">Grafico</Link>
                  <Link to="/rep-venta-est">Estadistica</Link>
                </div>
              </div>
              <div className="submenu">
                <span className="submenu-title">Articulo ❯</span>
                <div className="submenu-content">
                  <Link to="/stock-gen">Stock general</Link>
                  <Link to="/stock-sucursal">General X Sucursal</Link>
                  <Link to="/valorizado">Valorizado</Link>
                  <Link to="/compra-venta">Compra-Venta</Link>
                  <Link to="/lotes">Lotes</Link>
                  <Link to="/digemid">Digemid</Link>
                </div>
              </div>
              <Link to="/kardex">Kardex</Link>
              <div className="submenu">
                <span className="submenu-title">Contable ❯</span>
                <div className="submenu-content">
                  <Link to="/cont-compra">Compra</Link>
                  <Link to="/cont-venta">Venta</Link>
                </div>
              </div>
              <Link to="/asistencia">Asistencia</Link>
              <Link to="/mov-bancarios">Movimiento Bancarios</Link>
            </div>
          </div>

          {/* ALERTA CRÉDITO */}
          <div className="alerta-roja">
            Credito (02)
          </div>

          {/* USUARIO */}
          <div className="user-info">
            <span>Juan Quiroz Q.</span>
            <button className="logout-btn">➡️</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;