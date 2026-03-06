# 🧾 FACTURACIÓN — Sistema de Administración Web

Sistema de gestión empresarial desarrollado en **React + Vite**, que cubre módulos de **ABM, Egresos, Ingresos, Reportes y CMS Web**.

---

## 🛠️ Tecnologías Utilizadas

- **React 18** — Componentes de interfaz
- **Vite** — Bundler y servidor de desarrollo
- **JavaScript JSX** — Lógica y vistas
- **CSS inline / módulos** — Estilos por componente

---

## 🗂️ Estructura del Proyecto

```
FACTURACIÓN/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── FormularioLogin.jsx
│   │   ├── facturas/
│   │   │   └── FormularioConsultaFactura.jsx
│   │   ├── Footer.jsx
│   │   ├── navbar.css
│   │   ├── navbar.jsx
│   │   └── PrivateRoute.jsx
│   └── pages/
│       ├── Abm/
│       │   ├── CMS/
│       │   │   ├── Comentario.jsx
│       │   │   ├── WebBanner.jsx
│       │   │   ├── WebMenu.jsx
│       │   │   ├── WebPagina.jsx
│       │   │   └── WebVisita.jsx
│       │   ├── Articulos.jsx
│       │   ├── Cliente.jsx
│       │   ├── Proveedor.jsx
│       │   ├── Servicios.jsx
│       │   ├── Sucursal.jsx
│       │   ├── SucursalDocumentos.jsx
│       │   ├── TipodeCambio.jsx
│       │   ├── Usuarios.jsx
│       │   └── Utilitario.jsx
│       ├── Egresos/
│       │   ├── Compra.jsx
│       │   ├── CtaPagar.jsx
│       │   ├── CtaPagarLetras.jsx
│       │   ├── Gastos.jsx
│       │   └── OrdenCompra.jsx
│       ├── Ingresos/
│       │   ├── CRM/
│       │   │   ├── Calendario.jsx
│       │   │   ├── Encuesta.jsx
│       │   │   └── Tareas.jsx
│       │   ├── Cxc/
│       │   │   ├── CtaxCobrar.jsx
│       │   │   ├── CxcCobranza.jsx
│       │   │   ├── CxcContable.jsx
│       │   │   ├── CxcLetras.jsx
│       │   │   ├── CxcPendiente.jsx
│       │   │   └── CxcTotal.jsx
│       │   ├── Venta/
│       │   │   ├── ConfirmarPago.jsx
│       │   │   ├── CreditoAcumulado.jsx
│       │   │   ├── NotadeCredito.jsx
│       │   │   ├── NotadeDebito.jsx
│       │   │   ├── OtrosIngresos.jsx
│       │   │   └── Venta.jsx
│       │   ├── AlmacenTraslado.jsx
│       │   ├── Cotizacion.jsx
│       │   ├── GuiaRemision.jsx
│       │   └── PedidoWeb.jsx
│       └── Reportes/
│           ├── Articulo/
│           │   ├── CompraVenta.jsx
│           │   ├── Digemid.jsx
│           │   ├── GeneralXSucursal.jsx
│           │   ├── Lotes.jsx
│           │   ├── StockGeneral.jsx
│           │   └── Valorizado.jsx
│           ├── Caja/
│           │   ├── AperturaCaja.jsx
│           │   ├── MovCaja.jsx
│           │   └── TipoPago.jsx
│           ├── Compras/
│           │   ├── Detallado.jsx
│           │   └── General.jsx
│           ├── Contable/
│           │   ├── Compra.jsx
│           │   └── Venta.jsx
│           ├── Venta/
│           │   ├── Detallado.jsx
│           │   ├── Estadistica.jsx
│           │   ├── General.jsx
│           │   └── Grafico.jsx
│           ├── Asistencia.jsx
│           ├── Dashboard.jsx
│           ├── Kardex.jsx
│           └── MovBancarios.jsx
├── App.jsx
├── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## 📦 Módulos del Sistema

### 🔷 ABM — Altas, Bajas y Modificaciones

Gestión de los maestros principales del sistema.

| Componente | Descripción |
|---|---|
| Cliente.jsx | Gestión de clientes |
| Proveedor.jsx | Registro de proveedores |
| Articulos.jsx | Catálogo de artículos |
| Servicios.jsx | Registro de servicios |
| Sucursal.jsx | Alta de sucursales |
| Usuarios.jsx | Gestión de usuarios |

---

### 🔴 Egresos

| Componente | Descripción |
|---|---|
| OrdenCompra.jsx | Órdenes de compra |
| Compra.jsx | Registro de compras |
| CtaPagar.jsx | Cuentas por pagar |
| Gastos.jsx | Registro de gastos |

---

### 🟢 Ingresos

| Componente | Descripción |
|---|---|
| Venta.jsx | Registro de ventas |
| Cotizacion.jsx | Cotizaciones |
| PedidoWeb.jsx | Pedidos web |
| GuiaRemision.jsx | Guías de remisión |

---

### 📊 Reportes

| Sección | Componentes |
|---|---|
| Artículo | StockGeneral, Valorizado |
| Caja | MovCaja |
| Compras | General |
| Ventas | Detallado, Estadistica |
| Otros | Dashboard |

---

## 🚀 Instalación

```bash
npm install
```

## ▶️ Ejecutar Proyecto

```bash
npm run dev
```

## 📦 Compilar para producción

```bash
npm run build
```

---

© 2009 - 2026 **INTELIGENTE** — Todos los derechos reservados
