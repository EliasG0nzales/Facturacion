import Navbar from "../components/navbar";
import Footer from "../components/Footer";

function RegistroFactura() {
  return (
    <>
      <Navbar />
      <div className="content">
        <h2>Registro de Factura Electrónica</h2>
        <p>Aquí va el formulario de emisión de factura.</p>
      </div>
      <Footer />
    </>
  );
}

export default RegistroFactura;