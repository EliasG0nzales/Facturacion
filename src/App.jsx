import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TipoCambio from "./pages/TipoCambio";
import RegistroFactura from "./pages/RegistroFactura";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tipo-cambio" element={<TipoCambio />} />
          <Route path="/factura" element={<RegistroFactura />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;