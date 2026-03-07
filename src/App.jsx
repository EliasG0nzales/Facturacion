import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// ABM
import Cliente        from './pages/Abm/Cliente';
import Proveedor      from './pages/Abm/Proveedor';
import Articulos      from './pages/Abm/Articulos';
import Servicios      from './pages/Abm/Servicios';
import Usuarios       from './pages/Abm/Usuarios';
import Utilitario     from './pages/Abm/Utilitario';
import TipoCambio     from './pages/Abm/TipodeCambio';
import Sucursal       from './pages/Abm/Sucursal';
import SucursalDoc    from './pages/Abm/SucursalDocumentos';
import CmsMenu        from './pages/Abm/CMS/WebMenu';
import CmsPagina      from './pages/Abm/CMS/WebPagina';
import CmsComentario  from './pages/Abm/CMS/Comentario';
import CmsBanner      from './pages/Abm/CMS/WebBanner';
import CmsVista       from './pages/Abm/CMS/WebVista';

// EGRESOS
import OrdenCompra    from './pages/Egresos/OrdenCompra';
import Compra         from './pages/Egresos/Compra';
import CtaPagar       from './pages/Egresos/CtaPagar';
import CtaPagarLetras from './pages/Egresos/CtaPagarLetras';
import Gastos         from './pages/Egresos/Gastos';

// INGRESOS
import Tareas         from './pages/Ingresos/CRM/Tareas';
import Calendario     from './pages/Ingresos/CRM/Calendario';
import Encuesta       from './pages/Ingresos/CRM/Encuesta';
import PedidoWeb      from './pages/Ingresos/PedidoWeb';
import Cotizacion     from './pages/Ingresos/Cotizacion';
import GuiaRemision   from './pages/Ingresos/GuiadeRemision';
import AlmacenTraslado from './pages/Ingresos/AlmacenTranslado';
import Venta          from './pages/Ingresos/Venta/Venta';
import ConfirmarPago  from './pages/Ingresos/Venta/ConfirmarPago';
import NotaDebito     from './pages/Ingresos/Venta/NotadeDebito';
import NotaCredito    from './pages/Ingresos/Venta/NotadeCredito';
import OtrosIngresos  from './pages/Ingresos/Venta/OtrosIngresos';
import CreditoAcumulado from './pages/Ingresos/Venta/CreditoAcumulado';
import Cxc            from './pages/Ingresos/Cxc/CtaxCobrar';
import CxcLetras      from './pages/Ingresos/Cxc/CxcLetras';
import CxcPendiente   from './pages/Ingresos/Cxc/CxcPendiente';
import CxcTotal       from './pages/Ingresos/Cxc/CxcTotal';
import CxcCobranza    from './pages/Ingresos/Cxc/CxcCobranza';
import CxcContable    from './pages/Ingresos/Cxc/CxcContable';

// REPORTES
import AperturaCaja   from './pages/Reportes/Caja/AperturaCaja';
import MovCaja        from './pages/Reportes/Caja/MovCaja';
import TipoPago       from './pages/Reportes/Caja/TipoPago';
import Caja           from './pages/Reportes/Caja/Caja';
import RepCompraGen   from './pages/Reportes/Compras/General';
import RepCompraDet   from './pages/Reportes/Compras/Detallado';
import RepVentaGen    from './pages/Reportes/Venta/General';
import RepVentaDet    from './pages/Reportes/Venta/Detallado';
import RepVentaGraf   from './pages/Reportes/Venta/Grafico';
import RepVentaEst    from './pages/Reportes/Venta/Estadistica';
import StockGen       from './pages/Reportes/Articulo/StockGeneral';
import StockSucursal  from './pages/Reportes/Articulo/GeneralXSucursal';
import Valorizado     from './pages/Reportes/Articulo/Valorizado';
import CompraVenta    from './pages/Reportes/Articulo/CompraVenta';
import Lotes          from './pages/Reportes/Articulo/Lotes';
import Digemid        from './pages/Reportes/Articulo/Digemid';
import Kardex         from './pages/Reportes/Kardex';
import ContCompra     from './pages/Reportes/Contable/Compra';
import ContVenta      from './pages/Reportes/Contable/Venta';
import Asistencia     from './pages/Reportes/Asistencia';
import MovBancarios   from './pages/Reportes/MovBancarios';

import './App.css';

const Layout = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <div className="main-content">
      <div className="container">
        {children}
      </div>
    </div>
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/"       element={<Navigate to="/login" />} />
          <Route path="/login"  element={<Login />} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />

          {/* ABM */}
          <Route path="/cliente"        element={<Layout><Cliente /></Layout>} />
          <Route path="/proveedor"      element={<Layout><Proveedor /></Layout>} />
          <Route path="/articulos"      element={<Layout><Articulos /></Layout>} />
          <Route path="/servicios"      element={<Layout><Servicios /></Layout>} />
          <Route path="/usuarios"       element={<Layout><Usuarios /></Layout>} />
          <Route path="/utilitario"     element={<Layout><Utilitario /></Layout>} />
          <Route path="/tipo-cambio"    element={<Layout><TipoCambio /></Layout>} />
          <Route path="/sucursal"       element={<Layout><Sucursal /></Layout>} />
          <Route path="/sucursal-doc"   element={<Layout><SucursalDoc /></Layout>} />
          <Route path="/cms-menu"       element={<Layout><CmsMenu /></Layout>} />
          <Route path="/cms-pagina"     element={<Layout><CmsPagina /></Layout>} />
          <Route path="/cms-comentario" element={<Layout><CmsComentario /></Layout>} />
          <Route path="/cms-banner"     element={<Layout><CmsBanner /></Layout>} />
          <Route path="/cms-vista"      element={<Layout><CmsVista /></Layout>} />

          {/* EGRESOS */}
          <Route path="/orden-compra"     element={<Layout><OrdenCompra /></Layout>} />
          <Route path="/compra"           element={<Layout><Compra /></Layout>} />
          <Route path="/cta-pagar"        element={<Layout><CtaPagar /></Layout>} />
          <Route path="/cta-pagar-letras" element={<Layout><CtaPagarLetras /></Layout>} />
          <Route path="/gastos"           element={<Layout><Gastos /></Layout>} />

          {/* INGRESOS */}
          <Route path="/crm-tareas"        element={<Layout><Tareas /></Layout>} />
          <Route path="/crm-calendario"    element={<Layout><Calendario /></Layout>} />
          <Route path="/crm-encuesta"      element={<Layout><Encuesta /></Layout>} />
          <Route path="/pedido-web"        element={<Layout><PedidoWeb /></Layout>} />
          <Route path="/cotizacion"        element={<Layout><Cotizacion /></Layout>} />
          <Route path="/guia-remision"     element={<Layout><GuiaRemision /></Layout>} />
          <Route path="/almacen-traslado"  element={<Layout><AlmacenTraslado /></Layout>} />
          <Route path="/venta"             element={<Layout><Venta /></Layout>} />
          <Route path="/confirmar-pago"    element={<Layout><ConfirmarPago /></Layout>} />
          <Route path="/nota-debito"       element={<Layout><NotaDebito /></Layout>} />
          <Route path="/nota-credito"      element={<Layout><NotaCredito /></Layout>} />
          <Route path="/otros-ingresos"    element={<Layout><OtrosIngresos /></Layout>} />
          <Route path="/credito-acumulado" element={<Layout><CreditoAcumulado /></Layout>} />
          <Route path="/cxc"               element={<Layout><Cxc /></Layout>} />
          <Route path="/cxc-letras"        element={<Layout><CxcLetras /></Layout>} />
          <Route path="/cxc-pendiente"     element={<Layout><CxcPendiente /></Layout>} />
          <Route path="/cxc-total"         element={<Layout><CxcTotal /></Layout>} />
          <Route path="/cxc-cobranza"      element={<Layout><CxcCobranza /></Layout>} />
          <Route path="/cxc-contable"      element={<Layout><CxcContable /></Layout>} />

          {/* REPORTES */}
          <Route path="/apertura-caja"  element={<Layout><AperturaCaja /></Layout>} />
          <Route path="/mov-caja"       element={<Layout><MovCaja /></Layout>} />
          <Route path="/tipo-pago"      element={<Layout><TipoPago /></Layout>} />
          <Route path="/Caja"           element={<Layout><Caja /></Layout>} />
          <Route path="/rep-compra-gen" element={<Layout><RepCompraGen /></Layout>} />
          <Route path="/rep-compra-det" element={<Layout><RepCompraDet /></Layout>} />
          <Route path="/rep-venta-gen"  element={<Layout><RepVentaGen /></Layout>} />
          <Route path="/rep-venta-det"  element={<Layout><RepVentaDet /></Layout>} />
          <Route path="/rep-venta-graf" element={<Layout><RepVentaGraf /></Layout>} />
          <Route path="/rep-venta-est"  element={<Layout><RepVentaEst /></Layout>} />
          <Route path="/stock-gen"      element={<Layout><StockGen /></Layout>} />
          <Route path="/stock-sucursal" element={<Layout><StockSucursal /></Layout>} />
          <Route path="/valorizado"     element={<Layout><Valorizado /></Layout>} />
          <Route path="/compra-venta"   element={<Layout><CompraVenta /></Layout>} />
          <Route path="/lotes"          element={<Layout><Lotes /></Layout>} />
          <Route path="/digemid"        element={<Layout><Digemid /></Layout>} />
          <Route path="/kardex"         element={<Layout><Kardex /></Layout>} />
          <Route path="/cont-compra"    element={<Layout><ContCompra /></Layout>} />
          <Route path="/cont-venta"     element={<Layout><ContVenta /></Layout>} />
          <Route path="/asistencia"     element={<Layout><Asistencia /></Layout>} />
          <Route path="/mov-bancarios"  element={<Layout><MovBancarios /></Layout>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;