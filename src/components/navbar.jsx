import React from 'react';
import { Link } from "react-router-dom";
import "./Navbar.css"; 

function Navbar() {
  return (
    <nav className="navbar">
      {/* Sección Izquierda: Logo */}
      <div className="logo">
        INTELIGENTE
      </div>

      {/* Sección Derecha: Menús y Acciones */}
      <div className="menu-container">
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
            <Link to="/sucursal-documentos">Sucursal Documentos</Link>
            <Link to="/cms">CMS - Web Menu</Link>
          </div>
        </div>

        <div className="dropdown">
          <button className="dropbtn">Egresos ▼</button>
          <div className="dropdown-content">
            <Link to="/orden-compra">Orden de Compra</Link>
            <Link to="/compra">Compra</Link>
            <Link to="/cta-pagar">Cta. x Pagar</Link>
            <Link to="/gastos">Gastos</Link>
          </div>
        </div>

        <div className="dropdown">
          <button className="dropbtn">Ingreso ▼</button>
          <div className="dropdown-content">
            <Link to="/crm">CRM - Tareas</Link>
            <Link to="/pedido-web">Pedido Web</Link>
            <Link to="/cotizacion">Cotización</Link>
            <Link to="/factura">Venta</Link>
          </div>
        </div>

        <div className="dropdown">
          <button className="dropbtn">Reportes ▼</button>
          <div className="dropdown-content">
            <Link to="/reporte-caja">Caja</Link>
            <Link to="/reporte-compras">Compras</Link>
            <Link to="/reporte-venta">Venta</Link>
            <Link to="/reporte-kardex">Kardex</Link>
            <Link to="/reporte-contable">Contable</Link>
          </div>
        </div>

        {/* Botón de Alerta Rojo */}
        <div className="alerta-roja">
          Alerta (02) 🔔
        </div>

        {/* Info de Usuario (Como se ve en la imagen) */}
        <div className="user-info">
          <span>Juan Quiroz Q. ▼</span>
          <button className="logout-btn">⎋</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;